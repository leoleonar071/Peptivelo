# Peptivelo — Implementation Backlog

Auditoría: 21 de octubre de 2026, America/Lima. Snapshot UTC: 2026-10-22T03:04:44.554Z. Código base: `80fa15e`. Sitio: https://peptivelo.com. Solo documentación; sin cambios de producción, base de datos, infraestructura ni despliegue.

Estos tickets son propuestas ejecutables, no autorización para implementarlos en esta fase. Prioridades y esfuerzo se interpretan como en el [documento maestro](PEPTIVELO_MASTER_AUDIT_AND_ROADMAP.md). Una dependencia externa no se soluciona inventando contenido. Definición general de terminado: solución revisada, pruebas específicas verdes, regresiones de rutas/SSR/noindex, evidencia antes/después y aprobación editorial cuando haya afirmaciones.

## Épica A. Confianza y publicación

### PV-001 — Publicar operador, contacto y política real de tratamiento de datos

- **Prioridad / esfuerzo:** P0 / M.
- **Problema:** El dominio público ofrece About, Contact y Privacy provisionales, sin canal público de correcciones ni responsable identificado; privacidad aún habla de un proveedor de hosting futuro.
- **Evidencia:** HTTP 200 y texto provisional en /about/, /contact/, /privacy/; src/lib/pages.ts y src/lib/config.ts. Cloudflare ya procesa solicitudes.
- **Causa:** Contenido / información externa.
- **Módulos afectados:** src/lib/pages.ts; src/lib/config.ts; src/app/layout.tsx; .env.example; documentación de privacidad.
- **Dependencias:** Propietario: identidad pública, correo funcional, jurisdicción; política operativa de logs; revisión legal cuando corresponda.
- **Solución propuesta:** Obtener los datos del propietario, configurar identidad y contacto, identificar Cloudflare y documentar finalidad/retención/acceso a logs; revisar términos y jurisdicción con asesoría apropiada. No inventar información ni publicar un correo ficticio.
- **Criterios de aceptación:** About identifica al responsable; Contact permite una corrección real y entrega comprobada; Privacy describe el hosting existente y retención aprobada; Terms deja de presentarse como texto provisional. Responsable aprueba la información.
- **Pruebas necesarias:** Validación de configuración ausente/presente; inspección HTTP/SSR de páginas; prueba manual del canal con datos no sensibles; cotejo de textos con servicios realmente activos.
- **Riesgo de regresión:** Exponer datos personales no autorizados o prometer un tratamiento que no existe. No sustituir por formularios si no habrá receptor responsable.

### PV-002 — Resolver derechos de las fotografías publicadas

- **Prioridad / esfuerzo:** P0 / L.
- **Problema:** Las fotografías están desplegadas aunque el archivo de procedencia declara que los derechos de reutilización pública no se han establecido.
- **Evidencia:** public/images/products/SOURCES.md; 11 imágenes de skincare y 1 de haircare visibles. Procedencia y crédito no equivalen a licencia.
- **Causa:** Comercial / información externa.
- **Módulos afectados:** public/images/products/; public/images/products/SOURCES.md; src/components/ui.tsx; src/components/hair-photo.tsx.
- **Dependencias:** Respuesta de titulares o activos propios; revisión legal de los usos previstos.
- **Solución propuesta:** Crear un registro de permisos por activo o sustituirlo por fotografía propia/autorizada del tamaño exacto. Conservar la identidad del producto y su procedencia; aprobación del propietario antes de difusión amplia.
- **Criterios de aceptación:** Cada activo público tiene licencia/permiso/autoría documentados y alcance compatible, o se retira/sustituye; las dimensiones y variantes siguen coincidiendo con la ficha.
- **Pruebas necesarias:** Inventario de todos los activos referenciados; revisión visual de producto/tamaño; verificación de que no queden referencias a archivos retirados.
- **Riesgo de regresión:** Pérdida de reconocimiento del producto o asociación de foto de otra variante. La auditoría no determina infracción jurídica.

### PV-003 — Hacer explícita y restrictiva la elegibilidad de revisión e indexación

