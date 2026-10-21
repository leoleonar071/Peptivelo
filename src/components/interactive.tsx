"use client";
import { useEffect, useState } from "react";
import {
  Search,
  ArrowRight,
  Plus,
  X,
  Copy,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import {
  products,
  catalog,
  brandName,
  priceFor,
  sourceFor,
  type Product,
} from "@/lib/data";
import { difference, money, normalize } from "@/lib/math";
import { ProductCard, EmptyState } from "./ui";
import { track } from "@/lib/analytics";
import { useClientReady } from "@/lib/use-client-ready";

export function SearchBar() {
  return (
    <form
      action="/skincare/products/"
      className="search-bar"
      onSubmit={() => track("search_performed")}
    >
      <Search size={20} />
      <input
        aria-label="Search products or ingredients"
        name="q"
        placeholder="Search products, brands, or ingredients…"
      />
      <button aria-label="Search">
        <ArrowRight size={20} />
      </button>
    </form>
  );
}
export function Explorer({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [brand, setBrand] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [max, setMax] = useState("");
  const [size, setSize] = useState("");
  const [verified, setVerified] = useState("");
  const [hasPrice, setHasPrice] = useState(false);
  const filterCount = [brand, ingredient, max, size, verified, hasPrice].filter(
    Boolean,
  ).length;
  function clearFilters() {
    setQ("");
    setBrand("");
    setIngredient("");
    setMax("");
    setSize("");
    setVerified("");
    setHasPrice(false);
  }
  const filtered = products.filter((p) => {
    const price = priceFor(p);
    return (
      `${p.name} ${brandName(p)} ${p.ingredientList.join(" ")}`
        .toLowerCase()
        .includes(q.trim().toLowerCase()) &&
      (!brand || p.brandId === brand) &&
      (!ingredient || p.ingredientIds.includes(ingredient)) &&
      (!hasPrice || !!price) &&
      (!max || (price && price.price <= Number(max))) &&
      (!size || normalize(0, p.volume, p.volumeUnit)!.ml >= Number(size)) &&
      (!verified || p.lastVerifiedAt >= verified)
    );
  });
  return (
    <>
      <div className="explorer-layout">
        <details className="catalog-filters">
          <summary>
            <SlidersHorizontal size={18} /> Filters{" "}
            {filterCount > 0 && <span>({filterCount} active)</span>}
          </summary>
          <div className="filters">
            <label>
              Brand
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">All brands</option>
                {catalog.brands.map((b) => (
                  <option value={b.id} key={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Peptide ingredient
              <select
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              >
                <option value="">All ingredients</option>
                {catalog.ingredients.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Maximum recorded price (USD)
              <input
                type="number"
                min="0"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="No limit"
              />
            </label>
            <label>
              Minimum volume (mL)
              <input
                type="number"
                min="0"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Any size"
              />
            </label>
            <label>
              Source checked on or after
              <input
                type="date"
                value={verified}
                onChange={(e) => setVerified(e.target.value)}
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={hasPrice}
                onChange={(e) => setHasPrice(e.target.checked)}
              />{" "}
              With a recorded price
            </label>
            <p className="small">
              Current category: facial serums. Source verification concerns
              label facts, not clinical efficacy.
            </p>
            <button className="text-link" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        </details>
        <div>
          <div className="search-bar">
            <Search size={18} />
            <input
              aria-label="Filter products"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                track("search_performed", { length: e.target.value.length });
              }}
              placeholder="Search the catalog…"
            />
          </div>
          <div className="result-count" aria-live="polite">
            {filtered.length} products · US catalog
          </div>
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {!filtered.length && (
            <>
              <EmptyState />
              <button className="button secondary" onClick={clearFilters}>
                Clear search and filters
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export { Compare, ComparisonTable, ProductSelector } from "./comparison";
import { type Row, initial } from "@/lib/calculator";
export function PriceCalculator({
  initialRows = initial,
}: {
  initialRows?: Row[];
}) {
  const ready = useClientReady();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [copied, setCopied] = useState(false);
  const values = rows.map((r) =>
    r.price.trim() && r.size.trim()
      ? normalize(Number(r.price), Number(r.size), r.unit)
      : null,
  );
  const valid = values.filter((v) => !!v);
  const base = values[0];
  const update = (i: number, key: keyof Row, value: string) => {
    setRows(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
    setCopied(false);
    track("price_calculator_used", { rows: rows.length });
  };
  return (
    <div className="calculator">
      <fieldset
        className="panel calculator-inputs"
        aria-label="Price calculator inputs"
        disabled={!ready}
      >
        <div className="calculator-toolbar">
          <BadgeUSD />
          <span>Enter your own prices. No catalog required.</span>
        </div>
        {rows.map((r, i) => (
          <fieldset className="calculator-row" key={i}>
            <legend>Product {i + 1}</legend>
            <label>
              Product name
              <input
                maxLength={80}
                value={r.name}
                onChange={(e) => update(i, "name", e.target.value)}
              />
            </label>
            <label>
              Price (USD)
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={r.price}
                onChange={(e) => update(i, "price", e.target.value)}
                placeholder="e.g. 32"
              />
            </label>
            <label>
              Volume
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={r.size}
                onChange={(e) => update(i, "size", e.target.value)}
                placeholder="e.g. 30"
              />
            </label>
            <label>
              Unit
              <select
                value={r.unit}
                onChange={(e) => update(i, "unit", e.target.value)}
              >
                <option value="ml">mL</option>
                <option value="oz">US fl oz</option>
              </select>
            </label>
            {rows.length > 2 && (
              <button
                className="icon-button"
                aria-label={`Remove product ${i + 1}`}
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
              >
                <X size={16} />
              </button>
            )}
            {r.price !== "" && r.size !== "" && !values[i] && (
              <p className="error-text" role="alert">
                Enter a nonnegative price and a volume greater than zero.
              </p>
            )}
          </fieldset>
        ))}
        <div className="button-row">
          <button
            className="button secondary"
            disabled={rows.length >= 6}
            onClick={() =>
              setRows([
                ...rows,
                {
                  name: `Product ${rows.length + 1}`,
                  price: "",
                  size: "",
                  unit: "ml",
                },
              ])
            }
          >
            <Plus size={16} /> Add product
          </button>
          <button
            className="button secondary"
            disabled={valid.length !== rows.length}
            onClick={async () => {
              const url = new URL(location.href);
              url.searchParams.set("items", JSON.stringify(rows));
              history.replaceState(null, "", url);
              try {
                await navigator.clipboard.writeText(url.toString());
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
            {copied ? "Link copied" : "Share calculation"}
          </button>
        </div>
      </fieldset>
      <section className="panel results-panel" aria-live="polite">
        <span className="eyebrow">NORMALIZED PRICE</span>
        <h2>Put prices on equal terms.</h2>
        {!valid.length && (
          <p>Your results appear here as you enter a price and volume.</p>
        )}
        {rows.map((r, i) => {
          const v = values[i];
          if (!v) return null;
          const delta = base ? difference(base.perMl, v.perMl) : null;
          const lowest = v.perMl === Math.min(...valid.map((x) => x.perMl));
          return (
            <div className="calculation-result" key={i}>
              <strong>{r.name || `Product ${i + 1}`}</strong>
              {lowest && valid.length > 1 && (
                <span className="badge">
                  Lowest cost per mL
                  {valid.filter((x) => x.perMl === v.perMl).length > 1
                    ? " · tie"
                    : ""}
                </span>
              )}
              <div className="big-number">
                {money(v.perMl)}
                <small> / mL</small>
              </div>
              <p>{money(v.perOz)} / US fl oz</p>
              {i > 0 && (
                <p>
                  {delta === null
                    ? base
                      ? "Percentage difference unavailable with a zero-price baseline."
                      : "Enter product 1 to calculate the percentage difference."
                    : `${Math.abs(delta).toFixed(1)}% ${delta < 0 ? "lower" : delta > 0 ? "higher" : "difference in"} cost per mL vs. product 1.`}
                </p>
              )}
            </div>
          );
        })}
        <p className="small">
          1 US fl oz = 29.5735295625 mL. Calculations use unrounded values;
          displayed prices are rounded. Price does not measure skincare
          efficacy.
        </p>
      </section>
    </div>
  );
}
function BadgeUSD() {
  return <span className="badge">USD · US volume units</span>;
}
export function ProductViewEvent({ id }: { id: string }) {
  useEffect(() => track("product_viewed", { id }), [id]);
  return null;
}
export function RetailerLink({ product, detailed = false }: { product: Product; detailed?: boolean }) {
  const source = sourceFor(product);
  const retailer = catalog.retailers.find((r) => r.id === product.brandId);
  const affiliate = retailer?.affiliateUrl;
  return (
    <a
      className={`button${detailed ? " retailer-product-link" : ""}`}
      href={affiliate || source.url}
      rel={affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      target="_blank"
      onClick={() =>
        track("affiliate_link_clicked", {
          product: product.id,
          affiliate: affiliate ? "yes" : "no",
        })
      }
    >
      {detailed ? <span>View {product.name} · {product.volume} {product.volumeUnit === "ml" ? "mL" : "US fl oz"} at {brandName(product)}</span> : <>Visit {brandName(product)}</>} <ArrowRight size={16} />
    </a>
  );
}
