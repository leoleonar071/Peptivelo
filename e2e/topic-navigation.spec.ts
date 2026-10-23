import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("skin topic leads to an editorial comparison and its product profile", async ({
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
  await page.locator(".v2-editorial-links > summary").click();
  await page
    .getByRole("link")
    .filter({
      has: page.getByRole("heading", {
        name: "NIOD CAIS3 vs. The Ordinary copper peptide serum",
        exact: true,
      }),
    })
    .click();
  await expect(page).toHaveURL(
    /\/skincare\/compare\/niod-cais3-vs-the-ordinary\/$/,
  );
  await page.locator(".reader-pair .reader-photo").first().click();
  await expect(page).toHaveURL(/\/skincare\/products\//);
  await page
    .getByRole("link", { name: "← Back to Products", exact: true })
    .click();
  await expect(page).toHaveURL(/\/skincare\/products\/$/);
});

test("topic discovery connects research, learning and the filtered directory", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".discovery-card")
    .filter({
      has: page.getByRole("heading", {
        name: "Health & research",
        exact: true,
      }),
    })
    .click();
  await page
    .getByRole("link")
    .filter({ has: page.getByRole("heading", { name: /BPC-157/ }) })
    .click();
  await expect(page).toHaveURL(/\/library\/bpc-157\/$/);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .locator(".topic-menu > summary")
      .first(),
  ).toHaveAttribute("data-active", "true");
  await page
    .getByRole("link", { name: "← Back to Health & research", exact: true })
    .click();
  await expect(page).toHaveURL(/\/topics\/health-research\/$/);
  await page.goto("/learn/");
  await page
    .locator(".discovery-card")
    .filter({ has: page.getByRole("heading", { name: /percentages/ }) })
    .click();
  await expect(page).toHaveURL(
    /\/skincare\/guides\/peptide-percentages-explained\/$/,
  );
  await page.goto("/peptides/");
  await page.getByLabel("Filter by topic").selectOption("hair");
  await expect(page.locator(".discovery-card")).toHaveCount(2);
  await page.getByLabel("Filter by topic").selectOption("health");
  await expect(page.locator(".discovery-card")).toHaveCount(2);
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
    /\/skincare\/ingredients\/copper-tripeptide-1\/$/,
  );
  await expect(
    page.getByRole("link", { name: "← Back to Ingredients", exact: true }),
  ).toBeVisible();
});

test("hair navigation exposes working ingredient and product destinations", async ({
  page,
}) => {
  await page.goto("/haircare/");
  await page
    .getByRole("navigation", { name: "Hair & scalp navigation" })
    .getByRole("link", { name: "Ingredients", exact: true })
    .click();
  await page.locator("#ingredients").getByRole("link").first().click();
  await expect(page).toHaveURL(/\/haircare\/ingredients\//);
  await page
    .getByRole("link", { name: "← Back to hair ingredients", exact: true })
    .click();
  await expect(page.locator("#ingredients")).toBeInViewport();
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
    "/topics/health-research/",
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
