import { products } from "./data";
import { site } from "./config";

// Add manufacturer GTIN mappings only after checking the exact product/size
// against a recorded source. No manufacturer barcodes are verified yet.
export const verifiedProductCodes: readonly {
  code: string;
  productId: string;
  sourceUrl: string;
  checkedAt: string;
}[] = [];

export function resolveProductCode(raw: string, currentOrigin: string) {
  const value = raw.trim();
  if (!value || value.length > 2048) return undefined;
  const registered = verifiedProductCodes.find((entry) => entry.code === value);
  if (registered) return products.find((p) => p.id === registered.productId);
  try {
    // Never follow arbitrary QR links or identify products by partial names.
    const url = new URL(value, currentOrigin);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password)
      return undefined;
    if (
      ![new URL(currentOrigin).origin, new URL(site.url).origin].includes(
        url.origin,
      )
    )
      return undefined;
    return products.find(
      (p) =>
        url.pathname === `/skincare/products/${p.slug}/` ||
        url.pathname === `/skincare/products/${p.slug}`,
    );
  } catch {
    return undefined;
  }
}
