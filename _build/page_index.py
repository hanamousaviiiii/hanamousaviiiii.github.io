from common import *
from cards import card
from page_faq import home_teaser
import media, page_works

def build():
    feats = [
      ('wide','prompt','مهندسی پرامپت و مهندسی معکوس','یاد می‌گیری دقیقاً چی و چطور بخوای تا هوش مصنوعی همون رو تحویل بده؛ از سناریو و کپشن تا تصویر. و از روی یک خروجی خوب، پرامپتش رو بازسازی کنی.'),
      ('','image','تصویر و شخصیت‌سازی','تولید تصویر حرفه‌ای، طراحی بنر و کاور، و ساخت شخصیت ثابت برای برندت.'),
      ('','video','ویدیو از عکس','حرکت دوربین، جلوه‌های سینمایی، لیپ‌سینک و انیمیت چهره.'),
      ('','wave','صدا، زیرنویس و ترجمه','ساخت ویس با AI و بومی‌سازی محتوا برای مخاطب بیشتر.'),
      ('','edit','ادیت حرفه‌ای با موبایل','الایت موشن، کپکات، اینشات و آی‌مووی؛ فقط با گوشی.'),
      ('wide','growth','از مهارت تا درآمد','کار روی پروژه‌های واقعی بازار و یاد گرفتن مسیر جذب پروژه با مهارت‌های هوش مصنوعی؛ تا یادگیری فقط سرگرمی نمونه.'),
    ]
    fh = ''
    for k,(w,ic,t,p) in enumerate(feats):
        fh += f'<article class="feature glass {w} rv" style="--d:{k*0.07:.2f}s"><div class="num">0{k+1}</div><div class="ic">{icon(ic)}</div><h3>{t}</h3><p>{p}</p></article>'

    tiles = [('t1','a1','تصویر AI','۰۱',False),('t2','a2','ویدیو از عکس','۰۲',True),('t3','a3','شخصیت‌سازی','۰۳',False),('t4','a4','کاور و بنر','۰۴',False),
             ('t5','a5','استوری موشن','۰۵',True),('t6','a6','موشن‌گرافی','۰۶',True),('t7','a7','لیپ‌سینک','۰۷',True)]
    th = ''
    for k,(t,a,cap,n,vid) in enumerate(tiles):
        play = f'<div class="play">{icon("play")}</div>' if vid else ''
        th += f'<figure class="tile {t} rv" style="--d:{k*0.06:.2f}s;margin:0"><div class="art {a}"></div>{play}<figcaption class="cap"><b>{cap}</b><span>نمونه‌کار {n} · به‌زودی</span></figcaption></figure>'

    quotes = ''.join(f'''<figure class="quote" style="margin:0"><div class="mark">“</div>
      <p class="ph">[متن نظر هنرجو {n} — اسکرین‌شات یا متن واقعی جایگزین شود]</p>
      <figcaption class="who"><div class="av ph-box" style="border-radius:50%"></div><div><b>[نام هنرجو]</b><small>[دوره] {PH()}</small></div></figcaption></figure>''' for n in ['۱','۲','۳'])

    faqs = [
      ('دوره‌ها آنلاین برگزار می‌شن یا حضوری؟', '[پاسخ — به‌زودی]'),
      ('برای ادیتور پلاس چه گوشی‌ای لازم دارم؟', '[پاسخ — به‌زودی]'),
      ('بدون هیچ تجربه‌ای می‌تونم شروع کنم؟', '[پاسخ — به‌زودی]'),
      ('پشتیبانی دوره‌ها چطوریه؟', 'دوره‌ی دستیار هوشمند شامل شش ماه پشتیبانی و آپدیت رایگان است. <span class="ph">[جزئیات پشتیبانی ادیتور پلاس — به‌زودی]</span>'),
      ('ثبت‌نام و پرداخت چطور انجام می‌شه؟', 'برای ثبت‌نام در تلگرام پیام بده. <span class="ph">[جزئیات روش پرداخت — به‌زودی]</span>'),
    ]
    fq = ''.join(f'<details class="qa glass rv" style="--d:{k*0.05:.2f}s"><summary>{q}<span class="pm"></span></summary><div class="ans">{a}</div></details>' for k,(q,a) in enumerate(faqs))

    marq = ''.join(f'<span>{w}</span>' for w in ['Prompt Engineering','AI Imagery','Alight Motion','Lip-Sync','Motion Graphics','CapCut','Voice AI','Storytelling','Image to Video','InShot'])

    photo = media.about_photo()
    inner = f'<img src="{photo}" alt="هانا موسوی" loading="lazy" decoding="async">' if photo else f'<svg class="silhouette" viewBox="0 0 100 120" fill="none" stroke="url(#gl)" stroke-width=".8"><circle cx="50" cy="38" r="20"/><path d="M12 118c4-26 20-40 38-40s34 14 38 40"/></svg>{PH('عکس حرفه‌ای هانا')}'
    portrait = f'<div class="pf-halo" aria-hidden="true"></div><div class="pf-orbit" aria-hidden="true"><i></i></div><div class="portrait glass" data-tilt="5"><div class="pf-photo">{inner}</div></div><div class="pf-badge glass"><b>hana.aistudio</b><span>مدرس تولید محتوا با AI</span></div>'
    html = head('هانا موسوی | hana.aistudio — خلق محتوا با هوش مصنوعی',
                'آموزش ادیت حرفه‌ای با موبایل و تولید تصویر، صدا و ویدیو با هوش مصنوعی. دوره‌های دستیار هوشمند و ادیتور پلاس.',
                extra='<link rel="preload" href="assets/fonts/lalezar.woff2" as="font" type="font/woff2" crossorigin>')
    html += nav('', 'index.html')
    html += f'''<main>
<section class="hero" id="top">
 <div class="hero-stage"><div class="gridlines"></div><div class="core-fallback"></div><canvas id="core" aria-hidden="true"></canvas></div>
 <div class="wrap hero-inner">
  <div>
   <span class="eyebrow rv"><i class="dot"></i>hana.aistudio · آکادمی خلق محتوا با AI</span>
   <h1 class="hero-title" data-split><span class="t1">خلق محتوا</span><span class="t2"><i class="rule"></i>در عصر</span><span class="t3"><span class="grad">هوش مصنوعی</span></span></h1>
   <p class="lead rv" style="--d:.5s">از ادیت حرفه‌ای با موبایل تا ساخت تصویر، صدا و ویدیو با AI؛ مهارت‌هایی که محتوات رو متمایز می‌کنه و به درآمد می‌رسونه.</p>
   <div class="cta-row rv" style="--d:.65s">
    <a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a>
    <a class="btn btn-glass mag" href="#courses">مشاهده‌ی دوره‌ها</a>
   </div>
   <div class="hero-meta rv" style="--d:.8s"><span>الایت موشن · کپکات · اینشات</span><span>تصویر و ویدیو با AI</span><span>مهندسی پرامپت</span></div>
  </div>
  <div></div>
 </div>
 <a class="hero-card glass hc1 rv" style="--d:1s" href="challenge.html"><span class="ic">{icon('target')}</span><span><b>چالش سطح AI</b>۱۷ سؤال · حدود ۵ دقیقه</span></a>
 <a class="hero-card glass hc2 rv" style="--d:1.15s" href="#courses"><span class="ic">{icon('spark')}</span><span><b>دو دوره‌ی تخصصی</b>دستیار هوشمند · ادیتور پلاس</span></a>
 <div class="scroll-cue"><i></i>اسکرول</div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">{marq}{marq}</div></div>

<section class="interlude" data-evo-beat aria-label="همه‌چیز از یک نقطه شروع شد."><p class="il-line rv"><span class="il-n">01</span>همه‌چیز از یک نقطه شروع شد.</p></section>
<section class="section" id="why">
 <div class="wrap">
  <div class="why-intro">
   <div><div class="kicker rv">چرا همین حالا <span class="latin">01 — Why now</span></div>
   <h2 class="h-lg" data-split>هوش مصنوعی، <span class="grad-b">مهارت پایه‌ی</span> هر خالق محتواست</h2></div>
   <p class="lead rv" style="--d:.2s">ابزارها هر ماه قوی‌تر می‌شن، اما نتیجه‌ی حرفه‌ای هنوز به کسی می‌رسه که بلده ازشون درست استفاده کنه. این‌ها مهارت‌هایی‌ان که توی دوره‌ها قدم‌به‌قدم و عملی کار می‌شن.</p>
  </div>
  <div class="features">{fh}</div>
 </div>
</section>

<section class="section" id="challenge" style="padding-top:0">
 <div class="wrap">
  <div class="teaser glass glow rv">
   <div>
    <div class="kicker">چالش <span class="latin">02 — The AI Level Test</span></div>
    <h2 class="h-lg">سطح هوش مصنوعی <span class="grad">تو</span> چیه؟</h2>
    <p class="lead">۱۷ سؤال سناریومحور درباره‌ی پرامپت‌نویسی، تصویر، ویدیو، صدا، ادیت، ابزارها، استراتژی محتوا و کسب درآمد. آخرش سطحت رو می‌بینی و مسیری که دقیقاً به کارت میاد.</p>
    <ol class="teaser-steps"><li>به ۱۷ سؤال سناریومحور جواب بده</li><li>سطحت رو در یکی از چهار مرحله ببین</li><li>دوره‌ی پیشنهادی متناسب با هدفت رو بگیر</li></ol>
    <a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a>
   </div>
   <div class="levels-visual" data-io>
    <div class="lv"><small>I</small><b>کاوشگر</b><span class="bar"><i style="--w:.25"></i></span></div>
    <div class="lv"><small>II</small><b>سازنده</b><span class="bar"><i style="--w:.5"></i></span></div>
    <div class="lv"><small>III</small><b>خالق</b><span class="bar"><i style="--w:.75"></i></span></div>
    <div class="lv"><small>IV</small><b>معمار AI</b><span class="bar"><i style="--w:1"></i></span></div>
   </div>
  </div>
 </div>
</section>

<section class="section" id="courses">
 <div class="wrap">
  <div class="sec-head" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
   <div class="kicker rv" style="justify-content:center">دوره‌ها <span class="latin">03 — The Deck</span></div>
   <h2 class="h-lg" data-split>دو کارت، <span class="grad">دو مسیر</span></h2>
   <p class="lead rv" style="margin-inline:auto">یکی برای خلق محتوا و کسب درآمد با هوش مصنوعی، یکی برای ادیت حرفه‌ای با گوشی. روی هر کارت بزن تا جزئیاتش رو ببینی.</p>
  </div>
  <div class="deck rv">{card('smart-assistant')}{card('editor-plus')}</div>
 </div>
</section>

<section class="interlude" data-evo-beat aria-label="نقطه‌ها به هم وصل شدن."><p class="il-line rv"><span class="il-n">02</span>نقطه‌ها به هم وصل شدن.</p></section>
<section class="section" id="showcase" style="padding-top:60px">
 <div class="wrap">
  <div class="kicker rv">نمونه‌کارها <span class="latin">04 — Showcase</span></div>
  {page_works.home_box()}
 </div>
</section>

<section class="section" id="voices">
 <div class="wrap">
  <div class="kicker rv">رضایت هنرجوها <span class="latin">05 — Voices</span></div>
  <div class="quotes glass rv" data-slider>
   <div class="quote-track">{quotes}</div>
   <div class="q-nav"><button class="q-btn" data-prev aria-label="قبلی"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button><button class="q-btn" data-next aria-label="بعدی"><svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button><div class="q-dots"></div></div>
  </div>
 </div>
</section>

<section class="section" id="about">
 <div class="wrap about">
  <div class="portrait-wrap rv">{portrait}</div>
  <div class="story rv" style="--d:.15s">
   <div class="kicker">درباره‌ی من <span class="latin">06 — About</span></div>
   <h2 class="h-lg">هانا موسوی</h2>
   <div class="ph-box"><span class="ph">[داستان هانا: از کجا شروع کرد، چرا آموزش AI و ادیت، و چه چیزی کلاس‌هاش رو متفاوت می‌کنه — متن واقعی جایگزین شود]</span></div>
   <div class="sig"><a class="chip" href="{IG}" target="_blank" rel="noopener">{icon('instagram')} hana.aistudio</a><a class="chip" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} hanatrick</a></div>
  </div>
 </div>
</section>

<section class="interlude" data-evo-beat aria-label="و آینده، این‌جا شکل می‌گیره."><p class="il-line rv"><span class="il-n">03</span>و آینده، این‌جا شکل می‌گیره.</p></section>
'''+home_teaser()+f'''<section class="section" id="faq">
 <div class="wrap">
  <div class="sec-head" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
   <div class="kicker rv" style="justify-content:center">سؤالات متداول <span class="latin">07 — FAQ</span></div>
   <h2 class="h-lg" data-split>قبل از <span class="grad-b">شروع</span></h2>
   <p class="rv" style="margin:14px 0 0">{PH('پاسخ‌ها در انتظار تأیید هانا')}</p>
  </div>
  <div class="faq">{fq}</div>
 </div>
</section>

<section class="section" style="padding-top:20px">
 <div class="wrap">
  <div class="final glass rv"><div class="orb o1"></div><div class="orb o2"></div>
   <div class="kicker" style="justify-content:center">قدم اول <span class="latin">08 — Begin</span></div>
   <h2 class="h-lg">اول ببین کجای مسیری، <span class="grad">بعد شروع کن</span></h2>
   <p class="lead">سه دقیقه وقت بذار، سطحت رو بشناس و بهترین مسیر رو برای خودت پیدا کن.</p>
   <div class="cta-row"><a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a><a class="btn btn-glass mag" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} پیام در تلگرام</a></div>
  </div>
 </div>
</section>
</main>
'''
    html += footer()
    html += scripts('', '''<script src="assets/js/evolution.js"></script>
<script src="assets/js/companion.js"></script>
<script type="module" src="assets/js/hero3d.js"></script>
<script>setTimeout(function(){if(!window.__coreReady)document.documentElement.classList.add('no-webgl')},5000)</script>''')
    return html
