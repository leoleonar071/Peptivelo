# Architecture and initial audit

Audit: the supplied workspace was empty, with no Git repository, source files, dependencies, existing routes or configuration to preserve. Node 24 and npm 11 were available. No database credentials or approved commercial services were supplied.

Use the requested Next.js App Router stack locally. No hosting service registration, deployment, account creation or paid service is needed. Modern stable dependencies are pinned by the lockfile; inspect `package.json` for installed versions. Read package-local documentation/types during compatibility fixes.

## Rendering and data access

Root layout provides reusable navigation, footer and base metadata. Home has a specific editorial layout; an explicit catch-all resolver serves a finite list of known static and entity routes. It is not a generic public slug renderer: unrecognized paths return 404. `src/lib/data.ts` validates catalog shape and relational references at import/build time. Only published products appear in public selectors. Server-rendered factual content and sources work without client JavaScript. Interactive tool controls require JavaScript.

Client components share pure tested price and label functions. Price math never mutates catalog facts. Shared calculation state is validated on load, limited to six rows and uses nonnegative finite prices and positive finite volume. The original exact label names remain intact. Search matches names, brands and selected ingredient labels; filters do not manufacture indexable landing pages.

## Content management

Versioned JSON is the active content repository. A new product or ingredient requires a data record, not a component. A comparison includes specific editorial text, sources and limitations. Site settings are centralized. This is a developer-managed editorial workflow; no admin dashboard is implied.

## PostgreSQL boundary

Prisma models normalize Brand, CosmeticProduct, CosmeticIngredient, ProductIngredient, Retailer, PriceObservation, Comparison, Source, EditorialReview and ChangeLog. Separate future models represent compounds, pharmaceutical products, indications, trials and regulatory events. Some future source/indication ID lists and polymorphic editorial IDs are intentionally lightweight references; a production DB adapter must enforce those references and publication transactions. Add reviewed migrations, indexes, referential constraints, a source import/seed command and a server-side Prisma adapter before switching persistence. No schema has been applied to a database.

## Design system

Audience: a shopper with two serum tabs open, trying to understand whether a higher price buys a documented difference. Domain: label, formulation, specimen, source trail, unit volume, disclosure, observation date. Palette: paper white, petroleum blue ink, mineral gray, muted verification green, subtle copper. Signature: specimen-coded illustrative bottles paired with source-checked facts, ingredient identity and explicit information gaps. Replace generic ratings with source dates; decorative dashboards with compact label comparisons; invented product photography with clearly marked original illustrations.

Intent across cards, selector, table, calculator and source list: support calm comparison and quick verification. Depth uses subtle borders and restrained surface shifts. Controls use a dedicated pale input surface; focus is petroleum green. Typography uses system sans for efficient labels and tables, Georgia only for editorial emphasis, and tabular numeric data. Base spacing is 4px with consistent component and section scales. Mobile moves filters above the catalog and keeps readable tables inside a labeled horizontal scroll region. Reduced motion, visible keyboard focus, skip link, explicit labels, live results and table headings are included.

## Security and privacy

No public write endpoints, secrets, external tracking requests or hidden affiliate IDs. External links use noopener/noreferrer; JSON-LD escapes `<`; metadata derives from validated structured records. Request middleware adds nosniff/referrer policy and parameter-page noindex. Add deployment-specific CSP after reviewing any future analytics and hosting needs. No arbitrary user HTML is accepted.
