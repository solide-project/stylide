import { useState } from "react"
import { getAddress } from "viem"

import { EVMSmartContract } from "@/lib/eth/evm"
import { DeployedContracts } from "@/lib/eth/interfaces"
import { deploy } from "@/lib/evm/ethers"
import { ethers } from "ethers"

export const useWeb3Hook = () => {
    const [contracts, setContracts] = useState<DeployedContracts>({})

    const executeSend = async (
        contractAddress: string,
        method: string,
        args: any[],
        value: number = 0
    ) => {
        contractAddress = getAddress(contractAddress)
        if (!contracts.hasOwnProperty(contractAddress)) {
            throw new Error("Contract not loaded")
        }

        return contracts[contractAddress].send({
            method,
            args,
            value: value.toString(),
        })
    }

    const executeCall = async (
        contractAddress: string,
        method: string,
        args: any[]
    ) => {
        contractAddress = getAddress(contractAddress)
        if (!contracts.hasOwnProperty(contractAddress)) {
            throw new Error("Contract not loaded")
        }

        return contracts[contractAddress].call({ method, args })
    }

    const removeContract = (contractAddress: string) => {
        contractAddress = getAddress(contractAddress)
        if (contracts.hasOwnProperty(contractAddress)) {
            delete contracts[contractAddress]
            setContracts({ ...contracts })
        }
    }

    const doDeploy = async ({
        contractAddress,
        deployData,
        abi = []
    }: {
        contractAddress?: string
        deployData: string
        abi?: any
    }) => {
        console.log(abi)

        if (contractAddress) {
            contractAddress = getAddress(contractAddress)
            setContracts({
                ...contracts,
                [contractAddress]: new EVMSmartContract(contractAddress, abi),
            })
            return { contract: contractAddress, transactionHash: "" }
        }

        const result = await deploy(deployData)
        contractAddress = result.contract as string
        setContracts({
            ...contracts,
            [getAddress(contractAddress)]: new EVMSmartContract(contractAddress, abi),
        })

        return result
    }

    const doActivate = async ({
        contractAddress
    }: {
        contractAddress: string
    }) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum
            .request({ method: "eth_requestAccounts" })
        const account = accounts[0];

        // Generate activate data, giving 0.0001 ETH
        const arbWasm = "0x0000000000000000000000000000000000000071"
        let arbWasmAbi = ["function activateProgram(address)"];
        let iface = new ethers.Interface(arbWasmAbi);
        const activateData = iface.encodeFunctionData("activateProgram", [contractAddress || ""])
        console.log(activateData)

        // Activate contract
        const activateTx = await signer.sendTransaction({
            from: account,
            to: arbWasm,
            data: activateData,
            value: ethers.parseEther("0.0001"),
        })
        let activateReceipt = await activateTx.wait()
        console.log("transactionHash", activateReceipt)

        return activateReceipt
    }

    return {
        executeCall,
        executeSend,
        doDeploy,
        doActivate,

        contracts,
        removeContract,
    }
}
