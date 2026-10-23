# Identify your serum V3

## Scope and architecture

The `/skincare/identify/` route remains unchanged. Its existing client component owns local search, variant selection, confirmation and ingredient disclosures. Search normalizes accents, splits words and checks real product names, brands and documented ingredient entries. No remote product database or new dependency was introduced.

The former scan-first and search cards have been replaced by one search-led surface. The title uses the existing local Instrument Sans; other headings and controls inherit the shared Manrope/Inter system. Page-specific hardcoded light/dark colors were removed in favor of semantic tokens. The scanner trigger is a visible secondary row under the 72px desktop / 64px mobile search. Enter or the search button moves focus to the first matching result; Arrow Down does the same, Escape clears the query. Matching remains synchronous, with a live result count and an empty state; no artificial loading animation was added.

## Product representations

`public/images/products/SOURCES.md` documents that commercial photographs were removed because reuse rights were not established. The browse preview therefore uses deliberately non-photographic label-profile panels with an icon and recorded volume. No package or label appearance is fabricated. Exact product names, brands and sizes remain outside the decorative panels. Three profiles appear initially; typing searches the complete existing facial-serum catalog. The catalog link, confirmation flow, product-profile link, haircare link, ingredient explanations and source links remain available.

## Scanner scope

The public trigger and dialog now say Peptivelo QR. The verified manufacturer barcode registry is empty. A compatible QR resolves only to a known product path on an accepted Peptivelo/current origin; unknown codes never authenticate or condemn a bottle. Camera use still requires an explicit action and browser permission; images decode locally; the decoder is dynamically imported when used. Existing teardown, late-permission cancellation, manual input and image-upload fallback are preserved. The confirmation and ingredient-reading flow remains available for manual selection; compatible QR navigation continues opening the exact product profile as before.

## Files

- `src/components/product-identify.tsx`: unified search, honest QR copy, three-item preview and contextual methodology link.
- `src/styles/product-identifier.css`: responsive layout, shared tokens, typographic hierarchy and interaction states.
- `src/components/product-scanner.tsx`: accurate scanner copy; no changes to decoding or camera lifecycle.
- `src/app/skincare/identify/page.tsx`: metadata specifies compatible Peptivelo QR codes.
- `e2e/identifier-redesign.spec.ts`, `e2e/scanner.spec.ts`, `e2e/brand-themes.spec.ts`: selectors updated for the corrected QR labels; existing behavior checks retained.

## Remaining limits

No photographic packaging recognition, universal barcode identification, authenticity assessment or medical verification is provided. Product photography needs owned assets or permission before reintroduction. Camera/device behavior still needs checks on physical phones; simulated browser tests do not prove performance on every camera. No Core Web Vitals improvement or complete WCAG certification should be inferred solely from a redesign. Deployment is separate from repository implementation.

## Validation completed

Production build, targeted ESLint and 105 unit tests passed. Sixteen browser tests passed, with two duplicate viewport-matrix project entries intentionally skipped. The explicit matrix covers 1440, 1280, 1024, 768, 430, 390, 375 and 320px in both themes, with screenshots, overflow checks, axe accessibility scans, empty/populated/no-result search and scanner opening/closing. Other cases verify exact selection and disclosures, denied camera permission, unknown manual code, local decoding of a genuine generated QR image, late permission cancellation and active-stream teardown. No page errors occurred in the matrix.

A first run caught a lost early mobile click before hydration. The existing client-ready hook now temporarily disables interactive controls until handlers are available and marks the search form busy; all browser cases passed after that correction. Search itself remains synchronous. Desktop light and mobile dark screenshots were visually inspected; representative captures are stored under `docs/identify-v3-identifier-*.png`.
