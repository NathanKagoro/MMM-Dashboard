// Channel effectiveness (normalized coefficients across top 6)
export const effectivenessData = [
  { channel: "Email", value: 94.9, color: "#FF6B6B" },
  { channel: "Facebook", value: 24.5, color: "#4ECDC4" },
  { channel: "Google", value: 4.9, color: "#45B7D1" },
  { channel: "Affiliate", value: -49.0, color: "#95A5A6" },
];

// Total impressions by channel (in millions)
export const volumeData = [
  { channel: "Google", value: 368.3, color: "#45B7D1" },
  { channel: "Email", value: 354.7, color: "#FF6B6B" },
  { channel: "Facebook", value: 117.8, color: "#4ECDC4" },
  { channel: "Affiliate", value: 10.2, color: "#95A5A6" },
];

// Model fit: Predicted vs Actual Sales
export const modelFitData = [
  { week: "Jan", actual: 62000, predicted: 64000 },
  { week: "Feb", actual: 70000, predicted: 72000 },
  { week: "Mar", actual: 65000, predicted: 67000 },
  { week: "Apr", actual: 68000, predicted: 69000 },
  { week: "May", actual: 75000, predicted: 76000 },
  { week: "Jun", actual: 78000, predicted: 79000 },
];

// Contribution treemap data by division and channel
export const contributionData = [
  { division: "D", channel: "Email", value: 240000 },
  { division: "M", channel: "Email", value: 176000 },
  { division: "I", channel: "Email", value: 142000 },
  { division: "Q", channel: "Email", value: 102000 },
  { division: "H", channel: "Email", value: 88000 },
  { division: "Y", channel: "Email", value: 75000 },
  
  { division: "D", channel: "Facebook", value: 52000 },
  { division: "M", channel: "Facebook", value: 42000 },
  { division: "I", channel: "Facebook", value: 31000 },
  { division: "H", channel: "Facebook", value: 28000 },
  { division: "Q", channel: "Facebook", value: 26000 },
  { division: "Y", channel: "Facebook", value: 28000 },
  
  { division: "M", channel: "Google", value: 55000 },
  { division: "D", channel: "Google", value: 45000 },
  { division: "Q", channel: "Google", value: 18000 },
  { division: "I", channel: "Google", value: 18000 },
  { division: "H", channel: "Google", value: 14000 },
  { division: "Y", channel: "Google", value: 15000 },
  
  { division: "D", channel: "Affiliate", value: 12000 },
  { division: "H", channel: "Affiliate", value: 11000 },
  { division: "Y", channel: "Affiliate", value: -1000 },
  { division: "I", channel: "Affiliate", value: -8000 },
  { division: "M", channel: "Affiliate", value: -55000 },
  { division: "Q", channel: "Affiliate", value: -48000 },
];

// Recommendations for stakeholders
export const recommendations = [
  {
    title: "Scale Email",
    description: "Highest ROI across all divisions",
    priority: "critical",
    color: "#FF6B6B",
  },
  {
    title: "Grow Facebook",
    description: "Consistent positive returns",
    priority: "high",
    color: "#4ECDC4",
  },
  {
    title: "Optimise Google",
    description: "High spend, underperforming efficiency",
    priority: "medium",
    color: "#45B7D1",
  },
  {
    title: "Cut Affiliate",
    description: "Negative impact in key divisions",
    priority: "critical",
    color: "#95A5A6",
  },
];
