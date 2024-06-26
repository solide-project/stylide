import { IDESettings } from "@/components/core/components/ide-settings"
import { Title } from "@/components/core/components/title"
import { TomlPathInput } from "@/components/stylus/settings/toml-path-input"
import { ContractPathInput } from "./contract-input"

interface StylusSettingsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function StylusSettings({ className }: StylusSettingsProps) {
    return <IDESettings>
        <Title text="Test Settings" />

        <TomlPathInput />
        <ContractPathInput />
    </IDESettings>
}