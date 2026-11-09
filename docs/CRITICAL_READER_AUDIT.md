# Peptivelo — auditoría de lectura crítica

Seguimiento: [correcciones implementadas y validación](CRITICAL_READER_FIXES.md). Este informe conserva el estado observado antes de corregirlo.

8 de noviembre de 2026. Revisión asistida por IA desde tres perspectivas: principiante, lector académico y editor de producto. Incluye decisiones de la implementación realizada en este chat. No equivale a aprobación científica cualificada ni a sesiones con participantes.

## Dictamen

La base permite explorar documentos, consultar referencias y reconocer incertidumbres. Sin embargo, todavía facilita mejor **leer fichas aisladas** que **resolver una pregunta y continuar por relaciones pertinentes**. Recomiendo una entrega corta de correcciones editoriales y de recorridos antes de ampliar temas o activar indexación de contenidos científicos.

No encontré en la muestra un fallo funcional crítico que impida toda lectura. Sí encontré tres prioridades altas de interpretación y documentación. No atribuyo efectos sobre tráfico, conversión, comprensión real o retención: no se midieron con visitantes.

## Alcance y evidencia

Se inspeccionaron el código y la vista local `http://127.0.0.1:3101`, con estas cinco páginas:

| Página        | Ruta                                          | Qué se examinó                                                |
| ------------- | --------------------------------------------- | ------------------------------------------------------------- |
| Portada       | `/`                                           | Promesa, entrada para principiantes, búsqueda y jerarquía     |
| Directorio    | `/peptides/`                                  | Formatos, filtros, lectura inicial y estados vacíos           |
| Ingrediente   | `/skincare/ingredients/acetyl-hexapeptide-8/` | Resumen, evidencia, límites y siguientes pasos                |
| Producto      | `/skincare/products/niod-cais3/`              | Variante, precio, ingredientes, fuentes y comparación         |
| Investigación | `/library/bpc-157/`                           | Alcance del estudio seleccionado, incertidumbre y referencias |

Las cinco respondieron 200 en escritorio de 1280 px y móvil de 390 px. No hubo desbordamiento horizontal en esas diez vistas. Se inspeccionaron los textos iniciales y desplegados; las capturas se tomaron antes de abrir los bloques. Esto no es una certificación de accesibilidad ni una medición de rendimiento. No se repitió toda la batería de pruebas de la implementación anterior porque esta entrega solo añade la auditoría.

Evidencia reproducible: [textos, enlaces y observaciones de navegador](audit-evidence/critical-reader/pages.json). Capturas representativas: [directorio móvil](audit-evidence/critical-reader/directory-390.png), [producto escritorio](audit-evidence/critical-reader/product-1280.png), [ingrediente móvil](audit-evidence/critical-reader/ingredient-390.png) y [artículo escritorio](audit-evidence/critical-reader/research-1280.png).

Se comprobó además una combinación de filtros vacía y el paso desde el producto a uno de sus ingredientes. Esa página adicional solo se utilizó para comprobar el retorno, no como sexta revisión editorial completa. La versión pública de producción no se audita de nuevo en este documento ni se modifica.

## Hallazgos priorizados

### CR-01 · Alta · La continuación se calcula por tema, no por relación documentada

**Evidencia:** `KnowledgeNextSteps` filtra por tema y toma los primeros dos registros con `.slice(0, 2)`. En la ficha de Acetyl Hexapeptide-8 propone NIOD CAIS3, aunque ese nombre no aparece entre los cuatro ingredientes seleccionados registrados para NIOD. El bloque correcto «Found on these recorded labels» sí utiliza pertenencia explícita: ambos bloques siguen criterios diferentes.

**Interpretación:** «Keep exploring» no afirma literalmente que NIOD contenga ese ingrediente. Aun así, su proximidad a la ficha puede sugerir una relación que el enlace no explica. Es un riesgo de interpretación, no una prueba de equivalencia química ni de una etiqueta completa.

**Corrección:** priorizar productos que registren ese ingrediente y guías o estudios con una relación explícita. Explicar cada vínculo con una frase breve. Si solo se dispone de coincidencia temática, rotularla «More from Skin & cosmetics», sin presentarla como relación específica. No inferir ausencia en el INCI completo a partir de nuestra lista parcial.

