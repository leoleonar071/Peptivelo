import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catalogFile = path.join(root, "src/data/catalog.json");
const haircareFile = path.join(root, "src/data/haircare.json");
const catalog = JSON.parse(await fs.readFile(catalogFile, "utf8"));
const haircare = JSON.parse(await fs.readFile(haircareFile, "utf8"));
const output = path.join(root, "public/images/products/records");
const archive = path.join(root, ".migration-backup/product-photographs");
await fs.mkdir(output, { recursive: true });
await fs.mkdir(archive, { recursive: true });
const escape = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
function lines(text, width) {
  const result = [""];
  for (const word of text.split(/\s+/)) {
    const index = result.length - 1;
    if (result[index] && `${result[index]} ${word}`.length > width)
      result.push(word);
    else result[index] += `${result[index] ? " " : ""}${word}`;
  }
  return result;
}
async function create(product, brand, volume) {
  const name = lines(product.name, 24);
  const heading = lines(brand, 28);
  const file = `${product.id}.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720" role="img" aria-labelledby="title description">
  <title id="title">${escape(brand)} ${escape(product.name)} — ${escape(volume)}</title>
  <desc id="description">Peptivelo product record. Text identifies the product and size. This is not a packaging photograph or manufacturer artwork.</desc>
  <rect width="720" height="720" rx="24" fill="#F7F7F2"/>
  <path d="M56 116H664M56 570H664" stroke="#D5E0D8" stroke-width="2"/>
  <g font-family="Arial, sans-serif" fill="#123D35">
    <text x="56" y="77" font-size="16" letter-spacing="3">PEPTIVELO / PRODUCT RECORD</text>
    ${heading.map((line, index) => `<text x="56" y="${172 + index * 29}" font-size="22">${escape(line)}</text>`).join("\n")}
    ${name.map((line, index) => `<text x="56" y="${268 + index * 48}" font-size="36" font-weight="600">${escape(line)}</text>`).join("\n")}
    <text x="56" y="538" font-size="28">${escape(volume)}</text>
    <text x="56" y="623" font-size="19">Name and size for identification</text>
    <text x="56" y="658" font-size="16">Not a packaging photograph</text>
  </g>
</svg>`;
  await fs.writeFile(path.join(output, file), svg);
  const previous = path.resolve(
    root,
    "public",
    product.image.replace(/^\//, ""),
  );
  const sourceBoundary =
    path.resolve(root, "public/images/products") + path.sep;
  const archiveTarget = path.resolve(archive, path.basename(previous));
  if (
    !previous.startsWith(sourceBoundary) ||
    !archiveTarget.startsWith(archive + path.sep)
  )
    throw new Error("Unexpected image path");
  if (!previous.startsWith(output + path.sep)) {
    try {
      await fs.access(archiveTarget);
      throw new Error(`Archive already exists: ${archiveTarget}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    // Individual checked paths only. The ignored archive is outside public assets.
    await fs.rename(previous, archiveTarget);
  }
  product.image = `/images/products/records/${file}`;
}
for (const product of catalog.products) {
  const brand = catalog.brands.find((item) => item.id === product.brandId).name;
  await create(
    product,
    brand,
    `${product.volume} ${product.volumeUnit === "ml" ? "mL" : "US fl oz"}`,
  );
}
await create(
  haircare.product,
  haircare.product.brand,
  `${haircare.product.volumeMl} mL`,
);
await fs.writeFile(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
await fs.writeFile(haircareFile, JSON.stringify(haircare, null, 2) + "\n");
console.log(
  "Created 12 owned text records. Previous photographs archived outside public/ and ignored by Git.",
);
