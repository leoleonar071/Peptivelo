import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import { resolve, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFileSync(resolve(root, file), "utf8");
const json = (file) => JSON.parse(read("src/data/" + file + ".json"));
const isPrivate = (status) => status !== "published";
const normalize = (value) =>
  value
    .replace(/\\u([a-f\d]{4})/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/\\x([a-f\d]{2})/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
      const named = {
        "&amp;": "&",
        "&quot;": '"',
        "&apos;": "'",
        "&lt;": "<",
        "&gt;": ">",
      };
      return (
        named[entity] ??
        String.fromCodePoint(
          Math.min(
            parseInt(
              entity.slice(entity[2] === "x" ? 3 : 2, -1),
              entity[2] === "x" ? 16 : 10,
            ),
            0x10ffff,
          ),
        )
      );
    })
    .replace(/\\["']/g, (escaped) => escaped[1])
    .replace(/\\[rn]|\s+/g, " ")
    .normalize("NFKC");

function strings(value) {
  if (typeof value === "string") return [value];
  return value && typeof value === "object"
    ? Object.values(value).flatMap(strings)
    : [];
}

function libraryRecords() {
  const source = ts.createSourceFile(
    "library.ts",
    read("src/lib/library.ts"),
    ts.ScriptTarget.Latest,
    true,
  );
  const declaration = source.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => statement.declarationList.declarations)
    .find((item) => item.name.getText(source) === "libraryArticles");
  if (
    !declaration?.initializer ||
    !ts.isArrayLiteralExpression(declaration.initializer)
  )
    throw new Error("Cannot locate library records for privacy audit");
  return declaration.initializer.elements.map((element) => {
    if (!ts.isObjectLiteralExpression(element))
      throw new Error("Unexpected library record");
    const status = element.properties.find(
      (item) => item.name?.getText(source) === "status",
    );
    const texts = [];
    function visit(node) {
      if (ts.isStringLiteral(node)) texts.push(node.text);
      ts.forEachChild(node, visit);
    }
    visit(element);
    return {
      status: status?.initializer
        ?.getText(source)
        .match(/^["']([^"']+)["']/)?.[1],
      texts,
    };
  });
}

export function editorialFingerprints() {
  const catalog = json("catalog");
  const publicCatalog = json("public-catalog");
  const library = libraryRecords();
  const guides = json("guides");
  const hair = json("haircare");
  const privatePairs = catalog.comparisons.filter((item) =>
    isPrivate(item.publicationStatus),
  );
  const privatePeptides = readdirSync(resolve(root, "src/data/peptides"))
    .filter((name) => name.endsWith(".json"))
    .map((name) => json("peptides/" + name.slice(0, -5)))
    .filter(
      (item) =>
        isPrivate(item.status) ||
        !json("public-peptides").some((published) => published.id === item.id),
    );
  const publicText = strings([
    publicCatalog,
    json("learning-basics"),
    json("public-peptides"),
    guides.filter((guide) => !isPrivate(guide.status)),
    library.filter((article) => !isPrivate(article.status)),
    catalog.comparisons.filter((item) => !isPrivate(item.publicationStatus)),
  ]).map(normalize);
  const groups = {
    library: library.filter((article) => isPrivate(article.status)),
    guides: guides.filter((guide) => isPrivate(guide.status)),
    comparisons: privatePairs,
    evaluations: json("comparison-evaluations").filter((item) =>
      privatePairs.some((pair) => pair.id === item.comparisonId),
    ),
    scalp: [
      isPrivate(hair.product.status) ? hair.product : null,
      ...hair.ingredients.filter((item) => isPrivate(item.status)),
    ],
    peptides: privatePeptides,
    privateCatalog: [
      ...catalog.products.filter((item) => isPrivate(item.editorialStatus)),
      ...catalog.ingredients.filter((item) => isPrivate(item.status)),
      ...catalog.products.flatMap((item) =>
        (item.editorialImages ?? []).flatMap((image) =>
          image.approval !== "approved"
            ? [image]
            : [image.provenance?.permissionEvidence],
        ),
      ),
    ],
    research: json("research-records"),
    extractions: json("study-extractions"),
  };
  const result = Object.entries(groups).flatMap(([group, records]) =>
    [...new Set(strings(records).map(normalize))]
      .filter(
        (text) =>
          text.length >= 38 && text.includes(" ") && !/^https?:/.test(text),
      )
      .map((text) => text.slice(0, 120).trim())
      .filter((text) => !publicText.some((allowed) => allowed.includes(text)))
      .map((text, index) => ({ id: group + ":" + (index + 1), text })),
  );
  for (const group of [
    "library",
    "guides",
    "comparisons",
    "research",
    "extractions",
  ]) {
    if (
      groups[group].length &&
      !result.some((entry) => entry.id.startsWith(group + ":"))
    )
      throw new Error("Missing private audit fingerprints for " + group);
  }
  return [
    ...result,
    ...(isPrivate(hair.product.status)
      ? [
          {
            id: "scalp-card",
            text: "The Ordinary Multi-Peptide Serum for Hair Density — 60 mL",
          },
        ]
      : []),
    {
      id: "scalp-provenance",
      text: "Local file: public/images/products/ordinary-hair-density-60ml.jpg.",
    },
  ];
}

export function findPrivateContent(body, fingerprints) {
  const text = normalize(normalize(body));
  return fingerprints
    .filter((entry) => text.includes(entry.text))
    .map((entry) => entry.id);
}

const textExtensions = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".map",
  ".html",
  ".rsc",
  ".txt",
  ".css",
  ".xml",
  ".svg",
  ".md",
  ".body",
]);
function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else if (entry.isFile()) yield file;
  }
}

export function auditBuild(target) {
  const files =
    target === "next"
      ? [
          ...walk(resolve(root, ".next/static")),
          ...walk(resolve(root, "public")),
          ...Array.from(walk(resolve(root, ".next/server/app"))).filter(
            (path) => /\.(html|rsc|body)$/.test(path),
          ),
        ]
      : [
          ...walk(
            resolve(root, ".cloudflare/output/v0/workers/default/assets"),
          ),
        ];
  const fingerprints = editorialFingerprints();
  const matches = [];
  const counts = {};
  for (const file of files) {
    const compression = extname(file);
    const compressed = compression === ".gz" || compression === ".br";
    const extension = extname(
      compressed ? file.slice(0, -compression.length) : file,
    );
    if (!textExtensions.has(extension) && !file.endsWith("_headers")) continue;
    counts[extension || "headers"] = (counts[extension || "headers"] ?? 0) + 1;
    const buffer = readFileSync(file);
    const body = (
      compression === ".gz"
        ? gunzipSync(buffer)
        : compression === ".br"
          ? brotliDecompressSync(buffer)
          : buffer
    ).toString("utf8");
    const hits = findPrivateContent(body, fingerprints);
    if (hits.length)
      matches.push({ file: relative(root, file), fingerprints: hits });
  }
  if (!counts[".js"] && !counts[".mjs"])
    throw new Error("No browser bundles found");
  return {
    target,
    checkedAt: new Date().toISOString(),
    counts,
    fingerprints: fingerprints.length,
    matches,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const target = process.argv[2];
  if (target !== "next" && target !== "worker")
    throw new Error("Specify next or worker");
  const result = auditBuild(target);
  mkdirSync(resolve(root, "test-results"), { recursive: true });
  writeFileSync(
    resolve(root, "test-results/privacy-artifacts-" + target + ".json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
  if (result.matches.length) process.exitCode = 1;
}
