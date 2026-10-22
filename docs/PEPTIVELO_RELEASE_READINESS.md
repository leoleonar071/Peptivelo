# Peptivelo — Release Readiness

Auditoría: 21 de octubre de 2026, America/Lima. Código base: 80fa15e. Sitio: https://peptivelo.com. Solo documentación, sin cambios ni despliegues de producción.

## Dictamen

Seguimiento local posterior: [primera implementación](PEPTIVELO_TRUST_IMPLEMENTATION.md). PV-013/014 tienen correcciones locales verificadas y PV-001 una actualización técnica parcial. La tabla siguiente conserva el estado del sitio público auditado; no acredita un despliegue de esos cambios ni cierra los requisitos del propietario.

Segunda entrega local: [comparación de tiendas](PEPTIVELO_STORE_COMPARISON.md). Añade un piloto con ofertas reales y reemplaza las doce fotografías prestadas por registros propios; el país del creador no se destaca en About. La búsqueda por relaciones, las revisiones científicas y la activación del correo continúan pendientes.

**El sitio está desplegado y las funciones esenciales operan en la muestra. Recomiendo mantenerlo como beta sin indexación mientras se completa la preparación editorial y pública.** Noindex no impide el acceso público. Esta evaluación no acredita revisión clínica, conformidad jurídica ni certificación de accesibilidad.

| Condición de publicación | Estado verificado | Acción / ticket | Criterio de salida |
| --- | --- | --- | --- |
| Operador y contacto | Páginas provisionales, sin canal real configurado | Propietario, PV-001 | Identidad aprobada y canal de correcciones comprobado. |
| Privacidad y términos | Hosting futuro declarado pese a Cloudflare activo; términos preliminares | Propietario y asesoría, PV-001 | Textos acordes con servicios, retención y jurisdicción reales. |
| Derechos de fotografías | Autorización pública no acreditada en el registro de procedencia | Propietario, PV-002 | Permiso, autoría o sustitución autorizada por activo. |
| Revisión editorial | 10 comparaciones y 2 guías draft; 9 ingredientes con flag pendiente y 12 sin flag | Editor/revisor, PV-003/009 | Aprobación por versión y publicación que no autorice por ausencia de bandera. |
| Dependencias | npm audit: 8 nodos de severidad alta y 0 críticos | Ingeniería, PV-004 | Evaluación de alcance, parche o mitigación compatible y excepción documentada si procede. |
| Funciones esenciales | Búsqueda, filtros, calculadora, identificación, QR propio, pestañas y citas operativos en muestra | Ingeniería | Suite y smoke de la versión publicados sin regresiones. |
| Relevancia de búsqueda | GHK-Cu devuelve 1; GHKCu, 0; copper peptides, 44 | Producto/editor/ingeniería, PV-006/007 | Corpus de consultas y negativos; expansión por identidad con razones. |
| Accesibilidad | Un hallazgo target-size repetido en cuatro estados; pruebas manuales pendientes | QA/ingeniería, PV-014 | Corregir enlace y validar teclado, lector de pantalla y reflow. |
| Estabilidad móvil | CLS de 0,206–0,231 en lector NIOD, laboratorio | Ingeniería, PV-012 | Tres cargas frías comparables con CLS ≤ 0,1 sin ocultar texto; campo por separado. |
| Logo | 802.223 bytes para una visualización de unos 44 px | Ingeniería, PV-013 | Miniatura efectiva con peso y fidelidad comprobados. |
| Rutas y canonical | 75 respuestas 200 y un 404 esperado; dominio correcto | Ingeniería | Mantener rutas, SSR y política de consultas. |
| Indexación | noindex global y sitemap vacío intencionales | Propietario/editor, PV-020 | Activar solo contenido aprobado después de los requisitos de confianza. |
| Datos comerciales | 10 precios fechados para 11 productos faciales, USD | Editor, PV-010/018 | Mercado, variante, fuente y vigencia explícitos; ausente no equivale a cero. |
| Analítica | Eventos locales sin receptor persistente | Producto, PV-019 | Taxonomía y tratamiento de datos aprobados; línea base real. |
| CI/CD | GitHub → Workers funciona; no hay gate de pruebas versionado | Ingeniería/cuenta, PV-005 | Una prueba fallida impide publicar; recuperación documentada y ensayada. |
| Configuración privada | Protección de rama, GSC y retención privada sin verificar | Propietario | Revisión mediante acceso autorizado, sin compartir contraseñas ni tokens. |

