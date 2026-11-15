# Entrega portátil de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## Fuente comprometida

Para generar un ZIP de los archivos versionados del commit seleccionado, desde la raíz de esta rama:

```bash
git rev-parse HEAD
git archive --format=zip --output=../EarthBeat-V1-source.zip HEAD
```

La salida no incluye `.git`, archivos sin seguimiento ni el sitio `_site` generado. Extraer en una carpeta nueva y ejecutar el build permite obtener el sitio estático correspondiente.

## Sitio estático

`python scripts/build_pages.py _site` copia los archivos que requiere el sitio. Puede entregarse esa carpeta junto con la identificación del commit utilizado y sus créditos. El servidor HTTP y la interacción del usuario siguen siendo necesarios para probar audio, voz y archivos locales en el modo soportado.

## Empaquetador heredado

`scripts/package_portable.py` conserva un generador de paquete con manifiesto y verificador; consultar `--help` para sus argumentos. Su plantilla y el campo `branch` del manifiesto contienen referencias heredadas a `piero-mejoras`, y no deben interpretarse como una identificación automática de V1. No se presenta aquí una entrega producida con esa plantilla como si ya estuviera adaptada.

Los resultados humanos o mediciones de paquetes anteriores no se transfieren por comprimir una carpeta. No se incorpora a la entrega la tabla de auditoría externa solicitada durante la migración.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
