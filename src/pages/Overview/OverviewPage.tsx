import AnimatedBackground from "./AnimatedBackground";
import CardCarousel from "./components/carousel/CardCarousel";
import MainTrendChart from "./components/MainTrendChart";
import CampaignHeatmap from "./components/CampaignHeatmap";

// Hero photo from Unsplash
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTk2MzV8MHwxfGFsbHwxfHxkYXRhJTIwYW5hbHl0aWNzfGVufDB8fHx8MTY5NTg2NjM4OQ&ixlib=rb-4.0.3&q=80&w=1200";

export default function OverviewPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FCF6D9]/20">
      {/* Fullscreen Background */}
      <AnimatedBackground />

      {/* Page Content */}
      <div className="relative z-10 flex flex-col gap-12 px-8 pt-24">

        {/* Hero Title */}
        <div className="w-full text-center">
          <h1 className="text-5xl font-extrabold text-[#7D71A7]">
            Marketing Mix Modeling Dashboard
          </h1>
          <p className="mt-2 text-lg text-[#7D71A7]/80">
            Visualize, Analyze, and Optimize Marketing Performance
          </p>
        </div>

        {/* Hero Image + Intro */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={HERO_IMAGE}
            alt="Bright marketing data"
            className="max-w-4xl rounded-2xl shadow-lg object-cover"
          />
          <p className="text-center text-base text-[#7D71A7]/90 max-w-3xl">
            This dashboard uses Marketing Mix Modeling to analyze how different marketing channels affect sales. It looks at real campaign data from Google, Email, Facebook, and Affiliate marketing to show which channels work best, helping you decide where to spend your marketing budget.
          </p>
        </div>

        {/* Carousel */}
        <div className="flex justify-center my-12">
          <CardCarousel />
        </div>

        {/* Trend Chart + Heatmap */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Trend Chart */}
          <div className="flex flex-col items-center w-full h-[480px]">
            <h2 className="mb-2 text-xl font-bold text-[#7D71A7] text-center border-b border-[#7D71A7]/40 w-full pb-2">
              Trend Overview
            </h2>
            <div className="flex-1 w-full">
              <MainTrendChart />
            </div>
          </div>

          {/* Heatmap */}
          <div className="flex flex-col items-center w-full h-[480px]">
            <h2 className="mb-2 text-xl font-bold text-[#7D71A7] text-center border-b border-[#7D71A7]/40 w-full pb-2">
              Campaign Heatmap
            </h2>
            <div className="flex-1 w-full">
              <CampaignHeatmap />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
