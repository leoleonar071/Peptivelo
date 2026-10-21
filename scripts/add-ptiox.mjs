import fs from "node:fs";
const date = "2026-10-20";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, value) =>
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + "\n");
const d = read("src/data/catalog.json");
const add = (list, record) => {
  if (!list.some((r) => r.id === record.id)) list.push(record);
};
const us =
  "https://www.skinceuticals.com/skincare/anti-aging-serum/p-tiox-anti-wrinkle-serum/3606000624399.html";
const sources = [
  {
    id: "ptiox-us",
    title: "P-TIOX Anti-Wrinkle Serum: US presentation and offer",
    url: us,
    publisher: "SkinCeuticals",
    sourceType: "manufacturer",
  },
  {
    id: "ptiox-uk-label",
    title: "P-TIOX ingredient list on the UK Power Pair page",
    url: "https://www.skinceuticals.co.uk/en_GB/ultimate-anti-wrinkle-power-pair/ultimate-anti-wrinkle-power-pair.html?geo=false",
    publisher: "SkinCeuticals UK",
    sourceType: "manufacturer",
  },
  {
    id: "ptiox-study-map",
    title: "SkinCeuticals clinical publication index",
    url: "https://www.lorealprofessionalskincare.com/skinceuticals/science/clinical-studies",
    publisher: "L’Oréal Dermatological Beauty",
    sourceType: "manufacturer",
  },
  {
    id: "ptiox-zhu-2026",
    title:
      "Serum with acetyl hexapeptide-8, dipeptide and gluconolactone: ex vivo and clinical studies",
    url: "https://pubmed.ncbi.nlm.nih.gov/41668671/",
    publisher: "International Journal of Cosmetic Science / PubMed",
    sourceType: "research",
  },
  {
    id: "ptiox-adjunct-2026",
    title:
      "Neuropeptide serum around botulinum toxin injection: randomized split-face study",
    url: "https://pubmed.ncbi.nlm.nih.gov/42299447/",
    publisher: "Clinical, Cosmetic and Investigational Dermatology / PubMed",
    sourceType: "research",
  },
];
for (const s of sources) add(d.sources, { ...s, accessedAt: date });
add(d.brands, {
  id: "skinceuticals",
  name: "SkinCeuticals",
  slug: "skinceuticals",
  website: "https://www.skinceuticals.com",
});
add(d.retailers, {
  id: "skinceuticals",
  name: "SkinCeuticals US",
  website: "https://www.skinceuticals.com",
  affiliateUrl: null,
  status: "active",
});
add(d.products, {
  id: "skinceuticals-ptiox",
  brandId: "skinceuticals",
  name: "P-TIOX Anti-Wrinkle Serum",
  slug: "skinceuticals-ptiox",
  category: "Multi-ingredient facial serum",
  description:
    "A 30 mL cosmetic serum with a peptide complex and non-peptide actives. It is distinct from P-TIOX Cream.",
  volume: 30,
  volumeUnit: "ml",
  ingredientList: [
    "Acetyl Hexapeptide-8",
    "Dipeptide Diaminobutyroyl Benzylamide Diacetate",
  ],
  ingredientListScope:
    "Selected peptide names from the brand’s UK P-TIOX label. The complete US INCI was not retrieved; regional equivalence is not assumed. Confirm your current package.",
  ingredientIds: [
    "acetyl-hexapeptide-8",
    "dipeptide-diaminobutyroyl-benzylamide-diacetate",
  ],
  concentrationDisclosure:
    "US brand description: 5% PHA, 5% niacinamide and 1% laminaria extract; these are not peptide percentages.",
  concentrationExplanation:
    "The US page gives percentages for non-peptide actives. Individual pure-peptide amounts are not verified here.",
  sourceId: "ptiox-us",
  lastVerifiedAt: date,
  editorialStatus: "published",
  formulationNotes:
    "UK selected-label names and US presentation are separate source checks. Brand-linked clinical publications exist; this is not a direct comparison with The Ordinary.",
  tone: "copper",
  image: "/images/products/skinceuticals-ptiox-30ml.jpg",
  usageSummary:
    "The US brand describes twice-daily use. Follow current package directions and your clinician’s instructions around procedures.",
});
add(d.prices, {
  id: "ptiox-30ml-2026-10-20",
  productId: "skinceuticals-ptiox",
  retailerId: "skinceuticals",
  currency: "USD",
  price: 150,
  size: 30,
  sizeUnit: "ml",
  sourceId: "ptiox-us",
  observedAt: date,
  verifiedAt: date,
  availabilityStatus:
    "One-time price displayed; stock and shipping not independently confirmed",
});
const scientific = ["ptiox-zhu-2026", "ptiox-adjunct-2026"];
const labels = ["ptiox-us", "ptiox-uk-label", "ptiox-study-map", "ordinary-ha"];
add(d.comparisons, {
  id: "ptiox-vs-ha",
  slug: "skinceuticals-ptiox-vs-the-ordinary-ha",
  title: "SkinCeuticals P-TIOX vs The Ordinary Multi-Peptide + HA",
  comparedProductIds: ["skinceuticals-ptiox", "ordinary-ha"],
  editorialSummary:
    "Compare the price, selected names and different evidence scopes without assuming equivalent formulas or a clinical winner.",
  citationPilot: true,
  buyerQuestion:
    "What does the higher price tell us — and what does it leave unanswered?",
  documentedDifferences:
    "Both records are 30 mL. P-TIOX names non-peptide actives; its selected UK peptide list overlaps with The Ordinary at Acetyl Hexapeptide-8. The full US P-TIOX INCI requires confirmation.",
  practicalDifferences: [
    {
      title: "A whole formula, not just peptides",
      text: "The P-TIOX brand description includes PHA, niacinamide and laminaria extract. Its percentages are not a pure-peptide strength ranking.",
      sourceIds: ["ptiox-us"],
    },
    {
      title: "Market-specific label limit",
      text: "P-TIOX’s selected peptide names were read from a UK brand page. Check your US packaging before assuming the same full formula.",
      sourceIds: ["ptiox-uk-label", "ptiox-us"],
    },
  ],
  questions: [
    {
      question:
        "Does published research prove P-TIOX is better than The Ordinary?",
      answer:
        "No head-to-head study between these retail serums was reviewed. Studies of one formula or a post-injection setting cannot establish that comparison.",
      sourceIds: scientific,
    },
    {
      question:
        "Does the post-injection study show the serum replaces injections?",
      answer:
        "No. That randomized study examined the serum around botulinum toxin treatment, rather than replacing the procedure.",
      sourceIds: ["ptiox-adjunct-2026"],
    },
  ],
  decisionNotes: [
    {
      title: "Separate cost from benefit",
      text: "Compare the dated unit prices independently from the research; price is not a clinical outcome.",
      sourceIds: ["ptiox-us", "ordinary-ha"],
      interpretation: true,
    },
    {
      title: "Confirm the exact product",
      text: "This record covers the 30 mL serum, not P-TIOX Cream or a bundle.",
      sourceIds: ["ptiox-us"],
    },
  ],
  relatedGuideSlugs: ["peptide-percentages-explained"],
  updatedAt: date,
  limitations:
    "Selected regional label names; limited source inspection; no complete literature review, independent assay or direct product trial. Editorial and scientific review pending.",
  sourceIds: [...labels, ...scientific],
  publicationStatus: "draft",
});
// Link the same source to a newer formulation context without overwriting the
// existing ingredient-only explanation or attributing formula results to it.
const dipeptide = d.ingredients.find(
  (i) => i.id === "dipeptide-diaminobutyroyl-benzylamide-diacetate",
);
dipeptide.sourceIds = [
  ...new Set([...dipeptide.sourceIds, "ptiox-zhu-2026", "ptiox-uk-label"]),
];
dipeptide.education.summary =
  "A named peptide in some cosmetic blends; formula evidence is separate from ingredient evidence.";
