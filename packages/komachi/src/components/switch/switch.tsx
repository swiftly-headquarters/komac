import { Switch as BaseSwitch } from "@base-ui/react/switch";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type Ref,
  type ReactNode,
  createContext,
  useContext,
} from "react";
import { cn } from "../../utils/cn";
import { resolveVariant } from "../../utils/resolve-variant";
import { Field } from "../field/field";
import { Fieldset } from "@base-ui/react/fieldset";

/** Switch size and variant definitions mapping names to their Tailwind classes. */
export const KOMACHI_SWITCH_VARIANTS = {
  size: {
    sm: {
      classes: "h-4 w-8",
      description: "Small switch for compact UIs",
    },
    base: {
      classes: "h-5 w-10",
      description: "Default switch size",
    },
    lg: {
      classes: "h-6 w-12",
      description: "Large switch for prominent toggles",
    },
  },
  variant: {
    default: {
      classes: "",
      description: "Default switch: segmented track floods brand-colored when on",
    },
    neutral: {
      classes: "",
      description: "Monochrome switch: segmented track floods high-contrast when on",
    },
  },
} as const;

export const KOMACHI_SWITCH_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

// Derived types from KOMACHI_SWITCH_VARIANTS
export type KomachiSwitchSize = keyof typeof KOMACHI_SWITCH_VARIANTS.size;
export type KomachiSwitchVariant = keyof typeof KOMACHI_SWITCH_VARIANTS.variant;

export interface KomachiSwitchVariantsProps {
  /**
   * Switch size.
   * - `"sm"` - Small for compact UIs
   * - `"base"` - Default size
   * - `"lg"` - Large for prominent toggles
   * @default "base"
   */
  size?: KomachiSwitchSize;
  /**
   * Visual variant.
   * - `"default"` - Standard switch appearance
   * - `"error"` - Error state for validation failures
   * @default "default"
   */
  variant?: KomachiSwitchVariant;
}

export function switchVariants({
  size = KOMACHI_SWITCH_DEFAULT_VARIANTS.size,
  variant = KOMACHI_SWITCH_DEFAULT_VARIANTS.variant,
}: KomachiSwitchVariantsProps = {}) {
  const sizeConfig = resolveVariant(
    KOMACHI_SWITCH_VARIANTS.size,
    size,
    KOMACHI_SWITCH_DEFAULT_VARIANTS.size,
  );
  const variantConfig = resolveVariant(
    KOMACHI_SWITCH_VARIANTS.variant,
    variant,
    KOMACHI_SWITCH_DEFAULT_VARIANTS.variant,
  );
  return cn(sizeConfig.classes, variantConfig.classes);
}

// Legacy type aliases for backwards compatibility
export type SwitchSize = KomachiSwitchSize;
export type SwitchVariant = KomachiSwitchVariant;

// Context for passing controlFirst from Group to Items
const SwitchGroupContext = createContext<{ controlFirst: boolean }>({
  controlFirst: true,
});

/**
 * Segmented switch: a two-cell track split by a hairline. The track takes the
 * state color; a neutral cell marks the active side and wipes across when
 * toggled. There is no thumb.
 */
function switchStyles(
  size: KomachiSwitchSize,
  variant: KomachiSwitchVariant,
  checked: boolean,
) {
  const sizes = {
    sm: "h-4 w-8",
    base: "h-5 w-10",
    lg: "h-6 w-12",
  };
  const neutral = variant === "neutral";

  const trackColors = !checked
    ? "bg-komachi-recessed ring-komachi-edge before:bg-komachi-separator not-disabled:hover:ring-komachi-edge-hover"
    : neutral
      ? "bg-komachi-contrast ring-komachi-contrast before:bg-komachi-canvas/25"
      : "bg-komachi-brand ring-komachi-brand-hover before:bg-white/25";

  const track = (extra: Array<string | undefined>) =>
    cn(
      "group relative inline-flex shrink-0 cursor-pointer items-center rounded-md border-none p-0 ring",
      "before:absolute before:inset-y-1 before:left-1/2 before:w-px",
      "transition-colors duration-150 ease-out motion-reduce:transition-none",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-komachi-focus-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      sizes[size],
      trackColors,
      ...extra,
    );

  const indicatorColors = !checked
    ? "bg-komachi-interact"
    : neutral
      ? "bg-komachi-canvas"
      : "bg-white";

  const indicator = cn(
    "pointer-events-none absolute inset-y-px left-px w-[calc(50%-1px)] rounded-[5px] shadow-xs",
    "transition-[transform,translate,background-color,opacity] duration-150 ease-out motion-reduce:transition-none",
    "group-not-disabled:group-active:opacity-80",
    indicatorColors,
    checked && "translate-x-full",
  );

  return { track, thumb: indicator };
}

