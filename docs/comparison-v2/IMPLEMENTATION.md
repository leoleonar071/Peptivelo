# Peptivelo Comparison V2 — entrega local

Fecha: 23 de octubre de 2026.

## Resultado

El comparador raíz ofrece selección visual A/B y análisis automático de una pareja válida. El resumen permanece visible y las explicaciones se consultan mediante secciones expandibles. Los lectores editoriales conservan sus pestañas y su tabla anterior.

Vista local: [Comparador](http://localhost:3200/skincare/compare/) · [Ejemplo](http://localhost:3200/skincare/compare/?a=ordinary-copper&b=niod-cais3).

No se han modificado el catálogo, el backend, las fuentes científicas ni el algoritmo de relevancia. No se ha realizado un despliegue.

## Experiencia implementada

- Un único H1 con las dos frases solicitadas, eyebrow y subtítulo V2. Manrope/Inter y tokens de ambos temas; ancho máximo de 1200px.
- Tarjetas completas para elegir Product A/B y resúmenes compactos tras completar la pareja. Ejemplo real con `ordinary-copper` y `niod-cais3`; listado editorial secundario cerrado.
- Selector nativo de hasta 880px con búsqueda por marca, nombre, ingredientes y alias registrados, flechas, Enter, Escape, cierre por fondo y restitución de foco. Producto del otro lado deshabilitado y explicado. Controles deshabilitados antes de hidratar.
- Fichas visuales propias, identificadas como registros editoriales. Respaldo estable si una imagen falla; sin fotografías recuperadas ni envases generados.
- Comparación automática, intercambio, borrado, sustitución, enlace compartido y reinicio. Historial, recarga y estados de solo A o solo B conservados mediante `a` y `b`. IDs desconocidos o duplicados se descartan con aviso.
- At a glance con volumen, precio observado, coste por mL y nombres seleccionados. Hasta tres observaciones deterministas con límites; precios ausentes desconocidos. Mercado US/USD y fechas explícitos.
- Cinco grupos inicialmente cerrados: Product details, Ingredients, Pricing, Brand claims y Evidence. El filtro indica cuántas filas oculta y mantiene identidades, datos desconocidos, precauciones, fuentes y límites de concentración.
- Las divulgaciones registradas se atribuyen al fabricante. Las notas editoriales no se convierten en afirmaciones comerciales. La selección de ingredientes no se presenta como INCI completo.
- Evidencia separada en etiquetas, ingredientes, formulaciones y producto terminado. Las parejas con evaluación existente reutilizan sus pasajes y las referencias asociadas a cada uno. Se conserva borrador/revisión pendiente y se distingue falta de vínculos en el catálogo de inexistencia de evidencia.
- Anclas anteriores conservadas: `comparison-result-title`, `comparison-meaning-title`, `comparison-peptides`, `price-comparison`, `ingredient-details` y `source-details`. Las anclas de detalle abren su sección antes de enfocar, incluso si se repite el mismo enlace.
- Acceso desde fichas renombrado a Add to compare y producto conservado como A. Búsqueda conectada, guías, perfiles, fuentes y calculadora siguen accesibles. Canonical/noindex y rutas editoriales conservados.

## Archivos de producción

| Archivo                                        | Responsabilidad                                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/components/comparison.tsx`                | Flujo, estado URL/historial, selector reutilizable y acciones. Conserva la exportación editorial anterior. |
| `src/components/comparison-v2.tsx`             | Hero, identidades compactas y At a glance.                                                                 |
| `src/components/comparison-details-v2.tsx`     | Cinco grupos, tablas semánticas, filtro y apertura por anclas.                                             |
| `src/components/comparison-evidence-v2.tsx`    | Paneles de evidencia, pasajes existentes y atribución de fuentes.                                          |
| `src/components/comparison-product-image.tsx`  | Registro visual y recuperación ante fallo de imagen.                                                       |
| `src/components/comparison-value.tsx`          | Render de valores extraído y compartido con lectores editoriales.                                          |
| `src/components/comparison-grid.tsx`           | Variante V2 explícita; presentación editorial por defecto conservada.                                      |
| `src/lib/comparison.ts`                        | Grupos V2 y procedencia por fila; reutiliza cálculos y normalización existentes.                           |
| `src/lib/comparison-evidence.ts`               | Adaptador construido en servidor desde catálogo y evaluaciones actuales.                                   |
| `src/lib/search.ts`, `src/lib/search-index.ts` | Alias de ingredientes compartidos con el selector, sin cambiar relevancia.                                 |
| `src/app/[...slug]/page.tsx`                   | Composición del comparador, datos de evidencia y acceso desde fichas.                                      |
| `src/styles/comparison-v2.css`                 | Presentación V2, diálogo y tablas responsive; sin cabecera móvil fija.                                     |

Documentación de diseño actualizada en `.interface-design/system.md` y `docs/PEPTIVELO_DESIGN_SYSTEM.md`.

## Verificación ejecutada

| Comprobación                   | Resultado                                                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run lint`                 | Correcto.                                                                                                                                                                                  |
| `npm run typecheck`            | Correcto.                                                                                                                                                                                  |
| `npm run build`                | Correcto, compilación de producción Next.                                                                                                                                                  |
| `npm test -- --maxWorkers=2`   | 24 archivos, 115 pruebas correctas.                                                                                                                                                        |
| Suite E2E completa             | 297 casos configurados: 285 correctos, 11 omisiones previstas y 1 fallo de escritura de captura en Windows. Sin fallos funcionales en esa ejecución.                                       |
| Repetición del caso de captura | Tras dirigir las capturas a carpetas individuales, `decision-summary` pasa en escritorio, tableta y móvil (3/3). Los 286 casos ejecutables quedan verificados, incluyendo esta repetición. |

Las pruebas nuevas cubren selección vacía/parcial/completa, elegir primero B, duplicados, IDs inválidos, cambios en ambos lados, intercambio, borrado, recarga, historial, enlaces compartidos, fallo del portapapeles, alias del selector, búsqueda vacía, Escape, fondo del diálogo, precios ausentes y cobertura parcial. Incluyen acceso desde fichas, vuelta desde búsqueda, filtros, anclas repetidas y procedencia de evidencia.

La recuperación usa el límite real de error de Next: el test inyecta un estado local de error mediante un observador de React exclusivo del navegador de pruebas y comprueba Try again y la URL. No añade rutas de prueba ni inventa fallos de red para los cálculos locales.

Comandos E2E finales: `npm run test:e2e -- --workers=3 --output=test-results/v2-verified` y `npx playwright test decision-summary --workers=2 --output=test-results/v2-artifact-recheck`. Las 11 omisiones corresponden a matrices explícitas ejecutadas una vez en escritorio y otros casos configurados solo para escritorio; no son recorridos pendientes de V2.

La suite general inicialmente detectó expectativas heredadas del catálogo en inicio, More, el escáner anterior y detalles editoriales siempre visibles. Se contrastaron con una copia de HEAD y se adaptaron los recorridos a la navegación actual, sin cambiar esos componentes de producción. Todas las capturas E2E se dirigen ahora a carpetas individuales para evitar escrituras sobre documentos abiertos. Las capturas de entrega se seleccionan explícitamente en esta carpeta.

## Matriz visual y accesibilidad

Anchos: **1440, 1280, 1024, 768, 430, 390, 375 y 320px**, en claro y oscuro. Se generan **80 capturas**: vacío, solo A, solo B, completo y selector abierto para cada ancho/tema. Se comprueban ausencia de desbordamiento y errores de ejecución. La matriz realiza 32 auditorías axe WCAG A/AA sobre comparación y selector; las demás pruebas amplían la cobertura de teclado, foco, fuentes y páginas relacionadas.

Las tablas conservan encabezados y asociación de celdas. En móvil, cada atributo precede a los valores A/B; los detalles largos se apilan. No se ocultan límites para hacer pasar el filtro ni se recortan explicaciones.

Capturas seleccionadas revisadas:

- [Inicio claro, escritorio](captures/light-1440-empty.png) · [Inicio oscuro](captures/dark-1440-empty.png).
- [Comparación clara, escritorio](captures/light-1440-complete.png) · [Oscura](captures/dark-1440-complete.png).
- [Comparación móvil clara](captures/light-390-complete.png) · [Oscura](captures/dark-390-complete.png).
- [Selector móvil claro](captures/light-390-picker.png) · [Oscuro](captures/dark-390-picker.png).
- [320px claro](captures/light-320-complete.png) · [320px oscuro](captures/dark-320-complete.png).
- [Viewport de escritorio](captures/light-1440-viewport.png) · [Detalle del resumen móvil](captures/light-390-at-a-glance.png).
- [Ingredientes desplegados en móvil](captures/light-390-ingredients.png).

La matriz completa de esta ejecución está en `test-results/v2-verified/comparison-v2-V2-visual-matrix-in-{light,dark}-desktop/` (artefactos locales ignorados por Git).

## Pendiente antes de publicar

- Prueba con cinco personas que no conozcan la plataforma: comprender un resultado y abrir una comparación sin ayuda. Objetivo mínimo: cuatro de cinco completan ambos recorridos. **No realizada.**
- Validación manual con lector de pantalla real y dispositivos táctiles. Las comprobaciones semánticas, de teclado y axe no sustituyen esa revisión ni certifican por sí solas conformidad WCAG completa.
- La revisión científica cualificada sigue pendiente en el contenido original. Este trabajo conserva ese estado y sus límites.
- No se amplió la base de estudios ni se crearon vínculos nuevos entre estudios y productos terminados. La ausencia de datos estructurados se explica en la interfaz.

Nota de entorno: la revisión automática bloqueó la eliminación de la copia temporal de contraste en `C:\Users\ACER\AppData\Local\Temp\peptivelo-comparison-v2-baseline`. Se dejó en Temp; no forma parte de los cambios del proyecto.
