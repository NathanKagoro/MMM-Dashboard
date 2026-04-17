export const timeSeriesData = [
  { date: "2018-01-06", sales: 59417, predicted: 62000 },
  { date: "2018-01-13", sales: 56806, predicted: 58500 },
  { date: "2018-01-20", sales: 48715, predicted: 51000 },
  { date: "2018-01-27", sales: 72047, predicted: 69000 },
  { date: "2018-02-03", sales: 56235, predicted: 57000 },
  { date: "2018-02-10", sales: 56347, predicted: 58000 },
  { date: "2018-02-17", sales: 81604, predicted: 79000 },
  { date: "2018-02-24", sales: 80492, predicted: 82000 },
  { date: "2018-03-03", sales: 61804, predicted: 63000 },
  { date: "2018-03-10", sales: 64944, predicted: 66000 },
  { date: "2018-03-17", sales: 62945, predicted: 64000 },
  { date: "2018-03-24", sales: 65018, predicted: 66500 },
  { date: "2018-03-31", sales: 68472, predicted: 70000 },
];

// Heatmap data: Top 6 divisions x 4 channels (coefficients normalized 0-100)
// Divisions: Y, D, H, I, M, Q
// Channels: Google, Email, Facebook, Affiliate
export const heatmapData = [
  // Division Y
  [
    { row: 0, col: 0, value: 45, channel: "Google", division: "Y" },      // 3682.85
    { row: 0, col: 1, value: 95, channel: "Email", division: "Y" },       // 60664.88
    { row: 0, col: 2, value: 70, channel: "Facebook", division: "Y" },    // 21976.01
    { row: 0, col: 3, value: 5, channel: "Affiliate", division: "Y" },    // -1363.46
  ],
  // Division D
  [
    { row: 1, col: 0, value: 42, channel: "Google", division: "D" },      // 5559.04
    { row: 1, col: 1, value: 100, channel: "Email", division: "D" },      // 199261.27 (highest)
    { row: 1, col: 2, value: 75, channel: "Facebook", division: "D" },    // 39686.04
    { row: 1, col: 3, value: 55, channel: "Affiliate", division: "D" },   // 9764.37
  ],
  // Division H
  [
    { row: 2, col: 0, value: 43, channel: "Google", division: "H" },      // 3580.15
    { row: 2, col: 1, value: 85, channel: "Email", division: "H" },       // 81511.45
    { row: 2, col: 2, value: 68, channel: "Facebook", division: "H" },    // 21626.54
    { row: 2, col: 3, value: 60, channel: "Affiliate", division: "H" },   // 8775.76
  ],
  // Division I
  [
    { row: 3, col: 0, value: 52, channel: "Google", division: "I" },      // 6963.01
    { row: 3, col: 1, value: 90, channel: "Email", division: "I" },       // 132470.93
    { row: 3, col: 2, value: 72, channel: "Facebook", division: "I" },    // 28935.13
    { row: 3, col: 3, value: 0, channel: "Affiliate", division: "I" },    // -19363.30 (negative)
  ],
  // Division M
  [
    { row: 4, col: 0, value: 51, channel: "Google", division: "M" },      // 6837.53
    { row: 4, col: 1, value: 92, channel: "Email", division: "M" },       // 155269.82
    { row: 4, col: 2, value: 78, channel: "Facebook", division: "M" },    // 32697.41
    { row: 4, col: 3, value: 2, channel: "Affiliate", division: "M" },    // -97515.33 (very negative)
  ],
  // Division Q
  [
    { row: 5, col: 0, value: 40, channel: "Google", division: "Q" },      // 3052.54
    { row: 5, col: 1, value: 88, channel: "Email", division: "Q" },       // 94886.48
    { row: 5, col: 2, value: 65, channel: "Facebook", division: "Q" },    // 20494.07
    { row: 5, col: 3, value: 1, channel: "Affiliate", division: "Q" },    // -84375.05 (very negative)
  ],
].flat();

export function heatColor(value: number) {
  if (value > 75) return "#FFADC7"; // darkest pink
  if (value > 50) return "#FFC2E2"; // medium pink
  if (value > 25) return "#FFD6E8"; // light pink
  return "#FFFFFF"; // white
}

