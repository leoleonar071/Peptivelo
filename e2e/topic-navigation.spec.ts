import { expectPrivateDrafts } from "./draft-route-assertions";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("skin topic leads to the public interactive comparison", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".discovery-card")
    .filter({
      has: page.getByRole("heading", { name: "Skin & cosmetics", exact: true }),
    })
    .click();
  await page
    .getByRole("navigation", { name: "Skin & cosmetics navigation" })
    .getByRole("link", { name: "Comparisons", exact: true })
    .click();
  await expect(page.locator('.v2-editorial-links a[href="/compare/niod-cais3-vs-the-ordinary/"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Choose a product — Product A", exact: true })).toBeVisible();
});

test("topic discovery connects research, learning and the filtered directory", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('a[href="/topics/health-research/"]')).toHaveCount(0);
  await page.goto("/learn/");
  await expect(page.locator('a[href="/skincare/guides/peptide-percentages-explained/"]')).toHaveCount(0);
  await page.goto("/peptides/");
  await expect(page.locator('#directory-topic option[value="hair"], #directory-topic option[value="health"]')).toHaveCount(0);
  await page.getByLabel("Filter by topic").selectOption("skin");
  await page
    .locator(".discovery-card")
    .filter({
      has: page.getByRole("heading", {
        name: "Copper Tripeptide-1",
        exact: true,
      }),
    })
    .click();
  await expect(page).toHaveURL(
    /\/skincare\/ingredients\/copper-tripeptide-1\/\?returnTo=/,
  );
  await expect(
    page.getByRole("link", { name: "← Back to Ingredients", exact: true }),
  ).toBeVisible();
});

test("the draft-only hair hub is unavailable", async ({ request }) => {
    await expectPrivateDrafts(request, ["/haircare/"]);
  });

test("menus work with keyboard, close on Escape and fit narrow screens", async ({
  page,
}, info) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/");
    const menu = page.locator(
      width <= 900 ? ".mobile-navigation" : ".desktop-navigation",
    );
    if (width <= 900) await menu.locator(":scope > summary").click();
    const trigger = menu.locator(".topic-menu > summary");
    await trigger.focus();
    await trigger.press("Enter");
    await expect(
      menu.getByRole("link", { name: "All topics →" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await trigger.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(menu.locator(".topic-menu")).not.toHaveAttribute("open");
    if (width <= 900) {
      await trigger.press("Escape");
      await expect(menu.locator(":scope > summary")).toBeFocused();
    }
  }
  for (const theme of ["light", "dark"]) {
    await page.goto("/peptides/");
    if ((await page.locator("html").getAttribute("data-theme")) !== theme)
      await page
        .getByRole("button", { name: `Switch to ${theme} theme` })
        .click();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`directory-${theme}.png`),
      fullPage: true,
    });
  }
});

test("new indices keep noindex and remain outside the sitemap", async ({
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const href of [
    "/topics/",
    "/learn/",
    "/peptides/",
    "/library/",
  ]) {
    const response = await request.get(href);
    expect(response.status()).toBe(200);
    expect(await response.text()).toMatch(
      /name="robots"[^>]*content="[^"]*noindex/,
    );
    expect(sitemap).not.toContain(`https://peptivelo.com${href}<`);
  }
});
