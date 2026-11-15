# Personajes de V3

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V3`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

`data/characters.v1.json` contiene las fichas de los cinco músicos, sus historias propuestas, referencias culturales y límites. El build incluye el catálogo en el HTML.

| Clave | Lugar documentado | Vínculo de impacto |
|---|---|---|
| `silbo` | Catacaos, Piura, Perú | `bajo-piura-2017-03` |
| `inti` | Paita, Piura, Perú | `paita-2016-03-registro` |
| `mama` | Santa Lucía, Atlántico, Colombia | `santa-lucia-2010-12-coe` |
| `yaku` | Pacora, Lambayeque, Perú | `pacora-2023-03-08` |
| `illapa` | Tumbes, Perú | `tumbes-2023-12-27` |

Las historias son ficción editorial, no testimonios de personas afectadas. Citar una fuente cultural no acredita permiso, representación de una comunidad ni aprobación del diseño. Los enlaces y las limitaciones concretas permanecen en el JSON.

El build copia `scripts/band-dance.js` a `runtime/`. Cada músico tiene cuatro dibujos en `prototipos/I11-eic/sprites/<músico>/baile/`. El componente carga esos dibujos al necesitarlos y coordina reproducción, visibilidad y movimiento reducido. Los WebP animados heredados siguen en la fuente, pero este build distribuye los fotogramas del módulo de baile.

Las ilustraciones fuente y sus archivos de prompts están en `assets/avatares/`. La revisión de copias modificó metadatos de las cinco `pose-epica.png`, preservando sus píxeles; no se generaron de nuevo los dibujos. Esta rama no incluye los estudios ni el runtime 3D de V1.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
