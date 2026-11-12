# Validación editorial de Peptivelo — 9 de noviembre de 2026

## Diagnóstico de rutas

Se comprobaron por HTTP 53 destinos locales (Next.js en 3100) y los mismos 53 destinos en https://peptivelo.com: 106 comprobaciones, ninguna diferencia respecto al estado esperado. Evidencia fechada: `routes.json`. Incluye 11 productos publicados, 21 ingredientes publicados, tres hubs y 18 borradores históricos. La comprobación de producción es una observación HTTP; no identifica por sí sola el commit desplegado.

Los 18 borradores históricos devuelven 404 tanto localmente como en producción. No son errores accidentales de enrutamiento: son retiros por estado editorial. Su efecto sobre enlaces externos es real y debe resolverse antes de considerar terminada la transición editorial. No se han restaurado mediante cambios de estado ni redirecciones a destinos no equivalentes. No se ha eliminado ningún contenido.

| Ruta histórica | Local | Producción | Acción pendiente |
| --- | --- | --- | --- |
| `/compare/the-ordinary-multi-peptide-ha-vs-copper/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/niod-cais3-vs-the-ordinary/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/the-ordinary-argireline-vs-multi-peptide-ha/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/geek-gorgeous-power-peptides-vs-the-ordinary-ha/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/naturium-multi-peptide-vs-the-ordinary-ha/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/timeless-synthe6-vs-the-ordinary-matrixyl/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/medik8-liquid-peptides-vs-the-ordinary-ha/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/cosrx-six-peptide-vs-the-ordinary-copper/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/compare/skinceuticals-ptiox-vs-the-ordinary-ha/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/skincare/guides/matrixyl-3000-vs-synthe6/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/skincare/guides/peptide-percentages-explained/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/library/peptide-categories/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/library/retatrutide/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/library/bpc-157/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/haircare/products/the-ordinary-hair-density/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/haircare/ingredients/biotinoyl-tripeptide-1/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |
| `/haircare/ingredients/acetyl-tetrapeptide-3/` | 404 | 404 | Revisión editorial del contenido existente antes de reabrir |

La ruta canónica de GHK-Cu `/skincare/ingredients/copper-tripeptide-1/` responde 200. Las páginas nuevas vacías siguen inaccesibles. Hair & Scalp y Health & Research continúan fuera del menú al no disponer de contenido publicado. No se crean categorías, fichas ni cambios de estado en esta fase.

## Vista privada local

Arranque: `npm run editorial:preview`. Abre `http://127.0.0.1:3102/editorial-preview/ghk-cu/`. Usuario: `editor`. La contraseña aleatoria está en `.env.editorial-preview.local` (archivo ignorado por Git), en la variable `EDITORIAL_PREVIEW_TOKEN`. No se incluye la contraseña en este informe ni en el código. Cada arranque la cambia. El servidor escucha solo en loopback; no es una URL compartible a distancia.

El acceso requiere HTTP Basic con token aleatorio de 256 bits y el interruptor explícito `EDITORIAL_PREVIEW_ENABLED=true`. La página vuelve a comprobar credenciales en servidor además del proxy. Respuesta anónima observada: 401; autenticada: 200; no-store y noindex/nofollow/noarchive. Sin configuración de preview, el destino responde 404. Ni el flag ni el token se configuran en producción. No usar HTTP Basic sobre HTTP fuera de loopback; una preview remota requeriría HTTPS y un control de acceso del alojamiento. No se ha desplegado esta ruta ni abierto un túnel público.

Para detenerla: Ctrl+C en la terminal que ejecuta el comando. El navegador puede recordar las credenciales hasta cerrar su sesión. La preview no tiene endpoints de escritura ni botones para aprobar o publicar. No altera sitemap, listados ni aprobaciones. Las pruebas privadas se ejecutan con `npx playwright test --config playwright.editorial.config.ts --workers=2` después de arrancar la preview.

## Piloto GHK-Cu: edición sin sobrescribir

