# Estado de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## Implementación de esta rama

Cinco apartados principales: Escuchar, La banda, Tu imagen, ¿Cómo funciona? y Tecnología. Portada con muestra de mapas, introducción ilustrada y viajes del fondo que abren discos. La banda usa el runtime 2D con cuatro PNG por músico.

El build copia `scripts/avatar2d.js`, los veinte PNG de `assets/avatares/*/banda/keyframes/` y las poses de `prototipos/I11-eic/sprites/`. El movimiento conserva las ilustraciones 2D y responde a pausa, visibilidad y preferencias de movimiento.

Brisa utiliza guía escrita y síntesis de voz del navegador. La voz empieza desactivada y puede habilitarse en las preferencias. Esta rama no distribuye un directorio de narraciones MP3 ni el retrato de Brisa presente en V2/V3.

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

La tabla compara implementaciones separadas. Este árbol solo contiene la edición V1; no es una fusión de las otras dos.

## Fuera del runtime

El prototipo modular `src/`, las maquetas I09/I10 y los guiones de revisión siguen disponibles como fuente o referencia. Los tres archivos Blender, los cinco GLB y la copia de Three.js son estudios archivados y no se copian al build 2D. Los documentos de diseño no acreditan funciones adicionales a las descritas aquí.

## Alcance comprobado

La generación estática, la integridad de fuentes y 143 pruebas de lógica se verifican con los comandos de VERIFICACION.md. El inventario de archivos es `archivos.md`. Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.
