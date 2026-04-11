export default function Footer() {
  return (
    <footer className="relative bg-transparent">
      
      {/* 1️⃣ TRANSPARENT OVERLAP SPACER */}
      {/* This overlaps the page above, but is invisible */}
      <div className="h-24 -mt-24 pointer-events-none" />

      {/* 2️⃣ ACTUAL FOOTER */}
      {/* This does NOT overlap anything */}
      <div
        className="
          bg-white/40
          backdrop-blur-xl
          border-t border-white/30
          shadow-inner
        "
      >
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#7D71A7]">
              © 2026 Marketing Mix Modeling Dashboard
            </span>

            <div className="flex gap-6 text-sm text-[#7D71A7]/80">
              <button className="hover:text-[#7D71A7] transition">
                About
              </button>
              <button className="hover:text-[#7D71A7] transition">
                Methodology
              </button>
              <button className="hover:text-[#7D71A7] transition">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
