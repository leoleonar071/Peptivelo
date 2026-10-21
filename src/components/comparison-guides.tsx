import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalog } from "@/lib/data";

export function ComparisonGuides({ productId }: { productId?: string }) {
  const guides = catalog.comparisons.filter(
    (comparison) =>
      !productId || comparison.comparedProductIds.includes(productId),
  );
  return (
    <section className="section" aria-label="Buying questions, explained">
      <span className="eyebrow">BUYING QUESTIONS, EXPLAINED</span>
      <h2>Start with the difference you want to understand.</h2>
      <p>Source-linked drafts. Human editorial review is pending.</p>
      <div className="question-grid">
        {guides.map((guide) => (
          <Link
            className="question-card"
            key={guide.id}
            href={`/skincare/compare/${guide.slug}/`}
          >
            <span className="badge">Editorial draft</span>
            <h3>{guide.title}</h3>
            <p>{guide.buyerQuestion}</p>
            <span className="text-link">
              Read the comparison <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
