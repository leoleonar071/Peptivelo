# Product identifier redesign

La herramienta muestra un encabezado editorial Instrument Sans y dos métodos simultáneos: tarjeta petróleo de escaneo y tarjeta de búsqueda por nombre. Se eliminan breadcrumb visual y pasos iniciales. En móvil el escaneo precede a la búsqueda sin pestañas. El catálogo ocupa una sección posterior: seis registros iniciales en escritorio, cuatro en móvil, con acceso al catálogo completo. Los resultados de una búsqueda no se recortan.

La búsqueda local admite términos separados por espacios, marca, nombre e ingredientes, con normalización de acentos. Se conservan confirmación manual, explicaciones, fuentes y comparaciones. Los enlaces QR exactos abren directamente la ficha documentada. Las fichas visuales existentes son recursos propios de texto, no fotografías de envases; se amplían sin inventar fotografías.

## Escáner real

`ProductScanner` reutiliza ZXing con importación dinámica al iniciar cámara o leer una imagen. Usa cámara trasera preferida, lectura de imagen local y entrada manual. No sube imágenes. Detiene pistas al cerrar, cancelar, cambiar de pestaña y cuando una petición de permiso termina después del cierre. Los mensajes cubren permiso denegado, falta de cámara, errores, código sin coincidencia y alternativa por nombre.

`verifiedProductCodes` está vacío: **no hay GTIN/EAN/UPC de fabricantes verificados**. Esto se comunica junto al botón principal y dentro del diálogo. Los QR de rutas exactas Peptivelo funcionan; otras URLs se rechazan. No hay variantes ambiguas registradas actualmente. Para habilitar códigos comerciales hacen falta códigos y fuentes de la presentación exacta, no una nueva dependencia. No se promete autenticidad, análisis del contenido ni reconocimiento universal.

## Archivos y alcance

- `src/components/product-identify.tsx`: encabezado, métodos, búsqueda, catálogo y navegación tras escaneo.
- `src/styles/product-identifier.css`: estilos locales y temas, usando la fuente local ya instalada.
- `src/app/skincare/identify/page.tsx`: importación de estilos y metadatos descriptivos.
- `e2e/identifier-redesign.spec.ts`, `e2e/identify.spec.ts`, `e2e/scanner.spec.ts`: matriz responsive y regresiones.

Se mantiene URL, canonical y noindex beta. La orientación SEO es identificar por nombre/marca/ingrediente y consultar etiquetas, sin prometer cobertura comercial de barcodes ni atribuir volúmenes de búsquedas no medidos. No se cambia backend, datos ni fotografías. No se añaden paquetes.

## Validación

Compilación Worker, lint y typecheck. Prueba unitaria existente de resolución de códigos. Navegador: matriz de 1440, 1280, 1024, 768, 430, 390, 375 y 320 px en claro/oscuro, búsqueda inicial/con resultados/sin resultados, escáner abierto, axe WCAG 2.2 y desbordamiento. Las regresiones comprueban QR real decodificado desde imagen, código desconocido, cámara denegada, foco, confirmación manual y limpieza de pistas con streams simulados. No se atribuye una prueba física en teléfonos ni una medición LCP/INP de campo.

Resultado: **16 pruebas de navegador aprobadas y 2 omisiones previstas** (matriz ejecutada una sola vez), además de la prueba unitaria de resolución de códigos. Capturas finales y logs en `audit-evidence/identifier-redesign/`. Se corrigieron contraste de la tarjeta de escaneo y captura durante la transición de tema antes de la ejecución final.
