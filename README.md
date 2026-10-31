# hana.aistudio — وب‌سایت (نسخه‌ی ۲)

سایت استاتیک (HTML/CSS/JS خالص، بدون build). تم تیره، رنگ‌های برند: زرشکی `#9B111E / #D7263D` و آبی `#2F6BFF / #4CC9F0`، رابط Liquid Glass، هسته‌ی سه‌بعدی Three.js در هیرو.

## پیش‌نمایش محلی
```bash
cd hana-site-v2
python3 -m http.server 8080   # → http://localhost:8080
```
(از روی `file://` باز نکنید؛ ماژول‌ها و فونت‌ها نیاز به سرور دارند.)

## ساختار
```
index.html          لندینگ: هیرو سه‌بعدی، چرا AI، تیزر چالش، کارت‌های دوره، نمونه‌کار، نظرات، درباره، FAQ، CTA
course.html         صفحه‌ی دوره — ?c=editor-plus  یا  ?c=smart-assistant
challenge.html      چالش «سطح هوش مصنوعی تو چیه؟»   (challenge.html?export=1 = خروجی CSV محلی)
blog.html           مجله + articles/*.html (۳ مقاله)
links.html          لینک بیو اینستاگرام
contact.html        فرم همکاری برندها
assets/css/style.css
assets/js/config.js   ← تنها فایل تنظیمات (CHALLENGE_ENDPOINT)
assets/js/data.js     اطلاعات دوره‌ها برای چالش (نام، قیمت، سرفصل)
assets/js/main.js     منو، انیمیشن اسکرول، tilt، کارت‌ها، اسلایدر
assets/js/hero3d.js   هسته‌ی سه‌بعدی (Three.js 0.170 از jsDelivr)
assets/js/challenge.js / submit.js / contact.js
assets/fonts/         Vazirmatn و Cormorant (self-hosted)
apps-script/Code.gs   کد Google Apps Script برای ذخیره در Google Sheet
_build/               تولیدکننده‌ی HTML صفحه‌ها (python3 _build/gen.py)
screenshots/          اسکرین‌شات‌های QA
```

> صفحه‌ها با `python3 _build/gen.py` ساخته می‌شوند. برای تغییر متن‌ها، فایل‌های `_build/page_*.py` را ویرایش و دوباره اجرا کنید (یا مستقیم HTML را ویرایش کنید و دیگر gen را اجرا نکنید).
> اطلاعات دوره‌ها در دو جا هست: `_build/cards.py` + `_build/page_course.py` (برای HTML) و `assets/js/data.js` (برای نتیجه‌ی چالش).

## جاهای خالی (placeholder)
با برچسب آبی کوچک «به‌زودی» یا متن داخل [براکت] مشخص شده‌اند:
- عکس هانا (بخش درباره + links.html) و متن داستان هانا
- نمونه‌کارها (۷ کاشی با پس‌زمینه‌ی گرافیکی موقت)
- نظرات هنرجوها (۳ اسلاید)
- پاسخ‌های FAQ (به‌جز پشتیبانی دستیار هوشمند که معلوم است) + روش پرداخت
- course.html: ویدیوی معرفی، «برای چه کسانی؟»، FAQ دوره، جزئیات پشتیبانی ادیتور پلاس

---

## راه‌اندازی Google Sheet برای چالش (فارسی)
1. یک Google Sheet جدید بسازید (مثلاً «hana challenge»).
2. منوی **Extensions → Apps Script**. محتوای `apps-script/Code.gs` را جایگزین کد پیش‌فرض کنید و ذخیره کنید.
3. (اختیاری) تابع `testInsert` را یک‌بار Run کنید و دسترسی بدهید؛ یک ردیف تست در شیت `Challenge` می‌آید (بعداً پاکش کنید).
4. **Deploy → New deployment →** نوع **Web app**؛ Execute as: **Me**؛ Who has access: **Anyone** → Deploy.
5. آدرس Web app (که با `/exec` تمام می‌شود) را کپی کنید و در `assets/js/config.js` بگذارید:
   `CHALLENGE_ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec'`
