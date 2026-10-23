import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["light", "dark"]) {
  test(`universal hero works in ${theme}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    if (theme === "dark")
      await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Understand peptides. Look beyond the claims.",
    );
    await expect(
      page
        .locator(".discovery-section")
        .first()
        .getByRole("heading", { level: 3 }),
    ).toHaveCount(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator("header .brand-mark img")
      .evaluate((image: HTMLImageElement) => image.decode());
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => undefined)),
      ),
    );
    await page.screenshot({
      path: info.outputPath(`search-hero-${theme}.png`),
      fullPage: false,
    });
    await page
      .locator(".discovery-section")
      .first()
      .screenshot({
        path: info.outputPath(`search-discovery-${theme}.png`),
      });
    const search = page.getByRole("combobox");
    await search.fill("peptide");
    await expect(
      page.getByRole("group", { name: "Guides & articles", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Products", exact: true }),
    ).toBeVisible();
    await search.press("ArrowDown");
    await expect(page.getByRole("option").first()).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await search.press("Escape");
    await expect(search).toHaveAttribute("aria-expanded", "false");
    await search.fill("zzzzzz-no-entry");
    await expect(
      page.getByText("No matching documents.", { exact: false }),
    ).toBeVisible();
    await search.fill("What is GHK-Cu?");
    await search.press("ArrowDown");
    await search.press("Enter");
    await expect(page).toHaveURL(
      /entity=skin%3Aingredient%3Acopper-tripeptide-1/,
    );
    expect(errors).toEqual([]);
  });
}
test("all results, starter suggestions and narrow viewport work", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("combobox").fill("Matrixyl");
  await page.getByRole("combobox").press("Enter");
  await expect(page).toHaveURL(/\/search\/\?q=Matrixyl/);
  await expect(page.locator(".search-result-group")).not.toHaveCount(0);
  await page.goto("/");
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(
    page.getByRole("heading", { name: "Explore by topic", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".hero-start")
    .getByRole("link", { name: "GHK-Cu →" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Copper Tripeptide-1",
  );
});
test("search document links resolve", async ({ page, request }) => {
  await page.goto("/search/?q=peptide");
  const hrefs = await page
    .locator(".search-document")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});
