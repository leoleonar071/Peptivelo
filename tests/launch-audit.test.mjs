import { expect, it } from "vitest";
import { auditLaunch } from "../scripts/audit-launch.mjs";

const fixture = {
  env: {
    NEXT_PUBLIC_SITE_URL: "https://chosen-brand.com",
    NEXT_PUBLIC_SITE_NAME: "Chosen Brand",
    CONTACT_EMAIL: "contact@chosen-brand.com",
    SITE_OPERATOR_NAME: "Actual Operator",
    HOSTING_PROVIDER: "Selected Provider",
  },
  catalog: {
    products: [
      {
        id: "serum",
        editorialStatus: "published",
        sourceId: "label",
        image: "/images/products/serum.png",
        volume: 30,
        volumeUnit: "ml",
      },
    ],
    sources: [{ id: "label", url: "https://brand.com/serum" }],
    prices: [
      {
        productId: "serum",
        size: 30,
        sizeUnit: "ml",
        verifiedAt: "2026-10-19",
      },
    ],
    comparisons: [{ publicationStatus: "draft" }],
    retailers: [{ affiliateUrl: null }],
  },
  today: "2026-10-19",
  imageExists: () => true,
};

it("checks scalp references, image, observation date and draft protection separately", () => {
  const report = auditLaunch({ ...fixture, haircare: {
    product: { sourceId: "missing", image: "/images/products/scalp.jpg", checkedAt: "2026-09-01", priceUsd: 24, volumeMl: 60, status: "published" },
    ingredients: [],
  }, imageExists: () => false });
  for (const id of ["haircare-sources", "haircare-image", "haircare-price-date", "haircare-draft"]) {
    expect(report.checks.find((check) => check.id === id).pass, id).toBe(false);
  }
});

it("rejects local and placeholder origins and contact addresses", () => {
  for (const origin of [
    "http://localhost:3102",
    "https://example.com",
    "https://shop.test",
    "https://127.0.0.1",
    "https://brand.com/path",
    "https://user:pass@brand.com",
  ]) {
    const report = auditLaunch({
      ...fixture,
      env: {
        ...fixture.env,
        NEXT_PUBLIC_SITE_URL: origin,
        CONTACT_EMAIL: "person@example.com",
      },
    });
    expect(
      report.checks.find((c) => c.id === "public-origin").pass,
      origin,
    ).toBe(false);
    expect(report.checks.find((c) => c.id === "contact").pass).toBe(false);
  }
});

it("does not treat configured settings as editorial, legal or image clearance", () => {
  const report = auditLaunch(fixture);
  expect(report.technicalChecksPass).toBe(true);
  expect(report.manualRequirements.some((r) => r.includes("photograph"))).toBe(
    true,
  );
  expect(report.manualRequirements.some((r) => r.includes("qualified"))).toBe(
    true,
  );
});

it("detects stale prices and wrong-size observations", () => {
  const report = auditLaunch({
    ...fixture,
    catalog: {
      ...fixture.catalog,
      prices: [
        {
          productId: "serum",
          size: 15,
          sizeUnit: "ml",
          verifiedAt: "2026-09-01",
        },
      ],
    },
  });
  expect(report.checks.find((c) => c.id === "price-dates").pass).toBe(false);
  expect(report.checks.find((c) => c.id === "exact-price-sizes").pass).toBe(
    false,
  );
});

it("does not accept published analyses without actual review metadata", () => {
  const report = auditLaunch({
    ...fixture,
    catalog: {
      ...fixture.catalog,
      comparisons: [{ publicationStatus: "published" }],
    },
  });
  expect(report.checks.find((c) => c.id === "draft-protection").pass).toBe(
    false,
  );
});
