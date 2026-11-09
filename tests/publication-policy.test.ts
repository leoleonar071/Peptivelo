import { expect, it } from "vitest";
import {
  contentRevision,
  publicationDecision,
  type PublicationDocument,
  type PublicationReview,
} from "../src/lib/publication-policy";
import {
  publicationDocuments,
  policyForPath,
  documentForPath,
} from "../src/lib/publication-registry";
import { contentNavigation } from "../src/lib/content-navigation";
import { searchIndex } from "../src/lib/search-index";
import { transparencyForPath } from "../src/lib/transparency";
import {
  discoveryReturn,
  withDiscoveryReturn,
} from "../src/lib/discovery-context";
import { assessTopicActivation } from "../src/editorial/knowledge-model";
import {
  metabolismIntroduction,
  metabolismProfiles,
  metabolismSources,
  retatrutideUpdateDraft,
} from "../src/editorial/metabolism-batch";

const document: PublicationDocument = {
  id: "fixture",
  href: "/library/fixture/",
  topic: "health",
  status: "published",
  revision: contentRevision({
    summary: "Synthetic fixture",
    source: { checkedAt: "2026-11-08" },
  }),
  sourceIds: ["fixture-source"],
  requiresScientificReview: true,
};
const review = (kind: PublicationReview["kind"]): PublicationReview => ({
  documentId: document.id,
  revision: document.revision,
  kind,
  reviewerId: "synthetic-test-reviewer",
  reviewedAt: "2026-11-08",
});
it("requires current-version editorial AND scientific approval, plus the site switch", () => {
  expect(publicationDecision(document, [], [], true).indexable).toBe(false);
  expect(
    publicationDecision(document, [review("editorial")], [], true).indexable,
  ).toBe(false);
  const reviews = [review("editorial"), review("scientific")];
  expect(publicationDecision(document, reviews, [], true).indexable).toBe(true);
  expect(publicationDecision(document, reviews, [], false).indexable).toBe(
    false,
  );
  expect(
    publicationDecision(
      { ...document, status: "draft" },
      reviews,
      [document.href],
      true,
    ).indexable,
  ).toBe(false);
  expect(
    publicationDecision({ ...document, indexing: "never" }, reviews, [], true)
      .indexable,
  ).toBe(false);
  const changed = {
    ...document,
    revision: contentRevision({
      summary: "Synthetic fixture",
      source: { checkedAt: "2026-11-09" },
    }),
  };
  expect(
    publicationDecision(changed, reviews, [], true).editorialReviewed,
  ).toBe(false);
  expect(
    publicationDecision(changed, reviews, [], true).scientificReviewed,
  ).toBe(false);
});
it("keeps all drafts internal including legacy URLs", () => {
  const draft = { ...document, status: "draft" as const };
  expect(publicationDecision(draft, [], [], true).visible).toBe(false);
  expect(publicationDecision(draft, [], [draft.href], true).visible).toBe(
    false,
  );
  expect(publicationDecision(draft, [], [draft.href], true).promotable).toBe(
    false,
  );
  expect(
    publicationDecision(
      { ...document, topic: "metabolism" },
      [],
      [document.href],
      true,
    ).visible,
  ).toBe(false);
  expect(policyForPath("/library/bpc-157/")?.visible).toBe(false);
  expect(policyForPath("/library/glp-1/")).toBeUndefined();
});
it("does not infer human review from published status or an absent legacy flag", () => {
  expect(publicationDocuments.length).toBeGreaterThan(30);
  for (const item of publicationDocuments) {
    expect(policyForPath(item.href, true)?.indexable).toBe(false);
    expect(policyForPath(item.href)?.scientificReviewed).toBe(false);
  }
  expect(
    contentNavigation.every((entry) => policyForPath(entry.href)?.visible),
  ).toBe(true);
  expect(searchIndex.every((entry) => policyForPath(entry.href)?.visible)).toBe(
    true,
  );
  expect(
    documentForPath("/skincare/ingredients/copper-tripeptide-1/")
      ?.requiresScientificReview,
  ).toBe(true);
  const fields = transparencyForPath(
    "/skincare/products/cosrx-six-peptide-skin-booster-mini/",
  );
  expect(
    fields.find((field) => field.label === "Price observation")?.state,
  ).toBe("not-reviewed");
  expect(
    fields.find((field) => field.label === "Scientific review")?.state,
  ).toBe("not-reviewed");
  expect(contentRevision({ a: 1, b: [2] })).toBe(
    contentRevision({ b: [2], a: 1 }),
  );
});
it("retains safe discovery filters and rejects external, nested and malformed returns", () => {
  const source =
    "/search/?q=GHK-Cu&entity=skin%3Aingredient%3Acopper-tripeptide-1&tab=compare&a=ordinary-copper&b=niod-cais3&page=2&topic=skin";
  const href = withDiscoveryReturn("/skincare/products/niod-cais3/", source);
  expect(
    new URL(href, "https://test.invalid").searchParams.get("returnTo"),
  ).toBe(source);
  expect(
    discoveryReturn("/peptides/?topic=hair&format=Ingredient+profile"),
  ).toContain("topic=hair");
  for (const value of [
    "https://evil.example/search/",
    "//evil.example/search/",
    "/contact/",
    "/search/\\evil",
    "javascript:alert(1)",
  ])
    expect(discoveryReturn(value)).toBeUndefined();
  expect(
    discoveryReturn(
      "/search/?q=test&returnTo=https://evil.example&token=private",
    ),
  ).toBe("/search/?q=test");
  const parent =
    "/search/?q=copper&group=Products&topic=skin&format=Product+profile&page=2";
  const exploration = withDiscoveryReturn(
    "/search/?q=copper&entity=skin%3Aproduct%3Aniod-cais3&tab=evidence",
    parent,
  );
  const profile = withDiscoveryReturn(
    "/skincare/products/niod-cais3/",
    exploration,
  );
  const restored = new URL(profile, "https://test.invalid").searchParams.get(
    "returnTo",
  )!;
  expect(
    new URL(restored, "https://test.invalid").searchParams.get("returnTo"),
  ).toBe(parent);
});
it("prepares sourced metabolism drafts without exposing or approving a new topic", () => {
  const ids = new Set(metabolismSources.map((source) => source.id));
  expect(metabolismProfiles).toHaveLength(2);
  for (const profile of metabolismProfiles) {
    expect(profile.identityVerification).toBe("checked");
    expect(profile.editorialReview).toBe("pending");
    expect(profile.scientificReview).toBe("pending");
    for (const text of [profile.summary, profile.context, profile.limitations])
      expect(
        text.sourceIds.every((id) =>
          ids.has(id as (typeof metabolismSources)[number]["id"]),
        ),
      ).toBe(true);
    expect(searchIndex.some((entry) => entry.name === profile.name)).toBe(
      false,
    );
  }
  expect(
    assessTopicActivation("metabolism", {
      introduction: metabolismIntroduction,
      profiles: metabolismProfiles,
      knownSourceIds: ids,
    }).ready,
  ).toBe(false);
  expect(retatrutideUpdateDraft.status).toBe("internal-draft");
});
