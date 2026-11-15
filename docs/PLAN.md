# Alcance y continuidad de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## 1. Producto implementado

Cinco apartados principales: Escuchar, La banda, Tu imagen, ¿Cómo funciona? y Tecnología. Portada con muestra de mapas, introducción ilustrada y viajes del fondo que abren discos. La banda usa el runtime 2D con cuatro PNG por músico.

## 2. Fuente y construcción

La interfaz efectiva está en `prototipos/I11-eic/Main.dc.html`. El build estático selecciona los recursos de esta rama mediante `scripts/build_pages.py`. Los catálogos y las tipografías son locales.

## 3. Análisis y música

El analizador de la aplicación reduce las imágenes a una cuadrícula de 28 × 16, con 448 celdas. Los niveles derivados van de −5 a +5. Son una interpretación del color y decisiones de sonificación; no son grados de temperatura ni una medición calibrada de cualquier imagen.

Web Audio sintetiza la música localmente. Melodía utiliza perfiles, escalas, acordes y ritmo del código; Datos también transforma los niveles derivados en sonido y no representa una señal científica sin interpretación. La reproducción requiere una acción del usuario. Pausa, reanudación, selección de fecha, mezcla, volumen, silencio y repetición pertenecen al mismo reproductor.

## 4. Entrada local

La interfaz permite PNG, JPG/JPEG, WebP y GIF. El límite de archivo es 8 MiB y el límite de imagen es 32 millones de píxeles. Una imagen animada se analiza como imagen fija; se conserva la proporción, con transparencia exterior, en el encuadre local de 560 × 320. PDF, SVG y archivos CSV/TSV/TXT no están admitidos por el selector actual. Permanecen funciones internas de series numéricas porque se utiliza la muestra de lluvia; eso no habilita una carga pública de CSV.

## 5. Arte y guía

El build copia `scripts/avatar2d.js`, los veinte PNG de `assets/avatares/*/banda/keyframes/` y las poses de `prototipos/I11-eic/sprites/`. El movimiento conserva las ilustraciones 2D y responde a pausa, visibilidad y preferencias de movimiento.

Brisa utiliza guía escrita y síntesis de voz del navegador. La voz empieza desactivada y puede habilitarse en las preferencias. Esta rama no distribuye un directorio de narraciones MP3 ni el retrato de Brisa presente en V2/V3.

## 6. Verificación

Usar los comandos y límites de VERIFICACION.md. No extrapolar mediciones de otra rama, paquete o navegador.

## 7. Trabajo que requiere validación humana

Escucha, lector de pantalla, teléfono y vibración físicos, comprensión con participantes y revisión cultural permanecen fuera del alcance de las pruebas automatizadas de esta revisión. No se fija aquí un plazo ni se acredita tiempo humano a partir de la duración de procesos.

## 8. Organización del prototipo modular heredado

El material M1–M6 sigue en `src/` para fotogramas, análisis, sonido, arte, accesibilidad y coordinación. Sus contratos describen el `index.html` de la raíz. No constituyen la arquitectura ejecutada por el build de I11. Las funciones y los eventos existentes se detallan en CONTRATOS.md.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
