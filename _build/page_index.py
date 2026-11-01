from common import *
from cards import card
from page_faq import home_teaser
import media, page_works, content, re

SECTION_KEYS = ['marquee', 'interlude-1', 'why', 'challenge', 'courses', 'interlude-2', 'showcase', 'voices', 'about', 'interlude-3', 'ai-faq', 'faq', 'final']

def _arrange(html, order):
    """Reorder / hide homepage sections following content/home.json -> sections (the hero always stays first)."""
    parts = re.split(r'<!--§([a-z0-9-]+)-->', html)
    head, chunks, tail = parts[0], {}, ''
    for k in range(1, len(parts), 2):
        if parts[k] == 'end': tail = parts[k + 1]
        else: chunks[parts[k]] = parts[k + 1]
    seen, body = set(), ''
    for sec in order:
        key = sec.get('key') if isinstance(sec, dict) else sec
        if key in chunks and key not in seen and (not isinstance(sec, dict) or sec.get('visible', True)):
            seen.add(key); body += chunks[key]
    return head + body + tail

def _quotes():
    items = content.load('testimonials.json').get('items') or []
    items = [t for t in items if t.get('visible', True)]
    if not items:
        return ''.join(f'''<figure class="quote" style="margin:0"><div class="mark">“</div>
      <p class="ph">[متن نظر هنرجو {n} — اسکرین‌شات یا متن واقعی جایگزین شود]</p>
      <figcaption class="who"><div class="av ph-box" style="border-radius:50%"></div><div><b>[نام هنرجو]</b><small>[دوره] {PH()}</small></div></figcaption></figure>''' for n in ['۱','۲','۳'])
    out = ''
    for t in items:
        av = content.media_path(t.get('photo'))
        avh = f'<div class="av" style="border-radius:50%;overflow:hidden"><img src="{av}" alt="" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover"></div>' if av else '<div class="av ph-box" style="border-radius:50%"></div>'
        shot = content.media_path(t.get('screenshot'))
        shoth = f'<img class="q-shot" src="{shot}" alt="رضایت {t.get("name", "هنرجو")}" loading="lazy" decoding="async" style="display:block;max-width:100%;max-height:340px;margin:0 auto 18px;border-radius:14px">' if shot else ''
        txt = f'<p>{t["text"]}</p>' if t.get('text') else ''
        out += f'''<figure class="quote" style="margin:0"><div class="mark">“</div>
      {shoth}{txt}
      <figcaption class="who">{avh}<div><b>{t.get('name') or 'هنرجو'}</b><small>{t.get('course') or ''}</small></div></figcaption></figure>'''
    return out

def _story(s):
    if not (s or '').strip():
        return '<div class="ph-box"><span class="ph">[داستان هانا: از کجا شروع کرد، چرا آموزش AI و ادیت، و چه چیزی کلاس‌هاش رو متفاوت می‌کنه — متن واقعی جایگزین شود]</span></div>'
    return ''.join(f'<p>{p.strip()}</p>' for p in s.split('\n\n') if p.strip())

def build():
    H = content.load('home.json')
    feats = [('wide' if f.get('wide') else '', f.get('icon') or 'spark', f.get('title', ''), f.get('text', '')) for f in H.get('features', [])]
    fh = ''
    for k,(w,ic,t,p) in enumerate(feats):
        fh += f'<article class="feature glass {w} rv" style="--d:{k*0.07:.2f}s"><div class="num">{k+1:02d}</div><div class="ic">{icon(ic)}</div><h3>{t}</h3><p>{p}</p></article>'

    quotes = _quotes()

    faqs = [(f.get('q', ''), f.get('a', '')) for f in H.get('faqs', [])]
    fq = ''.join(f'<details class="qa glass rv" style="--d:{k*0.05:.2f}s"><summary>{q}<span class="pm"></span></summary><div class="ans">{a}</div></details>' for k,(q,a) in enumerate(faqs))

    marq = ''.join(f'<span>{w}</span>' for w in H.get('marquee', []))

    photo = content.media_path(H.get('about', {}).get('photo')) or media.about_photo()
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
   <p class="lead rv" style="--d:.5s">{H.get('hero', {}).get('lead', '')}</p>
   <div class="cta-row rv" style="--d:.65s">
    <a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a>
    <a class="btn btn-glass mag" href="#courses">مشاهده‌ی دوره‌ها</a>
   </div>
   <div class="hero-meta rv" style="--d:.8s">{''.join(f'<span>{m}</span>' for m in H.get('hero', {}).get('meta', []))}</div>
  </div>
  <div></div>
 </div>
 <a class="hero-card glass hc1 rv" style="--d:1s" href="challenge.html"><span class="ic">{icon('target')}</span><span><b>چالش سطح AI</b>۱۷ سؤال · حدود ۵ دقیقه</span></a>
 <a class="hero-card glass hc2 rv" style="--d:1.15s" href="#courses"><span class="ic">{icon('spark')}</span><span><b>دو دوره‌ی تخصصی</b>دستیار هوشمند · ادیتور پلاس</span></a>
 <div class="scroll-cue"><i></i>اسکرول</div>
</section>

<!--§marquee--><div class="marquee" aria-hidden="true"><div class="marquee-track">{marq}{marq}</div></div>

