import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    [ChainID.ARBITRUM_ONE]: "Arbitrum One",
    [ChainID.ARBITRUM_GOERLI]: "Arbitrum Goerli",
    [ChainID.ARBITRUM_NOVA]: "Arbitrum Nova",
    [ChainID.ARBITRUM_SEPOLIA]: "Arbitrum Seoplia",
    [ChainID.ARBITRUM_STYLUS_V2]: "Stylus V2 Testnet",

}

export const getNetworkNameFromChainID = (network: string): string =>
    data[network] || ""