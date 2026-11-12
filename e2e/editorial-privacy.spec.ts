import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import {
  editorialFingerprints,
  findPrivateContent,
} from "../scripts/audit-editorial-privacy.mjs";

const read = (path: string) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const history = read("../src/data/publication-baseline.json") as string[];
const catalog = read("../src/data/public-catalog.json") as {
  products: { slug: string }[];
  ingredients: { slug: string }[];
};
const fingerprints = editorialFingerprints();

test("anonymous HTML, RSC, source lists and assets exclude editorial records", async ({
  request,
}) => {
  test.setTimeout(90_000);
  const visible = [
    "/",
    "/topics/",
    "/peptides/",
    "/learn/",
    "/library/",
    "/sources/",
    "/skincare/",
    "/skincare/ingredients/",
    "/skincare/products/",
    "/skincare/guides/",
    "/skincare/identify/",
    "/skincare/choose/",
    "/compare/?a=ordinary-copper&b=niod-cais3",
    "/search/?q=BPC-157",
    "/search/?q=retatrutide",
    "/search/?q=Hair+Density",
    "/search/?q=GHK-Cu",
    "/search/?entity=health%3Abpc-157&q=BPC-157",
    ...catalog.products.map(
      (product) => "/skincare/products/" + product.slug + "/",
    ),
    ...catalog.ingredients.map(
      (ingredient) => "/skincare/ingredients/" + ingredient.slug + "/",
    ),
  ];
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const path of history) expect(xml).not.toContain(path);
  const sources = await request.get("/sources/");
  expect(await sources.text()).not.toContain('id="source-bpc-human-pilot"');

  const cases = [
    ...visible.map((path) => ({ path, status: 200 })),
    ...history.map((path) => ({ path, status: 404 })),
    { path: "/editorial-preview/ghk-cu/", status: 404 },
    { path: "/editorial-preview/bpc-157/", status: 404 },
  ];
  for (let offset = 0; offset < cases.length; offset += 6) {
    await Promise.all(
      cases.slice(offset, offset + 6).map(async ({ path, status }) => {
        const response = await request.get(path, { maxRedirects: 0 });
        expect(response.status(), path).toBe(status);
        expect(
          findPrivateContent(await response.text(), fingerprints),
          path,
        ).toEqual([]);
        const payload = await request.get(
          path + (path.includes("?") ? "&" : "?") + "_rsc=",
          {
            maxRedirects: 0,
            headers: { RSC: "1" },
          },
        );
        const body = await payload.text();
        if (status === 200) {
          expect(payload.status(), path).toBe(200);
          expect(payload.headers()["content-type"], path).toContain(
            "text/x-component",
          );
        } else if (payload.status() === 200) {
          expect(body, path).toMatch(
            /NEXT_HTTP_ERROR_FALLBACK;404|This page isn.t in the collection/,
          );
        } else {
          expect(payload.status(), path).toBe(404);
        }
        expect(findPrivateContent(body, fingerprints), "RSC " + path).toEqual(
          [],
        );
      }),
    );
  }

  for (const path of [
    "/images/products/records/ordinary-hair-density.svg",
    "/data/catalog.json",
    "/src/data/catalog.json",
    "/data/haircare.json",
    "/data/research-records.json",
    "/src/lib/library.ts",
    "/data/peptides/ghk-cu.json",
    "/.next/server/app/editorial-preview/[slug]/page.js",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
    expect(
      findPrivateContent(await response.text(), fingerprints),
      path,
    ).toEqual([]);
  }
});
