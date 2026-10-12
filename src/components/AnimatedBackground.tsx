/**
 * Soft, static brand wash behind every page. It used to animate six 400–600px blurred
 * blobs forever (expensive on phones and distracting); it is now a single fixed layer
 * of radial gradients with no motion at all.
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background: [
          "radial-gradient(60rem 36rem at -10% -10%, rgba(202,173,255,0.35), transparent 60%)",
          "radial-gradient(48rem 32rem at 110% 20%, rgba(255,194,226,0.35), transparent 60%)",
          "radial-gradient(50rem 30rem at 30% 110%, rgba(252,246,217,0.7), transparent 60%)",
          "#faf7fc",
        ].join(","),
      }}
    />
  );
}
