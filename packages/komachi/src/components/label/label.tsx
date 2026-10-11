import { Info } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../button";
import { Tooltip } from "../tooltip";

/** Label variant definitions (currently empty, reserved for future additions). */
export const KOMACHI_LABEL_VARIANTS = {
  // Label currently has no variant options but structure is ready for future additions
} as const;

export const KOMACHI_LABEL_DEFAULT_VARIANTS = {} as const;

// Derived types from KOMACHI_LABEL_VARIANTS
export interface KomachiLabelVariantsProps {}

export function labelVariants(_props: KomachiLabelVariantsProps = {}) {
  return cn(
    // Base styles - when used standalone, apply text styling
    // When used inside Field, the parent FieldBase.Label provides these styles
    "m-0 text-sm leading-[21px] font-medium text-komachi-default",
  );
}

export function labelContentVariants() {
  return cn(
    // Content wrapper styles - always applied
    "inline-flex items-center gap-1",
  );
}

/**
 * Label component props.
 *
 * @example
 * ```tsx
 * <Label>Email</Label>
 * <Label showOptional>Middle Name</Label>
 * <Label tooltip="We'll use this to send you updates">Email</Label>
 * ```
 */
export interface LabelProps extends KomachiLabelVariantsProps {
  /** The label content - can be a string or any React node. */
  children: ReactNode;
  /** When `true`, shows gray "(optional)" text after the label. */
  showOptional?: boolean;
  /** Tooltip content displayed next to the label via an info icon. */
  tooltip?: ReactNode;
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /** The id of the form element this label is associated with */
  htmlFor?: string;
  /**
   * When true, only renders the inline content (indicators, tooltip) without
   * the outer label element with font styling. Useful when composed inside another
   * label element that already provides the text styling.
   * @default false
   */
  asContent?: boolean;
}

/**
 * Label component for form fields.
 *
 * Provides a standardized way to display labels with optional indicators:
 * - Optional indicator: gray "(optional)" text when `showOptional={true}`
 * - Tooltip: info icon with hover tooltip for additional context
 *
 * @example
 * // Basic label
 * <Label>Email</Label>
 *
 * @example
 * // Optional field with indicator
 * <Label showOptional>Middle Name</Label>
 *
 * @example
 * // With tooltip
 * <Label tooltip="We'll use this to send you updates">Email</Label>
 *
 * @example
 * // With ReactNode children
 * <Label>
 *   <span>Custom label with <strong>bold</strong> text</span>
 * </Label>
 */
export function Label({
  children,
  showOptional = false,
  tooltip,
  className,
  htmlFor,
  asContent = false,
}: LabelProps) {
  const content = (
    <>
      {children}
      {showOptional && (
        <span className="font-normal text-komachi-subtle">(optional)</span>
      )}
      {tooltip && (
        <Tooltip
          content={tooltip}
          render={
            <Button
              variant="ghost"
              size="xs"
              shape="square"
              aria-label="More information"
            >
              <Info className="size-4" />
            </Button>
          }
        />
      )}
    </>
  );

  // When used as content inside another styled element, just render inline
  if (asContent) {
    return (
      <span className={cn(labelContentVariants(), className)}>{content}</span>
    );
  }

  // When used standalone, render as <label> for accessibility
  return (
    <label
      htmlFor={htmlFor}
      className={cn(labelVariants(), labelContentVariants(), className)}
    >
      {content}
    </label>
  );
}

Label.displayName = "Label";
