import type { Catalog, Product } from "./catalog-schema";

export function catalogSelectors(catalog: Omit<Catalog, "comparisons">) {
  const ingredientForName = (name: string) =>
    catalog.ingredients.find(
      (ingredient) =>
        ingredient.status === "published" &&
        ingredient.inciName.toLowerCase() === name.trim().toLowerCase(),
    );
  const products = catalog.products.filter(
    (p) => p.editorialStatus === "published",
  );
  const brandName = (p: Product) =>
    catalog.brands.find((b) => b.id === p.brandId)!.name;
  const priceFor = (p: Product) =>
    catalog.prices
      .filter(
        (x) =>
          x.productId === p.id &&
          x.size === p.volume &&
          x.sizeUnit === p.volumeUnit,
      )
      .sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt))[0];
  const sourceFor = (p: Product) =>
    catalog.sources.find((s) => s.id === p.sourceId)!;

  return { ingredientForName, products, brandName, priceFor, sourceFor };
}
