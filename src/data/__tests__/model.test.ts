import { CHANNELS, CHANNEL_COLORS, channelSummary, channelTable, doublingEffect, getDivision, meanR2, model, monthlyAverages } from "../model";
import { contrastRatio } from "../../lib/format";

describe("model outputs", () => {
  it("covers the true period of the raw CSV", () => {
    expect(model.period).toEqual({ start: "2018-01-06", end: "2020-02-29", weeks: 113 });
    expect(model.combinedWeekly).toHaveLength(113);
    model.topDivisions.forEach((d) => expect(d.weekly).toHaveLength(113));
  });

  it("models the six highest-R² divisions, best first", () => {
    expect(model.topDivisions.map((d) => d.division)).toEqual(["Y", "D", "H", "I", "M", "Q"]);
    const r2 = model.topDivisions.map((d) => d.r2);
    expect([...r2].sort((a, b) => b - a)).toEqual(r2);
    expect(meanR2()).toBeCloseTo(0.643, 3);
  });
});

describe("channelTable", () => {
  it("differs by division (responds to the selector)", () => {
    const y = channelTable(getDivision("Y"));
    const d = channelTable(getDivision("D"));
    expect(y).not.toEqual(d);
    expect(y.find((r) => r.channel === "Google")!.impressions).toBe(getDivision("Y").channels.Google.impressions);
  });

  it("ranks by coefficient and derives the doubling effect as β·ln2", () => {
    const rows = channelTable(getDivision("Y"));
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
    expect(rows[0].channel).toBe("Email");
    expect(rows[rows.length - 1].channel).toBe("Affiliate");
    for (const r of rows) {
      expect(r.doublingEffect).toBeCloseTo(r.coefficient * Math.log(2), 6);
      expect(r.weeklyImpressions).toBeCloseTo(r.impressions / 113, 6);
    }
    expect(Math.round(rows[0].doublingEffect)).toBe(42050);
  });

  it("contains no spend, revenue or ROI fields", () => {
    const keys = Object.keys(channelTable(getDivision("Y"))[0]);
    expect(keys.some((k) => /spend|roi|revenue/i.test(k))).toBe(false);
  });
});

describe("channelSummary", () => {
  it("averages coefficients across the modelled divisions", () => {
    const email = channelSummary().find((s) => s.channel === "Email")!;
    const manual = model.topDivisions.reduce((s, d) => s + d.channels.Email.coefficient, 0) / model.topDivisions.length;
    expect(email.meanCoefficient).toBeCloseTo(manual, 6);
    expect(email.meanDoublingEffect).toBeCloseTo(doublingEffect(manual), 6);
    expect(channelSummary().find((s) => s.channel === "Affiliate")!.negativeDivisions).toBe(6);
  });
});

describe("monthlyAverages", () => {
  it("averages weeks within a calendar month", () => {
    const m = monthlyAverages([
      { week: "2018-01-06", actual: 10, predicted: 12 },
      { week: "2018-01-13", actual: 20, predicted: 18 },
      { week: "2018-02-03", actual: 5, predicted: 5 },
    ]);
    expect(m).toEqual([
      { month: "2018-01", actual: 15, predicted: 15, weeks: 2 },
      { month: "2018-02", actual: 5, predicted: 5, weeks: 1 },
    ]);
  });
});

describe("channel colours", () => {
  it("are distinct and visible on white", () => {
    const colors = CHANNELS.map((c) => CHANNEL_COLORS[c]);
    expect(new Set(colors).size).toBe(4);
    colors.forEach((c) => expect(contrastRatio(c, "#ffffff")).toBeGreaterThan(2.5));
  });
});
