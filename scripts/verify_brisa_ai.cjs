// End-to-end verification of Brisa AI assistant (OpenRouter + ElevenLabs TTS + WCAG accessibility).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { launchBrowser } = require('./browser_fixture.cjs');

const site = path.resolve(process.argv[2] || '_site');
const output = path.resolve(process.argv[3] || '_work/test-brisa-ai');
const base = 'http://terrasonic.test/';
const sampleMp3Path = path.join(site, 'brisa', 'en-band-1.mp3');
const axePath = process.env.TERRASONIC_AXE || '';

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const sampleMp3 = fs.readFileSync(sampleMp3Path);
  const axeSource = axePath && fs.existsSync(axePath) ? fs.readFileSync(axePath, 'utf8') : '';
  const browser = await launchBrowser({ executablePath: process.env.TERRASONIC_CHROMIUM, args: ['--no-sandbox'] });
  const report = { checks: [], errors: [], openrouterCalls: [], elevenlabsCalls: [] };
  let failNetwork = false;

  try {
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
    await context.route('**/*', async route => {
      const url = route.request().url();
      if (url.startsWith(base)) {
        const rel = new URL(url).pathname.slice(1) || 'index.html';
        const file = path.resolve(site, rel);
        return file.startsWith(site + path.sep) && fs.existsSync(file)
          ? route.fulfill({ path: file })
          : route.fulfill({ status: 404 });
      }
      if (url.startsWith('https://openrouter.ai/api/v1/chat/completions') || url === 'https://brisa-proxy.test/api/openrouter') {
        const body = JSON.parse(route.request().postData() || '{}');
        report.openrouterCalls.push({
          model: body.model,
          viaProxy: url.startsWith('https://brisa-proxy.test/'),
          auth: route.request().headers().authorization || '',
          messages: body.messages
        });
        if (failNetwork) {
          return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'simulated offline' }) });
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            model: body.model,
            choices: [{
              message: {
                content: 'Hola, soy Brisa. Aquí ves el ciclón Yaku en marzo de 2023 con anomalías cálidas.\n\nLos datos combinan NASA GIBS y niveles musicales de −5 a +5.'
              }
            }]
          })
        });
      }
      if (url.startsWith('https://api.elevenlabs.io/v1/text-to-speech/') || url === 'https://brisa-proxy.test/api/elevenlabs') {
        const body = JSON.parse(route.request().postData() || '{}');
        const viaProxy = url.startsWith('https://brisa-proxy.test/');
        report.elevenlabsCalls.push({
          url,
          viaProxy,
          voiceId: viaProxy ? body.voiceId : url.split('/text-to-speech/')[1].split('?')[0],
          hasKey: !!route.request().headers()['xi-api-key'],
          body
        });
        if (failNetwork) {
          return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'simulated offline' }) });
        }
        return route.fulfill({
          status: 200,
          headers: { 'Content-Type': 'audio/mpeg', 'Access-Control-Allow-Origin': '*' },
          body: sampleMp3
        });
      }
      return route.abort();
    });

    await context.addInitScript(() => {
      localStorage.setItem('ts_lang', 'es');
      localStorage.setItem('ts_prefs', JSON.stringify({ version: 1, configured: true, values: { sfx: false } }));
      Object.defineProperty(window, 'DCLogic', {
        configurable: true,
        set(value) {
          Object.defineProperty(window, 'DCLogic', { value, writable: true, configurable: true });
          const original = value.prototype.setState;
          value.prototype.setState = function (...args) {
            window.__app = this;
            return original.apply(this, args);
          };
        }
      });
    });

    const page = await context.newPage();
    page.on('pageerror', err => report.errors.push('pageerror: ' + err.message));
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('503')) {
        report.errors.push('console.error: ' + msg.text());
      }
    });

    await page.goto(base);
    await page.waitForFunction(() => window.__app);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      var c = window.EARTH_BRISA_CONFIG;
      if (c && (!c.openrouterKeys || !c.openrouterKeys.length) && !c.proxyBaseUrl) {
        c.proxyBaseUrl = 'https://brisa-proxy.test';
      }
    });

    // 1. Open from Home trigger + verify right-docked adaptive panel (non-inert main, 44px controls, Escape restore)
    const homeMainBefore = await page.locator('.px > main').evaluate(el => el.getBoundingClientRect().width);
    const homeBtn = page.locator('.home-process #brisa-ai-open');
    await homeBtn.focus();
    await homeBtn.click();
    await page.waitForSelector('#brisa-ai-dialog');
    assert.equal(await page.locator('#brisa-ai-dialog').getAttribute('aria-modal'), 'false');
    assert(await page.evaluate(() => document.querySelector('#brisa-ai-dialog').contains(document.activeElement)), 'Focus must move inside #brisa-ai-dialog');
    assert(await page.evaluate(() => !document.querySelector('.px > main')?.inert), 'Background main must stay interactive while Brisa panel is docked');
    assert(await page.evaluate(() => document.querySelector('.px.app')?.classList.contains('brisa-ai-docked')), 'Root app must toggle brisa-ai-docked');

    const homeGeom = await page.locator('#brisa-ai-dialog').evaluate((el, prevMainW) => {
      const box = el.getBoundingClientRect();
      const mainBox = document.querySelector('.px > main').getBoundingClientRect();
      const smallTargets = [...el.querySelectorAll('button, input, select, textarea')]
        .filter(c => c.getClientRects().length)
        .map(c => ({ cls: c.className || c.id, h: c.getBoundingClientRect().height, w: c.getBoundingClientRect().width }))
        .filter(c => c.h < 43.9 || c.w < 43.9);
      return {
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        docOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        top: box.top,
        right: box.right,
        left: box.left,
        bottom: box.bottom,
        innerH: innerHeight,
        innerW: innerWidth,
        mainShrank: mainBox.width < prevMainW - 200 && mainBox.right <= box.left + 2,
        voiceOptions: document.querySelectorAll('#brisa-ai-voice-quick option').length,
        smallTargets
      };
    }, homeMainBefore);
    assert(homeGeom.scrollW <= homeGeom.clientW + 1, 'Dialog horizontal overflow on desktop');
    assert.equal(homeGeom.docOverflow, false, 'Document overflow with dialog open');
    assert(homeGeom.mainShrank, 'Main workspace must shrink cleanly to the left of right-docked Brisa panel');
    assert.equal(homeGeom.voiceOptions, 6, 'Quick voice selector must expose 6 ElevenLabs voices');
    assert.deepEqual(homeGeom.smallTargets, [], 'Dialog interactive controls must be >= 44px: ' + JSON.stringify(homeGeom.smallTargets));
    report.checks.push('desktop-home-docked-geometry-and-adaptive-layout');

    // Escape from docked panel restores focus cleanly
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#brisa-ai-dialog'));
    assert(await page.evaluate(() => document.activeElement?.id === 'brisa-ai-open'), 'Escape must restore focus to launcher');
    report.checks.push('desktop-docked-escape-restore');

    // 2. Open from #tour-card
    await page.locator('.home-process #tour-guide').click();
    await page.waitForSelector('#tour-card');
    await page.locator('#tour-card .tour-ai-open').click();
    await page.waitForSelector('#brisa-ai-dialog');
    assert.equal(await page.locator('#tour-card').count(), 0, 'Opening Brisa AI from tour card closes tour card cleanly');
    await page.locator('#brisa-ai-close').click();
    await page.waitForFunction(() => !document.querySelector('#brisa-ai-dialog'));
    report.checks.push('launch-from-tour-card');

    // 3. Navigate to Player -> Yaku March 2023 -> Open via bottomnav -> Test OpenRouter + Voice mode (ElevenLabs) + Ducking + Cache + Voice switch
    await page.evaluate(() => {
      __app.goTab('juke');
    });
    await page.waitForFunction(() => !__app.state.trans);
    await page.evaluate(() => {
      __app.applySet('prev');
      __app.setState({ disc: 3, frame: 2 });
    });
    await page.evaluate(() => {
      __app.master = __app.master || { gain: { value: 0.8 } };
      __app.master.gain.value = 0.8;
    });

    await page.locator('.bottomnav #brisa-ai-open').click();
    await page.waitForSelector('#brisa-ai-dialog');
    const contextStrip = await page.locator('.brisa-ai-context').textContent();
    assert(contextStrip.includes('Yaku'), 'Context strip should show live Yaku disc: ' + contextStrip);

    // Enable Voice mode ("Modo voz")
    const voiceToggle = page.locator('.brisa-ai-voice-toggle');
    await voiceToggle.click();
    assert.equal(await voiceToggle.getAttribute('aria-pressed'), 'true');

    // Send a prompt via Shift+Enter newline + Enter submit
    const input = page.locator('#brisa-ai-input');
    await input.fill('¿Qué es Yaku aquí');
    await input.press('Shift+Enter');
    assert.equal(report.openrouterCalls.length, 0, 'Shift+Enter must not submit prematurely');
    await input.type('y qué fuentes de la NASA usa?');
    await input.press('Enter');

    await page.waitForSelector('.brisa-ai-msg-assistant');
    await page.waitForFunction(() => window.__app && window.__app.state.speaking === true);

    // Verify OpenRouter payload contained live NASA SVS/GIBS/POWER & Pacora state
    assert.equal(report.openrouterCalls.length, 1);
    const sysPrompt = report.openrouterCalls[0].messages[0].content;
    assert(sysPrompt.includes('"discId":"yaku2023"'), 'System prompt must contain live discId yaku2023');
    assert(sysPrompt.includes('"pacoraRuleActive":true'), 'System prompt must reflect Pacora rule on Yaku Mar 2023');
    assert(sysPrompt.includes('NASA SVS 5176') && sysPrompt.includes('GHRSST L4 MUR') && sysPrompt.includes('NASA POWER Monthly API'));

    // Verify ElevenLabs called with default Sarah voice + Flash v2.5 + latency optimization and music ducked
    assert.equal(report.elevenlabsCalls.length, 1);
    assert.equal(report.elevenlabsCalls[0].voiceId, 'EXAVITQu4vr4xnSDxMaL');
    assert.equal(report.elevenlabsCalls[0].hasKey, !report.elevenlabsCalls[0].viaProxy);
    if (!report.elevenlabsCalls[0].viaProxy) {
      assert(report.elevenlabsCalls[0].url.includes('optimize_streaming_latency=3'), 'Direct ElevenLabs call should optimize streaming latency');
    }
    assert.equal(report.elevenlabsCalls[0].body.model_id, 'eleven_flash_v2_5');
    // Verify automatic visual spotlight walkthrough is active over workspace on the left
    await page.waitForSelector('.brisa-ai-spot-box');
    await page.waitForSelector('#brisa-ai-spot-badge');
    const spotStepPills = await page.locator('.brisa-ai-spot-pill').count();
    assert(spotStepPills >= 2, 'Assistant reply must attach interactive spotlight step pills');
    const duckedGain = await page.evaluate(() => __app.master.gain.value);
    assert(Math.abs(duckedGain - 0.24) < 0.02, 'Expected ducked gain ~0.24, got ' + duckedGain);

    // Stop speaking via button toggle & replay to verify blob cache (no 2nd ElevenLabs call for same message/voice)
    const playBtn = page.locator('.brisa-ai-play-btn').first();
    await playBtn.click();
    await page.waitForFunction(() => window.__app && !window.__app.state.speaking);
    const restoredGain = await page.evaluate(() => __app.master.gain.value);
    assert(Math.abs(restoredGain - 0.8) < 0.02, 'Expected restored gain ~0.8, got ' + restoredGain);
    await playBtn.click();
    await page.waitForFunction(() => window.__app && window.__app.state.speaking);
    assert.equal(report.elevenlabsCalls.length, 1, 'Replay with same voice must hit cache instead of ElevenLabs API');
    await playBtn.click();
    await page.waitForFunction(() => window.__app && !window.__app.state.speaking);
    report.checks.push('openrouter-live-context-spotlight-and-elevenlabs-cache-ducking');

    // Switch voice directly in header quick picker (Aria) and check offline fallback cleanly
    await page.selectOption('#brisa-ai-voice-quick', '9BWtsMINqrJLrRacOk9x');
    await playBtn.click();
    await page.waitForFunction(() => window.__app && window.__app.state.speaking);
    assert.equal(report.elevenlabsCalls.length, 2);
    assert.equal(report.elevenlabsCalls[1].voiceId, '9BWtsMINqrJLrRacOk9x');
    await playBtn.click();
    await page.waitForFunction(() => window.__app && !window.__app.state.speaking);

    // Offline fallback check
    failNetwork = true;
    await page.locator('.brisa-ai-chip').first().click();
    await page.waitForFunction(() => window.__app && window.__app.state.brisaAiMessages.length === 4);
    const lastText = await page.locator('.brisa-ai-msg-assistant').last().textContent();
    assert(lastText.length > 30, 'Offline fallback must render helpful response');
    failNetwork = false;
    report.checks.push('quick-voice-switch-and-offline-fallback');

    // Theme + High Contrast + Large Text + axe checks while #brisa-ai-dialog is open
    for (const [colorScheme, contrast, big] of [['dark', 'normal', false], ['light', 'normal', false], ['dark', 'high', true]]) {
      await page.evaluate(({ colorScheme, contrast, big }) => __app.setState({ colorScheme, contrast, big }), { colorScheme, contrast, big });
      await page.waitForTimeout(60);
      const ov = await page.locator('#brisa-ai-dialog').evaluate(el => el.scrollWidth > el.clientWidth + 1);
      assert.equal(ov, false, `Overflow in dialog under theme=${colorScheme} contrast=${contrast} big=${big}`);
      if (axeSource) {
        const hasAxe = await page.evaluate(() => !!window.axe);
        if (!hasAxe) await page.addScriptTag({ content: axeSource });
        const axeRes = await page.evaluate(async () => {
          return await axe.run(document.getElementById('brisa-ai-dialog'), {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
          });
        });
        assert.deepEqual(axeRes.violations, [], `Axe violations inside #brisa-ai-dialog (${colorScheme}, ${contrast}, big=${big}): ` + JSON.stringify(axeRes.violations));
      }
    }
    report.checks.push('themes-high-contrast-and-axe-dialog-audit');

    // 4. Mobile 390x844 EN check
    await page.locator('#brisa-ai-close').click();
    await page.waitForFunction(() => !document.querySelector('#brisa-ai-dialog'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => {
      __app.setState({ colorScheme: 'dark', contrast: 'normal', big: false });
      __app.setLang('en');
    });
    const mobileBtn = page.locator('.bottomnav #brisa-ai-open');
    const mobileBtnBox = await mobileBtn.boundingBox();
    assert(mobileBtnBox.height >= 43.9 && mobileBtnBox.width >= 43.9, 'Mobile launcher must be >= 44px');
    await mobileBtn.click();
    await page.waitForSelector('#brisa-ai-dialog');
    const mobileTitle = await page.locator('#brisa-ai-title').textContent();
    assert(mobileTitle.includes('Talk with Brisa'), 'Expected English title, got: ' + mobileTitle);
    const mobileOverflow = await page.evaluate(() => {
      const d = document.getElementById('brisa-ai-dialog');
      return { doc: document.documentElement.scrollWidth > innerWidth + 1, dlg: d.scrollWidth > d.clientWidth + 1 };
    });
    assert.deepEqual(mobileOverflow, { doc: false, dlg: false });
    await page.screenshot({ path: path.join(output, 'mobile-brisa-ai-en.png') });
    report.checks.push('mobile-390-en-layout');

    assert.deepEqual(report.errors, []);
    await context.close();
  } finally {
    try { fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2)); } finally { await browser.close(); }
  }
  console.log('PASS Brisa AI E2E:', report.checks.length, 'check groups;', report.openrouterCalls.length, 'OpenRouter calls;', report.elevenlabsCalls.length, 'ElevenLabs calls');
}

main().catch(err => { console.error(err); process.exitCode = 1; });
