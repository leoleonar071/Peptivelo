# Privacidad editorial de Peptivelo

## Origen de la exposición

[La auditoría inicial](stabilization-browser-privacy.json) encontró dos huellas de un borrador de biblioteca en un JavaScript de Next.js y una huella del borrador capilar en otro. La comprobación de producción anterior solo cubrió cuatro scripts que la portada referenciaba directamente.

Como control positivo, el detector actual encontró 369 huellas distintas en dos de los 46 JavaScript del build histórico local `6f21ad4`. En los artefactos candidatos encontró cero de las 371 huellas examinadas.

| Vía                                    | Archivos que incorporaban datos privados                                                                                                                                                     | Corrección                                                                                                                                                                                                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Imports de navegación y descubrimiento | `navigation.tsx`, `section-navigation.tsx`, `peptide-directory.tsx` y tarjetas de descubrimiento llegaban a `site-navigation.ts` o `content-topics.ts`, y de ahí a `publication-registry.ts` | El servidor entrega enlaces y fichas visibles a los componentes cliente. Los módulos compartidos contienen tipos y utilidades sin el registro.                                                                                                                  |
| Catálogo compartido                    | `data.ts` cargaba `catalog.json` para componentes interactivos. `discovery-context.ts` también importaba el catálogo y `haircare.json` directamente                                          | `data.ts` queda en el servidor. `public-catalog.json`, `public-offers.json` y `public-navigation.json` se generan con productos, ingredientes, fuentes, ofertas y destinos públicos. Se excluyen comparaciones editoriales y expedientes de derechos de imagen. |
| Ayuda de ingredientes y referencias    | `ingredient-education.tsx` y `ui.tsx` llegaban a `research-records.ts`, `source-summary.ts`, `citations.ts` y `evaluations.ts` por componentes compartidos                                   | La lista de fuentes se renderiza en el servidor. Los cuadernos de selección, candidatos y extracciones se muestran en la ruta autenticada. Las referencias exclusivas de los borradores se excluyen de fuentes públicas y búsqueda.                             |
| Serialización RSC                      | `comparison-evidence.ts` preparaba los textos y las fuentes de todas las comparaciones para el componente cliente, incluso cuando su URL respondía 404                                       | El servidor incluye únicamente comparaciones visibles y fuentes de documentos públicos. El comparador conserva los productos, el contexto cosmético y las fuentes que ya forman parte del catálogo público.                                                     |
| Archivo estático directo               | `public/images/products/records/ordinary-hair-density.svg` y la sección capilar de `public/images/products/SOURCES.md` eran accesibles sin pasar por las rutas editoriales                   | Ambos contenidos se conservan en `src/data/private-assets/`. La antigua URL de la tarjeta devuelve 404 con `no-store` hasta que la política permita mostrar la ficha asociada.                                                                                  |

Los módulos con originales editoriales tienen la barrera `server-only`. Los originales incluyen `library.ts`, `guides.json`, `catalog.json`, `haircare.json`, `comparison-evaluations.json`, los cuadernos de investigación, las extracciones y los registros de péptidos. Next.js y Vinext aplican esta barrera al compilar el código cliente. En producción, la preview queda deshabilitada de forma predeterminada. En local exige autenticación en el proxy y en la página, escucha en loopback y envía `no-store` y `noindex`.

Los 23 registros y las 18 piezas históricas se conservan. Las fichas faciales ya públicas mantienen su disponibilidad, incluido Copper Tripeptide-1. La disponibilidad de ese catálogo no acredita una revisión científica. La proyección de fichas nuevas contiene cero registros con las aprobaciones exigidas. Los originales y el registro de revisiones se conservaron sin cambiar estados.

## Comprobación automática

`npm run build` y `npm run build:vinext` ejecutan la auditoría de privacidad al terminar. El script inspecciona JavaScript, JSON, manifiestos, mapas de fuentes cuando se emiten, recursos de texto, HTML y RSC precompilados según el artefacto. Detecta huellas del contenido original aunque estén escapadas para JSON, JavaScript o HTML. El informe registra únicamente los archivos y los identificadores de las huellas. La prueba unitaria incluye un texto sintético de Draft y otro de In Review para comprobar la exclusión y un control positivo para comprobar que el detector reconoce texto escapado.

La prueba HTTP solicita tanto HTML como RSC de páginas públicas y rutas históricas. Comprueba también el sitemap, las rutas de preview deshabilitadas, la tarjeta capilar y el acceso directo a rutas de archivos privados. La batería privada comprueba el acceso con credenciales a los seis espacios, la presencia del manuscrito de BPC-157 con credenciales y el rechazo de la solicitud RSC anónima.

