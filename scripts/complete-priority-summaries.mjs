import { readFileSync, writeFileSync } from "node:fs";
const load = (name) => JSON.parse(readFileSync(`src/data/${name}.json`, "utf8"));
const save = (name, value) => writeFileSync(`src/data/${name}.json`, JSON.stringify(value, null, 2) + "\n");
const catalog = load("catalog");
const niod = catalog.products.find((p) => p.id === "niod-cais3");
niod.formulationNotes = "Official US 30 mL price observed after selecting 30 mL on 2026-10-20: USD 93. Excludes tax and shipping; dated observation, not a live price or performance ranking.";
if (!catalog.retailers.some((r) => r.id === "niod")) catalog.retailers.push({ id: "niod", name: "NIOD", website: "https://niod.com", affiliateUrl: null, status: "active" });
catalog.prices = catalog.prices.filter((p) => p.productId !== "niod-cais3");
catalog.prices.push({ id: "niod-30ml-2026-10-20", productId: "niod-cais3", retailerId: "niod", currency: "USD", price: 93, size: 30, sizeUnit: "ml", sourceId: "niod", observedAt: "2026-10-20", verifiedAt: "2026-10-20", availabilityStatus: "not_checked" });
catalog.sources.find((s) => s.id === "phenoxyethanol-cases").url = "https://iris.unife.it/handle/11392/2572152";
catalog.sources.find((s) => s.id === "phenoxyethanol-cases").accessedAt = "2026-10-20";
const comparison = catalog.comparisons.find((c) => c.id === "niod-vs-ordinary");
comparison.limitations = "The selected label entries and inspected sources do not establish head-to-head clinical outcomes or years of safety for these complete formulas. Prices are dated observations for the exact 30 mL bottles, not live offers. Editorial and qualified scientific review remain pending.";
comparison.practicalDifferences[2] = { title: "Compare the exact 30 mL bottles", text: "NIOD’s US site showed USD 93 after selecting 30 mL on 2026-10-20. The initial 15 mL selection showed USD 62 and is not the price used here. Recorded prices exclude tax and shipping and do not measure clinical benefit.", sourceIds: ["niod"], interpretation: true };
comparison.decisionNotes[1].text = "Compare the dated prices and price per mL for the two 30 mL bottles. The NIOD price was observed on 2026-10-20; The Ordinary price has its own observation date. A higher price is not evidence of better outcomes.";
save("catalog", catalog);
const evaluations = load("comparison-evaluations");
for (const id of ["niod-vs-ordinary", "ordinary-ha-vs-copper"]) {
  const e = evaluations.find((e) => e.comparisonId === id);
  const isNiod = id === "niod-vs-ordinary";
  e.decisionSummary = [
    { label: "What is documented?", text: isNiod ? "The labels use different copper-peptide names. Their other selected peptides also differ; the names alone do not establish chemical equivalence." : "The copper version lists Copper Tripeptide-1. Both selected lists include other shared peptides; these incomplete lists do not show every formula difference.", sourceIds: isNiod ? ["niod", "ordinary"] : ["ordinary-ha", "ordinary"], basis: "label" },
    { label: "What does it mean for your purchase?", text: isNiod ? "Compare the recorded 30 mL prices and cost per mL below. The price difference measures cost, not an established extra benefit from NIOD." : "Multi-Peptide + HA has the lower recorded 30 mL price. Paying more for the copper version does not establish an extra visible benefit.", sourceIds: isNiod ? ["niod", "ordinary"] : ["ordinary-ha", "ordinary"], basis: "catalog" },
    { label: "What has not been demonstrated?", text: "The selected research does not establish which finished serum works better or is safer. Ingredient studies and scoped safety assessments cannot answer that comparison by themselves.", sourceIds: ["argireline-trial", "cir-peptides", "cir-acetyl"], basis: "interpretation" },
  ];
}
const ne = evaluations.find((e) => e.comparisonId === "niod-vs-ordinary");
ne.sections.find((s) => s.id === "value").paragraphs[1].text = "NIOD’s exact 30 mL price is now recorded at USD 93 on 2026-10-20. Compare that dated observation with The Ordinary’s own recorded price and date. Neither the price difference nor ingredient research establishes an extra clinical benefit; texture and wear have not been tested by Peptivelo.";
save("comparison-evaluations", evaluations);
const evidence = load("evidence");
const nn = evidence.find((e) => e.sourceId === "niod");
nn.limits = "Commercial source, not independent clinical corroboration. USD 93 was shown after selecting the 30 mL US variant on 2026-10-20; default 15 mL showed USD 62. Excludes tax and shipping; not a live offer or clinical advantage.";
nn.access = "US product page and browser-rendered size selection. Exact 30 mL / USD 93 screen captured in docs/research/niod-30ml-price-2026-10-20.png.";
const pn = evidence.find((e) => e.sourceId === "phenoxyethanol-cases");
pn.access = "University of Ferrara IRIS repository abstract retrieved 2026-10-20 at iris.unife.it. Linked full-text PDF returned 403; complete methods and declarations remain unverified.";
pn.checkedAt = "2026-10-20";
save("evidence", evidence);
