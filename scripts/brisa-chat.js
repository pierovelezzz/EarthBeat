const api = '/api/brisa';
const guideVoiceCache = new Map();
let availableServices;

function getBrisaServices() {
  if (location.hostname.endsWith('.github.io')) return Promise.resolve({});
  availableServices ??= fetch(api, { cache: 'no-store', signal: AbortSignal.timeout(1400) })
    .then(response => response.ok && response.headers.get('content-type')?.includes('json') ? response.json() : {})
    .catch(() => ({}));
  return availableServices;
}

async function requestBrisaVoice(text, language, voice, signal, timeout) {
  const response = await fetch(api, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'voice', language, text, voice }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(timeout)])
  });
  return response.ok && response.headers.get('content-type')?.includes('audio/') ? response.blob() : null;
}

window.earthRhythmGuideVoice = async (text, language, signal) => {
  const services = await getBrisaServices();
  if (!services.voice || signal.aborted || !text || text.length > 600) return null;
  const key = language + ':' + text;
  if (guideVoiceCache.has(key)) return guideVoiceCache.get(key);
  try {
    const clip = await requestBrisaVoice(text, language, language === 'es' ? 'brisa' : 'sarah', signal, 2800);
    if (clip && !signal.aborted) {
      if (guideVoiceCache.size >= 48) guideVoiceCache.delete(guideVoiceCache.keys().next().value);
      guideVoiceCache.set(key, clip);
    }
    return clip;
  } catch { return null; }
};
window.earthRhythmSpanishVoice = (text, signal) => window.earthRhythmGuideVoice(text, 'es', signal);
const copy = {
  es: {
    launch: 'Habla con Brisa', assistant: 'Asistente IA', close: 'Cerrar', status: 'Conversación con Brisa',
    intro: '¡Hola! Soy Brisa. Pregúntame por el mapa, sus colores o cómo suena el Pacífico.',
    ask: 'Tu pregunta', placeholder: 'Pregunta por el mapa, la música o la banda…', send: 'Enviar', clear: 'Limpiar',
    speaker: 'Leer respuestas en voz alta', visual: 'Guía visual', now: '¿Qué estoy viendo ahora?',
    band: 'Los cinco músicos de la banda', dictate: 'Dictar', stopDictation: 'Detener dictado',
    dictating: 'Escuchando…', dictationError: 'El dictado no pudo continuar. Puedes escribir la pregunta.',
    waiting: 'Brisa está preparando una respuesta…', fallback: 'Brisa respondió con la ayuda integrada.', noVoice: 'La lectura en voz alta no está disponible en este dispositivo.',
    localAnswer: 'Puedo ayudarte a leer los mapas de la NASA, probar una imagen, conocer a los músicos o jugar con los discos. ¿Qué quieres explorar?',
    guest: 'Tú', agent: 'Brisa'
  },
  en: {
    launch: 'Talk to Brisa', assistant: 'AI assistant', close: 'Close', status: 'Conversation with Brisa',
    intro: 'Hi, I’m Brisa. Ask me about the map, its colors or what the Pacific sounds like.',
    ask: 'Your question', placeholder: 'Ask about the map, the music or the band…', send: 'Send', clear: 'Clear',
    speaker: 'Read replies aloud', visual: 'Visual guide', now: 'What am I looking at?',
    band: 'The five band musicians', dictate: 'Dictate', stopDictation: 'Stop dictation',
    dictating: 'Listening…', dictationError: 'Dictation stopped. You can type your question.',
    waiting: 'Brisa is preparing an answer…', fallback: 'Brisa replied using built-in help.', noVoice: 'Read aloud is unavailable on this device.',
    localAnswer: 'I can help you read NASA maps, try an image, meet the musicians or play with the discs. What would you like to explore?',
    guest: 'You', agent: 'Brisa'
  }
};