| Verificación de recursos                      | Next.js | Vinext / Worker |
| --------------------------------------------- | ------: | --------------: |
| Archivos de texto inspeccionados en el build  |     107 |              81 |
| JavaScript incluidos en esa inspección        |      23 |              47 |
| Recursos descargados por HTTP con estado 200  |      55 |              78 |
| Coincidencias privadas en el build o por HTTP |       0 |               0 |

La inspección de Next.js incluyó 10 HTML, 40 RSC y dos respuestas precompiladas. La del Worker incluyó dos manifiestos JSON. Ambos manifiestos devolvieron 404 por HTTP y `/_headers` redirigió a un 404. Los builds no emitieron mapas de fuentes en los directorios públicos inspeccionados. Una solicitud directa de prueba a un mapa JavaScript devolvió 404 en cada runtime. La prueba E2E consultó 50 rutas públicas y 18 históricas en cada dispositivo, además de la preview deshabilitada y los archivos privados.

La primera prueba RSC envió un valor arbitrario de `_rsc` y Next.js respondió 307 para corregirlo. La prueba final utiliza la clave vacía que corresponde a una solicitud `RSC: 1` sin encabezados de navegación. Así inspecciona el cuerpo RSC en lugar de la redirección.

## Resultados de pruebas

| Ejecución                                        | Correctas | Fallos | Omitidas |
| ------------------------------------------------ | --------: | -----: | -------: |
| Unitarias, 32 archivos                           |       143 |      0 |        0 |
| Primera batería completa Next.js                 |       356 |      2 |       11 |
| Batería completa del build final de Next.js      |       351 |      7 |       11 |
| Repetición aislada de los siete recorridos       |         7 |      0 |        0 |
| Repetición aislada de los dos recorridos de tema |         2 |      0 |        0 |
| Worker, privacidad, estructura y comparador      |        26 |      0 |        4 |
| Worker final, privacidad en tres tamaños         |         3 |      0 |        0 |
| Vista previa privada en tres tamaños             |        12 |      0 |        0 |

Las 11 omisiones de Next.js y las cuatro de la selección del Worker ya existían. La primera pasada completa agotó 30 segundos en dos recorridos de tema y accesibilidad en escritorio. La segunda usó un límite de 60 segundos por escenario. En ella pasaron los temas y las tres comprobaciones de privacidad. Siete aserciones de navegación agotaron su espera de cinco segundos en escritorio o tableta. La mediana de duración de los escenarios de escritorio pasó de 2,7 a 5,4 segundos y la de tableta de 1,4 a 5,3 segundos entre ambas pasadas. Los siete recorridos pasaron con un solo proceso en el build final. Se mantuvieron las aserciones y la espera de cinco segundos. El fallo aparece bajo concurrencia en las corridas observadas, y su causa exacta queda sin confirmar.

`npm run audit:content` verificó 545 referencias y la presencia de los recursos de producto, sin incidencias. ESLint terminó con cero errores y un aviso existente por el uso de `<img>` en descubrimiento.

## Las 18 rutas históricas

| Grupo              | Cantidad | Piezas conservadas                                                                                      |
| ------------------ | -------: | ------------------------------------------------------------------------------------------------------- |
| Comparaciones      |       10 | Comparaciones de The Ordinary, NIOD, Geek & Gorgeous, Naturium, Timeless, Medik8, COSRX y SkinCeuticals |
| Guías de etiquetas |        2 | Matrixyl 3000 frente a Synthe’6 y explicación de porcentajes                                            |
| Biblioteca         |        3 | Categorías de péptidos, retatrutida y BPC-157                                                           |
| Cabello            |        3 | The Ordinary Hair Density, Biotinoyl Tripeptide-1 y Acetyl Tetrapeptide-3                               |

El build histórico `6f21ad4` devolvió HTTP 200 con `noindex` en las 18 rutas. Por ello todas pudieron recibir visitas directas o desde enlaces mientras estuvieron accesibles, aunque el build pedía a los buscadores que no las indexaran. El 11 de noviembre de 2026 se midieron 18 respuestas 404 en producción, sin redirecciones y fuera del sitemap. Los datos individuales están en los [resultados históricos](stabilization-historical-routes.json) y la [comprobación de rutas](stabilization-routes.json).

En ambos builds candidatos, las 18 rutas dieron 404 en HTML. Las respuestas RSC se transportaron con HTTP 200 y contenían el identificador de página no encontrada. Los cuerpos de ambas respuestas pasaron la auditoría. El [registro de privacidad](privacy-results.json) enumera cada ruta y runtime.

