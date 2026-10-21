import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
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
