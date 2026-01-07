import { z } from "zod"

export const tunerFormSchema = z.object({
  memory: z
    .string()
    .min(1, "Memory is required")
    .refine((val) => {
      const num = parseInt(val)
      return !isNaN(num) && num > 0
    }, "Memory must be a positive number"),
  
  cpus: z
    .string()
    .min(1, "CPU count is required")
    .refine((val) => {
      const num = parseInt(val)
      return !isNaN(num) && num > 0 && num <= 128
    }, "CPU count must be between 1 and 128"),
  
  profile: z.enum(["default", "promscale"], {
    required_error: "Please select a tuning profile",
  }),
  
  dryRun: z.boolean().default(true),
})

export type TunerFormData = z.infer<typeof tunerFormSchema>