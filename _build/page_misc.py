import re
from common import *

import content, md

# Articles live in content/articles/<url>.json (edited in the admin panel); order = `order` field.
_ARTICLES = content.folder('articles')
ARTS = [(a['url'], a.get('title', ''), a.get('description', ''), a.get('minutes', ''), a.get('tag', ''), a.get('cover') or 'a1') for a in _ARTICLES]

def _cover(i, pre=''):
    a = _ARTICLES[i]; img = content.media_path(a.get('image'), pre)
    if img: return f'<div class="art" style="background:url(\'{img}\') center/cover no-repeat"></div>'
    return f'<div class="art {a.get("cover") or "a1"}"></div>'

def article_body(slug, pre=''):
    for a in _ARTICLES:
        if a['url'] == slug: return md.render(a.get('body', ''), pre)
    return ''

def blog():
    feat = ARTS[0]
    cards = ''
    for k,(slug,t,d,m,tag,art) in enumerate(ARTS):
        cards += f'''<a class="post glass rv{' feat' if k==0 else ''}" style="--d:{k*0.08:.2f}s" href="articles/{slug}.html" data-tilt="4">
   <div class="cover">{_cover(k)}<span class="tag">{tag}</span></div>
   <div class="post-body"><div class="meta">{icon('clock')} {m} دقیقه مطالعه</div><h2>{t}</h2><p>{d}</p><span class="read">خواندن مقاله {icon('arrow','arrow')}</span></div></a>'''
    html = head('مجله‌ی هوش مصنوعی | hana.aistudio', 'مقاله‌ها و آموزش‌های کوتاه درباره‌ی تولید محتوا، پرامپت‌نویسی و ساخت ویدیو با هوش مصنوعی.')
    html += nav('', 'blog.html')
    html += f'''<main><section class="page-head"><div class="wrap">
 <div class="crumbs rv"><a href="index.html">خانه</a><span>/</span><span>مجله</span></div>
 <div class="kicker rv">مجله <span class="latin">The Journal</span></div>
 <h1 class="h-xl" data-split>یادداشت‌هایی از <span class="grad">آینده‌ی محتوا</span></h1>
 <p class="lead rv">آموزش‌های کوتاه و کاربردی درباره‌ی پرامپت‌نویسی، تصویر و ویدیو با هوش مصنوعی.</p>
</div></section>
<section class="section" style="padding-top:10px"><div class="wrap posts">{cards}</div></section></main>'''
    html += footer() + scripts()
    return html

def article(i):
    slug,t,d,m,tag,art = ARTS[i]
    others = ''.join(f'<a class="link-row glass" href="{s}.html"><span class="lr-ic">{icon("book")}</span><span class="lr-tx"><b>{tt}</b><small>{mm} دقیقه مطالعه</small></span>{icon("arrow","arrow")}</a>' for s,tt,_,mm,_,_ in ARTS if s!=slug)
    html = head(f'{t} | هانا موسوی', d, '../')
    html += nav('../', 'blog.html')
    html += f'''<main><article class="reading">
 <header class="art-head"><div class="wrap narrow">
  <div class="crumbs rv"><a href="../index.html">خانه</a><span>/</span><a href="../blog.html">مجله</a><span>/</span><span>{tag}</span></div>
  <h1 class="h-lg rv">{t}</h1>
  <div class="byline rv"><span class="av"><svg viewBox="0 0 40 40"><use href="#mark"/></svg></span><span><b>هانا موسوی</b><small>{m} دقیقه مطالعه</small></span></div>
 </div></header>
 <div class="wrap narrow"><div class="art-cover rv">{_cover(i, '../')}<div class="gridlines"></div></div></div>
 <div class="wrap narrow prose">{article_body(slug, '../')}</div>
 <div class="wrap narrow">
  <div class="final glass" style="padding:44px 26px;margin-top:60px"><div class="orb o1"></div><div class="orb o2"></div>
   <h2 class="h-md" style="margin-bottom:12px">می‌خوای این‌ها رو قدم‌به‌قدم و عملی یاد بگیری؟</h2>
   <p class="muted" style="margin:0 0 24px">اول سطحت رو با چالش بسنج، یا برای اطلاعات دوره‌ها در تلگرام پیام بده.</p>
   <div class="cta-row" style="justify-content:center"><a class="btn btn-primary" href="../challenge.html">شروع چالش {icon('arrow','arrow')}</a><a class="btn btn-glass" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} تلگرام</a></div>
  </div>
  <h3 style="margin:60px 0 16px;font-size:18px">مقاله‌های دیگر</h3><div class="link-list">{others}</div>
 </div>
</article></main>'''
    html += footer('../') + scripts('../')
    return html

def _avatar(L):
    ph = content.media_path(L.get('photo'))
    if ph:
        return f'  <div class="lp-avatar"><div class="ring"></div><img src="{ph}" alt="هانا موسوی" style="position:absolute;inset:6px;width:calc(100% - 12px);height:calc(100% - 12px);object-fit:cover;border-radius:50%"></div>'
    return '''  <div class="lp-avatar"><div class="ring"></div><svg viewBox="0 0 100 120" fill="none" stroke="url(#gl)" stroke-width="1.2"><circle cx="50" cy="40" r="20"/><path d="M14 118c4-26 19-40 36-40s32 14 36 40"/></svg></div>
  <span class="ph-tag" style="margin-top:-8px">عکس پروفایل</span>'''

