"use client"

import { Button } from "@/components/ui/button"
import { useStylus } from "@/components/stylus/stylus-provider";
import { useFileSystem } from "@/components/core/providers/file-provider";
import { QueryHelper } from "@/lib/core";
import { useLogger } from "@/components/core/providers/logger-provider";
import { useState } from "react";

interface GenerateABIButtonProps extends React.HTMLAttributes<HTMLButtonElement> { }

export function GenerateABIButton({ ...props }: GenerateABIButtonProps) {
    const stylus = useStylus()
    const fs = useFileSystem()
    const logger = useLogger()

    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const handleGenerateABI = async () => {
        try {
            logger.info("Generating ABI...")
            setIsGenerating(true)
            await doGenerateABI()
            logger.info("ABI generated")
        } catch (e: any) {
            logger.error(e.message || "Error generating ABI")
            console.error(e)
        } finally {
            setIsGenerating(false)
        }
    }

    const doGenerateABI = async () => {
        let queryBuilder = new QueryHelper()

        if (stylus.tomlPath) {
            queryBuilder = queryBuilder
                .addParam("toml", stylus.tomlPath)
        }

        const sources = fs.generateSources()
        const source: any = { sources }
        const body = { input: source }

        const response = await fetch(`/api/abi${queryBuilder.build()}`, {
            method: "POST",
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            throw new Error("Failed to compile")
        }

        const data = await response.json()
        console.log(data)
        stylus.setABI(data.output)
    }

    return <Button onClick={handleGenerateABI} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate ABI"}
    </Button>
}