<!--§interlude-1--><section class="interlude" data-evo-beat aria-label="همه‌چیز از یک نقطه شروع شد."><p class="il-line rv"><span class="il-n">01</span>همه‌چیز از یک نقطه شروع شد.</p></section>
<!--§why--><section class="section" id="why">
 <div class="wrap">
  <div class="why-intro">
   <div><div class="kicker rv">چرا همین حالا <span class="latin">01 — Why now</span></div>
   <h2 class="h-lg" data-split>هوش مصنوعی، <span class="grad-b">مهارت پایه‌ی</span> هر خالق محتواست</h2></div>
   <p class="lead rv" style="--d:.2s">ابزارها هر ماه قوی‌تر می‌شن، اما نتیجه‌ی حرفه‌ای هنوز به کسی می‌رسه که بلده ازشون درست استفاده کنه. این‌ها مهارت‌هایی‌ان که توی دوره‌ها قدم‌به‌قدم و عملی کار می‌شن.</p>
  </div>
  <div class="features">{fh}</div>
 </div>
</section>

<!--§challenge--><section class="section" id="challenge" style="padding-top:0">
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

<!--§courses--><section class="section" id="courses">
 <div class="wrap">
  <div class="sec-head" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
   <div class="kicker rv" style="justify-content:center">دوره‌ها <span class="latin">03 — The Deck</span></div>
   <h2 class="h-lg" data-split>دو کارت، <span class="grad">دو مسیر</span></h2>
   <p class="lead rv" style="margin-inline:auto">یکی برای خلق محتوا و کسب درآمد با هوش مصنوعی، یکی برای ادیت حرفه‌ای با گوشی. روی هر کارت بزن تا جزئیاتش رو ببینی.</p>
  </div>
  <div class="deck rv">{''.join(card(c['id']) for c in content.courses(True))}</div>
 </div>
</section>

<!--§interlude-2--><section class="interlude" data-evo-beat aria-label="نقطه‌ها به هم وصل شدن."><p class="il-line rv"><span class="il-n">02</span>نقطه‌ها به هم وصل شدن.</p></section>
<!--§showcase--><section class="section" id="showcase" style="padding-top:60px">
 <div class="wrap">
  <div class="kicker rv">نمونه‌کارها <span class="latin">04 — Showcase</span></div>
  {page_works.home_box()}
 </div>
</section>

<!--§voices--><section class="section" id="voices">
 <div class="wrap">
  <div class="kicker rv">رضایت هنرجوها <span class="latin">05 — Voices</span></div>
  <div class="quotes glass rv" data-slider>
   <div class="quote-track">{quotes}</div>
   <div class="q-nav"><button class="q-btn" data-prev aria-label="قبلی"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button><button class="q-btn" data-next aria-label="بعدی"><svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button><div class="q-dots"></div></div>
  </div>
 </div>
</section>

<!--§about--><section class="section" id="about">
 <div class="wrap about">
  <div class="portrait-wrap rv">{portrait}</div>
  <div class="story rv" style="--d:.15s">
   <div class="kicker">درباره‌ی من <span class="latin">06 — About</span></div>
   <h2 class="h-lg">هانا موسوی</h2>
   {_story(H.get('about', {}).get('story', ''))}
   <div class="sig"><a class="chip" href="{IG}" target="_blank" rel="noopener">{icon('instagram')} hana.aistudio</a><a class="chip" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} hanatrick</a></div>
  </div>
 </div>
</section>

<!--§interlude-3--><section class="interlude" data-evo-beat aria-label="و آینده، این‌جا شکل می‌گیره."><p class="il-line rv"><span class="il-n">03</span>و آینده، این‌جا شکل می‌گیره.</p></section>
<!--§ai-faq-->'''+home_teaser()+f'''<!--§faq--><section class="section" id="faq">
 <div class="wrap">
  <div class="sec-head" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
   <div class="kicker rv" style="justify-content:center">سؤالات متداول <span class="latin">07 — FAQ</span></div>
   <h2 class="h-lg" data-split>قبل از <span class="grad-b">شروع</span></h2>
   <p class="rv" style="margin:14px 0 0">{PH('پاسخ‌ها در انتظار تأیید هانا')}</p>
  </div>
  <div class="faq">{fq}</div>
 </div>
</section>

<!--§final--><section class="section" style="padding-top:20px">
 <div class="wrap">
  <div class="final glass rv"><div class="orb o1"></div><div class="orb o2"></div>
   <div class="kicker" style="justify-content:center">قدم اول <span class="latin">08 — Begin</span></div>
   <h2 class="h-lg">اول ببین کجای مسیری، <span class="grad">بعد شروع کن</span></h2>
   <p class="lead">سه دقیقه وقت بذار، سطحت رو بشناس و بهترین مسیر رو برای خودت پیدا کن.</p>
   <div class="cta-row"><a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a><a class="btn btn-glass mag" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} پیام در تلگرام</a></div>
  </div>
 </div>
</section>
<!--§end--></main>
'''
    html = _arrange(html, H.get('sections') or [])
    html += footer()
    html += scripts('', '''<script src="assets/js/evolution.js"></script>
<script src="assets/js/companion.js"></script>
<script type="module" src="assets/js/hero3d.js"></script>
<script>setTimeout(function(){if(!window.__coreReady)document.documentElement.classList.add('no-webgl')},5000)</script>''')
    return html
