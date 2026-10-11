/**
 * Dark preset codes: `dk-<hue>-<tint>-<depth>-<accent>[-<contrast>]`
 *
 *   hue      0-360  hue of the surfaces and text tint
 *   tint     0-9    surface tint strength (0 = pure neutral grey)
 *   depth    0-9    canvas darkness ladder (0 = near black, 9 = light charcoal)
 *   accent   0-360  hue of the brand color
 *   contrast 0-9    optional, default 5. Spacing between canvas, panels,
 *                   borders and fills (0 = nearly flat, 9 = strongly layered)
 *
 * Example: `dk-0-0-1-165-8` is carbon grey, teal accent, strongly layered.
 * Values are plain oklch() strings keyed by CSS variable name.
 */
export interface PresetParams {
  hue: number;
  tint: number;
  depth: number;
  accent: number;
  contrast: number;
}

const DEFAULT_CONTRAST = 5;
const CODE_PATTERN = /^dk-(\d{1,3})-(\d)-(\d)-(\d{1,3})(?:-(\d))?$/i;

export function parsePresetCode(code: string): PresetParams | null {
  const match = CODE_PATTERN.exec(code.trim());
  if (!match) return null;
  const [hue, tint, depth, accent] = match.slice(1, 5).map(Number);
  const contrast = match[5] === undefined ? DEFAULT_CONTRAST : Number(match[5]);
  if (hue > 360 || accent > 360) return null;
  return { hue, tint, depth, accent, contrast };
}

export function formatPresetCode(
  p: Omit<PresetParams, "contrast"> & { contrast?: number },
) {
  const base = `dk-${p.hue}-${p.tint}-${p.depth}-${p.accent}`;
  // Omit the default so pre-contrast codes stay valid and identical.
  return p.contrast === undefined || p.contrast === DEFAULT_CONTRAST
    ? base
    : `${base}-${p.contrast}`;
}

/** Random pure-grey surface (depth 0-6, contrast 0-9), stock teal accent. */
export function randomPresetCode(): string {
  const int = (max: number) => Math.floor(Math.random() * (max + 1));
  return formatPresetCode({
    hue: 0,
    tint: 0,
    depth: int(6),
    accent: 165,
    contrast: int(9),
  });
}

/** Surface lightness offsets (in %) above the canvas, from the stock dark theme. */
const SURFACES: Record<string, number> = {
  canvas: 0,
  elevated: 2,
  recessed: 3,
  base: 4,
  control: 9.5,
  tint: 13,
  fill: 15.4,
  hairline: 15.4,
  overlay: 15.4,
  line: 17.5,
  "arrow-stroke": 17.5,
  "fill-hover": 19,
  interact: 25.6,
};

export function generateDark({
  hue,
  tint,
  depth,
  accent,
  contrast,
}: PresetParams): Record<string, string> {
  const base = 5 + depth * 2.8; // canvas lightness in %: 5 (near black) to 30
  const chroma = tint * 0.007;
  const spread = 0.4 + contrast * 0.12; // 1.0 at the default contrast of 5
  const oklch = (l: number, c: number, h: number) =>
    `oklch(${l.toFixed(2)}% ${c.toFixed(4)} ${h})`;

  const out: Record<string, string> = {};
  for (const [name, offset] of Object.entries(SURFACES)) {
    out[`--color-komachi-${name}`] = oklch(base + offset * spread, chroma, hue);
  }

  // Text keeps a whisper of the surface hue so it sits on the background.
  const text = (name: string, lightness: number, share: number) => {
    out[`--text-color-komachi-${name}`] = oklch(
      lightness,
      chroma * share,
      hue,
    );
  };
  text("strong", 98.5, 0.3);
  text("default", 97, 0.4);
  text("subtle", 70.8, 1);
  text("placeholder", 55.6, 1);
  text("inactive", 43.9, 1);

  out["--color-komachi-brand"] = oklch(55, 0.1129, accent);
  out["--color-komachi-brand-hover"] = oklch(47, 0.0968, accent);
  return out;
}

// Pure-grey surfaces, stock teal accent: one row per depth, one column per
// contrast. Ink, Carbon and Graphite at contrast 5 are the original favorites.
const SURFACE_NAMES = [
  "Ink",
  "Carbon",
  "Onyx",
  "Charcoal",
  "Graphite",
  "Smoke",
  "Ash",
] as const;

export const PRESET_CONTRASTS = [1, 3, 5, 7, 9] as const;

export const DARK_SURFACES = SURFACE_NAMES.map((name, depth) => ({
  name,
  presets: PRESET_CONTRASTS.map((contrast) => ({
    name: `${name} ${contrast}`,
    contrast,
    code: formatPresetCode({ hue: 0, tint: 0, depth, accent: 165, contrast }),
  })),
}));
