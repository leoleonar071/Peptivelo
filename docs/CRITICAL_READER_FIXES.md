# Peptivelo — correcciones de la lectura crítica

8 de noviembre de 2026. Seguimiento de [la auditoría](CRITICAL_READER_AUDIT.md). Cambios locales; la auditoría original conserva las observaciones anteriores a esta entrega.

## Cambios por hallazgo

| Hallazgo | Corrección implementada                                                                                                                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CR-01    | Siguientes pasos calculados mediante ingredientes seleccionados, productos y guías relacionados explícitamente. Cada enlace explica su relación. Acetyl Hexapeptide-8 no recomienda NIOD por una coincidencia temática. Las listas parciales no se presentan como INCI completos.             |
| CR-02    | Registros de pregunta, alcance, consultas realmente realizadas, fecha, razones de selección, acceso y trabajo pendiente para Acetyl Hexapeptide-8 y BPC-157. El proceso histórico no registrado se declara desconocido; las consultas nuevas no se presentan como búsqueda sistemática.       |
| CR-03    | Estados distintos para fuente registrada, dato extraído y comprobación humana contra una fuente. La divulgación de concentración usa un campo explícito. Una comprobación requiere documento, versión, campo, responsable interno, fecha y alcance. No hay comprobaciones humanas fabricadas. |
| CR-04    | Entrada para principiantes junto al buscador y explicación inicial en Learn, con referencia terminológica y sus límites de acceso visibles.                                                                                                                                                   |
| CR-05    | Referencias identificadas por autor/año o editor, tipo y acceso. Se mantienen las citas numeradas y enlaces de retorno. Se incorpora el contexto de financiación declarado por CIR.                                                                                                           |
| CR-06    | Extracciones de los dos estudios seleccionados con diseño, población, duración, desenlace, observación de autores, magnitud pendiente, incertidumbre e interpretación separada. Se elimina «this serum» de las explicaciones generales de ingredientes.                                       |
| CR-07    | Comparación, ingredientes y fuentes accesibles desde la identidad del producto, antes de ofertas. La nota sobre investigación comunicada por NIOD mantiene su valoración metodológica pendiente; el precio conserva su fecha y variante históricas.                                           |
| CR-08    | Contexto de regreso validado entre directorio, producto e ingrediente; conserva filtros y nombre buscado al recargar y volver. Solo acepta rutas locales conocidas, sin redirecciones arbitrarias.                                                                                            |
| CR-09    | Filtro sencillo por nombre y alias registrados, formulario GET utilizable sin JavaScript, controles más compactos y compartir como acción secundaria. No se fusionan identidades químicas distintas. La utilidad con personas sigue pendiente de medir.                                       |

## Límites documentales reales

La introducción usa el extracto indexado oficial de IUPAC. La recuperación automatizada de la entrada directa y su PDF devolvió HTTP 403; no se declara lectura de la página completa. Las extracciones diferencian resumen y secciones inspeccionadas de texto completo no leído. Una magnitud no extraída no significa que el artículo no la publique.

`src/data/documentation-checks.json` y `src/data/publication-reviews.json` permanecen vacíos. Registrar una fuente o mostrar un dato no concede aprobación editorial ni científica. El contenido clínico nuevo y la indexación continúan sujetos a la política de aprobación existente.

Para una comprobación humana futura: obtener la versión con `npm run publication:inspect -- /ruta/ --snapshot`; registrar en `documentation-checks.json` el `documentId`, la `revision` exacta, la etiqueta del `field`, un `reviewerId` interno, `checkedAt` y `scope` después de la revisión real. Ese registro comprueba un campo: no aprueba científicamente el documento ni activa su indexación. Un cambio de versión invalida la coincidencia.

## Verificación

Durante la regresión se corrigieron además interacciones anteriores a la hidratación: conservación del texto en el buscador, activación del filtro interactivo de diferencias y retorno de foco desde referencias. Una prueba específica demora los scripts y sigue una cita nativa antes de que se abra el diálogo. Si el origen exacto no se conserva al hidratar, el retorno usa una cita visible de esa misma referencia.

Las pruebas que necesitan interacción JavaScript esperan explícitamente la disponibilidad del control. El formulario del directorio sigue probado sin JavaScript; esperar hidratación en otras pruebas no sustituye esa comprobación.

Resultado final: lint y tipos sin errores; 135 pruebas unitarias en 29 archivos; compilaciones Next.js y Worker completas. La regresión de 11 archivos de Playwright sobre el Worker terminó con 141 pruebas aprobadas y 6 omitidas por su configuración (matrices visuales y de accesibilidad que ya se ejecutan desde escritorio con tamaños explícitos). Ningún fallo pendiente en esa batería. Incluye escritorio, tableta, móvil, controles de teclado, formularios sin JavaScript, claro/oscuro, citas, retornos, metadatos y rutas internas. No constituye una auditoría exhaustiva de accesibilidad manual o seguridad.

Capturas inspeccionadas: [directorio móvil oscuro](audit-evidence/critical-fixes/directory-mobile-dark.png), [directorio escritorio claro](audit-evidence/critical-fixes/directory-desktop-light.png), [producto y acciones](audit-evidence/critical-fixes/product-desktop.png), [perfil documental](audit-evidence/critical-fixes/transparency-desktop.png) y [selección de evidencia](audit-evidence/critical-fixes/research-selection.png).

Las sesiones con tres principiantes y tres lectores técnicos del [protocolo](KNOWLEDGE_PLATFORM_USER_TEST.md) siguen pendientes; las pruebas automatizadas no las sustituyen.

## Reversión y publicación

No se despliega producción en esta entrega. Para revertir una entrega publicada, restaurar el artefacto anterior y sus datos correspondientes, y volver a ejecutar compilación, política de publicación y pruebas de recorridos. No modificar masivamente este checkout para revertir: contiene también cambios anteriores de la plataforma. Las revisiones se vinculan a versiones exactas y no deben trasladarse automáticamente a contenido modificado.
