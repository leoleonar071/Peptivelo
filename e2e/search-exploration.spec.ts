import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("one search opens an ingredient and separates exact labels from editorial alternatives", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("combobox").fill("GHK-Cu");
  await page.getByRole("combobox").press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Copper Tripeptide-1",
  );
  await expect(
    page.getByRole("tab", { name: "Overview", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Compare", exact: true }).click();
  await expect(page.locator(".explore-product")).toHaveCount(2);
  await expect(page.locator(".explore-product-grid")).not.toContainText("NIOD");
  await expect(page.locator(".explore-product-grid")).toContainText(
    "Price unavailable",
  );
  await page.getByLabel("Other formulas", { exact: false }).check();
  await expect(page.locator(".explore-product-grid")).toContainText("NIOD");
  await expect(page.locator(".explore-product-grid")).toContainText(
    "editorial draft",
  );
  await page.getByLabel("Same peptide", { exact: false }).check();
  const buttons = page.locator(".explore-product button");
  await buttons.first().click();
  await buttons.last().click();
  const selectedURL = page.url();
  await page.reload();
  await expect(
    page.getByRole("link", { name: "Open comparison →", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Open comparison →", exact: true })
    .click();
  await expect(page).toHaveURL(/\/skincare\/compare\/\?a=.*&b=/);
  await expect(
    page.getByRole("heading", {
      name: "At a glance",
      exact: true,
    }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(selectedURL);
  await expect(
    page.getByRole("button", { name: "Remove second product", exact: true }),
  ).toBeVisible();
});

test("product search locks its reference, sorts prices and paginates four alternatives", async ({
  page,
}) => {
  await page.goto(
    "/search/?entity=skin%3Aproduct%3Aordinary-ha&q=The+Ordinary",
  );
  await expect(
    page.getByRole("tab", { name: "Compare", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".explore-selection")).toContainText("Reference");
  await expect(
    page.getByRole("button", { name: "Remove first product", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".explore-product")).toHaveCount(4);
  await page.getByLabel("Order", { exact: true }).selectOption("low");
  await expect(page).toHaveURL(/sort=low/);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.locator(".explore-product button").first().click();
  const target = await page
    .getByRole("link", { name: "Open comparison →" })
    .getAttribute("href");
  expect(target).toContain("a=ordinary-ha");
  await page
    .getByRole("button", { name: "Remove second product", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Open comparison →" }),
  ).toHaveCount(0);
});

test("research and single scalp products expose evidence without a commercial comparator", async ({
  page,
}) => {
  for (const q of ["BPC-157", "Retatrutide", "Biotinoyl Tripeptide-1"]) {
    await page.goto(`/search/?q=${encodeURIComponent(q)}`);
    await expect(
      page.getByRole("tab", { name: "Compare", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("tab", { name: "Evidence", exact: true }).click();
    await expect(
      page.locator(".explore-evidence > details").first(),
    ).not.toHaveAttribute("open");
    await page.locator(".explore-evidence > details > summary").first().click();
    await expect(
      page.getByRole("heading", { name: "Limits", exact: true }).first(),
    ).toBeVisible();
    await page.locator(".explore-sources > summary").first().click();
    await expect(page.locator(".explore-sources a").first()).toBeVisible();
  }
});

test("ambiguous queries use compact results and invalid states recover", async ({
  page,
}) => {
  await page.goto("/search/?q=copper");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Choose a result to explore.",
  );
  expect(await page.locator(".search-document").count()).toBeLessThanOrEqual(6);
  await page.getByLabel("Show", { exact: true }).selectOption("Products");
  await expect(page).toHaveURL(/group=Products/);
  await page.locator(".search-document").first().click();
  await expect(
    page.getByRole("tab", { name: "Overview", exact: true }),
  ).toBeVisible();
  await page.goto("/search/?q=GHK-Cu&entity=unknown&tab=compare&a=bad&b=bad");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Choose a result to explore.",
  );
  await page.goto("/search/?q=BPC-157&tab=compare&page=999999");
  await expect(
    page.getByRole("tab", { name: "Overview", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.goto("/search/?q=zzz-nothing-available");
  await expect(
    page.getByRole("heading", { name: "No matching documents yet." }),
  ).toBeVisible();
});

test("exploration supports keyboard tabs, mobile layout and both themes", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "One explicit viewport matrix.");
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/search/?q=GHK-Cu");
    await page.getByRole("tab", { name: "Overview", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("tab", { name: "Compare", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("tab", { name: "Compare", exact: true }),
    ).toBeFocused();
    for (const theme of ["light", "dark"]) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page
          .getByRole("button", { name: `Switch to ${theme} theme` })
          .click();
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.effect?.getTiming().iterations !== Infinity,
            )
            .map((animation) => animation.finished.catch(() => undefined)),
        ),
      );
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
        path: info.outputPath(`compare-${width}-${theme}.png`),
        fullPage: true,
      });
    }
    await page.getByRole("tab", { name: "Compare", exact: true }).focus();
    await page.keyboard.press("End");
    await expect(
      page.getByRole("tab", { name: "Evidence", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(
      page.getByRole("tab", { name: "Overview", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
  }
});
