# Estabilización final y operación de Peptivelo

## Alcance y versión

La candidata de privacidad se conserva sobre `10f8fde`. Este ciclo añade verificación operativa y documentación. Los datos editoriales, las aprobaciones, GHK-Cu y las imágenes siguen en la versión candidata revisada. El [informe de privacidad](PRIVACIDAD-EDITORIAL.md) documenta los cambios de implementación. El despliegue, el envío a `main` y los cambios en Cloudflare quedan pendientes de autorización.

## Investigación de los siete tiempos de espera

Los siete escenarios agotaron la espera de 5 segundos de una aserción después de pulsar un enlace. El navegador seguía en la página de origen o todavía no presentaba el destino. Afectó enlaces de catálogo, un recorrido producto–ingrediente, búsqueda, directorio, dos recorridos de temas y el menú compacto. Los siete pasaron en la repetición aislada del mismo build, con la misma espera de aserción. Las dos pruebas de tema que agotaron el límite total en la pasada anterior también pasaron aisladas.

La pasada de siete fallos tardó 798 segundos frente a 402 segundos en la anterior. La mediana de escritorio subió de 2,7 a 5,4 segundos y la de tableta de 1,4 a 5,3. Las evidencias históricas permiten localizar la espera en el tramo de navegación y mostrar que depende de la carga observada. No contienen trazas de red que permitan atribuir esos clics concretos a un proceso del sistema o a una respuesta RSC individual. Esta fase mantiene los límites por defecto y las aserciones. Usa concurrencia explícita, ejecución secuencial, informes separados y traza de cualquier fallo. Los siete recorridos también se repiten con traza completa.

El primer intento controlado se interrumpió tras conservar tres trazas con fallos nuevos. `page.evaluate` esperó 176,9 s en el identificador, 147,9 s en la portada y 24,3 s en la exploración antes de agotarse el tiempo de cada escenario. Las tres líneas esperaban `animation.finished` sobre todas las animaciones del documento. En la portada, la espera de fuentes y la decodificación del logo ya habían terminado. Las cuatro matrices que usaban esa espera ahora renderizan con la preferencia de movimiento reducido que admite el sitio y verifican el atributo del tema aplicado. Conservan sus aserciones de navegación, diseño, teclado y accesibilidad y mantienen sus límites originales. El cambio es exclusivo de E2E.

Los siete recorridos originales pasaron con traza completa tanto a un proceso como a cuatro. El percentil 95 de las respuestas RSC 200 subió de 35 a 133 ms entre esas repeticiones, y el máximo de 194 a 450 ms. Ninguna traza de esa repetición mostró 5xx RSC. Hay un efecto de concurrencia medido, pero la repetición no reprodujo la espera original de cinco segundos ni demuestra que esa espera histórica fuera del servidor. El bloqueo de animación sí quedó localizado por las trazas.

## Resultados de la candidata

| Ejecución                                               | Aprobadas | Omitidas | Fallos y tiempos de espera |
| ------------------------------------------------------- | --------: | -------: | -------------------------: |
| Unitarias, 32 archivos                                  |       143 |        0 |                          0 |
| Next.js completa 1, dos procesos, cero reintentos       |       358 |       11 |                          0 |
| Next.js completa 2, dos procesos, cero reintentos       |       358 |       11 |                          0 |
| Siete recorridos históricos, un proceso, con traza      |         7 |        0 |                          0 |
| Siete recorridos históricos, cuatro procesos, con traza |         7 |        0 |                          0 |
| Repetición con traza del identificador y portada        |         2 |        0 |                          0 |
| Worker, comparador, estructura y privacidad             |        26 |        4 |                          0 |

Las dos pasadas completas fueron consecutivas sobre el mismo build y usaron los límites existentes. Duraron 10 min 44 s y 5 min 57 s. Se conservan los informes JSON, las tres trazas del intento interrumpido y las trazas de las dos repeticiones de navegación y de la repetición visual. Diez omisiones corresponden a matrices de tamaños ejecutadas una vez desde escritorio y una a un atajo exclusivo de escritorio en la configuración móvil.

