# Product strategy

## Audience and task

US skincare shoppers evaluating peptide facial serums. They need to inspect meaningful label differences and compare sizes and costs before visiting a legitimate cosmetic retailer. Public UI is US English; USD is the only supported currency. Broad provisional brand: Peptide Atlas, with no assumed domain/trademark availability.

## Value proposition

Compare peptide products, understand the ingredients, and make more informed decisions. The initial product answers a narrow commercial question through exact label names, price per mL, source trails, missing information and consultation dates. Ingredient similarity never implies clinical equivalence. A deliberately small verified catalog is preferable to an unsourced encyclopedia.

## Competitive reconnaissance

Consulted on 2026-10-18. These are observations about publicly available product positioning, not independent validation of competitors’ claims. No competitor data or methodology was imported.

| Reference                                                                    | Observed offering                                                                 | Implication for this MVP                                                                                   |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [SkinSort](https://skinsort.com/support/what-is-the-product-comparison-tool) | Side-by-side ingredient comparison, overlap, personalized scores and alternatives | Preserve useful comparison flow; replace opaque scoring with explicit fields and limitations.              |
| [INCI Decoder](https://incidecoder.com/ingredients/acetyl-hexapeptide-8)     | Ingredient explanations linked to products                                        | Connect exact ingredient labels to catalog records; do not reuse descriptions or ratings.                  |
| [What’s in My Jar](https://whatsinmyjar.com/)                                | Consumer skincare discovery and analysis                                          | Keep the early experience focused on a measurable comparison task rather than personalized advice.         |
| [Innerbody](https://www.innerbody.com/)                                      | Editorial health purchasing research                                              | Context and transparent editorial standards matter alongside tools; medical authority must not be implied. |

Future-market references reviewed: [PeptidesDB](https://peptidesdb.com/), [Peptigraph](https://peptigraph.org/en), [InsidePeptides](https://insidepeptides.org/data/), [Peptides Media](https://www.peptides.media/developers), [PeptideAgent](https://peptideagent.ai/developers), [PeptideBase](https://peptidebase.io/peptides). Public pages illustrate differing approaches to structured evidence, source records, regulatory context and APIs. Names may refer to more than one domain; identity/ownership requires verification before further competitor analysis. Some include supplier or dosing content that is explicitly outside our scope. No safety or evidence grading scheme is adopted.

## Differentiation

Exact facts, meaningful missingness and original specific comparisons. No similarity percentages, invented reviews, inferred concentrations, medical equivalence or purchased ranking. Unit cost is kept separate from product quality. Source-checked label data is described honestly, without implying clinical review.

## Business model

Apply to legitimate US cosmetic affiliate programs after validating the catalog and traffic. No program approval, affiliate ID or earnings is assumed. Ordinary manufacturer links are used today. Future paid reports, alerts and subscriptions require demand validation before implementation.

## Validation and measurement

Use Search Console impressions, relevant queries and clicks, comparison completion, calculator usage, retailer clicks and, when real affiliate reporting exists, attributed revenue and maintenance cost. No keyword volumes, difficulty, traffic, revenue or ranking deadlines are invented. Interview shoppers about whether the comparison changes their purchase research. Local event hooks are implemented; no analytics collection provider is active.

## Scope and expansion

The first catalog expansion was selected in [PLAN_LANZAMIENTO_US.md](PLAN_LANZAMIENTO_US.md): four new products support five initial comparisons alongside the original two. Nine products are prioritized within a 13-candidate research list; incomplete US sources remain explicit reserves. Demand signals are qualitative, with no keyword-volume or revenue claims. The first batch is now implemented locally, with editorial drafts awaiting review.

Current local MVP: six factual cosmetic label profiles, twelve ingredient guides, five original editorial comparison drafts, working custom comparison and price calculator, policy pages and technical SEO. The first four-product batch is implemented; see [the implementation report](LAUNCH_BATCH_IMPLEMENTATION.md). Expand sourced US cosmetics according to actual user demand before adding medical content. Future compound, pharmaceutical product, indication, clinical trial and regulatory event entities remain distinct. Qualified scientific review and primary regulatory/clinical sources are required before any such content launch.
