import type { MetadataRoute } from "next";
import { site, comparisonPath } from "@/lib/config";
import { products, catalog } from "@/lib/data";
import { guides } from "@/lib/guides";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
  return [
    "",
    "skincare",
    "skincare/products",
    "skincare/ingredients",
    "tools/price-per-ml",
    "methodology",
    "about",
    "editorial-policy",
    "sources",
    "affiliate-disclosure",
    "privacy",
    "terms",
    "contact",
    ...products.map((p) => `skincare/products/${p.slug}`),
    ...catalog.ingredients
      .filter((i) => i.status === "published" && !i.education.scientificReviewPending)
      .map((i) => `skincare/ingredients/${i.slug}`),
    ...catalog.comparisons
      .filter((c) => c.publicationStatus === "published")
      .map((c) => comparisonPath(c.slug).slice(1, -1)),
    ...(guides.some((g) => g.status === "published")
      ? ["skincare/guides"]
      : []),
    ...guides
      .filter((g) => g.status === "published")
      .map((g) => `skincare/guides/${g.slug}`),
  ].map((path) => ({ url: `${site.url}/${path}${path ? "/" : ""}` }));
}
