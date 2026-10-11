import { ShikiProvider } from "komachi/code";
import { Flow, cn } from "komachi";
import { isValidElement, useEffect, useState } from "react";
import { CodeExample, designTips } from "./design-tips";
import { DesignTip } from "./DesignTip";

export interface RenderedDesignTip {
  title: string;
  description?: string;
}

interface DesignTipsProps {
  renderedTips: RenderedDesignTip[];
}

interface MarkdownProps {
  html: string;
}

function Markdown({ html }: MarkdownProps) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Matches Heading.astro's slug algorithm, so a shared #slug link lands on the right category. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function DesignTips({ renderedTips }: DesignTipsProps) {
  const categories = [...new Set(designTips.map((tip) => tip.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    history.replaceState(null, "", `#${slugify(category)}`);
  };

  // Land on the right category from a shared #slug, both on first load and
  // when the hash changes from outside this component.
  useEffect(() => {
    const applyHash = () => {
      const slug = window.location.hash.slice(1);
      if (!slug) return;
      const match = categories.find((category) => slugify(category) === slug);
      if (match) setActiveCategory(match);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ShikiProvider engine="javascript" languages={["tsx"]}>
      <Flow>
        {categories.map((category) => (
          <Flow.Node
            key={category}
            id={slugify(category)}
            render={
              <button
                type="button"
                onClick={() => selectCategory(category)}
                aria-pressed={activeCategory === category}
                className={cn(
                  "rounded-lg border px-4 py-2 text-base font-medium",
                  activeCategory === category
                    ? "border-komachi-brand bg-komachi-brand text-white"
                    : "border-komachi-line bg-komachi-base text-komachi-default hover:bg-komachi-tint",
                )}
                style={{ cursor: "pointer" }}
              />
            }
          >
            {category}
          </Flow.Node>
        ))}
      </Flow>

      <div
        id={slugify(activeCategory)}
        className="mt-10 grid scroll-mt-24 gap-8"
      >
        {designTips
          .map((tip, tipIndex) => ({ tip, tipIndex }))
          .filter(({ tip }) => tip.category === activeCategory)
          .map(({ tip, tipIndex }) => {
            const renderedTip = renderedTips[tipIndex];
            const orientation = tip.examples.some(
              (example) =>
                isValidElement(example.jsx) &&
                example.jsx.type === CodeExample,
            )
              ? "vertical"
              : "horizontal";

            return (
              <DesignTip id={tip.id} key={tip.id}>
                <DesignTip.Title>
                  <Markdown html={renderedTip.title} />
                </DesignTip.Title>
                {renderedTip.description ? (
                  <DesignTip.Description>
                    <Markdown html={renderedTip.description} />
                  </DesignTip.Description>
                ) : null}
                <DesignTip.Examples
                  examples={tip.examples}
                  orientation={orientation}
                />
              </DesignTip>
            );
          })}
      </div>
    </ShikiProvider>
  );
}
