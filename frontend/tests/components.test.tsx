import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Button,
  EmptyState,
  Input,
  KrishimaLogo,
  StatusBadge,
  ThemeProvider,
} from "@krishima/ui";

function withTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("KrishimaLogo", () => {
  it("exposes an accessible name by default", () => {
    render(<KrishimaLogo />);
    expect(screen.getByLabelText("KRISHIMA")).toBeInTheDocument();
  });

  it("can be marked decorative", () => {
    const { container } = render(<KrishimaLogo decorative />);
    expect(container.querySelector("[aria-label='KRISHIMA']")).toBeNull();
  });

  it("renders both wordmark parts", () => {
    const { container } = render(<KrishimaLogo />);
    expect(container.querySelector("[data-logo='krishi']")?.textContent).toBe("KRISHI");
    expect(container.querySelector("[data-logo='ma']")?.textContent).toBe("MA");
  });
});

describe("Button", () => {
  it("is disabled and busy while loading", () => {
    withTheme(<Button loading>Save</Button>);
    const btn = screen.getByRole("button", { name: /save/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});

describe("Input", () => {
  it("associates the label", () => {
    withTheme(<Input label="Full name" />);
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  });

  it("announces errors via role=alert and aria-invalid", () => {
    withTheme(<Input label="Price" error="Enter a price." />);
    const input = screen.getByLabelText("Price");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a price.");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });
});

describe("StatusBadge", () => {
  it("always renders text alongside colour", () => {
    render(<StatusBadge status="connected" />);
    expect(screen.getByText("Connected")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("shows a title and action", () => {
    render(
      <EmptyState
        title="No listings yet"
        action={<button type="button">Add listing</button>}
      />,
    );
    expect(screen.getByText("No listings yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add listing" })).toBeInTheDocument();
  });
});
