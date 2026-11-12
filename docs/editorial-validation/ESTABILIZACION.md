# Estabilización editorial de Peptivelo

## Rutas retiradas

En 6f21ad4 las 18 rutas del registro histórico tenían una excepción que permitía mostrar borradores. La misma política exigía estado publicado y aprobaciones para indexarlas. La excepción se retiró en 10f8fde. El 11 de noviembre las 18 devolvieron 404 en producción, sin redirección, y el sitemap devolvió 200 sin incluirlas. La búsqueda pública realizada para comparaciones y briefs tampoco devolvió resultados. Queda por comprobar el tráfico orgánico y la cobertura histórica en Search Console con datos de la propiedad. El estado HTTP y una búsqueda pública no permiten medir clics, impresiones o enlaces externos.

| Grupo | Destinos | Contenido que conviene conservar |
| --- | ---: | --- |
| Comparaciones de producto | 10 | Lecturas de evidencia, citas y contexto de las ofertas. El comparador interactivo de los mismos productos sigue disponible. |
| Guías de etiquetas | 2 | Explicaciones de nombres y porcentajes con fuentes. Priorizar revisión por su papel de apoyo a ingredientes y comparaciones. |
| Biblioteca | 3 | Introducción a contextos y briefs de retatrutida y BPC-157. Mantener las URLs canónicas para una futura publicación revisada. |
| Cabello | 3 | Un perfil de producto y dos de ingredientes. El hub adicional permanece fuera de navegación mientras solo tenga borradores. |

El archivo stabilization-routes.json enumera las 18 URL y su respuesta individual. El barrido de enlaces en stabilization-internal-links.json registra las páginas de origen comprobadas. Antes de decidir reaperturas, cruzar esas URLs exactas con los clics, impresiones, enlaces y estado de indexación de Search Console. Revisar el contenido conservado y restaurar su misma URL cuando proceda. Una comparación interactiva se ofrece como acción desde la página de compra. Las URLs retiradas conservan su respuesta 404.

## GHK-Cu

| Plantilla | Fuente reutilizable | Pendiente |
| --- | --- | --- |
| Overview | Nombre INCI, resumen, qué es y límites del registro Copper Tripeptide-1 | Validar alcance y vínculo de identidad para el nuevo registro |
| How it works / applications | Propósito cosmético del catálogo, con sus fuentes y contexto | Texto y respaldo para afirmaciones adicionales |
| Research / safety | Bloques de evidencia y precauciones existentes y sus referencias | Verificar alcance documental, estudios primarios pertinentes y estado regulatorio por preparación, fecha y jurisdicción si se menciona |
| Products | Relación por ingrediente del catálogo con The Ordinary Copper 30 ml y COSRX mini 50 ml | Revisar etiquetas y variantes ante cambios de mercado |
| References / methodology | Fuentes registradas, fecha consultada y limitaciones de la ficha vigente | Referencias específicas para nuevos párrafos, método de selección y revisiones reales |
| FAQ, comparaciones, imagen y SEO | La ficha canónica conserva sus propios metadatos | Contenido aportado y aprobado para las secciones que se necesiten |

La preview monta IngredientEducation y PeptideProfile lado a lado. La plantilla recibe enlaces de producto ya filtrados por visibilidad. Para una futura integración, reutilizar PeptideProfile y sus bloques de secciones y referencias en la ruta canónica existente. Validar el contenido aprobado antes de elegir qué bloques se incorporan y mantener un único título principal y un único canonical. La ficha original sigue siendo la fuente pública vigente. El JSON de ampliación sigue en Draft.

## Procedencia de imágenes

El contrato de editorialImages admite proveedor, autor acreditado, licencia, evidencia de permiso, uso comercial, coincidencia de variante, cambios con IA, atribución y estado. Puede registrarse un candidato antes de guardar el archivo. Para mostrarlo como aprobado se exige un archivo local, un autor, evidencia de permiso y uso comercial permitido. Open Beauty Facts exige además evidencia de coincidencia exacta. La verificación de esos documentos es humana.

| Proveedor | Evidencia que guardar |
| --- | --- |
| Open Beauty Facts | Ficha, foto original, imgid, colaborador, licencia aplicable y GTIN o identificación verificable del mismo envase y tamaño |
| Marca | Recurso y autorización específica para el canal, territorio, duración y modificaciones |
| Afiliación | Feed y condiciones de uso, vigencia y restricciones de modificación |
| Usuario | Identidad acreditada, autoría o titularidad y permiso expreso de uso comercial y modificaciones |
| Tarjeta propia | Autoría de Peptivelo, procedencia de componentes y derechos aplicables. Usar las tarjetas de identificación existentes cuando no haya foto aprobada. |

Los resultados originales de Open Beauty Facts se conservan. El candidato The Ordinary de 30 ml queda pendiente de identidad y derechos. COSRX 150 ml se descarta para el mini de 50 ml. El archivo de resultados es un registro de candidatos, separado del catálogo. El esquema valida futuras entradas. La selección de fotografías para tarjetas de producto queda para la integración de la primera imagen verificada. Los registros actuales siguen usando sus tarjetas propias.

## Ciclo editorial

