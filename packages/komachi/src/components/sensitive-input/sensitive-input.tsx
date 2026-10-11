import { Eye, EyeSlash } from "@phosphor-icons/react";
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { Input as BaseInput } from "@base-ui/react/input";
import {
  inputVariants,
  KOMACHI_INPUT_VARIANTS,
  type KomachiInputSize,
  type KomachiInputVariant,
} from "../input/input";
import { Field, type FieldErrorMatch } from "../field/field";

export const KOMACHI_SENSITIVE_INPUT_VARIANTS = KOMACHI_INPUT_VARIANTS;

export const KOMACHI_SENSITIVE_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

type Mode = "masked" | "revealed" | "empty";

/**
 * SensitiveInput component props.
 *
 * @example
 * ```tsx
 * <SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />
 * <SensitiveInput label="Secret" value={secret} onValueChange={setSecret} />
 * ```
 */
export interface SensitiveInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "type" | "value" | "defaultValue"
> {
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Simplified change handler receiving just the value */
  onValueChange?: (value: string) => void;
  /**
   * Size of the input.
   * - `"xs"` - Extra small for compact UIs
   * - `"sm"` - Small for secondary fields
   * - `"base"` - Default input size
   * - `"lg"` - Large for prominent fields
   * @default "base"
   */
  size?: KomachiInputSize;
  /**
   * Style variant of the input.
   * - `"default"` - Default input appearance
   * - `"error"` - Error state for validation failures
   * @default "default"
   */
  variant?: KomachiInputVariant;
  /** Label content for the input (enables Field wrapper and sets masked state label) - can be a string or any React node */
  label?: ReactNode;
  /** Tooltip content to display next to the label via an info icon */
  labelTooltip?: ReactNode;
  /** Helper text displayed below the input */
  description?: ReactNode;
  /** Error message or validation error object */
  error?: string | { message: ReactNode; match: FieldErrorMatch };
}

/**
 * Password/secret input that masks its value by default and reveals on click.
 *
 * @example
 * ```tsx
 * <SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />
 * ```
 */
