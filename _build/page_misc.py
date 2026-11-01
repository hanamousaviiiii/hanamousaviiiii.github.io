import re
from common import *

ARTS = [
 ('start-ai-content', 'شروع تولید محتوا با هوش مصنوعی: از کجا شروع کنم؟', 'نقشه‌ی راه ساده برای استفاده از ابزارهای هوش مصنوعی در تولید محتوای شبکه‌های اجتماعی.', '۶', 'راهنمای شروع', 'a1'),
 ('better-prompts', 'هنر پرامپت‌نویسی: چطور از AI جواب بهتر بگیریم؟', 'فرمول یک پرامپت خوب، اشتباه‌های رایج و نمونه‌های کاربردی برای گرفتن جواب بهتر از هوش مصنوعی.', '۷', 'پرامپت', 'a3'),
 ('ai-video-basics', 'ساخت ویدیو با هوش مصنوعی: مفاهیم پایه برای شروع', 'آشنایی با ساخت ویدیو با هوش مصنوعی: متن‌به‌ویدیو، تصویر‌به‌ویدیو و نکات ساخت کلیپ‌های طبیعی‌تر.', '۷', 'ویدیو', 'a6'),
]
EMOJI = re.compile('[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200d\u2300-\u23FF]')

def article_body(slug):
    s = open(f'/workspace/hana-site/articles/{slug}.html', encoding='utf-8').read()
    body = s.split('<div class="hero-cover">', 1)[1].split('</div>', 1)[1]
    body = body.split('<div class="cta-band"', 1)[0]
    body = EMOJI.sub('', body)
    body = body.replace('<div class="tip">', '<aside class="callout glass">').replace('</div>', '</aside>')
    body = body.replace('soft purple and pink pastel background', 'deep crimson and electric blue rim light, dark background')
    body = body.replace('<pre>', '<pre dir="auto">')
    body = re.sub(r'<aside class="callout glass">\s*', '<aside class="callout glass">', body)
    return body.strip()

def blog():
    feat = ARTS[0]
    cards = ''
    for k,(slug,t,d,m,tag,art) in enumerate(ARTS):
        cards += f'''<a class="post glass rv{' feat' if k==0 else ''}" style="--d:{k*0.08:.2f}s" href="articles/{slug}.html" data-tilt="4">
   <div class="cover"><div class="art {art}"></div><span class="tag">{tag}</span></div>
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
 <div class="wrap narrow"><div class="art-cover rv"><div class="art {art}"></div><div class="gridlines"></div></div></div>
 <div class="wrap narrow prose">{article_body(slug)}</div>
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

def links():
    rows = [
      ('target', 'چالش سطح هوش مصنوعی', 'ببین کجای مسیری؛ حدود ۵ دقیقه', 'challenge.html', True),
      ('spark', 'دوره‌ی دستیار هوشمند', 'از صفر تا درآمد با هوش مصنوعی، ۶٫۵ میلیون تومان', 'course.html?c=smart-assistant', False),
      ('edit', 'دوره‌ی ادیتور پلاس', 'ادیت حرفه‌ای با موبایل، ۳٫۵ میلیون تومان', 'course.html?c=editor-plus', False),
      ('play', 'نمونه‌کار هنرجوها', 'گالری کارهای هنرجوها، فصل‌به‌فصل', 'student-works.html', False),
      ('telegram', 'تلگرام · ثبت‌نام و مشاوره', '@hanatrick', TG, False),
      ('book', 'مجله‌ی هوش مصنوعی', 'آموزش‌ها و مقاله‌های کوتاه', 'blog.html', False),
      ('brief', 'همکاری با برندها', 'تبلیغ، تولید محتوا و ورکشاپ', 'contact.html', False),
      ('globe', 'وب‌سایت', 'صفحه‌ی اصلی hana.aistudio', 'index.html', False),
    ]
    rh = ''.join(f'<a class="link-row glass rv{" hot" if hot else ""}" style="--d:{k*0.05+.2:.2f}s" href="{h}"{" target=_blank rel=noopener" if h.startswith("http") else ""}><span class="lr-ic">{icon(ic)}</span><span class="lr-tx"><b>{t}</b><small>{s}</small></span>{icon("arrow","arrow")}</a>' for k,(ic,t,s,h,hot) in enumerate(rows))
    html = head('لینک‌ها | hana.aistudio', 'همه‌ی لینک‌های هانا موسوی: چالش سطح AI، دوره‌ها، تلگرام و مجله.')
    html += f'''<main class="links-page">
 <div class="lp-head rv">
  <div class="lp-avatar"><div class="ring"></div><svg viewBox="0 0 100 120" fill="none" stroke="url(#gl)" stroke-width="1.2"><circle cx="50" cy="40" r="20"/><path d="M14 118c4-26 19-40 36-40s32 14 36 40"/></svg></div>
  <span class="ph-tag" style="margin-top:-8px">عکس پروفایل</span>
  <h1>هانا موسوی</h1>
  <p class="latin">hana.aistudio</p>
  <p class="muted lp-bio">آموزش ادیت موبایل و خلق محتوا با هوش مصنوعی</p>
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
  <div class="row2"><div class="field"><label for="cf-brand">نام برند / کسب‌وکار</label><input class="input" id="cf-brand" name="brand" required autocomplete="organization"><span class="msg">نام برند رو وارد کنید.</span></div>
  <div class="field"><label for="cf-name">نام شما</label><input class="input" id="cf-name" name="name" required autocomplete="name"><span class="msg">نام رو وارد کنید.</span></div></div>
  <div class="field"><label for="cf-contact">ایمیل یا شماره‌ی تماس</label><input class="input" id="cf-contact" name="contact" dir="ltr" required><span class="msg">یک ایمیل معتبر یا شماره‌ی موبایل وارد کنید.</span></div>
  <div class="row2"><div class="field"><label for="cf-type">نوع همکاری</label><select class="input" id="cf-type" name="type"><option>تبلیغ و معرفی محصول</option><option>تولید محتوا با هوش مصنوعی</option><option>ورکشاپ و آموزش تیمی</option><option>سایر</option></select></div>
  <div class="field"><label for="cf-budget">بودجه‌ی تقریبی <small>(اختیاری)</small></label><input class="input" id="cf-budget" name="budget"></div></div>
  <div class="field"><label for="cf-msg">توضیحات</label><textarea class="input" id="cf-msg" name="message" required></textarea><span class="msg">چند خط درباره‌ی همکاری بنویسید.</span></div>
  <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <button class="btn btn-primary btn-block" type="submit">ارسال درخواست {icon('arrow','arrow')}</button>
  <p class="form-note" id="cf-done" hidden>درخواست شما ثبت شد. ممنون؛ به‌زودی پاسخ می‌دیم. برای پیگیری سریع‌تر در تلگرام هم پیام بدید.</p>
 </form>
</div></section></main>'''
    html += footer() + scripts('', '<script src="assets/js/submit.js"></script><script src="assets/js/contact.js"></script>')
    return html
