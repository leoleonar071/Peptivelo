"use client";
export type EventName =
  | "search_submitted"
  | "search_result_selected"
  | "search_no_results"
  | "reference_opened"
  | "discovery_shared"
  | "search_performed"
  | "product_viewed"
  | "comparison_started"
  | "comparison_completed"
  | "price_calculator_used"
  | "affiliate_link_clicked";
// No network provider or identifier is enabled by default. A consent-aware adapter can subscribe.
export function track(
  name: EventName,
  data: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  // Explicit payload keys prevent an accidental query, email, URL or free-form
  // input reaching even the local event bus. No transport or persistent ID.
  const safeKeys = new Set([
    "source",
    "format",
    "rows",
    "length",
    "id",
    "a",
    "b",
    "productId",
    "retailerId",
    "product",
    "affiliate",
  ]);
  const safe = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) =>
        safeKeys.has(key) &&
        (typeof value === "number"
          ? Number.isFinite(value)
          : typeof value === "string" &&
            /^[a-zA-Z0-9 _&:-]{1,80}$/.test(value)),
    ),
  );
  window.dispatchEvent(
    new CustomEvent("atlas:analytics", { detail: { name, ...safe } }),
  );
}
