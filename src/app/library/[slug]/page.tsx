import Link from "next/link";
import { notFound } from "next/navigation";
import { libraryArticles, libraryCitations } from "@/lib/library";
import { Citations, References } from "@/components/citations";
import { LibraryDisclosures } from "@/components/library-disclosures";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = libraryArticles.find((a) => a.slug === slug);
  return {
    title: article?.title ?? "Not found",
    description: article?.description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/library/${slug}/` },
  };
}
// Intent: a brief first answer with optional evidence depth, reusing the reader’s
// typography, warm surfaces, bordered disclosures and 4px spacing system.
export default async function LibraryArticle({ params }: Props) {
  const { slug } = await params;
  const a = libraryArticles.find((item) => item.slug === slug);
  if (!a) notFound();
  const citations = libraryCitations(a);
  return (
    <article className="wrap library-page">
      <LibraryDisclosures>
        <Link
          className="text-link"
          href={
            a.category === "Start here" ? "/learn/" : "/topics/health-research/"
          }
        >
          ← {a.category === "Start here" ? "Learn" : "Health & research"}
        </Link>
        <header className="identify-intro">
          <span className="eyebrow">{a.category} · EDITORIAL DRAFT</span>
          <h1>{a.title}</h1>
          <p>{a.description}</p>
        </header>
        <p className="identify-footnote">
          Sources checked October 20, 2026 · US context · Human editorial and
          scientific review pending
        </p>
        <section className="library-answer">
          <h2>The short answer</h2>
          <p>
            {a.answer}
            <Citations set={citations} claim="answer" />
          </p>
        </section>
        <section aria-label="Explore the evidence">
          {a.sections.map((s, i) => (
            <details className="reader-disclosure" key={s.title}>
              <summary>
                <span>{s.title}</span>
                <span className="reader-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="reader-disclosure-body">
                <p>
                  {s.text}
                  <Citations set={citations} claim={`section-${i}`} />
                </p>
              </div>
            </details>
          ))}
        </section>
        <p className="library-takeaway">{a.takeaway}</p>
        <details className="reader-disclosure" id="library-references">
          <summary>
            <span>
              References and access limits
              <small>
                Study design, commercial context and what was inspected
              </small>
            </span>
            <span className="reader-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <References set={citations} />
        </details>
        <Link
          className="text-link"
          href={
            a.category === "Start here" ? "/learn/" : "/topics/health-research/"
          }
        >
          Explore{" "}
          {a.category === "Start here"
            ? "learning guides"
            : "health & research"}{" "}
          →
        </Link>
      </LibraryDisclosures>
    </article>
  );
}
