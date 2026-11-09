import { z } from "zod";
import { catalog } from "./data";
import { haircare, hairIngredientPath, hairProductPath } from "./haircare";
import { guides } from "./guides";
import { libraryArticles } from "./library";
import { pages } from "./pages";
import { activeTopics } from "./topic-registry";
import { site, ingredientPath, productPath, comparisonPath } from "./config";
import { evidence } from "./citations";
import { evaluationFor } from "./evaluations";
import { studyDataFor } from "./study-data";
import { offers } from "./offers";
import { publicPeptides as peptides } from "./public-peptides";
import legacyPublicPaths from "../data/publication-baseline.json";
import rawReviews from "../data/publication-reviews.json";
import rawResearch from "../data/research-records.json";
import rawExtractions from "../data/study-extractions.json";
import learningBasics from "../data/learning-basics.json";
import {
  contentRevision,
  publicationDecision,
  type PublicationDocument,
} from "./publication-policy";

const reviews = z
  .array(
    z.object({
      documentId: z.string().min(1),
      revision: z.string().min(1),
      kind: z.enum(["editorial", "scientific"]),
      // Non-personal IDs only. Actual identities/qualifications are held by the
      // owner; this registry can be bundled into discovery controls.
      reviewerId: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
      reviewedAt: z.iso.date(),
    }),
  )
  .parse(rawReviews);

function sourceDependencies(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(sourceDependencies);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => {
    if (key === "sourceId" && typeof item === "string") return [item];
    if (/sourceIds$/i.test(key) && Array.isArray(item))
      return item.filter((id): id is string => typeof id === "string");
    return sourceDependencies(item);
  });
}
function adapt(
  input: Omit<PublicationDocument, "revision">,
  record: unknown,
): PublicationDocument {
  const ids = new Set([...input.sourceIds, ...sourceDependencies(record)]);
  return {
    ...input,
    sourceIds: [...ids],
    revision: contentRevision({
      presentationVersion: 2,
      metadata: input,
      record,
      research: rawResearch.filter((entry) => entry.documentId === input.id),
      extractions: rawExtractions.filter((entry) => ids.has(entry.sourceId)),
      ...(input.href === "/learn/" ? { learningBasics } : {}),
      sources: catalog.sources.filter((source) => ids.has(source.id)),
      evidence: evidence.filter((note) => ids.has(note.sourceId)),
    }),
  };
}
const documents: PublicationDocument[] = [
  ...peptides
    .filter((p) => !p.existingDocumentId)
    .map((p) => {
      const sourceIds = p.sources.map((source) => source.id);
      return {
        id: p.id,
        href: p.canonicalPath,
        topic: p.primaryTopicId,
        status: p.status,
        sourceIds,
        checkedAt: p.updatedAt ?? undefined,
        requiresScientificReview: true,
        requireApprovalForVisibility: true,
        revision: contentRevision(p),
      } satisfies PublicationDocument;
    }),
  ...catalog.products.map((p) =>
    adapt(
      {
        id: `product:${p.id}`,
        href: productPath(p.slug),
        topic: "skin",
        status: p.editorialStatus,
        sourceIds: [
          ...new Set([
            p.sourceId,
            ...catalog.prices
              .filter((price) => price.productId === p.id)
              .map((price) => price.sourceId),
          ]),
        ],
        checkedAt: p.lastVerifiedAt,
        requiresScientificReview: false,
      },
      {
        product: p,
        brand: catalog.brands.find((brand) => brand.id === p.brandId),
        prices: catalog.prices.filter((price) => price.productId === p.id),
        offers: offers.filter((offer) => offer.productId === p.id),
      },
    ),
  ),
  ...catalog.ingredients.map((i) =>
    adapt(
      {
        id: `skin:${i.id}`,
        href: ingredientPath(i.slug),
        topic: "skin",
        status: i.status,
        sourceIds: [
          ...new Set([
            ...i.sourceIds,
            ...i.education.whatItIs.sourceIds,
            ...i.education.purpose.sourceIds,
            ...i.education.evidence.sourceIds,
            ...i.education.precautions.sourceIds,
          ]),
        ],
        checkedAt: i.education.sourceCheckedAt,
        requiresScientificReview: true,
      },
      i,
    ),
  ),
  ...guides.map((g) =>
    adapt(
      {
        id: `guide:${g.slug}`,
        href: `/skincare/guides/${g.slug}/`,
        topic: "skin",
        status: g.status,
        sourceIds: g.sourceIds,
        checkedAt: g.updatedAt,
        requiresScientificReview: true,
      },
      {
        guide: g,
        products: catalog.products.filter((p) => g.productIds.includes(p.id)),
        comparisons: catalog.comparisons.filter((c) =>
          g.comparisonIds.includes(c.id),
        ),
      },
    ),
  ),
  ...catalog.comparisons.map((c) =>
    adapt(
      {
        id: `comparison:${c.id}`,
        href: comparisonPath(c.slug),
        topic: "skin",
        status: c.publicationStatus,
        sourceIds: c.sourceIds,
        checkedAt: c.updatedAt,
        requiresScientificReview: true,
      },
      {
        comparison: c,
        products: catalog.products.filter((p) =>
          c.comparedProductIds.includes(p.id),
        ),
        prices: catalog.prices.filter((price) =>
          c.comparedProductIds.includes(price.productId),
        ),
        ingredients: catalog.ingredients.filter((ingredient) =>
          catalog.products.some(
            (p) =>
              c.comparedProductIds.includes(p.id) &&
              p.ingredientIds.includes(ingredient.id),
          ),
        ),
        evaluation: evaluationFor(c.id),
        studyData: studyDataFor(c.id),
      },
    ),
  ),
  ...libraryArticles.map((a) =>
    adapt(
      {
        id: `library:${a.slug}`,
        href: `/library/${a.slug}/`,
        topic: a.category === "Start here" ? null : "health",
        status: a.status,
        sourceIds: [
          ...new Set([
            ...a.answerSources,
            ...a.sections.flatMap((s) => s.sourceIds),
          ]),
        ],
        requiresScientificReview: true,
      },
      a,
    ),
  ),
  adapt(
    {
      id: "hair:product",
      href: hairProductPath,
      topic: "hair",
      status: haircare.product.status,
      sourceIds: [
        haircare.product.sourceId,
        ...haircare.ingredients.flatMap((i) => i.evidenceSourceIds),
      ],
      checkedAt: haircare.product.checkedAt,
      requiresScientificReview: true,
    },
    haircare,
  ),
  ...haircare.ingredients.map((i) =>
    adapt(
      {
        id: `hair:${i.slug}`,
        href: hairIngredientPath(i.slug),
        topic: "hair",
        status: i.status,
        sourceIds: [
          ...new Set([...i.identitySourceIds, ...i.evidenceSourceIds]),
        ],
        checkedAt: haircare.product.checkedAt,
        requiresScientificReview: true,
      },
      i,
    ),
  ),
];
const structuralPages = [
  { href: "/", title: "Peptivelo" },
  { href: "/peptides/", title: "Peptides A–Z" },
  { href: "/learn/", title: "Learn" },
  { href: "/topics/", title: "Topics" },
  { href: "/library/", title: "Library" },
  { href: "/compare/", title: "Compare" },
  { href: "/skincare/products/", title: "Skincare products" },
  { href: "/skincare/ingredients/", title: "Skincare ingredients" },
  { href: "/skincare/guides/", title: "Skincare guides" },
  { href: "/tools/price-per-ml/", title: "Price calculator" },
  { href: "/sources/", title: "Sources" },
  ...activeTopics.map((topic) => ({ href: topic.href, title: topic.title })),
  ...Object.entries(pages).map(([path, page]) => ({
    href: `/${path}/`,
    title: page.title,
    page,
  })),
];
const structuralDocuments = structuralPages.map((page) =>
  adapt(
    {
      id: `page:${page.href}`,
      href: page.href,
      topic: null,
      status:
        activeTopics.some((topic) => topic.href === page.href) &&
        !documents.some(
          (document) =>
            document.topic ===
              activeTopics.find((topic) => topic.href === page.href)?.id &&
            document.status === "published",
        )
          ? "draft"
          : "published",
      sourceIds: [],
      requiresScientificReview: false,
      ...(page.href === "/compare/" ? { indexing: "never" as const } : {}),
    },
    page,
  ),
);

