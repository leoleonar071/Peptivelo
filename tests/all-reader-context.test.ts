import { it, expect } from "vitest";
import { catalog } from "../src/lib/data";
import { evaluationFor } from "../src/lib/evaluations";
import { comparisonCitations } from "../src/lib/citations";

it("gives every comparison three source-scoped answers without fabricating clinical support", () => {
  for (const c of catalog.comparisons) {
    const e = evaluationFor(c.id)!;
    expect(e, c.id).toBeDefined();
    expect(e.decisionSummary, c.id).toHaveLength(3);
    expect(c.citationPilot, c.id).toBe(true);
    const citations = comparisonCitations(c);
    expect(citations.claims.some((claim) => claim.key === "decision-summary-2")).toBe(true);
    if (e.mode === "label") {
      expect(e.decisionSummary![2].sourceIds).toEqual([]);
      expect(e.decisionSummary![2].basis).toBe("interpretation");
      for (const paragraph of e.sections.flatMap((section) => section.paragraphs).filter((p) => p.kind === "label")) {
        for (const id of paragraph.sourceIds) expect(catalog.sources.find((s) => s.id === id)!.sourceType).toBe("manufacturer");
      }
    }
  }
});
