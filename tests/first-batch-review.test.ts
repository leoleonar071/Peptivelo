import { it, expect } from "vitest";
import { catalog } from "../src/lib/data";
import { evaluationFor } from "../src/lib/evaluations";
import { comparisonCitations, evidence } from "../src/lib/citations";

it("keeps all ingredients in the selected review batch pending scientific review", () => {
  const ids = new Set(catalog.products.filter((p) => ["ordinary-ha", "ordinary-copper", "niod-cais3"].includes(p.id)).flatMap((p) => p.ingredientIds));
  expect(ids.size).toBe(9);
  for (const id of ids) expect(catalog.ingredients.find((i) => i.id === id)!.education.scientificReviewPending).toBe(true);
});

it("connects the concentration-limited safety assessment to both comparisons", () => {
  expect(evidence.find((e) => e.sourceId === "cir-acetyl")!.supports).toContain("0.005%");
  for (const id of ["ordinary-ha-vs-copper", "niod-vs-ordinary"]) {
    expect(evaluationFor(id)!.status).toBe("draft");
    const comparison = catalog.comparisons.find((c) => c.id === id)!;
    expect(comparisonCitations(comparison).sourceIds).toContain("cir-acetyl");
  }
});
