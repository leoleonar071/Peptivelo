import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("identifier responsive methods, search and scanner states", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Single explicit viewport matrix");
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 1280, 1024, 768, 430, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/skincare/identify/");
    for (const theme of ["light", "dark"]) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page
          .getByRole("button", { name: `Switch to ${theme} theme` })
          .click();
      await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => undefined))));
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Find your serum.",
      );
      await expect(
        page.getByRole("button", { name: "Scan barcode", exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: info.outputPath(`identifier-${width}-${theme}.png`),
        fullPage: true,
        animations: "disabled",
      });
      await page.getByRole("searchbox").fill("copper");
      await expect(page.locator(".identify-result").first()).toContainText(
        /Copper|copper/,
      );
      await page.getByRole("searchbox").fill("nothing matches 555");
      await expect(
        page.getByRole("heading", { name: "No matching product yet." }),
      ).toBeVisible();
      await page.getByRole("searchbox").fill("");
      await page
        .getByRole("button", { name: "Scan barcode", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.screenshot({
        path: info.outputPath(`scanner-${width}-${theme}.png`),
        animations: "disabled",
      });
      await page.keyboard.press("Escape");
    }
  }
  expect(errors).toEqual([]);
});
