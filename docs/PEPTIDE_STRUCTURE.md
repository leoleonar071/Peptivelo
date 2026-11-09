# Ampliación estructural de Peptivelo

Auditoría del repositorio: 9 de noviembre de 2026. No se ha desplegado esta modificación ni redactado contenido científico, médico o comercial. No se han descargado ni generado imágenes.

## Arquitectura encontrada antes de editar

Next.js App Router con React, TypeScript y Zod; también dispone de una compilación Vinext. El contenido vive en JSON (`src/data`) y módulos TypeScript (`src/lib/library.ts`, `src/editorial`). Prisma es una preparación de persistencia, no el CMS que alimenta actualmente estas páginas. No se ha añadido un CMS.

Había tres áreas activas: Skin & cosmetics (`/skincare/`), Hair & scalp (`/haircare/`) y Health & research (`/topics/health-research/`). Había 13 áreas planificadas, además de navegación agrupada Explore topics, biblioteca Peptides A–Z con filtros, tarjetas y página de categoría compartidas.

Se conservan los tres destinos canónicos encontrados:

| Entrada | Registro existente | Ruta conservada | Estado original |
| --- | --- | --- | --- |
| GHK-Cu | skin:copper-tripeptide-1 | /skincare/ingredients/copper-tripeptide-1/ | published |
| Retatrutide | library:retatrutide | /library/retatrutide/ | draft |
| BPC-157 | library:bpc-157 | /library/bpc-157/ | draft |

GHK-Cu se vincula al perfil existente; no se iguala con todos los ingredientes que contienen cobre. Los borradores documentales de `src/editorial/metabolism-batch.ts` se conservan y se referencian desde las entradas correspondientes; no se copian ni se publican. Semaglutide y Tirzepatide no tenían una página propia. TB-500 solo aparecía en planificación, separado de Thymosin beta 4. No se han cambiado URLs ni hacen falta redirecciones.

También existían el artículo introductorio `/library/peptide-categories/`, guías cosméticas y comparaciones. El sitemap dependía del registro de publicación, las aprobaciones ligadas a una revisión exacta y `SITE_INDEXABLE`. No había aprobaciones humanas registradas. Existía una excepción histórica que permitía abrir 18 rutas de borradores.

## Categorías preparadas sin duplicación

No se crean IDs de categoría redundantes. Se reutilizan los seis ámbitos solicitados y se conservan todos los slugs e IDs:

| Categoría solicitada | ID existente | Slug conservado | Disponibilidad |
| --- | --- | --- | --- |
| Skin & Cosmetics | skin | skin-cosmetics | Pública: contenido publicado existente |
| Hair & Scalp | hair | hair-scalp | Fuera del menú hasta publicar contenido |
| Weight & Metabolism | metabolism | metabolism-appetite | Planificada |
| Recovery & Experimental Research | repair | tissue-repair-research | Planificada |
| Nutrition & Supplements | food | food-derived-peptides | Planificada |
| Cognitive & Longevity Research | nervous | brain-nervous-system | Planificada |

Health & research se conserva como ámbito transversal; queda fuera del menú mientras solo haya borradores. Se conservan también los otros nueve ámbitos planificados. Las etiquetas de las cuatro áreas existentes se adaptan a los nombres solicitados; su clasificación temática no acredita autorización ni eficacia. El menú y los filtros públicos muestran únicamente áreas con contenido publicado; no se añaden elementos al menú principal. Las plantillas de categoría ya admiten perfiles, productos, guías, investigación y comparaciones, omitiendo grupos vacíos.

## Inventario de ingredientes y productos conservados

Hay 21 ingredientes cosméticos, 11 productos faciales, 2 ingredientes capilares y un producto capilar. No se han creado productos comerciales.

### Ingredientes faciales

