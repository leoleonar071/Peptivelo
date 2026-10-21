import { it, expect } from "vitest";
import { evaluationFor } from "../src/lib/evaluations";
import { comparisonCitations } from "../src/lib/citations";
import { catalog } from "../src/lib/data";

it("keeps scientific claims separate from manufacturer provenance", () => {
  const evaluation = evaluationFor("niod-vs-ordinary")!;
  expect(evaluation.status).toBe("draft");
  expect(evaluation.sections.map((s) => s.id)).toEqual([
    "benefits",
    "risks",
    "long-term",
    "value",
  ]);
  for (const p of evaluation.sections.flatMap((s) => s.paragraphs))
    for (const id of p.sourceIds)
      expect(catalog.sources.find((s) => s.id === id)!.sourceType).not.toBe(
        "manufacturer",
      );
  expect(evaluation.labelSourceIds).toEqual(["ordinary", "niod"]);
});

it("does not convert case reports or data gaps into product risk rates", () => {
  const evaluation = evaluationFor("niod-vs-ordinary")!;
  const risk = evaluation.sections
    .find((s) => s.id === "risks")!
    .paragraphs.map((p) => p.text)
    .join(" ");
  expect(risk).toContain("not how frequently");
  expect(risk).toContain("not a guarantee");
  const longTerm = evaluation.sections
    .find((s) => s.id === "long-term")!
    .paragraphs.map((p) => p.text)
    .join(" ");
  expect(longTerm).toContain("not evidence that these products cause");
  expect(longTerm).toContain("injection, ingestion or microneedling");
});

it("puts research first and omits citation targets for replaced legacy sections", () => {
  const comparison = catalog.comparisons.find(
    (c) => c.id === "niod-vs-ordinary",
  )!;
  const refs = comparisonCitations(comparison);
  expect(refs.sourceIds[0]).toBe("argireline-trial");
  expect(
    refs.claims.some((c) => c.key === "answer" || c.key === "research"),
  ).toBe(false);
  expect(
    refs.claims.find((c) => c.key === "evaluation-labels")?.sourceIds,
  ).toContain("niod");
});
