import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("HA versus copper exposes scoped academic safety evidence", async ({ page }, info) => {
  await page.goto("/skincare/compare/the-ordinary-multi-peptide-ha-vs-copper/");
  await expect(page.locator(".reader-status")).toContainText("Scientific review");
  await page.getByRole("tab", { name: "Evidence", exact: true }).click();
  const data = page.locator("#study-data");
  await data.locator("summary").click();
  await expect(data.locator("tbody tr")).toHaveCount(3);
  await expect(data).toContainText("0.005%");
  const citation = data.locator("tbody tr").last().locator(".inline-citations a").first();
  await citation.click();
  const dialog = page.getByRole("dialog", { name: "About this reference" });
  await expect(dialog).toContainText("0.005%");
  await page.keyboard.press("Escape");
  await expect(citation).toBeFocused();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath(`review-ha-${info.project.name}.png`), fullPage: true });
  await page.goto("/skincare/ingredients/acetyl-hexapeptide-8/");
  await expect(page.getByText("Editorial draft · Qualified scientific review pending.")).toBeVisible();
  await expect(page.getByText(/The 2025 safety panel/)).toContainText("not evidence of harm");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
