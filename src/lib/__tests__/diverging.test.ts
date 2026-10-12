import { DIVERGING, divergingColor, textOn } from "../diverging";
import { contrastRatio } from "../format";

describe("divergingColor", () => {
  it("is neutral at zero and hits the poles at ±max", () => {
    expect(divergingColor(0, 100)).toBe(DIVERGING.neutral);
    expect(divergingColor(100, 100)).toBe(DIVERGING.positive);
    expect(divergingColor(-100, 100)).toBe(DIVERGING.negative);
  });

  it("keeps cell text at ≥ 4.5:1 across the whole scale", () => {
    let worst = Infinity;
    for (let v = -100; v <= 100; v += 1) {
      const bg = divergingColor(v, 100);
      worst = Math.min(worst, contrastRatio(textOn(bg), bg));
    }
    expect(worst).toBeGreaterThanOrEqual(4.5);
  });
});
