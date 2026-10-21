import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("overview leads the label table and detailed evidence preserves scientific provenance", async ({
  page,
}, testInfo) => {
  await page.goto("/skincare/compare/niod-cais3-vs-the-ordinary/");
  await page.getByRole("tab", { name: "Evidence", exact: true }).click();
  const evaluation = page.locator("#research-evidence");
  await expect(evaluation.getByRole("heading", { level: 2 })).toHaveText(
    "Evidence, explained.",
  );
  expect(
    await page.evaluate(
      () =>
        !!(
          document
            .querySelector("#before-you-buy")!
            .compareDocumentPosition(
              document.querySelector("#comparison-result-title")!,
            ) & Node.DOCUMENT_POSITION_FOLLOWING
        ),
    ),
  ).toBe(true);
  await expect(evaluation.locator(".evaluation-card")).toHaveCount(4);
  for (const details of await evaluation.locator("details").all())
    await details.locator("summary").click();
  await expect(page.locator("#evaluation-risks")).toContainText(
    "not how frequently",
  );
  await expect(page.locator("#evaluation-risks")).toContainText("up to 1.0%");
  await expect(page.locator("#evaluation-long-term")).toContainText(
    "not evidence that these products cause",
  );
  await expect(evaluation.locator(".label-provenance")).toContainText(
    "Phenoxyethanol and Chlorphenesin",
  );
  const refs = await evaluation
    .locator(".evaluation-card .inline-citations a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(
    refs.some((href) => href?.endsWith("-ordinary") || href?.endsWith("-niod")),
  ).toBe(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await evaluation.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.screenshot({
    path: `docs/critical-evidence-${testInfo.project.name}.png`,
  });
});
