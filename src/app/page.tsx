"use client";

import Image from "next/image";
import { useState } from "react";

import { type TunerConfig, generateTunerConfig } from "@/lib/tuner";

import { Button } from "@/components/ui/button";

import { TunerForm } from "@/components/forms/tuner-form";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleFormSubmit = async (config: TunerConfig) => {
        setIsLoading(true);
        try {
            const response = await generateTunerConfig(config);

            if (response.success) {
                setResult(response.configuration);
            } else {
                setResult(`Error: ${response.error}`);
            }
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

            {/* Footer */}
            <footer className="container mx-auto px-6 py-8 border-t border-border mt-12">
                <div className="flex flex-col items-center space-y-4 text-sm text-muted-foreground">
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <a
                            href="https://github.com/3nd3r1/timescaledb-tune-ui"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>Source Code</span>
                        </a>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <span>Powered by</span>
                            <a
                                href="https://github.com/timescale/timescaledb-tune"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span>timescaledb-tune</span>
                            </a>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <span>Built for</span>
                            <a
                                href="https://www.timescale.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                TimescaleDB
                            </a>
                        </div>
                    </div>
                    <p className="text-xs opacity-60">
                        Web interface for optimizing TimescaleDB configuration
                        based on system resources
                    </p>
                </div>
            </footer>
        </main>
    );
}
