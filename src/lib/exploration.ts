import { catalog, products, brandName, priceFor } from "./data";
import { haircare } from "./haircare";
import { libraryArticles } from "./library";
import { guides } from "./guides";
import { evidence } from "./citations";
import { normalize } from "./math";
import { compatible } from "./exploration-navigation";

export type SourceLink = {
  id: string;
  title: string;
  href: string;
  kind: string;
  date: string;
};
export type ExplorationProduct = {
  id: string;
  name: string;
  href: string;
  context: "skin" | "hair";
  category: string;
  ingredientIds: string[];
  size: string;
  price: number | null;
  perMl: number | null;
  date: string | null;
  reason: string;
  shared: number;
  group: "same" | "other";
};
export type Exploration = {
  id: string;
  name: string;
  context: "skin" | "hair" | "health";
  kind: "ingredient" | "product" | "research";
  aliases: string[];
  href: string;
  summary: string;
  status: string;
  blocks: { title: string; text: string; sources: SourceLink[] }[];
  evidence: {
    title: string;
    kind: string;
    text: string;
    limit: string;
    sources: SourceLink[];
  }[];
  related: { title: string; href: string }[];
  products: ExplorationProduct[];
  reference: ExplorationProduct | null;
  canCompare: boolean;
};
export type ExplorationState = {
  q: string;
  entity: string;
  tab: "overview" | "compare" | "evidence";
  group: "same" | "other";
  sort: "related" | "low" | "high";
  page: number;
  a: string;
  b: string;
};
export type QueryParams = Record<string, string | string[] | undefined>;
export const queryValue = (params: QueryParams, key: string) =>
  typeof params[key] === "string" ? (params[key] as string) : "";
const identity = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
const sources = (ids: string[]): SourceLink[] =>
  [...new Set(ids)].flatMap((id) => {
    const source = catalog.sources.find((s) => s.id === id);
    const record = evidence.find((e) => e.sourceId === id);
    return source
      ? [
          {
            id,
            title: source.title,
            href: `/sources/#source-${id}`,
            kind: record?.kind ?? source.sourceType,
            date: source.accessedAt,
          },
        ]
      : [];
  });
const skinProducts: ExplorationProduct[] = products.map((p) => {
  const price = priceFor(p);
  return {
    id: p.id,
    name: `${brandName(p)} ${p.name}`,
    href: `/skincare/products/${p.slug}/`,
    context: "skin",
    // This collection contains facial serums; p.category describes texture/format,
    // not a compatibility boundary (e.g. milky versus water-based serum).
    category: "facial-serum",
    ingredientIds: p.ingredientIds,
    size: `${p.volume} ${p.volumeUnit === "ml" ? "mL" : "US fl oz"}`,
    price: price?.price ?? null,
    perMl: price
      ? (normalize(price.price, p.volume, p.volumeUnit)?.perMl ?? null)
      : null,
    date: price?.observedAt ?? null,
    reason: "",
    shared: 0,
    group: "same",
  };
});
const hairProduct: ExplorationProduct = {
  id: haircare.product.id,
  name: `${haircare.product.brand} ${haircare.product.name}`,
  href: `/haircare/products/${haircare.product.slug}/`,
  context: "hair",
  category: "scalp-serum",
  ingredientIds: haircare.ingredients.map((i) => i.slug),
  size: `${haircare.product.volumeMl} mL`,
  price: haircare.product.priceUsd,
  perMl: haircare.product.priceUsd / haircare.product.volumeMl,
  date: haircare.product.checkedAt,
  reason: "Recorded scalp-serum label",
  shared: 0,
  group: "same",
};
const pairExists = (a: string, b: string) =>
  catalog.comparisons.some(
    (c) => c.comparedProductIds.includes(a) && c.comparedProductIds.includes(b),
  );
