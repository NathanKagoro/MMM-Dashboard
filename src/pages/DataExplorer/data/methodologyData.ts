// Narrative content for the Data & methodology page. Every number is computed from
// src/data/modelOutputs.json (derived from the raw CSV); only prose lives here.
import { CHANNELS, channelSummary, doublingEffect, model, type ChannelName, type DivisionFit } from "../../../data/model";
import { formatCompact, formatSignedCurrency } from "../../../lib/format";

export interface PipelineStep {
  title: string;
  eyebrow: string;
  description: string;
}

export const processSteps: PipelineStep[] = [
  {
    eyebrow: "01",
    title: "Load and check the weekly data",
    description: `${model.rows.toLocaleString("en-GB")} rows across ${model.divisionCount} divisions: impressions for Google, Email, Facebook and Affiliate, organic and paid views, and sales. No missing values.`,
  },
  {
    eyebrow: "02",
    title: "Order by week, split by division",
    description: `Calendar_Week is parsed as a date and sorted. Each division gets its own model so channel effects can differ by business area.`,
  },
  {
    eyebrow: "03",
    title: "Engineer MMM features",
    description: "log(1 + impressions) for each channel to capture diminishing returns, a linear trend, and sine/cosine terms on a 52-week cycle for seasonality.",
  },
  {
    eyebrow: "04",
    title: "Fit, rank and interpret",
    description: `Ordinary least squares on 8 features per division, scored by in-sample R². The ${model.topDivisions.length} best-fitting divisions are used throughout the dashboard.`,
  },
];

export const modelEquation =
  "Sales = β₀ + β₁·log(1+Google) + β₂·log(1+Email) + β₃·log(1+Facebook) + β₄·log(1+Affiliate) + β₅·log(1+Organic) + β₆·Trend + β₇·sin(week) + β₈·cos(week)";

export const modelInterpretation =
  "Each channel coefficient β is the change in weekly sales (£) per one-unit rise in log-impressions, holding the other channels, trend and seasonality fixed. Multiplying by ln 2 (≈ 0.69) gives the change if that channel's impressions doubled. That is the figure used on every chart.";

export const modelingLimitations = [
  {
    title: "No spend, so no ROI",
    detail: "The dataset records impressions and sales only. Without cost per channel, return on spend cannot be computed.",
  },
  {
    title: "In-sample fit only",
    detail: "R² is measured on the data used to fit each model. There is no holdout, so it overstates how well the model would forecast.",
  },
  {
    title: "Correlation, not causation",
    detail: "Channels that move together (e.g. Affiliate with other activity) can absorb each other's effect. A negative coefficient is a prompt for a lift test, not proof of harm.",
  },
  {
    title: "No adstock, price or promotions",
    detail: "Effects are assumed to land in the same week and stay constant over two years. Carry-over, saturation drift and external drivers are not modelled.",
  },
];

export const nextActions = [
  "Add spend per channel so ROI and marginal ROI can be estimated.",
  "Hold out the last 13 weeks to measure out-of-sample accuracy.",
  "Add adstock (carry-over) and saturation curves per channel.",
  "Run geo or holdout lift tests on Email and Affiliate before reallocating budget.",
];

const label = (c: ChannelName, d: DivisionFit) => formatSignedCurrency(doublingEffect(d.channels[c].coefficient), { compact: true });

/** One-line, data-driven reading of a division's results. */
export function divisionNarrative(d: DivisionFit) {
  const ranked = [...CHANNELS].sort((a, b) => d.channels[b].coefficient - d.channels[a].coefficient);
  const byVolume = [...CHANNELS].sort((a, b) => d.channels[b].impressions - d.channels[a].impressions);
  const negatives = CHANNELS.filter((c) => d.channels[c].coefficient < 0);
  return {
    headline: `${ranked[0]} leads; ${ranked[ranked.length - 1]} ${d.channels[ranked[ranked.length - 1]].coefficient < 0 ? "drags" : "trails"}.`,
    volume: `${byVolume[0]} has the most impressions (${formatCompact(d.channels[byVolume[0]].impressions)}), then ${byVolume[1]} (${formatCompact(
      d.channels[byVolume[1]].impressions,
    )}). ${byVolume[3]} is smallest at ${formatCompact(d.channels[byVolume[3]].impressions)}.`,
    effect: `If impressions doubled: ${ranked.map((c) => `${c} ${label(c, d)}`).join(", ")} per week.`,
    negatives,
  };
}

const summary = channelSummary();
const get = (c: ChannelName) => summary.find((s) => s.channel === c)!;
const n = model.topDivisions.length;

export const takeaways = [
  {
    title: "Email is the clear leader",
    detail: `Largest positive effect in every modelled division, averaging ${formatSignedCurrency(get("Email").meanDoublingEffect, { compact: true })}/week if impressions doubled.`,
  },
  {
    title: "Facebook is a reliable second",
    detail: `Positive in ${get("Facebook").positiveDivisions}/${n} divisions, averaging ${formatSignedCurrency(get("Facebook").meanDoublingEffect, { compact: true })}/week.`,
  },
  {
    title: "Google: reach without much lift",
    detail: `${formatCompact(get("Google").totalImpressions)} impressions, on a par with Email, but only ${formatSignedCurrency(get("Google").meanDoublingEffect, { compact: true })}/week if doubled.`,
  },
  {
    title: "Affiliate needs testing",
    detail: `Negative in ${get("Affiliate").negativeDivisions}/${n} divisions on only ${formatCompact(get("Affiliate").totalImpressions)} impressions. Likely confounded; verify with a holdout.`,
  },
];
