import { comparisonUrl } from "@/lib/config";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, FlaskConical, ArrowRight } from "lucide-react";
import { brandName, priceFor, type Product, catalog } from "@/lib/data";
import { ingredientPath, productPath } from "@/lib/config";
import { money, normalize } from "@/lib/math";
import { volumeLabel } from "@/lib/comparison";
export function Bottle({
  product,
  large = false,
  priority = false,
}: {
  product: Product;
  large?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={`bottle-scene product-photo ${product.tone} ${large ? "large" : ""}`}
    >
      <Image
        src={product.image}
        width={720}
        height={720}
        unoptimized
        priority={priority}
        alt={`${brandName(product)} ${product.name}, ${volumeLabel(product)} — product record, not a packaging photograph`}
      />
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}
export function VerifiedDate({ date }: { date: string }) {
  return (
    <span
      className="verified"
      title="Manufacturer label checked; not independent laboratory or clinical verification."
    >
      <Check size={13} /> Label checked <time dateTime={date}>{date}</time>
    </span>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const price = priceFor(p);
  return (
    <article className="product-card">
      <Link href={productPath(p.slug)}>
        <Bottle product={p} />
      </Link>
      <div className="product-card-body">
        <span className="eyebrow">{brandName(p)}</span>
        <h3>
          <Link href={productPath(p.slug)}>{p.name}</Link>
        </h3>
        <div className="tags">
          {p.ingredientIds.slice(0, 2).map((id) => (
            <Link className="badge" key={id} href={ingredientPath(id)}>
              {catalog.ingredients.find((i) => i.id === id)?.name}
            </Link>
          ))}
        </div>
        <div className="price-line">
          <strong>{price ? money(price.price) : "Price not available"}</strong>
          <span>
            {volumeLabel(p)}
            {price
              ? ` · ${money(normalize(price.price, price.size, price.sizeUnit)!.perMl)}/mL`
              : ""}
          </span>
        </div>
        {!price && (
          <p className="price-note">
            No size-specific price is recorded.{" "}
            <a
              href={catalog.sources.find((s) => s.id === p.sourceId)!.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check the manufacturer <ArrowUpRight size={14} />
            </a>
          </p>
        )}
        <div className="card-foot">
          <VerifiedDate date={p.lastVerifiedAt} />
          <Link
            href={comparisonUrl(p.id)}
            aria-label={`Add to comparison: ${p.name}`}
          >
            Add to comparison <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function SourceList({
  ids,
  anchors = false,
}: {
  ids: string[];
  anchors?: boolean;
}) {
  return (
    <div className="source-list">
      {catalog.sources
        .filter((s) => ids.includes(s.id))
        .map((s) => (
          <div key={s.id} id={anchors ? `source-${s.id}` : undefined}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title} <ArrowUpRight size={14} />
            </a>
            <small>
              {s.publisher} ·{" "}
              {s.sourceType === "manufacturer"
                ? "Manufacturer / supplier information"
                : s.sourceType === "research"
                  ? "Research / ingredient reference"
                  : "Public health guidance"}{" "}
              · Accessed {s.accessedAt}
            </small>
          </div>
        ))}
    </div>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((i) => (
        <span key={i.href}>
          / <Link href={i.href}>{i.label}</Link>
        </span>
      ))}
    </nav>
  );
}
export function SectionHeading({
  kicker,
  title,
  href,
  label,
}: {
  kicker: string;
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {label || "Explore all"} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function EmptyState() {
  return (
    <div className="empty">
      <FlaskConical />
      <h3>No products match these filters.</h3>
      <p>Try another ingredient or clear your filters.</p>
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="panel" role="status">
      Loading the atlas…
    </div>
  );
}
export function AffiliateDisclosure() {
  return (
    <p className="disclosure">
      No affiliate partnerships are active. Manufacturer and store links are
      ordinary links; we do not earn commissions from them. Recorded prices
      exclude tax and shipping and may have changed.
    </p>
  );
}
