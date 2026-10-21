# Ingredient learning — 2026-10-19

All eight exact ingredient names in the selected catalog labels now have a short visible explanation, a keyboard-accessible contextual dialog and a server-rendered guide. Existing ingredient profiles were expanded; five missing exact-name profiles were added. Copper Tripeptide-1, Tripeptide-1 Copper Acetate and Tripeptide-1 Acetate remain distinct records.

## Reading flow

The comparison uses plain headings: What it contains and what it means, Peptides, explained, How much of each ingredient?, and What we still cannot know. Original manufacturer concentration text remains in the expandable detail; the main row uses a separate plain-language explanation.

Each ingredient displays its name and one-sentence summary, followed by What does it do? and a direct Full guide link. The native modal has four sourced sections: identity, intended use, evidence scope and precautions. A closing takeaway explains what the information means for the comparison. The dialog supports keyboard opening, close/Escape/backdrop dismissal, focus return and body-scroll restoration. On mobile it becomes a full-height sheet. Full guides preserve validated a/b product IDs in a return link; invalid IDs never become arbitrary redirect destinations. Direct guide links work without JavaScript.

A separate comparison interpretation explains a documented difference, a general precaution and an open question without selecting a winner.

## Content scope and sources

Structured education fields are validated with Zod; every section has explicit source references. Source lists distinguish manufacturer/supplier information, research/ingredient references and public health guidance. Dates indicate source consultation, not scientific reviewer approval.

Primary references include manufacturer labels; a PubMed-indexed 2013 randomized ingredient-preparation study; 2018 and 2025 Cosmetic Ingredient Review assessments; NCBI PubChem identity data; Croda and Lubrizol supplier materials; and FDA cosmetic-reaction guidance. Supplier claims, ingredient studies, safety reviews and serum outcomes are not treated as interchangeable. The 2013 study is explicitly scoped to its preparation and does not establish the performance of The Ordinary serum. No equivalence between differently named copper forms is inferred. Where an individual contribution or reaction rate is not established by the recorded sources, that limit is visible. No binary good/bad ratings, inferred concentrations, disease-treatment claims or personalized recommendations were introduced.

This is a local educational expansion, not a completed systematic review or qualified clinical review. Public scientific publication still requires the human review described in CONTENT_POLICY.md; no deployment or indexing change was performed.

## Verification

Tests cover exact-name coverage and source references; distinct copper identities; evidence-type separation; eight successful server-rendered guide routes; keyboard dialog interaction and focus restoration; no body-scroll lock after navigation; guide return preserving selections; automated WCAG checks on dialogs and guide pages; and 320px overflow. Screenshots ingredient-help-*.png and ingredient-guide-*.png cover desktop, tablet and mobile. See VERIFICATION.md for current totals. Actual shopper comprehension and manual assistive-technology testing remain outstanding.