1. Aportar texto por sección, referencias consultables, fecha y alcance de cada afirmación y fotografías con su permiso. Empezar por GHK-Cu y seguir con semaglutida, tirzepatida, retatrutida, BPC-157 y TB-500. Para los dos briefs existentes conservar la URL histórica y contrastar con el material anterior.
2. Editar el JSON del registro correspondiente en src/data/peptides. Conservar los IDs. Ejecutar npm test y revisar con npm run editorial:preview desde el equipo local.
3. Registrar comprobación documental del propietario en la revisión editorial de la versión exacta. Esa comprobación cubre identidad, trazabilidad de fuentes, alcance, atribución y presentación. Usar el nombre o identificador real del propietario, fecha y alcance. La vista privada sigue disponible durante revisión.
4. El código actual exige una revisión independiente de tipo scientific donde requiresScientificReview está activo. Registrar esta segunda revisión solo cuando una persona cualificada haya evaluado esa versión. Una adaptación futura puede mostrar por separado “verificación documental del propietario” y “revisión profesional independiente”, o fijar requisitos distintos por alcance del contenido mediante una decisión editorial explícita. Actualmente la verificación del propietario no habilita por sí sola las publicaciones que exigen revisión científica.
5. Aprobar la versión exacta, verificar el destino canónico, los enlaces, la metadata y el sitemap. Presentar los resultados para autorización de despliegue.

## Resultado de la batería

| Categoría principal de los 192 fallos originales | Casos |
| --- | ---: |
| Expectativas anteriores al retiro de Draft | 125 |
| Rutas, navegación e indexación | 28 |
| Configuración o entorno de la corrida inicial | 36 |
| Funcionalidad | 2 |
| Autenticación o preview | 0 |
| Intermitente | 1 |
| Total | 192 |

La clasificación indica la causa principal atribuible al escenario. Los límites de 10 segundos y la concurrencia de 12 procesos de la corrida original pueden coexistir con expectativas antiguas. El detalle registra el motivo, el título, el dispositivo y el resultado en la última batería para cada uno de los 192 casos. Los 192 tienen resultado satisfactorio en esa batería.

Se corrigieron cuatro problemas de aplicación. Las preguntas de compra enviaban a comparaciones retiradas, el selector y las preguntas conservaban enlaces a un hub capilar retirado, el retorno contextual permitía un producto capilar privado y el botón de tema podía recibir un clic antes de estar listo. Los enlaces de retorno usan navegación nativa. Las pruebas de retorno esperan los destinos y distinguen “Back to product” de “Back to Products”.

La suite mantiene sus 366 casos y las mismas 11 omisiones preexistentes. Los escenarios de lectura pública de borradores ahora comprueban 404, ausencia de redirección o exclusión de la navegación, según el recorrido. Las aserciones de interacción con lectores históricos ya no se ejecutan contra sus URLs públicas. El código anterior queda en Git. Se reprodujeron cinco casos representativos de lectores, biblioteca y guías con el commit 6f21ad4 y pasaron.

| Comprobación | Correctas | Fallos | Omitidas |
| --- | ---: | ---: | ---: |
| Original con 12 procesos y 10 s | 163 | 192 | 11 |
| Control inicial con límites normales | 225 | 130 | 11 |
| Primera repetición completa | 349 | 6 | 11 |
| Segunda repetición completa | 351 | 4 | 11 |
| Pruebas de retorno y privacidad, antes de ajustar los pasos | 46 | 5 | 0 |
| Dos recorridos de retorno, dos repeticiones por dispositivo | 12 | 0 | 0 |
| Última batería pública | 355 | 0 | 11 |
| Preview con arranque frío concurrente | 7 | 2 | 0 |
| Preview tras compilar las rutas | 9 | 0 | 0 |
| Worker, rutas, compra y cabello | 15 | 0 | 0 |
| Lectores del commit histórico | 5 | 0 | 0 |
| Unitarias | 141 | 0 | 0 |

El control inicial se contaminó al editar pruebas mientras se ejecutaba. En 44 casos un proceso no encontró el título original. Sus totales se incluyen para trazabilidad y no sirven como referencia limpia. Las últimas comprobaciones de los recorridos de retorno se repitieron con los selectores definitivos en los tres dispositivos. La prueba privada con arranque frío agotó el tiempo en dos rutas. La misma autenticación y los seis espacios editoriales pasaron con las rutas compiladas. Se invalidó la contraseña local que apareció en el diagnóstico del proceso y se generó una nueva.

Compilaciones Next.js y Vinext correctas. El primer intento de compilación Next con salida aislada encontró tipos generados incompatibles de la compilación anterior de Vinext. La comprobación final se hizo con la configuración estándar de Next. Se verificó después el Worker con la batería indicada.

## Bloqueo de producción

La respuesta 404 oculta la página, pero la compilación local incluye texto literal de un artículo Draft y el nombre del borrador capilar en archivos JavaScript estáticos. Las cuatro referencias directas de scripts de la portada en producción no contenían esos marcadores. Esa comprobación limitada no cubrió importaciones transitivas ni todas las rutas. Se adjunta evidencia de la compilación local en stabilization-browser-privacy.json.

El registro editorial llega al navegador por dependencias compartidas. Por ejemplo, navigation importa site-navigation, que importa publication-registry, y la comparación y la ayuda de ingredientes llegan al registro desde componentes interactivos. Parte del catálogo también se incluye directamente. El cambio pendiente consiste en mantener el registro y el contenido de borradores en servidor, pasar a la navegación y al comparador solo rutas visibles y entregar al navegador una proyección del catálogo público. Después verificar JavaScript, mapas de fuentes y respuestas de datos anónimas tanto en Next como en el Worker. No se recomienda producción hasta cerrar esa exposición.

El build histórico aislado de 6f21ad4 confirmó por HTTP los 18 estados 200 con noindex. El barrido actual comprobó 44 destinos por entorno. En producción quedan enlaces rotos en /skincare/choose/ y /skincare/identify/. Ninguno de los 44 destinos locales inspeccionados enlaza a las rutas retiradas o a los dos hubs de borradores. Quedan por medir clics, impresiones e indexación histórica con datos privados de la propiedad.
