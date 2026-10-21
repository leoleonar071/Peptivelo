# Peptivelo: estrategia SEO y AEO

19 de octubre de 2026. Marca elegida por el propietario: Peptivelo; dominio pendiente de compra. Audiencia inicial: compradores de cosmética en Estados Unidos, contenido en inglés y observaciones de precios en USD. El titular reside en Perú. Esta estrategia no crea páginas públicas, activa indexación ni supone aprobación de anuncios o afiliación.

**Actualización de ejecución:** las dos guías propuestas y su hub ya están integrados localmente, y las cinco comparaciones se reforzaron con notas de decisión y preguntas con fuentes. Siguen como borradores/noindex; véase [la entrega de contenido](SEO_AEO_CONTENT_BATCH.md). Las descripciones de trabajo propuesto se conservan debajo como registro del plan original.

## 1. Decisión y objetivo

Construir una publicación útil sobre péptidos empezando por una necesidad concreta: comprender diferencias entre sérums antes de comprar. El objetivo comercial es atraer investigación de compra relevante y facilitar decisiones informadas. Las citas en IA, impresiones y posiciones son indicadores de descubrimiento; no equivalen a ingresos.

SEO: facilitar que buscadores descubran, comprendan y presenten páginas útiles. AEO/GEO: mejorar las posibilidades de que sistemas de respuesta encuentren y utilicen información fiable de esas páginas. Comparten buena parte del trabajo; no se prometen primeras posiciones ni citas.

No esperar a reunir cientos de páginas para publicar. Completar la primera colección revisada, ponerla en un dominio público, medir y ampliar según preguntas y resultados reales. Crear una URL solo cuando aporte una respuesta propia que no esté ya bien resuelta en otra.

## 2. Inventario y primera ola

Actualización: el catálogo local tiene nueve fichas de productos, diecisiete guías de nombres exactos y ocho análisis comparativos en borrador; véase `CATALOG_EXPANSION.md`. El cuadro siguiente conserva la primera ola como referencia. Estas cifras no representan páginas listas para competir: parte del contenido establece solo identidad/etiqueta y requiere enriquecimiento o una decisión de noindex.

| Grupo | Prioridad | Trabajo anterior a indexar |
| --- | --- | --- |
| Cinco comparaciones existentes | Alta: intención de compra concreta | Revisar respuesta inicial y análisis original, fuentes de cada diferencia, precios por variante, instrucciones y límites. Dar prioridad a las preguntas ya detectadas; el par Geek & Gorgeous/HA sigue siendo hipótesis editorial. |
| Seis fichas de producto | Alta: investigación de producto | Aportar una razón para consultar nuestra ficha además de la marca: explicación de etiquetas, significado de porcentajes, coste comparable y preguntas resueltas. Una ficha que solo repita datos necesita más trabajo. |
| Doce guías de ingredientes | Selectiva | Ampliar primero las relevantes para las comparaciones y con fuentes suficientes. Mantener accesibles pero fuera de indexación las que aporten poco más que una definición; esa selección todavía requiere implementación/revisión. No cambiar identidades químicas para fusionar páginas. |
| Hub `/skincare/` | Alta | Organizar el recorrido: entender nombres → comparar productos → consultar fuentes/tienda. Una introducción útil y enlaces contextualizados, no un directorio vacío. |
| Calculadora existente | Media | Mejorar la explicación y un ejemplo dentro de la misma herramienta; no crear otra página que duplique su intención de precio por mL. |
| Dos guías nuevas | Alta después de revisar las existentes | 1. `Matrixyl 3000 vs Matrixyl synthe’6: what the names mean`. 2. `What peptide percentages on serum labels actually tell you`. Son propuestas pendientes de validar en resultados de búsqueda y de revisión de contenido. |

Las dos guías nuevas no deben repetir la comparación de dos productos: una explica sistemas comerciales y la otra cómo leer divulgaciones de cantidades. Pueden responder varias preguntas cercanas sin multiplicar URLs para cada sinónimo.

## 3. Investigación de búsquedas antes de ampliar

Para cada candidata, registrar: pregunta del comprador, mercado, consulta principal, resultados observados, qué necesidad satisface cada resultado, qué dato original podemos aportar, fuente disponible, posible solapamiento con páginas propias y mantenimiento necesario.

Las primeras consultas propuestas son los cinco pares ya seleccionados, los nombres exactos de los seis productos, Matrixyl 3000 frente a synthe’6 y lectura de porcentajes de péptidos. Son hipótesis de trabajo, no volúmenes medidos ni palabras de dificultad conocida.

Después del lanzamiento, usar Search Console para encontrar consultas reales estadounidenses, páginas con impresiones y preguntas no resueltas. Si dos URLs compiten por la misma intención, revisar diferenciación o consolidar con redirección apropiada; una canonical no sustituye una estrategia de contenido clara.

