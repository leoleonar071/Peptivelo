import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8"));
const terms = [
  "ordinary copper peptides",
  "niod cais",
  "ordinary multi peptide ha",
  "ordinary matrixyl",
  "ordinary argireline",
  "geek gorgeous power peptides",
  "naturium multi peptide",
  "timeless synthe",
  "medik8 liquid peptides",
  "cosrx peptide",
  "skinceuticals ptiox",
];
const results = [];
mkdirSync("docs/editorial-validation", { recursive: true });
for (const [index, p] of catalog.products.entries()) {
  if (index) await delay(6500); // below ten searches/minute; no retries or image requests
  const endpoint = new URL("https://world.openbeautyfacts.org/cgi/search.pl");
  endpoint.search = new URLSearchParams({
    search_terms: terms[index],
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "10",
    fields:
      "code,product_name,brands,quantity,url,images,image_front_url,selected_images,creator,last_modified_t",
  });
  const record = {
    productId: p.id,
    query: terms[index],
    expectedName: p.name,
    expectedQuantity: `${p.volume} ${p.volumeUnit}`,
    requestedAt: new Date().toISOString(),
    endpoint: endpoint.href,
    candidates: [],
    approval: "pending",
    exactMatchVerified: false,
  };
  try {
    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": "PeptiveloEditorialAudit/1.0 (https://peptivelo.com)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });
    record.httpStatus = response.status;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.headers.get("content-type")?.includes("json"))
      throw new Error(
        "Non-JSON response; access challenge or incompatible endpoint",
      );
    const data = await response.json();
    if (!Array.isArray(data.products))
      throw new Error("Unexpected search response schema");
    record.totalSearchResults = data.count ?? null;
    record.candidates = data.products.map((candidate) => ({
      code: candidate.code,
      name: candidate.product_name ?? null,
      brands: candidate.brands ?? null,
      quantity: candidate.quantity ?? null,
      source: `https://world.openbeautyfacts.org/product/${candidate.code}`,
      productCreator: candidate.creator ?? null,
      frontImageUrl: candidate.image_front_url ?? null,
      // Numeric raw image records carry uploader metadata; product creator is NOT photo author.
      images: Object.entries(candidate.images ?? {}).map(([key, image]) => ({
        key,
        uploader: image.uploader ?? null,
        uploadedAt: image.uploaded_t ?? null,
        selectedImageId: image.imgid ?? null,
        sizes: image.sizes ?? null,
      })),
      rawImageMetadata: candidate.images ?? {},
      selectedImages: candidate.selected_images ?? {},
      license: {
        declaredImagePolicy:
          "CC BY-SA (project-wide policy; per-image conditions not verified)",
        policySource:
          "https://openfoodfacts.github.io/openfoodfacts-server/api/",
        exactVersion: null,
        authorVerified: false,
        reuseApproved: false,
      },
      optimizedFile: null,
      aiChanges: [],
      approval: "pending",
      exactMatchVerified: false,
    }));
    record.outcome = record.candidates.length
      ? "candidates-needing-review"
      : "no-candidates-for-query";
  } catch (error) {
    record.outcome = "lookup-blocked";
    record.error = error.message;
  }
  results.push(record);
  writeFileSync(
    "docs/editorial-validation/open-beauty-results.json",
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        scope:
          "11 single-page text searches, at most 10 candidates each; no binary images requested; absence in these queries does not establish absence from OBF",
        dataAttribution:
          "Open Beauty Facts contributors; database ODbL, image conditions require separate review",
        results,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `${p.id}: ${record.outcome} (${record.candidates.length} candidates)`,
  );
}
