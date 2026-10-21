import { readFileSync, writeFileSync } from "node:fs";
const read = (name) => JSON.parse(readFileSync(`src/data/${name}.json`, "utf8"));
const catalog = read("catalog");
const evaluations = read("comparison-evaluations");
const summaries = {
  "matrixyl-vs-ha": ["The three selected Matrixyl peptide names also appear in Multi-Peptide + HA, whose selection additionally includes Acetyl Hexapeptide-8.", "Matrixyl has the lower recorded price for the same 30 mL size. Extra names do not establish an extra benefit."],
  "argireline-vs-ha": ["Both labels list Acetyl Hexapeptide-8. Multi-Peptide + HA records additional selected peptides.", "Argireline has the lower recorded 30 mL price. Shared ingredients do not establish that buying both adds a benefit."],
  "geek-vs-ha": ["The brands describe different formats and peptide systems: Power Peptides is described as milky; Multi-Peptide + HA as water-based.", "Compare recorded 30 mL costs and brand-described formats. Texture preferences may matter, but Peptivelo has not tested wear or layering."],
  "naturium-vs-ha": ["Both records are 30 mL serums with different selected peptide lists. Naturium lists Copper Palmitoyl Heptapeptide-14.", "Compare exact ingredient names, the complete labels and dated cost. A copper name alone does not establish equivalence to another formula."],
  "timeless-vs-matrixyl": ["Timeless is recorded as 1 US fl oz; The Ordinary as 30 mL. Their named peptide systems and percentage disclosures differ.", "Compare cost per mL after converting US fl oz. A blend percentage is not a directly comparable pure-peptide dose."],
  "medik8-vs-ha": ["These are two 30 mL records. Medik8 describes a 30% peptide complex, rather than verified separate pure-peptide amounts.", "Compare dated unit prices separately from blend disclosures. A higher price or headline percentage does not demonstrate better results."],
  "cosrx-vs-ordinary": ["This COSRX record is the 50 mL mini; The Ordinary record is 30 mL. Their selected peptide names and disclosures differ.", "COSRX has no verified price in this record, so a fair unit-cost comparison remains unavailable. Do not substitute a 150 mL offer."],
  "ptiox-vs-ha": ["Both records are 30 mL serums. P-TIOX’s selected peptide names come from a UK label; a complete US ingredient list was not retrieved.", "Compare the dated unit costs and check your regional packaging. The P-TIOX studies concern different settings and do not establish an advantage over this Ordinary serum."],
};
for (const c of catalog.comparisons) {
  const texts = summaries[c.id];
  if (!texts) continue;
  const pair = c.comparedProductIds.map((id) => catalog.products.find((p) => p.id === id));
  const labelIds = pair.map((p) => p.sourceId);
  if (c.id === "ptiox-vs-ha") labelIds.push("ptiox-uk-label");
  c.citationPilot = true;
  c.updatedAt = "2026-10-20";
  // Existing undifferentiated notes are editorial readings of the paired labels.
  for (const note of [...c.practicalDifferences, ...c.decisionNotes]) {
    note.sourceIds ??= labelIds;
    note.interpretation ??= true;
  }
  if (c.id === "matrixyl-vs-ha") c.practicalDifferences[0].sourceIds = ["croda-matrixyl", "croda-synthe6"];
  let e = evaluations.find((item) => item.comparisonId === c.id);
  if (!e) {
    e = {
      comparisonId: c.id, mode: "label", title: "Label facts and buying limits", summary: c.editorialSummary,
      sections: [
        { id: "benefits", title: "What the labels document", conclusion: texts[0], paragraphs: [{ text: c.documentedDifferences, sourceIds: labelIds, kind: "label" }] },
        { id: "risks", title: "Amounts: disclosure is not measurement", conclusion: "Headline disclosures do not give verified individual amounts for every selected peptide.", paragraphs: pair.map((p) => ({ text: `${catalog.brands.find((b) => b.id === p.brandId).name}: ${p.concentrationExplanation}`, sourceIds: [p.sourceId], kind: "label" })) },
        { id: "long-term", title: "What these sources cannot establish", conclusion: "Recorded labels do not establish a clinical winner or years of safety for these complete formulas.", paragraphs: [{ text: "This is a comparison of selected label information, not a complete clinical efficacy or safety review. Missing product-level evidence here is not evidence that either product is harmful or ineffective.", sourceIds: [], kind: "interpretation" }] },
        { id: "value", title: "Cost and the exact presentation", conclusion: texts[1], paragraphs: [{ text: c.limitations, sourceIds: [], kind: "interpretation" }] },
      ],
      labelContext: "The paired manufacturer sources document the recorded product names and selected ingredients. These lists are incomplete, formulas may change, and manufacturer information is not independent clinical corroboration.",
      labelSourceIds: labelIds, checkedAt: "2026-10-20", status: "draft",
    };
    if (c.researchContext) e.sections[2].paragraphs.unshift({ text: c.researchContext.text, sourceIds: c.researchContext.sourceIds, kind: "evidence" });
    evaluations.push(e);
  }
  e.decisionSummary = [
    { label: "What is documented?", text: texts[0], sourceIds: labelIds, basis: "label" },
    { label: "What does it mean for your purchase?", text: texts[1], sourceIds: labelIds, basis: "catalog" },
    { label: "What has not been demonstrated?", text: e.mode === "label" ? "This label comparison does not establish which finished serum works better or is safer. Individual tolerance and additional benefit cannot be predicted from the selected names." : "The selected formula studies do not establish that P-TIOX outperforms Multi-Peptide + HA or replaces injections. Scientific review is still pending.", sourceIds: e.mode === "label" ? [] : ["ptiox-zhu-2026", "ptiox-adjunct-2026"], basis: "interpretation" },
  ];
}
for (const [name, data] of [["catalog", catalog], ["comparison-evaluations", evaluations]]) writeFileSync(`src/data/${name}.json`, JSON.stringify(data, null, 2) + "\n");
const evidence = read("evidence");
for (const id of ["naturium-multi-peptide", "timeless-synthe6", "medik8-liquid-peptides"]) {
  if (evidence.some((e) => e.sourceId === id)) continue;
  const source = catalog.sources.find((s) => s.id === id);
  evidence.push({ sourceId: id, kind: "Manufacturer label", supports: "Documents the selected label names and product presentation in the existing catalog record.", limits: "Commercial label information, not independent efficacy or safety evidence. Ingredient selections are incomplete and headline blend percentages do not establish separate pure-peptide amounts. Price observations have their own dates.", commercialContext: "Published by the manufacturer and seller; not independent corroboration.", checkedAt: source.accessedAt, access: "Existing manufacturer-source catalog record reused; no new remote source inspection in this interface extension." });
}
writeFileSync("src/data/evidence.json", JSON.stringify(evidence, null, 2) + "\n");
