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
    tools: icon('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>'), strategy: icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/>'),
    workflow: icon('<rect x="3" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="14" width="7" height="6" rx="1.5"/><path d="M10 7h4a3 3 0 0 1 3 3v4"/>'), cal: icon('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    dl: icon('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'), book: icon('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
    user: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')
  };

  const C = window.HANA_CHALLENGE;
  const { SK, Q, LEVELS, LEVEL_STEP, TIME, GOAL_PROJECT, OBSTACLE_TIP, TOOLS, REASON } = C;
  const SCORED = Q.filter(q => !q.profile);
  const MAX = SCORED.reduce((s, q) => s + Math.max(...q.o.map(o => o[1])), 0);
  const TOP = q => Math.max(...q.o.map(o => o[1]));
  /* option order is shuffled for every attempt (profile questions keep their order) */
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let ORDER = [];
  const newOrder = () => { ORDER = Q.map(q => q.profile ? q.o.map((_, k) => k) : shuffle(q.o.map((_, k) => k))); };
  newOrder();
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
    const nScored = SCORED.length, nSk = Object.keys(SK).length;
    swap(`<div class="cx-intro">
      <div class="kicker" style="justify-content:center">چالش <span class="latin">The AI Level Test</span></div>
      <h1 class="h-lg" data-focus tabindex="-1">سطح هوش مصنوعی <span class="grad">تو</span> چیه؟</h1>
      <p class="lead">یک ارزیابی سناریومحور بر اساس موقعیت‌های واقعی تولید محتوا. نه حفظیات؛ تصمیم‌هایی که هر روز موقع ساختن محتوا می‌گیری.</p>
      <div class="cx-facts" role="list">
        <span role="listitem"><b>${FA(Q.length)}</b>سؤال</span>
        <span role="listitem"><b>${FA(5)}</b>دقیقه</span>
        <span role="listitem"><b>${FA(nSk)}</b>مهارت</span>
        <span role="listitem"><b>${FA(4)}</b>سطح</span>
      </div>
      <ul class="cx-gets">
        <li><span class="ic">${I.gauge}</span><span><b>سطح و امتیاز دقیق</b>جایگاهت در یکی از چهار سطح، از کاوشگر تا معمار AI</span></li>
        <li><span class="ic">${I.radar}</span><span><b>تحلیل ${FA(nSk)} مهارت</b>برای هر مهارت یک تحلیل کوتاه: کجا قوی هستی و کجا با کمی تمرین بیشترین رشد رو داری</span></li>
        <li><span class="ic">${I.cal}</span><span><b>برنامه‌ی ۴ هفته‌ای شخصی</b>بر اساس سطح، هدف، وقت آزاد و مانع اصلی خودت، به‌علاوه‌ی ابزارهای مناسب سطحت</span></li>
        <li><span class="ic">${I.route}</span><span><b>دوره‌ی مناسب و کارت استوری</b>اینکه کدوم دوره به تو می‌خوره و چرا، و یک کارت نتیجه برای استوری اینستاگرام</span></li>
      </ul>
      <div class="cx-skills" aria-label="مهارت‌های ارزیابی">${Object.entries(SK).map(([k, s]) => `<span>${I[k]}${s.name}</span>`).join('')}</div>
      <button class="btn btn-primary cx-start" id="go">شروع چالش ${I.arrow}</button>
      <p class="cx-note">${I.lock} ${FA(nScored)} سؤال مهارتی و ${FA(Q.length - nScored)} سؤال درباره‌ی هدفت. ترتیب گزینه‌ها هر بار عوض می‌شه. برای دیدن نتیجه فقط نام و شماره‌ی موبایل لازمه.</p>
    </div>`, 1, n => n.querySelector('#go').onclick = () => { newOrder(); show(0, 1); });
  }

  /* ---- question ---- */
  const frame = r => { const [w, h] = r, s = 46 / Math.max(w, h); return `<span class="cx-frame" aria-hidden="true"><i style="width:${(w * s).toFixed(1)}px;height:${(h * s).toFixed(1)}px"></i></span>`; };
  function show(i, dir) {
    idx = i; progress(i);
    const q = Q[i], sk = SK[q.sk];
    const chip = q.profile ? `<span class="cx-topic prof">${I.user} درباره‌ی تو</span>` : `<span class="cx-topic">${I[q.sk]} ${sk.name}</span>`;
    const sel = ans[i];
    const opts = ORDER[i].map((ok, pos) => { const o = q.o[ok];
      return `<button type="button" class="opt${sel === ok ? ' sel' : ''}${q.kind ? ' k-' + q.kind : ''}" role="radio" aria-checked="${sel === ok}" tabindex="${(sel == null ? pos === 0 : sel === ok) ? 0 : -1}" data-pos="${pos}"><span class="key" aria-hidden="true">${KEYS[pos]}</span>${q.kind === 'ratio' ? frame(o[2]) : ''}<span class="ot">${o[0]}</span><span class="tick">${I.tick}</span></button>`; }).join('');
    const lead = q.kind === 'prompt' ? '<p class="cx-lead">همه‌ی گزینه‌ها پرامپت‌های واقعی‌ان؛ اونی رو انتخاب کن که خودت استفاده می‌کنی.</p>' : '';
    swap(`<div class="cx-q">
      <div class="cx-meta">${chip}${q.profile ? '' : '<span class="cx-scn">سناریو</span>'}<span class="latin cx-count" dir="ltr">${String(i + 1).padStart(2, '0')} / ${Q.length}</span></div>
      <h2 class="cx-title" id="qt${i}" data-focus tabindex="-1">${q.q}</h2>${lead}
      <div class="opts${q.kind === 'ratio' ? ' grid4' : ''}" role="radiogroup" aria-labelledby="qt${i}">${opts}</div>
      <div class="cx-foot">${i > 0 ? `<button type="button" class="q-back" id="back">${I.back} سؤال قبلی</button>` : '<span></span>'}<span class="cx-hint">${q.profile ? 'جواب درست یا غلط نداره' : 'نتیجه و تحلیل، آخر چالش نمایش داده می‌شه'}</span></div>
    </div>`, dir, n => {
      const bs = [...n.querySelectorAll('.opt')];
      bs.forEach((b, p) => {
        b.onclick = () => pick(ORDER[i][p], b);
        b.onkeydown = e => {
          const m = { ArrowDown: 1, ArrowLeft: 1, ArrowUp: -1, ArrowRight: -1 }[e.key];
          if (m) { e.preventDefault(); const t = bs[(p + m + bs.length) % bs.length]; bs.forEach(x => x.tabIndex = -1); t.tabIndex = 0; t.focus(); }
        };
      });
      const bk = n.querySelector('#back'); if (bk) bk.onclick = () => !busy && show(i - 1, -1);
      // hover styling only after the pointer actually moves on this screen (no carried-over / sticky hover)
      const q = n.querySelector('.cx-q'), arm = () => { q.classList.add('armed'); q.removeEventListener('pointermove', arm); };
      q.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') arm(); });
    });
  }
  d.addEventListener('keydown', e => {
    if (idx < 0 || idx >= Q.length || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA)$/.test((e.target || {}).tagName || '')) return;
    const p = ['1', '2', '3', '4'].indexOf(e.key) >= 0 ? +e.key - 1 : ['۱', '۲', '۳', '۴'].indexOf(e.key);
    if (p >= 0) { const b = app.querySelector(`.scr:last-child .opt[data-pos="${p}"]`); if (b) { e.preventDefault(); pick(ORDER[idx][p], b); } }
  });
  function pick(k, el) {
    if (busy) return; busy = true;
    ans[idx] = k;
    if (d.activeElement && d.activeElement.blur && !el.matches(':focus-visible')) d.activeElement.blur();
    el.parentNode.querySelectorAll('.opt').forEach(b => { const on = b === el; b.classList.toggle('sel', on); b.setAttribute('aria-checked', on); });
    setTimeout(() => { busy = false; idx < Q.length - 1 ? show(idx + 1, 1) : gate(); }, reduce ? 80 : 440);
  }

  /* ---- scoring ---- */
  const tier = p => p >= 84 ? 'hi' : p >= 50 ? 'mid' : 'lo';
  const TIER_LABEL = { hi: 'قوی', mid: 'در حال رشد', lo: 'نیاز به تمرین' };
  function compute() {
    let score = 0, correct = 0; const tags = { editor: 0, assistant: 0 }, skills = {};
    for (const k in SK) skills[k] = { got: 0, max: 0 };
    Q.forEach((q, i) => {
      const o = q.o[ans[i]];
      if (!q.profile) { skills[q.sk].max += TOP(q); if (o) { skills[q.sk].got += o[1]; score += o[1]; if (o[1] === TOP(q)) correct++; } }
      else if (o && o[2]) for (const t in o[2]) tags[t] += o[2][t];
    });
    for (const k in skills) { skills[k].pct = Math.round(skills[k].got / skills[k].max * 100); skills[k].tier = tier(skills[k].pct); }
    let lv = LEVELS[0]; LEVELS.forEach(l => { if (score >= l.min) lv = l; });
    const li = LEVELS.indexOf(lv);
    if (skills.edit.pct < 50) tags.editor += 1;
    const course = tags.editor > tags.assistant ? 'editor-plus' : tags.assistant > tags.editor ? 'smart-assistant' : (li >= 1 ? 'smart-assistant' : 'editor-plus');
    const order = Object.keys(SK).sort((a, b) => skills[b].pct - skills[a].pct);
    const strengths = order.filter(k => skills[k].pct >= 67).slice(0, 3);
    const growth = order.slice().reverse().filter(k => skills[k].pct < 100 && !strengths.includes(k)).slice(0, 3);
    const pi = id => ans[Q.findIndex(q => q.id === id)];
    return { score, max: MAX, percent: Math.round(score / MAX * 100), correct, lv, li, tags, course, skills, strengths, growth, goal: pi('goal'), obstacle: pi('challenge'), time: pi('time') };
  }

  function roadmap(r) {
    const g = r.growth.length ? r.growth : Object.keys(SK).sort((a, b) => r.skills[a].pct - r.skills[b].pct);
    const w1 = g[0], w2 = g[1] || g[0];
    return [
      { t: `پایه‌ی ${SK[w1].name}`, items: SK[w1].plan },
      { t: `تقویت ${SK[w2].name}`, items: w2 === w1 ? [SK[w1].plan[1], OBSTACLE_TIP[r.obstacle ?? 0]] : SK[w2].plan },
      { t: 'پروژه‌ی هدف', items: [GOAL_PROJECT[r.goal ?? 0], OBSTACLE_TIP[r.obstacle ?? 0]] },
      { t: 'انتشار و بازبینی', items: ['خروجی هفته‌ی سوم رو منتشر کن و بعد از ۴۸ ساعت، نگه‌داشت مخاطب و ذخیره‌ها رو بررسی کن', LEVEL_STEP[r.lv.key]] }
    ];
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
      `سطح: ${row.level} (${FA(row.score)} از ${FA(row.max_score)} · ${FA(row.percent)}٪ · ${FA(row.correct_count)} از ${FA(row.scored_questions)} پاسخ کامل)`,
      `دوره‌ی پیشنهادی: ${row.recommended_course}`,
      `مهارت‌ها: ${Object.keys(SK).map(k => `${SK[k].name} ${FA(r.skills[k].pct)}٪`).join('، ')}`,
      row.strengths ? `نقاط قوت: ${row.strengths}` : null, row.growth_areas ? `نیاز به تمرین: ${row.growth_areas}` : null,
      `هدف: ${row.goal || '-'}`, `مانع اصلی: ${row.main_obstacle || '-'}`, `زمان آزاد هفتگی: ${row.weekly_time || '-'}`,
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
      return { id: q.id, skill: q.profile ? 'profile' : q.sk, question: q.q, answer: o ? o[0] : null, option: ans[i] != null ? KEYS[ORDER[i].indexOf(ans[i])] : null, points: o && o[1] != null ? o[1] : null, max: q.profile ? null : TOP(q) };
    });
    const row = {
      version: 'challenge-v3',
      id: crypto.randomUUID ? crypto.randomUUID() : String(now.getTime()),
      timestamp: now.toISOString(),
      local_time: now.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }),
      name, phone, social: social ? '@' + social.replace(/^@/, '') : '', consent: consent ? 'yes' : 'no',
      score: r.score, max_score: MAX, percent: r.percent, correct_count: r.correct, scored_questions: SCORED.length, total_questions: Q.length,
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
  function chapters(r) {
    const id = r.course, c = COURSES[id] || {}, key = id === 'editor-plus' ? 'ep' : 'sa', out = [];
    const pool = r.growth.concat(Object.keys(SK).sort((a, b) => r.skills[a].pct - r.skills[b].pct));
    for (const k of pool) { const ch = SK[k][key]; if (ch && !out.includes(ch) && (c.syllabus || []).includes(ch)) out.push(ch); if (out.length >= 3) break; }
    if (!out.length && c.syllabus) out.push(...c.syllabus.slice(0, 3));
    return out;
  }
  function result(r, name) {
    const lv = r.lv, li = r.li, c = COURSES[r.course] || {}, altId = r.course === 'editor-plus' ? 'smart-assistant' : 'editor-plus', alt = COURSES[altId] || {};
    const first = esc(name.split(' ')[0]);
    const ladder = LEVELS.map((l, k) => `<span class="${k === li ? 'on' : k < li ? 'past' : ''}"${k === li ? ' aria-current="step"' : ''}><i>${l.num}</i>${l.name}</span>`).join('');
    const cards = Object.keys(SK).map((k, n) => { const s = r.skills[k];
      return `<li class="cx-sk t-${s.tier}" style="--i:${n}"><div class="cx-sk-h"><span class="sk-l">${I[k]}${SK[k].name}</span><em>${TIER_LABEL[s.tier]}</em><b>${FA(s.pct)}٪</b></div><span class="sk-t" role="img" aria-label="${SK[k].name}: ${s.pct} درصد"><i style="--w:${s.pct}%"></i></span><p>${SK[k][s.tier]}</p></li>`; }).join('');
    const strengths = r.strengths.length
      ? r.strengths.map(k => `<li><b>${SK[k].name}</b>${SK[k].hi}</li>`).join('')
      : `<li><b>شروع درست</b>هنوز مهارت شاخصی تثبیت نشده و این یعنی با یک مسیر منظم، از پایه درست یاد می‌گیری و عادت اشتباه نداری.</li>`;
    const steps = [...r.growth.slice(0, 2).map(k => `<li><b>${SK[k].name}</b>${SK[k].lo}</li>`), `<li><b>قدم سطح ${lv.name}</b>${LEVEL_STEP[lv.key]}</li>`].join('');
    const weeks = roadmap(r).map((w, n) => `<li class="cx-wk"><span class="cx-wk-n"><small>هفته</small>${FA(n + 1)}</span><div><b>${w.t}</b><ul>${w.items.map(x => `<li>${x}</li>`).join('')}</ul></div></li>`).join('');
    const iso = t => t.replace(/[A-Za-z][A-Za-z0-9.]*(?: [A-Za-z0-9.]+)*/g, m => `<bdi dir="ltr">${m}</bdi>`);
    const tools = TOOLS[lv.key].map(t => `<li><span>${t[0]}</span><b dir="rtl">${iso(t[1])}</b></li>`).join('');
    const chs = chapters(r).map(x => `<li>${I.tick}${x}</li>`).join('');
    swap(`<div class="result cx-result">
      <div class="kicker" style="justify-content:center">نتیجه‌ی ${first} <span class="latin">Your Level</span></div>
      <div class="cx-hero">
        <div class="cx-gauge"><div class="ring-wrap">${ring(r.score / MAX, FA(r.percent) + '٪', 'SCORE')}</div></div>
        <div class="cx-lv">
          <span class="cx-lvnum latin">Level ${lv.num}</span>
          <h2 class="lv-name" data-focus tabindex="-1">${lv.name}</h2>
          <div class="latin lv-latin">${lv.latin}</div>
          <p class="lv-score">امتیاز ${FA(r.score)} از ${FA(MAX)} · پاسخ کامل در ${FA(r.correct)} سؤال از ${FA(SCORED.length)}</p>
          <div class="ladder" aria-label="سطح‌ها">${ladder}</div>
        </div>
      </div>
      <p class="lv-desc">${lv.desc}</p>
      <section class="cx-panel glass" aria-labelledby="sk-h"><h3 id="sk-h">${I.radar} تحلیل ${FA(Object.keys(SK).length)} مهارت</h3><ul class="cx-sks">${cards}</ul></section>
      <div class="cx-two">
        <section class="cx-panel glass cx-str"><h3>${I.up} نقاط قوت تو</h3><ul class="cx-list">${strengths}</ul></section>
        <section class="cx-panel glass cx-next"><h3>${I.flag} مهم‌ترین قدم‌ها</h3><ol class="cx-list">${steps}</ol></section>
      </div>
      <section class="cx-panel glass" aria-labelledby="rm-h"><h3 id="rm-h">${I.cal} برنامه‌ی ۴ هفته‌ای تو</h3>
        <p class="cx-sub">بر اساس سطح ${lv.name}، هدف و مانع اصلی‌ات · ریتم پیشنهادی: ${TIME[r.time ?? 1]}</p>
        <ol class="cx-weeks">${weeks}</ol></section>
      <section class="cx-panel glass" aria-labelledby="tl-h"><h3 id="tl-h">${I.tools} ابزارهای مناسب سطح تو</h3>
        <ul class="cx-tools">${tools}</ul>
        <p class="cx-sub small">دسترسی و قیمت ابزارها مدام تغییر می‌کنه؛ قبل از خرید اشتراک، نسخه‌ی رایگان هر ابزار رو با یک پروژه‌ی واقعی امتحان کن.</p></section>
      <div class="rec glass cx-rec">
        <div class="rec-badge latin">Recommended path · ${c.numeral || ''}</div>
        <div class="rec-emb"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#${r.course === 'editor-plus' ? 'emb-editor' : 'emb-assistant'}"/></svg></div>
        <div class="rec-tx"><small>دوره‌ی پیشنهادی برای تو</small><h3>${c.name || ''}</h3><p class="muted">${c.subtitle || ''}</p><p class="rec-why">${REASON[r.course]}</p><b class="rec-price">${c.price || ''}</b></div>
        <div class="cx-chs"><small>فصل‌هایی از این دوره که مستقیم روی نقاط رشد تو کار می‌کنن</small><ul>${chs}</ul></div>
        <div class="rec-btns"><a class="btn btn-primary" href="course.html?c=${r.course}">جزئیات دوره ${I.arrow}</a><a class="btn btn-glass" href="${TG}" target="_blank" rel="noopener">مشاوره در تلگرام</a></div>
        <a class="cx-alt" href="course.html?c=${altId}"><span>مسیر جایگزین</span><b>${alt.name || ''}</b><em>${alt.price || ''}</em>${I.arrow}</a>
      </div>
      <section class="cx-panel glass cx-share" aria-labelledby="sh-h">
        <div class="cx-share-tx"><h3 id="sh-h">${I.dl} کارت نتیجه برای استوری</h3><p class="cx-sub">یک کارت ۹:۱۶ با سطح و امتیازت، آماده‌ی استوری اینستاگرام.</p>
          <button type="button" class="btn btn-primary" id="dlcard" disabled><span>در حال ساخت کارت…</span> ${I.dl}</button></div>
        <div class="cx-share-pv"><img id="cardpv" alt="پیش‌نمایش کارت نتیجه برای استوری" width="216" height="384"></div>
      </section>
      <a class="cx-tg glass" href="${TG}" target="_blank" rel="noopener"><span class="ic">${I.tg}</span><span><b>نتیجه‌ات رو در تلگرام بفرست</b><span>برای مشاوره و انتخاب مسیر، سطحت رو بگو: <bdi>${lv.name}</bdi>، امتیاز ${FA(r.percent)}٪</span></span>${I.arrow}</a>
      <button type="button" class="q-back" id="again" style="margin:22px auto 0">${I.again} شروع دوباره</button>
    </div>`, 1, n => {
      const go = () => { n.querySelector('.arc').classList.add('go'); n.classList.add('play'); };
      reduce ? go() : requestAnimationFrame(() => setTimeout(go, 220));
      n.querySelector('#again').onclick = () => { ans.fill(null); intro(); };
      shareCard(r, n).catch(e => { console.warn('[hana] card', e); const b = n.querySelector('#dlcard'); if (b) b.closest('.cx-share').hidden = true; });
    });
  }

  /* ---- shareable story card (1080x1920, drawn locally, no network) ---- */
  async function shareCard(r, n) {
    try { await Promise.all(['900 80px Vazirmatn', '500 60px Vazirmatn', '400 100px Lalezar', '500 40px Cormorant'].map(f => d.fonts.load(f))); } catch (e) {}
    const W = 1080, H = 1920, cv = d.createElement('canvas'); cv.width = W; cv.height = H;
    const x = cv.getContext('2d'); if (!x) throw new Error('no canvas');
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#07080d'); g.addColorStop(1, '#0a0e1d'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const glow = (cx, cy, rad, col) => { const rg = x.createRadialGradient(cx, cy, 0, cx, cy, rad); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(0, 0, W, H); };
    glow(900, 260, 700, 'rgba(155,17,30,.55)'); glow(140, 1650, 760, 'rgba(47,107,255,.42)'); glow(540, 820, 420, 'rgba(215,38,61,.18)');
    const rr = (X, Y, w, h, rad) => { x.beginPath(); x.moveTo(X + rad, Y); x.arcTo(X + w, Y, X + w, Y + h, rad); x.arcTo(X + w, Y + h, X, Y + h, rad); x.arcTo(X, Y + h, X, Y, rad); x.arcTo(X, Y, X + w, Y, rad); x.closePath(); };
    rr(70, 250, W - 140, 1360, 64); x.fillStyle = 'rgba(255,255,255,.045)'; x.fill();
    const sg = x.createLinearGradient(70, 250, W - 70, 1610); sg.addColorStop(0, 'rgba(76,201,240,.7)'); sg.addColorStop(.5, 'rgba(255,255,255,.08)'); sg.addColorStop(1, 'rgba(215,38,61,.75)'); x.strokeStyle = sg; x.lineWidth = 3; x.stroke();
    const fa = (t, font, X, Y, col, align = 'center') => { x.direction = 'rtl'; x.textAlign = align; x.font = font; x.fillStyle = col; x.fillText(t, X, Y); };
    const la = (t, font, X, Y, col, align = 'center') => { x.direction = 'ltr'; x.textAlign = align; x.font = font; x.fillStyle = col; x.fillText(t, X, Y); };
    la('hana.aistudio', '500 64px Cormorant, Georgia, serif', W / 2, 170, '#ffffff');
    fa('چالش سطح هوش مصنوعی', '500 44px Vazirmatn, sans-serif', W / 2, 370, '#4CC9F0');
    // ring
    const cx0 = W / 2, cy0 = 690, R = 205;
    x.lineCap = 'round'; x.lineWidth = 26; x.strokeStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.arc(cx0, cy0, R, 0, Math.PI * 2); x.stroke();
    const rg2 = x.createLinearGradient(cx0 - R, cy0 - R, cx0 + R, cy0 + R); rg2.addColorStop(0, '#4CC9F0'); rg2.addColorStop(.5, '#2F6BFF'); rg2.addColorStop(1, '#D7263D');
    x.strokeStyle = rg2; x.shadowColor = 'rgba(76,201,240,.6)'; x.shadowBlur = 30; x.beginPath(); x.arc(cx0, cy0, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(.02, r.score / MAX)); x.stroke(); x.shadowBlur = 0;
    fa(FA(r.percent) + '٪', '900 150px Vazirmatn, sans-serif', cx0, cy0 + 50, '#ffffff');
    la('S C O R E', '500 34px Cormorant, Georgia, serif', cx0, cy0 + 110, 'rgba(236,239,248,.55)');
    // level
    la('LEVEL ' + r.lv.num + '  ·  ' + r.lv.latin.toUpperCase(), '500 38px Cormorant, Georgia, serif', W / 2, 1010, '#4CC9F0');
    const lg = x.createLinearGradient(0, 1040, 0, 1190); lg.addColorStop(0, '#ffffff'); lg.addColorStop(.55, '#ff5468'); lg.addColorStop(1, '#c0172d');
    fa(r.lv.name, '400 150px Lalezar, Vazirmatn, sans-serif', W / 2, 1170, lg);
    // top skills
    const top = Object.keys(SK).sort((a, b) => r.skills[b].pct - r.skills[a].pct).slice(0, 3);
    top.forEach((k, i) => {
      const y = 1270 + i * 92, s = r.skills[k].pct;
      fa(SK[k].name, '600 38px Vazirmatn, sans-serif', W - 150, y, '#eceff8', 'right');
      fa(FA(s) + '٪', '800 38px Vazirmatn, sans-serif', 150, y, '#ffffff', 'left');
      rr(150, y + 22, W - 300, 14, 7); x.fillStyle = 'rgba(255,255,255,.08)'; x.fill();
      const bw = Math.max(14, (W - 300) * s / 100), bg = x.createLinearGradient(W - 150, 0, W - 150 - bw, 0); bg.addColorStop(0, '#4CC9F0'); bg.addColorStop(.5, '#2F6BFF'); bg.addColorStop(1, '#D7263D');
      rr(W - 150 - bw, y + 22, bw, 14, 7); x.fillStyle = bg; x.fill();
    });
    fa('سطح خودت رو بسنج', '700 50px Vazirmatn, sans-serif', W / 2, 1740, '#ffffff');
    la('hanamousaviiiii.github.io/challenge.html', '500 36px Vazirmatn, sans-serif', W / 2, 1805, 'rgba(236,239,248,.6)');
    la('@hana.aistudio', '500 40px Cormorant, Georgia, serif', W / 2, 1868, '#ff8a96');
    const blob = await new Promise(res => cv.toBlob(res, 'image/jpeg', .92));
    if (!blob) throw new Error('no blob');
    const url = URL.createObjectURL(blob), file = new File([blob], 'hana-ai-level.jpg', { type: 'image/jpeg' });
    const pv = n.querySelector('#cardpv'); pv.src = url;
    const b = n.querySelector('#dlcard'); b.disabled = false; b.querySelector('span').textContent = 'ذخیره‌ی کارت استوری';
    b.onclick = async () => {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: 'سطح هوش مصنوعی من' }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      const a = d.createElement('a'); a.href = url; a.download = 'hana-ai-level.jpg'; d.body.appendChild(a); a.click(); a.remove();
    };
    window.__card = { w: cv.width, h: cv.height, size: blob.size };
  }

  /* ---- hidden admin export: challenge.html?export=1 ---- */
  function admin() {
    const S = window.HanaSubmit;
    const ch = S.read(S.LOCAL('challenge')), ct = S.read(S.LOCAL('contact')), pd = S.read(S.PENDING);
    const CH_COLS = ['timestamp', 'local_time', 'name', 'phone', 'social', 'consent', 'score', 'max_score', 'percent', 'level', 'level_num', 'recommended_course', 'recommended_course_price', 'correct_count', 'scored_questions', 'strengths', 'growth_areas', 'goal', 'main_obstacle', 'weekly_time',
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
  window.__quiz = { Q, LEVELS, SK, MAX, compute, ans, show, gate, order: () => ORDER, result: () => lastResult };
})();
