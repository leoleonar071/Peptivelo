import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Columns2,
  ScanLine,
  Calculator,
  Check,
  ArrowRight,
} from "lucide-react";
import { catalog } from "@/lib/data";
import { searchIndex } from "@/lib/search-index";
import { HeroSearch } from "./hero-search";
import { KnowledgePreview } from "./knowledge-preview";

// Intent: a curious reader needs a clear starting point, then a traceable source.
// Ivory paper, petroleum ink, shared Manrope/Inter; quiet surfaces, 4px spacing.
export function HomeHero() {
  return (
    <>
      <section className="home-hero wrap" aria-labelledby="home-title">
        <p className="home-hero-eyebrow">
          <span aria-hidden="true" />
          INDEPENDENT PEPTIDE KNOWLEDGE
        </p>
        <h1 id="home-title">
          Understand peptides. <span>Look beyond the claims.</span>
        </h1>
        <p className="home-hero-description">
          Explore peptide ingredients, research, and products in one place.
          Clear explanations, verifiable sources, and honest limits to what we
          know.
        </p>
        <HeroSearch entries={searchIndex} />
        <nav className="hero-shortcuts" aria-label="Peptivelo tools">
          {[
            {
              name: "Identify a product",
              href: "/skincare/identify/",
              icon: ScanLine,
            },
            {
              name: "Compare products",
              href: "/skincare/compare/",
              icon: Columns2,
            },
            {
              name: "Peptide library",
              href: "/library/",
              icon: BookOpen,
            },
            {
              name: "Price calculator",
              href: "/tools/price-per-ml/",
              icon: Calculator,
            },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <item.icon size={17} aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hero-start">
          <span>Suggested searches</span>
          {[
            "GHK-Cu",
            "Copper peptides",
            "Serum ingredients",
            "Peptide concentrations",
          ].map((query) => (
            <Link key={query} href={`/search/?q=${encodeURIComponent(query)}`}>
              {query}
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          ))}
        </div>
        <ul className="home-hero-trust">
          {[
            "Independent information",
            "Sources you can check",
            "Evidence limitations explained",
          ].map((text) => (
            <li key={text}>
              <Check size={14} aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <p className="home-hero-review">
          Scientific interpretations pending qualified review.{" "}
          <Link href="/methodology/">
            Our methodology <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
        </p>
        <KnowledgePreview />
      </section>
      <section
        className="knowledge-section wrap"
        aria-labelledby="knowledge-title"
      >
        <div className="knowledge-heading">
          <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
          <h2 id="knowledge-title">
            One place to explore
            <br />
            the world of peptides.
          </h2>
          <p>
            From ingredients and research to products and comparisons, find a
            clearer starting point.
          </p>
        </div>
        <div className="knowledge-grid">
          <Link className="knowledge-card knowledge-library" href="/library/">
            <div className="knowledge-card-top">
              <span>01 / UNDERSTAND</span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
            <div className="library-specimen" aria-hidden="true">
              <span>THE PEPTIDE LIBRARY</span>
              <strong>
                A name is just
                <br />
                the beginning.
              </strong>
              <div>
                <span>Identity</span>
                <span>Context</span>
                <span>Sources</span>
              </div>
            </div>
            <h3>Peptide Library</h3>
            <p>Explore peptides, terminology, uses, and research context.</p>
            <span className="knowledge-cta">
              Open the library <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
          <Link
            className="knowledge-card knowledge-guides"
            href="/skincare/guides/"
          >
            <div className="knowledge-card-top">
              <span>02 / DECODE</span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
            <div className="guide-specimen" aria-hidden="true">
              <span>READ BETWEEN THE LABELS</span>
              <strong>
                10<span>%</span>
              </strong>
              <p>Of the complex, or of the peptide?</p>
            </div>
            <h3>Ingredients &amp; Guides</h3>
            <p>Understand labels, concentrations, and common product claims.</p>
            <span className="knowledge-cta">
              Read the guides <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
          <Link
            className="knowledge-card knowledge-products"
            href="/skincare/products/"
          >
            <div className="knowledge-card-top">
              <span>03 / DISCOVER</span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
            <h3>Explore Products</h3>
            <p>
              Discover documented products and understand their ingredients.
            </p>
            <div className="catalog-specimen" aria-hidden="true">
              <span>Formula</span>
              <span>Label source</span>
              <span>Recorded size</span>
            </div>
            <span className="knowledge-cta">
              Explore the catalog <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
          <Link
            className="knowledge-card knowledge-compare"
            href="/skincare/compare/"
          >
            <div className="knowledge-card-top">
              <span>04 / LOOK CLOSER</span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
            <h3>Compare &amp; Evaluate</h3>
            <p>
              Compare formulations, prices, disclosures, and available evidence.
            </p>
            <div className="comparison-specimen" aria-hidden="true">
              <span>What is disclosed?</span>
              <span>What remains unknown?</span>
            </div>
            <span className="knowledge-cta">
              Start a comparison <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        </div>
        <div className="hero-brands">
          <span>Explore brands in our catalog</span>
          <div>
            {catalog.brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/search/?q=${encodeURIComponent(brand.name)}`}
              >
                {brand.name}
              </Link>
            ))}
          </div>
          <p>Catalog inclusion does not imply partnership or endorsement.</p>
        </div>
      </section>
    </>
  );
}
