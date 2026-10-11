import { describe, expect, it } from "vite-plus/test";
import { THEME_CONFIG } from "./config";
import {
  generateKomachiThemeCSS,
  generateThemeOverrideCSS,
} from "./generate-css";

function countOccurrences(source: string, needle: string): number {
  return source.split(needle).length - 1;
}

describe("theme css generator", () => {
  it("emits komachi runtime fallback selectors inside base layer", () => {
    const css = generateKomachiThemeCSS(THEME_CONFIG);

    expect(css).toContain("@layer base {");
    expect(css).toContain(':root, [data-theme="komachi"] {');
    expect(css).toContain(
      ':root[data-mode="dark"], [data-mode="dark"]:not([data-theme]), [data-mode="dark"] [data-theme="komachi"], [data-theme="komachi"][data-mode="dark"], [data-theme="komachi"] [data-mode="dark"] {',
    );
  });

  it("emits the border, pressed-fill and focus-ring tokens, with line aliasing edge", () => {
    const css = generateKomachiThemeCSS(THEME_CONFIG);

    for (const token of [
      "edge",
      "edge-hover",
      "separator",
      "fill-active",
      "focus-ring",
    ]) {
      expect(css).toContain(`--color-komachi-${token}:`);
    }
    // `line` follows `edge` instead of duplicating its value.
    expect(css).toContain("--color-komachi-line: var(--color-komachi-edge);");
  });

  it("emits override theme runtime fallbacks in base layers only, for a theme with token overrides", () => {
    // generateThemeOverrideCSS is generic: it accepts any theme name and
    // emits overrides only for tokens that define a value for it. Komachi
    // ships only the base theme today, so this exercises the mechanism
    // with a synthetic override rather than a real shipped theme.
    const config = {
      ...THEME_CONFIG,
      color: {
        ...THEME_CONFIG.color,
        "komachi-base": {
          ...THEME_CONFIG.color["komachi-base"],
          theme: {
            ...THEME_CONFIG.color["komachi-base"].theme,
            acme: { light: "#fff", dark: "#000" },
          },
        },
      },
    };

    const css = generateThemeOverrideCSS(config, "acme");

    expect(countOccurrences(css, "@layer base {")).toBe(2);
    expect(css).toContain('  [data-theme="acme"] {');
    expect(css).toContain(
      '  [data-mode="dark"] [data-theme="acme"], [data-theme="acme"][data-mode="dark"], [data-theme="acme"] [data-mode="dark"] {',
    );
    expect(css).not.toMatch(/\n\[data-theme="acme"\] \{/);
  });
});
