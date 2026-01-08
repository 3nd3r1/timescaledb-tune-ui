"use client";

import { useState } from "react";

import type { TunerFormData } from "@/validators/tuner-form";

import { TunerForm } from "@/components/forms/tuner-form";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

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

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">TimescaleDB Tuner</h1>
                <p className="text-lg text-muted-foreground">
                    Optimize your TimescaleDB configuration for better
                    performance
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <TunerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                </div>

                <div>
                    {result ? (
                        <div className="bg-card border rounded-lg p-6 h-fit">
                            <h2 className="text-xl font-semibold mb-4">
                                Configuration Result
                            </h2>
                            <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                                {result}
                            </pre>
                        </div>
                    ) : (
                        <div className="bg-muted border rounded-lg p-6 h-fit flex items-center justify-center text-muted-foreground">
                            <p className="text-center">
                                Configuration will appear here after submitting the form
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
