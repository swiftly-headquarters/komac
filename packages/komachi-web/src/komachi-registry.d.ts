/**
 * Type declarations for virtual:komachi-registry module.
 * Provides component registry data from the AI metadata.
 */
declare module "virtual:komachi-registry" {
  import type { ComponentRegistry } from "komachi";

  /** Component registry markdown content for documentation */
  export const komachiRegistryMarkdown: string;

  /** Typed component registry JSON */
  export const komachiRegistryJson: ComponentRegistry;
}