- **Prioridad / esfuerzo:** P0 / L.
- **Problema:** scientificReviewPending es opcional; su ausencia se interpreta como elegibilidad al activar la indexación. Nueve ingredientes tienen true y doce no especifican el campo; eso no demuestra doce revisiones aprobadas.
- **Evidencia:** src/lib/data.ts education.scientificReviewPending optional; src/app/[...slug]/page.tsx usa !flag; src/app/sitemap.ts usa !flag. No se verificó un historial de aprobación humana.
- **Causa:** Modelo de datos / revisión editorial / SEO.
- **Módulos afectados:** src/lib/data.ts; src/lib/guides.ts; src/lib/evaluations.ts; src/lib/library.ts; src/app/sitemap.ts; metadata de rutas; pruebas SEO.
- **Dependencias:** PV-001; responsable editorial; criterios de revisión y evidencias humanas reales.
- **Solución propuesta:** Separar revisión documental de revisión científica y publicación. Añadir estados explícitos y registro de reviewer/date/contentVersion/decision. Elegibilidad centralizada que falle cerrada cuando falten datos. Mantener noindex hasta pasar las dependencias de lanzamiento.
- **Criterios de aceptación:** Ningún estado ausente implica revisión; una ficha de etiqueta puede tener verificación documental sin certificación clínica; un borrador no entra en sitemap ni pierde noindex al activar SITE_INDEXABLE; una aprobación queda vinculada a versión concreta.
- **Pruebas necesarias:** Matriz draft/documentary/qualified/published/expired/unknown; sitemap y metadata con indexación global on/off; cambio de contenido invalida revisión anterior.
- **Riesgo de regresión:** Ocultar contenido válido o atribuir credenciales inexistentes. La ausencia de revisión no significa que una afirmación sea falsa.

## Épica B. Calidad técnica y seguridad

### PV-004 — Evaluar y mitigar la cadena de dependencias marcada por npm audit

- **Prioridad / esfuerzo:** P0 / M.
- **Problema:** npm audit --omit=dev informa 8 nodos de dependencia high, incluidos Vite y la cadena braces/vinext. No son ocho exploits independientes ni prueba de explotación del Worker.
- **Evidencia:** audit-evidence/npm-audit-bounded.json; Vite 8.3.0, braces advisory GHSA-vfj7-8cjw-p6xm; Vite GHSA-9jrq-w75r-8gcw y familia launch-editor. La salida propone un parche Vite compatible y degradaciones mayores antiguas para vinext.
- **Causa:** Dependencias / pipeline.
- **Módulos afectados:** package.json; package-lock.json; vite.config.ts; documentación de decisiones de seguridad.
- **Dependencias:** Compatibilidad de vinext/plugin cf; documentación upstream de cada aviso.
- **Solución propuesta:** Trazar uso build/dev/runtime; probar la actualización Vite compatible indicada en rama aislada y evaluar upstream de braces. No ejecutar audit fix --force ni degradar vinext a 0.0.15 por automatismo. Registrar mitigaciones y cualquier excepción con responsable y caducidad.
- **Criterios de aceptación:** Inventario de avisos con alcance y decisión; parche compatible validado o excepción razonada; no se expone servidor Vite de desarrollo como producción; builds y recorridos pasan.
- **Pruebas necesarias:** npm audit nuevo; árbol npm explain; builds Next y Worker; regresión de SSR, assets, navegación y acciones. No pruebas de explotación contra producción.
- **Riesgo de regresión:** Romper RSC/SSR con una actualización o esconder avisos cambiando artificialmente las categorías de dependencia.

### PV-005 — Añadir una puerta de calidad antes de desplegar main

- **Prioridad / esfuerzo:** P1 / M.
- **Problema:** El comando de compilación desplegado ejecuta vite build; no obliga por sí mismo a pasar tests/lint/typecheck. No hay workflow versionado en .github en este snapshot.
- **Evidencia:** package.json build:vinext; docs/CLOUDFLARE_DEPLOYMENT.md; ausencia de workflow en repositorio. El build 80fa15e terminó con éxito tras reconectar GitHub.
- **Causa:** Integración / operación.
- **Módulos afectados:** Configuración de Cloudflare Builds; nuevo workflow si se elige GitHub Actions; package.json; pruebas; docs/CLOUDFLARE_DEPLOYMENT.md.
- **Dependencias:** PV-004; acceso del propietario a permisos/branch protection/Cloudflare. Su configuración privada actual queda pendiente de verificar.
- **Solución propuesta:** Versionar una secuencia lint → tipos → unitarias → Worker build → smoke de staging. Incluir las rutas universales y revisiones en la política. Documentar reconexión Git y rollback a una versión concreta.
- **Criterios de aceptación:** Un fallo intencional bloquea publicación; logs identifican commit; existe procedimiento de rollback ensayado en staging; secretos se configuran fuera del repositorio.
- **Pruebas necesarias:** Pipeline con éxito y fallo controlados; smoke URL, canonical, noindex y search de la versión desplegada.
- **Riesgo de regresión:** Aumentar tiempo/coste de CI o desplegar accidentalmente fixtures. No imponer trabajo duplicado en ambos proveedores sin beneficio.

### PV-021 — Ajustar cache de assets y evaluar cabeceras de seguridad con alcance

