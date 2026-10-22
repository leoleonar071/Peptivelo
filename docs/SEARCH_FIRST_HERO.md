# Search-first discovery — 2026-10-21

## Implemented

The home entry now presents Peptivelo as an independent knowledge platform:
one centered editorial H1, a prominent document search, four real tools, starter
queries, transparent scientific-review status and a methodology link. An editorial
discovery grid gives library/guides the same prominence as products/comparisons.
Catalog brands link to real search results and carry no endorsement implication.

The design reuses self-hosted Manrope/Inter and semantic Peptivelo light/dark
tokens. No photos, new fonts, animation libraries, generated imagery, packages or
remote services were added. Motion respects the existing reduced-motion policy;
local hover transitions are disabled when reduced motion is requested.

## Search behavior

- `src/lib/search-index.ts` builds documents from existing published ingredient
  records, catalog products/brands, guides, library briefs, comparisons and
  haircare. Existing drafts are identified as drafts. Routes are real.
- `src/lib/search.ts` ranks normalized lexical matches, exact titles and title
  terms. Natural-language questions retrieve documents rather than generated
  scientific advice. This is not semantic or AI search, nor a full research index.
- A GHK-Cu alias points specifically to Copper Tripeptide-1, not to every copper
  peptide. Identity is not generalized from the word copper.
- Each suggestion group gets at most two results, preserving relevance within
  groups without allowing product volume to suppress education.
- The combobox supports arrows, Enter, Escape, pointer/touch, IME composition,
  active-descendant scrolling and live result announcements. DOM focus stays in
  the input; Tab leaves the option list. Submit and starter links open `/search/`.
- The results page retains query URLs, displays all matched documents by category
  and is noindex. No-JavaScript form submission and links remain available.
- Searching is synchronous and local; navigation has an opening state. There is
  no backend loading state or remote search outage to simulate.

## Available tools and limits

Scan a product opens the existing identification screen and code scanner.
It does not claim AI photo recognition; existing scanner limitations still apply.
Compare opens the existing comparator, the library link opens `/library/`, and
Check prices opens the existing per-mL calculator.

Commercial results state United States/USD context. No country picker or invented
international offers are presented. Canada, UK, Peru and other markets need
source-backed seller, size, currency, price and observation-date records first.
Scientific review remains pending. The percentage graphic is a label-reading
question, not a product concentration or efficacy claim.

Future additions: international offer data, a larger document index or server
search if volume warrants it, and qualified scientific/editorial review. No AI
answering service, live prices or automated efficacy ranking was added.

## Files

- `src/components/home-hero.tsx`: hero, tools, discovery and brands.
- `src/components/hero-search.tsx`: accessible grouped suggestions and submission.
- `src/styles/home-hero.css`: responsive light/dark visual system.
- `src/lib/search.ts`, `src/lib/search-index.ts`: retrieval and source adapters.
- `src/app/search/page.tsx`: all-results route and market context.
- `tests/search.test.ts`, `e2e/home-hero.spec.ts`: ranking and browser verification.
- `.interface-design/system.md`: updated reusable home patterns.

## Verification

- Worker production build: pass (existing upstream source-map/dynamic-import
  warnings remain non-blocking).
- Original Next.js production build, including its TypeScript check: pass.
- 54 unit tests: pass, including real starter questions, empty queries, category
  balance, unique routes and the specific GHK-Cu identity regression.
- 12 browser checks on built workerd: pass across desktop/tablet/mobile, both
  themes, one H1, keyboard selection, Escape, no-results state, all-results
  submission, starter links, retrieved document HTTP status, no browser page
  errors and no horizontal overflow at 320px.
- The same 12 checks also passed on the original Next.js runtime. One desktop
  navigation encountered Chromium ERR_NO_BUFFER_SPACE before loading the page;
  its isolated rerun passed without changing application code or adding retries.
- Automated axe checks: no violations in tested home/search-open states using
  WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. This is not a claim of full WCAG certification.
- Light/dark hero and discovery screenshots inspected; saved as
  `docs/search-hero-*` and `docs/search-discovery-*`.
- Focused ESLint and TypeScript check: pass.

No production deployment or remote account changes are part of this redesign.
After publication, verify on the production domain; field LCP/INP/CLS have not
been measured. Existing indexing and launch settings are preserved.
