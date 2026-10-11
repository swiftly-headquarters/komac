import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vite-plus/test";
import {
  HoldButton,
  holdButtonVariants,
  KOMACHI_HOLD_BUTTON_DEFAULT_VARIANTS,
  KOMACHI_HOLD_BUTTON_VARIANTS,
} from "./hold-button";

describe("HoldButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exports effect variants and defaults", () => {
    expect(Object.keys(KOMACHI_HOLD_BUTTON_VARIANTS.effect)).toEqual([
      "fill",
      "ring",
      "glow",
    ]);
    expect(KOMACHI_HOLD_BUTTON_DEFAULT_VARIANTS.effect).toBe("fill");
    expect(holdButtonVariants({ effect: "fill" })).toContain("overflow-hidden");
    expect(holdButtonVariants({ effect: "ring" })).toContain(
      "overflow-visible",
    );
  });

  it("renders an accessible button and forwards its ref", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(
      <HoldButton ref={ref} onHoldComplete={() => undefined}>
        Deploy
      </HoldButton>,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    expect(ref.current).toBe(button);
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("data-komachi-component")).toBe("HoldButton");
  });

  it("completes after pointer remains down for holdDuration", () => {
    const onHoldComplete = vi.fn();
    const onHoldCancel = vi.fn();

    render(
      <HoldButton
        holdDuration={800}
        onHoldComplete={onHoldComplete}
        onHoldCancel={onHoldCancel}
      >
        Deploy
      </HoldButton>,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    fireEvent.pointerDown(button, { button: 0 });

    expect(button.getAttribute("data-hold-state")).toBe("holding");
    expect(button.getAttribute("aria-busy")).toBe("true");

    act(() => {
      vi.advanceTimersByTime(799);
    });
    expect(onHoldComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onHoldComplete).toHaveBeenCalledTimes(1);
    expect(onHoldCancel).not.toHaveBeenCalled();
    expect(button.getAttribute("data-hold-state")).toBe("complete");
    expect(button.getAttribute("aria-busy")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(onHoldComplete).toHaveBeenCalledTimes(1);

    fireEvent.pointerUp(button, { button: 0 });
    expect(button.getAttribute("data-hold-state")).toBe("idle");
    expect(onHoldCancel).not.toHaveBeenCalled();
  });

  it("cancels when pointer is released before completion", () => {
    const onHoldComplete = vi.fn();
    const onHoldCancel = vi.fn();

    render(
      <HoldButton
        holdDuration={800}
        onHoldComplete={onHoldComplete}
        onHoldCancel={onHoldCancel}
      >
        Deploy
      </HoldButton>,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.pointerUp(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(onHoldComplete).not.toHaveBeenCalled();
    expect(onHoldCancel).toHaveBeenCalledTimes(1);
    expect(button.getAttribute("data-hold-state")).toBe("idle");
  });

  it("cancels when pointer leaves or button loses focus", () => {
    const onHoldCancel = vi.fn();

    render(
      <HoldButton
        holdDuration={800}
        onHoldComplete={() => undefined}
        onHoldCancel={onHoldCancel}
      >
        Deploy
      </HoldButton>,
    );

    const button = screen.getByRole("button", { name: "Deploy" });

    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerLeave(button);
    expect(onHoldCancel).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: " " });
    fireEvent.blur(button);
    expect(onHoldCancel).toHaveBeenCalledTimes(2);
  });

  it.each([" ", "Enter"])("supports holding with %p key", (key) => {
    const onHoldComplete = vi.fn();
    const onHoldCancel = vi.fn();

    render(
      <HoldButton
        holdDuration={500}
        onHoldComplete={onHoldComplete}
        onHoldCancel={onHoldCancel}
      >
        Deploy
      </HoldButton>,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    fireEvent.keyDown(button, { key });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onHoldComplete).toHaveBeenCalledTimes(1);
    fireEvent.keyUp(button, { key });
    expect(onHoldCancel).not.toHaveBeenCalled();
    expect(button.getAttribute("data-hold-state")).toBe("idle");
  });

  it("ignores repeated keydown events", () => {
    const onHoldComplete = vi.fn();

    render(
      <HoldButton holdDuration={500} onHoldComplete={onHoldComplete}>
        Deploy
      </HoldButton>,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: "Enter", repeat: true });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onHoldComplete).toHaveBeenCalledTimes(1);
  });

  it("does not start while disabled or loading", () => {
    const onHoldComplete = vi.fn();

    const { rerender } = render(
      <HoldButton disabled onHoldComplete={onHoldComplete}>
        Deploy
      </HoldButton>,
    );

    let button = screen.getByRole("button", { name: "Deploy" });
    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.runAllTimers();
    });

    rerender(
      <HoldButton loading onHoldComplete={onHoldComplete}>
        Deploy
      </HoldButton>,
    );
    button = screen.getByRole("button");
    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.runAllTimers();
    });

    expect(onHoldComplete).not.toHaveBeenCalled();
  });

  it.each(["fill", "ring", "glow"] as const)(
    "renders synchronized %s progress effect",
    (effect) => {
      render(
        <HoldButton
          effect={effect}
          holdDuration={650}
          onHoldComplete={() => undefined}
        >
          Deploy
        </HoldButton>,
      );

      const button = screen.getByRole("button", { name: "Deploy" });
      fireEvent.pointerDown(button, { button: 0 });

      const progress = document.querySelector(
        `[data-komachi-part="progress"][data-hold-effect="${effect}"]`,
      );
      expect(progress).toBeTruthy();
      expect(progress?.getAttribute("data-hold-state")).toBe("holding");
      expect((progress as HTMLElement).style.animationDuration).toBe("650ms");

      if (effect === "ring") {
        const ring = progress?.querySelector("rect");
        expect(progress?.getAttribute("viewBox")).toBeNull();
        expect(ring?.getAttribute("width")).toBe("calc(100% - 2px)");
        expect(ring?.getAttribute("height")).toBe("calc(100% - 2px)");
      }
    },
  );

  it("suppresses ordinary click activation", () => {
    const onHoldComplete = vi.fn();

    render(<HoldButton onHoldComplete={onHoldComplete}>Deploy</HoldButton>);

    fireEvent.click(screen.getByRole("button", { name: "Deploy" }));
    act(() => {
      vi.runAllTimers();
    });

    expect(onHoldComplete).not.toHaveBeenCalled();
  });

  it("clears pending completion timer when unmounted", () => {
    const onHoldComplete = vi.fn();
    const { unmount } = render(
      <HoldButton holdDuration={500} onHoldComplete={onHoldComplete}>
        Deploy
      </HoldButton>,
    );

    fireEvent.pointerDown(screen.getByRole("button"), { button: 0 });
    unmount();
    act(() => {
      vi.runAllTimers();
    });

    expect(onHoldComplete).not.toHaveBeenCalled();
  });
});
