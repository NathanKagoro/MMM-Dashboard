import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import SpendSalesScatter from "./components/SpendSalesScatter";
import CampaignTable from "./components/CampaignTable";
import { Card, DivisionPicker, Page, PageHeader } from "../../components/ui/Page";
import { DIVISIONS, channelTable, getDivision } from "../../data/model";
import { formatCompact, formatCurrency, formatR2, formatSignedCurrency } from "../../lib/format";
import { ChannelLegend } from "../../components/charts/ChartParts";
import { CHANNELS } from "../../data/model";

export default function CampaignsPage() {
  const [selected, setSelected] = useState(DIVISIONS[0]);
  const division = getDivision(selected);
  const rows = useMemo(() => channelTable(division), [division]);

  const best = rows[0];
  const worst = rows[rows.length - 1];
  const volumeLeader = [...rows].sort((a, b) => b.impressions - a.impressions)[0];

  return (
    <Page>
      <PageHeader
        title="Campaigns by division"
        lead="Reach and modelled effect for each channel. Pick a division; the chart and table update together."
      />

      <div className="flex flex-col gap-3">
        <DivisionPicker divisions={DIVISIONS} value={selected} onChange={setSelected} />
        <p className="text-sm text-ink-muted">
          Division {division.division}: R² {formatR2(division.r2)} · average week {formatCurrency(division.meanWeeklySales)} in sales ·{" "}
          {division.weeks} weeks
        </p>
      </div>

      <Card
        title={`Reach vs effect · Division ${division.division}`}
        subtitle={
          <>
            {volumeLeader.channel} has the most impressions ({formatCompact(volumeLeader.impressions)}), but {best.channel} has the
            largest modelled effect (<span className="whitespace-nowrap">{formatSignedCurrency(best.doublingEffect, { compact: true })}/week</span> if doubled).{" "}
            {worst.doublingEffect < 0 && (
              <>
                {worst.channel} is negative (<span className="whitespace-nowrap">{formatSignedCurrency(worst.doublingEffect, { compact: true })}</span>).
              </>
            )}
          </>
        }
        action={<ChannelLegend channels={CHANNELS} shape="dot" />}
      >
        <SpendSalesScatter division={division} />
        <p className="mt-2 text-xs text-ink-muted">
          Vertical axis: modelled change in weekly sales if that channel's impressions doubled. Axis ranges adapt to each division.
        </p>
      </Card>

      <Card
        title={`Channel effectiveness · Division ${division.division}`}
        subtitle="Ranked by model coefficient. Channels enter the model as log(1 + weekly impressions), so β is the change in weekly sales per one-unit rise in log-impressions; β × ln 2 is the effect of doubling."
      >
        <CampaignTable rows={rows} />
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-wash px-3 py-2 text-sm text-ink-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
          The dataset has impressions and sales but no spend, so cost and ROI can’t be calculated and aren’t shown.
        </p>
      </Card>
    </Page>
  );
}
