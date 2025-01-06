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
            cargo stylus check -e https://sepolia-rollup.arbitrum.io/rpc --no-verify && \
            koba generate --wasm target/wasm32-unknown-unknown/release/${packageName.replaceAll('-', '_')}.wasm --sol ${contractPath}
            `,
        {
            encoding: 'utf-8',
            // stdio: ['pipe', 'pipe', 'ignore'] 
        }
    ).split("\n");

    // For debugging
    // compiledModules.forEach((module, index) => {
    //     console.log(index, module);
    // })

    return {
        size: stripAnsi(compiledModules[0].split(":")[1]).trim(),
        wasm: stripAnsi(compiledModules[1].split(":")[1]).trim(),
        gas: stripAnsi(compiledModules[3].split(":")[1]).trim(),
        data: compiledModules[compiledModules.length - 2]
    };
}