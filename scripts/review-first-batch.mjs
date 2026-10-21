import { readFileSync, writeFileSync } from "node:fs";
const read = (name) => JSON.parse(readFileSync(`src/data/${name}.json`, "utf8"));
const save = (name, data) => writeFileSync(`src/data/${name}.json`, JSON.stringify(data, null, 2) + "\n");
const catalog = read("catalog");
for (const comparison of catalog.comparisons.filter((c) => ["ordinary-ha-vs-copper", "niod-vs-ordinary"].includes(c.id))) {
  comparison.citationPilot = true;
  comparison.updatedAt = "2026-10-20";
}
const productIds = ["ordinary-ha", "ordinary-copper", "niod-cais3"];
const ingredientIds = new Set(catalog.products.filter((p) => productIds.includes(p.id)).flatMap((p) => p.ingredientIds));
for (const ingredient of catalog.ingredients.filter((i) => ingredientIds.has(i.id))) ingredient.education.scientificReviewPending = true;
const acetyl = catalog.ingredients.find((i) => i.id === "acetyl-hexapeptide-8");
acetyl.education.precautions.text = "The 2025 safety panel concluded safe cosmetic use up to 0.005%; above that, it found insufficient data to determine safety. This is not evidence of harm above that amount. The pure-peptide concentrations in these compared serums are not verified, so this assessment cannot certify either bottle. A commercial blend percentage is not automatically the pure-peptide percentage.";
acetyl.education.sourceCheckedAt = "2026-10-20";
const copperName = catalog.ingredients.find((i) => i.id === "tripeptide-1-copper-acetate");
copperName.description = copperName.education.summary = "A copper-containing peptide name on NIOD’s label; its wording differs from Copper Tripeptide-1. Chemical equivalence has not been established in this review.";
for (const id of ["ordinary", "niod", "ordinary-ha", "argireline-trial", "kraeling-penetration", "cir-acetyl", "cir-peptides", "sccs-phenoxyethanol"]) catalog.sources.find((s) => s.id === id).accessedAt = "2026-10-20";
for (const product of catalog.products.filter((p) => productIds.includes(p.id))) product.lastVerifiedAt = "2026-10-20";
save("catalog", catalog);
const evidence = read("evidence");
const note = {
  sourceId: "cir-acetyl", kind: "Expert safety assessment",
  supports: "The 2025 panel gives a favorable conclusion up to 0.005% and finds data insufficient above that concentration.",
  limits: "Not evidence of harm above the assessed amount or certification of a complete serum. Pure-peptide concentrations in this comparison are unverified; blend percentages are not interchangeable.",
  commercialContext: "CIR assessment includes published and industry-submitted data. Article-specific funding and conflict statements were not verified in this pass; not government approval.",
  checkedAt: "2026-10-20", access: "Publisher full-text introduction, abstract, composition and use-concentration sections inspected. Underlying toxicology datasets not independently reanalyzed.",
  authors: "Johnson W Jr, Bergfeld WF, Belsito DV, et al.", journal: "International Journal of Toxicology", year: 2025,
  doi: "10.1177/10915818251340391", publicationUrl: "https://journals.sagepub.com/doi/10.1177/10915818251340391",
  publicationTitle: "Safety Assessment of Acetyl Hexapeptide-8 Amide as Used in Cosmetics",
};
const existing = evidence.findIndex((e) => e.sourceId === note.sourceId);
if (existing < 0) evidence.push(note); else evidence[existing] = note;
for (const id of ["ordinary", "niod", "ordinary-ha", "argireline-trial", "kraeling-penetration", "sccs-phenoxyethanol"]) evidence.find((e) => e.sourceId === id).checkedAt = "2026-10-20";
const cir = evidence.find((e) => e.sourceId === "cir-peptides");
cir.checkedAt = "2026-10-20";
cir.access = "2018 publisher full-text abstract, ingredient scope and introduction revisited; prior 2014 final-report discussion check retained. Not an independent toxicology reanalysis.";
save("evidence", evidence);
const evaluations = read("comparison-evaluations");
const niod = evaluations.find((e) => e.comparisonId === "niod-vs-ordinary");
const safety = { text: "The 2025 Acetyl Hexapeptide-8 safety assessment reaches a favorable conclusion up to 0.005%, with insufficient data above that amount. This does not establish harm above it or certify a serum with an unverified pure-peptide concentration.", sourceIds: ["cir-acetyl"], kind: "evidence" };
const risks = niod.sections.find((s) => s.id === "risks");
if (!risks.paragraphs.some((p) => p.sourceIds.includes("cir-acetyl"))) risks.paragraphs.push(safety);
niod.checkedAt = "2026-10-20";
const ha = {
 comparisonId: "ordinary-ha-vs-copper", title: "Before you buy: does adding copper justify the difference?",
 summary: "The labels and recorded prices show a purchasing difference. The selected research does not establish extra benefit or better tolerance from the copper version. Both full formulas need to be considered, not just their peptide names.",
 sections: [
  { id: "benefits", title: "Benefits: neither bottle inherits an ingredient result", conclusion: "A short ingredient trial does not establish which complete serum works better.", paragraphs: [
   { text: "A four-week randomized placebo-controlled Argireline trial enrolled 60 Chinese participants. It reported improvements in eye-area wrinkle measures; the abstract does not identify either compared retail serum as its treatment.", sourceIds: ["argireline-trial"], kind: "evidence" },
   { text: "Both recorded labels include Acetyl Hexapeptide-8. That shared name does not transfer the trial result to either formula or demonstrate an advantage from adding copper.", sourceIds: [], kind: "interpretation" },
  ] },
  { id: "risks", title: "Precautions: ingredient assessments have concentration limits", conclusion: "The safety assessment cannot certify either finished serum or predict your tolerance.", paragraphs: [safety,
   { text: "Neither label check establishes the separate pure amount of Acetyl Hexapeptide-8. Do not compare a commercial blend’s headline percentage directly with the assessment’s pure-ingredient concentration.", sourceIds: [], kind: "interpretation" },
  ] },
  { id: "long-term", title: "Long-term evidence: keep the reviewed scope visible", conclusion: "A scoped cosmetic assessment is not years of testing these complete formulas.", paragraphs: [
   { text: "The 2018 safety assessment covers specified peptide identities, uses and concentrations, including Copper Tripeptide-1 and the selected palmitoyl peptides it names. Its favorable conclusion applies within that reviewed scope.", sourceIds: ["cir-peptides"], kind: "evidence" },
   { text: "This selected-source review does not establish comparative long-term safety, nor does a missing finished-product study demonstrate that either serum causes harm.", sourceIds: [], kind: "interpretation" },
  ] },
  { id: "value", title: "Value: price answers the cost question", conclusion: "The lower recorded cost is not a clinical performance ranking.", paragraphs: [
   { text: "Use the dated, equal-size prices in Ingredients & price. The lower recorded cost of Multi-Peptide + HA does not measure the additional benefit, if any, of the copper version. Texture and wear have not been tested by Peptivelo.", sourceIds: [], kind: "interpretation" },
  ] },
 ],
 labelContext: "The recorded US labels name Acetyl Hexapeptide-8 in both serums and Copper Tripeptide-1 in the copper version. The selected lists are incomplete; they do not establish that the full formulas differ only by copper. Individual peptide amounts are not independently assayed. Directions may vary by product and reformulation.",
 labelSourceIds: ["ordinary-ha", "ordinary"], checkedAt: "2026-10-20", status: "draft",
};
const hi = evaluations.findIndex((e) => e.comparisonId === ha.comparisonId);
if (hi < 0) evaluations.push(ha); else evaluations[hi] = ha;
save("comparison-evaluations", evaluations);