```powershell
npx playwright test --workers=2 --retries=0 --trace=retain-on-failure
```

| Evidencia de privacidad                              | Next.js | Vinext / Worker |
| ---------------------------------------------------- | ------: | --------------: |
| Archivos de texto inspeccionados dentro del build    |     107 |              81 |
| JavaScript entre esos archivos                       |      23 |              47 |
| Solicitudes HTTP anónimas verificadas                |     144 |             194 |
| Sondeos directos a posibles mapas, todos 404         |      29 |              52 |
| Rutas históricas con HTML 404 y RSC de no encontrado |      18 |              18 |
| Rutas retiradas del inventario con 404               |       9 |               9 |
| Huellas encontradas de las 371 comprobadas           |       0 |               0 |

Ambos builds conservaron el canonical público de GHK-Cu y los enlaces a The Ordinary Copper y COSRX mini. El comparador devolvió HTML y RSC correctos con `no-store`. Las pruebas de navegador verificaron la búsqueda por GHK-Cu, selección de productos, intercambio A/B y recuperación del par compartido. Las dos rutas de preview comprobadas devolvieron 404 con `no-store` y `noindex`, incluso al pedir RSC. Los dos manifiestos del Worker devolvieron 404 al consultarse directamente. Ningún build publicó mapas ni anunció un `sourceMappingURL` en sus JavaScript o CSS públicos.

Los informes y las trazas quedan en [evidencias locales](../../test-results/stabilization-final/). El [verificador HTTP](../../scripts/verify-editorial-http.mjs) conserva estados, cabeceras e identificadores de huella, sin guardar cuerpos editoriales.

## Producción observada mediante HTTP de solo lectura

El 12 de noviembre de 2026, el dominio público devolvió 404 en las 18 rutas históricas. El sitemap devolvió 200 y excluyó las 18. Aun así, la revisión de 95 respuestas que siguió referencias estáticas de seis páginas halló material editorial en el comparador, tres JavaScript y dos recursos capilares. Los valores de la tabla son huellas detectadas, no recuentos de documentos.

| Recurso en el sitio desplegado                          |         HTTP | Estado de CDN observado                    |              Huellas |
| ------------------------------------------------------- | -----------: | ------------------------------------------ | -------------------: |
| Comparador The Ordinary Copper y COSRX mini, HTML y RSC | 200 en ambos | Sin `CF-Cache-Status`, `private, no-store` | 66 en cada respuesta |
| `publication-registry-DSPR9csT.js`                      |          200 | MISS                                       |                  241 |
| `catalog-DUCFSSPC.js`                                   |          200 | HIT                                        |                  155 |
| `haircare-C970AdS8.js`                                  |          200 | HIT                                        |                    9 |
| `ordinary-hair-density.svg`                             |          200 | HIT                                        |                    1 |
| `/images/products/SOURCES.md`                           |          200 | MISS                                       |                    1 |

