import { useEffect, type RefObject } from "react";

/**
 * Holds a CSS entrance animation at its first frame while the element is off
 * screen and plays it when the element first scrolls into view, so one-shot
 * animations (e.g. a Meter filling) are seen instead of finishing unseen.
 *
 * The animation still starts on mount (so server-rendered markup and
 * no-script pages animate normally); an element that is already visible is
 * left alone. Does nothing without `IntersectionObserver` or the Web
 * Animations API.
 */
export function usePlayWhenVisible(
  ref: RefObject<HTMLElement | null>,
  animationName: string,
) {
  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      typeof IntersectionObserver === "undefined" ||
      typeof el.getAnimations !== "function"
    ) {
      return;
    }
    const animations = () =>
      el
        .getAnimations()
        .filter((a) => (a as CSSAnimation).animationName === animationName);
    let held = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        if (held) animations().forEach((a) => a.play());
        observer.disconnect();
      } else {
        held = true;
        animations().forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, animationName]);
}
