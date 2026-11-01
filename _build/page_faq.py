from common import *
import content, md

# FAQ guides live in content/faq/<url>.json, quick answers + review date in content/ai-faq.json (admin panel).
_HUB = content.load('ai-faq.json')
REVIEWED = _HUB.get('reviewed', '')
_GUIDES = content.folder('faq')
FAQ = [(g['url'], g.get('number', ''), g.get('question', ''), g.get('title', ''), g.get('short', ''), g.get('description', ''), g.get('minutes', ''), g.get('tag', '')) for g in _GUIDES]

QUICK = [(x.get('q', ''), x.get('a', '')) for x in _HUB.get('quick') or []]


def _safe_url(u):
    import html as _html
    u = (u or '').strip()
    return _html.escape(u, quote=True) if u.startswith(('https://', 'http://')) else '#'

def _qcard(k, f, pre=''):
    slug, n, q, t, short, d, m, tag = f
    return f'''<a class="qcard glass rv" style="--d:{k*0.08:.2f}s" href="{pre}faq/{slug}.html">
  <span class="q-num" aria-hidden="true">{n}</span>
  <span class="q-body">
   <span class="q-tag">{tag}<i></i>{m} دقیقه مطالعه</span>
   <span class="q-title">{q}</span>
   <span class="q-short"><b>پاسخ کوتاه</b>{short}</span>
   <span class="q-go">خواندن پاسخ کامل {icon('arrow','arrow')}</span>
  </span>
 </a>'''

def hub():
    cards = ''.join(_qcard(k, f) for k, f in enumerate(FAQ))
    qa = ''.join(f'<details class="qa glass rv" style="--d:{k*0.05:.2f}s"><summary>{q}<span class="pm"></span></summary><div class="ans">{a}</div></details>' for k,(q,a) in enumerate(QUICK))
    html = head('سؤالات پرتکرار هوش مصنوعی | hana.aistudio', 'جواب روشن به پرتکرارترین سؤال‌های هوش مصنوعی: اشتراک‌های لازم در ایران، بهترین هوش مصنوعی‌ها برای گوشی و این‌که برای شروع اشتراک لازم است یا نه.')
    html += nav('', 'ai-faq.html')
    html += f'''<main class="faq-page">
<section class="faq-hero"><div class="faq-hero-bg" aria-hidden="true"><i class="ring r1"></i><i class="ring r2"></i><i class="qmark">؟</i></div>
 <div class="wrap">
  <div class="crumbs rv"><a href="index.html">خانه</a><span>/</span><span>سؤالات پرتکرار AI</span></div>
  <div class="kicker rv">مرکز پاسخ <span class="latin">AI — Answers</span></div>
  <h1 class="h-xl" data-split>سؤالات پرتکرار <span class="grad">هوش مصنوعی</span></h1>
  <p class="lead rv">جواب صادقانه و به‌روز به سؤال‌هایی که هر روز در دایرکت و تلگرام می‌پرسید؛ بدون تبلیغ هیچ فروشنده‌ای.</p>
  <div class="faq-chips rv"><span>{icon('book')} {''.join('۰۱۲۳۴۵۶۷۸۹'[int(d)] for d in str(len(FAQ)))} راهنمای کامل</span><span>{icon('refresh')} آخرین بازبینی: {REVIEWED}</span><span>{icon('shield')} بر پایه‌ی منابع رسمی</span></div>
 </div>
</section>
<section class="section" style="padding-top:10px"><div class="wrap">
 <div class="qlist">{cards}</div>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
 <div class="sec-head" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
  <div class="kicker rv" style="justify-content:center">جواب‌های کوتاه <span class="latin">Quick Answers</span></div>
  <h2 class="h-lg" data-split>سؤال‌های <span class="grad-b">یک‌خطی</span></h2>
 </div>
 <div class="faq">{qa}</div>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
 <div class="final glass rv"><div class="orb o1"></div><div class="orb o2"></div>
  <div class="kicker" style="justify-content:center">قدم بعدی <span class="latin">Next</span></div>
  <h2 class="h-lg">سؤالت این‌جا نبود؟ <span class="grad">بپرس</span></h2>
  <p class="lead">سؤالت رو در تلگرام بفرست، یا اول با چالش ببین کجای مسیر یادگیری هستی.</p>
  <div class="cta-row"><a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a><a class="btn btn-glass mag" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} پرسیدن در تلگرام</a></div>
 </div>
</div></section>
</main>'''
    html += footer() + scripts()
    return html

