import { useEffect, useRef } from "react";

/**
 * The brand's soft pink/lavender blob wash, restored. Compared with the original:
 * - transform-only CSS animation (GPU-composited; the blur is static and never re-rasterised),
 * - 60–90s cycles with < 60px travel, so it reads as "alive" without pulling focus,
 * - paused while the tab is hidden, and fully static under prefers-reduced-motion,
 * - opacities capped so body text over the darkest overlap still clears 4.5:1.
 */
const BLOBS = [
  { cls: "blob-a", color: "#CAADFF", opacity: 0.7, size: 640, blur: 120, style: { top: -200, left: -180 } },
  { cls: "blob-b", color: "#FFC2E2", opacity: 0.8, size: 560, blur: 120, style: { top: "28%", right: -200 } },
  { cls: "blob-c", color: "#FFADC7", opacity: 0.6, size: 560, blur: 140, style: { bottom: -160, left: "22%" } },
  { cls: "blob-b", color: "#9d8fd0", opacity: 0.22, size: 420, blur: 110, style: { top: 40, left: "48%" } },
  { cls: "blob-a", color: "#FCF6D9", opacity: 0.8, size: 460, blur: 110, style: { bottom: 40, right: "30%" } },
] as const;

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => el.classList.toggle("motion-paused", document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-page">
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className={`blob ${b.cls}`}
          style={{
            ...b.style,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: b.opacity,
            filter: `blur(${b.blur}px)`,
            animationDelay: `${-i * 11}s`,
          }}
        />
      ))}
    </div>
  );
}
