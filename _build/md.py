"""Tiny Markdown renderer for the CMS (no dependencies).

Supports what the admin editor produces: ## / ### headings, paragraphs, **bold**,
*italic*, [links](url), ![images](src), `code`, - / * / 1. lists, > callouts,
``` code blocks, | pipe | tables |, and raw HTML blocks (a block that starts with "<").
Output classes match the site's CSS (callout = aside.callout.glass, code = pre[dir=auto],
table = div.tbl-wrap > table.cmp)."""
import re, html as _h

def _esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def _src(u):
    # site-absolute paths ("/assets/...") become relative so pages work from any folder
    return u

def inline(s, pre=''):
    codes = []
    def keep_code(m):
        codes.append('<code>' + _esc(m.group(1)) + '</code>'); return f'\x00{len(codes)-1}\x00'
    s = re.sub(r'`([^`]+)`', keep_code, s)
    s = re.sub(r'!\[([^\]]*)\]\(([^)\s]+)\)', lambda m: f'<img src="{_rel(m.group(2), pre)}" alt="{_h.escape(m.group(1))}" loading="lazy" decoding="async">', s)
    def link(m):
        t, u = m.group(1), m.group(2)
        ext = u.startswith('http')
        return f'<a href="{_rel(u, pre)}"' + (' target="_blank" rel="noopener"' if ext else '') + f'>{t}</a>'
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'__(.+?)__', r'<b>\1</b>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<i>\1</i>', s)
    s = re.sub(r'(?<![\w_])_(?!\s)(.+?)(?<!\s)_(?![\w_])', r'<i>\1</i>', s)
    s = s.replace('\\*', '*').replace('\\_', '_').replace('\\[', '[').replace('\\]', ']').replace('\\#', '#').replace('\\-', '-').replace('\\.', '.').replace('\\|', '|').replace('\\>', '>').replace('\\<', '<').replace('\\!', '!').replace('\\`', '`')
    s = re.sub('\x00(\\d+)\x00', lambda m: codes[int(m.group(1))], s)
    return s

def _rel(u, pre):
    if u.startswith('/') and not u.startswith('//'):
        return pre + u.lstrip('/')
    return u

_LI = re.compile(r'^\s*([-*+]|\d+[.)])\s+(.*)$')

def render(text, pre='', h2_ids=False):
    """Markdown -> HTML. h2_ids: give each ## heading id="s1", "s2", ... (used by FAQ guides' TOC)."""
    lines = (text or '').replace('\r\n', '\n').split('\n')
    out, i, n, h2n = [], 0, len(lines), 0
    def para_end(j):
        l = lines[j]
        return (not l.strip() or l.startswith('#') or l.startswith('```') or l.lstrip().startswith('>')
                or _LI.match(l) or l.lstrip().startswith('|') or l.lstrip().startswith('<'))
    while i < n:
        l = lines[i]; s = l.strip()
        if not s: i += 1; continue
        if s.startswith('```'):
            j = i + 1; buf = []
            while j < n and not lines[j].strip().startswith('```'): buf.append(lines[j]); j += 1
            out.append('<pre dir="auto">' + _esc('\n'.join(buf)) + '</pre>'); i = j + 1; continue
        m = re.match(r'^(#{1,6})\s+(.*?)\s*#*\s*$', s)
        if m:
            lv = max(2, len(m.group(1)))  # a single # inside content becomes h2 (page already has the h1)
            attr = ''
            if lv == 2 and h2_ids: h2n += 1; attr = f' id="s{h2n}"'
            out.append(f'<h{lv}{attr}>{inline(m.group(2), pre)}</h{lv}>'); i += 1; continue
        if s.startswith('<'):
            buf = []
            while i < n and lines[i].strip(): buf.append(lines[i]); i += 1
            out.append('\n'.join(buf)); continue
        if s.startswith('>'):
            buf = []
            while i < n and lines[i].strip().startswith('>'): buf.append(re.sub(r'^\s*>\s?', '', lines[i])); i += 1
            out.append('<aside class="callout glass">' + inline(' '.join(x.strip() for x in buf if x.strip()), pre) + '</aside>'); continue
        if s.startswith('|'):
            rows = []
            while i < n and lines[i].strip().startswith('|'): rows.append(lines[i].strip()); i += 1
            cells = lambda r: [c.strip() for c in re.split(r'(?<!\\)\|', r.strip().strip('|'))]
            head = cells(rows[0]); body = [cells(r) for r in rows[1:] if not re.match(r'^\|?\s*:?-{2,}', r.strip().strip('|').strip())]
            t = '<div class="tbl-wrap glass"><table class="cmp">\n<thead><tr>' + ''.join(f'<th>{inline(c, pre)}</th>' for c in head) + '</tr></thead>\n<tbody>\n'
            t += ''.join('<tr>' + ''.join(f'<td>{inline(c, pre)}</td>' for c in r) + '</tr>\n' for r in body)
            out.append(t + '</tbody></table></div>'); continue
        if _LI.match(l):
            ordered = _LI.match(l).group(1)[0].isdigit(); items = []
            while i < n and lines[i].strip():
                m = _LI.match(lines[i])
                if m: items.append(m.group(2).strip())
                elif items: items[-1] += ' ' + lines[i].strip()
                i += 1
                # allow one blank line between items of a "loose" list
                if i + 1 < n and not lines[i].strip() and _LI.match(lines[i + 1]) and (_LI.match(lines[i + 1]).group(1)[0].isdigit() == ordered): i += 1
            tag = 'ol' if ordered else 'ul'
            out.append(f'<{tag}>' + ''.join(f'<li>{inline(x, pre)}</li>' for x in items) + f'</{tag}>'); continue
        buf = [s]; i += 1
        while i < n and not para_end(i): buf.append(lines[i].strip()); i += 1
        out.append('<p>' + inline(' '.join(buf), pre) + '</p>')
    return '\n'.join(out)

def headings(text):
    """Plain text of the ## headings (for the FAQ guide table of contents)."""
    return [re.sub(r'<[^>]+>', '', inline(m.group(1))) for m in re.finditer(r'^##\s+(.*?)\s*#*\s*$', text or '', re.M)]
