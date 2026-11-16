/* Cloudflare Worker proxy for EarthRhythm Brisa AI (zero keys exposed to visitors). */
const ALLOWED_ORIGIN = /^https:\/\/[a-z0-9-]+\.github\.io$|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i;
const ALLOWED_VOICES = new Set([
  'EXAVITQu4vr4xnSDxMaL',
  'pBZVCk298iJlHAcHQwLr',
  '9BWtsMINqrJLrRacOk9x',
  'FGY2WhTYpPnrIDTdsKH5',
  'XrExE9yKIg1WjnnlVkGX',
  'SAz9YHcvj6GT2YYXdXww',
  'CwhRBWXzGAHq8TQ4Fs17'
]);

function makeCors(request, env) {
  const origin = request.headers.get('origin') || '';
  const list = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allow = list.includes('*') ? '*' : (list.includes(origin) || (!list.length && ALLOWED_ORIGIN.test(origin)) ? origin : '');
  const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept', 'Vary': 'Origin' };
  if (allow) h['Access-Control-Allow-Origin'] = allow;
  return h;
}

async function handleOpenRouter(request, env, cors) {
  const keys = (env.OPENROUTER_KEYS || '').split(/[\s,]+/).map((k) => k.trim()).filter(Boolean);
  if (!keys.length) return new Response(JSON.stringify({ error: 'Missing OPENROUTER_KEYS' }), { status: 503, headers: { 'Content-Type': 'application/json', ...cors } });
  const body = await request.json();
  const models = Array.isArray(body.models) && body.models.length ? body.models : [body.model || 'nvidia/nemotron-3.5-lightning:free', 'google/gemma-4-26b-a4b-it:free', 'openrouter/free'];
  const start = Math.floor(Math.random() * keys.length);
  for (let i = 0; i < Math.min(6, Math.max(models.length, keys.length, 3)); i++) {
    const key = keys[(start + i) % keys.length];
    const model = models[i % models.length];
    const payload = { model, messages: (body.messages || []).slice(0, 12), temperature: 0.45, max_tokens: 460 };
    if (body.reasoning) payload.reasoning = body.reasoning;
    const postUpstream = async (bodyObj) => {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'X-Title': 'EarthRhythm Brisa AI' },
        body: JSON.stringify(bodyObj)
      });
      return { res, text: await res.text() };
    };
    let result = await postUpstream(payload);
    if (result.res.status === 400 && payload.reasoning && /reason/i.test(result.text)) {
      delete payload.reasoning;
      result = await postUpstream(payload);
    }
    if (result.res.ok) return new Response(result.text, { status: 200, headers: { 'Content-Type': 'application/json', ...cors } });
  }
  return new Response(JSON.stringify({ error: 'Upstream unavailable' }), { status: 502, headers: { 'Content-Type': 'application/json', ...cors } });
}

async function handleElevenLabs(request, env, cors) {
  const apiKey = (env.ELEVENLABS_KEY || '').trim();
  if (!apiKey) return new Response(JSON.stringify({ error: 'Missing ELEVENLABS_KEY' }), { status: 503, headers: { 'Content-Type': 'application/json', ...cors } });
  const body = await request.json();
  const voiceId = ALLOWED_VOICES.has(body.voiceId) ? body.voiceId : 'EXAVITQu4vr4xnSDxMaL';
  const text = String(body.text || '').trim().slice(0, 1400);
  if (!text) return new Response(JSON.stringify({ error: 'Empty text' }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } });
  for (const model of [body.model_id || 'eleven_flash_v2_5', 'eleven_multilingual_v2']) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?optimize_streaming_latency=3&output_format=mp3_22050_32`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: model, voice_settings: body.voice_settings || { stability: 0.45, similarity_boost: 0.78, style: 0.12, use_speaker_boost: true } })
    });
    if (res.ok) return new Response(res.body, { status: 200, headers: { 'Content-Type': 'audio/mpeg', ...cors } });
  }
  return new Response(JSON.stringify({ error: 'TTS failed' }), { status: 502, headers: { 'Content-Type': 'application/json', ...cors } });
}

async function handleElevenLabsStt(request, env, cors) {
  const apiKey = (env.ELEVENLABS_KEY || '').trim();
  if (!apiKey) return new Response(JSON.stringify({ error: 'Missing ELEVENLABS_KEY' }), { status: 503, headers: { 'Content-Type': 'application/json', ...cors } });
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return new Response(JSON.stringify({ error: 'multipart/form-data required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } });
  }
  const upstream = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': contentType },
    body: await request.arrayBuffer()
  });
  const text = await upstream.text();
  return new Response(text, { status: upstream.status, headers: { 'Content-Type': 'application/json', ...cors } });
}

export default {
  async fetch(request, env) {
    const cors = makeCors(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });
    const { pathname } = new URL(request.url);
    if (pathname.endsWith('/api/openrouter')) return handleOpenRouter(request, env, cors);
    if (pathname.endsWith('/api/elevenlabs-stt')) return handleElevenLabsStt(request, env, cors);
    if (pathname.endsWith('/api/elevenlabs')) return handleElevenLabs(request, env, cors);
    return new Response('Not found', { status: 404, headers: cors });
  }
};
