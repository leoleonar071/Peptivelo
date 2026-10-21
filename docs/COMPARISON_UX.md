# Comparison experience — 2026-10-19

The comparator uses two equal product columns and aligned characteristic rows on desktop, inspired by the supplied product-comparison references. Both products receive the same visual weight; no winner, score or efficacy recommendation is implied.

## Implemented behavior

- Fresh visits show two empty slots. Valid a/b IDs restore a pair; invalid or duplicate products stay unselected. The existing visual search dialogs retain keyboard navigation, duplicate prevention, Escape/backdrop dismissal, scroll locking and focus return.
- A full pair moves its product controls into the table column headers: photograph, exact name, A/B identity, change and remove. The same table is used by editorial routes, with static product headers and the existing draft notice.
- Rows cover presentation, format, recorded price, price per mL, selected peptide names, concentration disclosures, missing information and label sources. Sources and dates are shown at the point of use.
- Show only differences hides matching recorded facts. Missing prices are never considered verified matches. Concentration limitations, unknowns and sources remain visible. The status states how many matching rows are hidden. Ingredient-name matching ignores case and order without merging different chemical forms.
- Native table semantics, scoped column and row headers and explicit cell/header associations are retained. Mobile rows reflow into a full-width characteristic label followed by two aligned values with A/B identities. There is no horizontal page scrolling at 320px.
- Product headers remain sticky inside the table. Stickiness is disabled on viewports shorter than 600px to preserve reading space when zoomed or in landscape. Table controls stay usable while sticky, including the top-layer native picker dialog.
- Controls for swapping, copying and resetting are grouped above the table. A completed pair focuses the results heading; removing/resetting a pair focuses an empty slot. Repeated introductory content is reduced after a full pair is selected.
- A compact price interpretation and links to expandable price, ingredient, concentration and source details follow the table. No cheaper-product conclusion is generated when a price is missing.

## Code and design

src/components/comparison.tsx owns selection, dialogs, URL sharing and expandable details. src/components/comparison-grid.tsx renders the responsive table and filter. src/lib/comparison.ts defines the row data and filtering logic. The existing petroleum/mineral palette and self-hosted DM Sans are preserved. Reusable decisions are in .interface-design/system.md.

## Verification

The Next.js production build, TypeScript and lint pass. Unit tests cover missing-price retention, matching-fact filtering and ingredient-order handling as well as existing cost and label logic. Browser tests cover desktop, tablet and mobile, including narrow 320px reflow, real sticky-header bounds, picker accessibility, shared URLs, swapping/resetting and source navigation. Current totals are recorded in VERIFICATION.md.

Current screenshots: [desktop](compare-matrix-desktop.png), [tablet](compare-matrix-tablet.png), [mobile](compare-matrix-mobile.png). Viewport captures use the corresponding -viewport.png suffix. Earlier compare-overview images document the preceding card layout.

## Limits

The catalog still has two documented profiles and incomplete ingredient selections. No prices, scientific claims or commercial observations were added. Manufacturer image provenance and unverified reuse rights remain documented in public/images/products/SOURCES.md. Shopper comprehension testing, physical-device keyboard testing and manual screen-reader evaluation remain outstanding. This change was verified on Next.js, not rebuilt on Workers/vinext, and was not publicly deployed.
