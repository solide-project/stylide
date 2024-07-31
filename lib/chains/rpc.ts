
import { ChainID } from "./chain-id"

const data: { [key: string]: string } = {
    // [ChainID.ARBITRUM_ONE]: "https://arb1.arbitrum.io/rpc",
    // [ChainID.ARBITRUM_GOERLI]: "https://api-goerli.arbiscan.io",
    // [ChainID.ARBITRUM_NOVA]: "https://nova.arbitrum.io/rpc",
    [ChainID.ARBITRUM_SEPOLIA]: "https://sepolia-rollup.arbitrum.io/rpc",
    [ChainID.ARBITRUM_STYLUS_V2]: "https://stylusv2.arbitrum.io/rpc",

}

export const getRPC = (network: string): string =>
    data[network] || ""
