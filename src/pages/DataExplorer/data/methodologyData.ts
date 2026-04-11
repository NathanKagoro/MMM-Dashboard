export type ChannelKey = "Google" | "Email" | "Facebook" | "Affiliate";
export type DivisionCode = "Y" | "D" | "H" | "I" | "M" | "Q";

export interface PipelineStep {
  title: string;
  eyebrow: string;
  description: string;
  details: string[];
}

export interface MetricCard {
  label: string;
  value: string;
  description: string;
}

export interface ChannelSnapshot {
  volumeM: number;
  coefficient: number;
}

export interface DivisionResult {
  division: DivisionCode;
  rank: number;
  r2: number;
  headline: string;
  summary: string;
  volumeInsight: string;
  coefficientInsight: string;
  recommendations: string[];
  channels: Record<ChannelKey, ChannelSnapshot>;
}

// Rounds a number to a given decimal precision to keep derived display values clean.
const round = (value: number, digits = 1) => Number(value.toFixed(digits));

export const channelOrder: ChannelKey[] = ["Google", "Email", "Facebook", "Affiliate"];

export const channelColors: Record<ChannelKey, string> = {
  Google: "#45B7D1",
  Email: "#FF6B6B",
  Facebook: "#4ECDC4",
  Affiliate: "#95A5A6",
};

export const processSteps: PipelineStep[] = [
  {
    title: "Load and inspect the weekly dataset",
    eyebrow: "Step 01",
    description: "The notebook starts by reading the media-spend CSV, previewing the frame, and checking schema quality before modeling.",
    details: [
      "Load the Sample Media Spend data into pandas.",
      "Review dataframe info, null counts, duplicates, and descriptive statistics.",
      "Confirm that Sales is the response and channel activity fields are usable inputs.",
    ],
  },
  {
    title: "Standardize the time series and split divisions",
    eyebrow: "Step 02",
    description: "Calendar_Week is converted to a date, sorted chronologically, and then broken into separate division-level datasets.",
    details: [
      "Parse Calendar_Week as a true datetime field.",
      "Sort every record in temporal order.",
      "Create one analysis slice per Division so channel effects can vary by business area.",
    ],
  },
  {
    title: "Engineer MMM features",
    eyebrow: "Step 03",
    description: "The notebook creates the variables that make a simple linear model behave more like an MMM.",
    details: [
      "Apply log1p transforms to media volumes to handle diminishing returns and zeros.",
      "Add a linear Trend index so the model can absorb directional growth or decline.",
      "Encode weekly seasonality with sin_week and cos_week features on a 52-week cycle.",
    ],
  },
  {
    title: "Fit, decompose, and interpret",
    eyebrow: "Step 04",
    description: "Each division gets its own LinearRegression model, then the notebook ranks model fit, compares coefficients, and visualizes contributions.",
    details: [
      "Fit Ordinary Least Squares on 8 features for each division.",
      "Score every model with R² and isolate the top 6 most reliable divisions.",
      "Save coefficients, contribution breakdowns, and prediction outputs for downstream interpretation.",
    ],
  },
];

export const modelEquation = {
  label: "Notebook model specification",
  formula:
    "Sales = beta0 + beta1*log(Google) + beta2*log(Email) + beta3*log(Facebook) + beta4*log(Affiliate) + beta5*log(Organic) + beta6*Trend + beta7*sin_week + beta8*cos_week",
  interpretation:
    "The model isolates each channel while controlling for baseline movement in time and seasonality, so coefficient size can be used as a directional signal for budget allocation.",
};

export const engineeredFeatures = [
  "4 paid/owned channel inputs: Google, Email, Facebook, Affiliate",
  "Organic Views as non-paid demand context",
  "Trend index to capture direction over time",
  "sin_week and cos_week to encode recurring seasonal cycles",
  "Log transforms to reduce skew and mimic diminishing marginal returns",
];