- **Prioridad / esfuerzo:** P2 / M.
- **Problema:** Assets estables muestreados usan max-age=0 must-revalidate; HTML usa no-store. No se observaron CSP/frame/Permissions-Policy en la respuesta. Esto no demuestra por sí mismo una vulnerabilidad explotable.
- **Evidencia:** network-samples.json; route-audit.json headers; src/proxy.ts; cloudflare.config.ts runWorkerFirst. Logs habilitados y query redaction configurado.
- **Causa:** Entrega / seguridad defensiva.
- **Módulos afectados:** src/proxy.ts; cloudflare.config.ts; configuración de assets; política de versión de recursos.
- **Dependencias:** PV-001/PV-005/PV-013; acceso Cloudflare; mapa de scripts inline y cámara.
- **Solución propuesta:** Versionar assets y cachear immutable solo nombres con hash; conservar revalidación para archivos mutables. Evaluar CSP en report-only antes de enforcing, frame-ancestors y política de cámara propia; confirmar redacción/retención en configuración real.
- **Criterios de aceptación:** Una actualización de logo/CSS no queda obsoleta; cache-control cumple estrategia de nombres; cabeceras no rompen RSC, tema ni escáner; política de logs probada con query sintético no sensible.
- **Pruebas necesarias:** Primera/segunda visita con cache; despliegue de asset nuevo; CSP reports de staging; iframe y permisos cámara; no compartir logs reales con PII.
- **Riesgo de regresión:** Cachear HTML con estado, romper scripts de tema con CSP estricta o cachear por un año archivos sin versionar.

## Épica C. Búsqueda y conocimiento conectado

### PV-006 — Expandir identidades verificadas hacia documentos relacionados en la búsqueda

- **Prioridad / esfuerzo:** P1 / L.
- **Problema:** GHK-Cu recupera únicamente Copper Tripeptide-1; los productos y comparaciones vinculados no se expanden desde esa identidad. La ficha de ingrediente ya tiene relación inversa a productos, por lo que no falta toda la relación.
- **Evidencia:** Consulta de producción GHK-Cu: 1 resultado. src/lib/search-index.ts solo añade el alias a un documento; catalog.products[].ingredientIds y comparisons[].comparedProductIds ya existen.
- **Causa:** Arquitectura de información / búsqueda.
- **Módulos afectados:** src/lib/search-index.ts; src/lib/search.ts; nuevo selector compartido de entidades/aliases; src/app/search/page.tsx; tests/search.test.ts.
- **Dependencias:** PV-003; tabla de alias documentados; conservar IDs/URLs existentes.
- **Solución propuesta:** Resolver alias verificado a ingredientId estable, recuperar documentos directos y expandir un salto a productos y comparaciones; mostrar por qué coincide cada resultado. Agregar estudios solo cuando se registre una relación respaldada; no inferir equivalencia química.
- **Criterios de aceptación:** GHK-Cu y una variante ortográfica aprobada devuelven el ingrediente y los productos que declaran ese ID, con explicación; Tripeptide-1 Copper Acetate no se fusiona automáticamente; las relaciones sin fuente no aparecen como verificadas.
- **Pruebas necesarias:** Fixtures positivos y negativos por identidad; casos GHK-Cu vs cobre distinto, producto/haircare y comparación; pruebas de ruta y combobox.
- **Riesgo de regresión:** Falsa equivalencia de ingredientes. Una relación de presencia no transfiere evidencia clínica al producto.

### PV-007 — Corregir relevancia de consultas compuestas y tolerancia a errores

- **Prioridad / esfuerzo:** P1 / M.
- **Problema:** copper peptides y coper peptides devuelven 44 documentos cada uno; el umbral de mitad de tokens permite que peptide baste. GHKCu devuelve cero. Tener resultados no prueba relevancia.
- **Evidencia:** audit-evidence/browser-audit.json queries; src/lib/search.ts usa ceil(tokens.length/2), prefix y pesos de título. La pregunta sobre 10% también devuelve 44 documentos.
- **Causa:** Algoritmo / UX.
- **Módulos afectados:** src/lib/search.ts; src/lib/search-index.ts; src/components/hero-search.tsx; src/app/search/page.tsx; tests/search.test.ts.
- **Dependencias:** PV-006 para aliases y entidades; evaluación de consultas con el editor.
- **Solución propuesta:** Introducir consultas normalizadas por entidad/frase, peso bajo para palabras genéricas y coincidencias relacionadas separadas de exactas. Tolerancia tipográfica limitada sobre vocabulario existente con sugerencia visible, sin sustituir nombres científicos silenciosamente.
- **Criterios de aceptación:** Corpus aprobado de al menos 30 consultas con negativos; primer resultado útil esperado; productos sin identidad consultada no se presentan como coincidencia exacta; correcciones propuestas se anuncian y se pueden ignorar.
- **Pruebas necesarias:** Precision@5/recall de relaciones en corpus curado, no sobre datos clínicos; zero-results correcto; preguntas y marcas; teclado/lector de pantalla con did-you-mean.
- **Riesgo de regresión:** Resolver precisión destruyendo recuperación de preguntas largas. No usar una tasa de resultados no vacíos como criterio único.

### PV-008 — Unificar selectores de datos entre skincare y haircare sin mezclar ámbitos