export const publicationDocuments: readonly PublicationDocument[] = [
  ...documents,
  ...structuralDocuments,
];
if (
  new Set(publicationDocuments.map((document) => document.href)).size !==
  publicationDocuments.length
)
  throw new Error("Duplicate publication route");
for (const document of documents)
  if (
    document.sourceIds.some(
      (id) =>
        !catalog.sources.some((source) => source.id === id) &&
        !peptides
          .find((p) => p.id === document.id)
          ?.sources.some((source) => source.id === id),
    )
  )
    throw new Error(`Unknown publication source: ${document.id}`);
for (const review of reviews)
  if (
    !publicationDocuments.some(
      (document) => document.id === review.documentId,
    ) &&
    !/^peptide:[a-z0-9-]+$/.test(review.documentId)
  )
    throw new Error(`Unknown reviewed document: ${review.documentId}`);

export const documentForPath = (href: string) =>
  publicationDocuments.find(
    (document) => document.href === href.split(/[?#]/)[0],
  );
export function policyForPath(href: string, indexable = site.indexable) {
  const document = documentForPath(href);
  return document
    ? publicationDecision(document, reviews, legacyPublicPaths, indexable)
    : undefined;
}
export const isVisiblePath = (href: string) =>
  policyForPath(href)?.visible ?? false;
export const canIndexPath = (href: string) =>
  !href.includes("?") && (policyForPath(href)?.indexable ?? false);
