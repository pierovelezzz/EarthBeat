# Publicación de EarthRhythm

- [Producción en Vercel](https://earthrhythm-nasa.vercel.app/). Es la versión de revisión del reto.
- [GitHub Pages](https://pierovelezzz.github.io/EarthRhythm/). La portada estática se genera desde `main` y el mismo despliegue publica estas vistas de referencia.

| Rama | Vista previa |
|---|---|
| `V1` | [V1](https://pierovelezzz.github.io/EarthRhythm/v1/) |
| `V2` | [V2](https://pierovelezzz.github.io/EarthRhythm/v2/) |
| `V3` | [V3](https://pierovelezzz.github.io/EarthRhythm/v3/) |
| `v4-NASA-Space-AC` | [V4](https://pierovelezzz.github.io/EarthRhythm/v4/) |
| `v4.5` | [V4.5](https://pierovelezzz.github.io/EarthRhythm/v4.5/) |
| `NASA-goal` | [NASA Goal](https://pierovelezzz.github.io/EarthRhythm/nasa-goal/) |
| `juego-pc-basico` | [Juego PC](https://pierovelezzz.github.io/EarthRhythm/juego-pc/) |
| `v4-IA` | [V4 IA](https://pierovelezzz.github.io/EarthRhythm/v4-ia/) |

Edita [la fuente de main](../prototipos/I11-eic/Main.dc.html) y reconstruye con `python scripts/build_pages.py _site`. GitHub Actions vuelve a publicar desde `main` tras un push o una ejecución manual de [pages.yml](../.github/workflows/pages.yml). Vercel sirve también `/api/brisa` para la integración descrita en [Brisa](BRISA.md).
