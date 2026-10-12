import type { ReactNode } from "react";
import { CHANNEL_COLORS, type ChannelName } from "../../data/model";

/** Shared tick / grid styling so every Recharts chart reads as one system. */
export const AXIS_TICK = { fill: "#4f4868", fontSize: 12 } as const;
export const GRID_STROKE = "#eee2f3";
export const AXIS_LINE = { stroke: "#dccbea" } as const;

interface TooltipRow {
  label: string;
  value: string;
  color?: string;
  dashed?: boolean;
}

/** Light tooltip with near-black text; rows are pre-formatted strings. */
export function TooltipBox({ title, rows }: { title: ReactNode; rows: TooltipRow[] }) {
  return (
    <div className="min-w-[10rem] rounded-2xl border border-[#ead9f5] bg-white/90 px-3 py-2 text-sm shadow-card backdrop-blur">
      <div className="mb-1 font-semibold text-ink">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-ink-2">
            {r.color && <Swatch color={r.color} dashed={r.dashed} />}
            {r.label}
          </span>
          <span className="num font-semibold text-ink">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Swatch({ color, dashed, shape = "line" }: { color: string; dashed?: boolean; shape?: "line" | "dot" | "square" }) {
  if (shape === "dot") return <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />;
  if (shape === "square") return <span aria-hidden="true" className="inline-block h-3 w-3 rounded-[3px]" style={{ background: color }} />;
  return (
    <svg aria-hidden="true" width="22" height="8" className="shrink-0">
      <line x1="1" y1="4" x2="21" y2="4" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? "5 3" : undefined} strokeLinecap="round" />
    </svg>
  );
}

export function LegendRow({ items }: { items: { label: string; color: string; dashed?: boolean; shape?: "line" | "dot" | "square" }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <Swatch color={i.color} dashed={i.dashed} shape={i.shape} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export function ChannelLegend({ channels, shape = "square" }: { channels: ChannelName[]; shape?: "dot" | "square" }) {
  return <LegendRow items={channels.map((c) => ({ label: c, color: CHANNEL_COLORS[c], shape }))} />;
}
