# Experiencia de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Cinco apartados principales: Escuchar, La banda, Tu imagen, ¿Cómo funciona? y Tecnología. Portada con muestra de mapas, introducción ilustrada y viajes del fondo que abren discos. La banda usa el runtime 2D con cuatro PNG por músico.

La interfaz permite PNG, JPG/JPEG, WebP y GIF. El límite de archivo es 8 MiB y el límite de imagen es 32 millones de píxeles. Una imagen animada se analiza como imagen fija; se conserva la proporción, con transparencia exterior, en el encuadre local de 560 × 320. PDF, SVG y archivos CSV/TSV/TXT no están admitidos por el selector actual. Permanecen funciones internas de series numéricas porque se utiliza la muestra de lluvia; eso no habilita una carga pública de CSV.

El build copia `scripts/avatar2d.js`, los veinte PNG de `assets/avatares/*/banda/keyframes/` y las poses de `prototipos/I11-eic/sprites/`. El movimiento conserva las ilustraciones 2D y responde a pausa, visibilidad y preferencias de movimiento.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
