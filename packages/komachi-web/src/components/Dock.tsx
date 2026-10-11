import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popover, cn } from "komachi";
import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { SearchDialog } from "./SearchDialog";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { ThemeToggle } from "./ThemeToggle";
import {
  NAV_GROUPS,
  filterNavGroups,
  findActiveHref,
} from "../lib/nav-items";

interface DockProps {
  currentPath: string;
  version: string;
}

export function Dock({ currentPath, version }: DockProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // The dock persists across view-transition navigations, so the prop is only
  // right for the first render. Track the live path and close the menu on each
  // soft navigation.
  const [livePath, setLivePath] = useState(currentPath);
  useEffect(() => {
    const onPageLoad = () => {
      setLivePath(window.location.pathname);
      setMenuOpen(false);
      setQuery("");
    };
    document.addEventListener("astro:page-load", onPageLoad);
    return () => document.removeEventListener("astro:page-load", onPageLoad);
  }, []);

  // Cmd/Ctrl+K and the custom event both open search.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const onOpenSearch = () => setSearchOpen(true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("komachi:open-search", onOpenSearch);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("komachi:open-search", onOpenSearch);
    };
  }, []);

  const activeHref = findActiveHref(NAV_GROUPS, livePath);
  const groups = useMemo(() => filterNavGroups(NAV_GROUPS, query), [query]);

  return (
    <>
      <nav
        aria-label="Site"
        className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2"
      >
        <div className="flex w-full items-center justify-between gap-1 rounded-2xl bg-komachi-base/90 p-1.5 shadow-lg ring ring-komachi-line backdrop-blur sm:w-fit sm:justify-center">
          <Popover
            open={menuOpen}
            onOpenChange={(open: boolean) => {
              setMenuOpen(open);
              if (!open) setQuery("");
            }}
          >
            <Popover.Trigger
              render={
                <Button
                  variant="ghost"
                  shape="square"
                  aria-label="Open navigation"
                >
                  <ListIcon size={20} />
                </Button>
              }
            />
            <Popover.Content
              side="top"
              align="center"
              sideOffset={12}
              className="flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-3 p-3"
            >
              <Input
                aria-label="Filter pages"
                placeholder="Filter pages…"
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(event.target.value)
                }
              />
              <div className="max-h-[min(24rem,60vh)] overflow-y-auto pr-1">
                {groups.length === 0 && (
                  <p className="px-2 py-3 text-sm text-komachi-subtle">
                    No pages match “{query.trim()}”.
                  </p>
                )}
                {groups.map((group) => (
                  <section key={group.title} className="mb-3 last:mb-0">
                    <h2 className="px-2 pb-1 text-xs font-medium tracking-wide text-komachi-subtle uppercase">
                      {group.title}
                    </h2>
                    <ul className="flex flex-col gap-px">
                      {group.items.map((item) => {
                        const active = item.href === activeHref;
                        return (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              // Popover content remounts on open, so bring the
                              // current page into view each time.
                              ref={(el) => {
                                if (active) el?.scrollIntoView({ block: "center" });
                              }}
                              className={cn(
                                "block rounded-lg p-2 text-sm text-komachi-subtle no-underline transition-colors hover:bg-komachi-tint hover:text-komachi-default focus:outline-none focus-visible:ring-2 focus-visible:ring-komachi-brand focus-visible:ring-inset",
                                active &&
                                  "bg-komachi-tint font-medium text-komachi-default",
                              )}
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
              <a
                href="https://github.com/swiftly-headquarters/komachi"
                target="_blank"
                rel="noopener noreferrer"
                className="border-t border-komachi-hairline px-2 pt-2 font-mono text-xs text-komachi-subtle no-underline hover:text-komachi-default"
              >
                komachi v{version}
              </a>
            </Popover.Content>
          </Popover>

          <Button
            variant="ghost"
            shape="square"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlassIcon size={20} />
          </Button>
          <ThemeCustomizer />
          <ThemeToggle />
        </div>
      </nav>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