/**
 * Single switch component props (with built-in Field)
 *
 * Usage patterns:
 *
 * Basic usage:
 * ```tsx
 * <Switch label="Enable notifications" checked={true} onCheckedChange={setChecked} />
 * ```
 *
 * Label first layout:
 * ```tsx
 * <Switch label="Dark mode" checked={false} onCheckedChange={setChecked} controlFirst={false} />
 * ```
 *
 * Neutral variant (monochrome):
 * ```tsx
 * <Switch label="Setting" variant="neutral" checked={false} onCheckedChange={setChecked} />
 * ```
 *
 * @property {string} label - Label text for the switch (Field wrapper is built-in)
 * @property {boolean} [controlFirst] - When true (default), switch appears before label
 */
export type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Visual variant: "default" (brand track) or "neutral" (monochrome track) */
  variant?: SwitchVariant;
  /** Label content for the switch (Field wrapper is built-in) - can be a string or any React node. Optional when used standalone for visual-only purposes. */
  label?: ReactNode;
  /** Tooltip content to display next to the label via an info icon */
  labelTooltip?: ReactNode;
  /**
   * Whether the switch is required.
   * When explicitly false, shows "(optional)" text after the label.
   */
  required?: boolean;
  /** When true (default), switch appears before label. When false, label appears before switch. */
  controlFirst?: boolean;
  size?: KomachiSwitchSize;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  transitioning?: boolean;
};

/**
 * Switch group component props (with built-in Fieldset)
 *
 * Usage:
 * ```tsx
 * <Switch.Group
 *   legend="Notification settings"
 *   error="You must enable at least one notification type"
 * >
 *   <Switch.Item label="Email notifications" value="email" />
 *   <Switch.Item label="SMS notifications" value="sms" />
 * </Switch.Group>
 * ```
 */
/**
 * Props for Switch.Legend - a composable sub-component for labeling a Switch.Group.
 *
 * Place as a direct child of `<Switch.Group>` to provide a styled, accessible legend.
 * Accepts `className` for full styling control (e.g. `className="sr-only"` to visually hide).
 *
 * @example
 * ```tsx
 * <Switch.Group>
 *   <Switch.Legend className="sr-only">Notification settings</Switch.Legend>
 *   <Switch.Item label="Email" value="email" />
 * </Switch.Group>
 * ```
 */
export interface SwitchLegendProps {
  /** Legend content */
  children: ReactNode;
  /** Additional CSS classes (e.g. "sr-only" to visually hide the legend) */
  className?: string;
}

export interface SwitchGroupProps {
  /**
   * Legend text for the group.
   * For more control over legend styling, omit this prop and use `<Switch.Legend>` as a child instead.
   */
  legend?: string;
  /** Child Switch.Item components (and optionally a Switch.Legend) */
  children: ReactNode;
  /** Error message for the group (only appears in groups, not single switches) */
  error?: string;
  /** Helper text for the group */
  description?: ReactNode;
  /** Whether all switches in the group are disabled */
  disabled?: boolean;
  /** When true (default), switch appears before label. When false, label appears before switch. */
  controlFirst?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual switch item within a group
 */
export type SwitchItemProps = {
  /** Visual variant: "default" or "error" for validation failures */
  variant?: SwitchVariant;
  /** Label text displayed next to switch */
  label: string;
  /** Additional CSS classes for the label wrapper */
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: KomachiSwitchSize;
  transitioning?: boolean;
};

// Single switch with built-in Field
const SwitchBase = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      disabled,
      size = "base",
      variant = "default",
      label,
      labelTooltip,
      required,
      controlFirst = true,
      onCheckedChange,
      transitioning,
      id,
      ...props
    },
    ref,
  ) => {
    // For aria-label, only use string labels (ReactNode labels can't be used for aria-label)
    const ariaLabelFallback = typeof label === "string" ? label : "Switch";
    const switchControl = (
      <BaseSwitch.Root
        ref={ref}
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        nativeButton
        render={(rootProps, state) => {
          const {
            ref: rootRef,
            className: baseClassName,
            role: baseRole,
            "aria-checked": _ariaChecked,
            "aria-pressed": _ariaPressed,
            ...restRootProps
          } = rootProps as typeof rootProps & {
            ref?: Ref<HTMLButtonElement>;
            className?: string;
            role?: string;
            "aria-checked"?: boolean;
            "aria-pressed"?: boolean;
          };

          const { track, thumb } = switchStyles(size, variant, state.checked);
          const trackClassName = track([className, baseClassName]);

          const role =
            (props.role as string | undefined) ?? baseRole ?? "switch";
          const checkedA11yProps =
            role === "switch"
              ? { "aria-checked": state.checked }
              : { "aria-pressed": state.checked };

          return (
            <button
              {...restRootProps}
              {...props}
              ref={rootRef}
              data-komachi-component="Switch"
              type="button"
              role={role}
              {...checkedA11yProps}
              aria-busy={transitioning || undefined}
              aria-label={props["aria-label"] ?? ariaLabelFallback}
              className={trackClassName}
            >
              <span className={thumb} />
            </button>
          );
        }}
      />
    );

    // Wrap in Field (built-in) - no description for single switches
    // If no label provided, return bare switch (for use in other components)
    if (!label) {
      return switchControl;
    }

    return (
      <Field
        label={label}
        required={required}
        labelTooltip={labelTooltip}
        controlFirst={controlFirst}
      >
        {switchControl}
      </Field>
    );
  },
);