- **Prioridad / esfuerzo:** P2 / L.
- **Problema:** Haircare tiene un JSON y componentes propios; entra en la búsqueda universal pero queda fuera del catálogo/comparador facial. Esa separación funcional es deliberada; la duplicación de metadata y procedencia es el problema de mantenimiento.
- **Evidencia:** src/lib/haircare.ts; src/data/haircare.json; src/lib/search-index.ts; src/components/product-identify.tsx; catálogo facial de 11 y piloto de 1 scalp serum.
- **Causa:** Modelo de datos / arquitectura.
- **Módulos afectados:** src/lib/data.ts; src/lib/haircare.ts; adaptadores de búsqueda; selectores de productos/ingredientes; schemas Zod.
- **Dependencias:** PV-010; revisión editorial de reglas de elegibilidad.
- **Solución propuesta:** Crear interfaces comunes de documento, producto y observación con scope/category explícitos; adaptar haircare antes de migrar datos. Mantener comparaciones compatibles y un mensaje de cobertura piloto.
- **Criterios de aceptación:** Una identidad/fecha/fuente se mantiene una vez; búsqueda indica scope; el comparador facial no admite scalp por accidente; todos los slugs actuales siguen resolviendo.
- **Pruebas necesarias:** Fixtures de dos ámbitos; catálogo, búsqueda, breadcrumb y deep links antiguos; prueba de rechazo de par incompatible.
- **Riesgo de regresión:** Cambiar IDs o convertir el piloto en cobertura exhaustiva aparente. No requiere todavía una base de datos.

### PV-016 — Conservar contexto entre resultados, ingrediente y comparación

- **Prioridad / esfuerzo:** P1 / M.
- **Problema:** Existen enlaces cruzados y retorno al par desde ingredientes, pero no una experiencia consistente desde una búsqueda. La búsqueda global se descubre principalmente en Home; ficha de producto elige automáticamente un segundo producto para Choose a comparison.
- **Evidencia:** src/app/[...slug]/page.tsx returnPath y products.find(x=>x.id!==p.id); src/components/navigation.tsx; links y URL observados.
- **Causa:** Navegación / UX.
- **Módulos afectados:** src/components/navigation.tsx; src/app/search/page.tsx; ficha de producto/ingrediente; src/components/comparison.tsx.
- **Dependencias:** PV-006; reglas de URL/noindex; no cambiar slugs.
- **Solución propuesta:** Acceso compacto a búsqueda global en navegación sin añadir un menú grande; conservar q y par de origen con parámetros permitidos; desde producto iniciar selección con a=producto y permitir elegir b, sin contrincante arbitrario.
- **Criterios de aceptación:** Puede hacerse SEARCH→ingrediente→producto→compare y volver a la búsqueda/par; el segundo producto requiere selección explícita o se identifica como ejemplo; no se pierde estado con Back.
- **Pruebas necesarias:** Deep links, retorno, hashes, back/forward, URL malformada, mobile More y Ctrl/Cmd+K; no open redirects.
- **Riesgo de regresión:** Crear bucles o propagar información privada en query strings. Conservar solo parámetros de contenido necesarios.

## Épica D. Datos y evidencia editorial

### PV-009 — Conectar afirmaciones y preparaciones estudiadas a las fuentes existentes

- **Prioridad / esfuerzo:** P1 / L.
- **Problema:** Ya hay sourceIds por párrafo y notas supports/limits/commercialContext, pero población/duración/preparación están repartidas entre evidence.json, study-data.ts y textos. Cuatro Source no tienen notas en el registro detallado.
- **Evidencia:** 34 Source; 30 EvidenceNote; faltan pubchem-29, lubrizol-uplevity, lubrizol-formulation, fda-cosmetic-reactions. src/lib/citations.ts y src/lib/study-data.ts.
- **Causa:** Trazabilidad / modelo editorial.
- **Módulos afectados:** src/data/evidence.json; src/lib/citations.ts; src/lib/study-data.ts; src/lib/evaluations.ts; src/components/citations.tsx; src/components/study-data.tsx.
- **Dependencias:** PV-003; trabajo documental y revisión cualificada.
- **Solución propuesta:** Extender los modelos existentes con entidad/preparación estudiada, claimId, limitación y estado de acceso/revisión. Normalizar datos de estudio solo cuando estén disponibles y conservar narrative original. Completar notas apropiadas para las cuatro fuentes; no exigir DOI a organismos o etiquetas.
- **Criterios de aceptación:** Afirmación relevante navega a fuente, alcance, preparación y límite; estudio de ingrediente no se etiqueta como ensayo del retail; financiación y acceso distinguen declarado/no extraído/no aplica; no hay citas rotas.
- **Pruebas necesarias:** Validadores de referencias y claim IDs; fuentes manufacturer vs research; abstracts/full text; escenarios no disponible/no aplica; dialog y retorno de foco.
- **Riesgo de regresión:** Convertir una clasificación de fuente en puntuación de eficacia o duplicar la información existente en un segundo registro desconectado.

