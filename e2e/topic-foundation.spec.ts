import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { topicRegistry, activeTopics } from "../src/lib/topic-registry";

test("planned topics stay out of public cards, menus, directory, search and sitemap", async ({
  page,
  request,
}) => {
  const plannedPaths = topicRegistry
    .filter((topic) => topic.state === "planned")
    .map((topic) => `/topics/${topic.slug}/`);
  await page.goto("/topics/");
  await expect(page.locator(".discovery-card h2")).toHaveText(
    activeTopics.map((topic) => topic.title),
  );
  for (const path of [
    "/",
    "/peptides/",
    "/search/?q=peptide",
    "/topics/health-research/",
  ]) {
    await page.goto(path);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map(
          (anchor) => new URL((anchor as HTMLAnchorElement).href).pathname,
        ),
      );
    expect(links.filter((href) => plannedPaths.includes(href))).toEqual([]);
  }
  await page.goto("/peptides/");
  await expect(page.locator("#directory-topic option")).toHaveText([
    "All topics",
    ...activeTopics.map((topic) => topic.title),
  ]);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const href of plannedPaths) expect(sitemap).not.toContain(href);
});

test("every planned area remains unavailable even by a direct URL", async ({
  request,
}) => {
  for (const topic of topicRegistry.filter(
    (topic) => topic.state === "planned",
  )) {
    const response = await request.get(`/topics/${topic.slug}/`, {
      maxRedirects: 0,
    });
    expect(response.status(), topic.id).toBe(404);
    expect(response.headers().location).toBeUndefined();
  }
  // Bespoke hubs do not acquire duplicate generic aliases.
  expect((await request.get("/topics/skin-cosmetics/")).status()).toBe(404);
  expect((await request.get("/topics/hair-scalp/")).status()).toBe(404);
});

test("the shared research landing shows only populated sections and stays usable in both themes", async ({
  page,
}, info) => {
  for (const theme of ["light", "dark"]) {
    await page.goto("/topics/health-research/");
    if ((await page.locator("html").getAttribute("data-theme")) !== theme)
      await page
        .getByRole("button", { name: `Switch to ${theme} theme` })
        .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Explore the research. Understand its limits.",
    );
    await expect(
      page
        .getByRole("region", { name: "Research & articles" })
        .locator(".discovery-card"),
    ).toHaveCount(2);
    await expect(
      page.getByRole("heading", { name: "Products", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Comparisons", exact: true }),
    ).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Subtopics" })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("link", { name: "Read the introduction →", exact: true }),
    ).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`research-${theme}.png`),
      fullPage: true,
    });
  }
  await page
    .getByRole("region", { name: "Research & articles" })
    .getByRole("link")
    .filter({ has: page.getByRole("heading", { name: /BPC-157/ }) })
    .click();
  await expect(page).toHaveURL(/\/library\/bpc-157\/$/);
  await page
    .getByRole("link", { name: "← Back to Health & research", exact: true })
    .click();
  await expect(page).toHaveURL(/\/topics\/health-research\/$/);
});
