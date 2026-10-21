import { it, expect } from "vitest";
import { auditReferences } from "../scripts/audit-content.mjs";

it("finds broken citations nested in ingredient explanations and evidence", () => {
  const result = auditReferences({ haircare: { ingredients: [{ evidenceSourceIds: ["missing"] }] }, catalog: { products: [{ sourceId: "label" }] } }, [{ id: "label" }]);
  expect(result.pass).toBe(false);
  expect(result.references).toBe(2);
  expect(result.issues).toEqual(["haircare.ingredients.0.evidenceSourceIds: unknown source missing"]);
});

it("rejects ambiguous source IDs even when citations resolve", () => {
  expect(auditReferences({ source: { sourceId: "label" } }, [{ id: "label" }, { id: "label" }]).pass).toBe(false);
});
