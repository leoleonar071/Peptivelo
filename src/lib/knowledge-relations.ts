import { catalog, products, brandName } from "./data";
import { guides } from "./guides";
import { haircare, hairIngredientPath, hairProductPath } from "./haircare";
import { ingredientPath, productPath, comparisonPath } from "./config";
import { isVisiblePath } from "./publication-registry";

export type KnowledgeRelation = { href: string; title: string; reason: string };
export function knowledgeRelations(href: string): KnowledgeRelation[] {
  const path = href.split(/[?#]/)[0];
  const ingredient = catalog.ingredients.find(
    (item) => ingredientPath(item.slug) === path,
  );
  const product = products.find((item) => productPath(item.slug) === path);
  let related: KnowledgeRelation[] = [];
  if (ingredient)
    related = products
      .filter((p) => p.ingredientIds.includes(ingredient.id))
      .map((p) => ({
        href: productPath(p.slug),
        title: `${brandName(p)} ${p.name}`,
        reason: `Recorded selected label lists ${ingredient.inciName}. This is not an efficacy comparison.`,
      }));
  if (product)
    related = product.ingredientIds.map((id) => {
      const item = catalog.ingredients.find((i) => i.id === id)!;
      return {
        href: ingredientPath(item.slug),
        title: item.name,
        reason: "Listed among this product’s recorded selected ingredients.",
      };
    });
  if (ingredient || product)
    related.push(
      ...guides
        .filter((guide) =>
          guide.productIds.some((id) => {
            const p = products.find((p) => p.id === id);
            return product
              ? id === product.id
              : !!p?.ingredientIds.includes(ingredient!.id);
          }),
        )
        .map((guide) => ({
          href: `/skincare/guides/${guide.slug}/`,
          title: guide.title,
          reason: product
            ? "This guide explicitly discusses this product."
            : "This guide links a product whose selected label lists this ingredient; inspect the guide’s scope.",
        })),
    );
  if (product)
    related.push(
      ...catalog.comparisons
        .filter((c) => c.comparedProductIds.includes(product.id))
        .map((c) => ({
          href: comparisonPath(c.slug),
          title: c.title,
          reason: "An editorial comparison explicitly includes this product.",
        })),
    );
  if (path === hairProductPath)
    related = haircare.ingredients.map((i) => ({
      href: hairIngredientPath(i.slug),
      title: i.name,
      reason: "Recorded on this scalp product’s selected label.",
    }));
  if (haircare.ingredients.some((i) => hairIngredientPath(i.slug) === path))
    related = [
      {
        href: hairProductPath,
        title: haircare.product.name,
        reason:
          "This scalp product’s recorded selected label includes this ingredient.",
      },
    ];
  const seen = new Set<string>();
  return related.filter(
    (item) =>
      item.href !== path &&
      isVisiblePath(item.href) &&
      !seen.has(item.href) &&
      !!seen.add(item.href),
  );
}
