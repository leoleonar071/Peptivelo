# Peptivelo homepage visual register

Created 2026-11-08. Scope: the four new homepage illustrations and the three educational icons. Existing brand assets and fonts retain their documented provenance in `docs/PEPTIVELO_DESIGN_SYSTEM.md`.

Update: at the owner's request, the hero illustration and its entire field-notes panel were removed from the homepage. `peptide-chain-concept.svg` is retained as an unused source asset; it is not downloaded by the homepage. The three category illustrations remain in use (6,548 bytes total, uncompressed). The hero now uses one column; the original validation screenshots below predate this adjustment.

## Original illustrations

| File in public/images/editorial | Author / origin | Licence / attribution | Restrictions |
| --- | --- | --- | --- |
| peptide-chain-concept.svg | Codex for Peptivelo; original procedural vector artwork | Original project asset; no third-party licence or attribution required. No separate public redistribution licence granted. | Conceptual only. No real sequence, atom identities, bond orders or verified coordinates. Keep the visible conceptual disclaimer. |
| skin-barrier-concept.svg | Codex for Peptivelo; original procedural vector artwork | Original project asset; no third-party licence or attribution required. No separate public redistribution licence granted. | Schematic tissue layers; not anatomical validation or evidence of delivery, penetration or efficacy. |
| hair-follicle-concept.svg | Codex for Peptivelo; original procedural vector artwork | Original project asset; no third-party licence or attribution required. No separate public redistribution licence granted. | Schematic follicle; no claim of treatment, regrowth or verified anatomy. |
| research-observation-concept.svg | Codex for Peptivelo; original procedural vector artwork | Original project asset; no third-party licence or attribution required. No separate public redistribution licence granted. | Editorial observation metaphor. Not study data, clinical results or regulatory approval. |

No stock images, scientific article figures, brand photographs, external downloads, generative image model or molecular structure databases were used. Created directly as SVG using `scripts/create-home-illustrations.mjs`; run `node scripts/create-home-illustrations.mjs` to reproduce. No generation prompts apply. Source is retained in the repository. These assets can be used in the Peptivelo project; originality does not imply exclusive copyright or a trademark guarantee.

Each SVG includes a title, description and creator/provenance metadata. English alt text lives beside the actual image use. All images have explicit intrinsic dimensions and scale without raster downloads or device-specific variants. Topic images load lazily; hero image is directly discoverable in HTML and loads eagerly. No runtime drawing library, canvas, animation, embedded script, external resource or raster payload.

## Reused educational icons

| Icons | Author / source | Verified licence | Attribution / restrictions |
| --- | --- | --- | --- |
| ScanLine, BookOpen, FlaskConical | Lucide Icons and Contributors; installed `lucide-react` package | ISC; checked against installed `node_modules/lucide-react/LICENSE` | Preserve copyright and permission notice with distributions. Copy retained in `docs/visual-assets/LUCIDE-LICENSE.txt`. No visible UI credit required by the licence. |

Icons are hidden from assistive technology; adjacent HTML gives the full explanation. The three contexts describe uses, not mutually exclusive chemical categories or a ranking of evidence.

## Adding or replacing an asset

Record its source URL or retained original, creator, retrieval/creation date, exact licence and evidence of commercial reuse permission, attribution, modifications and scientific status. Do not infer permission from search visibility or from an article being publicly readable. Externally sourced assets without confirmed rights must not enter the public directory. Keep licence evidence internally even when metadata is stripped by later optimization.

## Delivery budget

The four SVGs together are approximately 10.5 KB uncompressed. Preserve SVG rather than introducing raster variants for this artwork. Future raster imagery should use AVIF/WebP with a fallback, appropriate `srcset`/`sizes` and reserved dimensions. Targets for future assets: hero <=150 KB and each category <=60 KB. These budgets are design targets, not measured Core Web Vitals guarantees.

## Validation

- `npm run build`: passed (Next.js production build).
- `npx tsc --noEmit`: passed.
- `npx playwright test e2e/home-hero.spec.ts --workers=3`: 12 passed. Desktop, tablet and mobile; light/dark; keyboard suggestions, search navigation, accessible names, axe and horizontal overflow checks.
- Manual browser review: desktop light and mobile light/dark; search precedes hero artwork on mobile; distinct topic images and readable educational text.
- Saved evidence: `docs/audit-evidence/home-visual/desktop-light.png`, `mobile-dark.png`, `topics-light.png`.
- No measured field-performance claim. Validation used the Next.js production server; Cloudflare/Worker deployment was not changed or validated in this task.
