import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guides, guidePath } from "@/lib/guides";

export function LearningGuides({ slugs }: { slugs?: string[] }) {
  const selected = guides.filter(
    (guide) => !slugs || slugs.includes(guide.slug),
  );
  return (
    <section className="section" aria-label="Understand peptide labels">
      <span className="eyebrow">UNDERSTAND THE LABEL</span>
      <h2>Make sense of the names and numbers.</h2>
      <div className="question-grid label-guide-grid">
        {selected.map((guide) => (
          <Link
            className="question-card"
            key={guide.slug}
            href={guidePath(guide.slug)}
          >
            <span className="badge">
              {guide.status === "draft" ? "Editorial draft" : "Label guide"}
            </span>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <span className="text-link">
              Read the guide <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
