import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("uses the live domain in production while preserving explicit origins", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.resetModules();
  expect((await import("../src/lib/config")).site.url).toBe("https://peptivelo.com");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example");
  vi.resetModules();
  expect((await import("../src/lib/config")).site.url).toBe("https://preview.example");
});

it("keeps the local origin outside production", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.resetModules();
  expect((await import("../src/lib/config")).site.url).toBe("http://localhost:3000");
});

it("uses the configured brand across informational pages and metadata settings", async () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_NAME", "Selected Brand");
  vi.resetModules();
  const { site } = await import("../src/lib/config");
  const { pages } = await import("../src/lib/pages");
  expect(site.name).toBe("Selected Brand");
  expect(pages.about.intro).toContain("Selected Brand");
  expect(pages["affiliate-disclosure"].intro).toContain("Selected Brand");
});

it("does not say contact is missing when a real address is configured", async () => {
  vi.stubEnv("CONTACT_EMAIL", "contact@chosen-brand.com");
  vi.stubEnv("SITE_OPERATOR_NAME", "Actual Operator");
  vi.resetModules();
  const { pages } = await import("../src/lib/pages");
  expect(
    pages.contact.sections.find((s) => s.title === "Contact availability")!
      .text,
  ).toContain("email address below");
  expect(
    pages.about.sections.find((s) => s.title === "Who operates this site")!
      .text,
  ).toContain("Actual Operator");
});
