# Publicación de main

El código de esta versión está en [EarthRhythm, rama main](https://github.com/pierovelezzz/EarthRhythm/tree/main). La publicación de una rama Git no demuestra por sí sola que exista una web desplegada.

## Preparar y revisar el sitio

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Editar la fuente I11 y reconstruir; no tratar `_site` como fuente canónica. Identificar el commit seleccionado con `git rev-parse HEAD`.

## Workflow incluido

`.github/workflows/pages.yml` se ejecuta en pushes a `main` y con `workflow_dispatch`. GitHub Pages debe estar configurado para desplegar el sitio generado.

No se acredita aquí una URL pública de la aplicación ni un despliegue nuevo. Las copias de código y los paquetes deben referirse a la rama y al commit realmente seleccionados.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
