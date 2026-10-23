"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { brandName, type Product } from "@/lib/data";
import { comparisonFacts, volumeLabel } from "@/lib/comparison";
import { money, normalize } from "@/lib/math";
import type { ComparisonEvidenceData } from "@/lib/comparison-evidence";
import { ComparisonGrid } from "./comparison-grid";
import { ComparisonEvidenceV2 } from "./comparison-evidence-v2";

function GlanceCell({
  product,
  index,
  children,
}: {
  product: Product;
  index: number;
  children: ReactNode;
}) {
  return (
    <td>
      <span className="v2-cell-identity">
        <span className="v2-letter">{index === 0 ? "A" : "B"}</span>
        {brandName(product)}
      </span>
      {children}
    </td>
  );
}

export function ComparisonHero({ complete }: { complete: boolean }) {
  return (
    <header className={`v2-hero ${complete ? "is-complete" : ""}`}>
      <span className="eyebrow">PEPTIVELO · COMPARISON</span>
      <h1>Compare with clarity.</h1>
      <p>
        Explore documented differences. Understand the evidence. Check the
        sources.
      </p>
    </header>
  );
}
export function ComparisonV2({
  a,
  b,
  selectors,
  evidence,
}: {
  a: Product;
  b: Product;
  selectors: [ReactNode, ReactNode];
  evidence?: ComparisonEvidenceData;
}) {
  const facts = comparisonFacts(a, b);
  const pair = [a, b] as const;
  const volumes = pair.map((p) => normalize(0, p.volume, p.volumeUnit)!.ml);
  const lower =
    facts.cost.kind === "different"
      ? facts.cost.lower === "a"
        ? "A"
        : "B"
      : null;
  return (
    <>
      <div
        className="v2-selected-pair"
        aria-label="Products in this comparison"
      >
        {selectors}
      </div>
      <section className="v2-glance" aria-labelledby="comparison-result-title">
        <div className="v2-section-title">
          <h2 id="comparison-result-title" tabIndex={-1}>
            At a glance
          </h2>
          <span>Documented information · {evidence?.market ?? "US"} / USD</span>
        </div>
        <table className="v2-glance-table">
          <caption>
            Key recorded differences: A — {brandName(a)} {a.name}; B —{" "}
            {brandName(b)} {b.name}
          </caption>
          <thead>
            <tr>
              <th scope="col">Recorded fact</th>
              {pair.map((p, i) => (
                <th key={i} scope="col">
                  <span className="v2-letter">{i === 0 ? "A" : "B"}</span>{" "}
                  {brandName(p)}
                  <small>{p.name}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Volume</th>
              {pair.map((p, i) => (
                <GlanceCell key={p.id} product={p} index={i}>
                  {volumeLabel(p)}
                </GlanceCell>
              ))}
            </tr>
            <tr>
              <th scope="row">Recorded price</th>
              {pair.map((p, i) => (
                <GlanceCell key={p.id} product={p} index={i}>
                  {facts.observations[i] ? (
                    <>
                      {money(facts.observations[i]!.price)} USD
                      <small>
                        Recorded{" "}
                        <time dateTime={facts.observations[i]!.observedAt}>
                          {facts.observations[i]!.observedAt}
                        </time>
                      </small>
                    </>
                  ) : (
                    <span>Price unavailable</span>
                  )}
                </GlanceCell>
              ))}
            </tr>
            <tr>
              <th scope="row">Price per mL</th>
              {pair.map((p, i) => (
                <GlanceCell key={p.id} product={p} index={i}>
                  {facts.costs[i]
                    ? `${money(facts.costs[i]!.perMl)} / mL`
                    : "Unavailable"}
                </GlanceCell>
              ))}
            </tr>
            <tr className="v2-peptide-overview">
              <th scope="row">
                Selected peptide names
                <small>Selections, not complete formulas</small>
              </th>
              {pair.map((p, i) => (
                <GlanceCell key={p.id} product={p} index={i}>
                  <div>
                    {p.ingredientList.slice(0, 2).map((name) => (
                      <span key={name}>{name}</span>
                    ))}
                  </div>
                  <a href="#comparison-peptides">
                    Explore all {p.ingredientList.length} recorded names →
                  </a>
                </GlanceCell>
              ))}
            </tr>
          </tbody>
        </table>
        <ul
          className="v2-observations"
          id="comparison-meaning-title"
          tabIndex={-1}
        >
          <li>
            {lower
              ? `${lower} has the lower recorded cost per mL. This does not establish better results.`
              : facts.cost.kind === "equal"
                ? "Recorded cost per mL is equal; formula equivalence is not established."
                : "A size-specific price is missing; a complete cost comparison is unavailable."}
          </li>
          <li>
            {volumes[0] === volumes[1]
              ? "The recorded volumes are equal."
              : `${volumes[0] > volumes[1] ? "A" : "B"} has the larger recorded volume; volume does not establish efficacy.`}
          </li>
          <li>
            {facts.labels.shared.length
              ? `${facts.labels.shared.length} selected ingredient names match. Concentrations and remaining formula may differ.`
              : "No exact matches in the selected peptide names. Partial lists do not establish full-formula differences."}
          </li>
        </ul>
        <p className="v2-essential-note">
          Selected labels are incomplete. Concentrations and comparative
          clinical effectiveness may be unknown. Check the full package and
          directions; ingredient names cannot predict an individual reaction.
          Scientific interpretations remain pending qualified review.{" "}
          <a
            href="https://www.fda.gov/cosmetics/cosmetic-ingredients/allergens-cosmetics"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA: cosmetic reactions and precautions ↗
          </a>
        </p>
        <div className="v2-related-links">
          <a href="#comparison-peptides">See the label differences →</a>
          <a href="#source-details">Check sources & gaps →</a>
        </div>
      </section>
      <ComparisonGrid a={a} b={b} variant="v2" />
      <ComparisonEvidenceV2 a={a} b={b} data={evidence} />
      <div className="v2-related-links">
        <Link href={`/skincare/products/${a.slug}/`}>Product A profile →</Link>
        <Link href={`/skincare/products/${b.slug}/`}>Product B profile →</Link>
        <Link href="/skincare/guides/">Label guides →</Link>
        <Link href="/tools/price-per-ml/">Use your own prices →</Link>
      </div>
    </>
  );
}
