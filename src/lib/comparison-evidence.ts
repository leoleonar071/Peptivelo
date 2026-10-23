import { facialComparisonGroup } from "./comparison-groups";
import { comparisonPath } from "@/lib/config";
import { catalog } from "./data";
import { evaluations } from "./evaluations";
import { evidence } from "./citations";
import type { Market } from "./offers";

export type EvidenceSource = {
  id: string;
  title: string;
  url: string;
  kind: string;
  supports: string;
  limits: string;
  checkedAt: string;
};
export type ComparisonEvidenceData = {
  market: Market;
  currency: "USD";
  sources: Record<string, EvidenceSource>;
  ingredients: Record<
    string,
    { name: string; text: string; limit: string; sourceIds: string[] }
  >;
  pairs: Record<
    string,
    {
      title: string;
      href: string;
      paragraphs: { text: string; kind: string; sourceIds: string[] }[];
    }
  >;
};
// Build on the server. Client readers receive source excerpts, not validation libraries.
export function comparisonEvidenceData(): ComparisonEvidenceData {
  const pairs: ComparisonEvidenceData["pairs"] = {};
  for (const comparison of catalog.comparisons) {
    const evaluation = evaluations.find(
      (e) => e.comparisonId === comparison.id,
    );
    pairs[[...comparison.comparedProductIds].sort().join("|")] = {
      title: comparison.title,
      href: comparisonPath(comparison.slug),
      paragraphs: evaluation
        ? evaluation.sections.flatMap((s) => s.paragraphs)
        : comparison.researchContext
          ? [
              {
                text: comparison.researchContext.text,
                kind: "interpretation",
                sourceIds: comparison.researchContext.sourceIds,
              },
            ]
          : [],
    };
  }
  return {
    market: facialComparisonGroup.presentation.market,
    currency: facialComparisonGroup.presentation.currency,
    pairs,
    sources: Object.fromEntries(
      catalog.sources.map((source) => {
        const note = evidence.find((e) => e.sourceId === source.id);
        return [
          source.id,
          {
            id: source.id,
            title: source.title,
            url: source.url,
            kind: note?.kind ?? source.sourceType,
            supports: note?.supports ?? "Recorded source information.",
            limits:
              note?.limits ??
              "Source check is not independent scientific review.",
            checkedAt: source.accessedAt,
          },
        ];
      }),
    ),
    ingredients: Object.fromEntries(
      catalog.ingredients
        .filter((i) => i.status === "published")
        .map((i) => [
          i.id,
          {
            name: i.inciName,
            text: i.education.evidence.text,
            limit: i.knownLimitations,
            sourceIds: i.education.evidence.sourceIds,
          },
        ]),
    ),
  };
}
