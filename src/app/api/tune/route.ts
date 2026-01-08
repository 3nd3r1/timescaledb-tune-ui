import { NextRequest, NextResponse } from "next/server";

import { execSync } from "child_process";

import { tunerFormSchema } from "@/validators/tuner-form";

export async function POST(request: NextRequest) {
    const body = await request.json();

    // Validate the input data
    const validatedData = tunerFormSchema.parse(body);

    // Build the timescaledb-tune command
    const commandParts = [
        "timescaledb-tune",
        "--memory",
        `${validatedData.memory}GB`,
        "--cpus",
        validatedData.cpus,
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
        commandParts.push("--profile", validatedData.profile);
    }

    const command = commandParts.join(" ");

    // Execute the command
    try {
        const output = execSync(command, {
            encoding: "utf-8",
            timeout: 10000, // 10 second timeout
        });

        return NextResponse.json({
            success: true,
            configuration: output,
            command: command,
        });
    } catch (error) {
        console.error("Error running timescaledb-tune:", error);

        if (error instanceof Error) {
            if (error.message.includes("command not found") ||
                error.message.includes("ENOENT")) {
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
