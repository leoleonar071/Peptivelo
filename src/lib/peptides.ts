import "server-only";
import { peptideRecords } from "./peptide-records";
import { catalog } from "./data";
import { haircare } from "./haircare";
import { guides } from "./guides";
import { ingredientPath, productPath, comparisonPath } from "./config";

export const peptides = peptideRecords;
const unique = (values: string[]) => new Set(values).size === values.length;
if (
  !unique(peptides.map((p) => p.id)) ||
  !unique(peptides.map((p) => p.slug)) ||
  !unique(peptides.map((p) => p.canonicalPath))
)
  throw new Error("Duplicate peptide identity or canonical path");
for (const p of peptides) {
  if (
    p.ingredientIds.some(
      (id) => !catalog.ingredients.some((i) => i.id === id),
    ) ||
    p.productIds.some(
      (id) =>
        !catalog.products.some((product) => product.id === id) &&
        haircare.product.id !== id,
    ) ||
    p.comparisonIds.some(
      (id) => !catalog.comparisons.some((c) => c.id === id),
    ) ||
    p.guideIds.some((slug) => !guides.some((g) => g.slug === slug)) ||
    p.relatedPeptideIds.some(
      (id) => !peptides.some((other) => other.id === id && other.id !== p.id),
    )
  )
    throw new Error(`Unknown peptide relationship: ${p.id}`);
  if (!p.existingDocumentId && p.canonicalPath !== `/peptides/${p.slug}/`)
    throw new Error(`New peptide must use its canonical route: ${p.id}`);
}
export const peptideForSlug = (slug: string) =>
  peptides.find((p) => p.slug === slug);
// Existing ingredient/product label relations remain the authority. This adds
// many-to-many peptide associations without rewriting product or INCI records.
export function peptideLinks(p: (typeof peptides)[number]) {
  const productIds = new Set([
    ...p.productIds,
    ...catalog.products
      .filter((product) =>
        product.ingredientIds.some((id) => p.ingredientIds.includes(id)),
      )
      .map((product) => product.id),
  ]);
  return {
    products: catalog.products
      .filter((product) => productIds.has(product.id))
      .map((product) => ({
        title: product.name,
        href: productPath(product.slug),
      })),
    comparisons: catalog.comparisons
      .filter(
        (c) =>
          p.comparisonIds.includes(c.id) ||
          c.comparedProductIds.some((id) => productIds.has(id)),
      )
      .map((c) => ({ title: c.title, href: comparisonPath(c.slug) })),
    ingredients: catalog.ingredients
      .filter((i) => p.ingredientIds.includes(i.id))
      .map((i) => ({ title: i.name, href: ingredientPath(i.slug) })),
    guides: guides
      .filter((g) => p.guideIds.includes(g.slug))
      .map((g) => ({ title: g.title, href: `/skincare/guides/${g.slug}/` })),
    peptides: peptides
      .filter((other) => p.relatedPeptideIds.includes(other.id))
      .map((other) => ({ title: other.name, href: other.canonicalPath })),
  };
}
