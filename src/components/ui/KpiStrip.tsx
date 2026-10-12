import type { ReactNode } from "react";

export interface Kpi {
  label: string;
  value: ReactNode;
  note: ReactNode;
}

/**
 * The original pastel KPI colours, now with dark text. Contrast (value / note text):
 * pink #FFC2E2 11.2 / 7.8:1 · lavender #CAADFF 8.7 / 6.0:1 · rose #FFADC7 9.6 / 6.7:1 ·
 * lilac-purple #c4b8ea 9.1 / 6.3:1 · blush #ffd6e8 12.8 / 8.9:1.
 */
export const KPI_FILLS = ["#FFC2E2", "#CAADFF", "#FFADC7", "#c4b8ea", "#ffd6e8"] as const;
export const KPI_TEXT = "#1f1b2e";
export const KPI_NOTE = "#3d3357";

/** Compact KPI row: 2 columns on phones, up to 5 across on desktop. Subtle hover lift. */
export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((k, i) => (
        <div
          key={k.label}
          className={`flex min-w-0 flex-col gap-1 rounded-3xl border border-white/60 p-4 shadow-card transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transform-none ${
            i === items.length - 1 && items.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""
          }`}
          style={{
            background: `linear-gradient(150deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%), ${KPI_FILLS[i % KPI_FILLS.length]}`,
            color: KPI_TEXT,
          }}
        >
          <dt className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: KPI_NOTE }}>
            {k.label}
          </dt>
          <dd className="num text-2xl font-extrabold leading-tight sm:text-[1.75rem]">{k.value}</dd>
          <dd className="text-xs leading-snug" style={{ color: KPI_NOTE }}>
            {k.note}
          </dd>
        </div>
      ))}
    </dl>
  );
}
