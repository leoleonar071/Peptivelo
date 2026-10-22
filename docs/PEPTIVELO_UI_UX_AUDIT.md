# Peptivelo — UI/UX Audit

Auditoría: 21 de octubre de 2026, America/Lima. Snapshot UTC: 2026-10-22T03:04:44.554Z. Código base: `80fa15e`. Sitio: https://peptivelo.com. Solo documentación; sin cambios de producción, base de datos, infraestructura ni despliegue.

## 1. Método y cobertura

El censo incluye 70 URLs HTML sin parámetros. Tres variantes de consulta, robots, sitemap y una URL negativa elevan la comprobación a 76 solicitudes: 75 respuestas HTTP 200 y un 404 esperado. La inspección automatizada de navegador abarca 23 rutas representativas, en 1440 × 960 y 390 × 844, con tema claro y oscuro: 92 estados con capturas, axe y observadores de rendimiento. El resto de registros se cotejó con HTTP, datos y plantillas de código; no se probó cada combinación posible del comparador.

Evidencia: [censo](audit-evidence/routes.md), [HTTP/SSR](audit-evidence/route-audit.json) y [navegador](audit-evidence/browser-audit.json). Las capturas históricas de audit-evidence/screenshots/ se conservan solo localmente por los permisos pendientes de fotografías; las de la implementación con tarjetas propias se encuentran en audit-evidence/store-comparison/. La evaluación heurística y axe no sustituyen pruebas de comprensión con usuarios ni certifican conformidad WCAG. Quedan pendientes lectores de pantalla reales, zoom al 200 % y dispositivos físicos.

## 2. Qué funciona y debe conservarse

- El hero comunica una propuesta educativa, ofrece búsqueda real y accesos a herramientas existentes. No hace falta otro rediseño general para solucionar los principales problemas encontrados.
- Navegación adaptable, menú More, tema persistido, enlace para saltar al contenido y estilos de foco. Las tarjetas no requieren hover para navegar.
- Catálogo con filtros, resultados vacíos y restablecimiento; fichas que reconocen etiquetas parciales y precios ausentes.
- Comparador con hechos, fuentes, incertidumbres y URL compartible. Los lectores editoriales ya separan Overview, Ingredients & price y Evidence.
- Identificación con confirmación manual de nombre y tamaño; lectura local de QR y fallback manual. No demuestra autenticidad de envases.
- Calculadora de dos a seis filas con validación y unidades explícitas: 30 USD/30 mL frente a 45 USD/60 mL muestra un coste por mL un 25 % menor; volumen cero deshabilita compartir.

## 3. Hallazgos por página y recorrido

