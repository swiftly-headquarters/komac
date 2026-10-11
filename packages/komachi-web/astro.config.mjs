// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { komachiColorsPlugin } from "./src/lib/vite-plugin-komachi-colors.js";
import { komachiRegistryPlugin } from "./src/lib/vite-plugin-komachi-registry.js";
import { komachiHmrPlugin } from "./src/lib/vite-plugin-komachi-hmr.js";
import { markdownPages } from "./src/lib/astro-markdown-pages.js";
import { remarkHeadingComponents } from "./src/lib/remark-heading-components.js";

import sitemap from "@astrojs/sitemap";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getBuildInfo() {
  // Read version from the main komachi package
  const komachiPkg = JSON.parse(
    readFileSync(resolve(__dirname, "../komachi/package.json"), "utf-8"),
  );

  // Read version from the docs-astro package
  const docsPkg = JSON.parse(
    readFileSync(resolve(__dirname, "package.json"), "utf-8"),
  );

  let commitHash = "unknown";
  let commitDate = "unknown";
  let branch = "unknown";

  try {
    commitHash = execSync("git rev-parse --short HEAD", {
      encoding: "utf-8",
    }).trim();
    commitDate = execSync("git log -1 --format=%cI", {
      encoding: "utf-8",
    }).trim();
    branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
    }).trim();
  } catch (error) {
    console.warn(
      "[komachi-web] Git info unavailable during build:",
      error instanceof Error ? error.message : error,
    );
    console.warn(
      "[komachi-web] This may happen with shallow clones. Set GIT_DEPTH=0 or fetch-depth: 0 in CI.",
    );
  }

  return {
    komachiVersion: komachiPkg.version,
    docsVersion: docsPkg.version,
    commitHash,
    commitDate,
    branch,
    buildDate: new Date().toISOString(),
  };
}

const buildInfo = getBuildInfo();

// Detect dev mode: `astro dev` sets this in process.argv
const isDev = process.argv.includes("dev");

// Load the built config while Astro's config module runner is still active.
// In dev, defer to the source-loading path so Komachi does not need to be built.
const builtThemeConfig = isDev
  ? undefined
  : await import("komachi/scripts/theme-generator/config");

// Path to komachi source (used for dev mode CSS aliases)
const komachiSrc = resolve(__dirname, "../komachi/src");

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    react(),
    sitemap(),
    markdownPages({ passthroughPaths: ["/skill.md"] }),
  ],
  site: "https://komachi-ui.com/",
  // Prefetch linked pages so navigation feels instant. `hover` fetches the
  // target page's HTML + assets as soon as a link is hovered/focused, so by
  // the time the user clicks it's usually already cached.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  markdown: {
    processor: unified({ remarkPlugins: [remarkHeadingComponents] }),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "vesper",
      },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [
      // In dev mode, resolve komachi imports to raw source files
      // for instant HMR. In production builds, the normal package.json
      // exports (dist/) are used — preserving the real consumer experience.
      // IMPORTANT: Must come BEFORE tailwindcss() so CSS @import statements
      // like `@import "komachi/styles"` are aliased to source files
      // before Tailwind processes them.
      ...(isDev ? [komachiHmrPlugin()] : []),
      tailwindcss(),
      komachiColorsPlugin({ isDev, builtThemeConfig }),
      komachiRegistryPlugin(),
    ],

    // In dev mode, add resolve.alias for CSS @import statements that may bypass
    // Vite plugins. This ensures `@import "komachi/styles"` resolves
    // to source files without requiring a build step.
    resolve: isDev
      ? {
          alias: {
            "komachi/styles/tailwind": resolve(
              komachiSrc,
              "styles/komachi.css",
            ),
            "komachi/styles/standalone": resolve(
              komachiSrc,
              "styles/komachi-standalone.css",
            ),
            "komachi/styles": resolve(komachiSrc, "styles/komachi.css"),
          },
        }
      : undefined,

    define: {
      __KOMACHI_VERSION__: JSON.stringify(buildInfo.komachiVersion),
      __DOCS_VERSION__: JSON.stringify(buildInfo.docsVersion),
      __BUILD_VERSION__: JSON.stringify(buildInfo.komachiVersion), // Alias for backwards compatibility
      __BUILD_COMMIT__: JSON.stringify(buildInfo.commitHash),
      __BUILD_COMMIT_DATE__: JSON.stringify(buildInfo.commitDate),
      __BUILD_BRANCH__: JSON.stringify(buildInfo.branch),
      __BUILD_DATE__: JSON.stringify(buildInfo.buildDate),
    },
  },
});