### PV-010 — Modelar variante y mercado por dato de etiqueta, no por supuesto global

- **Prioridad / esfuerzo:** P1 / L.
- **Problema:** Los productos no tienen market/variantId estructurados; se muestran como US label profiles. P-TIOX advierte que sus péptidos vienen de etiqueta UK y que no se obtuvo INCI US completo. El aviso existe, pero el encabezado global no distingue esa procedencia.
- **Evidencia:** catalog.json skinceuticals-ptiox.ingredientListScope; src/lib/search-index.ts detail US label profile; src/app/[...slug]/page.tsx h2 US label. 0/11 INCI completos estructurados.
- **Causa:** Calidad de datos / procedencia.
- **Módulos afectados:** src/lib/data.ts; src/data/catalog.json; src/lib/search-index.ts; ficha de producto; componentes de disclosure.
- **Dependencias:** Fuentes de variante exacta; PV-009 para vínculos de evidencias.
- **Solución propuesta:** Añadir variant/market/formulaVersion y provenance por campo/selección, con estado verified/partial/not_recorded. Mostrar la fuente UK junto a los ingredientes y evitar presentar su coincidencia US como comprobada. Mantener la lista seleccionada como tal.
- **Criterios de aceptación:** P-TIOX distingue mercado de precio e ingrediente; todos los productos explicitan si el INCI es completo o seleccionado; una región desconocida no se transforma en US; ninguna concentración se infiere por orden.
- **Pruebas necesarias:** Casos UK-label/US-price, 30mL/50mL/150mL, fuente incompleta y reformulación; búsquedas y comparaciones conservan aviso.
- **Riesgo de regresión:** Sobreafirmar equivalencia de fórmulas o bloquear toda ficha parcial aunque se presente honestamente.

### PV-017 — Cubrir preguntas editoriales de entrada con autoría y revalidación

- **Prioridad / esfuerzo:** P2 / L.
- **Problema:** La biblioteca consta de 3 artículos TS (introducción, retatrutide y BPC-157); las 2 guías cosméticas están en borrador. No hay un modelo editorial común con autores/revisores por versión y fechas consistentes.
- **Evidencia:** src/lib/library.ts; src/app/library/[slug]/page.tsx fija Sources checked October 20, 2026; guides.json; declaraciones de revisión pendiente.
- **Causa:** Contenido / flujo editorial.
- **Módulos afectados:** src/lib/library.ts; src/lib/guides.ts; schemas de contenido; páginas de biblioteca/guías; documentación editorial.
- **Dependencias:** PV-001/PV-003/PV-009; disponibilidad de editores/revisores.
- **Solución propuesta:** Priorizar glosario Qué es un péptido, lectura de INCI seleccionado/completo, porcentajes de mezcla y diferencias entre evidencia de ingrediente/formulación/producto; enriquecer 2 guías existentes antes de crear más. Publicar autoría real, revisión y fechas desde datos.
- **Criterios de aceptación:** Cada nuevo contenido responde una pregunta validada, enlaza entidades/fuentes y tiene responsable; actualización real cambia versión/revalidación; no se generan páginas masivas ni se reutiliza fecha fija.
- **Pruebas necesarias:** Validación de campos aplicables, enlaces internos y afirmaciones; tarea de principiante; revisión humana registrada.
- **Riesgo de regresión:** Expandir artículos de compuestos experimentales antes de gobernanza o crear autoridades/credenciales inventadas.

### PV-018 — Normalizar observaciones comerciales y su vigencia

- **Prioridad / esfuerzo:** P2 / L.
- **Problema:** Hay 10 precios exact-size para 11 productos, todos USD; COSRX Mini 50mL está honestamente sin precio. Availability usa textos y valores dispares; existe política de recheck30d en metodología, no una elegibilidad automática de frescura.
- **Evidencia:** catalog.json prices; priceFor selecciona por tamaño y fecha; fechas 18–20 de octubre de 2026, no desactualizadas por antigüedad a la fecha de auditoría; src/lib/math.ts USD.
- **Causa:** Modelo comercial / contenido.
- **Módulos afectados:** src/lib/data.ts; src/lib/comparison.ts; src/components/ui.tsx; src/components/interactive.tsx; registros de precio.
- **Dependencias:** PV-010; fuentes/vendedores; decisión editorial sobre caducidad.
- **Solución propuesta:** Separar Market/Currency/Variant/Offer de PriceObservation con fuente, observado/verificado, impuestos/envío y disponibilidad histórica. Añadir estado de vigencia según política aprobada sin borrar la observación. Completar COSRX solo con evidencia exact-size.
- **Criterios de aceptación:** No hay conversión implícita de moneda ni cheapest global; observación vencida sigue fechada y no se llama precio actual; cantidades/tamaños coinciden; stock observado no se presenta como stock actual.
- **Pruebas necesarias:** Reloj simulado, ausente/vencido/futuro, precio0 válido, unidades distintas, país/moneda no equivalentes, descuento y envío desconocidos.
- **Riesgo de regresión:** Mezclar presentación50mL con precio150mL o mezclar monedas al ordenar. No activar países sin datos reales.

