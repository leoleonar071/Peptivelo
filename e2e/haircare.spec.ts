import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("haircare is discoverable but separate from facial selection", async ({
  page,
}) => {
  await page.goto("/skincare/identify/");
  await page.getByRole("searchbox").fill("Hair Density");
  await expect(page.locator(".identify-result")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Looking for a scalp serum? Explore haircare" })
    .click();
  await expect(page).toHaveURL(/\/haircare\/$/);
  await page
    .getByRole("link", { name: "Understand this serum", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Multi-Peptide Serum for Hair Density",
  );
  await expect(page.locator(".hair-product-heading")).toContainText("60 mL");
  await expect(page.locator(".hair-price")).toContainText("$24.00 USD");
  await expect(page.locator(".hair-price")).toContainText("$0.40 / mL");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(
    page.getByRole("link", { name: "Visit The Ordinary", exact: true }),
  ).toHaveAttribute("href", /100434/);
});

test("hair evidence opens on demand, resolves citations and preserves study limits", async ({
  page,
}, testInfo) => {
  await page.goto("/haircare/products/the-ordinary-hair-density/");
  await page
    .locator(".hair-photo img")
    .evaluate((img: HTMLImageElement) => img.decode());
  await page.screenshot({
    path: `docs/haircare-profile-${testInfo.project.name}.png`,
  });
  const research = page.locator("#hair-research");
  await expect(research).not.toHaveAttribute("open", "");
  await research.locator("summary").click();
  await expect(research).toContainText("not proof of equivalence");
  const cite = research.locator(".inline-citations a");
  const ref = page.locator((await cite.getAttribute("href"))!);
  await cite.click();
  await expect(ref).toBeVisible();
  await expect(ref).toBeFocused();
  await ref.locator("details summary").click();
  await expect(ref).toContainText("no placebo arm");
  await expect(ref).toContainText("Different product");
  await ref.locator(".reference-returns a").first().click();
  await expect(cite).toBeFocused();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const slug of ["biotinoyl-tripeptide-1", "acetyl-tetrapeptide-3"]) {
    await page.goto(`/haircare/ingredients/${slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(
      page.getByRole("link", { name: "Back to the scalp-serum profile" }),
    ).toHaveAttribute("href", /\/haircare\/products\//);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(
    (await page.request.get("/haircare/products/not-a-real-product/")).status(),
  ).toBe(404);
});
