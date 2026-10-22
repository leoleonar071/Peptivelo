# Premium hero refinement — 2026-10-21

## Result

The home hero retains the existing search-first architecture and now uses the
requested single H1: **Understand peptides. Look beyond the claims.** The two
phrases have distinct weight (700/500), semantic theme colors and an explicit
desktop line break. The eyebrow is a restrained sage pill, the exact requested
subtitle is limited to 660px, and a low-opacity theme-aware halo adds depth around
the search area. Original brand artwork, local Manrope/Inter, navigation routes,
metadata, database and production deployment configuration are preserved.

The search control has one circular magnifier button (52px desktop, 48px mobile),
no duplicate icon and no visible Search text. It retains its accessible name,
keyboard selection, grouping, status announcements, no-results state, opening
indicator, native submission and the existing `search_performed` event. Mobile
uses the shorter placeholder with the same accessible label and 16px text.

## Connected behavior

- Existing document index: ingredients, products/brands, guides, library briefs
  and comparisons. No generated scientific answers or invented results.
- Up to seven initial suggestions; every matching category gets its most relevant
  result before additional suggestions are allocated. Maximum two per category.
- Full results remain available at `/search/?q=…`.
- Ctrl+K / Cmd+K focuses search on desktop/tablet widths (768px and above). It
  ignores editable fields, open modal dialogs, IME input, modified combinations
  and events already handled by another component. Listener cleanup is included.
- Suggested searches are labeled as suggestions, not measured popularity.
- Identify a product → `/skincare/identify/`; Compare products →
  `/skincare/compare/`; Peptide library → `/library/`; Price calculator →
  `/tools/price-per-ml/`. Existing scanning/manual identification capabilities are
  unchanged; there is no claim of new image recognition or live shopping offers.
- Knowledge Preview is server-rendered and links to existing library context,
  Copper Tripeptide-1 identity, an actual copper-peptide product and complete
  search results. It is a reading path, not an automated evidence conclusion.
- Header changes are limited to spacing, the BETA badge and a compact theme
  control. The original logo and navigation behavior are preserved. Mobile keeps
  the existing independent-editorial message without three competing taglines.

## Design implementation

The search has a 24px desktop / 20px mobile radius, a soft petroleum-derived
shadow and a visible focus border without changing geometry. Theme-aware halo and
shadow tokens are recorded in both CSS and the token JSON. Quick actions use a
shared 44px minimum touch target and a balanced two-column tablet/mobile layout.
Knowledge Preview uses three source-linked reading areas on desktop and compact
stacked links on mobile. The existing four-area discovery section remains below.

Reduced motion disables dropdown reveals, hover transitions and the pending
spinner animation while preserving the pending icon and live status. There is no
idle animation, external image load, new dependency, font import or analytics SDK.

## Files changed in this refinement

- `src/components/home-hero.tsx`: copy, actions, suggestions, preview integration.
- `src/components/hero-search.tsx`: circular action, responsive placeholder,
  shortcut, navigation status and empty-state library link.
- `src/components/knowledge-preview.tsx`: source-backed preview component.
- `src/lib/search.ts`: fair seven-result suggestion limit.
- `src/styles/home-hero.css`: hero/search/preview visual system and responsive CSS.
- `src/styles/peptivelo-components.css`: minimal header refinement.
- `src/styles/peptivelo-tokens.css` and `.json`: theme-aware depth tokens.
- `tests/search.test.ts`, `e2e/home-hero.spec.ts`, `e2e/premium-hero.spec.ts`:
  retrieval, interaction, accessibility and explicit viewport matrix.
- `.interface-design/system.md`: reusable design rules.

Earlier search-index and search-page additions remain part of the uncommitted
redesign described in `SEARCH_FIRST_HERO.md`.

## Verification

- 54 unit tests pass, including all requested example questions and starter terms,
  empty states, the GHK-Cu identity alias and balanced category allocation.
- Worker and original Next.js production builds pass; TypeScript passes through
  the Next.js build. Focused ESLint passes.
- Browser verification covers keyboard/Enter/Escape, the seven-result limit,
  shortcut cancellation in fields and dialogs, destination HTTP status, loading
  semantics, real preview links and client errors.
- Final built-Worker browser run: 15 passed, with three intentional skips for
  duplicate viewport-matrix runs and the desktop shortcut on mobile.
- Explicit visual matrix: 1440, 1024, 768, 390 and 320px, in light and dark.
  Screenshots: `docs/premium-hero-{theme}-{width}.png`.
- Checks include circle geometry, one icon, short mobile placeholder, no
  horizontal overflow, search visible within a 960px mobile test viewport,
  and axe WCAG 2 A/AA, 2.1 AA and 2.2 AA tags.
- Visual screenshots inspected for headline hierarchy, alignment, typography,
  search prominence, real content and contrast. Automated checks are not a full
  accessibility certification.

## Limits and publication

The search remains local lexical document retrieval; no semantic/AI backend was
added. Scientific review remains pending. Commercial records retain their
documented US scope; no international availability or live prices are implied.
Field LCP/INP/CLS have not been measured. Existing upstream vinext build warnings
remain non-blocking. No new packages were installed.

These changes are local. No GitHub push or production deployment was performed.
