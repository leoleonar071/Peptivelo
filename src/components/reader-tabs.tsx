"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, BookOpen } from "lucide-react";
import { useClientReady } from "@/lib/use-client-ready";

const tabs = [
  { id: "overview", hash: "before-you-buy", label: "Overview" },
  {
    id: "ingredients",
    hash: "comparison-result-title",
    label: "Ingredients & price",
  },
  { id: "evidence", hash: "research-evidence", label: "Evidence" },
] as const;
type TabId = (typeof tabs)[number]["id"];

// One panel at a time reduces reading load. Server-rendered slots retain all
// sources without hydration; native dialog provides focus containment on demand.
export function ReaderTabs({
  overview,
  ingredients,
  evidence,
  buying,
  references,
  methodology,
  related,
  referenceCount,
}: {
  overview: ReactNode;
  ingredients: ReactNode;
  evidence: ReactNode;
  buying: ReactNode;
  references: ReactNode;
  methodology: ReactNode;
  related: ReactNode;
  referenceCount: number;
}) {
  const ready = useClientReady();
  const [active, setActive] = useState<TabId>("overview");
  const [reference, setReference] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const activeRef = useRef<TabId>("overview");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function writeHash(hash: string, replace = false) {
    if (location.hash === `#${hash}`) return;
    history[replace ? "replaceState" : "pushState"](null, "", `#${hash}`);
  }
  function choose(id: TabId, updateUrl = true) {
    activeRef.current = id;
    setActive(id);
    setReference(null);
    if (updateUrl) writeHash(tabs.find((tab) => tab.id === id)!.hash);
  }
  function closeReference() {
    dialog.current?.close();
    setReference(null);
    writeHash(tabs.find((tab) => tab.id === activeRef.current)!.hash, true);
    requestAnimationFrame(() =>
      trigger.current?.focus({ preventScroll: true }),
    );
  }

  useEffect(() => {
    function followHash(focus = false) {
      let id: string;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const target = id ? document.getElementById(id) : null;
      if (target && root.current?.contains(target)) {
        if (target.matches(".numbered-references > li")) {
          setReference(id);
          return;
        }
        const owner = target.closest<HTMLElement>("[data-reader-panel]")
          ?.dataset.readerPanel as TabId | undefined;
        const tab = owner ?? tabs.find((tab) => tab.hash === id)?.id;
        if (tab) {
          activeRef.current = tab;
          setActive(tab);
        }
        setReference(null);
        requestAnimationFrame(() => {
          let ancestor: HTMLElement | null = target;
          while (ancestor && ancestor !== root.current) {
            if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
            ancestor = ancestor.parentElement;
          }
          if (focus) {
            if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
            target.focus({ preventScroll: true });
            target.scrollIntoView({ block: "center", behavior: "instant" });
          }
        });
      } else {
        activeRef.current = "overview";
        setActive("overview");
        setReference(null);
      }
    }
    const onHistory = () => followHash();
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link || !root.current?.contains(link)) return;
      const hash = link.getAttribute("href")!.slice(1);
      const target = document.getElementById(hash);
      if (!target || !root.current.contains(target)) return;
      event.preventDefault();
      if (target.matches(".numbered-references > li")) {
        trigger.current = link;
        writeHash(hash);
        setReference(hash);
      } else {
        writeHash(hash);
        followHash(true);
      }
    }
    // Run after the dialog replaces the no-JavaScript bibliography.
    const frame = requestAnimationFrame(() => followHash(Boolean(location.hash)));
    window.addEventListener("popstate", onHistory);
    window.addEventListener("hashchange", onHistory);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("hashchange", onHistory);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!ready || !dialog.current) return;
    const element = dialog.current;
    for (const entry of element.querySelectorAll<HTMLElement>(
      ".numbered-references > li",
    ))
      entry.hidden = reference !== "all" && entry.id !== reference;
    if (reference && !element.open) element.showModal();
    if (!reference && element.open) element.close();
    if (reference) {
      element.scrollTop = 0;
      if (reference !== "all")
        document.getElementById(reference)?.focus({ preventScroll: true });
    }
  }, [ready, reference]);

  return (
    <div ref={root} className="reader-tab-shell">
      {ready ? (
        <div
          className="reader-segments"
          role="tablist"
          aria-label="Comparison sections"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                buttons.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`reader-tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`reader-panel-${tab.id}`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => choose(tab.id)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight")
                  next = (index + 1) % tabs.length;
                else if (event.key === "ArrowLeft")
                  next = (index + tabs.length - 1) % tabs.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = tabs.length - 1;
                else return;
                event.preventDefault();
                choose(tabs[next].id);
                buttons.current[next]?.focus();
              }}
            >
              {tab.label}
              {tab.id === "evidence" && <BookOpen size={15} />}
            </button>
          ))}
        </div>
      ) : (
        <nav className="reader-segments" aria-label="Comparison sections">
          {tabs.map((tab) => (
            <a key={tab.id} href={`#${tab.hash}`}>
              {tab.label}
            </a>
          ))}
        </nav>
      )}

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`reader-panel-${tab.id}`}
          data-reader-panel={tab.id}
          role={ready ? "tabpanel" : undefined}
          aria-labelledby={ready ? `reader-tab-${tab.id}` : undefined}
          tabIndex={ready ? 0 : undefined}
          hidden={ready && active !== tab.id}
        >
          {tab.id === "overview" ? (
            overview
          ) : tab.id === "ingredients" ? (
            ingredients
          ) : (
            <>
              {evidence}
              <section className="reader-reference-entry">
                <h2>Check the original sources</h2>
                <p>
                  Research and safety assessments are separate from manufacturer
                  labels.
                </p>
                {ready && (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={(event) => {
                      trigger.current = event.currentTarget;
                      setReference("all");
                    }}
                  >
                    Explore {referenceCount} references
                  </button>
                )}
              </section>
              {methodology}
            </>
          )}
        </div>
      ))}
      <div
        className="reader-shared-buy"
        hidden={ready && active === "evidence"}
      >
        {buying}
        {related}
      </div>

      {ready ? (
        <dialog
          ref={dialog}
          className="reader-reference-dialog"
          aria-labelledby="reader-reference-title"
          onCancel={(event) => {
            event.preventDefault();
            closeReference();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeReference();
          }}
        >
          <div className="reader-reference-header">
            <div>
              <span className="eyebrow">FOLLOW THE SOURCE</span>
              <h2 id="reader-reference-title">
                {reference === "all" ? "References" : "About this reference"}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close reference"
              onClick={closeReference}
            >
              <X size={22} />
            </button>
          </div>
          <div className="reader-reference-content">{references}</div>
        </dialog>
      ) : (
        <section className="reader-references">
          <h2>References</h2>
          {references}
        </section>
      )}
    </div>
  );
}
