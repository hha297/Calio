/**
 * Hex helpers for theme tokens. Prefer these over ad-hoc `#rrggbbAA` suffixes.
 */

const HEX_RE = /^#([0-9a-f]{6})$/i;

/** Convert `#RRGGBB` to `r g b` channels for CSS `rgb(var(--x) / <alpha>)`. */
export function hexToRgbChannels(hex: string): string {
  const match = HEX_RE.exec(hex.trim());
  if (!match) {
    throw new Error(`Expected #RRGGBB color, received: ${hex}`);
  }
  const value = match[1];
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/** Apply alpha 0–1 to a `#RRGGBB` color → `rgba(r,g,b,a)`. */
export function withAlpha(hex: string, alpha: number): string {
  const match = HEX_RE.exec(hex.trim());
  if (!match) {
    throw new Error(`Expected #RRGGBB color, received: ${hex}`);
  }
  const value = match[1];
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  const a = Math.min(1, Math.max(0, alpha));
  return `rgba(${r},${g},${b},${a})`;
}

/** Build NativeWind/CSS variable map from a semantic palette (`--color-primary`, …). */
export function themeToCssVars(palette: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(palette)) {
    if (HEX_RE.test(value.trim())) {
      vars[`--color-${key}`] = hexToRgbChannels(value);
    } else {
      // Non-hex (rgba overlays, etc.) — expose as raw CSS color for direct var() use.
      vars[`--color-${key}`] = value;
    }
  }
  return vars;
}
