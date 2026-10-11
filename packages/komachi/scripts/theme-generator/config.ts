/**
 * Komachi Theme Configuration
 *
 * Single source of truth for all semantic color tokens and typography.
 * This config is used to generate:
 * - theme-komachi.css (base theme)
 * - Any future theme files
 *
 * Token naming:
 * - Key = current token name used in codebase
 * - newName = future name (empty string = no migration planned)
 */

import type { ThemeConfig } from "./types.js";

export const THEME_CONFIG: ThemeConfig = {
  /**
   * Text color tokens
   * Used with: text-{token}
   * CSS variable: --text-color-{token}
   */
  text: {
    "komachi-default": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(21% 0.004 170)",
          dark: "oklch(97% 0 0)",
        },
      },
    },
    "komachi-inverse": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-neutral-100, oklch(97% 0 0))",
          dark: "var(--color-neutral-900, oklch(20.5% 0 0))",
        },
      },
    },
    "komachi-strong": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(14.5% 0.004 170)", // darker than default
          dark: "oklch(98.5% 0 0)", // lighter than default
        },
      },
    },
    "komachi-subtle": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(54% 0.004 170)", // lighter than default
          dark: "oklch(70.8% 0 0)", // darker than default
        },
      },
    },
    "komachi-inactive": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(87% 0.004 170)", // lighter than subtle
          dark: "oklch(43.9% 0 0)", // darker than subtle
        },
      },
    },
    "komachi-placeholder": {
      // in between subtle and inactive
      newName: "",
      theme: {
        komachi: {
          light: "oklch(70.8% 0.004 170)",
          dark: "oklch(55.6% 0 0)",
        },
      },
    },
    "komachi-brand": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(46% 0.1 172)",
          dark: "oklch(72% 0.12 172)",
        },
      },
    },
    "komachi-link": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-blue-800, oklch(42.4% 0.199 265.638))",
          dark: "var(--color-blue-400, oklch(70.7% 0.165 254.624))",
        },
      },
    },
    "komachi-info": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-blue-800, oklch(42.4% 0.199 265.638))",
          dark: "var(--color-blue-400, oklch(70.7% 0.165 254.624))",
        },
      },
    },
    "komachi-success": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-emerald-800, oklch(43.2% 0.095 166.913))",
          dark: "var(--color-emerald-200, oklch(90.5% 0.093 164.15))",
        },
      },
    },
    "komachi-danger": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-red-700, oklch(50.5% 0.213 27.518))",
          dark: "var(--color-red-400, oklch(70.4% 0.191 22.216))",
        },
      },
    },
    "komachi-warning": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(59.7% 0.144 57.5)",
          dark: "var(--color-orange-400, oklch(75% 0.183 55.934))",
        },
      },
    },

    /*
     * Badge text color tokens
     * Subtle variants need colored text; inverted needs flipping text
     */
    "komachi-badge-orange-subtle": {
      newName: "",
      description: "Text color for subtle orange badge",
      theme: {
        komachi: {
          light: "var(--color-orange-800, oklch(47% 0.157 37.304))",
          dark: "var(--color-orange-200, oklch(90.1% 0.076 70.697))",
        },
      },
    },
    "komachi-badge-teal-subtle": {
      newName: "",
      description: "Text color for subtle teal badge",
      theme: {
        komachi: {
          light: "var(--color-teal-800, oklch(43.7% 0.078 188.216))",
          dark: "var(--color-teal-200, oklch(91% 0.096 180.426))",
        },
      },
    },
    "komachi-badge-neutral-subtle": {
      newName: "",
      description: "Text color for subtle neutral badge",
      theme: {
        komachi: {
          light: "var(--color-neutral-800, oklch(26.9% 0 0))",
          dark: "var(--color-neutral-200, oklch(92.2% 0 0))",
        },
      },
    },
    "komachi-badge-inverted": {
      newName: "",
      description:
        "Text color for inverted badge (white in light, black in dark)",
      theme: {
        komachi: {
          light: "var(--color-white, #fff)",
          dark: "var(--color-black, #000)",
        },
      },
    },
  },

  /**
   * Color tokens
   * Used with: bg-{token}, border-{token}, ring-{token}, etc.
   * CSS variable: --color-{token}
   */
  color: {
    "komachi-canvas": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(98.75% 0.004 170)",
          dark: "oklch(10.6% 0 0)",
        },
      },
    },
    "komachi-elevated": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(98% 0.004 170)",
          dark: "oklch(12.6% 0 0)",
        },
      },
    },
    "komachi-recessed": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(96% 0.004 170)",
          dark: "oklch(13.6% 0 0)",
        },
      },
    },
    "komachi-base": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-white, #fff)",
          dark: "oklch(14.6% 0 0)",
        },
      },
    },
    "komachi-tint": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(97% 0.004 170)",
          dark: "oklch(23.6% 0 0)",
        },
      },
    },
    "komachi-contrast": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-komachi-neutral-975, oklch(13.5% 0 0))",
          dark: "var(--color-komachi-neutral-25, oklch(98.5% 0 0))",
        },
      },
    },
    "komachi-overlay": {
      newName: "",
      theme: {
        komachi: {
          // Light popups stay white so tint/fill highlights remain visible on them.
          light: "oklch(100% 0 0)",
          dark: "oklch(19.5% 0 0)",
        },
      },
    },
    "komachi-control": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-white, #fff)",
          dark: "oklch(20.1% 0 0)",
        },
      },
    },
    "komachi-interact": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(87% 0.004 170)",
          dark: "oklch(36.2% 0 0)",
        },
      },
    },
    "komachi-fill": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(92.2% 0.004 170)",
          dark: "oklch(26% 0 0)",
        },
      },
    },
    "komachi-fill-hover": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(96.5% 0.004 170)",
          dark: "oklch(29.6% 0 0)",
        },
      },
    },
    // Accent derived from #00FEED (oklch(89.72% 0.1572 186.22)), hue tried
    // at 186 (cyan), 155 (spring green), 210 (light/sky blue); back to
    // emerald with a slightly higher hue than the original 155. Lightness/
    // chroma pulled to the max in-gamut value that still gives white
    // button text a safe contrast ratio.
    "komachi-brand": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(56% 0.105 172)",
          dark: "oklch(55% 0.1129 165)",
        },
      },
    },
    "komachi-brand-hover": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(48% 0.09 172)",
          dark: "oklch(47% 0.0968 165)",
        },
      },
    },
    "komachi-line": {
      newName: "",
      description: "Alias of komachi-edge (control borders).",
      theme: {
        komachi: {
          light: "var(--color-komachi-edge)",
          dark: "var(--color-komachi-edge)",
        },
      },
    },
    "komachi-edge": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(14.5% 0.006 170 / 0.14)",
          dark: "oklch(30% 0 0)",
        },
      },
    },
    "komachi-edge-hover": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(14.5% 0.006 170 / 0.24)",
          dark: "oklch(36% 0 0)",
        },
      },
    },
    "komachi-separator": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(14.5% 0.006 170 / 0.07)",
          dark: "oklch(24.5% 0 0)",
        },
      },
    },
    "komachi-fill-active": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(93.5% 0.004 170)",
          dark: "oklch(32% 0 0)",
        },
      },
    },
    "komachi-focus-ring": {
      newName: "",
      theme: {
        komachi: {
          light: "color-mix(in oklch, var(--color-komachi-brand) 85%, transparent)",
          dark: "color-mix(in oklch, var(--color-komachi-brand) 85%, transparent)",
        },
      },
    },
    "komachi-hairline": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(93.5% 0.004 170)",
          dark: "oklch(26% 0 0)",
        },
      },
    },
    "komachi-focus": {
      newName: "",
      description: "Primary focus ring/border color",
      theme: {
        komachi: {
          light: "var(--color-komachi-neutral-950, oklch(14.5% 0 0))",
          dark: "var(--color-komachi-neutral-150, oklch(93.5% 0 0))",
        },
      },
    },
    "komachi-shadow-edge": {
      newName: "",
      description: "Tight spread shadow color for control thumbs/knobs",
      theme: {
        komachi: {
          light: "oklch(0% 0 0 / 0.12)",
          dark: "oklch(100% 0 0 / 0.1)",
        },
      },
    },
    "komachi-shadow-drop": {
      newName: "",
      description: "Drop shadow color for control thumbs/knobs",
      theme: {
        komachi: {
          light: "oklch(0% 0 0 / 0.08)",
          dark: "oklch(0% 0 0 / 0.3)",
        },
      },
    },
    "komachi-arrow-edge": {
      newName: "",
      description:
        "Arrow border edge fill for popover/tooltip arrows (visible in light mode). Matches komachi-line so the arrow border aligns with the popup outline.",
      theme: {
        komachi: {
          light: "var(--color-komachi-separator)",
          dark: "transparent",
        },
      },
    },
    "komachi-arrow-stroke": {
      newName: "",
      description:
        "Arrow border stroke fill for popover/tooltip arrows (visible in dark mode). Matches komachi-line so the arrow border aligns with the popup outline.",
      theme: {
        komachi: {
          light: "transparent",
          dark: "var(--color-komachi-separator)",
        },
      },
    },
    "komachi-info-tint": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(93.2% 0.032 255.6 / 0.45)",
          dark: "oklch(38.0% 0.145 265.5 / 0.22)",
        },
      },
    },
    "komachi-info": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-blue-500, oklch(68.5% 0.169 237.323))",
          dark: "var(--color-blue-500, oklch(68.5% 0.169 237.323))",
        },
      },
    },
    "komachi-warning-tint": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(93.1% 0.107 94.6 / 0.20)",
          dark: "oklch(35.3% 0.079 65.0 / 0.37)",
        },
      },
    },
    "komachi-warning": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(73.9% 0.177 58.2)",
          dark: "oklch(64.5% 0.168 50.0)",
        },
      },
    },
    "komachi-danger-tint": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(93.6% 0.032 17.7 / 0.42)",
          dark: "oklch(42.9% 0.176 28.7 / 0.17)",
        },
      },
    },
    "komachi-danger": {
      newName: "",
      // Aligned with fill.komachi-danger so `bg-komachi-danger` matches `fill-komachi-danger`.
      theme: {
        komachi: {
          light: "var(--color-red-500, oklch(63.7% 0.237 25.331))",
          dark: "var(--color-red-600, oklch(57.7% 0.245 27.325))",
        },
      },
    },
    "komachi-success-tint": {
      newName: "",
      theme: {
        komachi: {
          light: "oklch(96.2% 0.043 156.7 / 0.57)",
          dark: "oklch(39.3% 0.096 152.3 / 0.20)",
        },
      },
    },
    "komachi-success": {
      newName: "",
      theme: {
        komachi: {
          light: "var(--color-emerald-600, oklch(59.6% 0.145 163.225))",
          dark: "var(--color-emerald-400, oklch(76.5% 0.177 163.223))",
        },
      },
    },

    /*
     * Banner background tokens
     * Pre-baked opacity per mode so banners don't need dark: overrides.
     * Mirrors the *-tint hues but tuned for the Banner component's surface contrast.
     */
    "komachi-banner-info": {
      newName: "",
      description: "Info banner background (informational/default variant)",
      theme: {
        komachi: {
          light: "oklch(93.2% 0.032 255.585 / 0.7)",
          dark: "oklch(37.9% 0.146 265.522 / 0.5)",
        },
      },
    },
    "komachi-banner-warning": {
      newName: "",
      description: "Warning banner background (alert variant)",
      theme: {
        komachi: {
          light: "var(--color-yellow-100, oklch(97.3% 0.071 103.193))",
          dark: "oklch(55.4% 0.135 66.442 / 0.5)",
        },
      },
    },

    /*
     * Badge color tokens
     * Solid variants: vivid background, white text
     * Subtle variants: tinted background, darker text (flips in dark mode)
     */

    // Red
    "komachi-badge-red": {
      newName: "",
      description: "Red badge background",
      theme: {
        komachi: {
          light: "var(--color-red-600, oklch(57.7% 0.245 27.325))",
          dark: "var(--color-red-700, oklch(50.5% 0.213 27.518))",
        },
      },
    },

    // Green
    "komachi-badge-green": {
      newName: "",
      description: "Green badge background",
      theme: {
        komachi: {
          light: "var(--color-emerald-600, oklch(59.6% 0.145 163.225))",
          dark: "var(--color-emerald-700, oklch(50.8% 0.118 165.612))",
        },
      },
    },

    // Orange
    "komachi-badge-orange": {
      newName: "",
      description: "Orange badge background",
      theme: {
        komachi: {
          light: "var(--color-orange-650, oklch(81.5% 0.197 76))",
          dark: "var(--color-orange-650, oklch(81.5% 0.197 76))",
        },
      },
    },

    // Purple
    "komachi-badge-purple": {
      newName: "",
      description: "Purple badge background",
      theme: {
        komachi: {
          light: "var(--color-purple-600, oklch(55.8% 0.288 302.321))",
          dark: "var(--color-purple-700, oklch(49.6% 0.265 301.924))",
        },
      },
    },

    // Teal
    "komachi-badge-teal": {
      newName: "",
      description: "Teal badge background",
      theme: {
        komachi: {
          light: "var(--color-teal-650, oklch(54.9% 0.096 184.565))",
          dark: "var(--color-teal-700, oklch(51.1% 0.096 186.391))",
        },
      },
    },

    // Blue
    "komachi-badge-blue": {
      newName: "",
      description: "Blue badge background",
      theme: {
        komachi: {
          light: "var(--color-blue-600, oklch(54.6% 0.245 262.881))",
          dark: "var(--color-blue-700, oklch(48.8% 0.243 264.376))",
        },
      },
    },

    // Neutral
    "komachi-badge-neutral": {
      newName: "",
      description: "Neutral badge background",
      theme: {
        komachi: {
          light: "var(--color-neutral-500, oklch(55.6% 0 0))",
          dark: "var(--color-neutral-600, oklch(43.9% 0 0))",
        },
      },
    },
    // NOTE: komachi-badge-neutral-subtle omitted - same pair as komachi-fill.
    // Badge uses bg-komachi-fill instead.

    // Inverted
    "komachi-badge-inverted": {
      newName: "",
      description:
        "Inverted badge background (near-black in light, white in dark)",
      theme: {
        komachi: {
          light: "var(--color-neutral-950, oklch(14.5% 0 0))",
          dark: "var(--color-white, #fff)",
        },
      },
    },
  },

  /**
   * Typography tokens
   * Used with: text-{size} utilities
   * CSS variables: --text-{size}, --text-{size}--line-height
   *
   * Note: Typography is NOT theme-dependent (no light/dark mode).
   * Values are the same across color modes but may differ per theme.
   */
  typography: {
    xs: {
      newName: "",
      theme: {
        komachi: "12px",
      },
    },
    "xs--line-height": {
      newName: "",
      theme: {
        komachi: "calc(1 / 0.75)",
      },
    },
    sm: {
      newName: "",
      theme: {
        komachi: "13px",
      },
    },
    "sm--line-height": {
      newName: "",
      theme: {
        komachi: "calc(1 / 0.85)",
      },
    },
    base: {
      newName: "",
      theme: {
        komachi: "14px",
      },
    },
    "base--line-height": {
      newName: "",
      theme: {
        komachi: "1.5",
      },
    },
    lg: {
      newName: "",
      theme: {
        komachi: "16px",
      },
    },
    "lg--line-height": {
      newName: "",
      theme: {
        komachi: "1.5",
      },
    },
  },
};

/** List of all available themes */
export const AVAILABLE_THEMES = ["komachi"] as const;
export type AvailableTheme = (typeof AVAILABLE_THEMES)[number];
