import { corsHeaders, jsonResponse, preflight, requireAllowedOrigin } from '../lib/proxy-utils.js';

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/text-to-speech';
const ALLOWED_VOICES = new Set([
  'EXAVITQu4vr4xnSDxMaL',
  'pBZVCk298iJlHAcHQwLr',
  '9BWtsMINqrJLrRacOk9x',
  'FGY2WhTYpPnrIDTdsKH5',
  'XrExE9yKIg1WjnnlVkGX',
  'SAz9YHcvj6GT2YYXdXww',
  'CwhRBWXzGAHq8TQ4Fs17'
]);

export function OPTIONS(request) {
  return preflight(request);
}

/**
 * Proxy ElevenLabs TTS audio synthesis using server-side ELEVENLABS_KEY.
 */
export async function POST(request) {
  const blocked = requireAllowedOrigin(request);
  if (blocked) return blocked;

  const apiKey = (process.env.ELEVENLABS_KEY || '').trim();
  if (!apiKey) {
    console.error('Brisa proxy missing ELEVENLABS_KEY environment variable');
    return jsonResponse(request, { error: 'ELEVENLABS_KEY not configured' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    console.error('Invalid ElevenLabs proxy request JSON:', err);
    return jsonResponse(request, { error: 'Invalid JSON body' }, 400);
  }

  const text = String(body?.text || '').trim().slice(0, 1400);
  if (!text) {
    return jsonResponse(request, { error: 'text is required' }, 400);
  }

  const voiceId = ALLOWED_VOICES.has(body?.voiceId) ? body.voiceId : 'EXAVITQu4vr4xnSDxMaL';
  const modelId = typeof body?.model_id === 'string' && body.model_id ? body.model_id : 'eleven_flash_v2_5';
  const models = modelId === 'eleven_multilingual_v2' ? [modelId] : [modelId, 'eleven_multilingual_v2'];
  const langCode = body?.language_code === 'es' || body?.language_code === 'en' ? body.language_code : undefined;

  for (const model of models) {
    try {
      const payload = {
        text,
        model_id: model,
        voice_settings: body?.voice_settings || { stability: 0.45, similarity_boost: 0.78, style: 0.12, use_speaker_boost: true }
      };
      if (langCode && model !== 'eleven_multilingual_v2') payload.language_code = langCode;
      const res = await fetch(`${ELEVENLABS_BASE}/${encodeURIComponent(voiceId)}?optimize_streaming_latency=3&output_format=mp3_22050_32`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return new Response(res.body, {
          status: 200,
          headers: { 'Content-Type': 'audio/mpeg', ...corsHeaders(request) }
        });
      }
      console.error(`ElevenLabs upstream error ${res.status} on model ${model}`);
    } catch (err) {
      console.error('ElevenLabs proxy fetch failure:', err);
    }
  }

  return jsonResponse(request, { error: 'Upstream ElevenLabs synthesis failed' }, 502);
}
