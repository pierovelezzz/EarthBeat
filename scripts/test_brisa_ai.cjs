const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const htmlPath = path.resolve(process.argv[2] || '_site/index.html');
const configPath = path.resolve('scripts/brisa-ai-config.js');
const html = fs.readFileSync(htmlPath, 'utf8');
const configSource = fs.readFileSync(configPath, 'utf8');
const scriptMatch = html.match(/<script[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Missing data-dc-script in ' + htmlPath);

function createAppHarness(options = {}) {
  const storage = new Map(Object.entries(options.storage || {}));
  const revokedUrls = [];
  let blobSeq = 0;
  const createdAudio = [];
  const speechCalls = { spoken: [], cancelled: 0 };

  class FakeAudio {
    constructor(src) {
      this.src = src;
      this.paused = false;
      this.currentTime = 0;
      this.onended = null;
      this.onerror = null;
      createdAudio.push(this);
    }
    play() {
      if (options.rejectAudioPlay) return Promise.reject(options.rejectAudioPlay);
      this.paused = false;
      this.currentTime = 0.2;
      return Promise.resolve();
    }
    pause() {
      this.paused = true;
    }
  }

  class DCLogic {
    constructor(props) { this.props = props; }
    setState(patch, cb) {
      Object.assign(this.state, patch);
      if (cb) cb();
    }
  }

  const fakeDoc = {
    documentElement: { lang: 'es', dataset: {} },
    hidden: false,
    activeElement: null,
    body: {},
    scrollingElement: null,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: () => ({
      width: 0, height: 0,
      getContext: () => ({
        drawImage: () => {},
        getImageData: () => ({ data: new Uint8ClampedArray(140 * 80 * 4) })
      })
    })
  };

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: cb => setTimeout(cb, 0),
    cancelAnimationFrame: clearTimeout,
    AbortController,
    DOMException,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Math,
    JSON,
    Date,
    RegExp,
    Error,
    Promise,
    btoa: globalThis.btoa,
    Float32Array,
    Uint8Array,
    ArrayBuffer,
    DataView,
    URL: {
      createObjectURL: () => 'blob:brisa-test-' + (++blobSeq),
      revokeObjectURL: u => revokedUrls.push(u)
    },
    Image: function () {},
    navigator: { language: options.navLang || 'es-PE' },
    localStorage: {
      getItem: k => (storage.has(k) ? storage.get(k) : null),
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: k => storage.delete(k)
    },
    fetch: options.fetch || (async () => ({ ok: false, status: 503, text: async () => 'offline', blob: async () => new Blob() })),
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    addEventListener: () => {},
    removeEventListener: () => {},
    document: fakeDoc,
    DCLogic,
    CustomEvent: function (t) { this.type = t; },
    Audio: options.noAudio ? undefined : FakeAudio,
    SpeechSynthesisUtterance: options.noSpeech ? undefined : function (t) { this.text = t; },
    speechSynthesis: options.noSpeech ? undefined : {
      getVoices: () => options.emptyVoices ? [] : [{ name: 'ES Voice', lang: 'es-PE' }, { name: 'EN Voice', lang: 'en-US' }],
      speak: u => { speechCalls.active = u; speechCalls.spoken.push({ text: u.text, lang: u.lang }); },
      cancel: () => { speechCalls.cancelled++; speechCalls.active = null; }
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  const ctx = vm.createContext(sandbox);
  vm.runInContext(configSource, ctx, { filename: 'brisa-ai-config.js' });
  if (options.brisaConfig) {
    ctx.EARTH_BRISA_CONFIG = Object.assign({}, ctx.EARTH_BRISA_CONFIG, options.brisaConfig);
  }
  vm.runInContext(
    scriptMatch[1] + '\n;window.__exports = { Component, TX, TECH, TECH_EN, brisaAiConfig, writeBrisaAiSettings, brisaParagraphs, brisaSpeechPlainText, brisaFallbackAnswer, encodeBrisaPcmWavBase64, DISCS, BAND };',
    ctx,
    { filename: 'Main.dc.html' }
  );

  const comp = new ctx.__exports.Component({});
  comp.master = { gain: { value: 0.8 } };
  comp.cueBus = { gain: { value: 1 } };
  return { ctx, comp, exports: ctx.__exports, storage, createdAudio, revokedUrls, speechCalls };
}

test('Static bundle includes key-free config script and optional local overrides exclude dead keys', () => {
  assert.match(html, /src="\.\/runtime\/brisa-ai-config\.js\?v=[0-9a-f]{12}"/);
  assert(!/sk-or-v1-|sk_[0-9a-f]{20,}/i.test(configSource), 'Committed scripts/brisa-ai-config.js must contain zero secret keys');
  const { exports } = createAppHarness();
  const cfg = exports.brisaAiConfig();
  assert.equal(cfg.openrouterKeys.length, 0);
  assert.equal(cfg.elevenlabsKey, '');
  assert.equal(cfg.elevenlabsVoices.length, 6);
  assert.equal(cfg.elevenlabsModel, 'eleven_flash_v2_5');
  assert.equal(cfg.voiceId, 'EXAVITQu4vr4xnSDxMaL');

  const localPath = path.resolve('scripts/brisa-ai-config.local.js');
  if (fs.existsSync(localPath)) {
    const { ctx, exports: localExports } = createAppHarness();
    vm.runInContext(fs.readFileSync(localPath, 'utf8'), ctx, { filename: 'brisa-ai-config.local.js' });
    const localCfg = localExports.brisaAiConfig();
    assert.equal(localCfg.openrouterKeys.length, 38);
    assert(localCfg.openrouterKeys.every(k => !k.startsWith('sk-or-v1-3bca329') && !k.startsWith('sk-or-v1-2cac0b4')));
    assert.match(localCfg.elevenlabsKey, /^sk_[0-9a-f]{20,}$/i);
  }
});

test('ES and EN fixed UI keys and Tech cards cover Brisa AI + OpenRouter + ElevenLabs', () => {
  const { exports } = createAppHarness();
  const esKeys = Object.keys(exports.TX.es).sort();
  const enKeys = Object.keys(exports.TX.en).sort();
  assert.deepEqual(esKeys, enKeys);
  const aiKeys = esKeys.filter(k => k.startsWith('brisa'));
  assert(aiKeys.length >= 20, 'Expected full set of Brisa AI localization keys');
  aiKeys.forEach(k => {
    assert(exports.TX.es[k].trim().length > 0, 'Empty ES key: ' + k);
    assert(exports.TX.en[k].trim().length > 0, 'Empty EN key: ' + k);
  });
  const techNames = exports.TECH.map(t => (t.es ? t.es.name : t.name));
  assert(techNames.includes('OpenRouter API'));
  assert(techNames.includes('ElevenLabs TTS + Web Speech'));
  assert(exports.TECH_EN['OpenRouter API']);
  assert(exports.TECH_EN['ElevenLabs TTS + Web Speech']);
});

test('buildBrisaKnowledgeContext includes live disc, NASA SVS/GIBS/POWER sources, and Pacora rule', () => {
  const { comp } = createAppHarness();
  comp.applySet('prev');
  comp.setState({ disc: 3, frame: 2 }); // yaku2023 March 2023
  const ctx = comp.buildBrisaKnowledgeContext();
  assert.equal(ctx.live.discId, 'yaku2023');
  assert.equal(ctx.live.pacoraRuleActive, true);
  assert.match(ctx.systemPrompt, /NASA SVS 5176/);
  assert.match(ctx.systemPrompt, /GHRSST L4 MUR 0\.25/);
  assert.match(ctx.systemPrompt, /NASA POWER Monthly API/);
  assert.match(ctx.systemPrompt, /Chiclayo, Galapagos and Iquitos/);
  assert.match(ctx.systemPrompt, /memoria-pacora-v1/);
  assert.match(ctx.systemPrompt, /NOT direct thermometer degrees C/);
});

test('Speech plain-text sanitizer removes markdown/URLs cleanly for natural TTS', () => {
  const { exports } = createAppHarness();
  const clean = exports.brisaSpeechPlainText('## **Hola!**\nMira `NASA SVS 5176` en https://svs.gsfc.nasa.gov/5176/ → escala −4 a +4.');
  assert(!/[#*`→]/.test(clean));
  assert(!/https:\/\//.test(clean));
  assert.match(clean, /NASA SVS 5176/);
  const paras = exports.brisaParagraphs('**Primero**\n\n- Segundo punto');
  assert.deepEqual(JSON.parse(JSON.stringify(paras)), [{ text: 'Primero' }, { text: '• Segundo punto' }]);
});

test('Offline fallback answers NASA, Pacora/Band, Color scale, and Accessibility queries in ES/EN', () => {
  const { comp, exports } = createAppHarness();
  const ctx = comp.buildBrisaKnowledgeContext();
  const nasaEs = exports.brisaFallbackAnswer('¿Qué fuentes de la NASA usa?', ctx);
  assert.match(nasaEs, /SVS 5176/);
  assert.match(nasaEs, /GIBS/);
  assert.match(nasaEs, /POWER/);
  const pacoraEs = exports.brisaFallbackAnswer('Háblame de Pacora y Yaku', ctx);
  assert.match(pacoraEs, /−10 BPM/);
  comp.setLang('en');
  const scaleEn = exports.brisaFallbackAnswer('Explain the -5 to +5 color scale', comp.buildBrisaKnowledgeContext());
  assert.match(scaleEn, /derived color levels/i);
});

test('requestOpenRouter rotates keys/models and retries HTTP 400 without mandatory reasoning', async () => {
  const seenCalls = [];
  const fetchMock = async (url, init) => {
    const body = JSON.parse(init.body);
    seenCalls.push({ url, auth: init.headers.Authorization, model: body.model, hasReasoning: 'reasoning' in body });
    if (seenCalls.length === 1) {
      return { ok: false, status: 400, text: async () => 'Reasoning is mandatory for this endpoint' };
    }
    if (seenCalls.length === 2 && !('reasoning' in body)) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ model: body.model, choices: [{ message: { content: 'Soy Brisa: aquí ves el Pacífico.' } }] })
      };
    }
    return { ok: false, status: 429, text: async () => 'rate limit' };
  };
  const { comp } = createAppHarness({
    fetch: fetchMock,
    brisaConfig: { openrouterKeys: ['test-or-key-1', 'test-or-key-2'] }
  });
  const ctrl = new AbortController();
  const res = await comp.requestOpenRouter('Hola Brisa', [], comp.buildBrisaKnowledgeContext(), ctrl.signal);
  assert.equal(res.ok, true);
  assert.equal(res.text, 'Soy Brisa: aquí ves el Pacífico.');
  assert.equal(seenCalls.length, 2);
  assert.equal(seenCalls[0].hasReasoning, true);
  assert.equal(seenCalls[1].hasReasoning, false);
});

test('askBrisaAI falls back offline on errors and auto-speaks via ElevenLabs in Voice mode', async () => {
  const ttsCalls = [];
  const fetchMock = async (url, init) => {
    if (url.includes('openrouter.ai')) {
      return { ok: false, status: 429, text: async () => 'limit' };
    }
    if (url.includes('elevenlabs.io')) {
      ttsCalls.push({ url, key: init.headers['xi-api-key'], body: JSON.parse(init.body) });
      return { ok: true, status: 200, blob: async () => new Blob([new Uint8Array([73, 68, 51, 1, 2, 3])], { type: 'audio/mpeg' }) };
    }
    throw new Error('Unexpected fetch ' + url);
  };
  const { comp, createdAudio, revokedUrls } = createAppHarness({
    fetch: fetchMock,
    brisaConfig: { openrouterKeys: ['test-or-key-1'], elevenlabsKey: 'test-el-key' }
  });
  comp.state.brisaAiOpen = true;
  comp.state.voice = true;
  await comp.askBrisaAI('¿Qué fuentes de la NASA tenemos?');
  await new Promise(r => setTimeout(r, 25));
  assert.equal(comp.state.brisaAiMessages.length, 2);
  assert.equal(comp.state.brisaAiMessages[1].source, 'offline');
  assert.match(comp.state.brisaAiMessages[1].text, /SVS 5176/);
  assert.equal(ttsCalls.length, 1);
  assert.match(ttsCalls[0].url, /EXAVITQu4vr4xnSDxMaL/);
  assert.equal(ttsCalls[0].key, 'test-el-key');
  assert.equal(comp.state.speaking, true);
  assert(Math.abs(comp.master.gain.value - 0.24) < 0.001, 'Music must duck while ElevenLabs speaks');

  // Replay uses cached blob URL rather than calling ElevenLabs again
  comp.stopSpeech();
  assert.equal(comp.state.speaking, false);
  assert(Math.abs(comp.master.gain.value - 0.8) < 0.001);
  await comp.speakBrisaAI(comp.state.brisaAiMessages[1].id, true);
  assert.equal(ttsCalls.length, 1);
  assert.equal(createdAudio.length, 2);

  // Unmount revokes blob URL cleanly
  comp.componentWillUnmount();
  assert.equal(revokedUrls.length, 1);
});

test('speakBrisaAI falls back to Web Speech API when ElevenLabs fails', async () => {
  const fetchMock = async url => {
    if (url.includes('openrouter.ai')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ choices: [{ message: { content: 'Respuesta clara de Brisa.' } }] })
      };
    }
    return { ok: false, status: 500, text: async () => 'tts down', blob: async () => new Blob() };
  };
  const { comp, speechCalls } = createAppHarness({
    fetch: fetchMock,
    brisaConfig: { openrouterKeys: ['test-or-key-1'], elevenlabsKey: 'test-el-key' }
  });
  comp.state.brisaAiOpen = true;
  comp.state.voice = true;
  await comp.askBrisaAI('Explica el mapa');
  await new Promise(r => setTimeout(r, 25));
  assert.equal(comp.state.brisaAiMessages[1].source, 'openrouter');
  assert.equal(speechCalls.spoken.length, 1);
  assert.equal(speechCalls.spoken[0].text, 'Respuesta clara de Brisa.');
});

