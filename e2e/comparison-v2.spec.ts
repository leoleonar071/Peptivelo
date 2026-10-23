import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const path = "/compare/";
const pair = `${path}?a=ordinary-copper&b=niod-cais3`;
const choose = (letter: "A" | "B") => `Choose a product — Product ${letter}`;

test("the route error view resets a local error state without losing the comparison URL", async ({
  page,
}) => {
  // Test-only React observer: exercise the real Next route boundary and its reset
  // without a production test endpoint or an invented network failure.
  await page.addInitScript(() => {
    type Node = {
      child?: Node;
      sibling?: Node;
      stateNode?: {
        state?: { error?: unknown; previousPathname?: unknown };
        setState: (state: { error: Error }) => void;
      };
    };
    const host = window as unknown as {
      __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown;
      __comparisonBoundary?: Node["stateNode"];
    };
    host.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true,
      inject: () => 1,
      onCommitFiberUnmount: () => {},
      onCommitFiberRoot: (_id: number, root: { current: Node }) => {
        const visit = (node?: Node) => {
          if (!node) return;
          if (
            node.stateNode?.state &&
            "previousPathname" in node.stateNode.state &&
            "error" in node.stateNode.state
          )
            host.__comparisonBoundary = node.stateNode;
          visit(node.child);
          visit(node.sibling);
        };
        visit(root.current);
      },
    };
  });
  await page.goto(pair);
  await expect(
    page.getByRole("button", { name: "Swap sides", exact: true }),
  ).toBeEnabled();
  await page.evaluate(() => {
    const host = window as unknown as {
      __comparisonBoundary?: { setState: (state: { error: Error }) => void };
    };
    if (!host.__comparisonBoundary)
      throw new Error("Route boundary observer unavailable");
    host.__comparisonBoundary.setState({
      error: new Error("Injected local comparison render state"),
    });
  });
  await expect(
    page.getByRole("heading", { name: "We couldn’t load this view." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "At a glance", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(pair);
});

test("product profiles preserve A and sharing copies the current pair", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) =>
          localStorage.setItem("v2-copied", value),
      },
    }),
  );
  await page.goto(pair);
  await page
    .getByRole("link", { name: "Product A profile →", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Add to compare", exact: false })
    .click();
  await expect(page).toHaveURL(/a=ordinary-copper/);
  await expect(
    page.getByRole("button", { name: choose("B"), exact: true }),
  ).toBeVisible();
  await page.goto(pair);
  await page
    .getByRole("button", { name: "Copy comparison link", exact: true })
    .click();
  expect(await page.evaluate(() => localStorage.getItem("v2-copied"))).toBe(
    page.url(),
  );
  await page.goto(`${path}?a=unknown&b=niod-cais3`);
  await expect(
    page.getByRole("button", { name: choose("A"), exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("article", { name: "Product B", exact: true }),
  ).toContainText("NIOD");
});

test("selection, swaps, changes, duplicate protection and browser history keep A/B valid", async ({
  page,
}) => {
  await page.goto(path);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compare with clarity.",
  );
  await page.getByRole("button", { name: choose("B"), exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Search products in picker" }),
  ).toBeFocused();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("NIOD");
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\?b=niod-cais3$/);
  await expect(
    page.getByRole("button", { name: choose("A"), exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: choose("A"), exact: true }).click();
  await expect(
    page.getByRole("button", { name: /NIOD.*Copper Amino/ }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("ordinary");
  await page
    .getByRole("button", { name: /The Ordinary.*Multi-Peptide \+ Copper/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "At a glance", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".v2-selected-pair .v2-slot")).toHaveCount(2);
  await page.getByRole("button", { name: "Swap sides", exact: true }).click();
  await expect(
    page.locator(".v2-selected-pair .v2-slot").first(),
  ).toContainText("NIOD");
  await page.goBack();
  await expect(
    page.locator(".v2-selected-pair .v2-slot").first(),
  ).toContainText("The Ordinary");
  await page
    .getByRole("button", { name: "Change product A", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("Argireline");
  await page.getByRole("dialog").locator("[data-product-option]").click();
  await expect(
    page.locator(".v2-selected-pair .v2-slot").first(),
  ).toContainText("Argireline");
  await page
    .getByRole("button", { name: "Change product B", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("Matrixyl 10%");
  await page.getByRole("dialog").locator("[data-product-option]").click();
  const selected = page.url();
  await page.reload();
  await expect(page).toHaveURL(selected);
  await page
    .getByRole("button", { name: "Remove product A", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: choose("A"), exact: true }),
  ).toBeFocused();
  await page.goto(`${path}?a=ordinary-copper&b=ordinary-copper`);
  await expect(
    page.getByText("An unknown or duplicate product was ignored.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: choose("B"), exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await expect(
    page.getByRole("button", { name: choose("A"), exact: true }),
  ).toBeVisible();
});

test("details are progressive, filter preserves limits, hash links reveal rows and evidence stays attributed", async ({
  page,
}) => {
  await page.goto(pair);
  const details = page.locator(".v2-details > details");
  await expect(details).toHaveCount(5);
  for (const detail of await details.all())
    await expect(detail).not.toHaveAttribute("open");
  await page
    .getByRole("link", { name: "See the label differences →", exact: true })
    .click();
  await expect(page.locator("#ingredient-details")).toHaveAttribute("open", "");
  await expect(page.locator("#comparison-peptides")).toBeInViewport();
  await page.locator("#ingredient-details > summary").click();
  await page
    .getByRole("link", { name: "See the label differences →", exact: true })
    .click();
  await expect(page.locator("#ingredient-details")).toHaveAttribute("open", "");
  await page.locator("#product-details > summary").click();
  await expect(page.locator('[data-comparison-row="size"]')).toBeVisible();
  await page
    .getByRole("checkbox", { name: "Show differences only", exact: true })
    .check();
  await expect(page.locator('[data-comparison-row="size"]')).toHaveCount(0);
  for (const id of ["formula-scope", "concentrations", "unknowns", "sources"])
    await expect(page.locator(`[data-comparison-row="${id}"]`)).toHaveCount(1);
  await page
    .getByRole("link", { name: "Check sources & gaps →", exact: true })
    .click();
  await expect(page.locator("#source-details")).toHaveAttribute("open", "");
  await expect(page.locator("#source-details")).toBeFocused();
  await expect(
    page.getByRole("checkbox", { name: "Show differences only", exact: true }),
  ).not.toBeChecked();
  await page
    .locator(".v2-evidence > details")
    .last()
    .locator(":scope > summary")
    .click();
  await expect(page.locator(".v2-cited-passage").first()).toBeVisible();
  await expect(
    page.locator(".v2-cited-passage .v2-source-links a").first(),
  ).toHaveAttribute("href", /^https:/);
  await page.goto(`${path}?a=ordinary-copper&b=cosrx-six-mini`);
  await expect(page.locator(".v2-glance")).toContainText("Price unavailable");
  await expect(page.locator(".v2-observations")).toContainText(
    "complete cost comparison is unavailable",
  );
  await expect(page.locator(".v2-glance")).not.toContainText("$0.00");
});

test("failed images, empty picker results, Escape and failed clipboard remain usable", async ({
  page,
}) => {
  await page.route("**/images/products/records/**", (route) => route.abort());
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    }),
  );
  await page.goto(pair);
  await expect(page.locator(".v2-image-fallback")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Copy comparison link", exact: true })
    .click();
  await expect(
    page.getByText("Your comparison link is ready in the address bar."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Change product A", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("zz-no-product");
  await expect(
    page.getByRole("heading", { name: "No matching products yet." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all products", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Search products in picker" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Change product A", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Change product A", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search products in picker" })
    .fill("GHK-Cu");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: /The Ordinary.*Multi-Peptide \+ Copper/ }),
  ).toBeVisible();
  await page.mouse.click(2, 2);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Change product A", exact: true }),
  ).toBeFocused();
});

for (const theme of ["light", "dark"] as const)
  test(`V2 visual matrix in ${theme}`, async ({ page }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "Explicit width matrix is covered once per theme.",
    );
    test.setTimeout(240000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (value) => localStorage.setItem("pv-theme", value),
      theme,
    );
    for (const width of [1440, 1280, 1024, 768, 430, 390, 375, 320]) {
      await page.setViewportSize({ width, height: 960 });
      for (const [state, url] of [
        ["empty", path],
        ["only-a", `${path}?a=ordinary-copper`],
        ["only-b", `${path}?b=niod-cais3`],
        ["complete", pair],
      ] as const) {
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${width} ${state}`,
        ).toBe(true);
        await page.screenshot({
          path: info.outputPath(`${theme}-${width}-${state}.png`),
          fullPage: true,
        });
      }
      await page.locator("#brand-claims > summary").click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page
        .getByRole("button", { name: "Change product A", exact: true })
        .click();
      await expect(
        page.getByRole("textbox", { name: "Search products in picker" }),
      ).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath(`${theme}-${width}-picker.png`),
      });
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.keyboard.press("Escape");
    }
    expect(errors).toEqual([]);
  });
