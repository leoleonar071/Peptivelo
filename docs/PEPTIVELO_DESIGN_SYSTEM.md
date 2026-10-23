# Peptivelo — sistema de identidad implementado

Versión 1.0, 20 de octubre de 2026. Fuente: manual compartido por el titular en el chat y el isotipo PNG adjunto. Los archivos CSS/JSON nombrados inicialmente no estaban adjuntos; se transcribieron las tablas del manual a `src/styles/peptivelo-tokens.css` y `.json`. No se presentan las extensiones técnicas como un manual original de marca comprobado externamente.

Peptivelo es una plataforma independiente de información y comparación, no fabricante, farmacia ni laboratorio certificador. Su promesa editorial es: «Entiende qué contiene. Descubre qué se sabe. Compara antes de comprar.»

## Paleta y temas

Referencia: petróleo #0E3D36, azul gris #4E6B72, sage #9BB7A7, aqua #C7E0D9 y marfil #F8F7F2. Sage queda reservado para decoración, no texto esencial.

| Rol                     | Claro (predeterminado) | Oscuro            |
| ----------------------- | ---------------------- | ----------------- |
| Fondo                   | #F8F7F2                | #0A2925           |
| Superficie              | #FFFFFF                | #0E3D36           |
| Superficie secundaria   | #EFF4F0                | #164B43           |
| Texto                   | #13332F                | #F8F7F2           |
| Texto secundario        | #4E6B72                | #C7E0D9           |
| Borde                   | #D9E4DD                | #35655B           |
| Acción primaria / texto | #0E3D36 / #FFFFFF      | #C7E0D9 / #0E3D36 |
| Hover primario          | #15554B                | #F8F7F2           |
| Acento / texto          | #C7E0D9 / #0E3D36      | #1D5149 / #F8F7F2 |
| Foco                    | #276D63                | #B7E1D6           |

Son las extensiones de interfaz propuestas por el manual. Las sombras y fondos de diálogo se derivan del petróleo con mezcla transparente. Los bordes de controles editables usan el color de texto secundario para facilitar su identificación. Las fichas visuales propias identifican la presentación registrada; no simulan fotografías de envases.

El selector guarda únicamente `pv-theme=light|dark` en almacenamiento local. Sin preferencia guardada, empieza en claro incluso si el sistema operativo usa oscuro. Si el almacenamiento no está disponible, el selector funciona durante esa página. El tema se aplica antes de hidratar la interfaz para reducir el destello del tema incorrecto.

## Tipografía y componentes

- Manrope en encabezados y nombre tipográfico provisional; Inter en lectura, navegación, fichas, formularios y tablas. Fuentes variables latinas alojadas localmente, con sus licencias OFL. No se dedujo la fuente del logotipo original.
- Base 16px / 1,6; titulares con jerarquía responsive y tracking aproximado de -0,035em. Se conservan tamaños locales que ayudan a leer las tablas y fichas existentes.
- Espaciado de referencia 4, 8, 12, 16, 24, 32, 48 y 64px. Radios: controles 12px, tarjetas 18px y bloques 24px; badges en píldora.
- Botones con altura mínima 44px, controles con etiquetas existentes, foco visible, mensajes de error textuales y estados deshabilitados/carga. Tablas con cifras tabulares y unidades explícitas.
- Tarjetas, menús, filtros, comparadores, selector de producto, citas, guías de ingredientes y escáner usan las mismas variables semánticas mediante aliases compatibles con las clases existentes. Movimiento reducido desactiva transiciones y desplazamiento suave.

## Identidad y activos

`public/brand/peptivelo-isotype.png` es una copia sin alteraciones de la imagen adjunta. Cabecera y pie usan el mismo componente. Next Image optimiza su entrega pequeña sin modificar el original. El favicon apunta al isotipo aislado, no a una lámina completa. Los metadatos Organization identifican ese mismo recurso.

Al no existir un reverso aprobado, el símbolo conserva sus colores sobre una pequeña superficie marfil en ambos temas. No se aplicó filtro, trazado SVG ni generación de un símbolo alternativo. El nombre en Manrope sigue siendo una composición tipográfica provisional, no un logo horizontal oficial reconstruido.

