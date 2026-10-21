# Implementación de identidad Peptivelo

20 de octubre de 2026. Aplicación local Next.js 16 / React 19 / TypeScript, Tailwind importado con CSS global y componentes propios. No se reconstruyó la plataforma ni se cambió el catálogo, los precios, las fuentes científicas o los estados editoriales.

## Auditoría previa y etapas

1. Se revisaron layout, navegación, componentes de comparación, fuentes, CSS y activos. Existían DM Sans, uso de Georgia/Arial en distintas piezas, matraz como marca, CSS acumulado de unas 6300 líneas, 139 apariciones de hexadecimales y paletas locales para lector/identificación/escáner. Un tema global sin migrar esas paletas habría dejado superficies incoherentes.
2. Los tres archivos inicialmente nombrados no estaban disponibles. Se comenzó por el PNG adjunto y tipografía explícita; después el titular compartió el manual completo en el chat. Las tablas de ese manual se transcribieron a CSS/JSON identificando sus extensiones propuestas, sin atribuirlas a un manual original comprobado externamente.
3. Se alojaron Manrope/Inter y licencias localmente, se sustituyó el matraz de cabecera/pie por el isotipo original y se configuró su uso en metadatos y favicon PNG. La entrega pequeña se optimiza con Next Image; el PNG fuente se conserva idéntico byte por byte.
4. Se migraron los colores literales de declaraciones del CSS global a variables semánticas y aliases compatibles; se añadieron temas y capa compartida de componentes. El tema claro es inicial; el selector persiste la preferencia sin servicios externos.
5. Se comprobó navegación compacta, comparación, fuentes, fichas, formularios, estados vacíos, selector de productos y escáner en ambos temas y tres tamaños. No se introdujeron escalas de eficacia ni colores de supuesta certificación científica.

## Archivos modificados y añadidos

| Área | Archivos |
| --- | --- |
| Layout y metadatos | `src/app/layout.tsx`, `src/app/page.tsx` |
| Estilos existentes migrados | `src/app/globals.css` |
| Tipografía local | `src/app/brand-typography.css` |
| Tokens claros/oscuros | `src/styles/peptivelo-tokens.css`, `src/styles/peptivelo-tokens.json` |
| Componentes y responsive | `src/styles/peptivelo-components.css` |
| Logo y selector de tema | `src/components/brand-identity.tsx`, `src/components/theme-toggle.tsx` |
| Navegación | `src/components/navigation.tsx` |
| Activo y procedencia | `public/brand/peptivelo-isotype.png`, `public/brand/SOURCES.md` |
| Fuentes y licencias | `public/fonts/inter-latin.woff2`, `public/fonts/manrope-latin.woff2`, `public/fonts/Inter-OFL.txt`, `public/fonts/Manrope-OFL.txt` |
| Preparación reproducible | `scripts/install-brand-fonts.mjs`, `scripts/migrate-brand-tokens.mjs`, `docs/research/peptivelo-font-response.css` |
| Verificación | `e2e/brand-foundation.spec.ts`, `e2e/brand-themes.spec.ts` |
| Documentación | `docs/PEPTIVELO_DESIGN_SYSTEM.md`, este informe, `docs/VERIFICATION.md`, `.interface-design/system.md` |

Los scripts documentan el trabajo; no se ejecutan en cada visita ni realizan compras, publican contenido o activan servicios. La aplicación no necesita consultar Google Fonts en tiempo de ejecución.

## Componentes unificados

- Cabecera, pie y marca: isotipo compartido, nombre tipográfico provisional y navegación secundaria accesible mediante More. Permanecen todas las secciones; se añadieron accesos explícitos a elección por pregunta, cabello y fuentes al menú.
- Botones primarios/secundarios, iconos de acción, estados hover, deshabilitado/carga y foco visible.
- Cards de productos, preguntas, ingredientes y resultados; bloques editoriales y badges descriptivos.
- Inputs, selects, búsqueda, formularios y filtros: superficies, texto, bordes y tipografía coherentes; se preservan validaciones y etiquetas existentes.
- Comparaciones y tablas técnicas: superficies, cifras tabulares, metadatos y límites de evidencia en ambos temas.
- Diálogos de producto, referencias, ingredientes y escáner; fondos, tipografía y backdrop compartidos. No se modificó su lógica de identificación o cámara.
- Estados vacíos, enlaces de fuentes y mensajes de datos pendientes. Las ausencias no se presentan como prueba de ineficacia.

## Verificación y límites

- Compilación de producción y ESLint de archivos cambiados aprobados; 52 pruebas unitarias aprobadas.
- 18 pruebas de navegador finales aprobadas entre escritorio, tableta y móvil: tipografía efectiva, imagen decodificada, temas claro/oscuro, persistencia tras recarga, seis páginas principales, menú, selector vacío, escáner, referencias, foco, recorrido de compra y regreso desde guías.
- Axe sin incidencias para las etiquetas WCAG A/AA seleccionadas, incluidas reglas disponibles de 2.2; además controles de desbordamiento a 320px y movimiento reducido. Esto no constituye certificación exhaustiva de WCAG ni sustituye pruebas con usuarios/tecnologías de asistencia reales.
- Se inspeccionaron capturas de claro/oscuro y escritorio/móvil. Ejemplos: `brand-light-home-desktop.png`, `brand-dark-home-desktop.png`, `brand-dark-comparison-mobile.png`.
- Cero declaraciones hexadecimales directas restantes en globals.css; los colores se concentran en los tokens. Se conservaron los archivos históricos y el activo de fuente DM Sans sin uso para no borrar material previo.

## Activos que debe proporcionar el titular

1. Logotipo horizontal aprobado y SVG original del isotipo, sin trazado aproximado.
2. Versión reversa aprobada para oscuro. Mientras falta, el PNG original aparece sobre base marfil; no se recoloreó.
3. Favicon simplificado del mismo símbolo validado a 16/32/48px, y recursos cuadrados Apple 180px / dispositivos 192 y 512px. El favicon actual usa el isotipo PNG aislado, no una lámina; todavía no es una exportación específica para esos tamaños.

La composición actual de nombre usa Manrope por instrucción del manual y es provisional; no se afirma haber identificado la fuente del wordmark original. No se inventaron un logo horizontal, un SVG o un reverso oficial.
