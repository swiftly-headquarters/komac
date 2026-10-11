import type { APIRoute } from "astro";
import { blockItems } from "~/lib/block-registry";

export function getStaticPaths() {
  return blockItems.map((item) => ({ params: { name: item.name }, props: { item } }));
}

export const GET: APIRoute = ({ props }) =>
  Response.json({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...props.item,
  });
