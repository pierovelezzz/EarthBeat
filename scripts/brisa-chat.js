const api = '/api/brisa';
const spanishVoiceCache = new Map();
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

window.earthRhythmSpanishVoice = async (text, signal) => {
  const services = await getBrisaServices();
  if (!services.voice || signal.aborted || !text || text.length > 600) return null;
  if (spanishVoiceCache.has(text)) return spanishVoiceCache.get(text);
  try {
    const clip = await requestBrisaVoice(text, 'es', 'brisa', signal, 2800);
    if (clip && !signal.aborted) {
      if (spanishVoiceCache.size >= 48) spanishVoiceCache.delete(spanishVoiceCache.keys().next().value);
      spanishVoiceCache.set(text, clip);
    }
    return clip;
  } catch { return null; }
};
const copy = {
  es: {
    launch: 'Chat con Brisa', close: 'Cerrar', status: 'Brisa responde sobre EarthRhythm.',
    live: 'Las preguntas abiertas se envían a OpenRouter. Evita incluir datos personales.',
    local: 'Ayuda integrada. Elige una pregunta o escribe sobre los mapas, la música o la banda.',
    ask: 'Tu pregunta', send: 'Enviar', read: 'Leer la última respuesta', stop: 'Detener lectura',
    voice: 'Voz de ElevenLabs', dictate: 'Dictar', stopDictation: 'Detener dictado',
    dictating: 'Escuchando…', dictationError: 'El dictado no pudo continuar. Puedes escribir la pregunta.',
    waiting: 'Brisa está preparando una respuesta…', fallback: 'Brisa respondió con la ayuda integrada.', noVoice: 'La lectura en voz alta no está disponible en este dispositivo.',
    localAnswer: 'Puedo ayudarte a leer los mapas de la NASA, probar una imagen, conocer a los músicos o jugar con los discos. ¿Qué quieres explorar?',
    guest: 'Tú', agent: 'Brisa'
  },
  en: {
    launch: 'Chat with Brisa', close: 'Close', status: 'Brisa answers questions about EarthRhythm.',
    live: 'Open questions go to OpenRouter. Please leave out personal information.',
    local: 'Built-in help. Pick a question or ask about the maps, music or band.',
    ask: 'Your question', send: 'Send', read: 'Read the latest answer', stop: 'Stop reading',
    voice: 'ElevenLabs voice', dictate: 'Dictate', stopDictation: 'Stop dictation',
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

const markup = [
  '<style>',
  ':host{display:inline-grid;justify-items:start;font:inherit;color:var(--fg,#fff)}',
  'button,input,select{box-sizing:border-box;font:inherit;min-height:44px;color:inherit}',
  'button{padding:5px 10px;border:1px solid var(--line,#8ca6c5);border-radius:6px;background:var(--surface,#21344e);cursor:pointer}',
  'button:disabled{opacity:.65;cursor:default}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--accent,#ffd447);outline-offset:2px}',
  '.launch{font-size:.84em;font-weight:700;border-color:var(--fg,#fff)}',
  'dialog{box-sizing:border-box;position:fixed;inset:12px 12px 12px auto;margin:0;width:min(430px,calc(100% - 24px));height:fit-content;max-height:calc(100dvh - 24px);padding:0;overflow:auto;border:1px solid var(--line,#8ca6c5);border-radius:12px;background:var(--bg,#171e2b);color:inherit}',
  'dialog::backdrop{background:#0008}',
  '.panel{box-sizing:border-box;display:grid;gap:9px;padding:13px;min-width:0}',
  'header,.tools,form{display:flex;align-items:center;gap:8px;flex-wrap:wrap}header{justify-content:space-between}',
  'h2,p{margin:0}h2{font-size:1.18em}.note,.status{font-size:.85em;color:var(--muted,#c5d4e7)}.status:empty{display:none}',
  '.prompts{display:flex;flex-wrap:wrap;gap:6px}.prompts button{font-size:.84em}',
  '.messages{display:grid;gap:8px;max-height:min(42dvh,310px);overflow:auto;overscroll-behavior:contain;overflow-wrap:anywhere}',
  '.messages:empty{display:none}.message{display:grid;gap:3px;padding:8px 10px;border-inline-start:3px solid var(--accent,#ffd447);background:var(--panel,#202b38)}',
  '.message strong{font-size:.84em}.ask-label{flex-basis:100%;font-weight:700}',
  'input,select{max-width:100%;padding:5px 8px;border:1px solid var(--line,#8ca6c5);border-radius:6px;background:var(--panel,#202b38)}',
  'input{flex:1 1 140px;min-width:0}.tools label{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:.86em}',
  '[hidden]{display:none!important}',
  '</style>',
  '<button type="button" class="launch" aria-haspopup="dialog"></button>',
  '<dialog aria-labelledby="heading"><div class="panel">',
  '<header><h2 id="heading"></h2><button type="button" class="close"></button></header>',
  '<p class="note"></p><div class="prompts"></div>',
  '<div class="messages" role="log" aria-live="polite" tabindex="0"></div>',
  '<p class="status" role="status"></p>',
  '<form><label class="ask-label" for="question"></label><input id="question" name="question" type="text" maxlength="380" autocomplete="off" required>',
  '<button type="button" class="mic" hidden></button><button type="submit" class="send"></button></form>',
  '<div class="tools"><button type="button" class="read" disabled></button><label class="voices" hidden><span></span><select><option value="brisa">Brisa · Leoni Vergara</option><option value="sarah">Sarah</option><option value="aria">Aria</option><option value="laura">Laura</option></select></label></div>',
  '</div></dialog>'
].join('');

class EarthRhythmBrisaChat extends HTMLElement {
  static observedAttributes = ['language'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = markup;
    this.services = {};
    this.history = [];
    this.find('.launch').addEventListener('click', () => this.openChat());
    this.find('.close').addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('close', () => this.cancelChat());
    this.dialog.addEventListener('keydown', event => { if (event.key === 'Escape') event.stopPropagation(); });
    this.find('form').addEventListener('submit', event => {
      event.preventDefault();
      this.send(this.find('input').value);
    });
    this.find('.read').addEventListener('click', () => this.read());
    this.find('.mic').addEventListener('click', () => this.dictate());
    this.find('select').addEventListener('change', () => {
      try { localStorage.setItem('ts_brisa_chat_voice_'+this.language, this.find('select').value); } catch {}
      this.stopReading();
    });
  }

  find(selector) { return this.shadowRoot.querySelector(selector); }
  get dialog() { return this.find('dialog'); }
  get language() { return this.getAttribute('language') === 'en' ? 'en' : 'es'; }
  get text() { return copy[this.language]; }

  connectedCallback() {
    this.updateVoiceSelection();
    this.updateText();
  }

  updateVoiceSelection() {
    const spanish = this.language === 'es', select = this.find('select');
    select.options[0].hidden = !spanish;
    let voice;
    try { voice = localStorage.getItem('ts_brisa_chat_voice_'+this.language) || localStorage.getItem('ts_brisa_chat_voice'); } catch {}
    const choices = spanish ? ['brisa','sarah','aria','laura'] : ['sarah','aria','laura'];
    select.value = choices.includes(voice) ? voice : choices[0];
  }

  disconnectedCallback() { this.cancelChat(); }

  attributeChangedCallback(name, oldLanguage, newLanguage) {
    if (oldLanguage === newLanguage) return;
    if (this.dialog.open) this.clearConversation();
    this.updateVoiceSelection();
    this.updateText();
  }

  updateText() {
    const text = this.text;
    this.find('.launch').setAttribute('aria-label', text.launch);
    this.find('.launch').title = text.launch;
    const labels = { '.launch': 'Chat', h2: text.launch, '.close': text.close, '.ask-label': text.ask,
      '.send': text.send, '.read': this.reading ? text.stop : text.read,
      '.mic': this.recognition ? text.stopDictation : text.dictate, '.voices span': text.voice };
    for (const [selector, label] of Object.entries(labels)) this.find(selector).textContent = label;
    this.find('.messages').setAttribute('aria-label', text.status);
    this.find('.note').textContent = this.services.chat ? text.live : text.local;
    this.find('.voices').hidden = !this.services.voice;
    this.find('.mic').hidden = !(window.SpeechRecognition || window.webkitSpeechRecognition);
    this.find('.prompts').replaceChildren(...topics.slice(0, 3).map(topic => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = topic[this.language][0];
      button.addEventListener('click', () => this.send(topic[this.language][0], topic));
      return button;
    }));
  }

  async openChat() {
    if (this.dialog.open) return;
    this.dispatchEvent(new CustomEvent('earthrhythm:chat-open', { bubbles: true }));
    this.dialog.showModal();
    this.find('input').focus();
    this.services = await getBrisaServices();
    this.updateText();
  }

  addMessage(role, value) {
    const row = document.createElement('div');
    row.className = 'message';
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
    this.find('input').value = '';
    this.find('.prompts').hidden = true;
    this.addMessage('user', question);
    let reply = fixedAnswer ? { text: fixedAnswer[this.language][1], clip: 'chat-' + fixedAnswer.id } : this.localReply(question);
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
    this.find('.read').disabled = false;
  }

  async read() {
    if (this.reading) { this.stopReading(); return; }
    const reply = this.lastAnswer;
    if (!reply) return;
    const request = this.reading = new AbortController();
    this.find('.read').textContent = this.text.stop;
    if (this.services.voice) {
      try {
        const audio = await requestBrisaVoice(reply.text, this.language, this.find('select').value, request.signal, 10000);
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
    utterance.onend = utterance.onerror = () => { if (this.reading === request) this.stopReading(); };
    this.utterance = utterance;
    speechSynthesis.speak(utterance);
  }

  async playClip(url) {
    const audio = this.audio = new Audio(url);
    await audio.play();
    if (this.audio === audio) audio.onended = audio.onerror = () => this.stopReading();
  }

  stopReading() {
    this.reading?.abort();
    this.reading = null;
    if (this.audio) { this.audio.onended = this.audio.onerror = null; this.audio.pause(); this.audio = null; }
    if (this.audioUrl) { URL.revokeObjectURL(this.audioUrl); this.audioUrl = null; }
    if (this.utterance) { this.utterance = null; window.speechSynthesis?.cancel(); }
    this.find('.read').textContent = this.text.read;
  }

  dictate() {
    if (this.recognition) { this.recognition.stop(); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = this.recognition = new Recognition();
    recognition.lang = this.language === 'es' ? 'es-PE' : 'en-US';
    recognition.onresult = event => {
      this.find('input').value = event.results[0][0].transcript.slice(0, 380);
      this.find('input').focus();
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
    this.find('.prompts').hidden = false;
    this.find('.read').disabled = true;
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
