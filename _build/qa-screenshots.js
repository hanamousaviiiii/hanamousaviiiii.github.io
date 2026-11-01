const {chromium}=require('playwright-core');
const B='http://127.0.0.1:8797/', OUT='/workspace/hana-site-v2/screenshots/';
const only=process.argv.slice(2);
const want=n=>!only.length||only.some(o=>n.includes(o));
async function scrollAll(pg){await pg.addStyleTag({content:'.hero{min-height:'+(await pg.evaluate(()=>innerHeight))+'px!important}'});await pg.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}scrollTo(0,0);document.querySelectorAll('.rv,.split,[data-io]').forEach(e=>e.classList.add('in'));});await pg.waitForTimeout(1200);}
async function full(pg,path){const vp=pg.viewportSize();const H=await pg.evaluate(()=>{scrollTo(0,0);return document.documentElement.scrollHeight});const CH=Math.floor(7000/ (vp.width<500?2:1));const parts=[];
 await pg.waitForTimeout(500);
 for(let y=0,k=0;y<H;y+=CH,k++){const f=path+'.part'+k+'.png';await pg.screenshot({path:f,fullPage:true,clip:{x:0,y,width:vp.width,height:Math.min(CH,H-y)}});parts.push(f);}
 require('child_process').execFileSync('python3',['-c',`import sys,json,os\nfrom PIL import Image\nparts=json.loads(sys.argv[1]);ims=[Image.open(f) for f in parts]\ncan=Image.new('RGB',(ims[0].width,sum(i.height for i in ims)));y=0\nfor im in ims:\n  can.paste(im,(0,y)); y+=im.height\ncan.save(sys.argv[2])\n[os.remove(f) for f in parts]`,JSON.stringify(parts),path]);}
