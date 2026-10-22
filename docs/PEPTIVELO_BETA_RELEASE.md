# Peptivelo — Publicación de beta y búsqueda conectada

Entrega posterior a la auditoría del commit 80fa15e. Incluye las mejoras de confianza y marca, comparación de tiendas, tarjetas propias y la búsqueda conectada. El correo público solicitado es **suppor@peptivelo.com**, sin t final. Se publica por petición expresa del propietario; la configuración y verificación de recepción quedan a su cargo y no se presentan como completadas.

## Búsqueda implementada

- Se mantienen las rutas existentes y los resultados de ingredientes, productos, guías y comparaciones. Se añaden 34 fuentes con enlaces a anclas reales en Sources: 85 documentos en total con los datos actuales.
- GHK-Cu y GHKCu resuelven a Copper Tripeptide-1. Desde esa identidad se recuperan dos productos que declaran ese ID, tres comparaciones que incluyen esos productos y las fuentes citadas por la ficha. Los resultados explican la relación; una fuente citada no se presenta automáticamente como ensayo de producto.
- Tripeptide-1 Copper Acetate conserva su identidad independiente. La comparación con NIOD puede aparecer por incluir otro producto que declara Copper Tripeptide-1; NIOD no aparece como producto declarante de ese mismo ingrediente.
- Las preguntas por porcentajes pueden recuperar el texto real de las guías. Las consultas compuestas deben satisfacer los términos discriminantes en lugar de coincidir solo con la mitad de las palabras.
- Se muestra la sugerencia ortográfica cuando se usa; no se cambia el texto de consulta ni se corrigen números o identificadores científicos mediante distancia aproximada. Los candidatos ambiguos permanecen sin corregir, salvo erratas comunes explícitas con vocabulario existente.
- Se conserva el límite de siete sugerencias y hasta dos por grupo. El menú añade acceso a Search Peptivelo; el buscador local no requiere una API nueva, base vectorial ni generación de conclusiones científicas.

## Validación previa al push

105 pruebas unitarias aprobadas, incluido un corpus de 32 consultas y negativos, separación de identidades, alcance de relaciones, fuentes, moneda, variante y entrega. Typecheck, lint y compilación del Worker correctos. Los resultados finales de navegador se registran junto con las comprobaciones del dominio real en `audit-evidence/beta-release/`.

Playwright sobre el Worker compilado: **69 pruebas aprobadas**, con tres omisiones condicionadas al viewport en pruebas de hero/atajos que no aplican a esos proyectos. Incluye escritorio, tablet, móvil, ambos temas, búsqueda conectada, fuentes, navegación, ofertas, correo, noindex, axe y uso sin JavaScript. La primera implementación de tiendas también conserva una ejecución previa de 66 pruebas aprobadas.

## Flujo de publicación

Se usa la integración existente GitHub main → Workers Builds → `npm run build:vinext` → `npx cf deploy --prebuilt`. No se vuelve al comando Wrangler ni se instala otro mecanismo de despliegue. No se cambia el dominio ni se activa indexación. Las capturas históricas con fotografías no autorizadas se conservan localmente y se excluyen de Git; se versionan las capturas nuevas con arte propio.

La comprobación posterior debe vincular el commit de GitHub con Workers Builds y confirmar sobre https://peptivelo.com: correo exacto en Contact, dos tiendas en el piloto, presentación y destino, imágenes SVG propias, búsqueda GHKCu y enlaces a fuentes, navegación y noindex. No prueba recepción de correo, compras, entregas de terceros ni revisión profesional del contenido.

## Límites que permanecen

No hay ofertas comerciales documentadas para Reino Unido, Canadá o Perú: el selector comunica esa ausencia. La comparación de tiendas tiene cobertura piloto, precios fechados y costes/plazos desconocidos visibles. No están activos anuncios, contratos de afiliación, análisis de conversión ni correo verificado. Nombre público del creador, retención de logs, revisión editorial y demás requisitos de difusión amplia continúan pendientes. Publicar esta beta no equivale a cerrar esos requisitos.
