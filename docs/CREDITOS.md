# Créditos y fuentes de EarthRhythm

Proyecto independiente del equipo para [The Earth Information Jukebox · NASA Space Apps Challenge 2026](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/).

## Datos

- EIC: [NASA SVS 5176, Sea Surface Temperature Anomaly](https://svs.gsfc.nasa.gov/5176/). La selección distribuida tiene treinta imágenes fechadas según `data/discos.json`; su último archivo es del 3 de octubre de 2026. Crédito de la visualización: NASA Scientific Visualization Studio; Kel Elkins (USRA) y Atousa Saberi (NASA/GSFC), según los créditos conservados del producto.
- Datos de origen de la visualización: [JPL MUR SST](https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1).
- Los mapas históricos proceden de [NASA Worldview / GIBS](https://worldview.earthdata.nasa.gov/?l=GHRSST_L4_MUR25_Sea_Surface_Temperature_Anomalies&t=2023-03-15&v=-150,-30,-65,22), capa GHRSST MUR25 de anomalías de temperatura superficial. Consulta la [paleta oficial](https://gitc.earthdata.nasa.gov/colormaps/v1.0/output/GHRSST_Sea_Surface_Temperature_Anomalies.html) y su huella en `data/colormaps/`.
- La muestra de Chiclayo usa 48 promedios mensuales de precipitación diaria (PRECTOTCORR) de [NASA POWER](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/), de 2015 a 2018.
- Impactos y referencias culturales: las fuentes exactas permanecen en `data/impacts.v1.json` y `data/characters.v1.json`. Se conservan las referencias al Ministerio de Cultura, UNESCO, Artesanías de Colombia, MINCETUR, PROMPERÚ, COEN e INDECI en el contexto de cada registro.

Las imágenes reducidas no sustituyen los datos científicos originales. El recorte y la lectura de color forman parte de la interpretación educativa.

## Arte, voz y asistencia de IA

Las ilustraciones y conceptos de la banda proceden del material del equipo. Se conservan los archivos de prompts y la declaración de asistencia de IA; no se afirma autoría nueva por cambiar las fechas de edición o los metadatos de una copia. Las historias culturales y las propuestas artísticas necesitan revisión humana y, cuando corresponda, de sus portadores.

Brisa tiene retrato y grabaciones sintetizadas. Sus atribuciones detalladas a Piper, Sharvard y LJ Speech están en [los créditos de voz](../prototipos/I11-eic/brisa/CREDITS.md); se conserva ese archivo junto con los MP3.

Web Audio sintetiza la música. Brisa usa OpenRouter para preguntas abiertas y ElevenLabs para su voz en español, además de grabaciones incluidas. El [registro de uso de IA](USO_DE_IA.md) describe qué partes usan cada herramienta.

## Código y tipografías

Esta rama no incluye Three.js, GLTFLoader ni escenas 3D. No se atribuye al runtime una dependencia retirada.

El audio utiliza Web Audio nativo. Las familias Barlow, Inter, IBM Plex Mono y Atkinson Hyperlegible se distribuyen localmente con sus cuatro avisos SIL OFL 1.1 y sus ocho WOFF2; se conservan copyright y nombres reservados. Sus huellas y URL de procedencia están en `assets/fonts/sources.json`. Node, Python, Playwright y los validadores son herramientas de construcción o revisión, no servicios del producto.

El material de origen cita sonificaciones de NASA Chandra, NASA GIBS Worldview y el ejemplo de programación Web Audio de Chris Wilson como referencias. Una referencia de diseño no equivale a código incorporado. La atribución del código fuente y sus licencias no se sustituye por la fecha de esta edición documental.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
