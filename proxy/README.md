# Proxy seguro para Brisa IA (OpenRouter + ElevenLabs)

Este directorio permite publicar **EarthRhythm** en GitHub Pages (`pierovelezzz/EarthRhythm`) sin exponer ninguna clave en Git ni obligar a los visitantes a configurar claves manualmente.

## Cómo funciona

1. El sitio estático en GitHub Pages llama a `proxyBaseUrl + '/api/openrouter'` y `proxyBaseUrl + '/api/elevenlabs'` **sin claves en el navegador**.
2. Tu cuenta (o la del encargado del repositorio) aloja **solo esta pequeña API proxy** en **Vercel** (`proxy/vercel`) o **Cloudflare Workers** (`proxy/cloudflare-worker.js`), donde las claves se guardan como **variables de entorno secretas**. No es necesario migrar ni ser dueño del repositorio de GitHub Pages para desplegar este proxy aparte.

## Variables de entorno requeridas

- `OPENROUTER_KEYS`: lista de claves separadas por coma o salto de línea (el proxy las rota automáticamente).
- `ELEVENLABS_KEY`: clave de ElevenLabs TTS.
- `ALLOWED_ORIGINS` *(opcional)*: dominios permitidos separados por coma (por defecto acepta `https://*.github.io` y `localhost`).

## Opción A · Vercel (solo carpeta `proxy/vercel`)

```bash
cd proxy/vercel
vercel --prod
```

Configura `OPENROUTER_KEYS` y `ELEVENLABS_KEY` en Vercel Project Settings → Environment Variables y obtendrás una URL pública (por ejemplo `https://brisa-proxy.vercel.app`).

## Opción B · Cloudflare Workers (plan gratuito)

Crea un Worker nuevo en Cloudflare Dashboard, pega el contenido de `proxy/cloudflare-worker.js` y añade `OPENROUTER_KEYS` y `ELEVENLABS_KEY` como **Secrets** en *Settings → Variables*.

## Conectar el proxy a GitHub Pages (cero configuración para visitantes)

En el repositorio de GitHub (`Settings → Secrets and variables → Actions → Variables`), crea la variable pública:

- `BRISA_PROXY_URL = https://tu-proxy.vercel.app` *(o tu URL de Workers, sin `/` final)*

El flujo `.github/workflows/pages.yml` pasa `BRISA_PROXY_URL` automáticamente a `scripts/build_pages.py` sin guardar secretos en el código.

## Desarrollo local

Copia tus claves localmente en `scripts/brisa-ai-config.local.js` (archivo ya incluido en `.gitignore`); al ejecutar `python scripts/build_pages.py _site` tendrás vista previa completa en local sin comprometer claves en Git.
