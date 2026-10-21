# SEO strategy

Current plan, 2026-10-19: the owner chose **Peptivelo**. See [the complete SEO/AEO strategy and 90-day priorities](ESTRATEGIA_SEO_AEO_PEPTIVELO.md). Six product pages, twelve ingredient guides and five draft comparisons exist; indexing readiness must be judged per page. The new guide backlog and selective ingredient indexing described there are proposed work, not implemented pages or visibility results.

## Information architecture

Home → skincare hub → products / ingredients / comparisons. Product and ingredient pages link contextually to each other; comparison pages link to the products, sources and methodology. Free standalone calculator serves size-normalization intent even with no catalog. Clean data-driven routes are server-rendered. Unknown slugs return HTTP 404.

## Intent clusters to validate

- Copper peptide skincare: exact labels, disclosed concentrations, uncertainty.
- Peptide serum comparisons: two named formulas, source-backed differences.
- Affordable alternatives: size-specific normalized prices and limitations, pending broader verified data.
- Cosmetic peptide ingredients: names and documented label presence; efficacy profiles need primary research/review.
- Price comparison tools: price per mL and US fl oz conversion.

NIOD alternatives, Matrixyl, GHK-Cu vs. Matrixyl, COSRX comparisons and label interpretation guides remain an editorial backlog, not published thin pages. Search intent, demand, conversion, SERP competition and possible brand ambiguities need validation. No search volume or Keyword Difficulty estimates are supplied.

## Publication and indexation

`SITE_INDEXABLE=false` is the default; the site emits noindex and an empty valid sitemap. Enable only with an actual production origin and completed launch review. Published factual records then enter the sitemap. Draft/demo products do not resolve publicly. Draft editorial comparisons and the user-built comparison tool remain noindex. All query-string variants emit HTTP noindex, follow and canonicalize to the base URL. Robots permits fetching, which is needed for noindex directives to work. Do not block those URLs in robots.txt as a substitute for noindex.

Unique page titles/descriptions, canonical URLs, Open Graph, breadcrumb navigation and JSON-LD are generated per route. Empty future sections are absent. No mass-produced pair permutations are generated. Comparison publication requires original analysis, field-level traceability, explicit missing data and human review.

## Structured data

Organization and WebSite on home; BreadcrumbList on internal pages. No Article bylines, reviews, stars, aggregate ratings or Offers are fabricated. Product markup is deferred: these profiles lack the offer/review data needed for the targeted product snippet implementation, and source records are snapshots rather than live offers. Adding it later requires alignment with [Google product snippet documentation](https://developers.google.com/search/docs/appearance/structured-data/product-snippet). Directories and comparisons never receive Product markup as a shortcut.

## Originality and quality

Follow [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): answer the concrete question first, explain provenance and uncertainty, and add differentiated analysis rather than multiplying near-identical pages. No guarantee of Google or AI-search visibility is made.

## Performance

Server-render important text. Use self-hosted DM Sans and local manufacturer photographs with reserved dimensions; public image reuse rights remain unresolved. No third-party analytics is enabled by default. Comparison tables use paired values on mobile without horizontal page scrolling. Measure production field LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 as quality targets, not claims of measured results. Browser checks cover overflow at desktop/tablet/mobile; field Core Web Vitals require deployment and real traffic. Configure production cache and asset delivery after choosing a host.
