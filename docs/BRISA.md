# Brisa y preferencias en V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Brisa utiliza guía escrita y síntesis de voz del navegador. La voz empieza desactivada y puede habilitarse en las preferencias. Esta rama no distribuye un directorio de narraciones MP3 ni el retrato de Brisa presente en V2/V3.

El idioma sigue una elección guardada válida o la configuración inicial del navegador. Cambiar pantalla, idioma o paso cancela la locución anterior. La guía y el tutorial conservan alternativas escritas y no requieren oír para progresar.

Las preferencias de voz, texto grande, contraste, movimiento reducido, fuente legible, vibración y efectos se guardan en `ts_prefs`; el idioma se guarda en `ts_lang`. No requieren una cuenta. Las preferencias pueden reabrirse desde Accesibilidad.

El tutorial de la aplicación guía la elección de un disco, su reproducción y la interpretación de la leyenda. Se puede cerrar o saltar. Las regresiones de estado y foco están en `scripts/test_guides.cjs`; una simulación de voz no equivale a escucha humana.

La animación combina la preferencia de movimiento con las opciones de la introducción y la banda 2D.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
