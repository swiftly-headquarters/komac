import { describe, it, expect } from "vite-plus/test";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

const distDir = join(import.meta.dirname, "../../dist");

describe("markdown pages integration", () => {
  it("generates .md files for component pages", () => {
    const componentsDir = join(distDir, "components");

    if (!existsSync(componentsDir)) {
      throw new Error(
        "dist/components/ not found - run `pnpm build` before testing",
      );
    }

    const entries = readdirSync(componentsDir, { withFileTypes: true });
    const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".md"));
    const dirs = entries.filter((e) => e.isDirectory());

    // Every component directory should have a corresponding .md file
    expect(mdFiles.length).toBeGreaterThan(0);
    expect(mdFiles.length).toBe(dirs.length);

    // Spot check known components
    expect(existsSync(join(componentsDir, "badge.md"))).toBe(true);
    expect(existsSync(join(componentsDir, "button.md"))).toBe(true);
    expect(existsSync(join(componentsDir, "dialog.md"))).toBe(true);
  });

  it("generates .md files for other doc pages", () => {
    // Check a few key non-component pages
    expect(existsSync(join(distDir, "installation.md"))).toBe(true);
    expect(existsSync(join(distDir, "colors.md"))).toBe(true);
  });

  it("preserves the generated design skill", () => {
    const content = readFileSync(join(distDir, "skill.md"), "utf-8");

    expect(content).toContain("name: komachi-design");
  });

  it("generates llms.txt as a curated docs index", () => {
    const llmsPath = join(distDir, "llms.txt");
    expect(existsSync(llmsPath)).toBe(true);

    const content = readFileSync(llmsPath, "utf-8");
    expect(content).toContain("# Komachi");
    expect(content).toContain("This file is a curated index for LLMs");
    expect(content).toContain("https://komachi-ui.com/installation.md");
    expect(content).toContain("https://komachi-ui.com/components/button.md");
    expect(content).toContain("https://komachi-ui.com/blocks/resource-list.md");
  });
});