function finish(
  model: Omit<Exploration, "canCompare" | "products" | "related">,
  ingredientIds: string[],
): Exploration {
  const pool =
    model.context === "skin"
      ? skinProducts
      : model.context === "hair"
        ? [hairProduct]
        : [];
  const seed = pool.filter((p) =>
    ingredientIds.some((id) => p.ingredientIds.includes(id)),
  );
  const candidates = pool
    .filter((p) => p.id !== model.reference?.id)
    .flatMap((p) => {
      if (model.reference && !compatible(model.reference, p)) return [];
      const sharedIds = p.ingredientIds.filter((id) =>
        ingredientIds.includes(id),
      );
      const paired = (model.reference ? [model.reference] : seed).find(
        (s) => compatible(s, p) && pairExists(s.id, p.id),
      );
      if (!sharedIds.length && !paired) return [];
      const names = sharedIds.map(
        (id) =>
          catalog.ingredients.find((i) => i.id === id)?.inciName ??
          haircare.ingredients.find((i) => i.slug === id)?.name ??
          id,
      );
      return [
        {
          ...p,
          shared: sharedIds.length,
          group: sharedIds.length ? ("same" as const) : ("other" as const),
          reason: sharedIds.length
            ? `Recorded label lists ${names.slice(0, 2).join(", ")}${names.length > 2 ? ` and ${names.length - 2} other shared peptide ${names.length === 3 ? "name" : "names"}` : ""}.`
            : `Compared with ${paired!.name} in an editorial draft; a different formula, not established as equivalent.`,
        },
      ];
    });
  const available = model.reference
    ? [model.reference, ...candidates]
    : candidates;
  const canCompare = available.some((a) =>
    available.some((b) => compatible(a, b)),
  );
  const relevantIds = new Set([
    ...seed.map((p) => p.id),
    ...(model.reference ? [model.reference.id] : []),
  ]);
  const related = guides
    .filter((g) => g.productIds.some((id) => relevantIds.has(id)))
    .map((g) => ({ title: g.title, href: `/skincare/guides/${g.slug}/` }))
    .slice(0, 2);
  return { ...model, products: candidates, related, canCompare };
}
export function getExploration(id: string): Exploration | null {
  const ingredient = catalog.ingredients.find(
    (i) => id === `skin:ingredient:${i.id}` && i.status === "published",
  );
  if (ingredient) {
    const e = ingredient.education;
    return finish(
      {
        id,
        name: ingredient.inciName,
        aliases: [
          ingredient.name,
          ...(ingredient.id === "copper-tripeptide-1"
            ? ["GHK-Cu", "GHKCu"]
            : []),
        ],
        context: "skin",
        kind: "ingredient",
        href: `/skincare/ingredients/${ingredient.slug}/`,
        summary: e.summary,
        status: e.scientificReviewPending
          ? "Scientific review pending"
          : "Label profile",
        reference: null,
        blocks: [
          {
            title: "What it is",
            text: e.whatItIs.text,
            sources: sources(e.whatItIs.sourceIds),
          },
          {
            title: "Purpose & limits",
            text: e.purpose.text,
            sources: sources(e.purpose.sourceIds),
          },
          {
            title: "Keep in mind",
            text: ingredient.knownLimitations,
            sources: sources(ingredient.sourceIds),
          },
        ],
        evidence: [
          {
            title: "What the evidence covers",
            kind: e.evidence.label,
            text: e.evidence.text,
            limit: e.takeaway,
            sources: sources(e.evidence.sourceIds),
          },
          {
            title: "Precautions & uncertainty",
            kind: "Source context",
            text: e.precautions.text,
            limit: ingredient.knownLimitations,
            sources: sources(e.precautions.sourceIds),
          },
        ],
      },
      [ingredient.id],
    );
  }
  const product = products.find((p) => id === `skin:product:${p.id}`);
  if (product) {
    const comparisons = catalog.comparisons.filter((c) =>
      c.comparedProductIds.includes(product.id),
    );
    return finish(
      {
        id,
        name: `${brandName(product)} ${product.name}`,
        aliases: [product.name],
        context: "skin",
        kind: "product",
        href: `/skincare/products/${product.slug}/`,
        summary: product.description,
        status: "Documented label profile",
        reference: skinProducts.find((p) => p.id === product.id)!,
        blocks: [
          {
            title: "Formula context",
            text: product.formulationNotes,
            sources: sources([product.sourceId]),
          },
          {
            title: "What is disclosed",
            text: product.concentrationExplanation,
            sources: sources([product.sourceId]),
          },
        ],
        evidence: [
          {
            title: "What the label establishes",
            kind: "Manufacturer label",
            text: product.ingredientListScope,
            limit: product.concentrationDisclosure,
            sources: sources([product.sourceId]),
          },
          ...comparisons
            .filter((c) => c.researchContext)
            .map((c) => ({
              title: c.title,
              kind: "Editorial research context · Draft",
              text: c.researchContext!.text,
              limit: c.limitations,
              sources: sources(c.researchContext!.sourceIds),
            })),
        ],
      },
      product.ingredientIds,
    );
  }
  const hairIngredient = haircare.ingredients.find(
    (i) => id === `hair:ingredient:${i.slug}`,
  );
  if (hairIngredient)
    return finish(
      {
        id,
        name: hairIngredient.name,
        aliases: [],
        context: "hair",
        kind: "ingredient",
        href: `/haircare/ingredients/${hairIngredient.slug}/`,
        summary: hairIngredient.summary,
        status: "Editorial draft · Review pending",
        reference: null,
        blocks: [
          {
            title: "What the label says",
            text: hairIngredient.identity,
            sources: sources(hairIngredient.identitySourceIds),
          },
          {
            title: "Keep in mind",
            text: hairIngredient.limit,
            sources: sources(hairIngredient.evidenceSourceIds),
          },
        ],
        evidence: [
          {
            title: "Evidence context",
            kind: hairIngredient.support,
            text: hairIngredient.evidence,
            limit: hairIngredient.limit,
            sources: sources(hairIngredient.evidenceSourceIds),
          },
        ],
      },
      [hairIngredient.slug],
    );
  if (id === "hair:product")
    return finish(
      {
        id,
        name: hairProduct.name,
        aliases: [haircare.product.name],
        context: "hair",
        kind: "product",
        href: hairProduct.href,
        summary:
          "Water-based leave-in cosmetic scalp serum. Explore its documented label and related ingredient explanations.",
        status: "Editorial draft · Review pending",
        reference: hairProduct,
        blocks: [
          {
            title: "Recorded peptide names",
            text: haircare.ingredients.map((i) => i.name).join(", "),
            sources: sources([haircare.product.sourceId]),
          },
          {
            title: "Keep in mind",
            text: "Scalp products are kept separate from facial-serum comparisons. Human editorial and scientific review remain pending.",
            sources: sources([haircare.product.sourceId]),
          },
        ],
        evidence: haircare.ingredients.map((i) => ({
          title: i.name,
          kind: i.support,
          text: i.evidence,
          limit: i.limit,
          sources: sources(i.evidenceSourceIds),
        })),
      },
      hairProduct.ingredientIds,
    );
  const article = libraryArticles.find(
    (a) => id === `health:${a.slug}` && a.category === "Research brief",
  );
  if (article)
    return finish(
      {
        id,
        name: article.slug === "bpc-157" ? "BPC-157" : "Retatrutide",
        aliases: [article.title],
        context: "health",
        kind: "research",
        href: `/library/${article.slug}/`,
        summary: article.description,
        status: "Editorial draft · Scientific review pending",
        reference: null,
        blocks: [
          {
            title: "The short answer",
            text: article.answer,
            sources: sources(article.answerSources),
          },
        ],
        evidence: article.sections.map((s) => ({
          title: s.title,
          kind: sources(s.sourceIds)
            .map((s) => s.kind)
            .join(" · "),
          text: s.text,
          limit: article.takeaway,
          sources: sources(s.sourceIds),
        })),
      },
      [],
    );
  return null;
}
export function resolveExploration(params: QueryParams) {
  const selected = queryValue(params, "entity");
  if (selected) return getExploration(selected);
  const q = identity(queryValue(params, "q").slice(0, 200));
  if (!q) return null;
  const ids = [
    ...catalog.ingredients
      .filter((i) => i.status === "published")
      .map((i) => `skin:ingredient:${i.id}`),
    ...products.map((p) => `skin:product:${p.id}`),
    ...haircare.ingredients.map((i) => `hair:ingredient:${i.slug}`),
    "hair:product",
    ...libraryArticles
      .filter((a) => a.category === "Research brief")
      .map((a) => `health:${a.slug}`),
  ];
  const matches = ids
    .map(getExploration)
    .filter(
      (e): e is Exploration =>
        !!e && [e.name, ...e.aliases].some((alias) => identity(alias) === q),
    );
  return matches.length === 1 ? matches[0] : null;
}
export { explorationState, sortedAlternatives } from "./exploration-navigation";
