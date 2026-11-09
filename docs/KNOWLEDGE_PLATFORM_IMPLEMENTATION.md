# Peptivelo — plataforma amplia de conocimiento

Entrega posterior: [correcciones de la lectura crítica](CRITICAL_READER_FIXES.md), con cambios y validación propios. Las cifras de este informe corresponden a la entrega inicial.

Entrega local del 8 de noviembre de 2026. Audiencia: principiantes y lectores técnicos por igual. Inglés inicial; las áreas públicas existentes conservan sus rutas y la identidad visual. Este informe distingue implementación, preparación editorial y dependencias externas.

## Diagnóstico actualizado y backlog único

La inspección del código se contrastó con solicitudes HTTP al sitio publicado y con las auditorías históricas. La muestra actual no acredita una auditoría completa de rendimiento, seguridad, accesibilidad manual o revisión científica. Las cifras de auditorías anteriores no se presentan como mediciones nuevas.

| Prioridad | Hallazgo y evidencia                                                                               | Esfuerzo / dependencia                             | Resultado de esta entrega                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Alta      | `/peptides/` devolvió 404 en producción; existe como ruta local.                                   | Bajo; requiere desplegar y comprobar esta versión. | Ruta local con filtros SSR, retorno y controles accesibles; despliegue pendiente.                                                       |
| Alta      | Algunos ingredientes podían resultar elegibles para SEO por ausencia de `scientificReviewPending`. | Medio; aprobaciones humanas reales.                | Política central con aprobación explícita de la versión; ausencia de bandera nunca autoriza.                                            |
| Alta      | Las rutas, listados y metadatos aplicaban criterios distintos a borradores.                        | Medio; conservar URLs ya públicas.                 | Registro de documentos y lista explícita de 18 borradores heredados; los nuevos borradores no se incorporan automáticamente.            |
| Alta      | No existe evidencia de aprobaciones editoriales/científicas actuales.                              | Externa; propietario y revisor cualificado.        | Registro de aprobaciones vacío, sin atribuciones inventadas. Sigue pendiente completarlo con revisiones reales.                         |
| Media     | El directorio guardaba el tema solo en estado del navegador.                                       | Medio; sin servicio externo.                       | Tema y formato en URL; recarga, enlaces compartidos y retorno conservan la selección.                                                   |
| Media     | La búsqueda carecía de metadatos uniformes de tema, formato y revisión.                            | Medio; relaciones explícitas.                      | Contrato extendido, filtros, estados vacíos, referencias y retorno a exploración.                                                       |
| Media     | Los campos documentales y estados desconocidos estaban repartidos entre plantillas.                | Medio; fuentes existentes.                         | Transparency Profile reutilizable en productos, ingredientes, guías, comparaciones y biblioteca.                                        |
| Media     | About seguía describiendo un proyecto centrado únicamente en skincare.                             | Bajo; no inventar responsables.                    | Presentación amplia, metodología de estados y límites del comparador actualizados. Se conserva el correo solicitado por el propietario. |
| Media     | Solo hay eventos locales; no hay analítica persistente ni línea base de retención.                 | Externa para transporte; sin proveedor en v1.      | Eventos mínimos verificados, sin consultas ni correos en el payload. No se atribuyen resultados de tráfico/conversión.                  |
| Media     | Metabolismo no tenía un lote documental preparado; tampoco existe estudio con seis participantes.  | Investigación y revisión externa.                  | Introducción, dos fichas y propuesta de actualización internas; protocolo de prueba con usuarios preparado, aún sin ejecutar.           |

La muestra pública respondió 200 en home, búsqueda y artículo de retatrutide; home y artículo conservaban `noindex`; robots permitía lectura y el sitemap estaba vacío. Estos son resultados del sitio anterior a esta entrega, no del código local nuevo. La evidencia resumida se conserva en `audit-evidence/knowledge-platform/live-baseline.json`.

