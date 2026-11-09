import { isActiveTopic, type TopicId } from "./topic-registry";

export type PublicationDocument = {
  id: string;
  href: string;
  topic: TopicId | null;
  status: "draft" | "published" | "demo";
  revision: string;
  sourceIds: readonly string[];
  checkedAt?: string;
  requiresScientificReview: boolean;
  indexing?: "never";
};
export type PublicationReview = {
  documentId: string;
  revision: string;
  kind: "editorial" | "scientific";
  reviewerId: string;
  reviewedAt: string;
};

// Exact canonical snapshots, rather than a manually incremented version, make
// an approval stale whenever a record or its supporting documentation changes.
// These strings are internal provenance, never rendered as user-facing versions.
export function contentRevision(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(contentRevision).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, item]) => `${JSON.stringify(key)}:${contentRevision(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function publicationDecision(
  document: PublicationDocument,
  reviews: readonly PublicationReview[],
  legacyPublicPaths: readonly string[],
  siteIndexable = false,
) {
  const approved = (kind: PublicationReview["kind"]) =>
    reviews.some(
      (review) =>
        review.documentId === document.id &&
        review.revision === document.revision &&
        review.kind === kind &&
        review.reviewerId.trim().length > 0 &&
        /^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt),
    );
  const editorialReviewed = approved("editorial");
  const scientificReviewed = approved("scientific");
  const visible =
    document.status !== "demo" &&
    (document.topic === null || isActiveTopic(document.topic)) &&
    (document.status === "published" ||
      legacyPublicPaths.includes(document.href));
  const approvedForPublication =
    editorialReviewed &&
    (!document.requiresScientificReview || scientificReviewed);
  const promotable =
    visible && document.status === "published" && approvedForPublication;
  return {
    visible,
    promotable,
    indexable: siteIndexable && promotable && document.indexing !== "never",
    editorialReviewed,
    scientificReviewed,
    label:
      document.status === "draft"
        ? "Editorial draft · Review pending"
        : !editorialReviewed
          ? "Editorial approval pending"
          : document.requiresScientificReview && !scientificReviewed
            ? "Scientific review pending"
            : "Editorially reviewed",
  };
}
