const returnPaths = new Set(["/search/", "/peptides/"]);
const contextKeys = new Set([
  "q",
  "entity",
  "tab",
  "group",
  "sort",
  "page",
  "a",
  "b",
  "topic",
  "format",
  "qname",
]);

// Only local discovery destinations can be carried through a document. No
// arbitrary redirects or protocols. One validated local parent preserves the
// results → exploration → profile journey, without unbounded nesting.
export function discoveryReturn(value?: string, depth = 0): string | undefined {
  if (!value || value.length > 3000 || /[\\\r\n]/.test(value)) return undefined;
  try {
    const url = new URL(value, "https://peptivelo.invalid");
    if (
      url.origin !== "https://peptivelo.invalid" ||
      !returnPaths.has(url.pathname)
    )
      return undefined;
    const params = new URLSearchParams();
    for (const [key, item] of url.searchParams) {
      if (key === "returnTo" && depth === 0) {
        const parent = discoveryReturn(item, 1);
        if (parent) params.set(key, parent);
      }
      if (contextKeys.has(key) && !params.has(key))
        params.set(
          key,
          item.slice(0, key === "q" || key === "qname" ? 200 : 160),
        );
    }
    return url.pathname + (params.size ? `?${params}` : "");
  } catch {
    return undefined;
  }
}

const productPaths = new Set([
  ...rawCatalog.products
    .filter((p) => p.editorialStatus === "published")
    .map((p) => `/skincare/products/${p.slug}/`),
  `/haircare/products/${rawHaircare.product.slug}/`,
]);
export function productReturn(value?: string): string | undefined {
  if (!value || value.length > 1000 || /[\\\r\n]/.test(value)) return undefined;
  try {
    const url = new URL(value, "https://peptivelo.invalid");
    return url.origin === "https://peptivelo.invalid" &&
      productPaths.has(url.pathname)
      ? url.pathname
      : undefined;
  } catch {
    return undefined;
  }
}
export function withProductContext(
  href: string,
  fromProduct?: string,
  returnTo?: string,
) {
  const url = new URL(
    withDiscoveryReturn(href, returnTo),
    "https://peptivelo.invalid",
  );
  if (url.origin !== "https://peptivelo.invalid") return href;
  const safe = productReturn(fromProduct);
  if (safe) url.searchParams.set("fromProduct", safe);
  return url.pathname + url.search + url.hash;
}
export function withDiscoveryReturn(href: string, returnTo?: string) {
  const safe = discoveryReturn(returnTo);
  if (!safe) return href;
  const url = new URL(href, "https://peptivelo.invalid");
  if (url.origin !== "https://peptivelo.invalid") return href;
  url.searchParams.set("returnTo", safe);
  return url.pathname + url.search + url.hash;
}
import rawCatalog from "../data/catalog.json";
import rawHaircare from "../data/haircare.json";
