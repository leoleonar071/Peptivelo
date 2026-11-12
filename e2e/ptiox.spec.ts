import { test, expect } from "@playwright/test";
import { expectPrivateDrafts } from "./draft-route-assertions";

test("P-TIOX has a scoped, progressive comparison with academic disclosures", async ({
  page,
}) => {
  await expectPrivateDrafts(page.request, ["/compare/skinceuticals-ptiox-vs-the-ordinary-ha/"]);
  await page.goto("/skincare/identify/");
  await page.getByRole("searchbox").fill("P-TIOX");
  await expect(page.locator(".identify-result")).toHaveCount(1);
  await expect(page.locator(".identify-result")).toContainText("30 mL");
});
