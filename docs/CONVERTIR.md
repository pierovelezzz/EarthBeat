# Imágenes y lluvia en V2

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V2`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

La práctica se abre en ¿Cómo funciona? → Prueba práctica.

La interfaz permite PNG, JPG/JPEG, WebP y GIF. El límite de archivo es 8 MiB y el límite de imagen es 32 millones de píxeles. Una imagen animada se analiza como imagen fija; se conserva la proporción, con transparencia exterior, en el encuadre local de 560 × 320. PDF, SVG y archivos CSV/TSV/TXT no están admitidos por el selector actual. Permanecen funciones internas de series numéricas porque se utiliza la muestra de lluvia; eso no habilita una carga pública de CSV.

Los archivos se leen con las APIs del navegador; no se suben a un servicio. Las selecciones pendientes se identifican para que una carga anterior no sustituya a otra más reciente. Un error de formato, lectura o tamaño conserva el archivo previamente aceptado. Las URL locales se liberan al sustituirlas o cerrar el componente.

La muestra NASA POWER utiliza precipitación de Chiclayo y se representa en 28 columnas. El JSON conserva sus valores originales: la normalización para música no convierte los niveles de una imagen propia en temperatura ni añade una costa geográfica. La muestra es una serie almacenada, no un pronóstico.

El mismo reproductor permite escuchar el análisis. Los controles de paleta son lecturas del color; no recuperan una magnitud física calibrada de una fotografía. Las funciones internas de series numéricas permanecen para esa muestra, aunque el selector rechace archivos de texto.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