const topics = [
  {
    id: 'maps',
    match: /mapa|colores|temperatura|nasa|maps?|colors?|temperature/,
    es: ['¿Qué muestran los mapas?', 'Muestran dónde el Pacífico estuvo más cálido o más frío de lo habitual. En Escuchar, toca un color de la escala para ver qué significa.'],
    en: ['What do the maps show?', 'They show where the Pacific was warmer or cooler than usual. In Listen, select a color on the scale to learn what it means.']
  },
  {
    id: 'music',
    match: /melodia|datos|musica|sonido|melody|data|music|sound/,
    es: ['¿Cómo se convierte el mapa en música?', 'La página resume el mapa en una cuadrícula. Cada columna añade un paso a la música. Melodía usa a la banda y Datos convierte los colores en tonos.'],
    en: ['How does the map become music?', 'The page summarizes the map as a grid. Each column adds a step to the music. Melody uses the band, while Data turns colors into tones.']
  },
  {
    id: 'band',
    match: /banda|musicos|instrumento|band|musicians|instruments/,
    es: ['¿Quiénes tocan en la banda?', 'Silbo toca la quena, Inti la marimba, Mamacocha el arpa, Yaku el gotero e Illapa el timbal. Abre La banda y elige a un músico para escucharlo.'],
    en: ['Who plays in the band?', 'Silbo plays the quena, Inti the marimba, Mamacocha the harp, Yaku the musical dropper and Illapa the timpani. Open The Band and choose a musician to listen.']
  },
  {
    id: 'image',
    match: /imagen|foto|logo|subir|image|photo|upload/,
    es: ['¿Puedo usar mi imagen?', 'Abre ¿Cómo funciona? → Prueba práctica. Puedes probar con el logo de EarthRhythm o elegir una imagen de tu equipo. Se procesa en tu navegador.'],
    en: ['Can I use my own image?', 'Open How does it work? → Try it. Use the EarthRhythm logo or choose your own image. It is processed in your browser.']
  },
  {
    id: 'game',
    match: /jug|flecha|game|play|arrow/,
    es: ['¿Cómo juego?', 'En computadora, entra a Jugar y elige un disco. Pulsa cada flecha al llegar al recuadro. El mapa avanza durante la partida.'],
    en: ['How do I play?', 'On a computer, open Play and choose a disc. Press each arrow key when its note reaches the target. The map advances while you play.']
  }
];

const musicianAnswers = {
  silbo: ['Silbo toca la quena.', 'Silbo plays the quena flute.'],
  inti: ['Inti toca la marimba.', 'Inti plays the marimba.'],
  mamacocha: ['Mamacocha toca el arpa.', 'Mamacocha plays the harp.'],
  yaku: ['Yaku toca un gotero musical.', 'Yaku plays a musical dropper.'],
  illapa: ['Illapa toca el timbal.', 'Illapa plays the timpani.']
};

const speakerIcon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="waves" d="M16 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/><path class="mute" d="m16 10 5 5m0-5-5 5"/></svg>';

