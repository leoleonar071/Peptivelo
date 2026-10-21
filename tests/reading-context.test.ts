import { it, expect } from "vitest";
import { supportLabels } from "../src/lib/reading-context";
import { comparisonRows } from "../src/lib/comparison";
import { products } from "../src/lib/data";

it("preserves commercial and case-report distinctions without calling them clinical trials", () => {
  expect(supportLabels["Manufacturer study summary"]).toBe("Brand-reported study");
  expect(supportLabels["Human case report"]).toBe("Case report");
  expect(supportLabels["Expert safety assessment"]).toBe("Safety assessment");
});

it("keeps missing size-specific prices explicit without changing known observations", () => {
  const a = products.find((p) => p.id === "niod-cais3")!;
  const b = products.find((p) => p.id === "ordinary-copper")!;
  const rows = comparisonRows({ ...a, id: "unrecorded-price-fixture" }, b, true);
  expect(rows.find((r) => r.id === "price")!.values[0].text).toBe("Price not verified");
  expect(rows.find((r) => r.id === "price")!.values[1].text).toContain("32.00");
  expect(rows.find((r) => r.id === "concentrations")!.values.every((v) => v.limitLabel === "Individual amounts not verified")).toBe(true);
});
