# Peptivelo — Data & Content Gaps

Auditoría: 21 de octubre de 2026, America/Lima. Snapshot UTC: 2026-10-22T03:04:44.554Z. Código base: `80fa15e`. Sitio: https://peptivelo.com. Solo documentación; sin cambios de producción, base de datos, infraestructura ni despliegue.

## 1. Alcance y criterio de completitud

Completitud documental no equivale a evidencia de eficacia. **Obligatorio**: campo necesario para identificar o sostener lo que la UI afirma; **opcional**: mejora útil cuando hay fuente; **no disponible**: falta real reconocida; **no aplicable**: dato que no corresponde (p.ej., DOI de una etiqueta o cohorte de una guía regulatoria). No convertir desconocido en cero ni en resultado negativo. Los valores y consultas exactas se preservan en [inventario](audit-evidence/data-inventory.json).

## 2. Inventario actual

| Entidad | Cantidad / estado | Persistencia real | Límite |
| --- | --- | --- | --- |
| Skincare products | 11 published | catalog.json | Publicado como perfil documental; no ensayos propios. |
| Ingredients | 21 published; 9 con flag pendiente; 12 sin flag | catalog.json | Ninguna aprobación humana se verificó en esta auditoría. |
| Comparisons | 10 draft | catalog.json + 10 evaluations | 7 label / 3 research; todos borrador. |
| Guides | 2 draft | guides.json | Relacionadas por productIds/comparisonIds; sin revisión aprobada. |
| Library articles | 3 draft en UI | library.ts | Datos de artículo/categoría; no entidad Peptide separada activa. |
| Haircare | 1 producto y 2 ingredientes draft | haircare.json | Datos independientes, sin comparador facial. |
| Sources | 34: 18 manufacturer, 11 research, 5 regulator | catalog.json | Clasificación general; no todos son estudios clínicos. |
| Evidence notes | 30; 8 DOI; 9 design | evidence.json | DOI/diseño no son requisitos de toda fuente. |
| Prices | 10observaciones exact-size /11 productos | catalog.json | USD; disponibilidad heterogénea; sin Market/Offer/Variant normalizados. |
| Barcode mappings | 0 verified | product-codes.ts | QR propio resuelve; GTIN universal no disponible. |


## 3. Matriz por producto

| Producto / ID | Variante | Péptidos seleccionados / IDs | Precio exact-size | Comparaciones | Fuente / fecha | Completitud y límite |
| --- | --- | --- | --- | --- | --- | --- |
| ordinary-copper | 30 ml | 4 / 4 | Sí | 3 | ordinary / 2026-10-20 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| niod-cais3 | 30 ml | 4 / 4 | Sí | 1 | niod / 2026-10-20 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| ordinary-ha | 30 ml | 4 / 4 | Sí | 7 | ordinary-ha / 2026-10-20 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| ordinary-matrixyl | 30 ml | 3 / 3 | Sí | 2 | ordinary-matrixyl / 2026-10-19 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| ordinary-argireline | 30 ml | 1 / 1 | Sí | 1 | ordinary-argireline / 2026-10-19 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| geek-power-peptides | 30 ml | 6 / 6 | Sí | 1 | geek-power-peptides / 2026-10-19 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| naturium-multi-peptide | 30 ml | 3 / 3 | Sí | 1 | naturium-multi-peptide / 2026-10-19 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| timeless-synthe6 | 1 oz | 1 / 1 | Sí | 1 | timeless-synthe6 / 2026-10-19 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| medik8-liquid-peptides | 30 ml | 11 / 11 | Sí | 1 | medik8-liquid-peptides / 2026-10-19 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| cosrx-six-mini | 50 ml | 6 / 6 | No registrado | 1 | cosrx-six / 2026-10-20 | Parcial: etiqueta seleccionada, sin INCI completo estructurado |
| skinceuticals-ptiox | 30 ml | 2 / 2 | Sí | 1 | ptiox-us / 2026-10-20 | Parcial: selección UK, ficha/precio US; no asumir equivalencia |


