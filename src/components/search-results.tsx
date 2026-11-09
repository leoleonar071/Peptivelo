"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { activeTopics } from "@/lib/topic-registry";
import { track } from "@/lib/analytics";
import { useClientReady } from "@/lib/use-client-ready";
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
  topic = "",
  format = "",
}: {
  results: SearchEntry[];
  query: string;
  category: string;
  page: number;
  topic?: string;
  format?: string;
}) {
  const router = useRouter();
  const ready = useClientReady();
  const filtered = results.filter(
    (r) =>
      (!category || r.category === category) &&
      (!topic || r.topic === topic) &&
      (!format || r.format === format),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const current = Math.min(Math.max(1, page), pageCount);
  function href(
    nextCategory: string,
    nextPage: number,
    nextTopic = topic,
    nextFormat = format,
  ) {
    return `/search/?${new URLSearchParams({ q: query, group: nextCategory, topic: nextTopic, format: nextFormat, page: String(nextPage) })}`;
  }
  return (
    <>
      <form
        className="explore-results-controls"
        aria-busy={!ready}
        action="/search/"
        method="get"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          router.push(
            href(
              String(data.get("group")),
              1,
              String(data.get("topic")),
              String(data.get("format")),
            ),
            { scroll: false },
          );
        }}
      >
        <input type="hidden" name="q" value={query} />
        <label htmlFor="result-format">
          Show
          <select
            id="result-format"
            name="group"
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
        <label htmlFor="result-topic">
          Topic
          <select
            id="result-topic"
            name="topic"
            value={topic}
            onChange={(event) =>
              router.push(href(category, 1, event.target.value), {
                scroll: false,
              })
            }
          >
            <option value="">All topics</option>
            {activeTopics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="result-reading-format">
          Reading format
          <select
            id="result-reading-format"
            name="format"
            value={format}
            onChange={(event) =>
              router.push(href(category, 1, topic, event.target.value), {
                scroll: false,
              })
            }
          >
            <option value="">All formats</option>
            {[
              ...new Set(
                results
                  .map((entry) => entry.format)
                  .filter((value): value is string => !!value),
              ),
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button className="button secondary" type="submit">
          Apply filters
        </button>
        <p role="status">
          {filtered.length} results{query ? ` for “${query}”` : ""}
        </p>
      </form>
      {!filtered.length && (
        <div className="search-empty">
          <h2>No results in these filters.</h2>
          <p>Try another topic or format.</p>
          <Link className="text-link" href={href("", 1, "", "")}>
            Reset filters →
          </Link>
        </div>
      )}
      <div className="search-result-group">
        {filtered.slice((current - 1) * 6, current * 6).map((entry) => (
          <Link
            className="search-document"
            key={entry.href}
            href={
              entry.entity && entry.category !== "Guides & articles"
                ? `${searchDestination(entry, query)}&returnTo=${encodeURIComponent(href(category, current))}`
                : searchDestination(entry, query, href(category, current))
            }
            onClick={() =>
              track("search_result_selected", {
                source: "results",
                format: entry.category,
              })
            }
          >
            <span className="eyebrow">
              {entry.category}{" "}
              {entry.entity
                ? `· ${entry.entity.context === "skin" ? "Skin & cosmetics" : entry.entity.context === "hair" ? "Hair & scalp" : "Health & research"}`
                : ""}
            </span>
            <h2>{entry.name}</h2>
            <p>{entry.detail}</p>
            <small className="discovery-status">{entry.editorialStatus}</small>
            {entry.matchReason && (
              <p className="search-match-reason">{entry.matchReason}</p>
            )}
            <span className="text-link">
              {entry.entity && entry.category !== "Guides & articles"
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
