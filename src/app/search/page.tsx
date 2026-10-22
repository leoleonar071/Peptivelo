import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { searchIndex } from "@/lib/search-index";
import { searchEntries, searchCategories } from "@/lib/search";
export const metadata = {
  title: "Search Peptivelo",
  robots: { index: false, follow: true },
};
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").slice(0, 200);
  const results = searchEntries(searchIndex, query);
  return (
    <div className="wrap universal-search-page">
      <span className="eyebrow">EXPLORE PEPTIVELO</span>
      <h1>Follow the question.</h1>
      <p>
        Find documented ingredients, products, guides, comparisons and sources.
        Search retrieves existing pages; it does not generate scientific
        answers.
      </p>
      <HeroSearch entries={searchIndex} initialQuery={query} />
      <p className="search-result-count">
        {query
          ? `${results.length} results for “${query}”`
          : "Start with a peptide, product, brand or question."}
      </p>
      {!!query && !results.length && (
        <div className="search-empty">
          <h2>No matching documents yet.</h2>
          <p>
            Try a shorter query or explore the{" "}
            <Link href="/library/">peptide library</Link>. A missing result does
            not establish whether an ingredient works.
          </p>
        </div>
      )}
      {searchCategories.map((category) => {
        const group = results.filter((entry) => entry.category === category);
        return group.length ? (
          <section className="search-result-group" key={category}>
            <h2>
              {category} <span>{group.length}</span>
            </h2>
            {category === "Products" && (
              <p className="search-market-note">
                Market context: United States (USD). Recorded label and price
                information; availability in other countries is not documented.
                Educational results are not restricted by market.
              </p>
            )}
            {group.map((entry) => (
              <Link
                className="search-document"
                href={entry.href}
                key={entry.href}
              >
                <div>
                  <h3>{entry.name}</h3>
                  <p>{entry.detail}</p>
                  {entry.matchReason && (
                    <p className="search-match-reason">{entry.matchReason}</p>
                  )}
                </div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </section>
        ) : null;
      })}
      <p className="home-hero-review">
        Scientific interpretations pending qualified review.{" "}
        <Link href="/methodology/">Our methodology</Link>
      </p>
    </div>
  );
}