6. سایت را منتشر کنید و یک‌بار چالش را تا آخر انجام دهید؛ ردیف جدید در شیت **Challenge** (و فرم همکاری در شیت **Collaborations**) ثبت می‌شود.
7. اگر بعداً کد را تغییر دادید: Deploy → Manage deployments → Edit → New version (آدرس ثابت می‌ماند).

ستون‌ها: زمان، نام، موبایل (نرمال‌شده به 09xxxxxxxxx)، آیدی، رضایت، امتیاز (از ۲۱)، درصد، سطح، دوره‌ی پیشنهادی، پاسخ هر ۱۰ سؤال (با امتیاز)، منبع ورود (utm_source یا referrer) و…

**نکته‌ی مهم برای کاربران ایران:** دامنه‌های گوگل (script.google.com) ممکن است برای بعضی کاربران داخل ایران بدون VPN در دسترس نباشد. در این حالت سایت ارسال را در مرورگر کاربر در صف نگه می‌دارد و در بازدید بعدی دوباره تلاش می‌کند، ولی تضمینی نیست. اگر بیشتر مخاطبان بدون VPN هستند، بهتر است بعداً یک سرویس داخلی (مثل فرم‌ساز یا وب‌هوک داخلی) یا یک سرور کوچک جایگزین شود؛ فقط کافی است همان JSON را بپذیرد و `{"ok":true}` برگرداند.

### حالت تست (بدون endpoint)
اگر `CHALLENGE_ENDPOINT` خالی باشد، هیچ داده‌ای به جایی ارسال نمی‌شود؛ فقط در `localStorage` همان مرورگر ذخیره می‌شود و نتیجه نمایش داده می‌شود. برای دانلود: `challenge.html?export=1` (CSV با BOM برای اکسل؛ همچنین خروجی فرم همکاری و صف ارسال).

## Google Sheet setup (English)
1. Create a Google Sheet → Extensions → Apps Script → paste `apps-script/Code.gs` → Save.
2. Optionally run `testInsert` once to authorize (delete the test row afterwards).
3. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the `/exec` URL.
4. Put it in `assets/js/config.js` → `CHALLENGE_ENDPOINT`.
5. The site POSTs JSON as `text/plain` (no CORS preflight). Apps Script appends a row to sheet `Challenge` (quiz) or `Collaborations` (brand form), creates headers on first use, keeps phones as text, and guards against formula injection.
6. Empty endpoint = local test mode (localStorage only; export at `challenge.html?export=1`). Failed sends are queued locally and retried on the next visit.

