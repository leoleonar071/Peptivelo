import { ArrowUpRight } from "lucide-react";
import { type Product } from "@/lib/data";
import { productPath } from "@/lib/config";
import { volumeLabel } from "@/lib/comparison";
import { normalize } from "@/lib/math";
import {
  markets,
  offers,
  offerSorts,
  offerMetrics,
  marketFrom,
  sortFrom,
  selectOffers,
  observationFresh,
  offerMoney,
} from "@/lib/offers";

// A dated buying notebook, not a seller endorsement or an efficacy ranking.
export function ProductOffers({
  product,
  market: rawMarket,
  sort: rawSort,
}: {
  product: Product;
  market?: string;
  sort?: string;
}) {
  const market = marketFrom(rawMarket),
    sort = sortFrom(rawSort);
  const today = new Date().toISOString().slice(0, 10);
  const rows = selectOffers(offers, product.id, market, sort, today);
  const known = rows.filter((row) => {
    const metrics = offerMetrics(row, market, today);
    return sort === "delivery"
      ? metrics.delivery != null
      : sort === "total"
        ? metrics.total != null
        : true;
  }).length;
  return (
    <section
      className="offer-comparison section"
      aria-labelledby="offer-heading"
      id="offers"
    >
      <header className="offer-intro">
        <span className="eyebrow">SAME PRODUCT · DIFFERENT STORES</span>
        <h2 id="offer-heading">Compare stores & delivery</h2>
        <p>
          Compare recorded offers for this {volumeLabel(product)} presentation.
          Stores handle payment, order support and fulfilment. Peptivelo does
          not sell or ship products.
        </p>
      </header>
      <form
        className="offer-controls"
        action={`${productPath(product.slug)}#offers`}
        method="get"
      >
        <div className="offer-field">
          <label htmlFor="offer-market">Delivery destination</label>
          <select id="offer-market" name="market" defaultValue={market}>
            {Object.entries(markets).map(([id, item]) => (
              <option key={id} value={id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="offer-field">
          <label htmlFor="offer-sort">Sort offers</label>
          <select id="offer-sort" name="offerSort" defaultValue={sort}>
            {Object.entries(offerSorts).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button className="button" type="submit">
          Update offers
        </button>
      </form>
      <p className="offer-context">
        {rows.length} {rows.length === 1 ? "store recorded" : "stores recorded"}{" "}
        · {markets[market].currency} · No currency conversion. This is limited
        coverage, not a complete market survey.
      </p>
      {rows.length === 1 && (
        <p>
          Only one store is documented for this product and destination. A
          single listing does not establish the lowest price.
        </p>
      )}
      {rows.length > 0 && (sort === "total" || sort === "delivery") && (
        <p className="offer-sort-note">
          {known}{" "}
          {sort === "total"
            ? "product + shipping estimates"
            : "complete delivery estimates"}{" "}
          available. Known estimates appear first; missing values are never
          treated as free shipping or immediate delivery. This does not identify
          the cheapest or fastest store overall.
        </p>
      )}
      {!rows.length ? (
        <div className="offer-empty">
          <h3>No offers recorded for this destination.</h3>
          <p>
            This does not mean the product is unavailable or that a store cannot
            ship there. Try another destination or check the manufacturer for
            local options. We do not apply US prices or delivery policies to
            other countries.
          </p>
        </div>
      ) : (
        <div className="offer-list">
          {rows.map((offer) => {
            const metrics = offerMetrics(offer, market, today);
            const fresh = observationFresh(offer.observedAt, today);
            const money = (amount: number) =>
              offerMoney(amount, offer.currency);
            const unitPrice = normalize(
              offer.price,
              offer.size,
              offer.sizeUnit,
            )?.perMl;
            return (
              <article
                className="offer-card"
                key={offer.id}
                aria-labelledby={`offer-${offer.id}`}
              >
                <div className="offer-store">
                  <h3 id={`offer-${offer.id}`}>{offer.retailerName}</h3>
                  <span>
                    {offer.listedSize} · {offer.currency}
                  </span>
                  <p>
                    {offer.availability === "not_checked"
                      ? "Stock not confirmed"
                      : offer.availability === "in_stock_observed"
                        ? "In stock when observed — check again"
                        : "Out of stock when observed — check again"}
                  </p>
                </div>
                <dl className="offer-facts">
                  <div>
                    <dt>Recorded price</dt>
                    <dd className="offer-price">{money(offer.price)}</dd>
                    <dd>
                      {unitPrice != null
                        ? `${money(unitPrice)}/mL · product only`
                        : "Unit cost not available"}
                    </dd>
                  </div>
                  <div>
                    <dt>Standard shipping</dt>
                    <dd>
                      {metrics.shipping?.cost != null
                        ? `${money(metrics.shipping.cost)} · policy estimate`
                        : "Cost not confirmed"}
                    </dd>
                    <dd>For the stated checkout conditions</dd>
                  </div>
                  <div>
                    <dt>Product + shipping</dt>
                    <dd>
                      {metrics.total != null
                        ? `${money(metrics.total)} estimated`
                        : "Total not confirmed"}
                    </dd>
                    <dd>Before tax, duties or other charges</dd>
                  </div>
                  <div>
                    <dt>Order-to-delivery estimate</dt>
                    <dd>
                      {metrics.delivery
                        ? `${metrics.delivery.min}–${metrics.delivery.max} business days · policy estimate`
                        : "Delivery estimate not confirmed"}
                    </dd>
                    <dd>
                      {metrics.shipping?.transitBusinessDays
                        ? `Standard transit: ${metrics.shipping.transitBusinessDays.min}–${metrics.shipping.transitBusinessDays.max} business days. ${metrics.shipping.processingBusinessDays ? "Processing included above." : "Processing time not confirmed."}`
                        : "No destination-specific timing recorded."}
                    </dd>
                  </div>
                </dl>
                <div className="offer-evidence">
                  <p>
                    Price observed{" "}
                    <time dateTime={offer.observedAt}>{offer.observedAt}</time>{" "}
                    (UTC).{" "}
                    {fresh
                      ? "Dated snapshot; confirm at checkout."
                      : "Needs rechecking — excluded from numeric rankings."}
                  </p>
                  {offer.shipping && (
                    <p>
                      {offer.shipping.scenario} Policy checked{" "}
                      {offer.shipping.checkedAt} (UTC).{" "}
                      {!metrics.shipping &&
                        "Policy needs rechecking before using it for this destination."}
                    </p>
                  )}
                  <div className="offer-links">
                    <a
                      href={offer.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Price source <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                    {offer.shipping && (
                      <a
                        href={offer.shipping.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Delivery policy{" "}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="offer-action">
                  <a
                    className="button secondary"
                    href={offer.affiliateUrl ?? offer.url}
                    target="_blank"
                    rel={
                      offer.affiliateUrl
                        ? "sponsored noopener noreferrer"
                        : "noopener noreferrer"
                    }
                  >
                    Visit {offer.retailerName}{" "}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <small>
                    {offer.affiliateUrl
                      ? offer.affiliateDisclosure
                      : "Ordinary link · no commission"}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="offer-footnote">
        Delivery policies describe estimates, not measured delivery performance
        or guarantees from Peptivelo. Your address, processing time, stock,
        holidays and checkout conditions can change the result. Commercial
        relationships do not determine the order above.
      </p>
    </section>
  );
}
