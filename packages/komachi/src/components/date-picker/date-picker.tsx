import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  DayPicker,
  type CustomComponents,
  type PropsBase,
  type PropsSingle,
  type PropsSingleRequired,
  type PropsMulti,
  type PropsMultiRequired,
  type PropsRange,
  type PropsRangeRequired,
} from "react-day-picker";
import { cn } from "../../utils/cn";

/**
 * Custom Chevron component using Phosphor icons
 */
const Chevron: CustomComponents["Chevron"] = ({ orientation, ...props }) => {
  const Icon = orientation === "left" ? CaretLeftIcon : CaretRightIcon;
  return <Icon size={16} {...props} />;
};

type ChooserView = "days" | "months" | "years";

/** Lets the caption button (rendered inside DayPicker) open the chooser panel. */
const OpenChooserContext = createContext<() => void>(() => {});

/** Caption label turned into a button that opens the month/year chooser. */
const CaptionLabel: CustomComponents["CaptionLabel"] = ({
  children,
  ...props
}) => {
  const openChooser = useContext(OpenChooserContext);
  return (
    <button
      type="button"
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      role={undefined}
      aria-haspopup="dialog"
      onClick={openChooser}
      className={cn(
        props.className,
        "-mx-1.5 cursor-pointer gap-1 rounded-md bg-transparent px-1.5 py-0.5 text-inherit not-disabled:hover:bg-komachi-tint not-disabled:active:bg-komachi-fill-active focus-visible:ring-2 focus-visible:ring-komachi-focus-ring focus-visible:outline-none",
      )}
    >
      {children}
      <CaretDownIcon size={12} weight="bold" aria-hidden />
    </button>
  );
};

const CHOOSER_PAGE = 12;

const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();

interface ChooserCellProps {
  label: string;
  selected: boolean;
  current: boolean;
  disabled: boolean;
  onPick: () => void;
}

function ChooserCell({
  label,
  selected,
  current,
  disabled,
  onPick,
}: ChooserCellProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={onPick}
      className={cn(
        "flex size-full cursor-pointer items-center justify-center rounded-md text-sm text-komachi-default",
        "focus-visible:ring-2 focus-visible:ring-komachi-focus-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
        selected
          ? "bg-komachi-brand font-medium !text-white not-disabled:hover:bg-komachi-brand-hover"
          : "not-disabled:hover:bg-komachi-tint not-disabled:active:bg-komachi-fill-active",
        current && !selected && "font-semibold ring ring-komachi-edge",
      )}
    >
      {label}
    </button>
  );
}

interface ChooserPanelProps {
  view: "months" | "years";
  setView: (view: ChooserView) => void;
  month: Date;
  onPickMonth: (month: Date) => void;
  startMonth?: Date;
  endMonth?: Date;
  localeCode?: string;
}

const NAV_BUTTON =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-komachi-default not-disabled:hover:bg-komachi-tint not-disabled:active:bg-komachi-fill-active focus-visible:ring-2 focus-visible:ring-komachi-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";
const TITLE =
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm font-semibold text-komachi-default";

