# Media pipeline: student works by course chapter + the About photo.
# Drop files into assets/media/students/<chapter-slug>/ and run `python3 _build/gen.py`.
import os, json, html
ROOT = os.path.join(os.path.dirname(__file__), '..')
IMG = ('.jpg', '.jpeg', '.png', '.webp', '.avif')
VID = ('.mp4', '.webm', '.mov')

# slug, title, latin, numeral, icon, enabled  (set enabled=True to publish a hidden chapter)
CHAPTERS = [
 ('animation',       'انیمیشن‌سازی',                 'Animation',        'I',    'spark',   True),
 ('camera-shots',    'اجرای نماهای دوربین',          'Camera Shots',     'II',   'camera',  True),
 ('motion-graphics', 'موشن‌گرافی',                   'Motion Graphics',  'III',  'layers',  True),
 ('beauty-dental',   'حوزه‌ی زیبایی و دندان‌پزشکی',  'Beauty & Dental',  'IV',   'smile',   True),
 ('banners-images',  'ساخت بنر و تصاویر',            'Banners & Images', 'V',    'image',   True),
 ('story-motion',    'استوری موشن',                  'Story Motion',     'VI',   'phone',   True),
 ('series',          'ساخت سریال و ویدیوهای سریالی', 'Series',           'VII',  'film',    True),
 ('product-ads',     'تبلیغ محصول و آنلاین‌شاپ',     'Product Ads',      'VIII', 'bag',     True),
 ('music-video',     'موزیک ویدیو',                  'Music Video',      'IX',   'music',   False),
]

def fa(n): return str(n).translate(str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹'))

def chapters():
    return [c for c in CHAPTERS if c[5]]

def _caps(base):
    f = os.path.join(base, 'captions.json')
    if os.path.exists(f):
        try: return json.load(open(f, encoding='utf-8'))
        except Exception as e: print('captions.json error in', base, e)
    return {}

def scan(slug):
    """Items in assets/media/students/<slug>/ sorted by filename.
    captions.json (optional): {"file.mp4": "title"} or {"file.mp4": {"title": "...", "student": "..."}}"""
    base = os.path.join(ROOT, 'assets', 'media', 'students', slug)
    if not os.path.isdir(base): return []
    files = sorted(f for f in os.listdir(base) if not f.startswith('.'))
    caps = _caps(base)
    imgs = {os.path.splitext(f)[0]: f for f in files if os.path.splitext(f)[1].lower() in IMG}
    vids = [os.path.splitext(f)[0] for f in files if os.path.splitext(f)[1].lower() in VID]
    rel = f'assets/media/students/{slug}/'
    out = []
    for f in files:
        st, ext = os.path.splitext(f); ext = ext.lower()
        c = caps.get(f, ''); title, student = (c.get('title', ''), c.get('student', '')) if isinstance(c, dict) else (c, '')
        if ext in VID:
            p = imgs.get(st + '.poster') or imgs.get(st)
            out.append(dict(kind='video', src=rel + f, poster=rel + p if p else '', title=title, student=student))
        elif ext in IMG and st not in vids and not st.endswith('.poster'):
            out.append(dict(kind='img', src=rel + f, poster=rel + f, title=title, student=student))
    return out

def tile(m, icon, chapter_title):
    t = html.escape(m['title'] or chapter_title); who = html.escape(m['student']) if m['student'] else 'نمونه‌کار هنرجو'
    if m['kind'] == 'video':
        thumb = f'<img src="{m["poster"]}" alt="" loading="lazy" decoding="async">' if m['poster'] else '<div class="art a5"></div>'
        return f'<button type="button" class="m-tile tall" data-lb="video" data-src="{m["src"]}" data-poster="{m["poster"]}" aria-label="پخش ویدیو: {t}">{thumb}<span class="m-play">{icon("play")}</span><span class="m-cap"><b>{t}</b><span>{who}</span></span></button>'
    return f'<button type="button" class="m-tile sq" data-lb="img" data-src="{m["src"]}" aria-label="بزرگ‌نمایی: {t}"><img src="{m["src"]}" alt="{t}" loading="lazy" decoding="async"><span class="m-cap"><b>{t}</b><span>{who}</span></span></button>'

def teaser_posters(n=3):
    out = []
    for c in chapters():
        for m in scan(c[0]):
            if m['poster']: out.append((m['poster'], c[1]))
    # spread across chapters: alternate
    return out[:n] if len(out) <= n else [out[i] for i in (0, len(out) // 2, len(out) - 1)][:n]

def total():
    return sum(len(scan(c[0])) for c in chapters())

def about_photo():
    base = os.path.join(ROOT, 'assets', 'media', 'about')
    if os.path.isdir(base):
        for f in sorted(os.listdir(base)):
            if os.path.splitext(f)[1].lower() in IMG:
                return f'assets/media/about/{f}'
    return ''
