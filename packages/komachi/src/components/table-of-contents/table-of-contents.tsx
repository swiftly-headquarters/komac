import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils/cn";

/** TableOfContents item state variant definitions. */
export const KOMACHI_TABLE_OF_CONTENTS_VARIANTS = {
  state: {
    default: {
      classes:
        "text-komachi-subtle hover:border-komachi-edge-hover hover:text-komachi-default hover:font-medium",
      description: "Inactive section link",
    },
    active: {
      classes:
        "border-komachi-brand font-medium text-komachi-default in-data-[toc-indicator]:border-transparent",
      description: "Currently visible / active section",
    },
  },
} as const;

export const KOMACHI_TABLE_OF_CONTENTS_DEFAULT_VARIANTS = {
  state: "default",
} as const;

export type KomachiTableOfContentsState =
  keyof typeof KOMACHI_TABLE_OF_CONTENTS_VARIANTS.state;

const ITEM_BASE =
  "block w-full truncate border-l-2 border-transparent py-0.5 pl-4 text-sm text-left no-underline";

export type TableOfContentsProps = React.HTMLAttributes<HTMLElement>;

const TableOfContentsRoot = forwardRef<HTMLElement, TableOfContentsProps>(
  (
    { className, "aria-label": ariaLabel = "Table of contents", ...props },
    ref,
  ) => (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...props} />
  ),
);

export type TableOfContentsTitleProps =
  React.HTMLAttributes<HTMLParagraphElement>;

const TableOfContentsTitle = forwardRef<
  HTMLParagraphElement,
  TableOfContentsTitleProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mb-3 text-xs font-semibold tracking-wide text-komachi-subtle uppercase",
      className,
    )}
    {...props}
  />
));

/**
 * Brand bar that slides to whichever item in the list is `aria-current`.
 * Rendered by `TableOfContents.List`; items hide their own active border
 * (via `in-data-[toc-indicator]`) so only this bar carries the color.
 */
