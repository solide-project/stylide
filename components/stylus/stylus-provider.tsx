"use client"

import { CompileError } from "@/lib/stylus"
import React, { createContext, useContext, useEffect, useState } from "react"


export const StylusProvider = ({ children }: StylusProviderProps) => {
    const [tomlPath, setTomlPath] = useState<string>("")
    const [contractPath, setContractPath] = useState<string>("Contract.sol")

    const [abi, setABI] = useState<string>("")
    const [errors, setErrors] = useState<CompileError>({} as CompileError)

    const [wasm, setWasm] = useState<Blob>({} as Blob)
    const [deployData, setDeployData] = useState<string>("")

    useEffect(() => {
    }, [])

    const resetBuild = () => {
        setErrors({} as CompileError)
        setWasm({} as Blob)
        setDeployData("")
    }

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
                setABI,
                errors,
                setErrors,
                resetBuild
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
    errors: {} as CompileError,
    setErrors: (errors: CompileError) => { },
    resetBuild: () => { }
})

export const useStylus = () => useContext(StylusContext)