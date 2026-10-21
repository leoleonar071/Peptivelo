import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";

// Export the current wording for a human reviewer; never invent a decision.
const directory = process.argv[2] || "docs/review-first-batch";
if (["snapshot.json", "RESPUESTAS.md", "HOJA_EVALUACION.md", "manifest.json"].some((file) => existsSync(`${directory}/${file}`))) throw new Error("Review export already exists. Preserve its responses and use a new output directory for another version.");
mkdirSync(directory, { recursive: true });
const read = (path) => readFileSync(path, "utf8");
const catalog = JSON.parse(read("src/data/catalog.json"));
const evaluations = JSON.parse(read("src/data/comparison-evaluations.json"));
const evidence = JSON.parse(read("src/data/evidence.json"));
const comparisons = catalog.comparisons.filter((c) => ["niod-vs-ordinary", "ordinary-ha-vs-copper"].includes(c.id));
const products = catalog.products.filter((p) => ["niod-cais3", "ordinary-ha", "ordinary-copper"].includes(p.id));
const ids = new Set(products.flatMap((p) => p.ingredientIds));
const ingredients = catalog.ingredients.filter((i) => ids.has(i.id));
const claims = [];
function add(page, section, text, sourceIds = [], kind = "Interpretación editorial", priority = "Normal") {
  claims.push({ id: `R${String(claims.length + 1).padStart(3, "0")}`, page, section, text, sourceIds, kind, priority });
}
add("/", "Presentación", "Compare ingredients, price per mL, and the information that’s missing. Explore the recorded labels and their sources; scientific interpretations remain drafts pending review.");
add("/", "Metodología", "We check manufacturer labels and show what’s missing. Label verification is not independent laboratory testing, and ingredient overlap does not establish equal results.");
const chooserSource = read("src/app/skincare/choose/page.tsx");
const ast = ts.createSourceFile("choose.tsx", chooserSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let paths = [];
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "paths" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
    paths = node.initializer.elements.map((item) => Object.fromEntries(item.properties.filter(ts.isPropertyAssignment).map((p) => [p.name.getText(ast), ts.isStringLiteral(p.initializer) ? p.initializer.text : ""])));
  }
  ts.forEachChild(node, visit);
}
visit(ast);
if (paths.length !== 3) throw new Error("Chooser structure changed: refresh the extraction before sharing");
for (const path of paths) for (const key of ["title", "intro", "reason", "limit", "question"]) add("/skincare/choose/", `${path.title}: ${key}`, path[key], [], "Ruta de lectura; evaluar expectativas");
for (const c of comparisons) {
  const page = `/skincare/compare/${c.slug}/`;
  for (const key of ["buyerQuestion", "editorialSummary", "documentedDifferences", "limitations"]) add(page, key, c[key], key === "documentedDifferences" ? c.comparedProductIds.map((id) => products.find((p) => p.id === id).sourceId) : []);
  for (const key of ["practicalDifferences", "decisionNotes"]) for (const note of c[key]) add(page, `${key}: ${note.title}`, note.text, note.sourceIds || []);
  for (const question of c.questions) add(page, question.question, question.answer, question.sourceIds || []);
  if (c.researchContext) add(page, "researchContext (registro de catálogo; puede no estar visible en el lector)", c.researchContext.text, c.researchContext.sourceIds);
  const evaluation = evaluations.find((e) => e.comparisonId === c.id);
  for (const item of evaluation.decisionSummary ?? []) add(page, item.label, item.text, item.sourceIds, `Resumen: ${item.basis}`, "Alta");
  add(page, "Resumen de evaluación", evaluation.summary);
  for (const section of evaluation.sections) {
    add(page, `${section.title}: conclusión`, section.conclusion, [...new Set(section.paragraphs.flatMap((p) => p.sourceIds))]);
    for (const p of section.paragraphs) add(page, section.title, p.text, p.sourceIds, p.kind === "evidence" ? "Investigación" : "Interpretación editorial", p.sourceIds.includes("cir-acetyl") || /copper.*name|exact.*name/i.test(p.text) ? "Alta" : "Normal");
  }
  add(page, "Procedencia de etiqueta", evaluation.labelContext, evaluation.labelSourceIds, "Etiqueta comercial");
}
for (const ingredient of ingredients) {
  const page = `/skincare/ingredients/${ingredient.slug}/`;
  add(page, "Resumen", ingredient.education.summary, ingredient.sourceIds, "Resumen editorial", "Alta");
  for (const key of ["whatItIs", "purpose", "evidence", "precautions"]) {
    const value = ingredient.education[key];
    add(page, key, value.text, value.sourceIds, key === "evidence" ? ingredient.education.evidence.label : "Explicación con fuentes", key === "precautions" || /copper|acetyl-hexapeptide/.test(ingredient.id) ? "Alta" : "Normal");
  }
  add(page, "Conclusión", ingredient.education.takeaway);
}
const sourceIds = new Set(claims.flatMap((claim) => claim.sourceIds));
if ([...sourceIds].some((id) => !catalog.sources.some((s) => s.id === id))) throw new Error("Unknown source in reviewer packet");
const snapshot = { createdAt: new Date().toISOString(), status: "Revisión cualificada pendiente; sin dictamen", pages: [...new Set(claims.map((c) => c.page))], claims, products, ingredients, comparisons, evaluations: evaluations.filter((e) => comparisons.some((c) => c.id === e.comparisonId)), sources: catalog.sources.filter((s) => sourceIds.has(s.id)), evidence: evidence.filter((e) => sourceIds.has(e.sourceId)), interfaceSources: { home: read("src/app/page.tsx"), chooser: chooserSource } };
const serialized = JSON.stringify(snapshot, null, 2) + "\n";
writeFileSync(`${directory}/snapshot.json`, serialized);
const digest = createHash("sha256").update(serialized).digest("hex");
const esc = (text) => String(text).replaceAll("|", "\\|").replaceAll("\n", " ");
let sheet = `# Hoja de evaluación por afirmación\n\nVersión: ${snapshot.createdAt}. SHA-256 de snapshot.json: ${digest}.\n\n${snapshot.pages.length} páginas; ${claims.length} unidades de revisión. Ninguna decisión está completada. Esta exportación incluye texto del catálogo que puede estar oculto o resumido en la interfaz; debe comprobarse también la página renderizada. Las etiquetas de tipo de apoyo reflejan el registro actual, no la aprobación del especialista.\n\nCompletar una fila por ID en RESPUESTAS.md. Decisiones permitidas: mantener / corregir / retirar / no evaluable. No evaluable no equivale a aprobado. Las fuentes de una conclusión son candidatas: el revisor debe comprobar que sostienen su redacción.\n`;
for (const page of snapshot.pages) {
  sheet += `\n## ${page}\n\n| ID | Prioridad | Apartado y texto exacto en inglés | Apoyo registrado |\n| --- | --- | --- | --- |\n`;
  for (const claim of claims.filter((c) => c.page === page)) sheet += `| ${claim.id} | ${claim.priority} | **${esc(claim.section)}** — ${esc(claim.text)} | ${esc(claim.kind)}; ${claim.sourceIds.length ? claim.sourceIds.join(", ") : "sin cita directa; evaluar interpretación"} |\n`;
}
sheet += "\n## Registro de fuentes\n\n";
for (const source of snapshot.sources) sheet += `- **${source.id}**: [${source.title}](${source.url}). Tipo: ${source.sourceType}. Fecha registrada: ${source.accessedAt}. No equivale a revisión del texto completo.\n`;
sheet += "\nLos límites de acceso, financiación y contexto se incluyen en snapshot.json y en ../SCIENTIFIC_REVIEW_FIRST_BATCH.md. Las afirmaciones sin fuente académica no deben convertirse en promesas científicas por proceder de una etiqueta.\n";
writeFileSync(`${directory}/HOJA_EVALUACION.md`, sheet);
let answers = `# Respuestas del especialista\n\nVersión revisada: snapshot.json SHA-256 ${digest}\n\nNombre: pendiente\n\nCredenciales y forma de verificación: pendiente\n\nEspecialidad y límites de competencia: pendiente\n\nRelaciones comerciales / conflictos: pendiente\n\nFecha de revisión: pendiente\n\nPermiso para publicar nombre, credenciales y alcance revisado: pendiente\n\nNo incluir datos de pacientes. Añadir solo credenciales profesionales necesarias; compartir por un canal acordado.\n\n## Dictamen por afirmación\n\nCompletar todas las filas de alcance contratado. Si no se accede al artículo necesario o falta competencia para evaluarlo, registrar no evaluable y la acción necesaria.\n\n| ID | Decisión | Motivo y pasaje exacto de la fuente | Redacción propuesta en inglés | Límites y acción pendiente |\n| --- | --- | --- | --- | --- |\n`;
for (const claim of claims) answers += `| ${claim.id} | Pendiente | | | |\n`;
answers += "\n## Decisión por página\n\nEstados: pendiente / corregir / apta en el alcance revisado. Una aprobación queda vinculada a esta versión y no certifica eficacia o seguridad del producto ni cubre futuras modificaciones.\n\n| Ruta | Estado | IDs pendientes o cambios exigidos | Fecha y revisor responsable |\n| --- | --- | --- | --- |\n";
for (const page of snapshot.pages) answers += `| ${page} | Pendiente | | |\n`;
answers += "\n## Cierre editorial posterior\n\nRegistrar quién aplicó los cambios, qué versión resultó y qué cambios requieren nueva revisión. La revisión científica no cambia automáticamente los indicadores públicos, la indexación ni las autorizaciones de imágenes.\n";
writeFileSync(`${directory}/RESPUESTAS.md`, answers);
writeFileSync(`${directory}/manifest.json`, JSON.stringify({ createdAt: snapshot.createdAt, snapshotSha256: digest, pageCount: snapshot.pages.length, claimCount: claims.length, decisions: "All pending", warning: "Exporter refuses to overwrite existing packet files. Preserve completed responses and choose a new output directory for another version." }, null, 2) + "\n");
console.log(`${snapshot.pages.length} pages; ${claims.length} claims; snapshot SHA-256 ${digest}. No reviewer decisions or outreach.`);
