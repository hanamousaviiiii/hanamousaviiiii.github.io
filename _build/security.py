"""Security hardening applied to every generated public page (GitHub Pages cannot send HTTP headers).

- Adds a per-page Content-Security-Policy <meta>, built from what the page actually loads:
  inline <script> blocks are allowed by their sha256 hash (no 'unsafe-inline' for scripts),
  external origins are taken from the page's own src/poster attributes, from enabled admin-panel
  plugins (plus their optional "CSP domains" field) and from CHALLENGE_ENDPOINT in assets/js/config.js.
- Adds <meta name="referrer" content="strict-origin-when-cross-origin">.
- Forces rel="noopener noreferrer" on every target=_blank link (including links typed in the CMS).
The admin panel (/admin/) is a separate hand-written page and is NOT processed here.
"""
import re, os, base64, hashlib
from urllib.parse import urlparse
import content

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def _origin(u):
    u = (u or '').strip()
    if u.startswith('//'): u = 'https:' + u
    p = urlparse(u)
    return f'{p.scheme}://{p.netloc}' if p.scheme in ('http', 'https') and p.netloc else None

def _endpoint_origins():
    try:
        s = open(os.path.join(ROOT, 'assets', 'js', 'config.js'), encoding='utf-8').read()
    except OSError:
        return set()
    m = re.search(r"CHALLENGE_ENDPOINT\s*:\s*['\"]([^'\"]*)['\"]", s)
    o = _origin(m.group(1)) if m else None
    if not o: return set()
    out = {o}
    if 'script.google.com' in o:  # Apps Script answers through a redirect to googleusercontent
        out.add('https://script.googleusercontent.com')
    return out

def _plugin_origins(page):
    out = set()
    for p in content.site().get('plugins') or []:
        if not p.get('enabled'): continue
        pages = [x.strip() for x in (p.get('pages') or '').split(',') if x.strip()]
        if pages and page not in pages: continue
        for u in re.findall(r'(?:https?:)?//[A-Za-z0-9.-]+\.[A-Za-z]{2,}', p.get('code') or ''):
            o = _origin(u)
            if o: out.add(o)
        for d in re.split(r'[\s,]+', p.get('csp') or ''):
            d = d.strip()
            if not d: continue
            o = _origin(d if '//' in d else 'https://' + d)
            if o: out.add(o)
    return out

_SCRIPT = re.compile(r'<script\b([^>]*)>(.*?)</script>', re.S | re.I)
_A = re.compile(r'<a\b[^>]*>', re.I)

def _fix_rel(tag):
    if not re.search(r'\btarget\s*=\s*["\']?_blank', tag, re.I): return tag
    tag = re.sub(r'\s+rel\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)', '', tag, flags=re.I)
    return tag[:-1].rstrip() + ' rel="noopener noreferrer">'

def csp_for(html, page):
    hashes = []
    for attrs, body in _SCRIPT.findall(html):
        if re.search(r'\bsrc\s*=', attrs, re.I): continue
        t = re.search(r'\btype\s*=\s*["\']?([^"\'\s>]+)', attrs, re.I)
        if t and t.group(1).lower() not in ('module', 'text/javascript', 'application/javascript'): continue  # JSON-LD etc. is not executed
        h = "'sha256-" + base64.b64encode(hashlib.sha256(body.encode('utf-8')).digest()).decode() + "'"
        if h not in hashes: hashes.append(h)
    ext_scripts = {o for o in (_origin(u) for u in re.findall(r'<script\b[^>]*\bsrc\s*=\s*["\']([^"\']+)', html, re.I)) if o}
    ext_media = {o for o in (_origin(u) for u in re.findall(r'\b(?:src|poster|data-src|data-poster)\s*=\s*["\']([^"\']+)', html, re.I)) if o}
    ext_frames = {o for o in (_origin(u) for u in re.findall(r'<iframe\b[^>]*\bsrc\s*=\s*["\']([^"\']+)', html, re.I)) if o}
    plug = _plugin_origins(page)
    j = lambda *sets: ''.join(' ' + x for x in sorted(set().union(*sets)))
    return '; '.join([
        "default-src 'self'",
        "script-src 'self'" + ''.join(' ' + h for h in hashes) + j(ext_scripts, plug),
        "style-src 'self' 'unsafe-inline'" + j(plug),
        "img-src 'self' data: blob:" + j(ext_media, plug),
        "media-src 'self' blob:" + j(ext_media, plug),
        "font-src 'self'" + j(plug),
        "connect-src 'self'" + j(_endpoint_origins(), plug),
        "frame-src " + (j(ext_frames, plug).strip() or "'none'"),
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
    ])

def harden(html, page):
    html = _A.sub(lambda m: _fix_rel(m.group(0)), html)
    for bad in re.findall(r'\b(?:src|href|poster)\s*=\s*["\']http://[^"\']+', html, re.I):
        print('  WARNING insecure http:// resource in', page, '->', bad)
    meta = ('<meta http-equiv="Content-Security-Policy" content="' + csp_for(html, page) + '">\n'
            '<meta name="referrer" content="strict-origin-when-cross-origin">')
    return re.sub(r'(<meta charset="utf-8">)', lambda m: m.group(1) + '\n' + meta, html, count=1)
