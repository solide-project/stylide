/**
 * Assumes window.ethereum is injected
 */

import { BrowserProvider, ContractFactory, ethers } from "ethers"


interface DeployResult {
    contract: string | undefined | null
    transactionHash: string
}

export const deploy = async (
    deployData: string
): Promise<DeployResult> => {
    if (!window.ethereum) {
        console.error("No ethereum provider found")
        return { contract: null, transactionHash: "" }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const accounts = await window.ethereum
        .request({ method: "eth_requestAccounts" })
    const account = accounts[0];

    if (!deployData.startsWith("0x")) {
        deployData =  `0x${deployData}`
    }
    const deployTx = await signer.sendTransaction({
        from: account,
        data: deployData,
    })
    let deployReceipt = await deployTx?.wait()
    console.log("deployReceipt", deployReceipt)

    if (!(deployReceipt?.contractAddress)) {
        throw new Error("Contract deployment failed")
    }

    console.log("Contract deployed at ", deployTx.hash)

    return {
        contract: deployReceipt?.contractAddress,
        transactionHash: deployTx.hash,
    }
}

/**
 * Check if valid Ethereum address or TRON address
 * @param address
 * @returns
 */
export const isAddress = (address: string): boolean =>
    /^(0x)?[0-9a-f]{40}$/i.test(address) || isTronAddress(address)

export const isTronAddress = (address: string): boolean =>
    address.substring(0, 1) === "T" && address.length === 34
