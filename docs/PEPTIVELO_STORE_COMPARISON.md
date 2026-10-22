# Peptivelo — Comparación de tiendas y entrega

## Alcance implementado

Las once fichas faciales incorporan Compare stores & delivery. Cada fila corresponde al mismo producto y tamaño documentado, una tienda, un mercado, una moneda y una observación fechada. El formulario GET funciona sin JavaScript y conserva destino/orden en la URL. Los productos siguen teniendo una URL canónica única.

El piloto de Multi-Peptide + Copper Peptides 1%, 30 mL, compara dos tiendas reales: la observación existente de The Ordinary y una nueva de Sephora US. Las demás fichas muestran la cobertura realmente registrada: una tienda o ninguna, como COSRX Mini 50 mL. No se copiaron precios de otros tamaños ni se inventaron vendedores.

Los destinos iniciales son Estados Unidos contiguos, Reino Unido, Canadá y Perú. Los tres últimos muestran explícitamente que no hay ofertas registradas; su presencia en el selector no implica cobertura comercial, disponibilidad o autorización de envío. Se mantiene el contenido en inglés y no se destaca el país del creador en About.

## Fuentes del piloto

Observación consultada el 22 de octubre de 2026, UTC:

| Fuente primaria | Hecho usado y límite |
| --- | --- |
| [Sephora: producto](https://www.sephora.com/product/buffet-copper-peptides-1-P442752) | Presentación declarada 1 oz / 30 mL y precio USD 32. No se convierte Add to Basket en verificación de inventario local. |
| [Sephora: envío US](https://www.sephora.com/beauty/shipping-information) | Envío estándar USD 6,95 para compra como invitado inferior a USD 50. La política distingue beneficios de membresía y otras condiciones. El cálculo del piloto es USD 38,95 antes de impuestos y otros cargos; no es cotización final. |
| Catálogo existente y sus sourceId | Observaciones de fabricantes con tamaño y fecha, sin costes de envío ni tiempos añadidos por suposición. |

La política de Sephora publica un plazo estándar de 1–3 días hábiles. Se muestra como transporte; no se supone un tiempo de preparación ni se presenta una fecha garantizada de llegada. No se reutilizan estos importes para otro país. Los enlaces permiten consultar las condiciones vigentes en la tienda.

## Modelo y reglas

- `src/data/offers.json` contiene observaciones adicionales con fuentes propias. `src/lib/offers.ts` adapta las observaciones existentes de catalog.json, sin duplicarlas en otro archivo de precios.
- Zod valida referencias a producto, presentación exacta, moneda por mercado, HTTPS, rangos de días, cantidades finitas e identidad única de observación. Una URL compensada requiere divulgación.
- Las observaciones históricas se conservan. Se muestra la más reciente por tienda, producto, tamaño, unidad, mercado y moneda; desempates deterministas no dependen de comisión.
- Ordenaciones: tienda, precio de producto, producto más envío, precio por mL y ventana completa de entrega. Cantidades desconocidas van al final, nunca a cero. No hay etiqueta de mejor proveedor ni ganador universal.
- Producto más envío solo se calcula con una política de coste comprobada para ese destino y escenario. No incluye impuestos, derechos de importación, cargos adicionales ni conversiones de moneda.
- Una ventana completa exige tanto preparación como transporte, con la misma unidad de días hábiles. Una duración de transporte aislada no sirve para ordenar por entrega completa.
- Precios o políticas de más de 30 días, fechas futuras y stock observado como agotado quedan fuera de las comparaciones numéricas correspondientes. Se mantienen visibles como datos históricos con sus límites. No se interpreta desconocido como agotado.
- Las políticas generales no son cotizaciones por código postal. El usuario confirma dirección, elegibilidad, stock, importe y llegada al finalizar la compra en la tienda.
- Los enlaces actuales son ordinarios y sin comisión. Si se activan afiliados, deben configurarse y divulgarse; las ordenaciones numéricas no cambian para favorecer pagos.

## Tarjetas propias y fotografías

Las doce imágenes faciales/capilares se sustituyeron por SVG de texto propios: marca, nombre y tamaño, rotulados como registro de identificación y no fotografía de envase. Los archivos originales se trasladaron individualmente a `.migration-backup/product-photographs/`, una ubicación local ignorada y fuera de public. Las rutas públicas antiguas ya no sirven esas fotografías en el Worker local. No se borró el historial de Git ni se acredita permiso de las imágenes anteriores.

`node scripts/create-product-records.mjs` reproduce las tarjetas. El script verifica que cada ruta de origen esté dentro del directorio de imágenes esperado antes de moverla. No modifica el isotipo aprobado, los ingredientes o las conclusiones editoriales.

## Soporte: pendiente de activación externa

El nombre previsto es **suppor@peptivelo.com**, según la preferencia del propietario. No está publicado ni se declara operativo: falta el correo de destino del propietario y la verificación de recepción. `CONTACT_EMAIL` sigue vacío hasta completar ese paso.

Se consultó la guía local Cloudflare Email Service y la [documentación oficial de Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/). Para recibir mensajes mediante reenvío:

1. En la cuenta que administra el DNS de peptivelo.com, abrir Email Service → Email Routing y seleccionar el dominio.
2. Añadir el correo existente de destino y verificarlo mediante el mensaje que envíe Cloudflare. Ese enlace debe completarlo quien controla el buzón.
3. Crear la regla del nombre local `suppor`, dirigida al destino verificado. Revisar los registros DNS propuestos; si ya existe un proveedor de correo, no sustituir sus MX sin planificar la transición.
4. Probar recepción desde otra cuenta. Después configurar `CONTACT_EMAIL=suppor@peptivelo.com`, reconstruir y verificar Contact y Privacy.

El reenvío de entrada no configura por sí solo una identidad de envío para responder como suppor@peptivelo.com. Si se necesita esa función, seleccionar y verificar el mecanismo de envío o buzón correspondiente. No se creó un Worker de correo, una suscripción, una cuenta de terceros ni se enviaron correos en esta entrega.

## Validación y publicación

- 69 pruebas unitarias aprobadas en 22 archivos, incluidas reglas de moneda, presentación, fechas, costes ausentes, preparación/transporte, orden neutral y divulgación de afiliados.
- Typecheck y lint correctos. La compilación de producción del Worker finalizó correctamente.
- 66 pruebas Playwright aprobadas sobre el Worker compilado, en escritorio, tablet y móvil. Se probaron ofertas sin JavaScript, filtros recargables, destino sin cobertura, precio ausente, enlaces, retirada de rutas antiguas de fotografías y regreso al par elegido. Axe pasó en los recorridos auditados; la sección de ofertas se comprobó en ambos temas.
- La primera ejecución detectó nombres accesibles demasiado extensos en los selectores. Se separaron etiquetas y controles antes de la ejecución final aprobada. Una prueba heredada del lector se actualizó para navegar por las pestañas vigentes; las imágenes lazy se verifican tras entrar en el viewport.
- La auditoría estructural de contenido pasó: 544 referencias comprobadas, sin referencias desconocidas ni imágenes locales ausentes.
- Se inspeccionaron visualmente el registro propio, las ofertas de escritorio y el modo oscuro móvil. No se realizó una prueba moderada de comprensión con usuarios ni una compra de prueba en tiendas.

Los resultados finales de pruebas y capturas se registran en `docs/audit-evidence/store-comparison/`. La observación original de auditoría sigue siendo histórica; estos cambios son una implementación posterior. No se habilita indexación ni se acredita revisión profesional por añadir tiendas.

Los cambios permanecen locales, sin commit, push ni despliegue en esta fase. El sitio público conserva su versión anterior hasta publicar el conjunto. El correo, el nombre público del creador y los permisos/configuración privados de la cuenta requieren datos del propietario. El dominio sugerido es el existente peptivelo.com; no se registraron dominios nuevos.

Para ampliar el catálogo comercial, añadir observaciones con URL de producto/tamaño, país, moneda y fecha; añadir costes y plazos solo desde una política aplicable y documentar sus condiciones. Las pruebas rechazan mezclar variantes y no requieren un backend nuevo o un servicio de scraping.
