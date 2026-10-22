import { z } from "zod";
import rawOffers from "@/data/offers.json";
import { catalog, type Product } from "./data";
import { normalize } from "./math";

export const markets = {
  US: { label: "United States — contiguous states", currency: "USD" },
  GB: { label: "United Kingdom", currency: "GBP" },
  CA: { label: "Canada", currency: "CAD" },
  PE: { label: "Peru", currency: "PEN" },
} as const;
export type Market = keyof typeof markets;
export const offerSorts = {
  retailer: "Store name",
  price: "Recorded product price",
  total: "Estimated product + shipping",
  delivery: "Shortest complete delivery estimate",
  unit: "Recorded price per mL",
} as const;
export type OfferSort = keyof typeof offerSorts;
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "Use a public HTTPS URL without credentials");
const days = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().nonnegative(),
  })
  .refine((value) => value.min <= value.max, "Invalid business-day range");
export const offerSchema = z
  .object({
    id: z.string().min(1),
    productId: z.string().min(1),
    retailerId: z.string().min(1),
    retailerName: z.string().min(1),
    market: z.enum(["US", "GB", "CA", "PE"]),
    currency: z.enum(["USD", "GBP", "CAD", "PEN"]),
    price: z.number().finite().nonnegative(),
    size: z.number().finite().positive(),
    sizeUnit: z.enum(["ml", "oz"]),
    listedSize: z.string().min(1),
    url: httpsUrl,
    sourceUrl: httpsUrl,
    observedAt: z.iso.date(),
    availability: z.enum([
      "not_checked",
      "in_stock_observed",
      "out_of_stock_observed",
    ]),
    affiliateUrl: httpsUrl.nullable(),
    affiliateDisclosure: z.string().min(1).optional(),
    shipping: z
      .object({
        destination: z.enum(["US", "GB", "CA", "PE"]),
        cost: z.number().finite().nonnegative().nullable(),
        transitBusinessDays: days.nullable(),
        processingBusinessDays: days.nullable(),
        sourceUrl: httpsUrl,
        checkedAt: z.iso.date(),
        scenario: z.string().min(1),
      })
      .nullable(),
  })
  .superRefine((offer, context) => {
    if (offer.currency !== markets[offer.market].currency)
      context.addIssue({
        code: "custom",
        message: "Currency must match the recorded market",
      });
    if (offer.affiliateUrl && !offer.affiliateDisclosure)
      context.addIssue({
        code: "custom",
        message: "Compensated links require disclosure",
      });
    if (offer.shipping && offer.shipping.destination !== offer.market)
      context.addIssue({
        code: "custom",
        message: "Shipping must describe this offer's market",
      });
  });
export type Offer = z.infer<typeof offerSchema>;

export function validateOffers(
  value: unknown,
  products: Pick<Product, "id" | "volume" | "volumeUnit">[],
) {
  const offers = z.array(offerSchema).parse(value);
  if (new Set(offers.map((offer) => offer.id)).size !== offers.length)
    throw new Error("Duplicate offer observation ID");
  for (const offer of offers) {
    const product = products.find((item) => item.id === offer.productId);
    if (
      !product ||
      product.volume !== offer.size ||
      product.volumeUnit !== offer.sizeUnit
    )
      throw new Error(
        `Offer must match the exact recorded product size: ${offer.id}`,
      );
  }
  return offers;
}

// Adapt existing observations instead of copying them into a second price file.
const manufacturerOffers: Offer[] = catalog.prices.map((price) => {
  const retailer = catalog.retailers.find(
    (item) => item.id === price.retailerId,
  )!;
  const source = catalog.sources.find((item) => item.id === price.sourceId)!;
  return {
    id: price.id,
    productId: price.productId,
    retailerId: retailer.id,
    retailerName: retailer.name,
    market: "US",
    currency: price.currency,
    price: price.price,
    size: price.size,
    sizeUnit: price.sizeUnit,
    listedSize: `${price.size} ${price.sizeUnit === "ml" ? "mL" : "US fl oz"}`,
    url: source.url,
    sourceUrl: source.url,
    observedAt: price.observedAt,
    // Historical free-text stock flags are not upgraded to verified stock.
    availability: "not_checked",
    affiliateUrl: null,
    shipping: null,
  };
});
export const offers = validateOffers(
  [...manufacturerOffers, ...rawOffers],
  catalog.products,
);
export const marketFrom = (value?: string): Market =>
  value && Object.hasOwn(markets, value) ? (value as Market) : "US";
export const sortFrom = (value?: string): OfferSort =>
  value && Object.hasOwn(offerSorts, value) ? (value as OfferSort) : "retailer";
export const offerMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
const dayMs = 86_400_000;
export function observationFresh(date: string, today: string) {
  const age = Date.parse(today) - Date.parse(date);
  return Number.isFinite(age) && age >= 0 && age <= 30 * dayMs;
}
export function offerMetrics(offer: Offer, market: Market, today: string) {
  const eligible =
    offer.market === market &&
    offer.currency === markets[market].currency &&
    observationFresh(offer.observedAt, today) &&
    offer.availability !== "out_of_stock_observed";
  const shipping =
    eligible &&
    offer.shipping?.destination === market &&
    observationFresh(offer.shipping.checkedAt, today)
      ? offer.shipping
      : null;
  const total = shipping?.cost != null ? offer.price + shipping.cost : null;
  // Transit alone is not an order-to-delivery estimate.
  const delivery =
    shipping?.transitBusinessDays && shipping.processingBusinessDays
      ? {
          min:
            shipping.transitBusinessDays.min +
            shipping.processingBusinessDays.min,
          max:
            shipping.transitBusinessDays.max +
            shipping.processingBusinessDays.max,
        }
      : null;
  return {
    price: eligible ? offer.price : null,
    unit: eligible
      ? (normalize(offer.price, offer.size, offer.sizeUnit)?.perMl ?? null)
      : null,
    total: total != null && Number.isFinite(total) ? total : null,
    delivery,
    shipping,
  };
}
export function selectOffers(
  input: Offer[],
  productId: string,
  market: Market,
  sort: OfferSort,
  today: string,
) {
  const latest = new Map<string, Offer>();
  for (const offer of input.filter(
    (item) => item.productId === productId && item.market === market,
  )) {
    const key = `${offer.retailerId}:${offer.size}:${offer.sizeUnit}:${offer.currency}`;
    const previous = latest.get(key);
    if (
      !previous ||
      offer.observedAt > previous.observedAt ||
      (offer.observedAt === previous.observedAt && offer.id < previous.id)
    )
      latest.set(key, offer);
  }
  const result = [...latest.values()];
  return result.sort((a, b) => {
    const first = offerMetrics(a, market, today),
      second = offerMetrics(b, market, today);
    const x =
      sort === "delivery"
        ? (first.delivery?.max ?? null)
        : sort === "retailer"
          ? null
          : first[sort];
    const y =
      sort === "delivery"
        ? (second.delivery?.max ?? null)
        : sort === "retailer"
          ? null
          : second[sort];
    if (x !== y) return x == null ? 1 : y == null ? -1 : x - y;
    return (
      a.retailerName.localeCompare(b.retailerName) ||
      a.retailerId.localeCompare(b.retailerId)
    );
  });
}
