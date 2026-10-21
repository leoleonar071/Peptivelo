import { it, expect } from "vitest";
import { catalog, products, priceFor } from "../src/lib/data";
import { libraryArticles, libraryCitations } from "../src/lib/library";
import { evidence } from "../src/lib/citations";

it("preserves COSRX mini identity and leaves disputed commercial information unknown", () => {
  const p = products.find((p) => p.id === "cosrx-six-mini")!;
  expect(p.volume).toBe(50);
  expect(priceFor(p)).toBeUndefined();
  expect(p.ingredientList).toHaveLength(6);
  expect(p.ingredientIds).toHaveLength(6);
  expect(evidence.find((e) => e.sourceId === "cosrx-six")?.limits).toContain(
    "unrelated sunscreen",
  );
});

it("keeps research out of cosmetic products and preserves study limits and funding", () => {
  expect(products.some((p) => /bpc|retatrutide/i.test(p.name))).toBe(false);
  for (const article of libraryArticles) {
    const citations = libraryCitations(article);
    for (const id of citations.sourceIds)
      expect(catalog.sources.some((s) => s.id === id)).toBe(true);
  }
  expect(
    evidence.find((e) => e.sourceId === "retatrutide-phase2")
      ?.commercialContext,
  ).toContain("Eli Lilly");
  expect(
    evidence.find((e) => e.sourceId === "bpc-human-pilot")?.limits,
  ).toContain("No control group");
});
