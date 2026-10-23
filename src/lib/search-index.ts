import { activeTopics } from "./topic-registry";
import { comparisonPath } from "@/lib/config";
import { products, catalog, brandName } from "./data";
import { guides } from "./guides";
import { libraryArticles } from "./library";
import { haircare } from "./haircare";
import { ingredientPath, productPath } from "./config";
import { ingredientAliases, type SearchEntry } from "./search";
// Extend with real routes and sources as collections grow.
export const searchIndex: SearchEntry[] = [
  {
    name: "Compare",
    href: comparisonPath(),
    detail:
      "Explore documented differences. Currently available: facial skincare products.",
    terms: "compare comparison tool products labels prices sources",
    category: "Comparisons",
  },
  ...[
    {
      name: "Explore topics",
      href: "/topics/",
      detail: "Browse skin, hair and selected health research.",
      terms: "topics areas explore",
    },
    {
      name: "Peptides A–Z",
      href: "/peptides/",
      detail: "Alphabetical ingredient profiles and research briefs.",
      terms: "directory peptides ingredients alphabetical",
    },
    {
      name: "Learn",
      href: "/learn/",
      detail: "Peptide basics and cosmetic label guides.",
      terms: "learn beginner basics introduction labels",
    },
    ...activeTopics
      .filter((topic) => topic.href.startsWith("/topics/"))
      .map((topic) => ({
        name: topic.title,
        href: topic.href,
        detail: topic.description,
        terms:
          topic.id === "health"
            ? "health research studies"
            : `${topic.title} ${topic.description}`,
      })),
  ].map((entry): SearchEntry => ({ ...entry, category: "Guides & articles" })),
  ...catalog.ingredients
    .filter((i) => i.status === "published")
    .map((i): SearchEntry => ({
      name: i.name,
      detail: i.education.summary,
      category: "Peptides & ingredients",
      terms: `${i.inciName} ${i.description} ${i.inciName === "Copper Tripeptide-1" ? "GHK-Cu copper peptides" : ""}`,
      href: ingredientPath(i.slug),
      entity: { id: `skin:ingredient:${i.id}`, context: "skin" },
      identity: {
        id: i.id,
        name: i.inciName,
        aliases: ingredientAliases[i.id] ?? [],
      },
    })),
  ...haircare.ingredients.map((i): SearchEntry => ({
    name: i.name,
    detail: `${i.summary} · Hair & scalp`,
    terms: i.identity,
    href: `/haircare/ingredients/${i.slug}/`,
    entity: { id: `hair:ingredient:${i.slug}`, context: "hair" },
    category: "Peptides & ingredients",
    identity: { id: `haircare:${i.slug}`, name: i.name, aliases: [] },
  })),
  ...products.map((p): SearchEntry => ({
    name: p.name,
    detail: `${brandName(p)} · ${p.volume} ${p.volumeUnit === "ml" ? "mL" : "fl oz"} · US label profile`,
    terms: `${brandName(p)} ${p.ingredientList.join(" ")} ${p.description} serum ingredients label`,
    href: productPath(p.slug),
    entity: { id: `skin:product:${p.id}`, context: "skin" },
    category: "Products",
    relations: p.ingredientIds.map((entityId) => ({
      entityId,
      reason: `Recorded label lists ${catalog.ingredients.find((item) => item.id === entityId)!.inciName}`,
    })),
  })),
  {
    name: haircare.product.name,
    detail: `${haircare.product.brand} · Hair & scalp · Draft profile`,
    terms: "hair scalp serum density",
    href: `/haircare/products/${haircare.product.slug}/`,
    entity: { id: "hair:product", context: "hair" },
    category: "Products",
    relations: haircare.ingredients.map((item) => ({
      entityId: `haircare:${item.slug}`,
      reason: `Scalp product label lists ${item.name}`,
    })),
  },
  ...guides.map((g): SearchEntry => ({
    name: g.title,
    detail: `${g.description}${g.status === "draft" ? " · Draft" : ""}`,
    terms: `${g.answer} ${g.scope} ${g.questions.map((q) => q.question).join(" ")} ${g.sections.flatMap((section) => section.paragraphs.map((paragraph) => paragraph.text)).join(" ")}`,
    href: `/skincare/guides/${g.slug}/`,
    category: "Guides & articles",
    relations: [
      ...new Set(
        g.productIds.flatMap(
          (id) => products.find((item) => item.id === id)?.ingredientIds ?? [],
        ),
      ),
    ].map((entityId) => ({
      entityId,
      reason: `Guide links to a product listing ${catalog.ingredients.find((item) => item.id === entityId)!.inciName}; inspect its scope`,
    })),
  })),
  ...libraryArticles.map((a): SearchEntry => ({
    name: a.title,
    detail: `${a.description} · Draft research context`,
    terms: `${a.slug} ${a.category} ${a.answer} ${a.sections.map((s) => s.title).join(" ")}`,
    href: `/library/${a.slug}/`,
    entity:
      a.category === "Research brief"
        ? { id: `health:${a.slug}`, context: "health" }
        : undefined,
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
    href: comparisonPath(c.slug),
    category: "Comparisons",
    relations: [
      ...new Set(
        c.comparedProductIds.flatMap(
          (id) => products.find((item) => item.id === id)?.ingredientIds ?? [],
        ),
      ),
    ].map((entityId) => ({
      entityId,
      reason: `Includes a product listing ${catalog.ingredients.find((item) => item.id === entityId)!.inciName}; not an ingredient-equivalence claim`,
    })),
  })),
  ...catalog.sources.map((source): SearchEntry => ({
    name: source.title,
    detail: `${source.publisher} · ${source.sourceType === "research" ? "Research reference" : source.sourceType === "regulator" ? "Regulatory guidance" : "Manufacturer / supplier source"} · Checked ${source.accessedAt}`,
    terms: `${source.publisher} ${source.sourceType} ${source.sourceType === "research" ? "study research evidence" : ""}`,
    href: `/sources/#source-${source.id}`,
    category: "Sources",
    relations: catalog.ingredients
      .filter((item) => item.sourceIds.includes(source.id))
      .map((item) => ({
        entityId: item.id,
        reason: `Cited by the ${item.inciName} profile; check what this source supports`,
      })),
  })),
];
