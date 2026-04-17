import { motion } from "framer-motion";
import { heatmapData, heatColor } from "../data/overviewData";

const divisions = ["Y", "D", "H", "I", "M", "Q"];
const channels = ["Google", "Email", "Facebook", "Affiliate"];

export default function CampaignHeatmap() {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-md p-6 border border-white shadow-lg overflow-hidden max-w-xl mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-[#7D71A7] mb-2">
          Channel Effectiveness Heatmap (Coefficients)
        </h3>
        <p className="text-sm text-gray-600">
          Darker color = higher impact on sales. Email dominates. Affiliate shows negative impact.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex">
          {/* Channel labels */}
          <div className="flex flex-col">
            <div className="h-8"></div>
            {channels.map((channel) => (
              <div
                key={channel}
                className="h-12 w-24 flex items-center justify-center text-xs font-semibold text-[#7D71A7] bg-gray-50 border border-gray-200"
              >
                {channel}
              </div>
            ))}
          </div>

          {/* Heatmap cells */}
          <div className="flex gap-1">
            {divisions.map((division) => (
              <div key={division} className="flex flex-col gap-1">
                {/* Division label */}
                <div className="h-8 w-12 flex items-center justify-center text-xs font-bold text-[#7D71A7] bg-[#CAADFF]/20 rounded">
                  Div {division}
                </div>

                {/* Cells for each channel */}
                {channels.map((channel) => {
                  const cellData = heatmapData.find(
                    (d) => d.division === division && d.channel === channel
                  );
                  return (
                    <motion.div
                      key={`${division}-${channel}`}
                      className="h-12 w-12 rounded-lg cursor-pointer border border-white/50"
                      style={{ backgroundColor: heatColor(cellData?.value || 50) }}
                      whileHover={{
                        scale: 1.15,
                        zIndex: 10,
                        boxShadow: "0 4px 12px rgba(125, 113, 167, 0.4)",
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      title={`${division} ${channel}: ${cellData?.value} / 100`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color scale legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
        <span>Low Impact</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(0) }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(25) }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(50) }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(75) }} />
          <div className="w-4 h-4 rounded" style={{ backgroundColor: heatColor(100) }} />
        </div>
        <span>High Impact</span>
      </div>
    </div>
  );
}
