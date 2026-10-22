# Where to buy and measurement — 2026-10-22

Country selector refinement: decorative locally served SVG flag beside the full country name. Native select, keyboard interaction, labels and no-JavaScript form submission remain available. Flags identify delivery markets, not interface languages. `src/components/market-select.tsx`, `src/styles/product-offers.css` and `public/images/flags/` contain this refinement.

The existing buying notebook now includes the four additional Sephora observations researched on 22 October. This gives each of the five pilot products a manufacturer listing and Sephora listing. Existing destination filters, pricing, evidence links, missing shipping states and conditional shipping estimates are preserved. No Ulta 1 oz listing was silently mapped to a 30 mL variant. New records have unconfirmed stock and shipping and no affiliate URL.

## Changed files

- `src/data/offers.json`: additional exact-size Sephora observations for NIOD CAIS3, Multi-Peptide + HA, Matrixyl and Argireline.
- `src/components/product-offers.tsx`: Where to buy heading, tracked price-check links, first-visible marker.
- `src/components/offer-tracking.tsx`: first-visible event and clicked-store event; normal links work if collection fails; DNT and GPC suppress requests. No cookies, local identifiers or new dependencies.
- `src/app/api/offer-events/route.ts`: same-origin JSON endpoint, fixed event names and registered offer IDs; rejects additional fields and oversized payloads. The server derives product, retailer, market and affiliate status rather than trusting client-supplied metadata.
- `src/lib/pages.ts`: privacy explanation updated to disclose server collection and hosting-log limitations.
- Browser coverage in `e2e/offer-tracking.spec.ts` and adjusted existing offer tests.

## Read the measurements

In local development, accepted records appear in the server console. After deployment to the existing Cloudflare Worker, they appear in its logs because that configuration already enables logs. Filter for `peptivelo_offer_event`, then group by `name`, `product`, `retailer` and `market` over a chosen time window. `offers_viewed` means the buying section entered the viewport once per mount. `offer_clicked` means a price-check link was activated. The view event's offer ID is a catalog anchor; it does not mean that seller was clicked. No retailer is assigned to that event.

Counts are interactions, not unique people, sales, customers, revenue or guaranteed attribution. Reloads/revisits and automation can affect them. Origin and schema checks limit accidental misuse but do not prevent forged traffic from scripts. Browser privacy preferences or request failures can reduce counts. No click identifier is sent to retailers.

This is a log-backed initial receiver, not a permanent analytics database or dashboard. Hosting retention, quotas and account settings determine available history; export logs before retention expires if historical reporting is needed. Do not claim a complete conversion rate or long-term customer acquisition report from these records. A later analytics store/reporting system and approved affiliate-network reports would be needed for those functions.

No new deployment or external application registration was performed as part of this feature. The existing 30-day observation freshness rule remains; these are dated observations and not a live price feed. The earlier research suggested stricter expiry as a future product decision, but this change preserves the existing notebook behavior.

## Validation

Production Next.js build passed. All 105 unit tests passed. The 15 existing buying-block browser cases passed, including both themes, responsive layouts, missing data, filters and operation without JavaScript. All 9 new telemetry cases passed across desktop/tablet/mobile after correcting trailing-slash redirects and server origin normalization. Captures of the buying block were reviewed. Production Cloudflare reception is not claimed until this version is deployed and checked there.
