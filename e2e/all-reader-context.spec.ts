import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8")) as { comparisons: { id: string; slug: string }[] };

for (const c of catalog.comparisons.filter((c) => !["niod-vs-ordinary", "ordinary-ha-vs-copper"].includes(c.id))) {
  test(`${c.id}: three answers, scoped sources and progressive details`, async ({ page }, info) => {
    await page.goto(`/compare/${c.slug}/`);
    await expect(page.locator(".reader-takeaways h3")).toHaveText(["What is documented?", "What does it mean for your purchase?", "What has not been demonstrated?"]);
    await expect(page.locator("#research-evidence")).not.toBeVisible();
    await page.getByRole("tab", { name: "Evidence", exact: true }).click();
    if (c.id !== "ptiox-vs-ha") await expect(page.getByRole("heading", { name: "What the sources tell us.", exact: true })).toBeVisible();
    await page.locator("#evaluation-benefits summary").click();
    const citation = page.locator("#evaluation-benefits .inline-citations a").first();
    await citation.click();
    await expect(page.getByRole("dialog", { name: "About this reference" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(citation).toBeFocused();
    await expect(page.locator("#study-data tbody tr")).toHaveCount(c.id === "ptiox-vs-ha" ? 2 : 0);
    await page.getByRole("tab", { name: "Ingredients & price", exact: true }).click();
    await expect(page.locator(".visual-comparison")).toContainText("Individual amounts not verified");
    if (c.id === "cosrx-vs-ordinary") await expect(page.locator(".visual-comparison")).toContainText("Price not verified");
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (c.id === "matrixyl-vs-ha") await page.screenshot({ path: info.outputPath(`all-reader-label-${info.project.name}.png`) });
  });
}
