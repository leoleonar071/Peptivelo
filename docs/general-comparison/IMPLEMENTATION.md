# Comparador general de Peptivelo — entrega local

Fecha: 23 de octubre de 2026.

## Resultado y cobertura

El comparador está en [Compare](http://localhost:3200/compare/). Los diez artículos editoriales usan `/compare/{slug}/`. Las once rutas anteriores —comparador y artículos— devuelven 404, sin redirecciones de compatibilidad.

Compare está en el menú global y el pie. El acceso Comparisons de Skincare lleva al comparador general. Las rutas de ubicación son Home → Compare → artículo; los artículos conservan su título específico y un enlace de tema a Skin & cosmetics. El comparador no muestra la navegación local de Skincare.

La entrada presenta “Compare with clarity.”, el subtítulo acordado y “Currently available: facial skincare products.” junto a la selección. Las tarjetas dicen Choose a product y el diálogo Select a product. Peptides A–Z permite explorar otras áreas sin mostrar categorías vacías.

La cobertura funcional sigue limitada a los productos faciales documentados. Esta etapa no habilita comparaciones científicas entre péptidos de metabolismo, hormonas o crecimiento. No añade productos, estudios ni interpretaciones, ni equipara sustancias por palabras o efectos compartidos.

## Implementación

| Subsistema                                | Cambio                                                                                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/config.ts`                       | `comparisonPath(slug?)` y `comparisonUrl(a?, b?)` centralizan rutas y parejas, incluido solo B.                                                                              |
| `src/lib/comparison-groups.ts`            | Separa entidad `product`/`peptide` de tema. Registra un único grupo operativo de productos faciales, sus IDs elegibles, presentación V2 y contexto US/USD.                   |
| Selector, estado URL y búsqueda conectada | Comparten las reglas de elegibilidad y compatibilidad del registro. Las entidades desconocidas, duplicadas, de otro tema o de otro tipo se rechazan.                         |
| Ruta dinámica de páginas                  | Resuelve `/compare/` y `/compare/{slug}/`; deja de resolver las rutas anteriores. Actualiza metadatos, contexto y BreadcrumbList.                                            |
| Navegación y contenido                    | Actualiza menú, pie, inicio, fichas, identificación, guías, directorio, artículos, evidencia y enlaces de regreso.                                                           |
| Búsqueda                                  | Añade la entrada Compare y actualiza artículos existentes; no cambia el algoritmo de relevancia. Investigación conserva sus artículos y no entra en el selector comercial.   |
| Indexación                                | Canonical actualizado, comparador noindex y artículos con su política existente. El sitemap usa rutas nuevas únicamente para artículos publicados; no incluye el comparador. |

La presentación compacta V2, cinco categorías expandibles, evidencia separada, cálculos, fuentes, identificadores, anclas y estado A/B se conservan. Selección, intercambio, borrado, recarga, compartir e historial se verificaron en las rutas nuevas.

La elegibilidad actual procede de la colección estructurada de productos faciales de skincare, no de su nombre comercial ni de una similitud terapéutica. Añadir un grupo de péptidos requerirá registros revisados y su propio adaptador de presentación y comparación; el renderer de productos no se utiliza automáticamente para esas entidades.

## Verificación ejecutada

| Comprobación                                                                               | Resultado                                                                                                                               |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                                                             | Correcto.                                                                                                                               |
| `npm run typecheck`                                                                        | Correcto; el build también comprueba tipos de producción.                                                                               |
| `npm run build`                                                                            | Correcto.                                                                                                                               |
| `npm test -- --maxWorkers=2`                                                               | 25 archivos, **117 pruebas correctas**.                                                                                                 |
| `npm run test:e2e -- --workers=3 --output=test-results/general-verified`                   | **295 correctas, 11 omisiones configuradas, 0 fallos**; escritorio, tableta y móvil.                                                    |
| `npx playwright test general-comparison --workers=2 --output=test-results/general-routing` | **9 correctas**, incluyendo comprobaciones explícitas de canonical, acceso global activo y pie.                                         |
| Búsqueda estática en código de producción                                                  | Sin referencias a `/skincare/compare`. Las pruebas conservan esas cadenas exclusivamente para comprobar retirada y ausencia de enlaces. |

Las omisiones corresponden a matrices de anchos/temas ejecutadas una sola vez y casos configurados solo para escritorio; no son funcionalidades pendientes del comparador.

Las pruebas cubren las once respuestas 404 sin Location, los diez artículos nuevos, canonical y noindex, navegación y tema, búsqueda, selección vacía/parcial/completa, solo B, duplicados, compatibilidad, precios ausentes, filtros, anclas, foco, historial, enlaces compartidos, fallos de imagen/portapapeles y recuperación del límite de error. Incluyen regresión de lectores editoriales, calculadora, escáner, fichas y guías.

## Capturas y accesibilidad

La matriz genera **80 capturas**: 1440, 1280, 1024, 768, 430, 390, 375 y 320px; claro/oscuro; vacío, solo A, solo B, completo y selector. Comprueba ausencia de desbordamiento horizontal y errores de ejecución. Se mantienen las auditorías axe y las pruebas de teclado/foco de V2.

Selección de capturas revisadas:

- [Inicio claro](captures/light-1440-empty.png) · [Inicio oscuro](captures/dark-1440-empty.png) · [Viewport de escritorio](captures/light-1440-viewport.png).
- [Comparación clara](captures/light-1440-complete.png) · [Comparación oscura](captures/dark-1440-complete.png).
- [Inicio móvil claro](captures/light-390-empty.png) · [Inicio móvil oscuro](captures/dark-390-empty.png).
- [Comparación móvil clara](captures/light-390-complete.png) · [Comparación móvil oscura](captures/dark-390-complete.png).
- [Selector móvil claro](captures/light-390-picker.png) · [Selector móvil oscuro](captures/dark-390-picker.png).
- [320px claro](captures/light-320-complete.png) · [320px oscuro](captures/dark-320-complete.png).
- [Artículo con nueva ubicación](captures/light-1440-editorial.png) · [Artículo móvil oscuro](captures/dark-390-editorial.png).

Matriz completa: `test-results/general-verified/comparison-v2-V2-visual-matrix-in-{light,dark}-desktop/`, como artefactos locales ignorados por Git. Las capturas anteriores de V2 quedan como historial de la etapa previa.

## Límites y pendientes

- Prueba con cinco personas: comprender un resultado y abrir una comparación sin ayuda; objetivo cuatro de cinco. **Pendiente, no realizada.**
- Validación manual con lector de pantalla real y dispositivos físicos: pendiente. Las pruebas semánticas, de teclado y axe no sustituyen esa revisión.
- Nuevos grupos científicos: requieren datos estructurados y revisión; no hay categorías vacías ni alternativas inventadas.
- Se conserva la revisión científica pendiente de los contenidos actuales.
- Los enlaces antiguos guardados dejan de funcionar deliberadamente, según el alcance aprobado.
- Entrega exclusivamente local: **sin despliegue ni subida a GitHub**.