## Épica E. UX y componentes

### PV-011 — Hacer visible el resumen de comparación sin eliminar los tres niveles actuales

- **Prioridad / esfuerzo:** P1 / M.
- **Problema:** Los lectores ya tienen Overview / Ingredients & price / Evidence y tres conclusiones iniciales; no hay que reconstruirlos. En móvil, la primera pantalla se ocupa en encabezado y tarjetas del par y la respuesta breve queda más abajo.
- **Evidencia:** src/components/editorial-comparison.tsx; src/components/reader-tabs.tsx; screenshot 08-mobile-light.png; 5.189 palabras de contenido completo frente a unas 379 visibles en esa muestra.
- **Causa:** Jerarquía UX / contenido.
- **Módulos afectados:** src/components/editorial-comparison.tsx; src/components/reader-tabs.tsx; src/components/comparison-evaluation.tsx; src/styles/peptivelo-components.css.
- **Dependencias:** PV-009; aprobación editorial del resumen; PV-012 para estabilidad.
- **Solución propuesta:** Subir una síntesis documental del par antes o junto a sus tarjetas y compactar presentación móvil; conservar las pestañas, citas y disclosures. Distinguir lector editorial de comparador dinámico.
- **Criterios de aceptación:** Usuario distingue dato y limitación en la primera sección; los tres niveles siguen accesibles con teclado/no-JS; todas las citas y retorno al par se conservan; no aparecen ganadores de eficacia.
- **Pruebas necesarias:** Tareas con 5 usuarios principiantes; pruebas de tab/hash/back/forward/modal y no-JS; comparación con precio ausente; screenshots 320/390/768.
- **Riesgo de regresión:** Reducir lectura eliminando límites o fuentes. Un indicador de éxito no es menor tiempo de lectura por sí solo.

### PV-012 — Estabilizar fuentes y breadcrumbs en lectores móviles

- **Prioridad / esfuerzo:** P1 / M.
- **Problema:** La comparación NIOD muestra CLS alto en laboratorio móvil; las fuentes cambian anchos y provocan salto de línea en breadcrumbs/encabezado. El control manteniendo fuentes fallback reduce casi a cero los saltos observados.
- **Evidencia:** audit-evidence/performance-followup.json y font-isolation.json; src/app/brand-typography.css font-display swap; screenshots/08-mobile-light.png.
- **Causa:** Performance / tipografía / layout.
- **Módulos afectados:** src/app/brand-typography.css; src/app/layout.tsx; breadcrumbs en src/components/ui.tsx; estilos del encabezado lector.
- **Dependencias:** PV-013 para liberar descarga prioritaria; perfil de red reproducible.
- **Solución propuesta:** Medir y ajustar métricas de fallback, preload selectivo de las fuentes críticas y geometría estable de breadcrumb/encabezado. Conservar texto visible y fuentes aprobadas; no cambiar a font-display block para esconder el problema.
- **Criterios de aceptación:** Tres cargas frías móviles por página clave con CLS ≤0,1 en laboratorio y sin texto invisible; no aparece salto de línea tardío; registrar antes/después y métricas de campo cuando existan.
- **Pruebas necesarias:** Observer de layout-shift con nodos, cold contexts, fuente lenta/bloqueada, dark/light, 320/390/768; no usar solo capturas finales.
- **Riesgo de regresión:** Confundir mejora de laboratorio con Core Web Vitals p75 real o atribuir todos los saltos exclusivamente a una fuente sin pruebas.

### PV-013 — Entregar una variante ligera del isotipo conservando el original aprobado

- **Prioridad / esfuerzo:** P1 / S.
- **Problema:** El logo mostrado a 44px descarga el PNG de 802.223 bytes a través de /_next/image; no se está obteniendo una miniatura efectiva. Es el recurso más grande en la muestra fría.
- **Evidencia:** audit-evidence/focused-browser-checks.json: encodedBodySize 802223, duración observada ~945ms; original asset y src/components/brand-identity.tsx. No se ha medido aún el ahorro de una variante nueva.
- **Causa:** Assets / performance.
- **Módulos afectados:** public/brand/peptivelo-isotype.png; src/components/brand-identity.tsx; política de assets/versionado.
- **Dependencias:** Permiso para derivar el activo de marca existente; PV-005 para smoke de assets.
- **Solución propuesta:** Crear tamaños raster optimizados para header/favicon a partir del arte aprobado, sin rediseñarlo ni inventar SVG. Conservar master; fijar dimensiones; usar rutas versionadas y comprobar el comportamiento de vinext.
- **Criterios de aceptación:** Recurso de header ≤20KB de presupuesto inicial o excepción justificada con calidad visual; 44px y retina legibles; la red confirma la variante pequeña, no una redirección al PNG de 802KB.
- **Pruebas necesarias:** Comparación visual light/dark y retina; bytes reales, HTTP/content-type, rutas de favicon y metadata; LCP/CLS cold antes/después.
- **Riesgo de regresión:** Alterar colores/transparencia o servir una versión borrosa. El presupuesto es un criterio futuro, no un ahorro ya demostrado.

