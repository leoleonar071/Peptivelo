import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'docs/audit-evidence');
await fs.mkdir(out,{recursive:true});
const read=(p)=>fs.readFile(path.join(root,p),'utf8');
const raw=JSON.parse(await read('src/data/catalog.json'));
const guides=JSON.parse(await read('src/data/guides.json'));
const evidence=JSON.parse(await read('src/data/evidence.json'));
const evaluations=JSON.parse(await read('src/data/comparison-evaluations.json'));
const hair=JSON.parse(await read('src/data/haircare.json'));
const pagesText=await read('src/lib/pages.ts');
const libraryText=await read('src/lib/library.ts');
const catchText=await read('src/app/[...slug]/page.tsx');
const pages=[...pagesText.matchAll(/^  (?:"([^"]+)"|([a-z][a-z-]*)): \{/gm)].map(m=>m[1]||m[2]);
const librarySlugs=[...libraryText.matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]);
const staticPaths=[...catchText.matchAll(/path === "([^"]+)"/g)].map(m=>m[1]);
const routes=new Set(['/', '/search/', '/library/','/haircare/','/skincare/choose/','/skincare/identify/',...pages.map(s=>`/${s}/`),...staticPaths.map(s=>`/${s}/`),...librarySlugs.map(s=>`/library/${s}/`),...raw.products.map(p=>`/skincare/products/${p.slug}/`),...raw.ingredients.map(p=>`/skincare/ingredients/${p.slug}/`),...raw.comparisons.map(p=>`/skincare/compare/${p.slug}/`),...guides.map(p=>`/skincare/guides/${p.slug}/`),`/haircare/products/${hair.product.slug}/`,...hair.ingredients.map(i=>`/haircare/ingredients/${i.slug}/`)]);
const group=(arr,key)=>arr.reduce((o,x)=>(o[x[key]??'missing']=(o[x[key]??'missing']||0)+1,o),{});
const products=raw.products.map(p=>({id:p.id,name:p.name,status:p.editorialStatus,volume:p.volume,unit:p.volumeUnit,scope:p.ingredientListScope,selectedCount:p.ingredientList.length,linkedIngredients:p.ingredientIds.length,source:p.sourceId,checked:p.lastVerifiedAt,comparisons:raw.comparisons.filter(c=>c.comparedProductIds.includes(p.id)).length,prices:raw.prices.filter(x=>x.productId===p.id).length,exactSizePrices:raw.prices.filter(x=>x.productId===p.id&&x.size===p.volume&&x.sizeUnit===p.volumeUnit).length,hasExplicitMarket:Object.hasOwn(p,'market')||Object.hasOwn(p,'country'),hasVariantId:Object.hasOwn(p,'variantId'),hasFullINCI:!!p.fullInci,hasImage:!!p.image}));
const ingredients=raw.ingredients.map(i=>({id:i.id,name:i.name,status:i.status,pendingReview:!!i.education.scientificReviewPending,sourceCount:i.sourceIds.length,sourceKinds:i.sourceIds.map(id=>evidence.find(e=>e.sourceId===id)?.kind??'no evidence notes'),productCount:raw.products.filter(p=>p.ingredientIds.includes(i.id)).length,aliases:i.aliases??i.synonyms??null,checked:i.education.sourceCheckedAt}));
const summary={snapshotUTC:new Date().toISOString(),repoCommit:(await import('node:child_process')).execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),counts:Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Array.isArray(v)?v.length:typeof v])),statuses:{products:group(raw.products,'editorialStatus'),ingredients:group(raw.ingredients,'status'),comparisons:group(raw.comparisons,'publicationStatus'),guides:group(guides,'status'),evaluations:group(evaluations,'mode')},guides:guides.map(g=>({slug:g.slug,title:g.title,status:g.status,productIds:g.productIds,comparisonIds:g.comparisonIds,sourceCount:g.sourceIds.length,checked:g.updatedAt})),librarySlugs,hair:{keys:Object.keys(hair),product:hair.product.name,ingredients:hair.ingredients.length},evidence:{count:evidence.length,kinds:group(evidence,'kind'),withDOI:evidence.filter(e=>e.doi).length,withDesign:evidence.filter(e=>e.design).length,withAuthors:evidence.filter(e=>e.authors).length,missingNotes:raw.sources.filter(s=>!evidence.some(e=>e.sourceId===s.id)).map(s=>s.id),records:evidence.map(e=>({sourceId:e.sourceId,kind:e.kind,doi:e.doi??null,authors:!!e.authors,year:e.year??null,design:!!e.design,access:e.access,checkedAt:e.checkedAt,integrity:e.integrity??null}))},prices:raw.prices,products,ingredients,infoPages:pages,initialRouteCount:routes.size};
await fs.writeFile(path.join(out,'data-inventory.json'),JSON.stringify(summary,null,2));
const results=[], internalLinks=new Set();
async function inspect(route){
 try{
  const r=await fetch('https://peptivelo.com'+route,{signal:AbortSignal.timeout(25000)});const html=await r.text();
  const strip=s=>s?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const links=[...html.matchAll(/href="([^"]+)"/g)].flatMap(m=>{try{const u=new URL(m[1].replace(/&amp;/g,'&'),'https://peptivelo.com');return u.origin==='https://peptivelo.com'&&!/\.[a-z0-9]{2,5}$/i.test(u.pathname)?[u.pathname]:[];}catch{return [];}});
  links.forEach(p=>internalLinks.add(p));
  const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1]);}catch{return {parseError:true};}});
  const result={route,status:r.status,finalUrl:r.url,title:strip(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]),h1:[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>strip(m[1])),canonical:html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]??null,description:html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/)?.[1]??null,metaRobots:html.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/)?.[1]??null,headers:{robots:r.headers.get('x-robots-tag'),cache:r.headers.get('cache-control'),csp:r.headers.get('content-security-policy'),frame:r.headers.get('x-frame-options'),permissions:r.headers.get('permissions-policy'),referrer:r.headers.get('referrer-policy'),contentType:r.headers.get('content-type')},bytes:Buffer.byteLength(html),schemas,links:[...new Set(links)],pendingReview:/pending qualified review|qualified.*review.*pending/i.test(html),operatorMissing:html.includes('Operator details have not yet been supplied'),contactMissing:html.includes('public contact channel has not yet been configured'),hostMissing:html.includes('hosting provider has not yet been selected')};
  results.push(result);
 }catch(e){results.push({route,error:e.message});}
}
async function batch(items){for(let start=0;start<items.length;start+=3)await Promise.all(items.slice(start,start+3).map(inspect));}
await batch([...routes]);
const extra=[...internalLinks].filter(p=>!routes.has(p)&&!p.startsWith('/_next/')&&!p.startsWith('/api/'));
await batch(extra.slice(0,100));
await batch(['/search/?q=GHK-Cu','/skincare/products/?q=NIOD','/skincare/compare/?a=ordinary-copper&b=niod-cais3','/definitely-not-a-peptivelo-page/','/robots.txt','/sitemap.xml']);
results.sort((a,b)=>a.route.localeCompare(b.route));
await fs.writeFile(path.join(out,'route-audit.json'),JSON.stringify({snapshotUTC:new Date().toISOString(),initialRouteCount:routes.size,extraDiscovered:extra,results},null,2));
await fs.writeFile(path.join(out,'routes.md'),'# Production route census\n\nHTTP/SSR inspection; browser interaction checks are separate.\n\n| Route | HTTP | H1 | Canonical |\n|---|---|---|---|\n'+results.map(r=>`| ${r.route} | ${r.status??r.error} | ${(r.h1??[]).join('; ').replaceAll('|','/')} | ${r.canonical??'—'} |`).join('\n')+'\n');
console.log(JSON.stringify({counts:summary.counts,statuses:summary.statuses,evidence:{count:evidence.length,missingNotes:summary.evidence.missingNotes.length},routes:results.length,non200:results.filter(r=>r.status!==200).map(r=>({route:r.route,status:r.status,error:r.error})),missingTrust:results.filter(r=>r.operatorMissing||r.contactMissing||r.hostMissing).map(r=>r.route)},null,2));
