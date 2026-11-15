# Créditos y fuentes de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## Datos

- EIC: [NASA SVS 5176, Sea Surface Temperature Anomaly](https://svs.gsfc.nasa.gov/5176/). La selección distribuida tiene treinta imágenes fechadas según `data/discos.json`; su último archivo es del 3 de octubre de 2026. Crédito de la visualización: NASA Scientific Visualization Studio; Kel Elkins (USRA) y Atousa Saberi (NASA/GSFC), según los créditos conservados del producto.
- Datos de origen de la visualización: [JPL MUR SST](https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1).
- Mapas históricos: NASA Worldview / GIBS, capa GHRSST de anomalías de temperatura superficial. El XML de su paleta y su huella están en `data/colormaps/`.
- Serie mensual de lluvia, temperatura y humedad: [NASA POWER](https://power.larc.nasa.gov/), parámetros PRECTOTCORR, T2M y RH2M.
- Impactos y referencias culturales: las fuentes exactas permanecen en `data/impacts.v1.json` y `data/characters.v1.json`. Se conservan las referencias al Ministerio de Cultura, UNESCO, Artesanías de Colombia, MINCETUR, PROMPERÚ, COEN e INDECI en el contexto de cada registro.

Las imágenes reducidas no sustituyen los datos científicos originales. El recorte y la lectura de color forman parte de la interpretación educativa.

## Arte, voz y asistencia de IA

Las ilustraciones y conceptos de la banda proceden del material del equipo. Se conservan los archivos de prompts y la declaración de asistencia de IA; no se afirma autoría nueva por cambiar las fechas de edición o los metadatos de una copia. Las historias culturales y las propuestas artísticas necesitan revisión humana y, cuando corresponda, de sus portadores.

La voz de Brisa depende de la síntesis instalada en el navegador; esta rama no distribuye las grabaciones MP3 de las otras versiones.

La introducción y las ilustraciones espaciales SVG/CSS tienen asistencia de IA y no son fotografías NASA. El audio procedural artístico no se presenta como una grabación del espacio.

## Código y tipografías

La fuente conserva Three.js/GLTFLoader y su aviso MIT en `scripts/vendor/` para los estudios 3D archivados. El build 2D no copia ni carga esos archivos.

El audio utiliza Web Audio nativo. Las familias Barlow, Inter, IBM Plex Mono y Atkinson Hyperlegible se distribuyen localmente con sus cuatro avisos SIL OFL 1.1 y sus ocho WOFF2; se conservan copyright y nombres reservados. Sus huellas y URL de procedencia están en `assets/fonts/sources.json`. Node, Python, Playwright y los validadores son herramientas de construcción o revisión, no servicios del producto.

El material de origen cita sonificaciones de NASA Chandra, NASA GIBS Worldview y el ejemplo de programación Web Audio de Chris Wilson como referencias. Una referencia de diseño no equivale a código incorporado. La atribución del código fuente y sus licencias no se sustituye por la fecha de esta edición documental.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
