import { timeSeriesData } from "../data/overviewData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MainTrendChart() {
  return (
    <div className="h-[420px] rounded-2xl bg-white/5 p-6 backdrop-blur">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timeSeriesData}>
          <CartesianGrid strokeOpacity={0.5} />
          <XAxis
            stroke="#303234"
            strokeWidth={2}
            tick={{ fill: "#303234", fontSize: 12 }}
            dataKey="date"
          />

          <YAxis
            stroke="#303234"
            strokeWidth={2}
            tick={{ fill: "#303234", fontSize: 12 }}
          />

          <Tooltip 
            contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid #CAADFF" }}
            formatter={(value: any) => `${typeof value === 'number' ? value.toLocaleString() : value}`}
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#FF6B6B"
            strokeWidth={3}
            dot={false}
            name="Actual Sales"
          />

          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#CAADFF"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            name="Predicted Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
