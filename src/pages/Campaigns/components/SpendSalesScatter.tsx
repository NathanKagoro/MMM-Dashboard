import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { campaignScatterData } from "../data/campaignData";

const WIDTH = 1000;
const HEIGHT = 380;

const PADDING = {
  top: 60,
  right: 60,
  bottom: 80,
  left: 80,
};

// Dynamic domain based on data
const getXDomain = (): [number, number] => {
  const values = campaignScatterData.map(d => d.impressions);
  return [0, Math.max(...values) * 1.1];
};

const getYDomain = (): [number, number] => {
  const values = campaignScatterData.map(d => d.coefficient);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Use a more focused range to better distribute points
  const padding = (max - min) * 0.05;
  return [Math.max(min - padding, min * 1.1), max + padding];
};

const channelColors: Record<string, string> = {
  Google: "#45B7D1",
  Email: "#FF6B6B",
  Facebook: "#4ECDC4",
  Affiliate: "#95A5A6",
};

const divisionSpendExplanations: Record<string, string> = {
  Y: "Email dominates this division—adjusting spend shifts bubble sizes to show potential ROI scaling with budget increases.",
  D: "Email's massive coefficient means higher spend yields proportionally greater returns; watch the Email bubble grow significantly.",
  H: "Balanced Email and Google presence—spend increases highlight Email's superior efficiency relative to volume.",
  I: "Email's strong performance with Affiliate's negative drag; spending more on Email amplifies the gap between them.",
  M: "Email's sustained effectiveness counters Affiliate losses; higher spend emphasizes this channel's importance.",
  Q: "Similar to Division Y, Email leadership is clear; spend adjustments reveal scaling potential across channels.",
};

const scaleX = (v: number, xDomain: [number, number]) =>
  PADDING.left +
  ((v - xDomain[0]) / (xDomain[1] - xDomain[0])) *
    (WIDTH - PADDING.left - PADDING.right);

const scaleY = (v: number, yDomain: [number, number]) =>
  HEIGHT -
  PADDING.bottom -
  ((v - yDomain[0]) / (yDomain[1] - yDomain[0])) *
    (HEIGHT - PADDING.top - PADDING.bottom);

type Props = {
  selectedCampaign: string;
};

