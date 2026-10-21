import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("priority summaries answer the three buying questions with source access", async ({ page }, info) => {
  for (const slug of ["niod-cais3-vs-the-ordinary", "the-ordinary-multi-peptide-ha-vs-copper"]) {
    await page.goto(`/skincare/compare/${slug}/`);
    const summary = page.locator(".reader-takeaways");
    await expect(summary.getByRole("heading")).toHaveText(["What is documented?", "What does it mean for your purchase?", "What has not been demonstrated?"]);
    const citation = summary.locator(".inline-citations a").first();
    await citation.click();
    await expect(page.getByRole("dialog", { name: "About this reference" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(citation).toBeFocused();
    if (slug.startsWith("niod")) {
      await expect(page.locator(".reader-price").first()).toContainText("$93.00");
      await expect(page.locator(".reader-price").first()).toContainText("2026-10-20");
      await expect(summary).not.toContainText("price remains unverified");
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: `docs/decision-summary-${slug}-${info.project.name}.png` });
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (viewport) await page.setViewportSize(viewport);
  }
});
