import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const product = "/skincare/products/the-ordinary-multi-peptide-copper/";

test("compares two real stores for the same variant and keeps checkout unknowns visible", async ({
  page,
}, info) => {
  await page.goto(product);
  const offers = page.locator("#offers");
  await expect(offers.locator(".offer-card")).toHaveCount(2);
  const sephora = offers.locator(".offer-card").filter({
    has: page.getByRole("heading", { name: "Sephora US", exact: true }),
  });
  await expect(sephora).toContainText("$38.95 estimated");
  await expect(sephora).toContainText("Delivery estimate not confirmed");
  await expect(sephora).toContainText("1–3 business days");
  await expect(sephora).toContainText("Processing time not confirmed");
  await expect(
    sephora.getByRole("link", { name: "Check price at Sephora US" }),
  ).toHaveAttribute(
    "href",
    "https://www.sephora.com/product/buffet-copper-peptides-1-P442752",
  );
  await expect(
    sephora.getByRole("link", { name: "Check price at Sephora US" }),
  ).not.toHaveAttribute("rel", /sponsored/);
  await page.getByLabel("Sort offers", { exact: true }).selectOption("total");
  await page.getByRole("button", { name: "Update offers" }).click();
  await expect(page).toHaveURL(/offerSort=total/);
  await expect(page.locator(".offer-card").first()).toContainText("Sephora US");
  await page.reload();
  await expect(page.getByLabel("Sort offers", { exact: true })).toHaveValue(
    "total",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .locator("#offers")
    .screenshot({
      path: info.outputPath(`audit-evidence/store-comparison/offers-${info.project.name}-light.png`),
    });
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .locator("#offers")
    .screenshot({
      path: info.outputPath(`audit-evidence/store-comparison/offers-${info.project.name}-dark.png`),
    });
});

test("destination filters do not reuse US offers or claim foreign coverage", async ({
  page,
}) => {
  await page.goto(product);
  await page
    .getByLabel("Delivery destination", { exact: true })
    .selectOption("PE");
  await page.getByRole("button", { name: "Update offers" }).click();
  await expect(page).toHaveURL(/market=PE/);
  await expect(page.locator("#offers .offer-card")).toHaveCount(0);
  await expect(page.locator("#offers")).toContainText(
    "No offers recorded for this destination",
  );
  await expect(page.locator("#offers")).toContainText("PEN");
  await page.reload();
  await expect(
    page.getByLabel("Delivery destination", { exact: true }),
  ).toHaveValue("PE");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("missing variant prices and one-store coverage remain explicit", async ({
  page,
}) => {
  await page.goto("/skincare/products/cosrx-six-peptide-skin-booster-mini/");
  await expect(page.locator("#offers .offer-card")).toHaveCount(0);
  await expect(page.locator("#offers")).toContainText("No offers recorded");
  await page.goto("/skincare/products/geek-and-gorgeous-power-peptides/");
  await expect(page.locator("#offers .offer-card")).toHaveCount(1);
  await expect(page.locator("#offers")).toContainText(
    "Only one store is documented",
  );
});

test("owned records replace borrowed photos in product, catalog and scalp pages", async ({
  page,
  request,
}) => {
  const photoRequests: string[] = [];
  page.on("request", (req) => {
    if (/\/images\/products\/[^/]+\.(jpg|png)/.test(req.url()))
      photoRequests.push(req.url());
  });
  for (const route of [
    product,
    "/skincare/products/",
    "/haircare/products/the-ordinary-hair-density/",
  ]) {
    await page.goto(route);
    for (const image of await page
      .locator(".product-photo img, .hair-photo img")
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element: HTMLImageElement) => element.decode());
      await expect(image).toHaveAttribute(
        "src",
        /\/images\/products\/records\/.*\.svg$/,
      );
      await expect(image).toHaveAttribute(
        "alt",
        /product record, not a packaging photograph/,
      );
    }
  }
  expect(photoRequests).toEqual([]);
  expect(
    (await request.get("/images/products/ordinary-copper-30ml.png")).status(),
  ).toBe(404);
  await page.goto(product);
  await page.getByRole("link", { name: "Add to compare", exact: true }).click();
  await expect(page).toHaveURL(/\?a=ordinary-copper$/);
  await expect(
    page.getByText("1 of 2 products selected", { exact: true }),
  ).toBeVisible();
});

test("offer controls work without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto(product);
  await page
    .getByLabel("Delivery destination", { exact: true })
    .selectOption("CA");
  await page.getByRole("button", { name: "Update offers" }).click();
  await expect(page.locator("#offers")).toContainText("No offers recorded");
  await expect(
    page.getByLabel("Delivery destination", { exact: true }),
  ).toHaveValue("CA");
  await context.close();
});
