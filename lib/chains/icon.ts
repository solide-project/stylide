import { ChainID } from "./chain-id"

export const getIconByChainId = (chainId: string): string =>
    `https://raw.githubusercontent.com/solide-project/icons/master/crypto/${getIcon(chainId)}`

const getIcon = (chainId: string): string => {
    switch (chainId) {
        case ChainID.ARBITRUM_ONE:
        case ChainID.ARBITRUM_GOERLI:
        case ChainID.ARBITRUM_SEPOLIA:
        case ChainID.ARBITRUM_STYLUS_V2:
        default:
            return "arbitrum.svg"
        case ChainID.OPEN_CAMPUS_CODEX:
        case ChainID.EDUCHAIN:
            return "opencampus.svg"
        case ChainID.APECHAIN_MAINNET:
        case ChainID.APECHAIN_CURTIS_TESTNET:
            return "ape.svg"
        case ChainID.PHAROS_DEVNET:
            return "pharos.svg"
    }
}