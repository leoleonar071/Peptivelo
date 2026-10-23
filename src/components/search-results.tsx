"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  searchCategories,
  searchDestination,
  type SearchEntry,
} from "@/lib/search";

export function SearchResults({
  results,
  query,
  category,
  page,
}: {
  results: SearchEntry[];
  query: string;
  category: string;
  page: number;
}) {
  const router = useRouter();
  const filtered = category
    ? results.filter((r) => r.category === category)
    : results;
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const current = Math.min(Math.max(1, page), pageCount);
  function href(nextCategory: string, nextPage: number) {
    return `/search/?${new URLSearchParams({ q: query, group: nextCategory, page: String(nextPage) })}`;
  }
  return (
    <>
      <div className="explore-results-controls">
        <label htmlFor="result-format">
          Show
          <select
            id="result-format"
            aria-label="Show"
            value={category}
            onChange={(e) =>
              router.push(href(e.target.value, 1), { scroll: false })
            }
          >
            <option value="">All results</option>
            {searchCategories
              .filter((c) => results.some((r) => r.category === c))
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
        <p role="status">
          {filtered.length} results{query ? ` for “${query}”` : ""}
        </p>
      </div>
      <div className="search-result-group">
        {filtered.slice((current - 1) * 6, current * 6).map((entry) => (
          <Link
            className="search-document"
            key={entry.href}
            href={searchDestination(entry, query)}
          >
            <span className="eyebrow">
              {entry.category}{" "}
              {entry.entity
                ? `· ${entry.entity.context === "skin" ? "Skin & cosmetics" : entry.entity.context === "hair" ? "Hair & scalp" : "Health & research"}`
                : ""}
            </span>
            <h2>{entry.name}</h2>
            <p>{entry.detail}</p>
            {entry.matchReason && (
              <p className="search-match-reason">{entry.matchReason}</p>
            )}
            <span className="text-link">
              {searchDestination(entry, query) !== entry.href
                ? "Explore"
                : "Read"}{" "}
              →
            </span>
          </Link>
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="explore-pagination" aria-label="Search result pages">
          {current > 1 ? (
            <Link href={href(category, current - 1)}>Previous</Link>
          ) : (
            <span>Previous</span>
          )}
          <span>
            Page {current} of {pageCount}
          </span>
          {current < pageCount ? (
            <Link href={href(category, current + 1)}>Next</Link>
          ) : (
            <span>Next</span>
          )}
        </nav>
      )}
    </>
  );
}
