import { render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { usePlayWhenVisible } from "./use-play-when-visible";

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  usePlayWhenVisible(ref, "fill");
  return <div ref={ref} data-testid="probe" />;
}

describe("usePlayWhenVisible", () => {
  const original = globalThis.IntersectionObserver;
  afterEach(() => {
    globalThis.IntersectionObserver = original;
    vi.restoreAllMocks();
  });

  function setup() {
    let callback: IntersectionObserverCallback = () => {};
    globalThis.IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
    const animation = {
      animationName: "fill",
      currentTime: 50,
      pause: vi.fn(),
      play: vi.fn(),
    };
    Object.defineProperty(HTMLElement.prototype, "getAnimations", {
      configurable: true,
      value: () => [animation],
    });
    const fire = (isIntersecting: boolean) =>
      callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    return { animation, fire };
  }

  it("holds the animation at its first frame offscreen, then plays it on entry", () => {
    const { animation, fire } = setup();
    render(<Probe />);

    fire(false);
    expect(animation.pause).toHaveBeenCalled();
    expect(animation.currentTime).toBe(0);
    expect(animation.play).not.toHaveBeenCalled();

    fire(true);
    expect(animation.play).toHaveBeenCalledTimes(1);
  });

  it("leaves an already-visible element's animation alone", () => {
    const { animation, fire } = setup();
    render(<Probe />);

    fire(true);
    expect(animation.pause).not.toHaveBeenCalled();
    expect(animation.play).not.toHaveBeenCalled();
  });
});
