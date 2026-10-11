import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { Meter } from "./meter";

describe("Meter", () => {
  it("renders a plain bar without a label or value text", () => {
    render(<Meter value={40} aria-label="Upload progress" />);

    const meter = screen.getByRole("meter", { name: "Upload progress" });
    expect(meter.getAttribute("aria-valuenow")).toBe("40");
    // No header row: neither label nor percentage text.
    expect(screen.queryByText("40%")).toBeNull();
    expect(meter.querySelector(":scope > div")?.className).not.toContain(
      "justify-between",
    );
  });

  it("shows the label and percentage by default when a label is given", () => {
    render(<Meter label="Storage" value={65} />);

    expect(screen.getByText("Storage")).toBeTruthy();
    expect(screen.getByText("65%")).toBeTruthy();
  });

  it("lets a plain bar opt in to the value text", () => {
    render(<Meter value={65} showValue aria-label="Quota" />);

    expect(screen.getByText("65%")).toBeTruthy();
  });

  it("shows custom value text without a label", () => {
    render(<Meter value={75} customValue="750 / 1,000" aria-label="Requests" />);

    expect(screen.getByText("750 / 1,000")).toBeTruthy();
  });
});
