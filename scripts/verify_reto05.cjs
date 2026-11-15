const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { launchBrowser } = require('./browser_fixture.cjs');

const site = path.resolve(process.argv[2] || '_site');
const output = path.resolve(process.argv[3] || '_work/reto05/reto');
const base = 'http://terrasonic.test/';

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await launchBrowser({ executablePath: process.env.TERRASONIC_CHROMIUM });
  const errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    await context.route('**/*', route => {
      const url = route.request().url();
      if (/^(blob:|data:)/.test(url)) return route.continue();
      if (!url.startsWith(base)) return route.abort();
      const file = path.resolve(site, new URL(url).pathname.slice(1) || 'index.html');
      return file.startsWith(site + path.sep) && fs.existsSync(file)
        ? route.fulfill({ path: file }) : route.fulfill({ status: 404 });
    });
    await context.addInitScript(() => {
      if (!localStorage.getItem('ts_lang')) localStorage.setItem('ts_lang', 'es');
      if (!localStorage.getItem('ts_prefs')) {
        localStorage.setItem('ts_prefs', JSON.stringify({
          version: 1, configured: true, values: { voice: true, reducedMotion: true, sfx: false }
        }));
      }
      const NativeAudio = window.Audio;
      window.Audio = function (...args) {
        const audio = new NativeAudio(...args);
        audio.muted = true;
        const play = audio.play.bind(audio);
        audio.play = () => window.narrationError
          ? Promise.reject(new DOMException('Test fixture', window.narrationError)) : play();
        return audio;
      };
      Object.defineProperty(window, 'speechSynthesis', { value: {
        getVoices: () => [{ lang: 'es-PE' }, { lang: 'en-US' }],
        speak: value => { window.spokenFallback = value.text; },
        cancel: () => {}
      } });
      window.SpeechSynthesisUtterance = function (text) { this.text = text; };
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    const intro = page.locator('.ts-cinema h2');
    await intro.waitFor();
    assert.equal(await intro.textContent(), 'No solo mostramos nuestro planeta. Le damos voz.');
    assert.equal(await intro.evaluate(el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
    await page.locator('.cinema-skip').press('Enter');

    await page.evaluate(() => { window.narrationError = 'NotAllowedError'; });
    await page.locator('#tour-nav button').first().press('Enter');
    const notice = page.locator('.section-voice-status');
    await notice.getByText(/Pulsa el botón de bocina/).waitFor();
    assert.equal(await page.evaluate(() => window.spokenFallback), undefined);

    const speaker = page.getByRole('button', { name: 'Escuchar voz', exact: true });
    assert.equal(await speaker.textContent(), '');
    assert.equal(await speaker.locator('svg').getAttribute('aria-hidden'), 'true');
    await page.evaluate(() => { window.narrationError = 'NotSupportedError'; });
    await speaker.press('Enter');
    await page.waitForFunction(() => !!window.spokenFallback);
    await page.getByRole('button', { name: 'Detener voz', exact: true }).press('Enter');

    await page.evaluate(() => { window.narrationError = null; });
    const assetsPlayed = page.waitForResponse(response => response.url().endsWith('/brisa/es-juke-1.mp3'));
    await speaker.press('Enter');
    assert((await assetsPlayed).ok());
    await page.getByRole('button', { name: 'Detener voz', exact: true }).press('Enter');
    await page.locator('#tour-a11y summary').press('Enter');
    await page.getByRole('button', { name: 'Modo voz', exact: true }).press('Enter');
    await page.keyboard.press('Escape');

    await page.locator('.discgrid .dcard').nth(2).press('Enter');
    const player = page.locator('.player-layout');
    await player.waitFor();
    await page.locator('#tour-frame img.map').evaluate(image => image.decode());
    await page.locator('#tour-machine canvas.heard').waitFor();
    const panels = player.locator(':scope > .vpanel, :scope > .listen-band');
    const bounds = await panels.evaluateAll(elements => elements.map(el => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, left: rect.left };
    }));
    assert.equal(bounds.length, 3);
    assert(bounds.every(rect => Math.abs(rect.top - bounds[0].top) < 1));
    assert(bounds[0].left < bounds[1].left && bounds[1].left < bounds[2].left);
    assert(Math.abs(bounds[0].bottom - bounds[2].bottom) < 1);
    assert.equal(await page.locator('.stage-musician[aria-pressed="true"]').count(), 5);
    await page.locator('.stage-musician').first().press('Space');
    assert.equal(await page.locator('.stage-musician[aria-pressed="true"]').count(), 4);
    await page.locator('.stage-musician').first().press('Space');
    const swatches = page.locator('.legend-choice');
    assert.equal(await swatches.count(), 14);
    assert.equal(await swatches.nth(1).textContent(), '+3,6');
    await swatches.last().press('Enter');
    assert.match(await page.locator('.legend-reading').textContent(), /−4 °C · Frío extremo/);
    await page.locator('.mode-help summary').press('Enter');
    assert.match(await page.locator('.mode-help dl').textContent(), /sin acordes/);
    await page.locator('.mode-help summary').press('Enter');
    assert.equal(await page.locator('.event-history, #easy-explanation, #tour-more').count(), 0);
    await page.locator('.scr').evaluate(el => { el.scrollTop = 0; });
    await page.screenshot({ path: path.join(output, 'reproductor-es.png') });

    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await player.evaluate(el => el.scrollWidth), await player.evaluate(el => el.clientWidth));
    await page.getByRole('button', { name: 'English', exact: true }).press('Enter');
    assert.equal(await swatches.nth(1).textContent(), '+3.6');
    await page.getByRole('button', { name: 'Change disc', exact: true }).press('Enter');
    await page.locator('#tour-sets button').nth(1).press('Enter');
    await page.locator('.discgrid .dcard').first().press('Enter');
    assert.equal(await swatches.first().textContent(), '+3');
    assert.equal(await swatches.last().textContent(), '−3');
    assert.match(await swatches.first().getAttribute('aria-label'), /≈ \+3 °C/);
    await page.locator('#tour-nav button').nth(3).press('Enter');
    await page.getByRole('button', { name: 'NASA data', exact: true }).press('Enter');
    const sourceCards = page.locator('.nasa-source-layout');
    await sourceCards.waitFor();
    assert.equal(await sourceCards.locator('section').count(), 2);
    assert.equal(await sourceCards.locator('a[href^="https://"]').count(), 3);
    assert.equal(await sourceCards.locator('a[href*="impacts"]').count(), 0);

    await page.setViewportSize({ width: 1366, height: 768 });
    await page.screenshot({ path: path.join(output, 'fuentes-en.png') });
    await page.getByRole('button', { name: 'Credits and AI use', exact: true }).press('Enter');
    const credits = page.locator('.credits-layout');
    assert.equal(await credits.locator('section').count(), 3);
    assert.equal(await credits.getByRole('heading', { name: 'Scientific sources' }).count(), 0);
    await page.screenshot({ path: path.join(output, 'creditos-en.png') });

    await page.reload();
    await intro.waitFor();
    assert.equal(await intro.textContent(), 'We don’t just visualize our planet. We give it a voice.');
    assert.deepEqual(errors, []);
    console.log('PASS intro ES/EN, blocked and fallback voice, MP3, 3-column player, 14 source-specific °C swatches, responsive layout, NASA sources and credits.');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
