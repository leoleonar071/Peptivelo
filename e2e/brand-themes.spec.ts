import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["light", "dark"]) {
  test(`${theme} theme preserves pages, forms, source dialogs and navigation`, async ({ page }, info) => {
    await page.goto("/");
    if (theme === "dark") await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    for (const route of ["/", "/skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/", "/skincare/identify/", "/library/", "/haircare/", "/tools/price-per-ml/"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("header .brand-mark img").evaluate((el: HTMLImageElement) => el.decode());
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(scan.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })), route).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      if (route === "/" || route.includes("matrixyl-vs")) await page.screenshot({ path: `docs/brand-${theme}-${route === "/" ? "home" : "comparison"}-${info.project.name}.png` });
    }
    await page.goto("/skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/#research-evidence");
    const citation = page.locator("#evaluation-benefits .inline-citations a").first();
    await citation.click();
    await expect(page.getByRole("dialog", { name: "About this reference" })).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(citation).toBeFocused();
    await page.goto("/skincare/compare/");
    await page.getByRole("button", { name: "Choose first product", exact: true }).click();
    await page.getByRole("textbox", { name: "Search products in picker" }).fill("no matching product");
    await expect(page.getByRole("heading", { name: "No matching products yet." })).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await page.goto("/skincare/identify/");
    await page.getByRole("button", { name: "Scan a code", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Scan a Peptivelo QR" })).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe("auto");
    await page.getByRole("navigation", { name: "Main navigation" }).locator("summary").click();
    for (const name of ["Hair & scalp", "Choose by your question", "Sources"]) await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name, exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