La pantalla muestra dos bloques: el contenido canónico existente (desde el catálogo) y las secciones en preparación (desde el JSON del péptido). Al final permite inspeccionar todos los campos como JSON. El contrato completo se comprueba con Zod. La prueba automatizada rellena campos en una copia en memoria y confirma que ni el catálogo ni el registro original cambian.

1. Editar solamente `src/data/peptides/ghk-cu.json`, manteniendo `id`, `existingDocumentId` y `canonicalPath`. Añadir únicamente el contenido que aporte y revise el propietario en las listas de secciones, FAQ, referencias, imágenes y SEO. `sourceIds` debe apuntar a fuentes declaradas dentro del mismo JSON. Las listas pueden seguir vacías.
2. Ejecutar `npm test` y `npm run typecheck`. La preparación automática valida los registros y sigue dejando fuera del manifiesto público las entradas pendientes.
3. Refrescar la preview autenticada; comparar el bloque existente con las secciones en preparación. No hay necesidad de cambiar componentes ni navegar por rutas públicas de borrador.
4. La entrada de GHK-Cu mantiene `draft` como estado de preparación. El perfil original conserva su estado publicado y su advertencia de revisión científica pendiente. No se ha supuesto ninguna nueva revisión.
5. Bloqueo real: las ampliaciones del JSON aún no se aplican automáticamente al renderizador canónico antiguo. Esa separación protege lo existente, pero la publicación final necesita un cambio revisado que incorpore los campos aprobados al perfil existente, con validación de referencias y una nueva revisión exacta. No cambiar el estado del JSON esperando que actualice la página original. No hay una interfaz de edición tipo CMS; la edición actual es por JSON con validación y preview.

## Información y fuentes pendientes para GHK-Cu

Este es un diagnóstico documental del repositorio; no es una revisión científica de las fuentes ni una conclusión sobre eficacia o seguridad.

| Campo o tarea | Situación encontrada | Qué debe aportar/revisar el propietario |
| --- | --- | --- |
| Identidad y alcance | Perfil cosmético Copper Tripeptide-1 vinculado; identidad de ampliación pendiente | Definición y alcance documentados; resolver formas, nombres y contextos sin equivalencias automáticas |
| Overview / How it works | JSON nuevo vacío; explicaciones breves existentes preservadas | Texto propio y fuentes primarias que respalden cada afirmación que se quiera incorporar |
| Research & Evidence | La propia ficha indica que falta revisión de eficacia tópica | Búsqueda documentada, criterios de selección, acceso al texto completo, diseño, formulación, población, resultados y limitaciones por estudio |
| Safety & Regulatory | Notas existentes; sin registros estructurados por jurisdicción en el JSON | País, preparación, fecha y fuente oficial para cada declaración; revisión de la separación entre contextos cosméticos y otros |
| Productos | Dos relaciones por INCI: The Ordinary y COSRX mini | Confirmación de etiqueta, mercado, tamaño y formulación; no transferir evidencia entre ingredientes o fórmulas |
| Referencias | Cuatro fuentes existentes, consultadas en octubre | Reconsultar alcance/acceso y registrar páginas o apartados utilizados, conflictos de interés y fecha real de acceso |
| Metodología y revisión | Sin registro de búsqueda GHK-Cu ni aprobación científica vigente | Método editorial, búsquedas y selección, limitaciones de cobertura, revisor cualificado y fecha únicamente cuando se realicen |
| Imágenes, FAQ, comparaciones y SEO nuevo | Campos vacíos | Material autorizado y preguntas/texto aportados por el propietario; omitir secciones sin contenido |

Fuentes existentes conservadas (no revalidadas científicamente en esta tarea):

- Etiqueta The Ordinary: https://theordinary.com/en-us/multi-peptide-copper-peptides-1-serum-100625.html
- Evaluación CIR citada: https://journals.sagepub.com/doi/10.1177/1091581818807863
- Comunicación FDA citada: https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks
- Precauciones cosméticas FDA citadas: https://www.fda.gov/cosmetics/cosmetic-ingredients/allergens-cosmetics

