import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  await page.goto(
    "/compare/cosrx-six-peptide-vs-the-ordinary-copper/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator("#main")).toContainText("50 mL");
  await expect(page.locator("#main")).toContainText("No COSRX price");
  const refs = page.locator(".inline-citations a");
  expect(await refs.count()).toBeGreaterThan(0);
  for (const a of await refs.all()) {
    const href = await a.getAttribute("href");
    await expect(page.locator(href!)).toHaveCount(1);
  }
});

test("library separates scopes and reveals academic references on demand", async ({
  page,
}, testInfo) => {
  await page.goto("/library/");
  await page
    .getByRole("link", { name: "New to peptides? Start here →", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Cosmetic, prescription or experimental?",
  );
  for (const slug of ["retatrutide", "bpc-157"]) {
    await page.goto(`/library/${slug}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("#library-references")).not.toHaveAttribute(
      "open",
      "",
    );
    const citation = page
      .locator(".library-answer .inline-citations a")
      .first();
    const ref = page.locator((await citation.getAttribute("href"))!);
    await citation.click();
    await expect(ref).toBeVisible();
    await expect(ref).toBeFocused();
    await expect(page.locator("#library-references")).toHaveAttribute(
      "open",
      "",
    );
    await ref.locator(".reference-returns a").first().click();
    await expect(citation).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
  await page.screenshot({ path: testInfo.outputPath("library.png") });
});
