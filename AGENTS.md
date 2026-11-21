# AGENTS.md — hana.aistudio site guide

Instructions for any AI assistant (another Grok bot, Claude, Claude Code, ChatGPT, and similar) that will read, edit, or automate this repository.

Live site: https://hanamousaviiiii.github.io
Repository: https://github.com/hanamousaviiiii/hanamousaviiiii.github.io
Owner: Hana Mousavi (هانا موسوی). Brand: **hana.aistudio**. Instagram: [hana.aistudio](https://instagram.com/hana.aistudio). Telegram: [t.me/hanatrick](https://t.me/hanatrick).
Language of the site and of Hana's audience: **Persian**, mainly women. Reply to Hana in Persian.

## خلاصه فارسی

این مخزن، سایت استاتیک هانا موسوی (hana.aistudio) است. محتوا در `content/*.json` است و با `python3 _build/gen.py` به HTML تبدیل می‌شود. هر push به شاخه‌ی `main` سایت را با GitHub Actions روی GitHub Pages منتشر می‌کند. قبل از هر تغییر حتماً `git pull` کنید؛ پنل مدیریت (`/admin/`) هم مستقیم روی `main` commit می‌کند.

قوانین سخت: تم تیره با زرشکی و آبی، بدون ایموجی و رنگ پاستلی، روی نمونه‌کارها برچسب «نمونه‌کار هنرجو»، هرگز «۴۰۰+ هنرجو» نگویید، هدیه پرامپت رایگان ندهید، شماره کارت بانکی را روی سایت نگذارید، دوره «دستیار هوشمند» همیشه اول است، مقاله‌ها باید متن اصلی و بدون کپی باشند (فقط لینک منبع)، روش موشن‌گرافی هانا را فاش نکنید، منظومه‌ی متحرک هیرو را دست نزنید، و هیچ رمز یا توکنی وارد مخزن نشود.

برای اتوماسیون (بدون clone):
- RSS مقاله‌ها: https://hanamousaviiiii.github.io/feed.xml
- فهرست مقاله‌ها و نمونه‌کارها: https://hanamousaviiiii.github.io/api/content.json

---

## Hard rules (do not break)

- **Look:** dark theme, crimson/burgundy plus blue (`#9B111E` / `#D7263D` and `#2F6BFF` / `#4CC9F0`), liquid glass, premium AI feel. No emojis, no pastels, no childish style.
- **Student works** must be labelled «نمونه‌کار هنرجو» when no student name is set (`settings.empty_label` in `content/works.json`). Do not invent student names.
- **Never** claim «۴۰۰+ هنرجو» or “400+ students”.
- **Never** offer a free-prompt gift.
- **Never** put Hana's bank card number, or any payment card, on the site or in this repo.
- **Course order:** «دستیار هوشمند» (`smart-assistant`, ۶٫۵ میلیون تومان) always comes first, then «ادیتور پلاس» (`editor-plus`, ۳٫۵ میلیون تومان).
- **Articles must be copyright-safe:** write in original Persian; do not copy, closely paraphrase, or machine-translate other sites. Link to sources only. Quotes: at most one short phrase. No third-party images, logos, screenshots, or video frames — only generated images or Hana's own assets. Do not reuse another site's title verbatim.
- **Never reveal her motion-graphics method:** no tool names or step-by-step technique in article or work titles, or in article body, even if you know the tools. Course syllabus text that already names class software may stay as-is; do not expand it into a method write-up.
- **Do not touch the moving orb (منظومه):** leave `assets/js/hero3d.js` and the homepage hero orb alone unless Hana explicitly asks.
- **No secrets in the repo:** no passwords, tokens, API keys, `.env` files, invite codes, or webhooks with secrets. The DecapBridge GitHub token lives only in DecapBridge. Challenge/relay endpoints may be public URLs in `assets/js/config.js`, but tokens belong only on the relay server.
- Do not edit generated HTML at the repo root (`index.html`, `articles/*.html`, …). Edit `content/` or `_build/` and rebuild.

## Repository structure

```
content/                 Source of truth for editable text and lists (Decap CMS edits these)
  articles/*.json        One file per magazine article
  works.json             Student-work chapters and items
  courses.json           The two courses, in display order
  home.json              Homepage copy, about photo, section order
  faq/*.json             Long AI-FAQ guides
  ai-faq.json            Short FAQ answers on the homepage / AI FAQ hub
  links.json             Instagram link-in-bio page
  testimonials.json      Student testimonials (may be empty)
  site.json              Instagram / Telegram URLs and optional plugins
_build/                  Static generator (Python)
  gen.py                 Build entry point: writes HTML, data.js, feed.xml, api/content.json
  page_*.py              Page templates
  content.py             JSON loaders
  media.py               Student-work tiles and auto-posters
  security.py            Per-page CSP + referrer policy
  import_media.py        Bulk-add files dropped into assets/media/students/<slug>/
admin/                   Decap CMS (Persian UI) at /admin/
assets/css/style.css     Site styles
assets/js/               Front-end behaviour (see caution below)
assets/media/students/   Media files, one folder per chapter slug
assets/media/about/      Hana's about photo
.github/workflows/deploy.yml
feed.xml                 Generated RSS of articles
api/content.json         Generated articles + works index
```

`content/`, `_build/`, `apps-script/`, `*.md` (including this file and `CLAUDE.md`), and dotfiles are **not** deployed to GitHub Pages. The public site only gets the built HTML, `assets/`, `admin/`, `feed.xml`, and `api/`.

**Caution:** `assets/js/config.js`, `assets/js/submit.js`, and any challenge/relay files may be mid-change. Do not edit them unless that is your explicit task. `assets/js/data.js` is generated from `content/courses.json` — do not hand-edit it. Do not edit `assets/js/hero3d.js` (the moving orb).

## How content works

All public copy lives in `content/*.json`. The admin panel at `/admin/` (Decap CMS via DecapBridge) edits the same files and commits straight to `main`. After a clone or before a push: `git pull`.

Collections in a folder (`content/articles/*.json`, `content/faq/*.json`) are loaded by `_build/content.py` `folder()`: only entries with `"published": true` (default true), sorted by `order` ascending (lower number appears first; the first article is featured on `blog.html`), then by `url`. The filename stem should match the `url` field: `content/articles/my-slug.json` → `https://hanamousaviiiii.github.io/articles/my-slug.html`.

### Article schema (`content/articles/<url>.json`)

| Field | Type | Notes |
|---|---|---|
| `url` | string | `^[a-z0-9-]+$`. Becomes `articles/<url>.html`. |
| `title` | string | Original title; do not copy another site's headline. |
| `description` | string | Short meta / card text. |
| `minutes` | string | Persian numeral is fine, e.g. `"۷"`. |
| `tag` | string | e.g. `ابزارها`, `پرامپت`, `ویدیو`. |
| `cover` | string | Fallback art class `a1`–`a7` when there is no `image`. |
| `image` | string | Optional cover image path (`/assets/...`). Prefer generated or Hana's assets. |
| `order` | number | Lower = higher on the blog. Give a new article the next integer (currently the latest is 9). |
| `published` | boolean | `false` keeps it out of the site, RSS, and API. |
| `body` | string | Markdown. |
| `date` | string | Optional `YYYY-MM-DD`. Used by RSS/`api`. If omitted, the build falls back to the file's last git commit date. |

### Example: add an article

1. Write original Persian (see copyright rules above).
2. Create `content/articles/choose-ai-tool-for-each-task.json` (name = `url`):

```json
{
  "url": "choose-ai-tool-for-each-task",
  "title": "برای هر کار محتوا، کدام ابزار هوش مصنوعی را انتخاب کنی؟",
  "description": "نقشه‌ای کاربردی برای ادمین‌ها و تولیدکننده‌های محتوا: برای نوشتن، تحقیق، تصویر، ویدیو، صدا و برنامه‌ریزی، کدام ابزار را انتخاب کنی.",
  "minutes": "۷",
  "tag": "ابزارها",
  "cover": "a7",
  "image": "",
  "order": 10,
  "published": true,
  "date": "2026-11-21",
  "body": "متن مقاله به مارک‌داون.\n\n## یک تیتر\n\nپاراگراف...\n\nمنبع: [نام منبع](https://example.com/official-page)\n"
}
```

3. Run `python3 _build/gen.py`. Commit the JSON **and** the generated `articles/<url>.html` (and updated `blog.html`, `feed.xml`, `api/content.json`). Push to `main`.

### Student works (`content/works.json`)

Top level: `{ "settings": {...}, "chapters": [ ... ] }`.

`settings`: `tile_shape` (`auto` / `tall` / `square`), `show_student` (boolean), `empty_label` (default `نمونه‌کار هنرجو`), `home_chips`, `home_thumbs`.

Each **chapter**:

| Field | Notes |
|---|---|
| `slug` | `^[a-z0-9-]+$`. Used in `student-works.html?ch=<slug>` and `assets/media/students/<slug>/`. Do not rename existing slugs. |
| `title` | Persian name. |
| `latin` | English label. |
| `num` | Roman numeral (`I`, `II`, …). |
| `icon` | One of the site icons: `spark`, `prompt`, `image`, `video`, `wave`, `edit`, `growth`, `camera`, `layers`, `smile`, `phone`, `film`, `bag`, `music`, `play`, `book`, `shield`, `refresh`, `target`, `globe`, `telegram`, `instagram`, `brief`, `mail`, `clock`, `check`. |
| `visible` | `false` hides the whole chapter. |
| `items` | Array of works. |

Current chapter slugs (keep this order unless Hana asks to change it): `animation`, `camera-shots`, `motion-graphics`, `beauty-dental`, `banners-images`, `story-motion`, `series`, `product-ads`, `ai-editing`, `music-video`, `real-estate`. If no existing chapter fits, add a new one — do not misfile a video.

Each **item**:

| Field | Notes |
|---|---|
| `kind` | `video` or `img`. |
| `file` | `/assets/media/students/<slug>/<file>`. |
| `poster` | Cover image for videos. Optional; the build can cut a first-frame JPEG with ffmpeg if empty. Prefer a hand-made 540×960 cover. |
| `title` | Work title. No method/tool spoilers. |
| `student` | Optional name. If empty, the site shows «نمونه‌کار هنرجو». |
| `shape` | `""` (gallery default), `tall` (9:16), `square`, `portrait` (2:3). |
| `visible` | `false` hides one item. |

### Example: add a student work

1. Encode the video (see Video specs) and place it in `assets/media/students/<slug>/`, e.g. `02-title.mp4` plus `02-title.jpg`.
2. Append an item to that chapter in `content/works.json`:

```json
{
  "kind": "video",
  "file": "/assets/media/students/animation/02-title.mp4",
  "poster": "/assets/media/students/animation/02-title.jpg",
  "title": "عنوان کار",
  "student": "",
  "shape": "",
  "visible": true
}
```

3. Or drop files into the chapter folder and run `python3 _build/import_media.py` (optional `captions.json` in the same folder: `{"02-title.mp4": {"title": "عنوان کار", "student": ""}}`).
4. Rebuild, commit the media, `content/works.json`, and generated `student-works.html`.

### Example: add a chapter

Append to `chapters` in `content/works.json`, create `assets/media/students/<slug>/`, then rebuild:

```json
{
  "slug": "new-topic",
  "title": "عنوان فارسی فصل",
  "latin": "English Title",
  "num": "XII",
  "icon": "spark",
  "visible": true,
  "items": []
}
```

## Build and deploy

```bash
git pull --ff-only          # Decap CMS also commits to main
# edit content/ or _build/, never the generated HTML
python3 _build/gen.py       # preview
python3 -m http.server 8080 # http://localhost:8080  (not file://)
git add … && git commit && git push origin main
```

GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`:

1. Installs ffmpeg (for missing video covers).
2. Runs `python3 _build/gen.py`.
3. Copies the site into `_site/`, excluding `_build/`, `content/`, `apps-script/`, `*.md`, `*.py`, `*.gs`, `.env*`, and other internals.
4. Publishes `_site/` to GitHub Pages.

Pages source must stay **GitHub Actions** (not “Deploy from a branch”). After push, wait for the “Build and deploy site” workflow to finish before treating the live URL as updated.

## Video specs

Host media on this site only. CSP `media-src` is `'self' blob:` — do not embed YouTube, Instagram, or other external players without a reviewed CSP change (usually refused).

**Portrait clips (default, Reels-style):** H.264, 720×1280, yuv420p, AAC, `+faststart`. Target about 8 MB or less.

```bash
ffmpeg -i in.mp4 -vf scale=720:1280 -c:v libx264 -pix_fmt yuv420p -preset slow -b:v 800k -c:a aac -b:a 96k -movflags +faststart out.mp4
```

**Covers:** 540×960 JPEG.

```bash
ffmpeg -ss 2 -i out.mp4 -frames:v 1 -vf scale=540:960 -q:v 4 out.jpg
```

**Landscape clips:** keep the clip's own aspect ratio (do not stretch to 9:16). Encode with H.264 + yuv420p + AAC + `+faststart`, and make a **letterboxed** portrait cover (540×960) so the gallery tile stays consistent:

```bash
ffmpeg -i in.mp4 -c:v libx264 -pix_fmt yuv420p -preset slow -b:v 800k -c:a aac -b:a 96k -movflags +faststart out.mp4
ffmpeg -ss 2 -i out.mp4 -frames:v 1 -vf "scale=540:960:force_original_aspect_ratio=decrease,pad=540:960:(ow-iw)/2:(oh-ih)/2:black" -q:v 4 out.jpg
```

Images: `.jpg` `.jpeg` `.png` `.webp` `.avif`, ideally ≤ 300 KB, webp ~1200 px wide. Videos: `.mp4` (preferred) `.webm` `.mov`.

## CSP and security (`_build/security.py`)

Every generated public page gets a Content-Security-Policy `<meta>` and `referrer` = `strict-origin-when-cross-origin`. Inline scripts are allowed only by their sha256 hash (no `'unsafe-inline'` for scripts). `target=_blank` links get `rel="noopener noreferrer"`.

Notable directives: `default-src 'self'`; `media-src 'self' blob:`; `img-src 'self' data: blob:`; `connect-src 'self'` plus the origin of `CHALLENGE_ENDPOINT` in `assets/js/config.js` (and `https://script.googleusercontent.com` when the endpoint is Apps Script). The admin panel `/admin/` is **not** processed and has no CSP, so Decap CMS + DecapBridge keep working.

If you add a plugin in the admin panel, domains in its snippet are allowed automatically; extra origins go in «دامنه‌های مجاز». Do not weaken CSP to load arbitrary third-party scripts or media.

## Machine-readable feeds

Built by `_build/feeds.py` via `gen.py`. Use these when you do not have (or do not need) a repo checkout:

- https://hanamousaviiiii.github.io/feed.xml — RSS 2.0 of published articles (title, link, description, date, tag).
- https://hanamousaviiiii.github.io/api/content.json — published article metadata **and** markdown `body`, plus the visible works index (chapters, item titles, file/poster paths, labels). Hidden chapters and hidden items are omitted.

## Other useful URLs

- Home: https://hanamousaviiiii.github.io/
- About: https://hanamousaviiiii.github.io/#about
- Blog: https://hanamousaviiiii.github.io/blog.html
- Course pages: `course.html?c=smart-assistant` and `course.html?c=editor-plus`
- Student works (all or one chapter): https://hanamousaviiiii.github.io/student-works.html or `student-works.html?ch=animation`
- Admin (Hana only): https://hanamousaviiiii.github.io/admin/

## Workflow tips

- Prefer editing `content/*.json` over template code. Keep credit use low: batch changes, one commit when possible.
- Do not commit `_drafts/`, `*.bak`, screenshots, or `_site/`.
- Never push secrets. If a token was pasted into a file, remove it, rotate it, and do not commit it.
- When unsure about placement, titles, or a new chapter, ask Hana rather than guessing in public copy.