## 4. Plantilla editorial de una página fuerte

1. Título específico que refleje la pregunta y un resumen que permita entender la respuesta sin leer todo.
2. Explicación de por qué la diferencia importa para una compra, sin atribuir eficacia a precio o número de ingredientes.
3. Tabla legible de hechos: variante, tamaño, precio/fecha, nombres exactos y ausencias.
4. Profundización útil: significado de nombres comerciales, porcentajes, límites de la evidencia y diferencias entre formulación completa e ingredientes seleccionados.
5. Fuentes junto a afirmaciones comprobables, fechas reales de consulta y cambios sustantivos.
6. Autor responsable real y alcance de su trabajo. Revisor identificado solo si efectivamente revisó; no inventar experiencia clínica o pruebas personales.
7. Enlaces relacionados que ayuden al siguiente paso y fabricante/comercio claramente identificado.

La extensión depende de la pregunta; no hay un objetivo de palabras o preguntas frecuentes obligatorio. No presentar un análisis documental como una reseña de uso. Si posteriormente probamos un producto, documentar qué se probó y cómo, con material propio y límites de la experiencia.

## 5. SEO técnico de publicación

- Comprar y configurar el dominio elegido, HTTPS y una única versión preferida del dominio. Aplicar Peptivelo en nombre del sitio y metadatos. No hay una migración pública previa que se haya verificado; solo planificar redirecciones externas si existe un dominio anterior real.
- Mantener `SITE_INDEXABLE=false` mientras se prepara el servicio. Al lanzar, permitir indexación de páginas seleccionadas/revisadas y comprobar que no queda el encabezado global noindex en esas páginas.
- Conservar noindex en estados personales de comparación, filtros/búsquedas y análisis pendientes. No generar todas las combinaciones de seis productos ni indexar parámetros como páginas editoriales.
- Actualizar sitemap con URLs canónicas, indexables y revisadas; usar fechas de modificación solo cuando reflejen cambios reales. La política actual solo distingue publicados/borradores: la selección por calidad de guías requiere trabajo adicional.
- Revisar HTML renderizado, canonical, códigos 200/404, enlaces internos y rastreo desde robots/CDN. No bloquear en robots una página cuya directiva noindex debe poder leer el buscador.
- Medir rendimiento en el dominio público: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 como objetivos, no resultados ya obtenidos. Reservar espacio para imágenes/anuncios y comprobar accesibilidad móvil.
- Mantener datos estructurados coherentes con lo visible: identidad del sitio y breadcrumbs; Article solo con datos editoriales reales. No añadir estrellas, reseñas, Offers o Product como atajo a resultados enriquecidos sin cumplir sus condiciones.
- Configurar Search Console y Bing Webmaster Tools; revisar controles actuales de búsqueda generativa y la inspección de URLs. Enviar sitemap ayuda a descubrir, no garantiza indexación.

## 6. AEO: información que se pueda comprender y comprobar

Cada sección debe poder leerse con contexto: identificar el producto/ingrediente exacto, distinguir hecho de interpretación, expresar condiciones y enlazar la fuente. Una respuesta breve inicial y tablas claras ayudan al lector; no se propone cortar artificialmente los artículos en fragmentos para sistemas de IA.

Nuestra aportación propia será el vínculo entre dato y decisión: misma variante, cantidades divulgadas frente a desconocidas, formas de cobre distintas y por qué no permiten declarar equivalencia. Registrar también las ausencias relevantes en lugar de completar las tablas con suposiciones.

Comprobar acceso de Googlebot, Bingbot y, según la política de distribución elegida, rastreadores de búsqueda de otros sistemas. El acceso de búsqueda y el de entrenamiento no son la misma decisión. Cualquier configuración debe probarse en robots y en la protección del hosting; permitir un bot no garantiza una cita.

No priorizar `llms.txt`, una supuesta puntuación AEO, páginas por cada variante de pregunta ni marcado especial para IA. Google documenta que estos archivos no benefician el posicionamiento en su buscador y que no existe un schema especial obligatorio. Las preguntas frecuentes visibles pueden seguir siendo útiles para lectores; Google retiró el resultado enriquecido FAQ en mayo de 2026, así que no se promete ese resultado.

## 7. Autoridad, experiencia y enlaces externos

Mostrar quién opera el proyecto, metodología, fuentes, política de correcciones y relaciones comerciales. La residencia en Perú se declara honestamente; la orientación US se demuestra con producto, mercado, moneda y contenido, no con una dirección estadounidense inventada.

Crear activos que merezcan una referencia: calculadora, comparación de nombres comerciales/INCI, registro documentado de cambios de etiquetas y explicaciones visuales propias. Para un historial de cambios se necesitan observaciones reales; no inventar un historial retroactivo.