## Cobertura Open Beauty Facts

Se realizaron 11 consultas de texto, una por producto, primera página de hasta diez candidatos, separadas al menos 6,5 segundos. Las once devolvieron JSON válido; ninguna imagen binaria se solicitó, descargó ni publicó. La búsqueda limitada no permite concluir que los demás productos estén ausentes de toda la base. No hay GTIN verificados en el catálogo de Peptivelo.

Resultado: dos candidatos (2/11), un candidato compatible por nombre/tamaño (1/11), cero coincidencias de identidad verificadas y cero imágenes aprobadas. El candidato COSRX se descarta para la variante mini por diferencia de tamaño.

| Producto | Resultado de consulta | Revisión pendiente |
| --- | --- | --- |
| Multi-Peptide + Copper Peptides 1% Serum | Candidato 0769915233179, 30 ml; foto y metadatos disponibles | Verificar GTIN, mercado, etiqueta y derechos |
| Copper Amino Isolate Serum 3 1:1 (CAIS3) | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Multi-Peptide + HA Serum | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Matrixyl 10% + HA | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Argireline Solution 10% | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Power Peptides | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Multi-Peptide Advanced Serum | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Matrixyl Syntheâ€™6 Serum | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| Liquid Peptides | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |
| The 6 Peptide Skin Booster Serum Mini | Candidato 8809598455658, 150 ml | No corresponde al mini de 50 ml: no utilizar su foto |
| P-TIOX Anti-Wrinkle Serum | Sin candidato en esta consulta | Buscar por GTIN confirmado o ampliar búsqueda manual |

Metadatos guardados en `open-beauty-results.json`: consulta, endpoint, fecha, GTIN candidato, nombre, marca, cantidad, URL de ficha, URL de foto frontal, tamaños, metadatos originales de imágenes, selección de imagen y uploader. El campo creator del producto NO se trata como autor de la foto. En ambos candidatos la foto frontal selecciona imgid 1: uploader declarado `smoothie-app` en The Ordinary y `jaksel` en COSRX. Son colaboradores declarados, no prueba independiente de autoría o titularidad.

