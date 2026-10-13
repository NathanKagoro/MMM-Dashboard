import type { ReactNode } from "react";

export interface Kpi {
  label: string;
  value: ReactNode;
  note: ReactNode;
}

/**
 * Each tile is solid white with a 4px solid pastel top bar in its own colour; the first
 * ("headline") tile is a solid pastel pink fill. Text is plum/near-black on both:
 * value #3b2f6e 11.6:1 on white, 7.7:1 on #FFC2E2; note #3d3357 11.4:1 / 7.8:1.
 */
export const KPI_ACCENTS = ["#FFC2E2", "#CAADFF", "#FFADC7", "#7D71A7", "#CAADFF"] as const;
export const KPI_TEXT = "#3b2f6e";
export const KPI_NOTE = "#3d3357";
export const KPI_HEADLINE_FILL = "#FFC2E2";

/** Compact KPI row: 2 columns on phones, up to 5 across on desktop. */
export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((k, i) => (
        <div
          key={k.label}
          className={`flex min-w-0 flex-col gap-1 overflow-hidden rounded-2xl border border-brand-line border-t-4 p-4 pt-3 shadow-card ${
            i === items.length - 1 && items.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""
          }`}
          style={{
            backgroundColor: i === 0 ? KPI_HEADLINE_FILL : "#ffffff",
            borderTopColor: i === 0 ? "#FFADC7" : KPI_ACCENTS[i % KPI_ACCENTS.length],
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
