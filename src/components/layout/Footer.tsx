import { Link } from "react-router-dom";
import { PERIOD_SHORT } from "../../data/period";

export default function Footer() {
  const linkClass =
    "inline-flex min-h-[44px] items-center text-sm font-medium text-ink-2 underline-offset-4 hover:text-brand-strong hover:underline";
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-ink-muted">
          © 2026 Nathan Kagoro · Sample media data, {PERIOD_SHORT}
        </p>
        <nav aria-label="Footer" className="flex gap-6">
          <a className={linkClass} href="https://nathankagoro.com">
            About
          </a>
          <Link className={linkClass} to="/data">
            Methodology
          </Link>
          <a
            className={linkClass}
            href="https://www.linkedin.com/in/nathan-kagoro-06ba31270/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