const markup = [
  '<style>',
  ':host{display:inline-grid;justify-items:start;font:inherit;color:var(--fg,#fff)}',
  'button,textarea{box-sizing:border-box;font:inherit;min-height:44px;color:inherit}',
  'button{padding:5px 10px;border:1px solid var(--line,#8ca6c5);border-radius:6px;background:var(--surface,#21344e);cursor:pointer}',
  'button:disabled{opacity:.65;cursor:default}button:focus-visible,textarea:focus-visible,.messages:focus-visible{outline:2px solid var(--accent,#ffd447);outline-offset:2px}',
  '.launch{display:grid;place-items:center;width:44px;height:44px;padding:0;border-radius:50%;border-color:#ffd447;background:var(--surface,#21344e)}',
  '.launch:hover{background:var(--panel,#202b38);border-color:var(--fg,#fff)}',
  ':host-context([data-theme="light"]) .launch{border-color:#785000}',
  ':host-context([data-contrast="true"]) .launch{border:2px solid currentColor}',
  '@media(forced-colors:active){.launch{border-color:ButtonText}}',
  'dialog{box-sizing:border-box;position:fixed;inset:0 0 0 auto;margin:0;width:min(420px,100%);height:100dvh;max-width:none;max-height:none;padding:0;overflow:auto;border:1px solid var(--line,#8ca6c5);border-radius:14px 0 0 14px;background:var(--bg,#171e2b);color:inherit;box-shadow:-16px 0 40px #0004}',
  'dialog::backdrop{background:#0003}',
  '.panel{box-sizing:border-box;display:grid;grid-template-rows:auto auto minmax(80px,1fr) auto;height:100%;gap:10px;padding:14px;min-width:0}',
  'header,.tools,.compose-actions{display:flex;align-items:center;gap:8px}header{padding-bottom:10px;border-bottom:1px solid var(--line,#8ca6c5)}',
  '.identity{flex:1;min-width:0}.assistant,.status{font-size:.84em;color:var(--muted,#c5d4e7)}.status:empty{display:none}',
  '.portrait{width:42px;height:42px;flex:none;object-fit:cover;border:1px solid #54dbc8;border-radius:50%;background:#03151c}',
  'dialog[data-talking] .portrait{outline:2px solid var(--fg,#fff);outline-offset:3px}',
  '.speaker,.close{display:grid;width:44px;flex:none;place-items:center;padding:0;border-radius:50%}',
  '.speaker[aria-pressed="true"]{background:var(--fg,#fff);color:var(--bg,#171e2b)}.speaker[aria-pressed="false"] .waves,.speaker[aria-pressed="true"] .mute{display:none}',
  '.tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.tools button,.compose-actions button{font-size:.86em}',
  '.tools button{display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;text-wrap:balance}',
  '.tools button:hover{border-color:var(--fg,#fff);background:var(--panel,#202b38)}.tools svg{flex:none}',
  '.band-prompt{grid-column:1/-1}',
  'h2,p{margin:0}h2{font-size:1.18em;line-height:1.2}',
  '.messages{display:grid;align-content:start;gap:9px;min-height:0;overflow:auto;overscroll-behavior:contain;overflow-wrap:anywhere;padding:2px}',
  '.message{display:grid;gap:4px;padding:10px 12px;line-height:1.4;border:1px solid var(--line,#8ca6c5);border-inline-start:3px solid var(--accent,#ffd447);border-radius:8px;background:var(--panel,#202b38)}',
  '.message[data-role="user"]{margin-inline-start:12%;border-inline-start-width:1px}.message strong{font-size:.84em}',
  '.compose{display:grid;gap:6px;min-width:0}.compose-actions{flex-wrap:wrap}.send{margin-inline-start:auto;background:var(--fg,#fff);color:var(--bg,#171e2b)}',
  'textarea{width:100%;padding:8px;border:1px solid var(--line,#8ca6c5);border-radius:6px;background:var(--panel,#202b38);resize:none}',
  '.ask-label{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}',
  '[hidden]{display:none!important}',
  '</style>',
  '<button type="button" class="launch" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg></button>',
  '<dialog aria-labelledby="heading"><div class="panel">',
  '<header><img class="portrait" src="./brisa/portrait.webp" alt=""><div class="identity"><p class="assistant"></p><h2 id="heading"></h2></div><button type="button" class="speaker" aria-pressed="false">' + speakerIcon + '</button><button type="button" class="close"><span aria-hidden="true">×</span></button></header>',
  '<div class="tools"><button type="button" class="visual"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg><span></span></button><button type="button" class="now"></button><button type="button" class="band-prompt"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M9 18V5l11-2v13M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></svg><span></span></button></div>',
  '<div class="messages" role="log" aria-live="polite" tabindex="0"></div>',
  '<form class="compose"><p class="status" role="status"></p><label class="ask-label" for="question"></label><textarea id="question" name="question" rows="2" maxlength="380" autocomplete="off" required></textarea>',
  '<div class="compose-actions"><button type="button" class="mic" hidden></button><button type="button" class="clear"></button><button type="submit" class="send"></button></div></form>',
  '</div></dialog>'
].join('');

class EarthRhythmBrisaChat extends HTMLElement {
  static observedAttributes = ['language', 'voice-mode'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = markup;
    this.services = {};
    this.history = [];
    try { this.chatVoice = localStorage.getItem('ts_brisa_chat_audio'); } catch {}
    this.find('.launch').addEventListener('click', () => this.openChat());
    this.find('.close').addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('cancel', () => this.cancelChat());
    this.dialog.addEventListener('close', () => this.cancelChat());
    this.dialog.addEventListener('keydown', event => { if (event.key === 'Escape') event.stopPropagation(); });
    this.find('form').addEventListener('submit', event => {
      event.preventDefault();
      this.send(this.find('textarea').value);
    });
    this.find('textarea').addEventListener('keydown', event => {
      if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
      event.preventDefault();
      this.find('form').requestSubmit();
    });
    this.find('.mic').addEventListener('click', () => this.dictate());
    this.find('.clear').addEventListener('click', () => {
      this.clearConversation();
      this.find('textarea').focus();
    });
    this.find('.speaker').addEventListener('click', () => this.toggleVoice());
    this.find('.visual').addEventListener('click', () => this.startGuide('visual'));
    this.find('.band-prompt').addEventListener('click', () => this.startGuide('band'));
    this.find('.now').addEventListener('click', () => {
      const reply = this.guide({ action: 'screen' });
      this.send(this.text.now, reply || this.localReply(this.text.now));
    });
  }

