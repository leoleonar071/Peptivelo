"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  Search,
  Plus,
  X,
  Check,
  ArrowUpRight,
  ArrowRight,
  ArrowLeftRight,
  ChevronDown,
  Coins,
  Layers,
  BookOpen,
  Copy,
  FlaskConical,
} from "lucide-react";
import {
  products,
  catalog,
  brandName,
  sourceFor,
  type Product,
} from "@/lib/data";
import { comparisonFacts, volumeLabel } from "@/lib/comparison";
import { money } from "@/lib/math";
import { productPath } from "@/lib/config";
import { track } from "@/lib/analytics";
import { Bottle, VerifiedDate, SourceList } from "./ui";

import { ComparisonGrid } from "./comparison-grid";
import { IngredientHelp } from "./ingredient-help";

import { useClientReady } from "@/lib/use-client-ready";

function ProductPrice({ product }: { product: Product }) {
  const { observations, costs } = comparisonFacts(product, product);
  const p = observations[0];
  return (
    <span className="picker-price">
      {p ? (
        <>
          <strong>{money(p.price)}</strong>
          <span>
            {volumeLabel(product)} · {money(costs[0]!.perMl)}/mL
          </span>
          <small>Price recorded {p.verifiedAt}</small>
        </>
      ) : (
        <>
          <strong>Price not verified</strong>
          <span>{volumeLabel(product)} · No unit cost available</span>
        </>
      )}
    </span>
  );
}

