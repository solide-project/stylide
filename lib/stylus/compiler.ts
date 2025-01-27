import { execSync } from "child_process";
import stripAnsi from "strip-ansi";
import { cargoFileLower } from "./constants";

export const compile = async (sourcePath: string, toml: string = "", packageName: string = "", contractPath: string = "") => {
    if (toml.startsWith("/")) {
        toml = toml.slice(1);
    }
    if (toml.toLocaleLowerCase().endsWith(`/${cargoFileLower}`)) {
        toml = toml.slice(0, -9);
    }

    // Append this if we want to add Solidity Interface. Not needed for now.
    // && \
    // cargo stylus export-abi
    const compiledModules = execSync(
        `cd ${sourcePath} && \
            cargo stylus check -e https://sepolia-rollup.arbitrum.io/rpc
            `,
        {
            encoding: 'utf-8',
            // stdio: ['pipe', 'pipe', 'ignore'] 
        }
    ).split("\n");

    const data: any = {}
    // const len = compiledModules.length
    compiledModules.forEach((module, index) => {
        // console.log(index, module);
        if (module.startsWith("CONTRACT_SIZE")) {
            data.size = `${module.split(":")[1].trim()} bytes`
        } else if (module.startsWith("WASM_SIZE")) {
            data.wasm = `${module.split(":")[1].trim()} bytes`
        } else if (module.startsWith("DEPLOYMENT_CODE")) {
            data.data = module.split(":")[1].trim()
        } else if (index == 3) {
            data.abi = module
        }
    })

    // console.log(data)
    return data
}