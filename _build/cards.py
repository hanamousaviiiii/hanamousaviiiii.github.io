from common import icon, TG

COURSES = {
 'editor-plus': dict(name='ادیتور پلاس', latin='EDITOR PLUS', num='II', emb='emb-editor', price='۳٫۵ میلیون تومان',
   sub='ادیت حرفه‌ای با موبایل',
   back=['صفر تا ۱۰۰ الایت موشن', 'تدوین مکالمه‌محور، زیبایی و دندانپزشکی', 'موشن‌گرافی، استوری موشن، کاور؛ اینشات و کپکات'],
   more='۱۴ سرفصل'),
 'smart-assistant': dict(name='دستیار هوشمند', latin='AI EDITOR BOOTCAMP', num='I', emb='emb-assistant', price='۶٫۵ میلیون تومان',
   sub='از صفر تا درآمد با هوش مصنوعی',
   back=['مهندسی پرامپت و سناریونویسی', 'تصویر، شخصیت‌سازی و صداگذاری با AI', 'ویدیو از عکس، لیپ‌سینک و کسب درآمد', 'پروژه‌های واقعی و کسب درآمد'],
   more='۱۴ فصل · شش ماه پشتیبانی · آپدیت رایگان'),
}

def suit(emb):
    # tiny index glyph
    if emb == 'emb-editor':
        return '<svg viewBox="0 0 16 16" fill="none" stroke="url(#gl)" stroke-width="1.2"><path d="M8 1.5 14.5 8 8 14.5 1.5 8z"/><path d="M6.5 5.8v4.4L10.2 8z" fill="url(#gl)"/></svg>'
    return '<svg viewBox="0 0 16 16" fill="none" stroke="url(#gl)" stroke-width="1.2"><path d="M8 1 9.6 6.4 15 8 9.6 9.6 8 15 6.4 9.6 1 8 6.4 6.4z"/><circle cx="8" cy="8" r="1.4" fill="url(#gl)"/></svg>'

def front(cid, c):
    return f'''<div class="face front">
   <div class="liq"><i></i><i></i></div>
   <svg class="frame" viewBox="0 0 250 370"><use href="#frame"/></svg>
   <div class="content">
    <div class="idx tr"><b>{c['num']}</b>{suit(c['emb'])}</div>
    <div class="idx bl"><b>{c['num']}</b>{suit(c['emb'])}</div>
    <div class="emblem"><svg viewBox="0 0 120 120"><use href="#{c['emb']}"/></svg></div>
    <div class="card-title"><h3>{c['name']}</h3><span class="latin">{c['latin']}</span><div class="rule"><i></i></div></div>
   </div>
   <div class="spec"></div><div class="holo"></div>
  </div>'''

def card(cid, flip=True):
    c = COURSES[cid]
    lis = ''.join(f'<li>{x}</li>' for x in c['back'][:3])
    back = f'''<div class="face back">
   <svg class="frame" viewBox="0 0 250 370"><use href="#frame"/></svg>
   <div class="content">
    <span class="latin" style="font-size:11px;color:var(--ink-3)">{c['num']} · {c['latin']}</span>
    <h3>{c['name']}</h3><div class="sub">{c['sub']}</div>
    <ul>{lis}</ul>
    <div class="more">{c['more']}</div>
    <div class="price"><b>{c['price']}</b></div>
    <div class="btns"><a class="btn btn-primary" href="course.html?c={cid}">جزئیات دوره {icon('arrow','arrow')}</a><a class="btn btn-glass" href="{TG}" target="_blank" rel="noopener">{icon('telegram')} ثبت‌نام در تلگرام</a></div>
   </div>
   </div>''' if flip else ''
    attrs = 'tabindex="0" role="button" aria-pressed="false" aria-label="کارت دوره‌ی ' + c['name'] + ' — برای دیدن جزئیات بچرخانید"' if flip else 'aria-hidden="true"'
    return f'''<div class="pcard{'' if flip else ' static'}" {attrs}>
  <div class="pcard-shadow"></div>
  <div class="pcard-inner">{front(cid, c)}{back}</div>
  {'<div class="flip-hint">' + icon('flip') + 'برای جزئیات بچرخان</div>' if flip else ''}
 </div>'''
