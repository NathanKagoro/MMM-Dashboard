import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Page, PageHeader } from "../../components/ui/Page";
import { AXIS_LINE, AXIS_TICK, GRID_STROKE, LegendRow, TooltipBox } from "../../components/charts/ChartParts";
import {
  CHANNEL_COLORS,
  channelSummary,
  doublingEffect,
  model,
  monthlyAverages,
  type ChannelName,
} from "../../data/model";
import { formatCompact, formatCurrency, formatMonthYear, formatR2, formatSignedCurrency, niceTicks } from "../../lib/format";
import { PERIOD_SHORT } from "../../data/period";

const ACTUAL = "#1f1b2e";

/**
 * Value label for diverging bars. Positive labels sit past the bar end; negative labels sit
 * just right of the zero line, so they never collide with the category axis on narrow screens.
 */
function EffectLabel(props: { x?: unknown; y?: unknown; width?: unknown; height?: unknown; value?: unknown }) {
  const x = Number(props.x), y = Number(props.y), w = Number(props.width), h = Number(props.height), v = Number(props.value);
  if (![x, y, w, h, v].every(Number.isFinite)) return null;
  const right = Math.max(x, x + w);
  return (
    <text x={right + 6} y={y + h / 2} dominantBaseline="central" fill="#1f1b2e" fontSize={12} fontWeight={600}>
      {formatSignedCurrency(v, { compact: true })}
    </text>
  );
}
const PREDICTED = "#7D71A7";

const summary = channelSummary();
const byEffect = [...summary].sort((a, b) => b.meanDoublingEffect - a.meanDoublingEffect);
const byVolume = [...summary].sort((a, b) => b.totalImpressions - a.totalImpressions);
const monthly = monthlyAverages(model.combinedWeekly);
const fitTicks = niceTicks(0, Math.max(...monthly.flatMap((m) => [m.actual, m.predicted])), 5);
const effectTicks = niceTicks(Math.min(...byEffect.map((s) => s.meanDoublingEffect)), Math.max(...byEffect.map((s) => s.meanDoublingEffect)), 5);
const volumeTicks = niceTicks(0, Math.max(...byVolume.map((s) => s.totalImpressions)), 5);

// Rows ordered by average effect so the dot plot reads in the same order as the bar chart.
const spread = model.topDivisions.flatMap((d) =>
  byEffect.map(({ channel: c }) => ({ channel: c, division: d.division, effect: doublingEffect(d.channels[c].coefficient) })),
);
const spreadTicks = niceTicks(Math.min(...spread.map((p) => p.effect)), Math.max(...spread.map((p) => p.effect)), 6);
const n = model.topDivisions.length;

const email = summary.find((s) => s.channel === "Email")!;
const facebook = summary.find((s) => s.channel === "Facebook")!;
const google = summary.find((s) => s.channel === "Google")!;
const affiliate = summary.find((s) => s.channel === "Affiliate")!;

const recommendations = [
  {
    title: "Scale Email",
    channel: "Email" as ChannelName,
    detail: `Largest positive effect in ${email.positiveDivisions}/${n} divisions; ${formatSignedCurrency(email.meanDoublingEffect, { compact: true })}/week on average if doubled.`,
  },
  {
    title: "Grow Facebook",
    channel: "Facebook" as ChannelName,
    detail: `Positive in ${facebook.positiveDivisions}/${n} divisions with a third of Email's reach; a steady second lever.`,
  },
  {
    title: "Optimise Google",
    channel: "Google" as ChannelName,
    detail: `${formatCompact(google.totalImpressions)} impressions — ${google === byVolume[0] ? "the most of any channel" : `close to ${byVolume[0].channel}'s ${formatCompact(byVolume[0].totalImpressions)}`} — but the smallest positive effect: work on targeting before adding volume.`,
  },
  {
    title: "Review Affiliate",
    channel: "Affiliate" as ChannelName,
    detail: `Negative in ${affiliate.negativeDivisions}/${n} divisions. Test with a holdout before cutting: the sign may reflect confounding.`,
  },
];

