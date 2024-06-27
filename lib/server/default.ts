import fs from 'fs';
import path from 'path';

export const loadFile = (source: string): string => {
    const wasmDirectory = path.resolve('./public/sample', source);
    return fs.readFileSync(wasmDirectory).toString();
}

export const loadSampleProject = () => {
    const tomlPath = 'Cargo.toml'
    const contractPath1 = 'src/lib.rs'
    const contractPath2 = 'src/main.rs'
    const solidityContractPath = 'Counter.sol'

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
            ["Contract.sol"]: {
                content: loadFile(solidityContractPath)
            }
        }
    }
}