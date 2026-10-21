import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("tabs support keyboard, history, deep links and reference focus return", async ({
  page,
}, testInfo) => {
  await page.goto("/skincare/compare/niod-cais3-vs-the-ordinary/");
  const overview = page.getByRole("tab", { name: "Overview", exact: true });
  const ingredients = page.getByRole("tab", {
    name: "Ingredients & price",
    exact: true,
  });
  const evidence = page.getByRole("tab", { name: "Evidence", exact: true });
  await expect(overview).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await overview.focus();
  await page.keyboard.press("ArrowRight");
  await expect(ingredients).toBeFocused();
  await expect(page.locator(".visual-comparison")).toBeVisible();
  await page.keyboard.press("End");
  await expect(evidence).toBeFocused();
  await expect(page.locator("#research-evidence")).toBeVisible();
  await overview.click();
  await expect(page.locator("#research-evidence")).not.toBeVisible();
  await page.goBack();
  await expect(evidence).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(evidence).toHaveAttribute("aria-selected", "true");
  const cite = page.locator("#evaluation-risks .inline-citations a").first();
  const citationNumber = (await cite.innerText()).replace(/\D/g, "");
  await cite.click();
  const dialog = page.getByRole("dialog", { name: "About this reference" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".numbered-references > li:visible")).toHaveCount(
    1,
  );
  await expect(
    dialog.locator(".numbered-references > li:visible"),
  ).toHaveAttribute("value", citationNumber);
  const scan = await new AxeBuilder({ page })

    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(cite).toBeFocused();
  await expect(evidence).toHaveAttribute("aria-selected", "true");
  await overview.click();
  await page.evaluate(() =>
    window.scrollTo({
      top:
        document.querySelector(".reader-segments")!.getBoundingClientRect()
          .top +
        scrollY -
        24,
      behavior: "instant",
    }),
  );
  await page.screenshot({
    path: `docs/reader-tabs-${testInfo.project.name}.png`,
  });
});
