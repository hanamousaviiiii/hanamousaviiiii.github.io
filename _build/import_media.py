"""Adds files dropped into assets/media/students/<chapter-slug>/ to content/works.json
(for bulk uploads from the computer; the admin panel does this automatically for single uploads).

  python3 _build/import_media.py            # add new files, keep everything already listed
Optional captions.json in the folder: {"file.mp4": "title"} or {"file.mp4": {"title": "...", "student": "..."}}"""
import os, json
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
P = os.path.join(ROOT, 'content', 'works.json')
IMG = ('.jpg', '.jpeg', '.png', '.webp', '.avif'); VID = ('.mp4', '.webm', '.mov')
W = json.load(open(P, encoding='utf-8'))
added = 0
for ch in W['chapters']:
    base = os.path.join(ROOT, 'assets', 'media', 'students', ch['slug'])
    if not os.path.isdir(base): continue
    files = sorted(f for f in os.listdir(base) if not f.startswith('.'))
    caps = json.load(open(os.path.join(base, 'captions.json'), encoding='utf-8')) if 'captions.json' in files else {}
    known = {it.get('file') for it in ch.get('items', [])} | {it.get('poster') for it in ch.get('items', [])}
    stems = {os.path.splitext(f)[0] for f in files if os.path.splitext(f)[1].lower() in VID}
    for f in files:
        st, ext = os.path.splitext(f); ext = ext.lower(); rel = f'/assets/media/students/{ch["slug"]}/{f}'
        if rel in known: continue
        if ext in VID:
            poster = next((f'/assets/media/students/{ch["slug"]}/{s}{e}' for s in (st + '.poster', st) for e in IMG if os.path.exists(os.path.join(base, s + e))), '')
            kind = 'video'
        elif ext in IMG and st not in stems and not st.endswith('.poster'):
            poster, kind = '', 'img'
        else:
            continue
        c = caps.get(f, ''); title, student = (c.get('title', ''), c.get('student', '')) if isinstance(c, dict) else (c, '')
        ch.setdefault('items', []).append(dict(kind=kind, file=rel, poster=poster, title=title, student=student, shape='', visible=True)); added += 1
        print('added', rel)
json.dump(W, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2); open(P, 'a').write('\n')
print(added, 'new item(s)')
