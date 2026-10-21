import { expect, it } from "vitest";
import { products, priceFor, catalog } from "../src/lib/data";
import { comparisonCitations, evidence } from "../src/lib/citations";
import { studyDataFor } from "../src/lib/study-data";
import { evaluationFor } from "../src/lib/evaluations";

it("preserves P-TIOX serum size, current one-time price and market-specific label limit", () => {
  const p = products.find((p) => p.id === "skinceuticals-ptiox")!;
  expect(p.volume).toBe(30);
  expect(priceFor(p)?.price).toBe(150);
  expect(p.ingredientListScope).toContain("UK");
  expect(p.ingredientListScope).toContain("US INCI was not retrieved");
  expect(p.concentrationExplanation).toContain(
    "pure-peptide amounts are not verified",
  );
});

it("scopes technical evidence to the pair and exposes commercial research context", () => {
  const rows = studyDataFor("ptiox-vs-ha");
  expect(rows.map((r) => r.sourceId)).toEqual([
    "ptiox-zhu-2026",
    "ptiox-adjunct-2026",
  ]);
  expect(studyDataFor("niod-vs-ordinary")).toHaveLength(6);
  const c = catalog.comparisons.find((c) => c.id === "ptiox-vs-ha")!;
  const set = comparisonCitations(c);
  expect(set.sourceIds).not.toContain("phenoxyethanol-cases");
  expect(
    evidence.find((e) => e.sourceId === "ptiox-zhu-2026")?.commercialContext,
  ).toContain("L’Oréal");
  expect(evaluationFor(c.id)?.status).toBe("draft");
});
