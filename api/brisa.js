const voices = Object.freeze({
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  aria: '9BWtsMINqrJLrRacOk9x',
  laura: 'FGY2WhTYpPnrIDTdsKH5'
});
const questions = new Map();
const timeWindow = 60_000;

function allowedToSend(req, action) {
  const origin = req.headers.origin;
  if (!origin || origin !== 'https://' + req.headers.host) return false;
  const now = Date.now();
  for (const [key, entry] of questions) if (entry.until <= now) questions.delete(key);
  const ip = (req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  const key = action + ':' + ip;
  const entry = questions.get(key) || { until: now + timeWindow, count: 0 };
  if (entry.count >= 6 || (!questions.has(key) && questions.size >= 1000)) return false;
  entry.count += 1;
  questions.set(key, entry);
  return true;
}

function readBody(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body || {};
}

module.exports = async function brisa(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const listedChatKey = (process.env.OPENROUTER_KEYS || '').split(/[,\n]/).map(key => key.trim()).find(Boolean);
  const chatKey = (process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || listedChatKey || '').trim();
  const voiceKey = (process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_KEY || '').trim();
  if (req.method === 'GET') return res.json({ chat: Boolean(chatKey), voice: Boolean(voiceKey) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (Number(req.headers['content-length'] || 0) > 4096) return res.status(413).json({ error: 'size' });
  let body;
  try { body = readBody(req); } catch { return res.status(400).json({ error: 'json' }); }
  if (!body || !['chat', 'voice'].includes(body.action) || !['es', 'en'].includes(body.language)) {
    return res.status(400).json({ error: 'request' });
  }
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > (body.action === 'chat' ? 380 : 600)) {
    return res.status(400).json({ error: 'text' });
  }
  if (body.action === 'chat' && !chatKey || body.action === 'voice' && !voiceKey) {
    return res.status(503).json({ error: 'unavailable' });
  }
  if (!allowedToSend(req, body.action)) return res.status(429).json({ error: 'rate' });
  const timeout = AbortSignal.timeout(9000);

  try {
    if (body.action === 'voice') {
      const voice = Object.hasOwn(voices, body.voice) ? voices[body.voice] : voices.sarah;
      const result = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice + '?output_format=mp3_22050_32', {
        method: 'POST',
        headers: { 'xi-api-key': voiceKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: 'eleven_flash_v2_5', language_code: body.language }),
        signal: timeout
      });
      if (!result.ok) return res.status(502).json({ error: 'voice' });
      res.setHeader('Content-Type', 'audio/mpeg');
      return res.end(Buffer.from(await result.arrayBuffer()));
    }

    const history = (Array.isArray(body.history) ? body.history : []).slice(-4)
      .filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
      .map(item => ({ role: item.role, content: item.content.slice(0, 380) }));
    const screen = typeof body.screen === 'string' ? body.screen.slice(0, 80) : '';
    const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + chatKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.BRISA_CHAT_MODEL || 'openrouter/free',
        max_tokens: 180,
        messages: [{
          role: 'system',
          content: [
            'You are Brisa, the guide for EarthRhythm. Answer in ' + (body.language === 'es' ? 'simple Spanish' : 'plain English') + ' in at most three short sentences.',
            'Guide visitors through the Listen, The Band, How does it work, Technology and Play sections. NASA maps show where the Pacific was warmer or cooler than usual. EarthRhythm summarizes their colors as a grid and turns each column into sound.',
            'Melody mode plays with the band. Data mode turns the grid levels into tones. Silbo plays the quena, Inti marimba, Mamacocha harp, Yaku the musical dropper, and Illapa timpani. The band and its stories are fictional.',
            'Do not invent measurements, dates, sources, or functions. Say when you do not know. Stay within EarthRhythm and its data. Never ask for personal information or credentials.'
          ].join(' ')
        }].concat(history, [{ role: 'user', content: JSON.stringify({ screen, question: text }) }])
      }),
      signal: timeout
    });
    if (!result.ok) return res.status(502).json({ error: 'chat' });
    const answer = (await result.json()).choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) return res.status(502).json({ error: 'chat' });
    return res.json({ answer: answer.trim().slice(0, 600) });
  } catch {
    return res.status(502).json({ error: 'upstream' });
  }
};
