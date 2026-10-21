import fs from "node:fs";
const date = "2026-10-20";
const path = "src/data/catalog.json";
const d = JSON.parse(fs.readFileSync(path, "utf8"));
const source = (id, title, publisher, url, sourceType) => ({
  id,
  title,
  publisher,
  url,
  sourceType,
  accessedAt: date,
});
const sources = [
  source(
    "cosrx-six",
    "COSRX The 6 Peptide Skin Booster Serum Mini (50 mL): official label",
    "COSRX",
    "https://www.cosrx.com/products/the-6-peptide-skin-booster-serum-mini-50ml",
    "manufacturer",
  ),
  source(
    "fda-cosmetic-drug",
    "Is It a Cosmetic, a Drug, or Both?",
    "US FDA",
    "https://www.fda.gov/cosmetics/cosmetics-laws-regulations/it-cosmetic-drug-or-both-or-it-soap",
    "regulator",
  ),
  source(
    "fda-glp1",
    "FDA’s Concerns with Unapproved GLP-1 Drugs Used for Weight Loss",
    "US FDA",
    "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss",
    "regulator",
  ),
  source(
    "fda-research-peptides",
    "Compounding substances that may present significant safety risks",
    "US FDA",
    "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    "regulator",
  ),
  source(
    "retatrutide-phase2",
    "Triple-Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial",
    "New England Journal of Medicine / PubMed",
    "https://pubmed.ncbi.nlm.nih.gov/37366315/",
    "research",
  ),
  source(
    "bpc-human-pilot",
    "Safety of Intravenous Infusion of BPC157 in Humans: A Pilot Study",
    "Alternative Therapies in Health and Medicine / PubMed",
    "https://pubmed.ncbi.nlm.nih.gov/40131143/",
    "research",
  ),
];
for (const s of sources)
  if (!d.sources.some((x) => x.id === s.id)) d.sources.push(s);
if (!d.brands.some((x) => x.id === "cosrx"))
  d.brands.push({
    id: "cosrx",
    name: "COSRX",
    slug: "cosrx",
    website: "https://www.cosrx.com",
  });
const label = (text) => ({ text, sourceIds: ["cosrx-six"] });
for (const [id, name] of [
  ["sh-polypeptide-121", "sh-Polypeptide-121"],
  [
    "dipeptide-diaminobutyroyl-benzylamide-diacetate",
    "Dipeptide Diaminobutyroyl Benzylamide Diacetate",
  ],
  ["oligopeptide-68", "Oligopeptide-68"],
  ["palmitoyl-tripeptide-8", "Palmitoyl Tripeptide-8"],
]) {
  if (d.ingredients.some((x) => x.id === id)) continue;
  d.ingredients.push({
    id,
    name,
    inciName: name,
    slug: id,
    ingredientCategory: "Cosmetic peptide",
    description:
      "A named ingredient on the COSRX label; research evaluation is pending.",
    knownLimitations:
      "Label identity alone does not establish benefit or individual tolerance.",
    sourceIds: ["cosrx-six"],
    status: "published",
    education: {
      summary: "Listed in the COSRX formula. Research review pending.",
      whatItIs: label(
        "An exact name recorded from the manufacturer’s ingredient list.",
      ),
      purpose: label(
        "The brand includes it in a cosmetic peptide blend; this is a label description.",
      ),
      evidence: {
        ...label(
          "Only label presence is documented here. No ingredient efficacy review is complete.",
        ),
        label: "Label information",
      },
      precautions: label(
        "This label source does not establish ingredient-specific safety. Consult the complete current label.",
      ),
      takeaway:
        "An ingredient name is not proof that a finished formula works.",
      sourceCheckedAt: date,
    },
  });
}
const copper = d.ingredients.find((i) => i.id === "copper-tripeptide-1");
copper.education.evidence.text =
  "The CIR assessment addresses specified cosmetic identities, uses and concentrations. It is a safety assessment, not a trial showing that a finished serum reduces wrinkles. A full topical efficacy review remains pending.";
