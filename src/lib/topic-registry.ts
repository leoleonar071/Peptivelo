type TopicBase = {
  id: string;
  slug: string;
  title: string;
  description: string;
  subtopics: readonly string[];
  parentId?: string;
  relatedIds: readonly string[];
};
export type TopicDefinition = TopicBase &
  ({ state: "active"; href: string } | { state: "planned"; href?: never });

// These descriptions define editorial scope, not claims about a substance.
// Planned topics have no public href and do not activate comparison groups.
export const topicRegistry = [
  {
    id: "skin",
    slug: "skin-cosmetics",
    title: "Skin & cosmetics",
    state: "active",
    href: "/skincare/",
    description:
      "Explore serum labels, cosmetic ingredients and product comparisons.",
    subtopics: ["Label ingredients", "Formulas", "Evidence & claims"],
    relatedIds: ["hair", "health"],
  },
  {
    id: "hair",
    slug: "hair-scalp",
    title: "Hair & scalp",
    state: "active",
    href: "/haircare/",
    description: "Understand scalp-serum labels and their peptide evidence.",
    subtopics: ["Scalp products", "Label ingredients", "Formulation evidence"],
    relatedIds: ["skin", "health"],
  },
  {
    id: "health",
    slug: "health-research",
    title: "Health & research",
    state: "active",
    href: "/topics/health-research/",
    description: "Read selected research briefs and understand their limits.",
    subtopics: ["Research context", "Study limitations", "Regulatory context"],
    relatedIds: ["skin", "hair"],
  },
  {
    id: "metabolism",
    slug: "metabolism-appetite",
    title: "Metabolism & appetite",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: metabolic signaling, appetite and the distinction between native peptides and drug analogues.",
    subtopics: [
      "Incretin signaling",
      "Appetite",
      "Native peptides & analogues",
    ],
    relatedIds: ["pancreatic", "mitochondrial"],
  },
  {
    id: "pancreatic",
    slug: "pancreatic-hormones",
    title: "Pancreatic hormones",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: pancreatic peptide hormones and documented molecular identities.",
    subtopics: [
      "Hormone identities",
      "Physiological context",
      "Drug analogues",
    ],
    relatedIds: ["metabolism", "digestive"],
  },
  {
    id: "growth",
    slug: "growth-hormone-signaling",
    title: "Growth hormone signaling",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: the growth-hormone axis, signaling peptides and evidence boundaries.",
    subtopics: [
      "Axis overview",
      "Releasing hormones",
      "Investigational compounds",
    ],
    relatedIds: ["metabolism", "reproduction"],
  },
  {
    id: "reproduction",
    slug: "reproduction-sexual-health",
    title: "Reproduction & sexual health",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: reproductive peptide signaling and the context of specific preparations.",
    subtopics: ["Reproductive signaling", "Native forms", "Drug analogues"],
    relatedIds: ["growth", "nervous"],
  },
  {
    id: "nervous",
    slug: "brain-nervous-system",
    title: "Brain & nervous system",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: neuropeptide identities, signaling and the limits of experimental findings.",
    subtopics: [
      "Neuropeptide families",
      "Signaling context",
      "Research models",
    ],
    relatedIds: ["pain", "reproduction"],
  },
  {
    id: "pain",
    slug: "pain-sensory-signaling",
    title: "Pain & sensory signaling",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: sensory signaling and endogenous opioid peptide families.",
    subtopics: ["Sensory signals", "Opioid peptides", "Study context"],
    relatedIds: ["nervous", "cardiovascular"],
  },
  {
    id: "digestive",
    slug: "digestive-health",
    title: "Digestive health",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: gastrointestinal peptide signaling and distinctions between biological roles and clinical evidence.",
    subtopics: [
      "Gut hormones",
      "Secretion & signaling",
      "Specific preparations",
    ],
    relatedIds: ["pancreatic", "metabolism"],
  },
  {
    id: "cardiovascular",
    slug: "cardiovascular-fluid-balance",
    title: "Cardiovascular & fluid balance",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: vasoactive peptides and peptide signals involved in fluid balance.",
    subtopics: [
      "Vasoactive signals",
      "Fluid balance",
      "Native forms & analogues",
    ],
    relatedIds: ["pain", "bone"],
  },
  {
    id: "bone",
    slug: "bone-mineral-metabolism",
    title: "Bone & mineral metabolism",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: peptide signals associated with bone and mineral metabolism.",
    subtopics: ["Hormone identities", "Mineral signaling", "Drug analogues"],
    relatedIds: ["cardiovascular", "growth"],
  },
  {
    id: "immunity",
    slug: "immunity-antimicrobial-peptides",
    title: "Immunity & antimicrobial peptides",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: defense-related peptide families and context-dependent research findings.",
    subtopics: ["Peptide families", "Host defense", "Experimental context"],
    relatedIds: ["repair", "skin"],
  },
  {
    id: "repair",
    slug: "tissue-repair-research",
    title: "Tissue repair research",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: studies discussing tissue repair, with identity and evidence limitations made explicit.",
    subtopics: ["Identity verification", "Study models", "Evidence gaps"],
    relatedIds: ["immunity", "skin"],
  },
  {
    id: "mitochondrial",
    slug: "mitochondrial-peptides",
    title: "Mitochondrial peptides",
    state: "planned",
    parentId: "health",
    description:
      "Editorial scope: mitochondrial-derived peptide research and its translational limitations.",
    subtopics: [
      "Molecular identities",
      "Cellular signaling",
      "Research models",
    ],
    relatedIds: ["metabolism", "nervous"],
  },
  {
    id: "food",
    slug: "food-derived-peptides",
    title: "Food-derived peptides",
    state: "planned",
    description:
      "Editorial scope: identified food-derived sequences, mixtures and evidence behind proposed claims.",
    subtopics: [
      "Identified sequences",
      "Hydrolysates & mixtures",
      "Evidence & claims",
    ],
    relatedIds: ["digestive", "metabolism"],
  },
] as const satisfies readonly TopicDefinition[];

export type TopicId = (typeof topicRegistry)[number]["id"];
export type ActiveTopic = Extract<
  (typeof topicRegistry)[number],
  { state: "active" }
>;
export const activeTopics = topicRegistry.filter(
  (topic): topic is ActiveTopic => topic.state === "active",
);
export const isActiveTopic = (id: string): id is ActiveTopic["id"] =>
  activeTopics.some((topic) => topic.id === id);
export const activeTopicBySlug = (slug: string) =>
  activeTopics.find((topic) => topic.slug === slug);
export const relatedActiveTopics = (topic: ActiveTopic) =>
  activeTopics.filter((other) =>
    (topic.relatedIds as readonly string[]).includes(other.id),
  );