| Área | Ruta | Estado | Diagnóstico comprobado | Recomendación |
| --- | --- | --- | --- | --- |
| Homepage | / | Funcional con limitaciones | Hero/buscador/preview reales; después se repite catálogo completo y varios CTA de herramientas. Mensaje comprensible en evaluación heurística; comprensión en cinco segundos no medida con usuarios. | Conservar hero; priorizar confianza, búsqueda y bytes antes de otro rediseño; PV-001/006/013/016. |
| Universal search | /search/ y parámetros | Funcional con limitaciones | Combobox, grupos y resultados reales; GHK-Cu→1 ingrediente; sin expansión de relaciones, typo normalizado o facetas. | PV-006/007/019; no chatbot por defecto. |
| Skincare hub | /skincare/ | Funcional con limitaciones | Lista los 11 productos y repite entradas del Home; target-size aislado en metodología. | PV-014; definir si el hub tiene una tarea distinta antes de retirar rutas. |
| Product explorer | /skincare/products/ | Funcional con limitaciones | Seis filtros, búsqueda y reset; NIOD devuelve 1. Sin orden ni URL para todos los filtros. | PV-015; conservar filtro de precio disponible y estados vacíos. |
| Product detail ×11 | /skincare/products/[slug]/ | Funcional con limitaciones | Tamaño, etiqueta parcial, fecha, fuente, precio y comparaciones. No INCI completo. Choose a comparison preselecciona otro producto arbitrario. P-TIOX mezcla contexto regional con aviso. | PV-010/016; no inferir concentración/eficacia; conservar precio ausente de COSRX. |
| Ingredients index ×1 | /skincare/ingredients/ | Funcional | 21 fichas enlazadas; carece de búsqueda/facetas propias, no urgente con volumen actual. | Conservar; integrar navegación desde búsqueda universal, PV-006. |
| Ingredient detail ×21 | /skincare/ingredients/[slug]/ | Funcional con limitaciones | Identidad, educación, límites, fuentes y lista inversa de productos existen. Ausencia de bandera no prueba revisión; no hay registro estructurado de aliases. | PV-003/006/009; no proponer crear desde cero el vínculo con productos. |
| Interactive comparator | /skincare/compare/ y a, b | Funcional con limitaciones | Selección visual, hechos comparables, unit prices, unknowns, fuentes y URLs. Solo catálogo facial; no ranking de eficacia. | PV-011/016; evaluar tarea de seleccionar segundo producto y comprensión de cantidades. |
| Editorial comparisons ×10 | /skincare/compare/[slug]/ | Funcional, contenido draft | Tres pestañas y respuestas/documentación ya implementadas. Siete modos label y tres research tras default; texto móvil empieza por tarjetas. | PV-003/009/011/012; conservar todas las referencias. |
| Question-led entry | /skincare/choose/ | Funcional con limitaciones | Selección por pregunta usa comparaciones disponibles, no motor diagnóstico. | Conservar como recorrido para principiantes; enlazar contexto y verificar cobertura al crecer. |
| Guides index +2 | /skincare/guides/ y [slug] | Funcional, contenido draft | Guías porcentajes y Matrixyl, citas y ejemplos explícitos. Solo dos; no autoría aprobada. | PV-017; mejorar estas antes de ampliar cientos. |
| Peptide library index | /library/ | Funcional con limitaciones | Puerta a cosmética, categorías y haircare; tres artículos, no enciclopedia de péptidos exhaustiva. | Mostrar alcance/piloto y crear entrada cosmética básica; PV-017. |
| Library briefs ×3 | /library/peptide-categories/, /retatrutide/, /bpc-157/ | Funcional, contenido draft | Separan contexto experimental/medicinal/cosmético y advierten review pending. La fecha de comprobación se codifica en el componente. | PV-003/009/017; sin protocolos terapéuticos ni equivalencia regulatoria global. |
| Identification | /skincare/identify/ | Funcional con limitaciones | Búsqueda manual, selección y confirmación exacta; no autentica lote/envase. Scanner resuelve QR propios; lista GTIN vacía. | PV-022; wording debe distinguir lectura de códigos de cobertura barcode real. |
| Price calculator | /tools/price-per-ml/ | Funcional con limitaciones | 2–6 filas, USD, mL/US fl oz, validación, porcentaje y URL compartible; no importa ofertas ni convierte monedas. | Conservar; conectar datos solo después de variante/mercado; PV-018. |
| Hair & scalp ×4 | /haircare/, producto y 2 ingredientes | Piloto funcional | 1 producto y 2 ingredientes separados del catálogo facial; draft/noindex y límites claros. | PV-008; no presentar como cobertura completa ni forzar comparación facial. |
| Methodology | /methodology/ | Funcional con límites editoriales | Procedimiento de fuentes, precios, incertidumbre, conflicto y review. Predomina prosa; política no equivale a workflow ejecutado. | PV-003/009/017 para workflow y revalidación. |
| Sources | /sources/ | Funcional con limitaciones | 34 fuentes agrupadas a nivel muy amplio; detailed evidence notes cubren30. No buscador independiente de estudios. | PV-009; faceta por tipo/entidad solo cuando mejora tareas reales. |
| About | /about/ | Parcialmente implementada | Texto de operador pendiente en producción. | PV-001, bloqueo de confianza. |
| Contact & corrections | /contact/ | Parcialmente implementada | Instrucciones de corrección, pero sin canal configurado. Corrections no tiene página propia; se agrupa aquí. | PV-001; no exigir nueva URL solo por nombre. |
| Privacy | /privacy/ | Parcialmente implementada | Describe hosting no seleccionado pese a Cloudflare activo; logs, identidad/retención/contacto pendientes. | PV-001; cotejar configuración real antes de declarar política definitiva. |
| Terms | /terms/ | Provisional | Limitaciones y scope explícitos; el texto declara términos MVP preliminares y falta jurisdicción. | PV-001; revisión del propietario/asesoría. |
| Editorial policy | /editorial-policy/ | Política presente, operación parcial | Independencia y criterios claros; sin evidencias de aprobaciones, autores/revisores en cada versión. | PV-003/017. |
| Affiliate disclosure | /affiliate-disclosure/ | Funcional, declaración por verificar operacionalmente | Declara ausencia de acuerdos; URLs actuales van a fabricantes y affiliateUrl nulo. No hay pipeline de monetización activo. | No anunciar partners ni añadir SDK. Revalidar cuando cambie la relación. |
| Robots/sitemap/404 | /robots.txt, /sitemap.xml y URL negativa | Funcional en beta | Sitemap vacío por gate; robots permite leer noindex; URL desconocida responde404. | PV-020 después de gobernanza; no desbloquear Google ahora. |

