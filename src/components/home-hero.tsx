import Link from "next/link";
import { searchIndex } from "@/lib/search-index";
import { HeroSearch } from "./hero-search";
export function HomeHero() {
  return (
    <section className="home-hero wrap" aria-labelledby="home-title">
      <p className="home-hero-eyebrow">
        <span aria-hidden="true" />
        INDEPENDENT PEPTIDE KNOWLEDGE
      </p>
      <h1 id="home-title">
        Understand peptides. <span>Look beyond the claims.</span>
      </h1>
      <p className="home-hero-description">
        Explore peptides, ingredients, products and research. Start with a
        topic, then follow the evidence and its limits.
      </p>
      <HeroSearch entries={searchIndex} />
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
    </section>
  );
}
