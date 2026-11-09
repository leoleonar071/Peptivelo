import { canIndexPath, isVisiblePath } from "@/lib/publication-registry";
import { ContentCards } from "@/components/discovery";
import { contentNavigation } from "@/lib/content-navigation";
import Link from "next/link";
import basics from "@/data/learning-basics.json";
export const metadata = {
  title: "Learn about peptides",
  description:
    "Start with peptide basics and learn how to read cosmetic labels.",
  alternates: { canonical: "/learn/" },
  robots: { index: canIndexPath("/learn/"), follow: true },
};
export default function LearnPage() {
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">LEARN</span>
      <h1>Build your understanding, one question at a time.</h1>
      <p>
        Start with the differences between peptide contexts, then explore
        practical guides to cosmetic labels.
      </p>
      <section
        id="peptide-basics"
        className="discovery-intro-panel peptide-basics"
        aria-labelledby="peptide-basics-title"
      >
        <span className="eyebrow">START WITH THE BASICS</span>
        <h2 id="peptide-basics-title">{basics.title}</h2>
        <p>{basics.definition}</p>
        <h3>Peptide, ingredient or finished product?</h3>
        <p>{basics.context}</p>
        <h3>How to read the evidence</h3>
        <p>{basics.reading}</p>
        <p className="small">
          Documentary introduction · Human editorial review pending. Definition
          source:{" "}
          <a
            className="text-link"
            href="https://goldbook.iupac.org/terms/view/P04479"
            target="_blank"
            rel="noopener noreferrer"
          >
            IUPAC Gold Book
          </a>
          . <Link href="/sources/#source-iupac-peptides">Access notes →</Link>
        </p>
        <div className="button-row">
          {isVisiblePath("/library/peptide-categories/") && (
            <Link
              className="button secondary"
              href="/library/peptide-categories/"
            >
              Understand cosmetic, medicine and experimental contexts →
            </Link>
          )}
          <Link className="text-link" href="/topics/">
            Choose a topic →
          </Link>
        </div>
      </section>
      <ContentCards entries={contentNavigation.filter((e) => e.learn)} />
    </div>
  );
}
