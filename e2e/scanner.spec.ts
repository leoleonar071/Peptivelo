import { test, expect } from "@playwright/test";
import QRCode from "qrcode";
import AxeBuilder from "@axe-core/playwright";

test("scanner handles unknown codes and camera denial with accessible manual exits", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: async () => {
          throw new DOMException("Denied", "NotAllowedError");
        },
      },
      configurable: true,
    });
  });
  await page.goto("/skincare/identify/");
  const trigger = page.getByRole("button", {
    name: "Scan a code",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Scan a product code" });
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Start camera" }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "Camera permission was not granted",
  );
  await dialog.locator("summary").click();
  await page
    .getByLabel("Code or product link", { exact: true })
    .fill("123456789012");
  await page.getByRole("button", { name: "Look up code" }).click();
  await expect(dialog.getByRole("status")).toContainText("no catalog match");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({ path: `docs/scanner-${testInfo.project.name}.png` });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("button", { name: "Search by name instead" }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
});

test("a real QR image decodes locally and still requires product confirmation", async ({
  page,
}) => {
  await page.goto("/skincare/identify/");
  await page.getByRole("button", { name: "Scan a code", exact: true }).click();
  const png = await QRCode.toBuffer(
    "http://localhost:3100/skincare/products/the-ordinary-multi-peptide-copper/",
    { width: 360, margin: 4 },
  );
  await page.locator(".scanner-upload input").setInputFiles({
    name: "product-qr.png",
    mimeType: "image/png",
    buffer: png,
  });
  await expect(
    page.getByRole("heading", { name: "Is this your serum?" }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.locator(".identify-product")).toContainText("The Ordinary");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(
    page.getByText("Contents & batch unverified", { exact: true }),
  ).not.toBeVisible();
});

test("closing during camera permission stops a stream that arrives late", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as unknown as {
      releaseCamera: () => void;
      stoppedTracks: number;
    };
    state.stoppedTracks = 0;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: () =>
          new Promise((resolve) => {
            state.releaseCamera = () =>
              resolve({
                getTracks: () => [
                  {
                    stop: () => {
                      state.stoppedTracks++;
                    },
                  },
                ],
              });
          }),
      },
    });
  });
  await page.goto("/skincare/identify/");
  await page.getByRole("button", { name: "Scan a code", exact: true }).click();
  await page.getByRole("button", { name: "Start camera" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          typeof (window as unknown as { releaseCamera: unknown })
            .releaseCamera,
      ),
    )
    .toBe("function");
  await page.getByRole("button", { name: "Close scanner" }).click();
  await page.evaluate(() =>
    (window as unknown as { releaseCamera: () => void }).releaseCamera(),
  );
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { stoppedTracks: number }).stoppedTracks,
      ),
    )
    .toBe(1);
});

test("an active camera stream stops on Stop and Escape", async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as unknown as { stoppedTracks: number };
    state.stoppedTracks = 0;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => {
          const canvas = document.createElement("canvas");
          canvas.width = 320;
          canvas.height = 240;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 320, 240);
          const stream = canvas.captureStream(10);
          for (const track of stream.getTracks()) {
            const stop = track.stop.bind(track);
            track.stop = () => {
              state.stoppedTracks++;
              stop();
            };
          }
          return stream;
        },
      },
    });
  });
  await page.goto("/skincare/identify/");
  await page.getByRole("button", { name: "Scan a code", exact: true }).click();
  await page.getByRole("button", { name: "Start camera" }).click();
  await expect(
    page.getByRole("button", { name: "Stop camera", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Stop camera", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { stoppedTracks: number }).stoppedTracks,
      ),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Start camera" }).click();
  await expect(
    page.getByRole("button", { name: "Stop camera", exact: true }),
  ).toBeVisible();
  const before = await page.evaluate(
    () => (window as unknown as { stoppedTracks: number }).stoppedTracks,
  );
  await page.keyboard.press("Escape");
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { stoppedTracks: number }).stoppedTracks,
      ),
    )
    .toBeGreaterThan(before);
});
