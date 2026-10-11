import React from "react";
import {
  Button,
  type ButtonProps,
  type KomachiButtonShape,
  type KomachiButtonSize,
  type KomachiButtonVariant,
} from "../button/button";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";

/** HoldButton effect definitions mapping effect names to wrapper classes. */
export const KOMACHI_HOLD_BUTTON_VARIANTS = {
  effect: {
    fill: {
      classes: "overflow-hidden",
      description: "Brand-colored progress fill that moves across the button",
    },
    ring: {
      classes: "overflow-visible",
      description: "Progress ring that traces the button perimeter",
    },
    glow: {
      classes: "overflow-visible",
      description: "Brand-colored glow that intensifies while holding",
    },
  },
} as const;

export const KOMACHI_HOLD_BUTTON_DEFAULT_VARIANTS = {
  effect: "fill",
} as const;

export type KomachiHoldButtonEffect =
  keyof typeof KOMACHI_HOLD_BUTTON_VARIANTS.effect;

export interface KomachiHoldButtonVariantsProps {
  /**
   * Progress effect shown while holding.
   * - `"fill"` - Progress fill moves from left to right
   * - `"ring"` - Progress ring traces the button perimeter
   * - `"glow"` - Glow intensity increases with progress
   * @default "fill"
   */
  effect?: KomachiHoldButtonEffect;
}

export function holdButtonVariants({
  effect = KOMACHI_HOLD_BUTTON_DEFAULT_VARIANTS.effect,
}: KomachiHoldButtonVariantsProps = {}) {
  return cn(
    "relative isolate inline-flex w-max",
    resolveVariant(
      KOMACHI_HOLD_BUTTON_VARIANTS.effect,
      effect,
      KOMACHI_HOLD_BUTTON_DEFAULT_VARIANTS.effect,
    ).classes,
  );
}

type HoldState = "idle" | "holding" | "complete";
type HoldSource = "pointer" | "keyboard";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<keyof T, K>>
  : never;

type HoldButtonBaseProps = DistributiveOmit<ButtonProps, "onClick">;

type ComposedButtonProps = ButtonProps &
  React.RefAttributes<HTMLButtonElement> & {
    "data-hold-effect": KomachiHoldButtonEffect;
    "data-hold-state": HoldState;
    "data-komachi-component": "HoldButton";
  };

/**
 * HoldButton component props.
 *
 * @example
 * ```tsx
 * <HoldButton holdDuration={1200} onHoldComplete={deploy}>
 *   Hold to deploy
 * </HoldButton>
 * ```
 */
export type HoldButtonProps = HoldButtonBaseProps &
  KomachiHoldButtonVariantsProps & {
    /** Time in milliseconds required to complete the hold. @default 1200 */
    holdDuration?: number;
    /** Fires once when the hold reaches its required duration. */
    onHoldComplete: () => void;
    /** Fires when an active hold ends before completion. */
    onHoldCancel?: () => void;
  };

const DEFAULT_HOLD_DURATION = 1200;

function normalizeHoldDuration(duration: number) {
  if (!Number.isFinite(duration)) return DEFAULT_HOLD_DURATION;
  return Math.max(0, duration);
}

function getWrapperRadius(shape: KomachiButtonShape, size: KomachiButtonSize) {
  if (shape === "circle") return "rounded-full";
  if (size === "xs") return "rounded-md";
  if (size === "sm") return "rounded-md";
  return "rounded-lg";
}

function getHoldColor(variant: KomachiButtonVariant) {
  if (variant === "destructive" || variant === "secondary-destructive") {
    return "var(--color-komachi-danger)";
  }
  return "var(--color-komachi-brand)";
}

interface HoldProgressProps {
  duration: number;
  effect: KomachiHoldButtonEffect;
  shape: KomachiButtonShape;
  size: KomachiButtonSize;
  state: HoldState;
}

function HoldProgress({
  duration,
  effect,
  shape,
  size,
  state,
}: HoldProgressProps) {
  const animationStyle = { animationDuration: `${duration}ms` };

  if (effect === "ring") {
    const radius =
      shape === "circle" ? "50%" : size === "xs" ? 4 : size === "sm" ? 6 : 8;

    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        data-hold-effect={effect}
        data-hold-state={state}
        data-komachi-part="progress"
        style={animationStyle}
      >
        <rect
          className="komachi-hold-ring-progress"
          data-hold-state={state}
          fill="none"
          height="calc(100% - 2px)"
          pathLength="100"
          rx={radius}
          stroke="var(--komachi-hold-color)"
          strokeLinecap="round"
          strokeWidth="2"
          style={animationStyle}
          width="calc(100% - 2px)"
          x="1"
          y="1"
        />
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        effect === "fill"
          ? "komachi-hold-fill-progress"
          : "komachi-hold-glow-progress",
      )}
      data-hold-effect={effect}
      data-hold-state={state}
      data-komachi-part="progress"
      style={animationStyle}
    />
  );
}

