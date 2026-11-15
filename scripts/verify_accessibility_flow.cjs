// QA only: no physical vibration or assistive-technology certification is implied.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { launchBrowser } = require('./browser_fixture.cjs');
const site = path.resolve(process.argv[2] || '_site');
const output = path.resolve(process.argv[3] || '_work/accessibility-flow');
const axePath = process.env.TERRASONIC_AXE || path.resolve('_work/qa/node_modules/axe-core/axe.min.js');
const base = 'http://earthrhythm.test/';
const cases = [
  {name:'desktop',width:1366,phone:false,api:true},
  {name:'narrow-desktop',width:390,phone:false,api:true},
  {name:'android',width:390,phone:true,api:true,userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36'},
  {name:'iphone-unsupported',width:390,phone:true,api:false,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'},
];
async function main() {
  fs.mkdirSync(output,{recursive:true});
  const browser = await launchBrowser({executablePath:process.env.TERRASONIC_CHROMIUM,args:['--mute-audio']});
  const report = {checks:[],audits:[],errors:[],limitations:['Phone/unsupported API are emulated in Chromium, not Safari or physical hardware.','Axe and keyboard automation do not replace screen-reader testing.']};
  try {
    for (const scenario of cases) {
      const context = await browser.newContext({viewport:{width:scenario.width,height:900},reducedMotion:'reduce',...(scenario.userAgent?{userAgent:scenario.userAgent,isMobile:true,hasTouch:true}:{})});
      await context.route('**/*',route=>{
        const url=route.request().url();
        if (/^(blob:|data:)/.test(url)) return route.continue();
        if (!url.startsWith(base)) return route.abort();
        const file=path.resolve(site,new URL(url).pathname.slice(1)||'index.html');
        return file.startsWith(site+path.sep)&&fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404});
      });
      await context.addInitScript(({phone,api})=>{
        localStorage.setItem('ts_lang','es');
        localStorage.setItem('ts_prefs',JSON.stringify({version:1,configured:true,values:{sfx:false}}));
        Object.defineProperty(navigator,'userAgentData',{configurable:true,value:{mobile:phone}});
        window.__vibrations=[];
        Object.defineProperty(navigator,'vibrate',{configurable:true,value:api?pattern=>{window.__vibrations.push(pattern);return true;}:undefined});
        Object.defineProperty(window,'DCLogic',{configurable:true,set(value){Object.defineProperty(window,'DCLogic',{value,writable:true,configurable:true});const original=value.prototype.setState;value.prototype.setState=function(...args){window.__app=this;return original.apply(this,args);};}});
      },scenario);
      const page=await context.newPage();
      page.on('pageerror',error=>report.errors.push({scenario:scenario.name,error:error.message}));
      await page.goto(base);await page.waitForFunction(()=>window.__app);
      if(await page.locator('.cinema-skip').isVisible()) await page.locator('.cinema-skip').click();
      assert.equal(await page.evaluate(()=>__app.bandReduced()),true);
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.waitForFunction(()=>!__app.bandReduced());
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForFunction(()=>__app.bandReduced());
      await page.addScriptTag({path:axePath});
      const audit=async label=>{
        await page.evaluate(()=>document.fonts.ready);
        const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
        report.audits.push({scenario:scenario.name,label,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>v.id)});
        console.log('AUDIT',scenario.name,label,result.violations.length);
      };
      await audit('home');
      await page.locator('#tour-a11y > summary').click();
      assert.equal(await page.locator('.haptics-settings').count(),scenario.phone?1:0);
      assert.equal(await page.getByRole('button',{name:'Vibración',exact:true}).count(),scenario.phone?1:0);
      await page.locator('.access-help > summary').click();
      await audit('settings-and-help');
      if(scenario.phone) {
        const vibration=page.getByRole('button',{name:'Vibración',exact:true});
        assert.equal(await vibration.isDisabled(),!scenario.api);
        if(scenario.api) {
          await vibration.click();
          await page.getByRole('button',{name:'Probar vibración',exact:true}).click();
          assert.equal(await page.evaluate(()=>__app.state.vibe),true);
          assert((await page.evaluate(()=>__vibrations)).length>0);
          await page.getByRole('button',{name:'Detener vibración',exact:true}).click();
          assert.equal(await page.evaluate(()=>__vibrations.at(-1)),0);
        } else assert.match(await page.locator('#haptics-status').innerText(),/no ofrece vibración/);
      } else {
        await page.evaluate(()=>{__app.state.vibe=true;__app.haptics.activate();__app.vibrateSafely('test','desktop');});
        assert.deepEqual(await page.evaluate(()=>__vibrations),[]);
      }
      await page.locator('.preferences-shortcut').click();
      assert.equal(await page.locator('#preferences-vibe').count(),scenario.phone?1:0);
      if(scenario.phone) assert.equal(await page.locator('#preferences-vibe').isDisabled(),!scenario.api);
      await audit('preferences');
      await page.getByRole('button',{name:'Continuar',exact:true}).click();
      await page.keyboard.press('Escape');
      await page.locator('#tour-nav button').first().click();
      await page.locator('.dcard').first().click();
      await page.waitForFunction(()=>__app.cur());
      await page.locator('#accessible-data > summary').focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'accessible-data-column');
      await page.keyboard.press('End');
      assert.equal(await page.locator('#accessible-data-column').inputValue(),'27');
      assert.equal(await page.locator('#accessible-data tbody tr').count(),16);
      assert.equal(await page.locator('#accessible-data-column option').count(),28);
      const analysis=await page.evaluate(()=>({values:__app.cur().cells.filter((_,i)=>i%28===27).map(v=>Number.isFinite(v)?v.toFixed(2):'Sin datos'),playing:__app.state.playing,frame:__app.state.frame}));
      assert.deepEqual(await page.locator('#accessible-data tbody td:first-of-type').allTextContents(),analysis.values);
      await audit('player-data');
      await page.screenshot({path:path.join(output,scenario.name+'-data.png'),fullPage:true});
      await page.getByRole('button',{name:'EN English',exact:true}).click();
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.equal(await page.locator('#accessible-data-column').inputValue(),'27');
      assert.equal(await page.evaluate(()=>__app.state.frame),analysis.frame);
      await audit('player-data-en');
      await page.evaluate(()=>{__app.setPreference('contrast',true);__app.setPreference('big',true);__app.setPreference('legible',true);});
      await page.setViewportSize({width:320,height:900});
      await audit('player-reading-320');
      const overflow=await page.locator('#accessible-data').evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));
      assert(overflow.scroll<=overflow.client+1,JSON.stringify(overflow));
      await page.screenshot({path:path.join(output,scenario.name+'-reading.png'),fullPage:true});
      if(scenario.phone&&scenario.api) {
        // The engine, volume and motion combination is checked separately from physical hardware.
        const independent=await page.evaluate(()=>{
          __app.setVolume(0);__app.state.playing=true;__app.musicVibrationStopped=false;
          __app.haptics.retry();__app.haptics.lastAt=-Infinity;__app.haptics.requests=[];
          const pulse=__app.playbackPulse({mama:true},{mama:.6});
          return {pulse,accepted:__app.vibrateSafely(pulse,'silent-reduced'),reduced:__app.bandReduced()};
        });
        assert.deepEqual(independent,{pulse:'musicMedium',accepted:true,reduced:true});
        await page.evaluate(()=>__app.stop());
        assert.equal(await page.evaluate(()=>__vibrations.at(-1)),0);
      }
      report.checks.push({scenario:scenario.name,phoneOnly:true,systemMotion:true,writtenData:true,keyboard:true,translation:true,reflow:true});
      await context.close();
    }
  } finally {
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));
    await browser.close();
  }
  assert.deepEqual(report.errors,[]);
  assert.equal(report.audits.reduce((n,a)=>n+a.violations.length,0),0,'See results.json for accessibility violations');
  console.log('PASS',report.checks.length,'scenarios;',report.audits.length,'axe audits');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
