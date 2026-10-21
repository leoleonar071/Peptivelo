import { z } from "zod";
import raw from "@/data/guides.json";
import { catalog } from "./data";

const sourcedText = z.object({
  text: z.string().min(1),
  sourceIds: z.array(z.string()),
  kind: z.enum(["source", "editorial", "illustration"]).default("source"),
});
const guideSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  answer: z.string().min(1),
  answerSourceIds: z.array(z.string()).min(1),
  status: z.enum(["draft", "published"]),
  updatedAt: z.iso.date(),
  scope: z.string().min(1),
  sections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        paragraphs: z.array(sourcedText).min(1),
      }),
    )
    .min(2),
  table: z.object({
    caption: z.string(),
    headers: z.array(z.string()).min(2),
    rows: z.array(
      z.object({
        cells: z.array(z.string()),
        sourceIds: z.array(z.string()).min(1),
      }),
    ),
  }),
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      sourceIds: z.array(z.string()).min(1),
    }),
  ),
  takeaway: z.array(z.string()).min(1),
  sourceIds: z.array(z.string()).min(1),
  productIds: z.array(z.string()),
  comparisonIds: z.array(z.string()),
  relatedGuideSlugs: z.array(z.string()),
});

export const guides = z.array(guideSchema).parse(raw);
if (new Set(guides.map((guide) => guide.slug)).size !== guides.length)
  throw new Error("Duplicate guide slug");
for (const guide of guides) {
  const cited = [
    ...guide.sourceIds,
    ...guide.answerSourceIds,
    ...guide.sections.flatMap((s) => s.paragraphs.flatMap((p) => p.sourceIds)),
    ...guide.table.rows.flatMap((r) => r.sourceIds),
    ...guide.questions.flatMap((q) => q.sourceIds),
  ];
  if (
    cited.some((id) => !catalog.sources.some((s) => s.id === id)) ||
    guide.sections.some((s) =>
      s.paragraphs.some((p) => p.kind === "source" && p.sourceIds.length === 0),
    ) ||
    guide.productIds.some((id) => !catalog.products.some((p) => p.id === id)) ||
    guide.comparisonIds.some(
      (id) => !catalog.comparisons.some((c) => c.id === id),
    ) ||
    guide.relatedGuideSlugs.some(
      (slug) => !guides.some((g) => g.slug === slug),
    ) ||
    guide.table.rows.some(
      (r) => r.cells.length !== guide.table.headers.length,
    ) ||
    new Set(guide.sections.map((s) => s.id)).size !== guide.sections.length
  )
    throw new Error(`Invalid guide references or table: ${guide.slug}`);
}
for (const comparison of catalog.comparisons)
  if (
    comparison.relatedGuideSlugs.some(
      (slug) => !guides.some((g) => g.slug === slug),
    )
  )
    throw new Error(`Invalid comparison guide: ${comparison.id}`);

export type Guide = z.infer<typeof guideSchema>;
export const guidePath = (slug: string) => `/skincare/guides/${slug}/`;
