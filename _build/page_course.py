from common import *
from cards import card, COURSES

FA = '۰۱۲۳۴۵۶۷۸۹'
fa = lambda n: ''.join(FA[int(c)] for c in str(n))
import html as htmlmod
import content

def ph(s, tag='span'):
    """Text in [brackets] is a placeholder: shown with the small 'coming soon' style."""
    s = s or ''
    return f'<{tag} class="ph">{s}</{tag}>' if s.startswith('[') and s.endswith(']') else s

def _video(c, pre=''):
    v = content.media_path(c.get('intro_video'), pre)
    if not v:
        return f'''<div class="preview glass rv"><div class="art a1"></div><div class="play">{icon('play')}</div>{PH('ویدیوی معرفی دوره')}<span class="pv-cap">پیش‌نمایش دوره</span></div>'''
    poster = content.media_path(c.get('intro_poster'), pre)
    return f'''<div class="preview glass rv"><video src="{v}"{f' poster="{poster}"' if poster else ''} controls playsinline preload="metadata" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit"></video></div>'''

def _syllabus(c, pre=''):
    chapters = c.get('chapters') or []
    out = []
    for k, s in enumerate(c.get('syllabus') or []):
        num = fa(k + 1).rjust(2, '۰')
        title = htmlmod.escape(s)
        slug = (chapters[k].get('slug') if k < len(chapters) else '') or ''
        if slug:
            href = chapter_href(slug, pre)
            out.append(
                f'<li class="rv" style="--d:{min(k,8)*0.04:.2f}s"><a href="{href}"><span class="n">{num}</span><span>{title}</span></a></li>'
            )
        else:
            out.append(
                f'<li class="rv" style="--d:{min(k,8)*0.04:.2f}s"><span class="n">{num}</span><span>{title}</span></li>'
            )
    return ''.join(out)

def course_block(cid, pre=''):
    raw = content.course(cid) or {}
    c = COURSES[cid]
    sub, intro, count = c.get('page_sub', ''), c.get('intro', ''), c.get('count_label', '')
    ids = [x['id'] for x in content.courses(True)]
    other = ids[(ids.index(cid) + 1) % len(ids)] if cid in ids and len(ids) > 1 else None
    syl = _syllabus(raw or c, pre)
    perks = '\n        '.join(
        f'<div class="perk glass">{icon(p.get("icon") or "book")}<div><b>{(p.get("title") or "").replace("{count}", count)}</b><span{" class=\"ph\"" if (p.get("text") or "").startswith("[") else ""}>{p.get("text") or ""}</span></div></div>'
        for p in (c.get('perks') or [])
    )
    faq = ''.join(
        f'<details class="qa glass"><summary>{f.get("q","")}<span class="pm"></span></summary><div class="ans">{ph(f.get("a") or "[پاسخ — به‌زودی]")}</div></details>'
        for f in (c.get('faqs') or [])
    )
    support_title = (c.get('support_title') or '').strip()
    support_text = (c.get('support_text') or '').strip()
    support = ''
    if support_text:
        support = f'''<section class="section" style="padding-top:0">
 <div class="wrap">
  <div class="glass side-box rv" style="max-width:880px;margin-inline:auto">
   <h3>{support_title or "سه ماه پشتیبانی"}</h3>
   <p>{support_text}</p>
  </div>
 </div>
</section>
'''
    seo_h2 = (raw.get('seo_h2') or '').strip()
    seo_lead = (raw.get('seo_lead') or '').strip()
    extra_h = f'<h2 class="h-md rv course-seo-h2" style="--d:.12s">{htmlmod.escape(seo_h2)}</h2>' if seo_h2 else ''
    extra_p = f'<p class="lead rv" style="--d:.13s">{htmlmod.escape(seo_lead)}</p>' if seo_lead else ''
    other_block = ''
    if other:
        other_block = f'''<section class="section" style="padding-top:0"><div class="wrap"><a class="other glass" href="{course_href(other, pre)}" data-tilt="4"><span class="latin">{COURSES[other]['num']} — {COURSES[other]['latin']}</span><b>دوره‌ی دیگر: {COURSES[other]['name']}</b><span class="muted">{COURSES[other]['sub']} · {COURSES[other]['price']}</span>{icon('arrow','arrow big')}</a></div></section>'''
    aud = c.get('audience') or '[مخاطب دوره و پیش‌نیازها — به‌زودی]'
    aud_html = ph(aud, 'p') if aud.startswith('[') or not c.get('audience') else '<p>' + c['audience'] + '</p>'
    first = content.courses(True)[0]['id']
    hidden = '' if (pre or cid == first) else ' hidden'
    # On a dedicated static course page (pre set), never hide the block.
    if pre:
        hidden = ''
    return f'''<div class="course-view" data-course="{cid}"{hidden}>
<section class="page-head course-hero">
 <div class="wrap course-top">
  <div>
   <div class="crumbs rv"><a href="{pre}index.html">خانه</a><span>/</span><a href="{pre}index.html#courses">دوره‌ها</a><span>/</span><span>{c['name']}</span></div>
   <div class="kicker rv"><span class="latin">{c['num']} — {c['latin']}</span></div>
   <h1 class="h-xl rv">{c['name']}</h1>
   <p class="course-sub rv"><span class="grad">{sub}</span></p>
   {extra_h}
   <p class="lead rv" style="--d:.1s">{intro}</p>
   {extra_p}
   <div class="price-big rv" style="--d:.15s"><small>شهریه</small><b>{c['price']}</b></div>
   <div class="cta-row rv" style="--d:.2s"><a class="btn btn-primary mag" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a><a class="btn btn-glass mag" href="{pre}challenge.html">اول سطحم رو بسنجم</a></div>
  </div>
  <div class="course-card-wrap rv" style="--d:.1s">{card(cid, flip=False, pre=pre)}</div>
 </div>
</section>
<section class="section" style="padding-top:20px"><div class="wrap"><div class="perks">{perks}</div></div></section>
{support}
<section class="section" style="padding-top:0">
 <div class="wrap course-grid">
  <div>
   <div class="kicker">سرفصل‌ها <span class="latin">Syllabus</span></div>
   <h2 class="h-lg" style="margin-bottom:30px">{count}، <span class="grad">قدم‌به‌قدم</span></h2>
   <ol class="syllabus">{syl}</ol>
  </div>
  <aside class="side">
   {_video(c, pre)}
   <div class="glass side-box rv"><h3>برای چه کسانی؟</h3>{aud_html}
    <div class="price"><b>{c['price']}</b></div>
    <a class="btn btn-primary btn-block" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a></div>
  </aside>
 </div>
</section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="kicker" style="justify-content:center">سؤالات دوره <span class="latin">FAQ</span></div><div class="faq">{faq}</div></div></section>
{other_block}
<div class="sticky-cta glass"><div><small>{c['name']}</small><b>{c['price']}</b></div><a class="btn btn-primary btn-sm" href="{TG}" target="_blank" rel="noopener">ثبت‌نام</a></div>
</div>'''