## منطق چالش (نسخه‌ی ۲)
- ۱۲ سؤال: ۹ سؤال سناریومحور امتیازدار (هر گزینه ۰ تا ۳، جمع ۲۷) در ۶ مهارت — پرامپت‌نویسی، تصویرسازی، صدا و لیپ‌سینک، ویدیو از عکس، ادیت موبایل، کسب درآمد — به‌علاوه‌ی ۳ سؤال پروفایل (هدف، مانع اصلی، زمان آزاد).
- سطح‌ها: ۰–۷ کاوشگر (I)، ۸–۱۴ سازنده (II)، ۱۵–۲۱ خالق (III)، ۲۲–۲۷ معمار AI (IV).
- نتیجه: درصد امتیاز روی حلقه، نمودار ۶ مهارت، نقاط قوت (مهارت‌های ≥۶۷٪)، قدم‌های بعدی (دو مهارت ضعیف‌تر + یک قدم مخصوص سطح)، دوره‌ی پیشنهادی + مسیر جایگزین، دکمه‌ی تلگرام.
- دوره‌ی پیشنهادی: سؤال هدف (وزن ۲) و مانع اصلی (وزن ۱)؛ اگر مهارت ادیت زیر ۵۰٪ باشد یک امتیاز به ادیتور پلاس اضافه می‌شود. در تساوی: سطح II به بالا → دستیار هوشمند، سطح I → ادیتور پلاس. همه در `assets/js/challenge.js`.
- اطلاعات تماس قبل از نمایش نتیجه گرفته می‌شود: نام، موبایل ایران (۰۹…، +۹۸…، با ارقام فارسی هم قبول است)، آیدی اختیاری، تیک رضایت الزامی.
- **داده‌ی ارسالی (`type: "challenge"`, `version: "challenge-v2"`):** `name`, `phone`, `social`, `consent`, `score`, `max_score`, `percent`, `level`, `level_key`, `level_num`, `recommended_course`, `recommended_course_id`, `recommended_course_price`, `strengths`, `growth_areas`, `goal`, `main_obstacle`, `weekly_time`, `skill_prompt` … `skill_business` (درصد)، `q1`…`q12`، `answers` (آرایه: id, skill, question, answer, option, points, max)، `answers_json`، `summary_text` (متن فارسی آماده برای ربات تلگرام)، `timestamp` (ISO)، `local_time` (تهران)، `source`, `page`, `user_agent`, `id`.

## انتشار
هر هاست استاتیک (GitHub Pages، Netlify، Cloudflare Pages، یا هاست ایرانی). پوشه‌های `_build` و `screenshots` لازم نیستند.

## فونت‌ها (Fonts)
- **متن صفحه: IRANSansX** — فونت تجاری است و فایلش در این پروژه نیست. فایل‌های دارای لایسنس خود را با همین نام‌ها در `assets/fonts/` بگذارید تا خودکار فعال شوند:
  `IRANSansX-Regular.woff2` (400)، `IRANSansX-Medium.woff2` (500)، `IRANSansX-Bold.woff2` (700)، `IRANSansX-Black.woff2` (900).
  (برای ارقام فارسی از نسخه‌ی FaNum/«اعداد فارسی» استفاده کنید.) تا وقتی فایل‌ها نیستند، Vazirmatn (OFL) جایگزین نمایش داده می‌شود. خرید: fontiran.com
- **تیتر اصلی هیرو: Lalezar** (بُرنا ایزدپناه) — SIL Open Font License 1.1 (Google Fonts)، فایل: `assets/fonts/lalezar.woff2`. نزدیک‌ترین فونت آزاد به حس سنگین و پوستری «پتک».
- **جای خالی فونت «پتک» (Potk):** پتک اثر مهدی ارشادی و تجاری است (فروش انحصاری در fontiran.com) و نسخه‌ی رایگان ندارد؛ استفاده در وب‌سایت لایسنس وب جداگانه می‌خواهد. بعد از خرید لایسنس وب، فایل را با نام `assets/fonts/Potk.woff2` در پوشه بگذارید (و فایل لایسنس FontLicense.txt را کنارش) — `@font-face` آن از قبل در `style.css` تعریف شده و تیتر هیرو خودکار با پتک نمایش داده می‌شود؛ Lalezar فقط جایگزین می‌ماند.
- **متن‌های لاتین تزئینی: Cormorant Garamond** و **Vazirmatn** — هر دو OFL.

## نمونه‌کار هنرجوها و عکس «درباره‌ی من» (Media)

همه‌ی نمونه‌کارها مال هنرجوهاست و در صفحه‌ی `student-works.html` بر اساس فصل‌های دوره نمایش داده می‌شوند (کارت هر فصل → گالری همان فصل با آدرس `student-works.html?ch=<slug>`). باکس ویژه‌ی «نمونه‌کار هنرجوها» در صفحه‌ی اصلی خودکار سه کاور اول و تعداد کل را نشان می‌دهد.

فایل‌ها را در پوشه‌ی فصل بگذارید و `python3 _build/gen.py` را اجرا کنید:

