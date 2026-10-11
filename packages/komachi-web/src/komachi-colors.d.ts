/**
 * Type declarations for virtual:komachi-colors module.
 * Provides color token data parsed from CSS files.
 */
declare module "virtual:komachi-colors" {
  export type TokenType = "semantic" | "global" | "override";

  export interface ColorToken {
    /** Token name with -- prefix (e.g., "--color-surface") */
    name: string;
    /** Light mode value */
    light: string;
    /** Dark mode value */
    dark: string;
    /** Theme this token belongs to */
    theme: string;
    /** Token type: semantic, global, or override */
    tokenType: TokenType;
  }

  /** All color tokens parsed from CSS files */
  export const komachiColors: ColorToken[];
}
