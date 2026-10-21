import { expect, it } from "vitest";
import {
  haircare,
  hairProductCitations,
  hairIngredientCitations,
} from "../src/lib/haircare";
import { products } from "../src/lib/data";
import { evidence } from "../src/lib/citations";

it("keeps a scalp cosmetic out of facial product selection and preserves exact size and price", () => {
  expect(products.some((p) => p.id === haircare.product.id)).toBe(false);
  expect(haircare.product.volumeMl).toBe(60);
  expect(haircare.product.priceUsd / haircare.product.volumeMl).toBe(0.4);
  expect(haircare.product.status).toBe("draft");
  expect(haircare.ingredients.map((i) => i.name)).toContain(
    "Acetyl Tetrapeptide-3",
  );
});

it("distinguishes a related formulation study from retail-product evidence", () => {
  const note = evidence.find((e) => e.sourceId === "hair-combination-trial")!;
  expect(note.design).toContain("no placebo arm");
  expect(note.limits).toContain("Different product");
  expect(note.limits).toContain("cannot isolate the peptide");
  for (const set of [
    hairProductCitations(),
    ...haircare.ingredients.map(hairIngredientCitations),
  ]) {
    expect(new Set(set.claims.map((c) => c.key)).size).toBe(set.claims.length);
    for (const id of set.sourceIds)
      expect(evidence.some((e) => e.sourceId === id)).toBe(true);
  }
});
