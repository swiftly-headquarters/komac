import { useEffect, useMemo, useState } from "react";
import {
  TableOfContents as TOC,
  useTableOfContentsActiveId,
} from "komachi";
import { CaretDownIcon } from "@phosphor-icons/react";
import { TAB_CHANGE_EVENT, revealHeading } from "../../lib/doc-tabs";

export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface HeadingGroup {
  h2: TocHeading;
  h3s: TocHeading[];
}

interface TableOfContentsProps {
  /** Static headings (MDX pages). Omit to scrape from the DOM (.astro pages). */
  headings?: TocHeading[];
  /**
   * - `"sidebar"` (default) - vertical list with active indicator bar
   * - `"select"` - native `<select>` jump menu for compact layouts
   */
  layout?: "sidebar" | "select";
}

/**
 * Scrape h2 and h3 elements from the rendered `.komachi-prose` container.
 * Only runs client-side for .astro pages that don't pass headings statically.
 */
function scrapeHeadings(): TocHeading[] {
  if (typeof document === "undefined") return [];

  const content = document.querySelector(".komachi-prose");
  if (!content) return [];

  return Array.from(content.querySelectorAll("h2, h3"))
    .filter((el) => el.id)
    .map((el) => ({
      depth: Number(el.tagName[1]),
      slug: el.id,
      text: el.textContent?.trim() ?? "",
    }));
}

/** False when the heading sits in a doc tab that is currently hidden. */
function isInVisibleTab(heading: TocHeading): boolean {
  const el = document.getElementById(heading.slug);
  return !el?.closest("[hidden]");
}

/**
 * Group a flat list of headings into h2 → h3[] pairs for nested TOC rendering.
 * h3 headings that appear before any h2 are dropped.
 */
function groupHeadings(headings: TocHeading[]): HeadingGroup[] {
  const groups: HeadingGroup[] = [];
  for (const heading of headings) {
    if (heading.depth === 2) {
      groups.push({ h2: heading, h3s: [] });
    } else if (heading.depth === 3 && groups.length > 0) {
      groups[groups.length - 1].h3s.push(heading);
    }
  }
  return groups;
}

export function TableOfContents({
  headings: headingsProp,
  layout = "sidebar",
}: TableOfContentsProps) {
  // Track whether we've hydrated to avoid SSR/client mismatch when scraping
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Bumped whenever the docs page switches tab, so the list re-filters.
  const [tabVersion, setTabVersion] = useState(0);
  useEffect(() => {
    const onTabChange = () => setTabVersion((v) => v + 1);
    window.addEventListener(TAB_CHANGE_EVENT, onTabChange);
    return () => window.removeEventListener(TAB_CHANGE_EVENT, onTabChange);
  }, []);

  const headings = useMemo(() => {
    if (headingsProp && headingsProp.length > 0) {
      const all = headingsProp.filter((h) => h.depth <= 3);
      // Only filter after mount to avoid hydration mismatch
      return hasMounted ? all.filter(isInVisibleTab) : all;
    }
    // Only scrape after mount to avoid hydration mismatch
    if (!hasMounted) return [];
    return scrapeHeadings().filter(isInVisibleTab);
    // tabVersion: re-run when the active doc tab changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headingsProp, hasMounted, tabVersion]);

  // Scroll tracking + hash deep-linking via the shared komachi hook. It
  // highlights the topmost heading in view (offset by the fixed header) and
  // pins a clicked heading until the smooth scroll settles, so short trailing
  // sections stay reachable.
  const { activeId, selectSection } = useTableOfContentsActiveId({
    ids: headings.map((h) => h.slug),
    offset: 96, // clears the fixed title bar (h-10) and the sticky select TOC
  });

  // Headings in a hidden tab have no layout. Open the tab (synchronously)
  // before the browser or selectSection scrolls to the heading.
  const go = (slug: string) => {
    revealHeading(slug);
    selectSection(slug);
  };

  if (headings.length === 0) return null;

  // Compact jump menu for smaller screens
  if (layout === "select") {
    return (
      <nav aria-label="Table of contents" className="relative">
        <select
          aria-label="Jump to section"
          value={activeId ?? headings[0]?.slug ?? ""}
          onChange={(e) => {
            const slug = e.target.value;
            go(slug);
            document
              .getElementById(slug)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full appearance-none p-4 text-base md:px-6 lg:px-12"
        >
          {groupHeadings(headings).map((group) => (
            <optgroup key={group.h2.slug} label={group.h2.text}>
              <option value={group.h2.slug}>{group.h2.text}</option>
              {group.h3s.map((h3) => (
                <option key={h3.slug} value={h3.slug}>
                  {"  "}
                  {h3.text}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <CaretDownIcon
          size={16}
          weight="bold"
          className="pointer-events-none absolute top-1/2 right-4.5 -translate-y-1/2 text-komachi-subtle md:right-6 lg:right-12"
        />
      </nav>
    );
  }

  // Sidebar layout (default)
  return (
    <TOC>
      <TOC.Title>On this page</TOC.Title>
      <TOC.List>
        {groupHeadings(headings).map((group) => {
          if (group.h3s.length === 0) {
            return (
              <TOC.Item
                key={group.h2.slug}
                href={`#${group.h2.slug}`}
                active={activeId === group.h2.slug}
                onClick={() => go(group.h2.slug)}
                className="overflow-visible text-pretty whitespace-pre-wrap"
              >
                {group.h2.text}
              </TOC.Item>
            );
          }
          return (
            <TOC.Group
              key={group.h2.slug}
              label={group.h2.text}
              href={`#${group.h2.slug}`}
              active={activeId === group.h2.slug}
              onClick={() => go(group.h2.slug)}
            >
              {group.h3s.map((h3) => (
                <TOC.Item
                  key={h3.slug}
                  href={`#${h3.slug}`}
                  active={activeId === h3.slug}
                  onClick={() => go(h3.slug)}
                  className="overflow-visible text-pretty whitespace-pre-wrap"
                >
                  {h3.text}
                </TOC.Item>
              ))}
            </TOC.Group>
          );
        })}
      </TOC.List>
    </TOC>
  );
}
