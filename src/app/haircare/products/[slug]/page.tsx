import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  haircare,
  hairProductPath,
  hairIngredientPath,
  hairProductCitations,
} from "@/lib/haircare";
import { catalog } from "@/lib/data";
import { money } from "@/lib/math";
import { HairPhoto } from "@/components/hair-photo";
import { Citations, References } from "@/components/citations";
import { LibraryDisclosures } from "@/components/library-disclosures";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title:
      slug === haircare.product.slug
        ? "The Ordinary Hair Density Serum: ingredients & evidence"
        : "Not found",
    description:
      "Understand the 60 mL scalp serum, its selected peptide ingredients and the limits of a related formulation trial.",
    robots: { index: false, follow: true },
    alternates: { canonical: hairProductPath },
  };
}

// Intent: recognize the exact scalp bottle, get a short answer, then choose
// ingredient or study detail. Existing DM Sans, paper/mineral surfaces,
// petroleum text, quiet borders and 4px spacing preserve reading continuity.
export default async function HairProductPage({ params }: Props) {
  if ((await params).slug !== haircare.product.slug) notFound();
  const p = haircare.product;
  const citations = hairProductCitations();
  const source = catalog.sources.find((s) => s.id === p.sourceId)!;
  return (
    <article className="wrap library-page haircare-page">
      <LibraryDisclosures>
        <Link className="text-link" href="/haircare/">
          ← Hair & scalp
        </Link>
        <div className="hair-product-heading">
          <HairPhoto priority />
          <header>
            <span className="eyebrow">{p.brand} · SCALP SERUM</span>
            <h1>{p.name}</h1>
            <p>{p.volumeMl} mL · Water-based leave-in cosmetic</p>
            <p className="hair-price">
              <strong>{money(p.priceUsd)} USD</strong>
              <span>
                {money(p.priceUsd / p.volumeMl)} / mL · Recorded {p.checkedAt}
                <Citations set={citations} claim="price" />
              </span>
            </p>
          </header>
        </div>
        <p className="identify-footnote">
          Editorial draft · Scientific review pending · US label checked{" "}
          {p.checkedAt}
        </p>
        <section className="library-answer">
          <h2>What should I know first?</h2>
          <p>
            The brand positions this as a cosmetic for fuller-looking hair. The
            selected peptides are Biotinoyl Tripeptide-1 and Acetyl
            Tetrapeptide-3.
            <Citations set={citations} claim="label" />
          </p>
          <p className="hair-reading-limit">
            Ingredient or blend research is separate from evidence for this
            finished bottle.
          </p>
        </section>
        <section aria-label="Explore the scalp serum">
          <details className="reader-disclosure">
            <summary>
              <span>
                Which peptides are in it?
                <small>Selected names, not the complete formula</small>
              </span>
              <span className="reader-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="reader-disclosure-body">
              {haircare.ingredients.map((i) => (
                <section key={i.slug}>
                  <h3>{i.name}</h3>
                  <p>
                    {i.identity}
                    <Citations set={citations} claim={`ingredient-${i.slug}`} />
                  </p>
                  <Link className="text-link" href={hairIngredientPath(i.slug)}>
                    Understand this ingredient →
                  </Link>
                </section>
              ))}
              <p>
                Check the full current package; formulas can vary by date and
                market. Blend percentages are not verified pure-peptide amounts.
              </p>
            </div>
          </details>
          <details className="reader-disclosure" id="hair-research">
            <summary>
              <span>
                What does the research tell us?
                <small>A different formula, not a test of this bottle</small>
              </span>
              <span className="reader-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="reader-disclosure-body">
              <p>
                A 24-week randomized trial in 32 people compared another
                combination containing Acetyl Tetrapeptide-3 with 3% minoxidil.
                Both groups improved.
                <Citations set={citations} claim="research" />
              </p>
              <p className="hair-reading-limit">
                <strong>Our interpretation:</strong> this does not establish how
                The Ordinary serum performs. A nonsignificant difference between
                treatments is not proof of equivalence. The study cannot isolate
                the peptide’s contribution.
              </p>
              <p className="identify-footnote">
                This is one selected formulation study, not a complete review of
                hair-loss treatments.
              </p>
            </div>
          </details>
          <details className="reader-disclosure">
            <summary>
              <span>
                Before you use it
                <small>The manufacturer’s directions and precautions</small>
              </span>
              <span className="reader-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="reader-disclosure-body">
              <p>
                The brand describes once-daily use on a clean, dry scalp and
                advises patch testing. If irritation develops, it says to rinse,
                stop use and consult a physician. Follow your current package.
                <Citations set={citations} claim="directions" />
              </p>
            </div>
          </details>
        </section>
        <details className="reader-disclosure" id="hair-references">
          <summary>
            <span>
              References and access limits
              <small>Study design, disclosures and what was inspected</small>
            </span>
            <span className="reader-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <References set={citations} />
        </details>
        <section className="hair-retailer">
          <h2>Check the current offer</h2>
          <p>
            Recorded price excludes tax and shipping. Confirm the size and
            current offer with the brand.
          </p>
          <a
            className="button"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit The Ordinary <ArrowUpRight size={17} />
          </a>
          <small>
            Manufacturer link · No affiliate commission on this link
          </small>
        </section>
      </LibraryDisclosures>
    </article>
  );
}
