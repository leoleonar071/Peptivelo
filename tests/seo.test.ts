import { it, expect, vi, afterEach } from "vitest";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
it("keeps the default prelaunch sitemap empty", async () => {
  vi.stubEnv("SITE_INDEXABLE", "false");
  vi.resetModules();
  const { default: sitemap } = await import("../src/app/sitemap");
  expect(sitemap()).toEqual([]);
});
it("includes published catalog records but excludes draft comparisons and tools with user state", async () => {
  vi.stubEnv("SITE_INDEXABLE", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atlas.example");
  vi.resetModules();
  const { default: sitemap } = await import("../src/app/sitemap");
  const urls = sitemap().map((x) => x.url);
  expect(urls).toContain("https://atlas.example/skincare/products/niod-cais3/");
  expect(urls).toContain("https://atlas.example/tools/price-per-ml/");
  expect(urls.some((x) => x.includes("/compare/"))).toBe(false);
  expect(urls.some((x) => x.includes("/guides"))).toBe(false);
  expect(urls.some((x) => x.includes("?"))).toBe(false);
  expect(urls.some((x) => x.includes("/ingredients/acetyl-hexapeptide-8/"))).toBe(false);
});