  find(selector) { return this.shadowRoot.querySelector(selector); }
  get dialog() { return this.find('dialog'); }
  get language() { return this.getAttribute('language') === 'en' ? 'en' : 'es'; }
  get text() { return copy[this.language]; }
  get voiceMode() { return this.chatVoice == null ? this.getAttribute('voice-mode') === 'true' : this.chatVoice === 'on'; }

  connectedCallback() {
    this.updateText();
    if (!this.find('.messages').children.length) this.addMessage('assistant', this.text.intro);
  }

  toggleVoice() {
    this.chatVoice = this.voiceMode ? 'off' : 'on';
    try { localStorage.setItem('ts_brisa_chat_audio', this.chatVoice); } catch {}
    this.updateSpeaker();
    if (!this.voiceMode) this.stopReading();
    else if (this.lastAnswer) void this.read();
  }

  updateSpeaker() {
    const button = this.find('.speaker');
    button.setAttribute('aria-label', this.text.speaker);
    button.setAttribute('aria-pressed', String(this.voiceMode));
    button.title = this.text.speaker;
  }

  guide(detail) {
    this.dispatchEvent(new CustomEvent('earthrhythm:chat-guide', { bubbles: true, detail }));
    return detail.reply;
  }

  startGuide(action) {
    const voice = this.voiceMode;
    this.dialog.close();
    this.cancelChat();
    this.guide({ action, voice, trigger: this.find('.launch') });
  }

  disconnectedCallback() { this.cancelChat(); }

  attributeChangedCallback(name, previous, current) {
    if (previous === current) return;
    if (name === 'voice-mode') {
      if (!this.voiceMode && this.reading) this.stopReading();
      this.updateSpeaker();
      return;
    }
    this.clearConversation();
    this.updateText();
  }

  updateText() {
    const text = this.text;
    this.find('.launch').setAttribute('aria-label', text.launch);
    this.find('.launch').title = text.launch;
    const labels = { h2: text.launch, '.assistant': text.assistant,
      '.ask-label': text.ask, '.send': text.send, '.clear': text.clear, '.visual span': text.visual,
      '.now': text.now, '.band-prompt span': text.band,
      '.mic': this.recognition ? text.stopDictation : text.dictate };
    for (const [selector, label] of Object.entries(labels)) this.find(selector).textContent = label;
    this.find('.close').setAttribute('aria-label', text.close);
    this.find('.close').title = text.close;
    this.find('textarea').placeholder = text.placeholder;
    this.find('.messages').setAttribute('aria-label', text.status);
    this.find('.mic').hidden = !(window.SpeechRecognition || window.webkitSpeechRecognition);
    this.updateSpeaker();
  }

  async openChat() {
    if (this.dialog.open) return;
    this.dispatchEvent(new CustomEvent('earthrhythm:chat-open', { bubbles: true }));
    this.dialog.showModal();
    this.find('textarea').focus();
    this.services = await getBrisaServices();
    this.updateText();
  }

  addMessage(role, value) {
    const row = document.createElement('div');
    row.className = 'message';
    row.dataset.role = role;
    const title = document.createElement('strong');
    title.textContent = role === 'user' ? this.text.guest : this.text.agent;
    const body = document.createElement('p');
    body.textContent = value;
    row.append(title, body);
    const log = this.find('.messages');
    log.append(row);
    log.scrollTop = log.scrollHeight;
  }

  localReply(question) {
    const normalized = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const named = Object.entries(musicianAnswers).find(([name]) => new RegExp('\\b' + name + '\\b').test(normalized));
    if (named) return { text: named[1][this.language === 'en' ? 1 : 0], clip: 'chat-' + named[0] };
    const topic = topics[1].match.test(normalized) ? topics[1] : topics.find(item => item.match.test(normalized));
    return topic ? { text: topic[this.language][1], clip: 'chat-' + topic.id } : { text: this.text.localAnswer, clip: 'chat-other' };
  }

