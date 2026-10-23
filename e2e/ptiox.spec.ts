import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("P-TIOX has a scoped, progressive comparison with academic disclosures", async ({
  page,
}, testInfo) => {
  await page.goto("/compare/skinceuticals-ptiox-vs-the-ordinary-ha/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(page.locator(".reader-pair")).toContainText("$150.00");
  await expect(page.locator("#study-data")).not.toBeVisible();
  await page
    .getByRole("tab", { name: "Ingredients & price", exact: true })
    .click();
  await expect(page.locator(".visual-comparison")).toContainText("UK");
  await page.getByRole("tab", { name: "Evidence", exact: true }).click();
  await page.locator("#study-data summary").click();
  await expect(page.locator("#study-data tbody tr")).toHaveCount(2);
  await expect(page.locator("#study-data")).not.toContainText("NIOD");
  const cite = page.locator("#study-data .inline-citations a").first();
  await cite.click();
  const dialog = page.getByRole("dialog", { name: "About this reference" });
  await dialog.locator("li:visible details summary").click();
  await expect(dialog.locator("li:visible")).toContainText("L’Oréal");
  await expect(dialog.locator("li:visible")).toContainText(
    "not treated as independent",
  );
  await page.keyboard.press("Escape");
  await expect(cite).toBeFocused();
  await page.screenshot({
    path: testInfo.outputPath(`ptiox-evidence-${testInfo.project.name}.png`),
  });
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
  await page.goto("/skincare/identify/");
  await page.getByRole("searchbox").fill("P-TIOX");
  await expect(page.locator(".identify-result")).toHaveCount(1);
  await expect(page.locator(".identify-result")).toContainText("30 mL");
});
