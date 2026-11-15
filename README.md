# EarthRhythm · Pacific Ocean Sonification

Esta es la rama **NASA-goal** de EarthRhythm, creada a partir de V4 para el reto The Earth Information Jukebox. La aplicación convierte patrones de imágenes del Pacífico y una muestra local de lluvia en música con cinco personajes. Funciona en español e inglés, con HTML, CSS, JavaScript, Canvas y Web Audio; no necesita backend ni servicios de IA durante el uso.

## Qué incluye esta versión

La portada permite **escuchar el mapa que se muestra** o **leerlo sin audio**. Presenta una imagen fija al entrar y permite cambiarla manualmente o activar la rotación. La introducción y las preferencias se abren a petición del visitante. Se respeta la configuración de movimiento reducido del dispositivo hasta que la persona elige otra opción.

La banda permite escuchar los instrumentos por separado o combinarlos. El reproductor ofrece dos modos de sonido, selección de fecha, volumen, velocidad, una leyenda interactiva en grados aproximados según la fuente y lectura por zonas con una tabla de celdas cálidas, cercanas a lo habitual y frías. Los modos de imágenes propias y lluvia siguen disponibles en **Cómo funciona**.

Brisa tiene retrato en `prototipos/I11-eic/brisa/portrait.webp` y cincuenta MP3: veinticinco por idioma. La voz se activa desde Accesibilidad. Los clips se reproducen con HTML Audio; el código también conserva la síntesis de voz del navegador y las alternativas escritas. Los créditos de las voces están en `prototipos/I11-eic/brisa/CREDITS.md`.

El analizador de la aplicación reduce las imágenes a una cuadrícula de 28 × 16, con 448 celdas. Los niveles derivados van de −5 a +5. Son una interpretación del color y decisiones de sonificación; no son grados de temperatura ni una medición calibrada de cualquier imagen.

## Ejecutar esta rama

Desde la raíz del repositorio, con Python 3.10 o posterior:

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

Abrir [la aplicación local](http://127.0.0.1:8765/). Detener el servidor con Ctrl+C. La revisión utiliza Python 3.12.14 y Node 26.13.0. Node se necesita para las pruebas, no para servir el sitio.

La elección de movimiento reducido se controla desde Accesibilidad y se guarda para las próximas visitas.

## Fuente de la aplicación

Editar **`prototipos/I11-eic/Main.dc.html`** y reconstruir. `scripts/build_pages.py` genera `_site/index.html` y copia los recursos de esta rama. `scripts/pages-support.js` resuelve las plantillas y sus enlaces de estado. El `index.html` de la raíz y `src/` forman un prototipo modular heredado: no son la entrada del build publicado.

## Comprobar

```bash
node scripts/test_guides.cjs _site/index.html
python scripts/run_browser_checks.py --list
```

La comprobación del reto y de la lectura sin audio está en el runner como reto05. Para preparar la presentación, usa el [guion y las fuentes de NASA-goal](docs/pitch/NASA_GOAL.md).

## Documentación

- [Estado de esta versión](docs/ESTADO_ACTUAL.md) y [todos los archivos](archivos.md).
- [Reproductor](docs/REPRODUCTOR.md), [imágenes y lluvia](docs/CONVERTIR.md), [Brisa](docs/BRISA.md) y [método](docs/METODO.md).
- [Datos y créditos](docs/CREDITOS.md), [personajes](docs/PERSONAJES.md), [impactos](docs/IMPACTOS.md) y [uso de IA](docs/USO_DE_IA.md).
- [Publicación](docs/PUBLICACION.md), [entrega de código](docs/ENTREGA_PORTABLE.md) y [material 3D](docs/MODELOS_3D.md).

Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.

---

[Estado de esta rama](docs/ESTADO_ACTUAL.md) · [Verificación](docs/VERIFICACION.md) · [Inventario completo](archivos.md)
