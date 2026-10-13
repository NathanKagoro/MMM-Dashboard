import type { ReactNode } from "react";
import { PERIOD_LABEL } from "../../data/period";

/** Consistent page container + compact header used on every route. */
export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-8 pt-6 sm:px-6 sm:pt-10">{children}</div>;
}

export function PageHeader({ title, lead, eyebrow }: { title: string; lead: ReactNode; eyebrow?: string }) {
  return (
    <header className="max-w-3xl">
      <p className="eyebrow">{eyebrow ?? `Sample media data · ${PERIOD_LABEL}`}</p>
      <h1 className="mt-2 text-display font-extrabold text-ink">{title}</h1>
      <div aria-hidden="true" className="accent-bar mt-3" />
      <p className="mt-3 text-base leading-relaxed text-ink-2 sm:text-lg">{lead}</p>
    </header>
  );
}

export function Card({
  title,
  subtitle,
  children,
  className = "",
  action,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`card min-w-0 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm leading-relaxed text-ink-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Division picker shared by Campaigns and Data. Real buttons, 44px tall, aria-pressed. */
export function DivisionPicker({
  divisions,
  value,
  onChange,
  label = "Division",
  describe,
}: {
  divisions: string[];
  value: string;
  onChange: (d: string) => void;
  label?: string;
  describe?: (d: string) => string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {divisions.map((d) => {
        const active = d === value;
        return (
          <button
            key={d}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(d)}
            className={`min-h-[44px] rounded-lg border px-4 text-sm font-semibold transition-colors ${
              active
                ? "border-brand-plum bg-brand-plum text-white"
                : "border-brand-line bg-white text-ink-2 shadow-card hover:border-brand-pink hover:bg-brand-pinkSoft hover:text-ink"
            }`}
          >
            Division {d}
            {describe && <span className={`ml-1.5 font-normal ${active ? "text-white/85" : "text-ink-muted"}`}>{describe(d)}</span>}
          </button>
        );
      })}
    </div>
  );
}
