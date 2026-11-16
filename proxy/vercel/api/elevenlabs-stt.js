import { corsHeaders, jsonResponse, preflight } from '../lib/proxy-utils.js';

const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

export const config = {
  api: {
    bodyParser: false
  }
};

export function OPTIONS(request) {
  return preflight(request);
}

/**
 * Proxy ElevenLabs Scribe STT audio transcription using server-side ELEVENLABS_KEY.
 */
export async function POST(request) {
  const apiKey = (process.env.ELEVENLABS_KEY || '').trim();
  if (!apiKey) {
    return jsonResponse(request, { error: 'ELEVENLABS_KEY not configured' }, 503);
  }
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonResponse(request, { error: 'multipart/form-data required' }, 400);
  }
  try {
    const bodyBuf = await request.arrayBuffer();
    const res = await fetch(ELEVENLABS_STT_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': contentType
      },
      body: bodyBuf
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { ...corsHeaders(request), 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('ElevenLabs STT proxy request failed:', err);
    return jsonResponse(request, { error: 'Speech-to-text upstream unreachable' }, 502);
  }
}
