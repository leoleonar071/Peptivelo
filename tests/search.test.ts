import { expect, it } from "vitest";
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
