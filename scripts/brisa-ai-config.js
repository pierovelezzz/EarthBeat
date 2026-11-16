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
    defaultVoiceId: 'pBZVCk298iJlHAcHQwLr',
    elevenlabsVoices: [
      { id: 'pBZVCk298iJlHAcHQwLr', label: 'Brisa · Leoni (latina cálida)', labelEn: 'Brisa · Leoni (Latin warmth)' },
      { id: 'onwK4e9ZLuTAKqWW03F9', label: 'Daniel · barítono pausado (masculina)', labelEn: 'Daniel · deep baritone (male)' },
      { id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice · clara y ágil (femenina)', labelEn: 'Alice · bright & clear (female)' },
      { id: 'pNInz6obpgDQGcFmaJgB', label: 'Adam · narrador grave (masculina)', labelEn: 'Adam · deep narrator (male)' },
      { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah · suave y amigable (femenina)', labelEn: 'Sarah · soft & friendly (female)' },
      { id: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum · voz ronca (masculina)', labelEn: 'Callum · husky & steady (male)' }
    ]
  }, existing);

  if (global) global.EARTH_BRISA_CONFIG = config;
})(typeof window !== 'undefined' ? window : globalThis);
