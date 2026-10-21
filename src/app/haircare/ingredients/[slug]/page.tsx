import Link from "next/link";
import { notFound } from "next/navigation";
import {
  haircare,
  hairProductPath,
  hairIngredientPath,
  hairIngredientCitations,
} from "@/lib/haircare";
import { Citations, References } from "@/components/citations";
import { LibraryDisclosures } from "@/components/library-disclosures";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const i = haircare.ingredients.find((i) => i.slug === slug);
  return {
    title: i ? `${i.name}: haircare evidence explained` : "Not found",
    description: i?.summary,
    robots: { index: false, follow: true },
    alternates: { canonical: hairIngredientPath(slug) },
  };
}
// Intent: explain a scalp-label name without implying a medical recommendation.
// Reuse the library’s DM Sans, warm paper answer, quiet disclosure borders and
// 4px spacing; technical scope remains adjacent to the finding.
export default async function HairIngredientPage({ params }: Props) {
  const { slug } = await params;
  const ingredient = haircare.ingredients.find((entry) => entry.slug === slug);
  if (!ingredient) notFound();
  const citations = hairIngredientCitations(ingredient);
  return (
    <article className="wrap library-page haircare-page">
      <LibraryDisclosures>
        <Link className="text-link" href="/haircare/">
          ← Hair & scalp
        </Link>
        <header className="identify-intro">
          <span className="eyebrow">SCALP INGREDIENT · EDITORIAL DRAFT</span>
          <h1>{ingredient.name}</h1>
          <p>{ingredient.summary}</p>
        </header>
        <section className="library-answer">
          <h2>What is it doing on the label?</h2>
          <p>
            {ingredient.identity}
            <Citations set={citations} claim="identity" />
          </p>
        </section>
        <details className="reader-disclosure">
          <summary>
            <span>
              What does the evidence support?<small>{ingredient.support}</small>
            </span>
            <span className="reader-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="reader-disclosure-body">
            <p>
              {ingredient.evidence}
              <Citations set={citations} claim="evidence" />
            </p>
            <p className="hair-reading-limit">{ingredient.limit}</p>
          </div>
        </details>
        <p className="identify-footnote">
          Checked {haircare.product.checkedAt} · Human editorial and qualified
          scientific review pending. This profile does not establish individual
          tolerance.
        </p>
        <details className="reader-disclosure">
          <summary>
            <span>References and their limits</span>
            <span className="reader-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <References set={citations} />
        </details>
        <Link className="button" href={hairProductPath}>
          Back to the scalp-serum profile →
        </Link>
      </LibraryDisclosures>
    </article>
  );
}
