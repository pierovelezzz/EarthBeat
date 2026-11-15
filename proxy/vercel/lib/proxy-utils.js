const DEFAULT_ALLOWED = /^https:\/\/[a-z0-9-]+\.github\.io$|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i;

/**
 * Compute CORS response headers for EarthRhythm origins or an explicit ALLOWED_ORIGINS list.
 */
export function corsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  let allowOrigin = '';
  if (configured.includes('*')) {
    allowOrigin = '*';
  } else if (configured.length > 0 && configured.includes(origin)) {
    allowOrigin = origin;
  } else if (configured.length === 0 && DEFAULT_ALLOWED.test(origin)) {
    allowOrigin = origin;
  }

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Vary': 'Origin'
  };
  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;
  return headers;
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
