import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = [
  "/skincare/guides/matrixyl-3000-vs-synthe6/",
  "/skincare/guides/peptide-percentages-explained/",
];

test("pilot references resolve and keyboard return links preserve reading position", async ({
  page,
}, testInfo) => {
  for (const path of paths) {
    await page.goto(path);
    const citations = page.locator(".inline-citations a");
    await expect(page.locator(".numbered-references")).toHaveCSS(
      "list-style-type",
      "decimal",
    );
    expect(await citations.count()).toBeGreaterThan(3);
    const errors = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLAnchorElement>(
          ".inline-citations a, .reference-returns a",
        ),
      ]
        .filter((a) => !document.getElementById(a.hash.slice(1)))
        .map((a) => a.href),
    );
    expect(errors).toEqual([]);
    await citations.first().focus();
    const href = await citations.first().getAttribute("href");
    await page.keyboard.press("Enter");
    const reference = page.locator(href!);
    await expect(reference).toBeFocused();
    await reference.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(reference.locator("details")).toHaveAttribute("open", "");
    await reference.locator(".reference-returns a").first().focus();
    await page.keyboard.press("Enter");
    await expect(citations.first()).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/compare/niod-cais3-vs-the-ordinary/");
  const citation = page
    .locator(
      '.reader-takeaways .inline-citations a[href="#comparison-reference-argireline-trial"]',
    )
    .first();
  await citation.click();
  const referenceDialog = page.getByRole("dialog", {
    name: "About this reference",
  });
  await expect(referenceDialog).toBeVisible();
  const trial = page.locator("#comparison-reference-argireline-trial");
  if (!((await trial.locator("details").getAttribute("open")) === ""))
    await trial.locator("summary").click();
  await expect(trial).toContainText("60 Chinese participants");
  await expect(trial.locator(".reference-title")).toContainText(
    "The Anti-Wrinkle Efficacy of Argireline",
  );
  await expect(trial).toContainText(
    "full methods behind subscription were not reviewed",
  );
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await trial.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath(`citations-${testInfo.project.name}.png`),
  });
  await page.keyboard.press("Escape");
  await expect(citation).toBeFocused();
});

test("references, study limits and hypothetical labels exist without JavaScript", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3100" + paths[1]);
  await expect(page.locator("#worked-example .reference-kind")).toHaveText(
    "Hypothetical arithmetic",
  );
  await expect(page.locator("#worked-example .inline-citations a")).toHaveCount(
    0,
  );
  await page.locator(".inline-citations a").first().click();
  const ref = page.locator("#guide-reference-croda-matrixyl");
  await ref.locator("summary").click();
  await expect(ref).toContainText("Commercial supplier information");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("Numbered references");
    expect(html).toContain("How we evaluate sources");
    expect(html).toMatch(/name="robots"[^>]*content="[^"]*noindex/);
  }
});