- Copper Tripeptide-1 — `/skincare/ingredients/copper-tripeptide-1/` — published.
- Acetyl Hexapeptide-8 — `/skincare/ingredients/acetyl-hexapeptide-8/` — published.
- Tripeptide-29 — `/skincare/ingredients/tripeptide-29/` — published.
- Palmitoyl Tripeptide-1 — `/skincare/ingredients/palmitoyl-tripeptide-1/` — published.
- Palmitoyl Tetrapeptide-7 — `/skincare/ingredients/palmitoyl-tetrapeptide-7/` — published.
- Tripeptide-1 Copper Acetate — `/skincare/ingredients/tripeptide-1-copper-acetate/` — published.
- Tripeptide-1 Acetate — `/skincare/ingredients/tripeptide-1-acetate/` — published.
- Acetyl Tetrapeptide-2 — `/skincare/ingredients/acetyl-tetrapeptide-2/` — published.
- Palmitoyl Tripeptide-38 — `/skincare/ingredients/palmitoyl-tripeptide-38/` — published.
- Tetrapeptide-21 — `/skincare/ingredients/tetrapeptide-21/` — published.
- Copper Palmitoyl Heptapeptide-14 — `/skincare/ingredients/copper-palmitoyl-heptapeptide-14/` — published.
- Heptapeptide-15 Palmitate — `/skincare/ingredients/heptapeptide-15-palmitate/` — published.
- Palmitoyl sh-Hexapeptide-13 Serine SP Amide — `/skincare/ingredients/palmitoyl-sh-hexapeptide-13-serine-sp-amide/` — published.
- Carnosine — `/skincare/ingredients/carnosine/` — published.
- Palmitoyl Pentapeptide-4 — `/skincare/ingredients/palmitoyl-pentapeptide-4/` — published.
- Pentapeptide-18 — `/skincare/ingredients/pentapeptide-18/` — published.
- Acetyl Tetrapeptide-5 — `/skincare/ingredients/acetyl-tetrapeptide-5/` — published.
- sh-Polypeptide-121 — `/skincare/ingredients/sh-polypeptide-121/` — published.
- Dipeptide Diaminobutyroyl Benzylamide Diacetate — `/skincare/ingredients/dipeptide-diaminobutyroyl-benzylamide-diacetate/` — published.
- Oligopeptide-68 — `/skincare/ingredients/oligopeptide-68/` — published.
- Palmitoyl Tripeptide-8 — `/skincare/ingredients/palmitoyl-tripeptide-8/` — published.

### Productos registrados

- The Ordinary Multi-Peptide + Copper Peptides 1% Serum — `ordinary-copper` — published.
- NIOD Copper Amino Isolate Serum 3 1:1 (CAIS3) — `niod-cais3` — published.
- The Ordinary Multi-Peptide + HA Serum — `ordinary-ha` — published.
- The Ordinary Matrixyl 10% + HA — `ordinary-matrixyl` — published.
- The Ordinary Argireline Solution 10% — `ordinary-argireline` — published.
- Geek & Gorgeous Power Peptides — `geek-power-peptides` — published.
- Naturium Multi-Peptide Advanced Serum — `naturium-multi-peptide` — published.
- Timeless Skin Care Matrixyl Synthe’6 Serum — `timeless-synthe6` — published.
- Medik8 Liquid Peptides — `medik8-liquid-peptides` — published.
- COSRX The 6 Peptide Skin Booster Serum Mini — `cosrx-six-mini` — published.
- SkinCeuticals P-TIOX Anti-Wrinkle Serum — `skinceuticals-ptiox` — published.
- The Ordinary Multi-Peptide Serum for Hair Density — `ordinary-hair-density` — draft.

- Ingrediente capilar: Biotinoyl Tripeptide-1 — `/haircare/ingredients/biotinoyl-tripeptide-1/` — draft.
- Ingrediente capilar: Acetyl Tetrapeptide-3 — `/haircare/ingredients/acetyl-tetrapeptide-3/` — draft.

## Modelo y plantilla

