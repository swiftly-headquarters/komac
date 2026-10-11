import { XIcon } from "@phosphor-icons/react";
import { Field as FieldBase } from "@base-ui/react/field";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "../button/button";
import {
  Field,
  normalizeFieldError,
  type FieldErrorMatch,
} from "../field/field";
import { cn } from "../../utils/cn";
import { inputVariants, type KomachiInputVariant } from "../input/input";

/** How long a removed chip lingers to play its exit animation. */
const CHIP_EXIT_MS = 160;

export const KOMACHI_TAG_INPUT_VARIANTS = {
  variant: {
    default: { classes: "", description: "Default tag input appearance." },
    error: { classes: "", description: "Error state for validation failures." },
  },
} as const;

export const KOMACHI_TAG_INPUT_DEFAULT_VARIANTS = {
  variant: "default",
} as const;

export const KOMACHI_TAG_INPUT_STYLING = {
  baseClasses: "flex flex-wrap items-center",
} as const;

/** Labels for TagInput feedback and controls. Override these for localization. */
export interface TagInputLabels {
  /** Accessible name used when neither `label` nor `aria-label` is provided. */
  input?: string;
  /** Accessible name for a tag's remove button. */
  removeValue?: (value: string) => string;
  /** Validation feedback shown when `validateValue` rejects a value. */
  invalidValue?: (value: string) => string;
  /** Feedback shown when adding a tag would exceed `maxValues`. */
  maxValuesReached?: (maxValues: number) => string;
}

const DEFAULT_LABELS: Required<TagInputLabels> = {
  input: "Add tag",
  removeValue: (value) => `Remove ${value}`,
  invalidValue: (value) => `"${value}" is not valid.`,
  maxValuesReached: (maxValues) => `Limit of ${maxValues} tags reached.`,
};

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "defaultValue" | "disabled" | "size" | "value"
>;

export interface TagInputProps extends NativeInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  validateValue?: (value: string, acceptedValues: string[]) => boolean;
  maxValues?: number;
  /** Translated labels for generated input, action, and validation text. */
  labels?: TagInputLabels;
  label?: ReactNode;
  labelTooltip?: ReactNode;
  description?: ReactNode;
  error?: string | { message: ReactNode; match: FieldErrorMatch };
  variant?: KomachiInputVariant;
  disabled?: boolean;
}

