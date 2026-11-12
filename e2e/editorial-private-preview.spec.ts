import { test, expect } from "@playwright/test";
import {
  editorialFingerprints,
  findPrivateContent,
} from "../scripts/audit-editorial-privacy.mjs";

test("opens the five follow-up workspaces without publishing their canonicals", async ({
  request,
}) => {
  for (const slug of [
    "semaglutide",
    "tirzepatide",
    "retatrutide",
    "bpc-157",
    "tb-500",
  ]) {
    const response = await request.get(`/editorial-preview/${slug}/`);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(await response.text()).toContain("Staged editable sections");
  }
});
test("denies unauthorized preview including RSC requests and query credentials", async () => {
  for (const suffix of ["", "?_rsc=", "?token=invalid"]) {
    const response = await fetch(
      `http://127.0.0.1:3102/editorial-preview/ghk-cu/${suffix}`,
      { headers: suffix.startsWith("?_rsc") ? { RSC: "1" } : {} },
    );
    expect(response.status).toBe(401);
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(await response.text()).not.toContain("Staged editable sections");
  }
});

test("serves the existing BPC-157 manuscript only with credentials", async ({
  request,
}) => {
  const path = "/editorial-preview/bpc-157/";
  const fingerprints = editorialFingerprints();
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(
    findPrivateContent(await response.text(), fingerprints).length,
  ).toBeGreaterThan(0);

  const denied = await fetch(`http://127.0.0.1:3102${path}?_rsc=`, {
    headers: { RSC: "1" },
  });
  expect(denied.status).toBe(401);
  expect(findPrivateContent(await denied.text(), fingerprints)).toEqual([]);
});
test("renders GHK-Cu canonical content beside its staged fields privately", async ({
  page,
}) => {
  const response = await page.goto("/editorial-preview/ghk-cu/");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(
    page.getByRole("heading", {
      name: "Existing canonical content — unchanged",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Staged editable sections" }),
  ).toBeVisible();
  await expect(
    page.getByText("Qualified scientific review pending.", { exact: false }),
  ).toBeVisible();
  const products = page.locator(
    ".peptide-profile a[href^='/skincare/products/']",
  );
  await expect(products).toHaveCount(2);
  for (const link of await products.all()) {
    const href = await link.getAttribute("href");
    expect((await page.request.get(href!)).status(), href!).toBe(200);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
