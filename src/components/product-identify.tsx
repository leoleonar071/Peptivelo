"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Check,
  ChevronDown,
  ScanLine,
  FlaskConical,
} from "lucide-react";
import { products, catalog, brandName, type Product } from "@/lib/data";
import { volumeLabel } from "@/lib/comparison";
import { productPath } from "@/lib/config";
import { Bottle } from "./ui";
import { EvidenceLinks } from "./ingredient-education";
import { ProductScanner } from "./product-scanner";
import { useClientReady } from "@/lib/use-client-ready";

// One search-led surface, followed by an honest documented-label preview.
export function ProductIdentify() {
  const ready = useClientReady();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scanTrigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const focusHeading = () =>
    requestAnimationFrame(() => heading.current?.focus());
  const normalized = query
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const matches = products.filter((p) => {
    const text = `${brandName(p)} ${p.name} ${p.ingredientList.join(" ")}`
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return normalized.split(/\s+/).every((term) => text.includes(term));
  });
  const reset = () => {
    setSelected(null);
    setConfirmed(false);
    requestAnimationFrame(() => search.current?.focus());
  };
  return (
    <div className="identify-page wrap">
      <header className="identify-intro">
        <span className="eyebrow">IDENTIFY YOUR SERUM</span>
        <h1 ref={heading} tabIndex={-1}>
          {confirmed ? (
            "A little clarity for your serum."
          ) : selected ? (
            "Is this your serum?"
          ) : (
            <>
              Find your serum. <span>Know what&apos;s inside.</span>
            </>
          )}
        </h1>
        <p>
          {confirmed
            ? "Start with the label. Explore the research when you need more."
            : selected
              ? "Match the brand, product name and size with your bottle before continuing."
              : "Search by name or scan a compatible code to explore product ingredients, label information, and sources."}
        </p>
      </header>
      {!selected ? (
        <section
          className="identify-search-section"
          aria-label="Find your serum"
        >
          <div className="identify-search-surface">
            <form
              className="identify-primary-search"
              aria-busy={!ready}
              role="search"
              aria-label="Find a documented serum"
              onSubmit={(event) => {
                event.preventDefault();
                document
                  .querySelector<HTMLButtonElement>(".identify-result")
                  ?.focus();
              }}
            >
              <label className="sr-only" htmlFor="serum-search">
                Search by brand, product or ingredient
              </label>
              <input
                ref={search}
                id="serum-search"
                type="search"
                disabled={!ready}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    document
                      .querySelector<HTMLButtonElement>(".identify-result")
                      ?.focus();
                  }
                  if (event.key === "Escape") setQuery("");
                }}
                placeholder="Search by brand, serum, or ingredient..."
                autoComplete="off"
                aria-controls="identify-results"
                aria-describedby="identify-search-help"
              />
              <button type="submit" aria-label="Search serum" disabled={!ready}>
                <Search size={22} aria-hidden="true" />
              </button>
            </form>
            <div className="identify-scan-row">
              <ScanLine size={28} aria-hidden="true" />
              <div>
                <strong>Scan a Peptivelo QR</strong>
                <p>Use a compatible Peptivelo QR code.</p>
              </div>
              <button
                className="button secondary"
                ref={scanTrigger}
                disabled={!ready}
                onClick={() => setScanning(true)}
              >
                Scan QR
              </button>
            </div>
            <p className="identify-coverage" id="identify-search-help">
              Only products documented in Peptivelo can be matched. Manufacturer
              barcodes are not supported yet.
            </p>
          </div>
          <section
            className="identify-catalog"
            aria-labelledby="identify-catalog-title"
          >
            <h2 id="identify-catalog-title">
              {query ? "Matching serums" : "Browse documented serums"}
            </h2>
            <p role="status">
              {query
                ? `${matches.length} matching ${matches.length === 1 ? "serum" : "serums"}.`
                : "Explore a few documented label profiles. Select one to confirm the name and size."}
            </p>
            {matches.length ? (
              <div
                id="identify-results"
                className={
                  query ? "identify-results" : "identify-results is-preview"
                }
              >
                {(query ? matches : matches.slice(0, 3)).map((p) => (
                  <button
                    type="button"
                    disabled={!ready}
                    className="identify-result"
                    key={p.id}
                    onClick={() => {
                      setSelected(p);
                      focusHeading();
                    }}
                  >
                    <span className="identify-record-visual" aria-hidden="true">
                      <FlaskConical size={32} strokeWidth={1.2} />
                      <span>Documented label</span>
                      <strong>{volumeLabel(p)}</strong>
                    </span>
                    <span className="identify-result-copy">
                      <span>{brandName(p)}</span>
                      <strong>{p.name}</strong>
                      <small>{volumeLabel(p)} · Facial serum</small>
                    </span>
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="identify-empty" id="identify-results">
                <h2>No matching product yet.</h2>
                <p>
                  Try a shorter product name or brand. This catalog covers
                  selected cosmetic serums; it does not identify unknown
                  bottles.
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
            <Link className="identify-all-products" href="/skincare/products/">
              View all products →
            </Link>
          </section>
          <div className="identify-context">
            <p>
              Search stays in your browser. These are label records, not
              packaging photographs or authentication results.
            </p>
            <Link className="text-link" href="/methodology/">
              How we document products{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <Link className="text-link" href="/haircare/">
            Looking for a scalp serum? Explore haircare <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <>
          <section className="identify-product" aria-label="Selected product">
            <Bottle product={selected} priority />
            <div>
              <span className="eyebrow">{brandName(selected)}</span>
              <h2>{selected.name}</h2>
              <p>{volumeLabel(selected)} · Facial serum</p>
              <small>Catalog label checked {selected.lastVerifiedAt}</small>
            </div>
          </section>
          {!confirmed ? (
            <section className="identify-confirm">
              <p>
                Packaging may change. This matches a catalog profile; it does
                not authenticate your bottle or verify its contents.
              </p>
              <div className="identify-actions">
                <button
                  className="button"
                  onClick={() => {
                    setConfirmed(true);
                    focusHeading();
                  }}
                >
                  Yes, explore this serum <ArrowRight size={17} />
                </button>
                <button className="button secondary" onClick={reset}>
                  <ArrowLeft size={17} /> Choose another
                </button>
              </div>
            </section>
          ) : (
            <>
              <div className="identify-status">
                <Check size={17} aria-hidden="true" />
                <span>Catalog match confirmed by you</span>
                <span>Contents & batch unverified</span>
              </div>
              <section className="identify-summary">
                <span className="eyebrow">THE SHORT VERSION</span>
                <h2>What is it?</h2>
                <p>{selected.description}</p>
                <EvidenceLinks ids={[selected.sourceId]} />
                <div className="identify-label-limit">
                  <strong>What the label can tell us</strong>
                  <p>{selected.concentrationExplanation}</p>
                  <small>{selected.ingredientListScope}</small>
                </div>
              </section>
              <section
                className="identify-learn"
                aria-labelledby="identify-ingredients"
              >
                <h2 id="identify-ingredients">
                  Meet the selected peptide ingredients
                </h2>
                <p>
                  Open only what you want to understand. Ingredient research
                  does not establish how well this finished serum works.
                </p>
                {selected.ingredientIds.map((id) => {
                  const ingredient = catalog.ingredients.find(
                    (item) => item.id === id,
                  )!;
                  const info = ingredient.education;
                  return (
                    <details className="identify-disclosure" key={id}>
                      <summary>
                        <span>
                          <strong>{ingredient.name}</strong>
                          <small>{info.summary}</small>
                        </span>
                        <ChevronDown size={20} aria-hidden="true" />
                      </summary>
                      <div className="identify-detail">
                        <p className="identify-support">
                          Source category:{" "}
                          <strong>{info.evidence.label}</strong>
                        </p>
                        {[
                          ["What is it?", info.whatItIs],
                          ["What does the evidence say?", info.evidence],
                          ["Before you use it", info.precautions],
                        ].map(
                          ([title, section]) =>
                            typeof section !== "string" && (
                              <section key={title as string}>
                                <h3>{title as string}</h3>
                                <p>{section.text}</p>
                                <EvidenceLinks ids={section.sourceIds} />
                              </section>
                            ),
                        )}
                        <p className="identify-footnote">
                          Sources checked {info.sourceCheckedAt}. Human
                          editorial and scientific review remain pending.
                        </p>
                      </div>
                    </details>
                  );
                })}
              </section>
              <details className="identify-disclosure">
                <summary>
                  <span>
                    <strong>Your bottle & batch</strong>
                    <small>What has — and hasn’t — been checked</small>
                  </span>
                  <ChevronDown size={20} aria-hidden="true" />
                </summary>
                <div className="identify-detail">
                  <dl>
                    <dt>Product identification</dt>
                    <dd>You selected a matching catalog label.</dd>
                    <dt>Contents, purity & authenticity</dt>
                    <dd>Not independently tested or verified.</dd>
                    <dt>Batch certificate or laboratory results</dt>
                    <dd>
                      No verified batch documents are available in this profile.
                    </dd>
                  </dl>
                  <p>
                    A product photo or label match cannot establish what is
                    inside your bottle.
                  </p>
                </div>
              </details>
              <div className="identify-next">
                <Link
                  className="button"
                  href={`/skincare/compare/?a=${selected.id}`}
                >
                  Compare with another serum <ArrowRight size={17} />
                </Link>
                <Link className="text-link" href={productPath(selected.slug)}>
                  Full product profile <ArrowRight size={16} />
                </Link>
                <button className="identify-text-button" onClick={reset}>
                  Find another product
                </button>
              </div>
            </>
          )}
        </>
      )}
      <noscript>
        <p>
          Enable JavaScript to search and confirm a product, or{" "}
          <Link href="/skincare/products/">browse the product profiles</Link>.
        </p>
      </noscript>
      {scanning && (
        <ProductScanner
          onMatch={(product) => {
            setScanning(false);
            router.push(productPath(product.slug));
          }}
          onSearch={() => {
            setScanning(false);
            requestAnimationFrame(() => search.current?.focus());
          }}
          onClose={() => {
            setScanning(false);
            requestAnimationFrame(() => scanTrigger.current?.focus());
          }}
        />
      )}
    </div>
  );
}
