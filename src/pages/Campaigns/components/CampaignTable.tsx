import { motion } from "framer-motion";

type CampaignRow = {
  name: string;
  spend: number;
  revenue: number;
  roi: number;
};

type Props = {
  rows: CampaignRow[];
};

export default function CampaignTable({ rows }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md shadow-lg">
      <table className="w-full text-sm">
        <thead className="bg-[#CAADFF]/40 text-[#7D71A7]">
          <tr>
            <th className="px-4 py-3 text-left">Campaign</th>
            <th className="px-4 py-3 text-right">Spend</th>
            <th className="px-4 py-3 text-right">Revenue</th>
            <th className="px-4 py-3 text-right">ROI</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ backgroundColor: "rgba(255, 194, 226, 0.25)" }}
              className="border-b last:border-none"
            >
              <td className="px-4 py-3 font-medium text-[#7D71A7]">
                {row.name}
              </td>
              <td className="px-4 py-3 text-right">
                £{row.spend.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                £{row.revenue.toLocaleString()}
              </td>
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  row.roi >= 1
                    ? "text-green-600"
                    : "text-rose-500"
                }`}
              >
                {row.roi.toFixed(2)}×
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
