import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("visual picker supports search, empty results, keyboard selection and focus restoration", async ({
  page,
}) => {
  await page.goto("/skincare/compare/");
  const trigger = page.getByRole("button", {
    name: "Choose first product",
    exact: true,
  });
  await expect(trigger).toBeEnabled();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const picker = page.getByRole("dialog");
  const search = page.getByRole("textbox", {
    name: "Search products in picker",
  });
  await expect(search).toBeFocused();
  await search.fill("not a catalog product");
  await expect(
    page.getByRole("heading", { name: "No matching products yet." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all products", exact: true })
    .click();
  await expect(search).toBeFocused();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await search.fill("ordinary");
  await search.press("ArrowDown");
  await expect(
    picker.getByRole("button", {
      name: /The Ordinary.*Multi-Peptide \+ Copper/,
    }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(picker).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Change product 1", exact: true }),
  ).toBeFocused();
  const second = page.getByRole("button", {
    name: "Choose second product",
    exact: true,
  });
  await second.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(second).toBeFocused();
});

test("shared comparisons restore immediately, disclose gaps and survive swap and reset", async ({
  page,
}) => {
  await page.goto("/skincare/compare/?a=ordinary-copper&b=niod-cais3");
  await expect(
    page.getByRole("heading", { name: "Your comparison, at a glance." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "See the label differences", exact: true })
    .click();
  await expect(page.locator("#ingredient-details")).toHaveAttribute("open", "");
  await expect(
    page.getByText("No exact matches in the selected peptide names.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Swap sides", exact: true }).click();
  await expect(page).toHaveURL(/a=niod-cais3&b=ordinary-copper/);
  await page.reload();
  await expect(
    page.locator(".compare-slot").first().getByRole("heading"),
  ).toContainText("Copper Amino Isolate");
  await page
    .getByRole("link", { name: "Check sources & gaps", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "What we cannot determine",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("#source-details .source-list a")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Choose first product", exact: true }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.has("a")).toBe(false);
  await page.goto("/skincare/compare/?a=niod-cais3&b=niod-cais3");
  await expect(
    page.getByText("1 of 2 products selected", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Choose second product", exact: true }),
  ).toBeVisible();
});
