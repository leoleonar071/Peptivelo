# Peptivelo

A working, English-language cosmetic peptide comparison MVP for US shoppers. Includes a source-backed starter catalog, ingredient profiles, search and filters, a two-product comparator, a six-product USD price calculator, preliminary policy pages and server-rendered SEO metadata.

The comparator uses searchable visual product pickers and automatic results for two selections. A visual comparison table aligns label facts beneath sticky product headers, with paired values on mobile and an option to hide matching facts while retaining missing information and sources. Expandable explanations follow the table. Each of the twelve recorded peptide names now has a short explanation, a sourced help dialog and a full ingredient guide that preserves the selected pair when returning to comparison. See [ingredient learning](docs/INGREDIENT_LEARNING.md) for evidence scope and verification. It supports shared selection URLs, swapping and resetting, keyboard interaction and explicit missing-data states. See [the comparison UX notes and screenshots](docs/COMPARISON_UX.md).

The first launch batch includes six products and five original editorial comparison drafts, with exact-size US price observations for the four new products. Manufacturer photographs are mapped individually; public reuse rights remain pending. See [the launch batch report](docs/LAUNCH_BATCH_IMPLEMENTATION.md) for sources, routes and release scope.

Two source-backed English label guides now explain Matrixyl 3000 versus synthe’6 and peptide percentages. They are linked from navigation, home and the five enhanced comparison drafts. All remain draft/noindex pending review. See [the SEO/AEO content batch](docs/SEO_AEO_CONTENT_BATCH.md) for routes, source scope and data validation.

## Optional Cloudflare Workers compatibility track

Next.js remains the default. A parallel vinext/Cloudflare configuration has been tested locally without creating or deploying Cloudflare resources. Start it with `npm run dev:vinext` at http://127.0.0.1:3101. To test a built Worker, run `npm run build:vinext` then `npm run test:e2e:vinext`. `npm run start:vinext -- --host 127.0.0.1 --port 3101 --strictPort` previews that build locally.

Read [the compatibility report](docs/CLOUDFLARE_COMPATIBILITY.md) for tested versions, beta tooling, the original Next.js fallback, dependency advisories, local backup and remaining staging requirements. Configure the real canonical origin before a future deployment. Indexing remains disabled.

## Run locally

For public-launch preparation, see [the publication review](docs/REVISION_PUBLICACION.md) and [domain/brand research](docs/DOMINIO_Y_MARCA.md). Configure the real public origin, `NEXT_PUBLIC_SITE_NAME`, `CONTACT_EMAIL`, `SITE_OPERATOR_NAME` and `HOSTING_PROVIDER` when known. `npm run audit:launch` reports technical gaps without deploying or enabling indexing; exit code 1 is expected until its checks pass. Image permissions and editorial/operational review remain separate manual requirements.