### PV-014 — Corregir el objetivo táctil de metodología en el hub skincare

- **Prioridad / esfuerzo:** P1 / S.
- **Problema:** Axe detecta target-size en el enlace independiente See our methodology de /skincare/: 142×17px y separación insuficiente. No se encontró un bloqueo de navegación por teclado.
- **Evidencia:** browser-audit.json: cuatro estados del mismo componente; selector p:nth-child(4) > a[href$="methodology/"]. WCAG 2.2 tag target-size.
- **Causa:** Accesibilidad / CSS.
- **Módulos afectados:** src/app/[...slug]/page.tsx rama skincare; estilo de enlace; prueba accesibilidad del hub.
- **Dependencias:** Ninguna; confirmar excepción de enlace inline en revisión manual.
- **Solución propuesta:** Aplicar área clicable/espacio suficiente al enlace aislado; mantener estilo editorial y foco visible. No declarar que todo enlace en línea pequeño es una infracción.
- **Criterios de aceptación:** Axe deja de señalar ese nodo, área/separación cumple el criterio aplicable y el enlace sigue claro en ambos temas y tamaños.
- **Pruebas necesarias:** Axe WCAG 2.2 AA; teclado, zoom200%, touch 320/390; snapshot del hub completo.
- **Riesgo de regresión:** Cambiar el espaciado global de todos los enlaces o romper párrafos inline para arreglar un único nodo.

### PV-015 — Hacer reproducibles los filtros del catálogo y aclarar sus etiquetas

- **Prioridad / esfuerzo:** P2 / M.
- **Problema:** Hay filtros reales por marca/ingrediente/precio/volumen/fecha/precio disponible, pero no ordenación ni persistencia completa en URL. La etiqueta implícita Brand incluye el texto de todas las opciones para herramientas de nombre accesible.
- **Evidencia:** src/components/interactive.tsx Explorer; focused-browser-checks.json: filtro NIOD devuelve 1 producto. El primer selector por etiqueta exacta falló en la prueba, pero por control real funcionó.
- **Causa:** UX / estado URL.
- **Módulos afectados:** src/components/interactive.tsx; src/app/[...slug]/page.tsx; selectores de catálogo; tests de filtros.
- **Dependencias:** PV-010/PV-018 para ordenación comercial coherente.
- **Solución propuesta:** Etiquetas explícitas htmlFor/id o nombre accesible conciso; serializar filtros validados en URL; añadir orden por nombre/precio unitario/fecha, con desconocidos siempre identificados. Mantener reset y feedback de resultados.
- **Criterios de aceptación:** Copiar/recargar URL conserva filtros; la opción NIOD devuelve 1; etiqueta se anuncia sin todo el catálogo; precio sin registro no se convierte en cero; orden estable.
- **Pruebas necesarias:** Intersección de filtros y sin resultados, teclado/lector de pantalla, URL inválida, unidades mL/US fl oz, precio ausente.
- **Riesgo de regresión:** Cambiar el significado de precio máximo de precio total a precio unitario sin cambiar etiqueta; fragmentar SEO con parámetros indexables.

## Épica F. Medición y crecimiento responsable

### PV-019 — Medir éxito de tareas con eventos mínimos y consentimiento apropiado

- **Prioridad / esfuerzo:** P1 / M.
- **Problema:** El adaptador solo emite CustomEvent en el navegador; no hay receptor persistente. search_performed mezcla submit, selección y cada tecla del filtro; no permite medir búsqueda exitosa, vacía o abandonada.
- **Evidencia:** src/lib/analytics.ts; hero-search.tsx; interactive.tsx onChange; eventos existentes en comparación/calculadora/fichas. Sin SDK externo encontrado.
- **Causa:** Analítica / validación de producto.
- **Módulos afectados:** src/lib/analytics.ts; HeroSearch; Explorer; ReaderTabs/Citations; ProductIdentify; adaptador futuro y política de privacidad.
- **Dependencias:** PV-001; objetivos de producto; datos de baseline antes de A/B.
- **Solución propuesta:** Definir search_submitted/result_selected/no_results y relaciones de sesión efímeras, sin query médico/personal crudo; medir task_complete. Mantener interfaz local y añadir transporte solo tras decisión de privacidad; no exigir SDK comercial.
- **Criterios de aceptación:** Cada acción emite una vez con source/category/status y sin contenido sensible; consultas vacías distinguibles; existe forma de analizar éxito y no solo clics; política refleja el transporte real.
- **Pruebas necesarias:** Contratos de eventos y ausencia de PII; selección/comparación/calculadora/identificación/fuente; opt-out/consentimiento según decisión; no network cuando deshabilitado.
- **Riesgo de regresión:** Recolectar dudas médicas en URL/eventos o contar cada tecla como conversión. No simular métricas sin almacenamiento.

