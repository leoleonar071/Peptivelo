# Peptivelo home hero — 2026-10-20

The existing Next App Router homepage had overlapping legacy `.hero` rules, several competing actions, and a preview hidden on mobile. The new hero has its own scoped stylesheet and retains the rest of the homepage, public routes, catalog, source data, light/dark tokens, typography, metadata and indexing configuration.

## Implementation

- `src/components/home-hero.tsx`: server-rendered editorial introduction, two real catalog products with optimized local images, exact names and volumes, three comparison dimensions, direct editorial comparison link, methodology and pending-review disclosure.
- `src/components/hero-search.tsx`: catalog-derived product and ingredient suggestions; accessible combobox with arrow selection, Enter, Escape, pointer selection, empty-result and navigation-pending feedback. Unselected Enter preserves the existing GET catalog search. Results are local and synchronous; there is no simulated loading delay. The submit button reports navigation loading.
- `src/styles/home-hero.css`: responsive two-column desktop and stacked tablet/mobile layouts; semantic theme tokens; inherited reduced-motion support; visible focus and compact product photography.
- `src/app/page.tsx`: replaces only the former hero with the new component.
- `src/app/layout.tsx`: loads the scoped stylesheet after shared brand rules.
- `.interface-design/system.md`: records the updated home interaction pattern.
- `e2e/home-hero.spec.ts`: covers suggestions, keyboard selection, empty state, catalog submission, actual destination, mobile preview, overflow and automated accessibility checks in both themes.

## Verification

Production build and targeted ESLint passed. All 52 unit tests passed. All 12 focused browser checks passed across desktop, tablet and mobile, including existing brand checks on five routes. Captures are `docs/hero-{light,dark}-{desktop,tablet,mobile}.png`. Automated axe checks found no violations in the tested states; this is not a complete WCAG certification or a user research study.

No additional brand assets are needed for this hero. The previously documented approved vector, horizontal wordmark and reversed logo variants remain outstanding for the wider brand system. No scientific claims, efficacy rankings, prices or external endorsements were added.
