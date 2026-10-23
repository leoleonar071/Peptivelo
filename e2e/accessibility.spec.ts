import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("key routes and populated comparison have no automated WCAG A/AA violations", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/skincare/products/",
    "/compare/",
    "/tools/price-per-ml/",
    "/skincare/products/niod-cais3/",
  ]) {
    await page.goto(path);
    if (path === "/compare/")
      await page
        .getByRole("button", {
          name: "Try an example comparison",
          exact: true,
        })
        .click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      result.violations,
      `${path}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${path} has horizontal page overflow`,
    ).toBe(true);
  }
});
