# Rediseño de comparación editorial — 19 de octubre de 2026

Piloto: `/skincare/compare/niod-cais3-vs-the-ordinary/`. Se mantiene el contenido científico y su estado de borrador/noindex. No se altera el catálogo, los precios ni las conclusiones.

## Recorrido

1. Dos productos reconocibles: fotografía, nombre, presentación y observación de precio. Cambio de pareja enlaza al comparador interactivo.
2. Navegación por anclas: Overview, Ingredients & price, Evidence. El estado activo sigue la lectura; conserva enlaces funcionales sin JavaScript.
3. Resumen de tres puntos en 30 segundos: beneficios, precauciones y desconocidos. La precaución general está visible, junto con citas a los mismos estudios y evaluaciones.
4. Tabla semántica existente, con filtro de diferencias y ayudas de ingredientes. Se elimina la repetición de grandes fotos en su cabecera porque ya están al inicio.
5. Interpretación de etiquetas, evidencia detallada y preguntas con desplegables. Los textos originales permanecen disponibles y con sus identificadores de cita.
6. Dónde comprar con divulgación de ausencia de afiliación. Fuentes numeradas reunidas en un desplegable que se abre al seguir una cita. Metodología y límites en un bloque secundario.

## Diseño

Blanco cálido y beige de baja intensidad, texto y acciones en petróleo, bordes discretos, paneles de 20–24 px y controles redondeados. DM Sans y la jerarquía existente; textos principales de 16–17 px. Fotos de la pareja con prioridad de carga; el resto conserva su comportamiento anterior. El diseño solo se aplica al piloto.

Componentes: `editorial-comparison.tsx`, `reader-navigation.tsx`. Se reutilizan `ComparisonGrid`, `ComparisonEvaluation`, citas, referencias y enlaces de fabricantes; no se duplican implementaciones de cálculos o evidencia.

## Validación

Compilación/TypeScript, 37 pruebas unitarias y ESLint aprobados. Suite completa: 93 pruebas E2E en escritorio, tableta y móvil. Las pruebas cubren navegación, estado de sección, 320 px, fotos, ayudas de ingredientes, citas y accesibilidad automática. Tras el acabado final se ejecuta el conjunto específico de lectura/citas/evidencia. Capturas `reader-viewport-*` y `reader-layout-*`; revisión visual en escritorio y móvil.

Los datos y los permisos de reutilización pública de imágenes mantienen sus limitaciones previas. La revisión editorial y científica profesional sigue pendiente. No se publica externamente ni se activa indexación o afiliación.
