import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const route = "/skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/";
test("summary leads to facts, sources and distinguishable exact-product offers", async ({ page }, info) => {
  await page.goto(route);
  await page.getByRole("link", { name: "Understand the price", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Ingredients & price", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#price-comparison")).toBeFocused();
  await expect(page).toHaveURL(/#price-comparison$/);
  const offers = page.locator(".reader-buy-options .retailer-product-link");
  await expect(offers).toHaveCount(2);
  await expect(offers.nth(0)).toContainText("Matrixyl 10% + HA");
  await expect(offers.nth(1)).toContainText("Multi-Peptide + HA Serum");
  for (const offer of await offers.all()) {
    await expect(offer).toContainText("30 mL");
    await expect(offer).toHaveAttribute("target", "_blank");
  }
  await expect(offers.nth(0)).toHaveAttribute("href", /matrixyl-10-ha-serum-100431/);
  await expect(offers.nth(1)).toHaveAttribute("href", /multi-peptide-ha-serum-100613/);
  await expect(page.locator(".reader-buy-options")).toContainText("Recorded 2026-10-19");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  await page.locator("#where-to-buy").scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath(`buying-journey-${info.project.name}.png`) });
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.getByRole("link", { name: "Check the evidence", exact: true }).click();
  await expect(page.locator("#research-evidence")).toBeFocused();
  const citation = page.locator("#evaluation-benefits .inline-citations a").first();
  await citation.click();
  await page.keyboard.press("Escape");
  await expect(citation).toBeFocused();
});

test("ingredient guide returns to the same editorial pair and section", async ({ page }) => {
  await page.goto(route);
  await page.getByRole("link", { name: "See ingredient differences", exact: true }).click();
  await page.getByRole("link", { name: "Full guide to Palmitoyl Tripeptide-1", exact: true }).first().click();
  await page.getByRole("link", { name: "Back to your comparison" }).click();
  await expect(page).toHaveURL(`${route}#comparison-peptides`);
  await expect(page.locator("#comparison-peptides")).toBeVisible();
  await expect(page.locator("#comparison-peptides")).toBeFocused();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/skincare/ingredients/palmitoyl-tripeptide-1/?a=ordinary-matrixyl&b=ordinary-ha&returnTo=https%3A%2F%2Funtrusted.invalid%2F");
  await expect(page.getByRole("link", { name: "Back to your comparison" })).toHaveAttribute("href", "/skincare/compare/?a=ordinary-matrixyl&b=ordinary-ha");
});