export const divisionResults: DivisionResult[] = [
  {
    division: "Y",
    rank: 1,
    r2: 0.668,
    headline: "Cleanest fit in the notebook.",
    summary:
      "Division Y pairs the strongest R² with a clear performance hierarchy: Email first, Facebook second, Google useful but less efficient, Affiliate slightly negative.",
    volumeInsight:
      "Google and Email dominate volume at 39.2M and 35.2M impressions, while Affiliate stays tiny at under 1M.",
    coefficientInsight:
      "Email drives the largest modeled lift at 60.7K, Facebook is materially positive at 22.0K, and Affiliate slips below zero.",
    recommendations: [
      "Increase Email investment first.",
      "Scale Facebook selectively.",
      "Optimize Google rather than simply spending more.",
      "Re-evaluate Affiliate budget allocation.",
    ],
    channels: {
      Google: { volumeM: 39.2, coefficient: 3682.85 },
      Email: { volumeM: 35.2, coefficient: 60664.88 },
      Facebook: { volumeM: 11.3, coefficient: 21976.01 },
      Affiliate: { volumeM: 0.974, coefficient: -1363.46 },
    },
  },
  {
    division: "D",
    rank: 2,
    r2: 0.662,
    headline: "Email becomes the clear powerhouse.",
    summary:
      "Division D shows one of the strongest fits in the notebook and the single largest Email coefficient in the top group.",
    volumeInsight:
      "Google and Email are both massive at 110.0M and 108.0M impressions, far ahead of Facebook and Affiliate.",
    coefficientInsight:
      "Email reaches 199.3K, while Facebook and Affiliate stay positive and Google remains comparatively moderate at 5.6K.",
    recommendations: [
      "Maximize Email where inventory allows.",
      "Grow Facebook next.",
      "Keep Affiliate only with strong guardrails.",
      "Improve Google targeting and creative efficiency.",
    ],
    channels: {
      Google: { volumeM: 110.0, coefficient: 5559.04 },
      Email: { volumeM: 108.0, coefficient: 199261.27 },
      Facebook: { volumeM: 36.5, coefficient: 39686.04 },
      Affiliate: { volumeM: 3.22, coefficient: 9764.37 },
    },
  },
  {
    division: "H",
    rank: 3,
    r2: 0.646,
    headline: "Balanced volume, still led by Email.",
    summary:
      "Division H keeps a strong R² while showing a familiar pattern: Email is the most potent lever even when Google volume stays competitive.",
    volumeInsight:
      "Email slightly exceeds Google volume at 44.9M versus 40.5M impressions.",
    coefficientInsight:
      "Email leads at 81.5K, Facebook is a solid second at 21.6K, Affiliate stays positive, and Google contributes but with a smaller effect size.",
    recommendations: [
      "Prioritize Email budget expansion.",
      "Use Facebook as the second growth lever.",
      "Keep Affiliate monitored but active.",
      "Optimize Google for efficiency, not just reach.",
    ],
    channels: {
      Google: { volumeM: 40.5, coefficient: 3580.15 },
      Email: { volumeM: 44.9, coefficient: 81511.45 },
      Facebook: { volumeM: 11.9, coefficient: 21626.54 },
      Affiliate: { volumeM: 1.24, coefficient: 8775.76 },
    },
  },
  {
    division: "I",
    rank: 4,
    r2: 0.631,
    headline: "Strong Email with clear Affiliate drag.",
    summary:
      "Division I remains reliable enough for prioritization decisions and shows one of the sharpest negative Affiliate readings in the top group.",
    volumeInsight:
      "Google and Email sit near parity at 20.5M and 21.1M impressions, while Facebook is much smaller at 7.0M.",
    coefficientInsight:
      "Email jumps to 132.5K, Facebook reaches 28.9K, Google stays positive at 7.0K, and Affiliate turns negative at -19.4K.",
    recommendations: [
      "Push Email hardest.",
      "Maintain or increase Facebook and Google carefully.",
      "Cease or fundamentally redesign Affiliate in this division.",
    ],
    channels: {
      Google: { volumeM: 20.5, coefficient: 6963.01 },
      Email: { volumeM: 21.1, coefficient: 132470.93 },
      Facebook: { volumeM: 7.02, coefficient: 28935.13 },
      Affiliate: { volumeM: 0.774, coefficient: -19363.3 },
    },
  },
  {
    division: "M",
    rank: 5,
    r2: 0.626,
    headline: "The most severe Affiliate warning in the set.",
    summary:
      "Division M still clears the top-6 threshold, but the coefficient spread is extreme: Email is excellent while Affiliate is sharply destructive.",
    volumeInsight:
      "Google and Email drive enormous scale at 97.6M and 81.3M impressions, with Facebook substantial at 29.9M.",
    coefficientInsight:
      "Email reaches 155.3K, Facebook lands at 32.7K, Google is positive at 6.8K, and Affiliate falls to -97.5K.",
    recommendations: [
      "Prioritize Email immediately.",
      "Preserve Facebook and Google with tighter optimization.",
      "Stop or overhaul Affiliate as a matter of urgency.",
    ],
    channels: {
      Google: { volumeM: 97.6, coefficient: 6837.53 },
      Email: { volumeM: 81.3, coefficient: 155269.82 },
      Facebook: { volumeM: 29.9, coefficient: 32697.41 },
      Affiliate: { volumeM: 2.52, coefficient: -97515.33 },
    },
  },
  {
    division: "Q",
    rank: 6,
    r2: 0.624,
    headline: "Reliable enough, but again dominated by Email.",
    summary:
      "Division Q completes the top group and reinforces the same system-wide story: the model trusts Email most and heavily penalizes Affiliate.",
    volumeInsight:
      "Email leads Google on volume at 64.2M versus 60.0M impressions.",
    coefficientInsight:
      "Email lands at 94.9K, Facebook stays solid at 20.5K, Google is lightly positive at 3.1K, and Affiliate drops to -84.4K.",
    recommendations: [
      "Focus incremental budget on Email.",
      "Use Facebook as the next-best scaling channel.",
      "Revisit Google structure before adding more spend.",
      "Reduce or eliminate Affiliate exposure.",
    ],
    channels: {
      Google: { volumeM: 60.0, coefficient: 3052.54 },
      Email: { volumeM: 64.2, coefficient: 94886.48 },
      Facebook: { volumeM: 20.1, coefficient: 20494.07 },
      Affiliate: { volumeM: 1.57, coefficient: -84375.05 },
    },
  },
];

