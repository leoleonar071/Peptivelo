import { z } from "zod";
import { editorialStatus } from "./editorial-status";
import { topicRegistry, type TopicId } from "./topic-registry";

const id = z.string().trim().min(1);
const topic = z.custom<TopicId>((value) =>
  topicRegistry.some((t) => t.id === value),
);
const url = z
  .url()
  .refine((value) => /^https?:\/\//.test(value), "HTTP(S) URL required");
const path = z.string().regex(/^\/(?!\/)[a-z0-9/-]+\/$/);
export const peptideSectionTitles = {
  overview: "Overview",
  howItWorks: "How it works",
  research: "Research & Evidence",
  applications: "Potential Applications",
  safety: "Safety & Regulatory Status",
  products: "Products & Formulations",
  comparisons: "Comparisons",
  faq: "Frequently Asked Questions",
  sources: "Sources & References",
  methodology: "Last Updated & Methodology",
} as const;
export const sectionKeys = Object.keys(
  peptideSectionTitles,
) as (keyof typeof peptideSectionTitles)[];
const paragraph = z
  .object({ text: z.string().trim().min(1), sourceIds: z.array(id) })
  .strict();
const sections = z
  .object({
    overview: z.array(paragraph),
    howItWorks: z.array(paragraph),
    research: z.array(paragraph),
    applications: z.array(paragraph),
    safety: z.array(paragraph),
    products: z.array(paragraph),
    comparisons: z.array(paragraph),
    methodology: z.array(paragraph),
  })
  .strict();
export const editorialImageSchema = z
  .object({
    originalSource: id,
    credit: id,
    license: id,
    originalUrl: url,
    optimizedFile: z
      .string()
      .regex(/^\/images\/(?!.*\.\.)[a-zA-Z0-9/_.-]+$/)
      .optional(),
    alt: id,
    aiChanges: z.string(),
    attributionRequired: z.boolean(),
    attribution: z.string(),
    approval: z.enum(["pending", "approved", "rejected"]),
    provenance: z
      .object({
        provider: z.enum([
          "open-beauty-facts",
          "brand",
          "affiliate-feed",
          "user-submission",
          "owned-card",
        ]),
        author: id.optional(),
        commercialUse: z.enum(["allowed", "prohibited", "unknown"]),
        permissionEvidence: id.optional(),
        productMatch: z
          .object({
            catalogProductId: id,
            exactVariantEvidence: id,
          })
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    (image) => !image.attributionRequired || !!image.attribution.trim(),
    "Required attribution missing",
  )
  .superRefine((image, ctx) => {
    if (image.approval !== "approved") return;
    const source = image.provenance;
    if (
      !source?.author ||
      source.commercialUse !== "allowed" ||
      !source.permissionEvidence ||
      !image.optimizedFile
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Approval requires author, commercial-use evidence and a local asset",
      });
    }
    if (source?.provider === "open-beauty-facts" && !source.productMatch) {
      ctx.addIssue({
        code: "custom",
        message: "Open Beauty Facts approval requires exact variant evidence",
      });
    }
  });
export const peptideSchema = z
  .object({
    id,
    name: id,
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    identityKind: z.enum(["compound", "group", "mixture", "unverified-label"]),
    identityVerification: z.enum(["pending", "checked"]),
    priority: z.enum(["initial", "future"]),
    canonicalPath: path,
    // Link an existing authoritative record without copying or migrating its content.
    existingDocumentId: id.nullable(),
    preparationRefs: z.array(id),
    primaryTopicId: topic,
    additionalTopicIds: z.array(topic),
    tags: z.array(id),
    status: editorialStatus,
    sections,
    faq: z.array(z.object({ question: id, answer: paragraph }).strict()),
    sources: z.array(
      z
        .object({ id, title: id, url, accessedAt: z.iso.date(), publisher: id })
        .strict(),
    ),
    regulatoryRecords: z.array(
      z
        .object({
          jurisdiction: id,
          preparation: id,
          checkedAt: z.iso.date(),
          classification: z.enum([
            "cosmetic-ingredient",
            "supplement",
            "authorized-medicine",
            "investigational",
            "not-authorized-for-human-use",
            "other",
          ]),
          statement: id,
          sourceIds: z.array(id).min(1),
        })
        .strict(),
    ),
    images: z.array(editorialImageSchema),
    ingredientIds: z.array(id),
    productIds: z.array(id),
    comparisonIds: z.array(id),
    relatedPeptideIds: z.array(id),
    guideIds: z.array(id),
    updatedAt: z.iso.date().nullable(),
    reviewedAt: z.iso.date().nullable(),
    seo: z.object({ title: z.string(), description: z.string() }).strict(),
  })
  .strict()
  .superRefine((record, ctx) => {
    const sourceIds = new Set(record.sources.map((s) => s.id));
    if (sourceIds.size !== record.sources.length)
      ctx.addIssue({ code: "custom", message: "Duplicate source ID" });
    const claims = [
      ...Object.values(record.sections).flat(),
      ...record.faq.map((q) => q.answer),
      ...record.regulatoryRecords,
    ];
    for (const claim of claims) {
      if (claim.sourceIds.some((s) => !sourceIds.has(s)))
        ctx.addIssue({ code: "custom", message: "Unknown source reference" });
    }
    if (
      record.additionalTopicIds.includes(record.primaryTopicId) ||
      new Set(record.additionalTopicIds).size !==
        record.additionalTopicIds.length
    )
      ctx.addIssue({ code: "custom", message: "Duplicate topic membership" });
    if (!record.existingDocumentId && record.status === "published") {
      if (
        !record.sections.overview.length ||
        !record.sections.methodology.length ||
        !record.sources.length ||
        !record.seo.title.trim() ||
        !record.seo.description.trim() ||
        !record.reviewedAt ||
        !record.updatedAt ||
        record.identityVerification !== "checked"
      )
        ctx.addIssue({
          code: "custom",
          message:
            "Publication requires content, sources, verified identity, methodology, review dates and SEO",
        });
      if (claims.some((claim) => !claim.sourceIds.length))
        ctx.addIssue({
          code: "custom",
          message: "Published statements require references",
        });
    }
  });
export type Peptide = z.infer<typeof peptideSchema>;
export type EditorialImage = z.infer<typeof editorialImageSchema>;
