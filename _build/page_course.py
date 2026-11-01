from common import *
from cards import card, COURSES

SYL = {
 'editor-plus': ['آموزش صفر تا ۱۰۰ برنامه‌ی الایت موشن','تدوین ویدیوی مکالمه‌محور در سطح حرفه‌ای با الایت موشن','تدوین حرفه‌ای حوزه‌ی زیبایی با الایت موشن','تدوین حرفه‌ای حوزه‌ی دندانپزشکی با الایت موشن','فصل جدید تکنیک‌محور الایت موشن','موشن‌گرافی با الایت موشن','طراحی حرفه‌ای ساخت کاور با الایت موشن','طراحی حرفه‌ای کاور و پست کاروسل با پیکسلب، قابل اجرا در الایت موشن','آموزش جامع استوری موشن','کالیگرافی و بنرهای مذهبی','آموزش کامل اینشات و کپکات','تدوین ویدیو با اینشات و کپکات، به‌صورت ساده و حرفه‌ای','آموزش ساخت آی‌موویی','نکات کاربردی استفاده از هوش مصنوعی'],
 'smart-assistant': ['آشنایی با اکوسیستم هوش مصنوعی','مهندسی پرامپت و مهندسی معکوس','سناریونویسی با هوش مصنوعی','طراحی بنر، کاور و محتوای گرافیکی','شخصیت‌سازی حرفه‌ای با هوش مصنوعی','تولید تصویر حرفه‌ای با AI','صداگذاری و ساخت ویس با هوش مصنوعی','لیپ‌سینک و انیمیت چهره','ساخت ویدیو از عکس','حرکت دوربین و جلوه‌های سینمایی','تدوین حرفه‌ای ویدیو','زیرنویس، ترجمه و بومی‌سازی محتوا','پروژه‌های واقعی بازار','کسب درآمد و جذب پروژه با مهارت AI'],
}
FA = '۰۱۲۳۴۵۶۷۸۹'
fa = lambda n: ''.join(FA[int(c)] for c in str(n))
INTRO = {
 'editor-plus': ('ادیت حرفه‌ای با موبایل','آموزش نرم‌افزارهای ادیت موبایل؛ از صفر تا ۱۰۰ الایت موشن تا اینشات، کپکات و آی‌مووی، با فصل‌های تخصصی برای تدوین مکالمه‌محور، حوزه‌ی زیبایی و دندانپزشکی، موشن‌گرافی و طراحی کاور.', '۱۴ سرفصل'),
 'smart-assistant': ('از صفر تا درآمد با هوش مصنوعی','بوت‌کمپ AI EDITOR در ۱۴ فصل: از شناخت اکوسیستم هوش مصنوعی و مهندسی پرامپت تا تصویر، صدا، لیپ‌سینک، ویدیو از عکس و در نهایت پروژه‌های واقعی بازار و کسب درآمد.', '۱۴ فصل'),
}

def course_block(cid):
    c = COURSES[cid]; sub, intro, count = INTRO[cid]
    other = 'smart-assistant' if cid == 'editor-plus' else 'editor-plus'
    syl = ''.join(f'<li class="rv" style="--d:{min(k,8)*0.04:.2f}s"><span class="n">{fa(k+1).rjust(2,"۰")}</span><span>{s}</span></li>' for k,s in enumerate(SYL[cid]))
    if cid == 'smart-assistant':
        perks = f'''<div class="perk glass">{icon('shield')}<div><b>شش ماه پشتیبانی</b><span>همراهی و رفع اشکال در طول مسیر یادگیری</span></div></div>
        <div class="perk glass">{icon('refresh')}<div><b>آپدیت رایگان</b><span>دسترسی به به‌روزرسانی‌ها بدون پرداخت هزینه</span></div></div>
        <div class="perk glass">{icon('book')}<div><b>{count}</b><span>از مقدماتی تا پروژه‌ی واقعی</span></div></div>'''
    else:
        perks = f'''<div class="perk glass">{icon('book')}<div><b>{count}</b><span>از صفر تا تکنیک‌های حرفه‌ای</span></div></div>
        <div class="perk glass">{icon('edit')}<div><b>فقط با موبایل</b><span>الایت موشن، اینشات، کپکات، آی‌مووی و پیکسلب</span></div></div>
        <div class="perk glass">{icon('shield')}<div><b>پشتیبانی</b><span class="ph">[جزئیات پشتیبانی — به‌زودی]</span></div></div>'''
    faq = ''.join(f'<details class="qa glass"><summary>{q}<span class="pm"></span></summary><div class="ans"><span class="ph">[پاسخ — به‌زودی]</span></div></details>' for q in ['دوره به چه صورت ارائه می‌شه و مدت دسترسی چقدره؟','برای شروع چه پیش‌نیازی لازمه؟','بعد از ثبت‌نام چطور به دوره دسترسی پیدا می‌کنم؟'])
    return f'''<div class="course-view" data-course="{cid}"{'' if cid=='smart-assistant' else ' hidden'}>
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
   <div class="preview glass rv"><div class="art a1"></div><div class="play">{icon('play')}</div>{PH('ویدیوی معرفی دوره')}<span class="pv-cap">پیش‌نمایش دوره</span></div>
   <div class="glass side-box rv"><h3>برای چه کسانی؟</h3><p class="ph">[مخاطب دوره و پیش‌نیازها — به‌زودی]</p>
    <div class="price"><b>{c['price']}</b></div>
    <a class="btn btn-primary btn-block" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a></div>
  </aside>
 </div>
</section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="kicker" style="justify-content:center">سؤالات دوره <span class="latin">FAQ</span></div><div class="faq">{faq}</div></div></section>
<section class="section" style="padding-top:0"><div class="wrap"><a class="other glass" href="course.html?c={other}" data-tilt="4"><span class="latin">{COURSES[other]['num']} — {COURSES[other]['latin']}</span><b>دوره‌ی دیگر: {COURSES[other]['name']}</b><span class="muted">{COURSES[other]['sub']} · {COURSES[other]['price']}</span>{icon('arrow','arrow big')}</a></div></section>
<div class="sticky-cta glass"><div><small>{c['name']}</small><b>{c['price']}</b></div><a class="btn btn-primary btn-sm" href="{TG}" target="_blank" rel="noopener">ثبت‌نام</a></div>
</div>'''

def build():
    html = head('دوره‌ها | hana.aistudio', 'جزئیات دوره‌های دستیار هوشمند و ادیتور پلاس: سرفصل‌ها، شهریه و ثبت‌نام.')
    html += nav('', 'index.html#courses')
    html += '<main>' + course_block('smart-assistant') + course_block('editor-plus') + '</main>'
    html += footer()
    html += scripts('', '''<script>
(function(){var c=new URLSearchParams(location.search).get('c');var v=document.querySelectorAll('[data-course]');var ok=[].some.call(v,function(e){return e.dataset.course===c});if(!ok)c='smart-assistant';
v.forEach(function(e){e.hidden=e.dataset.course!==c});var d=window.HANA_COURSES&&HANA_COURSES[c];if(d)document.title=d.name+' | hana.aistudio';})();
</script>''')
    return html
