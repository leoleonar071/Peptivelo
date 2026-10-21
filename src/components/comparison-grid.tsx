"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brandName, type Product } from "@/lib/data";
import {
  comparisonRows,
  visibleComparisonRows,
  type ComparisonValue,
} from "@/lib/comparison";
import { productPath } from "@/lib/config";
import { Bottle } from "./ui";
import { IngredientHelp } from "./ingredient-help";

function FactValue({
  value,
  explainIngredients = false,
  comparisonQuery,
}: {
  value: ComparisonValue;
  explainIngredients?: boolean;
  comparisonQuery?: string;
}) {
  return (
    <>
      {value.href ? (
        <a
          className="matrix-source"
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value.text} <ArrowUpRight size={15} />
        </a>
      ) : (
        value.text && (
          <span className={value.missing ? "matrix-missing" : "matrix-value"}>
            {value.text}
          </span>
        )
      )}
      {value.items && (
        <ul className="matrix-list">
          {value.items.map((item) => (
            <li key={item}>
              {explainIngredients ? (
                <IngredientHelp name={item} comparisonQuery={comparisonQuery} />
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      )}
      {value.date && (
        <small>
          {value.href ? "Label checked" : "Price recorded"}{" "}
          <time dateTime={value.date}>{value.date}</time>
        </small>
      )}
      {value.note && <small>{value.note}</small>}
      {value.limitLabel && <small className="data-limit-inline"><strong>{value.limitLabel}</strong></small>}
    </>
  );
}

export function ComparisonGrid({
  a,
  b,
  controls,
  clarifyLimits = false,
  returnTo,
}: {
  a: Product;
  b: Product;
  controls?: [ReactNode, ReactNode];
  clarifyLimits?: boolean;
  returnTo?: string;
}) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const id = useId();
  const rows = comparisonRows(a, b, clarifyLimits);
  const visible = visibleComparisonRows(rows, differencesOnly);
  const groups = [...new Set(visible.map((row) => row.group))];
  return (
    <div className="matrix-workspace">
      <div className="matrix-tools">
        <label className="matrix-filter">
          <input
            type="checkbox"
            checked={differencesOnly}
            onChange={(event) => setDifferencesOnly(event.target.checked)}
          />{" "}
          Show only differences
        </label>
        <span role="status">
          {differencesOnly
            ? `${rows.length - visible.length} matching rows hidden · Limits and sources kept visible`
            : "All recorded details · No product rankings"}
        </span>
      </div>
      <p id={`${id}-note`} className="matrix-context">
        Compare recorded facts side by side. Missing information is not a
        negative rating.
      </p>
      <table
        className="visual-comparison"
        role="table"
        aria-describedby={`${id}-note`}
      >
        <caption className="matrix-caption">
          Peptide serum label comparison: {brandName(a)} and {brandName(b)}
        </caption>
        <colgroup>
          <col className="matrix-label-column" />
          <col />
          <col />
        </colgroup>
        <thead role="rowgroup">
          <tr role="row">
            <th className="matrix-corner" scope="col" role="columnheader">
              Compare the details
              <span>
                Two products.
                <br />
                The same questions.
              </span>
            </th>
            {[a, b].map((p, index) => (
              <th
                scope="col"
                role="columnheader"
                id={`${id}-product-${index}`}
                key={index}
              >
                {controls ? (
                  controls[index]
                ) : (
                  <div className="matrix-static-product">
                    <span className="slot-marker">
                      {index === 0 ? "A" : "B"}
                    </span>
                    <Bottle product={p} />
                    <strong>{brandName(p)}</strong>
                    <Link href={productPath(p.slug)}>{p.name}</Link>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody role="rowgroup" key={group}>
            <tr className="matrix-group" role="row">
              <th colSpan={3} role="columnheader" scope="colgroup">
                {group}
              </th>
            </tr>
            {visible
              .filter((row) => row.group === group)
              .map((row) => (
                <tr
                  className="matrix-row"
                  role="row"
                  data-comparison-row={row.id}
                  id={row.id === "price" ? "price-comparison" : row.id === "peptides" ? "comparison-peptides" : undefined}
                  tabIndex={row.id === "price" || row.id === "peptides" ? -1 : undefined}
                  key={row.id}
                >
                  <th id={`${id}-${row.id}`} scope="row" role="rowheader">
                    {row.label}
                    {row.id === "peptides" && (
                      <p className="matrix-row-help">
                        Peptides are small chains of the building blocks used in
                        proteins. Their names identify ingredients, not quality
                        scores. Open an explanation to learn what each one
                        means.
                      </p>
                    )}
                    {row.id === "concentrations" && (
                      <p className="matrix-row-help">
                        A formula is the whole mix. A blend percentage does not
                        tell us the amount of every ingredient.
                      </p>
                    )}
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      role="cell"
                      key={index}
                      headers={`${id}-${row.id} ${id}-product-${index}`}
                    >
                      <span
                        className="matrix-mobile-identity"
                        aria-hidden="true"
                      >
                        <span className="slot-marker">
                          {index === 0 ? "A" : "B"}
                        </span>
                        {brandName(index === 0 ? a : b)}
                      </span>
                      <FactValue
                        value={value}
                        explainIngredients={row.id === "peptides"}
                        comparisonQuery={new URLSearchParams({
                          a: a.id,
                          b: b.id,
                          ...(returnTo ? { returnTo } : {}),
                        }).toString()}
                      />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        ))}
      </table>
      <p className="matrix-footnote">
        Prices are dated USD observations. Ingredient selections are incomplete;
        matching names do not establish equivalent formulas or results.
      </p>
    </div>
  );
}
