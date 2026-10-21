import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { products, catalog, brandName } from "@/lib/data";
import { productPath, ingredientPath } from "@/lib/config";
import { HeroSearch } from "./hero-search";

export function HomeHero() {
  const pair = ["ordinary-copper", "niod-cais3"].flatMap((id) =>
    products.filter((product) => product.id === id),
  );
  const entries = [
    ...products.map((product) => ({
      name: product.name,
      detail: `${brandName(product)} · ${product.volume} ${product.volumeUnit === "ml" ? "mL" : "fl oz"}`,
      terms: `${product.name} ${brandName(product)} ${product.ingredientList.join(" ")}`,
      href: productPath(product.slug),
    })),
    ...catalog.ingredients
      .filter((ingredient) => ingredient.status === "published")
      .map((ingredient) => ({
        name: ingredient.name,
        detail: "Ingredient guide",
        terms: `${ingredient.name} ${ingredient.inciName}`,
        href: ingredientPath(ingredient.slug),
      })),
  ];
  return (
    <section className="home-hero wrap" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-hero-eyebrow">
          INDEPENDENT PEPTIDE SKINCARE GUIDE · BETA
        </p>
        <h1 id="home-title">
          Understand peptide skincare <span>before you buy.</span>
        </h1>
        <p className="home-hero-description">
          Explore ingredients, see what the research actually tested, and
          compare products with sources you can check.
        </p>
        <HeroSearch entries={entries} />
        <div className="home-hero-links">
          <Link href="/skincare/compare/">
            Compare products <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/skincare/choose/">
            Start with a question <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="home-hero-trust">
          <li>
            <Check size={15} aria-hidden="true" /> Sources you can check
          </li>
          <li>
            <Check size={15} aria-hidden="true" /> Evidence limits explained
          </li>
        </ul>
        <p className="home-hero-review">
          Scientific interpretations pending qualified review.{" "}
          <Link href="/methodology/">Our methodology</Link>
        </p>
      </div>
      <aside
        className="hero-comparison"
        aria-labelledby="hero-comparison-title"
      >
        <div className="hero-comparison-heading">
          <span className="hero-preview-label">A LOOK INSIDE PEPTIVELO</span>
          <h2 id="hero-comparison-title">Compare beyond the label</h2>
          <p>
            See what products disclose, what the evidence covers, and what
            remains unknown.
          </p>
        </div>
        <div className="hero-comparison-products">
          {pair.map((product) => (
            <Link
              key={product.id}
              href={productPath(product.slug)}
              className="hero-comparison-product"
            >
              <div className="hero-product-photo">
                <Image
                  src={product.image}
                  width={200}
                  height={200}
                  sizes="(max-width: 639px) 120px, 160px"
                  alt={`${brandName(product)} ${product.name}, ${product.volume} mL bottle`}
                  priority
                />
              </div>
              <span className="hero-product-brand">{brandName(product)}</span>
              <strong>{product.name}</strong>
              <span className="hero-product-size">
                {product.volume} mL · Serum
              </span>
            </Link>
          ))}
        </div>
        <ol className="hero-comparison-dimensions">
          {[
            ["Ingredients", "What does each product disclose?"],
            ["Evidence", "Was the ingredient or the finished product studied?"],
            [
              "Price & unknowns",
              "Compare unit prices and identify missing information.",
            ],
          ].map(([title, description], index) => (
            <li key={title}>
              <span className="hero-dimension-number">0{index + 1}</span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          className="hero-comparison-action"
          href="/skincare/compare/niod-cais3-vs-the-ordinary/"
        >
          View comparison <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </aside>
    </section>
  );
}
