# Brisa y preferencias en V2

> Las notas de este directorio nacieron en V2. Para el funcionamiento de la rama principal, consulta el [estado de main](ESTADO_ACTUAL.md).

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V2`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Brisa tiene retrato en `prototipos/I11-eic/brisa/portrait.webp` y cincuenta MP3: veinticinco por idioma. La voz está activada en los valores iniciales del componente, empieza tras interacción y se puede apagar desde Accesibilidad. Los clips se reproducen con HTML Audio; el código también conserva la síntesis de voz del navegador y las alternativas escritas. Los créditos de las voces están en `prototipos/I11-eic/brisa/CREDITS.md`.

El idioma sigue una elección guardada válida o la configuración inicial del navegador. Cambiar pantalla, idioma o paso cancela la locución anterior. La guía y el tutorial conservan alternativas escritas y no requieren oír para progresar.

Las preferencias de voz, texto grande, contraste, movimiento reducido, fuente legible, vibración y efectos se guardan en `ts_prefs`; el idioma se guarda en `ts_lang`. No requieren una cuenta. Las preferencias pueden reabrirse desde Accesibilidad.

El tutorial de la aplicación guía la elección de un disco, su reproducción y la interpretación de la leyenda. Se puede cerrar o saltar. Las regresiones de estado y foco están en `scripts/test_guides.cjs`; una simulación de voz no equivale a escucha humana.

El movimiento reducido conserva contenido, poses y controles. La reproducción de la música tiene sus propios controles.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)

## Chat con Brisa

El chat funciona con preguntas y respuestas integradas en GitHub Pages y Vercel. En Vercel, la ruta del mismo sitio /api/brisa habilita respuestas abiertas al configurar OPENROUTER_API_KEY y voces seleccionables al configurar ELEVENLABS_API_KEY en el entorno del proyecto. También admite los nombres OPENROUTER_KEY, OPENROUTER_KEYS y ELEVENLABS_KEY de v4-IA. BRISA_CHAT_MODEL permite elegir un modelo de OpenRouter.

Configura las claves como variables privadas de Vercel y vuelve a desplegar. Usa claves limitadas a la función necesaria y configura un tope de consumo en cada proveedor. Las preguntas escritas se envían a OpenRouter solo con el servicio activo. El botón de lectura usa ElevenLabs si está habilitado, las grabaciones de Brisa para las respuestas integradas y la voz del dispositivo como respaldo para respuestas abiertas. El dictado utiliza el servicio de reconocimiento del navegador cuando está disponible. La narración preparada de Brisa en el tutorial y La banda sigue usando sus grabaciones locales.