export default function SalesPage() {
  return (
    <Page>
      <PageHeader
        title="Sales & insights"
        lead={`${byVolume[0].channel} and ${byVolume[1].channel} deliver similar reach, but ${byEffect[0].channel}'s modelled effect on sales is ${Math.round(
          byEffect[0].meanDoublingEffect / google.meanDoublingEffect,
        )}× Google's. All figures cover ${PERIOD_SHORT} for the ${n} best-fitting divisions.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Model fit by month"
          subtitle={`Average weekly sales per month, ${n} divisions combined. Weekly in-sample R² ${formatR2(model.combinedR2)}.`}
        >
          <div className="mb-3">
            <LegendRow
              items={[
                { label: "Actual", color: ACTUAL },
                { label: "Predicted", color: PREDICTED, dashed: true },
              ]}
            />
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m: string) => formatMonthYear(`${m}-01`).replace(" 20", " ’")}
                  tick={AXIS_TICK}
                  axisLine={AXIS_LINE}
                  tickLine={false}
                  minTickGap={16}
                />
                <YAxis
                  ticks={fitTicks}
                  domain={[fitTicks[0], fitTicks[fitTicks.length - 1]]}
                  tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip
                  cursor={{ stroke: "#CAADFF" }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof monthly)[number] | undefined;
                    return active && p ? (
                      <TooltipBox
                        title={`${formatMonthYear(`${p.month}-01`)} · ${p.weeks} weeks`}
                        rows={[
                          { label: "Actual / wk", value: formatCurrency(p.actual), color: ACTUAL },
                          { label: "Predicted / wk", value: formatCurrency(p.predicted), color: PREDICTED, dashed: true },
                        ]}
                      />
                    ) : null;
                  }}
                />
                <Line type="linear" dataKey="actual" stroke={ACTUAL} strokeWidth={2} dot={{ r: 2.5, fill: ACTUAL }} isAnimationActive={false} />
                <Line
                  type="linear"
                  dataKey="predicted"
                  stroke={PREDICTED}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Average channel effect"
          subtitle={`Change in weekly sales if impressions double, mean of ${n} divisions.`}
        >
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byEffect} layout="vertical" margin={{ top: 4, right: 56, bottom: 0, left: 0 }} barCategoryGap={14}>
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  ticks={effectTicks}
                  domain={[effectTicks[0], effectTicks[effectTicks.length - 1]]}
                  tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
                  tick={AXIS_TICK}
                  axisLine={AXIS_LINE}
                  tickLine={false}
                />
                <YAxis type="category" dataKey="channel" tick={{ ...AXIS_TICK, fill: "#1f1b2e", fontWeight: 600 }} axisLine={false} tickLine={false} width={76} />
                <ReferenceLine x={0} stroke="#7D71A7" />
                <Tooltip
                  cursor={{ fill: "#fdf0f6" }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof byEffect)[number] | undefined;
                    return active && p ? (
                      <TooltipBox
                        title={p.channel}
                        rows={[
                          { label: "If doubled", value: `${formatSignedCurrency(p.meanDoublingEffect)}/wk` },
                          { label: "Positive in", value: `${p.positiveDivisions}/${n} divisions` },
                        ]}
                      />
                    ) : null;
                  }}
                />
                <Bar dataKey="meanDoublingEffect" radius={4} isAnimationActive={false}>
                  {byEffect.map((s) => (
                    <Cell key={s.channel} fill={CHANNEL_COLORS[s.channel]} />
                  ))}
                  <LabelList dataKey="meanDoublingEffect" content={EffectLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Reach by channel" subtitle={`Total impressions, ${n} divisions, ${model.period.weeks} weeks. Volume and effect rank differently.`}>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byVolume} layout="vertical" margin={{ top: 4, right: 56, bottom: 0, left: 0 }} barCategoryGap={14}>
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  ticks={volumeTicks}
                  domain={[0, volumeTicks[volumeTicks.length - 1]]}
                  tickFormatter={(v: number) => formatCompact(v)}
                  tick={AXIS_TICK}
                  axisLine={AXIS_LINE}
                  tickLine={false}
                />
                <YAxis type="category" dataKey="channel" tick={{ ...AXIS_TICK, fill: "#1f1b2e", fontWeight: 600 }} axisLine={false} tickLine={false} width={76} />
                <Tooltip
                  cursor={{ fill: "#fdf0f6" }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof byVolume)[number] | undefined;
                    return active && p ? (
                      <TooltipBox title={p.channel} rows={[{ label: "Impressions", value: Math.round(p.totalImpressions).toLocaleString("en-GB") }]} />
                    ) : null;
                  }}
                />
                <Bar dataKey="totalImpressions" radius={4} isAnimationActive={false}>
                  {byVolume.map((s) => (
                    <Cell key={s.channel} fill={CHANNEL_COLORS[s.channel]} />
                  ))}
                  <LabelList
                    dataKey="totalImpressions"
                    position="right"
                    formatter={(v: unknown) => formatCompact(Number(v))}
                    style={{ fill: "#1f1b2e", fontSize: 12, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="How consistent is each effect?" subtitle="One dot per division: change in weekly sales if impressions double.">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  dataKey="effect"
                  ticks={spreadTicks}
                  domain={[spreadTicks[0], spreadTicks[spreadTicks.length - 1]]}
                  tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
                  tick={AXIS_TICK}
                  axisLine={AXIS_LINE}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="channel"
                  allowDuplicatedCategory={false}
                  tick={{ ...AXIS_TICK, fill: "#1f1b2e", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={76}
                />
                <ReferenceLine x={0} stroke="#7D71A7" />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof spread)[number] | undefined;
                    return active && p ? (
                      <TooltipBox title={`${p.channel} · Division ${p.division}`} rows={[{ label: "If doubled", value: `${formatSignedCurrency(p.effect)}/wk` }]} />
                    ) : null;
                  }}
                />
                {byEffect.map(({ channel: c }) => (
                  <Scatter
                    key={c}
                    data={spread.filter((p) => p.channel === c)}
                    isAnimationActive={false}
                    shape={(p: { cx?: number; cy?: number }) => (
                      <circle cx={p.cx} cy={p.cy} r={6} fill={CHANNEL_COLORS[c]} fillOpacity={0.8} stroke="#ffffff" strokeWidth={1.5} />
                    )}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="What the model suggests" subtitle="Directional: the model is correlational and fitted in-sample. Validate with lift tests before moving budget.">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((r, i) => (
            <li key={r.title} className="rounded-xl border border-brand-line bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-lilacSoft text-sm font-bold text-brand-plum">{i + 1}</span>
                <span aria-hidden="true" className="h-3 w-3 rounded-[3px]" style={{ background: CHANNEL_COLORS[r.channel] }} />
                <h3 className="font-semibold text-ink">{r.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{r.detail}</p>
            </li>
          ))}
        </ol>
      </Card>
    </Page>
  );
}
