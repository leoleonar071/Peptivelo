import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const url = "/skincare/compare/?a=ordinary-copper&b=niod-cais3";

test("difference filtering keeps unknowns and swaps product values correctly", async ({
  page,
}) => {
  await page.goto(url);
  const matrix = page.getByRole("table", {
    name: /Peptide serum label comparison/,
  });
  await expect(matrix).toBeVisible();
  await expect(matrix.locator('[data-comparison-row="size"]')).toBeVisible();
  await expect(
    matrix.locator('[data-comparison-row="price"] td').first(),
  ).toContainText("$32.00");
  await page
    .getByRole("checkbox", { name: "Show only differences", exact: true })
    .check();
  await expect(matrix.locator('[data-comparison-row="size"]')).toHaveCount(0);
  await expect(matrix.locator('[data-comparison-row="format"]')).toHaveCount(0);
  for (const row of [
    "price",
    "unit-cost",
    "unknowns",
    "concentrations",
    "sources",
  ])
    await expect(
      matrix.locator(`[data-comparison-row="${row}"]`),
    ).toBeVisible();
  await expect(
    page.getByText("2 matching rows hidden", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Swap sides", exact: true }).click();
  await expect(
    matrix.locator('[data-comparison-row="price"] td').first(),
  ).toContainText("$93.00");
  await expect(
    matrix.locator('[data-comparison-row="price"] td').nth(1),
  ).toContainText("$32.00");
  await expect(
    page.getByRole("checkbox", { name: "Show only differences", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("checkbox", { name: "Show only differences", exact: true })
    .uncheck();
  await expect(matrix.locator('[data-comparison-row="size"]')).toBeVisible();
});

test("product headers stay in view while facts scroll and the picker remains accessible", async ({
  page,
}, testInfo) => {
  await page.goto(url);
  const matrix = page.locator(".visual-comparison");
  await matrix.locator("thead").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `docs/compare-matrix-${testInfo.project.name}-viewport.png`,
  });
  await page.screenshot({
    path: `docs/compare-matrix-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await matrix
    .locator('[data-comparison-row="peptides"]')
    .scrollIntoViewIfNeeded();
  const header = await matrix.locator("thead").boundingBox();
  expect(header!.y).toBeGreaterThanOrEqual(-1);
  expect(header!.y).toBeLessThan(5);
  await page
    .getByRole("button", { name: "Change product 1", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Change product 1", exact: true }),
  ).toBeFocused();
});

test("paired facts fit a narrow mobile screen without horizontal page scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(url);
  await expect(
    page.locator('[data-comparison-row="concentrations"]'),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const row = page.locator('[data-comparison-row="price"]');
  const cells = await row.locator("td").all();
  const left = await cells[0].boundingBox();
  const right = await cells[1].boundingBox();
  expect(Math.abs(left!.y - right!.y)).toBeLessThan(2);
  expect(right!.x).toBeGreaterThan(left!.x);
});