def links():
    L = content.load('links.json')
    rows = []
    for r in L.get('rows') or []:
        if r.get('visible') is False: continue
        c = content.course(r.get('course')) if r.get('kind') == 'course' else None
        if c:
            rows.append((r.get('icon') or 'spark', r.get('title') or f"دوره‌ی {c['name']}", r.get('subtitle') or f"{c.get('card_sub', '')}، {c['price']}", f"course.html?c={c['id']}", bool(r.get('highlight'))))
        else:
            rows.append((r.get('icon') or 'globe', r.get('title', ''), r.get('subtitle', ''), (r.get('url') or '').replace('{telegram}', TG).replace('{instagram}', IG), bool(r.get('highlight'))))
    rh = ''.join(f'<a class="link-row glass rv{" hot" if hot else ""}" style="--d:{k*0.05+.2:.2f}s" href="{h}"{" target=_blank rel=noopener" if h.startswith("http") else ""}><span class="lr-ic">{icon(ic)}</span><span class="lr-tx"><b>{t}</b><small>{s}</small></span>{icon("arrow","arrow")}</a>' for k,(ic,t,s,h,hot) in enumerate(rows))
    html = head('لینک‌ها | hana.aistudio', 'همه‌ی لینک‌های هانا موسوی: چالش سطح AI، دوره‌ها، تلگرام و مجله.')
    html += f'''<main class="links-page">
 <div class="lp-head rv">
{_avatar(L)}
  <h1>هانا موسوی</h1>
  <p class="latin">hana.aistudio</p>
  <p class="muted lp-bio">{L.get('bio', '')}</p>
  <div class="lp-social"><a href="{IG}" target="_blank" rel="noopener" aria-label="Instagram">{icon('instagram')}</a><a href="{TG}" target="_blank" rel="noopener" aria-label="Telegram">{icon('telegram')}</a></div>
 </div>
 <div class="link-list">{rh}</div>
 <p class="lp-foot latin">hana.aistudio</p>
</main>'''
    html += scripts()
    return html

def contact():
    html = head('همکاری با برندها | hana.aistudio', 'درخواست همکاری تبلیغاتی، تولید محتوا با هوش مصنوعی و ورکشاپ آموزشی با هانا موسوی.')
    html += nav('', 'contact.html')
    html += f'''<main><section class="page-head"><div class="wrap contact-grid">
 <div>
  <div class="crumbs rv"><a href="index.html">خانه</a><span>/</span><span>همکاری</span></div>
  <div class="kicker rv">همکاری <span class="latin">Collaborations</span></div>
  <h1 class="h-xl" data-split>بیایید با هم <span class="grad">بسازیم</span></h1>
  <p class="lead rv">برای همکاری تبلیغاتی، معرفی محصول، تولید محتوا با هوش مصنوعی یا ورکشاپ آموزشی، فرم رو پر کنید. برای پاسخ سریع‌تر می‌تونید در تلگرام هم پیام بدید.</p>
  <div class="collab-types rv">
   <div class="ct glass">{icon('brief')}<b>تبلیغ و معرفی محصول</b></div>
   <div class="ct glass">{icon('spark')}<b>تولید محتوا با AI</b></div>
   <div class="ct glass">{icon('book')}<b>ورکشاپ و آموزش تیمی</b></div>
  </div>
  <div class="sig rv" style="margin-top:26px"><a class="chip" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} hanatrick</a><a class="chip" href="{IG}" target="_blank" rel="noopener">{icon('instagram')} hana.aistudio</a></div>
 </div>
 <form class="glass form-card rv" id="contactForm" novalidate>
  <h2 class="h-md" style="margin-bottom:22px">فرم درخواست همکاری</h2>
  <div class="row2"><div class="field"><label for="cf-brand">نام برند / کسب‌وکار</label><input class="input" id="cf-brand" name="brand" required maxlength="80" autocomplete="organization"><span class="msg">نام برند رو وارد کنید.</span></div>
  <div class="field"><label for="cf-name">نام شما</label><input class="input" id="cf-name" name="name" required maxlength="60" autocomplete="name"><span class="msg">نام رو وارد کنید.</span></div></div>
  <div class="field"><label for="cf-contact">ایمیل یا شماره‌ی تماس</label><input class="input" id="cf-contact" name="contact" dir="ltr" required maxlength="80"><span class="msg">یک ایمیل معتبر یا شماره‌ی موبایل وارد کنید.</span></div>
  <div class="row2"><div class="field"><label for="cf-type">نوع همکاری</label><select class="input" id="cf-type" name="type"><option>تبلیغ و معرفی محصول</option><option>تولید محتوا با هوش مصنوعی</option><option>ورکشاپ و آموزش تیمی</option><option>سایر</option></select></div>
  <div class="field"><label for="cf-budget">بودجه‌ی تقریبی <small>(اختیاری)</small></label><input class="input" id="cf-budget" name="budget" maxlength="40"></div></div>
  <div class="field"><label for="cf-msg">توضیحات</label><textarea class="input" id="cf-msg" name="message" required maxlength="2000"></textarea><span class="msg">چند خط درباره‌ی همکاری بنویسید.</span></div>
  <input class="hp" name="website" tabindex="-1" maxlength="100" autocomplete="off" aria-hidden="true">
  <button class="btn btn-primary btn-block" type="submit">ارسال درخواست {icon('arrow','arrow')}</button>
  <p class="form-note" id="cf-done" hidden>درخواست شما ثبت شد. ممنون؛ به‌زودی پاسخ می‌دیم. برای پیگیری سریع‌تر در تلگرام هم پیام بدید.</p>
 </form>
</div></section></main>'''
    html += footer() + scripts('', '<script src="assets/js/submit.js"></script><script src="assets/js/contact.js"></script>')
    return html
