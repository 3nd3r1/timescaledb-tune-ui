import { z } from "zod";

// Single source of truth for form validation and types
export const tunerSchema = z.object({
    memory: z.number().min(512, "Memory must be at least 512 MB").max(1048576, "Memory must not exceed 1TB"), // Always in MB
    cpus: z.number().int().min(1, "Must have at least 1 CPU").max(128, "Cannot exceed 128 CPUs"),
    profile: z.enum(["default", "promscale"]),
    pgVersion: z.enum(["11", "12", "13", "14", "15", "16", "17", "18"]),
});

export type TunerConfig = z.infer<typeof tunerSchema>;

// API response schemas
export const tunerSuccessResponseSchema = z.object({
    success: z.literal(true),
    configuration: z.string(),
    command: z.string(),
});

export const tunerErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
});

export const tunerResponseSchema = z.union([tunerSuccessResponseSchema, tunerErrorResponseSchema]);

export type TunerResponse = z.infer<typeof tunerResponseSchema>;
export type TunerSuccessResponse = z.infer<typeof tunerSuccessResponseSchema>;
export type TunerErrorResponse = z.infer<typeof tunerErrorResponseSchema>;

// Helper to convert GB to MB
export const gbToMb = (gb: number): number => Math.round(gb * 1024);

// Helper to convert MB to GB for display
export const mbToGb = (mb: number): number => mb / 1024;

// Service function to call the API
export async function generateTunerConfig(config: TunerConfig): Promise<TunerResponse> {
    const response = await fetch("/api/tune", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
    });

    const data = await response.json();
    return tunerResponseSchema.parse(data);
}