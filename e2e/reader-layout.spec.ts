import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("editorial reader identifies products and guides a narrow-screen decision", async ({
  page,
}, testInfo) => {
  await page.goto("/skincare/compare/niod-cais3-vs-the-ordinary/");
  await expect(page.locator(".reader-product")).toHaveCount(2);
  await expect(page.locator(".reader-takeaways > div")).toHaveCount(3);
  await expect(page.locator(".reader-caution")).toBeVisible();
  for (const img of await page.locator(".reader-product img").all())
    expect(
      await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    ).toBe(true);
  await page.screenshot({
    path: `docs/reader-layout-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.screenshot({
    path: `docs/reader-viewport-${testInfo.project.name}.png`,
  });
  const nav = page.getByRole("tablist", { name: "Comparison sections" });
  await expect(
    page.getByRole("tabpanel", { name: "Overview", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#research-evidence")).not.toBeVisible();
  await expect(page.locator(".visual-comparison")).not.toBeVisible();
  await nav.getByRole("tab", { name: "Evidence", exact: true }).click();
  await expect(page).toHaveURL(/#research-evidence$/);
  await expect
    .poll(() =>
      nav
        .getByRole("tab", { name: "Evidence", exact: true })
        .getAttribute("aria-selected"),
    )
    .toBe("true");
  await expect(page.locator("#before-you-buy")).not.toBeVisible();
  await page.locator("#evaluation-risks summary").click();
  await expect(page.locator("#evaluation-risks")).toContainText(
    "not how frequently",
  );
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await nav
    .getByRole("tab", { name: "Ingredients & price", exact: true })
    .click();
  await expect(page.locator('[data-comparison-row="peptides"]')).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});