Todos tienen imagen, volumen, marca, sourceId y fecha. Todos contienen una selección, no un INCI completo verificado almacenado. No tener lista completa no invalida los datos seleccionados: impide concluir equivalencia de la fórmula completa. Los precios se consultaron18–20oct; a fecha 21 de octubre no se etiquetan como viejos por defecto. Falta la observación de COSRX50mL, no una cifra inventada. P-TIOX necesita procedencia por campo para separar selecciónUK de contextoUS.

| Campo de producto | Clasificación | Estado / regla |
| --- | --- | --- |
| ID, marca, nombre, slug, tamaño, unidad | Obligatorio | 11/11; no cambiar IDs sin migración. |
| Mercado/variante exacta | Obligatorio cuando se afirma equivalencia regional/comercial | 0/11 estructurados; US está codificado en copy, no derivado de fuente por campo. |
| INCI completo | Opcional para ficha seleccionada; obligatorio si se anuncia lista completa | 0/11 estructurado; conservar la etiqueta de alcance. |
| Ingredient IDs seleccionados y fuente | Obligatorio para comparación de seleccionados | 11/11 enlazados; no confundir relación con cantidad o beneficio. |
| Claims y porcentajes | Opcional con fuente; no disponible cuando no se divulga | Texto contextual presente; no convertir 10% de mezcla en péptido puro. |
| Fotografía | Opcional, pero derechos obligatorios si se publica | 11/11 imagen; autorización pública pendiente. |
| Precio/vendedor/fecha/tamaño | Opcional; obligatorios juntos si se muestra precio | 10/11 exact-size; disponibilidad actual no verificada de forma uniforme. |
| Comparaciones relacionadas | Opcional | Todos tienen al menos1; ordinary-ha participa en7. |
| Ensayo del producto terminado | Opcional y específico de preparación | No inferirlo desde estudio de ingrediente; cobertura requiere revisión fuente por fuente. |


## 4. Matriz por ingrediente

| Ingrediente | ID | Fuentes | Productos que lo enlazan | Revisión cualificada explícita | Fecha documental |
| --- | --- | --- | --- | --- | --- |
| Copper Tripeptide-1 | copper-tripeptide-1 | 4 | 2 | Pendiente (flag true) | 2026-10-20 |
| Acetyl Hexapeptide-8 | acetyl-hexapeptide-8 | 5 | 7 | Pendiente (flag true) | 2026-10-20 |
| Tripeptide-29 | tripeptide-29 | 3 | 1 | Pendiente (flag true) | 2026-10-19 |
| Palmitoyl Tripeptide-1 | palmitoyl-tripeptide-1 | 4 | 5 | Pendiente (flag true) | 2026-10-19 |
| Palmitoyl Tetrapeptide-7 | palmitoyl-tetrapeptide-7 | 4 | 5 | Pendiente (flag true) | 2026-10-19 |
| Tripeptide-1 Copper Acetate | tripeptide-1-copper-acetate | 2 | 1 | Pendiente (flag true) | 2026-10-19 |
| Tripeptide-1 Acetate | tripeptide-1-acetate | 2 | 1 | Pendiente (flag true) | 2026-10-19 |
| Acetyl Tetrapeptide-2 | acetyl-tetrapeptide-2 | 4 | 1 | Pendiente (flag true) | 2026-10-19 |
| Palmitoyl Tripeptide-38 | palmitoyl-tripeptide-38 | 4 | 5 | Pendiente (flag true) | 2026-10-19 |
| Tetrapeptide-21 | tetrapeptide-21 | 2 | 2 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Copper Palmitoyl Heptapeptide-14 | copper-palmitoyl-heptapeptide-14 | 2 | 3 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Heptapeptide-15 Palmitate | heptapeptide-15-palmitate | 2 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Palmitoyl sh-Hexapeptide-13 Serine SP Amide | palmitoyl-sh-hexapeptide-13-serine-sp-amide | 3 | 2 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Carnosine | carnosine | 2 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Palmitoyl Pentapeptide-4 | palmitoyl-pentapeptide-4 | 2 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Pentapeptide-18 | pentapeptide-18 | 2 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| Acetyl Tetrapeptide-5 | acetyl-tetrapeptide-5 | 2 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-19 |
| sh-Polypeptide-121 | sh-polypeptide-121 | 1 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-20 |
| Dipeptide Diaminobutyroyl Benzylamide Diacetate | dipeptide-diaminobutyroyl-benzylamide-diacetate | 3 | 2 | Sin flag; no hay aprobación humana verificada | 2026-10-20 |
| Oligopeptide-68 | oligopeptide-68 | 1 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-20 |
| Palmitoyl Tripeptide-8 | palmitoyl-tripeptide-8 | 1 | 1 | Sin flag; no hay aprobación humana verificada | 2026-10-20 |


