# Primera tanda para revisar y publicar

20 de octubre de 2026. Paquete de trabajo local; no constituye revisión científica ni publicación.

## Orden de trabajo

| Prioridad | Ruta | Revisión concreta antes de indexar |
| --- | --- | --- |
| 1 | `/` y `/skincare/choose/` | Probar el recorrido completo: pregunta → comparación → fuente → regreso. El selector sigue noindex y describe rutas de lectura, no recomendaciones personalizadas. |
| 2 | `/skincare/compare/niod-cais3-vs-the-ordinary/` | Revisión científica del alcance de cada estudio, riesgos, financiación e interpretación. Conservar precio ausente de NIOD 30 mL hasta verificar esa presentación. |
| 3 | `/skincare/compare/the-ordinary-multi-peptide-ha-vs-copper/` | Contrastar cada afirmación con su fuente. Comprobar que nombres y concentraciones no se conviertan en promesas de eficacia. |
| 4 | `/skincare/compare/skinceuticals-ptiox-vs-the-ordinary-ha/` | Resolver o conservar explícita la limitación de etiqueta regional; revisar métodos completos y efectos adversos antes de ampliar conclusiones. |
| 5 | `/haircare/products/the-ordinary-hair-density/` | Revisar el estudio de otra fórmula; no transferir sus resultados a este frasco ni afirmar equivalencia con minoxidil. |

Primero cerrar estas rutas; después ampliar productos. Las prioridades responden a cobertura editorial y utilidad del recorrido, no a volúmenes de búsqueda verificados.

## Resultado técnico local

- Inventario: 11 productos faciales, 1 capilar, 10 comparaciones y 34 fuentes registradas.
- `npm run audit:content`: verifica 384 referencias de los archivos JSON y la existencia local de las fotos. Sin referencias desconocidas ni imágenes ausentes al realizar esta revisión. Resultado reproducible en `research/content-audit.json`.
- La revisión estructural no comprueba que cada fuente apoye la afirmación, su disponibilidad remota o los permisos de imagen. Los artículos de biblioteca escritos en TypeScript quedan fuera de ese comando.
- `npm run audit:launch`: verifica ahora también las fuentes, foto, fecha del precio y estado borrador del piloto capilar. La marca usa el mismo valor predeterminado Peptivelo que la aplicación.

## Pendientes para poder lanzar

1. Confirmar dominio adquirido y origen HTTPS real. No se presupone que Peptivelo esté registrado ni autorizado como marca.
2. Configurar correo de contacto, nombre real del operador y proveedor de hosting. No compartir contraseñas en el chat.
3. Resolver permiso de las imágenes o sustituirlas por fotografías autorizadas.
4. Registrar revisión editorial y científica real por página; mantener las pendientes como borradores.
5. Desplegar con noindex, verificar el sitio público y el correo; después decidir la indexación del contenido revisado.
6. Conectar medición y programas comerciales aprobados. Los clics no equivalen a ventas ni comisiones.

No se activaron analítica externa, Search Console, afiliación, anuncios o indexación. El siguiente dato necesario para una configuración de producción es el dominio realmente adquirido.
