import Link from "next/link";
import { HeroSearch } from "@/components/hero-search";
import { SearchExploration } from "@/components/search-exploration";
import { SearchResults } from "@/components/search-results";
import { searchIndex } from "@/lib/search-index";
import { searchEntries, searchCategories } from "@/lib/search";
import {
  queryValue,
  resolveExploration,
  explorationState,
  type QueryParams,
} from "@/lib/exploration";
import "../../styles/search-exploration.css";
export const metadata = {
  title: "Search Peptivelo",
  robots: { index: false, follow: true },
};
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const params = await searchParams;
  const query = queryValue(params, "q").slice(0, 200);
  const model = resolveExploration(params);
  const state = model ? explorationState(params, model) : null;
  const results = model ? [] : searchEntries(searchIndex, query);
  const rawPage = Number(queryValue(params, "page"));
  const category =
    searchCategories.find((c) => c === queryValue(params, "group")) ?? "";
  return (
    <div
      className={`wrap universal-search-page ${model ? "exploration-page" : "compact-results-page"}`}
    >
      <div className="explore-search-bar">
        <HeroSearch entries={searchIndex} initialQuery={query} />
      </div>
      {model && state ? (
        <SearchExploration model={model} state={state} />
      ) : (
        <>
          <header className="compact-results-heading">
            <span className="eyebrow">EXPLORE PEPTIVELO</span>
            <h1>
              {query
                ? "Choose a result to explore."
                : "What would you like to understand?"}
            </h1>
            <p>
              Find existing peptide profiles, products and articles. Choose a
              result to explore its context.
            </p>
          </header>
          {results.length > 0 ? (
            <SearchResults
              results={results}
              query={query}
              category={category}
              page={Number.isSafeInteger(rawPage) ? rawPage : 1}
            />
          ) : (
            <div className="search-empty">
              <h2>
                {query
                  ? "No matching documents yet."
                  : "Start with a name or question."}
              </h2>
              <p>
                {query
                  ? "Try a shorter query or another name. "
                  : "Search a peptide, product or brand. "}
                <Link href="/topics/">Explore topics →</Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
