import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  DatabaseZap,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  affiliateNegativeCount,
  averageTopDivisionR2,
  channelColors,
  channelOrder,
  coefficientLeaderboard,
  divisionResults,
  engineeredFeatures,
  modelEquation,
  modelingLimitations,
  nextActions,
  notebookHighlights,
  notebookTakeaways,
  processSteps,
  r2Leaderboard,
} from "./data/methodologyData";
import AnimatedBackground from "../../components/AnimatedBackground";

// Returns Framer Motion props for a fade-in-up entrance triggered at scroll-into-view.
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// Values >= 10M get one decimal place; smaller values get two to preserve legibility.
function formatMillions(value: number) {
  return value >= 10 ? `${value.toFixed(1)}M` : `${value.toFixed(2)}M`;
}

// Converts a raw coefficient to a signed "K" string (e.g. -19.4K) for compact display.
function formatCoefficient(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${Math.abs(value / 1000).toFixed(1)}K`;
}

// Recharts can pass an array for stacked series — unwrap it before formatting.
function formatTooltipNumber(
  value: number | string | readonly (number | string)[] | undefined,
  suffix: string,
) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (typeof normalizedValue !== "number") {
    return `0${suffix}`;
  }

  return `${normalizedValue.toFixed(1)}${suffix}`;
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-white/50 bg-white/70 p-6 shadow-xl backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#7D71A7]/70">
        {eyebrow}
      </div>
      <h2 className="text-3xl font-bold text-[#7D71A7] md:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#5B507D] md:text-base">{description}</p>
    </div>
  );
}

export default function DataExplorerPage() {
  const [selectedDivision, setSelectedDivision] = useState(divisionResults[0].division);

  const selectedResult = useMemo(
    () => divisionResults.find((result) => result.division === selectedDivision) ?? divisionResults[0],
    [selectedDivision],
  );

  // Derives chart-ready volume entries for the selected division, in canonical channel order.
  const selectedVolumeData = useMemo(
    () =>
      channelOrder.map((channel) => ({
        channel,
        value: selectedResult.channels[channel].volumeM,
        color: channelColors[channel],
      })),
    [selectedResult],
  );

  // Sorted by absolute coefficient so the strongest effect always appears first.
  const selectedCoefficientData = useMemo(
    () =>
      channelOrder
        .map((channel) => ({
          channel,
          value: selectedResult.channels[channel].coefficient,
          absoluteValue: Math.abs(selectedResult.channels[channel].coefficient),
          color: channelColors[channel],
        }))
        .sort((left, right) => right.absoluteValue - left.absoluteValue),
    [selectedResult],
  );

  // Used to scale each channel's bar relative to the largest coefficient in this division.
  const maxSelectedCoefficient = Math.max(
    ...selectedCoefficientData.map((entry) => Math.abs(entry.value)),
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FCF6D9]/20">
        <AnimatedBackground />

        <div className="relative z-10 mx-auto flex w-full max-w-[1450px] flex-col gap-12 px-6 pb-20 pt-10 md:px-10 lg:px-16 lg:pt-14">
          <motion.section {...fadeUp()}>
            <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
              <GlassCard className="overflow-hidden p-0">
                <div className="relative h-full bg-[linear-gradient(135deg,rgba(125,113,167,0.16),rgba(255,194,226,0.18),rgba(252,246,217,0.55))] p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7D71A7]">
                    <DatabaseZap className="h-4 w-4" />
                    Notebook-to-dashboard walkthrough
                  </div>
                  <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-[#7D71A7] md:text-6xl">
                    How the MMM notebook produced the recommendations you see across the dashboard.
                  </h1>
                  <p className="mt-6 max-w-3xl text-base leading-8 text-[#5B507D] md:text-lg">
                    This page turns the saved outputs from the notebook into a narrative: how the data was cleaned,
                    how the model was engineered, what made the top divisions trustworthy, and why Email, Facebook,
                    Google, and Affiliate ended up with very different strategic roles.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {[
                      "Regression-based MMM",
                      `${(averageTopDivisionR2 * 100).toFixed(1)}% average R² on the top six divisions`,
                      `${affiliateNegativeCount} divisions with negative Affiliate effect`,
                    ].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm font-medium text-[#675A8F] shadow-sm"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {notebookHighlights.map((highlight, index) => (
                  <motion.div key={highlight.label} {...fadeUp(index * 0.05)}>
                    <GlassCard className="h-full bg-white/75">
                      <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#7D71A7]/70">
                        {highlight.label}
                      </div>
                      <div className="mt-3 text-4xl font-extrabold text-[#7D71A7]">{highlight.value}</div>
                      <p className="mt-3 text-sm leading-7 text-[#5B507D]">{highlight.description}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.05)}>
            <SectionTitle
              eyebrow="Method"
              title="The workflow, compressed"
              description="The notebook followed four moves: validate the weekly data, engineer MMM features, fit one model per division, and compare the outputs only where model fit was strongest."
            />

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {processSteps.map((step, index) => (
                  <motion.div key={step.eyebrow} {...fadeUp(0.06 + index * 0.04)}>
                    <GlassCard className="h-full min-h-[205px]">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full bg-[#7D71A7]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#7D71A7]">
                          {step.eyebrow}
                        </span>
                        {index < processSteps.length - 1 ? <ArrowRight className="h-5 w-5 text-[#CAADFF]" /> : <Sparkles className="h-5 w-5 text-[#CAADFF]" />}
                      </div>
                      <h3 className="text-lg font-bold text-[#7D71A7]">{step.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#5B507D]">{step.description}</p>
                      <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-[#7D71A7]/65">
                        {step.details[0]}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              <GlassCard>
                <div className="flex items-center gap-3 text-[#7D71A7]">
                  <Sigma className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">Model in one view</h3>
                </div>
                <div className="mt-5 overflow-x-auto rounded-3xl bg-[#F6F1FF] p-5 font-mono text-sm leading-7 text-[#574B80]">
                  {modelEquation.formula}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#5B507D]">{modelEquation.interpretation}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {engineeredFeatures.slice(0, 4).map((feature) => (
                    <div key={feature} className="rounded-2xl border border-white/60 bg-white/85 px-4 py-3 text-sm leading-6 text-[#5B507D]">
                      {feature}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.08)}>
            <SectionTitle
              eyebrow="Results"
              title="What mattered most"
              description="The clearest read from the notebook is simple: trust the strongest-fitting divisions first, then compare channels by consistent coefficient patterns."
            />

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <GlassCard className="min-h-[380px]">
                <div className="flex items-center gap-3 text-[#7D71A7]">
                  <Trophy className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">Top 6 divisions by R²</h3>
                </div>
                <div className="mt-5 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={r2Leaderboard} layout="vertical" margin={{ left: 10, right: 16, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeOpacity={0.16} stroke="#7D71A7" horizontal={false} />
                      <XAxis type="number" domain={[60, 70]} stroke="#7D71A7" tick={{ fill: "#7D71A7" }} unit="%" />
                      <YAxis type="category" dataKey="division" stroke="#7D71A7" tick={{ fill: "#7D71A7", fontWeight: 700 }} width={36} />
                      <Tooltip
                        cursor={{ fill: "rgba(125, 113, 167, 0.08)" }}
                        contentStyle={{ backgroundColor: "rgba(255,255,255,0.92)", border: "1px solid rgba(125,113,167,0.25)", borderRadius: 18 }}
                        formatter={(value) => {
                          const formatted = formatTooltipNumber(value, "%");
                          return [formatted, "R²"] as const;
                        }}
                      />
                      <Bar dataKey="r2Percent" radius={[0, 16, 16, 0]} fill="#CAADFF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="min-h-[380px]">
                <div className="flex items-center gap-3 text-[#7D71A7]">
                  <Activity className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">Channel strength</h3>
                </div>
                <div className="mt-5 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coefficientLeaderboard} margin={{ left: 0, right: 0, top: 8, bottom: 16 }}>
                      <CartesianGrid strokeOpacity={0.16} stroke="#7D71A7" vertical={false} />
                      <XAxis dataKey="channel" stroke="#7D71A7" tick={{ fill: "#7D71A7", fontWeight: 700 }} />
                      <YAxis stroke="#7D71A7" tick={{ fill: "#7D71A7" }} unit="K" />
                      <Tooltip
                        cursor={{ fill: "rgba(125, 113, 167, 0.08)" }}
                        contentStyle={{ backgroundColor: "rgba(255,255,255,0.92)", border: "1px solid rgba(125,113,167,0.25)", borderRadius: 18 }}
                        formatter={(value) => {
                          const formatted = formatTooltipNumber(value, "K");
                          return [formatted, "Avg coefficient"] as const;
                        }}
                      />
                      <Bar dataKey="averageCoefficientK" radius={[16, 16, 0, 0]}>
                        {coefficientLeaderboard.map((entry) => (
                          <Cell key={entry.channel} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {notebookTakeaways.map((takeaway) => (
                <GlassCard key={takeaway.title} className="bg-white/75 p-5">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#7D71A7]/70">{takeaway.title}</div>
                  <p className="mt-3 text-sm leading-6 text-[#5B507D]">{takeaway.detail}</p>
                </GlassCard>
              ))}
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.12)}>
            <SectionTitle
              eyebrow="Explorer"
              title="One-division snapshot"
              description="Use the selector to compare the top divisions without scrolling through every notebook artifact."
            />

            <div className="mt-6 flex flex-wrap gap-3">
              {divisionResults.map((result) => (
                <button
                  key={result.division}
                  type="button"
                  onClick={() => setSelectedDivision(result.division)}
                  className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                    selectedDivision === result.division
                      ? "border-[#7D71A7] bg-[#7D71A7] text-white shadow-lg"
                      : "border-white/60 bg-white/70 text-[#7D71A7] hover:bg-white"
                  }`}
                >
                  Division {result.division}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <GlassCard>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#7D71A7]/70">Division spotlight</div>
                    <h3 className="mt-2 text-3xl font-extrabold text-[#7D71A7]">{selectedResult.division}</h3>
                  </div>
                  <div className="rounded-2xl bg-[#F6F1FF] px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#7D71A7]/70">R²</div>
                    <div className="text-2xl font-bold text-[#7D71A7]">{selectedResult.r2.toFixed(3)}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-[linear-gradient(135deg,rgba(255,194,226,0.25),rgba(202,173,255,0.22))] p-5">
                  <div className="text-lg font-bold text-[#7D71A7]">{selectedResult.headline}</div>
                  <p className="mt-2 text-sm leading-6 text-[#5B507D]">{selectedResult.summary}</p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/85 p-4">
                    <div className="text-sm font-semibold text-[#7D71A7]">Volume read</div>
                    <p className="mt-2 text-sm leading-6 text-[#5B507D]">{selectedResult.volumeInsight}</p>
                  </div>
                  <div className="rounded-3xl bg-white/85 p-4">
                    <div className="text-sm font-semibold text-[#7D71A7]">Coefficient read</div>
                    <p className="mt-2 text-sm leading-6 text-[#5B507D]">{selectedResult.coefficientInsight}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {selectedResult.recommendations.map((recommendation) => (
                    <div key={recommendation} className="flex items-start gap-3 rounded-2xl bg-white/85 px-4 py-3 text-sm leading-6 text-[#5B507D]">
                      <Target className="mt-0.5 h-4 w-4 text-[#7D71A7]" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-3 text-[#7D71A7]">
                      <DatabaseZap className="h-5 w-5" />
                      <h3 className="text-xl font-bold">Volume</h3>
                    </div>
                    <div className="mt-4 space-y-4">
                      {selectedVolumeData.map((entry) => {
                        const maxVolume = Math.max(...selectedVolumeData.map((item) => item.value));
                        // Width as a percentage of the largest channel volume in this division.
                        const width = (entry.value / maxVolume) * 100;

                        return (
                          <div key={entry.channel}>
                            <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#5B507D]">
                              <span>{entry.channel}</span>
                              <span>{formatMillions(entry.value)}</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/80">
                              <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: entry.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 text-[#7D71A7]">
                      <Activity className="h-5 w-5" />
                      <h3 className="text-xl font-bold">Coefficient</h3>
                    </div>
                    <div className="mt-4 space-y-4">
                      {selectedCoefficientData.map((entry) => {
                        const width = (Math.abs(entry.value) / maxSelectedCoefficient) * 100;

                        return (
                          <div key={entry.channel}>
                            <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#5B507D]">
                              <span>{entry.channel}</span>
                              <span>{formatCoefficient(entry.value)}</span>
                            </div>
                            <div className="h-3 rounded-full bg-[#EFE8FF]">
                              {/* Negative coefficients render in soft red to flag drag channels. */}
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${width}%`, backgroundColor: entry.value < 0 ? "#F39AA7" : entry.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.14)}>
            <SectionTitle
              eyebrow="Guardrails"
              title="Limits and next actions"
              description="These results are reliable enough to guide budget priorities, but the model has real structural limits that matter before it drives operating decisions."
            />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
              <GlassCard>
                <div className="flex items-center gap-3 text-[#7D71A7]">
                  <TriangleAlert className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">What to keep in mind</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {modelingLimitations.slice(0, 4).map((limitation) => (
                    <div key={limitation.title} className="rounded-3xl bg-white/85 p-4">
                      <div className="text-base font-semibold text-[#7D71A7]">{limitation.title}</div>
                      <p className="mt-2 text-sm leading-6 text-[#5B507D]">{limitation.detail}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="grid gap-6">
                <GlassCard>
                  <div className="flex items-center gap-3 text-[#7D71A7]">
                    <Target className="h-6 w-6" />
                    <h3 className="text-2xl font-bold">Recommended moves</h3>
                  </div>
                  <div className="mt-5 space-y-3">
                    {nextActions.map((action) => (
                      <div key={action} className="flex items-start gap-3 rounded-3xl bg-white/85 px-4 py-3 text-sm leading-6 text-[#5B507D]">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#7D71A7]" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="bg-[linear-gradient(135deg,rgba(125,113,167,0.18),rgba(255,194,226,0.26),rgba(252,246,217,0.46))]">
                  <div className="flex items-center gap-3 text-[#7D71A7]">
                    <Sparkles className="h-6 w-6" />
                    <h3 className="text-2xl font-bold">Bottom line</h3>
                  </div>
                  <p className="mt-4 text-base leading-7 text-[#5B507D]">
                    Email is the clearest winner, Facebook is the most dependable second lever, Google needs efficiency work, and Affiliate deserves the most scrutiny.
                  </p>
                </GlassCard>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
  );
}