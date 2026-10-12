import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { CHANNELS, CHANNEL_COLORS, doublingEffect, type ChannelName, type DivisionFit } from "../../../data/model";
import { formatCompact, formatCurrency, formatSignedCurrency, niceTicks } from "../../../lib/format";
import { AXIS_LINE, AXIS_TICK, GRID_STROKE, TooltipBox } from "../../../components/charts/ChartParts";

// A labelled dot with a white ring; 8px radius keeps it legible and easy to hover/tap.
function Dot(props: { cx?: number; cy?: number; payload?: Point }) {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload) return null;
  const right = cx < 120; // labels near the left edge go right so they never sit on the axis
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={CHANNEL_COLORS[payload.channel]} stroke="#ffffff" strokeWidth={2} />
      <text
        x={right ? cx + 14 : cx}
        y={right ? cy + 4 : cy - 14}
        textAnchor={right ? "start" : "middle"}
        fill="#1f1b2e"
        fontSize={12}
        fontWeight={600}
      >
        {payload.channel}
      </text>
    </g>
  );
}

interface Point {
  channel: ChannelName;
  x: number;
  y: number;
}

export default function SpendSalesScatter({ division }: { division: DivisionFit }) {
  const points: Point[] = CHANNELS.map((c) => ({
    channel: c,
    x: division.channels[c].impressions,
    y: doublingEffect(division.channels[c].coefficient),
  }));
  // Per-division "nice" axes (always including 0) so each division uses the full plot.
  const xTicks = niceTicks(0, Math.max(...points.map((p) => p.x)) * 1.08, 5);
  const yTicks = niceTicks(Math.min(0, ...points.map((p) => p.y)), Math.max(0, ...points.map((p) => p.y)) * 1.1, 5);

  return (
    <div className="h-[300px] sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 24, right: 32, bottom: 28, left: 4 }}>
          <CartesianGrid stroke={GRID_STROKE} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[xTicks[0], xTicks[xTicks.length - 1]]}
            ticks={xTicks}
            tickFormatter={(v: number) => formatCompact(v)}
            tick={AXIS_TICK}
            axisLine={AXIS_LINE}
            tickLine={false}
            label={{ value: `Impressions, total over ${division.weeks} weeks`, position: "insideBottom", offset: -18, fill: "#4a4560", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[yTicks[0], yTicks[yTicks.length - 1]]}
            ticks={yTicks}
            tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <ReferenceLine y={0} stroke="#8d84a8" strokeWidth={1.25} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "#b8acd3" }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as Point | undefined;
              return active && p ? (
                <TooltipBox
                  title={`${p.channel} · Division ${division.division}`}
                  rows={[
                    { label: "Impressions", value: formatCompact(p.x) },
                    { label: "If doubled", value: `${formatSignedCurrency(p.y)}/wk` },
                  ]}
                />
              ) : null;
            }}
          />
          <Scatter data={points} isAnimationActive={false} shape={(p: unknown) => <Dot {...(p as object)} />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
