import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const url = "/compare/?a=ordinary-copper&b=niod-cais3";
test("difference filtering preserves essentials and swapped values", async ({
  page,
}) => {
  await page.goto(url);
  for (const id of [
    "product-details",
    "pricing-details",
    "brand-claims",
    "source-details",
  ])
    await page.locator(`#${id} > summary`).click();
  const matrix = page.locator(".v2-details");
  await expect(
    matrix.locator('[data-comparison-row="price"] td').first(),
  ).toContainText("$32.00");
  await page
    .getByRole("checkbox", { name: "Show differences only", exact: true })
    .check();
  for (const id of ["size", "format", "market"])
    await expect(matrix.locator(`[data-comparison-row="${id}"]`)).toHaveCount(
      0,
    );
  for (const id of [
    "price",
    "unit-cost",
    "unknowns",
    "concentrations",
    "sources",
  ])
    await expect(matrix.locator(`[data-comparison-row="${id}"]`)).toBeVisible();
  await page.getByRole("button", { name: "Swap sides", exact: true }).click();
  await expect(
    matrix.locator('[data-comparison-row="price"] td').first(),
  ).toContainText("$93.00");
  await expect(
    page.getByRole("checkbox", { name: "Show differences only", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("checkbox", { name: "Show differences only", exact: true })
    .uncheck();
  await expect(matrix.locator('[data-comparison-row="size"]')).toBeVisible();
});
test("labelled product identities and picker remain accessible after expanding facts", async ({
  page,
}) => {
  await page.goto(url);
  await page.locator("#ingredient-details > summary").click();
  await page.locator("#comparison-peptides").scrollIntoViewIfNeeded();
  await expect(
    page.locator("#comparison-peptides .v2-cell-identity"),
  ).toHaveCount(2);
  await page
    .getByRole("button", { name: "Change product A", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Change product A", exact: true }),
  ).toBeFocused();
});
test("mobile price pairs align while long values stack with A/B labels", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(url);
  await page.locator("#pricing-details > summary").click();
  await page.locator("#brand-claims > summary").click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const cells = page.locator('.v2-details [data-comparison-row="price"] td');
  const left = await cells.nth(0).boundingBox();
  const right = await cells.nth(1).boundingBox();
  expect(Math.abs(left!.y - right!.y)).toBeLessThan(2);
  expect(right!.x).toBeGreaterThan(left!.x);
  const long = page.locator(
    '.v2-details [data-comparison-row="concentrations"] td',
  );
  expect((await long.nth(1).boundingBox())!.y).toBeGreaterThan(
    (await long.nth(0).boundingBox())!.y,
  );
});
