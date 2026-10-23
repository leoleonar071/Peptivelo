import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const productCount = JSON.parse(
  readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8"),
).products.filter(
  (p: { editorialStatus: string }) => p.editorialStatus === "published",
).length;

test("topic discovery leads to product records and a preselected comparison", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page
    .getByRole("region", { name: "Explore by topic" })
    .getByRole("link", { name: /Skin & cosmetics/ })
    .click();
  await page
    .getByRole("navigation", { name: "Skin & cosmetics navigation" })
    .getByRole("link", { name: "Products", exact: true })
    .click();
  const cards = page.locator(".product-card");
  await expect(
    page.getByRole("textbox", { name: "Filter products", exact: true }),
  ).toBeEnabled();
  await expect(cards).toHaveCount(productCount);
  for (const photo of await cards.locator("img").all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute(
      "alt",
      /(?:\d+ mL|1 US fl oz).*product record, not a packaging photograph/,
    );
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.screenshot({
    path: testInfo.outputPath(`ui-home-${testInfo.project.name}.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: testInfo.outputPath(`ui-home-${testInfo.project.name}-viewport.png`),
  });
  await cards
    .first()
    .getByRole("link", { name: /^Add to comparison:/ })
    .click();
  await expect(page).toHaveURL(/a=ordinary-copper/);
  await expect(
    page.getByText("1 of 2 products selected", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Choose a product — Product B", exact: true })
    .click();
  await page.getByRole("button", { name: /NIOD.*Copper Amino/ }).click();
  await expect(
    page.getByRole("heading", { name: "At a glance" }),
  ).toBeVisible();
});

test("compact navigation is keyboard operable and closes after a link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".mobile-navigation");
  await menu.locator(":scope > summary").focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open");
  await expect(menu.locator(":scope > summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await menu.locator(".topic-menu > summary").click();
  await menu.getByRole("link", { name: /Skin & cosmetics/ }).click();
  await expect(page).toHaveURL(/\/skincare\/$/);
  await expect(menu).not.toHaveAttribute("open");
});

test("catalog filters are optional and empty results can be reset directly", async ({
  page,
}) => {
  await page.goto("/skincare/products/");
  await expect(page.locator(".catalog-filters")).not.toHaveAttribute("open");
  await expect(page.locator(".product-card")).toHaveCount(productCount);
  await page
    .getByRole("textbox", { name: "Filter products", exact: true })
    .fill("not in this catalog");
  await page
    .getByRole("button", { name: "Clear search and filters", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(productCount);
  await page.locator(".catalog-filters summary").click();
  await page
    .getByRole("combobox", { name: "Brand", exact: true })
    .selectOption("niod");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".catalog-filters summary")).toContainText(
    "1 active",
  );
});
