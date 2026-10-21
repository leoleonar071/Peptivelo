import { z } from "zod";
import raw from "@/data/comparison-evaluations.json";
import { catalog } from "./data";

const paragraph = z.object({
  text: z.string().min(1),
  sourceIds: z.array(z.string()),
  kind: z.enum(["evidence", "interpretation", "label"]),
});
export const evaluations = z
  .array(
    z.object({
      comparisonId: z.string(),
      title: z.string(),
      summary: z.string(),
      mode: z.enum(["label", "research"]).default("research"),
      decisionSummary: z.array(z.object({
        label: z.string(), text: z.string(), sourceIds: z.array(z.string()),
        basis: z.enum(["label", "catalog", "interpretation"]),
      })).length(3).optional(),
      sections: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            conclusion: z.string(),
            paragraphs: z.array(paragraph).min(1),
          }),
        )
        .length(4),
      labelContext: z.string(),
      labelSourceIds: z.array(z.string()).min(1),
      checkedAt: z.iso.date(),
      status: z.literal("draft"),
    }),
  )
  .parse(raw);
for (const e of evaluations) {
  if (
    !catalog.comparisons.some((c) => c.id === e.comparisonId) ||
    new Set(e.sections.map((s) => s.id)).size !== e.sections.length
  )
    throw new Error("Invalid comparison evaluation");
  for (const p of e.sections.flatMap((s) => s.paragraphs)) {
    if (p.kind !== "interpretation" && !p.sourceIds.length)
      throw new Error("Evidence requires sources");
    for (const id of p.sourceIds) {
      const source = catalog.sources.find((s) => s.id === id);
      if (!source || (p.kind === "label" ? source.sourceType !== "manufacturer" : source.sourceType === "manufacturer"))
        throw new Error(
          "Scientific assessment cannot cite a shop or manufacturer label",
        );
    }
  }
  if (e.labelSourceIds.some((id) => !catalog.sources.some((s) => s.id === id)))
    throw new Error("Invalid label provenance");
  if (e.decisionSummary?.some((item) => item.sourceIds.some((id) => !catalog.sources.some((s) => s.id === id)))) throw new Error("Invalid decision summary source");
}
export const evaluationFor = (id: string) =>
  evaluations.find((e) => e.comparisonId === id);
export type Evaluation = (typeof evaluations)[number];
export const evaluationClaims = (e: Evaluation) => [
  ...e.sections
    .slice(0, 3)
    .map((s) => ({
      key: `overview-${s.id}`,
      sourceIds: [...new Set(s.paragraphs.flatMap((p) => p.sourceIds))],
    })),
  ...e.sections.map((s) => ({
    key: `evaluation-conclusion-${s.id}`,
    sourceIds: [...new Set(s.paragraphs.flatMap((p) => p.sourceIds))],
  })),
  ...e.sections.flatMap((s) =>
    s.paragraphs.map((p, i) => ({
      key: `evaluation-${s.id}-${i}`,
      sourceIds: p.sourceIds,
    })),
  ),
  { key: "evaluation-labels", sourceIds: e.labelSourceIds },
  ...(e.decisionSummary ?? []).map((item, index) => ({ key: `decision-summary-${index}`, sourceIds: item.sourceIds })),
];