/**
 * Action button that completes only after a continuous pointer or keyboard hold.
 * Progress stays synchronized with `holdDuration` through fill, ring, or glow effects.
 *
 * @example
 * ```tsx
 * <HoldButton effect="ring" onHoldComplete={deploy}>
 *   Hold to deploy
 * </HoldButton>
 * ```
 */
export const HoldButton = React.forwardRef<HTMLButtonElement, HoldButtonProps>(
  (
    {
      children,
      className,
      disabled,
      effect = "fill",
      holdDuration = DEFAULT_HOLD_DURATION,
      loading,
      onBlur,
      onContextMenu,
      onHoldCancel,
      onHoldComplete,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerUp,
      shape = "base",
      size = "base",
      style,
      variant = "secondary",
      ...props
    },
    ref,
  ) => {
    const duration = normalizeHoldDuration(holdDuration);
    const [state, setState] = React.useState<HoldState>("idle");
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const sourceRef = React.useRef<HoldSource | null>(null);
    const completedRef = React.useRef(false);

    const clearTimer = React.useCallback(() => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const endHold = React.useCallback(
      (source?: HoldSource) => {
        if (source && sourceRef.current !== source) return;
        if (sourceRef.current === null) return;

        const completed = completedRef.current;
        clearTimer();
        sourceRef.current = null;
        completedRef.current = false;
        setState("idle");

        if (!completed) onHoldCancel?.();
      },
      [clearTimer, onHoldCancel],
    );

    const startHold = React.useCallback(
      (source: HoldSource) => {
        if (disabled || loading || sourceRef.current !== null) return;

        sourceRef.current = source;
        completedRef.current = false;
        setState("holding");

        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          if (sourceRef.current !== source) return;

          completedRef.current = true;
          setState("complete");
          onHoldComplete();
        }, duration);
      },
      [disabled, duration, loading, onHoldComplete],
    );

    React.useEffect(() => {
      if (disabled || loading) endHold();
    }, [disabled, endHold, loading]);

    React.useEffect(
      () => () => {
        clearTimer();
        sourceRef.current = null;
      },
      [clearTimer],
    );

    const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || event.button !== 0) return;
      event.currentTarget.focus();
      startHold("pointer");
    };

    const handlePointerUp: React.PointerEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onPointerUp?.(event);
      if (event.button === 0) endHold("pointer");
    };

    const handlePointerLeave: React.PointerEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onPointerLeave?.(event);
      endHold("pointer");
    };

    const handlePointerCancel: React.PointerEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onPointerCancel?.(event);
      endHold("pointer");
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        event.repeat ||
        (event.key !== " " && event.key !== "Enter")
      ) {
        return;
      }

      event.preventDefault();
      startHold("keyboard");
    };

    const handleKeyUp: React.KeyboardEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onKeyUp?.(event);
      if (event.key !== " " && event.key !== "Enter") return;

      event.preventDefault();
      endHold("keyboard");
    };

    const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (event) => {
      onBlur?.(event);
      endHold();
    };

    const handleContextMenu: React.MouseEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      onContextMenu?.(event);
      if (sourceRef.current !== null) event.preventDefault();
    };

    const holdColor = getHoldColor(variant);
    const wrapperStyle: React.CSSProperties & Record<`--${string}`, string> = {
      "--komachi-hold-color": holdColor,
    };
    const composedButtonProps = {
      ...(props as ButtonProps),
      ref,
      "aria-busy": state === "holding" || undefined,
      className: cn("touch-none", className),
      "data-hold-effect": effect,
      "data-hold-state": state,
      "data-komachi-component": "HoldButton",
      disabled,
      loading,
      onBlur: handleBlur,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
      },
      onContextMenu: handleContextMenu,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerLeave: handlePointerLeave,
      onPointerUp: handlePointerUp,
      shape,
      size,
      style,
      variant,
      children,
    } as ComposedButtonProps;

    return (
      <span
        className={cn(
          holdButtonVariants({ effect }),
          getWrapperRadius(shape, size),
        )}
        data-hold-state={state}
        data-komachi-part="wrapper"
        style={wrapperStyle}
      >
        {React.createElement(Button, composedButtonProps)}
        <HoldProgress
          duration={duration}
          effect={effect}
          shape={shape}
          size={size}
          state={state}
        />
      </span>
    );
  },
);

HoldButton.displayName = "HoldButton";
