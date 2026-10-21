"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const extraLinks = [
  ["/library/", "Peptide library"],
  ["/skincare/identify/", "Know your serum"],
  ["/skincare/guides/", "Label guides"],
  ["/skincare/ingredients/", "Ingredients"],
  ["/tools/price-per-ml/", "Price calculator"],
  ["/methodology/", "Methodology"],
  ["/skincare/choose/", "Choose by your question"],
  ["/haircare/", "Hair & scalp"],
  ["/sources/", "Sources"],
];

export function Navigation() {
  const pathname = usePathname();
  function item(href: string, label: string) {
    const active = pathname.replace(/\/$/, "") === href.replace(/\/$/, "");
    return (
      <Link key={href} href={href} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  }
  return (
    <nav aria-label="Main navigation">
      {item("/skincare/products/", "Explore products")}
      {item("/skincare/compare/", "Compare")}
      <div className="nav-secondary">
        {extraLinks.slice(0, 2).map(([href, label]) => item(href, label))}
      </div>
      <details
        className="nav-more"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.currentTarget.open = false;
            event.currentTarget.querySelector("summary")?.focus();
          }
        }}
      >
        <summary>
          More <ChevronDown size={16} />
        </summary>
        <div
          className="nav-menu"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              const details = event.currentTarget.closest("details");
              if (details) details.open = false;
            }
          }}
        >
          {extraLinks.map(([href, label]) => item(href, label))}
        </div>
      </details>
    </nav>
  );
}
