# Tutorial práctico y ayuda de cada pantalla

La copia `accesibilidad/v4-flujo-inclusivo` ofrece un único tutorial práctico de tres pasos. La ayuda contextual de Brisa explica la pantalla actual sin un recorrido de pasos ni una invitación a empezar otro tutorial dentro de ella.

## Acceder al tutorial

- En las preferencias de bienvenida: Iniciar tutorial, Retomar tutorial o Repetir tutorial, según el progreso guardado.
- En la ayuda de Brisa, elige Iniciar tutorial.
- En el botón Brisa: si hay un tutorial pendiente, lo retoma directamente. Si no lo hay, abre Ayuda de esta pantalla.


## Los tres pasos

1. Elegir un disco de mapas NASA.
2. Explorar el reproductor: reproducir música o continuar con la versión escrita sin sonido. La alternativa escrita está disponible sin que el navegador tenga que producir un error de audio.
3. Interpretar la leyenda eligiendo una descripción de agua más fría de lo esperado. Se pueden usar los nombres y valores escritos; no se exige distinguir colores, escuchar o responder con rapidez.

La ayuda contextual tiene una sola tarjeta, sin contador ni botones Siguiente/Anterior. Entendido o Cerrar la cierran. El tutorial conserva los controles de pasos y la opción de saltar una acción.

## Cerrar y retomar

Cerrar, pulsar Saltar guía o salir a otra sección conserva el paso y las acciones completadas. Al pulsar Brisa de nuevo se recupera ese punto y la selección del mapa, con la música en pausa. La misma reanudación está disponible después de recargar la página en ese navegador.

Solo Terminar marca el tutorial como completado. Repetir tutorial o Reiniciar tutorial permiten comenzar explícitamente desde el paso 1. Reiniciar borra únicamente el progreso del tutorial.

Al entrar se conserva el estado que la persona estaba explorando. Pausar devuelve ese estado sin confundirlo con el progreso guardado del tutorial. Si se cambió de colección y el mapa anterior todavía estaba cargando, se reinicia su carga al regresar.

## Almacenamiento y narración

`ts_tutorial` guarda un registro de versión 1 con el paso, las acciones completadas u omitidas y la selección NASA (colección, disco, fotograma y columna). No guarda los archivos locales, sus URLs, las muestras cargadas ni una orden de reproducción automática. Los registros inválidos se descartan o se normalizan a un paso coherente.

Si el almacenamiento del navegador está bloqueado, la reanudación sigue funcionando en memoria durante la sesión, pero no se puede garantizar tras recargar. El avance no se sincroniza entre navegadores ni dispositivos y se pierde si se borran los datos del sitio.

La voz sigue siendo opcional. El texto revisado del tutorial y la ayuda contextual usan síntesis de voz del sistema cuando está disponible; las instrucciones escritas permanecen disponibles si falta una voz compatible. Las grabaciones originales de las demás explicaciones se conservan.

## Verificación

- `node scripts/test_guides.cjs _site/index.html`: 146 pruebas aprobadas, incluidas reanudación de pasos 2 y 3, recarga, almacenamiento bloqueado, datos inválidos, finalización, reinicio y retorno entre colecciones con una imagen pendiente.
- `node scripts/verify_tutorial_flow.cjs _site`: recorridos reales en Chromium en español/inglés y 390/1366 píxeles; verifica entrada desde bienvenida y la ayuda de Brisa, una sola tarjeta, cierre/reanudación, recarga, ruta escrita, finalización y reinicio. Incluye axe.

Los guiones de navegador usan `TERRASONIC_PLAYWRIGHT` y `TERRASONIC_CHROMIUM`; para axe se admite `TERRASONIC_AXE`, con el paquete de QA en `_work/qa/` como opción local. Los resultados de los recorridos se guardan en `_work/tutorial-final/`. Estas pruebas no sustituyen la evaluación con personas usuarias o lectores de pantalla reales.