export const overviewCards = [
  {
    id: 0,
    title: "Top Division",
    value: "Division Y",
    description: "Highest model reliability (R² = 0.668) - explains 67% of sales variance with strong trend capture",
    accent: "#7D71A7",
    insight: "Division Y's sales patterns are captured most accurately by the model, with trends explaining 67% of variance. This strong fit provides a reliable foundation for strategic planning and budget allocation in this division. The model's accuracy here suggests our marketing data is particularly clean and our assumptions about channel effects are well-validated.",
  },
  {
    id: 1,
    title: "Average Model Fit",
    value: "64.3%",
    description: "Top 6 divisions - explains ~64% of sales variance, leaving 36% to external factors",
    accent: "#CAADFF",
    insight: "Across our best-performing divisions, the MMM explains 64% of sales variation. This solid fit indicates our model captures the key dynamics of marketing effectiveness, though 36% remains influenced by external factors like pricing changes, competitive actions, macroeconomic conditions, or unexpected seasonality events. This is a healthy balance for marketing attribution models.",
  },
  {
    id: 2,
    title: "Top Channel",
    value: "Email",
    description: "Consistently highest coefficient across all divisions (up to $199K impact)",
    accent: "#FFADC7",
    insight: "Email marketing demonstrates the highest sales impact coefficient (up to 199K) across all divisions. This consistent effectiveness suggests our email strategy is resonating strongly with audiences and represents the best opportunity for ROI optimization. The scale and reliability of email performance makes it our most predictable and profitable marketing channel.",
  },
  {
    id: 3,
    title: "Weakest Channel",
    value: "Affiliate",
    description: "Negative impact in 4 out of 6 divisions - may be attracting low-quality traffic",
    accent: "#FFC2E2",
    insight: "Affiliate channels show negative coefficients in 4 divisions, indicating they may be attracting low-quality traffic or driving customers that don't convert at profitable rates. Immediate review and potential restructuring of affiliate partnerships is recommended to reclaim this budget. Consider implementing stricter quality controls or shifting budget to higher-performing channels like email.",
  },
  {
    id: 4,
    title: "Highest Volume",
    value: "Google",
    description: "Drives scale but lacks efficiency - optimization needed",
    accent: "#FFD6E8",
    insight: "Google captures 368M impressions (highest of all channels) yet demonstrates moderate effectiveness coefficients (~5K). This volume-to-efficiency gap suggests opportunities for improved targeting, ad creative optimization, or keyword strategy refinement.",
  },
  {
    id: 5,
    title: "Model Quality",
    value: "Strong",
    description: "MMM provides reliable basis for decision-making",
    accent: "#7D71A7",
    insight: "With consistent R² scores across divisions (0.62-0.67) and controlled variables for trend and seasonality, our model provides statistically robust guidance for marketing decisions. Combined with qualitative insights, this quantitative foundation minimizes investment risk.",
  },
  {
    id: 6,
    title: "Total Impressions",
    value: "368M",
    description: "Google dominates with 368 million impressions across all divisions",
    accent: "#CAADFF",
    insight: "Google captures the majority of our paid media impressions (368M), followed by Facebook (156M) and Email (89M). This volume distribution suggests Google is our primary reach driver, but effectiveness analysis shows we need better optimization to convert this scale into sales impact.",
  },
  {
    id: 7,
    title: "Channel Diversity",
    value: "4 Channels",
    description: "Balanced mix across Google, Email, Facebook, and Affiliate",
    accent: "#FFADC7",
    insight: "Our marketing mix spans 4 primary channels with varying effectiveness. Email leads in impact, Google in scale, Facebook in mid-range performance, and Affiliate requires immediate attention. This diversity provides risk mitigation but also optimization opportunities through budget reallocation.",
  },
  {
    id: 8,
    title: "Data Period",
    value: "13 Weeks",
    description: "Weekly sales data from January to March 2018",
    accent: "#FFC2E2",
    insight: "Analysis covers 13 weeks of sales performance, capturing seasonal patterns and marketing effects. This timeframe provides sufficient data for reliable trend identification while being recent enough to inform current strategy. Consider expanding to longer periods for deeper seasonality insights.",
  },
];
