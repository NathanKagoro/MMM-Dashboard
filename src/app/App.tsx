import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import TopNav from "../components/layout/TopNav";
import Footer from "../components/layout/Footer";
import AnimatedBackground from "../components/AnimatedBackground";
import OverviewPage from "../pages/Overview/OverviewPage";
import SalesPage from "../pages/Sales/SalesPage";
import CampaignsPage from "../pages/Campaigns/CampaignsPage";
import DataExplorerPage from "../pages/DataExplorer/DataExplorerPage";

const TITLES: Record<string, string> = {
  "/": "Overview",
  "/campaigns": "Campaigns",
  "/sales": "Sales & insights",
  "/data": "Data & methodology",
};

// Normal document scrolling means route changes must reset the scroll position.
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const section = TITLES[pathname];
    document.title = section ? `${section} · MMM Dashboard` : "MMM Dashboard";
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <RouteEffects />
      <AnimatedBackground />
      {/* The page scrolls as a normal document (no h-screen lock / inner scroller). */}
      <div className="flex min-h-screen flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <TopNav />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/data" element={<DataExplorerPage />} />
            <Route path="*" element={<OverviewPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
