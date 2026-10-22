import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch();const samples=[];
for(const route of ['/','/skincare/compare/niod-cais3-vs-the-ordinary/']){
 for(let run=1;run<=3;run++){
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  await ctx.addInitScript(()=>{
   window.__a={lcp:0,cls:0,session:0,start:0,last:0,shifts:[]};
   new PerformanceObserver(l=>{for(const e of l.getEntries())window.__a.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(l=>{for(const e of l.getEntries()){if(e.hadRecentInput)continue;const a=window.__a;if(e.startTime-a.last>1000||e.startTime-a.start>5000){a.session=e.value;a.start=e.startTime;}else a.session+=e.value;a.last=e.startTime;a.cls=Math.max(a.cls,a.session);a.shifts.push({value:e.value,time:e.startTime,sources:e.sources.map(s=>({tag:s.node?.tagName,class:s.node?.className,text:s.node?.textContent?.slice(0,70),previous:{x:s.previousRect.x,y:s.previousRect.y,width:s.previousRect.width,height:s.previousRect.height},current:{x:s.currentRect.x,y:s.currentRect.y,width:s.currentRect.width,height:s.currentRect.height}}))});}}).observe({type:'layout-shift',buffered:true});
  });
  const page=await ctx.newPage();await page.goto('https://peptivelo.com'+route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
  const metrics=await page.evaluate(()=>({...window.__a,fonts:document.fonts.status,ttfb:performance.getEntriesByType('navigation')[0].responseStart-performance.getEntriesByType('navigation')[0].requestStart}));samples.push({route,run,metrics});await ctx.close();
 }
}
await browser.close();await fs.writeFile('docs/audit-evidence/performance-followup.json',JSON.stringify({method:'Fresh browser context per sample; 390x844, Chromium, no CPU/network throttling; 1.2s observation after load/fonts. Lab only, not field Core Web Vitals or Lighthouse.',samples},null,2));console.log(JSON.stringify(samples.map(s=>({route:s.route,run:s.run,lcp:s.metrics.lcp,cls:s.metrics.cls,largestShift:s.metrics.shifts.sort((a,b)=>b.value-a.value)[0]})),null,2));
