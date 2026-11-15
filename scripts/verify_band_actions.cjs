const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchBrowser}=require('./browser_fixture.cjs');
const site=path.resolve(process.argv[2]||'_site'),output=path.resolve(process.argv[3]||'_work/band-actions'),base='http://band.test/';
async function main(){
 fs.mkdirSync(output,{recursive:true});const browser=await launchBrowser({executablePath:process.env.TERRASONIC_CHROMIUM,args:['--mute-audio']});
 const report={checks:[],errors:[]};
 try{
  for(const width of [390,768,1366]) for(const lang of ['es','en']){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   await context.route('**/*',route=>{const url=route.request().url();if(!url.startsWith(base))return /^(data:|blob:)/.test(url)?route.continue():route.abort();const file=path.resolve(site,new URL(url).pathname.slice(1)||'index.html');return file.startsWith(site+path.sep)&&fs.existsSync(file)?route.fulfill({path:file}):route.fulfill({status:404});});
   await context.addInitScript(lang=>{localStorage.setItem('ts_lang',lang);localStorage.setItem('ts_prefs',JSON.stringify({version:1,configured:true,values:{sfx:false,reducedMotion:true}}));},lang);
   const page=await context.newPage();page.on('pageerror',error=>report.errors.push(error.message));await page.goto(base+'#banda');
   await page.locator('earthbeat-dance-button button').waitFor();await page.evaluate(()=>document.fonts.ready);
   for(let musician=0;musician<5;musician++){
    await page.locator('.bsel').nth(musician).click();
    const rects=await page.locator('.avatar-actions').evaluate(el=>{const rect=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};return {container:rect(el),left:rect(el.querySelector(':scope > button')),right:rect(el.querySelector('earthbeat-dance-button button'))};});
    assert(Math.abs(rects.left.width-rects.right.width)<1,'Band action widths must match');
    assert(Math.abs(rects.left.height-rects.right.height)<1,'Band action heights must match');
    assert(Math.abs(rects.left.y-rects.right.y)<1,'Band actions must align at the top');
    assert(Math.abs(rects.left.x-rects.container.x)<1,'Instrument must align left');
    assert(Math.abs(rects.right.right-rects.container.right)<1,'Dance must align right');
    assert(rects.left.width<=191&&rects.left.height<=45&&rects.left.height>=44,'Band actions must be compact and tappable');
    report.checks.push({width,lang,musician,...rects});
   }
   await page.locator('.bshow').screenshot({path:path.join(output,`${width}-${lang}.png`)});console.log('PASS band actions',width,lang);await context.close();
  }
 }finally{fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));await browser.close();}
 assert.deepEqual(report.errors,[]);console.log('PASS',report.checks.length,'musician layouts');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
