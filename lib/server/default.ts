import fs from 'fs';
import path from 'path';

export const loadFile = (source: string): string => {
    const wasmDirectory = path.resolve('./public/sample', source);
    return fs.readFileSync(wasmDirectory).toString();
}

export const loadSampleProject = () => {
    const tomlPath = 'Cargo.toml'
    const lockPath = 'Cargo.lock'
    const contractPath1 = 'src/lib.rs'
    const contractPath2 = 'src/main.rs'
    const solidityContractPath = 'Counter.sol'
    const toolchainPath = 'rust-toolchain.toml'

    return {
        sources: {
            [tomlPath]: {
                content: loadFile(tomlPath)
            },
            [contractPath1]: {
                content: loadFile(contractPath1)
            },
            [contractPath2]: {
                content: loadFile(contractPath2)
            },
            [lockPath]: {
                content: loadFile(lockPath)
            },
            ["Contract.sol"]: {
                content: loadFile(solidityContractPath)
            },
            [toolchainPath]: {
                content: loadFile(toolchainPath)
            }
        }
    }
}