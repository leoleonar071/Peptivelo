# SEO/AEO content implementation — 2026-10-19

Implemented the next content task from [the Peptivelo strategy](ESTRATEGIA_SEO_AEO_PEPTIVELO.md): two original English label-reading guides and deeper content for the five existing comparison drafts. No mass-generated pairs, new commercial prices or clinical efficacy rankings were added.

## New routes

- `/skincare/guides/` — discovery hub for the new guides.
- `/skincare/guides/matrixyl-3000-vs-synthe6/` — commercial-system names, exact selected INCI names, label examples and evidence limitations.
- `/skincare/guides/peptide-percentages-explained/` — ingredient/system/serum distinction, practical label interpretation and a hypothetical arithmetic example.

The example uses 5% of a blend containing 2% of a peptide on the same mass basis, resulting in 0.1% in the serum. It is explicitly invented to explain arithmetic and cannot estimate an undisclosed concentration in any recorded product. Source links identify where the commercial-system distinction comes from, not a manufacturer disclosure of those hypothetical numbers.

Both guides contain a short answer, contents links, a comparison table with scoped headers, cited sections, visible common questions, a buying checklist, source dates and contextual links to products/comparisons. Tables scroll within a keyboard-focusable region on narrow screens. No FAQ rich-result or fabricated Article/reviewer markup is generated. Normal page metadata, canonical, Open Graph and breadcrumb JSON-LD apply.

## Strengthened comparisons

All five drafts now include two decision notes and two pair-specific questions with source references. Questions cover exact copper names and 1:1 wording, overlap of Matrixyl-related ingredients, HA meaning, Argireline/Acetyl Hexapeptide-8 naming, commercial percentages and brand-described texture. Editorial update dates remain separate from price observation dates.

Jump links make the table, buying notes, questions and sources directly reachable. The embedded table no longer links back to the same editorial page; the interactive comparator still offers a matching guide link.

## Discovery and data integrity

The guides are linked from home, the skincare hub, product profiles, relevant comparisons, the navigation/compact menu and footer. Each guide links to the other and to real product comparisons. Source facts are attributed to Croda and relevant manufacturer labels; Croda synthe’6 was added as a dated primary supplier source.

`src/data/guides.json` stores the content, validated by `src/lib/guides.ts`. Validation checks unique slugs/section IDs, existing source/product/comparison references, related guides and table dimensions. Comparison schema now requires the decision notes, sourced questions, related guide slugs and edit date. References in questions are validated alongside other comparison sources.

## Publication status

The two guides and five comparisons remain drafts. Their metadata is noindex independently of the global prelaunch setting, and they do not enter the sitemap when global indexing is enabled. The draft-only guide hub is also excluded. No content reviewer, scientific approval, search traffic, ranking or AI citation is claimed. The new pages are implemented locally; domain registration, public publication and account integrations remain outstanding.

See [VERIFICATION.md](VERIFICATION.md) for executed checks and captures. The strategy's further catalog growth and selective indexation of ingredient profiles were not implemented in this content task.
