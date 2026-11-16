# Ampliación de accesibilidad de EarthRhythm

Propuesta para revisión del usuario · 15 de noviembre de 2026.

## Alcance y restricciones

Añadir vías equivalentes para explorar y comprender los mapas conservando la distribución, colores, tipografía, personajes, navegación y controles existentes. Las nuevas opciones se integran en Accesibilidad y en un desplegable junto a la explicación actual del reproductor. No se pide un diagnóstico ni se crean recorridos separados por discapacidad.

La fuente del producto es `prototipos/I11-eic/Main.dc.html`. El `index.html` de la raíz y `src/accesibilidad/` pertenecen al prototipo heredado.

## Revisión comprobada

- Existen enlace para saltar al contenido, botones semánticos, foco visible, selección de discos y fechas mediante botones, controles de volumen y posición con teclado, y anuncios de reproducción. Su existencia no acredita una evaluación con tecnologías de asistencia.
- Existen preferencias de contraste, texto grande, fuente legible, voz y movimiento reducido; Brisa tiene explicaciones escritas.
- `HapticFeedback.supported()` comprueba la API, pero no limita su disponibilidad a celulares. El menú incluye el interruptor y la sección de prueba también en escritorio.
- `playbackPulse()` impide pulsos con volumen cero o silencio general. `HapticFeedback.play()` los bloquea cuando se reduce el movimiento visual. Esto impide combinar preferencias necesarias para personas con varias necesidades de acceso.
- El arranque establece `reducedMotion = false`; `bandReduced()` devuelve ese estado. No adopta automáticamente la preferencia del sistema para una primera visita.
- La cuadrícula visual está oculta a lectores de pantalla. Hay explicaciones y leyenda, pero falta una consulta estructurada de sus valores derivados.
- Se ejecutó `node scripts/test_guides.cjs`: 135 pruebas aprobadas, cero fallos.

No se consiguió abrir la página publicada con las herramientas disponibles. El navegador integrado está indisponible, no hay Playwright instalado y el comando Python resuelve al acceso de Microsoft Store. Esta revisión es del código de la rama local, no una auditoría visual de la publicación.

## Enfoque propuesto

Ampliar los controles y explicaciones existentes en HTML, CSS y JavaScript. Un rediseño o una pantalla de selección de discapacidad contradicen las restricciones del usuario; esta ampliación es el enfoque que las conserva.

1. **Vibración solo en celulares.** Mostrar el interruptor, las instrucciones y Probar/Detener únicamente cuando se identifique un teléfono móvil. No usar solo el ancho de ventana para identificarlo. Si el navegador del teléfono no expone la API, explicar la limitación y mantener las alternativas escritas. La identificación web de dispositivos es aproximada; no garantiza detectar todo teléfono o excluir todo equipo híbrido.
2. **Canal táctil independiente.** Mantener activación voluntaria, persistencia, pulsos limitados y parada inmediata al pausar, navegar, ocultar la página o desactivar la opción. Permitir pulsos con el volumen general a cero y con movimiento visual reducido. Conservar la selección individual de instrumentos y explicar que los pulsos resumen intensidad musical, no reproducen toda la información científica.
3. **Preferencias del sistema.** Adoptar movimiento reducido antes de la introducción cuando no exista una elección explícita guardada. Respetar después la elección manual y permitir combinarla con vibración.
4. **Lectura sin mapa ni audio.** Agregar un desplegable de datos en la zona explicativa actual, con selección de columna y tabla de filas/valores derivada del mismo análisis que alimenta la música. Etiquetar celdas ausentes como sin datos, conservar fuente y fecha y distinguir niveles normalizados de unidades físicas. Evitar anunciar cada nota o insertar cientos de controles en el recorrido habitual de teclado.
5. **Ayuda de uso y semántica.** Añadir instrucciones breves de teclado y de los canales visual, escrito y táctil en los espacios existentes. Comprobar etiquetas, mensajes de error, foco y apertura/cierre de las adiciones, conservando español e inglés y las selecciones del usuario.

La vibración web no está disponible en todos los navegadores y teléfonos. Su presencia en la API tampoco demuestra que el motor físico haya vibrado. No se promete acceso universal ni conformidad WCAG antes de las pruebas correspondientes.

## Criterios de aceptación

- El escritorio no muestra opciones de vibración; un teléfono compatible permite activarlas, probarlas y detenerlas.
- Silenciar el audio general o reducir las animaciones no desactiva el canal táctil elegido.
- No hay vibración por defecto, reproducción táctil en segundo plano ni ráfagas de pulsos atrasados.
- En primera visita se respeta movimiento reducido del sistema; una elección manual guardada tiene prioridad.
- Se pueden seleccionar disco, fecha y columna y consultar sus valores con teclado, sin interpretar el mapa ni escuchar.
- La tabla distingue datos ausentes, niveles derivados y valores físicos; no inventa mediciones.
- Las adiciones están traducidas y no reinician reproducción, idioma, mezcla ni archivo al abrirlas.
- Se amplían las pruebas de comportamiento para estas condiciones y se repite la suite existente.
- Cuando esté disponible el entorno de navegador, se comparan capturas de móvil/escritorio, se revisan teclado, reflow y axe. La prueba física de vibración y las pruebas con NVDA, VoiceOver y TalkBack se registran por separado; no se dan por realizadas con simulación.

## Referencias

- [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Este registro corresponde a una prueba interna. Consulta sus [resultados y limitaciones](ACCESIBILIDAD_VERIFICACION.md) y el [estado de main](ESTADO_ACTUAL.md) para la versión de entrega.
