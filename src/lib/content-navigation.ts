import { comparisonPath } from "@/lib/config";
import { catalog, products, brandName } from "./data";
import { guides } from "./guides";
import { haircare } from "./haircare";
import { libraryArticles } from "./library";
import { type TopicId } from "./site-navigation";
import { isPublicTopicEntry } from "./content-topics";
import { publicPeptides as peptides } from "./public-peptides";
import { policyForPath } from "./publication-registry";
export type ContentEntry = {
  id: string;
  href: string;
  title: string;
  description: string;
  topic: TopicId | null;
  additionalTopics?: readonly TopicId[];
  format:
    | "Ingredient profile"
    | "Research brief"
    | "Guide"
    | "Comparison"
    | "Product profile";
  status: string;
  directory?: boolean;
  learn?: boolean;
};
// Status is derived from the source record, never maintained as a second editorial field.
const existingContent: ContentEntry[] = [
  ...peptides
    .filter((p) => !p.existingDocumentId)
    .map((p): ContentEntry => ({
      id: p.id,
      href: p.canonicalPath,
      title: p.name,
      description: p.seo.description,
      topic: p.primaryTopicId,
      additionalTopics: p.additionalTopicIds,
      format: "Ingredient profile",
      status: p.status,
      directory: true,
    })),
  ...products.map((product) => ({
    id: `product:${product.id}`,
    href: `/skincare/products/${product.slug}/`,
    title: `${brandName(product)} ${product.name}`,
    description: product.description,
    topic: "skin" as const,
    format: "Product profile" as const,
    status: product.editorialStatus,
  })),
  ...catalog.ingredients
    .filter((i) => i.status === "published")
    .map((i) => ({
      id: `skin:${i.id}`,
      href: `/skincare/ingredients/${i.slug}/`,
      title: i.name,
      description: i.education.summary,
      topic: "skin" as const,
      format: "Ingredient profile" as const,
      status: i.education.scientificReviewPending
        ? "Scientific review pending"
        : i.status,
      directory: true,
    })),
  ...haircare.ingredients.map((i) => ({
    id: `hair:${i.slug}`,
    href: `/haircare/ingredients/${i.slug}/`,
    title: i.name,
    description: i.summary,
    topic: "hair" as const,
    format: "Ingredient profile" as const,
    status: i.status,
    directory: true,
  })),
  ...libraryArticles.map((a) => ({
    id: `library:${a.slug}`,
    href: `/library/${a.slug}/`,
    title: a.title,
    description: a.description,
    topic: a.category === "Start here" ? null : ("health" as const),
    format:
      a.category === "Start here"
        ? ("Guide" as const)
        : ("Research brief" as const),
    status: a.status,
    directory: a.category !== "Start here",
    learn: a.category === "Start here",
  })),
  ...guides.map((g) => ({
    id: `guide:${g.slug}`,
    href: `/skincare/guides/${g.slug}/`,
    title: g.title,
    description: g.description,
    topic: "skin" as const,
    format: "Guide" as const,
    status: g.status,
    learn: true,
  })),
  ...catalog.comparisons.map((c) => ({
    id: `comparison:${c.id}`,
    href: comparisonPath(c.slug),
    title: c.title,
    description: c.editorialSummary,
    topic: "skin" as const,
    format: "Comparison" as const,
    status: c.publicationStatus,
  })),
  {
    id: "hair:product",
    href: `/haircare/products/${haircare.product.slug}/`,
    title: haircare.product.name,
    description:
      "Explore the recorded scalp-serum label and the limits of its evidence.",
    topic: "hair",
    format: "Product profile",
    status: haircare.product.status,
  },
];
export const contentNavigation = existingContent
  .filter(isPublicTopicEntry)
  .map((entry) => ({
    ...entry,
    additionalTopics: [
      ...new Set([
        ...(entry.additionalTopics ?? []),
        ...peptides
          .filter((p) => p.canonicalPath === entry.href)
          .flatMap((p) => [p.primaryTopicId, ...p.additionalTopicIds]),
      ]),
    ].filter((topic) => topic !== entry.topic),
    status: policyForPath(entry.href)?.label ?? "Review pending",
  }));