## Implementación

- Home comunica “Understand peptides. Explore the evidence and its limits.” Mantiene búsqueda, tres áreas activas, aprendizaje y metodología. Las selecciones destacadas requieren promoción aprobada; no se rellena una sección vacía con borradores.
- Directorio y búsqueda admiten filtros por tema/formato. Formularios GET y contenido SSR permiten lectura y filtrado sin JavaScript. El retorno solo admite rutas locales de búsqueda/directorio y parámetros limitados; preserva una relación de retorno entre resultados, exploración y ficha.
- Los ingredientes muestran un resumen con límites y un bloque técnico desplegable. La biblioteca y haircare conservan sus respuestas breves, detalles, citas y referencias. El perfil documental complementa esos niveles en las plantillas actuales.
- Transparency Profile muestra estados descriptivos: documentado en fuentes citadas, no divulgado en las fuentes consultadas, no revisado y no aplicable. No incluye un score, una clasificación clínica ni una fecha de revisión científica ficticia. Las fechas de precio y de etiqueta siguen separadas.
- La búsqueda expande únicamente identidades/alias y relaciones documentadas. La comparación operativa sigue limitada al grupo de cosméticos faciales; ningún tema nuevo habilita equivalencia terapéutica.
- Compartir una vista copia su enlace; si falla el portapapeles, ofrece un campo de copia manual. No solicita correo ni crea cuentas.

## Publicación y revisiones

`publication-policy.ts` decide visibilidad, promoción e indexación. `publication-registry.ts` adapta los datos existentes; no crea una base de datos. Los documentos incluyen identidad estable, ruta, tema, estado de origen, fuentes, necesidad de revisión y snapshot canónico de versión. Este snapshot incluye los datos y las fuentes asociadas; cambia al modificarlos.

`publication-baseline.json` conserva únicamente los borradores que ya tenían rutas públicas locales. No añadir automáticamente nuevos borradores a esa lista. Un documento interno no debe importarse desde componentes, índices o rutas públicas. Publicar un registro nuevo es una decisión editorial explícita, no un efecto de añadirlo a JSON.

`publication-reviews.json` permanece vacío porque no se ha recibido ninguna aprobación humana. Para inspeccionar un documento sin modificarlo:

```powershell
npm run publication:inspect -- /skincare/products/niod-cais3/
npm run publication:inspect -- /skincare/products/niod-cais3/ --snapshot
```

Después de una revisión real, el responsable registra `documentId`, el `revision` exacto inspeccionado, `kind` (`editorial` o `scientific`), `reviewerId` y `reviewedAt`. Usar identificadores no personales; las identidades, cualificaciones y permisos de divulgación se verifican con el propietario fuera del bundle público. Nunca completar una aprobación solo para desbloquear SEO.

Los cambios en fuentes o contenido invalidan la aprobación anterior. También debe incrementarse `presentationVersion` cuando una modificación de plantilla cambie el significado o añada afirmaciones que no estén en los registros. Un cambio meramente visual no requiere ese incremento.

La indexación exige documento publicado, tema público, aprobación editorial vigente, revisión científica vigente cuando corresponde y `SITE_INDEXABLE=true`. El comparador interactivo sigue fuera de indexación. Metadatos y sitemap consultan la misma política; habilitar el interruptor global no indexa el catálogo completo. No se afirma que estas aprobaciones garanticen aparición en buscadores o sistemas de IA.

## Lote de metabolismo

`src/editorial/metabolism-batch.ts` contiene una introducción, dos perfiles de formas identificadas —GLP-1(7–36) amide humano y GIP(1–42) humano— y una propuesta de actualización del artículo existente de retatrutide. GLP-1 y GIP genéricos no se registran como alias moleculares exactos. No se crean relaciones farmacológicas por coincidencia de nombre.

