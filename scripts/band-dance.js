// The four drawings and the dance order come from the original 2D band.
const frames = [0, 1, 2, 3, 2, 1, 2, 0];
const media = matchMedia('(prefers-reduced-motion: reduce)');
const version = new URL(import.meta.url).search;
const drawings = new Map();
const reduced = () => {
  const effective = document.documentElement.dataset.tsReducedMotion;
  return effective === undefined ? media.matches : effective === 'true';
};
const playingFrames = [0, 1, 2, 3, 2, 1, 0];
const timings = {
  silbo: [210, 230, 260, 175, 280, 210, 260], inti: [180, 250, 170, 145, 210, 170, 245],
  mama: [180, 240, 280, 180, 230, 240, 250], yaku: [135, 175, 175, 155, 180, 170, 210],
  illapa: [240, 210, 155, 150, 220, 175, 280],
};

function loadDrawings(character) {
  if (!drawings.has(character)) {
    const images = Array.from({ length: 4 }, (_, index) => {
      const img = new Image();
      img.fetchPriority = 'low';
      img.src = new URL(`../sprites/${character}/baile/0${index}.webp${version}`, import.meta.url).href;
      return img;
    });
    drawings.set(character, Promise.all(images.map(img => img.decode())).then(() => images).catch(error => {
      drawings.delete(character);
      throw error;
    }));
  }
  return drawings.get(character);
}

class BandDance extends HTMLElement {
  static observedAttributes = ['data-character', 'data-playing'];
  index = 0;
  run = 0;

  connectedCallback() {
    // The template can connect before its image child has been inserted.
    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.image = this.querySelector('img');
      if (!this.image) return;
      this.art = document.createElement('img');
      this.art.className = 'bportrait dance-frame';
      this.art.alt = '';
      this.append(this.art);
      if (typeof IntersectionObserver === 'function') {
        this.visibility = new IntersectionObserver(([entry]) => {
          this.inView = entry.isIntersecting;
          this.sync();
        }, { rootMargin: '40px' });
        this.visibility.observe(this.closest('.bshow') || this);
      } else this.inView = true;
      this.refresh = () => this.sync();
      document.addEventListener('visibilitychange', this.refresh);
      window.addEventListener('terrasonic:motion', this.refresh);
      media.addEventListener('change', this.refresh);
      if (this.inView) this.sync();
    });
  }

  disconnectedCallback() {
    this.visibility?.disconnect();
    document.removeEventListener('visibilitychange', this.refresh);
    window.removeEventListener('terrasonic:motion', this.refresh);
    media.removeEventListener('change', this.refresh);
    this.stop(false);
    this.art?.remove();
  }

  attributeChangedCallback(name, previous, next) {
    if (previous === next || !this.art) return;
    if (name === 'data-playing') { this.sync(); return; }
    this.userPaused = false;
    this.index = 0;
    this.images = null;
    this.stop(false);
    this.art.removeAttribute('src');
    this.removeAttribute('data-dancing');
    this.removeAttribute('data-frame');
    this.sync();
  }

  sync() {
    if (!this.isConnected || !this.art) return;
    if (reduced() || this.dataset.playing === 'false') {
      this.stop(false);
      this.removeAttribute('data-dancing');
    } else if (document.hidden || !this.inView) this.stop(true);
    else if (!this.userPaused && !this.running && !this.loading) this.start();
    this.report();
  }

  async start() {
    if (this.loading || this.running || !this.dataset.character || reduced()) return;
    this.loading = true;
    this.report();
    const run = ++this.run;
    try {
      const images = await loadDrawings(this.dataset.character);
      if (run !== this.run || !this.isConnected) return;
      this.images = images;
      this.loading = false;
      this.running = true;
      this.report();
      if (this.motion) this.motion.play();
      else if (!this.dataset.playing) this.motion = this.art.animate?.([
        { transform: 'translateY(0) rotate(-2deg)' },
        { transform: 'translateY(-2%) rotate(2deg)', offset: .5 },
        { transform: 'translateY(0) rotate(-2deg)' },
      ], { duration: 1280, iterations: Infinity, easing: 'ease-in-out' });
      this.tick();
    } catch {
      if (run !== this.run) return;
      this.stop(false);
      this.report();
    }
  }

  tick() {
    const sequence = this.dataset.playing ? playingFrames : frames;
    const frame = sequence[this.index];
    this.art.src = this.images[frame].src;
    this.dataset.frame = String(frame);
    this.setAttribute('data-dancing', '');
    this.timer = setTimeout(() => {
      this.index = (this.index + 1) % sequence.length;
      this.tick();
    }, this.dataset.playing ? timings[this.dataset.character][this.index] : 160);
  }

  stop(freeze) {
    ++this.run;
    clearTimeout(this.timer);
    this.running = this.loading = false;
    if (freeze) this.motion?.pause();
    else { this.motion?.cancel(); this.motion = null; }
  }

  toggleDance() {
    if (reduced()) return;
    this.userPaused = this.running || this.loading;
    if (this.userPaused) this.stop(true);
    else this.sync();
    this.report();
  }

  report() {
    if (this.dataset.playing === undefined) this.dispatchEvent(new CustomEvent('earthbeat-dance-state', { bubbles: true }));
  }
}

