// INTERNAL ONLY. Never import into a public route, search index or navigation.
// Documentary preparation by the implementation agent is not human editorial
// or scientific approval. No therapeutic advice or commercial eligibility.
import type {
  KnowledgeEntityDraft,
  TopicIntroductionDraft,
} from "./knowledge-model";

export const metabolismSources = [
  {
    id: "mesh-glp1-2026",
    url: "https://meshb.nlm.nih.gov/record/ui?ui=D052216",
    title: "NLM MeSH: Glucagon-Like Peptide 1",
    checkedAt: "2026-11-08",
    access:
      "Public descriptor record inspected; a terminology source, not a clinical study.",
  },
  {
    id: "mesh-gip-2026",
    url: "https://meshb.nlm.nih.gov/record/ui?ui=D005749",
    title: "NLM MeSH: Gastric Inhibitory Polypeptide",
    checkedAt: "2026-11-08",
    access:
      "Public descriptor inspected. Its approximate length wording is not used to infer an exact molecular sequence.",
  },
  {
    id: "gip-human-identity",
    url: "https://pubmed.ncbi.nlm.nih.gov/6745415/",
    title:
      "The isolation and sequencing of human gastric inhibitory peptide (GIP)",
    checkedAt: "2026-11-08",
    access:
      "Indexed abstract excerpt inspected; direct PubMed rendering was unavailable and full text was not inspected.",
  },
  {
    id: "glp1-forms-study",
    url: "https://pubmed.ncbi.nlm.nih.gov/8482423/",
    title:
      "Biological effects and metabolic rates of glucagonlike peptide-1 7-36 amide and glucagonlike peptide-1 7-37 in healthy subjects are indistinguishable",
    checkedAt: "2026-11-08",
    access:
      "Indexed bibliographic title inspected; direct abstract rendering unavailable. Detailed outcomes not extracted.",
  },
  {
    id: "retatrutide-triumph2-2026",
    url: "https://pubmed.ncbi.nlm.nih.gov/42810372/",
    title:
      "Retatrutide in adults with obesity and type 2 diabetes (TRIUMPH-2): phase 3 trial",
    checkedAt: "2026-11-08",
    access:
      "PubMed abstract and conflict declarations inspected; publisher full text, protocol and supplements not inspected.",
  },
  {
    id: "fda-glp1-2026-recheck",
    url: "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss",
    title: "FDA concerns about unapproved GLP-1 drugs",
    checkedAt: "2026-11-08",
    access:
      "Public FDA communication inspected, including its retatrutide section. US context only.",
  },
] as const;
export const metabolismIntroduction: TopicIntroductionDraft = {
  topicId: "metabolism",
  editorialReview: "pending",
  overview: {
    text: "Start with the identities behind GLP-1 and GIP, then distinguish those physiological peptides from named investigational preparations. This first collection separates terminology, selected research and dated US regulatory information.",
    sourceIds: ["mesh-glp1-2026", "mesh-gip-2026", "fda-glp1-2026-recheck"],
  },
  coverageAndLimits: {
    text: "Two identity-focused drafts and one proposed update to an existing article. This is not a systematic review, an assessment of an online product, or a recommendation for treating a condition. Clinical interpretation awaits qualified review.",
    sourceIds: [
      "glp1-forms-study",
      "gip-human-identity",
      "retatrutide-triumph2-2026",
    ],
  },
};
export const metabolismProfiles: readonly KnowledgeEntityDraft[] = [
  {
    id: "human-glp1-7-36-amide",
    kind: "peptide",
    name: "Human GLP-1(7–36) amide",
    aliases: [],
    topicIds: ["metabolism"],
    identityVerification: "checked",
    editorialReview: "pending",
    scientificReview: "pending",
    summary: {
      text: "This draft concerns the amidated GLP-1(7–36) form. The broader term GLP-1 also covers other processed forms; their names are retained separately.",
      sourceIds: ["mesh-glp1-2026", "glp1-forms-study"],
    },
    context: {
      text: "The MeSH record places GLP-1 among incretin terminology. A 1993 study title explicitly distinguishes GLP-1(7–36) amide from GLP-1(7–37); neither title nor terminology establishes the identity of a marketed preparation.",
      sourceIds: ["mesh-glp1-2026", "glp1-forms-study"],
    },
    limitations: {
      text: "No sequence, purity, product equivalence, comparative clinical conclusion or use protocol is supplied. The primary study’s detailed outcomes have not been extracted. Broader GLP-1 labels are not registered here as exact molecular aliases.",
      sourceIds: ["glp1-forms-study", "mesh-glp1-2026"],
    },
    evidence: [
      {
        scope: "peptide",
        kind: "human-study",
        finding: {
          text: "A bibliographic record identifies a study comparing two named GLP-1 forms in healthy subjects. Population size, duration and numerical outcomes remain unextracted in this draft.",
          sourceIds: ["glp1-forms-study"],
        },
        limitations: {
          text: "The title alone is insufficient for an independent clinical appraisal. Obtain the abstract or full text before extending the interpretation.",
          sourceIds: ["glp1-forms-study"],
        },
      },
    ],
    regulatoryNotes: [],
    relationships: [],
  },
  {
    id: "human-gip-1-42",
    kind: "peptide",
    name: "Human GIP(1–42)",
    aliases: [],
    topicIds: ["metabolism"],
    identityVerification: "checked",
    editorialReview: "pending",
    scientificReview: "pending",
    summary: {
      text: "An original isolation report explicitly identifies human GIP(1–42), separately from shorter fragments. GIP terminology also appears under gastric inhibitory polypeptide and glucose-dependent insulinotropic peptide.",
      sourceIds: ["gip-human-identity", "mesh-gip-2026"],
    },
    context: {
      text: "The selected identity paper concerns material isolated from human intestinal tissue. It provides molecular identification context, rather than a treatment comparison.",
      sourceIds: ["gip-human-identity"],
    },
    limitations: {
      text: "Generic GIP terminology is not registered as proof that every preparation has this form. This draft does not reproduce a sequence, establish a clinical benefit, or transfer findings to analogues or commercial products.",
      sourceIds: ["gip-human-identity", "mesh-gip-2026"],
    },
    evidence: [
      {
        scope: "peptide",
        kind: "other",
        finding: {
          text: "The indexed abstract describes isolation and sequencing, including human GIP(1–42) and distinct fragments. This is identity research, not a clinical efficacy trial.",
          sourceIds: ["gip-human-identity"],
        },
        limitations: {
          text: "Full methods and full text were not inspected; no clinical outcomes have been extracted.",
          sourceIds: ["gip-human-identity"],
        },
      },
    ],
    regulatoryNotes: [],
    relationships: [],
  },
];
export const retatrutideUpdateDraft = {
  targetId: "library:retatrutide",
  status: "internal-draft",
  editorialReview: "pending",
  scientificReview: "pending",
  checkedAt: "2026-11-08",
  proposedTitle:
    "Retatrutide: selected research and dated US regulatory context",
  summary:
    "The existing article summarizes a 2023 phase 2 study. A 2026 phase 3 publication is now identified for a separate, scoped update. Study publication and regulatory authorization must remain distinct.",
  study: {
    sourceId: "retatrutide-triumph2-2026",
    preparation: "Investigational retatrutide studied in TRIUMPH-2",
    design: "Randomized, double-blind, placebo-controlled phase 3 trial",
    population: "Adults with obesity and type 2 diabetes",
    duration: "80 weeks",
    outcomeExtraction:
      "Numerical benefit and adverse-event synthesis pending qualified review",
    commercialContext:
      "Eli Lilly involvement and employee/shareholder declarations are present in the record; full conflict appraisal remains pending.",
  },
  regulatory: {
    sourceId: "fda-glp1-2026-recheck",
    jurisdiction: "US",
    preparation:
      "Retatrutide discussed in FDA’s unapproved/compounding communication",
    statement:
      "The inspected FDA communication states that retatrutide is not a component of an FDA-approved drug and cannot be used in compounding under federal law. Recheck immediately before publication.",
  },
  sourceIds: ["retatrutide-triumph2-2026", "fda-glp1-2026-recheck"],
  publicationBlockers: [
    "Human editorial approval for this version",
    "Qualified scientific review",
    "Fuller study appraisal and source-access checks",
    "Fresh regulatory check at publication",
  ],
} as const;
