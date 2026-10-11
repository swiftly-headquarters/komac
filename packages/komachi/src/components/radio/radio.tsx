import {
  forwardRef,
  createContext,
  useContext,
  type ReactNode,
  type ReactElement,
  type ForwardedRef,
} from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Fieldset } from "@base-ui/react/fieldset";
import {
  RadioGroup as BaseRadioGroup,
  type RadioGroup as BaseRadioGroupNamespace,
} from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";

/**
 * Event details passed as the second argument to `onValueChange`. Carries the
 * native event and interaction metadata. Re-exported from Base UI.
 */
export type RadioGroupChangeEventDetails =
  BaseRadioGroupNamespace.ChangeEventDetails;

/** Radio variant definitions mapping variant names to their Tailwind classes. */
export const KOMACHI_RADIO_VARIANTS = {
  variant: {
    default: {
      classes: "ring-komachi-edge",
      description: "Default radio appearance",
    },
    error: {
      classes: "ring-komachi-danger",
      description: "Error state for validation failures",
    },
  },
  appearance: {
    default: {
      classes: "",
      description: "Standard inline radio item",
    },
    card: {
      classes:
        "rounded-lg border border-komachi-edge bg-komachi-base p-3 hover:not-has-[[data-checked]]:bg-komachi-elevated has-[[data-checked]]:border-komachi-interact has-[[data-checked]]:bg-komachi-tint",
      description:
        "Choice card appearance with border, padding, and highlighted selection state",
    },
  },
} as const;

export const KOMACHI_RADIO_DEFAULT_VARIANTS = {
  variant: "default",
  appearance: "default",
} as const;

// Derived types from KOMACHI_RADIO_VARIANTS
export type KomachiRadioVariant = keyof typeof KOMACHI_RADIO_VARIANTS.variant;
export type KomachiRadioAppearance = keyof typeof KOMACHI_RADIO_VARIANTS.appearance;

export interface KomachiRadioVariantsProps {
  /**
   * Visual variant.
   * - `"default"` - Standard radio appearance
   * - `"error"` - Error state for validation failures
   * @default "default"
   */
  variant?: KomachiRadioVariant;
  /**
   * Visual appearance.
   * - `"default"` - Standard inline radio item
   * - `"card"` - Choice card with border, padding, and highlighted selection state
   * @default "default"
   */
  appearance?: KomachiRadioAppearance;
}

export function radioVariants({
  variant = KOMACHI_RADIO_DEFAULT_VARIANTS.variant,
  appearance = KOMACHI_RADIO_DEFAULT_VARIANTS.appearance,
}: KomachiRadioVariantsProps = {}) {
  return cn(
    resolveVariant(
      KOMACHI_RADIO_VARIANTS.variant,
      variant,
      KOMACHI_RADIO_DEFAULT_VARIANTS.variant,
    ).classes,
    resolveVariant(
      KOMACHI_RADIO_VARIANTS.appearance,
      appearance,
      KOMACHI_RADIO_DEFAULT_VARIANTS.appearance,
    ).classes,
  );
}

// Legacy type alias for backwards compatibility
export type RadioVariant = KomachiRadioVariant;

/** Position of the radio control relative to its label */
export type RadioControlPosition = "start" | "end";

// Context for passing controlPosition, appearance, and orientation from Group
// to Items. `controlPosition` may be undefined so each item can fall back to an
// appearance-appropriate default (start for default, end for card).
// `orientation` is null outside a Radio.Group.
const RadioGroupContext = createContext<{
  controlPosition: RadioControlPosition | undefined;
  appearance: KomachiRadioAppearance;
  orientation: "vertical" | "horizontal" | null;
}>({
  controlPosition: undefined,
  appearance: "default",
  orientation: null,
});

/**
 * Radio group component props (with built-in Fieldset and RadioGroup)
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Radio.Group legend="Notification preference" defaultValue="email">
 *   <Radio.Item label="Email" value="email" />
 *   <Radio.Item label="SMS" value="sms" />
 *   <Radio.Item label="Push" value="push" />
 * </Radio.Group>
 * ```
 *
 * @example
 * // Horizontal layout
 * ```tsx
 * <Radio.Group legend="Size" orientation="horizontal" defaultValue="md">
 *   <Radio.Item label="Small" value="sm" />
 *   <Radio.Item label="Medium" value="md" />
 *   <Radio.Item label="Large" value="lg" />
 * </Radio.Group>
 * ```
 *
 * @example
 * // With error and description
 * ```tsx
 * <Radio.Group
 *   legend="Payment method"
 *   error="Please select a payment method"
 *   description="Choose how you'd like to pay"
 * >
 *   <Radio.Item label="Credit Card" value="card" />
 *   <Radio.Item label="PayPal" value="paypal" />
 * </Radio.Group>
 * ```
 *
 * @example
 * // Controlled
 * ```tsx
 * const [value, setValue] = useState("email");
 * <Radio.Group legend="Contact" value={value} onValueChange={setValue}>
 *   <Radio.Item label="Email" value="email" />
 *   <Radio.Item label="Phone" value="phone" />
 * </Radio.Group>
 * ```
 *
 * @example
 * // Label before radio (controlPosition="end")
 * ```tsx
 * <Radio.Group legend="Options" controlPosition="end" defaultValue="a">
 *   <Radio.Item label="Option A" value="a" />
 *   <Radio.Item label="Option B" value="b" />
 * </Radio.Group>
 * ```
 *
 * @example
 * // Typed values - pass a type parameter to constrain `value`
 * ```tsx
 * <Radio.Group<number> legend="Items per page" defaultValue={10}>
 *   <Radio.Item<number> label="10" value={10} />
 *   <Radio.Item<number> label="25" value={25} />
 * </Radio.Group>
 * ```
 */