class DanceButton extends HTMLElement {
  connectedCallback() {
    this.dance = this.closest('.bshow').querySelector('earthbeat-dance');
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'btn sm';
    this.button.onclick = () => this.dance.toggleDance();
    this.replaceChildren(this.button);
    this.update = () => {
      const on = this.dance.running || this.dance.loading;
      const spanish = document.documentElement.lang === 'es';
      this.button.textContent = on ? (spanish ? 'Pausar baile' : 'Pause dance') : (spanish ? 'Bailar' : 'Dance');
      this.button.disabled = reduced();
    };
    this.dance.addEventListener('earthbeat-dance-state', this.update);
    this.language = new MutationObserver(this.update);
    this.language.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    this.update();
  }

  disconnectedCallback() {
    this.dance?.removeEventListener('earthbeat-dance-state', this.update);
    this.language?.disconnect();
  }
}

customElements.define('earthbeat-dance', BandDance);
customElements.define('earthbeat-dance-button', DanceButton);

class StageNoteTrack extends HTMLElement {
  static observedAttributes = ['data-hit', 'data-audible'];
  cues = new Map();

  clear = () => {
    cancelAnimationFrame(this.frame);
    this.frame = null;
    this.cues.forEach(note => note.remove());
    this.cues.clear();
    clearTimeout(this.strikeTimer);
    this.removeAttribute('data-strike');
  };

  connectedCallback() {
    window.addEventListener('earthbeat-stage-queue', this.queue);
    window.addEventListener('terrasonic:motion', this.clear);
    document.addEventListener('visibilitychange', this.clear);
  }

  disconnectedCallback() {
    window.removeEventListener('earthbeat-stage-queue', this.queue);
    window.removeEventListener('terrasonic:motion', this.clear);
    document.removeEventListener('visibilitychange', this.clear);
    this.clear();
  }

  attributeChangedCallback(name, previous, value) {
    if (previous === value || !this.isConnected) return;
    if (name === 'data-audible' && value !== 'true') this.clear();
    if (name !== 'data-hit' || !value || document.hidden) return;
    // The template writes the hit ID and its kind in the same render.
    queueMicrotask(() => {
      if (!this.isConnected || this.dataset.hit !== value || this.dataset.audible !== 'true') return;
      this.dataset.strike = this.dataset.kind || 'note';
      clearTimeout(this.strikeTimer);
      this.strikeTimer = setTimeout(() => this.removeAttribute('data-strike'), reduced() ? 680 : 170);
    });
  }

  queue = ({ detail: { clock, notes, lookahead } }) => {
    if (this.dataset.audible !== 'true' || reduced() || document.hidden) return;
    const receptor = this.querySelector('.stage-receptor');
    if (!receptor) return;
    const key = this.dataset.character;
    this.clock = clock;
    this.lookahead = lookahead;
    for (const event of notes) {
      const kind = event.fired[key];
      if (!kind || event.at <= clock.currentTime) continue;
      const motion = document.createElement('span');
      motion.className = 'stage-note-motion';
      const note = receptor.cloneNode(true);
      note.setAttribute('class', 'stage-note');
      note.dataset.note = kind === true ? 'note' : kind;
      motion.append(note);
      this.cues.set(event.at, motion);
      this.append(motion);
    }
    if (this.cues.size && this.frame == null) this.advance();
  };

  advance = () => {
    const now = this.clock.currentTime;
    this.cues.forEach((motion, at) => {
      if (at <= now) {
        motion.remove();
        this.cues.delete(at);
      } else {
        motion.style.transform = 'translateY(' + Math.min(100, 100 * (at - now) / this.lookahead) + '%)';
      }
    });
    this.frame = this.cues.size ? requestAnimationFrame(this.advance) : null;
  };
}

customElements.define('earthbeat-note-track', StageNoteTrack);

const arrowKeys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];

class RhythmGame extends HTMLElement {
  static observedAttributes = ['data-playing', 'data-ended'];
  notes = [];
  resultTimers = new Map();
  hits = 0;
  missed = 0;

