/** Design tokens. Text colours are chosen for >= 4.5:1 on the page and card surfaces:
 *  ink #1f1b2e (16.7:1 on white), ink-2 #4a4560 (9.1:1), muted #5c5670 (6.6:1),
 *  brand-strong #5f5390 (6.7:1). Brand #7D71A7 (4.4:1) is for fills, borders and large text only. */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1f1b2e", 2: "#4a4560", muted: "#5c5670" },
        brand: {
          DEFAULT: "#7D71A7",
          strong: "#5f5390",
          lilac: "#CAADFF",
          pink: "#FFC2E2",
          cream: "#FCF6D9",
          wash: "#f4effb",
        },
        page: "#faf7fc",
      },
      fontSize: {
        "display": ["clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "title": ["clamp(1.375rem, 1.1rem + 1.2vw, 1.875rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,27,46,0.04), 0 8px 24px -12px rgba(31,27,46,0.12)",
      },
    },
  },
  plugins: [],
};
