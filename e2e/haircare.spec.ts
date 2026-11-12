import { expectPrivateDrafts } from "./draft-route-assertions";
import { test, expect } from "@playwright/test";

test("draft haircare stays out of facial selection and navigation", async ({
  page,
}) => {
  await page.goto("/skincare/identify/");
  await page.getByRole("searchbox").fill("Hair Density");
  await expect(page.locator(".identify-result")).toHaveCount(0);
  await expect(page.locator('a[href="/haircare/"]')).toHaveCount(0);
});

test("draft hair evidence routes remain private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/haircare/products/the-ordinary-hair-density/","/haircare/ingredients/biotinoyl-tripeptide-1/","/haircare/ingredients/acetyl-tetrapeptide-3/"]);
  });
