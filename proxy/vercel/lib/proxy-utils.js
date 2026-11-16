const DEFAULT_ALLOWED = /^https:\/\/[a-z0-9-]+\.github\.io$|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i;

function wildcardToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[a-z0-9.:-]+');
  return new RegExp('^' + escaped + '$', 'i');
}

function configuredPatterns() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  const list = configuredPatterns();
  if (list.length === 0) return DEFAULT_ALLOWED.test(origin);
  if (list.includes('*')) return true;
  return list.some((pattern) => (pattern.includes('*') ? wildcardToRegex(pattern).test(origin) : pattern === origin));
}

function extractRequestOrigin(request) {
  const direct = (request.headers.get('origin') || '').trim();
  if (direct) return direct;
  const referer = (request.headers.get('referer') || '').trim();
  if (!referer) return '';
  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

/**
 * Compute CORS response headers for EarthRhythm origins or an explicit ALLOWED_ORIGINS list.
 */
export function corsHeaders(request) {
  const origin = (request.headers.get('origin') || '').trim();
  const list = configuredPatterns();

  let allowOrigin = '';
  if (list.includes('*')) {
    allowOrigin = '*';
  } else if (isOriginAllowed(origin)) {
    allowOrigin = origin;
  }

  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Vary': 'Origin'
  };
  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;
  return headers;
}

/**
 * Enforce ALLOWED_ORIGINS server-side before spending API credits on OpenRouter or ElevenLabs.
 */
export function requireAllowedOrigin(request) {
  const list = configuredPatterns();
  if (list.includes('*')) return null;
  const origin = extractRequestOrigin(request);
  if (isOriginAllowed(origin)) return null;
  return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) }
  });
}

/**
 * Handle CORS preflight requests uniformly across endpoints.
 */
export function preflight(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

/**
 * Return a JSON error/status response with CORS headers attached.
 */
export function jsonResponse(request, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) }
  });
}
