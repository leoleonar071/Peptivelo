import { test, expect } from "@playwright/test";
import { expectPrivateDrafts } from "./draft-route-assertions";

const paths = [
  "/skincare/guides/matrixyl-3000-vs-synthe6/",
  "/skincare/guides/peptide-percentages-explained/",
];

test("citation fragments do not expose withdrawn guides or comparison readers", async ({ request }) => {
  await expectPrivateDrafts(request, [
    ...paths.map((path) => path + "#guide-sources"),
    "/compare/niod-cais3-vs-the-ordinary/#research-evidence",
  ]);
});

test("draft references stay unavailable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    for (const path of paths) {
      expect((await page.goto(path))?.status(), path).toBe(404);
      await expect(page.locator(".numbered-references")).toHaveCount(0);
    }
  } finally {
    await context.close();
  }
});
