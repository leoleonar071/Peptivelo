import { mkdir, writeFile } from "node:fs/promises";

// Original vector artwork for Peptivelo. No external images or scientific coordinates.
const output = new URL("../public/images/editorial/", import.meta.url);
await mkdir(output, { recursive: true });
const defs = `<defs>
  <linearGradient id="jade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#C7E0D9"/><stop offset=".48" stop-color="#9BB7A7"/><stop offset="1" stop-color="#4E6B72"/></linearGradient>
  <linearGradient id="deep" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4E6B72"/><stop offset="1" stop-color="#0E3D36"/></linearGradient>
  <radialGradient id="pearl" cx=".3" cy=".25" r=".8"><stop stop-color="#F8F7F2"/><stop offset=".5" stop-color="#C7E0D9"/><stop offset="1" stop-color="#69968A"/></radialGradient>
  <radialGradient id="petroleum" cx=".28" cy=".22" r=".85"><stop stop-color="#81B0A1"/><stop offset=".45" stop-color="#276D63"/><stop offset="1" stop-color="#0E3D36"/></radialGradient>
</defs>`;
const svg = (title, desc, content, square = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${square ? 640 : 360}" viewBox="0 0 640 ${square ? 640 : 360}" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${desc} Original conceptual illustration created for Peptivelo; not a verified chemical or anatomical diagram.</desc><metadata>Creator: Codex for Peptivelo. Source: original procedural SVG; scripts/create-home-illustrations.mjs. No third-party imagery or chemical coordinates.</metadata>${defs}${content}</svg>\n`;
const points = [
  [124, 356, 32],
  [187, 274, 42],
  [285, 301, 48],
  [350, 207, 36],
  [441, 252, 50],
  [493, 365, 34],
  [414, 448, 46],
  [302, 423, 32],
  [266, 513, 24],
];
const bonds = points
  .slice(1)
  .map(
    (p, i) =>
      `<path d="M${points[i][0]} ${points[i][1]}L${p[0]} ${p[1]}" stroke="url(#jade)" stroke-width="17" stroke-linecap="round"/>`,
  )
  .join("");
const spheres = points
  .map(
    ([x, y, r], i) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${i % 3 === 0 ? "petroleum" : "pearl"})"/><ellipse cx="${x - r * 0.25}" cy="${y - r * 0.35}" rx="${r * 0.25}" ry="${r * 0.12}" fill="#F8F7F2" opacity=".25" transform="rotate(-35 ${x - r * 0.25} ${y - r * 0.35})"/>`,
  )
  .join("");
