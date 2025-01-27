import { execSync } from "child_process";
import { cargoFileLower } from "./constants";

export const exportAbi = async (sourcePath: string, toml: string = "") => {
    if (toml.startsWith("/")) {
        toml = toml.slice(1);
    }
    if (toml.toLocaleLowerCase().endsWith(`/${cargoFileLower}`)) {
        toml = toml.slice(0, -9);
    }

    const outputs = execSync(
        `cd ${sourcePath} && \
             cargo stylus export-abi --json
            `,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).split("\n");

    // For debugging
    // outputs.forEach((output, index) => {
    //     console.log(index, output);
    // })

    // We can parse the JSON here but for now we will return the raw output
    // return JSON.parse(outputs[3] || "[]");
    return outputs[3] || "[]"
}