test('Proxy mode sends zero client keys to /api/openrouter and /api/elevenlabs', async () => {
  const seen = [];
  const fetchMock = async (url, init) => {
    seen.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    if (url === 'https://brisa-proxy.example/api/openrouter') {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ model: 'nvidia/nemotron-3.5-lightning:free', choices: [{ message: { content: 'Respuesta vía proxy.' } }] })
      };
    }
    if (url === 'https://brisa-proxy.example/api/elevenlabs') {
      return { ok: true, status: 200, blob: async () => new Blob([new Uint8Array([73, 68, 51, 1])], { type: 'audio/mpeg' }) };
    }
    throw new Error('Unexpected URL: ' + url);
  };
  const { comp } = createAppHarness({
    fetch: fetchMock,
    brisaConfig: { proxyBaseUrl: 'https://brisa-proxy.example' }
  });
  comp.state.brisaAiOpen = true;
  comp.state.voice = true;
  await comp.askBrisaAI('Hola por proxy');
  await new Promise(r => setTimeout(r, 25));
  assert.equal(seen.length, 2);
  assert.equal(seen[0].url, 'https://brisa-proxy.example/api/openrouter');
  assert.equal(seen[0].headers.Authorization, undefined);
  assert.equal(seen[1].url, 'https://brisa-proxy.example/api/elevenlabs');
  assert.equal(seen[1].headers['xi-api-key'], undefined);
  assert.equal(seen[1].body.voiceId, 'EXAVITQu4vr4xnSDxMaL');
  assert.equal(comp.state.brisaAiMessages[1].source, 'openrouter');
});

