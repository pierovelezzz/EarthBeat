# Entradas y contratos de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## Aplicación que genera el build

`prototipos/I11-eic/Main.dc.html` contiene el componente, el estado, los analizadores y el sintetizador. `scripts/pages-support.js` monta las plantillas y los eventos. `scripts/build_pages.py` inserta los catálogos en los marcadores del HTML y copia las dependencias locales.

Los JSON de impactos y personajes exigen `version: 1`; el catálogo de personajes debe contener las claves silbo, inti, mama, yaku e illapa. El build comprueba esos requisitos antes de generar el sitio.

## Prototipo modular de la raíz

Los siguientes exports pertenecen al código heredado de `src/`, que arranca desde el `index.html` de la raíz. No se importan como módulos de la aplicación I11.

| Archivo | Exports presentes |
|---|---|
| `src/accesibilidad/index.js` | `montarAccesibilidad`, `describirFotograma`, `decir` |
| `src/analizador/index.js` | `esTierra`, `nivel`, `analizar`, `columna` |
| `src/app/bus.js` | `bus` |
| `src/app/main.js` | Entrada con efectos de inicialización; sin exports |
| `src/arte/index.js` | `montarJukebox`, `montarBanda` |
| `src/fotogramas/index.js` | `cargarDiscos` |
| `src/sonido/index.js` | `iniciarAudio` |

El bus ofrece suscripción y emisión. El cargador devuelve el manifiesto EIC; el analizador calcula celdas y estadísticas; los componentes heredados montan botones, mapa y accesibilidad. `src/sonido/index.js` crea un AudioContext y emite niveles/eventos; no implementa el sintetizador musical completo del prototipo I11.

Las reglas internas de esos módulos no deben presentarse como un contrato público de todos los componentes de la aplicación actual.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
