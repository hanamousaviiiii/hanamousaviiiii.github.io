/* hana.aistudio — «سطح هوش مصنوعی تو چیه؟» */
(() => {
  const $ = s => document.querySelector(s);
  const app = $('#quiz'), bar = $('#qbar'), stepTxt = $('#qstep');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FA = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const KEYS = ['الف', 'ب', 'ج', 'د'];
  const COURSES = window.HANA_COURSES || {};

  /* ---- questions: p = points (null = profile question), t = course tags ---- */
  const Q = [
    { topic: 'ابزارها', q: 'چقدر از ابزارهای هوش مصنوعی مثل ChatGPT یا Gemini استفاده می‌کنی؟', o: [
      ['تا حالا استفاده نکردم', 0], ['چند بار امتحان کردم', 1], ['هر هفته برای چند کار مشخص', 2], ['هر روز؛ بخشی از کارمه', 3]] },
    { topic: 'پرامپت‌نویسی', q: 'وقتی هوش مصنوعی جواب ضعیفی می‌ده، معمولاً چی‌کار می‌کنی؟', o: [
      ['بی‌خیال می‌شم؛ لابد بلد نیست', 0], ['همون سؤال رو دوباره می‌پرسم', 1], ['سؤالم رو دقیق‌تر و کامل‌تر می‌نویسم', 2], ['نقش، زمینه و قالب خروجی رو مشخص می‌کنم و مرحله‌به‌مرحله اصلاحش می‌کنم', 3]] },
    { topic: 'پرامپت‌نویسی', q: 'کدوم پرامپت نتیجه‌ی دقیق‌تری می‌گیره؟', o: [
      ['«یه کپشن کوتاه و صمیمی برای پست آموزشی ادیت موبایل بنویس»', 2], ['«یه کپشن بنویس»', 0],
      ['«تو کپی‌رایتر اینستاگرامی هستی؛ برای پست آموزشی ادیت موبایل سه کپشن صمیمی، هر کدوم حداکثر چهار خط، با یک سؤال در پایان بنویس»', 3], ['«یه کپشن جذاب برای پستم بنویس»', 1]] },
    { topic: 'تصویر', q: 'تا حالا با هوش مصنوعی تصویر ساختی؟', o: [
      ['نه، هنوز نه', 0], ['یکی دو بار، برای سرگرمی', 1], ['چند بار، برای پیج یا کارم', 2], ['مرتب؛ سبک، نور و نسبت تصویر رو کنترل می‌کنم', 3]] },
    { topic: 'ویدیو', q: 'با هوش مصنوعی ویدیو ساختی؟ مثلاً ویدیو از عکس یا لیپ‌سینک', o: [
      ['نه، اصلاً', 0], ['فقط نمونه‌هاش رو دیدم', 1], ['یکی دو بار امتحان کردم', 2], ['بله، و توی محتوام استفاده کردم', 3]] },
    { topic: 'ادیت موبایل', q: 'با اپ‌هایی مثل الایت موشن، کپکات یا اینشات چقدر کار کردی؟', o: [
      ['هیچ‌وقت', 0], ['در حد بریدن و چسباندن کلیپ', 1], ['ترنزیشن، متن، موسیقی و زیرنویس', 2], ['کی‌فریم، موشن‌گرافی و افکت‌های حرفه‌ای', 3]] },
    { topic: 'محتوا', q: 'برای ریلز و استوری اینستاگرام، نسبت تصویر استاندارد کدومه؟', o: [
      ['۱۶:۹ (افقی)', 0], ['۱:۱ (مربع)', 0], ['۹:۱۶ (عمودی تمام‌صفحه)', 3], ['۴:۵', 1]] },
    { topic: 'هدف', q: 'مهم‌ترین هدفت از یادگیری چیه؟', profile: true, o: [
      ['رشد پیجم و ادیت حرفه‌ای ویدیوهام', null, { editor: 2 }], ['ساخت تصویر، صدا و ویدیو با هوش مصنوعی', null, { assistant: 2 }],
      ['کسب درآمد و گرفتن پروژه', null, { assistant: 2 }], ['ادیت محتوا برای کسب‌وکارم (مثلاً زیبایی یا دندانپزشکی)', null, { editor: 2 }]] },
    { topic: 'چالش', q: 'الان بزرگ‌ترین چالشت توی تولید محتوا چیه؟', profile: true, o: [
      ['کیفیت ادیت ویدیوهام', null, { editor: 1 }], ['ایده و سناریو', null, { assistant: 1 }], ['ساخت کاور و گرافیک', null, { editor: 1 }], ['وقت کم برای تولید محتوا', null, { assistant: 1 }]] },
    { topic: 'زمان', q: 'هفته‌ای چقدر وقت برای یادگیری داری؟', profile: true, o: [
      ['کمتر از ۲ ساعت', null], ['۲ تا ۵ ساعت', null], ['۵ تا ۱۰ ساعت', null], ['بیشتر از ۱۰ ساعت', null]] },
  ];
  const MAX = Q.reduce((s, q) => s + (q.profile ? 0 : Math.max(...q.o.map(o => o[1]))), 0); // 21

  const LEVELS = [
    { key: 'explorer', num: 'I', name: 'کاوشگر', latin: 'The Explorer', min: 0,
      desc: 'تازه وارد دنیای هوش مصنوعی شدی و این بهترین نقطه برای شروعه. با یک مسیر درست، خیلی سریع از «امتحان کردن ابزارها» به ساختن محتوای واقعی می‌رسی.',
      steps: ['هر روز یک کار کوچک رو به یک چت‌بات بسپار', 'فرمول پرامپت رو تمرین کن: نقش، هدف، زمینه، قالب، لحن', 'اولین ویدیوی کوتاهت رو با گوشی ادیت کن'] },
    { key: 'maker', num: 'II', name: 'سازنده', latin: 'The Maker', min: 6,
      desc: 'ابزارها رو می‌شناسی و امتحانشون کردی. حالا وقتشه از نتیجه‌های اتفاقی به خروجی قابل‌پیش‌بینی و حرفه‌ای برسی.',
      steps: ['پرامپت‌های موفقت رو ذخیره و دسته‌بندی کن', 'یک سبک بصری ثابت برای پیجت انتخاب کن', 'ادیت رو از برش ساده به ریتم، متن و موشن برسون'] },
    { key: 'creator', num: 'III', name: 'خالق', latin: 'The Creator', min: 11,
      desc: 'هوش مصنوعی بخشی از جریان کارته. با تکنیک‌های پیشرفته‌تر و ترکیب ابزارها، می‌تونی سبک امضادار خودت رو بسازی.',
      steps: ['ابزارها رو زنجیره‌ای ترکیب کن: سناریو، تصویر، صدا، ویدیو', 'روی شخصیت‌سازی و ثبات بصری کار کن', 'یک پروژه‌ی واقعی برای نمونه‌کارت بساز'] },
    { key: 'architect', num: 'IV', name: 'معمار AI', latin: 'The Architect', min: 17,
      desc: 'فراتر از یک کاربر معمولی هستی؛ ابزارها رو ترکیب می‌کنی و خروجی حرفه‌ای می‌گیری. قدم بعدی، تبدیل این مهارت به پروژه و درآمده.',
      steps: ['نمونه‌کار حرفه‌ای و منظم آماده کن', 'خدماتت رو برای کسب‌وکارها بسته‌بندی کن', 'روی پروژه‌های واقعی بازار کار کن'] },
  ];
  const REASON = { 'editor-plus': 'با توجه به هدف و چالشت، تمرکز روی ادیت حرفه‌ای با موبایل بیشترین تأثیر رو روی محتوات می‌ذاره.',
                   'smart-assistant': 'با توجه به هدفت، یادگیری خلق محتوا و کسب درآمد با هوش مصنوعی بهترین قدم بعدی توئه.' };

  const ans = new Array(Q.length).fill(null);
  let idx = -1, busy = false;

  const icon = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ARROW = icon('<path d="M19 12H5M11 6l-6 6 6 6"/>'), BACK = icon('<path d="M5 12h14M13 6l6 6-6 6"/>');

  function swap(html, dir = 1, after) {
    const old = app.querySelector('.scr');
    const n = document.createElement('div'); n.className = 'scr'; n.innerHTML = html;
    if (old && !reduce) {
      old.classList.add(dir > 0 ? 'out' : 'out-r');
      n.classList.add(dir > 0 ? 'enter' : 'enter-r');
      setTimeout(() => { old.remove(); }, 380);
      app.appendChild(n);
      requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('enter', 'enter-r')));
    } else { if (old) old.remove(); app.appendChild(n); }
    after && after(n);
    const top = app.getBoundingClientRect().top + scrollY - 90;
    if (scrollY > top) scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
  function progress(i) {
    const p = i < 0 ? 0 : Math.min(i / Q.length, 1);
    bar.style.transform = `scaleX(${p})`;
    stepTxt.textContent = i < 0 ? 'آماده‌ای؟' : i >= Q.length ? 'نتیجه' : `سؤال ${FA(String(i + 1).padStart(2, '0'))} از ${FA(Q.length)}`;
  }

  function intro() {
    idx = -1; progress(-1);
    swap(`<div class="q-intro">
      <div class="kicker" style="justify-content:center">چالش <span class="latin">The AI Level Test</span></div>
      <h1 class="h-lg">سطح هوش مصنوعی <span class="grad">تو</span> چیه؟</h1>
      <p class="lead">به ۱۰ سؤال کوتاه درباره‌ی ابزارها، پرامپت‌نویسی، تصویر، ویدیو و ادیت جواب بده تا سطحت رو ببینی و دوره‌ای که به هدفت می‌خوره رو بشناسی.</p>
      <div class="q-facts"><span><b>۱۰</b>سؤال</span><span><b>۳</b>دقیقه</span><span><b>۴</b>سطح</span></div>
      <button class="btn btn-primary" id="go">شروع چالش ${ARROW}</button>
    </div>`, 1, n => n.querySelector('#go').onclick = () => show(0, 1));
  }

  function show(i, dir) {
    idx = i; progress(i);
    const q = Q[i];
    const opts = q.o.map((o, k) => `<button class="opt${ans[i] === k ? ' sel' : ''}" data-k="${k}" style="--d:${k * 0.05 + .1}s"><span class="key">${KEYS[k]}</span><span class="ot">${o[0]}</span><span class="tick">${icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>')}</span></button>`).join('');
    swap(`<div class="q-screen">
      <div class="q-meta"><span class="q-topic">${q.topic}</span><span class="latin">${String(i + 1).padStart(2, '0')} / ${Q.length}</span></div>
      <h2 class="q-title">${q.q}</h2>
      <div class="opts">${opts}</div>
      <div class="q-foot">${i > 0 ? `<button class="q-back" id="back">${BACK} سؤال قبلی</button>` : '<span></span>'}<span class="muted" style="font-size:12.5px">یک گزینه رو انتخاب کن</span></div>
    </div>`, dir, n => {
      n.querySelectorAll('.opt').forEach(b => b.onclick = () => pick(+b.dataset.k, b));
      const bk = n.querySelector('#back'); if (bk) bk.onclick = () => !busy && show(i - 1, -1);
    });
  }
  function pick(k, el) {
    if (busy) return; busy = true;
    ans[idx] = k;
    el.parentNode.querySelectorAll('.opt').forEach(b => b.classList.toggle('sel', b === el));
    setTimeout(() => { busy = false; idx < Q.length - 1 ? show(idx + 1, 1) : gate(); }, reduce ? 60 : 420);
  }

  function compute() {
    let score = 0; const tags = { editor: 0, assistant: 0 };
    Q.forEach((q, i) => { const o = q.o[ans[i]]; if (!o) return; if (o[1] != null) score += o[1]; if (o[2]) for (const t in o[2]) tags[t] += o[2][t]; });
    let lv = LEVELS[0]; LEVELS.forEach(l => { if (score >= l.min) lv = l; });
    let course = tags.editor > tags.assistant ? 'editor-plus' : tags.assistant > tags.editor ? 'smart-assistant' : (LEVELS.indexOf(lv) >= 2 ? 'smart-assistant' : 'editor-plus');
    return { score, lv, tags, course, percent: Math.round(score / MAX * 100) };
  }

  function gate() {
    idx = Q.length; progress(Q.length);
    swap(`<div class="gate">
      <div class="gate-preview" aria-hidden="true"><div class="ring-wrap blur">${ring(.72, '?')}</div></div>
      <div class="kicker" style="justify-content:center">نتیجه‌ات آماده‌ست <span class="latin">Almost there</span></div>
      <h2 class="h-md" style="text-align:center;margin-bottom:8px">سطحت مشخص شد</h2>
      <p class="muted" style="text-align:center;margin:0 0 26px">برای دیدن نتیجه‌ی کامل و مسیر پیشنهادی، اطلاعاتت رو وارد کن.</p>
      <form id="cform" novalidate>
        <div class="field"><label for="f-name">نام و نام خانوادگی</label><input class="input" id="f-name" name="name" autocomplete="name" required><span class="msg">لطفاً نامت رو وارد کن.</span></div>
        <div class="field"><label for="f-phone">شماره موبایل</label><input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" dir="ltr" placeholder="09xx xxx xxxx" autocomplete="tel" required><span class="msg">شماره موبایل معتبر نیست؛ مثلاً ۰۹۱۲۱۲۳۴۵۶۷</span></div>
        <div class="field"><label for="f-social">آیدی تلگرام یا اینستاگرام <small>(اختیاری)</small></label><input class="input" id="f-social" name="social" dir="ltr" placeholder="@username"><span class="msg">آیدی فقط می‌تونه شامل حروف انگلیسی، عدد، نقطه و _ باشه.</span></div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="check" id="f-consent-wrap"><input type="checkbox" id="f-consent" name="consent"><span>موافقم نتیجه و اطلاعات دوره‌ها از طرف هانا موسوی برام ارسال بشه و برای مشاوره با من تماس گرفته بشه.</span></label>
        <button class="btn btn-primary btn-block" type="submit" style="margin-top:22px">دیدن نتیجه ${ARROW}</button>
        <p class="form-note">اطلاعاتت فقط برای ارتباط درباره‌ی دوره‌ها استفاده می‌شه.</p>
      </form>
      <button class="q-back" id="back" style="margin:14px auto 0">${BACK} برگشت به سؤال‌ها</button>
    </div>`, 1, n => {
      n.querySelector('#back').onclick = () => show(Q.length - 1, -1);
      n.querySelector('#cform').addEventListener('submit', submit);
    });
  }

  async function submit(e) {
    e.preventDefault();
    const f = e.target, V = window.HanaValid;
    if (f.website.value) return;
    const name = f.name.value.trim(), phone = V.phone(f.phone.value), social = f.social.value.trim(), consent = f.consent.checked;
    const set = (el, bad) => { el.closest('.field').classList.toggle('err', bad); return !bad; };
    let ok = set(f.name, name.length < 2);
    ok = set(f.phone, !phone) && ok;
    ok = set(f.social, !!social && !V.handle(social)) && ok;
    document.getElementById('f-consent-wrap').classList.toggle('err', !consent); ok = consent && ok;
    if (!ok) { const first = f.querySelector('.err .input'); first && first.focus(); return; }
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.style.opacity = .6; btn.firstChild.textContent = 'در حال ثبت… ';

    const r = compute(), now = new Date(), qs = new URLSearchParams(location.search);
    const row = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(now.getTime()),
      timestamp: now.toISOString(),
      local_time: now.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }),
      name, phone, social: social.replace(/^@?/, social ? '@' : ''), consent: consent ? 'yes' : 'no',
      score: r.score, max_score: MAX, percent: r.percent,
      level: r.lv.name, level_key: r.lv.key,
      recommended_course: (COURSES[r.course] || {}).name || r.course, recommended_course_id: r.course,
      tag_editor: r.tags.editor, tag_assistant: r.tags.assistant,
      source: qs.get('utm_source') || document.referrer || 'direct', user_agent: navigator.userAgent
    };
    Q.forEach((q, i) => { const o = q.o[ans[i]]; row['q' + (i + 1)] = o ? o[0] + (o[1] != null ? ` [${o[1]}]` : '') : ''; });
    row.answers_json = JSON.stringify(Q.map((q, i) => ({ q: q.q, a: ans[i] != null ? q.o[ans[i]][0] : null, points: ans[i] != null ? q.o[ans[i]][1] : null })));
    await window.HanaSubmit.send('challenge', row);
    result(r, name);
  }

  function ring(p, label, sub) {
    const C = 2 * Math.PI * 70;
    return `<svg class="ring" viewBox="0 0 160 160"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4CC9F0"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#D7263D"/></linearGradient></defs>
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5"/>
      <circle class="arc" cx="80" cy="80" r="70" fill="none" stroke="url(#rg)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="--off:${C * (1 - p)}" transform="rotate(-90 80 80)"/>
      <circle cx="80" cy="80" r="58" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".6" stroke-dasharray="1 4"/>
      <text x="80" y="${sub ? 86 : 94}" text-anchor="middle" class="ring-num">${label}</text>${sub ? `<text x="80" y="112" text-anchor="middle" class="ring-sub">${sub}</text>` : ''}</svg>`;
  }

  function result(r, name) {
    const c = COURSES[r.course] || {}; const lv = r.lv; const li = LEVELS.indexOf(lv);
    const ladder = LEVELS.map((l, k) => `<span class="${k === li ? 'on' : k < li ? 'past' : ''}"><i>${l.num}</i>${l.name}</span>`).join('');
    swap(`<div class="result">
      <div class="kicker" style="justify-content:center">نتیجه‌ی ${name.split(' ')[0]} <span class="latin">Your Level</span></div>
      <div class="ring-wrap">${ring(r.score / MAX, lv.num, 'LEVEL')}</div>
      <h2 class="lv-name">${lv.name}</h2>
      <div class="latin lv-latin">${lv.latin}</div>
      <p class="lv-score">امتیاز ${FA(r.score)} از ${FA(MAX)}</p>
      <div class="ladder">${ladder}</div>
      <p class="lv-desc">${lv.desc}</p>
      <div class="next-steps glass"><h3>قدم‌های بعدی تو</h3><ol>${lv.steps.map(s => `<li>${s}</li>`).join('')}</ol></div>
      <div class="rec glass">
        <div class="rec-badge latin">Recommended · ${c.numeral || ''}</div>
        <div class="rec-emb"><svg viewBox="0 0 120 120"><use href="#${r.course === 'editor-plus' ? 'emb-editor' : 'emb-assistant'}"/></svg></div>
        <div class="rec-tx"><small>دوره‌ی پیشنهادی برای تو</small><h3>${c.name || ''}</h3><p class="muted">${c.subtitle || ''}</p><p class="rec-why">${REASON[r.course]}</p><b class="rec-price">${c.price || ''}</b></div>
        <div class="rec-btns"><a class="btn btn-primary" href="course.html?c=${r.course}">جزئیات دوره ${ARROW}</a><a class="btn btn-glass" href="${(window.HANA_CONFIG || {}).TELEGRAM_URL}" target="_blank" rel="noopener">مشاوره در تلگرام</a></div>
      </div>
      <button class="q-back" id="again" style="margin:26px auto 0">${icon('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>')} شروع دوباره</button>
    </div>`, 1, n => {
      requestAnimationFrame(() => setTimeout(() => n.querySelector('.arc').classList.add('go'), 200));
      n.querySelector('#again').onclick = () => { ans.fill(null); intro(); };
    });
  }

  /* ---- hidden admin export: challenge.html?export=1 ---- */
  function admin() {
    const S = window.HanaSubmit;
    const ch = S.read(S.LOCAL('challenge')), ct = S.read(S.LOCAL('contact')), pd = S.read(S.PENDING);
    const CH_COLS = ['timestamp', 'local_time', 'name', 'phone', 'social', 'consent', 'score', 'max_score', 'percent', 'level', 'recommended_course', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'tag_editor', 'tag_assistant', 'source', 'user_agent', 'id', 'answers_json'];
    const CT_COLS = ['timestamp', 'local_time', 'brand', 'name', 'contact', 'collab_type', 'budget', 'message', 'page', 'user_agent', 'id'];
    progress(-1); stepTxt.textContent = 'خروجی داده‌ها';
    swap(`<div class="q-intro admin">
      <div class="kicker" style="justify-content:center">Admin <span class="latin">Local export</span></div>
      <h1 class="h-md">داده‌های ذخیره‌شده در همین مرورگر</h1>
      <p class="muted">فقط برای تست. وقتی CHALLENGE_ENDPOINT تنظیم شده باشه، داده‌ها مستقیم به Google Sheet می‌رن.<br>Endpoint: <code dir="ltr">${S.endpoint ? 'configured' : 'empty (local mode)'}</code></p>
      <div class="q-facts"><span><b>${FA(ch.length)}</b>چالش</span><span><b>${FA(ct.length)}</b>همکاری</span><span><b>${FA(pd.length)}</b>در صف ارسال</span></div>
      <div class="admin-btns">
        <button class="btn btn-primary" data-x="ch">دانلود CSV چالش</button>
        <button class="btn btn-glass" data-x="ct">دانلود CSV همکاری</button>
        <button class="btn btn-glass" data-x="pd">دانلود صف ارسال</button>
        <button class="q-back" data-x="clr" style="margin:8px auto 0">پاک کردن داده‌های محلی</button>
      </div></div>`, 1, n => {
      n.querySelectorAll('[data-x]').forEach(b => b.onclick = () => {
        const x = b.dataset.x, d = new Date().toISOString().slice(0, 10);
        if (x === 'ch') S.download(`challenge-${d}.csv`, S.toCSV(ch, CH_COLS));
        if (x === 'ct') S.download(`contact-${d}.csv`, S.toCSV(ct, CT_COLS));
        if (x === 'pd') S.download(`pending-${d}.csv`, S.toCSV(pd, ['type', ...CH_COLS]));
        if (x === 'clr' && confirm('همه‌ی داده‌های محلی پاک بشه؟')) { localStorage.removeItem(S.LOCAL('challenge')); localStorage.removeItem(S.LOCAL('contact')); admin(); }
      });
    });
    if (ch.length) S.download(`challenge-${new Date().toISOString().slice(0, 10)}.csv`, S.toCSV(ch, CH_COLS));
  }

  const qs = new URLSearchParams(location.search);
  if (qs.get('export') === '1') admin(); else intro();
  window.__quiz = { Q, LEVELS, compute, ans, show, gate };
})();
