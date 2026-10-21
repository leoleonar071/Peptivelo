# Peptivelo — sistema de identidad implementado

Versión 1.0, 20 de octubre de 2026. Fuente: manual compartido por el titular en el chat y el isotipo PNG adjunto. Los archivos CSS/JSON nombrados inicialmente no estaban adjuntos; se transcribieron las tablas del manual a `src/styles/peptivelo-tokens.css` y `.json`. No se presentan las extensiones técnicas como un manual original de marca comprobado externamente.

Peptivelo es una plataforma independiente de información y comparación, no fabricante, farmacia ni laboratorio certificador. Su promesa editorial es: «Entiende qué contiene. Descubre qué se sabe. Compara antes de comprar.»

## Paleta y temas

Referencia: petróleo #0E3D36, azul gris #4E6B72, sage #9BB7A7, aqua #C7E0D9 y marfil #F8F7F2. Sage queda reservado para decoración, no texto esencial.

| Rol | Claro (predeterminado) | Oscuro |
| --- | --- | --- |
| Fondo | #F8F7F2 | #0A2925 |
| Superficie | #FFFFFF | #0E3D36 |
| Superficie secundaria | #EFF4F0 | #164B43 |
| Texto | #13332F | #F8F7F2 |
| Texto secundario | #4E6B72 | #C7E0D9 |
| Borde | #D9E4DD | #35655B |
| Acción primaria / texto | #0E3D36 / #FFFFFF | #C7E0D9 / #0E3D36 |
| Hover primario | #15554B | #F8F7F2 |
| Acento / texto | #C7E0D9 / #0E3D36 | #1D5149 / #F8F7F2 |
| Foco | #276D63 | #B7E1D6 |

Son las extensiones de interfaz propuestas por el manual. Las sombras y fondos de diálogo se derivan del petróleo con mezcla transparente. Los bordes de controles editables usan el color de texto secundario para facilitar su identificación. Las fotos conservan una superficie blanca para reconocer el producto.

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

Se mantienen productos, datos, rutas, comparación, selección por pregunta, identificación, biblioteca, cabello, guías, calculadora, metodología y fuentes. El menú More reúne accesos secundarios y admite teclado/Escape. Las citas, fechas, afiliación y límites de evidencia conservan su contenido y su estado pendiente de revisión cualificada.

No se convierte la falta de datos en ineficacia, ni una etiqueta comercial en evidencia clínica. Los colores de evidencia son descriptivos, no una escala inventada de calidad o eficacia. No se modificaron indexación, monetización, precios ni fuentes científicas por este cambio visual.
