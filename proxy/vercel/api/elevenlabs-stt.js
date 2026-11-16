import { corsHeaders, jsonResponse, preflight, requireAllowedOrigin } from '../lib/proxy-utils.js';

const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';
const MAX_AUDIO_BYTES = 2 * 1024 * 1024;

export function OPTIONS(request) {
  return preflight(request);
}

/**
 * Proxy ElevenLabs Scribe STT audio transcription using server-side ELEVENLABS_KEY.
 */
export async function POST(request) {
  const blocked = requireAllowedOrigin(request);
  if (blocked) return blocked;

  const apiKey = (process.env.ELEVENLABS_KEY || '').trim();
  if (!apiKey) {
    console.error('Brisa proxy missing ELEVENLABS_KEY environment variable');
    return jsonResponse(request, { error: 'ELEVENLABS_KEY not configured' }, 503);
  }
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonResponse(request, { error: 'multipart/form-data required' }, 400);
  }
  try {
    const bodyBuf = await request.arrayBuffer();
    if (!bodyBuf.byteLength || bodyBuf.byteLength > MAX_AUDIO_BYTES) {
      return jsonResponse(request, { error: 'Audio payload must be <= 2 MB' }, 413);
    }
    const res = await fetch(ELEVENLABS_STT_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': contentType
      },
      body: bodyBuf
    });
    const text = await res.text();
    if (!res.ok) console.error(`ElevenLabs STT upstream error ${res.status}`);
    return new Response(text, {
      status: res.status,
      headers: { ...corsHeaders(request), 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('ElevenLabs STT proxy request failed:', err);
    return jsonResponse(request, { error: 'Speech-to-text upstream unreachable' }, 502);
  }
}
