import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { model } from "../../../data/model";
import { formatCurrency, formatDay, formatMonthYear, niceTicks } from "../../../lib/format";
import { AXIS_LINE, AXIS_TICK, GRID_STROKE, LegendRow, TooltipBox } from "../../../components/charts/ChartParts";

const ACTUAL = "#1f1b2e";
const PREDICTED = "#7D71A7";

const data = model.combinedWeekly;
const values = data.flatMap((d) => [d.actual, d.predicted]);
const ticks = niceTicks(Math.min(0, ...values), Math.max(...values), 5);
// One tick per quarter keeps 113 weekly points legible.
const quarterTicks = data.map((d) => d.week).filter((w) => ["01", "04", "07", "10"].includes(w.slice(5, 7)) && Number(w.slice(8, 10)) <= 7);

export default function MainTrendChart() {
  return (
    <div>
      <div className="mb-3">
        <LegendRow
          items={[
            { label: "Actual sales", color: ACTUAL },
            { label: "Model prediction", color: PREDICTED, dashed: true },
          ]}
        />
      </div>
      <div className="h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="week"
              ticks={quarterTicks}
              tickFormatter={(w: string) => formatMonthYear(w).replace(" 20", " ’")}
              tick={AXIS_TICK}
              axisLine={AXIS_LINE}
              tickLine={false}
              minTickGap={12}
            />
            <YAxis
              ticks={ticks}
              domain={[ticks[0], ticks[ticks.length - 1]]}
              tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              cursor={{ stroke: "#b8acd3", strokeWidth: 1 }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <TooltipBox
                    title={`Week ending ${formatDay(String(label))}`}
                    rows={[
                      { label: "Actual", value: formatCurrency(Number(payload[0].payload.actual)), color: ACTUAL },
                      { label: "Predicted", value: formatCurrency(Number(payload[0].payload.predicted)), color: PREDICTED, dashed: true },
                    ]}
                  />
                ) : null
              }
            />
            <Line type="linear" dataKey="actual" stroke={ACTUAL} strokeWidth={1.75} dot={false} name="Actual sales" isAnimationActive={false} />
            <Line
              type="linear"
              dataKey="predicted"
              stroke={PREDICTED}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              name="Model prediction"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
