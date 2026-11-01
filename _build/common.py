# Shared partials for the static generator (run: python3 _build/gen.py)
TG = 'https://t.me/hanatrick'
IG = 'https://instagram.com/hana.aistudio'

def T(s, **kw):
    for k, v in kw.items():
        s = s.replace('{{' + k + '}}', str(v))
    return s

ICONS = {
 'arrow': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
 'telegram': '<path d="M21.5 3.6 2.8 10.9c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.4 4.6 3.4c.6.4 1.4.1 1.6-.6L22.9 5c.2-.9-.6-1.7-1.4-1.4ZM7.6 14.2l11-7.4-8.6 8.4"/>',
 'instagram': '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r=".7"/>',
 'spark': '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/>',
 'prompt': '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M12.5 15H17"/>',
 'image': '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="9.5" r="1.6"/><path d="m4 18 5.5-5.5 3.5 3.5 2.5-2.5L20 18"/>',
 'video': '<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3"/>',
 'wave': '<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/>',
 'edit': '<path d="M4 6h16M4 12h10M4 18h6"/><path d="M17 10v10M15 18l2 2 2-2"/>',
 'growth': '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 'flip': '<path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4"/>',
 'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 'mail': '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
 'brief': '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>',
 'play': '<path d="M8 5.5v13l11-6.5z"/>',
 'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 'book': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
 'shield': '<path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
 'refresh': '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
 'target': '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
 'globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z"/>',
 'camera': '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 'layers': '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
 'smile': '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0M9 9.5h.01M15 9.5h.01"/>',
 'phone': '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
 'film': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>',
 'bag': '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
 'music': '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
}

def icon(name, cls=''):
    return f'<svg class="i {cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>'

# global sprite: gradients + card frame + emblems
SPRITE = '''<svg class="sprite" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<defs>
 <linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fe0ff"/><stop offset=".45" stop-color="#cfd8ff"/><stop offset="1" stop-color="#ff5a6e"/></linearGradient>
 <linearGradient id="gl2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4CC9F0"/><stop offset="1" stop-color="#D7263D"/></linearGradient>
 <radialGradient id="gcore" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="#ff5a6e" stop-opacity=".35"/><stop offset="1" stop-color="#2F6BFF" stop-opacity="0"/></radialGradient>
 <symbol id="frame" viewBox="0 0 250 370">
  <g fill="none" stroke="url(#gl)" stroke-linecap="round">
   <rect x="9" y="9" width="232" height="352" rx="14" stroke-width=".9" opacity=".9"/>
   <rect x="17" y="17" width="216" height="336" rx="9" stroke-width=".5" opacity=".55"/>
   <!-- ornate corners (top-left / bottom-right) -->
   <g id="corner" stroke-width=".8">
     <path d="M17 62C17 36 36 17 62 17"/>
     <path d="M25 70V40q0-15 15-15h30" opacity=".7"/>
     <path d="M33 33l8 8M41 33l-8 8" opacity=".6"/>
     <path d="M37 27l6 6-6 6-6-6z"/>
     <circle cx="70" cy="25" r="1.6" fill="url(#gl)" stroke="none"/><circle cx="25" cy="70" r="1.6" fill="url(#gl)" stroke="none"/>
   </g>
   <use href="#corner" transform="rotate(180 125 185)"/>
   <!-- top & bottom crest -->
   <g id="crest" stroke-width=".7">
     <path d="M92 17c12 0 20 4 33 14 13-10 21-14 33-14" />
     <path d="M125 22l5 5-5 5-5-5z" fill="rgba(255,90,110,.35)"/>
     <path d="M104 25h-14M146 25h14" opacity=".5"/>
   </g>
   <use href="#crest" transform="rotate(180 125 185)"/>
   <!-- side beads -->
   <g opacity=".6" stroke-width=".6"><path d="M17 160v50M233 160v50"/><circle cx="17" cy="185" r="3"/><circle cx="233" cy="185" r="3"/></g>
   <!-- emblem halo rings -->
   <circle cx="125" cy="152" r="78" stroke-width=".5" opacity=".35" stroke-dasharray="1 5"/>
   <circle cx="125" cy="152" r="86" stroke-width=".4" opacity=".2"/>
   <!-- title cartouche -->
   <path d="M46 268h158M46 316h158" stroke-width=".5" opacity=".45"/>
   <path d="M46 268l-8 24 8 24M204 268l8 24-8 24" stroke-width=".6" opacity=".55"/>
  </g>
 </symbol>
 <symbol id="emb-editor" viewBox="0 0 120 120">
  <g fill="none" stroke="url(#gl)" stroke-linecap="round" stroke-linejoin="round">
   <circle cx="60" cy="60" r="56" stroke-width="5" stroke-dasharray=".8 6.2" opacity=".8" class="spin"/>
   <circle cx="60" cy="60" r="47" stroke-width="1"/>
   <circle cx="60" cy="60" r="43" stroke-width=".5" opacity=".5"/>
   <path d="M60 13v10M60 97v10M13 60h10M97 60h10" stroke-width="1"/>
   <rect x="34" y="34" width="52" height="52" rx="3" transform="rotate(45 60 60)" stroke-width="1"/>
   <!-- film frame -->
   <rect x="40" y="44" width="40" height="32" rx="4" stroke-width="1.2"/>
   <path d="M40 50h40M40 70h40" stroke-width=".7" opacity=".7"/>
   <path d="M45 47h2M51 47h2M57 47h2M63 47h2M69 47h2M75 47h0M45 73h2M51 73h2M57 73h2M63 73h2M69 73h2" stroke-width="1.2" opacity=".8"/>
   <path d="M55 54v12l10-6z" fill="url(#gl)" stroke-width="1"/>
   <circle cx="60" cy="60" r="3" fill="#fff" stroke="none" opacity=".0"/>
  </g>
 </symbol>
 <symbol id="emb-assistant" viewBox="0 0 120 120">
  <g fill="none" stroke="url(#gl)" stroke-linecap="round" stroke-linejoin="round">
   <circle cx="60" cy="60" r="56" stroke-width="5" stroke-dasharray=".8 6.2" opacity=".8" class="spin"/>
   <circle cx="60" cy="60" r="47" stroke-width="1"/>
   <path d="M60 18 70 50 102 60 70 70 60 102 50 70 18 60 50 50z" stroke-width="1"/>
   <path d="M60 30 66 54 90 60 66 66 60 90 54 66 30 60 54 54z" stroke-width=".5" opacity=".5" transform="rotate(45 60 60)"/>
   <!-- eye -->
   <path d="M38 60c8-10 16-14 22-14s14 4 22 14c-8 10-16 14-22 14s-14-4-22-14z" stroke-width="1.2"/>
   <circle cx="60" cy="60" r="8" stroke-width="1.2"/>
   <circle cx="60" cy="60" r="3.2" fill="url(#gl)" stroke="none"/>
   <!-- neural nodes -->
   <g fill="url(#gl)" stroke="none"><circle cx="60" cy="18" r="2.2"/><circle cx="102" cy="60" r="2.2"/><circle cx="60" cy="102" r="2.2"/><circle cx="18" cy="60" r="2.2"/></g>
  </g>
 </symbol>
 <symbol id="mark" viewBox="0 0 40 40">
  <g fill="none" stroke-linecap="round">
   <circle cx="20" cy="20" r="17" stroke="url(#gl)" stroke-width="1.2"/>
   <path d="M13 11v18M27 11v18M13 20h14" stroke="#fff" stroke-width="2.2"/>
   <circle cx="20" cy="20" r="2.4" fill="#ff5a6e"/>
  </g>
 </symbol>
</defs></svg>'''