Los tres JavaScript se entregaron con `max-age=31536000, immutable`. Se consultaron 40 posibles mapas públicos y devolvieron 404. El comparador y los recursos con MISS demuestran que purgar la caché sin reemplazar la versión que los genera no resuelve la exposición. La muestra cubre las rutas y dependencias registradas. Las reglas efectivas de Cloudflare, la lista completa de aliases y las versiones activas requieren comprobación en la cuenta. [Cabeceras de Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/headers/) · [Interacción de Workers con caché](https://developers.cloudflare.com/workers/reference/how-the-cache-works/)

La consulta autenticada de solo lectura confirmó que el 100 % del tráfico de `peptivelo` está en la versión 14 (`2d127a39-2e6a-4c85-a380-06904201711a`), ligada al SHA `10f8fde` de `main`. Workers Builds confirma los comandos de integración documentados. El registro de esa versión lista cero URLs de versión. La API de Cache Rules devolvió 403 por permisos y la de Cache Reserve indicó que el ajuste no está disponible en el plan actual. Queda confirmar las reglas desde el panel y comprobar el dominio `workers.dev` configurado para el Worker.

## Procedimiento de despliegue, solo tras autorización

1. **Identificar la versión y el destino de reversión.** En Workers & Pages, registrar el ID activo de `peptivelo`, el SHA de origen, la distribución de tráfico, los dominios, la dirección `workers.dev`, los aliases de versión y las reglas de caché y claves efectivas. Registrar también si existen Cache Reserve o una caché propia del Worker. En el repositorio no se encontró un uso explícito de `caches.default` para estas páginas. La configuración versionada deja `previewUrls: false` y `workersDev: true`. Confirmar los valores activos. Preservar el artefacto exacto que se va a desplegar y su inventario de recursos. Antes del cambio, identificar un ID de reversión previamente auditado. Si ninguno cumple privacidad, preparar y validar una respuesta de mantenimiento segura como salida de emergencia. La versión actual observada queda excluida como destino de reversión. [Versiones y despliegues](https://developers.cloudflare.com/workers/versions-and-deployments/) · [URLs de versión](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/)
2. **Verificar el artefacto de Workers Builds.** Usar la integración documentada `main → npm run build:vinext → npx cf deploy --prebuilt` cuando se autorice. Revisar que el build realmente incluya el auditor posterior y corresponda al SHA probado. Mantener deshabilitada la preview pública y conservar la configuración de indexación. Si se verifica primero en un entorno accesible por red, protegerlo con control de acceso y usar el mismo artefacto seguro. Conservar la configuración de despliegue de la cuenta. [Integración del repositorio](../CLOUDFLARE_DEPLOYMENT.md)
3. **Cambiar el 100 % de tráfico de los orígenes públicos a la candidata segura.** Un reparto que mantenga tráfico en la versión que filtra contenido conservaría la exposición. Confirmar la versión efectiva antes de purgar. Mantener el bypass de caché para preview, HTML dinámico y RSC si alguna regla de la cuenta sobreescribe su `no-store`. Conservar la caché de los recursos públicos versionados que pertenecen al build seguro.
4. **Purgar los recursos afectados.** Usar _Caching → Configuration → Purge Cache → Custom Purge_, o `POST /zones/{zone_id}/purge_cache` con `files`. Incluir los [recursos retirados](retired-editorial-assets.json), `/images/products/SOURCES.md`, el comparador y cualquier otro HTML/RSC o manifest de la versión antigua que la cuenta haya cacheado. Para claves personalizadas, incluir las variantes de query y los encabezados usados en la clave. Si no se puede enumerar con fiabilidad, usar una purga por prefijo/host si está disponible y cubre esas claves, o una purga de zona durante la ventana aprobada. Guardar fecha, alcance y el resultado `success: true`. Si una URL antigua aún da 200, retirar su origen o bloquear la ruta exacta en los orígenes públicos que todavía la sirvan, volver a purgar y comprobar otra vez. La purga de una zona no sustituye la comprobación del alias `workers.dev`. [Purga por URL](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/) · [Claves personalizadas](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-cache-key/) · [API de purga](https://developers.cloudflare.com/api/resources/cache/methods/purge/)
5. **Comprobar por HTTP desde dos redes independientes.** Usar GET anónimo sobre la URL exacta primero, sin añadir un cache-buster ni seguir redirecciones. Registrar estado, `CF-Ray`, `CF-Cache-Status`, `Age`, `ETag`, `Vary` y huellas. Repetir con las variantes reales observadas y con `If-None-Match` si se conserva un ETag antiguo. Un recurso retirado debe dar 403/404/410, sin cuerpo privado ni 304 que valide el contenido anterior. Comprobar que `/images/products/SOURCES.md` da 200 con el texto nuevo, que el comparador responde 200 en HTML y RSC con cero huellas, que GHK-Cu tiene su canonical y dos enlaces y que el sitemap excluye las 18 rutas. Revisar recursos referenciados y posibles mapas, incluidos los del artefacto realmente publicado. Repetir una vez tras una ventana de observación y registrar cualquier cambio de versión o de respuesta. Una CDN no puede retirar bytes ya guardados por terceros.
6. **Completar el recorrido de navegador.** En una sesión anónima nueva, abrir Copper Tripeptide-1, seguir ambos enlaces de producto y abrir el comparador. Buscar `GHK-Cu` en el selector, elegir The Ordinary Copper y COSRX mini, intercambiar A y B y recargar el enlace del par. Confirmar que se conservan ambos productos y que la página y las solicitudes de recursos terminan sin errores.

Comando de verificación anónima. Ejecutar desde la fuente y la salida del artefacto exacto desplegado, y repetir por cada hostname público. El script devuelve estado distinto de cero ante una coincidencia editorial o un contrato HTTP incumplido. Solo hace GET.

```powershell
node scripts/verify-editorial-http.mjs worker https://peptivelo.com test-results/postdeploy.json docs/editorial-validation/retired-editorial-assets.json
```

Repetir la solicitud con el ETag anterior cuando esté disponible. El archivo local `test-results/stabilization-final/production-stale-validators.json` contiene los validadores observados sin guardar cuerpos privados. El siguiente control comprueba que un navegador no reciba 304 para un archivo retirado.

```powershell
$before = Get-Content test-results/stabilization-final/production-stale-validators.json -Raw | ConvertFrom-Json
$retired = Get-Content docs/editorial-validation/retired-editorial-assets.json -Raw | ConvertFrom-Json
foreach ($asset in $before.results) {
  $isRetired = $asset.path -in $retired
  $isReplaced = $asset.path -eq '/images/products/SOURCES.md'
  if (($isRetired -or $isReplaced) -and $asset.headers.etag) {
    $response = Invoke-WebRequest -Uri ($before.origin + $asset.path) `
      -Headers @{ 'If-None-Match' = $asset.headers.etag } `
      -MaximumRedirection 0 -SkipHttpErrorCheck
    if (($isRetired -and $response.StatusCode -notin 403,404,410) -or
        ($isReplaced -and $response.StatusCode -ne 200)) {
      throw "Respuesta inesperada para $($asset.path): $($response.StatusCode)"
    }
  }
}
```

## Reversión

Las cinco versiones recientes se vincularon a sus commits. La activa (`10f8fde`) mostró la exposición por HTTP. La anterior (`6f21ad4`) mostró las 18 rutas accesibles y huellas privadas en el build histórico. Las otras tres (`9d1f0c5`, `bb68911`, `79d62dd`) contienen la tarjeta capilar en su raíz pública y lectores de biblioteca que renderizan el manuscrito sin el control de publicación. Ninguna de las cinco cumple el criterio de reversión.

Revertir si se confirma cualquier huella privada, un recurso retirado accesible, un 200 en una ruta histórica, exposición de la preview, ruptura de GHK-Cu/comparador o aumento sostenido de errores 5xx. En Workers & Pages, elegir el ID seguro auditado en Deployments, comprobar que conserva sus bindings y revertir el 100 % del tráfico. Si falta un ID seguro, utilizar la salida de mantenimiento preparada en el paso 1. Esa salida debe responder 503 con un texto fijo y `Cache-Control: no-store`, sin montar assets ni entregar tráfico al Worker que expone contenido. Probar antes que las rutas retiradas y los chunks devuelven solo la respuesta de mantenimiento. Mantener los bloqueos de recursos retirados, purgar las variantes del intento y volver a ejecutar la comprobación HTTP desde las dos redes. Registrar la versión, el resultado y el incidente. [Reversión de versiones en Workers](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)

## Recomendación

**NO APTO para ejecutar el cambio en producción en el estado operativo actual.** La candidata cumple los criterios locales de estabilidad, privacidad, rutas y conservación de GHK-Cu. Para autorizar la operación con una reversión verificable queda confirmar las reglas y orígenes públicos de caché y disponer de un destino de reversión seguro o de la salida de mantenimiento validada. Tras el cambio se comprobarán las respuestas y los ETag antiguos desde dos redes. La versión actualmente publicada sigue expuesta en los recursos documentados.
