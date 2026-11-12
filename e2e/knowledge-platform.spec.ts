import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("broad discovery preserves directory filters through a sourced profile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Understand peptides. Explore the evidence and its limits.",
  );
  await page.goto("/peptides/?topic=skin&format=Ingredient+profile&qname=Copper+Tripeptide-1");
  await expect(page.getByLabel("Filter by topic")).toHaveValue("skin");
  await expect(page.getByLabel("Reading format")).toHaveValue(
    "Ingredient profile",
  );
  await page.locator(".content-grid .discovery-card").first().click();
  await expect(page).toHaveURL(/returnTo=/);
  const profile = page.locator("details.transparency-profile");
  await profile.locator("summary").click();
  await expect(
    profile.getByText("No qualified scientific approval", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to your directory" }).click();
  await expect(page.getByLabel("Filter by topic")).toHaveValue("skin");
  await expect(page.getByLabel("Reading format")).toHaveValue(
    "Ingredient profile",
  );
  await page.goto("/peptides/?qname=unmatched-example");
  await expect(
    page.getByRole("heading", { name: "No entries in this selection yet." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Reset filters" }).click();
  await expect(
    page.locator(".content-grid .discovery-card").first(),
  ).toBeVisible();
});

test("search context survives evidence, a full profile and native history", async ({
  page,
}) => {
  await page.goto(
    "/search/?q=GHK-Cu&entity=skin%3Aingredient%3Acopper-tripeptide-1&tab=evidence&page=1",
  );
  await expect(
    page.getByRole("tab", { name: "Evidence", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("link", { name: "Read the full analysis" }).click();
  await expect(
    page.getByRole("heading", { name: "In brief", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to your exploration" }).click();
  await expect(
    page.getByRole("tab", { name: "Evidence", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.goBack();
  await expect(
    page.getByRole("tab", { name: "Evidence", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});

test("search topic and reading format survive the complete results-to-profile journey", async ({
  page,
}) => {
  const results = "/search/?q=copper&group=Products&topic=skin&format=Product+profile&page=1";
  await page.goto(results);
  await expect(
    page.getByRole("combobox", { name: "Topic", exact: true }),
  ).toHaveValue("skin");
  await expect(
    page.getByRole("combobox", { name: "Reading format", exact: true }),
  ).toHaveValue("Product profile");
  await page.locator(".search-document").first().click();
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  const profile = page.getByRole("link", { name: "Read the full profile" });
  const profileHref = await profile.getAttribute("href");
  await profile.click();
  await expect(page).toHaveURL(new URL(profileHref!, page.url()).href);
  const exploration = new URL(profileHref!, page.url()).searchParams.get("returnTo")!;
  const back = page.getByRole("link", { name: "Back to your exploration" });
  await expect(back).toHaveAttribute("href", exploration);
  await back.click();
  await expect(page).toHaveURL(new URL(exploration, page.url()).href);
  await expect(back).toHaveAttribute("href", results);
  await back.click();
  await expect(page).toHaveURL(new URL(results, page.url()).href);
  await expect(
    page.getByRole("combobox", { name: "Topic", exact: true }),
  ).toHaveValue("skin");
  await expect(
    page.getByRole("combobox", { name: "Reading format", exact: true }),
  ).toHaveValue("Product profile");
});

test("opening a shared comparison emits one completion without tracking URL text", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const target = window as typeof window & { completions: unknown[] };
    target.completions = [];
    window.addEventListener("atlas:analytics", (event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.name === "comparison_completed")
        target.completions.push(detail);
    });
  });
  await page.goto("/compare/?a=ordinary-copper&b=niod-cais3");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { completions: unknown[] }).completions
            .length,
      ),
    )
    .toBe(1);
  await expect(
    page.getByRole("heading", { name: "At a glance", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as typeof window & { completions: unknown[] }).completions,
    ),
  ).toEqual([
    { name: "comparison_completed", a: "ordinary-copper", b: "niod-cais3" },
  ]);
});

test("local events contain no raw query, URL or email and references emit once", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const target = window as typeof window & { knowledgeEvents: unknown[] };
    target.knowledgeEvents = [];
    window.addEventListener("atlas:analytics", (event) =>
      target.knowledgeEvents.push((event as CustomEvent).detail),
    );
  });
  await page.goto("/search/?q=private-person%40example.com");
  await expect(
    page.getByRole("heading", { name: "No matching documents yet." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & { knowledgeEvents: { name: string }[] }
          ).knowledgeEvents.filter(
            (event) => event.name === "search_no_results",
          ).length,
      ),
    )
    .toBe(1);
  const events = await page.evaluate(
    () =>
      (window as typeof window & { knowledgeEvents: unknown[] })
        .knowledgeEvents,
  );
  expect(JSON.stringify(events)).not.toContain("private-person");
  expect(JSON.stringify(events)).not.toContain("q=");
  await page.goto("/skincare/ingredients/acetyl-hexapeptide-8/");
  await page.locator(".ingredient-detailed > summary").click();
  await page.locator(".education-sources a").first().click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & { knowledgeEvents: { name: string }[] }
          ).knowledgeEvents.filter((event) => event.name === "reference_opened")
            .length,
      ),
    )
    .toBe(1);
});

test("internal expansion stays inaccessible and draft metadata stays noindex", async ({
  page,
  request,
}) => {
  for (const href of [
    "/topics/metabolism-appetite/",
    "/library/glp-1/",
    "/library/gip/",
  ])
    expect((await request.get(href)).status()).toBe(404);
  expect((await page.goto("/library/retatrutide/"))?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "<loc>",
  );
});

test("directory and detailed reading remain usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/peptides/?topic=skin&format=Ingredient+profile&qname=Copper+Tripeptide-1");
  await expect(page.locator(".content-grid .discovery-card")).toHaveCount(1);
  await page.locator(".content-grid .discovery-card").first().click();
  await page.locator(".transparency-profile > summary").click();
  await expect(page.locator(".documentation-fields")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to your directory" }),
  ).toBeVisible();
  await context.close();
});

test("a native menu opened during script loading stays open after hydration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  let releaseScripts: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "commit" });
    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });
    await page.locator(".mobile-navigation > summary").click();
    await page
      .locator(".mobile-navigation .topic-menu > summary")
      .press("Enter");
    const allTopics = page
      .locator(".mobile-navigation")
      .getByRole("link", { name: "All topics →" });
    await expect(allTopics).toBeVisible();
    releaseScripts();
    await expect(navigation).toHaveAttribute("data-ready", "true");
    await expect(allTopics).toBeVisible();
    await page
      .locator(".mobile-navigation .topic-menu > summary")
      .press("Escape");
    await expect(allTopics).toBeHidden();
  } finally {
    releaseScripts();
  }
});

test("documentation and discovery stay accessible in both themes", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === "mobile")
    await page.setViewportSize({ width: 320, height: 812 });
  for (const theme of ["light", "dark"]) {
    await page.goto("/");
    await page.evaluate((value) => {
      localStorage.setItem("pv-theme", value);
      document.documentElement.dataset.theme = value;
    }, theme);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`knowledge-home-${theme}.png`),
    });
    await page.goto("/skincare/ingredients/copper-tripeptide-1/");
    await page.locator(".transparency-profile > summary").click();
    await page.locator(".transparency-profile").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`knowledge-documentation-${theme}.png`),
    });
  }
});
