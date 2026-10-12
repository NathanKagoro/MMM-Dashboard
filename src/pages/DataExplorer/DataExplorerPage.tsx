import { useMemo, useState } from "react";
import { Sigma, TriangleAlert, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, DivisionPicker, Page, PageHeader } from "../../components/ui/Page";
import { AXIS_LINE, AXIS_TICK, GRID_STROKE, Swatch, TooltipBox } from "../../components/charts/ChartParts";
import { CHANNELS, CHANNEL_COLORS, DIVISIONS, doublingEffect, getDivision, meanR2, model } from "../../data/model";
import { formatCompact, formatR2, formatSignedCurrency, niceTicks } from "../../lib/format";
import { PERIOD_LABEL } from "../../data/period";
import {
  divisionNarrative,
  modelEquation,
  modelInterpretation,
  modelingLimitations,
  nextActions,
  processSteps,
  takeaways,
} from "./data/methodologyData";

const topSet = new Set(DIVISIONS);
const r2Data = model.allDivisionR2.map((d) => ({ ...d, top: topSet.has(d.division) }));
const r2Ticks = niceTicks(0, Math.max(...r2Data.map((d) => d.r2)), 5);

export default function DataExplorerPage() {
  const [selected, setSelected] = useState(DIVISIONS[0]);
  const division = getDivision(selected);
  const story = useMemo(() => divisionNarrative(division), [division]);
  const maxVolume = Math.max(...CHANNELS.map((c) => division.channels[c].impressions));
  const maxEffect = Math.max(...CHANNELS.map((c) => Math.abs(doublingEffect(division.channels[c].coefficient))));

  return (
    <Page>
      <PageHeader
        eyebrow="Data & methodology"
        title="How the numbers are made"
        lead={`Every figure in this dashboard is re-derived from one CSV: ${model.rows.toLocaleString("en-GB")} weekly rows, ${model.divisionCount} divisions, ${PERIOD_LABEL}.`}
      />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { k: "Rows", v: model.rows.toLocaleString("en-GB"), n: `${model.divisionCount} divisions × ${model.period.weeks} weeks` },
          { k: "Divisions modelled", v: `${DIVISIONS.length}`, n: "Highest in-sample R²" },
          { k: "Mean R²", v: formatR2(meanR2()), n: `Top ${DIVISIONS.length}; all ${model.divisionCount}: ${formatR2(model.allDivisionR2.reduce((s, d) => s + d.r2, 0) / model.allDivisionR2.length)}` },
          { k: "Spend data", v: "None", n: "So ROI is not reported" },
        ].map((x) => (
          <div key={x.k} className="card !p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">{x.k}</dt>
            <dd className="num mt-1 text-2xl font-bold text-ink">{x.v}</dd>
            <dd className="mt-0.5 text-xs text-ink-muted">{x.n}</dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-4">
        <h2 className="text-title font-bold text-ink">Method</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li key={s.eyebrow} className="card !p-5">
              <span className="eyebrow">Step {s.eyebrow}</span>
              <h3 className="mt-2 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.description}</p>
            </li>
          ))}
        </ol>
        <Card
          title={
            <span className="flex items-center gap-2">
              <Sigma className="h-5 w-5 text-brand-strong" aria-hidden="true" /> The model
            </span>
          }
        >
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-brand-wash p-4 font-mono text-[13px] leading-6 text-ink">{modelEquation}</pre>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{modelInterpretation}</p>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-title font-bold text-ink">Results</h2>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card title="Model fit (R²) for all divisions" subtitle={`Purple bars are the ${DIVISIONS.length} divisions used in the dashboard.`}>
            <div className="h-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={r2Data} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }} barCategoryGap={3}>
                  <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                  <XAxis type="number" ticks={r2Ticks} domain={[0, r2Ticks[r2Ticks.length - 1]]} tickFormatter={(v: number) => v.toFixed(1)} tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
                  <YAxis type="category" dataKey="division" tick={{ ...AXIS_TICK, fill: "#1f1b2e" }} axisLine={false} tickLine={false} width={24} interval={0} />
                  <Tooltip
                    cursor={{ fill: "rgba(125,113,167,0.08)" }}
                    content={({ active, payload }) => {
                      const p = payload?.[0]?.payload as (typeof r2Data)[number] | undefined;
                      return active && p ? <TooltipBox title={`Division ${p.division}`} rows={[{ label: "R²", value: formatR2(p.r2) }, { label: "Weeks", value: String(p.rows) }]} /> : null;
                    }}
                  />
                  <Bar dataKey="r2" radius={[0, 3, 3, 0]} isAnimationActive={false}>
                    {r2Data.map((d) => (
                      <Cell key={d.division} fill={d.top ? "#5f5390" : "#d9d0e6"} />
                    ))}
                    <LabelList dataKey="r2" position="right" formatter={(v: unknown) => Number(v).toFixed(2)} style={{ fill: "#4a4560", fontSize: 11 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {model.duplicateWeekDivisions.length > 0 && (
              <p className="mt-2 text-xs text-ink-muted">
                Division {model.duplicateWeekDivisions.join(", ")} has two rows per week ({r2Data.find((d) => d.division === model.duplicateWeekDivisions[0])?.rows} rows); it is fitted as-is.
              </p>
            )}
          </Card>

          <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {takeaways.map((t) => (
              <div key={t.title} className="card !p-5">
                <h3 className="font-semibold text-ink">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-title font-bold text-ink">One division at a time</h2>
        <DivisionPicker divisions={DIVISIONS} value={selected} onChange={setSelected} />
        <Card
          title={`Division ${division.division} · ${story.headline}`}
          subtitle={`R² ${formatR2(division.r2)} (rank ${division.rank} of ${model.divisionCount}). ${story.volume}`}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Impressions</h3>
              <ul className="space-y-3">
                {CHANNELS.map((c) => {
                  const v = division.channels[c].impressions;
                  return (
                    <li key={c}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="flex items-center gap-2 text-ink-2">
                          <Swatch color={CHANNEL_COLORS[c]} shape="square" />
                          {c}
                        </span>
                        <span className="num font-semibold text-ink">{formatCompact(v)}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#f0ebf6]">
                        <div className="h-full rounded-full" style={{ width: `${Math.max(1, (v / maxVolume) * 100)}%`, background: CHANNEL_COLORS[c] }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Weekly sales change if impressions double</h3>
              <ul className="space-y-3">
                {CHANNELS.map((c) => {
                  const v = doublingEffect(division.channels[c].coefficient);
                  const w = (Math.abs(v) / maxEffect) * 50;
                  return (
                    <li key={c}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="flex items-center gap-2 text-ink-2">
                          <Swatch color={CHANNEL_COLORS[c]} shape="square" />
                          {c}
                        </span>
                        <span className={`num font-semibold ${v < 0 ? "text-[#a3460a]" : "text-ink"}`}>{formatSignedCurrency(v, { compact: true })}</span>
                      </div>
                      {/* Centred bar: left of the midline is negative, right is positive. */}
                      <div className="relative h-2.5 rounded-full bg-[#f0ebf6]">
                        <div className="absolute inset-y-[-3px] left-1/2 w-px bg-[#8d84a8]" />
                        <div
                          className="absolute inset-y-0 rounded-full"
                          style={{
                            width: `${w}%`,
                            left: v >= 0 ? "50%" : `${50 - w}%`,
                            background: v >= 0 ? CHANNEL_COLORS[c] : "#c2570c",
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-title font-bold text-ink">Limits and next steps</h2>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card
            title={
              <span className="flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 text-[#a3460a]" aria-hidden="true" /> What to keep in mind
              </span>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {modelingLimitations.map((l) => (
                <div key={l.title}>
                  <h3 className="font-semibold text-ink">{l.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{l.detail}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title={
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-strong" aria-hidden="true" /> To make this decision-grade
              </span>
            }
          >
            <ul className="space-y-2">
              {nextActions.map((a) => (
                <li key={a} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-strong" />
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-muted">
              Source: {model.source}. Regenerate with <code>python3 scripts/derive_model_outputs.py</code>.
            </p>
          </Card>
        </div>
      </section>
    </Page>
  );
}
