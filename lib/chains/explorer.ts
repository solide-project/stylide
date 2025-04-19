import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.ARBITRUM_ONE]: "https://arbiscan.io",
    [ChainID.ARBITRUM_GOERLI]: "https://goerli.arbiscan.io",
    [ChainID.ARBITRUM_NOVA]: "https://nova.arbiscan.io",
    [ChainID.ARBITRUM_SEPOLIA]: "https://sepolia.arbiscan.io",
    [ChainID.ARBITRUM_STYLUS_V2]: "https://stylusv2-explorer.arbitrum.io",
    [ChainID.EDUCHAIN]: "https://educhain.blockscout.com",
    [ChainID.OPEN_CAMPUS_CODEX]: "https://edu-chain-testnet.blockscout.com",
    [ChainID.APECHAIN_MAINNET]: "https://apescan.io",
    [ChainID.APECHAIN_CURTIS_TESTNET]: "https://curtis.apescan.io",
    [ChainID.PHAROS_DEVNET]: "https://pharosscan.xyz",
}

export const getExplorer = (network: string): string => data[network] || ""

export const getContractExplorer = (network: string, contract: string): string => {
    const explorer = getExplorer(network)
    let addressPath = ""

    switch (network) {
        default:
            addressPath = `address/${contract}`
            break
    }

    return `${explorer}/${addressPath}`
}

export const getTransactionExplorer = (network: string, tx: string): string => {
    const explorer = getExplorer(network)
    if (!explorer) {
        return ""
    }

    let path = ""

    switch (network) {
        default:
            path = `tx/${tx}`
            break
    }

    return `${explorer}/${path}`
}
