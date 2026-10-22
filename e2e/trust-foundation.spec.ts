import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the header serves the small approved artwork directly", async ({ page }) => {
  const originalRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("peptivelo-isotype.png")) originalRequests.push(request.url());
  });
  await page.goto("/");
  const logo = page.locator("header .brand-mark img");
  await logo.evaluate((element: HTMLImageElement) => element.decode());
  await expect(logo).toHaveAttribute("src", "/brand/peptivelo-isotype-header.webp");
  const response = await page.request.get(await logo.getAttribute("src") as string);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/webp");
  expect((await response.body()).byteLength).toBeLessThan(20_000);
  const icon = page.locator('link[rel="icon"]').first();
  const iconResponse = await page.request.get(await icon.getAttribute("href") as string);
  expect(iconResponse.ok()).toBe(true);
  expect((await iconResponse.body()).byteLength).toBeLessThan(10_000);
  expect(originalRequests).toEqual([]);
});

for (const theme of ["light", "dark"]) {
  test(`the standalone methodology link has a sufficient target in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("pv-theme", value), theme);
    await page.goto("/skincare/");
    const link = page.getByRole("link", { name: "See our methodology", exact: true });
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    const results = await new AxeBuilder({ page }).withRules(["target-size"]).analyze();
    expect(results.violations).toEqual([]);
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/methodology\/$/);
  });
}

test("privacy reflects the public host and keeps beta pages non-indexable", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page.getByRole("main")).toContainText("Cloudflare Workers");
  await expect(page.getByRole("main")).toContainText("Theme preference");
  await expect(page.getByRole("main")).toContainText("Camera and code scanning");
  await expect(page.getByRole("main")).not.toContainText("hosting provider has not yet been selected");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