Las fuentes se consultaron el 8 de noviembre de 2026; cada entrada indica el acceso realmente obtenido. Las fichas permanecen pendientes de revisión editorial humana y científica. La propuesta de retatrutide distingue la cobertura histórica de 2023 de una publicación de 2026; no reemplaza automáticamente la síntesis pública ni añade pautas de uso. El tema continúa planificado y no aparece en menús, búsqueda, sitemap o comparaciones.

Fuentes de esta preparación: [descriptor GLP-1 de NLM](https://meshb.nlm.nih.gov/record/ui?ui=D052216), [descriptor GIP de NLM](https://meshb.nlm.nih.gov/record/ui?ui=D005749), [identificación original de GIP humano](https://pubmed.ncbi.nlm.nih.gov/6745415/), [registro del estudio sobre formas GLP-1](https://pubmed.ncbi.nlm.nih.gov/8482423/), [registro TRIUMPH-2](https://pubmed.ncbi.nlm.nih.gov/42810372/) y [comunicación FDA](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss). Algunos artículos solo permitieron inspeccionar el título o un extracto indexado; no se simula acceso al texto completo.

## Medición, validación y pendientes

Eventos nuevos: `search_submitted`, `search_result_selected`, `search_no_results`, `reference_opened`, `discovery_shared`. Se conserva `comparison_completed`, incluyendo la apertura de una pareja compartida y evitando doble emisión de una misma transición. Los payloads permitidos contienen contexto técnico mínimo; se descartan consultas, URLs y correos. No hay SDK, receptor persistente, cookies analíticas ni identificador de usuario nuevo. Los logs del hosting son un sistema distinto y requieren su propia política operativa.

Validación final local: `npm run typecheck` y `npm run lint` aprobaron; las 130 pruebas unitarias de 28 archivos aprobaron; `npm run build` y `npm run build:vinext` completaron correctamente. La batería seleccionada de 12 archivos Playwright contra el Worker compilado terminó con 141 casos aprobados, cero fallos y seis omisiones configuradas de matrices visuales que se ejecutan una sola vez. Incluye escritorio, tablet, móvil de 320 px, ambos temas, navegación con scripts retrasados, lectura sin JavaScript, citas, filtros, retorno, comparación y eventos locales. Las pantallas verificadas con axe no mostraron incidencias en las reglas ejecutadas; esto no acredita conformidad WCAG completa. Se inspeccionaron visualmente capturas de portada y documentación en escritorio, tablet y móvil.

El Worker conserva los avisos existentes del tooling sobre mapas de fuentes y clasificación estática de algunas rutas; no impidieron la compilación ni los recorridos. No se ha desplegado esta entrega a producción ni habilitado indexación. El protocolo y la hoja de resultados de la evaluación con personas están en `KNOWLEDGE_PLATFORM_USER_TEST.md`; siguen sin ejecutar.

Pendientes externos: revisión cualificada del lote, aprobación editorial por versión, datos operativos aún no confirmados por el propietario, pruebas con participantes, acceso autorizado a Search Console y eventual transporte de analítica. El correo permanece como siguiente hito: definir proveedor, responsable, frecuencia sostenible, consentimiento, confirmación y baja antes de mostrar formularios. No hay alertas ni guardados prometidos.

## Despliegue y reversión

Esta entrega no habilita indexación ni atribuye revisiones. Antes de desplegar, ejecutar tipos, lint, unitarias, build del Worker y recorridos de navegador sobre esa compilación; comprobar `/peptides/`, navegación, fichas, búsqueda, comparación y sitemap. Después del despliegue, repetir un smoke HTTP sobre el dominio real y confirmar que el código publicado corresponde a la versión validada.

La reversión consiste en volver a publicar el artefacto anterior conocido mediante el proceso existente. No hay migraciones de base de datos ni altas de servicios que revertir. Conservar `SITE_INDEXABLE=false` durante esa operación. No restablecer aprobaciones que ya quedaron obsoletas tras cambios documentales.
