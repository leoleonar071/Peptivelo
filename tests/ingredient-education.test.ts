import { expect, it } from "vitest";
import { catalog, ingredientForName, products } from "../src/lib/data";

it("provides an exact-name, sourced explanation for every compared ingredient", () => {
  for (const product of products)
    for (const name of product.ingredientList) {
      const ingredient = ingredientForName(name);
      expect(ingredient, name).toBeDefined();
      expect(ingredient!.inciName).toBe(name);
      expect(product.ingredientIds).toContain(ingredient!.id);
      for (const section of [
        ingredient!.education.whatItIs,
        ingredient!.education.purpose,
        ingredient!.education.evidence,
        ingredient!.education.precautions,
      ]) {
        expect(section.sourceIds.length).toBeGreaterThan(0);
        for (const sourceId of section.sourceIds)
          expect(catalog.sources.some((source) => source.id === sourceId)).toBe(
            true,
          );
      }
    }
});

it("does not merge copper forms or invent a guide for an unknown name", () => {
  expect(ingredientForName("Copper Tripeptide-1")?.id).not.toBe(
    ingredientForName("Tripeptide-1 Copper Acetate")?.id,
  );
  expect(ingredientForName("Unknown Peptide-999")).toBeUndefined();
});

it("separates human ingredient research from supplier and label descriptions", () => {
  expect(
    ingredientForName("Acetyl Hexapeptide-8")!.education.evidence.label,
  ).toBe("Ingredient study");
  expect(
    ingredientForName("Palmitoyl Tripeptide-1")!.education.evidence.label,
  ).toBe("Supplier description");
  expect(ingredientForName("Tripeptide-29")!.education.evidence.label).toBe(
    "Label information",
  );
  expect(
    ingredientForName("Acetyl Hexapeptide-8")!.education.evidence.text,
  ).toMatch(/60.*participants/);
});
