import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("technical evidence stays optional and distinguishes trials from assessments", async ({
  page,
}) => {
  await page.goto("/compare/niod-cais3-vs-the-ordinary/");
  const disclosure = page.locator("#study-data");
  await expect(disclosure).not.toBeVisible();
  await page.getByRole("tab", { name: "Evidence", exact: true }).click();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").click();
  const table = disclosure.getByRole("table");
  await expect(table.locator("tbody tr")).toHaveCount(6);
  await expect(table).toContainText("60 Chinese participants");
  await expect(table).toContainText("no living human participants");
  await expect(table).toContainText("2 individual case reports");
  await expect(
    table.getByText("Not applicable — evidence assessment", { exact: true }),
  ).toHaveCount(3);
  const citation = table.locator(".inline-citations a").first();
  await citation.click();
  await expect(
    page.getByRole("dialog", { name: "About this reference" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(citation).toBeFocused();
  await expect(disclosure).toHaveAttribute("open", "");
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});