El [barrido de 44 destinos por entorno](stabilization-internal-links.json) detectó enlaces públicos obsoletos en `/skincare/choose/` y `/skincare/identify/` en la versión desplegada. En la candidata previa no encontró enlaces a los borradores retirados. Search Console debe confirmar impresiones y clics históricos mediante el informe de rendimiento filtrado por cada URL. Inspección de URLs y Páginas sirven para consultar el estado de indexación, la última detección y la canónica seleccionada cuando haya datos. El informe de Enlaces ayuda a identificar referencias externas. El tráfico directo o desde enlaces exige analítica o registros históricos. Esos datos de la propiedad quedan pendientes.

Si alguna pieza merece recuperarse tras la revisión, su propia URL conserva el destino editorial. La revisión de privacidad no crea redirecciones ni cambia el estado de esas piezas.

## Primera ficha y siguiente ciclo

1. Aportar texto por sección y sus referencias, con fecha y alcance. Para GHK-Cu, cotejar primero el registro en `src/data/peptides/ghk-cu.json` con la ficha de Copper Tripeptide-1. Se pueden contrastar el nombre INCI, resumen, uso cosmético, precauciones, referencias y las relaciones con The Ordinary Copper de 30 ml y COSRX mini de 50 ml. Quedan pendientes la identidad y el alcance de la ampliación, el respaldo específico de cada párrafo nuevo, metodología, referencias, imágenes y metadatos propios de la ampliación. La [comparación de campos](ESTABILIZACION.md#ghk-cu) detalla las fuentes reutilizables.
2. Editar las secciones y sus IDs de fuente en el JSON. Ejecutar `npm run editorial:preview` y abrir `http://127.0.0.1:3102/editorial-preview/ghk-cu/`. Usar el usuario `editor` y la contraseña local que genera el comando. La vista presenta la ficha existente y la ampliación. Los cambios se hacen en el archivo y se revisan al recargar.
3. Registrar la procedencia de cada imagen, con variante, fuente, autor, licencia, autorización comercial, restricciones sobre modificaciones con IA, atribución y decisión editorial. El sistema contempla Open Beauty Facts, marca, afiliación, usuario y tarjeta propia. La [consulta de Open Beauty Facts](open-beauty-results.json) cubrió 11 productos. Nueve búsquedas no encontraron candidatos. El candidato The Ordinary Copper de 30 ml sigue pendiente de confirmar, y el COSRX de 150 ml se descarta para el mini de 50 ml. La cobertura verificada permanece en 0 de 11. Conservar las tarjetas propias mientras se verifica el permiso de una foto.
4. Registrar la verificación documental del propietario como revisión editorial de la versión exacta. La revisión científica independiente tiene su propio tipo, identidad y fecha. Solo se registra cuando una persona cualificada ha revisado la misma versión. Las fichas que exigen revisión científica requieren ambas para publicarse. La presentación pública del método puede prepararse como contenido de ficha con sus propias fuentes, separado del cuaderno privado.
5. Tras las aprobaciones, integrar en la URL canónica existente de GHK-Cu los bloques aprobados de la plantilla `PeptideProfile`. La ampliación enlazada a una ficha existente requiere esta integración explícita, pues el generador no crea una segunda URL pública. Revisar contenido, referencias, canonical, sitemap y regresión de privacidad antes de solicitar autorización para desplegar.
6. Repetir con semaglutida, tirzepatida, retatrutida, BPC-157 y TB-500. En retatrutida y BPC-157, contrastar la ampliación con los briefs conservados y mantener la URL histórica como destino de una eventual publicación revisada.

## Producción

La candidata cumple las comprobaciones locales de privacidad y vista previa. Para un despliegue general, conviene confirmar una ejecución completa estable en el entorno de validación de producción. Las dos pasadas completas locales tuvieron tiempos de espera intermitentes, aunque todos los escenarios ejecutados del build final pasaron en la batería o en su repetición aislada. El cambio queda sin desplegar.

El entorno local verifica la compilación y la aplicación candidata. En un despliegue autorizado, volver a comprobar las respuestas HTML y RSC, el sitemap y los archivos JavaScript del dominio. Comprobar también que las URL de chunks de versiones antiguas no sigan sirviendo material retirado desde la CDN. Si alguna continúa disponible, retirar la versión de origen o invalidar esa caché y repetir la comprobación. Un recurso que ya se descargó fuera del control del sitio no se puede recuperar.

El tráfico y la indexación histórica quedan pendientes de los datos de Search Console. La ampliación de GHK-Cu y las cinco fichas siguientes quedan en el flujo editorial, con la autorización de imágenes y las revisiones que correspondan. Estos trabajos no requieren publicar ningún borrador para desplegar el arreglo de privacidad.
