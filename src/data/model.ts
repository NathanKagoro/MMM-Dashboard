// Single source of truth for every figure in the dashboard.
// modelOutputs.json is generated from data/raw/Sample Media Spend Data.csv by
// scripts/derive_model_outputs.py. No number on screen is typed in by hand.
import raw from "./modelOutputs.json";

export type ChannelName = "Google" | "Email" | "Facebook" | "Affiliate";

export interface ChannelFit {
  impressions: number; // total impressions over the whole period
  coefficient: number; // OLS coefficient on log(1 + weekly impressions), in weekly sales
}

export interface WeeklyPoint {
  week: string; // ISO date of the week
  actual: number;
  predicted: number;
}

export interface DivisionFit {
  division: string;
  rank: number;
  r2: number;
  weeks: number;
  meanWeeklySales: number;
  channels: Record<ChannelName, ChannelFit>;
  weekly: WeeklyPoint[];
}

export interface ModelOutputs {
  source: string;
  modelSpec: string;
  period: { start: string; end: string; weeks: number };
  rows: number;
  divisionCount: number;
  duplicateWeekDivisions: string[];
  allDivisionR2: { division: string; r2: number; rows: number }[];
  topDivisions: DivisionFit[];
  combinedWeekly: WeeklyPoint[];
  combinedR2: number;
}

export const model = raw as ModelOutputs;

export const CHANNELS: ChannelName[] = ["Google", "Email", "Facebook", "Affiliate"];

/**
 * Channel identity colours, tuned towards the brand (Google indigo-violet, Email berry)
 * and validated for colour-vision deficiency on the light surface: all-pairs CVD ΔE ≥ 11,
 * normal-vision ΔE ≥ 17. Facebook is < 3:1 against white, so every chart that uses it
 * also labels the mark directly.
 */
export const CHANNEL_COLORS: Record<ChannelName, string> = {
  Google: "#5b63d9",
  Email: "#c2307a",
  Facebook: "#1baf7a",
  Affiliate: "#9a7a00",
};

/** Text colour for negative values (rose, 7.5:1 on white, 6.6:1 on glass cards). */
export const NEGATIVE_TEXT = "#a01f50";

export const DIVISIONS = model.topDivisions.map((d) => d.division);

export function getDivision(code: string): DivisionFit {
  const found = model.topDivisions.find((d) => d.division === code);
  if (!found) throw new Error(`Unknown division ${code}`);
  return found;
}

/**
 * Because channels enter the model as log(1 + impressions), the coefficient β means
 * "weekly sales change per +1 in log-impressions". The more readable equivalent is the
 * change in weekly sales when a channel's impressions double: β × ln 2.
 */
export function doublingEffect(coefficient: number): number {
  return coefficient * Math.LN2;
}

export interface ChannelTableRow {
  channel: ChannelName;
  impressions: number;
  weeklyImpressions: number;
  coefficient: number;
  doublingEffect: number;
  rank: number; // 1 = most positive effect
  shareOfMeanSales: number; // doubling effect / mean weekly sales
}

/** Rows for the Channel Effectiveness table of one division, sorted by effect. */
export function channelTable(division: DivisionFit): ChannelTableRow[] {
  const rows = CHANNELS.map((channel) => {
    const fit = division.channels[channel];
    const effect = doublingEffect(fit.coefficient);
    return {
      channel,
      impressions: fit.impressions,
      weeklyImpressions: fit.impressions / division.weeks,
      coefficient: fit.coefficient,
      doublingEffect: effect,
      rank: 0,
      shareOfMeanSales: effect / division.meanWeeklySales,
    };
  }).sort((a, b) => b.coefficient - a.coefficient);
  rows.forEach((row, i) => (row.rank = i + 1));
  return rows;
}

export interface ChannelSummary {
  channel: ChannelName;
  totalImpressions: number;
  meanCoefficient: number;
  meanDoublingEffect: number;
  positiveDivisions: number;
  negativeDivisions: number;
}

/** Cross-division summary across the modelled (top-R²) divisions. */
export function channelSummary(divisions: DivisionFit[] = model.topDivisions): ChannelSummary[] {
  return CHANNELS.map((channel) => {
    const coefs = divisions.map((d) => d.channels[channel].coefficient);
    const mean = coefs.reduce((s, v) => s + v, 0) / coefs.length;
    return {
      channel,
      totalImpressions: divisions.reduce((s, d) => s + d.channels[channel].impressions, 0),
      meanCoefficient: mean,
      meanDoublingEffect: doublingEffect(mean),
      positiveDivisions: coefs.filter((c) => c > 0).length,
      negativeDivisions: coefs.filter((c) => c < 0).length,
    };
  });
}

export function meanR2(divisions: DivisionFit[] = model.topDivisions): number {
  return divisions.reduce((s, d) => s + d.r2, 0) / divisions.length;
}

/** Ordinal label, e.g. 1 -> "1st". */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

export interface MonthlyPoint {
  month: string; // "YYYY-MM"
  actual: number; // average weekly sales in the month
  predicted: number;
  weeks: number;
}

/**
 * Collapse a weekly series to calendar months (by week-ending date). Uses the average
 * week rather than the monthly total so 4- and 5-week months are comparable.
 */
export function monthlyAverages(weekly: WeeklyPoint[]): MonthlyPoint[] {
  const byMonth = new Map<string, { a: number; p: number; n: number }>();
  for (const w of weekly) {
    const key = w.week.slice(0, 7);
    const acc = byMonth.get(key) ?? { a: 0, p: 0, n: 0 };
    acc.a += w.actual;
    acc.p += w.predicted;
    acc.n += 1;
    byMonth.set(key, acc);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { a, p, n }]) => ({ month, actual: a / n, predicted: p / n, weeks: n }));
}
