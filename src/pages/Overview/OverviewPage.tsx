import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MainTrendChart from "./components/MainTrendChart";
import CampaignHeatmap from "./components/CampaignHeatmap";
import { Card, Page, PageHeader } from "../../components/ui/Page";
import { KpiStrip } from "../../components/ui/KpiStrip";
import { channelSummary, model, meanR2 } from "../../data/model";
import { formatCurrency, formatR2 } from "../../lib/format";
import { PERIOD_SHORT } from "../../data/period";

const summary = channelSummary();
const best = [...summary].sort((a, b) => b.meanCoefficient - a.meanCoefficient)[0];
const affiliate = summary.find((s) => s.channel === "Affiliate")!;
const top = model.topDivisions;
const r2Min = Math.min(...top.map((d) => d.r2));
const r2Max = Math.max(...top.map((d) => d.r2));

export default function OverviewPage() {
  return (
    <Page>
      <PageHeader
        title="Marketing Mix Model"
        lead={
          <>
            Which channels move weekly sales? One regression per division, fitted on {model.period.weeks} weeks of
            impressions and sales ({PERIOD_SHORT}).
          </>
        }
      />

      <KpiStrip
        items={[
          {
            label: "Strongest channel",
            value: best.channel,
            note: `${formatCurrency(best.meanDoublingEffect, { compact: true })}/wk if impressions double (avg.)`,
          },
          {
            label: "Model fit (R²)",
            value: formatR2(meanR2()),
            note: `Mean of top ${top.length} divisions; range ${formatR2(r2Min)}–${formatR2(r2Max)}`,
          },
          {
            label: "Weeks of data",
            value: model.period.weeks,
            note: PERIOD_SHORT,
          },
          {
            label: "Divisions modelled",
            value: (
              <>
                {top.length}
                <span className="text-base font-semibold"> of {model.divisionCount}</span>
              </>
            ),
            note: "Highest-R² fits, used for every chart",
          },
          {
            label: "Affiliate effect",
            value: (
              <>
                {affiliate.negativeDivisions}
                <span className="text-base font-semibold">/{top.length} negative</span>
              </>
            ),
            note: "Divisions where it lowers predicted sales",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card
          title="Actual vs predicted weekly sales"
          subtitle={`Sum of the ${top.length} modelled divisions, ${PERIOD_SHORT}. Combined in-sample R² ${formatR2(model.combinedR2)}.`}
        >
          <MainTrendChart />
        </Card>
        <Card
          title="Channel effect by division"
          subtitle="Modelled change in weekly sales if a channel's impressions doubled, all else equal."
        >
          <CampaignHeatmap />
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/campaigns"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand-plum px-4 text-sm font-semibold text-white shadow-card transition-colors hover:bg-[#2d2350]"
        >
          Explore a division <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          to="/data"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-brand-line bg-white px-4 text-sm font-semibold text-ink shadow-card transition-colors hover:border-brand-pink hover:bg-brand-pinkSoft"
        >
          How the model works
        </Link>
      </div>
    </Page>
  );
}
