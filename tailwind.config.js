/** Design tokens: pastel pink/lavender identity, dark text for legibility.
 *  Worst-case backdrop = lavender + purple blob overlap (#cbb8f4). Text tokens on it:
 *  ink #1f1b2e 9.3:1 · ink-2 #4a4560 5.1:1 · muted #4f4868 4.8:1 · brand-strong #4a3a8c 5.1:1.
 *  On white they are 16.7 / 9.1 / 8.5 / 9.2:1. Pastels (#FFC2E2, #CAADFF, #FFADC7, #7D71A7)
 *  are fills, borders and chart accents only; text on them is ink or plum. */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1f1b2e", 2: "#4a4560", muted: "#4f4868" },
        brand: {
          DEFAULT: "#7D71A7",
          strong: "#4a3a8c",
          plum: "#3b2f6e",
          berry: "#7a2a66",
          lilac: "#CAADFF",
          pink: "#FFC2E2",
          rose: "#FFADC7",
          cream: "#FCF6D9",
          wash: "#f4effb",
        },
        page: "#faf7fc",
      },
      fontSize: {
        display: ["clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        title: ["clamp(1.375rem, 1.1rem + 1.2vw, 1.875rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(125,113,167,0.08), 0 12px 32px -14px rgba(125,113,167,0.35), 0 4px 14px -8px rgba(255,173,199,0.35)",
        lift: "0 2px 4px rgba(125,113,167,0.10), 0 18px 36px -14px rgba(125,113,167,0.45), 0 6px 18px -8px rgba(255,173,199,0.45)",
      },
    },
  },
  plugins: [],
};
