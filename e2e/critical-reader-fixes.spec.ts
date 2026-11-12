import { expectPrivateDrafts } from "./draft-route-assertions";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("a direct reference deep link keeps the draft comparison private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/niod-cais3-vs-the-ordinary/?reference=1"]);
  });

test("a beginner reaches a sourced introduction without knowing a compound name", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "New to peptides? Start with the basics" })
    .click();
  await expect(page).toHaveURL(/\/learn\/#peptide-basics$/);
  const basics = page.locator("#peptide-basics");
  await expect(
    basics.getByRole("heading", { name: "What is a peptide?", exact: true }),
  ).toBeVisible();
  await expect(basics).toContainText("amino-acid");
  await expect(
    basics.getByRole("link", { name: "IUPAC Gold Book" }),
  ).toHaveAttribute("href", "https://goldbook.iupac.org/terms/view/P04479");
});

test("directory name, topic and format survive a product and ingredient round trip", async ({
  page,
}) => {
  await page.goto("/peptides/?topic=skin&format=Ingredient+profile");
  await page.getByLabel("Find by name").fill("Tripeptide-29");
  await page
    .getByRole("button", { name: "Apply filters", exact: true })
    .click();
  await expect(page.locator(".content-grid .discovery-card")).toHaveCount(1);
  await page.locator(".content-grid .discovery-card").click();
  const related = page.getByRole("navigation", {
    name: "Keep exploring",
    exact: true,
  });
  await related.getByRole("link", { name: /NIOD/ }).click();
  await page
    .getByRole("link", { name: "View ingredients", exact: true })
    .click();
  await page
    .locator("#product-ingredients .tags a")
    .filter({ hasText: "Tripeptide-29" })
    .click();
  await expect(page).toHaveURL(/\/skincare\/ingredients\/tripeptide-29\/\?/);
  const backToProduct = page.getByRole("link", { name: "← Back to product", exact: true });
  await expect(backToProduct).toHaveAttribute("href", /\/skincare\/products\/niod-cais3\/\?returnTo=/);
  await page.reload();
  await backToProduct.click();
  await expect(page).toHaveURL(/\/skincare\/products\/niod-cais3\/\?returnTo=/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("NIOD");
  await page
    .getByRole("link", { name: "Back to your directory", exact: false })
    .click();
  await expect(page.getByLabel("Find by name")).toHaveValue("Tripeptide-29");
  await expect(page.getByLabel("Filter by topic")).toHaveValue("skin");
  await expect(page.getByLabel("Reading format")).toHaveValue(
    "Ingredient profile",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("NIOD");
});

test("related labels never imply that NIOD lists Acetyl Hexapeptide-8", async ({
  page,
}) => {
  await page.goto("/skincare/ingredients/acetyl-hexapeptide-8/");
  const related = page.locator(".knowledge-related-list");
  await expect(related.getByRole("link", { name: /NIOD/ })).toHaveCount(0);
  await expect(related).toContainText(
    "Recorded selected label lists Acetyl Hexapeptide-8",
  );
  await expect(page.locator(".research-documentation")).toHaveCount(0);
  await expect(page.locator(".ingredient-guide")).not.toContainText(
    "this serum",
  );
});

test("sources and human checks stay distinct, and research actions precede offers", async ({
  page,
}) => {
  await page.goto("/skincare/products/niod-cais3/");
  const compare = page.getByRole("link", {
    name: "Compare recorded facts",
    exact: true,
  });
  await expect(compare).toBeVisible();
  expect(
    await compare.evaluate(
      (node) =>
        !!(
          node.compareDocumentPosition(
            document.querySelector(".product-detail")!,
          ) & Node.DOCUMENT_POSITION_FOLLOWING
        ),
    ),
  ).toBe(true);
  await page.locator(".transparency-profile > summary").click();
  await expect(page.locator(".transparency-profile")).toContainText(
    "Data extracted · Human check pending",
  );
  await expect(
    page.locator('[data-documentation-state="checked"]'),
  ).toHaveCount(0);
  await expect(
    page.locator(".documentation-sources").first(),
  ).not.toContainText("Source 1");
  await expect(page.locator(".transparency-profile")).toContainText(
    "not been appraised",
  );
});

test("name search works without JavaScript and narrow layouts remain accessible", async ({
  browser,
  baseURL,
  page,
}, info) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  const nojs = await context.newPage();
  await nojs.goto("/peptides/");
  await nojs.getByLabel("Find by name").fill("GHKCu");
  await nojs
    .getByRole("button", { name: "Apply filters", exact: true })
    .click();
  await expect(nojs.locator(".content-grid .discovery-card")).toHaveCount(1);
  await expect(nojs.locator(".content-grid")).toContainText(
    "Copper Tripeptide-1",
  );
  await context.close();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 320 : 1280,
    height: 900,
  });
  for (const theme of ["light", "dark"]) {
    await page.goto("/peptides/?qname=Acetyl");
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`critical-directory-${theme}.png`),
    });
  }
});