function splitValues(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value,
      defaultValue = [],
      onValueChange,
      validateValue,
      maxValues,
      labels,
      label,
      labelTooltip,
      description,
      error,
      variant,
      disabled,
      className,
      placeholder,
      id,
      autoComplete = "off",
      onBlur,
      onChange,
      onKeyDown: onKeyDownProp,
      onPaste: onPasteProp,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [inputValue, setInputValue] = useState("");
    const [message, setMessage] = useState<string>();
    const inputId = useId();
    const values = value ?? uncontrolledValue;
    // Removed chips linger as inert ghosts while their exit animation plays.
    // Chips present on mount render without the enter animation.
    const initialItems = useRef(values);
    const [exiting, setExiting] = useState<{ item: string; index: number }[]>(
      [],
    );
    useEffect(() => {
      if (exiting.length === 0) return;
      const timer = setTimeout(() => setExiting([]), CHIP_EXIT_MS);
      return () => clearTimeout(timer);
    }, [exiting]);

    const setValues = (nextValue: string[]) => {
      const removed = values
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !nextValue.includes(item));
      if (removed.length > 0) setExiting(removed);
      if (value === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    };

    const commit = (rawValue: string) => {
      const entries = splitValues(rawValue);
      const nextValues = [...values];
      for (let index = 0; index < entries.length; index += 1) {
        const entry = entries[index];
        if (nextValues.includes(entry)) continue;
        if (maxValues !== undefined && nextValues.length >= maxValues) {
          setInputValue(entries.slice(index).join(", "));
          setMessage(
            (labels?.maxValuesReached ?? DEFAULT_LABELS.maxValuesReached)(
              maxValues,
            ),
          );
          setValues(nextValues);
          return false;
        }
        if (validateValue && !validateValue(entry, nextValues)) {
          setInputValue(entries.slice(index).join(", "));
          setMessage(
            (labels?.invalidValue ?? DEFAULT_LABELS.invalidValue)(entry),
          );
          setValues(nextValues);
          return false;
        }
        nextValues.push(entry);
      }
      setValues(nextValues);
      setInputValue("");
      setMessage(undefined);
      return true;
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDownProp?.(event);
      if (event.defaultPrevented) return;
      if (!inputValue && event.key === "Backspace") {
        setValues(values.slice(0, -1));
        return;
      }
      if (!inputValue || !["Enter", ",", "Tab"].includes(event.key)) return;
      const didCommit = commit(inputValue);
      if (event.key !== "Tab" || didCommit) event.preventDefault();
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      onPasteProp?.(event);
      if (event.defaultPrevented) return;
      const text = event.clipboardData.getData("text");
      if (!/[\n,]/.test(text)) return;
      event.preventDefault();
      commit(text);
    };

    const fieldError =
      normalizeFieldError(error) ?? normalizeFieldError(message);
    const inputVariant = variant ?? (fieldError ? "error" : "default");
    const chipClassName = cn(
      "flex w-fit max-w-full shrink-0 items-center gap-2.5 rounded-md bg-komachi-overlay ring-1 ring-komachi-edge",
      "h-6 py-0 pr-[3px] pl-2 text-sm",
    );
    const input = (controlProps?: ComponentPropsWithoutRef<"input">) => (
      <input
        {...controlProps}
        {...inputProps}
        ref={forwardedRef}
        aria-invalid={Boolean(fieldError)}
        aria-label={
          inputProps["aria-label"] ??
          (typeof label === "string"
            ? label
            : (labels?.input ?? DEFAULT_LABELS.input))
        }
        className={cn(
          "min-w-32 flex-1 border-0 bg-transparent outline-none",
          "px-1 py-0.5",
        )}
        disabled={disabled}
        autoComplete={autoComplete}
        id={controlProps?.id ?? id ?? inputId}
        placeholder={placeholder}
        value={inputValue}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.defaultPrevented) commit(inputValue);
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
          setMessage(undefined);
          onChange?.(event);
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    );
    const hasField = Boolean(label || description || fieldError);
    const renderedChips = values.map((item) => ({ item, ghost: false }));
    for (const { item, index } of exiting) {
      renderedChips.splice(Math.min(index, renderedChips.length), 0, {
        item,
        ghost: true,
      });
    }
    const control = (
      <div
        className={cn(
          inputVariants({
            variant: inputVariant,
            parentFocusIndicator: true,
          }),
          "flex h-auto min-h-9 flex-wrap items-center gap-x-2 gap-y-1.5 px-2 py-1.5",
          className,
        )}
      >
        {renderedChips.map(({ item, ghost }) => (
          <span
            key={ghost ? `exit:${item}` : item}
            aria-hidden={ghost || undefined}
            className={cn(
              chipClassName,
              "text-komachi-default",
              ghost
                ? "pointer-events-none animate-chip-out overflow-hidden"
                : !initialItems.current.includes(item) &&
                    "animate-chip-in motion-reduce:animate-none",
            )}
          >
            <span className="truncate">{item}</span>
            <Button
              aria-label={(labels?.removeValue ?? DEFAULT_LABELS.removeValue)(
                item,
              )}
              icon={<XIcon size={10} />}
              shape="square"
              size="xs"
              variant="ghost"
              disabled={disabled || ghost}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                setValues(values.filter((value) => value !== item))
              }
            />
          </span>
        ))}
        {hasField ? (
          <FieldBase.Control render={(controlProps) => input(controlProps)} />
        ) : (
          input()
        )}
      </div>
    );
    if (hasField) {
      return (
        <Field
          label={label ?? ""}
          labelTooltip={labelTooltip}
          description={description}
          error={fieldError}
        >
          {control}
        </Field>
      );
    }

    return control;
  },
);
TagInput.displayName = "TagInput";