async function check(pg,tag){const r=await pg.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,font:document.fonts.check('16px Vazirmatn'),gl:!!window.__coreReady,nogl:document.documentElement.classList.contains('no-webgl')}));console.log(tag,JSON.stringify(r));}
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const page=async(w,h,mob)=>{const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:mob?2:1,isMobile:!!mob,hasTouch:!!mob});const pg=await ctx.newPage();pg.on('console',m=>['error','warning'].includes(m.type())&&console.log('  console:',m.text().slice(0,200)));pg.on('pageerror',e=>console.log('  PAGEERR',e.message));return pg;};
 if(want('home-d')){const pg=await page(1280,800);await pg.goto(B+'index.html',{waitUntil:'networkidle'});await pg.waitForFunction(()=>window.__coreReady||document.documentElement.classList.contains('no-webgl'),null,{timeout:15000}).catch(()=>{});await pg.mouse.move(400,300);await pg.waitForTimeout(2500);await check(pg,'home-d');await pg.screenshot({path:OUT+'home-desktop-top.png'});await scrollAll(pg);await full(pg,OUT+'home-desktop-full.png');
  await pg.evaluate(()=>{const r=document.querySelector('.deck').getBoundingClientRect();scrollTo(0,r.top+scrollY-90)});await pg.waitForTimeout(1500);
  const clip=await pg.evaluate(()=>{const r=document.querySelector('.deck').getBoundingClientRect();return {x:0,y:Math.max(0,r.top-30),width:1280,height:Math.min(800-Math.max(0,r.top-30),r.height+100)}});
  await pg.evaluate(()=>document.querySelector('.nav').style.visibility='hidden');await pg.screenshot({path:OUT+'cards-desktop.png',clip});
  const c=await pg.$('.pcard:nth-child(1)');const bb=await c.boundingBox();await pg.mouse.move(bb.x+bb.width*.72,bb.y+bb.height*.28);await pg.waitForTimeout(300);await pg.mouse.move(bb.x+bb.width*.7,bb.y+bb.height*.3);await pg.waitForTimeout(500);
  await pg.screenshot({path:OUT+'cards-desktop-hover.png',clip});
  await pg.click('.pcard:nth-child(2)',{position:{x:30,y:30}});await pg.waitForTimeout(1400);
  await pg.screenshot({path:OUT+'cards-desktop-flipped.png',clip});await pg.context().close();}
 if(want('home-m')){const pg=await page(390,844,1);await pg.goto(B+'index.html',{waitUntil:'networkidle'});await pg.waitForFunction(()=>window.__coreReady||document.documentElement.classList.contains('no-webgl'),null,{timeout:15000}).catch(()=>{});await pg.waitForTimeout(2500);await check(pg,'home-m');await pg.screenshot({path:OUT+'home-mobile-top.png'});await scrollAll(pg);await full(pg,OUT+'home-mobile-full.png');await pg.context().close();}
 if(want('chal')){const pg=await page(390,844,1);await pg.goto(B+'challenge.html',{waitUntil:'networkidle'});await pg.waitForTimeout(800);await pg.screenshot({path:OUT+'challenge-intro-mobile.png'});await pg.click('#go');await pg.waitForTimeout(700);
  for(let i=0;i<2;i++){await pg.click('.scr:last-child .opt:nth-child(3)');await pg.waitForTimeout(900);}
  await pg.click('.scr:last-child .opt:nth-child(3)');await pg.waitForTimeout(250);await pg.screenshot({path:OUT+'challenge-question-mobile.png'});await pg.waitForTimeout(800);
  for(let i=3;i<10;i++){await pg.click('.scr:last-child .opt:nth-child('+(i%2?4:2)+')');await pg.waitForTimeout(850);}
  await check(pg,'chal');await full(pg,OUT+'challenge-contact-mobile.png');
  await pg.click('button[type=submit]');await pg.waitForTimeout(400);await full(pg,OUT+'challenge-contact-errors-mobile.png');
  await pg.fill('#f-name','تست آزمایشی');await pg.fill('#f-phone','۰۹۱۲ ۱۲۳ ۴۵۶۷');await pg.fill('#f-social','@test_user');await pg.check('#f-consent');await pg.click('button[type=submit]');await pg.waitForTimeout(2600);
  await full(pg,OUT+'challenge-result-mobile.png');
  console.log('stored',await pg.evaluate(()=>localStorage.getItem('hana_local_challenge').slice(0,400)));
  await pg.goto(B+'challenge.html?export=1');await pg.waitForTimeout(800);await pg.screenshot({path:OUT+'challenge-admin-export-mobile.png'});await pg.context().close();}
 for(const [n,u,w,h,m] of [['links','links.html',390,844,1],['course-m','course.html?c=smart-assistant',390,844,1],['course-d','course.html?c=editor-plus',1280,800,0],['blog','blog.html',1280,800,0],['article','articles/better-prompts.html',390,844,1],['contact','contact.html',390,844,1]]){
  if(!want(n))continue;const pg=await page(w,h,m);await pg.goto(B+u,{waitUntil:'networkidle'});await pg.waitForTimeout(900);await check(pg,n);await pg.screenshot({path:OUT+n+(m?'-mobile':'-desktop')+'.png'});await scrollAll(pg);await full(pg,OUT+n+(m?'-mobile':'-desktop')+'-full.png');await pg.context().close();}
 if(want('review')){for(const [w,h,m,tag] of [[1280,800,0,'d'],[390,844,1,'m']]){const pg=await page(w,h,m);await pg.goto(B+'index.html',{waitUntil:'networkidle'});await pg.waitForTimeout(1500);
  for(const id of ['why','challenge','courses','showcase','voices','about','faq']){await pg.evaluate(id=>{const e=document.getElementById(id);scrollTo(0,e.getBoundingClientRect().top+scrollY-60)},id);await pg.waitForTimeout(1500);await pg.screenshot({path:OUT+'_review/'+tag+'-'+id+'.png'});}
  await pg.evaluate(()=>scrollTo(0,document.body.scrollHeight));await pg.waitForTimeout(1200);await pg.screenshot({path:OUT+'_review/'+tag+'-end.png'});await pg.context().close();}}
 await b.close();})();
