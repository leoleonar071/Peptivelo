# Comparación con pestañas reales — 19 de octubre de 2026

Piloto NIOD/The Ordinary. `Overview` es la vista inicial sin fragmento de URL; `Ingredients & price` y `Evidence` sustituyen el contenido visible, no desplazan una página donde se muestra todo.

## Organización

- Cabecera de productos más compacta y persistente como contexto de la comparación.
- Resumen con tres conclusiones, precaución visible y acceso a la evidencia.
- Tabla y explicación de etiquetas solo en ingredientes/precio.
- Evaluación científica, preguntas, acceso a referencias y metodología solo en evidencia.
- Compra compartida entre resumen e ingredientes, sin duplicar identificadores o contenido en el DOM. Oculta en evidencia.
- Citas en un diálogo nativo que muestra una referencia a la vez, con notas desplegables, enlace externo, retorno a la cita y cierre por Escape. El listado completo está disponible desde Evidence.

## Navegación y accesibilidad

`ReaderTabs` implementa tablist/tab/tabpanel, selección única, foco itinerante y flechas/Home/End. El fragmento de URL identifica la sección; los enlaces antiguos a secciones y a citas siguen funcionando. Atrás/Adelante sincronizan la selección. Al cerrar una referencia se recupera el foco de su enlace; un enlace de retorno puede activar la pestaña propietaria y abrir los desplegables necesarios.

Todos los textos y referencias se renderizan en el servidor. Sin JavaScript se conserva una lectura lineal con navegación por anclas y bibliografía. Al hidratar se muestra únicamente el panel seleccionado. No se introduce carga remota de la evidencia ni se elimina información científica. El diálogo contiene una única copia del listado; la alternativa sin JavaScript se sustituye, evitando IDs duplicados.

Código principal: `src/components/reader-tabs.tsx`; contenido distribuido por el componente servidor `editorial-comparison.tsx`. Se retiró la navegación de desplazamiento anterior. No se cambian el estado de borrador/noindex, las fuentes, las conclusiones, los precios ni la afiliación.
