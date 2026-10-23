import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("label guides connect a buying decision with sourced names, questions and a comparison", async ({
  page,
}, testInfo) => {
  await page.goto("/skincare/guides/");
  await page
    .getByRole("link", { name: /Matrixyl 3000 vs Matrixyl synthe/ })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Matrixyl 3000 vs Matrixyl synthe",
  );
  await expect(
    page.getByText("Draft guide — human editorial review pending", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/skincare\/guides\/matrixyl-3000-vs-synthe6\/$/,
  );
  const table = page.getByRole("table", {
    name: "Commercial systems and the peptide names to recognize",
  });
  await expect(table).toContainText("Palmitoyl Tetrapeptide-7");
  await expect(table).toContainText("Palmitoyl Tripeptide-38");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath(`label-guide-${testInfo.project.name}.png`),
    fullPage: true,
  });
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath(
      `label-guide-${testInfo.project.name}-viewport.png`,
    ),
  });
  await table.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath(`label-guide-table-${testInfo.project.name}.png`),
  });
  await page
    .getByRole("link", {
      name: "The Ordinary Matrixyl vs. Multi-Peptide + HA",
      exact: true,
    })
    .click();
  await page
    .getByRole("tab", { name: "Ingredients & price", exact: true })
    .click();
  await page.locator("#buying-notes > summary").click();
  await expect(
    page.getByRole("heading", {
      name: "Use this comparison for your decision",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Evidence", exact: true }).click();
  await expect(
    page.getByText("What does HA mean in both product names?", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("tab", { name: "Ingredients & price", exact: true })
    .click();
  await expect(
    page.locator(
      '.reader-related a[href="/skincare/guides/matrixyl-3000-vs-synthe6/"]',
    ),
  ).toBeVisible();
});

test("percentage examples stay hypothetical and every comparison exposes sources and guide links", async ({
  page,
  request,
}) => {
  await page.goto("/skincare/guides/peptide-percentages-explained/");
  await expect(
    page.getByRole("heading", {
      name: "A hypothetical example: 5% of a blend is not 5% pure peptide",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("#worked-example")).toContainText("0.1%");
  await expect(page.locator("#worked-example")).toContainText(
    "not a disclosure about any product",
  );
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const region = page.getByRole("region", {
    name: "What a label statement lets you conclude",
    exact: true,
  });
  await expect(region).toHaveAttribute("tabindex", "0");
  for (const slug of [
    "the-ordinary-multi-peptide-ha-vs-copper",
    "niod-cais3-vs-the-ordinary",
    "the-ordinary-matrixyl-vs-multi-peptide-ha",
    "the-ordinary-argireline-vs-multi-peptide-ha",
    "geek-gorgeous-power-peptides-vs-the-ordinary-ha",
  ]) {
    const response = await request.get(`/compare/${slug}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("Questions about these products");
    expect(html).toContain("Sources for this explanation");
    expect(html).toContain("/skincare/guides/peptide-percentages-explained/");
  }
  expect((await request.get("/skincare/guides/not-a-guide/")).status()).toBe(
    404,
  );
});
