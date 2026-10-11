import { useEffect, useMemo, useState } from "react";
import { komachiColors } from "virtual:komachi-colors";
import { Button, Input, Popover } from "komachi";
import {
  ArrowCounterClockwiseIcon,
  CheckIcon,
  CopyIcon,
  DiceFiveIcon,
  PaletteIcon,
} from "@phosphor-icons/react";
import {
  DARK_SURFACES,
  formatPresetCode,
  generateDark,
  parsePresetCode,
  randomPresetCode,
} from "../lib/theme-presets";

type Mode = "light" | "dark";
type Overrides = Record<Mode, Record<string, string>>;

// BaseLayout.astro reads this key and injects the overrides as a <style> tag.
const STORAGE_KEY = "komachi-theme-overrides";
const CHANGE_EVENT = "komachi:overrides-change";

const tokens = komachiColors.filter((token) => token.theme === "komachi");

function readOverrides(): Overrides {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return { light: parsed.light ?? {}, dark: parsed.dark ?? {} };
  } catch {
    return { light: {}, dark: {} };
  }
}

function currentMode(): Mode {
  return document.documentElement.getAttribute("data-mode") === "dark"
    ? "dark"
    : "light";
}

/** Resolve any CSS color (oklch, var() with fallback, ...) to #rrggbb[aa]. */
function toHex(value: string): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return "#000000";
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  const hex = [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
  return `#${hex}${a < 255 ? a.toString(16).padStart(2, "0") : ""}`;
}

function label(name: string) {
  return name.replace(/^--(text-)?color-komachi-/, (_, text) =>
    text ? "text · " : "",
  );
}

export function ThemeCustomizer() {
  const [mode, setMode] = useState<Mode>("light");
  const [overrides, setOverrides] = useState<Overrides>({
    light: {},
    dark: {},
  });
  const [defaults, setDefaults] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  // Last applied dark preset code, cleared once a dark token is hand-edited.
  const [presetCode, setPresetCode] = useState<string | null>(null);

  useEffect(() => {
    setMode(currentMode());
    setOverrides(readOverrides());
    const onTheme = () => setMode(currentMode());
    window.addEventListener("komachi:theme-change", onTheme);
    return () => window.removeEventListener("komachi:theme-change", onTheme);
  }, []);

  // Resolve the stock value of every token for the active mode.
  useEffect(() => {
    setDefaults(
      Object.fromEntries(
        tokens.map((token) => [token.name, toHex(token[mode])]),
      ),
    );
  }, [mode]);

  const save = (next: Overrides) => {
    setOverrides(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const applyPreset = (code: string) => {
    const params = parsePresetCode(code);
    if (!params) {
      setCodeError(true);
      return;
    }
    const normalized = formatPresetCode(params);
    setCodeError(false);
    setCode(normalized);
    setPresetCode(normalized);
    save({
      ...overrides,
      dark: Object.fromEntries(
        Object.entries(generateDark(params)).map(([name, color]) => [
          name,
          toHex(color),
        ]),
      ),
    });
    // Presets are dark-only: switch to dark so the result is visible.
    try {
      localStorage.setItem("theme", "dark");
    } catch {}
    document.documentElement.setAttribute("data-mode", "dark");
    window.dispatchEvent(
      new CustomEvent("komachi:theme-change", {
        detail: { theme: "dark", resolvedTheme: "dark" },
      }),
    );
  };

  const setToken = (name: string, value: string | null) => {
    if (mode === "dark") setPresetCode(null);
    const modeValues = { ...overrides[mode] };
    if (value === null) delete modeValues[name];
    else modeValues[name] = value;
    save({ ...overrides, [mode]: modeValues });
  };

  // Copies the edited tokens as JSON, ready to paste back to Claude.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          {
            note: "komachi theme overrides, hex per mode",
            ...(presetCode && { darkPreset: presetCode }),
            ...overrides,
          },
          null,
          2,
        ),
      );
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tokens.filter((token) => !q || token.name.includes(q));
  }, [query]);

  const count = Object.keys(overrides.light).length + Object.keys(overrides.dark).length;

  return (
    <Popover>
      <Popover.Trigger
        render={
          <Button
            variant="ghost"
            shape="square"
            aria-label="Customize theme colors"
          >
            <PaletteIcon size={20} />
          </Button>
        }
      />
      <Popover.Content align="end" className="flex w-80 flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium whitespace-nowrap">
            {mode === "dark" ? "Dark" : "Light"}
            {count > 0 && (
              <span className="ml-1 text-komachi-subtle">· {count}</span>
            )}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={copied ? CheckIcon : CopyIcon}
              disabled={count === 0}
              onClick={copy}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowCounterClockwiseIcon}
              disabled={count === 0}
              onClick={() => {
                setPresetCode(null);
                setCode("");
                save({ light: {}, dark: {} });
              }}
            >
              Reset all
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-komachi-subtle">Dark presets</span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[10px] text-komachi-subtle">
              <span className="w-16 shrink-0">Surface</span>
              <span>Contrast: flat → layered</span>
            </div>
            {DARK_SURFACES.map((surface) => (
              <div key={surface.name} className="flex items-center gap-1">
                <span className="w-16 shrink-0 text-xs">{surface.name}</span>
                {surface.presets.map((preset) => (
                  <Button
                    key={preset.code}
                    variant={
                      presetCode === preset.code ? "secondary" : "outline"
                    }
                    size="sm"
                    className="min-w-9 flex-1"
                    title={`${preset.name} · ${preset.code}`}
                    aria-label={`${preset.name}, ${preset.code}`}
                    onClick={() => applyPreset(preset.code)}
                  >
                    {preset.contrast}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            <Input
              aria-label="Preset code"
              aria-invalid={codeError}
              placeholder="dk-0-0-1-250"
              value={code}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCode(event.target.value);
                setCodeError(false);
              }}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") applyPreset(code);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              icon={DiceFiveIcon}
              aria-label="Random preset"
              title="Random preset"
              onClick={() => applyPreset(randomPresetCode())}
            >
              Random
            </Button>
          </div>
          {codeError && (
            <span className="text-xs text-komachi-danger">
              Format: dk-hue(0-360)-tint(0-9)-depth(0-9)-accent(0-360)[-contrast(0-9)]
            </span>
          )}
        </div>
        <Input
          placeholder="Filter tokens…"
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        />
        <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto pr-1">
          {visible.map((token) => {
            const override = overrides[mode][token.name];
            const value = override ?? defaults[token.name] ?? "#000000";
            return (
              <li
                key={token.name}
                className="flex items-center gap-2 text-xs text-komachi-default"
              >
                <input
                  type="color"
                  aria-label={token.name}
                  value={value.slice(0, 7)}
                  onChange={(event) => {
                    // Keep the stock alpha, the picker can't edit it.
                    const alpha = (override ?? defaults[token.name] ?? "").slice(7);
                    setToken(token.name, event.target.value + alpha);
                  }}
                  className="size-6 shrink-0 cursor-pointer rounded border border-komachi-fill bg-transparent p-0"
                />
                <span className="min-w-0 flex-1 truncate" title={token.name}>
                  {label(token.name)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  shape="square"
                  aria-label={`Reset ${token.name}`}
                  icon={ArrowCounterClockwiseIcon}
                  disabled={override === undefined}
                  onClick={() => setToken(token.name, null)}
                />
              </li>
            );
          })}
        </ul>
      </Popover.Content>
    </Popover>
  );
}