Requires Node.js 22.12+ (tested on Node 24) and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows PowerShell use `Copy-Item .env.example .env.local`. Visit http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm test
npm run db:validate
npm run build
npm run start
npx playwright install chromium
npm run test:e2e
```

Playwright uses a production server on port 3100 or reuses one already running. Three projects cover desktop, tablet, and mobile. Build before running E2E. Unit tests cover exact conversion, zero baseline, decimal input, invalid numbers, label matching and catalog invariants.

## Stack and architecture

Next.js App Router, React, TypeScript strict mode, Tailwind CSS with domain-specific CSS tokens, Zod, Lucide, Vitest, Playwright and a Prisma PostgreSQL schema. Public content is rendered on the server; search, selection and math are small client components. No paid API, credentials or database are needed for the MVP.

- `src/data/catalog.json`: versioned structured content, not UI components.
- `src/lib/data.ts`: validation, reference checks, published record access.
- `src/components/ui.tsx`: reusable cards, illustrations, sources, verification date and disclosure.
- `src/components/interactive.tsx`: working product search, selector, comparison and calculator.
- `src/app/[...slug]/page.tsx`: data-driven server route templates with explicit route resolution and real 404s.
- `src/lib/config.ts`: provisional branding and domain configuration.
- `prisma/schema.prisma`: future normalized relational persistence, separate cosmetic and clinical entities.
- `docs/`: strategy, content policy, implementation decisions and launch checklist.

### Persistence boundary

The active repository is **validated JSON committed to the project**, suitable for a small editorial catalog. Prisma supplies a validated relational design only. No PostgreSQL database, migrations, import job, runtime adapter, admin UI or automatic price updates are claimed to be connected. Connecting persistence is a documented next step, not required to use the tools. Never place database credentials in public environment variables.

## Environment

| Variable               | Purpose                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Absolute site origin for canonical URLs, Open Graph and sitemap; localhost by default. Set before building. |
| `SITE_INDEXABLE`       | Defaults false. Set true only after production domain, operator identity, policies and content review.      |
| `CONTACT_EMAIL`        | Real operator contact, rendered server-side only when configured.                                           |
| `DATABASE_URL`         | Optional future PostgreSQL connection; read by Prisma config only. Not used by the app.                     |

No analytics identifier is installed. `atlas:analytics` CustomEvents dispatch locally; a future privacy-aware provider may subscribe after consent requirements are reviewed. Search terms themselves are not emitted. No newsletter, payment, login or alert service exists.

## Adding content

1. Add a brand and primary source to `catalog.json`. Record the actual US source consultation date.
2. Add the product with stable unique IDs, selected exact label ingredients, scope of ingredient coverage, volume, disclosures, limitations and source ID. Connect ingredient IDs only where supported. Start with `editorialStatus: "draft"`.
3. Add ingredient profiles with precise INCI names, sources and limitations. Do not infer efficacy from a manufacturer label.
4. Add an immutable price observation only when price, currency and the exact package size are associated in the source. Keep taxes, shipping and stock uncertainty visible. Recheck snapshots older than 30 days.
5. Run validation/tests and inspect the product page. Change status to `published` only when essential factual details are sourced and editorially acceptable. Published products automatically appear in the explorer; drafts/demo products have no public profile routes.
6. To add an editorial comparison, add a record containing two valid product IDs, an original summary, documented differences, limitations and source IDs. Keep draft until human review. Publish only if it adds information beyond the mechanical table. Add review records when persistence is connected; do not invent reviewer identities or dates.
7. Rebuild and review rendered HTML, source links, metadata and sitemap. Sitemap includes only published records when site indexing is enabled.

The current two products are real source-backed **label profiles**, not demo commercial data or medically reviewed recommendations. The NIOD price is intentionally absent because the source rendering did not establish a size-specific price. The homepage prioritizes comparison and shows the two-product catalog immediately after its introduction. Product cards, detail pages and the visual picker use locally hosted official 30 mL manufacturer photographs. Source URLs and the outstanding reuse-rights status are recorded in `public/images/products/SOURCES.md`; public availability does not establish permission for publication. The DM Sans variable font is self-hosted under its bundled OFL license.

## SEO behavior

Default deployment is noindex; crawler access remains allowed so robots directives can be read. The sitemap is valid but empty until `SITE_INDEXABLE=true`. Search/filter/calculator parameter URLs get an HTTP `X-Robots-Tag: noindex, follow` and canonicalize to their base route. The interactive comparison tool and draft editorial comparison are noindex. No future medical routes or empty pages are published. Only Organization, WebSite and BreadcrumbList structured data are emitted. Product rich-result markup is intentionally deferred rather than adding unverified offers/ratings.

## Maintenance

Keep price observations immutable and retain source URLs and consultation dates. Recheck labels after reformulations. Use code review for JSON publication changes; no public write endpoint exists. Before launch fill the legal/operator details and contact channel; preliminary policies require owner/legal review. Do not enable public indexing on the localhost origin. Check dependency advisories before deployment and measure real field Core Web Vitals after launch; no rankings or performance scores are guaranteed.

See [strategy](docs/PRODUCT_STRATEGY.md), [SEO](docs/SEO_STRATEGY.md), [content policy](docs/CONTENT_POLICY.md), [roadmap](docs/ROADMAP.md), [decisions](docs/ARCHITECTURE.md), and [verification](docs/VERIFICATION.md).
