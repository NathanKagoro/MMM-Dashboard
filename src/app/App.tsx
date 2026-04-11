import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNav from "../components/layout/TopNav";
import Footer from "../components/layout/Footer";
import OverviewPage from "../pages/Overview/OverviewPage";
import SalesPage from "../pages/Sales/SalesPage";
import CampaignsPage from "../pages/Campaigns/CampaignsPage";
import DataExplorerPage from "../pages/DataExplorer/DataExplorerPage";

export default function App() {
  return (
    <Router>
      <div className="relative flex flex-col h-screen w-screen">
        {/* Global top navigation */}
        <TopNav />

        {/* Page content */}
        <div className="flex-1 relative">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/data" element={<DataExplorerPage />} />
          </Routes>
        </div>
        <Footer /> {/* Permanent footer */}
      </div>
    </Router>
  );
}
