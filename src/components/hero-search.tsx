"use client";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowRight,
  Search,
  BookOpen,
  Columns3,
  FlaskConical,
  Package,
  LoaderCircle,
} from "lucide-react";
import { track } from "@/lib/analytics";
import {
  groupedSuggestions,
  searchEntries,
  searchCategories,
  searchDestination,
  type SearchEntry,
} from "@/lib/search";
const icons = [FlaskConical, Package, BookOpen, Columns3, BookOpen];
const narrowQuery = "(max-width: 540px)";
function subscribeViewport(listener: () => void) {
  const media = window.matchMedia(narrowQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

// Intent: document discovery with equal space for educational sources. Shared
// surfaces, soft border depth, Manrope/Inter and 4px rhythm; focus stays in input.
export function HeroSearch({
  entries,
  initialQuery = "",
}: {
  entries: SearchEntry[];
  initialQuery?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pending, setPending] = useState(false);
  const narrow = useSyncExternalStore(
    subscribeViewport,
    () => window.matchMedia(narrowQuery).matches,
    () => false,
  );
  const results = searchEntries(entries, query);
  const matches = groupedSuggestions(results);
  const expanded = open && !!query.trim();
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.shiftKey ||
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== "k" ||
        !window.matchMedia("(min-width: 768px)").matches
      )
        return;
      const target = event.target;
      if (
        document.querySelector(
          "dialog[open], [role='dialog'][aria-modal='true']",
        ) ||
        (target instanceof Element &&
          target.closest(
            "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']",
          ))
      )
        return;
      event.preventDefault();
      input.current?.focus();
    }
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);
  useEffect(() => {
    if (active >= 0)
      document
        .getElementById(`${id}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, id]);
  function navigate(href: string) {
    track("search_performed");
    setPending(true);
    window.location.assign(href);
  }
  return (
    <div
      className="hero-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <form
        action="/search/"
        role="search"
        aria-label="Search Peptivelo"
        onSubmit={() => {
          track("search_performed");
          setPending(true);
        }}
      >
        <input
          ref={input}
          name="q"
          role="combobox"
          aria-label="Search peptides, products, ingredients, or questions"
          placeholder={
            narrow
              ? "Search Peptivelo..."
              : "Search peptides, products, ingredients, or questions..."
          }
          aria-keyshortcuts="Control+k Meta+k"
          autoComplete="off"
          maxLength={200}
          aria-expanded={expanded}
          aria-controls={`${id}-results`}
          aria-autocomplete="list"
          aria-describedby={`${id}-help`}
          aria-activedescendant={
            expanded && active >= 0 ? `${id}-${active}` : undefined
          }
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Escape") {
              setOpen(false);
              setActive(-1);
            }
            if (
              (event.key === "ArrowDown" || event.key === "ArrowUp") &&
              matches.length
            ) {
              event.preventDefault();
              setOpen(true);
              setActive((index) =>
                event.key === "ArrowDown"
                  ? (index + 1) % matches.length
                  : index <= 0
                    ? matches.length - 1
                    : index - 1,
              );
            }
            if (
              event.key === "Enter" &&
              expanded &&
              active >= 0 &&
              matches[active]
            ) {
              event.preventDefault();
              navigate(searchDestination(matches[active], query));
            }
          }}
        />
        <button
          type="submit"
          aria-label="Search Peptivelo"
          aria-busy={pending}
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle
              className="search-loading"
              size={21}
              aria-hidden="true"
            />
          ) : (
            <Search size={21} aria-hidden="true" />
          )}
        </button>
      </form>
      <span id={`${id}-help`} className="sr-only">
        Search existing documents. Use arrow keys to choose a suggestion, Enter
        to open it, or Escape to close. From desktop, press Control K or Command
        K to focus search outside forms.
      </span>
      <div className="hero-search-results" hidden={!expanded}>
        <div
          role="listbox"
          id={`${id}-results`}
          aria-label="Search suggestions"
        >
          {searchCategories.map((category, groupIndex) => {
            const group = matches.filter(
              (entry) => entry.category === category,
            );
            const Icon = icons[groupIndex];
            return group.length ? (
              <div
                role="group"
                aria-labelledby={`${id}-group-${groupIndex}`}
                key={category}
              >
                <div
                  className="search-group-heading"
                  id={`${id}-group-${groupIndex}`}
                >
                  <Icon size={14} aria-hidden="true" />
                  {category}
                </div>
                {group.map((entry) => {
                  const index = matches.indexOf(entry);
                  return (
                    <div
                      key={entry.href}
                      id={`${id}-${index}`}
                      role="option"
                      aria-selected={active === index}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => navigate(searchDestination(entry, query))}
                      onPointerMove={() => setActive(index)}
                    >
                      <span>
                        <strong>{entry.name}</strong>
                        <small>{entry.detail}</small>
                        {entry.matchReason && (
                          <small>{entry.matchReason}</small>
                        )}
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            ) : null;
          })}
        </div>
        {!matches.length && (
          <p className="search-empty">
            No matching documents. Try a peptide name, a brand, or a shorter
            question. <Link href="/library/">Explore the peptide library</Link>.
          </p>
        )}
        <Link
          className="search-all"
          href={`/search/?q=${encodeURIComponent(query)}`}
        >
          View all results{results.length ? ` (${results.length})` : ""}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <span className="sr-only" role="status">
        {pending
          ? "Opening search results…"
          : expanded
            ? `${results.length} documents found. ${matches.length} suggestions available.`
            : ""}
      </span>
    </div>
  );
}
