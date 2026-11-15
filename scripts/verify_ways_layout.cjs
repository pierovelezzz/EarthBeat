const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchBrowser}=require('./browser_fixture.cjs');
const site=path.resolve(process.argv[2]||'_site'),output=path.resolve(process.argv[3]||'_work/ways-layout'),base='http://ways.test/';
const axePath=process.env.TERRASONIC_AXE||path.resolve('_work/qa/node_modules/axe-core/axe.min.js');
async function main(){
 fs.mkdirSync(output,{recursive:true});
 const browser=await launchBrowser({executablePath:process.env.TERRASONIC_CHROMIUM,args:['--mute-audio']});
 const report={checks:[],errors:[],violations:[]};
 try{
  // Font swapping must not invalidate the no-scroll layout after opening.
  {
   const context=await browser.newContext({viewport:{width:320,height:256},reducedMotion:'reduce'});
   let releaseFonts;const fontsHeld=new Promise(resolve=>{releaseFonts=resolve;});
   await context.route('**/*',async route=>{
    const url=route.request().url();if(/^(blob:|data:)/.test(url))return route.continue();if(!url.startsWith(base))return route.abort();
    if(/\.woff2(?:\?|$)/.test(url))await fontsHeld;
    const file=path.resolve(site,new URL(url).pathname.slice(1)||'index.html');return file.startsWith(site+path.sep)&&fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404});
   });
   await context.addInitScript(()=>{
    localStorage.setItem('ts_lang','es');localStorage.setItem('ts_prefs',JSON.stringify({version:1,configured:true,values:{sfx:false,reducedMotion:true}}));
    Object.defineProperty(window,'DCLogic',{configurable:true,set(value){Object.defineProperty(window,'DCLogic',{value,writable:true,configurable:true});const original=value.prototype.setState;value.prototype.setState=function(...args){window.__app=this;return original.apply(this,args);};}});
   });
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__app&&!document.querySelector('.ts-cinema'));
   await page.locator('#ways-trigger').click();await page.waitForFunction(()=>__app.waysChunks?.length);
   releaseFonts();await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.getElementById('ways-text').getBoundingClientRect().bottom<=document.getElementById('ways-copy').getBoundingClientRect().bottom+1);
   await page.keyboard.press('Escape');
   report.checks.push({scenario:'delayed-fonts',noScrollAfterFontSwap:true});console.log('PASS delayed fonts');
   await context.close();
  }
  for(const [width,height,big] of [[1366,768,false],[390,844,false],[667,375,false],[320,256,false],[320,256,true]]) for(const lang of ['es','en']){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
   await context.route('**/*',route=>{
    const url=route.request().url();if(/^(blob:|data:)/.test(url))return route.continue();if(!url.startsWith(base))return route.abort();
    const file=path.resolve(site,new URL(url).pathname.slice(1)||'index.html');return file.startsWith(site+path.sep)&&fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404});
   });
   await context.addInitScript(({lang,big})=>{
    localStorage.setItem('ts_lang',lang);localStorage.setItem('ts_prefs',JSON.stringify({version:1,configured:true,values:{sfx:false,reducedMotion:true,big,legible:big}}));
    Object.defineProperty(window,'DCLogic',{configurable:true,set(value){Object.defineProperty(window,'DCLogic',{value,writable:true,configurable:true});const original=value.prototype.setState;value.prototype.setState=function(...args){window.__app=this;return original.apply(this,args);};}});
   },{lang,big});
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
   await page.goto(base);await page.waitForFunction(()=>window.__app&&!document.querySelector('.ts-cinema'));
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('#ways-trigger').click();await page.waitForFunction(()=>__app.waysChunks?.length);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'ways-close');
   const expected=await page.evaluate(()=>__app.waysTopics().map(t=>t.text.trim().split(/\s+/).join(' ')));
   const initialPageCount=await page.evaluate(()=>__app.waysVm().pages.length);
   const seen=expected.map(()=>[]);let pages=0;
   for(;;){
    await page.waitForFunction(()=>__app.waysRaf==null);
    assert.equal(await page.evaluate(()=>__app.waysVm().pages.length),initialPageCount,'Page count must remain stable while reading at a fixed size');
    const check=await page.evaluate(()=>{
     const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
     const panel=document.getElementById('ways-dialog'),copy=document.getElementById('ways-copy'),text=document.getElementById('ways-text');
     return {panel:rect(panel),copy:rect(copy),text:rect(text),footer:rect(document.querySelector('.ways-footer')),scroll:panel.scrollHeight,client:panel.clientHeight,bodyScroll:document.documentElement.scrollWidth,topic:__app.waysVm().pages[__app.state.waysPage].topic,value:text.textContent};
    });
    assert(check.panel.top>=-1&&check.panel.bottom<=height+1,JSON.stringify(check));
    assert(check.text.bottom<=check.copy.bottom+1&&check.text.right<=check.copy.right+1,JSON.stringify(check));
    assert(check.copy.height-check.text.height<=3,'Help height must fit its content: '+JSON.stringify(check));
    assert(Math.abs(check.text.width-check.copy.width)<1,'Text must use the complete reading width');
    assert(check.scroll<=check.client+1,'The help panel must not need vertical scrolling');
    assert(check.bodyScroll<=width+1,'The header must not overflow horizontally');
    seen[check.topic].push(check.value);pages++;
    if(pages===1)await page.screenshot({path:path.join(output,`${width}-${height}-${big}-${lang}.png`)});
    if(await page.locator('#ways-next').isDisabled())break;
    assert(pages<300,'Pagination must terminate');
    await page.locator('#ways-next').click();
    await page.waitForFunction(previous=>__app.state.waysPage>previous,pages-1);
   }
   assert.deepEqual(seen.map(parts=>parts.join(' ')),expected,'Pagination must retain every word in order');
   await page.locator('#ways-context').focus();await page.keyboard.press('Shift+Tab');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'ways-tutorial');
   await page.addScriptTag({path:axePath});
   const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
   report.violations.push(...axe.violations.map(v=>({width,height,big,lang,id:v.id,nodes:v.nodes.map(n=>n.target)})));
   await page.keyboard.press('Escape');assert.equal(await page.locator('#ways-dialog').count(),0);assert.equal(await page.evaluate(()=>document.activeElement.id),'ways-trigger');
   report.checks.push({width,height,big,lang,pages,fullWidth:true,noScroll:true,allWordsRetained:true,focus:true});console.log('PASS',width,height,big,lang,pages,'pages');
   await context.close();
  }
 }finally{fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));await browser.close();}
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.violations,[]);console.log('PASS',report.checks.length,'usage-help scenarios');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
