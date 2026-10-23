import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { haircare, hairProductPath, hairIngredientPath } from "@/lib/haircare";
import { HairPhoto } from "@/components/hair-photo";
export const metadata = {
  title: "Peptides in haircare",
  description:
    "Understand peptide scalp-serum labels and distinguish ingredient studies from finished-product evidence.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/haircare/" },
};

// Intent: readers exploring thinning-hair claims need a clear starting product,
// not a treatment ranking. DM Sans, petroleum ink, warm paper and 4px spacing
// reuse the library, with quiet borders separating labels from evidence.
export default function HaircarePage() {
  const p = haircare.product;
  return (
    <div className="wrap library-page haircare-page">
      <Link className="text-link" href="/topics/">
        ← All topics
      </Link>
      <header className="identify-intro">
        <span className="eyebrow">HAIR & SCALP · COSMETIC PROFILES</span>
        <h1>Look closer at your scalp serum.</h1>
        <p>
          Understand the label, explore the research and see what remains
          unanswered.
        </p>
      </header>
      <section
        id="product"
        className="hair-start"
        aria-labelledby="hair-start-title"
      >
        <Link
          href={hairProductPath}
          aria-label={`Explore ${p.brand} ${p.name}`}
        >
          <HairPhoto priority />
        </Link>
        <div>
          <span className="eyebrow">{p.brand}</span>
          <h2 id="hair-start-title">{p.name}</h2>
          <p>{p.volumeMl} mL · Leave-in scalp serum</p>
          <p className="identify-footnote">
            A source-checked label profile. Clinical interpretation is an
            editorial draft.
          </p>
          <Link className="button" href={hairProductPath}>
            Understand this serum <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section id="ingredients" className="hair-ingredient-links">
        <h2>Start with the peptide names</h2>
        <p>
          Different names, different evidence. Neither a blend name nor a
          peptide count is a quality score.
        </p>
        <div className="question-grid">
          {haircare.ingredients.map((i) => (
            <Link
              className="question-card"
              href={hairIngredientPath(i.slug)}
              key={i.slug}
            >
              <span className="badge">Ingredient explainer · Draft</span>
              <h3>{i.name}</h3>
              <p>{i.summary}</p>
              <span className="text-link">
                Explore the explanation <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <p className="identify-footnote">
        Scalp products are kept separate from facial-serum comparisons. Human
        editorial and qualified scientific review remain pending.
      </p>
    </div>
  );
}
