import { expect, it } from "vitest";
import { previewAuthorized } from "../src/lib/editorial-preview-auth";
import { peptideForSlug } from "../src/lib/peptides";
import { peptideSchema } from "../src/lib/peptide-schema";
import { catalog } from "../src/lib/data";
import { contentRevision } from "../src/lib/publication-policy";

it("fails closed unless explicitly enabled with a strong secret and correct credentials", () => {
  const env = {
    EDITORIAL_PREVIEW_ENABLED: "true",
    EDITORIAL_PREVIEW_TOKEN: "x".repeat(64),
  };
  const auth = `Basic ${btoa(`editor:${env.EDITORIAL_PREVIEW_TOKEN}`)}`;
  expect(previewAuthorized(auth, env)).toBe(true);
  expect(previewAuthorized(null, env)).toBe(false);
  expect(previewAuthorized(`${auth}x`, env)).toBe(false);
  expect(
    previewAuthorized(auth, { ...env, EDITORIAL_PREVIEW_ENABLED: "false" }),
  ).toBe(false);
  expect(
    previewAuthorized(auth, { ...env, EDITORIAL_PREVIEW_TOKEN: "short" }),
  ).toBe(false);
});
it("can stage GHK-Cu fields independently while retaining canonical content and binding", () => {
  const original = catalog.ingredients.find(
    (i) => i.id === "copper-tripeptide-1",
  )!;
  const before = contentRevision(original);
  const pilot = peptideForSlug("ghk-cu")!;
  const staged = peptideSchema.parse({
    ...pilot,
    tags: ["Synthetic editor test"],
    seo: { title: "Synthetic editing test", description: "Test only" },
    sections: {
      ...pilot.sections,
      overview: [{ text: "Synthetic editing test only", sourceIds: [] }],
    },
  });
  expect(staged.canonicalPath).toBe(
    "/skincare/ingredients/copper-tripeptide-1/",
  );
  expect(contentRevision(original)).toBe(before);
  expect(pilot.sections.overview).toEqual([]);
  expect(staged.status).toBe("draft");
  expect(original.education.scientificReviewPending).toBe(true);
});
