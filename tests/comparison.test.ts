import { describe, it, expect } from "vitest";
import {
  costInsight,
  comparisonFacts,
  comparisonRows,
  visibleComparisonRows,
} from "../src/lib/comparison";
import { products } from "../src/lib/data";
describe("comparison insights", () => {
  it("does not infer a cheaper product when a price is missing", () => {
    expect(costInsight(1, null)).toEqual({ kind: "missing" });
    expect(costInsight(null, 0)).toEqual({ kind: "missing" });
    const facts = comparisonFacts(products[0], { ...products[1], id: "unrecorded-price-fixture" });
    expect(facts.cost.kind).toBe("missing");
    expect(facts.costs.filter((c) => c !== null)).toHaveLength(1);
  });
  it("normalizes price differences relative to the more expensive product", () => {
    expect(costInsight(1, 0.75)).toEqual({
      kind: "different",
      lower: "b",
      percent: 25,
    });
    expect(costInsight(0.75, 1)).toEqual({
      kind: "different",
      lower: "a",
      percent: 25,
    });
    expect(costInsight(0, 2)).toEqual({
      kind: "different",
      lower: "a",
      percent: 100,
    });
    expect(costInsight(0, 0)).toEqual({ kind: "equal" });
  });
  it("keeps selected names distinct and does not merge copper forms", () => {
    const facts = comparisonFacts(products[0], products[1]);
    expect(facts.labels.shared).toEqual([]);
    expect(facts.labels.onlyA).toContain("Copper Tripeptide-1");
    expect(facts.labels.onlyB).toContain("Tripeptide-1 Copper Acetate");
  });
  it("hides matching recorded facts while keeping missing data and source context", () => {
    const rows = comparisonRows(products[0], products[1]);
    const visible = visibleComparisonRows(rows, true);
    expect(visible.map((row) => row.id)).not.toContain("size");
    expect(visible.map((row) => row.id)).not.toContain("format");
    expect(visible.map((row) => row.id)).toEqual(
      expect.arrayContaining([
        "price",
        "unit-cost",
        "peptides",
        "concentrations",
        "unknowns",
        "sources",
      ]),
    );
    expect(visibleComparisonRows(rows, false)).toHaveLength(rows.length);
  });
  it("never treats two absent prices as a recorded match", () => {
    const rows = comparisonRows(
      { ...products[1], id: "missing-a" },
      { ...products[1], id: "missing-b" },
    );
    const visible = visibleComparisonRows(rows, true);
    expect(
      visible
        .find((row) => row.id === "price")
        ?.values.every((value) => value.missing),
    ).toBe(true);
    expect(visible.find((row) => row.id === "unit-cost")).toBeDefined();
    expect(visible.find((row) => row.id === "unknowns")).toBeDefined();
  });
  it("compares ingredient names without treating order as a difference", () => {
    const rows = comparisonRows(products[0], {
      ...products[0],
      ingredientList: [...products[0].ingredientList].reverse(),
    });
    expect(rows.find((row) => row.id === "peptides")?.different).toBe(false);
  });
});
