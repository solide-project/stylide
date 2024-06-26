"use client"

import * as React from "react"
import { useEffect, useState } from "react"

import { ChainID, getIconByChainId, getNetworkNameFromChainID } from "@/lib/chains"

import { SelectedChain } from "@/components/core/components/selected-chain"
import { EVMSelectedChainWarning } from "@/components/core/components/selected-chain-warning"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)
export const hexToString = (hex: string): string => hexToDecimal(hex).toString()

interface StylusSelectedChainProps extends React.HTMLAttributes<HTMLDivElement> { }

const chains = Object.entries(ChainID)
    .map((value) => value[1]) as string[]

export function StylusSelectedChain({ }: StylusSelectedChainProps) {
    const [isSupported, setIsSupported] = useState<boolean>(false)
    const [chainId, setChainId] = useState<string>("13331371")
    const [hasEthereumInjection, setHasEthereumInjection] =
        useState<boolean>(false)

    const checkSupport = (id: string) => {
        setIsSupported(false)
        if (chains.includes(id)) {
            setIsSupported(true)
        }
    }
    useEffect(() => {
        ; (async () => {
            if (!window || !window.ethereum) {
                return
            }

            setHasEthereumInjection(true)
            const hexId = await window.ethereum.request({ method: "eth_chainId" })
            const chainId = hexToString(hexId)
            checkSupport(chainId)
            setChainId(chainId)

            // console.log("chainId", chainId)
            window.ethereum.on("chainChanged", handleChainChanged)
            function handleChainChanged(hexId: any) {
                const chainId = hexToString(hexId).toString()
                checkSupport(chainId)
                setChainId(chainId)
            }
        })()
    }, [])

    if (!hasEthereumInjection) {
        return <EVMSelectedChainWarning />
    }

    return <>{!isSupported ?
        <EVMSelectedChainWarning message="Unsupported with Stylus" /> :
        <SelectedChain
            name={getNetworkNameFromChainID(chainId)}
            src={getIconByChainId(chainId)}
        />}
    </>
}