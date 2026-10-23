"use client";
import { comparisonPath } from "@/lib/config";

import Link from "next/link";
import {
  facialComparisonGroup,
  eligibleComparisonProducts,
  canCompareProducts,
} from "@/lib/comparison-groups";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
import { catalog, brandName, sourceFor, type Product } from "@/lib/data";
import { comparisonFacts, volumeLabel } from "@/lib/comparison";
import { money } from "@/lib/math";
import { productPath } from "@/lib/config";
import { track } from "@/lib/analytics";
import { Bottle, VerifiedDate, SourceList } from "./ui";

import { ComparisonGrid } from "./comparison-grid";
import { IngredientHelp } from "./ingredient-help";

import { ComparisonHero, ComparisonV2 } from "./comparison-v2";
import { ComparisonProductImage } from "./comparison-product-image";
import type { ComparisonEvidenceData } from "@/lib/comparison-evidence";
import "../styles/comparison-v2.css";
import { useClientReady } from "@/lib/use-client-ready";
import { ingredientAliases } from "@/lib/search";

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
          <small>
            Price recorded <time dateTime={p.observedAt}>{p.observedAt}</time>
          </small>
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
  v2 = false,
}: {
  slot: 1 | 2;
  product?: Product;
  other?: Product;
  onChange: (id: string) => void;
  disabled: boolean;
  compact?: boolean;
  v2?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const slotName = slot === 1 ? "first" : "second";
  const matches = eligibleComparisonProducts.filter((p) => {
    const text =
      `${brandName(p)} ${p.name} ${p.ingredientList.join(" ")} ${p.ingredientIds.flatMap((id) => ingredientAliases[id] ?? []).join(" ")}`.toLowerCase();
    return query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .every((token) => text.includes(token));
  });
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
    if (event.key === "Enter" && event.target === search.current) {
      event.preventDefault();
      dialog.current
        ?.querySelector<HTMLButtonElement>(
          "[data-product-option]:not(:disabled)",
        )
        ?.click();
      return;
    }
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
      className={`compare-slot ${product ? "is-selected" : ""} ${compact && !v2 ? "matrix-selector" : ""} ${v2 ? "v2-slot" : ""}`}
      aria-label={`Product ${v2 ? (slot === 1 ? "A" : "B") : slot}`}
    >
      <div className="slot-top">
        <span className="slot-marker">{slot === 1 ? "A" : "B"}</span>
        <span>PRODUCT {v2 ? (slot === 1 ? "A" : "B") : slot}</span>
        {product && (
          <button
            className="slot-remove"
            disabled={disabled}
            onClick={() => onChange("")}
            aria-label={`Remove product ${v2 ? (slot === 1 ? "A" : "B") : slot}`}
          >
            <X size={16} />
          </button>
        )}
      </div>
      {product ? (
        <>
          <div className="selected-product">
            <div className="mini-bottle" aria-hidden="true">
              {v2 ? (
                <ComparisonProductImage key={product.id} product={product} />
              ) : (
                <Bottle product={product} />
              )}
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
              Change product {v2 ? (slot === 1 ? "A" : "B") : slot}{" "}
              <ArrowLeftRight size={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            ref={trigger}
            className="empty-slot-trigger"
            aria-label={
              v2
                ? `Choose a product — Product ${slot === 1 ? "A" : "B"}`
                : undefined
            }
            aria-haspopup="dialog"
            aria-controls={id}
            disabled={disabled}
            onClick={show}
          >
            <span className="add-product-icon">
              <Plus size={24} />
            </span>
            {v2 ? "Choose a product" : `Choose ${slotName} product`}{" "}
            <ArrowRight size={18} />
            {v2 && <small>Search by brand, product, or ingredient</small>}
          </button>
          {!v2 && (
            <>
              <p className="slot-help">
                Search by product, brand, or ingredient.
              </p>
              <span className="slot-empty-note">
                {slot === 2 && other
                  ? "Your first product is ready. Add another to see the differences."
                  : "A source-checked label, with the gaps left visible."}
              </span>
            </>
          )}
        </>
      )}
      <dialog
        id={id}
        ref={dialog}
        className={`product-picker-dialog ${v2 ? "v2-picker" : ""}`}
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
              <span className="eyebrow">
                YOUR COMPARISON / PRODUCT {v2 ? (slot === 1 ? "A" : "B") : slot}
              </span>
              <h2 id={`${id}-title`}>
                {v2 ? "Select a product" : `Choose your ${slotName} product.`}
              </h2>
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
              placeholder={
                v2
                  ? "Search brand, product, or ingredient..."
                  : "Try a brand, product, or peptide…"
              }
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
                    {v2 ? (
                      <ComparisonProductImage product={p} />
                    ) : (
                      <Bottle product={p} />
                    )}
                  </span>
                  <span className="picker-option-copy">
                    <span className="eyebrow">{brandName(p)}</span>
                    <strong className="picker-product-name">{p.name}</strong>
                    <span className="picker-peptide">
                      Selected label: {p.ingredientList.slice(0, 2).join(" · ")}
                    </span>
                    <span className="picker-option-status">
                      {unavailable
                        ? `Already selected as product ${v2 ? (slot === 1 ? "B" : "A") : slot === 1 ? 2 : 1}`
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
              Label facts, not product ratings. Product records identify the
              recorded presentation; they are not packaging photographs.
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
          <Link className="text-link" href={comparisonPath(guide.slug)}>
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

function subscribeComparison(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener("peptivelo:compare-selection", listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("peptivelo:compare-selection", listener);
  };
}
export function Compare({
  first,
  second,
  evidenceData,
}: {
  first?: string;
  second?: string;
  evidenceData?: ComparisonEvidenceData;
}) {
  const ready = useClientReady();
  const query = useSyncExternalStore(
    subscribeComparison,
    () => window.location.search,
    () => new URLSearchParams({ a: first ?? "", b: second ?? "" }).toString(),
  );
  const params = new URLSearchParams(query);
  const a = eligibleComparisonProducts.find((p) => p.id === params.get("a"));
  const b = eligibleComparisonProducts.find(
    (p) => p.id === params.get("b") && (!a || canCompareProducts(a.id, p.id)),
  );
  const count = Number(!!a) + Number(!!b);
  const invalid = (!!params.get("a") && !a) || (!!params.get("b") && !b);
  const [shareStatus, setShareStatus] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const previousCount = useRef(count);
  useEffect(() => {
    if (count === 2 && previousCount.current !== 2)
      root.current
        ?.querySelector<HTMLElement>("#comparison-result-title")
        ?.focus();
    else if (previousCount.current === 2 && count < 2)
      root.current
        ?.querySelector<HTMLButtonElement>(".empty-slot-trigger")
        ?.focus();
    previousCount.current = count;
  }, [count]);
  function change(next: [string, string]) {
    if (next[0] && next[1] && !canCompareProducts(next[0], next[1])) return;
    const url = new URL(location.href);
    for (const [index, key] of ["a", "b"].entries()) {
      if (next[index]) url.searchParams.set(key, next[index]);
      else url.searchParams.delete(key);
    }
    // Pair-specific anchors must not describe a newly selected pair.
    url.hash = "";
    history.pushState(null, "", url);
    window.dispatchEvent(new Event("peptivelo:compare-selection"));
    setShareStatus("");
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
      compact={count === 2}
      v2
      disabled={!ready}
      onChange={(id) => change([id, b?.id ?? ""])}
    />,
    <ProductSelector
      key="b"
      slot={2}
      product={b}
      other={a}
      compact={count === 2}
      v2
      disabled={!ready}
      onChange={(id) => change([a?.id ?? "", id])}
    />,
  ];
  return (
    <div
      className={`compare-workspace comparison-v2 ${count === 2 ? "v2-is-complete" : ""}`}
      ref={root}
    >
      <ComparisonHero complete={count === 2} />
      <p className="v2-method-note">
        Currently available: {facialComparisonGroup.presentation.label}.{" "}
        <Link href="/peptides/">Explore Peptides A–Z →</Link>
      </p>
      <span className="sr-only" role="status">
        {count} of 2 products selected{count === 2 ? " · Comparison ready" : ""}
      </span>
      {invalid && (
        <p className="v2-validation" role="status">
          An unknown or duplicate product was ignored. Choose a different
          catalog product for the empty selection.
        </p>
      )}
      {count > 0 && (
        <div className="v2-toolbar">
          {a && b && (
            <>
              <button disabled={!ready} onClick={() => change([b.id, a.id])}>
                <ArrowLeftRight size={16} /> Swap sides
              </button>
              <button
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
                <Copy size={16} /> Copy comparison link
              </button>
            </>
          )}
          <button disabled={!ready} onClick={() => change(["", ""])}>
            Start over <X size={16} />
          </button>
        </div>
      )}
      {shareStatus && (
        <p className="v2-share-status" role="status">
          {shareStatus}
        </p>
      )}
      {a && b ? (
        <ComparisonV2
          a={a}
          b={b}
          selectors={selectors}
          evidence={evidenceData}
        />
      ) : (
        <>
          <div className="v2-product-slots">{selectors}</div>
          <div className="v2-starter">
            <div>
              <strong>Try an example comparison</strong>
              <span>The Ordinary Copper Peptides and NIOD CAIS3</span>
            </div>
            <button
              className="button"
              disabled={!ready}
              onClick={() => change(["ordinary-copper", "niod-cais3"])}
            >
              Try an example comparison <ArrowRight size={16} />
            </button>
          </div>
          <p className="v2-method-note">
            Two recorded labels, with their sources and limits.{" "}
            <Link href="/methodology/">How we compare →</Link>
          </p>
        </>
      )}
      <noscript>
        <p>
          Enable JavaScript to choose products.{" "}
          <Link href="/skincare/products/">
            Source-backed product profiles remain available.
          </Link>
        </p>
      </noscript>
    </div>
  );
}
