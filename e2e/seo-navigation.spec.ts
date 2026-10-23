import { test, expect } from "@playwright/test";

test("client navigation preserves product detail, canonical and source links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .locator(".discovery-section")
    .getByRole("link")
    .filter({ has: page.getByRole("heading", { name: "Skin & cosmetics" }) })
    .click();
  await page
    .getByRole("navigation", { name: "Skin & cosmetics navigation" })
    .getByRole("link", { name: "Products", exact: true })
    .click();
  await expect(page).toHaveURL(/\/skincare\/products\/$/);
  await page
    .getByRole("heading", {
      name: "Multi-Peptide + Copper Peptides 1% Serum",
      exact: true,
    })
    .getByRole("link")
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The Ordinary",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/skincare\/products\/the-ordinary-multi-peptide-copper\/$/,
  );
  await expect(page.locator(".source-list a")).toHaveAttribute(
    "href",
    /^https:\/\/theordinary\.com/,
  );
  await expect(
    page.getByText("Label checked", { exact: false }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("SEO routes and response headers retain prelaunch protections", async ({
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("xml");
  expect(await sitemap.text()).toContain("<urlset");
  const draft = await request.get(
    "/compare/niod-cais3-vs-the-ordinary/",
  );
  expect(await draft.text()).toMatch(/name="robots"[^>]*content="[^"]*noindex/);
  const filtered = await request.get("/tools/price-per-ml/?items=malformed");
  expect(filtered.status()).toBe(200);
  expect(filtered.headers()["x-robots-tag"]).toContain("noindex");
  expect(filtered.headers()["x-content-type-options"]).toBe("nosniff");
  expect((await request.get("/")).headers()["x-powered-by"]).toBeUndefined();
});
