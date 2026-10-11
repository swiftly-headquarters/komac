import { cn, Text } from "komachi";
import type { ReactNode } from "react";
import type { DesignTipExample } from "./design-tips";

interface DesignTipProps {
  children?: ReactNode;
}

interface DesignTipRootProps extends DesignTipProps {
  id: string;
}

interface DesignTipExamplesProps {
  examples: DesignTipExample[];
  orientation?: "horizontal" | "vertical";
}

export function DesignTip({ children, id }: DesignTipRootProps) {
  return (
    <article
      id={id}
      className={cn(
        "grid min-w-0 scroll-mt-24 grid-cols-[minmax(0,1fr)] border-t border-komachi-hairline pt-8 first:border-t-0 first:pt-0",
      )}
    >
      {children}
    </article>
  );
}

function DesignTipTitle({ children }: DesignTipProps) {
  return (
    <Text as="h3" DANGEROUS_className="text-lg font-semibold leading-tight">
      {children}
    </Text>
  );
}

function DesignTipDescription({ children }: DesignTipProps) {
  return (
    <div className="mt-2 max-w-prose">
      <Text as="span" variant="secondary" DANGEROUS_className="leading-relaxed text-pretty">
        {children}
      </Text>
    </div>
  );
}

/**
 * Both examples side by side (or stacked for code), told apart only by a
 * color-coded top edge - no switch, no icon badge, no "do/don't" copy.
 */
function DesignTipExamples({
  examples,
  orientation = "horizontal",
}: DesignTipExamplesProps) {
  return (
    <div
      className={cn(
        "mt-5 divide-komachi-line overflow-hidden rounded-lg border border-komachi-line",
        orientation === "horizontal"
          ? "divide-y md:flex md:divide-x md:divide-y-0"
          : "divide-y",
      )}
    >
      {examples.map((example, exampleIndex) => {
        const isGood = example.variant === "good";
        return (
          <div
            key={exampleIndex}
            className={cn(
              "min-w-0 flex-1 border-t-2",
              isGood ? "border-t-komachi-success" : "border-t-komachi-danger",
            )}
          >
            <span className="sr-only">
              {isGood ? "Correct example" : "Example to avoid"}
            </span>
            <div className="flex min-h-[200px] min-w-0 items-center justify-center bg-komachi-base px-6 py-5 has-[>.code-block]:p-0">
              {example.jsx}
            </div>
          </div>
        );
      })}
    </div>
  );
}

DesignTip.Title = DesignTipTitle;
DesignTip.Description = DesignTipDescription;
DesignTip.Examples = DesignTipExamples;
