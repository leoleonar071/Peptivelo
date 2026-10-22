import { products, catalog, brandName } from "./data";
import { guides } from "./guides";
import { libraryArticles } from "./library";
import { haircare } from "./haircare";
import { ingredientPath, productPath } from "./config";
import type { SearchEntry } from "./search";
// Extend with real routes and sources as collections grow.
export const searchIndex: SearchEntry[] = [
  ...catalog.ingredients
    .filter((i) => i.status === "published")
    .map((i): SearchEntry => ({
      name: i.name,
      detail: i.education.summary,
      category: "Peptides & ingredients",
      terms: `${i.inciName} ${i.description} ${i.inciName === "Copper Tripeptide-1" ? "GHK-Cu copper peptides" : ""}`,
      href: ingredientPath(i.slug),
    })),
  ...haircare.ingredients.map((i): SearchEntry => ({
    name: i.name,
    detail: `${i.summary} · Hair & scalp`,
    terms: i.identity,
    href: `/haircare/ingredients/${i.slug}/`,
    category: "Peptides & ingredients",
  })),
  ...products.map((p): SearchEntry => ({
    name: p.name,
    detail: `${brandName(p)} · ${p.volume} ${p.volumeUnit === "ml" ? "mL" : "fl oz"} · US label profile`,
    terms: `${brandName(p)} ${p.ingredientList.join(" ")} ${p.description}`,
    href: productPath(p.slug),
    category: "Products",
  })),
  {
    name: haircare.product.name,
    detail: `${haircare.product.brand} · Hair & scalp · Draft profile`,
    terms: "hair scalp serum density",
    href: `/haircare/products/${haircare.product.slug}/`,
    category: "Products",
  },
  ...guides.map((g): SearchEntry => ({
    name: g.title,
    detail: `${g.description}${g.status === "draft" ? " · Draft" : ""}`,
    terms: `${g.answer} ${g.questions.map((q) => q.question).join(" ")}`,
    href: `/skincare/guides/${g.slug}/`,
    category: "Guides & articles",
  })),
  ...libraryArticles.map((a): SearchEntry => ({
    name: a.title,
    detail: `${a.description} · Draft research context`,
    terms: `${a.category} ${a.answer} ${a.sections.map((s) => s.title).join(" ")}`,
    href: `/library/${a.slug}/`,
    category: "Guides & articles",
  })),
  {
    name: "Our methodology",
    detail: "How we record sources, study limits and missing information.",
    terms: "research evidence study tested scientific limitations sources",
    href: "/methodology/",
    category: "Guides & articles",
  },
  ...catalog.comparisons.map((c): SearchEntry => ({
    name: c.title,
    detail: `${c.buyerQuestion} · Draft comparison`,
    terms: `${c.editorialSummary} ${c.comparedProductIds
      .map((id) => {
        const p = products.find((p) => p.id === id);
        return p ? `${brandName(p)} ${p.name}` : "";
      })
      .join(" ")}`,
    href: `/skincare/compare/${c.slug}/`,
    category: "Comparisons",
  })),
];