Los 21 tienen al menos un producto relacionado. La relación inversa ya se muestra en la ficha. No hay un registro de aliases/synonyms por entidad: el alias GHK-Cu está en el índice de búsqueda. IDs y slugs coinciden en los 21 registros actuales; usar id como slug funciona hoy, pero debe desacoplarse si cambia la convención.

Obligatorios: ID, nombre exacto/INCI, alcance de función, fuente y fecha documental. Opcionales: sinónimos respaldados, identificadores externos y estudios. Si no hay estudio propio o no es aplicable, expresar no registrado/no aplica; no ausencia de eficacia. Para nombres compuestos/trade blends, registrar si se trata de identidad química o sistema comercial sin colapsarlos.

## 5. Péptidos, medicamentos y biblioteca

No hay un modelo Peptide activo que gobierne la navegación. Prisma contiene Compound y entidades reservadas, pero no están conectadas a producción. La biblioteca actual es una colección de3 artículos: categorías, retatrutide y BPC-157. Conserva diferencias entre cosmético/medicamento/experimental y advierte límites; no se revisó de nuevo su exactitud regulatoria/clínica en esta auditoría.

Propuesta incremental: entidad de identidad solo si se necesita conectar nombres y ámbitos; cada sinónimo debe llevar relación tipada, fuente y fecha. Categoría regulatoria por jurisdicción, preparación y fecha, nunca propiedad universal del nombre. No añadir protocolos, dosing o promesas clínicas. Una ficha puede ser parcial si lo dice y no activa una función que dependa de datos ausentes.

## 6. Fuentes y estudios

| Campo | Obligatorio / opcional / no aplica | Comprobado |
| --- | --- | --- |
| SourceID/URL/publisher/accessedAt/type | Obligatorio para procedencia | 34 registros validados por Zod. |
| Supports/limits/commercialContext/access/checkedAt | Obligatorio en EvidenceNote | 30 notas. 4 Source sin nota detallada: pubchem-29, lubrizol-uplevity, lubrizol-formulation, fda-cosmetic-reactions. |
| Autores/año/revista/DOI | Obligatorio si la referencia académica lo tiene; DOI no aplica a toda fuente | 8 notas con DOI; no tratar22 sin DOI como 22 fallos. |
| Diseño/población/modelo/duración | Según tipo: cohorte no aplica a guía/regulador | 9 notas con design; población/duración repartidas en study-data.ts y texto. |
| Sustancia/preparación/producto estudiado | Obligatorio para transferir o limitar una conclusión | Descripción narrativa; falta relación estructurada común. |
| Resultados y limitaciones | Obligatorio para afirmaciones de evidencia | finding/supports/limits y párrafos; profundidad desigual. |
| Financiación/conflictos | Declarado cuando la fuente lo informa; si no, no extraído/no declarado | commercialContext ya existe; no hay modelo separado que deba reemplazarse por completo. |
| Acceso/integridad | Obligatorio para alcance de inspección | access requerido; integrity opcional. Abstract leído no equivale a métodos completos revisados. |
| Revisión cualificada/versionado | Obligatorio para afirmar revisado | No se verificó aprobación humana asociada a una versión. |