copper.education.precautions = {
  text: "Cosmetic safety conclusions do not extend to injection. FDA separately identifies limited human safety data and potential immune-response risks for compounded injectable GHK-Cu.",
  sourceIds: ["cir-peptides", "fda-research-peptides"],
};
copper.education.sourceCheckedAt = date;
copper.sourceIds = [...new Set([...copper.sourceIds, "fda-research-peptides"])];
const acetyl = d.ingredients.find((i) => i.id === "acetyl-hexapeptide-8");
acetyl.education.evidence.text =
  "A four-week randomized placebo-controlled trial enrolled 60 Chinese participants (3:1 allocation) and reported improved eye-area wrinkle measures. The inspected abstract does not establish results for the retail serums here or long-term benefit. A 24-hour laboratory skin-penetration study is a different kind of evidence, not a clinical efficacy trial.";
acetyl.education.evidence.sourceIds = [
  "argireline-trial",
  "kraeling-penetration",
];
acetyl.sourceIds = [...new Set([...acetyl.sourceIds, "kraeling-penetration"])];
acetyl.education.sourceCheckedAt = date;
const product = {
  id: "cosrx-six-mini",
  brandId: "cosrx",
  name: "The 6 Peptide Skin Booster Serum Mini",
  slug: "cosrx-six-peptide-skin-booster-mini",
  category: "First-step cosmetic serum",
  description:
    "A 50 mL cosmetic booster. This profile covers the mini presentation, not the 150 mL bottle.",
  volume: 50,
  volumeUnit: "ml",
  ingredientList: [
    "Acetyl Hexapeptide-8",
    "Copper Tripeptide-1",
    "sh-Polypeptide-121",
    "Dipeptide Diaminobutyroyl Benzylamide Diacetate",
    "Oligopeptide-68",
    "Palmitoyl Tripeptide-8",
  ],
  ingredientListScope:
    "Selected peptide names from the official mini label, not the full INCI list. Check your package for changes.",
  ingredientIds: [
    "acetyl-hexapeptide-8",
    "copper-tripeptide-1",
    "sh-polypeptide-121",
    "dipeptide-diaminobutyroyl-benzylamide-diacetate",
    "oligopeptide-68",
    "palmitoyl-tripeptide-8",
  ],
  concentrationDisclosure:
    "Individual peptide concentrations are not recorded in this source check.",
  concentrationExplanation:
    "Six describes the named peptide blend, not a percentage or an efficacy score.",
  sourceId: "cosrx-six",
  lastVerifiedAt: date,
  editorialStatus: "published",
  formulationNotes:
    "The brand positions it after cleansing. Product efficacy review and barcode verification remain pending. Exact 50 mL label profile only; no 150 mL price inferred.",
  tone: "copper",
  image: "/images/products/cosrx-six-mini-50ml.jpg",
  usageSummary:
    "The manufacturer describes use after cleansing, as a first step. Follow current package directions.",
};
if (!d.products.some((p) => p.id === product.id)) d.products.push(product);
if (!d.retailers.some((r) => r.id === "cosrx"))
  d.retailers.push({
    id: "cosrx",
    name: "COSRX",
    website: "https://www.cosrx.com",
    affiliateUrl: null,
    status: "active",
  });
