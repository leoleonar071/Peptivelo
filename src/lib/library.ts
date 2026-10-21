import { citationSet } from "./citations";

export const libraryArticles = [
  {
    slug: "peptide-categories",
    title: "Cosmetic, prescription or experimental?",
    category: "Start here",
    description:
      "Understand the differences before comparing two peptide products.",
    answer:
      "A peptide name alone does not tell you whether a product is a cosmetic, an authorized medicine or an experimental preparation. Intended use and the specific product matter.",
    answerSources: ["fda-cosmetic-drug"],
    sections: [
      {
        title: "Cosmetics: read the formula",
        text: "Cosmetics concern cleansing or appearance. Treatment claims can change a product’s legal classification; a cosmetic ingredient is not automatically a medicine.",
        sourceIds: ["fda-cosmetic-drug"],
      },
      {
        title: "Medicines: check the exact authorization",
        text: "Do not transfer an authorized medicine’s status to a compounded version or an online vial. FDA says compounded GLP-1 preparations do not undergo the same approval review.",
        sourceIds: ["fda-glp1"],
      },
      {
        title: "Experimental: distinguish a trial from an offer",
        text: "A study is not a retail product approval. For example, FDA says retatrutide is not a component of an approved drug. A seller’s research-only label does not verify quality.",
        sourceIds: ["fda-glp1"],
      },
    ],
    takeaway:
      "Compare products within their actual use and evidence context. Peptivelo’s commercial comparator currently covers cosmetic serums.",
  },
  {
    slug: "retatrutide",
    title: "Retatrutide: human research and US status",
    category: "Research brief",
    description:
      "A selected clinical study, its limitations and a dated FDA status check.",
    answer:
      "Retatrutide has published human trial evidence. That does not make an online vial an approved medicine: FDA’s current communication says retatrutide is not a component of an FDA-approved drug.",
    answerSources: ["retatrutide-phase2", "fda-glp1"],
    sections: [
      {
        title: "What has been studied?",
        text: "A 2023 double-blind randomized placebo-controlled phase 2 trial enrolled 338 adults and followed treatment for 48 weeks. It reported weight reduction. This brief covers that selected study, not every subsequent trial.",
        sourceIds: ["retatrutide-phase2"],
      },
      {
        title: "What about adverse effects?",
        text: "The abstract reports mostly mild-to-moderate gastrointestinal adverse events and dose-dependent heart-rate increases. Trial supervision, participants and study material limit what can be inferred about other settings or products.",
        sourceIds: ["retatrutide-phase2"],
      },
      {
        title: "What does the regulatory source say?",
        text: "FDA states that retatrutide cannot be used in compounding under federal law. This is a dated US status check, not a worldwide regulatory assessment.",
        sourceIds: ["fda-glp1"],
      },
    ],
    takeaway:
      "Clinical evidence, authorization and the contents of a particular vial are three different questions. This brief offers no product recommendation or dosing protocol.",
  },
  {
    slug: "bpc-157",
    title: "BPC-157: what a small human pilot can tell us",
    category: "Research brief",
    description:
      "Read a two-person pilot in context, alongside FDA safety uncertainties.",
    answer:
      "A published human pilot is not proof that BPC-157 is generally safe or heals injuries. The pilot reviewed here observed two people over three days; FDA separately identifies important safety uncertainties.",
    answerSources: ["bpc-human-pilot", "fda-research-peptides"],
    sections: [
      {
        title: "What did the pilot observe?",
        text: "The 2025 intravenous pilot included two participants who had previously received BPC-157. The authors reported no adverse effects or measurable changes in the tested biomarkers during the short observation.",
        sourceIds: ["bpc-human-pilot"],
      },
      {
        title: "What does that leave unanswered?",
        text: "An uncontrolled two-person pilot cannot estimate uncommon harms or establish long-term safety. It did not demonstrate healing of tendons, muscles or gastrointestinal disease. This brief is not an inventory of all human research.",
        sourceIds: ["bpc-human-pilot"],
      },
      {
        title: "What does FDA flag?",
        text: "FDA identifies limited safety information and potential immune-response and peptide-impurity concerns for proposed uses. These uncertainties do not prove a particular injury will occur, but they prevent a blanket safety assurance.",
        sourceIds: ["fda-research-peptides"],
      },
    ],
    takeaway:
      "No retail vial, purity certificate or treatment protocol is evaluated here. Scientific and human editorial review remain pending.",
  },
];
export function libraryCitations(article: (typeof libraryArticles)[number]) {
  return citationSet("library", [
    { key: "answer", sourceIds: article.answerSources },
    ...article.sections.map((s, i) => ({
      key: `section-${i}`,
      sourceIds: s.sourceIds,
    })),
  ]);
}
