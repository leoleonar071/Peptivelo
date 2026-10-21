import { expect, it } from "vitest";
import { catalog } from "../src/lib/data";
import { guides } from "../src/lib/guides";
import {
  citationId,
  citationSet,
  comparisonCitations,
  evidence,
  guideCitations,
  referenceId,
} from "../src/lib/citations";

it("gives each pilot claim a stable reference and unique return target", () => {
  const comparison = catalog.comparisons.find(
    (c) => c.id === "niod-vs-ordinary",
  )!;
  for (const set of [
    ...guides.map(guideCitations),
    comparisonCitations(comparison),
  ]) {
    expect(new Set(set.sourceIds).size).toBe(set.sourceIds.length);
    const targets = set.claims.flatMap((c) =>
      [...new Set(c.sourceIds)].map((id) => citationId(set, c.key, id)),
    );
    expect(new Set(targets).size).toBe(targets.length);
    for (const id of set.sourceIds) {
      expect(evidence.some((e) => e.sourceId === id)).toBe(true);
      expect(referenceId(set, id)).toContain(id);
      expect(set.claims.some((c) => c.sourceIds.includes(id))).toBe(true);
    }
  }
  expect(() =>
    citationSet("bad", [{ key: "test", sourceIds: ["unknown"] }]),
  ).toThrow();
});

it("does not dress invented arithmetic as a sourced product measurement", () => {
  const p = guides
    .find((g) => g.slug === "peptide-percentages-explained")!
    .sections.find((s) => s.id === "worked-example")!.paragraphs[0];
  expect(p.kind).toBe("illustration");
  expect(p.sourceIds).toEqual([]);
  expect(p.text).toContain("invented");
});

it("keeps academic scope, commercial disclosure and review limits explicit", () => {
  const trial = evidence.find((e) => e.sourceId === "argireline-trial")!;
  expect(trial.kind).toBe("Human ingredient study");
  expect(trial.doi).toBe("10.1007/s40257-013-0009-9");
  expect(trial.access).toContain("were not reviewed");
  expect(trial.commercialContext).toContain("author declarations");
  expect(trial.limits).toContain("Neither CAIS3");
  expect(evidence.find((e) => e.sourceId === "croda-matrixyl")!.kind).toBe(
    "Supplier information",
  );
});