SwitchBase.displayName = "Switch";

// Switch.Item for use within Switch.Group
const SwitchItem = forwardRef<HTMLButtonElement, SwitchItemProps>(
  (
    {
      className,
      checked,
      disabled,
      size = "base",
      variant = "default",
      label,
      onCheckedChange,
      transitioning,
    },
    ref,
  ) => {
    const { controlFirst } = useContext(SwitchGroupContext);

    return (
      <label
        data-komachi-component="Switch"
        data-komachi-part="item-label"
        className={cn(
          "relative m-0 inline-flex items-center gap-2",
          // Control first (default): switch before label
          // Label first: label before switch using flex-row-reverse
          !controlFirst && "flex-row-reverse justify-end",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
      >
        <BaseSwitch.Root
          ref={ref}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          nativeButton
          render={(rootProps, state) => {
            const {
              ref: rootRef,
              className: baseClassName,
              role: baseRole,
              "aria-checked": _ariaChecked,
              "aria-pressed": _ariaPressed,
              ...restRootProps
            } = rootProps as typeof rootProps & {
              ref?: Ref<HTMLButtonElement>;
              className?: string;
              role?: string;
              "aria-checked"?: boolean;
              "aria-pressed"?: boolean;
            };

            const { track, thumb } = switchStyles(size, variant, state.checked);
            const trackClassName = track([baseClassName]);

            const role = baseRole ?? "switch";
            const checkedA11yProps =
              role === "switch"
                ? { "aria-checked": state.checked }
                : { "aria-pressed": state.checked };

            return (
              <button
                {...restRootProps}
                ref={rootRef}
                data-komachi-component="Switch"
                data-komachi-part="item"
                type="button"
                role={role}
                {...checkedA11yProps}
                aria-busy={transitioning || undefined}
                className={trackClassName}
              >
                <span className={thumb} />
              </button>
            );
          }}
        />
        <span className="text-base font-medium text-komachi-default">{label}</span>
      </label>
    );
  },
);

SwitchItem.displayName = "Switch.Item";

// Switch.Legend - composable legend sub-component for Switch.Group
function SwitchLegend({ children, className }: SwitchLegendProps) {
  return (
    <Fieldset.Legend
      className={cn("text-base font-medium text-komachi-default", className)}
    >
      {children}
    </Fieldset.Legend>
  );
}

SwitchLegend.displayName = "Switch.Legend";

// Switch.Group with built-in Fieldset
function SwitchGroup({
  legend,
  children,
  error,
  description,
  disabled,
  controlFirst = true,
  className,
}: SwitchGroupProps) {
  return (
    <SwitchGroupContext.Provider value={{ controlFirst }}>
      <Fieldset.Root
        className={cn("flex flex-col gap-4", className)}
        disabled={disabled}
      >
        {legend && (
          <Fieldset.Legend className="text-base font-medium text-komachi-default">
            {legend}
          </Fieldset.Legend>
        )}
        <div className="flex flex-col gap-2">{children}</div>
        {error && <p className="text-sm text-komachi-danger">{error}</p>}
        {description && (
          <p className="text-sm text-komachi-subtle">{description}</p>
        )}
      </Fieldset.Root>
    </SwitchGroupContext.Provider>
  );
}

// Compound component
export const Switch = Object.assign(SwitchBase, {
  Item: SwitchItem,
  Group: SwitchGroup,
  Legend: SwitchLegend,
});

Switch.displayName = "Switch";
