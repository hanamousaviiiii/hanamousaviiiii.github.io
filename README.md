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

## منطق چالش
- ۱۰ سؤال: ۷ سؤال امتیازدار (۰ تا ۳، جمع ۲۱) + ۳ سؤال پروفایل (هدف، چالش، زمان).
- سطح‌ها: ۰–۵ کاوشگر (I)، ۶–۱۰ سازنده (II)، ۱۱–۱۶ خالق (III)، ۱۷–۲۱ معمار AI (IV).
- دوره‌ی پیشنهادی: از روی سؤال هدف (وزن ۲) و چالش (وزن ۱) — ادیت/کاور → ادیتور پلاس؛ تصویر/صدا/درآمد/سناریو/وقت → دستیار هوشمند. در تساوی: سطح III و IV → دستیار هوشمند، بقیه → ادیتور پلاس. (قابل تغییر در `assets/js/challenge.js`.)
- اطلاعات تماس قبل از نمایش نتیجه گرفته می‌شود: نام، موبایل ایران (۰۹…، +۹۸…، با ارقام فارسی هم قبول است)، آیدی تلگرام/اینستاگرام اختیاری، تیک رضایت الزامی.

## انتشار
هر هاست استاتیک (GitHub Pages، Netlify، Cloudflare Pages، یا هاست ایرانی). پوشه‌های `_build` و `screenshots` لازم نیستند.
