import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve once - points at the sibling komachi package root
const komachiRoot = resolve(__dirname, "../../../komachi");
const komachiSrc = resolve(komachiRoot, "src");

/**
 * Map every `komachi` sub-path export to its source equivalent.
 *
 * In dev mode Vite will resolve these to the raw .ts/.tsx source files,
 * which means file-watcher-based HMR works instantly - no rebuild of
 * the komachi package required.
 *
 * In production builds (astro build) this plugin is NOT loaded, so the
 * normal package.json `exports` field is used (dist/), which validates
 * the real consumer experience.
 */
const aliases: Record<string, string> = {
  // Main barrel - resolves to source index.ts
  "komachi": resolve(komachiSrc, "index.ts"),

  // CSS styles - resolve to source CSS
  "komachi/styles/tailwind": resolve(komachiSrc, "styles/komachi.css"),
  "komachi/styles/standalone": resolve(
    komachiSrc,
    "styles/komachi-standalone.css",
  ),
  "komachi/styles": resolve(komachiSrc, "styles/komachi.css"),

  // JSON registry - these live outside src/ and are NOT built, so same
  // path works in dev and prod.  We alias anyway so Vite can resolve
  // the workspace:* link correctly and watch the file.
  "komachi/ai/component-registry.json": resolve(
    komachiRoot,
    "ai/component-registry.json",
  ),

  // Theme generator - resolve to source TS so the docs color page
  // always reflects the latest config without a komachi build step.
  "komachi/scripts/theme-generator/config": resolve(
    komachiRoot,
    "scripts/theme-generator/config.ts",
  ),
  "komachi/scripts/theme-generator/types": resolve(
    komachiRoot,
    "scripts/theme-generator/types.ts",
  ),

  // Code highlighting has separate client and server entry points.
  "komachi/code": resolve(komachiSrc, "code/index.ts"),
  "komachi/code/server": resolve(komachiSrc, "code/server.tsx"),
};

/**
 * Vite plugin that rewires `komachi` imports to the raw source
 * files of the sibling package during `astro dev`.
 *
 * **Why not just use `resolve.alias`?**
 * `resolve.alias` is a simple prefix match - it can't distinguish
 * `komachi` from `komachi-figma` without a trailing
 * slash, and it can't handle the overlapping sub-path exports cleanly.
 * A plugin gives us exact-match control.
 */
export function komachiHmrPlugin() {
  return {
    name: "vite-plugin-komachi-hmr",
    enforce: "pre" as const,

    resolveId(source: string) {
      // Exact match first (most imports)
      if (aliases[source]) {
        return aliases[source];
      }

      // Sub-path component imports: komachi/components/button
      // → packages/komachi/src/components/button/index.ts
      if (source.startsWith("komachi/components/")) {
        const componentName = source.replace(
          "komachi/components/",
          "",
        );
        return resolve(komachiSrc, `components/${componentName}/index.ts`);
      }

      // Primitives: komachi/primitives/dialog
      // → packages/komachi/src/primitives/dialog.ts
      if (source.startsWith("komachi/primitives/")) {
        const primitiveName = source.replace(
          "komachi/primitives/",
          "",
        );
        return resolve(komachiSrc, `primitives/${primitiveName}.ts`);
      }
      if (source === "komachi/primitives") {
        return resolve(komachiSrc, "primitives/index.ts");
      }

      // Utils barrel
      if (source === "komachi/utils") {
        return resolve(komachiSrc, "utils/index.ts");
      }

      // Catalog barrel
      if (source === "komachi/catalog") {
        return resolve(komachiSrc, "catalog/index.ts");
      }

      // Registry barrel
      if (source === "komachi/registry") {
        return resolve(komachiSrc, "registry/index.ts");
      }

      // Catch-all for any other komachi/styles/* CSS imports
      if (source.startsWith("komachi/styles/")) {
        const styleName = source.replace("komachi/styles/", "");
        return resolve(komachiSrc, `styles/${styleName}.css`);
      }

      return undefined;
    },

    configResolved(config: { server: { fs: { allow: string[] } } }) {
      // Append komachi source to the existing allow list rather than replacing it.
      // Using config() would shallow-merge and override Astro/Vite defaults.
      if (config.server?.fs?.allow) {
        config.server.fs.allow.push(komachiRoot);
      }
    },
  };
}
