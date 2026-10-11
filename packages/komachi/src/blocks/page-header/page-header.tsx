import { ReactNode } from "react";
import { Tabs, type TabsItem } from "../../components/tabs";
import { cn } from "../../utils/cn";

export const KOMACHI_PAGE_HEADER_VARIANTS = {
  spacing: {
    compact: {
      classes: "gap-1",
      description: "Compact spacing between header elements",
    },
    base: {
      classes: "gap-2",
      description: "Default spacing between header elements",
    },
    relaxed: {
      classes: "gap-4",
      description: "Relaxed spacing for more prominent headers",
    },
  },
} as const;

export const KOMACHI_PAGE_HEADER_DEFAULT_VARIANTS = {
  spacing: "base",
} as const;

export type KomachiPageHeaderSpacing =
  keyof typeof KOMACHI_PAGE_HEADER_VARIANTS.spacing;

export interface KomachiPageHeaderVariantsProps {
  spacing?: KomachiPageHeaderSpacing;
}

export function pageHeaderVariants({
  spacing = KOMACHI_PAGE_HEADER_DEFAULT_VARIANTS.spacing,
}: KomachiPageHeaderVariantsProps = {}) {
  return cn(
    "flex flex-col",
    KOMACHI_PAGE_HEADER_VARIANTS.spacing[spacing].classes,
  );
}

export interface PageHeaderProps extends KomachiPageHeaderVariantsProps {
  breadcrumbs: ReactNode;
  title?: string;
  description?: string;
  tabs?: TabsItem[];
  defaultTab?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  tabs,
  defaultTab,
  onValueChange,
  spacing = "base",
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn(pageHeaderVariants({ spacing }), className)}>
      <div className="border-b border-komachi-line">{breadcrumbs}</div>

      {(title || description) && (
        <div className="flex flex-col gap-2 py-3 pl-3">
          {title && (
            <h1 className="font-heading text-3xl font-semibold text-komachi-default">
              {title}
            </h1>
          )}
          {description && (
            <p className="max-w-prose text-base text-komachi-subtle">
              {description}
            </p>
          )}
        </div>
      )}

      {tabs && (
        <div className="flex w-full items-center justify-between border-b border-komachi-line pt-1 pb-3 pl-3">
          <Tabs
            tabs={tabs}
            selectedValue={defaultTab}
            onValueChange={(nextValue) => {
              const stringValue = String(nextValue);
              onValueChange?.(stringValue);
            }}
          />

          <div className="flex items-center gap-2">{children}</div>
        </div>
      )}
    </div>
  );
}
