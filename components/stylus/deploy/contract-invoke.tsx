import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useStylus } from "@/components/stylus/stylus-provider";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/components/core/providers/logger-provider";
import { Contract, ethers } from "ethers";
import { GenerateABIButton } from "./generate-abi-button";
import { CollapsibleChevron } from "@/components/core/components/collapsible-chevron";
import { ABIEntry, ABIParameter, abiParameterToNative, parse } from "@/lib/stylus/evm";
import { Send } from "lucide-react";

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ className }: ContractInvokeProps) {
    const { abi, setABI, deployData } = useStylus();
    const logger = useLogger();

    const [contract, setContract] = useState<Contract>({} as Contract);
    const [contractAddress, setContractAddress] = useState<string>("");

    const [deploying, setDeploying] = useState<boolean>(false);
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

    const handleDeploy = async () => {
        try {
            setDeploying(true)
            await doDeploy();
        } catch (e: any) {
            logger.error(e.message || "Error deploying contract")
            console.error(e)
        } finally {
            setDeploying(false)
        }
    }

    const doDeploy = async () => {
        if (!window.ethereum) {
            throw new Error("Please install MetaMask to deploy contract");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum
            .request({ method: "eth_requestAccounts" })
        const account = accounts[0];

        if (contractAddress && ethers.isAddress(contractAddress)) {
            const contract = new Contract(contractAddress, abi, signer)
            contract && setContract(contract)
            logger.success(`Contract deployed successfully ${await contract.getAddress()}`)

            return
        }

        // Deploy contract
        logger.info("Deploying contract...")

        // const deployTxHash = await provider2.send('eth_sendTransaction', [{
        //     from: account,
        //     data: deployData,
        // }])
        // const deployTx = await provider2.getTransaction(deployTxHash)
        console.log(deployData)
        const deployTx = await signer.sendTransaction({
            from: account,
            data: `0x${deployData}`,
        })
        let deployReceipt = await deployTx?.wait()
        console.log("deployReceipt", deployReceipt)

        if (!(deployReceipt?.contractAddress)) {
            throw new Error("Contract deployment failed")
        }

        setContractAddress(deployReceipt?.contractAddress || "")
        logger.success(`Contract deployed successfully ${deployReceipt?.contractAddress}`)

        // Generate activate data, giving 0.0001 ETH
        try {
            const arbWasm = "0x0000000000000000000000000000000000000071"
            let arbWasmAbi = ["function activateProgram(address)"];
            let iface = new ethers.Interface(arbWasmAbi);
            const activateData = iface.encodeFunctionData("activateProgram", [deployReceipt?.contractAddress || ""])
            console.log(activateData)

            // Activate contract
            logger.info("Activating Contract...")
            const activateTx = await signer.sendTransaction({
                from: account,
                to: arbWasm,
                data: activateData,
                value: ethers.parseEther("0.0001"),
            })
            let activateReceipt = await activateTx.wait()
            console.log("transactionHash", activateReceipt)

            logger.success(`Contract activated successfully ${activateTx?.blockHash}`)
        } catch (e: any) {
            logger.warn("Contract may already be activated. Skipping activation...")
            console.error(e)
        }
    }

    // Invoke
    const [ret, setRet] = useState<{
        [key: string]: any
    }>({})

    /**
      * Note we are storing constructor arguments in here as method name "constructor"
      */
    const [contractArguments, setContractArguments] = useState<{
        [key: string]: { [key: string]: any }
    }>({})

    const handleArgumentChange = (
        method: string,
        name: string,
        value: string
    ) => {
        const newArgs = { ...contractArguments }

        if (!newArgs.hasOwnProperty(method)) {
            newArgs[method] = {}
        }

        newArgs[method][name] = value
        setContractArguments(newArgs)
    }

    const formatParameters = (entry: ABIEntry, method: string) => {
        if (!entry || !contractArguments.hasOwnProperty(method)) {
            return []
        }

        return entry.inputs.map((input: ABIParameter) => {
            const val: any = abiParameterToNative(
                input,
                contractArguments[method][input.name]
            )
            return val
        })
    }

    const invokeContract = async (method: string) => {
        if (!contract) {
            logger.warn("Contract not deployed")
            return
        }

        const entry: ABIEntry | undefined = processedABI
            .filter((m) => m.type === "function")
            .find((n) => n.name === method)

        if (!entry) {
            logger.warn("ABI for method not found")
            return
        }

        try {
            logger.info(`${method}()`)
            const result = await contract[method](...formatParameters(entry, method))
            formatOutput(entry, result)
        } catch (e: any) {
            logger.error(e.message || "Error invoking contract")
            console.error(e)
        }
    }

    const handleStaticCall = async (method: string) => {
        if (!contract) {
            logger.warn("Contract not deployed")
            return
        }

        const entry: ABIEntry | undefined = processedABI
            .filter((m) => m.type === "function")
            .find((n) => n.name === method)

        if (!entry) {
            logger.warn("ABI for method not found")
            return
        }

        try {
            logger.info(`${method}()`)
            const result = await contract[method].staticCall(...formatParameters(entry, method))
            formatOutput(entry, result)
        } catch (e: any) {
            logger.error(e.message || "Error invoking contract")
            console.error(e)
        }
    }

    const formatOutput = (entry: ABIEntry, result: any) => {
        console.log("formatOutput", entry, result)
        if (entry.outputs && entry.outputs.length > 0) {
            console.log("output is array", typeof result)
            if (typeof result === "object") {
                result = JSON.stringify(result, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            } else if (entry.outputs[0].type.includes("int")) {
                result = result.toString() as BigInt
            } else {
                console.log("output is string", typeof result)
                result = result as string
            }

            logger.info(`⬅️ ${result}`)
            setRet({ ...ret, [entry.name]: result })
        } else {
            logger.success(result)
            setRet({ ...ret, [entry.name]: result })
        }
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
                disabled={!deployData && deploying}
            >
                {deploying ? "Deploying ..." : "Deploy"}
            </Button>
        </div>

        <Input
            className="h-9 rounded-md px-3"
            placeholder="Package Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
        />

        {processedABI
            .filter((m) => m.type === "function")
            .map((abi, index) => {
                return (
                    <div key={index}>
                        <div className="flex space-x-1">
                            <Button
                                size="sm"
                                onClick={() => invokeContract(abi.name)}
                            >
                                {`${abi.name} ( ${abi.inputs && abi.inputs.length > 0 ? "..." : ""
                                    } )`}
                            </Button>
                            <Button
                                className="cursor-pointer border-0 hover:bg-grayscale-100"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleStaticCall(abi.name)}
                            >
                                <Send />
                            </Button>
                        </div>

                        <div>
                            {abi.inputs.map(
                                (input: ABIParameter, abiIndex: number) => {
                                    return (
                                        <div
                                            key={abiIndex}
                                            className="flex items-center space-x-2 py-1"
                                        >
                                            <div>{input.name}</div>
                                            <Input
                                                placeholder={input.type}
                                                onChange={(e) =>
                                                    handleArgumentChange(
                                                        abi.name,
                                                        input.name,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )
                                }
                            )}

                            <div className="py-1 break-words">
                                {ret[abi.name] !== undefined && <div className="max-h-[128px] overflow-y-auto">
                                    {ret[abi.name].toString()}
                                </div>}
                            </div>
                        </div>
                    </div>
                )
            })}
    </div>
}
