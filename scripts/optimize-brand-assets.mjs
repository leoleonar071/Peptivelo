import sharp from "sharp";
import { stat } from "node:fs/promises";

// Resize the approved artwork only; preserve the original, alpha and colours.
// Three times the 44px display width keeps the header crisp on dense screens.
const original = "public/brand/peptivelo-isotype.png";
const header = "public/brand/peptivelo-isotype-header.webp";
const favicon = "public/brand/peptivelo-isotype-icon.png";

await sharp(original).resize({ width: 132 }).webp({ lossless: true }).toFile(header);
await sharp(original).resize({ width: 64, height: 64, fit: "contain", background: "#00000000" }).png({ compressionLevel: 9 }).toFile(favicon);

for (const file of [original, header, favicon]) {
  console.log(`${file}: ${(await stat(file)).size} bytes`);
}
