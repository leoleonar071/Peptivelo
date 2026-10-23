import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("requested typography and supplied isotype preserve the existing light UI", async ({ page }, info) => {
  for (const route of ["/", "/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/", "/skincare/identify/", "/library/", "/haircare/"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("header .brand-mark img")).toHaveAttribute("src", /peptivelo-isotype/);
    await page.locator("header .brand-mark img").evaluate((el: HTMLImageElement) => el.decode());
    expect(await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Manrope");
    expect(await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Inter");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    if (route === "/") await page.screenshot({ path: info.outputPath(`brand-foundation-${info.project.name}.png`) });
  }
});
