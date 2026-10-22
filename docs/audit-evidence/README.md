# Evidencias de la auditoría de Peptivelo

Código base: `80fa15e`. Sitio: https://peptivelo.com. Trabajo iniciado el 21 de octubre de 2026, America/Lima; algunos registros UTC corresponden al 22 de octubre. Los archivos conservan sus timestamps y condiciones de captura. No hubo cambios de aplicación ni despliegue en esta fase.

## Índice

| Archivo | Uso y límites |
| --- | --- |
| data-inventory.json | Conteo y relaciones de los datos locales; no acredita revisión científica. |
| technical-inventory.json | Versiones del lockfile, activos y presencia de integraciones en código. |
| route-audit.json / routes.md | Censo HTTP/SSR de 76 solicitudes: 70 páginas HTML sin query, tres variantes, robots, sitemap y un 404 esperado. |
| browser-audit.json | 23 rutas representativas × dos viewports × dos temas: 92 estados; axe, capturas, errores y recorridos. No es una revisión manual de todas las combinaciones de datos. |
| screenshots/ | Capturas históricas locales, excluidas de Git porque muestran fotografías cuyo permiso no está acreditado; el orden está en browser-audit.json. Las capturas nuevas de tarjetas propias están en store-comparison/. |
| focused-browser-checks.json | Recursos de red y repetición del filtro: NIOD devuelve un producto. Corrige un sondeo inicial por etiqueta exacta que agotó su espera; no indica un filtro roto. |
| network-samples.json | Muestras de cabeceras y bytes de recursos; no sustituyen una política de caché verificada completa. |
| performance-followup.json | Tres contextos nuevos por ruta móvil para Home y lector NIOD. Sin limitación de CPU/red; resultados de laboratorio, no percentiles de campo. |
| font-isolation.json | Diagnóstico con fuentes woff2 bloqueadas solo en la prueba para evaluar el cambio de geometría; no propone bloquear fuentes en producción. |
| npm-audit-bounded.json | Respuesta completa de npm audit: ocho nodos de severidad alta, cero críticos. Evaluar cadenas y alcance, no contar nodos como incidentes independientes. |
| npm-audit-production.json | Intento anterior incompleto por timeout de red; no se usa como resultado de seguridad. |
| unit-tests-current.txt | Ejecución actual: 21 archivos, 56 pruebas unitarias aprobadas. unit-tests.txt conserva otra ejecución, no suma pruebas adicionales. |
| ticket-summary.json | Copia de los 22 tickets usados para el backlog; los seis documentos finales son la entrega editorial. |

## Reproducción

Desde la raíz del proyecto, con las dependencias existentes instaladas:

```powershell
node docs/audit-evidence/collect.mjs
node docs/audit-evidence/browser-audit.mjs
node docs/audit-evidence/performance-followup.mjs
npm run test
npm audit --omit=dev --fetch-retries=0 --fetch-timeout=20000 --json
```

Los scripts de captura escriben nuevamente sus archivos; guardar el snapshot si se necesita comparación histórica. Visitan el sitio público y no publican cambios. Las revisiones focalizadas y el aislamiento de fuentes documentan pruebas diagnósticas adicionales, no un nuevo servicio de monitoreo. No se instalaron paquetes para esta auditoría.

## Qué no demuestra esta evidencia

No se ejecutó Lighthouse ni se obtuvieron CrUX, INP de campo, Search Console o métricas de conversión. Axe no certifica accesibilidad completa. No se ensayó una cámara física, un lector de pantalla real ni una investigación moderada con usuarios. No se verificaron permisos privados de cuentas, derechos de uso fotográfico, cualificaciones de revisores ni aprobaciones de contenido. Tampoco se realizó un dictamen médico o jurídico.

Las recomendaciones y criterios futuros están separados de los resultados ya observados en el [documento maestro](../PEPTIVELO_MASTER_AUDIT_AND_ROADMAP.md).
