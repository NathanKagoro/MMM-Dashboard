import { WJ, formatCompact, formatCurrency, formatInteger, formatMonthYear, formatPercent, formatSignedCurrency, niceTicks, contrastRatio, MINUS } from "../format";

describe("formatCurrency", () => {
  it("puts the minus sign before £ and uses a true minus", () => {
    expect(formatCurrency(-49046.53)).toBe(`${MINUS}${WJ}£49,047`);
    expect(formatCurrency(-49046.53)).not.toContain("£-");
  });
  it("formats positive and compact values", () => {
    expect(formatCurrency(25000)).toBe("£25,000");
    expect(formatCurrency(25000, { compact: true })).toBe("£25K");
    expect(formatCurrency(-114376, { compact: true })).toBe(`${MINUS}${WJ}£114.4K`);
    expect(formatCurrency(-114376, { compact: true, digits: 0 })).toBe(`${MINUS}${WJ}£114K`);
    expect(formatCurrency(2_500_000, { compact: true })).toBe("£2.5M");
  });
  it("never shows a negative zero", () => {
    expect(formatCurrency(-0.3)).toBe("£0");
  });
  it("adds an explicit + only to positive changes", () => {
    expect(formatSignedCurrency(5800, { compact: true })).toBe(`+${WJ}£5.8K`);
    expect(formatSignedCurrency(-5200, { compact: true })).toBe(`${MINUS}${WJ}£5.2K`);
    expect(formatSignedCurrency(0)).toBe("£0");
  });
});

describe("formatCompact", () => {
  it("abbreviates with K/M/B and trims trailing zeros", () => {
    expect(formatCompact(25000)).toBe("25K");
    expect(formatCompact(39_225_645)).toBe("39.2M");
    expect(formatCompact(950)).toBe("950");
    expect(formatCompact(-26900)).toBe(`${MINUS}${WJ}26.9K`);
  });
  it("rolls 999,950 up to 1M instead of 1000K", () => {
    expect(formatCompact(999_950)).toBe("1M");
  });
});

describe("other formatters", () => {
  it("formats integers, percents and months", () => {
    expect(formatInteger(-54261.36)).toBe(`${MINUS}${WJ}54,261`);
    expect(formatPercent(0.607)).toBe("61%");
    expect(formatPercent(-0.54)).toBe(`${MINUS}${WJ}54%`);
    expect(formatMonthYear("2018-01-06")).toBe("Jan 2018");
    expect(formatMonthYear("2020-02-29")).toBe("Feb 2020");
  });
});

describe("niceTicks", () => {
  it("produces evenly spaced, rounded ticks that include zero", () => {
    // The old scatter axis read 214K, 134K, 53.4K, −26.9K, −107K.
    const ticks = niceTicks(-107_000, 214_000, 5);
    expect(ticks).toContain(0);
    const steps = ticks.slice(1).map((t, i) => t - ticks[i]);
    expect(new Set(steps).size).toBe(1);
    expect(ticks.every((t) => t % 50_000 === 0)).toBe(true);
    expect(ticks[0]).toBeLessThanOrEqual(-107_000);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(214_000);
  });
  it("handles a flat range", () => {
    expect(niceTicks(5, 5).length).toBeGreaterThan(1);
  });
});

describe("contrastRatio", () => {
  it("matches WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#ffffff", "#FFC2E2")).toBeLessThan(1.6); // the old KPI cards
    expect(contrastRatio("#1f1b2e", "#ffffff")).toBeGreaterThan(15);
  });
});
