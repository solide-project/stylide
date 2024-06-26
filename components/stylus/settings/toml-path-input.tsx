import { Input } from "@/components/ui/input"
import { useStylus } from "@/components/stylus/stylus-provider";

interface TomlPathInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function TomlPathInput({ className }: TomlPathInputProps) {
    const stylus = useStylus();

    return <Input className={className}
        placeholder="Entry Toml"
        value={stylus.tomlPath}
        onChange={(e) => stylus.setTomlPath(e.target.value)} />
}