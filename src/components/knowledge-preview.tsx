import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Layers,
  Package,
  ArrowRight,
} from "lucide-react";
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
  const introduction = searchEntries(searchIndex, "GHK-Cu").find(
    (entry) =>
      entry.category === "Sources" &&
      entry.href === "/sources/#source-cir-peptides",
  );
  const cards = [
    ...(introduction
      ? [
          {
            title: introduction.name,
            detail:
              "Cosmetic safety assessment cited by this profile; not a finished-serum efficacy trial.",
            href: introduction.href,
            label: "SOURCE / SAFETY CONTEXT",
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
    <section
      className="knowledge-preview"
      aria-label="Connected exploration: Copper peptides"
    >
      <div className="preview-heading">
        <span>ONE CONNECTED EXPLORATION</span>
        <span>Ingredient · Source · Product</span>
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
        {cards
          .sort((a, b) =>
            a.label.startsWith("INGREDIENT")
              ? -1
              : b.label.startsWith("INGREDIENT")
                ? 1
                : 0,
          )
          .map((card) => (
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
