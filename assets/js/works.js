/* student-works.html — chapter hub <-> chapter gallery (?ch=slug) */
(() => {
  const d = document, grid = d.querySelector('[data-grid]'); if (!grid) return;
  const views = [...d.querySelectorAll('[data-view]')], head = d.querySelector('.works-head');
  const base = d.title;
  function show(slug, push) {
    const v = views.find(x => x.dataset.view === slug);
    views.forEach(x => x.hidden = x !== v);
    grid.hidden = !!v;
    if (v) {
      const t = v.querySelector('h2').textContent; d.title = t + ' | نمونه‌کار هنرجوها';
      v.classList.remove('show'); void v.offsetWidth; v.classList.add('show');
      v.querySelectorAll('.m-tile').forEach((el, i) => el.style.setProperty('--i', i));
    } else d.title = base;
    if (push) history.pushState({ ch: slug || '' }, '', slug ? '?ch=' + slug : location.pathname);
    if (push) { const y = (v || grid).getBoundingClientRect().top + scrollY - 100; scrollTo({ top: Math.max(0, v ? y : 0), behavior: 'smooth' }); }
  }
  grid.addEventListener('click', e => { const a = e.target.closest('[data-ch]'); if (!a || e.metaKey || e.ctrlKey) return; e.preventDefault(); show(a.dataset.ch, true); });
  d.addEventListener('click', e => { const b = e.target.closest('[data-back]'); if (!b) return; e.preventDefault(); show('', true); });
  addEventListener('popstate', () => show(new URLSearchParams(location.search).get('ch') || '', false));
  const q = new URLSearchParams(location.search).get('ch');
  if (q && views.some(x => x.dataset.view === q)) { show(q, false); requestAnimationFrame(() => { const v = d.getElementById('ch-' + q); scrollTo(0, Math.max(0, v.getBoundingClientRect().top + scrollY - 100)); }); }
})();
