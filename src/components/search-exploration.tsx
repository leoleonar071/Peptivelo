"use client";
import Link from "next/link";
import { useId, useSyncExternalStore } from "react";
import type {
  Exploration,
  ExplorationProduct,
  ExplorationState,
  SourceLink,
} from "@/lib/exploration";
import {
  explorationUrl,
  compatible,
  sortedAlternatives,
  explorationState,
} from "@/lib/exploration-navigation";
import { money } from "@/lib/math";

function subscribeQuery(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener("peptivelo:exploration-query", listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("peptivelo:exploration-query", listener);
  };
}

function Sources({ items }: { items: SourceLink[] }) {
  return (
    <details className="explore-sources">
      <summary>Sources ({items.length})</summary>
      <ul>
        {items.map((s) => (
          <li key={s.id}>
            <Link href={s.href}>{s.title}</Link>
            <small>
              {s.kind} · Checked {s.date}
            </small>
          </li>
        ))}
      </ul>
    </details>
  );
}
function Price({ product: p }: { product: ExplorationProduct }) {
  return (
    <div className="explore-price">
      {p.price === null ? (
        <strong>
          Price unavailable <span>· {p.size}</span>
        </strong>
      ) : (
        <>
          <strong>
            {money(p.price)} USD <span>· {p.size}</span>
          </strong>
          <span>
            {money(p.perMl!)} / mL · Recorded{" "}
            <time dateTime={p.date!}>{p.date}</time>
          </span>
        </>
      )}
      <small>US label · Excludes tax and shipping</small>
    </div>
  );
}
export function SearchExploration({
  model,
  state: serverState,
}: {
  model: Exploration;
  state: ExplorationState;
}) {
  const locationQuery = useSyncExternalStore(
    subscribeQuery,
    () => window.location.search,
    () => explorationUrl(serverState).split("?")[1],
  );
  const state = explorationState(
    Object.fromEntries(new URLSearchParams(locationQuery)),
    model,
  );
  const sorted = sortedAlternatives(model, state);
  const id = useId();
  const tabs = [
    "overview",
    ...(model.canCompare ? ["compare"] : []),
    "evidence",
  ] as ExplorationState["tab"][];
  function update(changes: Partial<ExplorationState>) {
    window.history.pushState(null, "", explorationUrl(state, changes));
    window.dispatchEvent(new Event("peptivelo:exploration-query"));
  }
  const a = model.reference ?? model.products.find((p) => p.id === state.a);
  const b = model.products.find((p) => p.id === state.b);
  const all = state.tab === "evidence" ? model.evidence : sorted;
  const pageSize = state.tab === "evidence" ? 3 : 4;
  const pageCount = Math.max(1, Math.ceil(all.length / pageSize));
  const visible = sorted.slice((state.page - 1) * 4, state.page * 4);
  function select(p: ExplorationProduct) {
    if (p.id === a?.id && !model.reference) update({ a: "", b: "" });
    else if (p.id === b?.id) update({ b: "" });
    else if (!a) update({ a: p.id, b: "" });
    else if (compatible(a, p)) update({ b: p.id });
  }
  return (
    <section className="search-exploration" aria-label="Explore this result">
      <header className="explore-heading">
        <span className="eyebrow">
          {model.context === "skin"
            ? "Skin & cosmetics"
            : model.context === "hair"
              ? "Hair & scalp"
              : "Health & research"}{" "}
          · {model.status}
        </span>
        <h1>{model.name}</h1>
        {state.tab === "overview" && <p>{model.summary}</p>}
      </header>
      <div
        className="explore-tabs"
        role="tablist"
        aria-label="Explore result"
        onKeyDown={(event) => {
          const index = tabs.indexOf(state.tab);
          const next =
            event.key === "ArrowRight"
              ? (index + 1) % tabs.length
              : event.key === "ArrowLeft"
                ? (index + tabs.length - 1) % tabs.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? tabs.length - 1
                    : -1;
          if (next < 0) return;
          event.preventDefault();
          document.getElementById(`${id}-tab-${tabs[next]}`)?.focus();
          update({ tab: tabs[next], page: 1 });
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`${id}-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={state.tab === tab}
            aria-controls={`${id}-panel`}
            tabIndex={state.tab === tab ? 0 : -1}
            onClick={() => update({ tab, page: 1 })}
          >
            {tab === "overview"
              ? "Overview"
              : tab === "compare"
                ? "Compare"
                : "Evidence"}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        className="explore-panel"
        role="tabpanel"
        aria-labelledby={`${id}-tab-${state.tab}`}
        tabIndex={0}
      >
        {state.tab === "overview" && (
          <>
            {model.blocks.slice(0, 1).map((block) => (
              <div key={block.title} className="explore-overview">
                <h2>{block.title}</h2>
                <p>{block.text}</p>
                <Sources items={block.sources} />
              </div>
            ))}
            {model.blocks.length > 1 && (
              <div className="explore-limit">
                <h2>{model.blocks.at(-1)!.title}</h2>
                <p>{model.blocks.at(-1)!.text}</p>
                <Sources items={model.blocks.at(-1)!.sources} />
              </div>
            )}
            {model.blocks.length > 2 && (
              <details className="explore-disclosure">
                <summary>More context</summary>
                {model.blocks.slice(1, -1).map((block) => (
                  <section key={block.title}>
                    <h3>{block.title}</h3>
                    <p>{block.text}</p>
                    <Sources items={block.sources} />
                  </section>
                ))}
              </details>
            )}
            <Link className="button" href={model.href}>
              {model.kind === "research"
                ? "Read the full article"
                : "Read the full profile"}{" "}
              →
            </Link>
            {model.canCompare ? (
              <button
                className="explore-inline-action"
                onClick={() => update({ tab: "compare", page: 1 })}
              >
                Explore comparison options →
              </button>
            ) : (
              model.products.length > 0 && (
                <section className="explore-related">
                  <h2>Related products</h2>
                  {model.products.slice(0, 2).map((p) => (
                    <Link key={p.id} href={p.href}>
                      {p.name} →
                    </Link>
                  ))}
                  <p className="small">
                    No compatible comparison pair is documented here yet.
                  </p>
                </section>
              )
            )}
            {model.related.length > 0 && (
              <section className="explore-related">
                <h2>Keep exploring</h2>
                {model.related.map((r) => (
                  <Link key={r.href} href={r.href}>
                    {r.title} →
                  </Link>
                ))}
              </section>
            )}
          </>
        )}
        {state.tab === "compare" && (
          <>
            <div className="explore-compare-intro">
              <h2>
                {model.reference
                  ? "Explore alternatives"
                  : "Choose two products"}
              </h2>
            </div>
            <div className="explore-controls">
              <fieldset>
                <legend>Formula relationship</legend>
                {(["same", "other"] as const).map((group) => {
                  const count = model.products.filter(
                    (p) => p.group === group,
                  ).length;
                  return count > 0 ? (
                    <label key={group}>
                      <input
                        type="radio"
                        name={`${id}-group`}
                        value={group}
                        checked={state.group === group}
                        onChange={() => update({ group, page: 1 })}
                      />
                      {group === "same" ? "Same peptide" : "Other formulas"}{" "}
                      <span>({count})</span>
                    </label>
                  ) : null;
                })}
              </fieldset>
              <label className="explore-sort">
                Order
                <select
                  aria-label="Order"
                  value={state.sort}
                  onChange={(e) =>
                    update({
                      sort: e.target.value as ExplorationState["sort"],
                      page: 1,
                    })
                  }
                >
                  <option value="related">Related first</option>
                  <option value="low">Lowest price/mL</option>
                  <option value="high">Highest price/mL</option>
                </select>
              </label>
            </div>
            {a && (
              <div className="explore-selection" aria-label="Selected products">
                <div>
                  {a ? (
                    <>
                      <span className="eyebrow">
                        {model.reference ? "Reference" : "First product"}
                      </span>
                      <strong>{a.name}</strong>
                      <small>
                        {a.size} ·{" "}
                        {a.perMl === null
                          ? "Price unavailable"
                          : `${money(a.perMl)} / mL`}
                      </small>
                      {!model.reference && (
                        <button onClick={() => update({ a: "", b: "" })}>
                          Remove first product
                        </button>
                      )}
                    </>
                  ) : (
                    <span>Choose your first product below.</span>
                  )}
                </div>
                <div>
                  {b ? (
                    <>
                      <span className="eyebrow">Second product</span>
                      <strong>{b.name}</strong>
                      <small>
                        {b.size} ·{" "}
                        {b.perMl === null
                          ? "Price unavailable"
                          : `${money(b.perMl)} / mL`}
                      </small>
                      <button onClick={() => update({ b: "" })}>
                        Remove second product
                      </button>
                    </>
                  ) : (
                    <span>Then choose a compatible alternative.</span>
                  )}
                </div>
                {a && b ? (
                  <Link
                    className="button"
                    href={`/skincare/compare/?${new URLSearchParams({ a: a.id, b: b.id })}`}
                  >
                    Open comparison →
                  </Link>
                ) : (
                  <span className="small">
                    {a ? "Choose one more to compare" : "Choose two to compare"}
                  </span>
                )}
              </div>
            )}
            <p className="explore-market">
              Dated US prices in USD. Shared ingredients and lower cost do not
              establish equivalent or better results.
            </p>
            <div className="explore-product-grid">
              {visible.map((p) => {
                const selected = p.id === a?.id || p.id === b?.id;
                const incompatible = !!a && !selected && !compatible(a, p);
                return (
                  <article
                    key={p.id}
                    className="explore-product"
                    data-selected={selected}
                  >
                    <h3>{p.name}</h3>
                    <Price product={p} />
                    <p>{p.reason}</p>
                    <div className="explore-card-actions">
                      <button
                        className="button"
                        disabled={incompatible}
                        aria-pressed={selected}
                        aria-label={`${selected ? "Selected" : "Compare"}: ${p.name}`}
                        onClick={() => select(p)}
                      >
                        {selected
                          ? "Selected ✓"
                          : b
                            ? "Replace second"
                            : "Compare"}
                      </button>
                      <Link href={p.href}>View profile →</Link>
                    </div>
                    {incompatible && (
                      <small>
                        Choose another first product to compare this formula.
                      </small>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
        {state.tab === "evidence" && (
          <>
            <h2>Evidence & limits</h2>
            <p className="explore-market">
              Source types describe what was examined. They are not quality
              scores. Open an entry to read its scope and limits.
            </p>
            <div className="explore-evidence">
              {model.evidence
                .slice((state.page - 1) * 3, state.page * 3)
                .map((item, index) => (
                  <details
                    key={`${state.page}-${index}`}
                    className="explore-disclosure"
                  >
                    <summary>
                      {item.title}
                      <small>{item.kind}</small>
                    </summary>
                    <p>{item.text}</p>
                    <h3>Limits</h3>
                    <p>{item.limit}</p>
                    <Sources items={item.sources} />
                  </details>
                ))}
            </div>
            <Link className="text-link" href={model.href}>
              Read the full analysis →
            </Link>
          </>
        )}
        {state.tab !== "overview" && pageCount > 1 && (
          <nav
            className="explore-pagination"
            aria-label={`${state.tab === "compare" ? "Products" : "Evidence"} pages`}
          >
            <button
              disabled={state.page <= 1}
              onClick={() => update({ page: state.page - 1 })}
            >
              Previous
            </button>
            <span>
              Page {state.page} of {pageCount}
            </span>
            <button
              disabled={state.page >= pageCount}
              onClick={() => update({ page: state.page + 1 })}
            >
              Next
            </button>
          </nav>
        )}
      </div>
      <span className="sr-only" role="status">
        {`${state.tab} ready${state.tab === "compare" ? `, ${[a, b].filter(Boolean).length} products selected` : ""}`}
      </span>
    </section>
  );
}
