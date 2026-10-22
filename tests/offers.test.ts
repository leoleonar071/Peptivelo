import { describe, expect, it } from "vitest";
import { catalog } from "../src/lib/data";
import {
  marketFrom,
  sortFrom,
  observationFresh,
  offerMetrics,
  selectOffers,
  validateOffers,
  offers,
  type Offer,
} from "../src/lib/offers";

const today = "2026-10-22";
const base = offers.find((offer) => offer.retailerId === "sephora-us")!;
const sample = (overrides: Partial<Offer> = {}): Offer => ({
  ...base,
  ...overrides,
});

describe("market and variant safety", () => {
  it("accepts only supported query values, including inherited-property probes", () => {
    expect(marketFrom("GB")).toBe("GB");
    expect(marketFrom("toString")).toBe("US");
    expect(marketFrom("__proto__")).toBe("US");
    expect(sortFrom("total")).toBe("total");
    expect(sortFrom("constructor")).toBe("retailer");
  });
  it("rejects a different presentation, a mismatched currency and unsafe links", () => {
    expect(() =>
      validateOffers([sample({ size: 60 })], catalog.products),
    ).toThrow(/exact recorded product size/);
    expect(() =>
      validateOffers([sample({ currency: "GBP" })], catalog.products),
    ).toThrow();
    expect(() =>
      validateOffers(
        [sample({ url: "javascript:alert(1)" })],
        catalog.products,
      ),
    ).toThrow();
    expect(() =>
      validateOffers(
        [sample({ url: "https://user:pass@shop.example/product" })],
        catalog.products,
      ),
    ).toThrow();
  });
  it("rejects duplicate observations, non-finite amounts and inconsistent delivery ranges", () => {
    expect(() => validateOffers([base, base], catalog.products)).toThrow(
      /Duplicate/,
    );
    expect(() =>
      validateOffers([sample({ price: Infinity })], catalog.products),
    ).toThrow();
    expect(() =>
      validateOffers(
        [
          sample({
            shipping: {
              ...base.shipping!,
              transitBusinessDays: { min: 4, max: 1 },
            },
          }),
        ],
        catalog.products,
      ),
    ).toThrow();
  });
  it("does not assign US offers to unsupported destinations or invent a COSRX mini price", () => {
    expect(
      selectOffers(offers, "ordinary-copper", "PE", "price", today),
    ).toEqual([]);
    expect(
      selectOffers(offers, "cosrx-six-mini", "US", "price", today),
    ).toEqual([]);
    expect(
      selectOffers(offers, "ordinary-copper", "US", "retailer", today).map(
        (offer) => offer.retailerId,
      ),
    ).toEqual(["sephora-us", "ordinary"]);
  });
});

describe("cost, delivery and observation freshness", () => {
  it("adds shipping only for a dated matching destination and leaves tax outside the estimate", () => {
    expect(offerMetrics(base, "US", today).total).toBeCloseTo(38.95);
    expect(offerMetrics(base, "PE", today).total).toBeNull();
    expect(
      offerMetrics(sample({ shipping: null }), "US", today).total,
    ).toBeNull();
    expect(
      offerMetrics(
        sample({ shipping: { ...base.shipping!, cost: null } }),
        "US",
        today,
      ).total,
    ).toBeNull();
  });
  it("does not confuse transit with delivery and includes processing when both ranges exist", () => {
    expect(offerMetrics(base, "US", today).delivery).toBeNull();
    const withProcessing = sample({
      shipping: {
        ...base.shipping!,
        processingBusinessDays: { min: 1, max: 2 },
      },
    });
    expect(offerMetrics(withProcessing, "US", today).delivery).toEqual({
      min: 2,
      max: 5,
    });
  });
  it("keeps missing and stale values out of numeric comparisons instead of treating them as zero", () => {
    const unknown = sample({
      id: "unknown",
      retailerId: "a",
      retailerName: "A store",
      shipping: null,
    });
    expect(
      selectOffers(
        [unknown, base],
        "ordinary-copper",
        "US",
        "total",
        today,
      ).map((row) => row.id),
    ).toEqual([base.id, "unknown"]);
    const stale = sample({ observedAt: "2026-09-01" });
    expect(offerMetrics(stale, "US", today).price).toBeNull();
    expect(offerMetrics(stale, "US", today).total).toBeNull();
    expect(
      offerMetrics(
        sample({ shipping: { ...base.shipping!, checkedAt: "2026-09-01" } }),
        "US",
        today,
      ).total,
    ).toBeNull();
    expect(observationFresh("2026-10-23", today)).toBe(false);
    expect(observationFresh("2026-09-22", today)).toBe(true);
    expect(observationFresh("invalid", today)).toBe(false);
    expect(
      offerMetrics(
        sample({ availability: "out_of_stock_observed" }),
        "US",
        today,
      ).price,
    ).toBeNull();
  });
  it("ranks complete delivery estimates by their upper bound, never transit alone", () => {
    const slow = sample({
      id: "slow",
      retailerId: "slow",
      shipping: {
        ...base.shipping!,
        processingBusinessDays: { min: 3, max: 5 },
      },
    });
    const fast = sample({
      id: "fast",
      retailerId: "fast",
      shipping: {
        ...base.shipping!,
        processingBusinessDays: { min: 0, max: 1 },
      },
    });
    expect(
      selectOffers(
        [base, slow, fast],
        "ordinary-copper",
        "US",
        "delivery",
        today,
      ).map((row) => row.id),
    ).toEqual(["fast", "slow", base.id]);
  });
  it("chooses the newest observation per store and retains deterministic neutral ties", () => {
    const old = sample({ id: "old", price: 1, observedAt: "2026-10-01" });
    expect(
      selectOffers([old, base], "ordinary-copper", "US", "price", today),
    ).toEqual([base]);
    expect(
      selectOffers([base, old], "ordinary-copper", "US", "price", today),
    ).toEqual([base]);
  });
  it("supports zero shipping but does not overflow totals or unit costs", () => {
    expect(
      offerMetrics(
        sample({ shipping: { ...base.shipping!, cost: 0 } }),
        "US",
        today,
      ).total,
    ).toBe(32);
    const huge = sample({
      price: Number.MAX_VALUE,
      shipping: { ...base.shipping!, cost: Number.MAX_VALUE },
    });
    expect(offerMetrics(huge, "US", today).total).toBeNull();
    expect(() => offerMetrics(huge, "US", today)).not.toThrow();
  });
  it("requires a disclosure for a compensated link", () => {
    expect(() =>
      validateOffers(
        [sample({ affiliateUrl: "https://shop.example/aff" })],
        catalog.products,
      ),
    ).toThrow();
    expect(
      validateOffers(
        [
          sample({
            affiliateUrl: "https://shop.example/aff",
            affiliateDisclosure: "We may earn a commission.",
          }),
        ],
        catalog.products,
      ),
    ).toHaveLength(1);
  });
});