Los ocho nodos de npm audit no representan ocho vulnerabilidades remotas independientes ni un incidente probado. Revisar cadenas y contexto; no aplicar la degradación automática sugerida de vinext sin estudiar compatibilidad. [Resultado completo](audit-evidence/npm-audit-bounded.json).

## Checklist del propietario

- [ ] Aprobar identidad o entidad pública y jurisdicción; no inferirlas del usuario de GitHub.
- [ ] Confirmar un canal real y quién atiende correcciones.
- [ ] Definir finalidad, acceso y retención de logs; reflejar Cloudflare en privacidad.
- [ ] Revisar términos y políticas con asesoría según el alcance previsto.
- [ ] Acreditar derechos de cada fotografía o aprobar alternativas propias/autorizadas.
- [ ] Designar editor y revisor reales, con alcance, cualificación, conflictos y aprobaciones por versión.
- [ ] Confirmar relaciones comerciales y reglas de divulgación cuando cambien.
- [ ] Elegir mercado inicial, fuentes de precios y responsable de revalidación.
- [ ] Verificar permisos de CI, protección de rama, recuperación y Search Console.

## Checklist científico y editorial

- [ ] Distinguir etiqueta, proveedor, laboratorio, evidencia preclínica, estudios humanos y producto terminado según la fuente; no inventar eficacia comparativa.
- [ ] Vincular afirmaciones con fuentes y preparación estudiada. Registrar población, duración y conflictos cuando corresponda; distinguir no extraído de no aplicable.
- [ ] No inferir concentración por orden INCI, equivalencia US/UK ni eficacia por ausencia de datos.
- [ ] Gestionar draft, partial, unknown y reviewed explícitamente; una bandera ausente no autoriza indexación.
- [ ] Registrar fecha y versión de aprobación; exigir revalidación ante reformulación o cambio de afirmaciones.
- [ ] Separar artículos experimentales o medicinales de cosméticos, ofertas y protocolos terapéuticos.

## Checklist técnico

- [ ] Canonical del dominio real, respuesta 404 correcta y contenido SSR con H1 único.
- [ ] Consultas, pares y calculadora conservan su estado sin indexar variantes innecesarias.
- [ ] Precio, tamaño y moneda coinciden; la ausencia de precio no se convierte en cero.
- [ ] Search, Compare, Identify, QR propio y Calculator funcionan con los datos actuales.
- [ ] Teclado, Escape, retorno del foco, errores y validación manual de accesibilidad comprobados.
- [ ] Miniaturas y fuentes cumplen presupuestos verificados sin alterar la marca ni ocultar texto.
- [ ] Dependencias revisadas, secretos fuera de Git y cambios compatibles probados.
- [ ] CI exige calidad, identifica la versión y permite recuperar una versión conocida.
- [ ] Cabeceras y caché se validan con RSC, tema y cámara; una CSP nueva se prueba antes de bloquear.

## Activación SEO posterior

1. Aprobar contenido elegible, autoría y fechas reales; conservar el resto sin indexar.
2. Probar la configuración de indexación en ambos estados; no publicar todas las fichas porque una bandera esté ausente.
3. Incluir únicamente URLs aprobadas en sitemap. Permitir que el rastreador lea noindex en las demás.
4. Usar datos estructurados acordes con el rol editorial, sin ofertas, reseñas o puntuaciones inexistentes.
5. Verificar cobertura y errores en Search Console después. No se conocen hoy métricas de tráfico ni Core Web Vitals de campo.

## Orden recomendado

Comenzar por PV-001 con el propietario y completar PV-002, PV-003 y PV-004 antes de difusión amplia. Mientras se obtiene información externa, preparar las correcciones acotadas del logo y del enlace táctil, PV-013/014. Después, PV-006/007 aportan valor a la búsqueda. Las fases y dependencias completas están en el [plan maestro](PEPTIVELO_MASTER_AUDIT_AND_ROADMAP.md) y el [backlog](PEPTIVELO_IMPLEMENTATION_BACKLOG.md).

## Evidencia y límites

[Censo](audit-evidence/routes.md), [navegador](audit-evidence/browser-audit.json), [rendimiento](audit-evidence/performance-followup.json) y [pruebas unitarias](audit-evidence/unit-tests-current.txt). Complementos: [datos](PEPTIVELO_DATA_CONTENT_GAPS.md), [búsqueda](PEPTIVELO_SEARCH_ARCHITECTURE.md) y [UI/UX](PEPTIVELO_UI_UX_AUDIT.md).

No se hicieron cambios de producción, push, nuevas instalaciones ni aprobaciones editoriales en esta fase. Los requisitos de salida son propuestas verificables; su presencia en este documento no significa que ya estén cumplidos.
