import { z } from "zod";

export const tunerFormSchema = z.object({
    memory: z
        .string()
        .min(1, "Memory is required")
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num > 0;
        }, "Memory must be a positive number"),

    cpus: z
        .string()
        .min(1, "CPU count is required")
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num > 0 && num <= 128;
        }, "CPU count must be between 1 and 128"),

    profile: z.enum(["default", "promscale"], {
        required_error: "Please select a tuning profile",
    }),

    pgVersion: z.enum(["11", "12", "13", "14", "15", "16", "17", "18"], {
        required_error: "Please select a PostgreSQL version",
    }),
});

export type TunerFormData = z.infer<typeof tunerFormSchema>;
