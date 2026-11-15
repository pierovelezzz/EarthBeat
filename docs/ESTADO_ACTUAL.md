# Estado de V2

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V2`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## Implementación de esta rama

Cuatro apartados principales: Escuchar, La banda, ¿Cómo funciona? y Tecnología. ¿Cómo funciona? contiene Del mapa al sonido y Prueba práctica, en ese orden. Brisa tiene retrato y narraciones MP3 locales. Esta rama no incorpora la clase de introducción cinematográfica de V1/V3 ni el runtime de baile de V3.

El build distribuye `pose-banda.webp`, `pose-banda-animada.webp`, `escenario.webp` y `miniatura-banda.webp` de cada músico. Los cinco `pose-banda-animada.webp` contienen siete fotogramas; esta rama no tiene `scripts/band-dance.js` ni carpetas `baile/`.

Brisa tiene retrato en `prototipos/I11-eic/brisa/portrait.webp` y cincuenta MP3: veinticinco por idioma. La voz está activada en los valores iniciales del componente, empieza tras interacción y se puede apagar desde Accesibilidad. Los clips se reproducen con HTML Audio; el código también conserva la síntesis de voz del navegador y las alternativas escritas. Los créditos de las voces están en `prototipos/I11-eic/brisa/CREDITS.md`.

El analizador de la aplicación reduce las imágenes a una cuadrícula de 28 × 16, con 448 celdas. Los niveles derivados van de −5 a +5. Son una interpretación del color y decisiones de sonificación; no son grados de temperatura ni una medición calibrada de cualquier imagen.

## Archivos que gobiernan el producto

| Función | Fuente |
|---|---|
| Interfaz, estado, análisis y música | `prototipos/I11-eic/Main.dc.html` |
| Compilación del sitio estático | `scripts/build_pages.py` |
| Enlaces de plantilla | `scripts/pages-support.js` |
| Catálogos editoriales | `data/characters.v1.json`, `data/impacts.v1.json` |
| Manifiesto EIC y lluvia | `data/discos.json`, `data/nasa_power_monthly.json` |
| Tipografías y avisos | `assets/fonts/` |

El producto contiene dos catálogos de cinco discos y seis mapas por disco: treinta EIC y treinta históricos GIBS. `data/discos.json` describe los treinta EIC, cuya selección almacenada va del 16 de mayo de 2024 al 3 de octubre de 2026. Los mapas históricos están en `prototipos/I11-eic/fotogramas-anteriores/`. No se consulta un mapa nuevo durante la reproducción. NASA POWER conserva series mensuales de 1981–2024; la muestra de Chiclayo utiliza 48 valores de 2015–2018. Las fechas pertenecen a observaciones o fuentes y se conservan como tales.

## Diferencias de las tres versiones

| Aspecto | V1 | V2 | V3 |
|---|---|---|---|
| Navegación principal | Cinco apartados | Cuatro apartados | Cuatro apartados |
| Práctica de imágenes | Apartado Tu imagen | Segunda parte de ¿Cómo funciona? | Primera parte de ¿Cómo funciona? |
| Banda | Runtime avatar2d y PNG | Poses y WebP animados | Runtime band-dance y cuatro WebP por músico |
| Brisa | Texto y voz del navegador | Retrato y MP3 locales | Retrato y MP3 locales |
| Introducción cinematográfica | Incluida | No incluida | Incluida |
| Estudios Blender/GLB | Archivados en la fuente | No incluidos | No incluidos |
| Pruebas de lógica | 143 | 132 | 134 |

La tabla compara implementaciones separadas. Este árbol solo contiene la edición V2; no es una fusión de las otras dos.

## Fuera del runtime

El prototipo modular `src/`, las maquetas I09/I10 y los guiones de revisión siguen disponibles como fuente o referencia. No hay escenas Blender, GLB ni copia de Three.js en esta rama. Los documentos de diseño no acreditan funciones adicionales a las descritas aquí.

## Alcance comprobado

La generación estática, la integridad de fuentes y 132 pruebas de lógica se verifican con los comandos de VERIFICACION.md. El inventario de archivos es `archivos.md`. Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.