**Aceptación:** cada recomendación muestra una razón comprobable; ningún producto se describe como contenedor sin una relación registrada. No se confunden los péptidos de cobre de nombres diferentes.

### CR-02 · Alta · La selección de evidencia no tiene una trazabilidad suficiente

**Evidencia:** el artículo BPC-157 identifica un piloto y aclara que no inventaría toda la literatura. La ficha del ingrediente resume un ensayo seleccionado. No explican el proceso que llevó a elegir esas referencias: pregunta, búsqueda, fecha de corte, razones de inclusión y omisiones conocidas.

**Interpretación académica:** aclarar que una revisión no es exhaustiva es correcto, pero no permite evaluar cómo se seleccionó la muestra. No he demostrado selección sesgada; falta información para juzgarla.

**Corrección:** añadir un registro editorial breve: pregunta examinada, fuentes buscadas, fecha, términos de búsqueda, por qué se incluyó cada estudio y alcance pendiente. Mantener la denominación «selected research»; no llamarlo revisión sistemática.

**Aceptación:** otro lector puede reconstruir la búsqueda y distinguir «no buscado», «no localizado», «identificado pero no leído» y «leído». Las afirmaciones de ausencia requieren una búsqueda con alcance definido.

### CR-03 · Alta · Los estados documentales mezclan registro automático y comprobación humana

**Evidencia:** en `transparency.ts`, Source trail toma el estado interno `verified` cuando hay IDs de fuentes. La identidad del producto y del ingrediente reciben ese estado automáticamente. La concentración se clasifica buscando ciertas frases en inglés. La interfaz lo traduce como «Documented in cited sources» y conserva por separado la revisión pendiente.

**Interpretación:** no se afirma una certificación clínica, y la advertencia es correcta. Pero existencia de una referencia, extracción de un dato y comprobación de que la fuente respalda ese dato son operaciones distintas. La clasificación textual también podría equivocarse al redactar futuras fichas.

**Corrección:** separar «fuente registrada», «dato extraído» y «dato comprobado contra la fuente» con alcance, fecha y responsable interno. Guardar el estado de divulgación como dato explícito; no deducirlo con una expresión regular. Mantener las revisiones editorial y científica independientes.

**Aceptación:** una referencia añadida sin revisar no genera una comprobación humana; los campos ambiguos quedan pendientes; un cambio de redacción no altera por sí solo el estado de divulgación.

### CR-04 · Media · La entrada principal presupone vocabulario especializado

**Evidencia:** el hero sugiere GHK-Cu, BPC-157 y concentraciones. La portada sí tiene una sección posterior para principiantes; no está ausente. Sin embargo, el documento «Cosmetic, prescription or experimental?» comienza diferenciando contextos, sin ser una introducción básica a qué es un péptido.

**Corrección:** incorporar una entrada breve junto al buscador: «New to peptides? Start with the basics». El recurso debe explicar los conceptos iniciales antes de usar siglas, apoyado en fuentes revisadas. Conservar la entrada directa para lectores técnicos y los tres ámbitos existentes.

**Aceptación:** una persona puede empezar sin conocer nombres de compuestos. La prueba con principiantes comprobará si entiende las diferencias entre péptido, ingrediente y producto. No se inventará contenido básico solo para rellenar una nueva ruta.

### CR-05 · Media · La identificación de referencias requiere demasiados pasos

**Evidencia:** el perfil documental presenta enlaces «Source 1», «Source 2», etc. La biblioteca tiene referencias más detalladas, pero dentro de un bloque desplegable. Las posiciones numéricas del perfil no sustituyen una identidad bibliográfica visible.

**Corrección:** usar etiquetas compactas como «Wang et al., 2013 · Human study» o «NIOD · Manufacturer label», derivadas del registro real. Mostrar el tipo y alcance de acceso antes de abrir la referencia: resumen, texto completo o página comercial. Mantener las citas numeradas y sus enlaces de retorno donde ya funcionan.

