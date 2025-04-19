"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CompilerType, useStylus } from "../stylus-provider"

interface CompilerTypeSelect {
    key: CompilerType;
    name: string;
}[]

const evmVersionArray: CompilerTypeSelect[] = [
    { key: CompilerType.STYLUS, name: "Stylus" },
    { key: CompilerType.PHAROS_STYLUS, name: "Pharos Stylus" },
]

interface CompilerTypeInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CompilerTypeInput({ }: CompilerTypeInputProps) {
    const stylus = useStylus()

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<CompilerType>(CompilerType.STYLUS)

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger
                className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
                {stylus.compilerType ? stylus.compilerType : "Default"}
                <ChevronsUpDown className="ml-2 size-4" />
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder="Search evm version..." className="h-9" />
                    <CommandEmpty>No version found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList
                            className="max-h-[256px]"
                        >
                            {evmVersionArray.map(({ key, name }: CompilerTypeSelect, index: any) => (
                                <CommandItem
                                    className="hover:cursor-pointer"
                                    key={index}
                                    value={name || ""}
                                    onSelect={(currentValue) => {
                                        stylus.setCompilerType(key)
                                        setValue(key)
                                        setOpen(false)
                                    }}
                                >
                                    {name}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}