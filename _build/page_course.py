from common import *
from cards import card, COURSES

FA = '۰۱۲۳۴۵۶۷۸۹'
fa = lambda n: ''.join(FA[int(c)] for c in str(n))
import content

def ph(s, tag='span'):
    """Text in [brackets] is a placeholder: shown with the small 'coming soon' style."""
    s = s or ''
    return f'<{tag} class="ph">{s}</{tag}>' if s.startswith('[') and s.endswith(']') else s

def _video(c):
    v = content.media_path(c.get('intro_video'))
    if not v:
        return f'''<div class="preview glass rv"><div class="art a1"></div><div class="play">{icon('play')}</div>{PH('ویدیوی معرفی دوره')}<span class="pv-cap">پیش‌نمایش دوره</span></div>'''
    poster = content.media_path(c.get('intro_poster'))
    return f'''<div class="preview glass rv"><video src="{v}"{f' poster="{poster}"' if poster else ''} controls playsinline preload="metadata" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit"></video></div>'''

def course_block(cid):
    c = COURSES[cid]; sub, intro, count = c.get('page_sub', ''), c.get('intro', ''), c.get('count_label', '')
    ids = [x['id'] for x in content.courses(True)]
    other = ids[(ids.index(cid) + 1) % len(ids)] if cid in ids and len(ids) > 1 else None
    syl = ''.join(f'<li class="rv" style="--d:{min(k,8)*0.04:.2f}s"><span class="n">{fa(k+1).rjust(2,"۰")}</span><span>{s}</span></li>' for k,s in enumerate(c.get('syllabus') or []))
    perks = '\n        '.join(f'<div class="perk glass">{icon(p.get("icon") or "book")}<div><b>{(p.get("title") or "").replace("{count}", count)}</b><span{' class="ph"' if (p.get("text") or "").startswith("[") else ''}>{p.get("text") or ""}</span></div></div>' for p in (c.get('perks') or []))
    faq = ''.join(f'<details class="qa glass"><summary>{f.get("q","")}<span class="pm"></span></summary><div class="ans">{ph(f.get("a") or "[پاسخ — به‌زودی]")}</div></details>' for f in (c.get('faqs') or []))
    first = content.courses(True)[0]['id']
    return f'''<div class="course-view" data-course="{cid}"{'' if cid==first else ' hidden'}>
<section class="page-head course-hero">
 <div class="wrap course-top">
  <div>
   <div class="crumbs rv"><a href="index.html">خانه</a><span>/</span><a href="index.html#courses">دوره‌ها</a><span>/</span><span>{c['name']}</span></div>
   <div class="kicker rv"><span class="latin">{c['num']} — {c['latin']}</span></div>
   <h1 class="h-xl rv">{c['name']}</h1>
   <p class="course-sub rv"><span class="grad">{sub}</span></p>
   <p class="lead rv" style="--d:.1s">{intro}</p>
   <div class="price-big rv" style="--d:.15s"><small>شهریه</small><b>{c['price']}</b></div>
   <div class="cta-row rv" style="--d:.2s"><a class="btn btn-primary mag" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a><a class="btn btn-glass mag" href="challenge.html">اول سطحم رو بسنجم</a></div>
  </div>
  <div class="course-card-wrap rv" style="--d:.1s">{card(cid, flip=False)}</div>
 </div>
</section>
<section class="section" style="padding-top:20px"><div class="wrap"><div class="perks">{perks}</div></div></section>
<section class="section" style="padding-top:0">
 <div class="wrap course-grid">
  <div>
   <div class="kicker">سرفصل‌ها <span class="latin">Syllabus</span></div>
   <h2 class="h-lg" style="margin-bottom:30px">{count}، <span class="grad">قدم‌به‌قدم</span></h2>
   <ol class="syllabus">{syl}</ol>
  </div>
  <aside class="side">
   {_video(c)}
   <div class="glass side-box rv"><h3>برای چه کسانی؟</h3>{ph(c.get('audience') or '[مخاطب دوره و پیش‌نیازها — به‌زودی]', 'p') if (c.get('audience') or '').startswith('[') or not c.get('audience') else '<p>' + c['audience'] + '</p>'}
    <div class="price"><b>{c['price']}</b></div>
    <a class="btn btn-primary btn-block" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a></div>
  </aside>
 </div>
</section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="kicker" style="justify-content:center">سؤالات دوره <span class="latin">FAQ</span></div><div class="faq">{faq}</div></div></section>
{'' if not other else f'''<section class="section" style="padding-top:0"><div class="wrap"><a class="other glass" href="course.html?c={other}" data-tilt="4"><span class="latin">{COURSES[other]['num']} — {COURSES[other]['latin']}</span><b>دوره‌ی دیگر: {COURSES[other]['name']}</b><span class="muted">{COURSES[other]['sub']} · {COURSES[other]['price']}</span>{icon('arrow','arrow big')}</a></div></section>'''}
<div class="sticky-cta glass"><div><small>{c['name']}</small><b>{c['price']}</b></div><a class="btn btn-primary btn-sm" href="{TG}" target="_blank" rel="noopener">ثبت‌نام</a></div>
</div>'''

def build():
    html = head('دوره‌ها | hana.aistudio', 'جزئیات دوره‌های دستیار هوشمند و ادیتور پلاس: سرفصل‌ها، شهریه و ثبت‌نام.')
    html += nav('', 'index.html#courses')
    html += '<main>' + ''.join(course_block(c['id']) for c in content.courses(True)) + '</main>'
    html += footer()
    html += scripts('', '''<script>
(function(){var c=new URLSearchParams(location.search).get('c');var v=document.querySelectorAll('[data-course]');var ok=[].some.call(v,function(e){return e.dataset.course===c});if(!ok)c='%s';
v.forEach(function(e){e.hidden=e.dataset.course!==c});var d=window.HANA_COURSES&&HANA_COURSES[c];if(d)document.title=d.name+' | hana.aistudio';})();
</script>''' % content.courses(True)[0]['id'])
    return html
