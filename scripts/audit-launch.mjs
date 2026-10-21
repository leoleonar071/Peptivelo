import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export function auditLaunch({ env, catalog, today, imageExists, haircare }) {
  const checks = [];
  const add = (id, pass, detail) => checks.push({ id, pass, detail });
  let publicOrigin = false;
  try {
    const url = new URL(env.NEXT_PUBLIC_SITE_URL);
    publicOrigin =
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === "/" &&
      !url.port &&
      url.hostname.includes(".") &&
      !/^[\d.]+$/.test(url.hostname) &&
      !/(^|\.)(localhost|local|internal|test|example|invalid)$/.test(
        url.hostname,
      ) &&
      !/(^|\.)example\.(com|org|net)$/.test(url.hostname);
  } catch {
    /* An unset or invalid origin is reported below. */
  }
  add(
    "public-origin",
    publicOrigin,
    "Configure NEXT_PUBLIC_SITE_URL with the final HTTPS domain, without a path or placeholder.",
  );
  const name = env.NEXT_PUBLIC_SITE_NAME?.trim() || "Peptivelo";
  add(
    "brand",
    !!name && name.toLowerCase() !== "peptide atlas",
    "Brand configuration uses Peptivelo by default. Confirm domain and name rights separately; this check is not trademark clearance.",
  );
  const email = env.CONTACT_EMAIL?.trim() || "";
  add(
    "contact",
    /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) &&
      !/@(?:.*\.)?example\.(com|org|net)$/.test(email) &&
      !/\.(invalid|test|example)$/.test(email),
    "Configure a real CONTACT_EMAIL and test sending/receiving separately.",
  );
  add(
    "operator",
    !!env.SITE_OPERATOR_NAME?.trim(),
    "Supply the real SITE_OPERATOR_NAME.",
  );
  add(
    "hosting",
    !!env.HOSTING_PROVIDER?.trim(),
    "Supply HOSTING_PROVIDER; document actual retention and processing separately.",
  );
  const active = catalog.products.filter(
    (p) => p.editorialStatus === "published",
  );
  add(
    "product-sources",
    active.length > 0 &&
      active.every((p) =>
        catalog.sources.some(
          (s) => s.id === p.sourceId && /^https:\/\//.test(s.url),
        ),
      ),
    "Published products must have HTTPS source references.",
  );
  add(
    "product-images",
    active.length > 0 &&
      new Set(active.map((p) => p.image)).size === active.length &&
      active.every(
        (p) => p.image?.startsWith("/images/products/") && imageExists(p.image),
      ),
    "Every published product must have its own existing image asset.",
  );
  const stale = catalog.prices.filter(
    (p) => Date.parse(today) - Date.parse(p.verifiedAt) > 30 * 86400000,
  );
  add(
    "price-dates",
    stale.length === 0 &&
      catalog.prices.every(
        (p) => Date.parse(p.verifiedAt) <= Date.parse(today),
      ),
    "Recheck dated prices after 30 days; future verification dates are invalid.",
  );
  add(
    "exact-price-sizes",
    catalog.prices.every((p) =>
      catalog.products.some(
        (product) =>
          product.id === p.productId &&
          product.volume === p.size &&
          product.volumeUnit === p.sizeUnit,
      ),
    ),
    "Do not normalize a price from another presentation.",
  );
  add(
    "draft-protection",
    catalog.comparisons.every(
      (c) =>
        c.publicationStatus !== "published" ||
        (c.reviewedBy?.trim() &&
          /^\d{4}-\d{2}-\d{2}$/.test(c.reviewedAt || "") &&
          Date.parse(c.reviewedAt) <= Date.parse(today)),
    ),
    "Published analyses need a real reviewer and review date. Keep unreviewed analyses draft/noindex.",
  );
  add(
    "commercial-state",
    catalog.retailers.every((r) => r.affiliateUrl === null),
    "Current disclosures say there are no active compensated links. Review disclosures and product-specific tracking before activating any.",
  );
  if (haircare) {
    const product = haircare.product;
    const sourceIds = [product.sourceId, ...haircare.ingredients.flatMap((i) => [...i.identitySourceIds, ...i.evidenceSourceIds])];
    add("haircare-sources", sourceIds.every((id) => catalog.sources.some((s) => s.id === id && /^https:\/\//.test(s.url))), "Haircare label and evidence references must resolve to registered HTTPS sources.");
    add("haircare-image", product.image?.startsWith("/images/products/") && imageExists(product.image), "The exact scalp product image must exist; file presence does not establish reuse permission.");
    const age = Date.parse(today) - Date.parse(product.checkedAt);
    add("haircare-price-date", Number.isFinite(age) && age >= 0 && age <= 30 * 86400000 && Number.isFinite(product.priceUsd) && product.priceUsd >= 0 && product.volumeMl > 0, "Recheck the haircare size-specific price after 30 days; reject invalid/future observations.");
    add("haircare-draft", product.status === "draft", "The current haircare pilot must remain draft pending scientific review and a deliberate publication workflow.");
  }
  return {
    checkedAt: today,
    checks,
    technicalChecksPass: checks.every((c) => c.pass),
    manualRequirements: [
      "Confirm domain registration and brand clearance; a new configured name is not proof of rights.",
      "Resolve photograph reuse rights or replace the manufacturer assets before public publication.",
      "Review editorial drafts before indexing them; scientific interpretation needs qualified review.",
      "Review the actual operator, hosting retention and privacy/terms for the deployed service.",
      "Verify the public domain, HTTPS, metadata and contact delivery after deployment.",
      "Keep advertising and affiliate tracking off until actual approvals and disclosures are in place.",
    ],
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const catalog = JSON.parse(
    readFileSync(join(root, "src/data/catalog.json"), "utf8"),
  );
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
  }).format(new Date());
  const report = auditLaunch({
    env: process.env,
    catalog,
    haircare: JSON.parse(readFileSync(join(root, "src/data/haircare.json"), "utf8")),
    today,
    imageExists: (path) => existsSync(join(root, "public", path)),
  });
  console.log(`Launch preparation audit — ${report.checkedAt} (America/Lima)`);
  for (const check of report.checks)
    console.log(
      `${check.pass ? "PASS" : "PENDING"} ${check.id}: ${check.detail}`,
    );
  console.log("\nManual requirements (not established by automated checks):");
  for (const requirement of report.manualRequirements)
    console.log(`- ${requirement}`);
  console.log(
    "\nThis audit does not deploy, enable indexing, approve content or establish program acceptance.",
  );
  process.exitCode = report.technicalChecksPass ? 0 : 1;
}