def article(i):
    slug, n, q, t, short, d, m, tag = FAQ[i]
    g = _GUIDES[i]
    toc = ''.join(f'<a href="#s{k+1}"><i>{"۰۱۲۳۴۵۶۷۸۹"[k+1] if k < 9 else k+1}</i>{x}</a>' for k, x in enumerate(md.headings(g.get('body', ''))))
    src = ''.join(f'<li><a href="{_safe_url(x.get("url", ""))}" target="_blank" rel="noopener" dir="ltr">{x.get("title", "")}</a></li>' for x in g.get('sources') or [])
    others = ''.join(_qcard(k, f, '../') for k, f in enumerate(FAQ) if f[0] != slug)
    body = md.render(g.get('body', ''), '../', h2_ids=True).replace('{reviewed}', REVIEWED)
    html = head(f'{t} | hana.aistudio', d, '../')
    html += nav('../', 'ai-faq.html')
    html += f'''<main><article class="reading faq-art">
 <header class="art-head fa-head"><div class="wrap narrow">
  <div class="crumbs rv"><a href="../index.html">خانه</a><span>/</span><a href="../ai-faq.html">سؤالات پرتکرار AI</a><span>/</span><span>{tag}</span></div>
  <div class="fa-q rv"><span class="fa-n">پرسش <i>{n}</i></span><span class="fa-ask">«{q}»</span></div>
  <h1 class="h-lg rv">{t}</h1>
  <div class="byline rv"><span class="av"><svg viewBox="0 0 40 40"><use href="#mark"/></svg></span><span><b>هانا موسوی</b><small>{m} دقیقه مطالعه · آخرین بازبینی: {REVIEWED}</small></span></div>
 </div></header>
 <div class="wrap narrow">
  <div class="tldr glass rv"><span class="tldr-k">{icon('spark')} پاسخ کوتاه</span><p>{short}</p></div>
  <nav class="toc rv" aria-label="فهرست مطالب"><b>در این راهنما</b>{toc}</nav>
 </div>
 <div class="wrap narrow prose">{body}
  {f'<aside class="srcs"><h3>منابع رسمی</h3><p>قیمت‌ها و قابلیت‌ها مرتب تغییر می‌کنن؛ پیش از خرید، صفحه‌ی رسمی هر سرویس را ببینید.</p><ul>{src}</ul></aside>' if src else ''}
 </div>
 <div class="wrap narrow">
  <div class="final glass" style="padding:44px 26px;margin-top:60px"><div class="orb o1"></div><div class="orb o2"></div>
   <h2 class="h-md" style="margin-bottom:12px">ابزار مهمه، ولی روش کار مهم‌تره</h2>
   <p class="muted" style="margin:0 0 24px">با چالش سطح AI ببین از کجا شروع کنی، یا دوره‌ها رو ببین تا قدم‌به‌قدم و عملی یاد بگیری.</p>
   <div class="cta-row" style="justify-content:center"><a class="btn btn-primary" href="../challenge.html">شروع چالش {icon('arrow','arrow')}</a><a class="btn btn-glass" href="../index.html#courses">مشاهده‌ی دوره‌ها</a></div>
  </div>
  <h3 style="margin:60px 0 16px;font-size:18px">سؤال‌های دیگر</h3><div class="qlist compact">{others}</div>
 </div>
</article></main>'''
    html += footer('../') + scripts('../')
    return html

def home_teaser():
    rows = ''.join(f'<a class="hq-row" href="faq/{f[0]}.html"><span class="hq-n">{f[1]}</span><span class="hq-t">{f[2]}</span>{icon("arrow","arrow")}</a>' for f in FAQ)
    return f'''<section class="section" id="ai-faq" style="padding-top:20px">
 <div class="wrap">
  <div class="hq glass rv"><div class="orb o1"></div>
   <div class="hq-text">
    <div class="kicker">قبل از خرید اشتراک بخون <span class="latin">AI — FAQ</span></div>
    <h2 class="h-lg">سؤالات پرتکرار <span class="grad-b">هوش مصنوعی</span></h2>
    <p class="muted">کدوم اشتراک توی ایران لازمه، کدوم هوش مصنوعی روی گوشی بهتر کار می‌کنه و آیا اصلاً برای شروع باید پول بدی؟ جواب‌های روشن و به‌روز.</p>
    <a class="btn btn-glass mag" href="ai-faq.html">همه‌ی سؤال‌ها {icon('arrow','arrow')}</a>
   </div>
   <div class="hq-list">{rows}</div>
  </div>
 </div>
</section>
'''
