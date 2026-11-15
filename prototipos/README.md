# Prototipos de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

| Carpeta | Función actual |
|---|---|
| [I09-maqueta-movil](I09-maqueta-movil/) | Maqueta de escritorio y siete estados móviles conservados como referencia |
| [I10-iconos](I10-iconos/) | Maqueta de escritorio con iconos y su índice canvas |
| [I11-eic](I11-eic/) | Fuente efectiva, mapas y recursos que selecciona el build de esta rama |

La aplicación revisada se obtiene de `I11-eic/Main.dc.html` mediante `python scripts/build_pages.py _site`, desde la raíz del repositorio. Los archivos `.dc.html` contienen plantillas y no se consideran una entrega estática ya construida por abrirlos directamente con `file://`.

Los `canvas.json` conservan información de organización del prototipo. I09/I10 no son rutas adicionales del sitio I11. El material de origen atribuye los prototipos a Nishix03 con asistencia de Claude Design/Code; la revisión documental no sustituye esa atribución.

El build copia `scripts/avatar2d.js`, los veinte PNG de `assets/avatares/*/banda/keyframes/` y las poses de `prototipos/I11-eic/sprites/`. El movimiento conserva las ilustraciones 2D y responde a pausa, visibilidad y preferencias de movimiento.

---

[Estado de esta rama](../docs/ESTADO_ACTUAL.md) · [Verificación](../docs/VERIFICACION.md) · [Inventario completo](../archivos.md)
