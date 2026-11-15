const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchBrowser}=require('./browser_fixture.cjs');
const site=path.resolve(process.argv[2]||'_site'),output=path.resolve(process.argv[3]||'_work/a11y/preferences-layout'),base='http://terrasonic.test/';
async function main(){
 fs.mkdirSync(output,{recursive:true});const browser=await launchBrowser({executablePath:process.env.TERRASONIC_CHROMIUM,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const report={checks:[],errors:[]};
 try{
  for(const [width,height]of [[320,256],[320,568],[390,844],[768,1024],[1366,768]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
   await context.route('**/*',async route=>{if(/^(blob:|data:)/.test(route.request().url()))return route.continue();if(!route.request().url().startsWith(base))return route.abort();const file=path.resolve(site,new URL(route.request().url()).pathname.slice(1)||'index.html');return file.startsWith(site+path.sep)&&fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404});});
   await context.addInitScript(()=>{localStorage.setItem('ts_lang','es');localStorage.setItem('ts_prefs',JSON.stringify({version:1,configured:true,values:{sfx:false,reducedMotion:true}}));Object.defineProperty(navigator,'vibrate',{value:()=>true,configurable:true});Object.defineProperty(window,'DCLogic',{configurable:true,set(value){Object.defineProperty(window,'DCLogic',{value,writable:true,configurable:true});const original=value.prototype.setState;value.prototype.setState=function(...args){window.__app=this;return original.apply(this,args);};}});});
   const page=await context.newPage();page.on('pageerror',error=>report.errors.push(error.message));await page.goto(base);await page.waitForFunction(()=>window.__app);
   const skipIntro=page.locator('.cinema-skip');
   if(await skipIntro.isVisible())await skipIntro.click();
   for(const language of ['es','en'])for(const setting of ['default','large','spacing']){
    await page.evaluate(language=>__app.setLang(language),language);await page.locator('#text-test').evaluateAll(elements=>elements.forEach(el=>el.remove()));
    if(setting==='large')await page.addStyleTag({content:'.px.app{font-size:32px!important}'}).then(el=>el.evaluate(node=>node.id='text-test'));
    if(setting==='spacing')await page.addStyleTag({content:'*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'}).then(el=>el.evaluate(node=>node.id='text-test'));
    const toggle=page.locator('#tour-a11y>summary');
    await toggle.focus();
    const before=await page.locator('.top').boundingBox();
    await page.keyboard.press('Enter');
    assert(await page.locator('#tour-a11y').getAttribute('open')!==null);
    await page.waitForFunction(()=>{
     const menu=document.getElementById('tour-a11y');
     const panelTop=menu.querySelector('.pop').getBoundingClientRect().top;
     const viewport=window.visualViewport;
     const available=Math.max(0,Math.floor((viewport?viewport.offsetTop+viewport.height:innerHeight)-panelTop-8));
     return menu.style.getPropertyValue('--a11y-available')===available+'px';
    });
    assert.deepEqual(await page.locator('.top').boundingBox(),before,'opening the panel must not reflow the header');
    const result=await page.locator('#tour-a11y .pop').evaluate(pop=>{
     const r=pop.getBoundingClientRect();return {left:r.left,right:r.right,bottom:r.bottom,width:r.width,height:r.height,scrollHeight:pop.scrollHeight,viewport:innerWidth,columns:getComputedStyle(pop).gridTemplateColumns,
      options:[...pop.querySelectorAll('button')].map(el=>{const r=el.getBoundingClientRect();return {name:el.textContent.trim(),disabled:el.disabled,width:r.width,height:r.height,overflow:el.scrollWidth>el.clientWidth+2,left:r.left,right:r.right};})};
    });
    assert(result.left>=0&&result.right<=width&&result.bottom<=height,JSON.stringify(result));
    if(width<=900)assert((await page.locator('#tour-a11y .pop').boundingBox()).y>=before.y+before.height,'the mobile panel must stay below navigation');
    assert.equal(result.options.length,11);
    const switches=page.locator('#tour-a11y .opt[aria-pressed]');
    assert.equal(await switches.count(),8);
    assert.equal(await page.locator('#tour-a11y .haptics-settings button').first().isDisabled(),true);
    assert.equal(await page.locator('#tour-a11y .haptics-settings button').last().isEnabled(),true);
    if(setting==='default'&&width>=390)assert.equal(result.columns.split(' ').length,2,'two columns when labels fit');
    const brand=await page.locator('.wordmark').evaluate(el=>{const r=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);return {lines:range.getClientRects().length,left:r.left,right:r.right,topFont:getComputedStyle(el.closest('header')).fontSize};});
    if(language==='es'||setting==='default')await page.screenshot({path:path.join(output,`${width}-${height}-${setting}-${language}.png`)});
    assert(brand.left>=0&&brand.right<=width,JSON.stringify({width,height,setting,brand}));
    result.options.forEach(option=>{assert(option.width>=44&&option.height>=44);assert(!option.overflow&&option.left>=0&&option.right<=width,JSON.stringify(option));});
    if(setting==='large'&&width<=390)assert.equal(result.columns.split(' ').length,1,'enlarged text gets a full-width option');
    const reached=[],traversal=[];
    const enabled=result.options.filter(option=>!option.disabled);
    for(let count=0;count<18&&reached.length<enabled.length;count++){
     await page.keyboard.press('Tab');await page.waitForFunction(()=>{const r=document.activeElement.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;},{},{timeout:1000}).catch(()=>{});
     const focus=await page.evaluate(()=>{const el=document.activeElement,r=el.getBoundingClientRect();return {name:el.textContent.trim().slice(0,100),cls:el.className,tag:el.tagName,top:r.top,bottom:r.bottom,viewport:innerHeight,panelScroll:document.querySelector('#tour-a11y .pop').scrollTop,pageScroll:scrollY};});traversal.push(focus);
     if(focus.tag!=='BUTTON'&&focus.cls==='pop')continue; // Firefox also tabs to a native scrollable group.
     assert(focus.tag==='BUTTON'&&focus.bottom>0&&focus.top<height,JSON.stringify({width,height,language,setting,count,focus}));reached.push(focus.name);
    }
    assert.deepEqual(reached,enabled.map(option=>option.name),'every preference remains reachable in DOM order');
    await page.keyboard.press('Escape');assert.equal(await toggle.evaluate(el=>document.activeElement===el),true);
    if(setting==='default'){
     const highContrast=switches.first();
     await toggle.press('Enter');await highContrast.press('Space');
     assert.equal(await highContrast.getAttribute('aria-pressed'),'true');
     await highContrast.press('Space');
     assert.equal(await highContrast.getAttribute('aria-pressed'),'false');
     await page.keyboard.press('Escape');
    }
    report.checks.push({viewportWidth:width,viewportHeight:height,language,setting,...result,traversal});
   }
   await context.close();console.log('PASS preferences layout',width,height);
  }
  assert.deepEqual(report.errors,[]);
 }finally{fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