| فصل | slug / پوشه |
|---|---|
| انیمیشن‌سازی | `assets/media/students/animation/` |
| اجرای نماهای دوربین | `assets/media/students/camera-shots/` |
| موشن‌گرافی | `assets/media/students/motion-graphics/` |
| حوزه‌ی زیبایی و دندان‌پزشکی | `assets/media/students/beauty-dental/` |
| ساخت بنر و تصاویر | `assets/media/students/banners-images/` |
| استوری موشن | `assets/media/students/story-motion/` |
| ساخت سریال و ویدیوهای سریالی | `assets/media/students/series/` |
| تبلیغ محصول و آنلاین‌شاپ | `assets/media/students/product-ads/` |
| موزیک ویدیو (فعلاً مخفی) | `assets/media/students/music-video/` |
| عکس هانا (بخش درباره‌ی من) | `assets/media/about/` — اولین عکس پوشه (مثلاً `hana.webp`، نسبت ۴:۵) |

- فصل خالی خودکار حالت «به‌زودی» می‌گیرد و تعداد نمونه‌کارهای هر فصل روی کارتش نوشته می‌شود.
- **فعال کردن موزیک ویدیو (یا تغییر نام/ترتیب فصل‌ها):** در `_build/media.py` لیست `CHAPTERS`؛ مقدار آخر ردیف `music-video` را `True` کنید.
- **کپشن و نام هنرجو (اختیاری):** فایل `captions.json` در پوشه‌ی فصل:
  `{"01-clip.mp4": {"title": "عنوان کار", "student": "نام هنرجو"}}` — یا فقط عنوان: `{"01-clip.mp4": "عنوان کار"}`. بدون کپشن، «نمونه‌کار هنرجو» نمایش داده می‌شود.
- **فشرده‌سازی ویدیو (نمونه‌ی استفاده‌شده):** `ffmpeg -i in.mp4 -vf scale=720:1280 -c:v libx264 -preset slow -b:v 800k -c:a aac -b:a 96k -movflags +faststart out.mp4` و کاور: `ffmpeg -ss 2 -i out.mp4 -frames:v 1 -vf scale=540:960 -q:v 4 out.jpg`
- **تصویر:** `.jpg` `.jpeg` `.png` `.webp` `.avif` — با کلیک در لایت‌باکس بزرگ می‌شود (lazy-load).
- **ویدیو:** `.mp4` `.webm` `.mov` — فقط با کلیک پخش می‌شود (تا قبل از کلیک هیچ ویدیویی دانلود نمی‌شود). برای کاور (poster)، یک عکس هم‌نام کنارش بگذارید: `clip.mp4` + `clip.jpg` (یا `clip.poster.jpg`).
- **ترتیب:** بر اساس نام فایل (مثلاً `01-…`، `02-…`).
- پیشنهاد حجم: عکس‌ها ≤ ۳۰۰KB (webp، عرض ۱۲۰۰px)، ویدیوها H.264 ≤ ۸MB؛ چون همه‌چیز روی خود سایت میزبانی می‌شود.

## پس‌زمینه‌ی «تکامل هوش مصنوعی» (صفحه‌ی اصلی)

`assets/js/evolution.js` — یک canvas دوبعدی ثابت پشت همه‌ی محتوا (داخل `.ambient`) که با اسکرول تغییر می‌کند: نقطه‌های پراکنده ← اتصال به شبکه‌ی عصبی (حدود بخش دوره‌ها) ← شبکه‌ی متراکم با پالس‌های داده ← هسته‌ی نورانی در انتهای صفحه. روی موبایل گره‌ها کمتر و نرخ فریم حدود ۳۰ است، DPR محدود است، وقتی تب مخفی است متوقف می‌شود و با «کاهش حرکت» فقط با اسکرول یک فریم ثابت رسم می‌کند. شفافیت کلی در `style.css` (`.ambient .evo{opacity}`) قابل تنظیم است.
