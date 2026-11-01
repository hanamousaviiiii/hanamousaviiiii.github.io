from common import *
import media
from media import fa

def _card(k, c, n):
    slug, title, latin, num, ic, _ = c
    cnt = f'<span class="ch-count">{fa(n)} نمونه‌کار</span>' if n else '<span class="ch-count soon">به‌زودی</span>'
    return f'''<a class="ch-card rv{' empty' if not n else ''}" style="--d:{min(k,6)*0.06:.2f}s" href="student-works.html?ch={slug}" data-ch="{slug}" aria-label="{title} — {('%s نمونه‌کار' % fa(n)) if n else 'به‌زودی'}">
  <span class="ch-face" data-tilt="7">
   <span class="ch-liq" aria-hidden="true"></span>
   <svg class="ch-frame" viewBox="0 0 250 370" preserveAspectRatio="none" aria-hidden="true"><use href="#frame"/></svg>
   <span class="ch-num latin">{num}</span><span class="ch-num b latin" aria-hidden="true">{num}</span>
   <span class="ch-emb" aria-hidden="true"><i class="r1"></i><i class="r2"></i><span class="ch-ic">{icon(ic)}</span></span>
   <span class="ch-title">{title}</span>
   <span class="ch-latin latin">{latin}</span>
   {cnt}
   <span class="ch-sheen" aria-hidden="true"></span>
  </span>
 </a>'''

def _gallery(c, items):
    slug, title, latin, num, ic, _ = c
    if items:
        body = f'<div class="m-grid g-works">{"".join(media.tile(m, icon, title) for m in items)}</div>'
    else:
        body = f'''<div class="ch-empty glass"><div class="ch-emb big" aria-hidden="true"><i class="r1"></i><i class="r2"></i><span class="ch-ic">{icon(ic)}</span></div>
   <h3>نمونه‌کارهای این فصل به‌زودی</h3><p>هنرجوها در حال ساخت پروژه‌های این فصل هستن؛ به‌زودی همین‌جا منتشر می‌شن.</p>
   <a class="btn btn-glass" href="student-works.html">بقیه‌ی فصل‌ها {icon('arrow','arrow')}</a></div>'''
    return f'''<section class="ch-view" id="ch-{slug}" data-view="{slug}" hidden>
  <div class="ch-view-head">
   <a class="ch-back" href="student-works.html" data-back>{icon('arrow','arrow back')} همه‌ی فصل‌ها</a>
   <div class="kicker">فصل <span class="latin">{num} — {latin}</span></div>
   <h2 class="h-lg">{title}</h2>
   <p class="muted">{f"{fa(len(items))} نمونه‌کار از هنرجوهای دوره" if items else "به‌زودی"}</p>
  </div>
  {body}
 </section>'''

def build():
    chs = media.chapters(); data = [(c, media.scan(c[0])) for c in chs]
    cards = ''.join(_card(k, c, len(it)) for k, (c, it) in enumerate(data))
    gals = ''.join(_gallery(c, it) for c, it in data)
    tot = sum(len(it) for _, it in data)
    html = head('نمونه‌کار هنرجوها | hana.aistudio', 'نمونه‌کارهای هنرجوهای دوره‌های هانا موسوی، دسته‌بندی‌شده بر اساس فصل‌های دوره: انیمیشن، موشن‌گرافی، تبلیغ محصول و بیشتر.')
    html += nav('', 'student-works.html')
    html += f'''<main class="works-page">
<section class="page-head works-head"><div class="wrap">
 <div class="crumbs rv"><a href="index.html">خانه</a><span>/</span><span>نمونه‌کار هنرجوها</span></div>
 <div class="kicker rv">گالری هنرجوها <span class="latin">Student Works</span></div>
 <h1 class="h-xl" data-split>نمونه‌کار <span class="grad">هنرجوها</span></h1>
 <p class="lead rv">هر کارت یک فصل از دوره‌ست. روی هر فصل بزن و کارهایی رو ببین که هنرجوها با همون مهارت ساختن.</p>
 <div class="faq-chips rv"><span>{icon('book')} {fa(len(chs))} فصل</span><span>{icon('play')} {fa(tot)} نمونه‌کار</span><span>{icon('spark')} ساخته‌شده با AI و ادیت موبایل</span></div>
</div></section>
<section class="section works-body" style="padding-top:10px"><div class="wrap">
 <div class="ch-grid" data-grid>{cards}</div>
 {gals}
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
 <div class="final glass rv"><div class="orb o1"></div><div class="orb o2"></div>
  <div class="kicker" style="justify-content:center">نوبت توئه <span class="latin">Your Turn</span></div>
  <h2 class="h-lg">نمونه‌کار بعدی می‌تونه <span class="grad">مال تو باشه</span></h2>
  <p class="lead">با چالش سطحت رو بسنج یا دوره‌ها رو ببین.</p>
  <div class="cta-row"><a class="btn btn-primary mag" href="challenge.html">شروع چالش {icon('arrow','arrow')}</a><a class="btn btn-glass mag" href="index.html#courses">مشاهده‌ی دوره‌ها</a></div>
 </div>
</div></section>
</main>'''
    html += footer() + scripts('', '<script src="assets/js/media.js"></script>\n<script src="assets/js/works.js"></script>')
    return html

def home_box():
    posters = media.teaser_posters(3); tot = media.total(); n = len(media.chapters())
    thumbs = ''.join(f'<span class="wb-thumb t{i+1}"><img src="{p}" alt="" loading="lazy" decoding="async"><i>{icon("play")}</i></span>' for i, (p, _) in enumerate(posters))
    chips = ''.join(f'<span>{c[1]}</span>' for c in media.chapters()[:5])
    return f'''<a class="wbox rv" href="student-works.html" aria-label="نمونه‌کار هنرجوها — ورود به گالری">
   <span class="wb-glow" aria-hidden="true"></span><span class="wb-border" aria-hidden="true"></span>
   <span class="wb-text">
    <span class="kicker">ویژه <span class="latin">Student Works</span></span>
    <span class="wb-title">نمونه‌کار <span class="grad">هنرجوها</span></span>
    <span class="wb-sub">کارهای واقعی هنرجوها، فصل‌به‌فصل؛ از موشن‌گرافی تا تبلیغ محصول.</span>
    <span class="wb-chips">{chips}<span class="more">+{fa(max(0, n-5))}</span></span>
    <span class="wb-cta"><span class="btn btn-primary">ورود به گالری {icon('arrow','arrow')}</span><span class="wb-stat"><b>{fa(tot)}</b> نمونه‌کار · <b>{fa(n)}</b> فصل</span></span>
   </span>
   <span class="wb-stack" aria-hidden="true">{thumbs}</span>
  </a>'''
