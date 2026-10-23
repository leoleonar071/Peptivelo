import { createElement } from "react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  activeTopics,
  topicRegistry,
  activeTopicBySlug,
} from "../src/lib/topic-registry";
import { topics, footerGroups, topicForPath } from "../src/lib/site-navigation";
import {
  contentNavigation,
  type ContentEntry,
} from "../src/lib/content-navigation";
import { entriesForTopic, isPublicTopicEntry } from "../src/lib/content-topics";
import { searchIndex } from "../src/lib/search-index";
import { TopicLanding } from "../src/components/topic-landing";
import { researchRoadmap } from "../src/editorial/research-roadmap";
import {
  assessTopicReadiness,
  type KnowledgeEntityDraft,
  type TopicIntroductionDraft,
} from "../src/editorial/knowledge-model";
import { comparisonGroups } from "../src/lib/comparison-groups";

it("keeps planning out of navigation, search and published destinations without breaking the topic graph", () => {
  const ids = new Set(topicRegistry.map((topic) => topic.id));
  expect(ids.size).toBe(topicRegistry.length);
  expect(new Set(topicRegistry.map((topic) => topic.slug)).size).toBe(
    topicRegistry.length,
  );
  expect(activeTopics.map((topic) => topic.id)).toEqual([
    "skin",
    "hair",
    "health",
  ]);
  expect(topics).toEqual(activeTopics);
  for (const topic of topicRegistry) {
    if ("parentId" in topic) expect(ids.has(topic.parentId)).toBe(true);
    for (const related of topic.relatedIds)
      expect(ids.has(related), related).toBe(true);
    if (topic.state === "planned") {
      expect("href" in topic).toBe(false);
      expect(activeTopicBySlug(topic.slug)).toBeUndefined();
      expect(
        searchIndex.some((entry) => entry.href === `/topics/${topic.slug}/`),
      ).toBe(false);
      expect(
        footerGroups
          .flatMap((group) => group.links)
          .some((entry) => entry.href === `/topics/${topic.slug}/`),
      ).toBe(false);
      expect(topicForPath(`/topics/${topic.slug}/`)).toBeUndefined();
    }
  }
  expect(topicForPath("/library/retatrutide/")?.id).toBe("health");
  expect(topicForPath("/skincare/products/example/")?.id).toBe("skin");
  expect(topicForPath("/skincare-other/")).toBeUndefined();
  for (const topic of activeTopics)
    expect(entriesForTopic(contentNavigation, topic.id).length).toBeGreaterThan(
      0,
    );
});

it("shares one content identity across active topics while suppressing planned primary areas", () => {
  const shared: ContentEntry = {
    ...contentNavigation[0],
    id: "fixture:shared",
    topic: "skin",
    additionalTopics: ["hair", "metabolism"],
  };
  const hidden: ContentEntry = {
    ...shared,
    id: "fixture:planned",
    topic: "metabolism",
    additionalTopics: ["skin"],
  };
  expect(
    entriesForTopic([shared, shared, hidden], "skin").map((entry) => entry.id),
  ).toEqual([shared.id]);
  expect(entriesForTopic([shared], "hair")[0]).toBe(shared);
  expect(entriesForTopic([shared, hidden], "metabolism")).toEqual([]);
  expect(isPublicTopicEntry(hidden)).toBe(false);
});

it("renders a populated shared landing and omits empty formats and planned subtopics", () => {
  const html = renderToStaticMarkup(
    createElement(TopicLanding, {
      topic: activeTopicBySlug("health-research")!,
      entries: contentNavigation,
    }),
  );
  expect(html).toContain("Research &amp; articles");
  expect(html).toMatch(/href="\/library\/bpc-157\/?"/);
  expect(html).toMatch(/href="\/library\/retatrutide\/?"/);
  expect(html).not.toContain("<h2>Products</h2>");
  expect(html).not.toContain("<h2>Comparisons</h2>");
  expect(html).not.toContain("/topics/metabolism-appetite");
});

it("prepares one research brief for every planned area without creating public profiles or comparison groups", () => {
  const planned = topicRegistry.filter((topic) => topic.state === "planned");
  expect(planned).toHaveLength(13);
  expect(new Set(researchRoadmap.map((brief) => brief.topicId))).toEqual(
    new Set(planned.map((topic) => topic.id)),
  );
  expect(
    [...researchRoadmap].sort((a, b) => a.priority - b.priority)[0].topicId,
  ).toBe("metabolism");
  for (const brief of researchRoadmap) {
    expect(brief.stage).toBe("planned");
    expect(brief.candidateLabels.length).toBeGreaterThan(0);
    expect(
      brief.sourceWork.every((source) => source.state === "not-started"),
    ).toBe(true);
    for (const id of brief.existingContentIds)
      expect(contentNavigation.find((entry) => entry.id === id)).toBeDefined();
  }
  expect(comparisonGroups).toHaveLength(1);
});

// Explicitly synthetic contracts; these fixtures are never exported to the public app.
const documented = {
  text: "Synthetic editorial fixture",
  sourceIds: ["fixture-source"],
};
const introduction: TopicIntroductionDraft = {
  topicId: "metabolism",
  editorialReview: "checked",
  overview: documented,
  coverageAndLimits: documented,
};
const profile = (id: string): KnowledgeEntityDraft => ({
  id,
  kind: "peptide",
  name: `Fixture ${id}`,
  aliases: [],
  topicIds: ["metabolism"],
  identityVerification: "checked",
  editorialReview: "checked",
  scientificReview: "pending",
  summary: documented,
  context: documented,
  limitations: documented,
  evidence: [],
  regulatoryNotes: [],
  relationships: [],
});
const knownSourceIds = new Set(["fixture-source"]);
it("requires an introduction and two distinct sourced profiles; readiness never publishes or enables comparisons", () => {
  expect(
    assessTopicReadiness("metabolism", { profiles: [], knownSourceIds }).ready,
  ).toBe(false);
  expect(
    assessTopicReadiness("metabolism", {
      introduction,
      profiles: [profile("one")],
      knownSourceIds,
    }).ready,
  ).toBe(false);
  expect(
    assessTopicReadiness("metabolism", {
      introduction,
      profiles: [profile("one"), profile("one")],
      knownSourceIds,
    }).ready,
  ).toBe(false);
  const result = assessTopicReadiness("metabolism", {
    introduction,
    profiles: [profile("one"), profile("two")],
    knownSourceIds,
  });
  expect(result.ready).toBe(true);
  expect(result.scientificReviewPending).toBe(true);
  expect(activeTopicBySlug("metabolism-appetite")).toBeUndefined();
  expect(comparisonGroups).toHaveLength(1);
});
it("does not count unsourced aliases, missing limitations, pending identity or unknown source IDs as complete", () => {
  const first = profile("one");
  for (const second of [
    { ...profile("two"), identityVerification: "pending" as const },
    { ...profile("two"), limitations: { text: "", sourceIds: [] } },
    {
      ...profile("two"),
      aliases: [{ name: "Unverified alias", sourceIds: [] }],
    },
    {
      ...profile("two"),
      context: { text: "Unsupported fixture", sourceIds: ["missing-source"] },
    },
  ])
    expect(
      assessTopicReadiness("metabolism", {
        introduction,
        profiles: [first, second],
        knownSourceIds,
      }).ready,
    ).toBe(false);
});
