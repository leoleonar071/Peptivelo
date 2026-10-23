import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const comparison = "/compare/?a=ordinary-copper&b=niod-cais3";

test("ingredient explanations are readable, accessible and return keyboard focus", async ({
  page,
}, testInfo) => {
  await page.goto(comparison);
  await page.locator("#ingredient-details > summary").click();
  const trigger = page
    .getByRole("button", {
      name: "What does it do? Acetyl Hexapeptide-8",
      exact: true,
    })
    .first();
  await expect(trigger).toBeEnabled();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", {
      name: "What the evidence means",
      exact: true,
    }),
  ).toBeVisible();
  await expect(dialog).toContainText("60 Chinese participants");
  await expect(dialog).toContainText("Precautions and possible reactions");
  const bounds = await dialog.boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height + 1,
  );
  await expect(
    dialog.getByRole("link", { name: /Wang et al/ }).first(),
  ).toHaveAttribute("href", "https://pubmed.ncbi.nlm.nih.gov/23417317/");
  await page.screenshot({
    path: testInfo.outputPath(`ingredient-help-${testInfo.project.name}.png`),
  });
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("all twelve ingredient guides expose sourced explanations in server HTML", async ({
  request,
}) => {
  for (const slug of [
    "copper-tripeptide-1",
    "acetyl-hexapeptide-8",
    "tripeptide-29",
    "palmitoyl-tripeptide-1",
    "palmitoyl-tetrapeptide-7",
    "tripeptide-1-copper-acetate",
    "tripeptide-1-acetate",
    "acetyl-tetrapeptide-2",
    "palmitoyl-tripeptide-38",
    "tetrapeptide-21",
    "copper-palmitoyl-heptapeptide-14",
    "heptapeptide-15-palmitate",
  ]) {
    const response = await request.get(`/skincare/ingredients/${slug}/`);
    expect(response.status(), slug).toBe(200);
    const html = await response.text();
    expect(html, slug).toContain("Why it is used");
    expect(html, slug).toContain("What the evidence means");
    expect(html, slug).toContain("Precautions and possible reactions");
    expect(html, slug).toContain("Sources checked");
  }
});

test("full guides preserve the chosen pair and explain names without a quality ranking", async ({
  page,
}, testInfo) => {
  await page.goto(comparison);
  await page.locator("#ingredient-details > summary").click();
  await expect(page.locator('[data-comparison-row="peptides"]')).toContainText(
    "identifier, not its strength",
  );
  await page
    .getByRole("link", { name: "Full guide to Tripeptide-29", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(
    /ingredients\/tripeptide-29\/\?a=ordinary-copper&b=niod-cais3/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tripeptide-29",
  );
  await expect(
    page.getByRole("heading", { name: "Why it is used", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".ingredient-guide")).toContainText(
    "not a strength or quality score",
  );
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath(`ingredient-guide-${testInfo.project.name}.png`),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Back to your comparison", exact: true })
    .click();
  await expect(page).toHaveURL(/compare\/\?a=ordinary-copper&b=niod-cais3/);
  await expect(page.locator(".v2-glance")).toBeVisible();
  expect(
    await page.locator("body").evaluate((body) => body.style.overflow),
  ).not.toBe("hidden");
});

test("ingredient help fits 320px and the summary translates the comparison", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(comparison);
  await expect(
    page.getByRole("heading", {
      name: "At a glance",
      exact: true,
    }),
  ).toBeVisible();
  await page.locator("#ingredient-details > summary").click();
  await page
    .getByRole("button", {
      name: "What does it do? Tripeptide-29",
      exact: true,
    })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "29 does not mean stronger or better",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .getByRole("dialog")
      .evaluate((dialog) => dialog.scrollWidth <= dialog.clientWidth),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Close ingredient explanation", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
