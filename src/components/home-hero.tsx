import Link from "next/link";
import { searchIndex } from "@/lib/search-index";
import { HeroSearch } from "./hero-search";
export function HomeHero() {
  return (
    <section
      className="home-hero home-hero-visual wrap"
      aria-labelledby="home-title"
    >
      <div className="home-hero-copy">
        <p className="home-hero-eyebrow">
          <span aria-hidden="true" />
          INDEPENDENT PEPTIDE KNOWLEDGE
        </p>
        <h1 id="home-title">
          Understand peptides. <span>Explore the evidence and its limits.</span>
        </h1>
        <p className="home-hero-description">
          Clear explanations for your first question. Documented sources for a
          closer look. Explore skin, hair and selected health research.
        </p>
        <HeroSearch entries={searchIndex} />
        <p className="hero-basics">
          <Link className="text-link" href="/learn/#peptide-basics">
            New to peptides? Start with the basics →
          </Link>
        </p>
        <div className="hero-start">
          <span>Try searching:</span>
          {["GHK-Cu", "BPC-157", "Peptide concentrations"].map((q) => (
            <Link key={q} href={`/search/?q=${encodeURIComponent(q)}`}>
              {q} →
            </Link>
          ))}
        </div>
        <p className="home-transparency">
          Linked sources · Visible limitations ·{" "}
          <Link href="/methodology/">Our methodology</Link>
        </p>
      </div>
    </section>
  );
}
