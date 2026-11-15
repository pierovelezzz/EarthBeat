# Accesibilidad añadida y verificación

Fecha: 15 de noviembre de 2026. Trabajo local en `accesibilidad/v4-flujo-inclusivo`, creada desde `v4-NASA-Space-AC` antes de modificar el producto. La referencia original continúa en `a7f965abc467c2a3e67d6e5063ae871bdcaddbc6`. No se publicó ni se fusionó esta copia.

## Recorrido de uso

1. La entrada toma la preferencia de movimiento del sistema si no hay una elección explícita guardada. Los controles existentes permiten saltar o pausar la introducción.
2. Las preferencias son combinables y no preguntan por diagnósticos. Solo en teléfonos se agrega la vibración opcional; cuando no existe API, el control queda deshabilitado y la ayuda explica las alternativas.
3. La selección existente de discos y fechas conserva acceso mediante botones y teclado. La guía de Brisa sigue siendo opcional y conserva sus textos.
4. El reproductor añade un desplegable junto a su explicación actual. Un selector nativo permite consultar 28 columnas de 16 filas sin usar el mapa. La selección de consulta es independiente de la posición musical.
5. Los valores se identifican como niveles derivados, no como temperaturas calibradas. Las celdas ausentes no se convierten en cero. En la muestra de lluvia, un cero puede ser fondo del gráfico, no una observación igual al promedio.
6. En un teléfono con API, los pulsos resumen intensidad musical aunque el volumen general sea cero o se reduzcan las animaciones. Se mantienen activación voluntaria, prueba, parada, límites de frecuencia y cancelación al pausar, cambiar de pantalla u ocultar la página.
7. El menú Accesibilidad incluye instrucciones de teclado, lectores de pantalla, lectura sin sonido, ajustes de lectura y reducción de estímulos. Los nombres accesibles incluyen las etiquetas visibles para facilitar el control por voz.

## Necesidades atendidas y límites

| Necesidad | Acceso disponible | Validación pendiente |
|---|---|---|
| Sordera o hipoacusia | Datos y explicaciones escritos; pulsos opcionales en teléfonos compatibles | Comprensión con personas usuarias y vibración física |
| Ceguera o sordoceguera | Encabezados y controles semánticos; selector y tabla accesible sin interpretar el mapa | NVDA, VoiceOver, TalkBack y línea braille |
| Baja visión o daltonismo | Contraste, texto y fuente existentes; valores e interpretación textual que complementan el color | Zoom nativo y revisión de contraste que axe no puede resolver |
| Movilidad reducida | Botones y selectores nativos, navegación con teclado, sin arrastre obligatorio en la consulta | Control por voz y tecnologías de conmutación reales |
| Sensibilidad al movimiento o dificultades cognitivas | Preferencia del sistema, ayuda breve y guía opcional; canales configurables por separado | Evaluación de comodidad y comprensión con personas usuarias |

## Comprobaciones realizadas

| Comprobación | Evidencia |
|---|---|
| Construcción | `py -3.14 scripts/build_pages.py _site`, correcta |
| Lógica | `node scripts/test_guides.cjs _site/index.html`: 139 aprobadas, cero fallos |
| Navegación nativa de teclado | `verify_keyboard.cjs`: 8 escenarios, español/inglés, anchos 320, 390, 1342 y 1366; cero errores de página |
| Flujo nuevo y axe | `verify_accessibility_flow.cjs`: 4 escenarios, 24 auditorías con etiquetas A/AA de WCAG 2.0/2.1 y AA de 2.2, cero infracciones automáticas detectadas |
| Auditoría de todas las secciones | `verify_a11y.cjs`: 66 estados en español/inglés a 390 y 1366 px, incluidas preferencias, banda, explicación, tecnología, Brisa, leyenda y ajustes; cero infracciones automáticas y cero errores de página |
| Escenarios del flujo | Escritorio, escritorio estrecho, teléfono con API simulada y teléfono sin API simulada; preferencias, datos, idioma y lectura a 320 px |
| Conservación del diseño | Comparación con el HTML de la rama original: geometría idéntica de cabecera, portada, navegación, accesos planetarios, encabezado del reproductor, controles, mapas y banda a 390 y 1366 px; se añade el desplegable debajo de la explicación |
| Recursos | 12 archivos de fuentes y sus avisos verificados |
| Revisión independiente | Un revisor comprobó preservación de reproducción y foco en navegador. Se corrigieron sus observaciones sobre fondo de lluvia y selectores de idioma de las pruebas |

El navegador utilizado fue Chromium 157.0.8103.78 en una sesión de prueba aislada. Los escenarios de teléfono cambian el agente de usuario, las capacidades móviles y la API simulada en Chromium: no son pruebas en Safari ni demuestran vibración física.

Los informes y capturas de QA se generan en `_work/accessibility-flow/` y `_work/accessibility-keyboard/`, carpetas locales ignoradas por Git. Axe también devolvió comprobaciones incompletas, principalmente contraste sobre fondos complejos; requieren revisión manual. Cero infracciones automáticas no equivale a conformidad WCAG ni a acceso universal.

## Repetir las pruebas

El producto no añade dependencias. Para QA se usaron `playwright-core` y `axe-core` instalados en `_work/qa/`, con Google Chrome local. Se puede proporcionar otro paquete y ejecutable mediante las variables del proyecto:

```powershell
$env:TERRASONIC_PLAYWRIGHT=(Resolve-Path '_work/qa/node_modules/playwright-core').Path
$env:TERRASONIC_CHROMIUM='C:/Program Files/Google/Chrome/Application/chrome.exe'
node scripts/verify_accessibility_flow.cjs _site
node scripts/verify_keyboard.cjs _site _work/accessibility-keyboard
```

El nuevo verificador admite `TERRASONIC_AXE` para ubicar `axe.min.js`; por defecto usa `_work/qa/node_modules/axe-core/axe.min.js`.

La vibración se identifica por las capacidades y el agente de usuario del navegador, no solo por el ancho de pantalla. Esa identificación es aproximada. La API puede rechazar la solicitud o aceptarla sin que el dispositivo produzca un pulso perceptible. Siempre queda disponible la lectura escrita.
