# EarthRhythm · Pacific Ocean Sonification

Esta es la rama **v4-NASA-Space-AC** de EarthRhythm. La aplicación convierte patrones de imágenes del Pacífico y una muestra local de lluvia en música con cinco personajes. Funciona en español e inglés, con HTML, CSS, JavaScript, Canvas y Web Audio; no necesita backend ni servicios de IA durante el uso.

## Qué incluye esta versión

La bienvenida se inicia automáticamente al abrir o recargar la portada. La secuencia de entrada, las estrellas fugaces, las naves y los vuelos a los discos se basan en el commit `991cc70` de `piero-mejoras`. El Sol, la Luna, Saturno y Aqua abren discos de mapas del Pacífico. La portada cambia de mapa cada tres segundos y permite escuchar el que está a la vista. El selector EN/ES admite teclado, guarda el idioma e indica la selección.

La banda usa los cuatro fotogramas originales de cada personaje y permite pausar el baile o escuchar el instrumento por separado. El reproductor recupera el mapa, la banda y los controles de V3. La leyenda interactiva muestra diferencias aproximadas de temperatura según la fuente del mapa. Con movimiento reducido, la bienvenida usa un fundido breve y los accesos desde los astros abren el disco directamente.

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

EarthRhythm respeta la preferencia de movimiento reducido del sistema mientras no exista una elección manual. La elección desde Accesibilidad se guarda para las próximas visitas. El enlace [abrir con animaciones completas](http://127.0.0.1:8765/?movimiento=completo) permite elegir explícitamente el modo completo.

## Accesibilidad añadida en la copia de v4

La rama `accesibilidad/v4-flujo-inclusivo` conserva la distribución original y amplía los controles existentes:

- La vibración opcional aparece solo en teléfonos identificados por el navegador. Incluye prueba, parada y explicación de disponibilidad. Puede combinarse con audio silenciado y movimiento visual reducido; resume intensidad musical, no sustituye la lectura de datos.
- El desplegable «Consultar datos sin usar el mapa» permite elegir cualquiera de las 28 columnas y leer sus 16 filas con teclado o lector de pantalla. Distingue niveles derivados, ausencia de datos y fondo del gráfico de lluvia.

[Resultados y límites de la comprobación](docs/ACCESIBILIDAD_VERIFICACION.md). La identificación de teléfonos es aproximada y la vibración física depende del navegador y del dispositivo.

## Fuente de la aplicación

Editar **`prototipos/I11-eic/Main.dc.html`** y reconstruir. `scripts/build_pages.py` genera `_site/index.html` y copia los recursos de esta rama. `scripts/pages-support.js` resuelve las plantillas y sus enlaces de estado. El `index.html` de la raíz y `src/` forman un prototipo modular heredado: no son la entrada del build publicado.

## Comprobar

```bash
node scripts/test_guides.cjs _site/index.html
python scripts/run_browser_checks.py --list
```

La suite de lógica contiene 146 pruebas en esta rama. El recorrido del RETO 05 se puede ejecutar con el runner usando la opción --only reto05. Los resultados y el alcance de la comprobación de navegador están en [VERIFICACION.md](docs/VERIFICACION.md). La lista del runner enumera guiones disponibles; no prueba que todos los selectores heredados sigan correspondiendo a esta interfaz.

El [tutorial práctico y la ayuda contextual](docs/TUTORIAL.md) tienen funciones distintas: el tutorial practica tres acciones y guarda el avance al cerrarlo o saltarlo; la ayuda de cada pantalla se consulta en una sola tarjeta. Brisa retoma un tutorial pendiente, incluso tras recargar, sin iniciar música automáticamente.

## Documentación

- [Estado de esta versión](docs/ESTADO_ACTUAL.md) y [todos los archivos](archivos.md).
- [Reproductor](docs/REPRODUCTOR.md), [imágenes y lluvia](docs/CONVERTIR.md), [Brisa](docs/BRISA.md) y [método](docs/METODO.md).
- [Datos y créditos](docs/CREDITOS.md), [personajes](docs/PERSONAJES.md), [impactos](docs/IMPACTOS.md) y [uso de IA](docs/USO_DE_IA.md).
- [Publicación](docs/PUBLICACION.md), [entrega de código](docs/ENTREGA_PORTABLE.md) y [material 3D](docs/MODELOS_3D.md).

Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.

---

[Estado de esta rama](docs/ESTADO_ACTUAL.md) · [Verificación](docs/VERIFICACION.md) · [Inventario completo](archivos.md)
