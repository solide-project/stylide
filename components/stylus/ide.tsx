"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ConsoleLogger } from "@/components/core/console"
import { IDE } from "@/components/core/ide"
import { IDEHeader } from "@/components/core/ide-header"
import { useEditor } from "@/components/core/providers/editor-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { useLogger } from "@/components/core/providers/logger-provider"
import {
    CODE_KEY,
    CONSOLE_KEY,
    EDITOR_KEY,
    FILE_KEY,
    useNav,
} from "@/components/core/providers/navbar-provider"
import { BuildDeploy } from "@/components/stylus/deploy/build-deploy"
import { useStylus } from "@/components/stylus/stylus-provider"
import { StylusNavBar } from "@/components/stylus/navbar/navbar"
import { QueryHelper } from "@/lib/core"
import { CompileError, CompileInput, parseInput } from "@/lib/stylus"
import { FileTree } from "@/components/core/file/file-tree"
import JSZip from "jszip"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface StylusIDEProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Entire GitHub URL or an contract address
     */
    url?: string
    /**
     * Chain ID of contract address, should only be used when smart contract is address
     */
    chainId?: string
    title?: string
    content: string
    version?: string
    bytecodeId?: string
}

export function StylusIDE({
    url,
    chainId,
    title,
    content,
    version,
    bytecodeId,
}: StylusIDEProps) {
    const fs = useFileSystem()
    const ide = useEditor()
    const logger = useLogger()
    const stylus = useStylus()

    const { setNavItemActive, isNavItemActive } = useNav()

    React.useEffect(() => {
        ; (async () => {
            setNavItemActive(EDITOR_KEY, true)
            setNavItemActive(FILE_KEY, true)
            setNavItemActive(CONSOLE_KEY, true)

            let input: CompileInput = parseInput(content)

            const entry = Object.keys(input.settings?.compilationTarget || [])
                .filter(i => i.toLocaleLowerCase().includes("cargo.toml"))
                .pop()
            if (entry) {
                stylus.setTomlPath(entry)
            }

            const entryFile = await fs.initAndFoundEntry(input.sources, title || "Cargo.toml")
            if (entryFile) {
                ide.selectFile(entryFile)
            }

            logger.info("Welcome to Stylide IDE")
        })()
    }, [])

    const [compiling, setCompiling] = React.useState<boolean>(false)
    const handleCompile = async () => {
        try {
            const start = performance.now()
            logger.info("Compiling ...")
            setCompiling(true)

            await doCompile()

            const end = performance.now()
            logger.success(`Compiled in ${end - start} ms.`)

            setNavItemActive(CODE_KEY, true)
        } catch (error: any) {
            logger.error(error.message)
        } finally {
            setCompiling(false)
        }
    }

    const doCompile = async () => {
        stylus.resetBuild()
        let queryBuilder = new QueryHelper()

        if (!stylus.contractPath) {
            throw new Error("Please set a Solidity Contract in settings")
        }
        queryBuilder = queryBuilder.addParam("contract", stylus.contractPath)

        if (stylus.tomlPath) {
            queryBuilder = queryBuilder.addParam("toml", stylus.tomlPath)
        }

        const sources = fs.generateSources()
        const source: any = { sources }
        const body = { input: source }

        const response = await fetch(`/api/compile${queryBuilder.build()}`, {
            method: "POST",
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const data = (await response.json()) as CompileError
            stylus.setErrors(data)

            logger.error(`Compiled with ${data.details.length} errors.`, true)
            return
        }


        // Here our compiler returns a zip file with wasm and json file
        const data: Blob = await response.blob()

        // Unzip
        const zip = new JSZip()
        const zipContent = await zip.loadAsync(data)
        zipContent.forEach(async (relativePath, file) => {
            // console.log('Found file:', relativePath);

            if (file.name.endsWith('.wasm')) {
                const wasmContent: ArrayBuffer = await file.async('arraybuffer');
                stylus.setWasm(new Blob([wasmContent], { type: "application/wasm" }))

                // console.log(wasmContent)
            }

            if (file.name.endsWith('.json')) {
                const textContent = await file.async('string');
                const output = JSON.parse(textContent);
                logger.info(`Contract Size: ${output.size}`)
                logger.info(`WASM Size: ${output.wasm}`)
                stylus.setDeployData(output.data)

                // console.log(output)
            }
        });
    }

    return <div className="min-w-screen max-w-screen flex max-h-screen min-h-screen">
        <div className="py-2 pl-2">
            <StylusNavBar url={""} bytecodeId={bytecodeId} />
        </div>
        <ResizablePanelGroup
            direction="horizontal"
            className="min-w-screen max-w-screen max-h-screen min-h-screen"
        >
            <ResizablePanel
                defaultSize={30}
                minSize={25}
                className={cn({
                    hidden: !(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)),
                })}
            >
                <div className="flex max-h-screen w-full flex-col gap-y-2 overflow-y-auto p-2">
                    {isNavItemActive(FILE_KEY) && (
                        <FileTree className="rounded-lg bg-grayscale-025 pb-4" />
                    )}
                    {isNavItemActive(CODE_KEY) && (
                        <BuildDeploy className="rounded-lg bg-grayscale-025" />
                    )}
                    {/* {isNavItemActive(UTILITY_KEY) && (
                            <UtiltyTab className="rounded-lg bg-grayscale-025" />
                        )} */}
                </div>
            </ResizablePanel>
            {(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)) && (
                <ResizableHandle withHandle />
            )}
            <ResizablePanel defaultSize={70} minSize={5}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel
                        defaultSize={75}
                        minSize={5}
                        className={cn("relative", {
                            hidden: !isNavItemActive(EDITOR_KEY),
                        })}
                    >
                        {isNavItemActive(EDITOR_KEY) && (
                            <>
                                <IDEHeader />
                                <IDE />
                                <Button
                                    className="absolute"
                                    style={{ bottom: "16px", right: "16px" }}
                                    size="sm"
                                    onClick={handleCompile}
                                    disabled={compiling}
                                >
                                    {compiling ? "Compiling ..." : "Compile"}
                                </Button>
                            </>
                        )}
                    </ResizablePanel>
                    {isNavItemActive(EDITOR_KEY) && isNavItemActive(CONSOLE_KEY) && (
                        <ResizableHandle withHandle />
                    )}
                    <ResizablePanel
                        defaultSize={25}
                        minSize={5}
                        className={cn(
                            "m-2 !overflow-y-auto rounded-lg bg-grayscale-025",
                            { hidden: !isNavItemActive(CONSOLE_KEY) }
                        )}
                    >
                        <ConsoleLogger className="p-3" />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
}