/** Month grid, and a paged year grid reached from its header. */
function ChooserPanel({
  view,
  setView,
  month,
  onPickMonth,
  startMonth,
  endMonth,
  localeCode,
}: ChooserPanelProps) {
  const [year, setYear] = useState(month.getFullYear());
  const [page, setPage] = useState(year - (year % CHOOSER_PAGE));
  const ref = useRef<HTMLDivElement>(null);
  const now = new Date();

  // Land keyboard focus on the current choice each time the grid changes.
  useEffect(() => {
    ref.current
      ?.querySelector<HTMLElement>('[data-selected="true"]:not(:disabled)')
      ?.focus({ preventScroll: true });
  }, [view]);

  const monthOutOfRange = (index: number) =>
    (startMonth !== undefined && index < monthIndex(startMonth)) ||
    (endMonth !== undefined && index > monthIndex(endMonth));
  const yearOutOfRange = (y: number) =>
    (startMonth !== undefined && y < startMonth.getFullYear()) ||
    (endMonth !== undefined && y > endMonth.getFullYear());

  const monthLabel = (m: number) =>
    new Intl.DateTimeFormat(localeCode, { month: "short" }).format(
      new Date(2000, m, 1),
    );

  const shift = (direction: -1 | 1) =>
    view === "months"
      ? setYear((y) => y + direction)
      : setPage((p) => p + direction * CHOOSER_PAGE);
  const prevBlocked =
    view === "months" ? yearOutOfRange(year - 1) : yearOutOfRange(page - 1);
  const nextBlocked =
    view === "months"
      ? yearOutOfRange(year + 1)
      : yearOutOfRange(page + CHOOSER_PAGE);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    // Close the chooser only, not an enclosing popover.
    event.stopPropagation();
    setView(view === "years" ? "months" : "days");
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={view === "months" ? "Choose month" : "Choose year"}
      onKeyDown={onKeyDown}
      className="rdp-panel absolute inset-0 z-10 flex flex-col rounded-xl bg-komachi-base p-2"
    >
      <div className="flex h-10 items-center justify-between">
        <button
          type="button"
          aria-label={view === "months" ? "Previous year" : "Previous years"}
          disabled={prevBlocked}
          onClick={() => shift(-1)}
          className={NAV_BUTTON}
        >
          <CaretLeftIcon size={16} />
        </button>
        {view === "months" ? (
          <button
            type="button"
            onClick={() => {
              setPage(year - (year % CHOOSER_PAGE));
              setView("years");
            }}
            className={cn(
              TITLE,
              "cursor-pointer hover:bg-komachi-tint focus-visible:ring-2 focus-visible:ring-komachi-focus-ring focus-visible:outline-none",
            )}
          >
            {year}
            <CaretDownIcon size={12} weight="bold" aria-hidden />
          </button>
        ) : (
          <span className={TITLE}>
            {page} – {page + CHOOSER_PAGE - 1}
          </span>
        )}
        <button
          type="button"
          aria-label={view === "months" ? "Next year" : "Next years"}
          disabled={nextBlocked}
          onClick={() => shift(1)}
          className={NAV_BUTTON}
        >
          <CaretRightIcon size={16} />
        </button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-1">
        {view === "months"
          ? Array.from({ length: 12 }, (_, m) => (
              <ChooserCell
                key={m}
                label={monthLabel(m)}
                selected={year === month.getFullYear() && m === month.getMonth()}
                current={year === now.getFullYear() && m === now.getMonth()}
                disabled={monthOutOfRange(year * 12 + m)}
                onPick={() => onPickMonth(new Date(year, m, 1))}
              />
            ))
          : Array.from({ length: CHOOSER_PAGE }, (_, i) => {
              const y = page + i;
              return (
                <ChooserCell
                  key={y}
                  label={String(y)}
                  selected={y === year}
                  current={y === now.getFullYear()}
                  disabled={yearOutOfRange(y)}
                  onPick={() => {
                    setYear(y);
                    setView("months");
                  }}
                />
              );
            })}
      </div>
    </div>
  );
}

/** The month a single/multiple/range selection points at, if any. */
function selectedMonth(selected: unknown): Date | undefined {
  if (selected instanceof Date) return selected;
  if (Array.isArray(selected)) return selected[0];
  if (selected && typeof selected === "object" && "from" in selected) {
    return (selected as { from?: Date }).from;
  }
  return undefined;
}

/** Base props shared across all DatePicker modes */
type BaseProps = Omit<PropsBase, "classNames"> & {
  /** Additional CSS classes merged via `cn()`. */
  className?: string;
  /** Custom class names for internal elements */
  classNames?: PropsBase["classNames"];
};

