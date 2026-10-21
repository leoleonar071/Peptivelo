"use client";
export type EventName =
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
  window.dispatchEvent(
    new CustomEvent("atlas:analytics", { detail: { name, ...data } }),
  );
}
