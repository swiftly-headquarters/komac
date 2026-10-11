import { useEffect, useState } from "react";
import { cn } from "komachi";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { BaseUIIcon } from "./icons/BaseUIIcon";

interface StickyDocHeaderProps {
  title: string;
  githubSourceUrl?: string | null;
  baseUIUrl?: string | null;
}

/**
 * Slim title bar for xl+ screens. Slides in once the page header scrolls out
 * of view. Below xl the select-style TOC owns the top edge, so it is hidden.
 */
export function StickyDocHeader({
  title,
  githubSourceUrl,
  baseUIUrl,
}: StickyDocHeaderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pageHeader = document.getElementById("page-header");
    if (!pageHeader) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Only after scrolling past it (not while it is still below the fold).
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(pageHeader);
    return () => observer.disconnect();
  }, []);

  const linkClass =
    "text-komachi-subtle transition-colors hover:text-komachi-default";

  return (
    <header
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 top-0 z-20 hidden h-10 items-center gap-2 border-b border-komachi-hairline bg-komachi-canvas/90 px-6 backdrop-blur transition-transform duration-200 xl:flex",
        visible ? "translate-y-0" : "pointer-events-none -translate-y-full",
      )}
    >
      <span className="text-sm font-medium">{title}</span>
      {githubSourceUrl && (
        <a
          href={githubSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="View source on GitHub"
          aria-label="View source on GitHub"
          tabIndex={visible ? 0 : -1}
        >
          <GithubLogoIcon size={14} weight="fill" />
        </a>
      )}
      {baseUIUrl && (
        <a
          href={baseUIUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="View Base UI documentation"
          aria-label="View Base UI documentation"
          tabIndex={visible ? 0 : -1}
        >
          <BaseUIIcon size={14} />
        </a>
      )}
    </header>
  );
}
