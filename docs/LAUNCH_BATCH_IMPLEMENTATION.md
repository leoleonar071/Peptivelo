# First US catalog batch — 2026-10-19

Implemented from [the launch selection](PLAN_LANZAMIENTO_US.md). The local application now has six product records, twelve exact-name ingredient guides and five original editorial comparison drafts.

## Catalog and provenance

Added the 30 mL versions of The Ordinary Multi-Peptide + HA, Matrixyl 10% + HA, Argireline Solution 10%, and Geek & Gorgeous Power Peptides. Prices were checked on the official US pages on 2026-10-19: USD 19.90, 10.90, 9.70 and 18.80 respectively. They are dated observations, excluding tax/shipping, with stock not independently checked.

The Multi-Peptide + HA page has two sizes. Its Product JSON-LD identifies SKU 769915231885 and USD 19.90; the same page's product event identifies that SKU as 30 mL. The other two new Ordinary SKUs explicitly contain `30ml`; Power Peptides identifies SKU TGA15003010 and states 30 mL. [Structured source-check notes](research/launch-source-checks.json) retain exact URLs and size evidence. No variant price was guessed.

The original two records retain their observation dates. NIOD's 30 mL price remains missing. Only selected peptide names are stored, with that limitation explicit; omissions from selections do not establish absence from a complete formula. Brand blend percentages are kept separate from individual peptide concentrations.

## Content and navigation

Five draft routes are linked from home, the skincare hub and relevant product profiles. The interactive comparison links to the matching buying guide, independent of the selected order:

- `/skincare/compare/the-ordinary-multi-peptide-ha-vs-copper/`
- `/skincare/compare/niod-cais3-vs-the-ordinary/` — the existing draft was expanded, not duplicated.
- `/skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/`
- `/skincare/compare/the-ordinary-argireline-vs-multi-peptide-ha/`
- `/skincare/compare/geek-gorgeous-power-peptides-vs-the-ordinary-ha/`

Each route includes a plain-language answer, a buying question, practical differences, the shared interactive table, limitations, original sources and manufacturer links. All five remain draft/noindex. No human reviewer or scientific approval is claimed.

New ingredient guides cover Palmitoyl Tripeptide-38, Tetrapeptide-21, Copper Palmitoyl Heptapeptide-14 and Heptapeptide-15 Palmitate. They use manufacturer/label context with per-section citations; they do not extrapolate clinical effectiveness, ingredient-only reaction rates or equivalence across copper forms. Existing exact-name help and return-to-comparison behavior apply to all twelve names.

New products include attributed direction summaries, visible in the table and profiles. The old records explicitly show when instructions have not been recorded. Explorer copy now includes milky facial serums. Home's starter preview deliberately remains a two-product pair while the catalog section displays all six.

## Photography

Product imagery is now an explicit per-product field; the old two-product ternary could otherwise display the copper serum photograph for every added product. Each new product has its own manufacturer photograph and full-size link. Images were inspected for product identity. Provenance is in [the image notes](../public/images/products/SOURCES.md) and the structured source-check file.

These photographs are for the local preview. Public reuse rights remain unverified and must be resolved or replaced with authorized photography before public publication.

## Release scope

No deployment, indexing, paid links, affiliate applications, third-party contact, analytics-provider activation, database migration or Cloudflare change was performed. Human editorial review, public image permissions, operator/domain configuration and real attribution remain release tasks. User comprehension research with actual shoppers has not been performed; automated checks cannot establish it.

For executed tests and screenshots, see [VERIFICATION.md](VERIFICATION.md).
