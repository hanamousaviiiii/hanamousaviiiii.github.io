/* hana.aistudio — «چالش سطح هوش مصنوعی» v2 */
(() => {
  const d = document, $ = s => d.querySelector(s);
  const app = $('#quiz'), bar = $('#qbar'), stepTxt = $('#qstep'), segs = $('#qsegs');
  if (!app) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FA = n => String(n).replace(/\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[x]);
  const KEYS = ['الف', 'ب', 'ج', 'د'];
  const COURSES = window.HANA_COURSES || {};
  const CFG = window.HANA_CONFIG || {};
  const TG = CFG.TELEGRAM_URL || 'https://t.me/hanatrick';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const icon = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    arrow: icon('<path d="M19 12H5M11 6l-6 6 6 6"/>'), back: icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    tick: icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>'), lock: icon('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    gauge: icon('<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/>'), radar: icon('<path d="M12 3 20 8v8l-8 5-8-5V8z"/><path d="M12 8l4 2.5v3L12 16l-4-2.5v-3z"/>'),
    route: icon('<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>'),
    tg: icon('<path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 8-6"/>'), again: icon('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>'),
    up: icon('<path d="M12 19V5M6 11l6-6 6 6"/>'), flag: icon('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    prompt: icon('<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>'), image: icon('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'),
    voice: icon('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'), video: icon('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>'),
    edit: icon('<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10 7h4M9 12l2 2 4-4"/>'), business: icon('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
    user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')
  };

  /* ---- skills ---- */
  const SK = {
    prompt:   { name: 'پرامپت‌نویسی', tip: 'فرمول پنج‌بخشی پرامپت رو تمرین کن: نقش، هدف، زمینه، قالب خروجی و لحن. هر بار یک نمونه‌ی خروجی دلخواه هم بهش بده.' },
    image:    { name: 'تصویرسازی', tip: 'برای هر تصویر سوژه، نور، لنز و نسبت تصویر رو دقیق بنویس و یک سبک بصری ثابت برای پیجت بساز.' },
    voice:    { name: 'صدا و لیپ‌سینک', tip: 'متن رو برای «شنیدن» بازنویسی کن، با مکث و تأکید. برای لیپ‌سینک، عکس روبه‌رو با نور یکنواخت و چهره‌ی واضح انتخاب کن.' },
    video:    { name: 'ویدیو از عکس', tip: 'در دستور ویدیو، حرکت دوربین، نور و مدت رو دقیق مشخص کن؛ یک حرکت ساده و کنترل‌شده نتیجه‌ی بهتری از چند حرکت هم‌زمان می‌ده.' },
    edit:     { name: 'ادیت موبایل', tip: 'سه ثانیه‌ی اول ریلز رو جدی بگیر: قلاب تصویری، برش سریع و متن روی تصویر. بعد سراغ کی‌فریم و ماسک برو.' },
    business: { name: 'کسب درآمد', tip: 'خدماتت رو به شکل یک پکیج مشخص با نمونه‌کار، تعداد خروجی و زمان تحویل دربیار تا برای کسب‌وکارها قابل‌خرید باشه.' }
  };

  /* ---- questions: o = [text, points] for scored; [text, null, tags] for profile ---- */
  const Q = [
    { id: 'prompt_brief', sk: 'prompt', sc: 1, q: 'یک کافه ازت خواسته برای معرفی منوی جدیدش کپشن اینستاگرام بنویسی. کدوم پرامپت خروجی بهتری می‌گیره؟', o: [
      ['«یه کپشن برای کافه بنویس.»', 0],
      ['«برای منوی پاییزی یک کافه در تهران، یک کپشن صمیمی بنویس.»', 2],
      ['«تو کپی‌رایتر اینستاگرام هستی. برای معرفی سه نوشیدنی پاییزی یک کافه‌ی دنج در تهران، سه کپشن کوتاه با لحن صمیمی و یک دعوت به اقدام در پایان بنویس.»', 3],
      ['«یه کپشن خیلی جذاب و خلاقانه برای منوی جدید بنویس.»', 1]] },
    { id: 'prompt_iterate', sk: 'prompt', sc: 1, q: 'جوابی که هوش مصنوعی داده کلی و تکراریه. بهترین قدم بعدی چیه؟', o: [
      ['همون پرامپت رو چند بار دیگه اجرا می‌کنم تا شاید بهتر بشه.', 1],
      ['می‌رم سراغ یه ابزار دیگه.', 0],
      ['فقط می‌نویسم «بهترش کن».', 1],
      ['مخاطب، محدودیت‌ها و یک نمونه‌ی خروجی دلخواه رو اضافه می‌کنم و ازش می‌خوام بر اساس اون اصلاح کنه.', 3]] },
    { id: 'image_cover', sk: 'image', sc: 1, q: 'برای کاور یک ریلز، تصویری با حس سینمایی می‌خوای. کدوم توضیح، تصویر قابل‌کنترل‌تری می‌سازه؟', o: [
      ['«یه عکس قشنگ و سینمایی.»', 0],
      ['«پرتره‌ی نیم‌تنه‌ی یک زن در خیابان بارانی شب، نور نئون آبی و قرمز از پهلو، لنز ۸۵ میلی‌متری، عمق میدان کم، نسبت ۹:۱۶.»', 3],
      ['«دختری در خیابان بارانی شب، سینمایی.»', 2],
      ['«پرتره‌ی فوق واقعی با کیفیت 8K، شاهکار، بهترین کیفیت.»', 1]] },
    { id: 'voice_narration', sk: 'voice', sc: 1, q: 'برای یک ویدیوی آموزشی صداگذاری فارسی طبیعی می‌خوای، بدون اینکه خودت ضبط کنی. کدوم مسیر حرفه‌ای‌تره؟', o: [
      ['متن رو با یک صدای پیش‌فرض و رباتیک می‌خونم و تمام.', 0],
      ['یک صدای آماده انتخاب می‌کنم و کل متن رو یک‌جا تبدیل می‌کنم.', 1],
      ['با یک ابزار صدای AI می‌سازم و فقط سرعتش رو تنظیم می‌کنم.', 2],
      ['متن رو برای گفتار بازنویسی می‌کنم، با علائم نگارشی مکث و تأکید می‌سازم و صدا رو جمله‌به‌جمله تنظیم می‌کنم.', 3]] },
    { id: 'lipsync_photo', sk: 'voice', sc: 1, q: 'می‌خوای شخصِ توی یک عکس، متنی رو بگه (لیپ‌سینک). برای طبیعی‌ترین نتیجه، کدوم عکس مناسب‌تره؟', o: [
      ['عکس نیم‌رخ، با موهایی که روی صورت ریخته.', 0],
      ['عکس روبه‌رو، نور یکنواخت، صورت واضح و دهان بسته.', 3],
      ['عکس گروهی که چهره‌ها کوچیکن.', 0],
      ['عکس با فیلتر سنگین و رنگ‌های اغراق‌شده.', 1]] },
    { id: 'video_product', sk: 'video', sc: 1, q: 'می‌خوای از عکس یک محصول، ویدیوی کوتاه تبلیغاتی بسازی. کدوم دستور به ابزار ویدیو بهتر جواب می‌ده؟', o: [
      ['«این عکس رو متحرک کن.»', 0],
      ['«دوربین دور محصول بچرخه.»', 2],
      ['«دوربین آهسته به محصول نزدیک می‌شه، نور نرم صبحگاهی روی بطری می‌لغزه، ذرات ریز در هوا، حرکت آرام و یکنواخت، ۵ ثانیه.»', 3],
      ['«یه ویدیوی تبلیغاتی خفن و حرفه‌ای بساز.»', 1]] },
    { id: 'edit_hook', sk: 'edit', sc: 1, q: 'یک ریلز ۳۰ ثانیه‌ای داری که مخاطب همون ثانیه‌ی دوم ردش می‌کنه. اولین اصلاح در ادیت چیه؟', o: [
      ['یک آهنگ ترند روش می‌ذارم.', 1],
      ['شروع رو کوتاه می‌کنم، یک قلاب تصویری و متنی همون اول می‌ذارم و ریتم برش‌ها رو تندتر می‌کنم.', 3],
      ['یک فیلتر رنگی جذاب‌تر اضافه می‌کنم.', 0],
      ['ویدیو رو طولانی‌تر می‌کنم تا کامل توضیح بدم.', 0]] },
    { id: 'edit_skill', sk: 'edit', sc: 0, q: 'با اپ‌های ادیت موبایل مثل CapCut، Alight Motion یا InShot چقدر مسلطی؟', o: [
      ['هنوز کار نکردم.', 0],
      ['در حد برش، متن و موسیقی.', 1],
      ['زیرنویس، ترنزیشن و تنظیم رنگ.', 2],
      ['کی‌فریم، ماسک و موشن‌گرافی.', 3]] },
    { id: 'business_offer', sk: 'business', sc: 1, q: 'یک مزون لباس ازت می‌خواد برای پیجش محتوای هوش مصنوعی بسازی. کدوم پیشنهاد حرفه‌ای‌تره؟', o: [
      ['رایگان انجام می‌دم تا نمونه‌کار بشه.', 0],
      ['برای هر ویدیو جداگانه یک قیمت می‌دم.', 1],
      ['یک پکیج ماهانه با تعداد مشخص ریلز، کاور و تبلیغ محصول، همراه نمونه‌کار و زمان تحویل پیشنهاد می‌دم.', 3],
      ['قیمت رو بعد از انجام کار، بر اساس ساعت‌هایی که گذاشتم حساب می‌کنم.', 1]] },
    { id: 'goal', profile: true, q: 'مهم‌ترین هدفت از یادگیری چیه؟', o: [
      ['رشد پیجم و ادیت حرفه‌ای ویدیوهام', null, { editor: 2 }],
      ['ساخت تصویر، صدا و ویدیو با هوش مصنوعی', null, { assistant: 2 }],
      ['کسب درآمد و گرفتن پروژه از کسب‌وکارها', null, { assistant: 2 }],
      ['تولید محتوا برای کسب‌وکار خودم (مثلاً زیبایی، دندان‌پزشکی یا فروشگاه)', null, { editor: 1, assistant: 1 }]] },
    { id: 'challenge', profile: true, q: 'الان بزرگ‌ترین مانعت توی تولید محتوا چیه؟', o: [
      ['کیفیت ادیت ویدیوهام', null, { editor: 1 }],
      ['ایده، سناریو و نوشتن متن', null, { assistant: 1 }],
      ['ساخت ویدیو بدون اینکه جلوی دوربین برم', null, { assistant: 1 }],
      ['ساخت کاور، متن روی تصویر و گرافیک', null, { editor: 1 }]] },
    { id: 'time', profile: true, q: 'هفته‌ای چقدر وقت برای یادگیری داری؟', o: [
      ['کمتر از ۲ ساعت', null], ['۲ تا ۵ ساعت', null], ['۵ تا ۱۰ ساعت', null], ['بیشتر از ۱۰ ساعت', null]] }
  ];
  const SCORED = Q.filter(q => !q.profile);
  const MAX = SCORED.reduce((s, q) => s + Math.max(...q.o.map(o => o[1])), 0);

  const LEVELS = [
    { key: 'explorer', num: 'I', name: 'کاوشگر', latin: 'The Explorer', min: 0,
      desc: 'تازه وارد دنیای هوش مصنوعی شدی و این بهترین نقطه برای شروعه. با یک مسیر منظم، خیلی سریع از «امتحان کردن ابزارها» به ساختن محتوای واقعی می‌رسی.' },
    { key: 'maker', num: 'II', name: 'سازنده', latin: 'The Maker', min: 8,
      desc: 'ابزارها رو می‌شناسی و امتحانشون کردی. حالا وقتشه از نتیجه‌های اتفاقی به خروجی قابل‌پیش‌بینی و حرفه‌ای برسی.' },
    { key: 'creator', num: 'III', name: 'خالق', latin: 'The Creator', min: 15,
      desc: 'هوش مصنوعی بخشی از جریان کارته. با تکنیک‌های پیشرفته‌تر و ترکیب ابزارها، می‌تونی سبک امضادار خودت رو بسازی.' },
    { key: 'architect', num: 'IV', name: 'معمار AI', latin: 'The Architect', min: 22,
      desc: 'فراتر از یک کاربر معمولی هستی؛ ابزارها رو زنجیره‌ای ترکیب می‌کنی و خروجی حرفه‌ای می‌گیری. قدم بعدی، تبدیل این مهارت به پروژه و درآمده.' }
  ];
  const LEVEL_STEP = {
    explorer: 'هر روز یک کار کوچک رو به یک چت‌بات بسپار تا کار با ابزارها برات عادی بشه.',
    maker: 'پرامپت‌های موفقت رو ذخیره و دسته‌بندی کن تا خروجی‌هات قابل‌تکرار بشن.',
    creator: 'یک پروژه‌ی کامل بساز که سناریو، تصویر، صدا و ویدیو رو با هم ترکیب کنه.',
    architect: 'یک نمونه‌کار منظم آماده کن و خدماتت رو به کسب‌وکارها پیشنهاد بده.'
  };
  const REASON = {
    'smart-assistant': 'مسیر کامل و پیشرفته: از پرامپت‌نویسی تا ساخت تصویر، صدا، لیپ‌سینک و ویدیو با هوش مصنوعی، و تبدیل این مهارت‌ها به درآمد.',
    'editor-plus': 'تمرکز روی ادیت حرفه‌ای با موبایل؛ سریع‌ترین راه برای اینکه ویدیوهات تمیزتر، پرریتم‌تر و دیده‌شدنی‌تر بشن.'
  };

  const ans = new Array(Q.length).fill(null);
  let idx = -1, busy = false, lastResult = null;

  /* ---- chrome: progress segments ---- */
  if (segs) segs.innerHTML = Q.map(() => '<i></i>').join('');
  function progress(i) {
    const p = i < 0 ? 0 : Math.min(i / Q.length, 1);
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (segs) [...segs.children].forEach((s, k) => { s.className = i >= Q.length || k < i ? 'done' : k === i ? 'now' : ''; });
    stepTxt.textContent = i < 0 ? 'آماده‌ای؟' : i >= Q.length ? 'نتیجه' : `سؤال ${FA(i + 1)} از ${FA(Q.length)}`;
    d.querySelector('.quiz-progress')?.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }

  function swap(html, dir = 1, after) {
    const old = app.querySelector('.scr');
    const n = d.createElement('div'); n.className = 'scr'; n.innerHTML = html;
    if (old && !reduce) {
      old.classList.add(dir > 0 ? 'out' : 'out-r');
      n.classList.add(dir > 0 ? 'enter' : 'enter-r');
      setTimeout(() => old.remove(), 380);
      app.appendChild(n);
      requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('enter', 'enter-r')));
    } else { if (old) old.remove(); app.appendChild(n); }
    after && after(n);
    const top = app.getBoundingClientRect().top + scrollY - 96;
    if (scrollY > top + 4) scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    const f = n.querySelector('[data-focus]'); if (f && old) setTimeout(() => f.focus({ preventScroll: true }), reduce ? 0 : 120);
  }

  /* ---- intro ---- */
  function intro() {
    idx = -1; progress(-1);
    const nScored = SCORED.length;
    swap(`<div class="cx-intro">
      <div class="kicker" style="justify-content:center">چالش <span class="latin">The AI Level Test</span></div>
      <h1 class="h-lg" data-focus tabindex="-1">سطح هوش مصنوعی <span class="grad">تو</span> چیه؟</h1>
      <p class="lead">یک ارزیابی کوتاه و سناریومحور، بر اساس موقعیت‌های واقعی تولید محتوا. نه حفظیات؛ تصمیم‌هایی که هر روز موقع ساختن محتوا می‌گیری.</p>
      <div class="cx-facts" role="list">
        <span role="listitem"><b>${FA(Q.length)}</b>سؤال</span>
        <span role="listitem"><b>${FA(3)}</b>دقیقه</span>
        <span role="listitem"><b>${FA(Object.keys(SK).length)}</b>مهارت</span>
        <span role="listitem"><b>${FA(4)}</b>سطح</span>
      </div>
      <ul class="cx-gets">
        <li><span class="ic">${I.gauge}</span><span><b>سطح و امتیاز دقیق</b>جایگاهت در یکی از چهار سطح، از کاوشگر تا معمار AI</span></li>
        <li><span class="ic">${I.radar}</span><span><b>تحلیل ${FA(Object.keys(SK).length)} مهارت</b>نقاط قوت و جاهایی که با کمی تمرین بیشترین رشد رو داری</span></li>
        <li><span class="ic">${I.route}</span><span><b>مسیر پیشنهادی</b>قدم‌های بعدی و دوره‌ای که به هدفت نزدیک‌تره</span></li>
      </ul>
      <div class="cx-skills" aria-label="مهارت‌های ارزیابی">${Object.entries(SK).map(([k, s]) => `<span>${I[k]}${s.name}</span>`).join('')}</div>
      <button class="btn btn-primary cx-start" id="go">شروع چالش ${I.arrow}</button>
      <p class="cx-note">${I.lock} ${FA(nScored)} سؤال مهارتی و ${FA(Q.length - nScored)} سؤال درباره‌ی هدفت. برای دیدن نتیجه فقط نام و شماره‌ی موبایل لازمه.</p>
    </div>`, 1, n => n.querySelector('#go').onclick = () => show(0, 1));
  }

  /* ---- question ---- */
  function show(i, dir) {
    idx = i; progress(i);
    const q = Q[i], sk = SK[q.sk];
    const chip = q.profile ? `<span class="cx-topic prof">${I.user} درباره‌ی تو</span>` : `<span class="cx-topic">${I[q.sk]} ${sk.name}</span>`;
    const opts = q.o.map((o, k) => `<button type="button" class="opt${ans[i] === k ? ' sel' : ''}" role="radio" aria-checked="${ans[i] === k}" tabindex="${(ans[i] ?? 0) === k ? 0 : -1}" data-k="${k}" style="--d:${k * 0.05 + .08}s"><span class="key" aria-hidden="true">${KEYS[k]}</span><span class="ot">${o[0]}</span><span class="tick">${I.tick}</span></button>`).join('');
    swap(`<div class="cx-q">
      <div class="cx-meta">${chip}${q.sc ? '<span class="cx-scn">سناریو</span>' : ''}<span class="latin cx-count" dir="ltr">${String(i + 1).padStart(2, '0')} / ${Q.length}</span></div>
      <h2 class="cx-title" id="qt${i}" data-focus tabindex="-1">${q.q}</h2>
      <div class="opts" role="radiogroup" aria-labelledby="qt${i}">${opts}</div>
      <div class="cx-foot">${i > 0 ? `<button type="button" class="q-back" id="back">${I.back} سؤال قبلی</button>` : '<span></span>'}<span class="cx-hint">${q.profile ? 'جواب درست یا غلط نداره' : 'گزینه‌ای رو انتخاب کن که به روش کار خودت نزدیک‌تره'}</span></div>
    </div>`, dir, n => {
      const bs = [...n.querySelectorAll('.opt')];
      bs.forEach((b, k) => {
        b.onclick = () => pick(k, b);
        b.onkeydown = e => {
          const m = { ArrowDown: 1, ArrowLeft: 1, ArrowUp: -1, ArrowRight: -1 }[e.key];
          if (m) { e.preventDefault(); const t = bs[(k + m + bs.length) % bs.length]; bs.forEach(x => x.tabIndex = -1); t.tabIndex = 0; t.focus(); }
        };
      });
      const bk = n.querySelector('#back'); if (bk) bk.onclick = () => !busy && show(i - 1, -1);
    });
  }
  d.addEventListener('keydown', e => {
    if (idx < 0 || idx >= Q.length || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA)$/.test((e.target || {}).tagName || '')) return;
    const k = ['1', '2', '3', '4'].indexOf(e.key) >= 0 ? +e.key - 1 : ['۱', '۲', '۳', '۴'].indexOf(e.key);
    if (k >= 0) { const b = app.querySelector(`.scr:last-child .opt[data-k="${k}"]`); if (b) { e.preventDefault(); pick(k, b); } }
  });
  function pick(k, el) {
    if (busy) return; busy = true;
    ans[idx] = k;
    el.parentNode.querySelectorAll('.opt').forEach(b => { const on = b === el; b.classList.toggle('sel', on); b.setAttribute('aria-checked', on); });
    setTimeout(() => { busy = false; idx < Q.length - 1 ? show(idx + 1, 1) : gate(); }, reduce ? 80 : 440);
  }

  /* ---- scoring ---- */
  function compute() {
    let score = 0; const tags = { editor: 0, assistant: 0 }, skills = {};
    for (const k in SK) skills[k] = { got: 0, max: 0 };
    Q.forEach((q, i) => {
      const o = q.o[ans[i]];
      if (!q.profile) { skills[q.sk].max += Math.max(...q.o.map(x => x[1])); if (o) { skills[q.sk].got += o[1]; score += o[1]; } }
      else if (o && o[2]) for (const t in o[2]) tags[t] += o[2][t];
    });
    for (const k in skills) skills[k].pct = Math.round(skills[k].got / skills[k].max * 100);
    let lv = LEVELS[0]; LEVELS.forEach(l => { if (score >= l.min) lv = l; });
    const li = LEVELS.indexOf(lv);
    // editing weakness + editing-leaning goal favours Editor Plus; otherwise the full Smart Assistant path
    if (skills.edit.pct < 50) tags.editor += 1;
    const course = tags.editor > tags.assistant ? 'editor-plus' : tags.assistant > tags.editor ? 'smart-assistant' : (li >= 1 ? 'smart-assistant' : 'editor-plus');
    const order = Object.keys(SK).sort((a, b) => skills[b].pct - skills[a].pct);
    const strengths = order.filter(k => skills[k].pct >= 67).slice(0, 2);
    const growth = order.slice().reverse().filter(k => skills[k].pct < 100 && !strengths.includes(k)).slice(0, 2);
    return { score, max: MAX, percent: Math.round(score / MAX * 100), lv, li, tags, course, skills, strengths, growth };
  }

  /* ---- gate ---- */
  function gate() {
    idx = Q.length; progress(Q.length);
    swap(`<div class="gate cx-gate">
      <div class="gate-preview" aria-hidden="true"><div class="ring-wrap blur">${ring(.72, '?')}</div></div>
      <div class="kicker" style="justify-content:center">نتیجه‌ات آماده‌ست <span class="latin">Almost there</span></div>
      <h2 class="h-md" data-focus tabindex="-1" style="text-align:center;margin-bottom:8px">تحلیل سطحت آماده شد</h2>
      <p class="muted" style="text-align:center;margin:0 0 24px">برای دیدن نتیجه‌ی کامل، تحلیل مهارت‌ها و مسیر پیشنهادی، نام و شماره‌ات رو وارد کن.</p>
      <form id="cform" novalidate>
        <div class="field"><label for="f-name">نام و نام خانوادگی</label><input class="input" id="f-name" name="name" autocomplete="name" required aria-describedby="m-name"><span class="msg" id="m-name">لطفاً نامت رو وارد کن.</span></div>
        <div class="field"><label for="f-phone">شماره موبایل</label><input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" dir="ltr" placeholder="09xx xxx xxxx" autocomplete="tel" required aria-describedby="m-phone"><span class="msg" id="m-phone">شماره موبایل معتبر نیست؛ مثلاً ۰۹۱۲۱۲۳۴۵۶۷</span></div>
        <div class="field"><label for="f-social">آیدی تلگرام یا اینستاگرام <small>(اختیاری)</small></label><input class="input" id="f-social" name="social" dir="ltr" placeholder="@username" aria-describedby="m-social"><span class="msg" id="m-social">آیدی فقط می‌تونه شامل حروف انگلیسی، عدد، نقطه و _ باشه.</span></div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="check" id="f-consent-wrap"><input type="checkbox" id="f-consent" name="consent"><span>موافقم نتیجه و اطلاعات دوره‌ها برام ارسال بشه و برای مشاوره با من تماس گرفته بشه.</span></label>
        <button class="btn btn-primary btn-block" type="submit" style="margin-top:20px"><span>دیدن نتیجه</span> ${I.arrow}</button>
        <p class="cx-privacy">${I.lock}<span>اطلاعاتت فقط برای ارسال نتیجه و هماهنگی مشاوره‌ی دوره استفاده می‌شه.</span></p>
      </form>
      <button type="button" class="q-back" id="back" style="margin:12px auto 0">${I.back} برگشت به سؤال‌ها</button>
    </div>`, 1, n => {
      n.querySelector('#back').onclick = () => show(Q.length - 1, -1);
      n.querySelector('#cform').addEventListener('submit', submit);
    });
  }

  function summaryText(row, r) {
    const L = [
      'نتیجه‌ی جدید چالش سطح AI',
      `نام: ${row.name}`, `موبایل: ${row.phone}`, row.social ? `آیدی: ${row.social}` : null,
      `سطح: ${row.level} (${FA(row.score)} از ${FA(row.max_score)} · ${FA(row.percent)}٪)`,
      `دوره‌ی پیشنهادی: ${row.recommended_course}`,
      `مهارت‌ها: ${Object.keys(SK).map(k => `${SK[k].name} ${FA(r.skills[k].pct)}٪`).join('، ')}`,
      `هدف: ${row.goal || '-'}`, `زمان آزاد هفتگی: ${row.weekly_time || '-'}`,
      `زمان: ${row.local_time}`
    ];
    return L.filter(Boolean).join('\n');
  }

  async function submit(e) {
    e.preventDefault();
    const f = e.target, V = window.HanaValid;
    if (f.website.value) return;
    const name = f.name.value.trim().replace(/\s+/g, ' '), phone = V.phone(f.phone.value), social = f.social.value.trim(), consent = f.consent.checked;
    const set = (el, bad) => { el.closest('.field').classList.toggle('err', bad); el.setAttribute('aria-invalid', bad); return !bad; };
    let ok = set(f.name, name.length < 2);
    ok = set(f.phone, !phone) && ok;
    ok = set(f.social, !!social && !V.handle(social)) && ok;
    d.getElementById('f-consent-wrap').classList.toggle('err', !consent); ok = consent && ok;
    if (!ok) { const first = f.querySelector('.err .input') || f.consent; first && first.focus(); return; }
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.classList.add('busy'); btn.querySelector('span').textContent = 'در حال آماده‌سازی نتیجه…';

    const r = compute(), now = new Date(), qs = new URLSearchParams(location.search);
    const course = COURSES[r.course] || {};
    const answers = Q.map((q, i) => {
      const o = ans[i] != null ? q.o[ans[i]] : null;
      return { id: q.id, skill: q.profile ? 'profile' : q.sk, question: q.q, answer: o ? o[0] : null, option: ans[i] != null ? KEYS[ans[i]] : null, points: o && o[1] != null ? o[1] : null, max: q.profile ? null : 3 };
    });
    const row = {
      version: 'challenge-v2',
      id: crypto.randomUUID ? crypto.randomUUID() : String(now.getTime()),
      timestamp: now.toISOString(),
      local_time: now.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }),
      name, phone, social: social ? '@' + social.replace(/^@/, '') : '', consent: consent ? 'yes' : 'no',
      score: r.score, max_score: MAX, percent: r.percent,
      level: r.lv.name, level_key: r.lv.key, level_num: r.li + 1,
      recommended_course: course.name || r.course, recommended_course_id: r.course, recommended_course_price: course.price || '',
      strengths: r.strengths.map(k => SK[k].name).join('، '), growth_areas: r.growth.map(k => SK[k].name).join('، '),
      goal: answers.find(a => a.id === 'goal').answer || '', main_obstacle: answers.find(a => a.id === 'challenge').answer || '', weekly_time: answers.find(a => a.id === 'time').answer || '',
      tag_editor: r.tags.editor, tag_assistant: r.tags.assistant,
      source: qs.get('utm_source') || d.referrer || 'direct', page: location.pathname, user_agent: navigator.userAgent
    };
    for (const k in SK) row['skill_' + k] = r.skills[k].pct;
    answers.forEach((a, i) => { row['q' + (i + 1)] = a.answer ? `${a.answer}${a.points != null ? ` [${a.points}]` : ''}` : ''; });
    row.answers = answers;
    row.answers_json = JSON.stringify(answers);
    row.summary_text = summaryText(row, r);
    try { await window.HanaSubmit.send('challenge', row); } catch (err) { console.warn('[hana] submit error', err); }
    lastResult = r; result(r, name);
  }

  function ring(p, label, sub) {
    const C = 2 * Math.PI * 70;
    return `<svg class="ring" viewBox="0 0 160 160" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4CC9F0"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#D7263D"/></linearGradient></defs>
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="6"/>
      <circle class="arc" cx="80" cy="80" r="70" fill="none" stroke="url(#rg)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="--off:${C * (1 - p)}" transform="rotate(-90 80 80)"/>
      <circle cx="80" cy="80" r="58" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".6" stroke-dasharray="1 4"/>
      <text x="80" y="${sub ? 88 : 94}" text-anchor="middle" class="ring-num">${label}</text>${sub ? `<text x="80" y="112" text-anchor="middle" class="ring-sub">${sub}</text>` : ''}</svg>`;
  }

  /* ---- result ---- */
  function result(r, name) {
    const lv = r.lv, li = r.li, c = COURSES[r.course] || {}, altId = r.course === 'editor-plus' ? 'smart-assistant' : 'editor-plus', alt = COURSES[altId] || {};
    const first = esc(name.split(' ')[0]);
    const ladder = LEVELS.map((l, k) => `<span class="${k === li ? 'on' : k < li ? 'past' : ''}"${k === li ? ' aria-current="step"' : ''}><i>${l.num}</i>${l.name}</span>`).join('');
    const bars = Object.keys(SK).map((k, n) => `<li style="--i:${n}"><span class="sk-l">${I[k]}${SK[k].name}</span><span class="sk-t" role="img" aria-label="${SK[k].name}: ${r.skills[k].pct} درصد"><i style="--w:${r.skills[k].pct}%"></i></span><b>${FA(r.skills[k].pct)}٪</b></li>`).join('');
    const strengths = r.strengths.length
      ? r.strengths.map(k => `<li><b>${SK[k].name}</b>تصمیم‌هات توی این بخش حرفه‌ایه؛ روی همین نقطه‌ی قوت سبک خودت رو بساز.</li>`).join('')
      : `<li><b>شروع درست</b>هنوز مهارت شاخصی تثبیت نشده و این یعنی با یک مسیر منظم، از پایه درست یاد می‌گیری و عادت اشتباه نداری.</li>`;
    const steps = [...r.growth.map(k => `<li><b>${SK[k].name}</b>${SK[k].tip}</li>`), `<li><b>قدم سطح ${lv.name}</b>${LEVEL_STEP[lv.key]}</li>`].join('');
    swap(`<div class="result cx-result">
      <div class="kicker" style="justify-content:center">نتیجه‌ی ${first} <span class="latin">Your Level</span></div>
      <div class="cx-hero">
        <div class="cx-gauge"><div class="ring-wrap">${ring(r.score / MAX, FA(r.percent) + '٪', 'SCORE')}</div></div>
        <div class="cx-lv">
          <span class="cx-lvnum latin">Level ${lv.num}</span>
          <h2 class="lv-name" data-focus tabindex="-1">${lv.name}</h2>
          <div class="latin lv-latin">${lv.latin}</div>
          <p class="lv-score">امتیاز ${FA(r.score)} از ${FA(MAX)}</p>
          <div class="ladder" aria-label="سطح‌ها">${ladder}</div>
        </div>
      </div>
      <p class="lv-desc">${lv.desc}</p>
      <section class="cx-panel glass" aria-labelledby="sk-h"><h3 id="sk-h">${I.radar} تحلیل مهارت‌ها</h3><ul class="cx-bars">${bars}</ul></section>
      <div class="cx-two">
        <section class="cx-panel glass cx-str"><h3>${I.up} نقاط قوت تو</h3><ul class="cx-list">${strengths}</ul></section>
        <section class="cx-panel glass cx-next"><h3>${I.flag} قدم‌های بعدی</h3><ol class="cx-list">${steps}</ol></section>
      </div>
      <div class="rec glass cx-rec">
        <div class="rec-badge latin">Recommended path · ${c.numeral || ''}</div>
        <div class="rec-emb"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#${r.course === 'editor-plus' ? 'emb-editor' : 'emb-assistant'}"/></svg></div>
        <div class="rec-tx"><small>دوره‌ی پیشنهادی برای تو</small><h3>${c.name || ''}</h3><p class="muted">${c.subtitle || ''}</p><p class="rec-why">${REASON[r.course]}</p><b class="rec-price">${c.price || ''}</b></div>
        <div class="rec-btns"><a class="btn btn-primary" href="course.html?c=${r.course}">جزئیات دوره ${I.arrow}</a><a class="btn btn-glass" href="${TG}" target="_blank" rel="noopener">مشاوره در تلگرام</a></div>
        <a class="cx-alt" href="course.html?c=${altId}"><span>مسیر جایگزین</span><b>${alt.name || ''}</b><em>${alt.price || ''}</em>${I.arrow}</a>
      </div>
      <a class="cx-tg glass" href="${TG}" target="_blank" rel="noopener"><span class="ic">${I.tg}</span><span><b>نتیجه‌ات رو در تلگرام بفرست</b>برای مشاوره و انتخاب مسیر، سطحت رو بگو: <bdi>${lv.name}</bdi>، امتیاز ${FA(r.percent)}٪</span>${I.arrow}</a>
      <button type="button" class="q-back" id="again" style="margin:22px auto 0">${I.again} شروع دوباره</button>
    </div>`, 1, n => {
      const go = () => { n.querySelector('.arc').classList.add('go'); n.classList.add('play'); };
      reduce ? go() : requestAnimationFrame(() => setTimeout(go, 220));
      n.querySelector('#again').onclick = () => { ans.fill(null); intro(); };
    });
  }

  /* ---- hidden admin export: challenge.html?export=1 ---- */
  function admin() {
    const S = window.HanaSubmit;
    const ch = S.read(S.LOCAL('challenge')), ct = S.read(S.LOCAL('contact')), pd = S.read(S.PENDING);
    const CH_COLS = ['timestamp', 'local_time', 'name', 'phone', 'social', 'consent', 'score', 'max_score', 'percent', 'level', 'level_num', 'recommended_course', 'recommended_course_price', 'strengths', 'growth_areas', 'goal', 'main_obstacle', 'weekly_time',
      ...Object.keys(SK).map(k => 'skill_' + k), ...Q.map((_, i) => 'q' + (i + 1)), 'tag_editor', 'tag_assistant', 'source', 'user_agent', 'version', 'id', 'answers_json', 'summary_text'];
    const CT_COLS = ['timestamp', 'local_time', 'brand', 'name', 'contact', 'collab_type', 'budget', 'message', 'page', 'user_agent', 'id'];
    progress(-1); stepTxt.textContent = 'خروجی داده‌ها';
    swap(`<div class="cx-intro admin">
      <div class="kicker" style="justify-content:center">Admin <span class="latin">Local export</span></div>
      <h1 class="h-md">داده‌های ذخیره‌شده در همین مرورگر</h1>
      <p class="muted">فقط برای تست. وقتی CHALLENGE_ENDPOINT تنظیم شده باشه، داده‌ها مستقیم ارسال می‌شن.<br>Endpoint: <code dir="ltr">${S.endpoint ? 'configured' : 'empty (local mode)'}</code></p>
      <div class="cx-facts"><span><b>${FA(ch.length)}</b>چالش</span><span><b>${FA(ct.length)}</b>همکاری</span><span><b>${FA(pd.length)}</b>در صف ارسال</span></div>
      <div class="admin-btns">
        <button class="btn btn-primary" data-x="ch">دانلود CSV چالش</button>
        <button class="btn btn-glass" data-x="ct">دانلود CSV همکاری</button>
        <button class="btn btn-glass" data-x="pd">دانلود صف ارسال</button>
        <button class="q-back" data-x="clr" style="margin:8px auto 0">پاک کردن داده‌های محلی</button>
      </div></div>`, 1, n => {
      n.querySelectorAll('[data-x]').forEach(b => b.onclick = () => {
        const x = b.dataset.x, dt = new Date().toISOString().slice(0, 10);
        if (x === 'ch') S.download(`challenge-${dt}.csv`, S.toCSV(ch, CH_COLS));
        if (x === 'ct') S.download(`contact-${dt}.csv`, S.toCSV(ct, CT_COLS));
        if (x === 'pd') S.download(`pending-${dt}.csv`, S.toCSV(pd, ['type', ...CH_COLS]));
        if (x === 'clr' && confirm('همه‌ی داده‌های محلی پاک بشه؟')) { localStorage.removeItem(S.LOCAL('challenge')); localStorage.removeItem(S.LOCAL('contact')); admin(); }
      });
    });
  }

  const qs = new URLSearchParams(location.search);
  if (qs.get('export') === '1') admin(); else intro();
  window.__quiz = { Q, LEVELS, SK, MAX, compute, ans, show, gate, result: () => lastResult };
})();
