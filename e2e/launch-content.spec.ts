import { expectPrivateDrafts } from "./draft-route-assertions";
import { test, expect } from "@playwright/test";

test("new brand product has its own record, verified size price and related draft", async ({
  page,
}) => {
  await page.goto("/skincare/products/?q=Geek");
  const card = page.locator(".product-card");
  await expect(card).toHaveCount(1);
  await expect(card.locator("img")).toHaveAttribute(
    "src",
    "/images/products/records/geek-power-peptides.svg",
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
    page.getByRole("link", { name: "View product identification record" }),
  ).toHaveAttribute("href", "/images/products/records/geek-power-peptides.svg");
  await expect(
    page.getByRole("link", { name: /Geek & Gorgeous Power Peptides vs/ }),
  ).toHaveCount(0);
});

test("the draft comparison remains unavailable", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/"]);
  });

test("the five original comparison drafts remain private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/the-ordinary-multi-peptide-ha-vs-copper/","/compare/niod-cais3-vs-the-ordinary/","/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/","/compare/the-ordinary-argireline-vs-multi-peptide-ha/","/compare/geek-gorgeous-power-peptides-vs-the-ordinary-ha/"]);
  });
