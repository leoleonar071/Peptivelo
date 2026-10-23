import { comparisonPath } from "@/lib/config";
import Link from "next/link";
import { catalog, products } from "@/lib/data";
import { type Guide } from "@/lib/guides";
import { productPath } from "@/lib/config";
import { Citations, EvidenceNotice, References } from "./citations";
import { guideCitations } from "@/lib/citations";
import { LearningGuides } from "./learning-guides";

export function ReadingGuide({ guide }: { guide: Guide }) {
  const citations = guideCitations(guide);
  return (
    <article className="reading-guide">
      <div className="notice">
        <strong>
          {guide.status === "draft"
            ? "Draft guide — human editorial review pending"
            : "Label-reading guide"}
        </strong>
        <p>{guide.scope}</p>
        <p>
          Updated <time dateTime={guide.updatedAt}>{guide.updatedAt}</time>.
          Source consultation dates are listed below.
        </p>
      </div>
      <section
        className="panel guide-answer"
        aria-labelledby="guide-short-answer"
      >
        <h2 id="guide-short-answer">The short answer</h2>
        <p>
          {guide.answer}
          <Citations set={citations} claim="answer" />
        </p>
      </section>
      <EvidenceNotice />
      <nav className="guide-contents panel section" aria-label="On this page">
        <strong>On this page</strong>
        <ul>
          <li>
            <a href="#label-table">At a glance</a>
          </li>
          {guide.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
          <li>
            <a href="#common-questions">Common questions</a>
          </li>
          <li>
            <a href="#guide-sources">Sources and their limits</a>
          </li>
        </ul>
      </nav>
      <section id="label-table" className="section">
        <h2>At a glance</h2>
        <p className="small">
          On narrow screens, scroll within the table to read all columns.
        </p>
        <div
          className="guide-table-scroll"
          role="region"
          tabIndex={0}
          aria-label={guide.table.caption}
        >
          <table className="guide-table">
            <caption>{guide.table.caption}</caption>
            <thead>
              <tr>
                {guide.table.headers.map((header) => (
                  <th scope="col" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.table.rows.map((row, rowIndex) => (
                <tr key={row.cells[0]}>
                  {row.cells.map((cell, index) =>
                    index === 0 ? (
                      <th scope="row" key={index}>
                        {cell}
                        <Citations set={citations} claim={`row-${rowIndex}`} />
                      </th>
                    ) : (
                      <td key={index}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {guide.sections.map((section) => (
        <section id={section.id} className="prose section" key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <div key={index}>
              {paragraph.kind !== "source" && (
                <span className="reference-kind">
                  {paragraph.kind === "illustration"
                    ? "Hypothetical arithmetic"
                    : "Editorial interpretation"}
                </span>
              )}
              <p>
                {paragraph.text}
                <Citations set={citations} claim={`${section.id}-${index}`} />
              </p>
            </div>
          ))}
        </section>
      ))}
      <section id="common-questions" className="prose section">
        <h2>Common questions</h2>
        {guide.questions.map((question, index) => (
          <section key={question.question}>
            <h3>{question.question}</h3>
            <p>
              {question.answer}
              <Citations set={citations} claim={`question-${index}`} />
            </p>
          </section>
        ))}
      </section>
      <section className="panel section">
        <h2>Your label-reading checklist</h2>
        <span className="reference-kind">Editorial guidance</span>
        <ul>
          {guide.takeaway.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section
        className="prose section"
        aria-label="Apply this guide to a product"
      >
        <h2>Apply this to a real comparison</h2>
        <ul>
          {guide.comparisonIds.map((id) => {
            const comparison = catalog.comparisons.find((c) => c.id === id)!;
            return (
              <li key={id}>
                <Link href={comparisonPath(comparison.slug)}>
                  {comparison.title}
                </Link>{" "}
                · Editorial draft
              </li>
            );
          })}
        </ul>
        <h3>Product labels used in this guide</h3>
        <ul>
          {guide.productIds.map((id) => {
            const product = products.find((p) => p.id === id)!;
            return (
              <li key={id}>
                <Link href={productPath(product.slug)}>{product.name}</Link>
              </li>
            );
          })}
        </ul>
        <Link href="/tools/price-per-ml/">Compare your own prices per mL</Link>
      </section>
      <section id="guide-sources" className="section">
        <h2>Sources and their limits</h2>
        <p>
          Supplier and manufacturer references establish label facts. Academic
          references, where included, are identified separately with their
          scope. No source here establishes a winner between our finished
          serums.
        </p>
        <References set={citations} />
      </section>
      <LearningGuides slugs={guide.relatedGuideSlugs} />
      <Link className="text-link" href="/skincare/guides/">
        Browse all label guides
      </Link>
    </article>
  );
}
