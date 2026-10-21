"use client";
import { useEffect, useRef } from "react";

// Keep references collapsed until requested; citation/back links reveal their
// actual target and preserve native link navigation and browser history.
export function LibraryDisclosures({
  children,
}: {
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  function reveal(hash: string) {
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    if (!target || !root.current?.contains(target)) return;
    let parent = target.parentElement;
    while (parent && parent !== root.current) {
      if (parent instanceof HTMLDetailsElement) parent.open = true;
      parent = parent.parentElement;
    }
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "nearest" });
      target.focus({ preventScroll: true });
    });
  }
  useEffect(() => {
    const follow = () => reveal(window.location.hash);
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, []);
  return (
    <div
      ref={root}
      onClick={(event) => {
        const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        if (anchor) reveal(anchor.hash);
      }}
    >
      {children}
    </div>
  );
}
