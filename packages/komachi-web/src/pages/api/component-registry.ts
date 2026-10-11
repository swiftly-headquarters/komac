import type { APIRoute } from "astro";
import componentRegistry from "komachi/ai/component-registry.json";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(componentRegistry), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
