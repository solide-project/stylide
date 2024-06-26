"use client"

import React, { createContext, useContext, useEffect, useState } from "react"


export const StylusProvider = ({ children }: StylusProviderProps) => {
    const [tomlPath, setTomlPath] = useState<string>("")
    const [contractPath, setContractPath] = useState<string>("Contract.sol")

    const [abi, setABI] = useState<string>("")

    const [wasm, setWasm] = useState<Blob>({} as Blob)
    const [deployData, setDeployData] = useState<string>("")

    useEffect(() => {
    }, [])

    return (
        <StylusContext.Provider
            value={{
                tomlPath,
                setTomlPath,
                wasm,
                setWasm,
                deployData,
                setDeployData,
                contractPath,
                setContractPath,
                abi,
                setABI
            }}
        >
            {children}
        </StylusContext.Provider>
    )
}

interface StylusProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export const StylusContext = createContext({
    tomlPath: "",
    setTomlPath: (path: string) => { },
    wasm: {} as Blob,
    setWasm: (wasm: Blob) => { },
    deployData: "",
    setDeployData: (data: string) => { },
    contractPath: "",
    setContractPath: (path: string) => { },
    abi: "",
    setABI: (abi: string) => { },
})

export const useStylus = () => useContext(StylusContext)