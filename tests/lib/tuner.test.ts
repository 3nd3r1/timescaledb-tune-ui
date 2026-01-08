import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    tunerSchema,
    tunerResponseSchema,
    generateTunerConfig,
    gbToMb,
    mbToGb,
} from "@/lib/tuner";

describe("tuner utility functions", () => {
    describe("gbToMb", () => {
        it("converts GB to MB correctly", () => {
            expect(gbToMb(1)).toBe(1024);
            expect(gbToMb(2.5)).toBe(2560);
            expect(gbToMb(0.5)).toBe(512);
        });

        it("rounds to nearest MB", () => {
            expect(gbToMb(1.5)).toBe(1536);
            expect(gbToMb(1.4999)).toBe(1536);
        });
    });

    describe("mbToGb", () => {
        it("converts MB to GB correctly", () => {
            expect(mbToGb(1024)).toBe(1);
            expect(mbToGb(2560)).toBe(2.5);
            expect(mbToGb(512)).toBe(0.5);
        });
    });
});

describe("tunerSchema validation", () => {
    describe("valid configurations", () => {
        it("accepts valid basic config", () => {
            const validConfig = {
                memory: 2048, // 2GB in MB
                cpus: 4,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            const result = tunerSchema.parse(validConfig);
            expect(result).toEqual(validConfig);
        });

        it("accepts config with max connections", () => {
            const validConfig = {
                memory: 4096,
                cpus: 8,
                maxConnections: 200,
                profile: "promscale" as const,
                pgVersion: "16" as const,
            };

            const result = tunerSchema.parse(validConfig);
            expect(result).toEqual(validConfig);
        });

        it("accepts config without max connections", () => {
            const validConfig = {
                memory: 1024,
                cpus: 2,
                profile: "default" as const,
                pgVersion: "14" as const,
            };

            const result = tunerSchema.parse(validConfig);
            expect(result).toEqual(validConfig);
        });
    });

    describe("invalid configurations", () => {
        it("rejects memory below minimum", () => {
            const invalidConfig = {
                memory: 256, // Below 512MB minimum
                cpus: 4,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects memory above maximum", () => {
            const invalidConfig = {
                memory: 1048577, // Above 1TB maximum
                cpus: 4,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects CPU count below minimum", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 0,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects CPU count above maximum", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 129,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects non-integer CPU count", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 4.5,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects max connections below minimum", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 4,
                maxConnections: 0,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects max connections above maximum", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 4,
                maxConnections: 10001,
                profile: "default" as const,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects invalid profile", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 4,
                profile: "invalid" as any,
                pgVersion: "15" as const,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });

        it("rejects invalid PostgreSQL version", () => {
            const invalidConfig = {
                memory: 2048,
                cpus: 4,
                profile: "default" as const,
                pgVersion: "9" as any,
            };

            expect(() => tunerSchema.parse(invalidConfig)).toThrow();
        });
    });
});

describe("tunerResponseSchema validation", () => {
    it("accepts valid success response", () => {
        const successResponse = {
            success: true,
            configuration: "shared_preload_libraries = 'timescaledb'",
            command: "timescaledb-tune --memory 2048MB --cpus 4",
        };

        const result = tunerResponseSchema.parse(successResponse);
        expect(result).toEqual(successResponse);
    });

    it("accepts valid error response", () => {
        const errorResponse = {
            success: false,
            error: "Invalid input data provided",
        };

        const result = tunerResponseSchema.parse(errorResponse);
        expect(result).toEqual(errorResponse);
    });

    it("rejects invalid response structure", () => {
        const invalidResponse = {
            success: true,
            // Missing required fields
        };

        expect(() => tunerResponseSchema.parse(invalidResponse)).toThrow();
    });
});

describe("generateTunerConfig API call", () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
        mockFetch.mockReset();
    });

    it("makes correct API call and returns parsed response", async () => {
        const config = {
            memory: 2048,
            cpus: 4,
            profile: "default" as const,
            pgVersion: "15" as const,
        };

        const mockResponse = {
            success: true,
            configuration: "shared_preload_libraries = 'timescaledb'",
            command: "timescaledb-tune --memory 2048MB --cpus 4",
        };

        mockFetch.mockResolvedValueOnce({
            json: vi.fn().mockResolvedValueOnce(mockResponse),
        });

        const result = await generateTunerConfig(config);

        expect(mockFetch).toHaveBeenCalledWith("/api/tune", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        expect(result).toEqual(mockResponse);
    });

    it("handles and validates error responses", async () => {
        const config = {
            memory: 2048,
            cpus: 4,
            profile: "default" as const,
            pgVersion: "15" as const,
        };

        const mockErrorResponse = {
            success: false,
            error: "timescaledb-tune command not found",
        };

        mockFetch.mockResolvedValueOnce({
            json: vi.fn().mockResolvedValueOnce(mockErrorResponse),
        });

        const result = await generateTunerConfig(config);

        expect(result).toEqual(mockErrorResponse);
    });

    it("throws on invalid response format", async () => {
        const config = {
            memory: 2048,
            cpus: 4,
            profile: "default" as const,
            pgVersion: "15" as const,
        };

        const invalidResponse = {
            success: true,
            // Missing required fields
        };

        mockFetch.mockResolvedValueOnce({
            json: vi.fn().mockResolvedValueOnce(invalidResponse),
        });

        await expect(generateTunerConfig(config)).rejects.toThrow();
    });
});