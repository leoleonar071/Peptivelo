# Roadmap

## Two label guides and comparison depth — 2026-10-19

Two original English guides and a discovery hub are implemented under `/skincare/guides/`, with short answers, cited sections, label tables, visible questions and contextual product/comparison links. The five existing comparisons now include pair-specific sourced questions, decision notes and jump links. All seven editorial pages remain draft/noindex and outside the publishable sitemap. See [the content delivery report](SEO_AEO_CONTENT_BATCH.md); no new keyword volume, ranking, AI citation, affiliate relationship or public deployment is claimed.

## Peptivelo chosen and SEO/AEO plan — 2026-10-19

The owner selected Peptivelo; shared UI/metadata now default to that name and the environment example matches. The domain has not been purchased or configured. The [SEO/AEO strategy](ESTRATEGIA_SEO_AEO_PEPTIVELO.md) prioritizes the existing collection, two distinct explanatory guides, per-page indexation review and measured expansion over 90 days. It distinguishes proposed work from existing functionality; no new public pages, visibility claims or indexation changes were introduced by this planning step.

## Publication preparation and brand research — 2026-10-19

The brand is configurable across shared UI/metadata and informational pages; contact availability reflects actual configuration, and supplied operator/hosting fields can be displayed without inventing them. Prelaunch responses now also carry a noindex header. `npm run audit:launch` reports technical readiness gaps; the current audit identifies five missing settings plus separate manual release requirements. See [the publication review](REVISION_PUBLICACION.md) and [domain research](DOMINIO_Y_MARCA.md). PeptideAtlas is an existing scientific resource; the current provisional name has not been adopted as the final brand. No domain purchase, rebrand, public deployment or monetization activation occurred.

## First US catalog batch implemented — 2026-10-19

The local app now includes six products, twelve ingredient guides and five source-linked editorial draft comparisons. Four new 30 mL records have exact-size US price observations and individual manufacturer photos. Buying guides explain practical differences, label uncertainty and brand directions. See [the implementation report](LAUNCH_BATCH_IMPLEMENTATION.md). Next: actual shopper comprehension testing, editorial review and the existing operational/public-release requirements. Affiliate approvals and attribution are still pending; no deployment or indexing change occurred.

## US launch selection — 2026-10-19

Research and editorial selection are complete: 13 candidates evaluated, nine prioritized and four reserved pending additional checks. The first implementation batch adds four products to the existing two and supports five proposed comparisons. See [the launch selection and comparison briefs](PLAN_LANZAMIENTO_US.md) for official sources, qualitative demand signals, verification gaps and the three-week validation sequence. No new catalog records, affiliate relationships or public deployment were created by this research step. Implement this first batch before expanding infrastructure or adding paid features.

## Comparison UX update — 2026-10-19

Implemented visual product search dialogs, automatic two-product comparison, summary insights, mobile paired disclosures, keyboard/focus behavior, duplicate prevention and share/swap/reset controls. Both existing runtimes remain supported; no Cloudflare deployment occurred. The next UX validation step is comprehension testing with real shoppers and physical-device/screen-reader checks. See [COMPARISON_UX.md](COMPARISON_UX.md).

## Cloudflare compatibility update — 2026-10-19

Local Workers support is implemented in parallel via vinext. The existing Next.js default is retained, with a local source/config backup. Worker builds, generated types and browser flows are verified; there is no Cloudflare deployment, remote binding or provisioned resource. See [the compatibility report](CLOUDFLARE_COMPATIBILITY.md) for evidence and current beta/dependency limitations. The next infrastructure stage is a consciously configured staging deployment, after selecting an account/domain and reviewing launch requirements.

## Implemented

- Next.js TypeScript application with responsive petroleum/mineral design, navigation and footer.
- Server-rendered home, skincare hub, explorer, six factual product profiles and twelve ingredient profiles.
- Real catalog search, brand/ingredient/price/size/date/data-availability filters and empty state.
- Searchable two-product selector, exact selected-label comparison, disclosures, prices and limitations.
- Calculator for 2–6 products, USD, exact mL/US fl oz conversion, decimal validation, zero-price handling and shared URL state.
- Source links and actual consultation dates; no invented commercial price for NIOD.
- Preliminary editorial/legal pages, configurable real contact, no false form submission.
- Metadata, canonicals, Open Graph, robots, sitemap, breadcrumbs, JSON-LD and 404 behavior.
- Local analytics event contract and truthful retailer links ready for authorized affiliate URLs.
- Unit and browser test suites; see VERIFICATION.md for actual execution results.

