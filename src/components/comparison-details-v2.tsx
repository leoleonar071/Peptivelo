"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { brandName, type Product } from "@/lib/data";
import {
  comparisonGroupsV2,
  comparisonRowsV2,
  visibleComparisonRows,
} from "@/lib/comparison";
import { FactValue } from "./comparison-value";

const groupIds = [
  "product-details",
  "ingredient-details",
  "pricing-details",
  "brand-claims",
  "source-details",
];
const descriptions = [
  "Identity, format, market and label dates",
  "Recorded names, explanations and formula coverage",
  "Dated prices, unit costs and their sources",
  "Manufacturer disclosures and missing information",
  "Source trail and limits of comparison",
];
export function ComparisonDetailsV2({ a, b }: { a: Product; b: Product }) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const rows = comparisonRowsV2(a, b);
  const visible = visibleComparisonRows(rows, differencesOnly);
  useEffect(() => {
    const reveal = () => {
      let hash: string;
      try {
        hash = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(hash);
      if (!target || !root.current?.contains(target)) return;
      let parent: HTMLElement | null = target;
      while (parent && parent !== root.current) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
        parent = parent.parentElement;
      }
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });
    };
    const follow = () => {
      setDifferencesOnly(false);
      requestAnimationFrame(() => requestAnimationFrame(reveal));
    };
    const followClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      // A repeated hash does not fire hashchange. Reopen manually closed sections too.
      if (anchor?.closest(".comparison-v2")) follow();
    };
    reveal();
    window.addEventListener("hashchange", follow);
    document.addEventListener("click", followClick);
    return () => {
      window.removeEventListener("hashchange", follow);
      document.removeEventListener("click", followClick);
    };
  }, [a.id, b.id]);
  return (
    <section
      className="v2-details"
      ref={root}
      aria-labelledby="side-by-side-title"
    >
      <h2 id="side-by-side-title">Side-by-side comparison</h2>
      <div className="v2-detail-tools">
        <label>
          <input
            type="checkbox"
            checked={differencesOnly}
            onChange={(e) => setDifferencesOnly(e.target.checked)}
          />{" "}
          Show differences only
        </label>
        <span role="status">
          {differencesOnly
            ? `${rows.length - visible.length} matching rows hidden · Essential limits and sources remain`
            : "All recorded attributes"}
        </span>
      </div>
      {comparisonGroupsV2.map((group, index) => (
        <details
          key={group}
          className="v2-disclosure"
          id={groupIds[index]}
          tabIndex={-1}
        >
          <summary>
            <span>
              {group}
              <small>{descriptions[index]}</small>
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="v2-disclosure-content">
            <table className="v2-fact-table">
              <caption>
                {group}: A — {brandName(a)} {a.name}; B — {brandName(b)}{" "}
                {b.name}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Attribute</th>
                  {[a, b].map((p, i) => (
                    <th key={i} scope="col" id={`${id}-${index}-${i}`}>
                      <span className="v2-letter">{i === 0 ? "A" : "B"}</span>{" "}
                      {brandName(p)}
                      <small>{p.name}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible
                  .filter((row) => row.group === group)
                  .map((row) => (
                    <tr
                      key={row.id}
                      data-comparison-row={row.id}
                      className={
                        row.id === "peptides" ||
                        row.id === "unknowns" ||
                        row.id === "concentrations"
                          ? "v2-long-row"
                          : ""
                      }
                      id={
                        row.id === "price"
                          ? "price-comparison"
                          : row.id === "peptides"
                            ? "comparison-peptides"
                            : undefined
                      }
                      tabIndex={-1}
                    >
                      <th id={`${id}-${row.id}`} scope="row">
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={i}
                          headers={`${id}-${row.id} ${id}-${index}-${i}`}
                        >
                          <span className="v2-cell-identity">
                            <span className="v2-letter">
                              {i === 0 ? "A" : "B"}
                            </span>{" "}
                            {brandName(i === 0 ? a : b)}
                          </span>
                          <FactValue
                            value={value}
                            explainIngredients={row.id === "peptides"}
                            comparisonQuery={new URLSearchParams({
                              a: a.id,
                              b: b.id,
                            }).toString()}
                          />
                          {value.sourceIds?.map((sourceId) => (
                            <Link
                              key={sourceId}
                              className="v2-value-source"
                              href={`/sources/#source-${sourceId}`}
                            >
                              Source →
                            </Link>
                          ))}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            {!visible.some((row) => row.group === group) && (
              <p>
                Matching recorded attributes are hidden. Uncheck “Show
                differences only” to restore them.
              </p>
            )}
          </div>
        </details>
      ))}
    </section>
  );
}
