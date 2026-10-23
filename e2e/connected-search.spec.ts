import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("a compact ingredient alias connects documented products, comparisons and source anchors", async ({
  page,
}) => {
  await page.goto("/search/?q=GHKCu");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Copper Tripeptide-1",
  );
  await page.getByRole("tab", { name: "Compare", exact: true }).click();
  const products = page.locator(".explore-product-grid");
  await expect(products.locator(".explore-product")).toHaveCount(2);
  await expect(products).toContainText(
    "Recorded label lists Copper Tripeptide-1",
  );
  await expect(products).not.toContainText("NIOD");
  await page.getByLabel("Other formulas", { exact: false }).check();
  await expect(products).toContainText("NIOD");
  await expect(products).toContainText("not established as equivalent");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.locator(".explore-sources > summary").first().click();
  const source = page.locator(".explore-sources a").first();
  const href = await source.getAttribute("href");
  await source.click();
  await expect(page).toHaveURL(
    new RegExp(href!.replace("/sources/", "\\/sources\\/")),
  );
  await expect(page.locator(href!.split("/").at(-1)!)).toBeVisible();
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
