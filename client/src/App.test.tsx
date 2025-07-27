import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the initial counter state", () => {
    render(<App />);

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrement" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Increment" })
    ).toBeInTheDocument();
  });

  it("increments the counter when increment button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });

    await user.click(incrementButton);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();

    await user.click(incrementButton);
    expect(screen.getByText("Count: 2")).toBeInTheDocument();
  });

  it("decrements the counter when decrement button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const decrementButton = screen.getByRole("button", { name: "Decrement" });

    // First increment to 2
    await user.click(incrementButton);
    await user.click(incrementButton);
    expect(screen.getByText("Count: 2")).toBeInTheDocument();

    // Then decrement
    await user.click(decrementButton);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();

    await user.click(decrementButton);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("can decrement below zero", async () => {
    const user = userEvent.setup();
    render(<App />);

    const decrementButton = screen.getByRole("button", { name: "Decrement" });

    await user.click(decrementButton);
    expect(screen.getByText("Count: -1")).toBeInTheDocument();

    await user.click(decrementButton);
    expect(screen.getByText("Count: -2")).toBeInTheDocument();
  });

  it("resets the counter to zero when reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    // Increment counter
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    expect(screen.getByText("Count: 3")).toBeInTheDocument();

    // Reset counter
    await user.click(resetButton);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("resets negative counter to zero", async () => {
    const user = userEvent.setup();
    render(<App />);

    const decrementButton = screen.getByRole("button", { name: "Decrement" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    // Decrement counter to negative
    await user.click(decrementButton);
    await user.click(decrementButton);
    expect(screen.getByText("Count: -2")).toBeInTheDocument();

    // Reset counter
    await user.click(resetButton);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("handles multiple rapid interactions correctly", async () => {
    const user = userEvent.setup();
    render(<App />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const decrementButton = screen.getByRole("button", { name: "Decrement" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    // Complex interaction sequence
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(decrementButton);
    await user.click(incrementButton);
    expect(screen.getByText("Count: 2")).toBeInTheDocument();

    await user.click(resetButton);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    await user.click(decrementButton);
    await user.click(incrementButton);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });
});
