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
    }
}