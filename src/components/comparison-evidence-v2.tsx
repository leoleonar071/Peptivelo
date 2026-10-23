import Link from "next/link";
import type { Product } from "@/lib/data";
import { brandName } from "@/lib/data";
import type { ComparisonEvidenceData } from "@/lib/comparison-evidence";

export function ComparisonEvidenceV2({
  a,
  b,
  data,
}: {
  a: Product;
  b: Product;
  data?: ComparisonEvidenceData;
}) {
  const pair = data?.pairs[[a.id, b.id].sort().join("|")];
  const ingredients = [
    ...new Set([...a.ingredientIds, ...b.ingredientIds]),
  ].flatMap((id) =>
    data?.ingredients[id] ? [{ id, ...data.ingredients[id] }] : [],
  );
  const sources = (ids: string[]) => (
    <ul className="v2-source-links">
      {[...new Set(ids)].map((id) => {
        const source = data?.sources[id];
        return source ? (
          <li key={id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title} ↗
            </a>
            <small>
              {source.kind} · Checked {source.checkedAt}
            </small>
            <details>
              <summary>Source scope & limits</summary>
              <p>{source.supports}</p>
              <p>{source.limits}</p>
            </details>
          </li>
        ) : (
          <li key={id}>
            <Link href={`/sources/#source-${id}`}>Recorded source →</Link>
          </li>
        );
      })}
    </ul>
  );
  const formulationSources = [
    ...new Set(pair?.paragraphs.flatMap((p) => p.sourceIds) ?? []),
  ].filter((id) =>
    /formulation|formula|Manufacturer study summary/i.test(
      data?.sources[id]?.kind ?? "",
    ),
  );
  return (
    <section className="v2-evidence" aria-labelledby="evidence-sources-title">
      <h2 id="evidence-sources-title">Evidence & sources</h2>
      <p className="v2-evidence-note">
        Editorial drafts · Qualified scientific review pending. Label checks are
        not clinical verification.
      </p>
      <details className="v2-disclosure">
        <summary>
          <span>
            Manufacturer labels
            <small>
              What the brands disclose about these exact presentations
            </small>
          </span>
          <span aria-hidden="true">+</span>
        </summary>
        <div className="v2-disclosure-content">
          {[a, b].map((p, i) => (
            <section key={p.id}>
              <h3>
                {i === 0 ? "A" : "B"} · {brandName(p)} {p.name}
              </h3>
              <p>{p.ingredientListScope}</p>
              <p>{p.concentrationDisclosure}</p>
              {sources([p.sourceId])}
            </section>
          ))}
        </div>
      </details>
      <details className="v2-disclosure">
        <summary>
          <span>
            Ingredient research
            <small>Evidence context for recorded ingredient identities</small>
          </span>
          <span aria-hidden="true">+</span>
        </summary>
        <div className="v2-disclosure-content">
          <p>
            These explanations concern ingredients. They do not demonstrate the
            results of either finished serum.
          </p>
          {ingredients.map((i) => (
            <details key={i.id} className="v2-inner-disclosure">
              <summary>{i.name}</summary>
              <p>{i.text}</p>
              <p>{i.limit}</p>
              {sources(i.sourceIds)}
              <Link
                href={`/skincare/ingredients/${i.id}/?${new URLSearchParams({ a: a.id, b: b.id })}`}
              >
                Read the ingredient profile →
              </Link>
            </details>
          ))}
          {!ingredients.length && (
            <p>No ingredient assessment is linked in these catalog records.</p>
          )}
        </div>
      </details>
      <details className="v2-disclosure">
        <summary>
          <span>
            Formulation research
            <small>
              Study preparations must be distinguished from retail products
            </small>
          </span>
          <span aria-hidden="true">+</span>
        </summary>
        <div className="v2-disclosure-content">
          {formulationSources.length ? (
            <>
              <p>
                These sources are linked in the pair’s editorial context.
                Inspect their preparations and limits before applying findings
                to either product.
              </p>
              {sources(formulationSources)}
            </>
          ) : (
            <p>
              No formulation-study source is classified for this pair in the
              catalog. This is a coverage limitation, not proof that no study
              exists.
            </p>
          )}
        </div>
      </details>
      <details className="v2-disclosure">
        <summary>
          <span>
            Finished-product evidence
            <small>What is and is not linked to these exact formulas</small>
          </span>
          <span aria-hidden="true">+</span>
        </summary>
        <div className="v2-disclosure-content">
          <p>
            The catalog does not provide structured study-to-finished-product
            identity links for an automatic clinical comparison. Ingredient or
            formulation studies must not be treated as head-to-head evidence of
            these two products.
          </p>
          {pair && (
            <Link href={pair.href}>
              Read the pair-specific editorial context →
            </Link>
          )}
        </div>
      </details>
      {pair && (
        <details className="v2-disclosure">
          <summary>
            <span>
              Pair-specific editorial analysis
              <small>{pair.title} · Draft</small>
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="v2-disclosure-content">
            <p>
              Existing editorial passages, with the references associated with
              each passage. Interpretation is labeled separately from source
              findings.
            </p>
            {pair.paragraphs.map((p, index) => (
              <section key={index} className="v2-cited-passage">
                <span className="eyebrow">
                  {p.kind === "label"
                    ? "Manufacturer information"
                    : p.kind === "interpretation"
                      ? "Editorial interpretation"
                      : "Evidence context"}
                </span>
                <p>{p.text}</p>
                {p.sourceIds.length > 0 ? (
                  sources(p.sourceIds)
                ) : (
                  <small>
                    Editorial interpretation; not an independent study result.
                  </small>
                )}
              </section>
            ))}
            <Link href={pair.href}>Read the full comparison →</Link>
          </div>
        </details>
      )}
      <Link className="text-link" href="/methodology/">
        How we compare and interpret sources →
      </Link>
    </section>
  );
}