**Aceptación:** se puede distinguir fuente académica, comercial y regulatoria sin abrir varias páginas. No se inventan autorías, años o DOI faltantes.

### CR-06 · Media · La ficha del ingrediente necesita separar mejor dato extraído e interpretación

**Evidencia:** el resumen del ensayo incluye tamaño de muestra, duración y asignación, pero no presenta una ficha de extracción con desenlace, medida, magnitud e incertidumbre. Además, `knownLimitations` y el cierre dicen «this serum» en una ficha de ingrediente sin un sérum seleccionado.

**Corrección:** sustituir esa referencia ambigua por «finished products containing this ingredient». Añadir una ficha del estudio con campos explícitos. Si una cifra no se pudo obtener del acceso disponible, indicarlo como «not extracted from the inspected material», sin inferir que el artículo no la publica. Separar observación de los autores e interpretación editorial.

**Aceptación:** el lector identifica qué se midió y qué se desconoce. No se convierte significación estadística en importancia práctica ni se calcula una puntuación de eficacia. Las conclusiones científicas nuevas siguen pendientes de revisión cualificada.

### CR-07 · Media · La página del producto prioriza el acceso comercial antes que la investigación

**Evidencia:** en escritorio de 900 px de alto, buena parte de la primera vista se consume en navegación, breadcrumbs, título y presentación. El precio comienza al final de esa vista. El enlace comercial aparece junto al precio; «Add to compare» llega después de las ofertas y de varios bloques documentales.

**Interpretación de producto:** para alguien que viene a investigar, la acción principal puede ser difícil de encontrar. No se ha medido un efecto en conversión o abandono.

**Corrección:** situar «Compare recorded facts» y «View ingredients and sources» cerca de la identidad del producto. Mantener el enlace al fabricante, claramente identificado. Conservar tamaño, mercado y fechas junto al precio; no reemplazar la observación histórica por un precio actual no verificado.

**Aceptación:** la comparación se encuentra desde el resumen sin atravesar las ofertas; el lector distingue datos documentales y enlaces de compra en móvil y escritorio.

### CR-08 · Media · El retorno explícito se pierde al continuar de producto a ingrediente

**Evidencia:** desde NIOD con `returnTo` hacia un directorio filtrado, el enlace de ingrediente abre `/skincare/ingredients/tripeptide-29/` sin transportar ese contexto. Una vez cargada esa ficha, no hay enlace `.discovery-return`. El retorno directo directorio → ficha sí está implementado.

**Corrección:** transportar un contexto validado de descubrimiento por los enlaces relevantes entre fichas, preservando la vuelta al producto cuando proceda. Reutilizar la validación local y los límites de anidamiento existentes. No convertirlo en un parámetro de redirección arbitraria.

**Aceptación:** directorio filtrado → producto → ingrediente permite regresar al producto y al directorio conservando el estado. Comprobar recarga, enlace compartido y atrás del navegador. No afirmo que el historial nativo esté roto: este hallazgo concierne al enlace explícito.

### CR-09 · Baja · El directorio exige recorrer tarjetas para localizar un nombre

**Evidencia:** la muestra presenta 25 entradas, filtros de tema y formato, pero no un filtro por nombre dentro del directorio. En la captura móvil, los controles y el texto introductorio sitúan la primera tarjeta cerca del final de la primera pantalla. El buscador global sí existe y sigue disponible desde navegación.

**Corrección:** ofrecer acceso claro a la búsqueda por nombre reutilizando el buscador existente, o un filtro local si las sesiones lo justifican. Compactar la introducción y hacer secundaria la acción de compartir. El estado vacío ya funciona; mejorar su explicación cuando una combinación no tenga contenido.

**Aceptación:** probar localizar un nombre conocido sin recorrer toda la lista. Elegir entre ambas soluciones con las sesiones reales; no añadir otro buscador complejo por defecto.

## Contraste académico focalizado

Consultas de esta auditoría: 8 de noviembre de 2026. Son contrastes de pasajes concretos, no una búsqueda exhaustiva ni una autorización de publicación.

