import { test, expect } from "@playwright/test";

test("five pilot profiles offer a second seller and submit validated click events", async ({ page }) => {
  for (const slug of ["the-ordinary-multi-peptide-copper", "niod-cais3", "the-ordinary-multi-peptide-ha", "the-ordinary-matrixyl-10-ha", "the-ordinary-argireline-solution-10"]) {
    await page.goto(`/skincare/products/${slug}/`);
    await expect(page.locator("#offers .offer-card")).toHaveCount(2);
    const link = page.locator("#offers a").filter({ hasText: "Check price at Sephora US" });
    await expect(link).not.toHaveAttribute("rel", /sponsored/);
    await link.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault()));
    const sent = page.waitForResponse((response) => response.url().endsWith("/api/offer-events/") && response.request().postDataJSON()?.name === "offer_clicked");
    await link.click();
    const response = await sent;
    expect(response.status()).toBe(204);
    expect(Object.keys(response.request().postDataJSON()).sort()).toEqual(["name", "offerId"]);
  }
});

test("event endpoint rejects foreign origins, arbitrary payloads and unknown offers", async ({ request, baseURL }) => {
  for (const [origin, data, status] of [
    ["https://other.example", { name: "offer_clicked", offerId: "fake" }, 403],
    [baseURL!, { name: "offer_clicked", offerId: "fake" }, 400],
    [baseURL!, { name: "offer_clicked", offerId: "fake", email: "not-accepted" }, 400],
  ] as const) {
    expect((await request.post("/api/offer-events/", { headers: { origin }, data })).status()).toBe(status);
  }
});

test("privacy preference suppresses offer telemetry without disabling store links", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "doNotTrack", { value: "1" }));
  const events: string[] = [];
  page.on("request", (request) => { if (request.url().endsWith("/api/offer-events/")) events.push(request.url()); });
  await page.goto("/skincare/products/niod-cais3/#offers");
  const link = page.getByRole("link", { name: "Check price at Sephora US" });
  await link.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault()));
  await link.click();
  await expect(link).toHaveAttribute("href", /sephora.com/);
  expect(events).toEqual([]);
});
