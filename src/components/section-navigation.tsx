"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { skinLinks, topicForPath } from "@/lib/site-navigation";
export function SectionNavigation() {
  const path = usePathname();
  const topic = topicForPath(path);
  const basics = path === "/library/peptide-categories/";
  if (!topic && !basics) return null;
  const links =
    topic?.id === "skin"
      ? skinLinks
      : topic?.id === "hair"
        ? [
            { title: "Overview", href: "/haircare/" },
            { title: "Product", href: "/haircare/#product" },
            { title: "Ingredients", href: "/haircare/#ingredients" },
          ]
        : [
            {
              title: basics ? "Learn" : "Overview",
              href: basics ? "/learn/" : topic!.href,
            },
          ];
  const current =
    topic?.id === "skin"
      ? (skinLinks.slice(1).find((l) => path.startsWith(l.href)) ??
        skinLinks[0])
      : undefined;
  const back =
    topic?.id === "skin" &&
    (path.split("/").filter(Boolean).length > 2 ||
      /\/(identify|choose)\/$/.test(path))
      ? current
      : topic?.id === "hair" && path !== "/haircare/"
        ? {
            title: path.includes("/ingredients/")
              ? "hair ingredients"
              : "hair products",
            href: path.includes("/ingredients/")
              ? "/haircare/#ingredients"
              : "/haircare/#product",
          }
        : path.startsWith("/library/")
          ? {
              title: basics ? "Learn" : "Health & research",
              href: basics ? "/learn/" : "/topics/health-research/",
            }
          : undefined;
  const selected = (href: string) =>
    topic?.id === "skin"
      ? current?.href === href
      : href.includes("#ingredients")
        ? path.includes("/ingredients/")
        : href.includes("#product")
          ? path.includes("/products/")
          : path === href;
  return (
    <div className="section-navigation wrap">
      <div className="section-identity">{topic?.title ?? "Learn"}</div>
      <nav aria-label={`${topic?.title ?? "Learn"} navigation`}>
        {links.map((l) => (
          <Link
            href={l.href}
            key={l.href}
            aria-current={selected(l.href) ? "location" : undefined}
          >
            {l.title}
          </Link>
        ))}
      </nav>
      {topic?.id === "skin" && (
        <div className="section-actions">
          <Link href="/skincare/identify/">Identify my serum</Link>
          <Link href="/skincare/choose/">Choose by my question</Link>
          <Link href="/tools/price-per-ml/">Price calculator</Link>
        </div>
      )}
      {topic?.id !== "skin" && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span> / </span>
          <Link href={basics ? "/learn/" : topic!.href}>
            {topic?.title ?? "Learn"}
          </Link>
          {path.startsWith("/library/") && (
            <span>
              {" "}
              /{" "}
              {basics
                ? "Peptide categories"
                : path.includes("bpc-157")
                  ? "BPC-157"
                  : "Retatrutide"}
            </span>
          )}
          {path.includes("/haircare/ingredients/") && (
            <span> / Ingredient profile</span>
          )}
          {path.includes("/haircare/products/") && (
            <span> / Product profile</span>
          )}
        </nav>
      )}
      {back && (
        <Link className="section-back" href={back.href}>
          ← Back to {back.title}
        </Link>
      )}
    </div>
  );
}
