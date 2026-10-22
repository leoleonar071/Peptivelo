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

it("publishes the owner's requested contact address without implying mailbox verification", async () => {
  vi.stubEnv("CONTACT_EMAIL", "");
  vi.resetModules();
  expect((await import("../src/lib/config")).site.contact).toBe("suppor@peptivelo.com");
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

it("describes the current public host without inventing missing operator or retention details", async () => {
  vi.stubEnv("HOSTING_PROVIDER", "");
  vi.stubEnv("HOSTING_LOG_RETENTION", "");
  vi.stubEnv("CONTACT_EMAIL", "");
  vi.stubEnv("SITE_OPERATOR_NAME", "");
  vi.stubEnv("SITE_OPERATING_JURISDICTION", "");
  vi.resetModules();
  const { site } = await import("../src/lib/config");
  const { pages } = await import("../src/lib/pages");
  const privacy = pages.privacy.sections.map((section) => section.text).join(" ");
  expect(site.hostingProvider).toBe("Cloudflare Workers");
  expect(privacy).toContain("public site is hosted on Cloudflare Workers");
  expect(privacy).toContain("has not yet confirmed the retention periods");
  expect(privacy).toContain("public operator identity is still outstanding");
  expect(privacy).toContain("pv-theme");
  expect(privacy).toContain("does not upload those images or camera frames");
  expect(privacy).not.toContain("has not yet been selected");
});

it("uses supplied operational details without retaining the missing-data notices", async () => {
  vi.stubEnv("HOSTING_PROVIDER", "Cloudflare Workers");
  vi.stubEnv("HOSTING_LOG_RETENTION", "Owner-confirmed policy text");
  vi.stubEnv("SITE_OPERATOR_NAME", "Actual Operator");
  vi.stubEnv("SITE_OPERATING_JURISDICTION", "Owner-supplied jurisdiction");
  vi.stubEnv("CONTACT_EMAIL", "contact@chosen-brand.com");
  vi.resetModules();
  const { pages } = await import("../src/lib/pages");
  const privacy = pages.privacy.sections.map((section) => section.text).join(" ");
  expect(privacy).toContain("Owner-confirmed policy text");
  expect(privacy).toContain("Actual Operator");
  expect(privacy).toContain("contact@chosen-brand.com");
  expect(privacy).not.toContain("still outstanding");
  expect(privacy).not.toContain("has not yet confirmed the retention periods");
  expect(pages.about.sections.map((section) => section.text).join(" "))
    .not.toContain("Owner-supplied jurisdiction");
});
