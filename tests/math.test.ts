import { describe, it, expect } from "vitest";
import {
  normalize,
  difference,
  ML_PER_US_OZ,
  compareLabels,
} from "../src/lib/math";
describe("price normalization", () => {
  it("uses the exact US fluid ounce conversion", () => {
    expect(normalize(29.5735295625, 1, "oz")?.perMl).toBeCloseTo(1, 12);
    expect(normalize(30, 30, "ml")?.perOz).toBe(ML_PER_US_OZ);
  });
  it("compares unrounded costs with a declared baseline", () => {
    expect(
      difference(
        normalize(30, 30, "ml")!.perMl,
        normalize(45, 60, "ml")!.perMl,
      ),
    ).toBe(-25);
    expect(difference(0, 1)).toBeNull();
    expect(difference(1, 0)).toBe(-100);
  });
  it("rejects division by zero, negative prices, and nonfinite results", () => {
    for (const [price, size] of [
      [10, 0],
      [-1, 30],
      [Infinity, 2],
      [2, NaN],
      [1e308, 1e-308],
    ])
      expect(normalize(price, size, "ml")).toBeNull();
    expect(normalize(0, 1, "ml")?.perMl).toBe(0);
  });
  it("retains precision for decimal input", () => {
    expect(normalize(19.99, 29.5, "ml")!.perMl).toBeCloseTo(19.99 / 29.5, 12);
  });
});
describe("label comparison", () => {
  it("matches case without conflating chemically different labels", () => {
    expect(
      compareLabels(
        ["Copper Tripeptide-1", "Glycerin"],
        ["Tripeptide-1 Copper Acetate", "glycerin"],
      ),
    ).toEqual({
      shared: ["Glycerin"],
      onlyA: ["Copper Tripeptide-1"],
      onlyB: ["Tripeptide-1 Copper Acetate"],
    });
  });
});
