import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Custom render function for components that might need providers
const customRender = (ui: ReactElement, options?: RenderOptions) =>
    render(ui, {
        // Add any providers here if needed in the future
        ...options,
    });

export * from "@testing-library/react";
export { customRender as render };