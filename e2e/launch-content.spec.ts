import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("new brand product has its own photo, verified size price and related draft", async ({
  page,
}) => {
  await page.goto("/skincare/products/?q=Geek");
  const card = page.locator(".product-card");
  await expect(card).toHaveCount(1);
  await expect(card.locator("img")).toHaveAttribute(
    "src",
    "/images/products/geek-power-peptides-30ml.jpg",
  );
  await card
    .getByRole("heading", { name: "Power Peptides", exact: true })
    .getByRole("link")
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Geek & Gorgeous",
  );
  await expect(page.locator(".detail-price")).toContainText("$18.80");
  await expect(
    page.getByRole("link", { name: "View full-size product photo" }),
  ).toHaveAttribute("href", "/images/products/geek-power-peptides-30ml.jpg");
  await expect(
    page.getByRole("link", { name: /Geek & Gorgeous Power Peptides vs/ }),
  ).toBeVisible();
});

test("editorial guide explains the choice, sources and new ingredient without losing the pair", async ({
  page,
}, testInfo) => {
  await page.goto(
    "/skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/",
  );
  await expect(
    page.getByText("Draft editorial analysis — human review pending", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Do not turn 10% into a potency score",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "What we cannot tell from the label",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const editorialScan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(editorialScan.violations).toEqual([]);
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `docs/launch-editorial-${testInfo.project.name}.png`,
  });
  await page
    .getByRole("button", {
      name: "What does it do? Palmitoyl Tripeptide-38",
      exact: true,
    })
    .first()
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Palmitoyl Tripeptide-38",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Label information");
  await dialog
    .getByRole("link", { name: "Read the full ingredient guide" })
    .click();
  await expect(page).toHaveURL(
    /palmitoyl-tripeptide-38\/\?a=ordinary-matrixyl&b=ordinary-ha/,
  );
  await page.getByRole("link", { name: "Back to your comparison" }).click();
  await expect(page).toHaveURL(/compare\/\?a=ordinary-matrixyl&b=ordinary-ha/);
  const price = page.locator('[data-comparison-row="price"]');
  await expect(price.locator("td").first()).toContainText("$10.90");
  await expect(price.locator("td").nth(1)).toContainText("$19.90");
  await expect(page.locator('[data-comparison-row="usage"]')).toContainText(
    /manufacturer/i,
  );
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
    path: `docs/launch-comparison-${testInfo.project.name}.png`,
  });
});

test("all five editorial drafts render from server HTML with sources and noindex", async ({
  request,
}) => {
  for (const slug of [
    "the-ordinary-multi-peptide-ha-vs-copper",
    "niod-cais3-vs-the-ordinary",
    "the-ordinary-matrixyl-vs-multi-peptide-ha",
    "the-ordinary-argireline-vs-multi-peptide-ha",
    "geek-gorgeous-power-peptides-vs-the-ordinary-ha",
  ]) {
    const response = await request.get(`/skincare/compare/${slug}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("What we cannot tell from the label");
    expect(html).toContain("Check the original sources");
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toMatch(/name="robots"[^>]*content="[^"]*noindex/);
  }
});
