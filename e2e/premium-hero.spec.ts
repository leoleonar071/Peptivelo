import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("premium hero at all requested widths and themes", async ({
  page,
  request,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "One matrix covers the five explicit widths.",
  );
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/");
    for (const theme of ["light", "dark"]) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme) {
        await page
          .getByRole("button", { name: `Switch to ${theme} theme` })
          .click();
      }
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator("header .brand-mark img")
        .evaluate((image: HTMLImageElement) => image.decode());
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.effect?.getTiming().iterations !== Infinity,
            )
            .map((animation) => animation.finished.catch(() => undefined)),
        ),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${theme}`,
      ).toBe(true);
      const form = page.getByRole("search", { name: "Search Peptivelo" });
      await expect(form.locator(":scope > svg")).toHaveCount(0);
      await expect(form.getByRole("button")).toHaveAccessibleName(
        "Search Peptivelo",
      );
      const shape = await form.getByRole("button").evaluate((button) => {
        const rect = button.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          radius: getComputedStyle(button).borderRadius,
          text: button.textContent,
        };
      });
      expect(shape.width).toBe(shape.height);
      expect(shape.width).toBeGreaterThanOrEqual(48);
      expect(shape.radius).toBe("50%");
      expect(shape.text).toBe("");
      await expect(page.locator(".preview-document")).toHaveCount(3);
      if (width <= 540) {
        await expect(page.getByRole("combobox")).toHaveAttribute(
          "placeholder",
          "Search Peptivelo...",
        );
        const field = await form.boundingBox();
        expect(field!.y + field!.height).toBeLessThan(960);
      }
      await page
        .locator(".home-hero")
        .screenshot({ path: `docs/premium-hero-${theme}-${width}.png` });
      expect(
        (
          await new AxeBuilder({ page })
            .include("#main")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
        `${width} ${theme}`,
      ).toEqual([]);
    }
  }
  const destinations = await page
    .locator(".preview-document, .hero-shortcuts a, .preview-query > a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  for (const href of destinations)
    expect((await request.get(href)).status(), href).toBe(200);
  expect(errors).toEqual([]);
});

test("desktop shortcut respects forms and open dialogs", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "Desktop-only shortcut.");
  await page.goto("/");
  await page.getByRole("combobox").fill("peptide");
  expect(await page.getByRole("option").count()).toBeLessThanOrEqual(7);
  await page.getByRole("combobox").press("Escape");
  await page.locator("h1").click();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("combobox")).toBeFocused();
  await page.locator("h1").click();
  await page.keyboard.press("Meta+k");
  await expect(page.getByRole("combobox")).toBeFocused();
  // Inspect cancellation without invoking the browser's own Ctrl+K address bar.
  expect(
    await page.evaluate(() => {
      const field = document.createElement("textarea");
      document.body.appendChild(field);
      field.focus();
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      field.dispatchEvent(event);
      const untouched =
        !event.defaultPrevented && document.activeElement === field;
      field.remove();
      return untouched;
    }),
  ).toBe(true);
  expect(
    await page.evaluate(() => {
      const dialog = document.createElement("dialog");
      document.body.appendChild(dialog);
      dialog.showModal();
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      });
      dialog.dispatchEvent(event);
      const untouched = !event.defaultPrevented && dialog.open;
      dialog.close();
      dialog.remove();
      return untouched;
    }),
  ).toBe(true);
});
