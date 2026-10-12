import { contrastRatio, mixHex } from "./format";

const INK = "#1f1b2e";
// Neither near-black nor white text reaches 4.5:1 on mid-luminance fills
// (roughly 0.18 < L < 0.24), so the ramp skips that band by stepping darker.
const minContrast = (bg: string) => Math.max(contrastRatio(INK, bg), contrastRatio("#ffffff", bg));

/** Diverging scale: orange (negative) ← neutral grey → purple (positive). */
export const DIVERGING = {
  negative: "#a3460a",
  neutral: "#f2f0f4",
  positive: "#4f4385",
} as const;

/**
 * Colour for a signed value. `maxAbs` sets the saturation end-point; a square-root
 * ramp keeps small-but-real effects (e.g. Google ≈ £4K) visibly tinted next to
 * Email's ≈ £200K without hiding the sign.
 */
export function divergingColor(value: number, maxAbs: number): string {
  if (!maxAbs || !Number.isFinite(value)) return DIVERGING.neutral;
  const pole = value >= 0 ? DIVERGING.positive : DIVERGING.negative;
  let t = Math.sqrt(Math.min(1, Math.abs(value) / maxAbs));
  let color = mixHex(DIVERGING.neutral, pole, t);
  while (minContrast(color) < 4.5 && t < 1) {
    t = Math.min(1, t + 0.01);
    color = mixHex(DIVERGING.neutral, pole, t);
  }
  return color;
}

/** Pick near-black or white text, whichever contrasts better with the background. */
export function textOn(background: string): string {
  return contrastRatio(INK, background) >= contrastRatio("#ffffff", background) ? INK : "#ffffff";
}
