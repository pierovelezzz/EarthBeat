import { corsHeaders, jsonResponse, preflight, requireAllowedOrigin } from '../lib/proxy-utils.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export function OPTIONS(request) {
  return preflight(request);
}

/**
 * Proxy OpenRouter chat completions while rotating server-side OPENROUTER_KEYS.
 */
export async function POST(request) {
  const blocked = requireAllowedOrigin(request);
  if (blocked) return blocked;

  const keys = (process.env.OPENROUTER_KEYS || '')
    .split(/[\s,]+/)
    .map((k) => k.trim())
    .filter(Boolean);
  if (!keys.length) {
    console.error('Brisa proxy missing OPENROUTER_KEYS environment variable');
    return jsonResponse(request, { error: 'OPENROUTER_KEYS not configured' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    console.error('Invalid OpenRouter proxy request JSON:', err);
    return jsonResponse(request, { error: 'Invalid JSON body' }, 400);
  }

  const messages = Array.isArray(body?.messages) ? body.messages.slice(0, 12) : [];
  if (!messages.length) {
    return jsonResponse(request, { error: 'messages array is required' }, 400);
  }

  const fallbackModels = ['nvidia/nemotron-3.5-lightning:free', 'google/gemma-4-26b-a4b-it:free', 'openrouter/free'];
  const requestedModels = Array.isArray(body?.models) && body.models.length
    ? body.models
    : (body?.model ? [body.model, ...fallbackModels.filter((m) => m !== body.model)] : fallbackModels);
  const models = requestedModels;
  const start = Math.floor(Math.random() * keys.length);
  const attempts = Math.min(6, Math.max(models.length, keys.length, 3));

  for (let i = 0; i < attempts; i++) {
    const key = keys[(start + i) % keys.length];
    const model = models[i % models.length];
    const payload = {
      model,
      messages,
      temperature: typeof body?.temperature === 'number' ? body.temperature : 0.45,
      max_tokens: typeof body?.max_tokens === 'number' ? Math.min(body.max_tokens, 600) : 460,
      reasoning: body?.reasoning || { enabled: false }
    };

    const postUpstream = async (bodyObj) => {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Title': 'EarthRhythm Brisa AI'
        },
        body: JSON.stringify(bodyObj)
      });
      return { res, text: await res.text() };
    };

    try {
      let result = await postUpstream(payload);
      if (result.res.status === 400 && payload.reasoning && /reason/i.test(result.text)) {
        delete payload.reasoning;
        result = await postUpstream(payload);
      }
      if (result.res.ok) {
        let content = '';
        try {
          const parsed = JSON.parse(result.text || '{}');
          content = typeof parsed?.choices?.[0]?.message?.content === 'string'
            ? parsed.choices[0].message.content.trim()
            : '';
        } catch {
          content = '';
        }
        if (content) {
          return new Response(result.text, {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders(request) }
          });
        }
      }
      console.error(`OpenRouter upstream error ${result.res.status} on model ${model}`);
    } catch (err) {
      console.error('OpenRouter proxy fetch failure:', err);
    }
  }

  return jsonResponse(request, { error: 'Upstream OpenRouter providers unavailable' }, 502);
}