### Homepage y comprensión inicial

La propuesta resulta comprensible en evaluación heurística, pero no se ha medido la comprensión en cinco segundos con usuarios. Después del hero se repiten el catálogo de once productos y varias entradas a herramientas. Conviene probar una selección de ejemplos y recorridos más clara, conservando fuentes y alcance editorial. Es una hipótesis de diseño, no una mejora de conversión demostrada.

### Catálogo y fichas

El filtro de marca funciona: NIOD devuelve un producto. La primera prueba agotó su espera porque buscaba una etiqueta exacta; una revisión focalizada del control corrigió el diagnóstico. Su etiqueta implícita incorpora texto de las opciones, por lo que PV-015 propone un nombre accesible explícito, orden y persistencia de filtros en URL.

Las fichas ya enlazan ingredientes, fuentes y comparaciones. No contienen un INCI completo estructurado: muestran una selección declarada como parcial. El botón Choose a comparison precarga un segundo producto por orden del catálogo; PV-016 debe permitir una elección deliberada o identificarlo claramente como ejemplo. El contexto regional de P-TIOX necesita trazabilidad por campo: la etiqueta seleccionada del Reino Unido no acredita equivalencia de fórmula con Estados Unidos.

### Comparaciones y documentación

La lectura en tres niveles ya existe. La mejora propuesta consiste en adelantar la síntesis y mantener el detalle accesible. En móvil, tarjetas y precios ocupan gran parte del primer pantallazo antes del resumen. El lector NIOD contiene aproximadamente 5.189 palabras en el DOM y 379 visibles en la muestra inicial. Eliminar texto sin criterio puede borrar limitaciones relevantes; evaluar si una persona identifica tres hechos y una incertidumbre sin interpretar que hay un ganador de eficacia.

### Biblioteca, ingredientes y haircare

Ya existen vínculos de ingrediente a productos, de guía a comparaciones y de biblioteca a haircare. Falta aprovechar esas relaciones en la búsqueda y conservar el contexto entre recorridos. La biblioteca tiene tres artículos y haircare un producto y dos ingredientes: comunicar cobertura piloto, sin presentar una enciclopedia completa ni mezclar automáticamente el comparador facial con capilar.

## 4. Componentes y sistema visual

