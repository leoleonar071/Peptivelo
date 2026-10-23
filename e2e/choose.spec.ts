import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("buying paths progressively reveal one comparison and its limits", async ({
  page,
}, info) => {
  await page.goto("/");
  await page
    .getByRole("region", { name: "Explore by topic" })
    .getByRole("link", { name: /Skin & cosmetics/ })
    .click();
  await page
    .getByRole("link", { name: "Choose by my question", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What are you looking for?",
  );
  await expect(page.locator(".choose-path[open]")).toHaveCount(0);
  await page.getByText("Expression lines", { exact: true }).click();
  await expect(page.locator(".choose-path[open]")).toHaveCount(1);
  await expect(page.locator(".choose-path[open]")).toContainText(
    "does not establish",
  );
  await page
    .getByText("Is the higher price worth it?", { exact: true })
    .click();
  await expect(page.locator(".choose-path[open]")).toHaveCount(1);
  await expect(page.locator(".choose-path[open]")).toContainText(
    "head-to-head clinical winner",
  );
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.screenshot({
    path: info.outputPath(`choose-${info.project.name}.png`),
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Explore this comparison", exact: true })
    .click();
  await expect(page).toHaveURL(/skinceuticals-ptiox-vs-the-ordinary-ha/);
});
