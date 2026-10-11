import { useEffect, useRef, useState } from "react";
import { Tabs } from "komachi";
import {
  REVEAL_EVENT,
  TAB_CHANGE_EVENT,
  TAB_HASH,
  assignTabs,
  idFromHash,
  visibleTabs,
  type DocTab,
  type DocTabKey,
} from "../../lib/doc-tabs";

interface Model {
  children: HTMLElement[];
  assigned: DocTabKey[];
  idToTab: Record<string, DocTabKey>;
}

/**
 * Groups the page's top-level prose children into tabs and shows one at a time.
 * The server renders every section, so without JavaScript nothing is hidden.
 */
export function DocTabs() {
  const [tabs, setTabs] = useState<DocTab[]>([]);
  const [active, setActive] = useState<DocTabKey>("overview");
  const model = useRef<Model | null>(null);
  const activeRef = useRef<DocTabKey>("overview");

  const show = (tab: DocTabKey) => {
    const m = model.current;
    if (!m) return;
    m.children.forEach((el, i) => {
      el.hidden = m.assigned[i] !== tab;
    });
    activeRef.current = tab;
    setActive(tab);
    window.dispatchEvent(new CustomEvent(TAB_CHANGE_EVENT));
  };

  useEffect(() => {
    const prose = document.querySelector<HTMLElement>(".komachi-prose");
    // The server hides the named sections until we take over; always release.
    prose?.classList.remove("doc-tabs-pending");
    if (!prose) return;
    if (new URLSearchParams(window.location.search).get("tabs") === "off") {
      return;
    }

    const children = Array.from(prose.children) as HTMLElement[];
    const assigned = assignTabs(
      children.map((el) => {
        const heading = el.matches("h2") ? el : el.querySelector("h2");
        return heading ? (heading.textContent ?? "") : null;
      }),
    );
    const found = visibleTabs(assigned);
    if (found.length === 0) return;

    const idToTab: Record<string, DocTabKey> = {};
    children.forEach((el, i) => {
      if (el.id) idToTab[el.id] = assigned[i];
      el.querySelectorAll("[id]").forEach((node) => {
        idToTab[node.id] = assigned[i];
      });
    });
    model.current = { children, assigned, idToTab };
    setTabs(found);

    const tabFromHash = () => {
      const id = idFromHash(window.location.hash);
      return id ? (idToTab[id] ?? null) : null;
    };

    const initial = tabFromHash();
    show(initial ?? "overview");
    if (initial) {
      // The browser tried to scroll before the target was visible.
      requestAnimationFrame(() =>
        document
          .getElementById(idFromHash(window.location.hash))
          ?.scrollIntoView(),
      );
    }

    const onHashChange = () => {
      // Back/Forward to a hash-less URL means the default tab. A non-empty
      // hash that matches no section leaves the current tab alone.
      const tab = idFromHash(window.location.hash)
        ? tabFromHash()
        : "overview";
      if (tab && tab !== activeRef.current) show(tab);
    };
    const onReveal = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id;
      const tab = id ? idToTab[id] : undefined;
      if (tab && tab !== activeRef.current) show(tab);
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener(REVEAL_EVENT, onReveal);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener(REVEAL_EVENT, onReveal);
      children.forEach((el) => {
        el.hidden = false;
      });
      model.current = null;
    };
  }, []);

  if (tabs.length === 0) return null;

  const pick = (key: DocTabKey) => {
    show(key);
    // replaceState so switching tabs neither scrolls nor stacks history. Keep
    // the existing state: Astro's router stores its history index there and
    // ignores popstate events whose state is null.
    const hash = key === "overview" ? "" : `#${TAB_HASH[key]}`;
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}${hash}`,
    );
  };

  return (
    <div className="mb-8">
      <Tabs
        variant="underline"
        tabs={tabs.map((tab) => ({ value: tab.key, label: tab.label }))}
        value={active}
        onValueChange={(value: string) => pick(value as DocTabKey)}
      />
    </div>
  );
}
