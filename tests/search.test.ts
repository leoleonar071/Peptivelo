import { expect, it } from "vitest";
import { catalog } from "../src/lib/data";
import { searchIndex } from "../src/lib/search-index";
import {
  groupedSuggestions,
  searchEntries,
  searchCategories,
} from "../src/lib/search";
it("retrieves real documents for starter and natural-language queries", () => {
  for (const query of [
    "GHK-Cu",
    "Copper peptides",
    "Peptide concentration",
    "Multi-peptide serums",
    "Serum ingredients",
    "Peptide concentrations",
    "What does 10% peptide mean?",
    "The Ordinary",
    "Peptide serums",
    "Products with copper peptides",
    "What is GHK-Cu?",
    "What does peptide complex 10% mean?",
    "Which serums contain copper peptides?",
    "What did the research actually test?",
  ]) {
    expect(searchEntries(searchIndex, query).length, query).toBeGreaterThan(0);
  }
  expect(searchEntries(searchIndex, "What is GHK-Cu?")[0].category).toBe(
    "Peptides & ingredients",
  );
  expect(searchEntries(searchIndex, "What is GHK-Cu?")[0].href).toBe(
    "/skincare/ingredients/copper-tripeptide-1/",
  );
  expect(searchEntries(searchIndex, "zzzzzzz-no-document")).toEqual([]);
  expect(searchEntries(searchIndex, "   ")).toEqual([]);
});

it("expands a verified identity through exact label IDs without merging copper ingredients", () => {
  for (const query of [
    "GHK-Cu",
    "GHKCu",
    "What is GHK-Cu?",
    "Copper Tripeptide-1",
  ]) {
    const results = searchEntries(searchIndex, query);
    expect(results[0].href, query).toBe(
      "/skincare/ingredients/copper-tripeptide-1/",
    );
    const productLinks = results
      .filter((entry) => entry.category === "Products")
      .map((entry) => entry.href);
    expect(productLinks.sort(), query).toEqual(
      [
        "/skincare/products/the-ordinary-multi-peptide-copper/",
        "/skincare/products/cosrx-six-peptide-skin-booster-mini/",
      ].sort(),
    );
    expect(
      results.filter((entry) => entry.category === "Comparisons"),
      query,
    ).toHaveLength(3);
    expect(
      results.some(
        (entry) =>
          entry.category === "Sources" &&
          entry.href === "/sources/#source-cir-peptides",
      ),
      query,
    ).toBe(true);
    expect(
      results
        .filter((entry) => entry.category === "Products")
        .every((entry) =>
          entry.matchReason?.startsWith("Recorded label lists"),
        ),
    ).toBe(true);
    expect(
      results.find((entry) => entry.href.includes("niod-cais3/")),
    ).toBeUndefined();
  }
});

it("requires discriminating terms and makes unambiguous spelling suggestions visible", () => {
  const copper = searchEntries(searchIndex, "copper peptides");
  expect(copper.length).toBeGreaterThan(0);
  expect(copper.length).toBeLessThan(25);
  expect(
    copper.some(
      (entry) =>
        entry.href ===
        "/skincare/products/the-ordinary-argireline-solution-10/",
    ),
  ).toBe(false);
  const typo = searchEntries(searchIndex, "coper peptides");
  expect(typo.map((entry) => entry.href)).toEqual(
    copper.map((entry) => entry.href),
  );
  expect(
    typo.every((entry) => entry.matchReason?.includes("coper → copper")),
  ).toBe(true);
  expect(
    searchEntries(searchIndex, "What does 10% peptide mean?")[0].href,
  ).toBe("/skincare/guides/peptide-percentages-explained/");
  expect(
    searchEntries(searchIndex, "GHK").some((entry) =>
      entry.matchReason?.startsWith("Ingredient identity:"),
    ),
  ).toBe(false);
});

