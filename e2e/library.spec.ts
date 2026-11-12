import { expectPrivateDrafts } from "./draft-route-assertions";
import { test, expect } from "@playwright/test";

test("COSRX exact mini presentation appears in search and sourced comparisons", async ({
  page,
}) => {
  await page.goto("/skincare/identify/");
  await page.getByRole("searchbox").fill("COSRX");
  await expect(page.locator(".identify-result")).toHaveCount(1);
  await expect(page.locator(".identify-result")).toContainText("50 mL");
  await page.locator(".identify-result").click();
  await page.getByRole("button", { name: "Yes, explore this serum" }).click();
  await expect(page.locator(".identify-learn details")).toHaveCount(6);
  await expectPrivateDrafts(page.request, ["/compare/cosrx-six-peptide-vs-the-ordinary-copper/"]);
});

test("the three draft library briefs remain private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/library/peptide-categories/","/library/retatrutide/","/library/bpc-157/"]);
  });