def head(title, desc, pre='', extra=''):
    return f'''<!doctype html>
<html lang="fa" dir="rtl" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#05060b">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<link rel="icon" href="{pre}assets/img/mark.svg" type="image/svg+xml">
<link rel="preload" href="{pre}assets/fonts/vazirmatn.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{pre}assets/css/style.css">
{extra}
</head>
<body>
{SPRITE}
<div class="ambient" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div>
<div class="grain" aria-hidden="true"></div>
'''

NAV_ITEMS = [('index.html#courses', 'دوره‌ها', 'Courses'), ('challenge.html', 'چالش', 'Challenge'), ('student-works.html', 'نمونه‌کارها', 'Works'), ('ai-faq.html', 'سؤالات AI', 'AI FAQ'), ('blog.html', 'مجله', 'Journal'), ('links.html', 'لینک‌ها', 'Links'), ('contact.html', 'همکاری', 'Collab')]

def nav(pre='', current=''):
    links = ''.join(f'<a href="{pre}{h}"{" aria-current=page" if current==h else ""}>{t}</a>' for h, t, _ in NAV_ITEMS)
    sheet = ''.join(f'<a href="{pre}{h}">{t}<small>{e}</small></a>' for h, t, e in NAV_ITEMS)
    return f'''<header class="nav"><div class="nav-pill glass">
  <a class="brand" href="{pre}index.html" aria-label="hana.aistudio — خانه"><svg class="brand-mark"><use href="#mark"/></svg><span>hana<b>.</b>aistudio</span></a>
  <nav class="nav-links" aria-label="منوی اصلی">{links}</nav>
  <div class="nav-cta"><a class="btn btn-primary btn-sm mag" href="{pre}challenge.html">شروع چالش</a><button class="menu-btn" aria-label="منو" aria-expanded="false"><i></i></button></div>
</div></header>
<nav class="sheet glass" aria-label="منوی موبایل"><a href="{pre}index.html">خانه<small>Home</small></a>{sheet}</nav>
'''

def footer(pre=''):
    return f'''<footer>
 <div class="wrap">
  <div class="foot">
   <div><a class="brand" href="{pre}index.html" style="padding:0;margin-bottom:14px;display:inline-flex"><svg class="brand-mark"><use href="#mark"/></svg><span>hana<b>.</b>aistudio</span></a>
    <p>آموزش ادیت موبایل و خلق محتوا با هوش مصنوعی، توسط هانا موسوی.</p></div>
   <div><h4>صفحه‌ها</h4><a href="{pre}index.html#courses">دوره‌ها</a><a href="{pre}challenge.html">چالش سطح AI</a><a href="{pre}student-works.html">نمونه‌کار هنرجوها</a><a href="{pre}ai-faq.html">سؤالات پرتکرار AI</a><a href="{pre}blog.html">مجله</a><a href="{pre}contact.html">همکاری با برندها</a></div>
   <div><h4>ارتباط</h4><a href="{IG}" target="_blank" rel="noopener">Instagram · hana.aistudio</a><a href="{TG}" target="_blank" rel="noopener">Telegram · hanatrick</a><a href="{pre}links.html">همه‌ی لینک‌ها</a></div>
  </div>
  <div class="big-word" aria-hidden="true">hana.aistudio</div>
  <div class="foot-bottom"><span>© <span data-year></span> hana.aistudio · تمام حقوق محفوظ است.</span><span class="latin" style="font-size:11px">Crafted with intelligence</span></div>
 </div>
</footer>
'''

def scripts(pre='', extra=''):
    return f'''<script src="{pre}assets/js/config.js"></script>
<script src="{pre}assets/js/data.js"></script>
<script src="{pre}assets/js/main.js"></script>
{extra}
</body></html>
'''

PH = lambda t='به‌زودی': f'<span class="ph-tag">{t}</span>'
