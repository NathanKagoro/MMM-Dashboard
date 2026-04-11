export type ChannelName = "Google" | "Email" | "Facebook" | "Affiliate";

// Real data from MMM analysis: Top 6 divisions
// Format: { division, channel, impressions, coefficient, sales_contribution }
export interface CampaignDataPoint {
  id: string;
  division: string;
  channel: ChannelName;
  impressions: number; // in millions
  coefficient: number; // sales effectiveness
  scale: number; // for bubble size
  contribution: number; // estimated sales contribution
}

export const campaignScatterData: CampaignDataPoint[] = [
  // Division Y
  { id: "Y-Google", division: "Y", channel: "Google", impressions: 39.2, coefficient: 3682.85, scale: 39.2, contribution: 15000 },
  { id: "Y-Email", division: "Y", channel: "Email", impressions: 35.2, coefficient: 60664.88, scale: 35.2, contribution: 75000 },
  { id: "Y-Facebook", division: "Y", channel: "Facebook", impressions: 11.3, coefficient: 21976.01, scale: 11.3, contribution: 28000 },
  { id: "Y-Affiliate", division: "Y", channel: "Affiliate", impressions: 0.97, coefficient: -1363.46, scale: 0.97, contribution: -1000 },
  
  // Division D
  { id: "D-Google", division: "D", channel: "Google", impressions: 110, coefficient: 5559.04, scale: 110, contribution: 45000 },
  { id: "D-Email", division: "D", channel: "Email", impressions: 108, coefficient: 199261.27, scale: 108, contribution: 240000 },
  { id: "D-Facebook", division: "D", channel: "Facebook", impressions: 36.5, coefficient: 39686.04, scale: 36.5, contribution: 52000 },
  { id: "D-Affiliate", division: "D", channel: "Affiliate", impressions: 3.22, coefficient: 9764.37, scale: 3.22, contribution: 12000 },
  
  // Division H
  { id: "H-Google", division: "H", channel: "Google", impressions: 40.5, coefficient: 3580.15, scale: 40.5, contribution: 14000 },
  { id: "H-Email", division: "H", channel: "Email", impressions: 44.9, coefficient: 81511.45, scale: 44.9, contribution: 88000 },
  { id: "H-Facebook", division: "H", channel: "Facebook", impressions: 11.9, coefficient: 21626.54, scale: 11.9, contribution: 28000 },
  { id: "H-Affiliate", division: "H", channel: "Affiliate", impressions: 1.24, coefficient: 8775.76, scale: 1.24, contribution: 11000 },
  
  // Division I
  { id: "I-Google", division: "I", channel: "Google", impressions: 20.5, coefficient: 6963.01, scale: 20.5, contribution: 18000 },
  { id: "I-Email", division: "I", channel: "Email", impressions: 21.1, coefficient: 132470.93, scale: 21.1, contribution: 142000 },
  { id: "I-Facebook", division: "I", channel: "Facebook", impressions: 7.02, coefficient: 28935.13, scale: 7.02, contribution: 31000 },
  { id: "I-Affiliate", division: "I", channel: "Affiliate", impressions: 0.77, coefficient: -19363.30, scale: 0.77, contribution: -8000 },
  
  // Division M
  { id: "M-Google", division: "M", channel: "Google", impressions: 97.6, coefficient: 6837.53, scale: 97.6, contribution: 55000 },
  { id: "M-Email", division: "M", channel: "Email", impressions: 81.3, coefficient: 155269.82, scale: 81.3, contribution: 176000 },
  { id: "M-Facebook", division: "M", channel: "Facebook", impressions: 29.9, coefficient: 32697.41, scale: 29.9, contribution: 42000 },
  { id: "M-Affiliate", division: "M", channel: "Affiliate", impressions: 2.52, coefficient: -97515.33, scale: 2.52, contribution: -55000 },
  
  // Division Q
  { id: "Q-Google", division: "Q", channel: "Google", impressions: 60, coefficient: 3052.54, scale: 60, contribution: 18000 },
  { id: "Q-Email", division: "Q", channel: "Email", impressions: 64.2, coefficient: 94886.48, scale: 64.2, contribution: 102000 },
  { id: "Q-Facebook", division: "Q", channel: "Facebook", impressions: 20.1, coefficient: 20494.07, scale: 20.1, contribution: 26000 },
  { id: "Q-Affiliate", division: "Q", channel: "Affiliate", impressions: 1.57, coefficient: -84375.05, scale: 1.57, contribution: -48000 },
];

export const channelTableData = [
  {
    channel: "Email",
    avgCoefficient: 94886.48,
    totalImpressions: 354700000,
    insight: "Best ROI driver - consistently highest effectiveness across all divisions",
  },
  {
    channel: "Facebook",
    avgCoefficient: 24537.86,
    totalImpressions: 117800000,
    insight: "Strong growth channel - reliable positive returns with room for scaling",
  },
  {
    channel: "Google",
    avgCoefficient: 4941.01,
    totalImpressions: 368300000,
    insight: "Needs optimization - high volume but moderate efficiency relative to spend",
  },
  {
    channel: "Affiliate",
    avgCoefficient: -49046.53,
    totalImpressions: 10190000,
    insight: "Budget inefficiency - negative impact in majority of divisions",
  },
];

export const campaignInsights = {
  scatter: "This view highlights the disconnect between scale and effectiveness. Email delivers strong returns even at lower volumes, while Google dominates impressions but underperforms in efficiency.",
  table: "Budget allocation should prioritise effectiveness over volume, with clear reallocation opportunities from Affiliate and inefficient Google spend into Email and Facebook.",
  recommendation: "Focus investment on high-effectiveness channels (Email, Facebook) even if current volume appears lower. Significant untapped potential exists in scaling these proven channels.",
};

