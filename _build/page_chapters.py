"""Dedicated Smart Assistant chapter pages, generated from content/courses.json."""
from common import *
import content
import html as htmlmod

FA = '۰۱۲۳۴۵۶۷۸۹'
fa = lambda n: ''.join(FA[int(c)] for c in str(n))


def all_entries():
    out = []
    for c in content.courses():
        chs = c.get('chapters') or []
        for i, ch in enumerate(chs):
            if ch.get('slug'):
                out.append((c, i, ch, chs))
    return out


def slugs():
    return [ch['slug'] for _, _, ch, _ in all_entries()]


def build(c, i, ch, chs):
    pre = '../'
    n = i + 1
    slug = ch['slug']
    title = ch.get('title') or ''
    summary = ch.get('summary') or ''
    outcomes = ch.get('outcomes') or []
    seo_title = ch.get('seo_title') or f'فصل {fa(n)}: {title} | {c["name"]}'
    seo_desc = ch.get('seo_desc') or summary
    if len(seo_desc) > 170:
        # keep meta descriptions reasonably short without cutting mid-word harshly
        seo_desc = seo_desc[:167].rsplit(' ', 1)[0] + '…'
    h2 = (ch.get('h2') or '').strip()
    lead = (ch.get('lead') or '').strip()
    path = f'chapters/{slug}.html'
    url = abs_url(path)
    course_url = course_href(c['id'], pre)
    course_abs = abs_url(f"courses/{c['id']}.html")

    crumbs_ld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "خانه", "item": abs_url('index.html')},
            {"@type": "ListItem", "position": 2, "name": "دوره‌ها", "item": abs_url('index.html') + '#courses'},
            {"@type": "ListItem", "position": 3, "name": c['name'], "item": course_abs},
            {"@type": "ListItem", "position": 4, "name": f"فصل {fa(n)}: {title}", "item": url},
        ],
    }
    page_ld = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": seo_title,
        "description": seo_desc,
        "url": url,
        "inLanguage": "fa-IR",
        "isPartOf": {
            "@type": "Course",
            "name": c['name'],
            "url": course_abs,
        },
    }

    html = head(seo_title, seo_desc, pre, canonical=url, og_url=url, json_ld=[page_ld, crumbs_ld])
    html += nav(pre, 'index.html#courses')

    outcomes_html = ''
    if outcomes:
        lis = ''.join(f'<li class="glass rv">{htmlmod.escape(x)}</li>' for x in outcomes[:4])
        outcomes_html = f'''<div class="kicker">بعد از این فصل <span class="latin">Outcomes</span></div>
   <h2 class="h-md" style="margin-bottom:18px">چه‌کار می‌تونی بکنی؟</h2>
   <ul class="ch-outcomes">{lis}</ul>'''

    h2_html = f'<h2 class="h-md rv ch-seo-h2" style="--d:.08s">{htmlmod.escape(h2)}</h2>' if h2 else ''
    lead_html = f'<p class="lead rv" style="--d:.12s">{htmlmod.escape(lead)}</p>' if lead else ''

    prev_html = ''
    next_html = ''
    if i > 0:
        prev = chs[i - 1]
        prev_html = (
            f'<a class="other glass ch-nav-item" href="{chapter_href(prev["slug"], pre)}">'
            f'<span class="latin">فصل قبل · {fa(i)}</span>'
            f'<b>{htmlmod.escape(prev.get("title") or "")}</b></a>'
        )
    if i + 1 < len(chs):
        nxt = chs[i + 1]
        next_html = (
            f'<a class="other glass ch-nav-item" href="{chapter_href(nxt["slug"], pre)}">'
            f'<span class="latin">فصل بعد · {fa(i + 2)}</span>'
            f'<b>{htmlmod.escape(nxt.get("title") or "")}</b></a>'
        )

    html += f'''<main>
<article class="ch-page">
 <header class="page-head ch-hero">
  <div class="wrap narrow">
   <div class="crumbs rv"><a href="{pre}index.html">خانه</a><span>/</span><a href="{pre}index.html#courses">دوره‌ها</a><span>/</span><a href="{course_url}">{htmlmod.escape(c['name'])}</a><span>/</span><span>فصل {fa(n)}</span></div>
   <div class="kicker rv"><span class="latin">{c.get('num') or ''} — {c.get('latin') or ''}</span></div>
   <p class="ch-num rv"><span>فصل</span> <b>{fa(n)}</b> <span class="muted">از {fa(len(chs))}</span></p>
   <h1 class="h-xl rv">{htmlmod.escape(title)}</h1>
   {h2_html}
   <p class="lead rv" style="--d:.1s">{htmlmod.escape(summary)}</p>
   {lead_html}
   <div class="cta-row rv" style="--d:.2s">
    <a class="btn btn-primary mag" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a>
    <a class="btn btn-glass mag" href="{course_url}">بازگشت به صفحه‌ی دوره</a>
   </div>
  </div>
 </header>
 <section class="section" style="padding-top:0">
  <div class="wrap narrow">
   {outcomes_html}
  </div>
 </section>
 <section class="section" style="padding-top:0">
  <div class="wrap narrow">
   <div class="final glass" style="padding:44px 26px">
    <h2 class="h-md" style="margin-bottom:12px">آماده‌ای این مسیر را شروع کنی؟</h2>
    <p class="muted" style="margin:0 0 24px">برای ثبت‌نام در تلگرام پیام بده، یا اول سرفصل‌های کامل دوره را ببین.</p>
    <div class="cta-row" style="justify-content:center">
     <a class="btn btn-primary" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a>
     <a class="btn btn-glass" href="{course_url}">مشاهده‌ی دوره {c['name']}</a>
    </div>
   </div>
   <nav class="ch-nav" aria-label="فصل قبل و بعد">{prev_html}{next_html}</nav>
  </div>
 </section>
</article>
</main>'''
    html += footer(pre) + scripts(pre)
    return html
