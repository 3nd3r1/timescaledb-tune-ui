"use client";

import Image from "next/image";
import { useState } from "react";

import type { TunerFormData } from "@/validators/tuner-form";

import { Button } from "@/components/ui/button";

import { TunerForm } from "@/components/forms/tuner-form";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleFormSubmit = async (data: TunerFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/tune", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Failed to generate configuration"
                );
            }

            setResult(result.configuration);
        } catch (error) {
            console.error("Error:", error);
            setResult(
                `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyConfiguration = async () => {
        if (!result) return;

        try {
            await navigator.clipboard.writeText(result);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy configuration:", error);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-8">
                        <Image
                            src="/logo-nobg-dark.svg"
                            alt="TimescaleDB Tuner Logo"
                            width={100}
                            height={100}
                            className="mr-4"
                            priority
                        />
                        <h1 className="text-5xl font-bold tracking-tight">
                            TimescaleDB{" "}
                            <span className="text-primary">Tuner</span>
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Optimize your TimescaleDB configuration for better
                        performance with intelligent tuning recommendations
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    <div>
                        <TunerForm
                            onSubmit={handleFormSubmit}
                            isLoading={isLoading}
                        />
                    </div>

                    <div>
                        {result ? (
                            <div className="glass-card rounded-xl p-6 h-fit">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">
                                        Configuration Result
                                    </h2>
                                    <Button
                                        variant={
                                            isCopied ? "default" : "outline"
                                        }
                                        size="sm"
                                        onClick={handleCopyConfiguration}
                                        className={
                                            isCopied
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 button-hover"
                                                : "button-hover"
                                        }
                                    >
                                        {isCopied
                                            ? "Copied!"
                                            : "Copy Configuration"}
                                    </Button>
                                </div>
                                <pre className="text-sm bg-muted p-6 rounded-lg overflow-auto border font-mono">
                                    {result}
                                </pre>
                            </div>
                        ) : (
                            <div className="glass-card rounded-xl p-12 h-fit flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">
                                        Configuration will appear here
                                    </p>
                                    <p className="text-sm opacity-70 mt-1">
                                        Fill out the form to generate optimized
                                        settings
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
