# Publicación de EarthBeat

> Edición documental de esta copia: **14/11/2026 19:03:12 (UTC-05:00)** · EarthBeat `V2`.
> Los resultados históricos describen el material recibido y no se presentan como pruebas realizadas hoy. Las fechas de observaciones y licencias conservan su significado original.

La fuente vigente de esta edición es la rama [V2](https://github.com/pierovelezzz/EarthBeat/tree/V2). Cada versión conserva su propio código y recursos.

## Preparar el sitio

Desde la raíz de esta rama, con Python instalado:

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Abrir [la copia local](http://127.0.0.1:8765/). La fuente principal es `prototipos/I11-eic/Main.dc.html`; `_site` es una salida generada.

## Identificar una entrega

`git rev-parse HEAD` identifica el commit de esta rama. Los identificadores y recibos de publicaciones anteriores se han retirado de esta edición documental. No deben atribuirse a esta copia los resultados de una URL o un paquete anterior. La publicación de las ramas en GitHub no acredita por sí sola un despliegue web.

Los metadatos de tipografías y paleta registran la verificación local de sus hashes. Los catálogos y prototipos registran la edición actual. Las fechas de las observaciones científicas y las licencias corresponden a sus fuentes.
