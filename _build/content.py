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

_COURSE_ORDER = {'smart-assistant': 1, 'editor-plus': 2}

def courses(visible_only=False):
    paths = sorted(glob.glob(os.path.join(CONTENT, 'courses', '*.json')))
    if paths:
        cs = []
        for p in paths:
            with open(p, encoding='utf-8') as f:
                d = json.load(f)
            if not isinstance(d, dict):
                continue
            if isinstance(d.get('courses'), list):
                cs.extend(d['courses'])
                continue
            d.setdefault('id', os.path.splitext(os.path.basename(p))[0])
            cs.append(d)
        cs.sort(key=lambda d: (_COURSE_ORDER.get(d.get('id'), 999), d.get('id') or ''))
    else:
        cs = load('courses.json').get('courses', [])
    return [c for c in cs if c.get('visible', True)] if visible_only else cs

def course(cid):
    for c in courses():
        if c['id'] == cid: return c
    return None

def works():
    """Assemble gallery data: chapter meta in works.json, samples in content/works/<slug>/*.json."""
    base = load('works.json', {'settings': {}, 'chapters': []})
    data = {'settings': dict(base.get('settings') or {}), 'chapters': []}
    for raw in base.get('chapters') or []:
        ch = dict(raw)
        slug = ch.get('slug') or ''
        rows = []
        if slug:
            for p in glob.glob(os.path.join(CONTENT, 'works', slug, '*.json')):
                with open(p, encoding='utf-8') as f:
                    d = json.load(f)
                if not isinstance(d, dict):
                    continue
                try:
                    order = float(d.get('order'))
                except (TypeError, ValueError):
                    order = 999
                item = {k: v for k, v in d.items() if k not in ('order', 'url', 'published')}
                rows.append((order, os.path.basename(p), item))
        rows.sort()
        items = [r[2] for r in rows]
        if not items:
            items = list(ch.get('items') or [])
        ch['items'] = items
        data['chapters'].append(ch)
    return data
