import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("find, confirm and understand a serum without implying bottle verification", async ({
  page,
}, testInfo) => {
  await page.goto("/skincare/identify/");
  const search = page.getByRole("searchbox");
  await search.fill("no such serum 123");
  await expect(
    page.getByRole("heading", { name: "No matching product yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all products" }).click();
  await expect(search).toBeFocused();
  await search.fill("copper");
  await page
    .locator(".identify-result")
    .filter({ hasText: "The Ordinary" })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.getByText("Is this your serum?")).toBeVisible();
  await page.getByRole("button", { name: "Yes, explore this serum" }).click();
  await expect(
    page.getByText("Contents & batch unverified", { exact: true }),
  ).toBeVisible();
  const detail = page.locator(".identify-learn details").first();
  await expect(detail).not.toHaveAttribute("open", "");
  await detail.locator("summary").click();
  await expect(
    detail.getByRole("heading", { name: "What does the evidence say?" }),
  ).toBeVisible();
  await expect(detail.locator(".education-sources a").first()).toHaveAttribute(
    "href",
    /^https:\/\//,
  );
  await detail.locator("summary").click();
  await page.getByText("Your bottle & batch", { exact: true }).click();
  await expect(
    page.getByText(
      "No verified batch documents are available in this profile.",
    ),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("identify-profile.png"),
    fullPage: true,
  });
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 800 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Find another product" }).click();
  await expect(search).toBeFocused();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("identify-search.png"),
    fullPage: true,
  });
});