// A small, versioned relevance corpus. These expectations test real routes,
// negative cases and identity separation rather than merely nonempty results.
const corpus: [string, string | null][] = [
  ["GHK-Cu", "/skincare/ingredients/copper-tripeptide-1/"],
  ["GHKCu", "/skincare/ingredients/copper-tripeptide-1/"],
  ["What is GHK-Cu?", "/skincare/ingredients/copper-tripeptide-1/"],
  ["Copper Tripeptide-1", "/skincare/ingredients/copper-tripeptide-1/"],
  ["Acetyl Hexapeptide-8", "/skincare/ingredients/acetyl-hexapeptide-8/"],
  ["Palmitoyl Tripeptide-1", "/skincare/ingredients/palmitoyl-tripeptide-1/"],
  [
    "Palmitoyl Tetrapeptide-7",
    "/skincare/ingredients/palmitoyl-tetrapeptide-7/",
  ],
  [
    "Tripeptide-1 Copper Acetate",
    "/skincare/ingredients/tripeptide-1-copper-acetate/",
  ],
  ["Carnosine", "/skincare/ingredients/carnosine/"],
  ["Acetyl Tetrapeptide-5", "/skincare/ingredients/acetyl-tetrapeptide-5/"],
  ["Biotinoyl Tripeptide-1", "/haircare/ingredients/biotinoyl-tripeptide-1/"],
  ["Acetyl Tetrapeptide-3", "/haircare/ingredients/acetyl-tetrapeptide-3/"],
  ["NIOD", "/skincare/products/niod-cais3/"],
  ["Argireline", "/skincare/products/the-ordinary-argireline-solution-10/"],
  ["COSRX", "/skincare/products/cosrx-six-peptide-skin-booster-mini/"],
  ["Naturium", "/skincare/products/naturium-multi-peptide-advanced-serum/"],
  ["Medik8", "/skincare/products/medik8-liquid-peptides/"],
  ["Power Peptides", "/skincare/products/geek-and-gorgeous-power-peptides/"],
  ["Hair Density", "/haircare/products/the-ordinary-hair-density/"],
  [
    "What does peptide complex 10% mean?",
    "/skincare/guides/peptide-percentages-explained/",
  ],
  [
    "What does 10% peptide mean?",
    "/skincare/guides/peptide-percentages-explained/",
  ],
  ["Retatrutide", "/library/retatrutide/"],
  ["BPC-157", "/library/bpc-157/"],
  ["Our methodology", "/methodology/"],
  ["Peptide categories", "/library/peptide-categories/"],
  ["Matrixyl 3000", "/skincare/guides/matrixyl-3000-vs-synthe6/"],
  ["zzzzzzzzzzz", null],
  ["unknownmanufacturer987", null],
  ["zzzz copper peptides", null],
  ["qwerty serum", null],
  ["", null],
  ["what is the", null],
];
for (const [query, href] of corpus)
  it(`retrieves the expected documented scope: ${query || "empty"}`, () => {
    const results = searchEntries(searchIndex, query);
    if (href) expect(results.some((entry) => entry.href === href)).toBe(true);
    else expect(results).toEqual([]);
  });

it("links every source result to an existing unique source anchor", () => {
  const sources = searchIndex.filter((entry) => entry.category === "Sources");
  expect(sources).toHaveLength(catalog.sources.length);
  for (const entry of sources)
    expect(
      catalog.sources.some(
        (source) => entry.href === `/sources/#source-${source.id}`,
      ),
    ).toBe(true);
});
it("balances categories while preserving relevance within each group", () => {
  const results = searchEntries(searchIndex, "peptide");
  const suggestions = groupedSuggestions(results);
  for (const category of searchCategories) {
    const group = suggestions.filter((r) => r.category === category);
    expect(group).toEqual(
      results.filter((r) => r.category === category).slice(0, group.length),
    );
    expect(group.length).toBeGreaterThanOrEqual(1);
    expect(group.length).toBeLessThanOrEqual(2);
  }
  expect(suggestions.length).toBeLessThanOrEqual(7);
  expect(new Set(searchIndex.map((r) => r.href)).size).toBe(searchIndex.length);
});
