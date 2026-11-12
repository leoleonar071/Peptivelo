import { test, expect } from "@playwright/test";
import { expectPrivateDrafts } from "./draft-route-assertions";

test("HA versus copper exposes scoped academic safety evidence", async ({ page }) => {
  await expectPrivateDrafts(page.request, ["/compare/the-ordinary-multi-peptide-ha-vs-copper/"]);
  await page.goto("/skincare/ingredients/acetyl-hexapeptide-8/");
  await expect(page.getByText("Qualified scientific review pending.", { exact: false })).toBeVisible();
  await page.locator(".ingredient-detailed > summary").click();
  await expect(page.getByText(/The 2025 safety panel/)).toContainText("not evidence of harm");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
