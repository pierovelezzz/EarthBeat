# Módulo heredado: fotogramas

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V3`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Este directorio pertenece al prototipo modular que arranca desde el `index.html` de la raíz; no es una dependencia importada por el build de I11.

cargarDiscos() hace fetch de data/discos.json y devuelve el manifiesto EIC si la respuesta es correcta. La aplicación I11 mantiene sus catálogos y selección en su propio componente.

| Archivo | Exports presentes |
|---|---|
| `index.js` | `cargarDiscos` |

Para modificar el producto que se construye y sirve en V3, revisar `prototipos/I11-eic/Main.dc.html` y `scripts/build_pages.py`. Los contratos de este material se conservan como explicación de archivos existentes, no como una promesa de módulos implementados para el sitio actual.

---

[Estado de esta rama](../../docs/ESTADO_ACTUAL.md) · [Verificación](../../docs/VERIFICACION.md) · [Inventario completo](../../archivos.md)
