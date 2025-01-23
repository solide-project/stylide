"use client"

import * as React from "react"
import { AlertCircle, AlertTriangle } from "lucide-react"

import { useStylus } from "@/components/stylus/stylus-provider"
import { useLogger } from "@/components/core/providers/logger-provider";
import { Button } from "@/components/ui/button";

interface ContractOverviewProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractOverview({ }: ContractOverviewProps) {
    const stylus = useStylus();
    const logger = useLogger();

    const downloadWasm = () => {
        if (!stylus.wasm) return;

        logger.info("Downloading wasm file...");

        console.log(stylus.wasm)
        const url = window.URL.createObjectURL(stylus.wasm);

        var link = document.createElement("a"); // Or maybe get it from the current document
        link.href = url;
        link.download = "contract.wasm";
        link.click();
    }

    return <div className="h-full overflow-y-auto px-4">
        {stylus.wasm && <div className="flex flex-col justify-between lg:flex-row">
            <Button onClick={downloadWasm}>Download Wasm</Button>
        </div>}
    </div>
}