### PV-020 — Preparar SEO editorial por elegibilidad, sin levantar noindex global todavía

- **Prioridad / esfuerzo:** P2 / M.
- **Problema:** Canonical y H1 funcionan; noindex global y sitemap vacío son deliberados. El SEO pendiente consiste en habilitar solo contenido listo, ampliar semántica sin convertir el sitio en vendedor y verificar variantes/duplicados.
- **Evidencia:** 76 comprobaciones HTTP; canonical del dominio real; robots permite crawl y sitemap vacío; JSON-LD: Organization/WebSite + BreadcrumbList, sin Product/Offer vendedor. Search no tiene canonical pero es noindex.
- **Causa:** SEO / gobernanza.
- **Módulos afectados:** src/app/sitemap.ts; src/app/robots.ts; metadata; src/app/layout.tsx; páginas de guías/biblioteca; Search Console externo.
- **Dependencias:** PV-001/PV-002/PV-003/PV-017; GSC y datos de propiedad.
- **Solución propuesta:** Después de PV-001/2/3, generar sitemap de elegibles y canonical consistente, examinar slash/http/https y parámetros; datos Article con autor real si procede, no inventar Review/AggregateRating/Offer. Conectar Search Console con autorización del dueño.
- **Criterios de aceptación:** Solo URLs aprobadas en sitemap e indexables; borradores/search/calculaciones parametrizadas siguen noindex; no localhost; breadcrumbs reflejan nombres reales; sin schema de vendedor falso.
- **Pruebas necesarias:** Matriz de metadata/sitemap/robots con gate on/off; redirects/canonical; validador de JSON-LD y Rich Results cuando corresponda; GSC pendiente de acceso.
- **Riesgo de regresión:** Abrir indexación de cientos de variantes o interpretar sitemap vacío prelaunch como fallo a corregir inmediatamente.

### PV-022 — Ampliar mercados e identificación avanzada solo con datos y demanda

- **Prioridad / esfuerzo:** P3 / XL.
- **Problema:** No hay cobertura comercial Canadá/UK/Perú, GTIN verificados ni reconocimiento de fotografías. La decodificación de QR no es autenticidad ni un reconocedor universal.
- **Evidencia:** verifiedProductCodes=[]; haircare y skincare USD/US; ProductScanner decodifica códigos y resuelve enlaces locales. No servicio visual externo.
- **Causa:** Información externa / crecimiento.
- **Módulos afectados:** src/lib/product-codes.ts; catálogo y modelos de mercado; servicios futuros de ingestión; política privacidad.
- **Dependencias:** PV-001/PV-010/PV-018/PV-019; fuentes, permisos, presupuesto y cobertura; ninguna compra o alta automática en esta fase.
- **Solución propuesta:** Piloto de un mercado y un vendedor con fuentes/fechas; GTIN comprobados por variante; evaluar OCR/visión solo tras medir fallos manuales y obtener muestras autorizadas. Separar aprobación humana de hipótesis de imagen.
- **Criterios de aceptación:** Piloto con cobertura y límites visibles, precios/moneda correctos; barcode verificado lleva a variante exacta y pide confirmación; imagen incierta no identifica como hecho; privacidad y costes aprobados.
- **Pruebas necesarias:** Negativos QR externos/códigos desconocidos, variantes casi iguales, monedas/stock, consentimiento de imagen y ausencia de protocolos médicos.
- **Riesgo de regresión:** Usar reconocimiento de packaging como garantía de autenticidad o contratar RAG/visión antes de demostrar utilidad.


## Orden operativo y dependencias

PV-001/002/003/004 son gates de difusión e indexación, no una orden de apagar funcionalidades hoy. PV-005 permite controlar cambios. PV-013/014 pueden avanzar en paralelo al trabajo documental una vez autorizada implementación. PV-006→007 comparte identidad/consulta; PV-009→010 alimenta evidence/variant; PV-018 precede la expansión de PV-022. No migrar a PostgreSQL/CMS ni contratar servicios por adelantado.

## Hipótesis de validación

H1: alias y relaciones mejoran éxito de búsquedas técnicas sin equivalencias falsas (PV-006/007). H2: síntesis visible reduce respuestas incorrectas en comparación manteniendo acceso a límites (PV-011). H3: variante/procedencia reduce confusiones tamaño/mercado (PV-010/018). Instrumentar PV-019 y establecer baseline antes de A/B; con tráfico escaso, pruebas de tareas moderadas son más útiles que una prueba sin potencia estadística. Ninguna tasa de conversión se conoce hoy.
