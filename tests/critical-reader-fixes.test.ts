import { expect, it } from "vitest";
import { knowledgeRelations } from "../src/lib/knowledge-relations";
import { catalog } from "../src/lib/data";
import { contentNavigation } from "../src/lib/content-navigation";
import { matchesDirectoryName } from "../src/lib/directory-search";
import { checkForField } from "../src/lib/documentation-checks";
import {
  documentForPath,
  policyForPath,
} from "../src/lib/publication-registry";
import { transparencyForPath } from "../src/lib/transparency";
import {
  productReturn,
  withProductContext,
} from "../src/lib/discovery-context";
import { sourceSummary } from "../src/lib/source-summary";
import { researchRecords, studyExtractions } from "../src/lib/research-records";

it("recommends ingredient-containing products through exact recorded relations only", () => {
  const related = knowledgeRelations(
    "/skincare/ingredients/acetyl-hexapeptide-8/",
  );
  const products = related.filter((item) =>
    item.href.startsWith("/skincare/products/"),
  );
  expect(products.length).toBeGreaterThan(0);
  expect(
    products.some((item) => item.href === "/skincare/products/niod-cais3/"),
  ).toBe(false);
  for (const item of products)
    expect(
      catalog.products.find(
        (p) => `/skincare/products/${p.slug}/` === item.href,
      )?.ingredientIds,
    ).toContain("acetyl-hexapeptide-8");
  expect(related.every((item) => item.reason.length > 10)).toBe(true);
  const niod = knowledgeRelations("/skincare/products/niod-cais3/");
  expect(
    niod.some((item) => item.href.includes("tripeptide-1-copper-acetate")),
  ).toBe(true);
  expect(
    niod.some(
      (item) => item.href === "/skincare/ingredients/copper-tripeptide-1/",
    ),
  ).toBe(false);
  expect(
    knowledgeRelations("/library/bpc-157/").some((item) =>
      /retatrutide/.test(item.href),
    ),
  ).toBe(false);
});
it("keeps extracted data separate from human checking and invalidates stale field checks", () => {
  const href = "/skincare/products/niod-cais3/";
  const document = documentForPath(href)!;
  expect(
    transparencyForPath(href).find((f) => f.label === "Source trail")?.state,
  ).toBe("source-recorded");
  expect(
    transparencyForPath(href).find(
      (f) => f.label === "Product identity & ingredient coverage",
    )?.state,
  ).toBe("extracted");
  const check = {
    documentId: document.id,
    revision: document.revision,
    field: "Concentration disclosure",
    reviewerId: "synthetic-test-reviewer",
    checkedAt: "2026-11-08",
    scope: "Synthetic field fixture",
  };
  expect(checkForField(document, check.field, [check])).toBe(check);
  expect(
    checkForField({ ...document, revision: "changed" }, check.field, [check]),
  ).toBeUndefined();
  expect(checkForField(document, "Price observation", [check])).toBeUndefined();
  expect(policyForPath(href)?.scientificReviewed).toBe(false);
  const p = catalog.products.find((p) => p.id === "niod-cais3")!;
  const text = p.concentrationDisclosure;
  try {
    p.concentrationDisclosure = "Unknown wording: not disclosed";
    expect(
      transparencyForPath(href).find(
        (f) => f.label === "Concentration disclosure",
      )?.state,
    ).toBe("extracted");
  } finally {
    p.concentrationDisclosure = text;
  }
});
it("carries a validated product and discovery parent without allowing external returns", () => {
  const parent =
    "/peptides/?topic=skin&format=Ingredient+profile&qname=Tripeptide";
  const target = new URL(
    withProductContext(
      "/skincare/ingredients/tripeptide-29/",
      "/skincare/products/niod-cais3/",
      parent,
    ),
    "https://example.test",
  );
  expect(target.searchParams.get("returnTo")).toBe(parent);
  expect(productReturn(target.searchParams.get("fromProduct")!)).toBe(
    "/skincare/products/niod-cais3/",
  );
  for (const value of [
    "//evil.test/skincare/products/niod-cais3/",
    "/skincare/products/unknown/",
    "/contact/",
    "javascript:alert(1)",
  ])
    expect(productReturn(value)).toBeUndefined();
});
it("filters names and documented aliases without merging identities or changing ordering", () => {
  const entries = contentNavigation.filter((e) => e.directory);
  expect(
    entries.filter((e) => matchesDirectoryName(e, "GHKCu")).map((e) => e.id),
  ).toEqual(["skin:copper-tripeptide-1"]);
  expect(
    entries
      .filter((e) => matchesDirectoryName(e, "Acetyl Hexapeptide-8"))
      .map((e) => e.id),
  ).toEqual(["skin:acetyl-hexapeptide-8"]);
  expect(entries.filter((e) => matchesDirectoryName(e, "unknown-999"))).toEqual(
    [],
  );
});
it("identifies references and exposes real search scope without inventing human approval", () => {
  expect(sourceSummary("argireline-trial")?.label).toContain("Wang Y");
  expect(sourceSummary("argireline-trial")?.access).toContain("abstract");
  expect(sourceSummary("cir-acetyl")?.commercialContext).toContain(
    "Personal Care Products Council",
  );
  for (const record of researchRecords) {
    expect(record.selectionScope).toMatch(/historical|original/i);
    expect(
      record.searches.every((s) =>
        s.query.startsWith("site.pubmed.ncbi.nlm.nih.gov"),
      ),
    ).toBe(true);
    expect(record.pending.length).toBeGreaterThan(0);
  }
  expect(
    studyExtractions.every((study) => study.humanReview === "pending"),
  ).toBe(true);
});
