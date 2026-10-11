import { describe, it, expect } from "vite-plus/test";
import {
  REVEAL_EVENT,
  TAB_HASH,
  assignTabs,
  idFromHash,
  tabForHeading,
  visibleTabs,
} from "./doc-tabs";

describe("tabForHeading", () => {
  it("maps the three named sections", () => {
    expect(tabForHeading("Installation")).toBe("installation");
    expect(tabForHeading("Usage")).toBe("usage");
    expect(tabForHeading("API Reference")).toBe("api");
  });

  it("is trimmed and case-insensitive", () => {
    expect(tabForHeading("  api reference ")).toBe("api");
    expect(tabForHeading("USAGE")).toBe("usage");
  });

  it("sends everything else, including null, to overview", () => {
    expect(tabForHeading(null)).toBe("overview");
    expect(tabForHeading("Examples")).toBe("overview");
    expect(tabForHeading("Accessibility")).toBe("overview");
    expect(tabForHeading("Basic Usage")).toBe("overview");
    expect(tabForHeading("API Reference Extras")).toBe("overview");
  });
});

describe("assignTabs", () => {
  it("assigns one tab per section", () => {
    expect(
      assignTabs([null, "Installation", "Usage", "Examples", "API Reference"]),
    ).toEqual(["overview", "installation", "usage", "overview", "api"]);
  });

  it("lets headingless siblings continue the previous tab (loose-sibling pages)", () => {
    expect(
      assignTabs([null, "Installation", null, null, "Usage", null, "Examples"]),
    ).toEqual([
      "overview",
      "installation",
      "installation",
      "installation",
      "usage",
      "usage",
      "overview",
    ]);
  });

  it("treats leading headingless children as overview", () => {
    expect(assignTabs([null, null, "Usage"])).toEqual([
      "overview",
      "overview",
      "usage",
    ]);
  });

  it("returns an empty array for no children", () => {
    expect(assignTabs([])).toEqual([]);
  });
});

describe("visibleTabs", () => {
  it("returns present tabs in fixed order with labels", () => {
    const tabs = visibleTabs(["api", "overview", "usage", "installation"]);
    expect(tabs.map((t) => t.key)).toEqual([
      "overview",
      "installation",
      "usage",
      "api",
    ]);
    expect(tabs.map((t) => t.label)).toEqual([
      "Overview",
      "Installation",
      "Usage",
      "API",
    ]);
  });

  it("drops empty tabs", () => {
    expect(visibleTabs(["overview", "api"]).map((t) => t.key)).toEqual([
      "overview",
      "api",
    ]);
  });

  it("returns no tabs when only one would show", () => {
    expect(visibleTabs(["overview", "overview"])).toEqual([]);
    expect(visibleTabs([])).toEqual([]);
  });
});

describe("TAB_HASH", () => {
  it("uses the real heading ids", () => {
    expect(TAB_HASH).toEqual({
      installation: "installation",
      usage: "usage",
      api: "api-reference",
    });
  });
});

describe("idFromHash", () => {
  it("strips the leading # and decodes", () => {
    expect(idFromHash("#sizes")).toBe("sizes");
    expect(idFromHash("#with%20space")).toBe("with space");
    expect(idFromHash("")).toBe("");
  });

  it("does not throw on malformed encoding", () => {
    expect(idFromHash("#%E0%A4%A")).toBe("%E0%A4%A");
  });
});

describe("REVEAL_EVENT", () => {
  it("has a stable name", () => {
    expect(REVEAL_EVENT).toBe("komachi:reveal");
  });
});
