export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const staticPages: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Installation", href: "/installation" },
  { label: "Contributing", href: "/contributing" },
  { label: "Colors", href: "/colors" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "CLI", href: "/cli" },
  { label: "Design skill", href: "/skill" },
  { label: "Registry", href: "/registry" },
];

const componentItems: NavItem[] = [
  { label: "Autocomplete", href: "/components/autocomplete" },
  { label: "Badge", href: "/components/badge" },
  { label: "Banner", href: "/components/banner" },
  { label: "Breadcrumbs", href: "/components/breadcrumbs" },
  { label: "Button", href: "/components/button" },
  { label: "Button Group", href: "/components/button-group" },
  { label: "Checkbox", href: "/components/checkbox" },
  { label: "Clipboard Text", href: "/components/clipboard-text" },
  { label: "CodeHighlighted", href: "/components/code-highlighted" },
  { label: "Collapsible", href: "/components/collapsible" },
  { label: "Combobox", href: "/components/combobox" },
  { label: "Command Palette", href: "/components/command-palette" },
  { label: "Date Picker", href: "/components/date-picker" },
  { label: "Dialog", href: "/components/dialog" },
  { label: "Dropdown", href: "/components/dropdown" },
  { label: "Empty", href: "/components/empty" },
  { label: "Flow", href: "/components/flow" },
  { label: "Grid", href: "/components/grid" },
  { label: "Hold Button", href: "/components/hold-button" },
  { label: "Inline Copy Text", href: "/components/inline-copy-text" },
  { label: "Input", href: "/components/input" },
  { label: "InputArea", href: "/components/input-area" },
  { label: "InputGroup", href: "/components/input-group" },
  { label: "Label", href: "/components/label" },
  { label: "Layer Card", href: "/components/layer-card" },
  { label: "Layer Dialog", href: "/components/layer-dialog" },
  { label: "Link", href: "/components/link" },
  { label: "Loader", href: "/components/loader" },
  { label: "Meter", href: "/components/meter" },
  { label: "Pagination", href: "/components/pagination" },
  { label: "Popover", href: "/components/popover" },
  { label: "Radio", href: "/components/radio" },
  { label: "Select", href: "/components/select" },
  { label: "Sensitive Input", href: "/components/sensitive-input" },
  { label: "Sidebar", href: "/components/sidebar" },
  { label: "Skeleton Line", href: "/components/skeleton-line" },
  { label: "Switch", href: "/components/switch" },
  { label: "Table", href: "/components/table" },
  { label: "Table of Contents", href: "/components/table-of-contents" },
  { label: "Tag Input", href: "/components/tag-input" },
  { label: "Tabs", href: "/components/tabs" },
  { label: "Text", href: "/components/text" },
  { label: "Toolbar", href: "/components/toolbar" },
  { label: "Toast", href: "/components/toast" },
  { label: "Tooltip", href: "/components/tooltip" },
];

const chartItems: NavItem[] = [
  { label: "Charts", href: "/charts" },
  { label: "Colors", href: "/charts/colors" },
  { label: "Timeseries", href: "/charts/timeseries" },
  { label: "Maps", href: "/charts/maps" },
  { label: "Sankey", href: "/charts/sankey" },
  { label: "Custom Chart", href: "/charts/custom" },
];

// Blocks are CLI-installed components that you own and can customize
// Use `npx komachi blocks` to see available blocks
// Use `npx komachi add <block>` to install
const blockItems: NavItem[] = [
  { label: "Page Header", href: "/blocks/page-header" },
  { label: "Resource List", href: "/blocks/resource-list" },
  { label: "Delete Resource", href: "/blocks/delete-resource" },
];

/** Single source of truth for site navigation. Add new routes here. */
export const NAV_GROUPS: NavGroup[] = [
  { title: "Start", items: staticPages },
  { title: "Components", items: componentItems },
  { title: "Charts", items: chartItems },
  { title: "Blocks", items: blockItems },
];

export function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

/** Longest href that equals the path or is a parent path of it. */
export function findActiveHref(groups: NavGroup[], pathname: string) {
  const path = normalizePathname(pathname);
  let best: string | null = null;
  for (const { items } of groups) {
    for (const { href } of items) {
      const h = normalizePathname(href);
      const matches = path === h || (h !== "/" && path.startsWith(h + "/"));
      if (matches && (best === null || h.length > best.length)) best = h;
    }
  }
  return best;
}

export function filterNavGroups(groups: NavGroup[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
    }))
    .filter((group) => group.items.length > 0);
}