La combinación claim→source ya existe. Extenderla con StudyContext y Review en lugar de crear otra biblioteca duplicada de fuentes. Conservar citas de etiqueta/proveedor separadas de evidencia humana/formulación. No puntuar eficacia por número de fuentes o tipo de evidencia.

## 7. Flujo editorial propuesto

Draft → Documentary Check → Qualified Review (cuando la afirmación lo requiere) → Published → Revalidation. Separar revisión de etiqueta de revisión científica. Cada transición necesita actor real, timestamp, versión, alcance y notas. La revalidación puede vencer por reformulación, nueva fuente/corrección, antigüedad de precio o modificación de claim. No usar un boolean ausente como aprobación.

Fechas distintas: acceso documental, observación de precio, actualización de contenido, revisión humana y próxima revalidación. Hoy algunas fechas de biblioteca se fijan en el componente. Obligatorio que cada fecha explique qué significa; opcional calcular un próximo vencimiento según política aprobada.

## 8. Prioridad editorial

1. Completar About/Contact/Privacy/Terms con datos del dueño; mantener límites de beta.
2. Revisar las2 guías cosméticas existentes y 3 comparaciones research, sin afirmar que 7 label son revisiones clínicas.
3. Mejorar entrada principiante Qué es un péptido y cómo leer una etiqueta seleccionada.
4. Conectar GHK-Cu/identidad con guía, productos declarantes y fuentes pertinentes, sin trasladar resultados de ensayo a todos los productos.
5. Revisar el piloto haircare antes de añadir más productos/categorías; reformular cualquier cobertura exhaustiva implícita.
6. Solo ampliar precios y mercados cuando haya fuente por variante. No crear cientos de artículos o perfiles SEO automáticos.

## 9. Modelo comercial futuro, no implementado

Market(countryCode, jurisdiction) → Currency; ProductVariant(productId, size, unit, market, formulaVersion) → Offer(retailer, variant, market) → PriceObservation(amount, currency, observedAt, verifiedAt, sourceId, tax, shipping, availability). Conservar el histórico; fecha no implica disponibilidad actual. Currency es independiente de idioma/país. Conversión FX requeriría proveedor/fecha/tasa y no debe mezclar precios originales silenciosamente.

US es el único scope comercial operado hoy. Canadá, UK y Perú son propuestas; usar una etiqueta UK como referencia documental no equivale a ofrecer cobertura comercial UK. Precio más bajo solo dentro de observaciones comparables declaradas y suficientemente vigentes, nunca cheapest universal.

## 10. Información que debe proporcionar el propietario

- Identidad pública/entidad responsable, jurisdicción y contacto que realmente se atienda.
- Quién recibe correcciones, tiempos orientativos que pueda cumplir y política de actualización.
- Autores/revisores reales, alcance de cualificación y evidencia de aprobación de cada versión.
- Permisos/autoría de cada imagen; si no hay, decisión sobre sustitución.
- Hosting/logs: retención, finalidad, acceso, contacto y términos aplicables revisados.
- Monetización prevista y acuerdos existentes; verificar declaración actual sin afiliados al cambiar.
- Mercado inicial y fuentes/vendedores autorizados para precios; presupuesto para mantenimiento.

No se solicitan contraseñas ni tokens en documentos ni en el chat. Estos datos no se inventan ni se reemplazan por placeholders presentados como definitivos. [Tickets](PEPTIVELO_IMPLEMENTATION_BACKLOG.md): PV-001/002/003/009/010/017/018.