| Componente | Conservar | Refinamiento y aceptación |
| --- | --- | --- |
| Header, More y tema | Marca, rutas y controles accesibles | Probar una entrada compacta a búsqueda fuera del Home; conservar jerarquía del menú. |
| Hero y acciones | Propuesta, búsqueda y preview reales | Optimizar recursos y reducir repetición posterior antes de cambiar la composición. |
| Resultados | Grupos, teclado y enlaces reales | Mostrar razones de coincidencia y relaciones; evitar resultados genéricos que ocultan identidad. |
| Enlaces y botones | Semántica y foco visible | Corregir el objetivo táctil del enlace de metodología; verificar el área real y sus excepciones. |
| Tarjetas y badges | Precio ausente, fechas y estado draft | Label checked no equivale a aprobación clínica; evitar puntuaciones de eficacia. |
| Pestañas y acordeones | Lectura por niveles y contenido SSR | Conservar URL/hash, Back y fuentes; verificar lectura sin JavaScript cuando proceda. |
| Tablas y pares | Hechos, unidades e incertidumbres | Mantener geometría móvil y no fusionar ingredientes con identidades distintas. |
| Citas y diálogos | Escape y retorno del foco | Probar lector de pantalla; ninguna limitación esencial debe existir solo en tooltip. |
| Formularios y filtros | Validación, reset y mensajes | Etiquetas explícitas, unidades visibles y estado compartible. |
| Imágenes | Identidad exacta de producto y tamaño | Acreditar derechos y servir miniaturas reales; conservar el arte aprobado de la marca. |
| Estados vacíos | Mensajes honestos y alternativa manual | Ofrecer rutas existentes, sin prometer cobertura de códigos aún inexistente. |
| Footer e institucionales | Metodología, fuentes y divulgaciones | Completar operador, contacto y política real; comunicar beta de forma coherente. |
| CSS y tokens | Tokens semánticos, Manrope/Inter y ambos temas | Reducir overrides por componente y con regresiones; evitar una extracción masiva de globals.css. |

## 5. Accesibilidad y recorridos funcionales

En los 92 estados no hubo errores pageerror ni desbordamiento horizontal de documento en los tamaños probados. Axe detectó un hallazgo de componente repetido en cuatro estados: target-size del enlace See our methodology en /skincare/, con caja de 142 × 17 px y separación insuficiente. Revisar la excepción de enlace en línea y la superficie de interacción; no convertir este resultado en una conclusión global de incumplimiento.

Funcionaron la búsqueda GHK-Cu con teclado, la calculadora con entradas válidas e inválidas, la identificación con confirmación, la resolución de un QR propio pegado, la pestaña Evidence y el diálogo de cita con Escape y retorno del foco. El filtro de marca pasó la revisión focalizada descrita arriba. Evidencia: [prueba inicial](audit-evidence/browser-audit.json) y [corrección del sondeo](audit-evidence/focused-browser-checks.json).

Pendiente: NVDA/VoiceOver, zoom y tamaño de texto al 200 %, alto contraste, tacto real y cámara física. El conteo geométrico de controles pequeños no se interpreta automáticamente como fallo WCAG: hay excepciones de texto en línea y espaciado. Mantener el soporte de reduced-motion observado en el código.

## 6. Rendimiento medido y límites

La repetición usó Chromium headless, viewport 390 × 844, escala 1 y un contexto fresco por muestra, sin limitar CPU ni red. Los observadores registraron LCP y CLS durante la carga y 1,2 segundos después de carga/fuentes. Es una observación de laboratorio, no Lighthouse, un móvil físico ni el percentil 75 de usuarios reales. [Resultados y método](audit-evidence/performance-followup.json).

| Ruta | Muestra | LCP observado | CLS observado | TTFB |
| --- | --- | --- | --- | --- |
| Home | 1 | 1,468 s | 0,0314 | 663 ms |
| Home | 2 | 1,432 s | 0,0329 | 667 ms |
| Home | 3 | 1,008 s | 0,0329 | 294 ms |
| Comparación NIOD | 1 | 1,020 s | 0,2308 | 213 ms |
| Comparación NIOD | 2 | 0,924 s | 0,2059 | 315 ms |
| Comparación NIOD | 3 | 1,036 s | 0,2308 | 260 ms |

