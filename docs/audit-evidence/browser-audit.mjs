import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const out=path.resolve('docs/audit-evidence');
await fs.mkdir(path.join(out,'screenshots'),{recursive:true});
const raw=JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
const hair=JSON.parse(await fs.readFile('src/data/haircare.json','utf8'));
const product=`/skincare/products/${raw.products[0].slug}/`;
const routes=['/','/search/?q=GHK-Cu','/skincare/','/skincare/products/',product,'/skincare/ingredients/','/skincare/ingredients/copper-tripeptide-1/','/skincare/compare/?a=ordinary-copper&b=niod-cais3','/skincare/compare/niod-cais3-vs-the-ordinary/','/skincare/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/','/skincare/guides/peptide-percentages-explained/','/skincare/choose/','/library/','/library/retatrutide/','/skincare/identify/','/tools/price-per-ml/','/haircare/',`/haircare/products/${hair.product.slug}/`,`/haircare/ingredients/${hair.ingredients[0].slug}/`,'/methodology/','/sources/','/contact/','/privacy/'];
const browser=await chromium.launch({headless:true});
const results=[], journeys=[], queries=[];
async function checkpoint(){await fs.writeFile(path.join(out,'browser-audit.json'),JSON.stringify({snapshotUTC:new Date().toISOString(),environment:{browser:browser.version(),cpuThrottle:'none',networkThrottle:'none',viewportEmulationOnly:true,fieldINP:'not measured'},results,journeys,queries},null,2));}
for(const device of ['desktop','mobile']){
 const context=await browser.newContext({viewport:device==='desktop'?{width:1440,height:960}:{width:390,height:844},deviceScaleFactor:1});
 await context.addInitScript(()=>{
  window.__pvAudit={lcp:null,cls:0,session:0,start:0,last:0,longTasks:[]};
  try{new PerformanceObserver(list=>{for(const e of list.getEntries())window.__pvAudit.lcp={ms:e.startTime,tag:e.element?.tagName,text:e.element?.textContent?.slice(0,100)};}).observe({type:'largest-contentful-paint',buffered:true});}catch{}
  try{new PerformanceObserver(list=>{for(const e of list.getEntries()){if(e.hadRecentInput)continue;const a=window.__pvAudit;if(e.startTime-a.last>1000||e.startTime-a.start>5000){a.session=e.value;a.start=e.startTime;}else a.session+=e.value;a.last=e.startTime;a.cls=Math.max(a.cls,a.session);}}).observe({type:'layout-shift',buffered:true});}catch{}
  try{new PerformanceObserver(list=>{window.__pvAudit.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})));}).observe({type:'longtask',buffered:true});}catch{}
 });
 const page=await context.newPage();
 let errors=[]; page.on('pageerror',e=>errors.push(e.message));
 for(let i=0;i<routes.length;i++){
  const route=routes[i];
  for(const theme of ['light','dark']){
   errors=[];
   try{
    await context.addInitScript(t=>{localStorage.setItem('pv-theme',t);},theme);
    const response=await page.goto('https://peptivelo.com'+route,{waitUntil:'load',timeout:30000});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(350);
    const metrics=await page.evaluate(()=>{
      const n=performance.getEntriesByType('navigation')[0];const rs=performance.getEntriesByType('resource');
      return {h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),horizontalOverflow:document.documentElement.scrollWidth>innerWidth,overflowElements:[...document.querySelectorAll('#main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1);}).slice(0,8).map(e=>({tag:e.tagName,class:e.className})),viewport:{width:innerWidth,height:innerHeight},theme:document.documentElement.dataset.theme,documentHeight:document.documentElement.scrollHeight,visibleTextWords:document.querySelector('main')?.innerText.split(/\s+/).length,allTextWords:document.querySelector('main')?.textContent.split(/\s+/).length,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),ttfbMs:n.responseStart-n.requestStart,domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd,fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,...window.__pvAudit,resources:{count:rs.length,transferBytes:rs.reduce((a,r)=>a+r.transferSize,0),encodedBytes:rs.reduce((a,r)=>a+r.encodedBodySize,0),js:rs.filter(r=>/\.js(?:\?|$)/.test(r.name)).reduce((a,r)=>a+r.encodedBodySize,0),css:rs.filter(r=>/\.css(?:\?|$)/.test(r.name)).reduce((a,r)=>a+r.encodedBodySize,0)},smallTargets:[...document.querySelectorAll('a,button,input,summary,select')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&((r.width<24)||(r.height<24));}).length};
    });
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    const screenshot=`screenshots/${String(i).padStart(2,'0')}-${device}-${theme}.png`;
    await page.screenshot({path:path.join(out,screenshot)});
    results.push({route,device,theme,status:response.status(),metrics,errors:[...errors],violations:axe.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,url:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),screenshot});
   }catch(e){results.push({route,device,theme,error:e.message,errors:[...errors]});}
   await checkpoint();
  }
  if(i%5===0)console.log(`${device}: ${i+1}/${routes.length} templates complete`);
 }
 await context.close();
}
const context=await browser.newContext({viewport:{width:1440,height:960}});const page=await context.newPage();
async function task(name,fn){try{journeys.push({name,passed:!!(await fn())});}catch(e){journeys.push({name,passed:false,error:e.message});}await checkpoint();}
await task('universal keyboard search GHK-Cu',async()=>{await page.goto('https://peptivelo.com/');const input=page.getByRole('combobox');await input.fill('GHK-Cu');await input.press('ArrowDown');await input.press('Enter');await page.waitForURL('**/skincare/ingredients/copper-tripeptide-1/');return true;});
for(const query of ['GHK-Cu','copper peptides','GHKCu','coper peptides','What does 10% peptide mean?','The Ordinary','Peptide serums','Products with copper peptides','What did the research actually test?','zzzzzzzzzz']){
 await page.goto('https://peptivelo.com/search/?q='+encodeURIComponent(query));
 const queryResults=await page.locator('.search-result-group').evaluateAll(groups=>groups.map(g=>({
   category:g.querySelector('h2')?.textContent,
   entries:[...g.querySelectorAll('.search-document')].map(a=>({title:a.querySelector('h3')?.textContent,href:a.getAttribute('href')})),
 })));
 queries.push({query,results:queryResults});await checkpoint();
}
await task('catalog brand filter',async()=>{await page.goto('https://peptivelo.com/skincare/products/');await page.locator('.catalog-filters').evaluate(e=>e.open=true);await page.getByLabel('Brand',{exact:true}).selectOption('niod');await page.waitForTimeout(150);return await page.locator('.product-card').count()===1;});
await task('calculator valid and invalid input',async()=>{await page.goto('https://peptivelo.com/tools/price-per-ml/');const p=page.getByLabel('Price (USD)',{exact:true}),v=page.getByLabel('Volume',{exact:true});await p.nth(0).fill('30');await v.nth(0).fill('30');await p.nth(1).fill('45');await v.nth(1).fill('60');await page.getByText('25.0% lower cost per mL').waitFor();await v.nth(1).fill('0');return await page.getByRole('button',{name:'Share calculation'}).isDisabled();});
await task('identify manual match and confirmation',async()=>{await page.goto('https://peptivelo.com/skincare/identify/');await page.getByRole('searchbox').fill('copper');await page.locator('.identify-result').filter({hasText:'The Ordinary'}).first().click();await page.getByRole('button',{name:'Yes, explore this serum'}).click();return await page.getByText('Contents & batch unverified',{exact:true}).isVisible();});
await task('scanner local QR lookup and focus return',async()=>{await page.goto('https://peptivelo.com/skincare/identify/');const trigger=page.getByRole('button',{name:'Scan a code',exact:true});await trigger.click();const dialog=page.getByRole('dialog',{name:'Scan a product code'});await dialog.locator('summary').click();await page.getByLabel('Code or product link',{exact:true}).fill('https://peptivelo.com'+product);await page.getByRole('button',{name:'Look up code'}).click();return await page.getByRole('heading',{name:'Is this your serum?',exact:true}).isVisible();});
await task('comparison preselected pair and reader evidence tab',async()=>{await page.goto('https://peptivelo.com/skincare/compare/niod-cais3-vs-the-ordinary/');await page.getByRole('tab',{name:'Evidence',exact:true}).click();return await page.getByRole('heading',{name:'Evidence, explained.',exact:true}).isVisible();});
await task('citation dialog closes and restores focus',async()=>{await page.goto('https://peptivelo.com/skincare/compare/niod-cais3-vs-the-ordinary/');const link=page.locator('.reader-takeaways .inline-citations a').first();await link.click();const dialog=page.getByRole('dialog',{name:'About this reference'});await dialog.waitFor();await page.keyboard.press('Escape');return await link.evaluate(e=>document.activeElement===e);});
await context.close();await checkpoint();await browser.close();
console.log(JSON.stringify({browserStates:results.length,errors:results.filter(r=>r.error||r.errors?.length).map(r=>({route:r.route,device:r.device,theme:r.theme,error:r.error,errors:r.errors})),overflow:results.filter(r=>r.metrics?.horizontalOverflow).map(r=>({route:r.route,device:r.device,theme:r.theme})),violations:results.filter(r=>r.violations?.length).map(r=>({route:r.route,device:r.device,theme:r.theme,ids:r.violations.map(v=>v.id)})),journeys},null,2));
