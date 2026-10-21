import { z } from "zod";
import raw from "@/data/evidence.json";
import { catalog, type EditorialComparison } from "./data";
import type { Guide } from "./guides";
import { evaluationClaims, evaluationFor } from "./evaluations";
import { studyDataFor } from "./study-data";

export const evidence = z
  .array(
    z.object({
      sourceId: z.string(),
      kind: z.enum([
        "Supplier information",
        "Manufacturer label",
        "Human ingredient study",
        "Laboratory study",
        "Human case report",
        "Regulatory safety opinion",
        "Regulatory guidance",
        "Human clinical trial",
        "Human pilot study",
        "Human formulation study",
        "Manufacturer study summary",
        "Expert safety assessment",
      ]),
      supports: z.string().min(1),
      limits: z.string().min(1),
      commercialContext: z.string().min(1),
      contextUrl: z.url().optional(),
      checkedAt: z.iso.date(),
      access: z.string().min(1),
      authors: z.string().optional(),
      journal: z.string().optional(),
      year: z.number().optional(),
      doi: z.string().optional(),
      publicationUrl: z.url().optional(),
      publicationTitle: z.string().optional(),
      design: z.string().optional(),
      finding: z.string().optional(),
      integrity: z.string().optional(),
    }),
  )
  .parse(raw);
if (
  new Set(evidence.map((e) => e.sourceId)).size !== evidence.length ||
  evidence.some((e) => !catalog.sources.some((s) => s.id === e.sourceId))
)
  throw new Error("Invalid evidence registry");
export type CitationClaim = { key: string; sourceIds: string[] };
export function citationSet(prefix: string, claims: CitationClaim[]) {
  if (new Set(claims.map((c) => c.key)).size !== claims.length)
    throw new Error("Duplicate citation claim");
  const sourceIds = [...new Set(claims.flatMap((c) => c.sourceIds))];
  if (sourceIds.some((id) => !evidence.some((e) => e.sourceId === id)))
    throw new Error("Citation lacks evidence notes");
  return { prefix, claims, sourceIds };
}
export type CitationSet = ReturnType<typeof citationSet>;
export const referenceId = (set: CitationSet, id: string) =>
  `${set.prefix}-reference-${id}`;
export const citationId = (set: CitationSet, key: string, id: string) =>
  `${set.prefix}-cite-${key}-${id}`;

export function guideCitations(g: Guide) {
  return citationSet("guide", [
    { key: "answer", sourceIds: g.answerSourceIds },
    ...g.table.rows.map((r, i) => ({
      key: `row-${i}`,
      sourceIds: r.sourceIds,
    })),
    ...g.sections.flatMap((s) =>
      s.paragraphs.map((p, i) => ({
        key: `${s.id}-${i}`,
        sourceIds: p.sourceIds,
      })),
    ),
    ...g.questions.map((q, i) => ({
      key: `question-${i}`,
      sourceIds: q.sourceIds,
    })),
  ]);
}
export function comparisonCitations(c: EditorialComparison) {
  const evaluation = evaluationFor(c.id);
  return citationSet("comparison", [
    ...(evaluation ? evaluationClaims(evaluation) : []),
    ...(!evaluation
      ? [
          {
            key: "answer",
            sourceIds: c.comparedProductIds.map(
              (id) => catalog.products.find((p) => p.id === id)!.sourceId,
            ),
          },
        ]
      : []),
    ...c.practicalDifferences.map((n, i) => ({
      key: `difference-${i}`,
      sourceIds: n.sourceIds ?? [],
    })),
    {
      key: "documented",
      sourceIds: c.comparedProductIds.map(
        (id) => catalog.products.find((p) => p.id === id)!.sourceId,
      ),
    },
    ...c.decisionNotes.map((n, i) => ({
      key: `decision-${i}`,
      sourceIds: n.sourceIds ?? [],
    })),
    ...(!evaluation
      ? [{ key: "research", sourceIds: c.researchContext?.sourceIds ?? [] }]
      : []),
    ...c.questions.map((q, i) => ({
      key: `question-${i}`,
      sourceIds: q.sourceIds,
    })),
    ...(evaluation
      ? studyDataFor(c.id).map((row) => ({
          key: `study-data-${row.sourceId}`,
          sourceIds: [row.sourceId],
        }))
      : []),
  ]);
}
