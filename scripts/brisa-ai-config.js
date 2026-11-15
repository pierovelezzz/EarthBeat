/* Public runtime config for Brisa AI (never commit API keys here).
 * For local testing without a backend proxy, use gitignored scripts/brisa-ai-config.local.js.
 * For public hosting (GitHub Pages), deploy proxy/vercel or proxy/cloudflare-worker.js and set
 * proxyBaseUrl here (or via BRISA_PROXY_URL at build time) so visitors never configure keys manually.
 */
(function (global) {
  'use strict';

  var existing = (global && global.EARTH_BRISA_CONFIG) || {};
  var config = Object.assign({
    proxyBaseUrl: '',
    openrouterEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    openrouterKeys: [],
    openrouterModels: [
      'nvidia/nemotron-3.5-lightning:free',
      'google/gemma-4-26b-a4b-it:free',
      'google/gemma-4-31b-it:free',
      'openrouter/free'
    ],
    elevenlabsEndpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
    elevenlabsKey: '',
    elevenlabsModel: 'eleven_flash_v2_5',
    elevenlabsFallbackModel: 'eleven_multilingual_v2',
    defaultVoiceId: 'EXAVITQu4vr4xnSDxMaL',
    elevenlabsVoices: [
      { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah · cálida y clara (ES/EN)', labelEn: 'Sarah · warm & clear (ES/EN)' },
      { id: '9BWtsMINqrJLrRacOk9x', label: 'Aria · expresiva (ES/EN)', labelEn: 'Aria · expressive (ES/EN)' },
      { id: 'FGY2WhTYpPnrIDTdsKH5', label: 'Laura · suave y didáctica (ES/EN)', labelEn: 'Laura · soft & clear (ES/EN)' },
      { id: 'XrExE9yKIg1WjnnlVkGX', label: 'Matilda · narradora amigable (ES/EN)', labelEn: 'Matilda · friendly narrator (ES/EN)' },
      { id: 'SAz9YHcvj6GT2YYXdXww', label: 'River · serena y cercana (ES/EN)', labelEn: 'River · calm & natural (ES/EN)' },
      { id: 'CwhRBWXzGAHq8TQ4Fs17', label: 'Roger · voz grave y pausada (ES/EN)', labelEn: 'Roger · deep & steady (ES/EN)' }
    ]
  }, existing);

  if (global) global.EARTH_BRISA_CONFIG = config;
})(typeof window !== 'undefined' ? window : globalThis);
