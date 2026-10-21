import Link from "next/link";
import { ArrowRight, ArrowUpRight, Shuffle } from "lucide-react";
import { ReaderTabs } from "./reader-tabs";
import {
  products,
  brandName,
  priceFor,
  type EditorialComparison,
} from "@/lib/data";
import { money } from "@/lib/math";
import { volumeLabel } from "@/lib/comparison";
import { productPath } from "@/lib/config";
import type { CitationSet } from "@/lib/citations";
import type { Evaluation } from "@/lib/evaluations";
import { Bottle, AffiliateDisclosure } from "./ui";
import { Citations, References, EvidenceNotice } from "./citations";
import { ComparisonEvaluation } from "./comparison-evaluation";
import { StudyData } from "./study-data";
import { ComparisonGrid } from "./comparison-grid";
import { RetailerLink } from "./interactive";
import { readingLimits, usesReadingContext } from "@/lib/reading-context";

// Intent: recognize the pair, understand three takeaways, then inspect details.
// Warm paper/beige surfaces and petroleum text reuse DM Sans and a 4px grid.
// Quiet borders, 20px panels and pill navigation distinguish depth from evidence.
export function EditorialComparison({
  comparison: c,
  evaluation,
  citations,
}: {
  comparison: EditorialComparison;
  evaluation: Evaluation;
  citations: CitationSet;
}) {
  const pair = c.comparedProductIds.map((id) =>
    products.find((p) => p.id === id)!,
  );
  return (
    <article className="editorial-reader">
      <div className="reader-status">
        <span className="reader-dot" /> Editorial draft · Scientific review
        pending <span>Updated {c.updatedAt}</span>
      </div>
      <div className="reader-pair" aria-label="Products in this comparison">
        {pair.map((p) => (
          <article className="reader-product" key={p.id}>
            <Link
              href={productPath(p.slug)}
              className="reader-photo"
              aria-label={`View ${brandName(p)} ${p.name}`}
            >
              <Bottle product={p} priority />
            </Link>
            <div>
              <span className="eyebrow">{brandName(p)}</span>
              <h2>
                <Link href={productPath(p.slug)}>{p.name}</Link>
              </h2>
              <p className="reader-volume">{volumeLabel(p)} · Facial serum</p>
              <p className="reader-price">
                {priceFor(p) ? money(priceFor(p)!.price) : readingLimits.price.label}
                <small>
                  {priceFor(p)
                    ? `USD · Recorded ${priceFor(p)!.verifiedAt}`
                    : readingLimits.price.detail}
                </small>
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="reader-pair-actions">
        <span>Two formulas. A closer look at what matters.</span>
        <Link href={`/skincare/compare/?a=${pair[0].id}&b=${pair[1].id}`}>
          <Shuffle size={16} /> Change products
        </Link>
      </div>
      <ReaderTabs
        overview={
          <>
            <section
              id="before-you-buy"
              className="reader-overview"
              aria-labelledby="reader-overview-title"
            >
              <div className="reader-section-heading">
                <span className="eyebrow">THE SHORT VERSION</span>
                <h2 id="reader-overview-title">What matters in 30 seconds.</h2>
                <p>The key findings, without the chemistry lesson.</p>
              </div>
              <div className="reader-takeaways">
                {(evaluation.decisionSummary ?? evaluation.sections.slice(0, 3).map((section, index) => ({label: ["Benefits", "Precautions", "What remains unknown"][index], text: section.conclusion, basis: "interpretation", sourceIds: [], legacyId: section.id}))).map((item, index) => (
                  <div key={index}>
                    <span className="reader-step">0{index + 1}</span>
                    <div>
                      <h3>
                        {item.label}
                      </h3>
                      <p>
                        {item.text}
                        <Citations
                          set={citations}
                          claim={evaluation.decisionSummary ? `decision-summary-${index}` : `overview-${evaluation.sections[index].id}`}
                        />
                      </p>
                      {evaluation.decisionSummary && <p className="evidence-support">{item.basis === "label" ? "Manufacturer labels" : item.basis === "catalog" ? "Recorded prices · not a performance ranking" : evaluation.mode === "label" ? "Editorial interpretation of label information" : "Editorial interpretation of selected research"}</p>}
                      <a className="text-link reader-next-step" href={["#comparison-result-title", "#price-comparison", "#research-evidence"][index]}>
                        {["See ingredient differences", "Understand the price", "Check the evidence"][index]} <ArrowRight size={15} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="reader-caution">
                <strong>Before you choose:</strong> {evaluation.mode === "label" ? "label facts do not establish which finished formula is safer or more effective." : "neither finished formula is established as safer or more effective by this review."} If you
                have a confirmed ingredient allergy, check the full label before
                buying.
              </p>
              <a className="text-link" href="#research-evidence">
                Understand the evidence <ArrowRight size={16} />
              </a>
            </section>
          </>
        }
        ingredients={
          <>
            <section
              className="reader-matrix"
              aria-labelledby="comparison-result-title"
            >
              <div className="reader-section-heading">
                <span className="eyebrow">SIDE BY SIDE</span>
                <h2 id="comparison-result-title" tabIndex={-1}>
                  Ingredients, price and the gaps.
                </h2>
                <p>
                  Compare selected label facts. Tap an ingredient to understand
                  its name.
                </p>
              </div>
              <ComparisonGrid a={pair[0]} b={pair[1]} clarifyLimits={usesReadingContext(c.id)} returnTo={`/skincare/compare/${c.slug}/#comparison-peptides`} />
            </section>

            <details className="reader-disclosure" id="buying-notes">
              <summary>
                <span>
                  What do the label differences mean?
                  <small>Exact names, disclosures and cost limits</small>
                </span>
                <span className="reader-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="reader-disclosure-body">
                {c.practicalDifferences.map((note, index) => (
                  <section key={note.title}>
                    <h3>{note.title}</h3>
                    <p>
                      {note.text}
                      <Citations
                        set={citations}
                        claim={`difference-${index}`}
                      />
                    </p>
                  </section>
                ))}
                <h3>Documented differences</h3>
                <p>
                  {c.documentedDifferences}
                  <Citations set={citations} claim="documented" />
                </p>
                <h3>Use this comparison for your decision</h3>
                {c.decisionNotes.map((note, index) => (
                  <section key={note.title}>
                    <h4>{note.title}</h4>
                    <p>
                      {note.text}
                      <Citations set={citations} claim={`decision-${index}`} />
                    </p>
                  </section>
                ))}
              </div>
            </details>
          </>
        }
        evidence={
          <>
            <ComparisonEvaluation
              evaluation={evaluation}
              citations={citations}
              compact
            />
            <StudyData citations={citations} comparisonId={c.id} />
            <section id="product-questions" className="reader-questions">
              <div className="reader-section-heading">
                <span className="eyebrow">A LITTLE MORE CLARITY</span>
                <h2>Questions about these products</h2>
              </div>
              {c.questions.map((question, index) => (
                <details className="reader-disclosure" key={question.question}>
                  <summary>
                    <span>{question.question}</span>
                    <span className="reader-plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="reader-disclosure-body">
                    <p>
                      {question.answer}
                      <Citations set={citations} claim={`question-${index}`} />
                    </p>
                  </div>
                </details>
              ))}
            </section>
          </>
        }
        buying={
          <>
            <section id="where-to-buy" className="reader-buy">
              <div className="reader-section-heading">
                <span className="eyebrow">CHECK THE CURRENT OFFER</span>
                <h2>Where to buy</h2>
                <p>
                  Check the exact size, current price and shipping at the
                  manufacturer.
                </p>
              </div>
              <div className="reader-buy-options">
                {pair.map((p) => (
                  <div key={p.id}>
                    <div>
                      <strong>{brandName(p)}</strong>
                      <span>{p.name}</span>
                      <span>
                        {volumeLabel(p)} ·{" "}
                        {priceFor(p)
                          ? `${money(priceFor(p)!.price)} USD · Recorded ${priceFor(p)!.verifiedAt}`
                          : "Price not verified"}
                      </span>
                    </div>
                    <RetailerLink product={p} detailed />
                    <small>Select the {volumeLabel(p)} option on the retailer’s page. Confirm the current price before checkout.</small>
                  </div>
                ))}
              </div>
              <AffiliateDisclosure />
            </section>
          </>
        }
        methodology={
          <>
            <details className="reader-disclosure">
              <summary>
                <span>
                  How this comparison was prepared
                  <small>Scope, review status and limitations</small>
                </span>
                <span className="reader-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="reader-disclosure-body">
                <EvidenceNotice />
                <h3>What we cannot tell from the label</h3>
                <p>{c.limitations}</p>
                <Link href="/methodology/">
                  Read our methodology <ArrowUpRight size={15} />
                </Link>
              </div>
            </details>
          </>
        }
        related={
          <>
            <div className="reader-related">
              <span>Learn to read the label</span>
              {c.relatedGuideSlugs.map((slug) => (
                <Link key={slug} href={`/skincare/guides/${slug}/`}>
                  {slug === "peptide-percentages-explained"
                    ? "What peptide percentages really tell you"
                    : slug.replaceAll("-", " ")}{" "}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </>
        }
        references={<References set={citations} />}
        referenceCount={citations.sourceIds.length}
      />
    </article>
  );
}
