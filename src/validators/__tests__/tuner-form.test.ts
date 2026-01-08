import { tunerFormSchema } from "../tuner-form";

import { describe, expect, it } from "vitest";

describe("tunerFormSchema", () => {
    it("validates correct input", () => {
        const validData = {
            memory: "8",
            cpus: "4",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(validData);
        }
    });

    it("validates promscale profile", () => {
        const validData = {
            memory: "16",
            cpus: "8",
            profile: "promscale",
        };

        const result = tunerFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it("rejects missing memory", () => {
        const invalidData = {
            cpus: "4",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("Required");
        }
    });

    it("rejects missing cpus", () => {
        const invalidData = {
            memory: "8",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("Required");
        }
    });

    it("rejects zero memory", () => {
        const invalidData = {
            memory: "0",
            cpus: "4",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain(
                "Memory must be a positive number"
            );
        }
    });

    it("rejects zero cpus", () => {
        const invalidData = {
            memory: "8",
            cpus: "0",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain(
                "CPU count must be between 1 and 128"
            );
        }
    });

    it("rejects invalid profile", () => {
        const invalidData = {
            memory: "8",
            cpus: "4",
            profile: "invalid",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain(
                "Invalid enum value"
            );
        }
    });

    it("accepts large memory values", () => {
        const validData = {
            memory: "1000",
            cpus: "4",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it("rejects too many cpus", () => {
        const invalidData = {
            memory: "8",
            cpus: "200",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain(
                "CPU count must be between 1 and 128"
            );
        }
    });

    it("rejects non-numeric memory", () => {
        const invalidData = {
            memory: "abc",
            cpus: "4",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it("rejects non-numeric cpus", () => {
        const invalidData = {
            memory: "8",
            cpus: "abc",
            profile: "default",
        };

        const result = tunerFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});
