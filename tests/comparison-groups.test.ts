import { expect, it } from "vitest";
import {
  canCompareEntities,
  canCompareProducts,
  comparisonGroups,
  eligibleComparisonProducts,
} from "../src/lib/comparison-groups";
import { comparisonPath, comparisonUrl } from "../src/lib/config";
import { searchIndex } from "../src/lib/search-index";

it("uses explicit catalog eligibility and keeps entity kind separate from topic", () => {
  expect(comparisonGroups).toHaveLength(1);
  expect(eligibleComparisonProducts.length).toBeGreaterThan(1);
  expect(canCompareProducts("ordinary-copper", "niod-cais3")).toBe(true);
  expect(canCompareProducts("ordinary-copper", "ordinary-copper")).toBe(false);
  expect(canCompareProducts("ordinary-copper", "unknown")).toBe(false);
  const a = {
    id: "ordinary-copper",
    kind: "product" as const,
    topic: "skin" as const,
  };
  expect(
    canCompareEntities(a, { id: "niod-cais3", kind: "product", topic: "hair" }),
  ).toBe(false);
  expect(
    canCompareEntities(a, { id: "niod-cais3", kind: "peptide", topic: "skin" }),
  ).toBe(false);
  expect(
    canCompareEntities(
      { id: "retatrutide", kind: "peptide", topic: "health" },
      { id: "bpc-157", kind: "peptide", topic: "health" },
    ),
  ).toBe(false);
});
it("builds the general tool, editorial and only-B URLs centrally", () => {
  expect(comparisonPath()).toBe("/compare/");
  expect(searchIndex.find((entry) => entry.name === "Compare")?.href).toBe(
    comparisonPath(),
  );
  expect(comparisonPath("niod-cais3-vs-the-ordinary")).toBe(
    "/compare/niod-cais3-vs-the-ordinary/",
  );
  expect(comparisonUrl(undefined, "niod-cais3")).toBe("/compare/?b=niod-cais3");
  expect(comparisonUrl("ordinary-copper", "niod-cais3")).toBe(
    "/compare/?a=ordinary-copper&b=niod-cais3",
  );
});
