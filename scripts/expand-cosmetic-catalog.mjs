import fs from "node:fs";

const path = "src/data/catalog.json";
const catalog = JSON.parse(fs.readFileSync(path, "utf8"));
const date = "2026-10-19";
const scope =
  "Selected label peptides, not the complete INCI list. Other peptides and non-peptide ingredients may be omitted. See the manufacturer for the full formula.";
const entries = [
  {
    id: "naturium-multi-peptide",
    brandId: "naturium",
    brand: "Naturium",
    website: "https://naturium.com",
    url: "https://naturium.com/products/multi-peptide-advanced-serum",
    slug: "naturium-multi-peptide-advanced-serum",
    name: "Multi-Peptide Advanced Serum",
    volume: 30,
    volumeUnit: "ml",
    price: 25,
    image: "naturium",
    names: [
      "Acetyl Hexapeptide-8",
      "Copper Palmitoyl Heptapeptide-14",
      "Palmitoyl sh-Hexapeptide-13 Serine SP Amide",
    ],
    description:
      "A facial serum with three selected peptide names, plus ferulic acid and hydrolyzed collagen on the manufacturer’s ingredient list.",
    disclosure:
      "Individual peptide percentages are not stated in the checked label.",
    explanation:
      "The label names a peptide blend without giving a separate percentage for each peptide. Its strength cannot be calculated from ingredient order.",
    usage:
      "Naturium directs application after cleansing and toning, before moisturizer and sunscreen. Follow the current product directions.",
  },
  {
    id: "timeless-synthe6",
    brandId: "timeless",
    brand: "Timeless Skin Care",
    website: "https://www.timelessha.com",
    url: "https://www.timelessha.com/products/matrixyl-synthe6-serum-1-oz",
    slug: "timeless-matrixyl-synthe6-serum",
    name: "Matrixyl Synthe’6 Serum",
    volume: 1,
    volumeUnit: "oz",
    price: 28.95,
    image: "timeless",
    names: ["Palmitoyl Tripeptide-38"],
    description:
      "A facial serum sold as 1 US fl oz. The brand identifies Matrixyl Synthe’6 with Palmitoyl Tripeptide-38; its displayed ingredient list uses the commercial system name.",
    disclosure:
      "Timeless states 2% Matrixyl Synthe’6. This is a named-system disclosure, not a verified pure-peptide concentration.",
    explanation:
      "The stated 2% refers to Matrixyl Synthe’6. It does not establish 2% pure Palmitoyl Tripeptide-38 or a strength ranking against other blends.",
    usage:
      "Timeless directs use on clean skin and allowing absorption before the next layer. Check its current directions, including its eye-area restrictions.",
  },
  {
    id: "medik8-liquid-peptides",
    brandId: "medik8",
    brand: "Medik8",
    website: "https://us.medik8.com",
    url: "https://us.medik8.com/products/liquid-peptides",
    slug: "medik8-liquid-peptides",
    name: "Liquid Peptides",
    volume: 30,
    volumeUnit: "ml",
    price: 68,
    image: "medik8",
    names: [
      "Carnosine",
      "Acetyl Hexapeptide-8",
      "Palmitoyl Tripeptide-1",
      "Palmitoyl Tetrapeptide-7",
      "Palmitoyl Tripeptide-38",
      "Palmitoyl Pentapeptide-4",
      "Tetrapeptide-21",
      "Pentapeptide-18",
      "Acetyl Tetrapeptide-5",
      "Copper Palmitoyl Heptapeptide-14",
      "Palmitoyl sh-Hexapeptide-13 Serine SP Amide",
    ],
    description:
      "The original Liquid Peptides facial serum, recorded separately from Liquid Peptides Advanced MP. Selected names are transcribed from the US ingredient list.",
    disclosure:
      "Medik8 describes a 30% multi-peptide complex. Separate pure-peptide amounts are not disclosed.",
    explanation:
      "The stated 30% describes a complex. It does not mean 30% pure peptides and cannot be compared directly with another brand’s blend percentage.",
    usage:
      "Medik8 directs application after cleansing, morning and evening, before moisturizer. The brand recommends a patch test before first use.",
  },
];
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const upsert = (group, record) => {
  const i = group.findIndex((x) => x.id === record.id);
  if (i < 0) group.push(record);
  else group[i] = record;
};
for (const p of entries) {
  upsert(catalog.brands, {
    id: p.brandId,
    name: p.brand,
    slug: p.brandId,
    website: p.website,
  });
  upsert(catalog.sources, {
    id: p.id,
    title: `${p.name} — US manufacturer label and size-specific offer`,
    publisher: p.brand,
    url: p.url,
    accessedAt: date,
    sourceType: "manufacturer",
  });
  upsert(catalog.retailers, {
    id: p.brandId,
    name: p.brand,
    website: p.website,
    affiliateUrl: null,
    status: "active",
  });
  for (const name of p.names) {
    if (catalog.ingredients.some((i) => i.inciName === name)) continue;
    const sourceIds = entries
      .filter((e) => e.names.includes(name))
      .map((e) => e.id);
    const section = (text) => ({ text, sourceIds });
    const description =
      "A peptide name recorded on a manufacturer’s cosmetic ingredient list. The name identifies an ingredient, not a predicted result.";
    const id = slugify(name);
    catalog.ingredients.push({
      id,
      name,
      inciName: name,
      slug: id,
      ingredientCategory: "Cosmetic peptide",
      description,
      knownLimitations:
        "The checked labels do not establish its individual concentration, comparative effectiveness or ingredient-specific reaction rate.",
      education: {
        summary: description,
        whatItIs: section(
          "An exact ingredient name from the linked label. Its number is part of its identity, not a quality score.",
        ),
        purpose: section(
          "The manufacturer includes this ingredient in a peptide skincare formula. The label alone does not show what this ingredient contributes by itself.",
        ),
        evidence: {
          ...section(
            "The recorded evidence is label information. No independent test of this ingredient in these finished serums is established here.",
          ),
          label: "Label information",
        },
        precautions: {
          text: "A label entry cannot tell us how often this ingredient causes a reaction. Follow the complete product directions; irritation can involve other ingredients too.",
          sourceIds: ["fda-cosmetic-reactions"],
        },
        takeaway:
          "Use this name to recognize the ingredient across labels. Judge the finished product with its directions and evidence, rather than its peptide count.",
        sourceCheckedAt: date,
      },
      sourceIds: [...sourceIds, "fda-cosmetic-reactions"],
      status: "published",
    });
  }
  upsert(catalog.products, {
    id: p.id,
    brandId: p.brandId,
    name: p.name,
    slug: p.slug,
    category: "Facial serum",
    description: p.description,
    volume: p.volume,
    volumeUnit: p.volumeUnit,
    ingredientList: p.names,
    ingredientListScope:
      scope +
      (p.brandId === "timeless"
        ? " Palmitoyl Tripeptide-38 is identified in the brand’s explanation of Matrixyl Synthe’6; its displayed list uses that system name."
        : ""),
    ingredientIds: p.names.map(
      (name) => catalog.ingredients.find((i) => i.inciName === name).id,
    ),
    concentrationDisclosure: p.disclosure,
    concentrationExplanation: p.explanation,
    sourceId: p.id,
    lastVerifiedAt: date,
    editorialStatus: "published",
    formulationNotes:
      "Manufacturer label facts only; no independent head-to-head effectiveness is established. Formulas can change. Check the packaging for the purchased version." +
      (p.brandId === "timeless"
        ? " Price records the one-time 1 US fl oz offer, excluding coupon and subscription discounts. Packaging also prints 30 mL; unit-cost calculations use the recorded US fl oz size."
        : ""),
    tone: "ivory",
    image: `/images/products/${p.image}-verified.jpg`,
    usageSummary: p.usage,
  });
  upsert(catalog.prices, {
    id: `${p.id}-${date}`,
    productId: p.id,
    retailerId: p.brandId,
    currency: "USD",
    price: p.price,
    size: p.volume,
    sizeUnit: p.volumeUnit,
    sourceId: p.id,
    observedAt: date,
    verifiedAt: date,
    availabilityStatus:
      "In stock when checked; one-time purchase, excluding coupon and subscription discounts",
  });
}
const comparisons = [
  {
    id: "naturium-vs-ha",
    slug: "naturium-multi-peptide-vs-the-ordinary-ha",
    title:
      "Naturium Multi-Peptide Advanced Serum vs. The Ordinary Multi-Peptide + HA",
    pair: ["naturium-multi-peptide", "ordinary-ha"],
    question: "What should I compare when the peptide names differ?",
    summary:
      "Both are 30 mL facial serums. Their selected peptide lists differ, so compare the exact names and dated cost before treating them as substitutes.",
    difference:
      "Naturium’s selected list includes a copper-containing name distinct from Copper Tripeptide-1. Sharing Acetyl Hexapeptide-8 does not make the whole formulas identical.",
    notes: [
      {
        title: "Recognize the exact copper name",
        text: "Copper Palmitoyl Heptapeptide-14 is the name recorded for Naturium. Similar copper wording does not establish the same ingredient or the same results.",
      },
      {
        title: "Look beyond the peptide list",
        text: "Check each full manufacturer label for other ingredients relevant to your preferences. Our selected list is a navigation aid, not a complete formula.",
      },
    ],
    qs: [
      {
        question:
          "Does a copper ingredient make Naturium equivalent to a Copper Tripeptide-1 serum?",
        answer:
          "No equivalence is established here. The recorded copper name is different; use the exact-name ingredient guide for context.",
      },
      {
        question: "Can shared peptide names tell me which serum works better?",
        answer:
          "No. A shared name does not disclose its amount, the full formulation or comparative results.",
      },
    ],
  },
  {
    id: "timeless-vs-matrixyl",
    slug: "timeless-synthe6-vs-the-ordinary-matrixyl",
    title: "Timeless Matrixyl Synthe’6 vs. The Ordinary Matrixyl 10% + HA",
    pair: ["timeless-synthe6", "ordinary-matrixyl"],
    question: "Does 10% versus 2% tell me which Matrixyl serum is stronger?",
    summary:
      "The named systems need context: neither percentage establishes a directly comparable pure-peptide dose. Timeless is recorded as 1 US fl oz; The Ordinary as 30 mL.",
    difference:
      "Timeless identifies Synthe’6 with Palmitoyl Tripeptide-38. The Ordinary’s selected record also includes Palmitoyl Tripeptide-1 and Palmitoyl Tetrapeptide-7.",
    notes: [
      {
        title: "Compare the system, not just the percentage",
        text: "Different named blends cannot be ranked by their headline percentages. Open the Matrixyl guide to distinguish the ingredient names.",
      },
      {
        title: "Use one volume basis for cost",
        text: "The unit-cost calculation converts 1 US fl oz using 29.5735295625 mL. Timeless packaging also prints 30 mL; the catalog preserves the store’s 1 fl oz variant. Coupons and subscriptions are excluded.",
      },
    ],
    qs: [
      {
        question: "Is 10% five times stronger than 2%?",
        answer:
          "That conclusion is not supported. The figures describe named ingredient systems and do not supply comparable pure-peptide amounts.",
      },
      {
        question:
          "Is Timeless’ displayed ingredient list a full exact INCI transcription here?",
        answer:
          "No. The brand’s list uses Matrixyl Synthe’6. Our selected entry follows its separate identification of Palmitoyl Tripeptide-38; it does not reconstruct a complete INCI list.",
      },
    ],
  },
  {
    id: "medik8-vs-ha",
    slug: "medik8-liquid-peptides-vs-the-ordinary-ha",
    title: "Medik8 Liquid Peptides vs. The Ordinary Multi-Peptide + HA",
    pair: ["medik8-liquid-peptides", "ordinary-ha"],
    question: "What does a higher-priced peptide complex actually tell me?",
    summary:
      "These 30 mL profiles support a dated cost comparison. A higher price or a larger disclosed blend percentage does not establish better results.",
    difference:
      "This profile covers original Liquid Peptides, not Advanced MP. Its selected list includes multiple peptide names, including a distinct copper-containing ingredient.",
    notes: [
      {
        title: "Separate the complex from pure peptide",
        text: "Medik8’s 30% describes a multi-peptide complex. It does not provide a separate pure amount for each ingredient.",
      },
      {
        title: "Separate price from effectiveness",
        text: "The table measures purchase cost and recorded label differences. We have no independent head-to-head test establishing whether the extra cost improves results.",
      },
    ],
    qs: [
      {
        question: "Is this Liquid Peptides Advanced MP?",
        answer:
          "No. This record is for original Liquid Peptides. Do not apply its price or selected ingredients to the Advanced MP formula.",
      },
      {
        question: "Does 30% mean 30% pure peptides?",
        answer:
          "The brand describes a 30% complex. The checked disclosure does not establish 30% pure peptides.",
      },
    ],
  },
];
for (const c of comparisons) {
  const sourceIds = [...c.pair];
  upsert(catalog.comparisons, {
    id: c.id,
    slug: c.slug,
    title: c.title,
    comparedProductIds: c.pair,
    buyerQuestion: c.question,
    editorialSummary: c.summary,
    documentedDifferences: c.difference,
    practicalDifferences: c.notes,
    decisionNotes: c.notes,
    questions: c.qs.map((q) => ({ ...q, sourceIds })),
    relatedGuideSlugs:
      c.id === "timeless-vs-matrixyl"
        ? ["matrixyl-3000-vs-synthe6", "peptide-percentages-explained"]
        : ["peptide-percentages-explained"],
    updatedAt: date,
    limitations:
      "Selected ingredients only. Individual peptide amounts, personal tolerance and independent comparative effectiveness are not established. Editorial draft awaiting human review.",
    sourceIds,
    publicationStatus: "draft",
  });
}
fs.writeFileSync(path, JSON.stringify(catalog, null, 2) + "\n");
console.log(
  `${catalog.products.length} products, ${catalog.ingredients.length} ingredients, ${catalog.comparisons.length} comparisons`,
);