dipeptide.education.evidence = {
  label: "Formulation study",
  text: "A 2026 paper studied a multi-ingredient serum containing this name. Reported formula improvements cannot isolate this ingredient’s contribution.",
  sourceIds: ["ptiox-zhu-2026"],
};
dipeptide.education.sourceCheckedAt = date;
write("src/data/catalog.json", d);
const e = read("src/data/evidence.json");
const note = (id, fields) => {
  if (!e.some((r) => r.sourceId === id))
    e.push({ sourceId: id, checkedAt: date, ...fields });
};
for (const id of ["ptiox-us", "ptiox-uk-label", "ptiox-study-map"])
  note(id, {
    kind:
      id === "ptiox-study-map"
        ? "Manufacturer study summary"
        : "Manufacturer label",
    supports:
      id === "ptiox-us"
        ? "US 30 mL presentation, displayed USD 150 one-time price and non-peptide percentage disclosures."
        : id === "ptiox-uk-label"
          ? "Selected peptide names on a UK brand label; not verification of the complete US formula."
          : "Brand association of the cited publications with P-TIOX; not independent clinical validation.",
    limits:
      "Commercial information. Regional formulas, offers and stock may change. Not an assay or independent efficacy evaluation.",
    commercialContext: "Published by the brand or its parent company.",
    access: "Public page text inspected. US full-INCI popup was not retrieved.",
  });
