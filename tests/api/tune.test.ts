import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/tune/route";
import { NextRequest } from "next/server";

// Mock the entire modules
vi.mock("child_process");
vi.mock("util");

describe("/api/tune", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const createMockRequest = (body: any) => {
        return {
            json: vi.fn().mockResolvedValueOnce(body),
        } as unknown as NextRequest;
    };

    describe("POST", () => {
        it("handles invalid input data", async () => {
            const invalidConfig = {
                memory: "invalid", // Should be number
                cpus: 4,
                profile: "default",
                pgVersion: "15",
            };

            const request = createMockRequest(invalidConfig);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toMatchObject({
                success: false,
                error: "Invalid input data provided",
            });
        });

        it("handles malformed JSON request", async () => {
            const request = {
                json: vi.fn().mockRejectedValueOnce(new SyntaxError("Invalid JSON")),
            } as unknown as NextRequest;

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toMatchObject({
                success: false,
                error: expect.any(String),
            });
        });

        it("validates required fields", async () => {
            const incompleteConfig = {
                memory: 2048,
                // Missing required fields
            };

            const request = createMockRequest(incompleteConfig);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toMatchObject({
                success: false,
                error: "Invalid input data provided",
            });
        });

        it("validates memory range", async () => {
            const invalidMemoryConfig = {
                memory: 256, // Below minimum
                cpus: 4,
                profile: "default",
                pgVersion: "15",
            };

            const request = createMockRequest(invalidMemoryConfig);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toMatchObject({
                success: false,
                error: "Invalid input data provided",
            });
        });

        it("validates CPU range", async () => {
            const invalidCpuConfig = {
                memory: 2048,
                cpus: 0, // Below minimum
                profile: "default",
                pgVersion: "15",
            };

            const request = createMockRequest(invalidCpuConfig);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toMatchObject({
                success: false,
                error: "Invalid input data provided",
            });
        });

        it("validates max connections range", async () => {
            const invalidMaxConnsConfig = {
                memory: 2048,
                cpus: 4,
                maxConnections: 0, // Below minimum
                profile: "default",
                pgVersion: "15",
            };

            const request = createMockRequest(invalidMaxConnsConfig);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toMatchObject({
                success: false,
                error: "Invalid input data provided",
            });
        });
    });
});