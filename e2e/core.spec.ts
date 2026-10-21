import { test, expect } from "@playwright/test";

test("picker waits for client handlers before accepting a selection", async ({
  page,
}) => {
  let release;
  const scriptsReady = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/*.js", async (route) => {
    await scriptsReady;
    await route.continue();
  });
  try {
    await page.goto("/skincare/compare/", { waitUntil: "commit" });
    const choose = page.getByRole("button", {
      name: "Choose first product",
      exact: true,
    });
    await expect(choose).toBeDisabled();
    release!();
    await expect(choose).toBeEnabled({ timeout: 15000 });
    await choose.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Search products in picker" }),
    ).toBeFocused();
  } finally {
    release!();
  }
});
test("search filters the real catalog", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Search products or ingredients" })
    .fill("NIOD");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("1 products · US catalog")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Copper Amino Isolate Serum 3 1:1 (CAIS3)",
    }),
  ).toBeVisible();
});
test("two visual selections compare automatically and prevent duplicate products", async ({
  page,
}) => {
  await page.goto("/skincare/compare/");
  await page
    .getByRole("button", { name: "Choose first product", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("ordinary");
  await page
    .getByRole("button", { name: /The Ordinary.*Multi-Peptide \+ Copper/ })
    .click();
  await expect(
    page.getByText("1 of 2 products selected", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Choose second product", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /The Ordinary.*Multi-Peptide \+ Copper/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /NIOD.*Copper Amino/ }).click();
  await expect(
    page.getByRole("heading", { name: "Your comparison, at a glance." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "We can’t compare prices yet." }),
  ).toBeVisible();
  await page.locator("summary").filter({ hasText: "Price & size" }).click();
  await expect(
    page.getByText("Not verified for this size", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remove product 2", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your comparison, at a glance." }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Choose second product", exact: true }),
  ).toBeVisible();
});
test("calculator normalizes, validates and restores share parameters", async ({
  page,
}) => {
  await page.goto("/tools/price-per-ml/");
  const prices = page.getByLabel("Price (USD)", { exact: true });
  const volumes = page.getByLabel("Volume", { exact: true });
  await prices.nth(0).fill("30");
  await volumes.nth(0).fill("30");
  await prices.nth(1).fill("45");
  await volumes.nth(1).fill("60");
  await expect(page.getByText("25.0% lower cost per mL")).toBeVisible();
  await page.getByRole("button", { name: "Share calculation" }).click();
  const url = page.url();
  await page.goto(url);
  await expect(prices.nth(0)).toHaveValue("30");
  await volumes.nth(1).fill("0");
  await expect(
    page.getByText("Enter a nonnegative price and a volume greater than zero."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Share calculation" }),
  ).toBeDisabled();
});
test("server HTML, noindex parameters, 404 and responsive layout", async ({
  page,
  request,
}) => {
  const response = await request.get(
    "/skincare/products/the-ordinary-multi-peptide-copper/",
  );
  const html = await response.text();
  expect(html).toContain("Selected label ingredients");
  expect(html).toContain('rel="canonical"');
  expect(
    (await request.get("/skincare/products/?q=copper")).headers()[
      "x-robots-tag"
    ],
  ).toContain("noindex");
  expect((await request.get("/not-in-the-atlas/")).status()).toBe(404);
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
