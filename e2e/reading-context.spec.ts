import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("source types and data gaps stay understandable in both priority readers", async ({ page }, info) => {
  for (const slug of ["niod-cais3-vs-the-ordinary", "the-ordinary-multi-peptide-ha-vs-copper"]) {
    await page.goto(`/skincare/compare/${slug}/`);
    await expect(page.locator(".support-key")).not.toBeVisible();
    await page.getByRole("tab", { name: "Evidence", exact: true }).click();
    const benefit = page.locator("#evaluation-benefits");
    await expect(benefit.locator(".evidence-support").first()).toContainText("Human ingredient study");
    await benefit.locator("summary").click();
    await expect(benefit.locator(".data-limit-inline").first()).toContainText("Different study preparation");
    await expect(benefit.locator(".evidence-support").last()).toHaveText("Editorial interpretation");
    await page.locator(".support-key summary").click();
    await expect(page.locator(".support-key")).toContainText("not a quality score");
    await page.screenshot({ path: `docs/reading-context-${slug}-${info.project.name}.png`, fullPage: true });
    await page.getByRole("tab", { name: "Ingredients & price", exact: true }).click();
    await expect(page.locator(".data-limit-inline").filter({ visible: true })).toHaveCount(2);
    await expect(page.locator(".visual-comparison")).toContainText("Individual amounts not verified");
    if (slug.startsWith("niod")) {
      await expect(page.locator(".reader-price").first()).toContainText("$93.00");
      await expect(page.locator(".visual-comparison")).toContainText("$3.10 / mL");
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    const original = page.viewportSize();
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (original) await page.setViewportSize(original);
  }
});
