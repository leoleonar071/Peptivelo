import { comparisonPath } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { catalog, products, brandName, priceFor } from "@/lib/data";
import { comparisonEvidenceData } from "@/lib/comparison-evidence";
import { skinLinks } from "@/lib/site-navigation";
import { site, ingredientPath } from "@/lib/config";
import { ProductOffers } from "@/components/product-offers";
import { parseRows } from "@/lib/calculator";
import { pages } from "@/lib/pages";
import { normalize, money } from "@/lib/math";
import { volumeLabel } from "@/lib/comparison";
import { IngredientEducation } from "@/components/ingredient-education";
import { ComparisonGuides } from "@/components/comparison-guides";
import { LearningGuides } from "@/components/learning-guides";
import { ReadingGuide } from "@/components/reading-guide";
import { EvidenceLinks } from "@/components/ingredient-education";
import { guides } from "@/lib/guides";
import { comparisonCitations } from "@/lib/citations";
import { Citations, EvidenceNotice, References } from "@/components/citations";
import { evaluationFor } from "@/lib/evaluations";
import { ComparisonEvaluation } from "@/components/comparison-evaluation";
import { EditorialComparison } from "@/components/editorial-comparison";
import {
  AffiliateDisclosure,
  Bottle,
  Breadcrumbs,
  ProductCard,
  SourceList,
  VerifiedDate,
} from "@/components/ui";
import {
  Compare,
  ComparisonTable,
  Explorer,
  PriceCalculator,
  ProductViewEvent,
  RetailerLink,
} from "@/components/interactive";
type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
function resolve(path: string) {
  if (Object.hasOwn(pages, path))
    return {
      title: pages[path].title,
      description: pages[path].intro,
      index: true,
    };
  if (path === "skincare")
    return {
      title: "The peptide skincare atlas",
      description:
        "Explore a focused catalog of cosmetic peptide serums and source-backed label profiles.",
      index: true,
    };
  if (path === "skincare/products")
    return {
      title: "Explore peptide skincare products",
      description:
        "Search source-checked peptide serum labels by brand, ingredient, and recorded price.",
      index: true,
    };
  if (path === "skincare/ingredients")
    return {
      title: "Cosmetic peptide ingredients",
      description:
        "Understand exact label names, source context, and the limits of ingredient comparisons.",
      index: true,
    };
  if (path === "skincare/guides")
    return {
      title: "Peptide label guides",
      description:
        "Understand commercial peptide names, percentages and the limits of serum label comparisons.",
      index: guides.some((guide) => guide.status === "published"),
    };
  if (path === "compare")
    return {
      title: "Compare with clarity.",
      description:
        "Explore documented differences. Understand the evidence. Check the sources.",
      index: false,
    };
  if (path === "tools/price-per-ml")
    return {
      title: "Price per mL & US fl oz calculator",
      description:
        "Compare cosmetic prices per mL and US fluid ounce. Free USD calculator with shareable results.",
      index: true,
    };
  if (path === "sources")
    return {
      title: "Our sources",
      description:
        "Manufacturer labels, ingredient references, studies and safety guidance, with consultation dates.",
      index: true,
    };
  const parts = path.split("/");
  if (parts.length === 2 && parts[0] === "compare") {
    const comparison = catalog.comparisons.find((c) => c.slug === parts[1]);
    return comparison
      ? {
          title: comparison.title,
          description: comparison.editorialSummary,
          index: comparison.publicationStatus === "published",
        }
      : null;
  }
  if (parts.length === 3 && parts[0] === "skincare") {
    const guide =
      parts[1] === "guides"
        ? guides.find((guide) => guide.slug === parts[2])
        : undefined;
    if (guide)
      return {
        title: guide.title,
        description: guide.description,
        index: guide.status === "published",
      };
    const p =
      parts[1] === "products"
        ? products.find((p) => p.slug === parts[2])
        : null;
    if (p)
      return {
        title: `${brandName(p)} ${p.name}`,
        description: p.description,
        index: true,
      };
    const i =
      parts[1] === "ingredients"
        ? catalog.ingredients.find(
            (i) => i.slug === parts[2] && i.status === "published",
          )
        : null;
    if (i)
      return {
        title: i.name,
        description: i.description,
        index: !i.education.scientificReviewPending,
      };
  }
  return null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).slug.join("/");
  const r = resolve(path);
  if (!r)
    return { title: "Page not found", robots: { index: false, follow: false } };
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: `/${path}/` },
    robots: { index: site.indexable && r.index, follow: true },
    openGraph: { title: r.title, description: r.description, url: `/${path}/` },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const query = await searchParams;
  const get = (name: string) =>
    typeof query[name] === "string" ? (query[name] as string) : undefined;
  const slug = (await params).slug;
  const path = slug.join("/");
  const r = resolve(path);
  if (!r) notFound();
  const breadcrumbs = slug
    .map((part, i) => ({
      label:
        (slug[0] === "compare" && i === 0 ? "Compare" : undefined) ??
        skinLinks
          .find((l) => l.href === `/${slug.slice(0, i + 1).join("/")}/`)
          ?.title.replace("Overview", "Skin & cosmetics") ??
        (i === slug.length - 1 ? r.title : part.replaceAll("-", " ")),
      href: `/${slug.slice(0, i + 1).join("/")}/`,
    }))
    .filter((x) => !["/tools/"].includes(x.href));
  let body: React.ReactNode;
  if (Object.hasOwn(pages, path)) {
    const p = pages[path];
    body = (
      <div className="prose">
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
        {path === "contact" && site.contact && (
          <p>
            Email: <a href={`mailto:${site.contact}`}>{site.contact}</a>
          </p>
        )}
        {path === "methodology" && (
          <Link className="button" href={comparisonPath()}>
            Try the comparison tool <ArrowRight size={16} />
          </Link>
        )}
      </div>
    );
  } else if (path === "skincare/products")
    body = <Explorer initialQuery={get("q")} />;
  else if (path === "skincare")
    body = (
      <>
        <div className="button-row">
          <Link className="button" href="/skincare/products/">
            Search all products
          </Link>
          <Link className="button secondary" href="/skincare/ingredients/">
            Browse ingredients
          </Link>
        </div>
        <div className="product-grid section">
          {products.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
        <section className="panel">
          <h2>Choose a starting pair.</h2>
          <p>
            Explore the differences documented for NIOD CAIS3 and The Ordinary
            copper peptide serum.
          </p>
          <Link
            className="text-link"
            href={comparisonPath() + "?a=ordinary-copper&b=niod-cais3"}
          >
            Compare these products <ArrowRight size={16} />
          </Link>
          <p>
            <Link className="standalone-text-link" href="/methodology/">
              See our methodology
            </Link>
          </p>
        </section>
        <ComparisonGuides />
        <LearningGuides />
      </>
    );
  else if (path === "compare")
    body = (
      <>
        <Compare
          key={`${get("a") ?? ""}:${get("b") ?? ""}`}
          first={get("a")}
          second={get("b")}
          evidenceData={comparisonEvidenceData()}
        />
        <details className="v2-editorial-links">
          <summary>Explore editorial comparisons</summary>
          <ComparisonGuides />
        </details>
      </>
    );
  else if (path === "tools/price-per-ml")
    body = <PriceCalculator initialRows={parseRows(get("items"))} />;
  else if (path === "sources")
    body = (
      <>
        <SourceList ids={catalog.sources.map((s) => s.id)} anchors />
        <div className="prose">
          <h2>What these sources establish</h2>
          <p>
            Manufacturer labels establish what a brand declares. Ingredient
            studies, supplier descriptions and public health guidance have
            different scopes; each explanation identifies which type supports
            it. A study of an ingredient does not establish the results of every
            serum containing it. US labels can change; always check the
            purchased package.
          </p>
        </div>
      </>
    );
  else if (path === "skincare/guides") body = <LearningGuides />;
  else if (slug[1] === "guides")
    body = (
      <ReadingGuide guide={guides.find((guide) => guide.slug === slug[2])!} />
    );
  else if (path === "skincare/ingredients")
    body = (
      <div className="ingredient-grid">
        {catalog.ingredients
          .filter((i) => i.status === "published")
          .map((i) => (
            <Link
              className="panel ingredient-tile"
              key={i.id}
              href={ingredientPath(i.slug)}
            >
              <span className="eyebrow">{i.ingredientCategory}</span>
              <h2>{i.name}</h2>
              <p>{i.description}</p>
              <span className="education-kind">
                {i.education.evidence.label}
              </span>
              <span className="text-link">
                View label context <ArrowRight size={16} />
              </span>
            </Link>
          ))}
      </div>
    );
  else if (slug[1] === "products") {
    const p = products.find((p) => p.slug === slug[2])!;
    const price = priceFor(p);
    body = (
      <>
        <ProductViewEvent id={p.id} />
        <div className="product-detail">
          <div className="product-detail-photo">
            <Bottle product={p} large />
            <a
              className="text-link"
              href={p.image}
              target="_blank"
              rel="noopener noreferrer"
            >
              View product identification record <ArrowUpRight size={16} />
            </a>
            <p className="photo-credit">
              Photograph: {brandName(p)}. Packaging may change.
            </p>
          </div>
          <div>
            <span className="eyebrow">
              {brandName(p)} · {p.category}
            </span>
            <h2>{volumeLabel(p)} · US label</h2>
            <VerifiedDate date={p.lastVerifiedAt} />
            <div className="detail-price">
              {price ? (
                <>
                  <strong>{money(price.price)}</strong>
                  <p>
                    {money(
                      normalize(price.price, price.size, price.sizeUnit)!.perMl,
                    )}{" "}
                    / mL ·{" "}
                    {money(
                      normalize(price.price, price.size, price.sizeUnit)!.perOz,
                    )}{" "}
                    / US fl oz
                  </p>
                  <p className="small">
                    Observed {price.observedAt} · Stock not verified · USD,
                    excluding tax and shipping
                  </p>
                </>
              ) : (
                <>
                  <strong>Price verification pending</strong>
                  <p>
                    The source did not unambiguously associate a price with this
                    size.
                  </p>
                </>
              )}
            </div>
            <RetailerLink product={p} />
            <AffiliateDisclosure />
          </div>
        </div>
        <ProductOffers
          product={p}
          market={get("market")}
          sort={get("offerSort")}
        />
        <div className="two-col section">
          <section className="panel">
            <h2>Selected label ingredients</h2>
            <p>{p.ingredientListScope}</p>
            <ul>
              {p.ingredientList.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <div className="tags">
              {p.ingredientIds.map((id) => (
                <Link className="badge" href={ingredientPath(id)} key={id}>
                  {catalog.ingredients.find((i) => i.id === id)!.name}
                </Link>
              ))}
            </div>
          </section>
          <section className="panel muted-panel">
            <h2>Disclosures & limitations</h2>
            <p>{p.concentrationDisclosure}</p>
            <p>{p.formulationNotes}</p>
            {p.usageSummary && <p>{p.usageSummary}</p>}
            <p>
              No comparative clinical effectiveness has been established by this
              profile.
            </p>
          </section>
        </div>
        <SourceList ids={[p.sourceId]} />
        <h2>Compare this product</h2>
        <div className="button-row">
          <Link className="button" href={`${comparisonPath()}?a=${p.id}`}>
            Add to compare
          </Link>
        </div>
        <ComparisonGuides productId={p.id} />
        <LearningGuides />
      </>
    );
  } else if (slug[1] === "ingredients") {
    const i = catalog.ingredients.find((i) => i.slug === slug[2])!;
    const selectedA = products.find((p) => p.id === get("a"));
    const selectedB = products.find(
      (p) => p.id === get("b") && p.id !== selectedA?.id,
    );
    const editorialReturn =
      selectedA && selectedB
        ? catalog.comparisons.find(
            (c) =>
              c.comparedProductIds.includes(selectedA.id) &&
              c.comparedProductIds.includes(selectedB.id) &&
              get("returnTo") ===
                `${comparisonPath(c.slug)}#comparison-peptides`,
          )
        : undefined;
    const returnPath = editorialReturn
      ? `${comparisonPath(editorialReturn.slug)}#comparison-peptides`
      : selectedA && selectedB
        ? `${comparisonPath()}?${new URLSearchParams({ a: selectedA.id, b: selectedB.id })}`
        : comparisonPath();
    body = (
      <>
        <Link className="text-link ingredient-return" href={returnPath}>
          {selectedA && selectedB
            ? "Back to your comparison"
            : "Compare products"}{" "}
          <ArrowRight size={16} />
        </Link>
        <div className="ingredient-guide">
          <div className="ingredient-name-note">
            <strong>Reading the name</strong>
            <p>
              The ingredient is one part of a product. The formula is the whole
              mixture. A number such as 29 or 1 identifies a name; it is not a
              strength or quality score.
            </p>
            <small>Exact label name: {i.inciName}</small>
          </div>
          <IngredientEducation ingredient={i} />
        </div>
        <h2>Sources you can check</h2>
        <SourceList ids={i.sourceIds} />
        <h2>Found on these recorded labels</h2>
        <div className="product-grid">
          {products
            .filter((p) => p.ingredientIds.includes(i.id))
            .map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
        </div>
      </>
    );
  } else {
    const c = catalog.comparisons.find((c) => c.slug === slug[1])!;
    const citations = c.citationPilot ? comparisonCitations(c) : null;
    const evaluation = evaluationFor(c.id);
    body =
      evaluation && citations ? (
        <EditorialComparison
          comparison={c}
          evaluation={evaluation}
          citations={citations}
        />
      ) : (
        <>
          <div className="notice">
            <strong>
              {c.publicationStatus === "draft"
                ? "Draft editorial analysis — human review pending"
                : "Editorial comparison"}
            </strong>
            <p>
              {evaluation
                ? "Academic research and safety assessments are interpreted separately from manufacturer label facts. No independent product testing has been performed."
                : "Based on selected manufacturer label facts. No independent product testing has been performed."}
            </p>
          </div>
          <section className="prose">
            <h2>{c.buyerQuestion}</h2>
            {citations && !evaluation && (
              <p>
                {c.editorialSummary}
                <Citations set={citations} claim="answer" />
              </p>
            )}
            <p className="small">
              Analysis updated <time dateTime={c.updatedAt}>{c.updatedAt}</time>
              . Recorded price dates remain separate.
            </p>
          </section>
          {citations && evaluation && (
            <ComparisonEvaluation
              evaluation={evaluation}
              citations={citations}
            />
          )}
          {citations && <EvidenceNotice />}
          <nav
            className="button-row section"
            aria-label="Jump to comparison details"
          >
            {evaluation && (
              <a className="text-link" href="#before-you-buy">
                Benefits, risks and value
              </a>
            )}
            <a className="text-link" href="#comparison-result-title">
              Compare the labels
            </a>
            <a className="text-link" href="#buying-notes">
              Buying notes
            </a>
            <a className="text-link" href="#product-questions">
              Questions
            </a>
            <a className="text-link" href="#comparison-sources">
              Sources
            </a>
          </nav>
          <div className="question-grid section">
            {c.practicalDifferences.map((difference, index) => (
              <section className="panel" key={difference.title}>
                <h2>{difference.title}</h2>
                {citations && difference.interpretation && (
                  <span className="reference-kind">
                    Editorial interpretation / catalog observation
                  </span>
                )}
                <p>
                  {difference.text}
                  {citations && (
                    <Citations set={citations} claim={`difference-${index}`} />
                  )}
                </p>
              </section>
            ))}
          </div>
          <section className="prose">
            <h2>Documented differences</h2>
            <p>
              {c.documentedDifferences}
              {citations && <Citations set={citations} claim="documented" />}
            </p>
          </section>
          <section
            id="buying-notes"
            className="prose section"
            aria-label="Use this comparison for your decision"
          >
            <h2>Use this comparison for your decision</h2>
            {c.decisionNotes.map((note, index) => (
              <section key={note.title}>
                <h3>{note.title}</h3>
                {citations && note.interpretation && (
                  <span className="reference-kind">
                    Editorial interpretation / catalog observation
                  </span>
                )}
                <p>
                  {note.text}
                  {citations && (
                    <Citations set={citations} claim={`decision-${index}`} />
                  )}
                </p>
              </section>
            ))}
          </section>
          <ComparisonTable
            a={products.find((p) => p.id === c.comparedProductIds[0])!}
            b={products.find((p) => p.id === c.comparedProductIds[1])!}
            showGuide={false}
          />
          {citations && c.researchContext && !evaluation && (
            <section className="prose section" id="research-context">
              <h2>Ingredient research is not a test of these two serums</h2>
              <p>
                {c.researchContext.text}
                <Citations set={citations} claim="research" />
              </p>
              <p>
                Our inspected sources do not establish a head-to-head result for
                this pair. This is a scoped source check, not a systematic
                review of all peptide research.
              </p>
            </section>
          )}
          <section
            id="product-questions"
            className="prose section"
            aria-label="Questions about these products"
          >
            <h2>Questions about these products</h2>
            {c.questions.map((question, index) => (
              <section key={question.question}>
                <h3>{question.question}</h3>
                <p>
                  {question.answer}
                  {citations && (
                    <Citations set={citations} claim={`question-${index}`} />
                  )}
                </p>
                {!citations && <EvidenceLinks ids={question.sourceIds} />}
              </section>
            ))}
          </section>
          <LearningGuides slugs={c.relatedGuideSlugs} />
          <section className="prose section">
            <h2>What we cannot tell from the label</h2>
            <p>{c.limitations}</p>
            <p>
              Price, peptide counts and commercial percentages cannot predict
              your results or individual tolerance.
            </p>
          </section>
          <h2 id="comparison-sources">Check the original sources</h2>
          {citations ? (
            <References set={citations} />
          ) : (
            <SourceList ids={c.sourceIds} />
          )}
          <div className="button-row section">
            {c.comparedProductIds.map((id) => (
              <RetailerLink
                key={id}
                product={products.find((p) => p.id === id)!}
              />
            ))}
            <Link
              className="text-link"
              href={`${comparisonPath()}?a=${c.comparedProductIds[0]}&b=${c.comparedProductIds[1]}`}
            >
              Change these products <ArrowRight size={16} />
            </Link>
          </div>
          <AffiliateDisclosure />
        </>
      );
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", item: site.url },
      ...breadcrumbs.map((b) => ({
        name: b.label,
        item: new URL(b.href, site.url).href,
      })),
    ].map((v, i) => ({ "@type": "ListItem", position: i + 1, ...v })),
  };
  return (
    <div
      className={`wrap page-content ${path === "compare" ? "comparison-page" : ""} ${slug[0] === "compare" && slug[1] && evaluationFor(catalog.comparisons.find((c) => c.slug === slug[1])?.id ?? "") ? "editorial-pilot" : ""}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs items={breadcrumbs} />
      {slug[0] === "compare" && slug[1] && (
        <Link className="text-link" href="/skincare/">
          Skin & cosmetics →
        </Link>
      )}
      {path !== "compare" && (
        <div className="page-heading">
          <span className="eyebrow">
            {site.name.toUpperCase()} /{" "}
            {slug[0] === "compare"
              ? "COMPARISONS"
              : slug[0] === "tools"
                ? "FREE TOOLS"
                : slug[0] === "skincare"
                  ? "SKIN & COSMETICS"
                  : "ABOUT PEPTIVELO"}
          </span>
          <h1>{r.title}</h1>
          <p>{r.description}</p>
        </div>
      )}
      {body}
    </div>
  );
}
