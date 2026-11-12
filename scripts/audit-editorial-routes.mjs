import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const baseline = JSON.parse(
  readFileSync("src/data/publication-baseline.json", "utf8"),
);
const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8"));
const paths = [
  ...baseline.map((path) => ({
    path,
    expected: 404,
    reason: "historical-draft-withdrawn",
  })),
  ...catalog.products
    .filter((p) => p.editorialStatus === "published")
    .map((p) => ({
      path: `/skincare/products/${p.slug}/`,
      expected: 200,
      reason: "published-product",
    })),
  ...catalog.ingredients
    .filter((p) => p.status === "published")
    .map((p) => ({
      path: `/skincare/ingredients/${p.slug}/`,
      expected: 200,
      reason: "published-ingredient",
    })),
  ...["/", "/peptides/", "/topics/"].map((path) => ({
    path,
    expected: 200,
    reason: "public-hub",
  })),
];
const results = [];
for (const origin of ["http://localhost:3100", "https://peptivelo.com"]) {
  for (let start = 0; start < paths.length; start += 3) {
    await Promise.all(
      paths.slice(start, start + 3).map(async (entry) => {
        try {
          const response = await fetch(new URL(entry.path, origin), {
            signal: AbortSignal.timeout(15000),
            redirect: "follow",
          });
          await response.arrayBuffer();
          results.push({
            origin,
            ...entry,
            actual: response.status,
            finalUrl: response.url,
            matchesExpected: response.status === entry.expected,
          });
        } catch (error) {
          results.push({
            origin,
            ...entry,
            actual: null,
            error: error.message,
          });
        }
      }),
    );
  }
}
mkdirSync("docs/editorial-validation", { recursive: true });
writeFileSync(
  "docs/editorial-validation/routes.json",
  JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) +
    "\n",
);
console.log(
  JSON.stringify(
    {
      checked: results.length,
      unexpected: results.filter((r) => !r.matchesExpected),
    },
    null,
    2,
  ),
);
