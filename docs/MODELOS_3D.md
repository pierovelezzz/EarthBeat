# Estado del material 3D en V3

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V3`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Esta rama no contiene escenas `.blend`, modelos `.glb`, `scripts/avatar3d.js`, copia de Three.js ni generador de modelos. Su producto es 2D.

Este archivo se conserva para aclarar el alcance de la versión: los estudios 3D de V1 no se trasladan a V3. Los recursos efectivos son las imágenes de `prototipos/I11-eic/sprites/` y los archivos que copia `scripts/build_pages.py`.

El build copia `scripts/band-dance.js` a `runtime/`. Cada músico tiene cuatro dibujos en `prototipos/I11-eic/sprites/<músico>/baile/`. El componente carga esos dibujos al necesitarlos y coordina reproducción, visibilidad y movimiento reducido. Los WebP animados heredados siguen en la fuente, pero este build distribuye los fotogramas del módulo de baile.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
