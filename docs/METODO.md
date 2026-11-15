# Método de sonificación de V2

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V2`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

El analizador de la aplicación reduce las imágenes a una cuadrícula de 28 × 16, con 448 celdas. Los niveles derivados van de −5 a +5. Son una interpretación del color y decisiones de sonificación; no son grados de temperatura ni una medición calibrada de cualquier imagen.

El producto contiene dos catálogos de cinco discos y seis mapas por disco: treinta EIC y treinta históricos GIBS. `data/discos.json` describe los treinta EIC, cuya selección almacenada va del 16 de mayo de 2024 al 3 de octubre de 2026. Los mapas históricos están en `prototipos/I11-eic/fotogramas-anteriores/`. No se consulta un mapa nuevo durante la reproducción. NASA POWER conserva series mensuales de 1981–2024; la muestra de Chiclayo utiliza 48 valores de 2015–2018. Las fechas pertenecen a observaciones o fuentes y se conservan como tales.

## Del mapa al sonido

1. Cargar una imagen almacenada o una entrada local aceptada.
2. Reducir el encuadre a 140 × 80 píxeles para el análisis y agruparlo en 28 × 16 celdas.
3. Aplicar la lectura de color correspondiente a la fuente o el modo de imagen propia.
4. Distinguir valores cálidos, fríos, extremos y regiones sin valor utilizable.
5. Recorrer las 28 columnas y sintetizar música con los perfiles del código.
6. Actualizar mapa, estado, leyenda y descripción de la reproducción.

EIC y GIBS tienen escalas distintas. La cuantización, el recorte, la compresión y la música añaden interpretación; sus niveles no vuelven físicamente comparables las dos visualizaciones. La anomalía de temperatura es una diferencia respecto a una referencia climática, no una temperatura absoluta.

NASA POWER utiliza PRECTOTCORR para la muestra de Chiclayo. Sus valores mensuales representan promedios de precipitación diaria en mm/día; no deben rotularse como acumulados mensuales. La normalización interna conserva los datos originales y solo construye un patrón musical.

La regla de impactos de Pacora es una decisión editorial fija para el episodio y mes documentados. No calcula tristeza, riesgo ni causalidad a partir de una imagen. La interfaz es educativa y no es un sistema de alerta.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