def _course_seo(c, path):
    url = abs_url(path)
    crumbs = [
        {"@type": "ListItem", "position": 1, "name": "خانه", "item": abs_url('index.html')},
        {"@type": "ListItem", "position": 2, "name": "دوره‌ها", "item": abs_url('index.html') + '#courses'},
        {"@type": "ListItem", "position": 3, "name": c['name'], "item": url},
    ]
    course_ld = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": c['name'],
        "description": c.get('seo_desc') or c.get('intro') or '',
        "url": url,
        "inLanguage": "fa-IR",
        "provider": {
            "@type": "Organization",
            "name": "hana.aistudio",
            "url": SITE,
            "sameAs": [x for x in (IG, TG) if x],
        },
        "isAccessibleForFree": False,
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "inLanguage": "fa-IR",
        },
    }
    parts = []
    for i, ch in enumerate(c.get('chapters') or [], 1):
        slug = ch.get('slug') or ''
        if not slug:
            continue
        parts.append({
            "@type": "WebPage",
            "name": f"فصل {fa(i)}: {ch.get('title') or ''}",
            "url": abs_url(f'chapters/{slug}.html'),
        })
    if parts:
        course_ld['hasPart'] = parts
    breadcrumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs}
    return url, [course_ld, breadcrumb]

def build_one(cid):
    c = content.course(cid)
    pre = '../'
    path = f'courses/{cid}.html'
    title = c.get('seo_title') or (c['name'] + ' | hana.aistudio')
    desc = c.get('seo_desc') or c.get('intro') or ''
    url, ld = _course_seo(c, path)
    html = head(title, desc, pre, canonical=url, og_url=url, json_ld=ld)
    html += nav(pre, 'index.html#courses')
    html += '<main>' + course_block(cid, pre) + '</main>'
    html += footer(pre)
    html += scripts(pre)
    return html

def build():
    html = head(
        'دوره‌ها | hana.aistudio',
        'جزئیات دوره‌های دستیار هوشمند و ادیتور پلاس: سرفصل‌ها، شهریه و ثبت‌نام.',
    )
    html += nav('', 'index.html#courses')
    html += '<main>' + ''.join(course_block(c['id']) for c in content.courses(True)) + '''
<noscript><div class="wrap" style="padding:24px 0 48px"><p>برای دیدن هر دوره، این صفحه‌ها را باز کن:</p><ul>'''
    html += ''.join(
        f'<li><a href="{course_href(c["id"])}">{c["name"]}</a></li>' for c in content.courses(True)
    )
    html += '</ul></div></noscript></main>'
    html += footer()
    html += scripts('', '''<script>
(function(){var ids=[].map.call(document.querySelectorAll("[data-course]"),function(e){return e.dataset.course});var c=new URLSearchParams(location.search).get("c");if(!c||ids.indexOf(c)<0)c=ids[0];if(c)location.replace("courses/"+encodeURIComponent(c)+".html");})();
</script>''')
    return html
