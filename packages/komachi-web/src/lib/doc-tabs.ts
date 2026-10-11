export type DocTabKey = "overview" | "installation" | "usage" | "api";

export interface DocTab {
  key: DocTabKey;
  label: string;
}

const TAB_ORDER: DocTab[] = [
  { key: "overview", label: "Overview" },
  { key: "installation", label: "Installation" },
  { key: "usage", label: "Usage" },
  { key: "api", label: "API" },
];

/** Heading id that doubles as each tab's URL hash. Overview has none. */
export const TAB_HASH: Record<Exclude<DocTabKey, "overview">, string> = {
  installation: "installation",
  usage: "usage",
  api: "api-reference",
};

export const REVEAL_EVENT = "komachi:reveal";
/** Fired after the visible tab changes, so the ToC can follow it. */
export const TAB_CHANGE_EVENT = "komachi:tab-change";

const HEADING_TABS: Record<string, DocTabKey> = {
  installation: "installation",
  usage: "usage",
  "api reference": "api",
};

export function tabForHeading(h2Text: string | null): DocTabKey {
  if (!h2Text) return "overview";
  return HEADING_TABS[h2Text.trim().toLowerCase()] ?? "overview";
}

/**
 * One entry per top-level child of the prose container: its h2 text when it
 * starts a heading, otherwise null, which continues the previous child's tab.
 */
export function assignTabs(h2Texts: Array<string | null>): DocTabKey[] {
  let current: DocTabKey = "overview";
  return h2Texts.map((text) => {
    if (text !== null) current = tabForHeading(text);
    return current;
  });
}

/** Tabs present on the page, in fixed order. Empty when fewer than two. */
export function visibleTabs(assigned: DocTabKey[]): DocTab[] {
  const present = new Set(assigned);
  const tabs = TAB_ORDER.filter((tab) => present.has(tab.key));
  return tabs.length > 1 ? tabs : [];
}

export function idFromHash(hash: string): string {
  const raw = hash.replace(/^#/, "");
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Ask the page to open the tab that holds this heading id, synchronously. */
export function revealHeading(id: string): void {
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT, { detail: { id } }));
}
