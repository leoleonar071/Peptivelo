import { offers } from "@/lib/offers";

export async function POST(request: Request) {
  const expectedOrigin = new URL(request.url);
  if (request.headers.get("host")) expectedOrigin.host = request.headers.get("host")!;
  if (request.headers.get("origin") !== expectedOrigin.origin)
    return new Response(null, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return new Response(null, { status: 415 });
  const body = await request.text();
  if (body.length > 512) return new Response(null, { status: 413 });
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (
    !event ||
    !["offer_clicked", "offers_viewed"].includes(event.name) ||
    typeof event.offerId !== "string" ||
    Object.keys(event).some((key) => !["name", "offerId"].includes(key))
  )
    return new Response(null, { status: 400 });
  const offer = offers.find((item) => item.id === event.offerId);
  if (!offer) return new Response(null, { status: 400 });
  // Fixed schema: never log supplied URLs, query strings, IPs or visitor identifiers.
  console.info(
    JSON.stringify({
      type: "peptivelo_offer_event",
      name: event.name,
      offerId: offer.id,
      product: offer.productId,
      retailer: event.name === "offer_clicked" ? offer.retailerId : undefined,
      market: offer.market,
      affiliate: Boolean(offer.affiliateUrl),
      timestamp: new Date().toISOString(),
    }),
  );
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
