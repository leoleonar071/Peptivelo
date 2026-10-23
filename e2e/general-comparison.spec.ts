import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8")) as {
  comparisons: { slug: string; title: string }[];
};

test("general entry has global context, clear coverage and no empty scientific modes", async ({
  page,
}) => {
  await page.goto("/compare/");
  const mobile = page.viewportSize()!.width <= 900;
  const menu = page.locator(
    mobile ? ".mobile-navigation" : ".desktop-navigation",
  );
  if (mobile) await menu.locator(":scope > summary").click();
  await expect(
    menu.getByRole("link", { name: "Compare", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  if (mobile) await page.keyboard.press("Escape");
  await expect(
    page.locator("footer").getByRole("link", { name: "Compare", exact: true }),
  ).toHaveAttribute("href", "/compare/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compare with clarity.",
  );
  await expect(
    page.getByText("Currently available: facial skincare products.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Skin & cosmetics navigation" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Compare");
  await expect(
    page.getByRole("link", { name: "Explore Peptides A–Z →", exact: true }),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/compare\/$/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await page
    .getByRole("button", { name: "Choose a product — Product A", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("retatrutide");
  await expect(
    page.getByRole("heading", { name: "No matching products yet." }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
});
test("retired routes return 404 without redirects and every editorial route has its new canonical", async ({
  request,
}) => {
  for (const suffix of ["", ...catalog.comparisons.map((c) => `${c.slug}/`)]) {
    const response = await request.get(`/skincare/compare/${suffix}`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
    expect(response.headers().location).toBeUndefined();
  }
  for (const c of catalog.comparisons) {
    const response = await request.get(`/compare/${c.slug}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`/compare/${c.slug}/`);
    expect(html).toMatch(
      new RegExp(`rel="canonical" href="[^"]*/compare/${c.slug}/"`),
    );
    expect(html).not.toContain("/skincare/compare/");
  }
});
test("editorials retain topic identity while links and search use general comparison destinations", async ({
  page,
}) => {
  await page.goto("/compare/niod-cais3-vs-the-ordinary/");
  await expect(
    page.getByRole("link", { name: "Skin & cosmetics →", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Compare");
  await expect(
    page.getByRole("navigation", { name: "Skin & cosmetics navigation" }),
  ).toHaveCount(0);
  expect(await page.locator('a[href*="/skincare/compare"]').count()).toBe(0);
  await page.goto("/search/?entity=skin:product:ordinary-copper&tab=compare");
  expect(await page.locator('a[href*="/skincare/compare"]').count()).toBe(0);
});
