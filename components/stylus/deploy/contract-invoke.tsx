import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useStylus } from "@/components/stylus/stylus-provider";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/components/core/providers/logger-provider";
import { ethers } from "ethers";
import { GenerateABIButton } from "./generate-abi-button";
import { CollapsibleChevron } from "@/components/core/components/collapsible-chevron";
import { ABIEntry, ABIParameter, abiParameterToNative, parse } from "@/lib/stylus/evm";
import { Title } from "@/components/core/components/title";
import { useWeb3Hook } from "./hook-web3";
import { Abi, AbiFunction, AbiParameter, AbiStateMutability, getAddress, isAddress, toFunctionSelector } from "viem";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toNative } from "@/lib/eth/ethers"
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTransactionExplorer } from "@/lib/chains/explorer";

const CONSTRUCTOR_METHOD = "constructor"

// Copy from viem
type AbiConstructor = {
    type: "constructor"
    inputs: readonly AbiParameter[]
    payable?: boolean | undefined
    stateMutability: Extract<AbiStateMutability, "payable" | "nonpayable">
}

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ className }: ContractInvokeProps) {
    const web3Hook = useWeb3Hook();
    const { abi, setABI, deployData } = useStylus();
    const logger = useLogger();

    const [msgValue, setMsgValue] = useState<number>(0)
    const [contractAddress, setContractAddress] = useState<string>("")
    const [ret, setRet] = useState<{
        [key: string]: any
    }>({})

    //#region ABI
    const [processedABI, setProcessedABI] = useState<ABIEntry[]>([])

    useEffect(() => {
        try {
            const parsedABI = parse(abi)
            setProcessedABI(
                parsedABI.map((method: ABIEntry) => {
                    if (method.type === "function" && method.inputs) {
                        method.inputs.forEach(
                            (input: ABIParameter, index: number) => {
                                input.name = input.name === "" ? `input${index}` : input.name
                            }
                        )
                    }
                    return method
                })
            )
        } catch (e: any) {
            // logger.error("Invalid ABI")
            // console.error(e)
        }
    }, [abi])
    //#endregion

    //#region Deploy
    const [isDeploying, setIsDeploying] = useState(false)

    const handleDeploy = async () => {
        try {
            setIsDeploying(true)
            await doDeploy();
        } catch (e: any) {
            logger.error(e.message || "Error deploying contract")
            console.error(e)
        } finally {
            setIsDeploying(false)
        }
    }

    const doDeploy = async () => {
        if (!window.ethereum) {
            throw new Error("Please install MetaMask to deploy contract");
        }

        // Deploy contract
        logger.info("Deploying contract...")

        // This is to determined if we are deploying an existing contract
        const isPreDeployed = !!contractAddress
        const result = await web3Hook.doDeploy({ contractAddress, deployData, abi: processedABI })
        if (result.contract) {
            setContractAddress(result.contract)
            logger.success(`Contract deployed at ${result.contract}`)

            setContractArguments({
                ...contractArguments,
                [result.contract]: {},
            })

            if (isPreDeployed) {
                return
            }

            try {
                logger.info("Activating Contract...")
                const activationHash = await web3Hook.doActivate({ contractAddress: result.contract })
                logger.success(`Contract activated successfully ${activationHash?.blockHash}`)
            } catch (e: any) {
                logger.warn("Contract may already be activated. Skipping activation...")
                console.error(e)
            }
        } else {
            logger.error(`Error deploying contract: ${result.transactionHash}`)
        }
    }
    //#endregion

    //#region Params State
    /**
     * Note we are storing constructor arguments in here as method name "constructor"
     */
    const [contractArguments, setContractArguments] = useState<{
        [contractAddress: string]: {
            [method: string]: { [parameter: string]: any }
        }
    }>({})
    const handleArgumentChange = (
        contractAddress: string,
        method: string,
        name: string,
        value: string
    ) => {
        setContractArguments((prevArgs) => ({
            ...prevArgs,
            [contractAddress]: {
                ...prevArgs[contractAddress],
                [method]: {
                    ...prevArgs[contractAddress]?.[method],
                    [name]: value,
                },
            },
        }))
    }

    const formatParameters = (entry: AbiFunction | AbiConstructor): any[] => {
        if (!entry) return []

        const method =
            entry.type === CONSTRUCTOR_METHOD ? CONSTRUCTOR_METHOD : entry.name
        const selected =
            entry.type === CONSTRUCTOR_METHOD
                ? CONSTRUCTOR_METHOD
                : getAddress(selectedContractAddress)

        const methodArgs = contractArguments[selected]?.[method]
        if (!methodArgs) return []

        return entry.inputs.map((input: AbiParameter, index: number) =>
            toNative(methodArgs[input.name || index.toString()], input)
        )
    }
    //#endregion

    //#region Contract Calls
    const [isInvoking, setIsInvoking] = useState<boolean>(false)

    const initialiseInvocation = (method: string) => {
        if (!selectedAbiParameter) {
            throw new Error("No method selected")
        }

        setIsInvoking(true)
        logger.info(
            <div className="flex items-center gap-2">
                <ArrowRight size={18} /> <div>{method}()</div>
            </div>
        )
    }

    const invokeSend = async (method: string) => {
        try {
            initialiseInvocation(method)

            // This should be the transaction hash
            console.log(msgValue)
            const result = await web3Hook.executeSend(
                selectedContractAddress,
                method,
                formatParameters(selectedAbiParameter!),
                msgValue
            )
            const tx = result.toString()

            // formatOutput(selectedAbiParameter, result)
            const hex = await window.ethereum.request({ method: "eth_chainId" })
            const chainId = parseInt(hex, 16).toString()
            const txExplorer = getTransactionExplorer(chainId, tx)
            if (txExplorer) {
                logger.success(
                    <a className="underline" href={txExplorer} target="_blank">
                        {tx}
                    </a>
                )
            } else {
                logger.success(tx)
            }
        } catch (error: any) {
            logger.error(handleError(error), true)
        } finally {
            setSelectedAbiParameter(null)
            setIsInvoking(false)
        }
    }

    const invokeCall = async (method: string) => {
        try {
            initialiseInvocation(method)

            // This should be the transaction hash
            const result = await web3Hook.executeCall(
                selectedContractAddress,
                method,
                formatParameters(selectedAbiParameter!)
            )

            formatOutput(selectedAbiParameter!, result)
        } catch (error: any) {
            logger.error(handleError(error), true)
        } finally {
            setSelectedAbiParameter(null)
            setIsInvoking(false)
        }
    }

    const formatOutput = (entry: AbiFunction, result: any) => {
        // console.log("formatOutput", entry, result)
        if (entry.outputs && entry.outputs.length > 0) {
            if (typeof result === "object") {
                result = JSON.stringify(result, (_, v) =>
                    typeof v === "bigint" ? v.toString() : v
                )
            } else if (entry.outputs[0].type.includes("int")) {
                result = result.toString() as BigInt
            } else {
                result = result as string
            }

            logger.info(
                <div className="flex items-center gap-2">
                    <ArrowLeft size={18} /> <div>{result}</div>
                </div>
            )
            setRet({ ...ret, [entry.name]: result })
        } else {
            logger.success(result)
            setRet({ ...ret, [entry.name]: result })
        }
    }
    //#endregion

    const handleError = (error: any) => {
        let msg = error && error.toString()
        if (typeof error === "object") {
            msg = error?.message.toString() || "Error deploying contract"
        }

        return `${msg.toString()}`
    }

    const [selectedContractAddress, setSelectedContractAddress] =
        useState<string>("")
    const [selectedAbiParameter, setSelectedAbiParameter] =
        useState<AbiFunction | null>(null)

    const [selectedConstructor, setSelectedConstructor] =
        useState<AbiConstructor | null>(null)

    const handleRemoveContract = (contractAddress: string) => {
        web3Hook.removeContract(contractAddress)
    }
    return <div>
        <CollapsibleChevron>
            {/* <ConnectButton /> */}
            <textarea value={abi} onChange={(e) => setABI(e.target.value)}>

            </textarea>
            <GenerateABIButton />
        </CollapsibleChevron>

        <div className="flex">
            <Button
                size="sm"
                onClick={handleDeploy}
                variant="default"
                disabled={isDeploying}
            >
                Deploy
            </Button>
            <Input
                className="h-9 rounded-md px-3"
                placeholder="Contract Address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
            />
        </div>

        <div className="flex items-center justify-center">
            <div className="py-2 font-semibold text-grayscale-350">Value (wei)</div>
            <Input
                className="h-9 rounded-md px-3"
                placeholder="Value"
                type="number"
                value={msgValue}
                onChange={(e) => setMsgValue(parseInt(e.target.value) || 0)}
            />
        </div>

        <Title text="Deployed Contracts" />
        {Object.entries(web3Hook.contracts).map(([key, val], index) => {
            return (
                <CollapsibleChevron
                    key={index}
                    name={key}
                    onClosed={() => handleRemoveContract(key)}
                >
                    <div className="flex flex-wrap gap-2">
                        {(val.abi as Abi)
                            .filter((abi) => abi.type === "function")
                            .map((abi: AbiFunction, methodsIndex: number) => {
                                return (
                                    <Button
                                        key={methodsIndex}
                                        onClick={() => {
                                            setSelectedContractAddress(key)
                                            setSelectedAbiParameter(abi)
                                        }}
                                        size="sm"
                                    >
                                        {abi.name}
                                    </Button>
                                )
                            })}
                    </div>
                </CollapsibleChevron>
            )
        })}

        <Dialog
            open={!!selectedAbiParameter}
            onOpenChange={() => {
                setSelectedContractAddress("")
                setSelectedAbiParameter(null)
            }}
        >
            <DialogContent className="max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedAbiParameter?.name || "Unknown"} (
                        {selectedAbiParameter && toFunctionSelector(selectedAbiParameter)}
                        )
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {selectedAbiParameter && (
                    <>
                        {selectedAbiParameter.inputs.map(
                            (input: AbiParameter, abiIndex: number) => {
                                return (
                                    <div
                                        key={abiIndex}
                                        className="flex items-center space-x-2 py-1"
                                    >
                                        <div>{input.name}</div>

                                        <Input
                                            value={
                                                contractArguments[selectedContractAddress]?.[
                                                selectedAbiParameter.name
                                                ]?.[input.name || abiIndex.toString()]
                                            }
                                            placeholder={input.type}
                                            onChange={(e) =>
                                                handleArgumentChange(
                                                    selectedContractAddress,
                                                    selectedAbiParameter.name,
                                                    input.name || abiIndex.toString(),
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )
                            }
                        )}

                        <Button
                            onClick={() => {
                                if (selectedAbiParameter.stateMutability === "view") {
                                    invokeCall(selectedAbiParameter.name)
                                    return
                                } else {
                                    invokeSend(selectedAbiParameter.name)
                                }
                            }}
                            disabled={isInvoking}
                        >
                            {isInvoking
                                ? "Invoking..."
                                : selectedAbiParameter.stateMutability === "view"
                                    ? "Call"
                                    : "Send"}
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>

        <Dialog
            open={!!selectedConstructor}
            onOpenChange={() => {
                setSelectedConstructor(null)
            }}
        >
            <DialogContent className="max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Deploy</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {selectedConstructor && (
                    <>
                        {selectedConstructor.inputs.map(
                            (input: AbiParameter, abiIndex: number) => {
                                return (
                                    <div
                                        key={abiIndex}
                                        className="flex items-center space-x-2 py-1"
                                    >
                                        <div>{input.name}</div>

                                        <Input
                                            value={
                                                contractArguments[CONSTRUCTOR_METHOD]?.[
                                                CONSTRUCTOR_METHOD
                                                ]?.[input.name || abiIndex.toString()]
                                            }
                                            placeholder={input.type}
                                            onChange={(e) =>
                                                handleArgumentChange(
                                                    CONSTRUCTOR_METHOD,
                                                    CONSTRUCTOR_METHOD,
                                                    input.name || abiIndex.toString(),
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )
                            }
                        )}

                        <Button onClick={handleDeploy} disabled={isDeploying}>
                            {isDeploying ? "Deploying ..." : "Deploy"}
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </div>
}
