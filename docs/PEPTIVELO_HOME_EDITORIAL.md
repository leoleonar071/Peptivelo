# Peptivelo — Refinamiento editorial del Home

## Dirección aplicada

El Home usa papel cálido, tinta grafito, tarjetas blancas y acentos minerales. La intención sigue siendo que una persona encuentre una pregunta, vea fuentes y distinga datos documentados de límites. Se conserva la marca verde y el isotipo original; el buscador mantiene la prioridad visual.

| Elemento | Implementación |
| --- | --- |
| Fondo claro | `#F6F5F0`, aplicado al contenedor completo del Home. |
| Texto principal | `#211E1A`; texto secundario cálido `#625D55`. |
| Tipografía | Manrope e Inter existentes. Título principal en peso 800; segunda línea en 500. |
| Hero | Dos gradientes radiales estáticos, cálido y mineral, con posiciones asimétricas. Sin imágenes adicionales, filtros animados ni objetos 3D. |
| Tarjetas | Superficie blanca, sin borde exterior visible y sombras neutras suaves; se mantienen separadores internos útiles. |
| Acciones | Búsqueda en grafito con texto crema; accesos secundarios con relleno contrastado en hover y foco. |
| Tema oscuro | Fondo neutro profundo, tarjetas elevadas discretamente y texto crema; sin tarjetas blancas ni títulos oscuros sobre fondos oscuros. |

## Alcance técnico

Las variables y reglas de `src/styles/home-editorial.css` están dentro de `.home-editorial`. No se reemplaza la paleta global de `peptivelo-tokens.css`; las páginas de ofertas, investigación, búsqueda y comparación conservan sus estilos. Los alias heredados se vuelven a enlazar dentro del Home para evitar mezclar el grafito nuevo con los valores verdes de raíz.

Se mantienen estructura, enlaces, contenido educativo, resultados, rutas y comportamiento de búsqueda. El texto de identificación del catálogo se corrige para describir las tarjetas propias actuales en lugar de atribuir fotografías a fabricantes. No se añaden fuentes, dependencias o recursos gráficos externos.

## Verificación

La compilación del Worker, lint y typecheck pasan. La revisión visual y de navegador usa las suites existentes de hero, temas, búsqueda conectada, ofertas y navegación. La matriz del hero cubre 1440, 1024, 768, 390 y 320 px en claro y oscuro, con axe, foco, búsqueda y ausencia de desbordamiento. Las capturas seleccionadas y el resultado final se conservan en `audit-evidence/home-editorial/`.

Resultado final: **54 pruebas de navegador aprobadas**, con tres omisiones previstas para casos de matriz/atajos que no aplican a determinados proyectos. Se comprobaron también persistencia del tema, diálogos de fuentes, filtros de ofertas, uso sin JavaScript y salida del Home hacia otras páginas. La inspección visual incluyó el hero claro/oscuro de escritorio, el hero móvil y las tarjetas de exploración. No se añadieron pruebas unitarias para reproducir declaraciones CSS ni se modificó lógica de negocio.

Las pruebas automáticas no sustituyen un estudio de comprensión con usuarios ni acreditan métricas de rendimiento de campo. Los gradientes son CSS estático y no requieren descargar nuevas imágenes; no se atribuye una mejora de Core Web Vitals sin medirla.
