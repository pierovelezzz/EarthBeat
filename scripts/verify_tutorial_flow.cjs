const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchBrowser}=require('./browser_fixture.cjs');
const site=path.resolve(process.argv[2]||'_site'),output=path.resolve(process.argv[3]||'_work/tutorial-flow'),base='http://tutorial.test/';
const axePath=process.env.TERRASONIC_AXE||path.resolve('_work/qa/node_modules/axe-core/axe.min.js');
async function main(){
 fs.mkdirSync(output,{recursive:true});const browser=await launchBrowser({executablePath:process.env.TERRASONIC_CHROMIUM,args:['--mute-audio']});
 const report={checks:[],audits:[],errors:[]};
 try{
  for(const width of [390,1366])for(const lang of ['es','en']){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   await context.route('**/*',route=>{const url=route.request().url();if(!url.startsWith(base))return /^(blob:|data:)/.test(url)?route.continue():route.abort();const file=path.resolve(site,new URL(url).pathname.slice(1)||'index.html');return file.startsWith(site+path.sep)&&fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404});});
   await context.addInitScript(()=>{
    Object.defineProperty(window,'DCLogic',{configurable:true,set(value){Object.defineProperty(window,'DCLogic',{value,writable:true,configurable:true});const original=value.prototype.setState;value.prototype.setState=function(...args){window.__app=this;return original.apply(this,args);};}});
   });
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
   // Set only once, so reload really tests the persisted tutorial checkpoint.
   await page.goto(base+'?setup');await page.evaluate(lang=>{localStorage.setItem('ts_lang',lang);localStorage.setItem('ts_prefs',JSON.stringify({version:1,configured:true,values:{sfx:false,reducedMotion:true}}));},lang);
   await page.goto(base+'#escuchar');await page.waitForFunction(()=>window.__app&&__app.state.tab==='juke');
   await page.addScriptTag({path:axePath});
   const audit=async label=>{
    await page.evaluate(()=>document.fonts.ready);const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
    report.audits.push({width,lang,label,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    console.log('AUDIT',width,lang,label,result.violations.length);
   };
   const step=async number=>{await page.waitForFunction(number=>__app.state.tutorial&&__app.state.tour===number,number);assert.equal(await page.locator('#tour-card').count(),1);};
   const startFromHelp=async()=>{
     await page.locator('#tour-guide').click();
     await page.locator('#tour-card .tour-start').click();
   };
   const pick=async()=>{await page.locator('#tour-card .guide-control').click();assert(await page.locator('.dcard').first().evaluate(el=>document.activeElement===el));await page.locator('.dcard').nth(2).focus();await page.keyboard.press('Enter');await step(2);};
   await page.locator('#tour-guide').click();
   assert.equal(await page.locator('#tour-card .tdots').count(),0);assert.equal((await page.locator('#tour-card .tn.dim').textContent()).trim(),'');
   assert.equal(await page.locator('#tour-card .tbubble button').count(),0);await audit('context-help');
   await page.locator('#tour-card .tact .primary').click();assert.equal(await page.locator('#tour-card').count(),0);
   await startFromHelp();await step(1);await audit('tutorial-step-1');await pick();await audit('tutorial-step-2');
   await page.locator('#tour-card .skip').click();assert.equal(await page.locator('#tour-card').count(),0);
   let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ts_tutorial')));assert.equal(saved.step,2);assert.equal(saved.done.disc,true);
   await page.locator('#tour-guide').click();await step(2);assert.equal(await page.evaluate(()=>__app.state.disc),2);assert.equal(await page.evaluate(()=>__app.state.playing),false);
   await page.reload();await page.waitForFunction(()=>window.__app&&__app.state.tab==='juke');
   assert.equal(await page.locator('#tour-card').count(),0,'Reload must not open an unsolicited tutorial');
   await page.locator('#tour-guide').click();await step(2);assert.equal(await page.evaluate(()=>__app.state.disc),2);assert.equal(await page.evaluate(()=>__app.state.playing),false);
   await page.addScriptTag({path:axePath});await audit('resumed-after-reload');
   await page.locator('#tour-card .tbubble button').last().click();await step(3);assert.equal(await page.evaluate(()=>__app.state.playing),false);
   await audit('written-step-3');await page.locator('#tour-card').screenshot({path:path.join(output,`${width}-${lang}-step3.png`)});
   await page.keyboard.press('Escape');
   saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ts_tutorial')));assert.equal(saved.step,3);assert.equal(saved.done.play,true);
   await page.locator('#tour-guide').click();await step(3);
   await page.locator('.legend-choice').last().focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>__app.state.tutorialDone.legend),true);
   await page.locator('#tour-card .tact .primary').click();assert.equal(await page.locator('#tour-card').count(),0);
   saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ts_tutorial')));assert.equal(saved.completed,true);
   await page.locator('#tour-guide').click();assert.equal(await page.evaluate(()=>__app.state.tutorial),false);await page.keyboard.press('Escape');
   await startFromHelp();await step(1);
   assert.equal(await page.evaluate(()=>__app.state.tutorialDone.disc),false);
   await page.keyboard.press('Escape');
   // First visit keeps the tutorial available after the optional introduction.
   await page.evaluate(()=>{localStorage.removeItem('ts_tutorial');localStorage.removeItem('ts_prefs');localStorage.removeItem('ts_welcome_seen');});await page.goto(base+'?first-visit');
   const motion=page.locator('.welcome-motion input');
   assert(await motion.isChecked(),'Welcome defaults to animations even with a reduced-motion system setting');
   await motion.uncheck();
   await page.locator('.welcome-start').click();
   await page.locator('.discgrid .dcard').first().waitFor();
   assert.equal(await page.locator('.ts-cinema').count(),0,'Reduced motion goes directly to the discs');
   await step(1);
   report.checks.push({width,lang,singleContextCard:true,pauseResume:true,reload:true,withoutSound:true,completeAndRestart:true,firstVisit:true});console.log('PASS tutorial',width,lang);await context.close();
  }
 }finally{fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));await browser.close();}
 assert.deepEqual(report.errors,[]);assert.equal(report.audits.reduce((n,a)=>n+a.violations.length,0),0,'Inspect results.json');console.log('PASS',report.checks.length,'tutorial journeys;',report.audits.length,'axe states');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