## Partial or deliberately limited

- Persistence: structured validated JSON is active; PostgreSQL Prisma schema exists but adapter/migrations/admin/import are not connected.
- Editorial comparison: original specific draft is visible and noindex; human review not performed.
- Ingredient profiles distinguish label/supplier context from recorded ingredient research; independent finished-product efficacy and scientific reviewer approval are not established.
- Source lists are per entity; field-level provenance/editorial transaction enforcement is a future DB implementation.
- Analytics: browser-local event hooks only, no provider, consent platform or attribution reporting connected.
- Privacy/terms: preliminary operational descriptions; operator identity, hosting/retention details and legal review are pending.

## External data and owner tasks before launch

1. Configure a real origin and contact channel; clear brand/domain availability.
2. Confirm US price-size association for NIOD; broaden the catalog with source-verified records.
3. Have a human editor review comparison analysis and a qualified specialist review any future scientific claims.
4. Identify the operating entity and hosting provider; review final terms/privacy and deploy consciously.
5. Enable indexing only after these steps; connect Search Console and validate actual structured-data output.
6. Apply to legitimate cosmetic affiliate programs; add only approved URLs and local visible disclosures.
7. Select a privacy-aware analytics provider if needed; validate events and conversion reporting with real data.

## Next iteration

Test shopper comprehension and review the implemented batch before launch. Connect actual analytics and approved US affiliate reporting when operational requirements are met. PostgreSQL, immutable imports and editorial history remain later work unless catalog maintenance demonstrates a need. Measure production performance and conversion before expanding page count.

## Future, not implemented

Price history visualizations, saved comparisons, real alerts, newsletter, subscription billing, licensed scientific review, ClinicalTrials.gov/FDA/PubMed integrations and clinical/regulatory trackers. No empty future sections or unsupported automation promises are shown in navigation.

## Segunda tanda local — 2026-10-19

Incorporados Naturium, Timeless y Medik8: nueve productos, diecisiete ingredientes, ocho comparativas. Fichas accesibles desde búsqueda y comparador; comparativas nuevas en borrador/noindex. Corregidas presentaciones y filtro de mL para variantes en US fl oz. Build, ESLint, 31 pruebas unitarias y 81 pruebas E2E pasan. Detalle en `CATALOG_EXPANSION.md`. Siguiente paso: revisión editorial y requisitos de lanzamiento, antes de ampliar nuevamente o activar indexación/afiliación.

## Referencias numeradas — 2026-10-19

Piloto implementado en dos guías y la comparación NIOD/The Ordinary: citas junto al pasaje, bibliografía con límites y contexto comercial, estudio académico pertinente con DOI y alcance explícito, navegación de retorno y funcionamiento sin JavaScript. Metodología actualizada. Las páginas siguen en borrador. Detalles y revisión humana pendiente en `CITATION_PILOT.md`.

## Evaluación crítica de compra — 2026-10-19

Rehecha la comparación NIOD/The Ordinary con cuatro respuestas iniciales: beneficios, riesgos, incertidumbre a largo plazo y valor por precio. Estudios y evaluaciones de seguridad separados de fuentes comerciales; se incluye el contexto de posibles reacciones a conservantes sin inventar tasas ni atribuir daño a productos no estudiados. Sigue siendo un borrador pendiente de revisión científica. Ver `CRITICAL_EVIDENCE_REVIEW.md`.

## Comparación editorial minimalista — 2026-10-19

Nuevo piloto NIOD/The Ordinary con productos reconocibles, resumen breve y navegación Overview / Ingredients & price / Evidence. Se reducen bloques repetidos y se reúnen detalles y bibliografía en desplegables accesibles. Fichas y otras comparativas conservan su interfaz anterior. Revisión científica y lanzamiento siguen pendientes; ver `EDITORIAL_READER_REDESIGN.md`.

## Pestañas reales — 2026-10-19

La comparación piloto muestra una sola sección seleccionada. Resumen por defecto, tabla en Ingredients & price y análisis en Evidence. Las citas abren una ficha de referencia sin abandonar la sección; navegación con teclado y URL/historial verificados. Se sustituye la navegación de desplazamiento anterior. Detalles en `READER_TABS.md`.
