# Brisa en EarthRhythm

Brisa acompaña la bienvenida, el tutorial de tres pasos, la ayuda de cada pantalla, la partida y el chat. La estrella abre el panel de IA. Desde allí se puede iniciar la guía visual o el recorrido de los cinco músicos. Ambos señalan elementos de la página y avanzan solos. Los botones de avance y retroceso permiten tomar el control.

## Voz y texto

- **Inglés.** Las explicaciones y los recorridos preparados usan la voz local de Brisa sintetizada con Piper y el modelo LJ Speech. Las respuestas abiertas del chat pueden leerse con una voz inglesa del dispositivo. El sitio no usa ElevenLabs para inglés.
- **Español.** Los recorridos y la bienvenida de la partida incluyen clips de Leoni Vergara de ElevenLabs. La publicación principal solicita esa misma voz para los demás textos. Una confirmación de cuota agotada habilita las grabaciones de respaldo o la voz del dispositivo, según el texto. Si el servicio falla sin indicar la causa, el texto permanece disponible.
- **Control.** Modo voz se configura en Accesibilidad. La bocina del chat controla sus lecturas y las guías que inicia. Al cambiar de pantalla, idioma o paso se cancela la locución anterior.

Los créditos de los clips y del retrato se conservan en [CREDITS.md](../prototipos/I11-eic/brisa/CREDITS.md).

## Publicación y privacidad

Las preguntas abiertas se envían a OpenRouter mediante `/api/brisa`. El audio en español que se genera al momento se solicita a ElevenLabs desde la misma ruta. Los archivos locales de imagen y las preferencias se procesan o guardan en el navegador.

Vercel admite las variables privadas `OPENROUTER_API_KEY`, `ELEVENLABS_API_KEY` o `BRISA_PROXY_URL` para el servidor intermediario. También admite `OPENROUTER_KEY`, `OPENROUTER_KEYS` y `ELEVENLABS_KEY`. `BRISA_CHAT_MODEL` permite elegir el modelo de conversación. El intermediario debe autorizar el origen de producción y transmitir el código de cuota del proveedor si se quiere habilitar ese respaldo.

GitHub Pages y el servidor estático local conservan las respuestas integradas, los textos y las grabaciones incluidas. La lectura de contenido que requiere el servicio depende de la publicación de Vercel.
