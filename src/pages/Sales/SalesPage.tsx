import { motion } from "framer-motion";
import AnimatedBackground from "../../components/AnimatedBackground";
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  effectivenessData,
  volumeData,
  modelFitData,
  contributionData,
  recommendations,
} from "./data/salesData";

export default function SalesPage() {
  const [activeRec, setActiveRec] = useState(0);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col gap-8 px-16 pt-16 pb-16">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-6xl font-bold text-[#7D71A7] tracking-wide mb-2">
            Sales & Insights
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            There is a clear imbalance between spend and performance. Google dominates volume but not
            effectiveness, while Email delivers the highest returns.
          </p>
        </div>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model Fit Chart */}
          <motion.div
            className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-[#7D71A7] mb-4">
              Model Fit: Predicted vs Actual Sales
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              The model closely tracks actual sales, indicating strong explanatory power and reliability
              for strategic decisions.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={modelFitData}>
                <CartesianGrid strokeOpacity={0.3} />
                <XAxis dataKey="week" stroke="#7D71A7" />
                <YAxis stroke="#7D71A7" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  name="Actual Sales"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#CAADFF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Effectiveness vs Volume */}
          <motion.div
            className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-[#7D71A7] mb-2">Channel Effectiveness</h2>
            <p className="text-sm text-gray-600 mb-4">
              Email ≫ Facebook &gt; Google &gt; Affiliate
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={effectivenessData}>
                <CartesianGrid strokeOpacity={0.3} />
                <XAxis dataKey="channel" stroke="#7D71A7" />
                <YAxis stroke="#7D71A7" />
                <Tooltip />
                <Bar dataKey="value" fill="#CAADFF" radius={8}>
                  {effectivenessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Volume Analysis */}
        <motion.div
          className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#7D71A7] mb-2">Impression Volume by Channel</h2>
          <p className="text-sm text-gray-600 mb-4">
            Google ≫ Email &gt; Facebook &gt; Affiliate — High volume doesn't guarantee effectiveness.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeOpacity={0.3} />
              <XAxis dataKey="channel" stroke="#7D71A7" />
              <YAxis stroke="#7D71A7" />
              <Tooltip />
              <Bar dataKey="value" fill="#FFC2E2" radius={8}>
                {volumeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales Contribution Treemap */}
        <motion.div
          className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#7D71A7] mb-2">Sales Contribution by Division & Channel</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sales contribution is heavily concentrated in Email and Facebook, with Affiliate contributing little
            or negatively in several divisions.
          </p>

          {/* Treemap Grid - Organic Layout */}
          <div className="mb-6 p-4 bg-white/50 rounded-2xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {contributionData.map((entry, index) => {
                const colors: Record<string, string> = {
                  Email: "#FF6B6B",
                  Facebook: "#4ECDC4",
                  Google: "#45B7D1",
                  Affiliate: "#95A5A6",
                };
                // Calculate size based on contribution value
                const absValue = Math.abs(entry.value);
                const maxValue = Math.max(...contributionData.map(d => Math.abs(d.value)));
                const sizeRatio = absValue / maxValue;
                
                // Create varied sizes: small (80px), medium (110px), large (140px)
                let size;
                if (sizeRatio < 0.3) {
                  size = 80;
                } else if (sizeRatio < 0.6) {
                  size = 110;
                } else {
                  size = 140;
                }
                
                return (
                  <div
                    key={index}
                    className="rounded-lg p-3 flex flex-col items-center justify-center text-center transition-transform hover:scale-110 shadow-md"
                    style={{
                      backgroundColor: colors[entry.channel],
                      width: `${size}px`,
                      height: `${size}px`,
                      opacity: entry.value < 0 ? 0.6 : 1,
                    }}
                  >
                    <div className="text-xs font-bold text-white mb-1">Div {entry.division}</div>
                    <div className="text-xs text-white font-semibold">{entry.channel}</div>
                    <div className="text-xs text-white/80 font-bold">
                      ${(entry.value / 1000).toFixed(0)}K
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-6 flex-wrap justify-center">
            <div className="text-sm">
              <div className="font-semibold text-[#7D71A7] mb-2">Channels:</div>
              <div className="space-y-2">
                {[
                  { name: "Email", color: "#FF6B6B" },
                  { name: "Facebook", color: "#4ECDC4" },
                  { name: "Google", color: "#45B7D1" },
                  { name: "Affiliate", color: "#95A5A6" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#4B3F72]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-[#7D71A7] mb-2">Notes:</div>
              <div className="space-y-1 text-[#4B3F72]">
                <div>• Box height represents contribution size</div>
                <div>• Faded boxes = negative contribution</div>
                <div>• Divisions: Y, D, H, I, M, Q</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[#7D71A7] mb-4">Strategic Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl cursor-pointer transition-all border-2"
                style={{
                  backgroundColor: activeRec === index ? `${rec.color}20` : "#f5f5f5",
                  borderColor: activeRec === index ? rec.color : "#e0e0e0",
                }}
                onClick={() => setActiveRec(index)}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: rec.color }}
                >
                  {index + 1}
                </div>
                <h3 className="font-bold text-sm text-[#7D71A7] mb-1">{rec.title}</h3>
                <p className="text-xs text-gray-600">{rec.description}</p>
                <p className="text-xs mt-2 font-semibold">
                  Priority: <span style={{ color: rec.color }} className="uppercase">{rec.priority}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Items */}
        <motion.div
          className="rounded-3xl p-8 shadow-xl"
          style={{ background: "linear-gradient(135deg, #7d71a7, #caadff)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Next Steps</h2>
          <ul className="text-white space-y-2">
            <li>✓ Allocate more budget to Email marketing - highest ROI confirmed</li>
            <li>✓ Scale Facebook campaigns with confidence (consistent positive returns)</li>
            <li>✓ Audit & optimize Google Ads for better efficiency</li>
            <li>✓ Reduce or eliminate Affiliate program (negative impact in key divisions)</li>
            <li>✓ Monitor model performance weekly and adjust as market conditions change</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
