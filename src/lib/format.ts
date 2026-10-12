// Number formatting shared by every page and chart.
// Negative numbers always use a true minus sign placed before the currency symbol: −£49,047.

export const MINUS = "−";

/** Word joiner: stops browsers wrapping between a sign and the number ("+ / £18K"). */
export const WJ = "\u2060";

const sign = (n: number) => (n < 0 ? MINUS + WJ : "");

/** 25000 -> "25K", 1_250_000 -> "1.3M", 950 -> "950". Uses at most one decimal and drops ".0". */
export function formatCompact(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "–";
  const abs = Math.abs(value);
  const units: [number, string][] = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (let i = 0; i < units.length; i++) {
    const [size, suffix] = units[i];
    if (abs >= size) {
      const scaled = Number((abs / size).toFixed(digits));
      // Rounding can reach 1000 (999,950 -> "1000K"); promote to the next unit instead.
      if (scaled >= 1000 && i > 0) {
        const [bigSize, bigSuffix] = units[i - 1];
        return `${sign(value)}${trimZeros((abs / bigSize).toFixed(digits))}${bigSuffix}`;
      }
      return `${sign(value)}${trimZeros(scaled.toFixed(digits))}${suffix}`;
    }
  }
  if (Number(abs.toFixed(0)) >= 1000) return `${sign(value)}1K`;
  return `${sign(value)}${trimZeros(abs.toFixed(abs < 10 && abs % 1 !== 0 ? digits : 0))}`;
}

function trimZeros(s: string): string {
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}

/** Full-precision integer with thousands separators: -49046.5 -> "−49,047". */
export function formatInteger(value: number): string {
  if (!Number.isFinite(value)) return "–";
  return `${sign(Math.round(value))}${Math.abs(Math.round(value)).toLocaleString("en-GB")}`;
}

/** £ amount. compact: "£25K"; otherwise "£25,000". Negative: "−£49,047". */
export function formatCurrency(value: number, opts: { compact?: boolean; digits?: number } = {}): string {
  if (!Number.isFinite(value)) return "–";
  const body = opts.compact
    ? formatCompact(Math.abs(value), opts.digits ?? 1)
    : Math.abs(Math.round(value)).toLocaleString("en-GB");
  return `${sign(Math.round(value) === 0 ? 0 : value)}£${body}`;
}

/** Explicit sign for changes: "+£5.8K", "−£5.2K". */
export function formatSignedCurrency(value: number, opts: { compact?: boolean } = {}): string {
  const s = formatCurrency(value, opts);
  return value > 0 && Math.round(value) !== 0 ? `+${WJ}${s}` : s;
}

/** 0.6682 -> "0.668" */
export function formatR2(value: number): string {
  return value.toFixed(3);
}

/** 0.643 -> "64%" */
export function formatPercent(value: number, digits = 0): string {
  return `${sign(value)}${Math.abs(value * 100).toFixed(digits)}%`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2018-01-06" -> "Jan 2018" (parsed as a calendar date, no timezone shift). */
export function formatMonthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "2018-01-06" -> "6 Jan 2018" */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * Evenly spaced, "nice" axis ticks (steps of 1, 2, 2.5 or 5 × 10^n) covering [min, max].
 * Always includes 0 when the range crosses it.
 */
export function niceTicks(min: number, max: number, target = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
  if (min === max) {
    const pad = Math.abs(min) || 1;
    min -= pad;
    max += pad;
  }
  if (min > max) [min, max] = [max, min];
  const rough = (max - min) / Math.max(1, target - 1);
  const mag = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((s) => s >= rough) ?? 10 * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) {
    // Avoid floating-point noise like 0.30000000000000004 and "-0".
    const clean = Number(v.toPrecision(12));
    ticks.push(clean === 0 ? 0 : clean);
  }
  return ticks;
}

// ---- colour helpers (used by the heatmap and tests) ----

function channel(c: number) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Linear blend of two hex colours, t in [0, 1]. */
export function mixHex(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const k = Math.min(1, Math.max(0, t));
  return (
    "#" +
    a
      .map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, "0"))
      .join("")
  );
}
