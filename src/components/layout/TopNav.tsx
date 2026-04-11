import {
  Home,
  BarChart3,
  Target,
  Database,
  ExternalLink,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const topNavItems = [
  { label: "Overview", path: "/", icon: Home },
  { label: "Campaigns", path: "/campaigns", icon: Target },
  { label: "Sales", path: "/sales", icon: BarChart3 },
  { label: "Data", path: "/data", icon: Database },
];

export default function TopNav() {
  return (
    <nav className="flex items-center gap-6 bg-white/40 backdrop-blur-xl border-b border-white/30 px-6 py-3 shadow-md z-20">
      {topNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md p-2 transition-all ${
              isActive
                ? "bg-[#CAADFF] text-white shadow"
                : "text-[#7D71A7] hover:bg-[#FFC2E2]/50"
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-sm font-medium">{item.label}</span>
        </NavLink>
      ))}
      <a
        href="https://nathankagoro.com"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto flex items-center gap-2 rounded-md p-2 text-[#7D71A7] transition-all hover:bg-[#FFC2E2]/50"
      >
        <ExternalLink className="h-5 w-5" />
        <span className="text-sm font-medium">nathankagoro.com</span>
      </a>
    </nav>
  );
}