note("ptiox-zhu-2026", {
  kind: "Human formulation study",
  authors: "Zhu M, He X, Zhu Z, et al.",
  journal: "International Journal of Cosmetic Science 48(5):913–925",
  year: 2026,
  doi: "10.1111/ics.70087",
  design:
    "Ex vivo skin work plus separate clinical studies: n=50 (static wrinkles), n=42 (dynamic wrinkles).",
  finding:
    "The abstract reports improved wrinkle and skin-quality measures for a multi-ingredient formula.",
  supports: "A formula-level result, not an isolated peptide effect.",
  limits:
    "The abstract does not establish a randomized placebo comparison for these clinical arms. No retail head-to-head comparison or years-long safety follow-up was reviewed.",
  commercialContext:
    "Authors list L’Oréal research affiliations; they declare no conflicts of interest. This is not treated as independent replication.",
  access:
    "PubMed abstract, affiliations, figure captions and conflict statement inspected. Detailed full-text methods were not verified.",
});
note("ptiox-adjunct-2026", {
  kind: "Human clinical trial",
  authors: "Lupin M, Brieva P, Dayeh NR, White S",
  journal: "Clinical, Cosmetic and Investigational Dermatology 19:581831",
  year: 2026,
  doi: "10.2147/CCID.S581831",
  design:
    "10-week randomized double-blind vehicle-controlled split-face study around botulinum toxin injection.",
  finding:
    "The report describes improved post-procedure wrinkle and skin-quality measures versus vehicle.",
  supports:
    "Evidence for an adjunct in a procedural setting, not serum-only equivalence to injections.",
  limits:
    "Sample size and detailed methods were not extracted in this check. No comparison with The Ordinary or conclusion about replacing the procedure.",
  commercialContext:
    "Coauthors have SkinCeuticals affiliations; the disclosure states SkinCeuticals funded Lupin’s research.",
  access:
    "PubMed abstract and indexed publisher disclosure inspected; complete protocol and adverse-event tables not reviewed.",
});
write("src/data/evidence.json", e);
const evaluations = read("src/data/comparison-evaluations.json");
const paragraph = (text, sourceIds, kind = "interpretation") => ({
  text,
  sourceIds,
  kind,
});
if (!evaluations.some((v) => v.comparisonId === "ptiox-vs-ha"))
  evaluations.push({
    comparisonId: "ptiox-vs-ha",
    title: "What the P-TIOX evidence can tell you",
    summary:
      "Published formula research exists, with important commercial and study-context limits.",
    sections: [
      {
        id: "benefits",
        title: "Benefits",
        conclusion:
          "Formula studies report improvements, but no winner against The Ordinary is established.",
        paragraphs: [
          paragraph(
            "The 2026 Zhu paper includes two separate clinical groups (50 and 42 participants). Its abstract reports improved appearance measures for a formula with several active ingredients.",
            ["ptiox-zhu-2026"],
            "evidence",
          ),
          paragraph(
            "This does not isolate the peptide effect or establish superiority to another serum.",
            ["ptiox-zhu-2026"],
          ),
        ],
      },
      {
        id: "risks",
        title: "Precautions",
        conclusion:
          "A post-injection trial is a specific setting, not a blanket safety guarantee.",
        paragraphs: [
          paragraph(
            "The adjunct study used randomized split-face vehicle comparison around botulinum toxin treatment. Its findings should stay within that context.",
            ["ptiox-adjunct-2026"],
            "evidence",
          ),
          paragraph(
            "Detailed adverse-event tables were not reviewed. This comparison cannot assign personal tolerance or recommend post-procedure use.",
            ["ptiox-adjunct-2026"],
          ),
        ],
      },
      {
        id: "long-term",
        title: "What remains unknown",
        conclusion:
          "Short observations do not settle long-term use or the contribution of each ingredient.",
        paragraphs: [
          paragraph(
            "Multiple ingredients, distinct study designs and limited observation prevent conclusions about years of use or which ingredient caused an improvement.",
            scientific,
          ),
        ],
      },
      {
        id: "value",
        title: "Value",
        conclusion:
          "A higher price does not establish greater clinical benefit.",
        paragraphs: [
          paragraph(
            "Neither selected publication is a P-TIOX-versus-The-Ordinary trial. Keep the unit-cost calculation separate from comparative efficacy.",
            scientific,
          ),
        ],
      },
    ],
    labelContext:
      "The US page identifies the 30 mL serum and offer. Selected peptide names come from the UK brand label, with that market limitation preserved. The manufacturer’s publication index links the formula research to P-TIOX.",
    labelSourceIds: labels,
    checkedAt: date,
    status: "draft",
  });
write("src/data/comparison-evaluations.json", evaluations);
