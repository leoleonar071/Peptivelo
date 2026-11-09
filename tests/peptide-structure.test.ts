import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { peptides, peptideForSlug, peptideLinks } from "../src/lib/peptides";
import { peptideSchema, editorialImageSchema } from "../src/lib/peptide-schema";
import { PeptideProfile } from "../src/components/peptide-profile";
import {
  contentRevision,
  publicationDecision,
  type PublicationDocument,
} from "../src/lib/publication-policy";
import {
  documentForPath,
  isVisiblePath,
} from "../src/lib/publication-registry";
import { contentNavigation } from "../src/lib/content-navigation";
import { searchIndex } from "../src/lib/search-index";
import sitemap from "../src/app/sitemap";
import {
  preparePublicPeptides,
  revision,
} from "../scripts/prepare-peptides.mjs";

it("retains 23 distinct identities, three canonical bindings and empty new editorial drafts", () => {
  expect(peptides).toHaveLength(23);
  expect(peptides.filter((p) => p.priority === "initial")).toHaveLength(6);
  expect(new Set(peptides.map((p) => p.canonicalPath)).size).toBe(23);
  for (const p of peptides) {
    expect(p.status).toBe("draft");
    expect(p.sources).toEqual([]);
    expect(p.regulatoryRecords).toEqual([]);
    expect(p.images).toEqual([]);
    expect(Object.values(p.sections).flat()).toEqual([]);
    if (p.existingDocumentId) {
      expect(documentForPath(p.canonicalPath)?.id).toBe(p.existingDocumentId);
    } else {
      expect(isVisiblePath(p.canonicalPath)).toBe(false);
      expect(
        contentNavigation.some((entry) => entry.href === p.canonicalPath),
      ).toBe(false);
      expect(searchIndex.some((entry) => entry.href === p.canonicalPath)).toBe(
        false,
      );
      expect(
        sitemap().some(
          (entry) => new URL(entry.url).pathname === p.canonicalPath,
        ),
      ).toBe(false);
    }
  }
  expect(peptideForSlug("ghk-cu")?.canonicalPath).toBe(
    "/skincare/ingredients/copper-tripeptide-1/",
  );
  expect(peptideForSlug("tb-500")?.identityVerification).toBe("pending");
  expect(peptideForSlug("matrixyl-3000")?.ingredientIds).toEqual([]);
  expect(peptideForSlug("argireline")?.ingredientIds).toEqual([]);
  expect(peptideLinks(peptideForSlug("ghk-cu")!).products).toHaveLength(2);
});

it("blocks draft, review and archive even at a legacy URL; requires current approvals for new profiles", () => {
  const document: PublicationDocument = {
    id: "test",
    href: "/test/",
    topic: "skin",
    status: "published",
    revision: "synthetic",
    sourceIds: [],
    requiresScientificReview: true,
    requireApprovalForVisibility: true,
  };
  const reviews = (["editorial", "scientific"] as const).map((kind) => ({
    documentId: "test",
    revision: "synthetic",
    kind,
    reviewerId: "test-reviewer",
    reviewedAt: "2026-11-09",
  }));
  expect(publicationDecision(document, [], [], true).visible).toBe(false);
  expect(publicationDecision(document, reviews, [], true).indexable).toBe(true);
  expect(
    publicationDecision({ ...document, revision: "changed" }, reviews, [], true)
      .visible,
  ).toBe(false);
  for (const status of ["draft", "in-review", "archived"] as const)
    expect(
      publicationDecision(
        { ...document, status },
        reviews,
        [document.href],
        true,
      ),
    ).toMatchObject({ visible: false, indexable: false });
});

it("does not publish empty records, unknown references, incomplete licenses or unreviewed client data", () => {
  const draft = peptideForSlug("semaglutide")!;
  expect(
    peptideSchema.safeParse({ ...draft, status: "published" }).success,
  ).toBe(false);
  expect(
    peptideSchema.safeParse({
      ...draft,
      sections: {
        ...draft.sections,
        overview: [{ text: "Synthetic test only", sourceIds: ["missing"] }],
      },
    }).success,
  ).toBe(false);
  expect(
    editorialImageSchema.safeParse({
      approval: "approved",
      originalUrl: "javascript:alert(1)",
    }).success,
  ).toBe(false);
  expect(revision(draft)).toBe(contentRevision(draft));
  const published = { ...draft, status: "published" };
  expect(preparePublicPeptides([published], [])).toEqual([]);
  const reviews = ["editorial", "scientific"].map((kind) => ({
    documentId: draft.id,
    revision: revision(published),
    kind,
    reviewerId: "test-reviewer",
    reviewedAt: "2026-11-09",
  }));
  expect(
    preparePublicPeptides([draft, { ...draft, status: "in-review" }], reviews),
  ).toEqual([]);
  expect(preparePublicPeptides([published], reviews)).toEqual([published]);
  expect(
    preparePublicPeptides([{ ...published, name: "Changed" }], reviews),
  ).toEqual([]);
});

it("omits every absent optional section and renders supplied plain text without HTML execution", () => {
  const p = peptideForSlug("tb-500")!;
  const links = { products: [], comparisons: [], related: [] };
  const empty = renderToStaticMarkup(
    createElement(PeptideProfile, { peptide: p, links }),
  );
  expect(empty).not.toContain("<h2");
  expect(empty).not.toContain("<img");
  const filled = {
    ...p,
    sections: {
      ...p.sections,
      overview: [{ text: "<script>Synthetic test</script>", sourceIds: [] }],
    },
  };
  const html = renderToStaticMarkup(
    createElement(PeptideProfile, { peptide: filled, links }),
  );
  expect(html).toContain("Overview</h2>");
  expect(html).toContain("&lt;script&gt;");
  expect(html).not.toContain("Research &amp; Evidence</h2>");
});
