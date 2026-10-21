import fs from "node:fs";
const date = "2026-10-20";
const read = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const write = (path, data) =>
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
const catalog = read("src/data/catalog.json");
const sources = [
  {
    id: "ordinary-hair-density",
    title:
      "Multi-Peptide Serum for Hair Density — US manufacturer label and 60 mL offer",
    publisher: "The Ordinary",
    url: "https://theordinary.com/en-us/multi-peptide-serum-for-hair-density-hair-scalp-treatment-100434.html",
    sourceType: "manufacturer",
    accessedAt: date,
  },
  {
    id: "hair-combination-trial",
    title:
      "Herbal extract combination versus 3% minoxidil: a 24-week randomized trial",
    publisher: "Journal of Clinical and Aesthetic Dermatology / PMC",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7840088/",
    sourceType: "research",
    accessedAt: date,
  },
];
for (const source of sources)
  if (!catalog.sources.some((s) => s.id === source.id))
    catalog.sources.push(source);
write("src/data/catalog.json", catalog);
const evidence = read("src/data/evidence.json");
const notes = [
  {
    sourceId: "ordinary-hair-density",
    kind: "Manufacturer label",
    supports:
      "US 60 mL presentation, USD 24 observation, selected names and directions.",
    limits:
      "Commercial source, not independent product testing. Individual pure-peptide amounts are not established by blend names. Formula and offer can change.",
    commercialContext: "Published by the seller.",
    checkedAt: date,
    access:
      "US product page, selected INCI names, offer and directions inspected. No finished-product clinical dossier reviewed.",
  },
  {
    sourceId: "hair-combination-trial",
    kind: "Human formulation study",
    authors: "Lueangarun S, Panchaprateep R",
    journal: "Journal of Clinical and Aesthetic Dermatology 13(10):32–37",
    year: 2020,
    supports:
      "A different multi-ingredient formulation containing Acetyl Tetrapeptide-3.",
    design:
      "32 participants; randomized triple-blind active-comparator trial; 24 weeks; no placebo arm.",
    finding:
      "Both groups improved; no statistically significant between-group difference in terminal hair-count increase.",
    limits:
      "Different product; cannot isolate the peptide or establish equivalence to minoxidil. Small study, limited duration.",
    commercialContext:
      "Authors report no funding and no relevant conflicts; not independently audited.",
    checkedAt: date,
    access:
      "PMC full text: abstract, methods, results and disclosures inspected.",
  },
];
for (const note of notes)
  if (!evidence.some((n) => n.sourceId === note.sourceId)) evidence.push(note);
write("src/data/evidence.json", evidence);
