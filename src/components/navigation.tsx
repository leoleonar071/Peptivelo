"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { globalLinks, topics, topicForPath } from "@/lib/site-navigation";

export function Navigation() {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const topic = topicForPath(pathname);
  useEffect(() => {
    root.current?.querySelectorAll("details").forEach((d) => {
      d.open = false;
    });
  }, [pathname]);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node))
        root.current?.querySelectorAll("details").forEach((d) => {
          d.open = false;
        });
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  function links() {
    return (
      <>
        <details className="topic-menu">
          <summary data-active={!!topic || pathname === "/topics/"}>
            Explore topics <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <div className="topic-menu-panel">
            {topics.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                aria-current={topic?.id === t.id ? "location" : undefined}
              >
                {t.title}
                <small>{t.description}</small>
              </Link>
            ))}
            <Link
              href="/topics/"
              aria-current={pathname === "/topics/" ? "page" : undefined}
            >
              All topics →
            </Link>
          </div>
        </details>
        {globalLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={
              pathname.startsWith(l.href) ||
              (l.href === "/learn/" &&
                pathname === "/library/peptide-categories/")
                ? "page"
                : undefined
            }
          >
            {l.title}
          </Link>
        ))}
      </>
    );
  }
  return (
    <nav
      ref={root}
      className="global-navigation"
      aria-label="Main navigation"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) {
          root.current?.querySelectorAll("details").forEach((details) => {
            details.open = false;
          });
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        const open = Array.from(
          root.current?.querySelectorAll("details[open]") ?? [],
        ).reverse()[0] as HTMLDetailsElement | undefined;
        if (open) {
          open.open = false;
          open.querySelector("summary")?.focus();
          event.stopPropagation();
        }
      }}
    >
      <div className="desktop-navigation">{links()}</div>
      <details className="mobile-navigation">
        <summary>
          Menu <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="mobile-navigation-panel">{links()}</div>
      </details>
    </nav>
  );
}