export default function SpendSalesScatter({ selectedCampaign }: Props) {
  const [spendMultiplier, setSpendMultiplier] = useState(1);

  const xDomain = getXDomain();
  const yDomain = getYDomain();

  const filteredPoints = useMemo(() => {
    return campaignScatterData.filter(d => d.division === selectedCampaign);
  }, [selectedCampaign]);

  return (
    <div className="rounded-3xl bg-[#F4EBFF] p-8 shadow-xl flex flex-col items-center">
      {/* Title and Description - Top */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#7D71A7] mb-2">
          Division {selectedCampaign} - Channel Effectiveness vs Volume
        </h2>
        <p className="text-sm text-gray-600 max-w-md mb-3">
          Each point shows a marketing channel's performance. X-axis: impression volume. Y-axis: sales impact per million impressions. Larger bubbles = more impressions.
        </p>
        <p className="text-xs text-[#7D71A7]/70 max-w-md italic">
          {divisionSpendExplanations[selectedCampaign]}
        </p>
      </div>

      {/* Chart - Middle */}
      <div className="flex justify-center mb-6">
        <svg width={WIDTH} height={HEIGHT}>
        {/* Axes */}
        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={HEIGHT - PADDING.bottom}
          stroke="#4B3F72"
          strokeWidth={2}
        />
        <line
          x1={PADDING.left}
          y1={HEIGHT - PADDING.bottom}
          x2={WIDTH - PADDING.right}
          y2={HEIGHT - PADDING.bottom}
          stroke="#4B3F72"
          strokeWidth={2}
        />

        {/* Zero line for Y-axis (if coefficient can be negative) */}
        {yDomain[0] < 0 && yDomain[1] > 0 && (
          <line
            x1={PADDING.left}
            y1={scaleY(0, yDomain)}
            x2={WIDTH - PADDING.right}
            y2={scaleY(0, yDomain)}
            stroke="#FFB6C1"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.5}
          />
        )}

        {/* Y-axis label */}
        <text
          x={25}
          y={HEIGHT / 2}
          transform={`rotate(-90 25 ${HEIGHT / 2})`}
          textAnchor="middle"
          className="fill-[#4B3F72] text-sm font-semibold"
        >
          Sales Impact ($ per million impressions)
        </text>

        {/* X-axis label */}
        <text
          x={WIDTH / 2}
          y={HEIGHT - 25}
          textAnchor="middle"
          className="fill-[#4B3F72] text-sm font-semibold"
        >
          Impressions (Millions)
        </text>

        {/* Grid lines and X-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const x = PADDING.left + tick * (WIDTH - PADDING.left - PADDING.right);
          const value = xDomain[0] + tick * (xDomain[1] - xDomain[0]);
          return (
            <g key={`x-tick-${tick}`}>
              <line
                x1={x}
                y1={PADDING.top}
                x2={x}
                y2={HEIGHT - PADDING.bottom}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
              <line
                x1={x}
                y1={HEIGHT - PADDING.bottom}
                x2={x}
                y2={HEIGHT - PADDING.bottom + 6}
                stroke="#4B3F72"
                strokeWidth={2}
              />
              <text
                x={x}
                y={HEIGHT - PADDING.bottom + 20}
                textAnchor="middle"
                className="fill-[#4B3F72] text-xs"
              >
                {value.toFixed(0)}M
              </text>
            </g>
          );
        })}

        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = HEIGHT - PADDING.bottom - tick * (HEIGHT - PADDING.top - PADDING.bottom);
          const value = yDomain[0] + tick * (yDomain[1] - yDomain[0]);
          return (
            <g key={`y-tick-${tick}`}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={WIDTH - PADDING.right}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
              <line
                x1={PADDING.left - 6}
                y1={y}
                x2={PADDING.left}
                y2={y}
                stroke="#4B3F72"
                strokeWidth={2}
              />
              <text
                x={PADDING.left - 12}
                y={y + 4}
                textAnchor="end"
                className="fill-[#4B3F72] text-xs"
              >
                {Math.abs(value) > 100000 ? `${(value / 1000).toFixed(0)}K` : Math.abs(value) > 1000 ? `${(value / 1000).toFixed(1)}K` : value.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Scatter points */}
        {filteredPoints.map((p, idx) => (
          <motion.g key={p.id}>
            <motion.circle
              cx={scaleX(p.impressions, xDomain)}
              cy={scaleY(p.coefficient, yDomain)}
              r={Math.max(20, Math.min(50, (p.scale / 2) * spendMultiplier))}
              fill={channelColors[p.channel]}
              opacity={0.8}
              initial={false}
              animate={{
                cx: scaleX(p.impressions, xDomain),
                cy: scaleY(p.coefficient, yDomain),
                r: Math.max(20, Math.min(50, (p.scale / 2) * spendMultiplier)),
              }}
              transition={{ type: "spring", stiffness: 110, damping: 22 }}
              whileHover={{ r: Math.max(25, Math.min(60, (p.scale / 2) * spendMultiplier)) + 6 }}
            />
            <title>{`${p.channel} - ${p.impressions.toFixed(1)}M impressions, ${p.coefficient.toFixed(0)} coefficient`}</title>
          </motion.g>
        ))}
      </svg>
      </div>

      {/* Spend Multiplier Slider */}
      <div className="w-full max-w-md mb-6 px-4">
        <label className="text-sm font-semibold text-[#7D71A7] block mb-2">
          Marketing Spend Adjustment: {(spendMultiplier * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={spendMultiplier}
          onChange={(e) => setSpendMultiplier(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#7D71A7]"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>50% Spend</span>
          <span>100% Spend</span>
          <span>200% Spend</span>
        </div>
      </div>

      {/* Legend - Bottom */}
      <div className="flex gap-6 flex-wrap justify-center">
        {Object.entries(channelColors).map(([channel, color]) => (
          <div key={channel} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-[#4B3F72] font-medium">{channel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
