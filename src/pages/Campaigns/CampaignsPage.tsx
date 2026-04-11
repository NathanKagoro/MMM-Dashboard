import AnimatedBackground from "./AnimatedBackground";
import CampaignSelector from "./CampaignSelector";
import SpendSalesScatter from "./SpendSalesScatter";
import CampaignTable from "./CampaignTable";
import { channelTableData, campaignInsights } from "./fakedata"; 

import { useState } from "react";

export default function CampaignsPage() {
  const [selectedDiv, setSelectedDiv] = useState("Y");

  const tableRows = channelTableData.map((channel) => ({
    name: channel.channel,
    spend: Math.round(channel.totalImpressions / 100000), // Mock spend calculation
    revenue: Math.round(channel.avgCoefficient),
    roi: channel.avgCoefficient > 0 ? Math.max(channel.avgCoefficient / 10000, 0.5) : -1,
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col gap-8 p-16">
        <div>
          <h1 className="text-4xl font-bold text-[#7D71A7] mb-2">Campaign Explorer</h1>
          <p className="text-gray-700">{campaignInsights.scatter}</p>
        </div>

        <CampaignSelector
          selectedCampaign={selectedDiv}
          onSelectCampaign={setSelectedDiv}
          discount={0}
          onDiscountChange={() => {}}
        />

        <SpendSalesScatter selectedCampaign={selectedDiv} />

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#7D71A7] mb-4">Channel Effectiveness</h2>
          <p className="text-gray-700 mb-4">{campaignInsights.table}</p>
          <CampaignTable rows={tableRows} />
        </div>

      </div>
    </div>
  );
}
