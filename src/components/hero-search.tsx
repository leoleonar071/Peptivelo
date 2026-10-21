"use client";

import { useId, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { track } from "@/lib/analytics";

export type HeroSearchEntry = {
  name: string;
  detail: string;
  terms: string;
  href: string;
};

export function HeroSearch({ entries }: { entries: HeroSearchEntry[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pending, setPending] = useState(false);
  const matches = query.trim()
    ? entries
        .filter((entry) =>
          entry.terms.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 5)
    : [];
  const expanded = open && !!query.trim();
  function navigate(href: string) {
    track("search_performed");
    setPending(true);
    window.location.assign(href);
  }
  return (
    <div
      className="hero-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <form
        action="/skincare/products/"
        role="search"
        aria-label="Search the skincare catalog"
        onSubmit={() => {
          track("search_performed");
          setPending(true);
        }}
      >
        <Search size={20} aria-hidden="true" />
        <input
          name="q"
          role="combobox"
          aria-label="Search a serum, brand, or ingredient"
          placeholder="Search a serum, brand, or ingredient..."
          autoComplete="off"
          aria-expanded={expanded}
          aria-controls={`${id}-results`}
          aria-autocomplete="list"
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
              navigate(matches[active].href);
            }
          }}
        />
        <button
          type="submit"
          aria-label="Search catalog"
          aria-busy={pending}
          disabled={pending}
        >
          {pending ? (
            <span aria-hidden="true">…</span>
          ) : (
            <ArrowRight size={20} aria-hidden="true" />
          )}
        </button>
      </form>
      <div className="hero-search-results" hidden={!expanded}>
        <ul
          id={`${id}-results`}
          role="listbox"
          aria-label="Catalog suggestions"
        >
          {matches.map((entry, index) => (
            <li
              key={entry.href}
              id={`${id}-${index}`}
              role="option"
              aria-selected={active === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => navigate(entry.href)}
            >
              <span>{entry.name}</span>
              <small>{entry.detail}</small>
            </li>
          ))}
        </ul>
        {!matches.length && (
          <p>No matching catalog entries. Try a brand or ingredient name.</p>
        )}
      </div>
      <span className="sr-only" role="status">
        {pending
          ? "Opening search results…"
          : expanded
            ? `${matches.length} suggestions. Use the arrow keys to explore, or Enter to search products.`
            : ""}
      </span>
    </div>
  );
}
