# Proxy seguro para Brisa IA (OpenRouter + ElevenLabs)

Este directorio permite publicar **EarthRhythm** en **Vercel** o **GitHub Pages** sin exponer ninguna clave en Git ni entregar tus API keys al encargado de otro despliegue.

## Cómo funciona

1. El sitio estático llama a `proxyBaseUrl + '/api/openrouter'`, `proxyBaseUrl + '/api/elevenlabs'` y `proxyBaseUrl + '/api/elevenlabs-stt'` **sin claves en el navegador**.
2. Tu propia cuenta aloja **solo esta API proxy** (`proxy/vercel` en Vercel o `proxy/cloudflare-worker.js` en Cloudflare Workers), donde tus API keys se guardan cifradas como variables de entorno **Secret / Sensitive**.
3. Quien despliegue el frontend de EarthRhythm en otro Vercel o GitHub Pages únicamente configura la variable pública **`BRISA_PROXY_URL`** con la URL de tu proxy (por ejemplo `https://earthrhythm-brisa-proxy.vercel.app`) — jamás ve tus claves.

## Variables de entorno del proxy

- `OPENROUTER_KEYS`: lista de claves separadas por coma o salto de línea (el proxy las rota automáticamente).
- `ELEVENLABS_KEY`: clave de ElevenLabs (idealmente una *Scoped API Key* dedicada solo a TTS/STT con límite mensual de créditos).
- `ALLOWED_ORIGINS` *(recomendado)*: lista separada por coma de los orígenes web permitidos (acepta dominios exactos o comodines simples, por ejemplo `https://app-companero.vercel.app,https://pierovelezzz.github.io`). El proxy rechaza con HTTP `403` cualquier petición cuyo `Origin`/`Referer` no coincida antes de gastar créditos de ElevenLabs u OpenRouter. Si no se define, acepta únicamente `https://*.github.io` y `localhost`/`127.0.0.1`.

## Opción A · Tu Vercel solo como proxy (`proxy/vercel`)

```bash
cd proxy/vercel
vercel link --yes --project earthrhythm-brisa-proxy
vercel env add ELEVENLABS_KEY production --sensitive --force
vercel env add OPENROUTER_KEYS production --sensitive --force
vercel env add ALLOWED_ORIGINS production --no-sensitive --force
vercel --prod --yes
```

Cuando obtengas la URL final del proyecto del frontend (por ejemplo `https://earthrhythm-compa.vercel.app`), actualiza `ALLOWED_ORIGINS` a exactamente ese dominio para bloquear cualquier otro sitio.

## Cómo lo despliega tu compañero en SU Vercel (cero API keys)

1. Importa el repositorio `https://github.com/pierovelezzz/EarthRhythm` (rama `v4-IA`) en su Vercel.
2. El archivo raíz [vercel.json](../vercel.json) ejecuta automáticamente `python3 scripts/build_pages.py _site` y publica `_site`.
3. En **Project Settings → Environment Variables** de su Vercel solo agrega:
   - `BRISA_PROXY_URL = https://tu-proxy.vercel.app` *(sin `/` final)*
4. Redeploy / Deploy. `scripts/build_pages.py` incrustará esa URL en `_site/runtime/brisa-ai-config.js` sin tocar ninguna clave secreta.

## Opción B · Cloudflare Workers (plan gratuito)

Crea un Worker nuevo en Cloudflare Dashboard, pega el contenido de `proxy/cloudflare-worker.js` y añade `OPENROUTER_KEYS` y `ELEVENLABS_KEY` como **Secrets** en *Settings → Variables*.

## Desarrollo local

Copia tus claves localmente en `scripts/brisa-ai-config.local.js` (archivo ya incluido en `.gitignore`); al ejecutar `python scripts/build_pages.py _site` tendrás vista previa completa en local sin comprometer claves en Git.