  connectedCallback() {
    this.lanes = [...this.querySelectorAll('.rhythm-runway')];
    this.score = this.querySelector('[data-score]');
    this.feedback = this.querySelector('[data-feedback]');
    this.summary = this.querySelector('[data-summary]');
    this.resultSlots = this.lanes.map(lane => lane.querySelector('.rhythm-result'));
    this.resultArt = {
      hit: this.querySelector('[data-result-art="hit"]'),
      miss: this.querySelector('[data-result-art="miss"]')
    };
    this.addEventListener('keydown', this.press);
    window.addEventListener('earthrhythm-game-queue', this.queue);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.press);
    window.removeEventListener('earthrhythm-game-queue', this.queue);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.clear();
  }

  announce(es, en) {
    const message = document.documentElement.lang === 'es' ? es : en;
    if (this.feedback) this.feedback.textContent = message;
    return message;
  }

  showResult(index, kind, es, en) {
    const slot = this.resultSlots[index];
    clearTimeout(this.resultTimers.get(slot));
    slot.replaceChildren(this.resultArt[kind].cloneNode(true));
    this.resultTimers.set(slot, setTimeout(() => {
      slot.replaceChildren();
      this.resultTimers.delete(slot);
    }, 640));
    this.announce(es, en);
  }

  attributeChangedCallback(name, previous, value) {
    if (previous === value || !this.isConnected) return;
    if (name === 'data-playing' && value === 'false') this.clear();
    if (name === 'data-ended' && value === 'true') {
      const total = this.hits + this.missed;
      this.summary.textContent = this.announce(`Fin · ${this.hits} de ${total}`, `Done · ${this.hits} of ${total}`);
    }
  }

  resetScore() {
    this.hits = this.missed = 0;
    this.score.textContent = '0';
    this.summary.textContent = '';
    this.announce('', '');
  }

  onVisibility = () => { if (document.hidden) this.clear(); };

  clear() {
    cancelAnimationFrame(this.frame);
    this.frame = null;
    for (const note of this.notes) note.flight.remove();
    this.notes = [];
    this.lanes?.forEach(lane => lane.removeAttribute('data-cue'));
    for (const [slot, timer] of this.resultTimers) {
      clearTimeout(timer);
      slot.replaceChildren();
    }
    this.resultTimers.clear();
  }

  queue = ({ detail: { clock, notes, lookahead } }) => {
    if (this.dataset.playing !== 'true' || document.hidden) return;
    this.clock = clock;
    this.lookahead = lookahead;
    for (const event of notes) {
      if (event.patch.col % 4 !== 2 || !event.info.k) continue;
      // w and c are the positive and negative means over the same valid pixels.
      const mean = event.info.w - event.info.c;
      const index = Math.abs(mean) >= 2 ? 3 : mean <= -.5 ? 0 : mean >= .5 ? 2 : 1;
      const lane = this.lanes[index];
      const flight = document.createElement('span');
      flight.className = 'rhythm-flight';
      flight.setAttribute('aria-hidden', 'true');
      const arrow = document.createElement('span');
      arrow.className = 'rhythm-note';
      arrow.append(lane.querySelector('.rhythm-receptor svg').cloneNode(true));
      flight.append(arrow);
      lane.append(flight);
      this.notes.push({ at: event.at, index, flight });
    }
    if (this.notes.length && this.frame == null) this.advance();
  };

  // The stationary version allows a longer response window.
  windowSize() { return reduced() ? .34 : .22; }

  advance = () => {
    const now = this.clock.currentTime;
    const still = reduced();
    const margin = this.windowSize();
    const active = new Set();
    this.notes = this.notes.filter(note => {
      const left = note.at - now;
      if (left < -margin) {
        note.flight.remove();
        this.missed++;
        this.showResult(note.index, 'miss', 'Se escapó una nota', 'Missed a note');
        return false;
      }
      note.flight.hidden = still;
      if (Math.abs(left) <= margin) active.add(note.index);
      if (!still) note.flight.style.transform = `translateY(${Math.max(0, left / this.lookahead * 100)}%)`;
      return true;
    });
    this.lanes.forEach((lane, index) => lane.toggleAttribute('data-cue', active.has(index)));
    this.frame = this.notes.length ? requestAnimationFrame(this.advance) : null;
  };

  press = (event) => {
    const index = arrowKeys.indexOf(event.key);
    if (index < 0 || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    if (event.repeat || this.dataset.playing !== 'true' || !this.clock) return;
    const now = this.clock.currentTime;
    const note = this.notes.filter(note => note.index === index && Math.abs(now - note.at) <= this.windowSize())
      .sort((a, b) => Math.abs(now - a.at) - Math.abs(now - b.at))[0];
    if (!note) return;
    note.flight.remove();
    this.notes.splice(this.notes.indexOf(note), 1);
    this.score.textContent = String(++this.hits);
    this.showResult(index, 'hit', '¡Acierto!', 'Hit!');
  };
}

customElements.define('earthrhythm-game', RhythmGame);
