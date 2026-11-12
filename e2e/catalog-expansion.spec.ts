import { expectPrivateDrafts } from "./draft-route-assertions";
import { test, expect } from "@playwright/test";

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
  ).toHaveCount(0);
});

test("withdrawn new-brand readers cannot expose comparison details", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/naturium-multi-peptide-vs-the-ordinary-ha/","/compare/timeless-synthe6-vs-the-ordinary-matrixyl/","/compare/medik8-liquid-peptides-vs-the-ordinary-ha/"]);
  });
