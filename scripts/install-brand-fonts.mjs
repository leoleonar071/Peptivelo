import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
const css = readFileSync("docs/research/peptivelo-font-response.css", "utf8");
const blocks = [...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map((match) => match[1]);
if (blocks.length !== 2) throw new Error("Expected one Latin variable face for each requested family");
let localCss = "/* Requested brand typography. Self-hosted Google Fonts; licenses alongside assets. */\n";
for (const block of blocks) {
  const family = block.match(/font-family: '([^']+)'/)[1];
  const remote = block.match(/url\(([^)]+)\)/)[1];
  if (!remote.startsWith("https://fonts.gstatic.com/")) throw new Error("Unexpected font host");
  const file = `${family.toLowerCase()}-latin.woff2`;
  const response = await fetch(remote);
  if (!response.ok) throw new Error(`Font request failed: ${response.status}`);
  writeFileSync(`public/fonts/${file}`, Buffer.from(await response.arrayBuffer()));
  localCss += block.replace(remote, `/fonts/${file}`) + "\n";
  const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family.toLowerCase()}/OFL.txt`);
  if (!license.ok) throw new Error("Font license unavailable");
  writeFileSync(`public/fonts/${family}-OFL.txt`, await license.text());
}
mkdirSync("public/brand", { recursive: true });
copyFileSync("C:/Users/ACER/AppData/Local/Temp/codex-clipboard-19775aa9-db7b-46c9-b24f-3e8f29f7a24d.png", "public/brand/peptivelo-isotype.png");
writeFileSync("src/app/brand-typography.css", localCss + `
:root { --font-body: "Inter", Arial, sans-serif; --font-heading: "Manrope", "Inter", Arial, sans-serif; }
body, input, select, textarea, button, nav, table { font-family: var(--font-body); }
h1, h2, h3, h4, h5, h6, .brand { font-family: var(--font-heading); }
.brand .brand-mark { background: transparent; border-radius: 0; width: 44px; height: 44px; }
.brand-mark img { display: block; width: 44px; height: 40px; object-fit: contain; }
.brand-wordmark { font-family: var(--font-heading); font-weight: 700; }
`);
console.log("Copied the supplied isotype without alteration; downloaded licensed Inter and Manrope variable Latin fonts.");
