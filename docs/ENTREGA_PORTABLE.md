# Entrega portátil de EarthRhythm

## Código y archivos registrados

Desde la raíz de `main`:

```bash
git rev-parse HEAD
git archive --format=zip --output=../EarthRhythm-main-source.zip HEAD
```

El ZIP contiene los archivos versionados del commit. Extrae el código en una carpeta nueva y sigue el [README](../README.md) para construir el sitio.

## Sitio y paquete

`python scripts/build_pages.py _site` genera la aplicación estática. Publica ese directorio con un servidor HTTP. La revisión completa con el chat asistido y la síntesis en español se realiza en [Vercel](https://earthrhythm-nasa.vercel.app/).

`python scripts/package_portable.py --help` muestra cómo empaquetar una revisión con el commit y un manifiesto de integridad. El archivo generado se verifica con su `verify_package.py`.
