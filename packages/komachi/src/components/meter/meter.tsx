import { Meter as BaseMeter } from "@base-ui/react/meter";
import { useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";
import { usePlayWhenVisible } from "../../utils/use-play-when-visible";

/** Meter variant definitions (currently empty, reserved for future additions). */
export const KOMACHI_METER_VARIANTS = {
  // Meter currently has no variant options but structure is ready for future additions
} as const;

export const KOMACHI_METER_DEFAULT_VARIANTS = {} as const;

// Derived types from KOMACHI_METER_VARIANTS
export interface KomachiMeterVariantsProps {}

export function meterVariants(_props: KomachiMeterVariantsProps = {}) {
  return cn(
    // Base styles
    "flex w-full flex-col gap-2",
  );
}

type RootProps = ComponentPropsWithoutRef<typeof BaseMeter.Root>;

/**
 * Meter component props.
 *
 * @example
 * ```tsx
 * <Meter label="Storage used" value={65} />
 * <Meter label="API requests" value={75} customValue="750 / 1,000" />
 * // Plain progress bar, no label or value text:
 * <Meter value={65} aria-label="Upload progress" />
 * ```
 */
export interface MeterProps extends RootProps, KomachiMeterVariantsProps {
  /** Custom formatted value text (e.g. "750 / 1,000") displayed instead of percentage. */
  customValue?: string;
  /**
   * Label text displayed above the meter track. Optional: omit it for a plain
   * progress bar, and pass `aria-label` so the meter still has an accessible name.
   */
  label?: string;
  /**
   * Whether to display the percentage value next to the label. Defaults to
   * `true` when a `label` is given, and `false` for a plain bar.
   * @default true (with a label)
   */
  showValue?: boolean;
  /** Additional CSS classes for the track (background bar). */
  trackClassName?: string;
  /** Additional CSS classes for the indicator (filled bar). */
  indicatorClassName?: string;
}

/**
 * Progress bar showing a measured value within a known range (e.g. quota usage).
 *
 * @example
 * ```tsx
 * <Meter label="Storage" value={65} />
 * <Meter value={65} aria-label="Upload progress" />
 * ```
 */
export function Meter({
  value,
  customValue,
  label,
  showValue = label != null,
  className,
  trackClassName,
  indicatorClassName,
  ...props
}: MeterProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  // The fill plays when the bar is first seen, not while it is off screen.
  usePlayWhenVisible(indicatorRef, "meter-slide");

  return (
    <BaseMeter.Root
      value={value}
      {...props}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {(label != null || customValue || showValue) && (
        <div className="flex items-center justify-between gap-4">
          {label != null && (
            <BaseMeter.Label className="text-xs text-komachi-subtle">
              {label}
            </BaseMeter.Label>
          )}
          {customValue ? (
            <span className="ml-auto text-sm font-medium text-komachi-default tabular-nums">
              {customValue}
            </span>
          ) : (
            <>
              {showValue && (
                <BaseMeter.Value className="ml-auto text-sm font-medium text-komachi-default tabular-nums" />
              )}
            </>
          )}
        </div>
      )}
      <BaseMeter.Track
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-komachi-fill",
          trackClassName,
        )}
      >
        <BaseMeter.Indicator
          ref={indicatorRef}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-komachi-brand via-komachi-brand to-komachi-brand transition-[width] duration-300 ease-out komachi-meter-fill",
            indicatorClassName,
          )}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
