# Tipografías locales

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Se distribuyen ocho WOFF2 de cuatro familias: Atkinson Hyperlegible, Barlow, IBM Plex Mono e Inter. Las reglas de peso de Inter comparten un archivo, según `fonts.css`. Los archivos `*-OFL.txt` conservan sus avisos de copyright y licencia SIL OFL 1.1.

`sources.json` enumera archivo, URL, tamaño y SHA-256. `verifiedAt` registra la verificación de la copia incluida; no representa una descarga nueva ni sustituye las fechas internas originales de la tipografía.

`python scripts/verify_fonts.py`, desde la raíz del repositorio, comprueba los doce archivos del manifiesto: ocho binarios y cuatro avisos. La opción `--download` recupera los archivos de las URL registradas y comprueba las huellas; esta revisión documental no la ejecuta.

La aplicación sirve las fuentes desde su propio origen. `font-display: swap` y las alternativas del sistema permiten mostrar texto durante la carga o si falla una fuente. Los avisos originales deben acompañar a las copias distribuidas.

---

[Estado de esta rama](https://github.com/pierovelezzz/EarthRhythm/blob/V1/docs/ESTADO_ACTUAL.md) · [Verificación](https://github.com/pierovelezzz/EarthRhythm/blob/V1/docs/VERIFICACION.md) · [Inventario completo](https://github.com/pierovelezzz/EarthRhythm/blob/V1/archivos.md)
