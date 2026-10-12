import { CHANNEL_COLORS, ordinal, type ChannelTableRow } from "../../../data/model";
import { formatCompact, formatInteger, formatPercent, formatSignedCurrency } from "../../../lib/format";
import { Swatch } from "../../../components/charts/ChartParts";

/**
 * Channel Effectiveness for one division. Every column is derived from the raw CSV
 * and the fitted model; there is no spend column in the data, so no ROI.
 */
export default function CampaignTable({ rows }: { rows: ChannelTableRow[] }) {
  return (
    <>
      {/* Phones: one stacked row per channel, no horizontal scrolling. */}
      <ol className="divide-y divide-[#f0ebf6] sm:hidden">
        {rows.map((r) => (
          <li key={r.channel} className="py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-semibold text-ink">
                <span className="w-8 text-ink-muted">{ordinal(r.rank)}</span>
                <Swatch color={CHANNEL_COLORS[r.channel]} shape="square" />
                {r.channel}
              </span>
              <span className={`num whitespace-nowrap font-semibold ${r.doublingEffect < 0 ? "text-[#a3460a]" : "text-ink"}`}>
                {formatSignedCurrency(r.doublingEffect)}/wk
              </span>
            </div>
            <dl className="num mt-1 grid grid-cols-3 gap-2 pl-10 text-xs text-ink-muted">
              <div>
                <dt>Impressions</dt>
                <dd className="text-sm text-ink">{formatCompact(r.impressions)}</dd>
              </div>
              <div>
                <dt>β</dt>
                <dd className="text-sm text-ink">{formatInteger(r.coefficient)}</dd>
              </div>
              <div>
                <dt>% avg. week</dt>
                <dd className="text-sm text-ink">{formatPercent(r.shareOfMeanSales)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
      <p className="mt-1 text-xs text-ink-muted sm:hidden">£/wk = modelled change in weekly sales if impressions double (β × ln 2).</p>

    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[40rem] text-sm">
        <thead>
          <tr className="border-b border-[#e2d9f0] text-left text-xs uppercase tracking-[0.06em] text-ink-muted">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Rank
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              Channel
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Impressions
              <span className="block font-normal normal-case tracking-normal">total · per week</span>
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Coefficient <span className="normal-case">β</span>
              <span className="block font-normal normal-case tracking-normal">£ sales / log-unit</span>
            </th>
            <th scope="col" className="py-2 pl-3 text-right font-semibold">
              If impressions double
              <span className="block font-normal normal-case tracking-normal">β × ln 2, £/week · % of avg. week</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const negative = r.doublingEffect < 0;
            return (
              <tr key={r.channel} className="border-b border-[#f0ebf6] last:border-none">
                <td className="py-3 pr-3 font-semibold text-ink-2">{ordinal(r.rank)}</td>
                <th scope="row" className="px-3 py-3 text-left font-semibold text-ink">
                  <span className="flex items-center gap-2">
                    <Swatch color={CHANNEL_COLORS[r.channel]} shape="square" />
                    {r.channel}
                  </span>
                </th>
                <td className="num px-3 py-3 text-right text-ink">
                  {formatCompact(r.impressions)}
                  <span className="text-ink-muted"> · {formatCompact(r.weeklyImpressions)}</span>
                </td>
                <td className="num px-3 py-3 text-right text-ink">{formatInteger(r.coefficient)}</td>
                <td className={`num py-3 pl-3 text-right font-semibold ${negative ? "text-[#a3460a]" : "text-ink"}`}>
                  {formatSignedCurrency(r.doublingEffect)}
                  <span className="font-normal text-ink-muted"> · {formatPercent(r.shareOfMeanSales)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </>
  );
}

