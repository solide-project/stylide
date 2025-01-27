import path from "path"
import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import { compile } from "@/lib/stylus/compiler";
import stripAnsi from "strip-ansi";
import toml from "toml";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
    if (!process.env.PROJECT_PATH) {
        return NextResponseError("Server Side Error");
    }

    let tomlPath = request.nextUrl.searchParams.get("toml") || ""
    let contractPath = request.nextUrl.searchParams.get("contract") || ""

    const { input } = await request.json();
    const { sources } = input;

    const projectPath = process.env.PROJECT_PATH;
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
    }

    const id = crypto.randomUUID();
    const mainDir = `${projectPath}/${id}`;
    fs.mkdirSync(mainDir, { recursive: true });

    Object.keys(sources).forEach((sourcePath) => {
        const sourceContent = sources[sourcePath].content;
        const { dir, base } = path.parse(sourcePath);

        const targetDir = path.join(mainDir, dir);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filePath = path.join(targetDir, base);
        fs.writeFileSync(filePath, sourceContent);
    });

    try {
        if (tomlPath.startsWith("/")) {
            tomlPath = tomlPath.slice(1);
        }
        if (!tomlPath.toLocaleLowerCase().endsWith("/cargo.toml")) {
            tomlPath = path.join(tomlPath, "Cargo.toml");
        }

        var data = toml.parse(fs.readFileSync(path.join(mainDir, tomlPath)).toString());
        if (!data.package.name) {
            throw new Error("Package name not found in Cargo.toml");
        }

        const { dir } = path.parse(tomlPath);
        const sourcePath = path.join(mainDir, dir)
        console.log("Compiling", data.package.name, sourcePath, contractPath)
        const output = await compile(sourcePath, tomlPath, data.package.name, contractPath);

        var wasm = fs.readFileSync(path
            .join(sourcePath, `target/wasm32-unknown-unknown/release/${data.package.name.replaceAll('-', '_')}.wasm`))

        fs.rmSync(mainDir, { recursive: true });

        const zip = new JSZip();
        zip.file("results.json", JSON.stringify(output));
        zip.file(`contract.wasm`, new Uint8Array(wasm));

        // Generate the zip file as a Blob (Node.js environment uses Buffers)
        const content: Blob = await zip.generateAsync({ type: 'blob' })
        return new NextResponse(content, {
            headers: {
                "Content-Type": "application/blob",
                "Content-Disposition": `attachment; filename=${data.package.name}.zip`
            }
        });

    } catch (error: any) {
        console.log('error', error)
        let errorMessage: string = stripAnsi(error.stderr || error.stdout || error.message || "Internal error while compiling.");

        fs.rmSync(mainDir, { recursive: true });

        return NextResponseError(errorMessage);
    }
}

const NextResponseError = (...messages: string[]) =>
    NextResponse.json(
        {
            details: messages.map((msg) => ({
                component: "custom",
                errorCode: "0",
                formattedMessage: msg,
                message: "Internal error while compiling.",
                severity: "error",
                sourceLocation: [],
                type: "CustomError",
            })),
        },
        { status: 400 }
    )