| Tema                 | Qué pude comprobar                                                                                                                                                                                                                                                                                            | Qué sigue pendiente                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ensayo de Argireline | El resumen editorial de Springer coincide con los datos de 60 participantes, cuatro semanas y asignación 3:1 que usa la ficha. [Publicación](https://link.springer.com/article/10.1007/s40257-013-0009-9).                                                                                                    | Extracción y valoración completa de métodos, resultados e incertidumbre; no se inspeccionaron métodos completos de pago. El acceso directo de PubMed no devolvió el resumen en esta sesión.                                                                                                                                                                                                                                    |
| Evaluación CIR       | Se inspeccionaron pasajes del texto HTML, conclusión y financiación. El umbral de 0,005% y la insuficiencia de datos por encima se corresponden con el texto citado, dentro de sus condiciones de uso. [Evaluación](https://journals.sagepub.com/doi/10.1177/10915818251340391).                              | Incorporar la financiación declarada: el suplemento fue patrocinado por CIR y el artículo explica su apoyo financiero por el Personal Care Products Council. Esto debe distinguirse de la declaración de conflictos y no invalida automáticamente las conclusiones. El registro local todavía dice que esos detalles no se verificaron en la pasada anterior; es una limitación histórica honesta que ahora puede completarse. |
| Piloto BPC-157       | El resumen de PubMed respalda el tamaño de dos participantes previamente expuestos y el seguimiento de tres días. La web limita la interpretación y no adopta la generalización de seguridad de los autores. [Registro](https://pubmed.ncbi.nlm.nih.gov/40131143/).                                           | No se evaluaron el artículo completo, el expediente ético ni los datos originales. El enlace del editor abrió una página con contenido embebido que no se inspeccionó; no se afirma acceso completo.                                                                                                                                                                                                                           |
| Contexto FDA         | La página oficial contiene una entrada específica de BPC-157 sobre incertidumbres de seguridad en el contexto de formulación magistral y vías propuestas. [Comunicación](https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks). | Conservar contexto, fecha y jurisdicción. No transformar esa entrada en una evaluación de un frasco particular ni en una lista exhaustiva de daños demostrados.                                                                                                                                                                                                                                                                |
| Etiqueta NIOD        | La página comercial consultada mantiene las declaraciones de dos componentes al 1% y presenta referencias a pruebas de producto reportadas por la marca. [Página oficial](https://niod.com/en-us/copper-amino-isolate-serum-3-11-cais3-serum-100368.html).                                                    | No se verificó hoy el precio de la variante exacta de 30 mL. Las pruebas descritas por la marca no se evaluaron metodológicamente; deberían registrarse como información de la marca identificada, con alcance pendiente, sin inferir eficacia comparativa ni ausencia de estudios.                                                                                                                                            |

## Lo que conservaría

- La separación entre ingrediente, preparación estudiada y producto comercial; no fusionar identidades por nombres parecidos.
- El precio por tamaño y mercado como observación fechada, sin convertir precios ausentes en cero.
- Las advertencias específicas del estudio BPC-157 y la distinción entre falta de evidencia y demostración de daño.
- Las citas con retorno y los detalles desplegables. El problema es su identificación y contexto, no la existencia de referencias.
- Los estados de revisión pendientes y el bloqueo de indexación por falta de aprobación. Esta auditoría no los cierra.
- La preservación de rutas y de los contextos de piel, cabello e investigación; no hace falta otra reestructuración general.

## Siguiente entrega recomendada

1. Corregir CR-01 y CR-08: relaciones y retorno entre documentos. Validarlos con casos positivos y negativos de ingredientes, navegación y conservación de filtros.
2. Corregir CR-03 y CR-05: estados explícitos y referencias identificables, sin fabricar verificaciones humanas.
3. Preparar CR-02 y CR-06 como extracción editorial revisable; completar las notas de acceso y financiación identificadas. No aprobar automáticamente nuevas interpretaciones científicas.
4. Ajustar CR-04 y CR-07 conservando la identidad visual. Usar las sesiones con personas para decidir CR-09 y comprobar la comprensión de los cambios.

No se modificaron componentes, datos científicos, registros de aprobación ni producción durante esta auditoría. Las correcciones anteriores son propuestas, no cambios ya implementados. El entregable es este informe y su evidencia local.
