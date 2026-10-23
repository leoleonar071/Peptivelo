# Topic navigation: validation before publication

Implementation is local only. Keep existing editorial and scientific review notices and index protections.

## Five-person tree test — pending

Recruit five people unfamiliar with Peptivelo. Show only the English navigation tree, without explaining the grouping. Ask each person to:

1. Find a comparison of two cosmetic serums: Skin & cosmetics → Comparisons.
2. Understand an ingredient on a cosmetic label: Skin & cosmetics → Ingredients, or Peptides A–Z → relevant ingredient.
3. Find the BPC-157 research brief: Health & research → BPC-157, or Peptides A–Z → BPC-157.
4. Understand a percentage on a serum label: Learn → percentage guide, or Skin & cosmetics → Guides.
5. Find how Peptivelo checks and uses sources: footer → Our standards → Methodology.

Record first choice, final destination, backtracking and whether help was needed. Accept a task when at least four of five people reach a valid destination without help. Revise labels or grouping for failed tasks, then retest before publication. Automated browser checks do not establish this outcome.

## Extending the architecture

Register populated topics and navigation in `src/lib/site-navigation.ts`. Register existing content in `src/lib/content-navigation.ts`, deriving review status from source records. Add new scientific content through the existing editorial process; this navigation change does not create evidence or approve drafts. Preserve context-specific profiles and existing public URLs.

## Connected search usability check — pending

Ask five new users to search GHK-Cu, explain what the result is, switch between Same peptide and Other formulas, select two products, and open the comparison. Repeat from a product name and ask them to return without losing the selection. Record unassisted completion, backtracking and misunderstood labels. Target: at least four of five complete understanding and comparison without help. Verify they distinguish a shared ingredient from evidence of equivalent effects. Do not publish on the basis of automated checks alone.
