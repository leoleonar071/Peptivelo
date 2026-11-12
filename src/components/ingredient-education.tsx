import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { catalog, type Ingredient } from "@/lib/public-catalog";
import { ingredientPath } from "@/lib/config";

export function EvidenceLinks({
  ids,
  sources = catalog.sources,
}: {
  ids: string[];
  sources?: typeof catalog.sources;
}) {
  return (
    <ul className="education-sources" aria-label="Sources for this explanation">
      {ids.map((id) => {
        const source = sources.find((s) => s.id === id);
        if (!source) return null;
        return (
          <li key={id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title} <ArrowUpRight size={14} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function IngredientEducation({
  ingredient,
  compact = false,
  guideHref,
  scientificReviewed = false,
}: {
  ingredient: Ingredient;
  compact?: boolean;
  guideHref?: string;
  scientificReviewed?: boolean;
}) {
  const info = ingredient.education;
  const Heading = compact ? "h3" : "h2";
  const DetailContainer = compact ? "div" : "details";
  const sections = [
    ["What it is", info.whatItIs],
    ["Why it is used", info.purpose],
    ["What the evidence means", info.evidence],
    ["Precautions and possible reactions", info.precautions],
  ] as const;
  return (
    <div className={`ingredient-education ${compact ? "is-compact" : ""}`}>
      {!compact && (
        <section className="ingredient-quick-answer">
          <h2>In brief</h2>
          <p>{info.summary}</p>
          <p>{ingredient.knownLimitations}</p>
        </section>
      )}
      <p className="education-kind">
        Type of support: <strong>{info.evidence.label}</strong>
      </p>
      {!scientificReviewed && (
        <p className="education-date">
          Qualified scientific review pending. A source check is not scientific
          approval.
        </p>
      )}
      <DetailContainer className="ingredient-detailed">
        {!compact && (
          <summary>Explore detailed evidence and precautions</summary>
        )}
        {sections.map(([title, section]) => (
          <section key={title}>
            <Heading>{title}</Heading>
            <p>{section.text}</p>
            {title === "Precautions and possible reactions" && (
              <p>
                Cosmetics can cause irritation or allergic reactions. Check the
                full ingredient list and follow product directions.
              </p>
            )}
            <EvidenceLinks
              ids={
                title === "Precautions and possible reactions"
                  ? [...section.sourceIds, "fda-cosmetic-reactions"]
                  : section.sourceIds
              }
            />
          </section>
        ))}
        <section className="education-takeaway">
          <Heading>What this means for your comparison</Heading>
          <p>{info.takeaway}</p>
        </section>
      </DetailContainer>
      <p className="education-date">
        Sources checked{" "}
        <time dateTime={info.sourceCheckedAt}>{info.sourceCheckedAt}</time>.
        Ingredient information is separate from testing a finished serum.
      </p>
      {compact && (
        <Link
          className="button secondary"
          href={guideHref ?? ingredientPath(ingredient.slug)}
        >
          Read the full ingredient guide <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