`src/lib/peptide-schema.ts` valida ID, nombre, slug, identidad pendiente, categoría principal y adicionales, etiquetas, estado editorial, contenido por sección, FAQ, fuentes, fechas, SEO, imágenes y relaciones. Contempla jurisdicción, preparación concreta, clasificación documentada, fecha y referencias para cada declaración regulatoria; no se ha asignado ninguna. Matrixyl 3000, Argireline, CJC-1295, TB-500 y la etiqueta Bremelanotide (PT-141) mantienen identidad pendiente sin resolver alias automáticamente.

Peptide y Product son entidades distintas. Las asociaciones se resuelven por IDs: productos explícitos y productos que contienen los ingredientes vinculados. Las relaciones existentes con ingredientes, productos y comparaciones se reutilizan, sin copiar catálogos ni crear equivalencias nominales. Las imágenes tienen fuente, crédito, licencia, URL original, archivo local optimizado, alt, cambios con IA, atribución y aprobación. El mismo contrato admite imágenes futuras de productos mediante `editorialImages`; las imágenes existentes no se modifican.

`PeptideProfile` ofrece hero y las diez secciones posteriores solicitadas. Las secciones sin contenido se omiten; sin imagen aprobada queda el encabezado tipográfico de la marca, sin fotografías de sustitución. El texto es plano y React lo escapa; no permite HTML arbitrario. Hay CSS adaptable con las variables visuales existentes.

La ruta `/peptides/[slug]/` solo sirve registros nuevos publicados, con contenido validado, categoría activa y aprobaciones editorial y científica de la revisión exacta. Las tres fichas existentes mantienen sus componentes y rutas. `/peptides/ghk-cu/`, `/peptides/bpc-157/` y `/peptides/retatrutide/` no crean duplicados. Las nuevas fichas tienen canonical, SEO y Open Graph editables, breadcrumbs y únicamente marcado BreadcrumbList. No se añade marcado médico ni Product.

## Edición progresiva

1. Editar `src/data/peptides/<slug>.json`. Los seis prioritarios y los 17 futuros tienen archivos individuales. Las listas vacías son espacios editoriales internos, no datos ficticios.
2. Para una ficha vinculada, completar el contenido en su archivo original (`src/data/catalog.json` para el ingrediente de GHK-Cu; `src/lib/library.ts` para los dos briefs). `existingDocumentId` y `canonicalPath` preservan esa autoridad. El estado del documento original manda sobre el estado de preparación del registro nuevo.
3. Para añadir una entrada nueva, copiar la estructura de un JSON de borrador, asignar un ID estable y slug único, y mantener `existingDocumentId: null`. Ejecutar `npm run editorial:prepare`; regenera automáticamente los imports y la lista pública. No hay que editar navegación ni componentes.
4. Mantener `draft` mientras se redacta; usar `in-review` para revisión; `archived` retira acceso y descubrimiento. `published` por sí solo no abre una ficha nueva: exige overview, metodología, referencias, identidad verificada, fechas, SEO y aprobaciones humanas sobre la revisión exacta en `src/data/publication-reviews.json`.
5. Antes de publicar un área planificada, revisar su introducción y contenido, y activar explícitamente su definición en `topic-registry.ts` con su `href`. La preparación no activa categorías automáticamente. Revisar los criterios existentes de `knowledge-model.ts`.
6. Los comandos dev, test, typecheck y build generan `src/data/public-peptides.json`: solo incluye registros nuevos published con ambas aprobaciones vigentes. Los JSON de trabajo no se importan desde los componentes del navegador. No editar manualmente los dos archivos generados.
7. Ejecutar comprobaciones y revisar el resultado antes de desplegar. `SITE_INDEXABLE` continúa siendo un interruptor independiente. Una aprobación caduca cuando cambia el registro. El sitemap usa solo destinos indexables y añade la fecha disponible.

