"use client";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export function SearchOutcome({
  empty,
  active,
}: {
  empty: boolean;
  active: boolean;
}) {
  const emitted = useRef(false);
  useEffect(() => {
    if (active && empty && !emitted.current) {
      emitted.current = true;
      track("search_no_results", { source: "results" });
    }
  }, [active, empty]);
  return null;
}
// Delegation also covers server-rendered citations without shipping source
// records or study text into a tracking component. Never emit URLs or queries.
export function ReferenceEvents() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (
        target?.closest(
          ".inline-citations, .numbered-references, .education-sources, .documentation-sources, .explore-sources",
        )
      )
        track("reference_opened", { source: "document" });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
