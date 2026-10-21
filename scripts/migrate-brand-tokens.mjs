import fs from "node:fs";
import postcss from "postcss";
const light = { bg: "#F8F7F2", surface: "#FFFFFF", "surface-secondary": "#EFF4F0", text: "#13332F", "text-secondary": "#4E6B72", border: "#D9E4DD", primary: "#0E3D36", "primary-text": "#FFFFFF", "primary-hover": "#15554B", accent: "#C7E0D9", "accent-text": "#0E3D36", focus: "#276D63" };
const dark = { bg: "#0A2925", surface: "#0E3D36", "surface-secondary": "#164B43", text: "#F8F7F2", "text-secondary": "#C7E0D9", border: "#35655B", primary: "#C7E0D9", "primary-text": "#0E3D36", "primary-hover": "#F8F7F2", accent: "#1D5149", "accent-text": "#F8F7F2", focus: "#B7E1D6" };
const tokens = { provenance: "Values transcribed from the manual supplied in chat on 2026-10-20. Interface themes are the manual's proposed extensions, not independently verified original brand assets.", palette: { petroleum: "#0E3D36", "blue-gray": "#4E6B72", sage: "#9BB7A7", aqua: "#C7E0D9", ivory: "#F8F7F2" }, themes: { light, dark }, typography: { heading: "Manrope", body: "Inter" }, radius: { control: "12px", card: "18px", block: "24px" }, spacing: [4, 8, 12, 16, 24, 32, 48, 64] };
fs.mkdirSync("src/styles", { recursive: true });
fs.writeFileSync("src/styles/peptivelo-tokens.json", JSON.stringify(tokens, null, 2) + "\n");
const declarations = (entries) => Object.entries(entries).map(([key, value]) => `  --pv-${key}: ${value};`).join("\n");
fs.writeFileSync("src/styles/peptivelo-tokens.css", `/* Transcribed from the user-supplied manual; semantic extensions are identified in JSON. */
:root {
${declarations(tokens.palette)}
${declarations(light)}
  color-scheme: light;
  --pv-radius-control: 12px;
  --pv-radius-card: 18px;
  --pv-radius-block: 24px;
  --pv-photo-surface: #FFFFFF;
  --pv-backdrop: color-mix(in srgb, var(--pv-petroleum) 68%, transparent);
  --pv-shadow: color-mix(in srgb, var(--pv-petroleum) 12%, transparent);
  --ink: var(--pv-text);
  --secondary: var(--pv-text-secondary);
  --muted: var(--pv-text-secondary);
  --paper: var(--pv-surface);
  --canvas: var(--pv-bg);
  --mineral: var(--pv-surface-secondary);
  --line: var(--pv-border);
  --copper: var(--pv-text-secondary);
  --verified: var(--pv-text);
  --control: var(--pv-surface-secondary);
  --focus: var(--pv-focus);
  --radius: var(--pv-radius-control);
}
:root[data-theme="dark"] {
${declarations(dark)}
  color-scheme: dark;
}
`);
const root = postcss.parse(fs.readFileSync("src/app/globals.css", "utf8"));
const aliases = { "--ink": "text", "--secondary": "text-secondary", "--muted": "text-secondary", "--paper": "surface", "--canvas": "bg", "--mineral": "surface-secondary", "--line": "border", "--copper": "text-secondary", "--verified": "text", "--control": "surface-secondary", "--focus": "focus", "--id-paper": "surface", "--id-canvas": "bg", "--id-ink": "text", "--id-muted": "text-secondary", "--id-line": "border" };
root.walkDecls((d) => {
  if (aliases[d.prop]) { d.value = `var(--pv-${aliases[d.prop]})`; return; }
  const selector = d.parent.selector || "";
  if (/background/.test(d.prop)) d.value = d.value.replaceAll("var(--ink)", "var(--pv-primary)");
  if (d.prop === "color") d.value = d.value.replaceAll("var(--paper)", "var(--pv-primary-text)");
  d.value = d.value.replace(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|\bwhite\b|\bblack\b/gi, (color) => {
    if (selector.includes("::backdrop")) return "var(--pv-backdrop)";
    if (/shadow|filter/.test(d.prop)) return "var(--pv-shadow)";
    if (d.prop === "color") return /^(white|#fff|#ffffff)$/i.test(color) ? "var(--pv-primary-text)" : "var(--pv-text-secondary)";
    if (/outline/.test(d.prop)) return "var(--pv-focus)";
    if (/border/.test(d.prop)) return "var(--pv-border)";
    if (/background/.test(d.prop)) return /hover/.test(selector) && /\.button/.test(selector) ? "var(--pv-primary-hover)" : /^(white|#fff|#ffffff|#fffefa)$/i.test(color) ? "var(--pv-surface)" : "var(--pv-surface-secondary)";
    return "var(--pv-border)";
  });
});
fs.writeFileSync("src/app/globals.css", root.toString());
console.log("Centralized the supplied palettes and migrated legacy literal colors to semantic references.");
