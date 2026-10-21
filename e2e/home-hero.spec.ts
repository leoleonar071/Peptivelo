import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["light", "dark"]) {
  test(`hero remains usable in ${theme}`, async ({ page }, info) => {
    await page.goto("/");
    if (theme === "dark") await page.getByRole("button", { name: "Switch to dark theme" }).click();
    const hero = page.locator(".home-hero");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Understand peptide skincare before you buy.");
    await expect(hero.getByRole("link", { name: "View comparison" })).toHaveAttribute("href", "/skincare/compare/niod-cais3-vs-the-ordinary/");
    await expect(hero.locator("aside")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await hero.locator("img").evaluateAll((images) => Promise.all(images.map((image) => (image as HTMLImageElement).decode())));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await hero.screenshot({ path: `docs/hero-${theme}-${info.project.name}.png` });
    const search = page.getByRole("combobox", { name: "Search a serum, brand, or ingredient" });
    await search.fill("NIOD");
    await expect(page.getByRole("option")).toHaveCount(1);
    await search.press("ArrowDown");
    await expect(page.getByRole("option")).toHaveAttribute("aria-selected", "true");
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
    await search.press("Escape");
    await expect(search).toHaveAttribute("aria-expanded", "false");
    await search.fill("zzzzzz-no-entry");
    await expect(page.getByText("No matching catalog entries.", { exact: false })).toBeVisible();
    await search.fill("NIOD");
    await search.press("ArrowDown");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/skincare\/products\/niod-cais3\//);
  });
}

test("hero search retains catalog submission and a visible narrow-screen preview", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("combobox");
  await search.fill("Matrixyl");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/skincare\/products\/\?q=Matrixyl/);
  await page.goto("/");
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(page.locator(".hero-comparison")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
