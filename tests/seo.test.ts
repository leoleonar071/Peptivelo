import { it, expect, vi, afterEach } from "vitest";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock("../src/data/publication-reviews.json");
  vi.resetModules();
});

it("includes only the exact approved record when indexability is enabled", async () => {
  vi.stubEnv("SITE_INDEXABLE", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atlas.example");
  vi.resetModules();
  const { documentForPath } = await import("../src/lib/publication-registry");
  const document = documentForPath("/skincare/products/niod-cais3/")!;
  vi.doMock("../src/data/publication-reviews.json", () => ({
    default: [
      {
        documentId: document.id,
        revision: document.revision,
        kind: "editorial",
        reviewerId: "synthetic-test-reviewer",
        reviewedAt: "2026-11-08",
      },
    ],
  }));
  vi.resetModules();
  const { default: sitemap } = await import("../src/app/sitemap");
  const registry = await import("../src/lib/publication-registry");
  expect(sitemap().map((entry) => entry.url)).toEqual([
    "https://atlas.example/skincare/products/niod-cais3/",
  ]);
  expect(registry.canIndexPath(document.href)).toBe(true);
  expect(registry.canIndexPath(`${document.href}?returnTo=%2Fsearch%2F`)).toBe(
    false,
  );
});
it("keeps the default prelaunch sitemap empty", async () => {
  vi.stubEnv("SITE_INDEXABLE", "false");
  vi.resetModules();
  const { default: sitemap } = await import("../src/app/sitemap");
  expect(sitemap()).toEqual([]);
});
it("does not index legacy published records without explicit current-version approvals", async () => {
  vi.stubEnv("SITE_INDEXABLE", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atlas.example");
  vi.resetModules();
  const { default: sitemap } = await import("../src/app/sitemap");
  const urls = sitemap().map((x) => x.url);
  expect(urls).toEqual([]);
  expect(urls.some((x) => x.includes("/compare/"))).toBe(false);
  expect(urls.some((x) => x.includes("/guides"))).toBe(false);
  expect(urls.some((x) => x.includes("?"))).toBe(false);
  expect(
    urls.some((x) => x.includes("/ingredients/acetyl-hexapeptide-8/")),
  ).toBe(false);
});