export function ProductSelector({
  slot,
  product,
  other,
  onChange,
  disabled,
  compact = false,
}: {
  slot: 1 | 2;
  product?: Product;
  other?: Product;
  onChange: (id: string) => void;
  disabled: boolean;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const slotName = slot === 1 ? "first" : "second";
  const matches = products.filter((p) =>
    `${brandName(p)} ${p.name} ${p.ingredientList.join(" ")}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
  function show() {
    setQuery("");
    dialog.current?.showModal();
    setOpen(true);
    search.current?.focus();
  }
  function dismiss() {
    dialog.current?.close();
  }
  function navigateResults(event: React.KeyboardEvent) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const choices = Array.from(
      dialog.current?.querySelectorAll<HTMLButtonElement>(
        "[data-product-option]:not(:disabled)",
      ) ?? [],
    );
    if (!choices.length) return;
    event.preventDefault();
    const index = choices.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? choices.length - 1
          : event.key === "ArrowUp"
            ? index <= 0
              ? choices.length - 1
              : index - 1
            : (index + 1) % choices.length;
    choices[next].focus();
  }
  return (
    <article
      className={`compare-slot ${product ? "is-selected" : ""} ${compact ? "matrix-selector" : ""}`}
      aria-label={`Product ${slot}`}
    >
      <div className="slot-top">
        <span className="slot-marker">{slot === 1 ? "A" : "B"}</span>
        <span>PRODUCT {slot}</span>
        {product && (
          <button
            className="slot-remove"
            disabled={disabled}
            onClick={() => onChange("")}
            aria-label={`Remove product ${slot}`}
          >
            <X size={16} />
          </button>
        )}
      </div>
      {product ? (
        <>
          <div className="selected-product">
            <div className="mini-bottle" aria-hidden="true">
              <Bottle product={product} />
            </div>
            <div className="selected-copy">
              <span className="eyebrow">{brandName(product)}</span>
              <h2>
                <Link href={productPath(product.slug)}>{product.name}</Link>
              </h2>
              <ProductPrice product={product} />
            </div>
          </div>
          <div className="slot-bottom">
            <VerifiedDate date={product.lastVerifiedAt} />
            <button
              ref={trigger}
              className="text-link"
              aria-haspopup="dialog"
              aria-controls={id}
              disabled={disabled}
              onClick={show}
            >
              Change product {slot} <ArrowLeftRight size={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            ref={trigger}
            className="empty-slot-trigger"
            aria-haspopup="dialog"
            aria-controls={id}
            disabled={disabled}
            onClick={show}
          >
            <span className="add-product-icon">
              <Plus size={24} />
            </span>
            Choose {slotName} product <ArrowRight size={18} />
          </button>
          <p className="slot-help">Search by product, brand, or ingredient.</p>
          <span className="slot-empty-note">
            {slot === 2 && other
              ? "Your first product is ready. Add another to see the differences."
              : "A source-checked label, with the gaps left visible."}
          </span>
        </>
      )}
      <dialog
        id={id}
        ref={dialog}
        className="product-picker-dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dismiss();
        }}
      >
        <div className="picker-inner">
          <div className="picker-header">
            <div>
              <span className="eyebrow">YOUR COMPARISON / PRODUCT {slot}</span>
              <h2 id={`${id}-title`}>Choose your {slotName} product.</h2>
              <p id={`${id}-description`}>
                Recognize the label. Check the size. See what’s documented.
              </p>
            </div>
            <button
              className="picker-close"
              onClick={dismiss}
              aria-label="Close product picker"
            >
              <X size={21} />
            </button>
          </div>
          <div className="picker-search">
            <Search size={20} />
            <input
              ref={search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={navigateResults}
              aria-label="Search products in picker"
              placeholder="Try a brand, product, or peptide…"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  search.current?.focus();
                }}
                aria-label="Clear product search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="picker-results-heading">
            <span role="status">
              {matches.length} {matches.length === 1 ? "product" : "products"}{" "}
              in this catalog
            </span>
            <span>US LABELS · USD</span>
          </div>
          <div className="picker-results" onKeyDown={navigateResults}>
            {matches.map((p) => {
              const unavailable = p.id === other?.id;
              return (
                <button
                  key={p.id}
                  data-product-option
                  className={`picker-option ${p.id === product?.id ? "current" : ""}`}
                  disabled={unavailable}
                  onClick={() => {
                    onChange(p.id);
                    dismiss();
                  }}
                >
                  <span className="mini-bottle" aria-hidden="true">
                    <Bottle product={p} />
                  </span>
                  <span className="picker-option-copy">
                    <span className="eyebrow">{brandName(p)}</span>
                    <strong className="picker-product-name">{p.name}</strong>
                    <span className="picker-peptide">
                      Selected label: {p.ingredientList.slice(0, 2).join(" · ")}
                    </span>
                    <span className="picker-option-status">
                      {unavailable
                        ? `Already selected as product ${slot === 1 ? 2 : 1}`
                        : p.id === product?.id
                          ? "Currently selected"
                          : `Label source checked ${p.lastVerifiedAt}`}
                    </span>
                  </span>
                  <span className="picker-option-side">
                    <ProductPrice product={p} />
                    <span className="picker-choice">
                      {unavailable ? (
                        "Selected"
                      ) : p.id === product?.id ? (
                        <>
                          <Check size={15} /> Selected
                        </>
                      ) : (
                        <>
                          Choose <ArrowRight size={16} />
                        </>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
            {!matches.length && (
              <div className="picker-empty">
                <Search size={28} />
                <h3>No matching products yet.</h3>
                <p>
                  Try another brand or ingredient. We only show records in our
                  sourced catalog.
                </p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setQuery("");
                    search.current?.focus();
                  }}
                >
                  Show all products
                </button>
              </div>
            )}
          </div>
          <div className="picker-footer">
            <BookOpen size={16} />
            <span>
              Label facts, not product ratings. Photographs show the recorded
              product variants; check each presentation before buying.
            </span>
          </div>
        </div>
      </dialog>
    </article>
  );
}

function PairedFact({
  label,
  a,
  b,
  children,
}: {
  label: string;
  a: Product;
  b: Product;
  children: (p: Product, index: number) => React.ReactNode;
}) {
  return (
    <div className="paired-fact">
      <h3>{label}</h3>
      <div className="paired-values">
        {[a, b].map((p, index) => (
          <div className="paired-value" key={p.id}>
            <span className="paired-identity">
              <span className="slot-marker">{index === 0 ? "A" : "B"}</span>
              {brandName(p)}
            </span>
            {children(p, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

function revealDetail(id: string) {
  const detail = document.getElementById(id);
  if (detail instanceof HTMLDetailsElement) detail.open = true;
}

export function ComparisonTable({
  a,
  b,
  controls,
  showGuide = true,
}: {
  a: Product;
  b: Product;
  controls?: [React.ReactNode, React.ReactNode];
  showGuide?: boolean;
}) {
  useEffect(() => {
    // Follow a link into a specific disclosure, including links above a closed <details>.
    function reveal() {
      const target = document.getElementById(location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    }
    window.addEventListener("hashchange", reveal);
    reveal();
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  const facts = comparisonFacts(a, b);
  const guide = catalog.comparisons.find(
    (comparison) =>
      comparison.comparedProductIds.includes(a.id) &&
      comparison.comparedProductIds.includes(b.id),
  );
  const { labels, cost } = facts;
  const lower = cost.kind === "different" ? (cost.lower === "a" ? a : b) : null;
  return (
    <section
      className="comparison-notebook"
      aria-labelledby="comparison-result-title"
    >
      <div className="notebook-heading">
        <div>
          <span className="eyebrow">THE DIFFERENCES, WITH CONTEXT</span>
          <h2 id="comparison-result-title" tabIndex={-1}>
            Your comparison, at a glance.
          </h2>
        </div>
        <span className="notebook-tag">
          <Check size={14} /> Based on recorded label facts
        </span>
      </div>
      <ComparisonGrid a={a} b={b} controls={controls} />
      {showGuide && guide && (
        <p className="section-intro">
          <Link className="text-link" href={`/skincare/compare/${guide.slug}/`}>
            Understand this buying decision · Editorial draft{" "}
            <ArrowRight size={16} />
          </Link>
        </p>
      )}
      <section
        className="comparison-meaning"
        aria-labelledby="comparison-meaning-title"
      >
        <h2 id="comparison-meaning-title">What these differences mean</h2>
        <div>
          <article>
            <h3>Different names do not tell us which serum works better.</h3>
            <p>
              {labels.shared.length
                ? "Some selected ingredient names match, but amounts and the rest of each formula may differ."
                : "The selected peptide names differ. The complete formulas may still share other ingredients."}{" "}
              Open an ingredient explanation to see its intended use and the
              kind of evidence behind it.
            </p>
          </article>
          <article>
            <h3>Check the whole product for precautions.</h3>
            <p>
              An ingredient name cannot predict your skin’s reaction. Cosmetics
              can cause irritation or allergic reactions. Check the complete
              label and follow the product directions.
            </p>
            <a
              href="https://www.fda.gov/cosmetics/cosmetic-ingredients/allergens-cosmetics"
              target="_blank"
              rel="noopener noreferrer"
            >
              FDA: cosmetic reactions and precautions <ArrowUpRight size={14} />
            </a>
          </article>
          <article>
            <h3>One ingredient study does not rank these serums.</h3>
            <p>
              Studies of an ingredient, supplier descriptions and brand claims
              answer different questions. We have not recorded an independent
              head-to-head study of these two serums.
              {cost.kind === "missing"
                ? " A missing price also prevents a complete cost comparison."
                : " Lower cost per mL does not establish better results."}
            </p>
          </article>
        </div>
      </section>
      <aside
        className="matrix-interpretation"
        aria-label="How to interpret these details"
      >
        <div>
          <h3>
            {cost.kind === "missing"
              ? "We can’t compare prices yet."
              : cost.kind === "equal"
                ? "The same cost per mL."
                : `${brandName(lower!)} costs less per mL.`}
          </h3>
          <p>
            {cost.kind === "missing"
              ? "One size-specific price is missing. We can’t identify a cheaper option from incomplete data."
              : cost.kind === "different"
                ? `${cost.percent.toFixed(1)}% lower per mL, relative to the more expensive product. This measures price, not effectiveness.`
                : "Equal unit cost does not establish equal skincare results."}
          </p>
        </div>
        <div className="matrix-context-links">
          <a
            href="#ingredient-details"
            onClick={() => revealDetail("ingredient-details")}
          >
            See the label differences <ArrowRight size={15} />
          </a>
          <a
            href="#source-details"
            onClick={() => revealDetail("source-details")}
          >
            Check sources & gaps <ArrowRight size={15} />
          </a>
        </div>
      </aside>
      <div className="comparison-detail-heading">
        <h2>Go a little deeper.</h2>
        <span>Open the questions that matter to you.</span>
      </div>
      <div className="comparison-accordions">
        <details className="comparison-detail">
          <summary>
            <span className="detail-icon">
              <Coins size={20} />
            </span>
            <span>
              <strong>Price & size</strong>
              <small>Compare the same amount, not just the bottle price.</small>
            </span>
            <ChevronDown size={19} />
          </summary>
          <div className="detail-body">
            <PairedFact label="Recorded price" a={a} b={b}>
              {(p, i) => (
                <>
                  <strong className="fact-price">
                    {facts.observations[i]
                      ? money(facts.observations[i]!.price)
                      : "Not verified for this size"}
                  </strong>
                  <span>{volumeLabel(p)}</span>
                  {facts.observations[i] && (
                    <small>
                      USD · Recorded {facts.observations[i]!.verifiedAt}
                    </small>
                  )}
                </>
              )}
            </PairedFact>
            <PairedFact label="Cost for the same amount" a={a} b={b}>
              {(_, i) =>
                facts.costs[i] ? (
                  <>
                    <strong>{money(facts.costs[i]!.perMl)} / mL</strong>
                    <span>{money(facts.costs[i]!.perOz)} / US fl oz</span>
                  </>
                ) : (
                  <span>
                    Unavailable until the size-specific price is verified.
                  </span>
                )
              }
            </PairedFact>
            <p className="detail-note">
              Prices are dated observations, excluding tax and shipping. Stock
              and current checkout prices are not verified. One US fl oz equals
              29.5735295625 mL.
            </p>
            <Link className="text-link" href="/tools/price-per-ml/">
              Have a different price? Use the calculator{" "}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </details>
        <details className="comparison-detail" id="ingredient-details">
          <summary>
            <span className="detail-icon">
              <Layers size={20} />
            </span>
            <span>
              <strong>Ingredients</strong>
              <small>
                Shared names, different names, and the limits of the label.
              </small>
            </span>
            <ChevronDown size={19} />
          </summary>
          <div className="detail-body">
            <div className="shared-ingredients">
              <h3>Shared exact names in this selection</h3>
              <p>
                {labels.shared.length
                  ? labels.shared.join(", ")
                  : "No exact matches in the selected peptide names. This does not mean there is no overlap in the full ingredient lists."}
              </p>
            </div>
            <PairedFact
              label="Names recorded only on this selected label"
              a={a}
              b={b}
            >
              {(_, i) => (
                <ul className="ingredient-name-list">
                  {(i === 0 ? labels.onlyA : labels.onlyB).map((name) => (
                    <li key={name}>
                      <IngredientHelp
                        name={name}
                        comparisonQuery={new URLSearchParams({
                          a: a.id,
                          b: b.id,
                        }).toString()}
                      />
                    </li>
                  ))}
                  {!(i === 0 ? labels.onlyA : labels.onlyB).length && (
                    <li>No unique names in this selection.</li>
                  )}
                </ul>
              )}
            </PairedFact>
            <details className="term-explainer">
              <summary>What does “exact name” mean?</summary>
              <p>
                We match the written ingredient name, ignoring letter case. We
                do not merge differently named chemical forms. The same name
                does not establish the same concentration, delivery, or effect.
              </p>
            </details>
            <p className="detail-note">
              {a.ingredientListScope}{" "}
              {b.ingredientListScope !== a.ingredientListScope
                ? b.ingredientListScope
                : ""}
            </p>
          </div>
        </details>
        <details className="comparison-detail">
          <summary>
            <span className="detail-icon">
              <FlaskConical size={20} />
            </span>
            <span>
              <strong>How much is in the formula?</strong>
              <small>
                What the brands disclose, without filling in the blanks.
              </small>
            </span>
            <ChevronDown size={19} />
          </summary>
          <div className="detail-body">
            <PairedFact label="What the brand tells us" a={a} b={b}>
              {(p) => <p>{p.concentrationDisclosure}</p>}
            </PairedFact>
            <p className="detail-note">
              A disclosed blend percentage does not automatically establish
              every ingredient’s concentration. These are brand disclosures, not
              independent laboratory measurements.
            </p>
          </div>
        </details>
        <details className="comparison-detail" id="source-details">
          <summary>
            <span className="detail-icon">
              <BookOpen size={20} />
            </span>
            <span>
              <strong>Sources & missing information</strong>
              <small>Follow the facts and see what remains unverified.</small>
            </span>
            <ChevronDown size={19} />
          </summary>
          <div className="detail-body">
            <PairedFact label="Label source" a={a} b={b}>
              {(p) => (
                <>
                  <a
                    className="text-link"
                    href={sourceFor(p).url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {brandName(p)} label <ArrowUpRight size={14} />
                  </a>
                  <VerifiedDate date={p.lastVerifiedAt} />
                  <p>{p.formulationNotes}</p>
                  <Link className="text-link" href={productPath(p.slug)}>
                    View product profile <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </PairedFact>
            <h3>What we cannot determine</h3>
            <ul className="missing-list">
              <li>
                Concentrations that the manufacturer has not individually
                disclosed.
              </li>
              <li>
                Complete ingredient overlap from the selections recorded here.
              </li>
              <li>
                Comparative effectiveness or how either formula will work for
                your skin.
              </li>
              {facts.observations.some((p) => !p) && (
                <li>
                  A reliable price comparison until both exact sizes have
                  verified prices.
                </li>
              )}
            </ul>
            <SourceList ids={[a.sourceId, b.sourceId]} />
            <Link className="text-link" href="/methodology/">
              Read our comparison methodology <ArrowRight size={14} />
            </Link>
          </div>
        </details>
      </div>
    </section>
  );
}

export function Compare({
  first,
  second,
}: {
  first?: string;
  second?: string;
}) {
  const ready = useClientReady();
  const initialA = products.find((p) => p.id === first)?.id ?? "";
  const initialB =
    products.find((p) => p.id === second && p.id !== initialA)?.id ?? "";
  const [selection, setSelection] = useState<[string, string]>([
    initialA,
    initialB,
  ]);
  const [shareStatus, setShareStatus] = useState("");
  const a = products.find((p) => p.id === selection[0]);
  const b = products.find((p) => p.id === selection[1]);
  const count = Number(!!a) + Number(!!b);
  const workspace = useRef<HTMLDivElement>(null);
  const previousCount = useRef(count);
  useEffect(() => {
    if (previousCount.current !== count) {
      if (count === 2)
        workspace.current
          ?.querySelector<HTMLElement>("#comparison-result-title")
          ?.focus();
      else if (previousCount.current === 2)
        workspace.current
          ?.querySelector<HTMLButtonElement>(".empty-slot-trigger")
          ?.focus();
    }
    previousCount.current = count;
  }, [count]);
  function change(next: [string, string]) {
    if (next[0] && next[0] === next[1]) return;
    setSelection(next);
    setShareStatus("");
    const url = new URL(location.href);
    for (const [i, key] of ["a", "b"].entries()) {
      if (next[i]) url.searchParams.set(key, next[i]);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, "", url);
    if (next[0] && next[1])
      track("comparison_completed", { a: next[0], b: next[1] });
    else if (next.some(Boolean)) track("comparison_started");
  }
  const selectors: [React.ReactNode, React.ReactNode] = [
    <ProductSelector
      key="a"
      slot={1}
      product={a}
      other={b}
      compact={!!(a && b)}
      disabled={!ready}
      onChange={(id) => change([id, selection[1]])}
    />,
    <ProductSelector
      key="b"
      slot={2}
      product={b}
      other={a}
      compact={!!(a && b)}
      disabled={!ready}
      onChange={(id) => change([selection[0], id])}
    />,
  ];
  return (
    <div className="compare-workspace" ref={workspace}>
      <div className="comparison-toolbar">
        <div className="selection-progress" role="status">
          <span className={a ? "complete" : ""}>1</span>
          <i />
          <span className={b ? "complete" : ""}>2</span>
          <strong>
            {count} of 2 products selected
            {count === 2 ? " · Comparison ready" : ""}
          </strong>
        </div>
        <div className="comparison-toolbar-controls">
          {a && b && (
            <>
              <button
                className="text-link"
                disabled={!ready}
                onClick={() => change([b.id, a.id])}
              >
                <ArrowLeftRight size={15} /> Swap sides
              </button>
              <button
                className="text-link"
                disabled={!ready}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(location.href);
                    setShareStatus("Comparison link copied.");
                  } catch {
                    setShareStatus(
                      "Your comparison link is ready in the address bar.",
                    );
                  }
                }}
              >
                <Copy size={15} /> Copy comparison link
              </button>
            </>
          )}
          {count > 0 && (
            <button
              className="text-link"
              disabled={!ready}
              onClick={() => change(["", ""])}
            >
              Start over <X size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="comparison-share-status" role="status">
        {shareStatus}
      </p>
      {!(a && b) && (
        <div className="product-slots">
          {selectors[0]}
          <div className="slot-versus" aria-hidden="true">
            vs.
          </div>
          {selectors[1]}
        </div>
      )}
      {a && b ? (
        <>
          <ComparisonTable a={a} b={b} controls={selectors} />
        </>
      ) : (
        <div className="comparison-empty">
          <div className="empty-pair-symbol" aria-hidden="true">
            A <span>↔</span> B
          </div>
          <div>
            <h2>
              {count === 0
                ? "Two labels. A clearer picture."
                : "One more product, then the differences."}
            </h2>
            <p>
              {count === 0
                ? "Choose two serums to see their recorded prices, selected peptide labels, and what the available data cannot tell us."
                : "Choose a different product in the empty space above. Your comparison will appear automatically."}
            </p>
            {count === 0 && products.length >= 2 && (
              <button
                className="text-link"
                disabled={!ready}
                onClick={() => change([products[0].id, products[1].id])}
              >
                Try the starter comparison <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      <noscript>
        <p>
          Enable JavaScript to choose products. Source-backed product profiles
          remain available in the catalog.
        </p>
      </noscript>
      <div className="comparison-standard">
        <BookOpen size={17} />
        <p>
          Selected label ingredients, not full formulas. No efficacy scores or
          clinical equivalence.{" "}
          <Link href="/methodology/">
            How we compare <ArrowUpRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
