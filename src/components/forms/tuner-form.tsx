"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type TunerConfig, gbToMb, tunerSchema } from "@/lib/tuner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Form input schema (strings from form inputs)
const formInputSchema = z.object({
    memory: z
        .string()
        .min(1, "Memory is required")
        .regex(/^\d+(\.\d+)?$/, "Memory must be a valid number"),
    cpus: z
        .string()
        .min(1, "CPU count is required")
        .regex(/^\d+$/, "CPU count must be a whole number"),
    maxConnections: z
        .string()
        .optional()
        .refine((val) => {
            if (!val || val.trim() === "") return true; // Optional field
            return /^\d+$/.test(val);
        }, "Max connections must be a whole number"),
    profile: z.enum(["default", "promscale"]),
    pgVersion: z.enum(["11", "12", "13", "14", "15", "16", "17", "18"]),
});

type FormInput = z.infer<typeof formInputSchema>;

interface TunerFormProps {
    onSubmit: (data: TunerConfig) => void;
    isLoading?: boolean;
}

export function TunerForm({ onSubmit, isLoading }: TunerFormProps) {
    const [memoryUnit, setMemoryUnit] = useState<"GB" | "MB">("GB");

    const form = useForm<FormInput>({
        resolver: zodResolver(formInputSchema),
        defaultValues: {
            memory: "",
            cpus: "",
            maxConnections: "",
            profile: "default",
            pgVersion: "15",
        },
        mode: "onChange",
    });

    const handleFormSubmit = (formData: FormInput) => {
        try {
            const memory = parseFloat(formData.memory);
            const memoryInMb = memoryUnit === "GB" ? gbToMb(memory) : memory;

            const config = tunerSchema.parse({
                memory: memoryInMb,
                cpus: parseInt(formData.cpus),
                maxConnections: formData.maxConnections && formData.maxConnections.trim() !== "" 
                    ? parseInt(formData.maxConnections) 
                    : undefined,
                profile: formData.profile,
                pgVersion: formData.pgVersion,
            });

            onSubmit(config);
        } catch (error) {
            // Handle validation errors from tunerSchema
            if (error && typeof error === 'object' && 'issues' in error) {
                const zodError = error as z.ZodError;
                // Set form errors for each validation issue
                zodError.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof FormInput;
                    if (fieldName === 'memory' || fieldName === 'cpus' || fieldName === 'maxConnections') {
                        form.setError(fieldName, {
                            type: 'manual',
                            message: issue.message,
                        });
                    }
                });
            } else {
                // Fallback for unexpected errors
                console.error('Form submission error:', error);
            }
        }
    };

    return (
        <Card className="w-full glass-card rounded-xl">
            <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">
                    System Configuration
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                    Configure your system specifications to generate optimized
                    TimescaleDB settings
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="memory"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>
                                            Memory ({memoryUnit})
                                        </FormLabel>
                                        <div className="flex rounded-md border border-border overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMemoryUnit("GB")
                                                }
                                                className={`px-3 py-1 text-sm font-medium transition-colors ${
                                                    memoryUnit === "GB"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-background text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                GB
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMemoryUnit("MB")
                                                }
                                                className={`px-3 py-1 text-sm font-medium transition-colors ${
                                                    memoryUnit === "MB"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-background text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                MB
                                            </button>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                memoryUnit === "GB"
                                                    ? "e.g., 8"
                                                    : "e.g., 8192"
                                            }
                                            type="number"
                                            min="1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Total system memory in{" "}
                                        {memoryUnit === "GB"
                                            ? "gigabytes"
                                            : "megabytes"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cpus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPU Cores</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 4"
                                            type="number"
                                            min="1"
                                            max="128"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Number of CPU cores available
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maxConnections"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Connections (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 100 (leave empty for auto)"
                                            type="number"
                                            min="1"
                                            max="10000"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Maximum concurrent connections. Leave empty to use TimescaleDB's recommendation
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tuning Profile</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tuning profile" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="default">
                                                Default
                                            </SelectItem>
                                            <SelectItem value="promscale">
                                                Promscale
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose the optimization profile for your
                                        use case
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pgVersion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PostgreSQL Version</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select PostgreSQL version" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="11">
                                                PostgreSQL 11
                                            </SelectItem>
                                            <SelectItem value="12">
                                                PostgreSQL 12
                                            </SelectItem>
                                            <SelectItem value="13">
                                                PostgreSQL 13
                                            </SelectItem>
                                            <SelectItem value="14">
                                                PostgreSQL 14
                                            </SelectItem>
                                            <SelectItem value="15">
                                                PostgreSQL 15
                                            </SelectItem>
                                            <SelectItem value="16">
                                                PostgreSQL 16
                                            </SelectItem>
                                            <SelectItem value="17">
                                                PostgreSQL 17
                                            </SelectItem>
                                            <SelectItem value="18">
                                                PostgreSQL 18
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select your PostgreSQL version for
                                        optimized settings
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold button-hover"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Generating Configuration..."
                                : "Generate Configuration"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
