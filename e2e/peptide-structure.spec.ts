import { test, expect } from "@playwright/test";

test("keeps new editorial records private and canonical profiles unique", async ({
  request,
}) => {
  for (const path of [
    "/peptides/semaglutide/",
    "/peptides/tirzepatide/",
    "/peptides/tb-500/",
    "/peptides/ghk-cu/",
    "/peptides/retatrutide/",
    "/peptides/bpc-157/",
    "/peptides/matrixyl-3000/",
    "/library/retatrutide/",
    "/library/bpc-157/",
    "/topics/metabolism-appetite/",
    "/topics/health-research/",
    "/haircare/",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
  expect(
    (await request.get("/skincare/ingredients/copper-tripeptide-1/")).status(),
  ).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/peptides/semaglutide/");
  expect(sitemap).not.toContain("/library/retatrutide/");
});

test("keeps the public directory usable at each viewport without empty topics", async ({
  page,
}) => {
  await page.goto("/peptides/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByLabel("Filter by topic")).toBeVisible();
  await expect(page.getByLabel("Filter by topic").locator("option")).toHaveText(
    ["All topics", "Skin & cosmetics"],
  );
  await page.getByLabel("Find by name").fill("GHK-Cu");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/qname=GHK-Cu/);
  await expect(
    page.locator(
      '.discovery-card[href^="/skincare/ingredients/copper-tripeptide-1/"]',
    ),
  ).toBeVisible();
  await expect(page.locator(".discovery-card")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('a[href="/peptides/semaglutide/"]')).toHaveCount(0);
  await page.goto("/topics/");
  await expect(
    page.locator('.discovery-grid a[href="/haircare/"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('.discovery-grid a[href="/topics/health-research/"]'),
  ).toHaveCount(0);
});
