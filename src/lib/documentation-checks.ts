import { z } from "zod";
import raw from "../data/documentation-checks.json";
import type { PublicationDocument } from "./publication-policy";

export const documentationChecks = z
  .array(
    z.object({
      documentId: z.string().min(1),
      revision: z.string().min(1),
      field: z.string().min(1),
      reviewerId: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
      checkedAt: z.iso.date(),
      scope: z.string().min(1),
    }),
  )
  .parse(raw);
export function checkForField(
  document: PublicationDocument,
  field: string,
  checks = documentationChecks,
) {
  return checks.find(
    (check) =>
      check.documentId === document.id &&
      check.revision === document.revision &&
      check.field === field,
  );
}
