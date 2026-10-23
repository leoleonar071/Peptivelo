import { ArrowUpRight } from "lucide-react";
import type { ComparisonValue } from "@/lib/comparison";
import { IngredientHelp } from "./ingredient-help";
export function FactValue({
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
          target={value.href.startsWith("/") ? undefined : "_blank"}
          rel={value.href.startsWith("/") ? undefined : "noopener noreferrer"}
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
      {value.limitLabel && (
        <small className="data-limit-inline">
          <strong>{value.limitLabel}</strong>
        </small>
      )}
    </>
  );
}
