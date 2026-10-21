import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Structural integrity only: a valid citation ID is not scientific approval.
export function auditReferences(documents, sources) {
  const known = new Set(sources.map((source) => source.id));
  const issues = [];
  let references = 0;
  function walk(value, path) {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      const location = `${path}.${key}`;
      if (/sourceIds$/i.test(key) && Array.isArray(child)) {
        for (const id of child) {
          references++;
          if (!known.has(id)) issues.push(`${location}: unknown source ${id}`);
        }
      } else if (/sourceId$/i.test(key) && typeof child === "string") {
        references++;
        if (!known.has(child)) issues.push(`${location}: unknown source ${child}`);
      } else walk(child, location);
    }
  }
  for (const [name, data] of Object.entries(documents)) walk(data, name);
  if (known.size !== sources.length) issues.push("Duplicate source IDs in registry");
  return { pass: issues.length === 0, references, issues };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const read = (name) => JSON.parse(readFileSync(join(root, `src/data/${name}.json`), "utf8"));
  const catalog = read("catalog");
  const haircare = read("haircare");
  const documents = Object.fromEntries(["catalog", "guides", "evidence", "haircare", "comparison-evaluations"].map((name) => [name, read(name)]));
  const report = auditReferences(documents, catalog.sources);
  const missingImages = [...catalog.products, haircare.product].filter((p) => !p.image?.startsWith("/images/products/") || !existsSync(join(root, "public", p.image))).map((p) => p.id);
  const result = {
    checkedAt: new Date().toISOString(),
    scope: "Versioned JSON reference IDs and local product image presence. Does not verify remote availability, claim support, image rights or scientific review; TypeScript-authored library briefs are outside this command.",
    ...report,
    missingImages,
    pass: report.pass && missingImages.length === 0,
    inventory: { facialProducts: catalog.products.length, scalpProducts: 1, comparisons: catalog.comparisons.length, sources: catalog.sources.length },
  };
  if (process.argv.includes("--write")) writeFileSync(join(root, "docs/research/content-audit.json"), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.pass ? 0 : 1;
}