No se ha creado una URL de preview pública ni autenticación improvisada. La revisión de borradores se realiza en los archivos internos; cualquier preview futura necesitará autenticación del proyecto.

## Cambio deliberado de acceso

La excepción histórica de publicación se ha desactivado: Draft e In Review no se sirven públicamente, incluso en rutas antiguas. Los 18 destinos históricos siguen registrados y su contenido y referencias siguen intactos, pero responden 404 mientras sean borradores. Esto afecta los briefs de BPC-157 y retatrutida, las fichas capilares, comparaciones editoriales y guías que aún eran draft. Las fichas publicadas existentes siguen disponibles. Hair & scalp y Health & research dejan de ofrecer páginas vacías y enlaces públicos a borradores. No se ha promovido ningún texto a Published ni supuesto una revisión humana.

## Pendientes del propietario

- Aportar y revisar el contenido de las nuevas fichas; no se ha redactado ninguna afirmación.
- Verificar identidades, nombres comerciales y relaciones antes de documentarlos.
- Completar introducciones de categoría y aprobar su activación cuando haya contenido útil.
- Incorporar fuentes, declaraciones regulatorias por jurisdicción y fechas reales.
- Incorporar fotografías autorizadas, licencias y atribuciones; todas las listas nuevas de imágenes están vacías.
- Revisar y aprobar los borradores históricos antes de reabrir sus URLs.
- Completar SEO al publicar y las aprobaciones de cada revisión; después decidir indexación y despliegue.

## Archivos principales

- Datos: `src/data/peptides/*.json` (23), `src/data/public-peptides.json` (generado).
- Modelo y acceso: `src/lib/peptide-schema.ts`, `peptides.ts`, `peptide-records.ts` (generado), `public-peptides.ts`, `editorial-status.ts`, `publication-policy.ts`, `publication-registry.ts`.
- Vista: `src/app/peptides/[slug]/page.tsx`, `src/components/peptide-profile.tsx`, `editorial-image.tsx`, `src/styles/peptide-profile.css`, import en layout.
- Integración: registros de categorías, navegación y búsqueda, sitemap; modelos de catálogo, guías y haircare; protección de los hubs capilar y de investigación; relaciones de TopicLanding.
- Preparación: `scripts/prepare-peptides.mjs` y scripts npm.
- Verificación: `tests/peptide-structure.test.ts` y pruebas existentes de publicación, temas, búsqueda y exploración actualizadas para excluir borradores.

## Verificación realizada

- `npm test -- --reporter=dot`: 30 archivos, 139 pruebas correctas.
- `npx playwright test e2e/peptide-structure.spec.ts`: seis pruebas correctas en escritorio, tableta y móvil; comprueban 404 de borradores y alias duplicados, preservación del perfil canónico de GHK-Cu, exclusión del sitemap, filtrado público y ausencia de desbordamiento horizontal en la biblioteca. No se ha ejecutado toda la batería e2e histórica, cuyas pruebas de lectura de borradores requieren adaptación a la nueva política.
- `npm run build`: compilación Next.js y TypeScript correctos.
- `npm run build:vinext`: compilación correcta, con avisos del empaquetador sobre sourcemaps e imports dinámicos.
- `npm run lint`: cero errores; un aviso previo sobre `<img>` en `src/components/discovery.tsx`.
- `npm run audit:content`: 545 referencias comprobadas; sin referencias desconocidas ni imágenes existentes faltantes. No comprueba hechos científicos ni derechos de imagen.
- Los nuevos registros editoriales no aparecen en los chunks públicos de Next.js comprobados. Los nuevos JSON están vacíos de contenido; no se ha habilitado preview sin autenticación.
- La plantilla de ficha nueva se comprueba por renderizado estático y tipos; no existe una ficha nueva publicada para una revisión visual pública completa. Las pruebas responsive se ejecutan sobre la biblioteca real.

No hay despliegue, cambios de base de datos ni nuevas dependencias.