Activos pendientes: logo horizontal aprobado, isotipo SVG original, versión reversa aprobada y favicon simplificado validado a 16/32/48px. También versiones cuadradas autorizadas para Apple 180px y dispositivos 192/512px. No se inventaron esos archivos ni un SVG que aparentara ser original.

## Continuidad editorial y funcional

Se mantienen productos, datos, rutas, comparación, selección por pregunta, identificación, biblioteca, cabello, guías, calculadora, metodología y fuentes. El menú global reúne Explore topics, Peptides A–Z, Learn y Search, con agrupaciones equivalentes en móvil y cierre mediante Escape. Las citas, fechas, afiliación y límites de evidencia conservan su contenido y su estado pendiente de revisión cualificada.

No se convierte la falta de datos en ineficacia, ni una etiqueta comercial en evidencia clínica. Los colores de evidencia son descriptivos, no una escala inventada de calidad o eficacia. No se modificaron indexación, monetización, precios ni fuentes científicas por este cambio visual.

## Comparador V2

El comparador raíz usa dos estados: selección A/B con tarjetas completas y análisis automático con identidades compactas. Un único H1 de 56px en escritorio y 36px en móvil presenta “Compare with clarity.”; se reduce al completar la pareja. Ancho máximo 1200px, bordes sólidos, radios de 20–24px y controles de al menos 44px.

At a glance permanece visible. Product details, Ingredients, Pricing, Brand claims y Evidence empiezan cerradas. Evidence & sources separa etiquetas, ingredientes, formulaciones, producto terminado y análisis editorial de la pareja cuando existe. Los lectores editoriales mantienen sus pestañas y su variante de tabla original.

En móvil, cada atributo ocupa una fila encima de los valores A/B, con identidades repetidas. Los textos largos del detalle se apilan. No hay cabeceras ni barras flotantes. El selector nativo mide hasta 880px en escritorio y adapta su altura en móvil; los resultados tienen desplazamiento propio. Los activos son registros editoriales propios y cuentan con un respaldo estable ante fallos de imagen.

La fecha de observación del precio se distingue de la comprobación de etiqueta. Los valores desconocidos, límites de concentración, precauciones y fuentes permanecen al filtrar diferencias. Las divulgaciones de marca se atribuyen al fabricante y se separan de la interpretación editorial. US/USD es el contexto comercial de este comparador.

## Comparación general

El acceso global Compare lleva a /compare/; los artículos usan /compare/{slug}/. Se retiran las rutas anteriores sin redirección. El H1 es “Compare with clarity.” y el subtítulo “Explore documented differences. Understand the evidence. Check the sources.”. El comparador no muestra navegación local de Skincare. Las tarjetas dicen Choose a product y el aviso de cobertura identifica los productos faciales disponibles; Peptides A–Z ofrece explorar otras áreas. Los artículos conservan su tema con un enlace a Skin & cosmetics. Las reglas de compatibilidad proceden del registro de grupos y no de palabras o efectos compartidos. No hay categorías científicas vacías ni comparaciones de péptidos sin datos revisados.

## Áreas futuras y plantilla compartida

El registro interno src/lib/topic-registry.ts prepara 16 áreas: tres activas y 13 planificadas. Las planificadas no tienen enlace público, opción deshabilitada, resultado de búsqueda, filtro ni página vacía. La navegación consume solamente las activas. Health & research usa TopicLanding: título de área, introducción existente, bloques por formato con contenido real y enlaces relacionados activos. Los bloques vacíos se omiten. Se reutilizan tokens, tipografías, superficies y foco; no se añade otro sistema visual.

Una identidad puede pertenecer a varios temas sin duplicar su ficha. La agenda de investigación y el modelo de borradores son internos; no generan contenido científico ni opciones del comparador. Antes de activar un área nueva, preparar una introducción con fuentes y dos fichas completas con comprobación editorial, conservando el estado real de revisión científica. La comprobación de integridad ayuda a la revisión, pero no publica ni certifica la evidencia. Ver docs/topic-foundation/IMPLEMENTATION.md y RESEARCH_ROADMAP.md.
