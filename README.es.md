# EarthRhythm · El Pacífico hecho música

**Español** · [English](README.md)

EarthRhythm es una aplicación bilingüe de sonificación creada para **The Earth Information Jukebox**, reto del **NASA Space Apps Challenge 2026**. Convierte mapas de la NASA del Pacífico sudeste en música en tiempo real para explorar cómo cambia el océano. La rama `main` contiene la versión de entrega del equipo.

[Probar EarthRhythm](https://earthrhythm-nasa.vercel.app/) · [Consultar el reto](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) · [Consultar fuentes y créditos](docs/CREDITOS.md)

## Qué puedes hacer

- **Escuchar.** Diez discos y sesenta mapas en dos colecciones. Compara meses, lee la leyenda aproximada, cambia de velocidad y alterna entre Melodía y Datos. La cuadrícula de 28 × 16 se recorre por columnas y Web Audio genera la música mientras avanza el mapa.
- **Conocer a la banda.** Silbo toca la quena, Inti la marimba, Mamacocha el arpa, Yaku el gotero musical e Illapa el timbal. Cada personaje tiene una historia ficticia y un instrumento que puedes escuchar.
- **Probar con otra imagen.** En ¿Cómo funciona? puedes explorar el método, escuchar el logo o elegir tu propia imagen. La imagen se procesa en tu navegador.
- **Jugar en computadora.** Usa las flechas cuando lleguen al objetivo. El mapa avanza con la música y cambia de fecha durante la partida.
- **Explorar con Brisa.** La bienvenida y el tutorial presentan la experiencia. La estrella abre el chat, la guía visual y el recorrido de los cinco músicos. La bocina controla la lectura.
- **Ajustar la interfaz.** Cambia el idioma, el contraste, el tamaño, la fuente, el tema, la voz, los efectos o el movimiento. Las sugerencias de Brisa también aparecen como texto.

## Datos de la NASA

| Fuente | Uso |
|---|---|
| [NASA Earth Information Center / SVS 5176](https://svs.gsfc.nasa.gov/5176/) | 30 mapas del 16 de mayo de 2024 al 3 de octubre de 2026. Los fotogramas se basan en el análisis [NASA JPL MUR](https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1). |
| [NASA Worldview / GIBS](https://worldview.earthdata.nasa.gov/?l=GHRSST_L4_MUR25_Sea_Surface_Temperature_Anomalies&t=2023-03-15&v=-150,-30,-65,22) | 30 mapas históricos de cinco episodios entre 2010 y 2023. Se interpretan con su [paleta oficial](https://gitc.earthdata.nasa.gov/colormaps/v1.0/output/GHRSST_Sea_Surface_Temperature_Anomalies.html). |

Los °C de la cuadrícula estiman diferencias respecto a la temperatura habitual a partir de los colores de cada fuente. Consulta el [método](docs/METODO.md) para ver cómo se construye la música y dónde encontrar los datos científicos originales.

## Ejecutar y verificar

Con Python 3.10 o posterior:

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Abre [la aplicación local](http://127.0.0.1:8765/). Para ejecutar las pruebas de lógica usa Node.js:

```bash
node scripts/test_guides.cjs _site/index.html
```

[Main.dc.html](prototipos/I11-eic/Main.dc.html) es la fuente del sitio. El generador ensambla el sitio estático para GitHub Pages y Vercel. La publicación principal habilita las preguntas abiertas mediante OpenRouter y la síntesis en español mediante ElevenLabs. Los mapas, la música y las imágenes propias se procesan en el navegador.

- [Estado de main](docs/ESTADO_ACTUAL.md) · [Publicación y vistas previas](docs/PUBLICACION.md) · [Verificación](docs/VERIFICACION.md)
- [Brisa](docs/BRISA.md) · [Uso de IA](docs/USO_DE_IA.md) · [Inventario](archivos.md)
