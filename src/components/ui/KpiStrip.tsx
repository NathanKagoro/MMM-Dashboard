import type { ReactNode } from "react";

export interface Kpi {
  label: string;
  value: ReactNode;
  note: ReactNode;
}

/** Compact KPI row: 2 columns on phones, up to 5 across on desktop. */
export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((k, i) => (
        <div
          key={k.label}
          className={`card flex min-w-0 flex-col gap-1 !p-4 ${i === items.length - 1 && items.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">{k.label}</dt>
          <dd className="num text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">{k.value}</dd>
          <dd className="text-xs leading-snug text-ink-muted">{k.note}</dd>
        </div>
      ))}
    </dl>
  );
}
