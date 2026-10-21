import { Citations } from "./citations";
import type { CitationSet } from "@/lib/citations";
import type { Evaluation } from "@/lib/evaluations";
import { EvidenceSupport } from "./evidence-support";
import { readingLimits, usesReadingContext } from "@/lib/reading-context";

// The shopper needs a brief decision summary, with research detail on demand.
// Reuse DM Sans, existing ink/mineral tokens, border-only panels and 16/24px
// spacing; native disclosures preserve keyboard and no-JavaScript access.
export function ComparisonEvaluation({
  evaluation,
  citations,
  compact = false,
}: {
  evaluation: Evaluation;
  citations: CitationSet;
  compact?: boolean;
}) {
  const clarify = usesReadingContext(evaluation.comparisonId);
  return (
    <section
      id={compact ? "research-evidence" : "before-you-buy"}
      className={compact ? "reader-evidence" : "section"}
      aria-labelledby="evaluation-title"
    >
      <span className="eyebrow">{evaluation.mode === "label" ? "LABEL FACTS AND THEIR LIMITS" : "A CRITICAL LOOK AT THE EVIDENCE"}</span>
      <h2 id="evaluation-title">
        {compact ? evaluation.mode === "label" ? "What the sources tell us." : "Evidence, explained." : evaluation.title}
      </h2>
      {!compact && <p className="section-intro">{evaluation.summary}</p>}
      {!compact && (
        <p className="small">
          Draft evidence synthesis · Sources checked {evaluation.checkedAt}.
          Human editorial and qualified scientific review pending. No
          finished-product testing or personal medical advice.
        </p>
      )}
      {clarify && <details className="support-key">
        <summary>What do the source labels mean?</summary>
        <p>Human studies describe what happened in their participants and tested preparation. Laboratory studies examine a model, not clinical results in shoppers. Case reports describe individual events, not how often they occur.</p>
        <p>Safety assessments review specified uses and concentrations. Manufacturer labels identify recorded product facts. Neither is a guarantee of results or individual tolerance. Source type is not a quality score.</p>
      </details>}
      <div className="question-grid evaluation-grid">
        {evaluation.sections.map((section) => (
          <article
            className="panel evaluation-card"
            id={`evaluation-${section.id}`}
            key={section.id}
          >
            <h3>{section.title}</h3>
            {clarify && <EvidenceSupport ids={section.paragraphs.flatMap((p) => p.sourceIds)} />}
            <p>
              <strong>{section.conclusion}</strong>
              <Citations
                set={citations}
                claim={`evaluation-conclusion-${section.id}`}
              />
            </p>
            <details>
              <summary>Read the evidence and what it means</summary>
              {section.paragraphs.map((paragraph, index) => (
                <div key={index}>
                  {clarify ? <EvidenceSupport ids={paragraph.sourceIds} interpretation={paragraph.kind === "interpretation"} /> : <span className="reference-kind">
                    {paragraph.kind === "interpretation"
                      ? "What this means for your decision · editorial interpretation"
                      : "What the research reports"}
                  </span>}
                  <p>
                    {paragraph.text}
                    <Citations
                      set={citations}
                      claim={`evaluation-${section.id}-${index}`}
                    />
                  </p>
                  {clarify && paragraph.kind === "evidence" && paragraph.sourceIds.some((id) => ["argireline-trial", "kraeling-penetration"].includes(id)) && <p className="data-limit-inline"><strong>{readingLimits.preparation.label}.</strong> {readingLimits.preparation.detail}</p>}
                </div>
              ))}
            </details>
          </article>
        ))}
      </div>
      <details className="panel section label-provenance">
        <summary>
          {evaluation.mode === "label" ? "What is recorded on the labels?" : "Which label facts connect this research to these products?"}
        </summary>
        {clarify && <EvidenceSupport ids={evaluation.labelSourceIds} />}
        <p>
          {evaluation.labelContext}
          <Citations set={citations} claim="evaluation-labels" />
        </p>
        <p className="small">
          Manufacturer links establish ingredient presence only. Scientific
          references support the research statements above. Formulas can change;
          check your purchased packaging.
        </p>
      </details>
    </section>
  );
}
