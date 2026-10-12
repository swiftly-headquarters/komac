import type { APIRoute } from "astro";
import { blockItems } from "~/lib/block-registry";

export const GET: APIRoute = () =>
  Response.json({
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "komachi",
    homepage: "https://komachi.swiftlylabs.net",
    items: blockItems.map(({ files, ...item }) => ({
      ...item,
      files: files.map(({ content, ...file }) => file),
    })),
  });
