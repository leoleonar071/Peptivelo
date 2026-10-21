import { it, expect } from "vitest";
import { catalog, products, priceFor } from "../src/lib/data";
import { existsSync } from "node:fs";
it("requires traceable published products and dated size-specific prices", () => {
  expect(products.length).toBeGreaterThanOrEqual(2);
  for (const p of products) {
    expect(catalog.sources.some((s) => s.id === p.sourceId)).toBe(true);
    expect(p.ingredientListScope).toContain("Selected");
    const price = priceFor(p);
    if (price) {
      expect(price.size).toBe(p.volume);
      expect(price.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  }
});
it("keeps distinct product imagery and editorial pairs with valid source trails", () => {
  expect(new Set(products.map((p) => p.image)).size).toBe(products.length);
  for (const p of products)
    expect(existsSync(`public${p.image}`), p.id).toBe(true);
  const pairs = catalog.comparisons.map((comparison) => {
    expect(new Set(comparison.comparedProductIds).size).toBe(2);
    expect(comparison.buyerQuestion.length).toBeGreaterThan(0);
    for (const id of comparison.sourceIds)
      expect(catalog.sources.some((s) => s.id === id)).toBe(true);
    return [...comparison.comparedProductIds].sort().join("|");
  });
  expect(new Set(pairs).size).toBe(pairs.length);
});
it("keeps pending editorial comparison out of publication", () => {
  expect(catalog.comparisons[0].publicationStatus).toBe("draft");
  expect(
    priceFor(products.find((p) => p.id === "niod-cais3")!),
  ).toMatchObject({ price: 93, size: 30, sizeUnit: "ml", currency: "USD", verifiedAt: "2026-10-20" });
});
