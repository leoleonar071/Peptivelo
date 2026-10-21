# Revisión de preparación para publicar

Actualizado el 20 de octubre de 2026. Titular residente en Perú; audiencia objetivo en Estados Unidos. El sitio sigue en vista previa local. Esta revisión no constituye aprobación editorial, autorización de imágenes ni publicación. El orden actual de páginas y los resultados de la auditoría ampliada están en [PUBLICATION_BATCH.md](PUBLICATION_BATCH.md).

## Cambios completados

- La marca se configura mediante `NEXT_PUBLIC_SITE_NAME`; se aplica a navegación, metadatos y páginas informativas. El valor predeterminado es Peptivelo; no constituye confirmación de dominio ni derechos de marca.
- La página de contacto distingue entre correo configurado y ausente, sin mostrar una instrucción técnica al lector. El email real se presenta cuando se añade `CONTACT_EMAIL`.
- Se pueden configurar la identidad real del operador y el hosting mediante `SITE_OPERATOR_NAME` y `HOSTING_PROVIDER`. No se inventaron valores.
- Mientras `SITE_INDEXABLE=false`, las respuestas del middleware incluyen `X-Robots-Tag: noindex, follow`, además de los metadatos existentes. No se cambió la configuración para indexar ni se prohibió rastrear las páginas que deben mostrar el noindex.
- Se añadió `npm run audit:launch`: comprobación local de origen HTTPS, marca/contacto/operador/hosting, fuentes, imágenes, fechas de precios, presentaciones y estado editorial/comercial. Lee `.env.local` si existe, muestra nombres de comprobaciones sin imprimir datos personales y no cambia la configuración.

El comando devuelve código 1 mientras falten datos técnicos; es el resultado esperado de preparación incompleta. Un resultado técnico favorable tampoco demuestra permisos de uso, revisión humana o aceptación de programas.

## Hallazgos y pendientes

| Estado | Elemento | Acción concreta |
| --- | --- | --- |
| Pendiente del propietario | Dominio y marca | Seleccionar y registrar el dominio tras confirmar disponibilidad y revisar coincidencias de marca; configurar el origen HTTPS y el nombre. Ver [la recomendación](DOMINIO_Y_MARCA.md). |
| Pendiente del propietario | Contacto | Crear un correo accesible, configurarlo y probar envío/recepción. No se necesita compartir credenciales en el chat. |
| Pendiente del propietario | Operador | Indicar el nombre real de la persona o entidad que operará el sitio. Residir en Perú no equivale a tener una entidad estadounidense. |
| Pendiente de infraestructura | Hosting | Elegir proveedor, documentar su tratamiento/retención real y revisar la configuración del dominio, HTTPS y versiones de producción. |
| Pendiente de autorización o sustitución | Fotografías | Las imágenes de los 11 productos faciales y el producto capilar proceden de fabricantes y tienen procedencia documentada. Falta permiso de reutilización pública o reemplazo por fotografías autorizadas. No se trató el acceso público a una foto como licencia. |
| Pendiente de revisión | Comparaciones y guías | El catálogo contiene 10 comparaciones; se añadieron fichas capilares y artículos de biblioteca. La revisión automática no equivale a revisión editorial humana o científica. Los borradores siguen fuera del sitemap y noindex. |
| Pendiente de revisión operativa | Privacidad y términos | Completar identidad, hosting, retención y operaciones reales. Si luego se activan anuncios/analítica, revisar su configuración y actualizar los textos según lo que se implemente. |
| Preparado, sin activar | Afiliación y AdSense | No hay códigos de anuncios, programas aprobados ni enlaces remunerados activos. Mantener los avisos actuales hasta que exista una relación real; entonces revisar enlaces por producto, identificación comercial y medición. |
| Preparado, sin conexión externa | Medición | Existen eventos locales. Faltan proveedor y verificación de visitas, clics y atribución reales. No se afirmaron ventas ni tráfico estadounidense medido. |
| Limitación visible, no impide usar el comparador | NIOD 30 mL | Mantener el precio ausente hasta comprobarlo por variante. No inventar un coste para poder completar la tabla. |

## Secuencia para publicar

1. Elegir marca/dominio y aportar contacto e identidad del operador.
2. Resolver imágenes y revisar los contenidos que se vayan a publicar; mantener los análisis pendientes como borradores.
3. Seleccionar hosting, completar los textos operativos y desplegar una versión revisable con indexación desactivada.
4. Verificar en la URL pública HTTPS, navegación, metadatos, correo, privacidad y comportamiento en móvil. Ejecutar la auditoría sobre la configuración real.
5. Habilitar indexación de contenido revisado de forma deliberada y conectar Search Console. Enviar solicitudes de programas con los datos reales del titular peruano.
6. Activar solo las integraciones aprobadas, con avisos y medición comprobados. Para AdSense, evaluar anuncios discretos en guías, sin interrumpir la tabla del comparador.

No se compraron dominios, aceptaron contratos, crearon cuentas, desplegaron recursos ni contactaron terceros. Los resultados de pruebas están en [VERIFICATION.md](VERIFICATION.md).
