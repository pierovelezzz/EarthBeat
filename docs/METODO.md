# Método de sonificación

El analizador de la aplicación reduce las imágenes a una cuadrícula de 28 × 16, con 448 celdas. Los niveles derivados van de −5 a +5. Son una interpretación del color y decisiones de sonificación; no son grados de temperatura ni una medición calibrada de cualquier imagen.

El producto contiene dos catálogos de cinco discos y seis mapas por disco. `data/discos.json` describe los treinta EIC, cuya selección almacenada va del 16 de mayo de 2024 al 3 de octubre de 2026. Los treinta mapas históricos de GIBS están en `prototipos/I11-eic/fotogramas-anteriores/`. El reproductor utiliza estas imágenes almacenadas.

## Del mapa al sonido

1. Cargar una imagen almacenada o una entrada local aceptada.
2. Reducir el encuadre a 140 × 80 píxeles para el análisis y agruparlo en 28 × 16 celdas.
3. Aplicar la lectura de color correspondiente a la fuente o el modo de imagen propia.
4. Distinguir valores cálidos, fríos, extremos y regiones sin valor utilizable.
5. Recorrer las 28 columnas y sintetizar música con los perfiles del código.
6. Actualizar mapa, estado, leyenda y descripción de la reproducción.

EIC y GIBS tienen escalas distintas. La cuantización, el recorte, la compresión y la música añaden interpretación; sus niveles no vuelven físicamente comparables las dos visualizaciones. La anomalía de temperatura es una diferencia respecto a una referencia climática, no una temperatura absoluta.

La leyenda del mapa de colores muestra el valor aproximado de cada nivel en la escala de su fuente. EIC multiplica por 1,25 antes de sonificar, así que se divide el nivel entre 1,25 para rotular el recuadro. GIBS usa los intervalos de su paleta y multiplica por 5/3, así que su leyenda multiplica el nivel por 3/5. Por ejemplo, el nivel interno +5 corresponde al extremo +4 °C en EIC o al extremo superior de GIBS (≥ +3 °C). Cada recuadro representa un grupo de celdas parecido a ese valor. La cuadrícula se deriva de la imagen y no sustituye los datos de temperatura de la NASA.

- [Barra oficial EIC, NASA SVS 5176](https://svs.gsfc.nasa.gov/5176/).
- [Intervalos de la paleta oficial de GIBS](https://gitc.earthdata.nasa.gov/colormaps/v1.0/output/GHRSST_Sea_Surface_Temperature_Anomalies.html).

La regla de impactos de Pacora es una decisión editorial fija para el episodio y mes documentados. No calcula tristeza, riesgo ni causalidad a partir de una imagen. La interfaz es educativa y no es un sistema de alerta.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