export const SensitiveInput = forwardRef<HTMLInputElement, SensitiveInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onValueChange,
      size = KOMACHI_SENSITIVE_INPUT_DEFAULT_VARIANTS.size,
      variant: variantProp,
      disabled = false,
      readOnly = false,
      id,
      autoComplete = "off",
      className,
      label,
      labelTooltip,
      description,
      error,
      required,
      ...inputProps
    },
    ref,
  ) => {
    // Deprecation warning for variant="error"
    if (process.env.NODE_ENV !== "production" && variantProp === "error") {
      console.warn(
        '[Komachi SensitiveInput]: variant="error" is deprecated. ' +
          "Error styling is now automatically applied when the `error` prop is truthy. " +
          "Simply remove the variant prop and pass an error message instead.",
      );
    }

    // Auto-apply error styling when error prop is truthy
    // Explicit variant prop takes precedence for backwards compatibility
    const variant = variantProp ?? (error ? "error" : "default");
    // For aria-label, only use string labels (ReactNode labels can't be used for aria-label)
    const ariaLabelFallback =
      typeof label === "string" ? label : "Sensitive value";
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = isControlled ? controlledValue : internalValue;
    const hasValue = value.length > 0;

    const [mode, setMode] = useState<Mode>(() =>
      hasValue ? "masked" : "empty",
    );

    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const liveRegionId = useId();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const maskedInstructionId = useId();

    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // Sync mode when value changes externally
    const prevHasValueRef = useRef(hasValue);
    if (prevHasValueRef.current !== hasValue) {
      prevHasValueRef.current = hasValue;
      if (!hasValue && mode === "masked") {
        setMode("empty");
      }
    }

    const handleContainerClick = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        // Ignore clicks that originated from outside (e.g., label click focusing input)
        // Label clicks trigger a click on the input, but the click coordinates are outside the container
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const isClickInsideContainer =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (!isClickInsideContainer) return;
        }
        if (mode === "masked" && hasValue) {
          setMode("revealed");
          if (!readOnly) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }
      },
      [mode, hasValue, disabled, readOnly],
    );

    const handleToggleVisibility = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (mode === "revealed") {
          setMode("masked");
        } else if (mode === "empty" && hasValue) {
          setMode("revealed");
        }
      },
      [mode, hasValue],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        // When typing into an empty field, switch to revealed mode
        // so the input shows as type="text" instead of type="password"
        if (mode === "empty" && newValue.length > 0) {
          setMode("revealed");
        }
        onChange?.(e);
        onValueChange?.(newValue);
      },
      [isControlled, onChange, onValueChange, mode],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        // Don't mask if focus is moving to a button inside the container (the eye button)
        if (
          containerRef.current &&
          e.relatedTarget instanceof Node &&
          containerRef.current.contains(e.relatedTarget)
        ) {
          return;
        }
        if (hasValue) {
          setMode("masked");
        }
      },
      [hasValue],
    );

    const handleContainerKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (mode === "masked" && hasValue) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMode("revealed");
            if (!readOnly) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }
      },
      [mode, hasValue, disabled, readOnly],
    );

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (mode === "revealed" && e.key === "Escape") {
          setMode("masked");
          // Move focus to container to avoid focus trap (input becomes tabIndex={-1})
          setTimeout(() => containerRef.current?.focus(), 0);
        }
      },
      [mode],
    );

    const isMaskedWithValue = mode === "masked" && hasValue;
    const showEyeButton =
      !disabled && (mode === "revealed" || (mode === "empty" && hasValue));

    // Icon sizes matching input sizes
    const iconSize = size === "xs" || size === "sm" ? "size-3" : "size-4";

    const containerClassName = cn(
      inputVariants({ size, variant, parentFocusIndicator: true }),
      "group/container relative flex w-full items-center",
      // Show browser-native focus outline on container when child input is focused
      "focus-within:outline-2 focus-within:outline-komachi-focus",
      isMaskedWithValue && !disabled && "cursor-pointer",
      disabled && "cursor-not-allowed",
      className,
    );

    const containerContent = (
      <>
        {/* Input - defines the width, always rendered */}
        <BaseInput
          ref={mergedRef}
          id={inputId}
          type={mode === "revealed" ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          readOnly={readOnly || isMaskedWithValue}
          autoComplete={autoComplete}
          tabIndex={isMaskedWithValue ? -1 : 0}
          className={cn(
            "komachi-input-placeholder w-full border-0 bg-transparent p-0 text-komachi-default ring-0 outline-none transition-colors duration-300 ease-out disabled:cursor-not-allowed disabled:text-komachi-subtle motion-reduce:transition-none",
            size === "xs" && "pr-5",
            size === "sm" && "pr-6",
            size === "base" && "pr-8",
            size === "lg" && "pr-10",
            isMaskedWithValue && "pointer-events-none text-transparent",
          )}
          aria-hidden={isMaskedWithValue}
          {...inputProps}
        />

        {/* Mask overlay - absolutely positioned, doesn't affect layout */}
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden select-none",
            // Match input pr padding (space for icon)
            size === "xs" && "right-5",
            size === "sm" && "right-6",
            size === "base" && "right-8",
            size === "lg" && "right-10",
            // Match the padding from inputVariants
            size === "xs" && "px-1.5",
            size === "sm" && "px-2",
            size === "base" && "px-3",
            size === "lg" && "px-4",
            // Fades out when revealed, so the dots and the real text crossfade
            "transition-opacity duration-300 ease-out motion-reduce:transition-none",
            !isMaskedWithValue && "opacity-0",
            // When masked: enable pointer events
            isMaskedWithValue && "pointer-events-auto",
            // Text color - use text-komachi-default to contrast with bg-komachi-control input background
            "text-komachi-default",
            // Hover state - pure CSS, no React state (group for children)
            "group/mask",
          )}
          aria-hidden="true"
        >
          {/* Both texts rendered, stacked. Visibility toggled on hover to prevent layout shift */}
          <span className="relative">
            <span
              className={cn(
                "transition-opacity duration-300 ease-out motion-reduce:transition-none",
                isMaskedWithValue &&
                  !disabled &&
                  "group-focus-within/container:opacity-0 group-hover/mask:opacity-0",
              )}
            >
              ••••••••
            </span>
            {isMaskedWithValue && !disabled && (
              <span className="absolute top-0 left-0 whitespace-nowrap text-komachi-subtle opacity-0 transition-opacity duration-300 ease-out motion-reduce:transition-none group-focus-within/container:opacity-100 group-hover/mask:opacity-100">
                Click to reveal
              </span>
            )}
          </span>
        </span>

        {/* Eye button - absolutely positioned to the right */}
        <button
          type="button"
          data-komachi-component="SensitiveInput"
          data-komachi-part="toggle-visibility"
          onClick={handleToggleVisibility}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={mode === "revealed" ? "Hide value" : "Reveal value"}
          tabIndex={showEyeButton ? 0 : -1}
          className={cn(
            "absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-komachi-subtle hover:text-komachi-default focus:text-komachi-default focus:ring-komachi-focus-ring focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-komachi-focus-ring",
            // Defensive styles to prevent global CSS pollution (e.g., button { background: gray })
            "m-0 inline-flex h-auto min-h-0 items-center justify-center border-none bg-transparent p-0 shadow-none",
            // Match right padding from inputVariants
            size === "xs" && "right-1.5",
            size === "sm" && "right-2",
            size === "base" && "right-3",
            size === "lg" && "right-4",
            iconSize,
            "transition-opacity duration-300 ease-out motion-reduce:transition-none",
            !showEyeButton && "pointer-events-none opacity-0",
          )}
        >
          {/* Both icons stacked and crossfaded, so the swap reads as a morph */}
          <span className="relative block size-full">
            <Eye
              className={cn(
                "absolute inset-0 size-full transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none",
                mode === "revealed" ? "scale-75 opacity-0" : "opacity-100",
              )}
            />
            <EyeSlash
              className={cn(
                "absolute inset-0 size-full transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none",
                mode === "revealed" ? "opacity-100" : "scale-75 opacity-0",
              )}
            />
          </span>
        </button>
      </>
    );

    const input = (
      <div>
        {isMaskedWithValue ? (
          <div
            ref={containerRef}
            // Cannot use <button> here because containerContent contains interactive button elements (Reveal).
            // Using role="button" with proper keyboard handling instead.
            // oxlint-disable-next-line prefer-tag-over-role
            role="button"
            data-komachi-component="SensitiveInput"
            data-komachi-part="masked-container"
            tabIndex={disabled ? -1 : 0}
            className={containerClassName}
            onClick={handleContainerClick}
            onKeyDown={handleContainerKeyDown}
            aria-label={`${ariaLabelFallback}, masked.`}
            aria-describedby={`${maskedInstructionId} ${liveRegionId}`}
            aria-disabled={disabled}
          >
            {containerContent}
          </div>
        ) : (
          <div ref={containerRef} className={containerClassName}>
            {containerContent}
          </div>
        )}
        {isMaskedWithValue && (
          <span id={maskedInstructionId} className="sr-only">
            Click or press Enter to reveal.
          </span>
        )}
        <span id={liveRegionId} className="sr-only" aria-live="polite">
          {mode === "masked" && hasValue && "Value hidden"}
        </span>
      </div>
    );

    // Render with Field wrapper if label is provided
    if (label) {
      return (
        <Field
          label={label}
          required={required}
          labelTooltip={labelTooltip}
          description={description}
          error={
            error
              ? typeof error === "string"
                ? { message: error, match: true }
                : error
              : undefined
          }
        >
          {input}
        </Field>
      );
    }

    // Render bare input without Field wrapper
    return input;
  },
);

SensitiveInput.displayName = "SensitiveInput";
