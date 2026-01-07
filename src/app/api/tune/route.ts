import { NextRequest, NextResponse } from "next/server";

import { execSync } from "child_process";

import { tunerFormSchema } from "@/validators/tuner-form";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the input data
        const validatedData = tunerFormSchema.parse(body);

        // Build the timescaledb-tune command
        const command = [
            "timescaledb-tune",
            "--memory",
            `${validatedData.memory}GB`,
            "--cpus",
            validatedData.cpus,
            "--profile",
            validatedData.profile,
            "--dry-run", // Always use dry-run for preview
            "--quiet", // Reduce verbose output
        ].join(" ");

        // Execute the command
        let output;
        try {
            output = execSync(command, {
                encoding: "utf-8",
                timeout: 10000, // 10 second timeout
            });
        } catch (execError: any) {
            // If timescaledb-tune is not installed, provide a helpful message
            if (
                execError.code === "ENOENT" ||
                execError.message.includes("command not found")
            ) {
                return NextResponse.json({
                    success: true,
                    configuration: `# TimescaleDB Configuration Preview
# Generated for: ${validatedData.memory}GB RAM, ${validatedData.cpus} CPUs, ${validatedData.profile} profile

# Note: timescaledb-tune is not installed on this system.
# To get actual configuration recommendations, install timescaledb-tune:
# 
# Method 1: Download binary from GitHub releases
# https://github.com/timescale/timescaledb-tune/releases
#
# Method 2: Build from source (requires Go)
# go install github.com/timescale/timescaledb-tune/cmd/timescaledb-tune@latest
#
# Sample configuration for your specifications:
# These are general recommendations - use timescaledb-tune for precise values

# Memory settings
shared_buffers = ${Math.floor(parseInt(validatedData.memory) * 0.25)}GB
effective_cache_size = ${Math.floor(parseInt(validatedData.memory) * 0.75)}GB
maintenance_work_mem = ${Math.min(Math.floor((parseInt(validatedData.memory) * 1024) / 16), 2048)}MB
work_mem = ${Math.floor((parseInt(validatedData.memory) * 1024) / (4 * parseInt(validatedData.cpus)))}MB

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB

# Worker processes
max_worker_processes = ${parseInt(validatedData.cpus)}
max_parallel_workers_per_gather = ${Math.min(parseInt(validatedData.cpus), 4)}
max_parallel_workers = ${parseInt(validatedData.cpus)}

# TimescaleDB specific
timescaledb.max_background_workers = ${Math.min(parseInt(validatedData.cpus) * 2, 16)}`,
                    command: command,
                    note: "timescaledb-tune not available - showing estimated configuration",
                });
            }
            throw execError;
        }

        return NextResponse.json({
            success: true,
            configuration: output,
            command: command,
        });
    } catch (error) {
        console.error("Error running timescaledb-tune:", error);

        if (error instanceof Error) {
            // Handle different types of errors
            if (
                error.message.includes("command not found") ||
                error.message.includes("ENOENT")
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "timescaledb-tune command not found. Please ensure it is installed and available in PATH.",
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
