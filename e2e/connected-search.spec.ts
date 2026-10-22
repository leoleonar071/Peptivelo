import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("a compact ingredient alias connects documented products, comparisons and source anchors", async ({
  page,
}) => {
  await page.goto("/search/?q=GHKCu");
  const products = page
    .locator(".search-result-group")
    .filter({
      has: page.getByRole("heading", { level: 2, name: /^Products/ }),
    });
  await expect(products.locator(".search-document")).toHaveCount(2);
  await expect(products).toContainText(
    "Recorded label lists Copper Tripeptide-1",
  );
  await expect(products).not.toContainText("NIOD");
  const comparisons = page
    .locator(".search-result-group")
    .filter({
      has: page.getByRole("heading", { level: 2, name: /^Comparisons/ }),
    });
  await expect(comparisons.locator(".search-document")).toHaveCount(3);
  await expect(comparisons).toContainText(
    "not an ingredient-equivalence claim",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  const source = page.locator(
    'a.search-document[href="/sources/#source-cir-peptides"]',
  );
  await source.click();
  await expect(page).toHaveURL(/\/sources\/#source-cir-peptides$/);
  await expect(page.locator("#source-cir-peptides")).toBeVisible();
});

test("spelling fallback is disclosed and retains the query in the URL", async ({
  page,
}) => {
  await page.goto("/search/?q=coper%20peptides");
  await expect(page.locator(".search-document").first()).toBeVisible();
  await expect(page.locator(".search-match-reason").first()).toContainText(
    "coper → copper",
  );
  await expect(page).toHaveURL(/q=coper/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("the exact requested email is published without a false verified badge", async ({
  page,
}) => {
  await page.goto("/contact/");
  await expect(
    page.locator('main a[href="mailto:suppor@peptivelo.com"]'),
  ).toHaveText("suppor@peptivelo.com");
  await expect(page.locator("main")).not.toContainText("Email verified");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