/**
 * Props for Radio.Legend - a composable sub-component for labeling a Radio.Group.
 *
 * Place as a direct child of `<Radio.Group>` to provide a styled, accessible legend.
 * Accepts `className` for full styling control (e.g. `className="sr-only"` to visually hide).
 *
 * @example
 * ```tsx
 * <Radio.Group>
 *   <Radio.Legend className="sr-only">Paths</Radio.Legend>
 *   <Radio.Item label="Allow all paths" value="all" />
 * </Radio.Group>
 * ```
 */
export interface RadioLegendProps {
  /** Legend content */
  children: ReactNode;
  /** Additional CSS classes (e.g. "sr-only" to visually hide the legend) */
  className?: string;
}

/**
 * Radio.Group component props.
 *
 * Parameterised by the radio value type `Value` (defaults to `string`). Pass a
 * type argument - e.g. `<Radio.Group<number>>` - to type `value`,
 * `defaultValue`, and the value passed to `onValueChange`.
 *
 * Note: the generic only types the group-level value props. It does **not**
 * guarantee that the `value` of each `Radio.Item` child conforms to `Value`,
 * since children are passed as `ReactNode` and are not cross-checked at compile
 * time. Annotate items (`<Radio.Item<number>>`) for matching inference.
 */
export interface RadioGroupProps<Value = string> {
  /**
   * Legend text for the group (required for accessibility).
   * For more control over legend styling, omit this prop and use `<Radio.Legend>` as a child instead.
   */
  legend?: string;
  /** Child Radio.Item components (and optionally a Radio.Legend) */
  children: ReactNode;
  /** Layout direction of the radio items */
  orientation?: "vertical" | "horizontal";
  /**
   * Visual appearance applied to all Radio.Item children.
   * - `"default"` - Standard inline radio items
   * - `"card"` - Choice card with border, padding, and highlighted selection state
   *
   * Individual items can override this with their own `appearance` prop.
   * @default "default"
   */
  appearance?: KomachiRadioAppearance;
  /** Error message for the group */
  error?: string;
  /** Helper text for the group */
  description?: ReactNode;
  /** Value of the radio that should be initially selected (uncontrolled) */
  defaultValue?: Value;
  /** Value of the radio that should be selected (controlled) */
  value?: Value;
  /**
   * Event handler called when the radio value changes. The second argument
   * carries native event details about the interaction.
   */
  onValueChange?: (
    value: Value,
    eventDetails: RadioGroupChangeEventDetails,
  ) => void;
  /** Whether all radios in the group are disabled */
  disabled?: boolean;
  /** Position of radio control relative to label: "start" puts radio before label, "end" puts label before radio. Defaults to "start" for default appearance and "end" for card appearance. */
  controlPosition?: RadioControlPosition;
  /** Form submission name for the radio group */
  name?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual radio item within a group
 *
 * @example
 * ```tsx
 * <Radio.Item label="Option A" value="a" />
 * ```
 *
 * @example
 * // Disabled item
 * ```tsx
 * <Radio.Item label="Unavailable" value="unavailable" disabled />
 * ```
 */
/**
 * Radio.Item component props.
 *
 * Parameterised by the radio value type `Value` (defaults to `string`). Pass a
 * type argument - e.g. `<Radio.Item<number>>` - to type `value` to match the
 * enclosing `Radio.Group`'s value type.
 */
export type RadioItemProps<Value = string> = {
  /** Visual variant: "default" or "error" for validation failures */
  variant?: RadioVariant;
  /**
   * Visual appearance of the radio item.
   * - `"default"` - Standard inline radio item
   * - `"card"` - Choice card with border, padding, and highlighted selection state
   *
   * When set on an individual item, overrides the group-level `appearance`.
   * @default "default"
   */
  appearance?: KomachiRadioAppearance;
  /** Label content displayed next to radio (required). Accepts strings or React nodes for rich content. */
  label: ReactNode;
  /** Description text displayed below the label (only visible in card appearance) */
  description?: ReactNode;
  /** Value of the radio (required) */
  value: Value;
  /** Additional CSS classes for the label wrapper */
  className?: string;
  /** Whether the radio is disabled */
  disabled?: boolean;
};

// Radio.Item for use within Radio.Group
function _RadioItem<T = string>(
  {
    className,
    disabled,
    variant = "default",
    appearance: appearanceProp,
    label,
    description,
    value,
  }: RadioItemProps<T>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const {
    controlPosition,
    appearance: groupAppearance,
    orientation,
  } = useContext(RadioGroupContext);
  const appearance = appearanceProp ?? groupAppearance;
  const isCard = appearance === "card";
  // Card items in a card group render as cells of one shared card; the group
  // draws the outer border and each cell draws its own dividers.
  const isJoined = isCard && groupAppearance === "card" && orientation !== null;

  // Fall back to an appearance-appropriate default when controlPosition is
  // not provided: card defaults to "end" (radio on the right), default
  // appearance defaults to "start" (radio on the left).
  const effectiveControlPosition: RadioControlPosition =
    controlPosition ?? (isCard ? "end" : "start");

  if (isCard) {
    const controlAtStart = effectiveControlPosition === "start";
    return (
      <label
        data-komachi-component="Radio"
        data-komachi-part="item-label"
        className={cn(
          "group relative m-0 flex items-start gap-3 bg-komachi-base p-3 has-[[data-checked]]:bg-komachi-tint",
          isJoined
            ? cn(
                // bg-clip-padding keeps the checked tint from darkening the
                // translucent dividers.
                "border-b border-komachi-separator bg-clip-padding last:border-b-0",
                // Two-column grid: the left column draws the column divider
                // (unless it's a lone last item), and the last row drops its
                // bottom divider.
                orientation === "horizontal" &&
                  "odd:border-r [&:last-child:nth-child(odd)]:border-r-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0",
              )
            : "rounded-lg border border-komachi-edge has-[[data-checked]]:border-komachi-interact",
          controlAtStart && "flex-row-reverse",
          variant === "error" &&
            cn(
              "has-[[data-checked]]:bg-komachi-base",
              !isJoined &&
                "border-komachi-danger has-[[data-checked]]:border-komachi-danger",
            ),
          disabled
            ? "cursor-not-allowed opacity-50"
            : cn(
                "cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50",
                // The checked row keeps its tint while hovered.
                variant !== "error" &&
                  "hover:not-has-[[data-disabled]]:not-has-[[data-checked]]:bg-komachi-elevated",
              ),
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-base font-medium text-komachi-default">
            {label}
          </span>
          {description && (
            <span className="text-sm text-komachi-subtle">{description}</span>
          )}
        </div>
        <BaseRadio.Root
          ref={ref}
          data-komachi-component="Radio"
          data-komachi-part="item"
          value={value}
          disabled={disabled}
          className={cn(
            "relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-0 bg-komachi-base ring focus:ring-komachi-focus-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-komachi-focus-ring",
            variant === "error" ? "ring-komachi-danger" : "ring-komachi-line",
            !disabled &&
              variant !== "error" &&
              "group-hover:ring-komachi-edge-hover focus-visible:outline-offset-3",
            !disabled &&
              variant === "error" &&
              "focus-visible:outline-offset-3",
            "data-[checked]:bg-komachi-contrast",
          )}
        >
          <BaseRadio.Indicator
            keepMounted
            className="flex items-center justify-center transition-[transform,scale,opacity] duration-150 ease-out motion-reduce:transition-none data-[unchecked]:scale-50 data-[unchecked]:opacity-0"
          >
            <span className="h-2 w-2 rounded-full bg-komachi-base" />
          </BaseRadio.Indicator>
        </BaseRadio.Root>
      </label>
    );
  }

  return (
    <label
      data-komachi-component="Radio"
      data-komachi-part="item-label"
      className={cn(
        "group relative m-0 inline-flex items-start gap-2",
        // "start" (default): radio before label
        // "end": label before radio using flex-row-reverse
        effectiveControlPosition === "end" && "flex-row-reverse justify-end",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <BaseRadio.Root
        ref={ref}
        data-komachi-component="Radio"
        data-komachi-part="item"
        value={value}
        disabled={disabled}
        className={cn(
          "relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-0 bg-komachi-base ring after:absolute after:-inset-x-3 after:-inset-y-2 focus:outline-none",
          variant === "error" ? "ring-komachi-danger" : "ring-komachi-line",
          !disabled &&
            variant !== "error" &&
            "group-hover:ring-komachi-edge-hover focus:ring-2 focus:ring-komachi-focus-ring focus-visible:ring-2 focus-visible:ring-komachi-focus-ring focus-visible:outline-offset-3",
          !disabled &&
            variant === "error" &&
            "focus:ring-2 focus:ring-komachi-focus-ring focus-visible:ring-2 focus-visible:ring-komachi-focus-ring focus-visible:outline-offset-3",
          "data-[checked]:bg-komachi-contrast",
        )}
      >
        <BaseRadio.Indicator
          keepMounted
          className="flex items-center justify-center transition-[transform,scale,opacity] duration-150 ease-out motion-reduce:transition-none data-[unchecked]:scale-50 data-[unchecked]:opacity-0"
        >
          <span className="h-2 w-2 rounded-full bg-komachi-base" />
        </BaseRadio.Indicator>
      </BaseRadio.Root>
      <span className="text-base text-komachi-default">{label}</span>
    </label>
  );
}

// React's `forwardRef` erases generic type parameters, so we cast the result
// back to a generic call signature. The cast is required to support React 18
// consumers (where function components can't receive `ref` as a plain prop).
const RadioItem = forwardRef(_RadioItem) as <T = string>(
  props: RadioItemProps<T> & { ref?: ForwardedRef<HTMLButtonElement> },
) => ReactElement;

(RadioItem as unknown as { displayName: string }).displayName = "Radio.Item";

// Radio.Legend - composable legend sub-component for Radio.Group
function RadioLegend({ children, className }: RadioLegendProps) {
  return (
    <Fieldset.Legend
      className={cn("text-base font-medium text-komachi-default", className)}
    >
      {children}
    </Fieldset.Legend>
  );
}

RadioLegend.displayName = "Radio.Legend";

// Radio.Group with built-in Fieldset and RadioGroup
function RadioGroup<Value = string>({
  legend,
  children,
  orientation = "vertical",
  appearance = "default",
  error,
  description,
  defaultValue,
  value,
  onValueChange,
  disabled,
  controlPosition,
  name,
  className,
}: RadioGroupProps<Value>) {
  return (
    <RadioGroupContext.Provider
      value={{ controlPosition, appearance, orientation }}
    >
      <BaseRadioGroup<Value>
        defaultValue={defaultValue}
        value={value}
        onValueChange={(newValue, eventDetails) =>
          onValueChange?.(newValue, eventDetails)
        }
        disabled={disabled}
        name={name}
      >
        <Fieldset.Root
          disabled={disabled}
          className={cn(
            "flex flex-col p-0",
            // Card groups match Field's label-to-control gap.
            appearance === "card" ? "gap-2" : "gap-4",
            className,
          )}
        >
          {legend && (
            <Fieldset.Legend className="text-base font-medium text-komachi-default">
              {legend}
            </Fieldset.Legend>
          )}
          <div
            className={cn(
              orientation === "vertical"
                ? appearance === "card"
                  ? "flex flex-col overflow-hidden rounded-lg ring ring-komachi-separator"
                  : "flex flex-col gap-2"
                : appearance === "card"
                  ? "grid grid-cols-2 overflow-hidden rounded-lg bg-komachi-base ring ring-komachi-separator"
                  : "flex flex-row flex-wrap gap-2",
            )}
          >
            {children}
          </div>
          {error && <p className="text-sm text-komachi-danger">{error}</p>}
          {description && (
            <p className="text-sm text-komachi-subtle">{description}</p>
          )}
        </Fieldset.Root>
      </BaseRadioGroup>
    </RadioGroupContext.Provider>
  );
}

RadioGroup.displayName = "Radio.Group";

// Export RadioGroup directly for external usage
export { RadioGroup };

/**
 * Radio - radio button group for single-select choices.
 *
 * Compound component: `Radio.Group` (with built-in Fieldset), `Radio.Item`, and `Radio.Legend`.
 * Built on `@base-ui/react/radio-group` + `@base-ui/react/radio`.
 *
 * @example
 * ```tsx
 * // Simple: legend as a string prop
 * <Radio.Group legend="Notification preference" defaultValue="email">
 *   <Radio.Item label="Email" value="email" />
 *   <Radio.Item label="SMS" value="sms" />
 *   <Radio.Item label="Push" value="push" />
 * </Radio.Group>
 *
 * // Composable: Radio.Legend for full styling control (e.g. visually hidden)
 * <Radio.Group defaultValue="email">
 *   <Radio.Legend className="sr-only">Notification preference</Radio.Legend>
 *   <Radio.Item label="Email" value="email" />
 *   <Radio.Item label="SMS" value="sms" />
 * </Radio.Group>
 * ```
 */
export const Radio = Object.assign(RadioGroup, {
  Item: RadioItem,
  Group: RadioGroup,
  Legend: RadioLegend,
});