await writeFile(
  new URL("peptide-chain-concept.svg", output),
  svg(
    "Connected peptide units — concept",
    "An abstract folded chain of shaded spheres with no atom identities, sequence, bond-order or structural claim.",
    `<circle cx="320" cy="320" r="236" fill="none" stroke="#9BB7A7" stroke-opacity=".32"/><circle cx="320" cy="320" r="190" fill="none" stroke="#9BB7A7" stroke-opacity=".22" stroke-dasharray="2 10"/><path d="M46 320H94M546 320H594M320 46V94M320 546V594" stroke="#9BB7A7"/><ellipse cx="321" cy="548" rx="147" ry="12" fill="#0E3D36" opacity=".07"/>${bonds}${spheres}<circle cx="126" cy="150" r="5" fill="#9BB7A7"/><circle cx="530" cy="474" r="5" fill="#9BB7A7"/>`,
    true,
  ),
);
await writeFile(
  new URL("skin-barrier-concept.svg", output),
  svg(
    "Skin barrier and serum — concept",
    "A serum drop above layered skin, drawn schematically without representing penetration or efficacy.",
    `<ellipse cx="324" cy="288" rx="205" ry="16" fill="#0E3D36" opacity=".06"/><path d="M116 213L320 139L524 213L320 287Z" fill="url(#deep)"/><path d="M116 191L320 117L524 191L320 265Z" fill="url(#jade)"/><path d="M116 169L320 95L524 169L320 243Z" fill="#C7E0D9" stroke="#9BB7A7"/><g fill="none" stroke="#F8F7F2" stroke-width="2" opacity=".8"><path d="M169 167L369 239M219 150L419 221M269 132L469 203M170 188L370 116M220 206L420 134M270 224L470 152"/></g><path d="M324 44C324 44 293 77 293 95A31 31 0 0 0 355 95C355 77 324 44 324 44Z" fill="url(#petroleum)"/><path d="M306 91Q303 107 316 111" fill="none" stroke="#C7E0D9" stroke-width="3" stroke-linecap="round"/><circle cx="504" cy="96" r="32" fill="none" stroke="#9BB7A7" stroke-dasharray="2 6"/>`,
  ),
);
await writeFile(
  new URL("hair-follicle-concept.svg", output),
  svg(
    "Hair and scalp — concept",
    "A simplified scalp cross-section containing a hair shaft and follicle, without depicting treatment or regrowth.",
    `<ellipse cx="320" cy="293" rx="201" ry="12" fill="#0E3D36" opacity=".06"/><path d="M135 137Q215 112 320 137T505 137V268Q415 293 320 268T135 268Z" fill="url(#jade)"/><path d="M135 137Q215 112 320 137T505 137V166Q415 191 320 166T135 166Z" fill="#C7E0D9"/><path d="M135 176Q215 151 320 176T505 176M135 213Q215 188 320 213T505 213" fill="none" stroke="#F8F7F2" stroke-opacity=".5" stroke-width="2"/><path d="M293 135Q283 171 284 218Q287 264 321 263Q359 261 348 223L328 135Z" fill="#EFF4F0" stroke="#69968A" stroke-width="2"/><path d="M318 243C319 198 306 168 312 128C320 84 351 66 347 34" fill="none" stroke="url(#deep)" stroke-width="15" stroke-linecap="round"/><ellipse cx="318" cy="241" rx="15" ry="12" fill="url(#petroleum)"/><g fill="#F8F7F2" opacity=".5"><circle cx="189" cy="225" r="4"/><circle cx="226" cy="238" r="4"/><circle cx="405" cy="222" r="4"/><circle cx="451" cy="235" r="4"/></g>`,
  ),
);
await writeFile(
  new URL("research-observation-concept.svg", output),
  svg(
    "Research and source records — concept",
    "A magnifying lens over abstract connected units beside stacked source records, with no invented data or clinical results.",
    `<ellipse cx="327" cy="288" rx="199" ry="12" fill="#0E3D36" opacity=".06"/><g transform="rotate(-9 296 180)"><rect x="156" y="81" width="269" height="196" rx="12" fill="#9BB7A7"/><rect x="143" y="68" width="269" height="196" rx="12" fill="#C7E0D9" stroke="#9BB7A7"/><rect x="165" y="90" width="77" height="7" rx="3" fill="#4E6B72" opacity=".7"/><path d="M165 118H383M165 137H271M165 220H280M165 236H249" stroke="#69968A" stroke-width="3" opacity=".5"/></g><path d="M393 212L464 275" stroke="url(#deep)" stroke-width="25" stroke-linecap="round"/><circle cx="352" cy="161" r="85" fill="#EFF4F0" stroke="url(#deep)" stroke-width="12"/><circle cx="352" cy="161" r="67" fill="none" stroke="#9BB7A7" stroke-dasharray="2 6"/><path d="M314 171L345 136L381 155L365 193" stroke="#9BB7A7" stroke-width="7"/><circle cx="314" cy="171" r="13" fill="url(#petroleum)"/><circle cx="345" cy="136" r="15" fill="url(#pearl)"/><circle cx="381" cy="155" r="13" fill="url(#petroleum)"/><circle cx="365" cy="193" r="12" fill="url(#pearl)"/>`,
  ),
);
console.log("Created four original Peptivelo SVG illustrations.");
