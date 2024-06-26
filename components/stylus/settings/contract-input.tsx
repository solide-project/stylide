import { Input } from "@/components/ui/input"
import { useStylus } from "@/components/stylus/stylus-provider";

interface ContractPathInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractPathInput({ className }: ContractPathInputProps) {
    const stylus = useStylus();

    return <Input className={className}
        placeholder="Entry Solidity Contract"
        value={stylus.contractPath}
        onChange={(e) => stylus.setContractPath(e.target.value)} />
}