test('Zero-key public default mode uses offline verified guide and Web Speech fallback safely', async () => {
  const { comp, speechCalls } = createAppHarness();
  comp.state.brisaAiOpen = true;
  comp.state.voice = true;
  await comp.askBrisaAI('¿Qué es NASA SVS 5176?');
  await new Promise(r => setTimeout(r, 25));
  assert.equal(comp.state.brisaAiMessages[1].source, 'offline');
  assert.match(comp.state.brisaAiMessages[1].text, /SVS 5176/);
  assert.equal(speechCalls.spoken.length, 1);
});

test('Spotlight step builder, Flash v2.5 prefetch cache, and WAV encoder work cleanly', async () => {
  const ttsCalls = [];
  const fetchMock = async (url, init) => {
    if (url.includes('openrouter.ai')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ choices: [{ message: { content: 'Ves el mapa Pacífico y sus tonos cálidos.' } }] })
      };
    }
    if (url.includes('elevenlabs.io')) {
      ttsCalls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, status: 200, blob: async () => new Blob([new Uint8Array([73, 68, 51, 9])], { type: 'audio/mpeg' }) };
    }
    throw new Error('Unexpected URL: ' + url);
  };
  const { comp, exports, createdAudio } = createAppHarness({
    fetch: fetchMock,
    brisaConfig: { openrouterKeys: ['test-or-key'], elevenlabsKey: 'test-el-key' }
  });
  const wavB64 = exports.encodeBrisaPcmWavBase64([new Float32Array([0.1, -0.1, 0.25, -0.25])], 16000, 12000);
  const wavBytes = Buffer.from(wavB64, 'base64');
  assert.equal(wavBytes.slice(0, 4).toString('ascii'), 'RIFF');
  assert.equal(wavBytes.slice(8, 12).toString('ascii'), 'WAVE');

  comp.state.brisaAiOpen = true;
  comp.state.voice = false;
  await comp.askBrisaAI('¿Qué estoy viendo y qué significan los colores de -5 a +5?');
  await new Promise(r => setTimeout(r, 30));
  assert(comp.state.brisaSpotSteps.length >= 2, 'Spotlight steps should populate for colors question');
  assert.equal(ttsCalls.length, 1, 'Background prefetch should pre-warm ElevenLabs audio even with Voice mode off');
  assert.match(ttsCalls[0].url, /optimize_streaming_latency=3/);
  assert.equal(ttsCalls[0].body.model_id, 'eleven_flash_v2_5');
  assert.equal(createdAudio.length, 0, 'Prefetch must not auto-play when Voice mode is off');

  await comp.speakBrisaAI(comp.state.brisaAiMessages[1].id, true);
  assert.equal(ttsCalls.length, 1, 'Manual click on Escuchar must play immediately from prefetched cache');
  assert.equal(createdAudio.length, 1);
  comp.componentWillUnmount();
});
