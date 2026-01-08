import { NextRequest, NextResponse } from "next/server";

import { execFile } from "child_process";
import { promisify } from "util";

import { tunerSchema } from "@/lib/tuner";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the input data
        const validatedData = tunerSchema.parse(body);

        // Build the timescaledb-tune command arguments (safe array)
        const commandArgs = [
            "--memory",
            `${validatedData.memory}MB`,
            "--cpus",
            validatedData.cpus.toString(),
            "--pg-version",
            validatedData.pgVersion,
            "--conf-path",
            "/dev/null", // Use dummy path since we only want the output
            "--out-path",
            "/tmp/pg.conf", // Output to temporary file
            "--dry-run", // Always use dry-run for preview
            "--yes", // Auto-answer prompts
        ];

        // Only add profile if it's not "default" (which is the default behavior)
        if (validatedData.profile && validatedData.profile !== "default") {
            commandArgs.push("--profile", validatedData.profile);
        }

        // Add max connections if specified
        if (validatedData.maxConnections) {
            commandArgs.push(
                "--max-conns",
                validatedData.maxConnections.toString()
            );
        }

        // Execute the command securely
        const execFileAsync = promisify(execFile);
        const { stdout: output } = await execFileAsync(
            "timescaledb-tune",
            commandArgs,
            {
                encoding: "utf-8",
                timeout: 10000, // 10 second timeout
            }
        );

        return NextResponse.json({
            success: true,
            configuration: output,
            command: `timescaledb-tune ${commandArgs.join(" ")}`,
        });
    } catch (error) {
        console.error("Error:", error);

        // Handle Zod validation errors
        if (error && typeof error === "object" && "issues" in error) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid input data provided",
                },
                { status: 400 }
            );
        }

        // Handle command execution errors
        if (error instanceof Error) {
            if (
                error.message.includes("command not found") ||
                error.message.includes("ENOENT")
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "timescaledb-tune command not found",
                    },
                    { status: 500 }
                );
            }

            if (error.message.includes("timeout")) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Command timed out. Please try again.",
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: `Error running timescaledb-tune: ${error.message}`,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
