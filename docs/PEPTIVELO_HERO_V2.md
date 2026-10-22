# Hero refinement V2

El Home conserva su buscador universal y reduce la interfaz alrededor de él. El H1 usa Instrument Sans variable (400–600), alojada localmente en WOFF2 (30.092 bytes), con licencia OFL incluida. Manrope e Inter conservan sus usos existentes. Colores claros: marfil `#F8F7F2`, petróleo `#0E3D36` y texto secundario `#4E6B72`; el tema oscuro usa superficies petróleo y texto marfil.

Desktop: H1 en pesos 500/400, descripción breve, tres accesos del mismo peso, dos consultas sugeridas y una línea de transparencia. La calculadora sigue disponible en navegación y pie. Móvil: composición izquierda, dos acciones compactas y biblioteca como enlace independiente, manteniendo un único conjunto de enlaces en el DOM.

`HomeHero` separa la introducción de la nueva sección “One question. Connected answers.”. `KnowledgePreview` utiliza el ingrediente Copper Tripeptide-1, una fuente CIR citada por su perfil y un producto real encontrado mediante búsqueda. La fuente demuestra contexto de seguridad cosmética, no eficacia del producto. La nota de revisión científica pendiente permanece visible debajo. No se inventaron entidades, resultados ni rutas.

Archivos principales: `src/components/home-hero.tsx`, `src/components/knowledge-preview.tsx`, `src/styles/home-editorial.css` y `public/fonts/instrument-sans-latin.woff2`, con su licencia. Las suites `e2e/home-hero.spec.ts` y `e2e/premium-hero.spec.ts` comprueban la nueva estructura y guardan capturas aisladas por prueba, evitando sobrescrituras de capturas compartidas en Windows.

Validación: compilación del Worker, lint y typecheck; suites de hero y búsqueda conectada. La matriz incluye 1440, 1280, 1024, 768, 390, 375 y 320 px en claro y oscuro, foco, sugerencias y estado sin resultados, navegación por teclado, enlaces reales y axe WCAG 2.2 AA. La búsqueda es local y síncrona: no se añade un indicador de carga artificial.

No se modificaron metadatos, indexación, backend, isotipo, analítica ni la lógica de búsqueda. Las comprobaciones automatizadas no acreditan métricas LCP/INP de campo ni una revisión científica completada. La incorporación de una familia tipográfica adicional añade unos 30 KB de descarga al Home; no se aplica al resto de titulares.

Fuente tipográfica: Google Fonts, Instrument Sans (`https://github.com/google/fonts/tree/main/ofl/instrumentsans`), servida desde el proyecto; no hay peticiones a Google Fonts en tiempo de ejecución.

Resultado final: **24 pruebas aprobadas, 3 omisiones previstas**. Tras desactivar las transiciones solo para las capturas de estados, se volvió a ejecutar la matriz y el atajo de escritorio: **2 pruebas aprobadas**. No se suman como casos distintos. Capturas y logs finales en `audit-evidence/hero-v2/`. Se inspeccionaron escritorio, tablet y móviles, la sección conectada y las sugerencias abiertas. Los fallos iniciales de escritura de capturas compartidas se resolvieron usando rutas de salida aisladas por prueba.
