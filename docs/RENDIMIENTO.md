# Construcción y rendimiento de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Esta rama se evalúa a partir de su propio build; no se atribuyen tiempos de otra versión a este código. El peso estático de la generación comprobada se registra después de reconstruir.

Los archivos locales de fuentes, imágenes y voz forman parte de la descarga. El runtime 2D no distribuye las escenas ni los GLB archivados.

No se ha medido en esta revisión una serie de visitas frías con red o CPU ralentizadas; no se conservan como resultados actuales cifras de una comparación anterior. Los guiones de benchmark, audio y memoria permiten efectuar mediciones separadas si se configura su navegador y perfil. El tiempo de un proceso no se presenta como trabajo humano ni como tiempo de comprensión de un usuario.

## Peso de la generación comprobada

| Magnitud | Valor |
|---|---:|
| Archivos del sitio generado | 112 |
| Bytes totales sin compresión HTTP | 16714623 |
| WOFF2 | 8 |
| MP3 | 0 |
| PNG | 55 |
| WebP | 35 |

Son tamaños locales de la carpeta generada desde esta rama; no representan transferencia comprimida, caché, carga inicial ni tiempos medidos de red.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
