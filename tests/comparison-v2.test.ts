import { expect, it } from "vitest";
import { products, priceFor, catalog } from "../src/lib/data";
import {
  comparisonGroupsV2,
  comparisonRowsV2,
  visibleComparisonRows,
  comparisonFacts,
} from "../src/lib/comparison";
import { comparisonEvidenceData } from "../src/lib/comparison-evidence";

const a = products.find((p) => p.id === "ordinary-copper")!;
const b = products.find((p) => p.id === "niod-cais3")!;
it("keeps provenance, unknowns and identity when matching rows are hidden", () => {
  const rows = comparisonRowsV2(a, b);
  expect(new Set(rows.map((r) => r.group))).toEqual(
    new Set(comparisonGroupsV2),
  );
  const filtered = visibleComparisonRows(rows, true);
  expect(filtered.some((r) => r.id === "size")).toBe(false);
  for (const id of [
    "identity",
    "usage",
    "formula-scope",
    "concentrations",
    "claims-coverage",
    "unknowns",
    "sources",
    "price-source",
  ])
    expect(
      filtered.some((r) => r.id === id),
      id,
    ).toBe(true);
  expect(rows.find((r) => r.id === "price")!.values[0]).toMatchObject({
    date: priceFor(a)!.observedAt,
    sourceIds: [priceFor(a)!.sourceId],
  });
  expect(rows.find((r) => r.id === "sources")!.values[0].date).toBe(
    a.lastVerifiedAt,
  );
  expect(rows.find((r) => r.id === "concentrations")!.values[0].text).toBe(
    a.concentrationDisclosure,
  );
});
it("missing size prices remain unknown and never become a zero-cost winner", () => {
  const missing = products.find((p) => !priceFor(p))!;
  const rows = comparisonRowsV2(a, missing);
  expect(comparisonFacts(a, missing).cost.kind).toBe("missing");
  for (const id of ["price", "unit-cost"]) {
    const row = visibleComparisonRows(rows, true).find((r) => r.id === id)!;
    expect(row.values[1].missing).toBe(true);
    expect(row.values[1].text).not.toContain("$0");
  }
});
it("editorial evidence remains tied to its exact pair and every passage source is resolvable", () => {
  const data = comparisonEvidenceData();
  expect(data.market).toBe("US");
  const pair = data.pairs[[a.id, b.id].sort().join("|")];
  expect(pair.href).toBe("/skincare/compare/niod-cais3-vs-the-ordinary/");
  expect(pair.paragraphs.length).toBeGreaterThan(0);
  for (const p of Object.values(data.pairs).flatMap((p) => p.paragraphs))
    for (const id of p.sourceIds) expect(data.sources[id], id).toBeDefined();
  for (const i of Object.values(data.ingredients))
    for (const id of i.sourceIds)
      expect(catalog.sources.some((s) => s.id === id)).toBe(true);
  expect(data.pairs["ordinary-argireline|ordinary-copper"]).toBeUndefined();
});
