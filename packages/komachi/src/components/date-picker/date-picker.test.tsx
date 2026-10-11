import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  it("starts weeks on Monday", () => {
    const { container } = render(
      <DatePicker mode="single" defaultMonth={new Date(2026, 9, 1)} />,
    );
    const weekdays = [...container.querySelectorAll(".rdp-weekday")].map(
      (el) => el.textContent,
    );
    expect(weekdays[0]).toMatch(/^Mo/);
    expect(weekdays[6]).toMatch(/^Su/);
  });

  it("jumps to a chosen month and year through the caption chooser", () => {
    render(<DatePicker mode="single" defaultMonth={new Date(2026, 9, 1)} />);

    fireEvent.click(screen.getByRole("button", { name: /October 2026/ }));
    const months = screen.getByRole("group", { name: "Choose month" });
    fireEvent.click(within(months).getByRole("button", { name: "2026" }));

    const years = screen.getByRole("group", { name: "Choose year" });
    fireEvent.click(within(years).getByRole("button", { name: "2020" }));
    fireEvent.click(
      within(screen.getByRole("group", { name: "Choose month" })).getByRole(
        "button",
        { name: "Mar" },
      ),
    );

    expect(screen.queryByRole("group")).toBeNull();
    expect(
      screen.getByRole("button", { name: /March 2020/ }),
    ).toBeTruthy();
  });

  it("disables months outside startMonth/endMonth", () => {
    render(
      <DatePicker
        mode="single"
        defaultMonth={new Date(2026, 9, 1)}
        startMonth={new Date(2026, 5, 1)}
        endMonth={new Date(2026, 11, 1)}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /October 2026/ }));
    const months = screen.getByRole("group", { name: "Choose month" });
    expect(
      (within(months).getByRole("button", { name: "May" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (within(months).getByRole("button", { name: "Jun" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });
});
