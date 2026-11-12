import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import {
  editorialFingerprints,
  findPrivateContent,
} from "./audit-editorial-privacy.mjs";

const [target, address, output, retiredInventory] = process.argv.slice(2);
if (!["next", "worker"].includes(target) || !address || !output) {
  throw new Error(
    "Usage: node scripts/verify-editorial-http.mjs <next|worker> <origin> <output.json> [retired-paths.json]",
  );
}

const origin = new URL(address).origin;
const canonical = "/skincare/ingredients/copper-tripeptide-1/";
const productPaths = [
  "/skincare/products/the-ordinary-multi-peptide-copper/",
  "/skincare/products/cosrx-six-peptide-skin-booster-mini/",
];
const compare = "/compare/?a=ordinary-copper&b=cosrx-six-mini";
const history = JSON.parse(
  readFileSync("src/data/publication-baseline.json", "utf8"),
);
const fingerprints = editorialFingerprints();
const text = new Set([
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
const internalFiles = new Set([
  "/.vite/manifest.json",
  "/vinext-client-entry-manifest.json",
  "/_headers",
]);

function publicFiles(directory, prefix = "") {
  const root = resolve(directory);
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter(
      (file) =>
        file.isFile() &&
        (text.has(extname(file.name)) || file.name === "_headers"),
    )
    .map((file) => {
      const segments = relative(root, resolve(file.parentPath, file.name))
        .split(/[\\/]/)
        .map(encodeURIComponent);
      return prefix + "/" + segments.join("/");
    });
}

const assets =
  target === "next"
    ? [
        ...publicFiles(".next/static", "/_next/static"),
        ...publicFiles("public"),
      ]
    : publicFiles(".cloudflare/output/v0/workers/default/assets");
const knownAssets = new Set(assets);
const mapProbes = assets
  .filter((path) => /\.(?:js|mjs|cjs|css)$/.test(path))
  .map((path) => path + ".map")
  .filter((path) => !knownAssets.has(path));
const retired = retiredInventory
  ? JSON.parse(readFileSync(retiredInventory, "utf8"))
  : [];
if (
  !Array.isArray(retired) ||
  !retired.every(
    (path) => typeof path === "string" && /^\/(?!\/)/.test(path),
  ) ||
  retired.some((path) => knownAssets.has(path))
)
  throw new Error(
    "Retired paths must be local URLs absent from the safe build",
  );

async function inspect(path, kind, expected, verify = () => []) {
  const url = new URL(path, origin);
  if (url.origin !== origin) throw new Error("Cross-origin audit path");
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: kind === "rsc" ? { RSC: "1" } : undefined,
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    return {
      path,
      kind,
      status: response.status,
      cache: Object.fromEntries(
        [
          "cache-control",
          "cf-cache-status",
          "cf-ray",
          "age",
          "etag",
          "vary",
          "location",
          "x-robots-tag",
        ].map((key) => [key, response.headers.get(key)]),
      ),
      matches: findPrivateContent(body, fingerprints),
      problems: [
        ...(!expected.includes(response.status)
          ? [`Expected HTTP ${expected.join(" or ")}`]
          : []),
        ...verify(body, response),
      ],
    };
  } catch (error) {
    return { path, kind, matches: [], problems: [error.message] };
  }
}

const tasks = [];
const add = (...args) => tasks.push(args);
const noSharedCache = (_body, response) => {
  const control = response.headers.get("cache-control") ?? "";
  const cacheStatus = response.headers.get("cf-cache-status");
  return control.includes("no-store") &&
    !["HIT", "STALE", "UPDATING"].includes(cacheStatus)
    ? []
    : ["Expected no-store and no shared cache response"];
};
add("/sitemap.xml", "sitemap", [200], (body) =>
  history
    .filter((path) => body.includes(path))
    .map((path) => "Listed: " + path),
);
add(canonical, "html", [200], (body) => [
  ...(!body.includes(`rel="canonical" href="https://peptivelo.com${canonical}"`)
    ? ["Wrong GHK-Cu canonical"]
    : []),
  ...productPaths
    .filter((path) => !body.includes(`href="${path}`))
    .map((path) => "Missing GHK-Cu product: " + path),
]);
for (const path of productPaths) add(path, "html", [200]);
add(compare, "html", [200], noSharedCache);
for (const path of [canonical, compare]) {
  add(
    path + (path.includes("?") ? "&" : "?") + "_rsc=",
    "rsc",
    [200],
    (body, response) => [
      ...(response.headers.get("content-type")?.includes("text/x-component")
        ? []
        : ["Expected RSC content type"]),
      ...(path === compare ? noSharedCache(body, response) : []),
    ],
  );
}
for (const path of history) {
  add(path, "historical", [404]);
  add(path + "?_rsc=", "rsc", [200, 404], (body, response) =>
    response.status === 404 || body.includes("NEXT_HTTP_ERROR_FALLBACK;404")
      ? []
      : ["Expected the RSC not-found identifier"],
  );
}
for (const path of [
  "/editorial-preview/ghk-cu/",
  "/editorial-preview/bpc-157/",
]) {
  const verify = (body, response) => [
    ...noSharedCache(body, response),
    ...(response.headers.get("x-robots-tag")?.includes("noindex")
      ? []
      : ["Expected preview noindex"]),
  ];
  add(path, "private", [404], verify);
  add(path + "?_rsc=", "rsc", [404], verify);
}
for (const path of [
  "/images/products/records/ordinary-hair-density.svg",
  "/src/data/catalog.json",
  "/data/peptides/ghk-cu.json",
  "/.next/server/app/editorial-preview/[slug]/page.js",
])
  add(path, "private", [404]);
for (const path of assets) {
  if (path === "/_headers") {
    add(path, "asset-config", [308, 404], (_body, response) =>
      response.status === 308 &&
      response.headers.get("location") !== "/_headers/"
        ? ["Unexpected config-file redirect"]
        : [],
    );
    add(path + "/", "asset-config", [404]);
  } else {
    add(path, "asset", internalFiles.has(path) ? [404] : [200]);
  }
}
for (const path of mapProbes) add(path, "map-probe", [404]);
for (const path of retired) add(path, "retired", [403, 404, 410]);

const rows = [];
for (let index = 0; index < tasks.length; index += 4) {
  rows.push(
    ...(await Promise.all(
      tasks.slice(index, index + 4).map((args) => inspect(...args)),
    )),
  );
}

const failures = rows.filter(
  (row) => row.matches.length || row.problems.length,
);
writeFileSync(
  output,
  JSON.stringify(
    {
      target,
      origin,
      checkedAt: new Date().toISOString(),
      fingerprintCount: fingerprints.length,
      rows,
      failures,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({ target, requests: rows.length, failures }, null, 2),
);
if (failures.length) process.exitCode = 1;
