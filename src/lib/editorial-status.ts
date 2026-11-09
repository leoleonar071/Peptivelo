import { z } from "zod";

export const editorialStatus = z.enum([
  "draft",
  "in-review",
  "published",
  "archived",
]);
// `demo` remains supported only by the existing catalog.
export const legacyEditorialStatus = z.union([
  editorialStatus,
  z.literal("demo"),
]);
export const editorialStatusLabels = {
  draft: "Draft",
  "in-review": "In Review",
  published: "Published",
  archived: "Archived",
} as const;
