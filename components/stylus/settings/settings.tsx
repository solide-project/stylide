import { IDESettings } from "@/components/core/components/ide-settings"
import { Title } from "@/components/core/components/title"
import { TomlPathInput } from "@/components/stylus/settings/toml-path-input"
import { CompilerTypeInput } from "./compiler-type"

interface StylusSettingsProps extends React.HTMLAttributes<HTMLDivElement> { }

export function StylusSettings({ }: StylusSettingsProps) {
    return <IDESettings>
        <div className="flex items-center justify-between">
            <div className="font-semibold">Stylus Toml Path</div>
            <TomlPathInput />
        </div>

        <div className="flex items-center justify-between">
            <div className="font-semibold">Compiler Type</div>
            <CompilerTypeInput />
        </div>
    </IDESettings>
}