El CLS del lector NIOD, de 0,206 a 0,231, se reproduce en tres cargas. Google establece 0,1 como umbral de buen CLS, con evaluación de campo al percentil 75; estas muestras no permiten emitir ese dictamen de campo. [Definiciones oficiales](https://web.dev/articles/vitals).

Los saltos afectan breadcrumbs, marca y encabezado durante el cambio de fuente. Una prueba aislada que bloqueó las solicitudes woff2 solo en el navegador de diagnóstico mantuvo las fuentes de respaldo y produjo una suma de CLS aproximada de 0,000051. Apoya la hipótesis de geometría tipográfica, sin probar que sea la única causa. PV-012 debe ajustar métricas de fallback, carga crítica y espacio del breadcrumb, con comparación antes/después; no ocultar texto para mejorar la cifra. [Aislamiento](audit-evidence/font-isolation.json).

El isotipo servido mediante /_next/image/ con ancho solicitado de 48 px transfirió **802.223 bytes**, aproximadamente 945 ms en la muestra, aunque se muestra a unos 44 px. La entrega conserva el peso del original. PV-013 propone una variante pequeña comprobada en red, con presupuesto inicial de 20 KB sujeto a calidad visual, conservando el arte aprobado. No se afirma que ese ahorro ya se haya implementado. Las imágenes de producto más grandes muestreadas fueron de 133.327, 127.329 y 125.474 bytes.

El JS transferido observado ronda 239–247 KB y el CSS 26,45 KB codificados; esas cifras no miden código sin usar. El primer Home de escritorio registró LCP de 3,796 s; las visitas posteriores compartían recursos calientes y no son cargas frías equivalentes. No se midieron Lighthouse, INP de campo, TBT ni Speed Index. Un conteo de tareas largas no equivale a TBT. Revisar caché de recursos versionados en PV-021 y usar RUM/CrUX cuando haya tráfico suficiente.

## 7. Navegación y aceptación propuestas

Principiante → fundamentos; duda concreta → búsqueda; producto en mano → identificación y confirmación; comparación → selección del par y síntesis; investigación → fuentes y preparación estudiada; compra → variante, mercado y precio fechado. Son entradas compatibles, no un embudo obligatorio.

Conservar las rutas actuales y usar More para destinos secundarios. La búsqueda global debe permitir retomar una pregunta desde otras páginas; los selectores locales siguen teniendo sentido para elegir productos. Validar tareas sin ayuda, conservación de consulta/par y distinción entre etiqueta y estudio. La metodología general complementa la fuente por afirmación.

## 8. Censo individual de páginas

| Ruta | HTTP | Clasificación de revisión | Hallazgos aplicables |
| --- | --- | --- | --- |
| / | 200 | HTTP + navegador + fuente | Ver plantilla y gates comunes |
| /about/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-001 |
| /affiliate-disclosure/ | 200 | HTTP/SSR + registro de datos + plantilla de código | Ver plantilla y gates comunes |
| /contact/ | 200 | HTTP + navegador + fuente | PV-001 |
| /definitely-not-a-peptivelo-page/ | 404 | Negativo esperado | Ver plantilla y gates comunes |
| /editorial-policy/ | 200 | HTTP/SSR + registro de datos + plantilla de código | Ver plantilla y gates comunes |
| /haircare/ | 200 | HTTP + navegador + fuente | PV-002/008/017 |
| /haircare/ingredients/acetyl-tetrapeptide-3/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/008/017 |
| /haircare/ingredients/biotinoyl-tripeptide-1/ | 200 | HTTP + navegador + fuente | PV-002/008/017 |
| /haircare/products/the-ordinary-hair-density/ | 200 | HTTP + navegador + fuente | PV-002/008/017 |
| /library/ | 200 | HTTP + navegador + fuente | PV-003/009/017 |
| /library/bpc-157/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/017 |
| /library/peptide-categories/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/017 |
| /library/retatrutide/ | 200 | HTTP + navegador + fuente | PV-003/009/017 |
| /methodology/ | 200 | HTTP + navegador + fuente | Ver plantilla y gates comunes |
| /privacy/ | 200 | HTTP + navegador + fuente | PV-001 |
| /robots.txt | 200 | Documento técnico HTTP | Ver plantilla y gates comunes |
| /search/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-006/007/019 |
| /search/?q=GHK-Cu | 200 | Variante de query funcional | PV-006/007/019 |
| /sitemap.xml | 200 | Documento técnico HTTP | Ver plantilla y gates comunes |
| /skincare/ | 200 | HTTP + navegador + fuente | PV-014/016 |
| /skincare/choose/ | 200 | HTTP + navegador + fuente | Ver plantilla y gates comunes |
| /skincare/compare/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/?a=ordinary-copper&b=niod-cais3 | 200 | Variante de query funcional | PV-003/009/011/012 |
| /skincare/compare/cosrx-six-peptide-vs-the-ordinary-copper/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/geek-gorgeous-power-peptides-vs-the-ordinary-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/medik8-liquid-peptides-vs-the-ordinary-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/naturium-multi-peptide-vs-the-ordinary-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/niod-cais3-vs-the-ordinary/ | 200 | HTTP + navegador + fuente | PV-003/009/011/012 |
| /skincare/compare/skinceuticals-ptiox-vs-the-ordinary-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/the-ordinary-argireline-vs-multi-peptide-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/ | 200 | HTTP + navegador + fuente | PV-003/009/011/012 |
| /skincare/compare/the-ordinary-multi-peptide-ha-vs-copper/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/compare/timeless-synthe6-vs-the-ordinary-matrixyl/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/011/012 |
| /skincare/guides/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/017 |
| /skincare/guides/matrixyl-3000-vs-synthe6/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/009/017 |
| /skincare/guides/peptide-percentages-explained/ | 200 | HTTP + navegador + fuente | PV-003/009/017 |
| /skincare/identify/ | 200 | HTTP + navegador + fuente | Ver plantilla y gates comunes |
| /skincare/ingredients/ | 200 | HTTP + navegador + fuente | PV-003/006/009 |
| /skincare/ingredients/acetyl-hexapeptide-8/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/acetyl-tetrapeptide-2/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/acetyl-tetrapeptide-5/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/carnosine/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/copper-palmitoyl-heptapeptide-14/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/copper-tripeptide-1/ | 200 | HTTP + navegador + fuente | PV-003/006/009 |
| /skincare/ingredients/dipeptide-diaminobutyroyl-benzylamide-diacetate/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/heptapeptide-15-palmitate/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/oligopeptide-68/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/palmitoyl-pentapeptide-4/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/palmitoyl-sh-hexapeptide-13-serine-sp-amide/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/palmitoyl-tetrapeptide-7/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/palmitoyl-tripeptide-1/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/palmitoyl-tripeptide-38/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/palmitoyl-tripeptide-8/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/pentapeptide-18/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/sh-polypeptide-121/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/tetrapeptide-21/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/tripeptide-1-acetate/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/tripeptide-1-copper-acetate/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/ingredients/tripeptide-29/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-003/006/009 |
| /skincare/products/ | 200 | HTTP + navegador + fuente | PV-002/010/016/018 |
| /skincare/products/?q=NIOD | 200 | Variante de query funcional | PV-002/010/016/018 |
| /skincare/products/cosrx-six-peptide-skin-booster-mini/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/geek-and-gorgeous-power-peptides/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/medik8-liquid-peptides/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/naturium-multi-peptide-advanced-serum/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/niod-cais3/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/skinceuticals-ptiox/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/the-ordinary-argireline-solution-10/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/the-ordinary-matrixyl-10-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/the-ordinary-multi-peptide-copper/ | 200 | HTTP + navegador + fuente | PV-002/010/016/018 |
| /skincare/products/the-ordinary-multi-peptide-ha/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /skincare/products/timeless-matrixyl-synthe6-serum/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-002/010/016/018 |
| /sources/ | 200 | HTTP + navegador + fuente | Ver plantilla y gates comunes |
| /terms/ | 200 | HTTP/SSR + registro de datos + plantilla de código | PV-001 |
| /tools/price-per-ml/ | 200 | HTTP + navegador + fuente | Ver plantilla y gates comunes |

La clasificación describe el método de comprobación, no uso manual exhaustivo de cada enlace o revisión de cada afirmación científica. Los datos por registro están en [Data & Content Gaps](PEPTIVELO_DATA_CONTENT_GAPS.md). La priorización y pruebas de cada cambio figuran en el [backlog](PEPTIVELO_IMPLEMENTATION_BACKLOG.md).
