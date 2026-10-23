# Topic expansion foundation

Local implementation, 23 October 2026. This work prepares the editorial structure; it does not publish new scientific content, change sources or expand the comparator catalog.

## Public experience

The three existing areas remain public: **Skin & cosmetics**, **Hair & scalp**, **Health & research**. Planned areas have no public links, disabled menu items, search results or empty pages. Direct requests to their prospective paths return 404. Existing BPC-157 and retatrutide articles remain in Health & research; they have not been reassigned or duplicated.

Health & research now uses the shared topic landing. It retains its existing introduction and review caveat, groups its two existing briefs under Research & articles, and offers related populated topics. Empty ingredient, product, guide, comparison and subtopic sections are omitted. Existing fonts, tokens, cards, theme controls and responsive layout are reused.

## Editorial map

These are navigation scopes, not a scientific classification of mutually exclusive peptide types. An entity can belong to several topics. Subtopics are internal editorial planning labels until populated.

| Area | State | Parent | Planned subtopics |
| --- | --- | --- | --- |
| Skin & cosmetics | Active | — | Label ingredients; formulas; evidence & claims |
| Hair & scalp | Active | — | Scalp products; label ingredients; formulation evidence |
| Health & research | Active | — | Research context; study limitations; regulatory context |
| Metabolism & appetite | Planned | Health & research | Incretin signaling; appetite; native peptides & analogues |
| Pancreatic hormones | Planned | Health & research | Hormone identities; physiological context; drug analogues |
| Growth hormone signaling | Planned | Health & research | Axis overview; releasing hormones; investigational compounds |
| Reproduction & sexual health | Planned | Health & research | Reproductive signaling; native forms; drug analogues |
| Brain & nervous system | Planned | Health & research | Neuropeptide families; signaling context; research models |
| Pain & sensory signaling | Planned | Health & research | Sensory signals; opioid peptides; study context |
| Digestive health | Planned | Health & research | Gut hormones; secretion & signaling; specific preparations |
| Cardiovascular & fluid balance | Planned | Health & research | Vasoactive signals; fluid balance; native forms & analogues |
| Bone & mineral metabolism | Planned | Health & research | Hormone identities; mineral signaling; drug analogues |
| Immunity & antimicrobial peptides | Planned | Health & research | Peptide families; host defense; experimental context |
| Tissue repair research | Planned | Health & research | Identity verification; study models; evidence gaps |
| Mitochondrial peptides | Planned | Health & research | Molecular identities; cellular signaling; research models |
| Food-derived peptides | Planned | — | Identified sequences; hydrolysates & mixtures; evidence & claims |

## Shared components and contracts

- `src/lib/topic-registry.ts`: 16 definitions, active/planned state, parent, related topics and internal subtopics. Planned records cannot have a public href in the type contract.
- `src/lib/site-navigation.ts`: derives public areas from that registry. Header, home, topics index, footer and directory retain the same three public areas.
- `src/lib/content-topics.ts`: lists a primary or additional topic without duplicating content IDs; planned primary content is withheld from these public lists.
- `src/lib/content-navigation.ts`: retains existing source-derived records and adds optional `additionalTopics`. It does not merge identities or copy review statuses.
- `src/components/topic-landing.tsx`: groups actual content by format, omits empty groups and links only active subtopics/related topics. The current research landing uses it; bespoke skin/hair tools keep their existing hubs.
- `src/app/topics/[slug]/page.tsx`: renders only an active, populated generic area at its registered path. Unknown/planned routes and duplicate generic skin/hair aliases return 404. Future generic indices remain noindex/follow and outside the sitemap.
- `src/lib/search-index.ts`: generic topic entries derive from active registry areas; ranking is unchanged.
- `src/editorial/knowledge-model.ts`: draft contracts and an advisory editorial-readiness check, with no public records or persistence added.
- `src/editorial/research-roadmap.ts`: internal research tasks, never imported into public pages, search or the comparator.

## Research and publication workflow

1. Choose the next brief in [RESEARCH_ROADMAP.md](./RESEARCH_ROADMAP.md). Verify exact identities, forms and aliases before authoring profiles. Candidate labels are research tasks, not facts or finished profiles.
2. Reuse existing pages where relevant. Associate one stable identity with several topics through metadata instead of copying its profile. Keep products, ingredients, peptides and mixtures distinct.
3. Record sourced summary, context and limitations. Attribute evidence to ingredient, formulation or finished product and distinguish label, laboratory, animal and human sources. Regulatory notes require jurisdiction, exact preparation and check date.
4. Prepare a sourced introduction with a coverage statement plus at least two distinct complete profiles. Complete identity and editorial checks. Keep scientific-review status explicit; an editorial completeness result is not scientific approval.
5. Call `assessTopicReadiness` with the introduction, profiles and actual known source IDs. It rejects missing core sources, unknown source IDs, unresolved identity, pending editorial checks and duplicate IDs. It returns issues and pending scientific review; it neither mutates the registry nor publishes anything. It does not judge the quality of a source or independently verify identity.
6. Resolve review issues, create real content records/routes, then manually change the selected registry record to active and supply its canonical href. Verify public navigation, sources, accessibility and indexing before publication. The generic landing omits all unpopulated blocks.
7. Add a comparison group only in a separate reviewed implementation with explicit eligibility, attributes and compatibility. Publishing a topic never enables medical or peptide comparisons. The only operational comparison group remains facial skincare products.

Evidence and regulatory arrays can be empty in a draft: that means no information has been linked, not that no evidence or regulation exists. The checker is an editorial aid, not a regulatory/scientific publication gate. Existing active content retains its original draft/pending status; it has not been retroactively certified by this model.

## Validation

Dedicated checks cover registry consistency, active-only lists, multi-topic deduplication, omission of empty template blocks, roadmap coverage and readiness failures. Browser checks cover all planned direct URLs, public menus/cards/directory/search/sitemap, both research-page themes, automated accessibility, overflow and article return navigation on desktop/tablet/mobile.

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed, including the new generic topic route.
- `npm test -- --maxWorkers=2`: 26 files, 123 tests passed.
- `npm run test:e2e -- topic-foundation topic-navigation --workers=3 --output=test-results/topic-foundation-initial`: 24 tests passed.
- `npm run test:e2e -- --workers=3 --output=test-results/topic-foundation-full`: 304 passed, 11 configuration-defined skips, zero failures (7.8 minutes). Includes current search, comparison, calculator, scanner, reader, source, keyboard and history regressions across desktop/tablet/mobile. Some visual matrices run once in the desktop project while iterating their own viewport widths, rather than repeating in every project.
- Six captures in `captures/` cover the shared research landing on desktop (1280px), tablet (768px) and mobile (390px), in both themes. Desktop/tablet/mobile light and desktop/mobile dark were visually inspected. Automated axe A/AA checks found no violations on this landing in either theme. This is not a full manual accessibility certification.

The preview is available locally at `http://localhost:3200/`. Most scaffolding is intentionally internal; the shared landing is visible at `/topics/health-research/`. No new area appears on `/peptides/`.

No new scientific research, expert review, participant usability study, deployment or GitHub upload was performed. The five-person navigation study remains pending.
