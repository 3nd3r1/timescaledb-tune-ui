import { render } from "../utils/test-utils";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TunerForm } from "@/components/forms/tuner-form";

describe("TunerForm", () => {
    const mockOnSubmit = vi.fn();
    const defaultProps = {
        onSubmit: mockOnSubmit,
        isLoading: false,
    };

    beforeEach(() => {
        mockOnSubmit.mockReset();
    });

    it("renders all form fields", () => {
        render(<TunerForm {...defaultProps} />);

        expect(screen.getByLabelText(/memory/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cpu cores/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/max connections/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tuning profile/i)).toBeInTheDocument();
        expect(
            screen.getByLabelText(/postgresql version/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /generate configuration/i })
        ).toBeInTheDocument();
    });

    it("shows memory unit toggle buttons", () => {
        render(<TunerForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "GB" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "MB" })).toBeInTheDocument();
    });

    it("submits form with valid data in GB", async () => {
        const user = userEvent.setup();
        render(<TunerForm {...defaultProps} />);

        await user.type(screen.getByLabelText(/memory/i), "4");
        await user.type(screen.getByLabelText(/cpu cores/i), "8");
        await user.type(screen.getByLabelText(/max connections/i), "200");

        await user.click(
            screen.getByRole("button", { name: /generate configuration/i })
        );

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                memory: 4096, // 4GB converted to MB
                cpus: 8,
                maxConnections: 200,
                profile: "default",
                pgVersion: "15",
            });
        });
    });

    it("submits form with valid data in MB", async () => {
        const user = userEvent.setup();
        render(<TunerForm {...defaultProps} />);

        // Switch to MB
        await user.click(screen.getByRole("button", { name: "MB" }));

        await user.type(screen.getByLabelText(/memory/i), "2048");
        await user.type(screen.getByLabelText(/cpu cores/i), "4");

        await user.click(
            screen.getByRole("button", { name: /generate configuration/i })
        );

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                memory: 2048, // Already in MB
                cpus: 4,
                maxConnections: undefined, // Not specified
                profile: "default",
                pgVersion: "15",
            });
        });
    });

    it("submits form without max connections when empty", async () => {
        const user = userEvent.setup();
        render(<TunerForm {...defaultProps} />);

        await user.type(screen.getByLabelText(/memory/i), "2");
        await user.type(screen.getByLabelText(/cpu cores/i), "4");
        // Leave max connections empty

        await user.click(
            screen.getByRole("button", { name: /generate configuration/i })
        );

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                memory: 2048,
                cpus: 4,
                maxConnections: undefined,
                profile: "default",
                pgVersion: "15",
            });
        });
    });

    it("shows loading state when isLoading is true", () => {
        render(<TunerForm {...defaultProps} isLoading={true} />);

        const submitButton = screen.getByRole("button", {
            name: /generating configuration/i,
        });
        expect(submitButton).toBeDisabled();
    });

    it("accepts valid input without errors", async () => {
        const user = userEvent.setup();
        render(<TunerForm {...defaultProps} />);

        await user.type(screen.getByLabelText(/memory/i), "4");
        await user.type(screen.getByLabelText(/cpu cores/i), "8");
        await user.type(screen.getByLabelText(/max connections/i), "100");

        await user.click(
            screen.getByRole("button", { name: /generate configuration/i })
        );

        // Should submit successfully
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
});
