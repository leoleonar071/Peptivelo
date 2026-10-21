import { expect, it } from "vitest";
import { catalog, priceFor, products } from "../src/lib/data";
import { comparisonRows, volumeLabel } from "../src/lib/comparison";
import { normalize } from "../src/lib/math";

it("preserves the Timeless one-ounce variant and excludes conditional discounts", () => {
  const p = products.find((p) => p.id === "timeless-synthe6")!;
  expect(volumeLabel(p)).toBe("1 US fl oz");
  const price = priceFor(p)!;
  expect(price.price).toBe(28.95);
  expect(price.sizeUnit).toBe("oz");
  const normalized = normalize(price.price, price.size, price.sizeUnit)!;
  expect(normalized.ml).toBeCloseTo(29.5735295625);
  expect(normalized.perMl).toBeCloseTo(0.9789, 3);
  expect(p.ingredientListScope).toContain("system name");
});

it("keeps original Liquid Peptides distinct and complex percentages contextualized", () => {
  const p = products.find((p) => p.id === "medik8-liquid-peptides")!;
  expect(p.description).toContain(
    "separately from Liquid Peptides Advanced MP",
  );
  expect(priceFor(p)?.price).toBe(68);
  const ordinary = products.find((p) => p.id === "ordinary-ha")!;
  const row = comparisonRows(p, ordinary).find(
    (r) => r.id === "concentrations",
  )!;
  expect(row.values[0].text).toContain("does not mean 30% pure peptides");
  expect(
    catalog.comparisons.find((c) => c.id === "medik8-vs-ha")?.publicationStatus,
  ).toBe("draft");
});
