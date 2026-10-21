import { expect, it } from "vitest";
import { catalog } from "../src/lib/data";
import { guides } from "../src/lib/guides";

it("keeps guide sources and reciprocal comparison references complete", () => {
  expect(guides).toHaveLength(2);
  for (const guide of guides) {
    expect(guide.status).toBe("draft");
    for (const id of guide.sourceIds)
      expect(catalog.sources.some((s) => s.id === id)).toBe(true);
    expect(
      guide.table.rows.every(
        (r) => r.cells.length === guide.table.headers.length,
      ),
    ).toBe(true);
    for (const id of guide.comparisonIds)
      expect(
        catalog.comparisons.find((c) => c.id === id)?.relatedGuideSlugs,
      ).toContain(guide.slug);
  }
});

it("keeps exact Matrixyl peptide identities and marks the arithmetic example hypothetical", () => {
  const matrixyl = guides.find((g) => g.slug === "matrixyl-3000-vs-synthe6")!;
  const row = matrixyl.table.rows[0];
  expect(row.cells[1]).toContain("Palmitoyl Tetrapeptide-7");
  expect(row.cells[2]).toBe("Palmitoyl Tripeptide-38");
  const example = guides
    .find((g) => g.slug === "peptide-percentages-explained")!
    .sections.find((s) => s.id === "worked-example")!.paragraphs[0].text;
  expect(example).toContain("Illustrative arithmetic only");
  expect(example).toContain("0.1%");
  expect(example).toContain("Do not use this example to estimate");
});
