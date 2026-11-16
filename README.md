# EarthRhythm · Hear the Pacific

[Español](README.es.md) · **English**

EarthRhythm is a bilingual sonification app built for **The Earth Information Jukebox**, a **NASA Space Apps Challenge 2026** challenge. It turns NASA maps of the southeastern Pacific into music in real time, so you can explore how the ocean changes by looking and listening. The team's submission is on the `main` branch.

[Try EarthRhythm](https://earthrhythm-nasa.vercel.app/) · [View the challenge](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) · [Sources and credits in Spanish](docs/CREDITOS.md)

## What you can do

- **Listen.** Browse ten discs with sixty maps across two collections. Compare months, read the estimated values in the legend, change playback speed, and switch between Melody and Data. Web Audio generates music as the scan moves across the columns of a 28 × 16 grid.
- **Meet the band.** Silbo plays the quena, Inti the marimba, Mamacocha the harp, Yaku the musical dropper, and Illapa the timpani. Each musician has a fictional story and an instrument you can hear.
- **Try another image.** In How does it work?, explore the method, listen to the EarthRhythm logo, or choose your own image. Your browser processes your image locally.
- **Play on a computer.** Press the arrow keys when notes reach their targets. The map moves with the music and changes dates as you play.
- **Explore with Brisa.** Start with the welcome and tutorial. Select the star to open the chat, launch a visual guide, or take a tour of the five musicians. Use the speaker button to control narration.
- **Make the interface yours.** Change the language, contrast, text size, font, theme, voice, effects, or motion settings. Brisa’s guidance is also available in writing.

## NASA data

| Source | How EarthRhythm uses it |
|---|---|
| [NASA Earth Information Center / SVS 5176](https://svs.gsfc.nasa.gov/5176/) | 30 maps from May 16, 2024 to October 3, 2026. The frames are based on [NASA JPL’s MUR analysis](https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1). |
| [NASA Worldview / GIBS](https://worldview.earthdata.nasa.gov/?l=GHRSST_L4_MUR25_Sea_Surface_Temperature_Anomalies&t=2023-03-15&v=-150,-30,-65,22) | 30 historical maps from five episodes between 2010 and 2023. EarthRhythm interprets them using the [official color palette](https://gitc.earthdata.nasa.gov/colormaps/v1.0/output/GHRSST_Sea_Surface_Temperature_Anomalies.html). |

The grid estimates how far water temperature differs from usual by reading each source’s colors. The [sonification method in Spanish](docs/METODO.md) explains how the music is made and where to find the original scientific data.

## Run and verify

With Python 3.10 or later, run the following commands from the repository root.

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Open [the local app](http://127.0.0.1:8765/). Run the logic checks with Node.js.

```bash
node scripts/test_guides.cjs _site/index.html
```

[Main.dc.html](prototipos/I11-eic/Main.dc.html) is the website source. The build produces the static site for GitHub Pages and Vercel. The main deployment uses OpenRouter for open-ended questions and ElevenLabs for Spanish narration. Maps, music, and personal images are processed in the browser.

Additional documentation in Spanish is available below.

- [Current project status](docs/ESTADO_ACTUAL.md) · [Deployment and previews](docs/PUBLICACION.md) · [Verification](docs/VERIFICACION.md)
- [Brisa](docs/BRISA.md) · [Use of AI](docs/USO_DE_IA.md) · [File inventory](archivos.md)