/** Single date selection (optional) */
type SingleProps = BaseProps &
  Omit<PropsSingle, "onSelect" | "classNames"> & {
    onChange?: PropsSingle["onSelect"];
  };

/** Single date selection (required) */
type SingleRequiredProps = BaseProps &
  Omit<PropsSingleRequired, "onSelect" | "classNames"> & {
    onChange?: PropsSingleRequired["onSelect"];
  };

/** Multiple date selection (optional) */
type MultipleProps = BaseProps &
  Omit<PropsMulti, "onSelect" | "classNames"> & {
    onChange?: PropsMulti["onSelect"];
  };

/** Multiple date selection (required) */
type MultipleRequiredProps = BaseProps &
  Omit<PropsMultiRequired, "onSelect" | "classNames"> & {
    onChange?: PropsMultiRequired["onSelect"];
  };

/** Date range selection (optional) */
type RangeProps = BaseProps &
  Omit<PropsRange, "onSelect" | "classNames"> & {
    onChange?: PropsRange["onSelect"];
  };

/** Date range selection (required) */
type RangeRequiredProps = BaseProps &
  Omit<PropsRangeRequired, "onSelect" | "classNames"> & {
    onChange?: PropsRangeRequired["onSelect"];
  };

/**
 * DatePicker props - discriminated union based on `mode`.
 * Uses `onChange` instead of `onSelect` for Komachi consistency.
 * Full type inference is preserved via the discriminated union.
 */
export type DatePickerProps =
  | SingleProps
  | SingleRequiredProps
  | MultipleProps
  | MultipleRequiredProps
  | RangeProps
  | RangeRequiredProps;

/**
 * DatePicker - a date selection calendar.
 *
 * Built on [react-day-picker](https://daypicker.dev) with Komachi styling.
 * Supports three selection modes: single, multiple, and range.
 *
 * @example
 * ```tsx
 * // Single date selection
 * const [date, setDate] = useState<Date>();
 * <DatePicker mode="single" selected={date} onChange={setDate} />
 *
 * // Multiple date selection
 * const [dates, setDates] = useState<Date[]>([]);
 * <DatePicker mode="multiple" selected={dates} onChange={setDates} max={5} />
 *
 * // Date range selection
 * const [range, setRange] = useState<DateRange>();
 * <DatePicker mode="range" selected={range} onChange={setRange} numberOfMonths={2} />
 * ```
 */
export function DatePicker({
  className,
  classNames,
  onChange,
  ...props
}: DatePickerProps) {
  const [view, setView] = useState<ChooserView>("days");
  const [internalMonth, setInternalMonth] = useState<Date>(
    () =>
      props.defaultMonth ??
      selectedMonth((props as { selected?: unknown }).selected) ??
      new Date(),
  );
  const month = props.month ?? internalMonth;
  const goToMonth = (next: Date) => {
    setInternalMonth(next);
    props.onMonthChange?.(next);
  };

  return (
    <div className="relative w-fit">
      <OpenChooserContext.Provider value={() => setView("months")}>
        <DayPicker
          showOutsideDays
          animate
          weekStartsOn={1}
          {...props}
          month={month}
          onMonthChange={goToMonth}
          onSelect={onChange as never}
          classNames={{
            ...classNames,
            root: cn(
              "rdp-root rounded-xl bg-komachi-base select-none",
              classNames?.root,
              className,
            ),
          }}
          components={{
            Chevron,
            CaptionLabel,
            ...props.components,
          }}
        />
      </OpenChooserContext.Provider>
      {view !== "days" && (
        <ChooserPanel
          view={view}
          setView={setView}
          month={month}
          onPickMonth={(next) => {
            goToMonth(next);
            setView("days");
          }}
          startMonth={props.startMonth}
          endMonth={props.endMonth}
          localeCode={props.locale?.code}
        />
      )}
    </div>
  );
}

DatePicker.displayName = "DatePicker";
