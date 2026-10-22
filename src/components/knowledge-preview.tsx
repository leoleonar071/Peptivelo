import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Layers,
  Package,
  ArrowRight,
} from "lucide-react";
import { libraryArticles } from "@/lib/library";
import { searchIndex } from "@/lib/search-index";
import { searchEntries } from "@/lib/search";

// Intent: show a real reading path, from context to identity to a documented
// product. Quiet ivory/petroleum layers, existing Manrope/Inter and 4px rhythm.
export function KnowledgePreview() {
  const results = searchEntries(searchIndex, "Copper peptides");
  const ingredient = results.find(
    (entry) => entry.href === "/skincare/ingredients/copper-tripeptide-1/",
  );
  const product = results.find((entry) => entry.category === "Products");
  const introduction = libraryArticles.find(
    (article) => article.slug === "peptide-categories",
  );
  const cards = [
    ...(introduction
      ? [
          {
            title: introduction.title,
            detail: introduction.description,
            href: `/library/${introduction.slug}/`,
            label: "LIBRARY / THE CONTEXT",
            icon: BookOpen,
          },
        ]
      : []),
    ...(ingredient
      ? [
          {
            title: ingredient.name,
            detail: ingredient.detail,
            href: ingredient.href,
            label: "INGREDIENT / THE IDENTITY",
            icon: Layers,
          },
        ]
      : []),
    ...(product
      ? [
          {
            title: product.name,
            detail: product.detail,
            href: product.href,
            label: "PRODUCT / THE LABEL",
            icon: Package,
          },
        ]
      : []),
  ];
  return (
    <section className="knowledge-preview" aria-labelledby="preview-title">
      <div className="preview-heading">
        <h2 id="preview-title">A LOOK INSIDE PEPTIVELO</h2>
        <span>Explore · Understand · Compare</span>
      </div>
      <div className="preview-query">
        <div>
          <span className="preview-query-label">EXAMPLE EXPLORATION</span>
          <strong>Copper peptides</strong>
        </div>
        <Link href="/search/?q=Copper%20peptides">
          Explore results <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="preview-documents">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="preview-document">
            <span className="preview-category">
              <card.icon size={16} aria-hidden="true" />
              {card.label}
            </span>
            <h3>{card.title}</h3>
            <p>{card.detail}</p>
            <span className="preview-open">
              Read the page <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      <p className="preview-footnote">
        A starting point, with sources and limits on every page. Product
        information reflects the US catalog.
      </p>
    </section>
  );
}
