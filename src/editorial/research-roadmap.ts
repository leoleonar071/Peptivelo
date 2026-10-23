import type { TopicId } from "../lib/topic-registry";

export type ResearchBrief = {
  topicId: TopicId;
  priority: number;
  stage: "planned";
  candidateLabels: readonly string[];
  existingContentIds: readonly string[];
  questions: readonly string[];
  sourceWork: readonly {
    kind: "identity" | "primary-studies" | "regulatory";
    state: "not-started";
  }[];
};
const questions = [
  "What exact identities, forms and aliases can primary sources establish?",
  "Which existing pages should be linked or updated instead of duplicated?",
  "What do human, animal and laboratory studies actually examine, and what remains unknown?",
  "Which claims concern an ingredient, a formulation or an exact finished product?",
  "Which jurisdiction, preparation and date apply to any regulatory statement?",
  "Which introduction and two profiles would make this area useful to a new reader?",
] as const;
const sourceWork = [
  { kind: "identity", state: "not-started" },
  { kind: "primary-studies", state: "not-started" },
  { kind: "regulatory", state: "not-started" },
] as const;
// Proposed search labels, not verified identities, aliases, profiles or scientific claims.
// This module is not imported by any public page, search index or comparator.
const plannedBriefs = [
  {
    topicId: "metabolism",
    priority: 1,
    candidateLabels: [
      "GLP-1",
      "GIP",
      "Semaglutide",
      "Tirzepatide",
      "Retatrutide",
    ],
    existingContentIds: ["library:retatrutide"],
  },
  {
    topicId: "growth",
    priority: 2,
    candidateLabels: [
      "GHRH",
      "Sermorelin",
      "Tesamorelin",
      "Ipamorelin",
      "CJC-1295",
    ],
    existingContentIds: [],
  },
  {
    topicId: "reproduction",
    priority: 3,
    candidateLabels: ["GnRH", "Kisspeptin-10", "Kisspeptin-54", "Oxytocin"],
    existingContentIds: [],
  },
  {
    topicId: "nervous",
    priority: 4,
    candidateLabels: ["Neuropeptide Y", "Orexin A", "Orexin B", "Neurotensin"],
    existingContentIds: [],
  },
  {
    topicId: "pancreatic",
    priority: 5,
    candidateLabels: ["Insulin", "Amylin", "Somatostatin", "Pramlintide"],
    existingContentIds: [],
  },
  {
    topicId: "digestive",
    priority: 6,
    candidateLabels: ["Gastrin", "Secretin", "Cholecystokinin", "GLP-2"],
    existingContentIds: [],
  },
  {
    topicId: "immunity",
    priority: 7,
    candidateLabels: [
      "LL-37",
      "Alpha-defensins",
      "Beta-defensins",
      "Thymosin alpha 1",
    ],
    existingContentIds: [],
  },
  {
    topicId: "repair",
    priority: 8,
    candidateLabels: [
      "BPC-157",
      "Thymosin beta 4",
      "TB-500 (identity to verify separately)",
    ],
    existingContentIds: ["library:bpc-157"],
  },
  {
    topicId: "pain",
    priority: 9,
    candidateLabels: [
      "Substance P",
      "CGRP",
      "Met-enkephalin",
      "Beta-endorphin",
    ],
    existingContentIds: [],
  },
  {
    topicId: "cardiovascular",
    priority: 10,
    candidateLabels: [
      "Angiotensin II",
      "Bradykinin",
      "Vasopressin",
      "ANP",
      "BNP",
    ],
    existingContentIds: [],
  },
  {
    topicId: "bone",
    priority: 11,
    candidateLabels: ["PTH", "Calcitonin", "Teriparatide", "Abaloparatide"],
    existingContentIds: [],
  },
  {
    topicId: "mitochondrial",
    priority: 12,
    candidateLabels: ["MOTS-c", "Humanin", "SHLP2"],
    existingContentIds: [],
  },
  {
    topicId: "food",
    priority: 13,
    candidateLabels: [
      "IPP",
      "VPP",
      "Identified hydrolysate sequences (to select)",
    ],
    existingContentIds: [],
  },
] satisfies readonly Omit<
  ResearchBrief,
  "stage" | "questions" | "sourceWork"
>[];
export const researchRoadmap: readonly ResearchBrief[] = plannedBriefs.map(
  (brief) => ({
    ...brief,
    stage: "planned",
    questions,
    sourceWork,
  }),
);
