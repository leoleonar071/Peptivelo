import type { TopicId } from "../lib/topic-registry";

// Draft contracts only. No instances are created from a name in the research backlog.
export type EntityKind = "peptide" | "ingredient" | "product" | "mixture";
export type DocumentedText = { text: string; sourceIds: readonly string[] };
export type KnowledgeEntityDraft = {
  id: string;
  kind: EntityKind;
  name: string;
  aliases: readonly { name: string; sourceIds: readonly string[] }[];
  topicIds: readonly TopicId[];
  identityVerification: "pending" | "checked";
  editorialReview: "pending" | "checked";
  scientificReview: "pending" | "reviewed";
  summary: DocumentedText;
  context: DocumentedText;
  limitations: DocumentedText;
  evidence: readonly {
    scope: "ingredient" | "formulation" | "finished-product";
    kind:
      | "manufacturer-label"
      | "in-vitro"
      | "animal-study"
      | "human-study"
      | "other";
    finding: DocumentedText;
    limitations: DocumentedText;
  }[];
  regulatoryNotes: readonly {
    jurisdiction: string;
    preparation: string;
    checkedAt: string;
    statement: DocumentedText;
  }[];
  relationships: readonly {
    kind: "contains" | "component-of" | "analogue-of";
    targetId: string;
    sourceIds: readonly string[];
  }[];
};
export type TopicIntroductionDraft = {
  topicId: TopicId;
  editorialReview: "pending" | "checked";
  overview: DocumentedText;
  coverageAndLimits: DocumentedText;
};

// Editorial readiness is not scientific approval, publication or comparison eligibility.
export function assessTopicReadiness(
  topicId: TopicId,
  input: {
    introduction?: TopicIntroductionDraft;
    profiles: readonly KnowledgeEntityDraft[];
    knownSourceIds: ReadonlySet<string>;
  },
) {
  const issues: string[] = [];
  const sourced = (value: DocumentedText) =>
    !!value.text.trim() &&
    value.sourceIds.length > 0 &&
    value.sourceIds.every((id) => input.knownSourceIds.has(id));
  const introduction = input.introduction;
  if (
    !introduction ||
    introduction.topicId !== topicId ||
    introduction.editorialReview !== "checked" ||
    !sourced(introduction.overview) ||
    !sourced(introduction.coverageAndLimits)
  )
    issues.push(
      "A source-backed, editorially checked introduction and coverage statement are required.",
    );
  const profiles = input.profiles.filter((profile) =>
    profile.topicIds.includes(topicId),
  );
  const complete = profiles.filter(
    (profile) =>
      profile.id.trim() &&
      profile.name.trim() &&
      profile.identityVerification === "checked" &&
      profile.editorialReview === "checked" &&
      [profile.summary, profile.context, profile.limitations].every(sourced) &&
      profile.aliases.every((alias) =>
        sourced({ text: alias.name, sourceIds: alias.sourceIds }),
      ) &&
      profile.relationships.every((relation) =>
        sourced({ text: relation.targetId, sourceIds: relation.sourceIds }),
      ) &&
      profile.evidence.every(
        (entry) => sourced(entry.finding) && sourced(entry.limitations),
      ) &&
      profile.regulatoryNotes.every(
        (note) =>
          note.jurisdiction.trim() &&
          note.preparation.trim() &&
          /^\d{4}-\d{2}-\d{2}$/.test(note.checkedAt) &&
          sourced(note.statement),
      ),
  );
  const completeIds = new Set(complete.map((profile) => profile.id));
  if (completeIds.size < 2)
    issues.push(
      "At least two distinct, complete and editorially checked profiles are required.",
    );
  if (new Set(profiles.map((profile) => profile.id)).size !== profiles.length)
    issues.push(
      "Resolve duplicate entity IDs before activation; shared names do not establish identity.",
    );
  return {
    ready: issues.length === 0,
    issues,
    completeProfileCount: completeIds.size,
    scientificReviewPending: complete.some(
      (profile) => profile.scientificReview === "pending",
    ),
  };
}
