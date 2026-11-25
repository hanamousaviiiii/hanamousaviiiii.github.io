"""Adds files dropped into assets/media/students/<chapter-slug>/ as new samples
in content/works/<chapter-slug>/*.json
(for bulk uploads from the computer; the admin panel does this automatically for single uploads).

  python3 _build/import_media.py            # add new files, keep everything already listed
Optional captions.json in the folder: {"file.mp4": "title"} or {"file.mp4": {"title": "...", "student": "..."}}"""
import os, json, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
META = os.path.join(ROOT, 'content', 'works.json')
IMG = ('.jpg', '.jpeg', '.png', '.webp', '.avif'); VID = ('.mp4', '.webm', '.mov')
W = json.load(open(META, encoding='utf-8'))
added = 0

def load_items(slug):
    folder = os.path.join(ROOT, 'content', 'works', slug)
    items = []
    if not os.path.isdir(folder):
        return items
    for p in glob.glob(os.path.join(folder, '*.json')):
        with open(p, encoding='utf-8') as f:
            d = json.load(f)
        if isinstance(d, dict):
            items.append((p, d))
    return items

for ch in W['chapters']:
    slug = ch['slug']
    base = os.path.join(ROOT, 'assets', 'media', 'students', slug)
    if not os.path.isdir(base):
        continue
    folder = os.path.join(ROOT, 'content', 'works', slug)
    os.makedirs(folder, exist_ok=True)
    existing = load_items(slug)
    files = sorted(f for f in os.listdir(base) if not f.startswith('.'))
    caps = json.load(open(os.path.join(base, 'captions.json'), encoding='utf-8')) if 'captions.json' in files else {}
    known = set()
    orders = []
    for _, it in existing:
        known.add(it.get('file'))
        known.add(it.get('poster'))
        try:
            orders.append(float(it.get('order') or 0))
        except (TypeError, ValueError):
            pass
    next_order = int(max(orders) + 1) if orders else 1
    stems = {os.path.splitext(f)[0] for f in files if os.path.splitext(f)[1].lower() in VID}
    for f in files:
        st, ext = os.path.splitext(f); ext = ext.lower(); rel = f'/assets/media/students/{slug}/{f}'
        if rel in known:
            continue
        if ext in VID:
            poster = next((f'/assets/media/students/{slug}/{s}{e}' for s in (st + '.poster', st) for e in IMG if os.path.exists(os.path.join(base, s + e))), '')
            kind = 'video'
        elif ext in IMG and st not in stems and not st.endswith('.poster'):
            poster, kind = '', 'img'
        else:
            continue
        c = caps.get(f, ''); title, student = (c.get('title', ''), c.get('student', '')) if isinstance(c, dict) else (c, '')
        data = dict(kind=kind, file=rel, poster=poster, title=title, student=student, shape='', visible=True, order=next_order)
        path = os.path.join(folder, st + '.json')
        n = 2
        while os.path.exists(path):
            path = os.path.join(folder, f'{st}-{n}.json'); n += 1
        with open(path, 'w', encoding='utf-8') as out:
            json.dump(data, out, ensure_ascii=False, indent=2)
            out.write('\n')
        next_order += 1
        added += 1
        print('added', rel)
print(added, 'new item(s)')