  async send(question, fixedAnswer) {
    question = question.trim().slice(0, 380);
    if (!question || this.pending) return;
    this.stopReading();
    this.find('textarea').value = '';
    this.addMessage('user', question);
    let reply = fixedAnswer || this.localReply(question);
    if (this.services.chat && !fixedAnswer) {
      const request = this.pending = new AbortController();
      this.find('.send').disabled = true;
      this.find('.status').textContent = this.text.waiting;
      try {
        const result = await fetch(api, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chat', language: this.language, text: question, history: this.history.slice(-4),
            screen: document.querySelector('#main-content h1')?.textContent.trim() || ''
          }),
          signal: AbortSignal.any([request.signal, AbortSignal.timeout(10000)])
        });
        if (result.ok) {
          const data = await result.json();
          if (typeof data.answer === 'string' && data.answer.trim()) reply = { text: data.answer };
        }
      } catch {}
      if (this.pending !== request || !this.dialog.open) return;
      this.pending = null;
      this.find('.send').disabled = false;
      this.find('.status').textContent = reply.clip ? this.text.fallback : '';
    }
    this.addMessage('assistant', reply.text);
    this.history.push({ role: 'user', content: question }, { role: 'assistant', content: reply.text });
    this.history = this.history.slice(-4);
    this.lastAnswer = reply;
    if (this.voiceMode && this.dialog.open) void this.read();
  }

  async read() {
    if (this.reading) return;
    const reply = this.lastAnswer;
    if (!reply) return;
    const request = this.reading = new AbortController();
    if (this.services.voice) {
      try {
        const audio = await requestBrisaVoice(reply.text, this.language, this.language === 'es' ? 'brisa' : 'sarah', request.signal, 10000);
        if (audio) {
          if (this.reading !== request) return;
          this.audioUrl = URL.createObjectURL(audio);
          await this.playClip(this.audioUrl);
          return;
        }
      } catch {}
    }
    if (this.reading !== request) return;
    if (reply.clip) {
      try {
        await this.playClip('./brisa/' + this.language + '-' + reply.clip + '.mp3');
        return;
      } catch {}
    }
    if (this.reading !== request) return;
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      this.stopReading();
      this.find('.status').textContent = this.text.noVoice;
      return;
    }
    const utterance = new SpeechSynthesisUtterance(reply.text);
    utterance.lang = this.language === 'es' ? 'es-PE' : 'en-US';
    utterance.onstart = () => { if (this.reading === request) this.dialog.setAttribute('data-talking', ''); };
    utterance.onend = utterance.onerror = () => { if (this.reading === request) this.stopReading(); };
    this.utterance = utterance;
    speechSynthesis.speak(utterance);
  }

  async playClip(url) {
    const audio = this.audio = new Audio(url);
    await audio.play();
    if (this.audio === audio) {
      this.dialog.setAttribute('data-talking', '');
      audio.onended = audio.onerror = () => this.stopReading();
    }
  }

  stopReading() {
    this.reading?.abort();
    this.reading = null;
    if (this.audio) { this.audio.onended = this.audio.onerror = null; this.audio.pause(); this.audio = null; }
    if (this.audioUrl) { URL.revokeObjectURL(this.audioUrl); this.audioUrl = null; }
    if (this.utterance) { this.utterance = null; window.speechSynthesis?.cancel(); }
    this.dialog.removeAttribute('data-talking');
  }

  dictate() {
    if (this.recognition) { this.recognition.stop(); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = this.recognition = new Recognition();
    recognition.lang = this.language === 'es' ? 'es-PE' : 'en-US';
    recognition.onresult = event => {
      this.find('textarea').value = event.results[0][0].transcript.slice(0, 380);
      this.find('textarea').focus();
    };
    let error = false;
    const finish = () => {
      if (this.recognition !== recognition) return;
      this.recognition = null;
      this.find('.mic').textContent = this.text.dictate;
      this.find('.status').textContent = error ? this.text.dictationError : '';
    };
    recognition.onerror = () => { error = true; finish(); };
    recognition.onend = finish;
    this.find('.mic').textContent = this.text.stopDictation;
    this.find('.status').textContent = this.text.dictating;
    try { recognition.start(); } catch { error = true; finish(); }
  }

  clearConversation() {
    this.cancelChat();
    this.history = [];
    this.lastAnswer = null;
    this.find('.messages').replaceChildren();
    this.find('textarea').value = '';
    this.addMessage('assistant', this.text.intro);
  }

  cancelChat() {
    this.pending?.abort();
    this.pending = null;
    this.stopReading();
    if (this.recognition) { this.recognition.abort(); this.recognition = null; }
    this.find('.send').disabled = false;
    this.find('.mic').textContent = this.text.dictate;
    this.find('.status').textContent = '';
  }
}

customElements.define('earthrhythm-brisa-chat', EarthRhythmBrisaChat);
