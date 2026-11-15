# Publicación de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

El código de esta versión está en [EarthRhythm, rama V1](https://github.com/pierovelezzz/EarthRhythm/tree/V1). La publicación de una rama Git no demuestra por sí sola que exista una web desplegada.

## Preparar y revisar el sitio

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Editar la fuente I11 y reconstruir; no tratar `_site` como fuente canónica. Identificar el commit seleccionado con `git rev-parse HEAD`.

## Workflow incluido

`.github/workflows/pages.yml` se ejecuta automáticamente en pushes a `main` y también define `workflow_dispatch`. Un push a V1 no activa por sí mismo la condición de push de ese workflow. El despliegue requiere la configuración y permisos de GitHub Pages del repositorio, o alojar los archivos estáticos generados en otro servicio.

No se acredita aquí una URL pública de la aplicación ni un despliegue nuevo. Las copias de código y los paquetes deben referirse a la rama y al commit realmente seleccionados.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
