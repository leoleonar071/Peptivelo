import { expect, it } from "vitest";
import raw from "../src/data/catalog.json";
import { projectPublicCatalog } from "../scripts/prepare-peptides.mjs";
import {
  editorialFingerprints,
  findPrivateContent,
} from "../scripts/audit-editorial-privacy.mjs";

it("excludes Draft and In Review label records and internal image rights from the browser projection", () => {
  const markers = [
    "EDITORIAL_DRAFT_SYNTHETIC Canary narrative that must stay private",
    "EDITORIAL_IN_REVIEW_SYNTHETIC Canary narrative that must stay private",
  ];
  const catalog = {
    ...raw,
    products: [
      ...raw.products.map((product, index) =>
        index === 0
          ? {
              ...product,
              editorialImages: [
                {
                  provenance: {
                    permissionEvidence: "SYNTHETIC_PRIVATE_RIGHTS",
                  },
                },
              ],
            }
          : product,
      ),
      ...["draft", "in-review"].map((editorialStatus, index) => ({
        ...raw.products[0],
        id: "canary-" + index,
        editorialStatus,
        description: markers[index],
      })),
    ],
  };
  const projection = JSON.stringify(projectPublicCatalog(catalog));
  expect(projection).not.toContain("EDITORIAL_DRAFT_SYNTHETIC");
  expect(projection).not.toContain("EDITORIAL_IN_REVIEW_SYNTHETIC");
  expect(projection).not.toContain("SYNTHETIC_PRIVATE_RIGHTS");
  expect(JSON.parse(projection)).not.toHaveProperty("comparisons");
});

it("detects private text in raw, escaped RSC and HTML payloads", () => {
  const fingerprints = editorialFingerprints();
  const article = fingerprints.find((entry) =>
    entry.id.startsWith("library:"),
  )!;
  expect(
    findPrivateContent(
      JSON.stringify({ sourcesContent: [article.text] }),
      fingerprints,
    ),
  ).toContain(article.id);
  const marker = [
    { id: "in-review-canary", text: "Synthetic editorial review — private" },
  ];
  expect(
    findPrivateContent(
      '1:{"text":"Synthetic editorial review \\u2014 private"}',
      marker,
    ),
  ).toEqual(["in-review-canary"]);
  expect(
    findPrivateContent(
      "<p>Synthetic editorial review &#8212; private</p>",
      marker,
    ),
  ).toEqual(["in-review-canary"]);
});
