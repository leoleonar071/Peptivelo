import "server-only";
import raw from "@/data/catalog.json";
import { catalogSchema } from "./catalog-schema";
import { catalogSelectors } from "./catalog-selectors";
export type { EditorialComparison, Product, Ingredient } from "./catalog-schema";

export const catalog = catalogSchema.parse(raw);
for (const p of catalog.products) {
  if (
    !catalog.brands.some((b) => b.id === p.brandId) ||
    !catalog.sources.some((s) => s.id === p.sourceId) ||
    p.ingredientIds.some((id) => !catalog.ingredients.some((i) => i.id === id))
  )
    throw new Error(`Invalid references: ${p.id}`);
}
for (const group of [
  catalog.products,
  catalog.ingredients,
  catalog.sources,
  catalog.brands,
  catalog.retailers,
  catalog.prices,
  catalog.comparisons,
]) {
  if (new Set(group.map((record) => record.id)).size !== group.length)
    throw new Error("Duplicate catalog ID");
}
for (const ingredient of catalog.ingredients)
  if (
    [
      ...ingredient.sourceIds,
      ...[
        ingredient.education.whatItIs,
        ingredient.education.purpose,
        ingredient.education.evidence,
        ingredient.education.precautions,
      ].flatMap((section) => section.sourceIds),
    ].some((id) => !catalog.sources.some((s) => s.id === id))
  )
    throw new Error("Invalid ingredient source");
for (const p of catalog.prices)
  if (
    !catalog.products.some((x) => x.id === p.productId) ||
    !catalog.retailers.some((x) => x.id === p.retailerId) ||
    !catalog.sources.some((x) => x.id === p.sourceId)
  )
    throw new Error("Invalid price reference");
for (const c of catalog.comparisons)
  if (
    c.comparedProductIds.some(
      (id) => !catalog.products.some((p) => p.id === id),
    ) ||
    [
      ...c.sourceIds,
      ...c.questions.flatMap((q) => q.sourceIds),
      ...c.practicalDifferences.flatMap((n) => n.sourceIds ?? []),
      ...c.decisionNotes.flatMap((n) => n.sourceIds ?? []),
      ...(c.researchContext?.sourceIds ?? []),
    ].some((id) => !catalog.sources.some((s) => s.id === id))
  )
    throw new Error("Invalid comparison reference");
export const { ingredientForName, products, brandName, priceFor, sourceFor } = catalogSelectors(catalog);
