# Media pipeline: student works by course chapter + the About photo.
# The list of chapters and samples lives in content/works.json (edited in the admin panel at /admin/).
# To bulk-add files dropped into assets/media/students/<chapter-slug>/ run `python3 _build/import_media.py`.
import os, json, html, shutil, subprocess, hashlib
import content
ROOT = os.path.join(os.path.dirname(__file__), '..')
IMG = ('.jpg', '.jpeg', '.png', '.webp', '.avif')
VID = ('.mp4', '.webm', '.mov')

def _works():
    return content.load('works.json', {'settings': {}, 'chapters': []})

def settings():
    d = dict(home_chips=5, home_thumbs=3, tile_shape='auto', show_student=True, empty_label='نمونه‌کار هنرجو')
    d.update({k: v for k, v in (_works().get('settings') or {}).items() if v not in (None, '')})
    return d

# (slug, title, latin, numeral, icon, visible) — order = order on the site
CHAPTERS = [(c['slug'], c.get('title', ''), c.get('latin', ''), c.get('num', ''), c.get('icon') or 'spark', bool(c.get('visible', True)))
            for c in _works().get('chapters', []) if c.get('slug')]

def fa(n): return str(n).translate(str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹'))

def chapters():
    return [c for c in CHAPTERS if c[5]]

POSTERS = os.path.join(ROOT, 'assets', 'media', 'posters')

def auto_poster(src):
    """First frame of a video as its cover, when the sample has no cover image (needs ffmpeg; skipped otherwise)."""
    if os.environ.get('HANA_AUTOPOSTER') == '0' or not shutil.which('ffmpeg'): return ''
    f = os.path.join(ROOT, src)
    if not os.path.exists(f): return ''
    name = os.path.splitext(os.path.basename(src))[0] + '-' + hashlib.md5(src.encode()).hexdigest()[:6] + '.jpg'
    out = os.path.join(POSTERS, name)
    if not os.path.exists(out):
        os.makedirs(POSTERS, exist_ok=True)
        try:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '0.5', '-i', f, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '4', out], check=True, timeout=120)
        except Exception as e:
            print('poster failed for', src, e); return ''
    return 'assets/media/posters/' + name

def scan(slug):
    """Samples of one chapter, from content/works.json."""
    for c in _works().get('chapters', []):
        if c.get('slug') != slug: continue
        out = []
        for it in c.get('items') or []:
            if it.get('visible') is False: continue
            src = content.media_path(it.get('file'))
            if not src: continue
            ext = os.path.splitext(src)[1].lower()
            kind = it.get('kind') or ('video' if ext in VID else 'img')
            if kind == 'video':
                poster = content.media_path(it.get('poster')) or auto_poster(src)
                out.append(dict(kind='video', src=src, poster=poster, title=it.get('title', ''), student=it.get('student', ''), shape=it.get('shape', '')))
            else:
                out.append(dict(kind='img', src=src, poster=src, title=it.get('title', ''), student=it.get('student', ''), shape=it.get('shape', '')))
        return out
    return []

def _shape(m):
    s = m.get('shape') or settings()['tile_shape']
    if s == 'tall': return 'tall'
    if s == 'square': return 'sq'
    return 'tall' if m['kind'] == 'video' else 'sq'

def tile(m, icon, chapter_title):
    st = settings(); t = html.escape(m['title'] or chapter_title)
    who = html.escape(m['student']) if (m['student'] and st['show_student']) else html.escape(st['empty_label'])
    if m['kind'] == 'video':
        thumb = f'<img src="{m["poster"]}" alt="" loading="lazy" decoding="async">' if m['poster'] else '<div class="art a5"></div>'
        return f'<button type="button" class="m-tile {_shape(m)}" data-lb="video" data-src="{m["src"]}" data-poster="{m["poster"]}" aria-label="پخش ویدیو: {t}">{thumb}<span class="m-play">{icon("play")}</span><span class="m-cap"><b>{t}</b><span>{who}</span></span></button>'
    return f'<button type="button" class="m-tile {_shape(m)}" data-lb="img" data-src="{m["src"]}" aria-label="بزرگ‌نمایی: {t}"><img src="{m["src"]}" alt="{t}" loading="lazy" decoding="async"><span class="m-cap"><b>{t}</b><span>{who}</span></span></button>'

def teaser_posters(n=None):
    n = int(settings()['home_thumbs']) if n is None else n
    out = []
    for c in chapters():
        for m in scan(c[0]):
            if m['poster']: out.append((m['poster'], c[1]))
    # spread across chapters: alternate
    if len(out) <= n: return out
    if n == 3: return [out[i] for i in (0, len(out) // 2, len(out) - 1)]
    return [out[round(i * (len(out) - 1) / max(1, n - 1))] for i in range(n)]

def total():
    return sum(len(scan(c[0])) for c in chapters())

def about_photo():
    base = os.path.join(ROOT, 'assets', 'media', 'about')
    if os.path.isdir(base):
        for f in sorted(os.listdir(base)):
            if os.path.splitext(f)[1].lower() in IMG:
                return f'assets/media/about/{f}'
    return ''
