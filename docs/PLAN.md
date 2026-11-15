# Alcance y continuidad de V2

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V2`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## 1. Producto implementado

Cuatro apartados principales: Escuchar, La banda, ¿Cómo funciona? y Tecnología. ¿Cómo funciona? contiene Del mapa al sonido y Prueba práctica, en ese orden. Brisa tiene retrato y narraciones MP3 locales. Esta rama no incorpora la clase de introducción cinematográfica de V1/V3 ni el runtime de baile de V3.

## 2. Fuente y construcción

La interfaz efectiva está en `prototipos/I11-eic/Main.dc.html`. El build estático selecciona los recursos de esta rama mediante `scripts/build_pages.py`. Los catálogos y las tipografías son locales.

## 3. Análisis y música

El analizador de la aplicación reduce las imágenes a una cuadrícula de 28 × 16, con 448 celdas. Los niveles derivados van de −5 a +5. Son una interpretación del color y decisiones de sonificación; no son grados de temperatura ni una medición calibrada de cualquier imagen.

Web Audio sintetiza la música localmente. Melodía utiliza perfiles, escalas, acordes y ritmo del código; Datos también transforma los niveles derivados en sonido y no representa una señal científica sin interpretación. La reproducción requiere una acción del usuario. Pausa, reanudación, selección de fecha, mezcla, volumen, silencio y repetición pertenecen al mismo reproductor.

## 4. Entrada local

La interfaz permite PNG, JPG/JPEG, WebP y GIF. El límite de archivo es 8 MiB y el límite de imagen es 32 millones de píxeles. Una imagen animada se analiza como imagen fija; se conserva la proporción, con transparencia exterior, en el encuadre local de 560 × 320. PDF, SVG y archivos CSV/TSV/TXT no están admitidos por el selector actual. Permanecen funciones internas de series numéricas porque se utiliza la muestra de lluvia; eso no habilita una carga pública de CSV.

## 5. Arte y guía

El build distribuye `pose-banda.webp`, `pose-banda-animada.webp`, `escenario.webp` y `miniatura-banda.webp` de cada músico. Los cinco `pose-banda-animada.webp` contienen siete fotogramas; esta rama no tiene `scripts/band-dance.js` ni carpetas `baile/`.

Brisa tiene retrato en `prototipos/I11-eic/brisa/portrait.webp` y cincuenta MP3: veinticinco por idioma. La voz está activada en los valores iniciales del componente, empieza tras interacción y se puede apagar desde Accesibilidad. Los clips se reproducen con HTML Audio; el código también conserva la síntesis de voz del navegador y las alternativas escritas. Los créditos de las voces están en `prototipos/I11-eic/brisa/CREDITS.md`.

## 6. Verificación

Usar los comandos y límites de VERIFICACION.md. No extrapolar mediciones de otra rama, paquete o navegador.

## 7. Trabajo que requiere validación humana

Escucha, lector de pantalla, teléfono y vibración físicos, comprensión con participantes y revisión cultural permanecen fuera del alcance de las pruebas automatizadas de esta revisión. No se fija aquí un plazo ni se acredita tiempo humano a partir de la duración de procesos.

## 8. Organización del prototipo modular heredado

El material M1–M6 sigue en `src/` para fotogramas, análisis, sonido, arte, accesibilidad y coordinación. Sus contratos describen el `index.html` de la raíz. No constituyen la arquitectura ejecutada por el build de I11. Las funciones y los eventos existentes se detallan en CONTRATOS.md.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
