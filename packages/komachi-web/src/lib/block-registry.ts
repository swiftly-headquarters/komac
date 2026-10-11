import componentRegistry from "komachi/ai/component-registry.json";
import { transformImports } from "../../../komachi/src/command-line/utils/transformer";

const sources = import.meta.glob("../../../komachi/src/blocks/*/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** shadcn-style registry items (https://ui.shadcn.com/docs/registry) for every Komachi block. */
export const blockItems = Object.values(componentRegistry.blocks ?? {}).map(
  (block) => {
    const files = block.files
      .filter((file) => !file.endsWith(".test.tsx"))
      .map((file) => {
        const content = transformImports(
          sources[`../../../komachi/src/blocks/${file}`].replaceAll("\r\n", "\n"),
        );
        return {
          path: `blocks/${file}`,
          type: "registry:component",
          content,
        };
      });
    const usesIcons = files.some((f) => f.content.includes("@phosphor-icons/react"));

    return {
      name: block.files[0].split("/")[0],
      type: "registry:block",
      title: block.name,
      description: block.description,
      categories: [block.category],
      dependencies: ["komachi", ...(usesIcons ? ["@phosphor-icons/react"] : [])],
      files,
    };
  },
);
