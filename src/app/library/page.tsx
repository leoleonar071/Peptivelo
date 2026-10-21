import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { libraryArticles } from "@/lib/library";
export const metadata = {
  title: "Peptide library",
  description:
    "Separate cosmetic labels, medicines and experimental peptide research.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/library/" },
};
// Intent: orient readers before they choose a category. Existing DM Sans,
// warm paper, petroleum ink, quiet borders and 4px spacing preserve the reader.
export default function LibraryPage() {
  return (
    <div className="wrap library-page">
      <span className="eyebrow">THE PEPTIDE LIBRARY</span>
      <h1>Start with the right question.</h1>
      <p className="library-intro">
        A skincare label, a medicine and an experimental compound need different
        kinds of evidence.
      </p>
      <Link className="button" href="/library/peptide-categories/">
        Understand the differences <ArrowRight size={17} />
      </Link>
      <section className="library-categories" aria-label="Library areas">
        <div>
          <span className="eyebrow">COSMETICS</span>
          <h2>Understand your serum.</h2>
          <p>Explore label facts and compare cosmetic formulas.</p>
          <Link className="text-link" href="/skincare/identify/">
            Find your serum <ArrowRight size={16} />
          </Link>
        </div>
        <div>
          <span className="eyebrow">MEDICINES</span>
          <h2>Check the exact product.</h2>
          <p>Start with how authorization differs from a compound name.</p>
          <Link className="text-link" href="/library/peptide-categories/">
            Read the introduction <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section
        className="library-hair-entry"
        aria-labelledby="library-hair-title"
      >
        <div>
          <span className="eyebrow">HAIR & SCALP</span>
          <h2 id="library-hair-title">A different formula. A closer look.</h2>
          <p>Explore cosmetic scalp serums and their peptide evidence.</p>
        </div>
        <Link className="text-link" href="/haircare/">
          Explore haircare <ArrowRight size={16} />
        </Link>
      </section>
      <section>
        <h2>Explore selected research</h2>
        <p className="library-intro">
          Draft educational briefs. No efficacy ranking, seller recommendations
          or treatment protocols.
        </p>
        <div className="question-grid">
          {libraryArticles
            .filter((a) => a.category === "Research brief")
            .map((a) => (
              <Link
                className="question-card"
                href={`/library/${a.slug}/`}
                key={a.slug}
              >
                <span className="badge">Research brief · Draft</span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <span className="text-link">
                  Explore the evidence <ArrowRight size={16} />
                </span>
              </Link>
            ))}
        </div>
      </section>
      <p className="identify-footnote">
        These topics are editorial pilot selections, not a verified
        search-volume ranking. Qualified scientific review remains pending.
      </p>
    </div>
  );
}
