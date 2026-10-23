import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("new brands preserve size, price and volume filtering", async ({
  page,
}) => {
  await page.goto("/skincare/products/?q=Timeless");
  const card = page.locator(".product-card");
  await expect(card).toHaveCount(1);
  await expect(card).toContainText("1 US fl oz");
  await expect(card).toContainText("$28.95");
  await page.locator(".catalog-filters summary").click();
  await page
    .getByRole("spinbutton", { name: "Minimum volume (mL)" })
    .fill("29");
  await expect(card).toHaveCount(1);
  await page
    .getByRole("spinbutton", { name: "Minimum volume (mL)" })
    .fill("30");
  await expect(card).toHaveCount(0);
  await page
    .getByRole("button", { name: "Clear search and filters", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Filter products", exact: true })
    .fill("Naturium");
  await card.getByRole("heading").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Naturium",
  );
  await expect(page.locator(".detail-price")).toContainText("$25.00");
  await expect(
    page.getByRole("link", {
      name: /Naturium Multi-Peptide Advanced Serum vs/,
    }),
  ).toBeVisible();
});

test("new editorial pairs explain limits with accessible ingredient help", async ({
  page,
}, testInfo) => {
  for (const slug of [
    "naturium-multi-peptide-vs-the-ordinary-ha",
    "timeless-synthe6-vs-the-ordinary-matrixyl",
    "medik8-liquid-peptides-vs-the-ordinary-ha",
  ]) {
    await page.goto(`/compare/${slug}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await page.getByRole("tab", { name: "Evidence", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name: "What the sources tell us.",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page
    .getByRole("tab", { name: "Ingredients & price", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "What does it do? Palmitoyl sh-Hexapeptide-13 Serine SP Amide",
      exact: true,
    })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Label information");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  expect(
    await dialog.evaluate(
      (el) => el.getBoundingClientRect().right <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath(
      `catalog-expansion-help-${testInfo.project.name}.png`,
    ),
  });
});