// Mean R² across the top divisions — surfaced as a credibility metric in the hero section.
export const averageTopDivisionR2 = round(
  divisionResults.reduce((sum, result) => sum + result.r2, 0) / divisionResults.length,
  3,
);

// Count of top-6 divisions where Affiliate's coefficient is negative — used in the hero chip.
export const affiliateNegativeCount = divisionResults.filter(
  (result) => result.channels.Affiliate.coefficient < 0,
).length;

export const notebookHighlights: MetricCard[] = [
  {
    label: "Top divisions surfaced",
    value: `${divisionResults.length}`,
    description: "The notebook ranked divisions by R² and focused interpretation on the 6 best fits.",
  },
  {
    label: "Average top-tier R²",
    value: `${(averageTopDivisionR2 * 100).toFixed(1)}%`,
    description: "Enough explanatory power to make directional channel decisions with more confidence.",
  },
  {
    label: "Affiliate negatives",
    value: `${affiliateNegativeCount}/${divisionResults.length}`,
    description: "Four of the six strongest models showed Affiliate as a drag, not a driver.",
  },
  {
    label: "Largest Email coefficient",
    value: "199.3K",
    description: "Division D produced the single strongest modeled response to Email activity.",
  },
];

// Aggregates per-channel stats across all divisions to power the summary charts.
const channelSummary = channelOrder.map((channel) => {
  const totalVolumeM = round(
    divisionResults.reduce((sum, result) => sum + result.channels[channel].volumeM, 0),
    1,
  );
  const averageCoefficient = round(
    divisionResults.reduce((sum, result) => sum + result.channels[channel].coefficient, 0) /
      divisionResults.length,
    2,
  );
  const positiveDivisions = divisionResults.filter(
    (result) => result.channels[channel].coefficient > 0,
  ).length;

  return {
    channel,
    totalVolumeM,
    averageCoefficient,
    positiveDivisions,
    negativeDivisions: divisionResults.length - positiveDivisions,
    color: channelColors[channel],
  };
});

// Converts raw R² ratios to percentage points for the horizontal bar chart.
export const r2Leaderboard = divisionResults.map((result) => ({
  division: result.division,
  r2Percent: round(result.r2 * 100, 1),
}));

// Converts per-channel average coefficients to K-units for the vertical bar chart.
export const coefficientLeaderboard = channelSummary.map((summary) => ({
  channel: summary.channel,
  averageCoefficientK: round(summary.averageCoefficient / 1000, 1),
  color: summary.color,
}));

export const notebookTakeaways = [
  {
    title: "Email is the repeat winner",
    detail:
      "Every top division assigns the highest positive coefficient to Email, with an average effect of 120.7K across the top-6 set.",
  },
  {
    title: "Facebook is the reliable number two",
    detail:
      "Facebook remains positive in all six divisions and averages 27.6K, making it the safest scaling channel after Email.",
  },
  {
    title: "Google has scale, not comparable efficiency",
    detail:
      "Google totals 367.8M impressions across the top divisions but averages only 4.9K in coefficient strength, so it needs optimization more than expansion.",
  },
  {
    title: "Affiliate is where the notebook raises red flags",
    detail:
      "Affiliate turns negative in Y, I, M, and Q, including a severe -97.5K reading in Division M.",
  },
];

export const modelingLimitations = [
  {
    title: "No train/test split in the notebook",
    detail:
      "R² is reported on the same data used to fit the model, so the notebook is strong for directional insight but not yet production-grade forecasting validation.",
  },
  {
    title: "External drivers are omitted",
    detail:
      "Pricing, competitive moves, promotions, and macro conditions are not included, so some apparent channel effect may still be absorbing outside events.",
  },
  {
    title: "Relationships are assumed stable",
    detail:
      "A single linear coefficient per division assumes that channel performance does not drift with saturation, creative fatigue, or seasonal shocks.",
  },
  {
    title: "Correlation and causation are different",
    detail:
      "The notebook is useful for prioritization, but true incrementality still needs experimentation and holdout validation.",
  },
];

export const nextActions = [
  "Reallocate marginal budget toward Email first and Facebook second.",
  "Audit Affiliate by division and cut or redesign the weakest programs.",
  "Run incrementality or lift tests before turning the notebook into an operating model.",
  "Refresh the models regularly and add holdout validation, lag effects, and external controls.",
];
