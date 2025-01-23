import { ChainID } from "../chains"

interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

const data: { [key: string]: NativeCurrency } = {
  [ChainID.ARBITRUM_ONE]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  [ChainID.ARBITRUM_GOERLI]: {
    name: "Arbitrum Goerli Ether",
    symbol: "AGOR",
    decimals: 18,
  },
  [ChainID.ARBITRUM_NOVA]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  [ChainID.ARBITRUM_SEPOLIA]: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
}

export const getNativeCurrency = (network: string): NativeCurrency =>
  data[network] || ""
