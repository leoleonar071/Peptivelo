# Peptivelo — Primera implementación tras la auditoría

Esta entrega aplica las correcciones acotadas PV-013 y PV-014 y parte técnica de PV-001. Los documentos de auditoría conservan el diagnóstico del sitio desplegado en el commit 80fa15e; este informe describe cambios locales posteriores, aún sin publicar.

Actualización posterior: [comparación de tiendas](PEPTIVELO_STORE_COMPARISON.md) sustituye las fotografías prestadas por registros propios y retira la jurisdicción de la presentación About. Las referencias a fotografías pendientes y jurisdicción en los apartados siguientes describen esta primera entrega histórica, no el estado de esa segunda implementación local.

## Cambios completados

- **PV-013, logo:** el original aprobado de 802.223 bytes permanece intacto. El header y footer usan una variante WebP lossless de 132 px y 7.166 bytes, servida directamente sin pasar por el optimizador de imágenes del Worker. Mantiene el tamaño visual de 44 px y dispone de resolución para pantallas densas. El favicon usa un PNG transparente de 64 × 64 y 3.535 bytes. Las pruebas verifican respuestas reales, formato y presupuesto de bytes; no se midió un ahorro de LCP en producción.
- **PV-014, accesibilidad:** el enlace aislado See our methodology de /skincare/ tiene una superficie de 44 px de altura, subrayado y foco visible. Axe no informa fallos de target-size en el hub local en ambos temas y los tres viewports probados. No equivale a certificación global de accesibilidad.
- **PV-001, información operativa:** Privacy identifica Cloudflare Workers, separa eventos locales de logs del hosting y documenta preferencia de tema, URLs compartidas y escaneo local de imágenes/cámara. About distingue mercado del catálogo de jurisdicción del operador. La configuración admite datos reales del propietario, sin completar valores desconocidos.
- **Protección de beta:** se conserva noindex. No se añadieron cuentas, formularios sin receptor, servicios de analítica o afirmaciones de revisión científica.

Las miniaturas pueden reproducirse con `node scripts/optimize-brand-assets.mjs`, usando sharp disponible en la instalación actual. Se conserva el original de marca; no se regeneró el diseño ni se modificaron las fotografías de producto.

## Datos necesarios para completar PV-001

| Variable | Valor que debe confirmar el propietario |
| --- | --- |
| SITE_OPERATOR_NAME | Nombre público real de la persona o entidad responsable. |
| CONTACT_EMAIL | Correo atendido para consultas, privacidad y correcciones; probar envío y recepción. |
| SITE_OPERATING_JURISDICTION | País/jurisdicción donde opera el responsable; no inferirlo del catálogo US. |
| HOSTING_PROVIDER | Cloudflare Workers actualmente; actualizar si cambia la plataforma. |
| HOSTING_LOG_RETENTION | Descripción de retención realmente comprobada en la cuenta y servicios usados. No inventar plazos. |

`.env.example` documenta estos campos. Configurarlos mediante el entorno de build/ejecución del despliegue utilizado y reconstruir: la presencia en un archivo de ejemplo no configura Cloudflare. Verificar el HTML público de About, Privacy y Contact después de desplegar. No guardar credenciales privadas en Git.

Aunque se aporten esos valores, aún debe revisarse que las políticas reflejen la operación real. El chequeo automatizado `audit:launch` no sustituye esa revisión ni una prueba del canal de correo. PV-002 sigue requiriendo permiso/autoría de fotografías y PV-003 un responsable editorial y decisiones de revisión documentadas. No se han acreditado esas aprobaciones en esta entrega.

## Verificación ejecutada

- `npm run test`: 21 archivos, **58 pruebas aprobadas**.
- `npm run typecheck`: correcto.
- `npm run lint`: sin errores; se retiró después una variable sin uso del script de auditoría y el lint focalizado terminó sin avisos.
- `npm run build:vinext`: correcto; se conservan advertencias del framework sobre sourcemaps/clasificación de rutas, sin fallo de compilación.
- Playwright sobre el Worker compilado: **21 pruebas aprobadas**. Incluye tres tamaños, ambos temas para el objetivo táctil, presupuesto de logo/favicon, privacidad y noindex; además, regresiones de navegación, canonical, tipografía y axe en cinco recorridos.
- `git diff --check`: correcto.

Comando de navegador:

```powershell
npx playwright test e2e/trust-foundation.spec.ts e2e/brand-foundation.spec.ts e2e/seo-navigation.spec.ts --config playwright.vinext.config.ts --workers=2
```

[Logs de build y navegador, y capturas](audit-evidence/trust-implementation/) conservan evidencia local. No se ha hecho push ni despliegue en esta fase; el sitio público no recibe estas mejoras hasta publicar los cambios.

## Continuación

Completar los datos y permisos pendientes con el propietario. Después, abordar PV-006/007 para búsqueda por identidad y relaciones, con corpus de relevancia. El CLS móvil del lector y el resto de tickets de la auditoría siguen pendientes; esta entrega no los marca como resueltos.
