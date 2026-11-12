import { expectPrivateDrafts } from "./draft-route-assertions";
import { test, expect } from "@playwright/test";
import { topicRegistry } from "../src/lib/topic-registry";
const publicTopicTitles = ["Skin & cosmetics"];

test("planned topics stay out of public cards, menus, directory, search and sitemap", async ({
  page,
  request,
}) => {
  const plannedPaths = topicRegistry
    .filter((topic) => topic.state === "planned")
    .map((topic) => `/topics/${topic.slug}/`);
  await page.goto("/topics/");
  await expect(page.locator(".discovery-card h2")).toHaveText(
    publicTopicTitles,
  );
  for (const path of [
    "/",
    "/peptides/",
    "/search/?q=peptide",
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
    ...publicTopicTitles,
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

test("the draft-only research hub and its articles remain private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/topics/health-research/","/library/retatrutide/","/library/bpc-157/"]);
  });
