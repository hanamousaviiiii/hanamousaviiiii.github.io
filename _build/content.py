"""Loads the editable site content from content/*.json (edited in the admin panel at /admin/)."""
import os, json, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CONTENT = os.path.join(ROOT, 'content')
_cache = {}

def load(name, default=None):
    p = os.path.join(CONTENT, name)
    if p not in _cache:
        if not os.path.exists(p):
            _cache[p] = default if default is not None else {}
        else:
            with open(p, encoding='utf-8') as f:
                _cache[p] = json.load(f)
    return _cache[p]

def folder(name):
    """All entries of a folder collection (content/<name>/*.json), published only, sorted by `order`."""
    out = []
    for p in sorted(glob.glob(os.path.join(CONTENT, name, '*.json'))):
        with open(p, encoding='utf-8') as f:
            d = json.load(f)
        d.setdefault('url', os.path.splitext(os.path.basename(p))[0])
        if d.get('published', True):
            out.append(d)
    return sorted(out, key=lambda d: (float(d.get('order') or 999), d['url']))

def media_path(p, pre=''):
    """CMS stores uploads as '/assets/...'; pages need a path relative to their folder."""
    if not p: return ''
    if p.startswith('http') or p.startswith('//'): return p
    return pre + p.lstrip('/')

def site():
    return load('site.json', {'instagram': 'https://instagram.com/hana.aistudio', 'telegram': 'https://t.me/hanatrick', 'plugins': []})

def plugins(place, page=''):
    """Enabled plugin snippets for a placement ('head' or 'body')."""
    out = []
    for p in site().get('plugins') or []:
        if not p.get('enabled'): continue
        if (p.get('place') or 'body') != place: continue
        pages = [x.strip() for x in (p.get('pages') or '').split(',') if x.strip()]
        if pages and page not in pages: continue
        out.append(p.get('code') or '')
    return '\n'.join(out)

def courses(visible_only=False):
    cs = load('courses.json').get('courses', [])
    return [c for c in cs if c.get('visible', True)] if visible_only else cs

def course(cid):
    for c in courses():
        if c['id'] == cid: return c
    return None
