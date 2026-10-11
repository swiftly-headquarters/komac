/**
 * Shared enter/exit motion for floating popups (Base UI `data-starting-style` /
 * `data-ending-style`): a quick fade with a slight scale from the anchor.
 * Suppressed under `prefers-reduced-motion` by the base layer in komachi.css.
 */
export const POPUP_MOTION =
  "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:duration-0";