// Page and product feed disagree on availability. Keep price/availability unknown.
const pair = {
  id: "cosrx-vs-ordinary",
  slug: "cosrx-six-peptide-vs-the-ordinary-copper",
  title: "COSRX 6 Peptide Mini vs The Ordinary Copper Peptides",
  comparedProductIds: ["cosrx-six-mini", "ordinary-copper"],
  editorialSummary:
    "A comparison of selected label facts, with different sizes and disclosure limits. No clinical winner is established.",
  citationPilot: true,
  documentedDifferences:
    "The recorded COSRX mini is 50 mL; The Ordinary record is 30 mL. Both selected lists include Copper Tripeptide-1 and Acetyl Hexapeptide-8.",
  buyerQuestion: "What do the labels tell me, and what is still unknown?",
  practicalDifferences: [
    {
      title: "Different presentations",
      text: "Match the exact size before comparing an offer. This COSRX record is the 50 mL mini.",
      sourceIds: ["cosrx-six", "ordinary"],
    },
    {
      title: "Different disclosures",
      text: "The Ordinary names 1% copper peptides. COSRX’s six-peptide name counts components; it is not a comparable concentration.",
      sourceIds: ["cosrx-six", "ordinary"],
      interpretation: true,
    },
  ],
  questions: [
    {
      question: "Do shared names mean equal results?",
      answer:
        "No. Ingredient research and label overlap do not establish equal performance of finished formulas.",
      sourceIds: ["argireline-trial", "cir-peptides"],
    },
    {
      question: "Is there a fair cost comparison?",
      answer:
        "Not yet. No COSRX price is published here because the availability information requires clarification.",
      sourceIds: ["cosrx-six"],
    },
  ],
  decisionNotes: [
    {
      title: "Confirm the bottle",
      text: "Use the exact mini presentation when reviewing this pair.",
      sourceIds: ["cosrx-six"],
    },
    {
      title: "Read the full label",
      text: "Selected lists omit non-peptide ingredients; they are not full-formula equivalence checks.",
      sourceIds: ["cosrx-six", "ordinary"],
    },
  ],
  researchContext: {
    text: "The Argireline trial concerns a preparation, not either retail product in this pair. CIR addresses specified cosmetic safety uses, not a comparative benefit trial.",
    sourceIds: ["argireline-trial", "cir-peptides"],
  },
  relatedGuideSlugs: ["peptide-percentages-explained"],
  updatedAt: date,
  limitations:
    "Selected names, no verified COSRX availability or comparable cost, and no finished-product head-to-head clinical evaluation. Scientific review pending.",
  sourceIds: ["cosrx-six", "ordinary", "argireline-trial", "cir-peptides"],
  publicationStatus: "draft",
};
if (!d.comparisons.some((c) => c.id === pair.id)) d.comparisons.push(pair);
fs.writeFileSync(path, JSON.stringify(d, null, 2) + "\n");
const ep = "src/data/evidence.json";
const e = JSON.parse(fs.readFileSync(ep, "utf8"));
for (const s of sources)
  if (!e.some((x) => x.sourceId === s.id))
    e.push({
      sourceId: s.id,
      kind:
        s.sourceType === "manufacturer"
          ? "Manufacturer label"
          : "Regulatory guidance",
      supports:
        s.id === "cosrx-six"
          ? "Exact mini label, selected names and presentation."
          : "The US regulator’s stated distinction or risk communication at the inspection date.",
      limits:
        s.id === "cosrx-six"
          ? "Commercial source; not a clinical trial. Page says unavailable while public feed marks the variant available, so price and availability are not published. Review widgets include unrelated sunscreen text and were not used."
          : "Not a new clinical trial or a complete literature review. Regulatory statements have a jurisdiction, date and specific scope; absence of established safety is not proof of a particular injury.",
      commercialContext:
        s.sourceType === "manufacturer"
          ? "Published by the product seller."
          : "US government regulator; not a retailer.",
      checkedAt: date,
      access:
        "Public source text inspected; underlying clinical dossiers not independently reanalysed.",
    });
fs.writeFileSync(ep, JSON.stringify(e, null, 2) + "\n");
const update = (id, fields) =>
  Object.assign(
    e.find((x) => x.sourceId === id),
    fields,
  );
update("retatrutide-phase2", {
  kind: "Human clinical trial",
  authors: "Jastreboff AM, Kaplan LM, Frías JP, et al.",
  year: 2023,
  journal: "New England Journal of Medicine 389:514–526",
  doi: "10.1056/NEJMoa2301972",
  design:
    "Randomized double-blind placebo-controlled phase 2 trial; 338 adults, 48 weeks.",
  finding:
    "Weight reduction was reported; gastrointestinal adverse events and heart-rate increases were also reported.",
  supports: "Human trial findings for the study intervention and population.",
  limits:
    "Not a full current trial inventory, approval decision, long-term safety guarantee or authentication of online products.",
  commercialContext: "Funded by Eli Lilly, as stated in the abstract.",
  access:
    "PubMed abstract and metadata inspected. Publisher full text unavailable; detailed protocols not reviewed.",
});
update("bpc-human-pilot", {
  kind: "Human pilot study",
  authors: "Lee E, Burgess K",
  year: 2025,
  journal: "Alternative Therapies in Health and Medicine 31(5):20–24",
  design:
    "Uncontrolled intravenous pilot, two previously exposed participants; measurements over three days.",
  finding:
    "Authors reported no adverse effects or measurable changes in the tested biomarkers.",
  supports:
    "Short observations in two participants, not established clinical benefit.",
  limits:
    "No control group, tiny selected sample and short observation; cannot establish general or long-term safety or injury healing.",
  commercialContext:
    "Private Florida clinic setting. Funding and conflicts were not verified from full text.",
  access: "PubMed abstract inspected; full article not inspected.",
});
fs.writeFileSync(ep, JSON.stringify(e, null, 2) + "\n");
