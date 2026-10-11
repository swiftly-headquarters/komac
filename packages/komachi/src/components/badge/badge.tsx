import React, { type ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";

/** Base styles applied to all badge variants. */
export const KOMACHI_BADGE_BASE_STYLES =
  "inline-flex w-fit flex-none shrink-0 items-center justify-self-start gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap [a:hover_&]:ring [a:hover_&]:ring-current";

/** Badge variant definitions mapping variant names to their Tailwind classes and descriptions. */
export const KOMACHI_BADGE_VARIANTS = {
  variant: {
    /** Semantic token badges */
    primary: {
      classes: "bg-komachi-badge-inverted text-komachi-badge-inverted",
      description: "Primary badge",
    },
    secondary: {
      classes: "bg-komachi-fill text-komachi-badge-neutral-subtle",
      description: "Secondary badge",
    },
    error: {
      classes: "bg-komachi-danger-tint text-komachi-danger",
      description: "Error badge",
    },
    warning: {
      classes: "bg-komachi-warning-tint text-komachi-warning",
      description: "Warning badge",
    },
    success: {
      classes: "bg-komachi-success-tint text-komachi-success",
      description: "Success badge",
    },
    destructive: {
      classes: "bg-komachi-badge-red text-white",
      description: "Deprecated. Use red instead.",
    },
    info: {
      classes: "bg-komachi-info-tint text-komachi-info",
      description: "Info badge",
    },
    beta: {
      classes:
        "border border-dashed border-komachi-brand bg-transparent text-komachi-link",
      description: "Indicates beta or experimental features",
    },
    outline: {
      classes: "border border-komachi-separator bg-komachi-base text-komachi-default",
      description: "Bordered badge with base background",
    },

    /** Other color token variants */

    red: {
      classes: "bg-komachi-badge-red text-white",
      description: "Red badge",
    },
    green: {
      classes: "bg-komachi-badge-green text-white",
      description: "Green badge",
    },
    neutral: {
      classes: "bg-komachi-badge-neutral text-white",
      description: "Neutral badge",
    },
    orange: {
      classes: "bg-komachi-badge-orange text-black",
      description: "Orange badge",
    },
    purple: {
      classes: "bg-komachi-badge-purple text-white",
      description: "Purple badge",
    },
    teal: {
      classes: "bg-komachi-badge-teal text-white",
      description: "Teal badge",
    },
    "teal-subtle": {
      classes: "bg-komachi-badge-teal-subtle text-komachi-badge-teal-subtle",
      description: "Subtle teal badge",
    },
    blue: {
      classes: "bg-komachi-badge-blue text-white",
      description: "Blue badge",
    },
  },
  appearance: {
    filled: {
      classes: "",
      description: "Filled badge with background color (default)",
    },
    dot: {
      classes:
        "gap-1.5 bg-transparent text-komachi-default ring ring-komachi-separator",
      description: "Outlined badge with a colored circle dot indicating status",
    },
  },
  dotColor: {
    none: {
      classes: "",
      description:
        "No dot indicator (used when appearance is not dot, or variant has no dot color)",
    },
    success: {
      classes: "bg-komachi-success",
      description: "Green dot for success status",
    },
    warning: {
      classes: "bg-komachi-badge-orange",
      description: "Orange dot for warning status",
    },
    error: {
      classes: "bg-komachi-badge-red",
      description: "Red dot for error status",
    },
    neutral: {
      classes: "bg-komachi-badge-neutral",
      description: "Neutral dot for informational status",
    },
  },
} as const;

export const KOMACHI_BADGE_DEFAULT_VARIANTS = {
  variant: "primary",
  appearance: "filled",
  dotColor: "none",
} as const;

// Derived types from KOMACHI_BADGE_VARIANTS
export type KomachiBadgeVariant = keyof typeof KOMACHI_BADGE_VARIANTS.variant;
export type KomachiBadgeAppearance = keyof typeof KOMACHI_BADGE_VARIANTS.appearance;
export type KomachiBadgeDotColor = keyof typeof KOMACHI_BADGE_VARIANTS.dotColor;

export interface KomachiBadgeVariantsProps {
  variant?: KomachiBadgeVariant;
  appearance?: KomachiBadgeAppearance;
}

export function badgeVariants({
  variant = KOMACHI_BADGE_DEFAULT_VARIANTS.variant,
  appearance = KOMACHI_BADGE_DEFAULT_VARIANTS.appearance,
}: KomachiBadgeVariantsProps = {}) {
  const variantClasses = resolveVariant(
    KOMACHI_BADGE_VARIANTS.variant,
    variant,
    KOMACHI_BADGE_DEFAULT_VARIANTS.variant,
  ).classes;
  const appearanceClasses = resolveVariant(
    KOMACHI_BADGE_VARIANTS.appearance,
    appearance,
    KOMACHI_BADGE_DEFAULT_VARIANTS.appearance,
  ).classes;
  return cn(
    // Base styles (exported as KOMACHI_BADGE_BASE_STYLES for Figma plugin)
    KOMACHI_BADGE_BASE_STYLES,
    // The dot appearance overrides background/text colors from the variant,
    // so only apply variant classes when we're not in dot mode.
    appearance === "dot" ? "" : variantClasses,
    appearanceClasses,
  );
}

// Legacy type alias for backwards compatibility
export type BadgeVariant = KomachiBadgeVariant;

const renderIconNode = (IconComponent?: Icon | ReactNode) => {
  if (!IconComponent) return null;
  const Component = IconComponent as React.ComponentType<
    Record<string, unknown>
  >;
  const icon = React.isValidElement(IconComponent) ? (
    IconComponent
  ) : (
    <Component />
  );

  return (
    <span className="flex h-lh w-3 shrink-0 items-center justify-center [&>svg]:size-3">
      {icon}
    </span>
  );
};

/**
 * Badge component props.
 *
 * @example
 * ```tsx
 * <Badge variant="green">Active</Badge>
 * <Badge variant="red">Error</Badge>
 * <Badge variant="neutral">Inactive</Badge>
 * <Badge variant="success" appearance="dot">Healthy</Badge>
 * ```
 */
interface BadgeBaseProps {
  /**
   * Color variant of the badge.
   * Recommended semantic variants:
   * - `"primary"` - Primary badge
   * - `"secondary"` - Secondary badge
   * - `"error"` - Error badge
   * - `"warning"` - Warning badge
   * - `"success"` - Success badge
   * - `"info"` - Info badge
   *
   * Additional token variants:
   * - `"red"`, `"orange"`, `"green"`, `"teal"`, `"blue"`, `"purple"`, `"neutral"`
   * - `"teal-subtle"`, `"neutral-subtle"`
   * - `"inverted"`
   * - `"outline"` - Bordered badge with the base background
   * - `"beta"` - Dashed-border badge for beta/experimental features
   * @default "primary"
   */
  variant?: KomachiBadgeVariant;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /** Content rendered inside the badge. */
  children: ReactNode;
}

interface FilledBadgeProps extends BadgeBaseProps {
  /**
   * Visual appearance of the badge.
   * - `"filled"` - Filled background using the variant color (default)
   * - `"dot"` - Outlined badge with a colored circle dot. Only `success`,
   *   `warning`, `error`, and `neutral` variants show a dot. Dot badges do not
   *   accept icons.
   * @default "filled"
   */
  appearance?: "filled";
  /** Icon from `@phosphor-icons/react` or a React element. Rendered before children. */
  icon?: Icon | ReactNode;
}

interface DotBadgeProps extends BadgeBaseProps {
  /**
   * Visual appearance of the badge.
   * - `"filled"` - Filled background using the variant color (default)
   * - `"dot"` - Outlined badge with a colored circle dot. Only `success`,
   *   `warning`, `error`, and `neutral` variants show a dot. Dot badges do not
   *   accept icons.
   * @default "filled"
   */
  appearance: "dot";
  /** Dot badges use their status dot instead of an icon. */
  icon?: never;
}

export type BadgeProps = FilledBadgeProps | DotBadgeProps;

/**
 * Small status label for categorizing or highlighting content.
 *
 * @example
 * ```tsx
 * <Badge variant="green">Active</Badge>
 * <Badge variant="success" appearance="dot">Healthy</Badge>
 * ```
 */
export function Badge({
  variant = KOMACHI_BADGE_DEFAULT_VARIANTS.variant,
  appearance = KOMACHI_BADGE_DEFAULT_VARIANTS.appearance,
  className,
  icon,
  children,
}: BadgeProps) {
  // Crash-safe dot-color lookup via resolveVariant - unknown variants fall
  // back to "none" (no dot) instead of throwing.
  const dotColor =
    appearance === "dot"
      ? resolveVariant(
          KOMACHI_BADGE_VARIANTS.dotColor,
          variant,
          KOMACHI_BADGE_DEFAULT_VARIANTS.dotColor,
        ).classes
      : "";
  return (
    <span
      data-komachi-component="Badge"
      className={cn(
        badgeVariants({ variant, appearance }),
        icon && "pl-1.5",
        className,
      )}
    >
      {dotColor ? (
        <span
          aria-hidden="true"
          className={cn("size-1.75 shrink-0 rounded-full", dotColor)}
        />
      ) : null}
      {renderIconNode(icon)}
      {children}
    </span>
  );
}