Distribuir explicaciones originales en vídeo y publicaciones con enlaces a la página que amplía la pregunta. Más adelante, colaborar con especialistas y publicaciones pertinentes con autoría y alcance reales. No comprar paquetes de backlinks ni menciones falsas. No se ha autorizado ni realizado contacto con terceros.

## 8. Monetización sin obstaculizar la tarea

Comparaciones y fichas: enlaces por producto/variante a comercios legítimos, primero ordinarios y luego remunerados cuando el programa esté aprobado. Guías educativas: evaluar AdSense tras la aprobación, con posiciones fuera de la tabla y controles.

Registrar visitas relevantes → comparación/guía → clic a tienda → compra atribuida → comisión aprobada/pagada. Mantener rendimiento, claridad comercial e independencia. Una cita de IA sin clic no se contabiliza como visita ni venta. La decisión de ampliar temas no depende exclusivamente de la comisión.

## 9. Secuencia de 90 días

Plazos orientativos de ejecución, no promesas de resultados o admisión de terceros.

| Etapa | Entregable | Señal para avanzar |
| --- | --- | --- |
| Días 1–14 | Dominio/operación, revisión de las cinco comparaciones, enriquecimiento de seis fichas y selección de guías indexables. Preparar las dos guías nuevas y revisar sus fuentes/intenciones. | Cada página responde una pregunta distinta, tiene fuentes y responsable, y pasa revisión de publicación. No esperar a llenar el calendario para lanzar lo que ya cumpla. |
| Días 15–30 | Publicación de la colección revisada, Search Console/Bing, sitemap y medición comprobados; distribución de explicaciones en inglés. | Acceso e indexación revisados; corregir problemas de descubrimiento antes de añadir más URLs. Las solicitudes comerciales siguen sus propios plazos. |
| Días 31–60 | Mejorar páginas según consultas y errores de comprensión; comprobar Naturium, Timeless y Medik8 como siguiente lote. | Nueva incorporación justificada por una pregunta distinta y fuentes mantenibles; no simplemente por poder rellenar un registro. |
| Días 61–90 | Añadir las comparaciones que sustenten esos datos; reforzar enlaces internos y activos originales. Revisar ingresos y costes si ya hay programas activos. | Conservar lo que aporta utilidad; reformular o consolidar páginas redundantes. Ampliar otro sector solo con capacidad editorial adecuada. |

No empezar ahora con todas las moléculas emergentes. El nombre admite expansión, pero cada nueva familia requiere fuentes, distinción de estatus y revisión proporcionales a sus afirmaciones. La primera colección debe demostrar utilidad antes de diversificar.

## 10. Cuadro de control

- Descubrimiento: URLs canónicas enviadas/indexadas y errores reales de rastreo. Una exclusión prevista no es un error.
- SEO: consultas/impresiones/clics de Estados Unidos por grupo de páginas; analizar posición y CTR con contexto, no exigir un porcentaje universal.
- IA: informes de búsqueda generativa de Google cuando estén disponibles/configurados y AI Performance de Bing; referencias desde asistentes en analítica. Las coberturas difieren, no sumarlas como una audiencia completa.
- Utilidad: comprensión de términos y límites en pruebas con lectores; uso de comparación y calculadora. Abrir una ayuda no demuestra comprenderla.
- Negocio: clics a comercios, ventas atribuidas, comisiones aprobadas/pagadas e ingreso publicitario real. Separar país de visita, país del operador y momento de cobro.
- Mantenimiento: precios pasados de fecha, cambios de INCI, enlaces rotos, coste editorial y rendimiento móvil tras añadir integraciones.

Revisión periódica de resultados y prioridades según datos suficientes. Si aún no hay impresiones, diagnosticar acceso, indexación y adecuación de consulta; no atribuirlo automáticamente al número de artículos. Si hay visitas sin clics, revisar utilidad comercial; si hay clics sin ventas, verificar disponibilidad, enlaces y atribución antes de culpar al contenido.

## Fuentes oficiales consultadas

- [Google: optimización para funciones generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- [Google: contenido útil y orientado a personas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- [Google: análisis y reseñas de calidad](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews).
- [Google: cambios de documentación, incluida la retirada de FAQ y aclaración sobre llms.txt](https://developers.google.com/search/updates).
- [Bing: medición de temas, consultas y citas de IA](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/).
- [OpenAI: rastreadores y separación entre búsqueda y entrenamiento](https://developers.openai.com/api/docs/bots).

La base técnica existente es útil, pero no implica visibilidad garantizada. No se han creado las dos guías propuestas, modificado la selección de indexación de ingredientes, verificado un dominio público ni activado cuentas externas en esta entrega.