Política general consultada: [documentación oficial de la API](https://openfoodfacts.github.io/openfoodfacts-server/api/) y [particularidades de OBF](https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/scanning-cosmetics-pet-food-and-other-products/). La documentación enlaza para imágenes [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), distinta de ODbL para la base y DbCL para contenidos individuales. El JSON distingue política del proyecto de licencia verificada de una foto concreta: versión individual sin confirmar, autor sin verificar y reutilización no aprobada. La página de datos de OBF devolvió aviso para bots al consultarla; no se simula una revisión de sus condiciones específicas.

Antes de incorporar una sola foto: confirmar producto exacto, vincular selección imgid al original/uploader, verificar licencia y atribución aplicables, registrar evidencia y modificaciones previas, comprobar derechos de terceros y aprobar explícitamente. Solo entonces descargar la imagen individual, optimizarla y registrar cambios/atribución y, si procede, las condiciones de compartir adaptaciones. Las URLs de imágenes se guardan como evidencia, no como elementos img públicos ni hotlinks. El resultado externo permanece aislado del catálogo de producción.

## Flujo para las cinco fichas siguientes

| Ficha | Edición y preservación | Dependencias de publicación |
| --- | --- | --- |
| Semaglutide | JSON propio; conservar referencias a metabolismo-batch.ts | Identidad, fuentes, contenido aportado, revisión editorial/científica y categoría preparada |
| Tirzepatide | JSON propio; conservar preparación documental existente | Mismos controles; no copiar autorización de una preparación a otra |
| Retatrutide | JSON de preparación + brief original `/library/retatrutide/` | Revisar el brief original y acordar incorporación sin duplicar canónico |
| BPC-157 | JSON de preparación + brief original `/library/bpc-157/` | Revisión del brief, de sus limitaciones y de referencias, sin protocolos |
| TB-500 | JSON propio, identidad sin verificar | Resolver denominación y relaciones primero; no igualar automáticamente con Thymosin beta 4 |

Para todas: recibir material del propietario → incorporar como draft → validar campos y fuentes → comparar en preview privada → pasar a revisión cuando el contenido esté listo → registrar revisiones reales sobre la versión exacta → decidir publicación. Las categorías planificadas y el interruptor de indexación son controles independientes. No se han cambiado estados ni inventado revisores.

## Bloqueos para cerrar la fase

- Revisión y decisión editorial para los 18 retiros de URLs, con atención a enlaces externos. Su contenido no se perdió, pero ya no está disponible al público.
- Adaptación de pruebas históricas que exigen lectura pública de borradores; no resolver sus fallos publicando esos borradores.
- Integración final revisada de los nuevos campos de GHK-Cu en el renderizador canónico antiguo.
- Aporte de contenido, fuentes y revisión científica cualificada; la preparación técnica no la sustituye.
- Verificación GTIN y derechos por imagen; cero imágenes aprobadas actualmente.
- Preview remota compartible pendiente si se necesita colaboración fuera de este equipo; la local autenticada ya permite revisión.

Ningún catálogo de contenido original, estado de publicación ni archivo de revisiones ha sido modificado. No se ha desplegado ni enviado a GitHub esta fase.

## Resultados de pruebas y límites

- Unitarias: 141 correctas en 31 archivos, incluidas autorización y edición aislada del piloto.
- TypeScript: `tsc --noEmit` y build Next.js correctos.
- Lint: sin errores; permanece el aviso anterior de img en discovery.tsx.
- Suite E2E pública completa: 366 casos; 163 correctos, 192 fallidos y 11 omitidos. Corrida diagnóstica acotada con 12 workers y timeout de 10 segundos. Hay fallos por expectativas históricas sobre borradores públicos y fallos de tiempo que necesitan repetición con límites normales. Detalle por caso en e2e-summary.json. No se atribuyen automáticamente todos los fallos a publicación.
- Preview privada: seis comprobaciones iniciales correctas (autorización, RSC, contenido GHK-Cu, no-store y responsive); se amplió después a los otros cinco workspaces.

La suite E2E histórica no está aprobada. Revisar casos afectados por 404 y repetir pruebas de tiempo por separado antes de una siguiente publicación. No cambiar estados para obtener una batería verde.

### Comprobaciones finales con límites normales

- `npm run build`: correcto; incluye la ruta dinámica de preview, deshabilitada por defecto.
- `npm run build:vinext`: correcto; avisos de sourcemaps del empaquetador, sin error de build.
- `npx playwright test e2e/peptide-structure.spec.ts e2e/accessibility.spec.ts --workers=3`: nueve correctas, cero fallos. Incluye denegación de preview en el servidor normal, borradores/alias inaccesibles, conservación de GHK-Cu, biblioteca responsive y comprobación automática de accesibilidad de rutas clave. La accesibilidad dejó de fallar al repetir con tiempo normal y menor concurrencia; el fallo de la corrida masiva no se interpreta como defecto de accesibilidad demostrado.
- `npx playwright test --config playwright.editorial.config.ts --workers=2`: nueve correctas, cero fallos, en tres tamaños de pantalla. Incluye acceso autenticado a los cinco workspaces siguientes y aislamiento de peticiones anónimas/RSC.
- Archivo de credenciales confirmado como ignorado por Git. No se ha incorporado al catálogo ningún candidato de imagen ni texto de prueba.

- Worker Vinext construido: `npx playwright test --config playwright.vinext.config.ts e2e/peptide-structure.spec.ts --workers=2`: seis correctas, cero fallos. Comprueba también el cierre de la preview por defecto en el runtime Worker. No se ejecutó toda la suite histórica de nuevo en Worker.
