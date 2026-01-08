import { TunerForm } from "../tuner-form";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

describe("TunerForm", () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it("renders all form fields", () => {
        render(<TunerForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/memory/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cpu cores/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tuning profile/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /generate/i })
        ).toBeInTheDocument();
    });

    it("shows validation errors for invalid input", async () => {
        render(<TunerForm onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole("button", { name: /generate/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/memory is required/i)).toBeInTheDocument();
            expect(
                screen.getByText(/cpu count is required/i)
            ).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("submits form with valid data", async () => {
        render(<TunerForm onSubmit={mockOnSubmit} />);

        const memoryInput = screen.getByLabelText(/memory/i);
        const cpuInput = screen.getByLabelText(/cpu cores/i);
        const submitButton = screen.getByRole("button", { name: /generate/i });

        fireEvent.change(memoryInput, { target: { value: "8" } });
        fireEvent.change(cpuInput, { target: { value: "4" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                {
                    memory: "8",
                    cpus: "4",
                    profile: "default",
                },
                expect.any(Object)
            );
        });
    });

    it("shows loading state when isLoading is true", () => {
        render(<TunerForm onSubmit={mockOnSubmit} isLoading={true} />);

        const submitButton = screen.getByRole("button", {
            name: /generating/i,
        });
        expect(submitButton).toBeDisabled();
    });

    it("accepts valid profile values", async () => {
        render(<TunerForm onSubmit={mockOnSubmit} />);

        const memoryInput = screen.getByLabelText(/memory/i);
        const cpuInput = screen.getByLabelText(/cpu cores/i);
        const submitButton = screen.getByRole("button", { name: /generate/i });

        fireEvent.change(memoryInput, { target: { value: "16" } });
        fireEvent.change(cpuInput, { target: { value: "8" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                {
                    memory: "16",
                    cpus: "8",
                    profile: "default",
                },
                expect.any(Object)
            );
        });
    });
});
