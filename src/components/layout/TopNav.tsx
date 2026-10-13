import { ArrowLeft, BarChart3, Database, Home, Target } from "lucide-react";
import { NavLink } from "react-router-dom";

export const navItems = [
  { label: "Overview", path: "/", icon: Home },
  { label: "Campaigns", path: "/campaigns", icon: Target },
  { label: "Sales", path: "/sales", icon: BarChart3 },
  { label: "Data", path: "/data", icon: Database },
];

const SITE = "https://nathankagoro.com";

/**
 * Desktop: one top bar with the four sections and a link back to the portfolio.
 * Phone (< md): the top bar keeps only the title and back link; sections move to a
 * fixed bottom tab bar with 56px-tall targets so "Data" is never pushed off-screen.
 */
export default function TopNav() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-brand-line bg-white shadow-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
          <NavLink to="/" aria-label="MMM Dashboard, overview" className="mr-2 flex min-h-[44px] shrink-0 items-center gap-2 font-semibold text-ink md:mr-4">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-brand-lilacSoft text-xs font-bold text-brand-plum">
              M
            </span>
            <span className="whitespace-nowrap">MMM<span className="hidden min-[380px]:inline"> Dashboard</span></span>
          </NavLink>

          <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-lilacSoft text-brand-plum"
                      : "text-ink-2 hover:bg-brand-pinkSoft hover:text-ink"
                  }`
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <a
            href={SITE}
            className="ml-auto flex min-h-[44px] min-w-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-sm font-medium text-ink-2 transition-colors hover:text-brand-strong"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>nathankagoro.com</span>
          </a>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-line bg-white shadow-[0_-1px_3px_rgba(59,47,110,0.08)] md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                    isActive ? "text-brand-plum" : "text-ink-muted"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${
                        isActive ? "bg-brand-lilacSoft" : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