function ActiveIndicator() {
  const ref = useRef<HTMLLIElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; h: number } | null>(
    null,
  );
  // Slide only after the first placement, so the bar doesn't fly in on mount.
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    const list = ref.current?.parentElement;
    if (!list) return;
    const measure = () => {
      const current = list.querySelector<HTMLElement>('[aria-current="true"]');
      if (!current) {
        setBox(null);
        return;
      }
      const l = list.getBoundingClientRect();
      const r = current.getBoundingClientRect();
      setBox({
        x: r.left - l.left - list.clientLeft,
        y: r.top - l.top - list.clientTop,
        h: r.height,
      });
    };
    measure();
    const mutations = new MutationObserver(measure);
    mutations.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-current"],
    });
    const resizes =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    resizes?.observe(list);
    return () => {
      mutations.disconnect();
      resizes?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (box && !armed) {
      const frame = requestAnimationFrame(() => setArmed(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [box, armed]);

  return (
    <li
      ref={ref}
      aria-hidden="true"
      role="presentation"
      className={cn(
        "pointer-events-none absolute top-0 left-0 w-0.5 rounded-full bg-komachi-brand",
        armed &&
          "transition-[translate,height,opacity] duration-180 ease-out motion-reduce:transition-none",
        box ? "opacity-100" : "opacity-0",
      )}
      style={
        box ? { translate: `${box.x}px ${box.y}px`, height: box.h } : undefined
      }
    />
  );
}

export type TableOfContentsListProps = React.HTMLAttributes<HTMLUListElement>;

const TableOfContentsList = forwardRef<
  HTMLUListElement,
  TableOfContentsListProps
>(({ className, children, ...props }, ref) => (
  <ul
    ref={ref}
    data-toc-indicator=""
    className={cn(
      "relative flex flex-col gap-2 border-l-2 border-komachi-separator",
      className,
    )}
    {...props}
  >
    <ActiveIndicator />
    {children}
  </ul>
));
export interface TableOfContentsItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether this item represents the currently active section. */
  active?: boolean;
  /**
   * Custom element to render as the link. Use this to integrate with
   * framework routers (e.g., Next.js `<Link>`, React Router `<NavLink>`).
   * The element receives all anchor props including `href`, `className`, and `children`.
   *
   * @example
   * ```tsx
   * <TableOfContents.Item render={<Link />} href="/intro" active>
   *   Introduction
   * </TableOfContents.Item>
   * ```
   */
  render?: React.ReactElement;
}

const TableOfContentsItem = forwardRef<
  HTMLAnchorElement,
  TableOfContentsItemProps
>(({ active = false, className, children, render, ...props }, ref) => {
  const stateClasses = active
    ? KOMACHI_TABLE_OF_CONTENTS_VARIANTS.state.active.classes
    : KOMACHI_TABLE_OF_CONTENTS_VARIANTS.state.default.classes;

  const combinedClassName = cn(ITEM_BASE, stateClasses, className);

  const innerContent = (
    <span className="block min-w-0 leading-5">{children}</span>
  );

  const sharedProps = {
    ref,
    "aria-current": active ? ("true" as const) : undefined,
    "data-komachi-component": "TableOfContents",
    "data-komachi-part": "item",
    className: combinedClassName,
    children: innerContent,
    ...props,
  };

  // If a render prop is provided, clone it with our props
  if (render && isValidElement(render)) {
    return <li className="-ml-0.5">{cloneElement(render, sharedProps)}</li>;
  }

  // Default to anchor tag
  return (
    <li className="-ml-0.5">
      {/* oxlint-disable-next-line anchor-has-content -- children are in sharedProps */}
      <a {...sharedProps} />
    </li>
  );
});

export interface TableOfContentsGroupProps extends Omit<
  React.HTMLAttributes<HTMLLIElement>,
  "title"
> {
  /** Label displayed above the group's items. */
  label: string;
  /** URL the group label links to. When provided, the label renders as a clickable link with item styling. */
  href?: string;
  /** Whether this group's label represents the currently active section. Only applies when `href` is provided. */
  active?: boolean;
}

const NESTED_UL_CLASSES =
  "flex flex-col gap-2 border-l-2 border-komachi-separator [&>li>a]:pl-7 [&>li>button]:pl-7";

const TableOfContentsGroup = forwardRef<
  HTMLLIElement,
  TableOfContentsGroupProps
>(
  (
    { label, href, active = false, className, children, onClick, ...props },
    ref,
  ) => {
    if (href) {
      const stateClasses = active
        ? KOMACHI_TABLE_OF_CONTENTS_VARIANTS.state.active.classes
        : KOMACHI_TABLE_OF_CONTENTS_VARIANTS.state.default.classes;

      return (
        <li
          ref={ref}
          className={cn("-ml-0.5 flex flex-col gap-2", className)}
          {...props}
        >
          {/* onClick goes on the label link, not the <li>: the <li> also wraps
            the nested items, so a handler there would fire for child clicks
            too and override the child's own selection. */}
          <a
            href={href}
            onClick={onClick as React.MouseEventHandler | undefined}
            aria-current={active ? ("true" as const) : undefined}
            data-komachi-component="TableOfContents"
            data-komachi-part="group-link"
            className={cn(ITEM_BASE, stateClasses)}
          >
            <span className="block min-w-0 leading-5">{label}</span>
          </a>
          <ul className={cn(NESTED_UL_CLASSES)}>{children}</ul>
        </li>
      );
    }

    // Without an href the label is a non-interactive title, so `onClick` is
    // intentionally not rendered - putting it on the <li> would also catch
    // clicks bubbling up from the nested items.
    return (
      <li
        ref={ref}
        className={cn("-ml-0.5 flex flex-col gap-2", className)}
        {...props}
      >
        <p className="py-0.5 pl-4 text-sm leading-5 font-medium text-komachi-subtle">
          {label}
        </p>
        <ul className={cn(NESTED_UL_CLASSES)}>{children}</ul>
      </li>
    );
  },
);

TableOfContentsRoot.displayName = "TableOfContents";
TableOfContentsTitle.displayName = "TableOfContents.Title";
TableOfContentsList.displayName = "TableOfContents.List";
TableOfContentsItem.displayName = "TableOfContents.Item";
TableOfContentsGroup.displayName = "TableOfContents.Group";

/**
 * TableOfContents - presentational compound component for section navigation.
 *
 * Purely visual; all interaction logic (scroll tracking, active state management)
 * is left to the consumer.
 *
 * @example
 * ```tsx
 * <TableOfContents>
 *   <TableOfContents.Title>On this page</TableOfContents.Title>
 *   <TableOfContents.List>
 *     <TableOfContents.Item href="#intro" active>Introduction</TableOfContents.Item>
 *     <TableOfContents.Group label="Getting Started">
 *       <TableOfContents.Item href="#install">Installation</TableOfContents.Item>
 *       <TableOfContents.Item href="#setup">Setup</TableOfContents.Item>
 *     </TableOfContents.Group>
 *   </TableOfContents.List>
 * </TableOfContents>
 * ```
 */
export const TableOfContents = Object.assign(TableOfContentsRoot, {
  Title: TableOfContentsTitle,
  List: TableOfContentsList,
  Item: TableOfContentsItem,
  Group: TableOfContentsGroup,
});
