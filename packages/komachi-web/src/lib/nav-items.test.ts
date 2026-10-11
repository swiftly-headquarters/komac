import { describe, it, expect } from "vite-plus/test";
import { existsSync } from "fs";
import { join } from "path";
import {
  NAV_GROUPS,
  filterNavGroups,
  findActiveHref,
  normalizePathname,
} from "./nav-items";

const pagesDir = join(import.meta.dirname, "../pages");

function pageExists(href: string) {
  if (href === "/") return existsSync(join(pagesDir, "index.astro"));
  const base = join(pagesDir, href);
  return [
    `${base}.mdx`,
    `${base}.astro`,
    join(base, "index.astro"),
    join(base, "index.mdx"),
  ].some(existsSync);
}

describe("normalizePathname", () => {
  it("strips trailing slashes and keeps root", () => {
    expect(normalizePathname("/")).toBe("/");
    expect(normalizePathname("")).toBe("/");
    expect(normalizePathname("/components/button/")).toBe("/components/button");
  });
});

describe("findActiveHref", () => {
  it("matches an exact href", () => {
    expect(findActiveHref(NAV_GROUPS, "/components/button")).toBe(
      "/components/button",
    );
  });

  it("prefers the longest match so /charts/colors does not also activate /charts", () => {
    expect(findActiveHref(NAV_GROUPS, "/charts/colors")).toBe("/charts/colors");
  });

  it("matches a sub-path of a section page", () => {
    expect(findActiveHref(NAV_GROUPS, "/installation/some-section")).toBe(
      "/installation",
    );
  });

  it("ignores a trailing slash", () => {
    expect(findActiveHref(NAV_GROUPS, "/components/button/")).toBe(
      "/components/button",
    );
  });

  it("only treats / as active on the home page", () => {
    expect(findActiveHref(NAV_GROUPS, "/")).toBe("/");
    expect(findActiveHref(NAV_GROUPS, "/not-a-page")).toBeNull();
  });
});

describe("filterNavGroups", () => {
  it("returns groups unchanged for an empty or whitespace query", () => {
    expect(filterNavGroups(NAV_GROUPS, "")).toBe(NAV_GROUPS);
    expect(filterNavGroups(NAV_GROUPS, "   ")).toBe(NAV_GROUPS);
  });

  it("is case-insensitive, trims, and drops empty groups", () => {
    const result = filterNavGroups(NAV_GROUPS, "  BUTTON ");
    expect(result.length).toBeGreaterThan(0);
    for (const group of result) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(item.label.toLowerCase()).toContain("button");
      }
    }
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterNavGroups(NAV_GROUPS, "zzzz-no-such-thing")).toEqual([]);
  });
});

describe("NAV_GROUPS", () => {
  it("has unique hrefs", () => {
    const hrefs = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("links only to pages that exist", () => {
    const missing = NAV_GROUPS.flatMap((g) => g.items)
      .filter((item) => !pageExists(item.href))
      .map((item) => item.href);
    expect(missing).toEqual([]);
  });
});
