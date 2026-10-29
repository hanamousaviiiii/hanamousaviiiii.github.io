/* hana.aistudio — portfolio tabs + lightbox (images / click-to-play videos) */
(() => {
  const d = document;
  d.querySelectorAll('[data-media]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role=tab]')], ink = root.querySelector('.m-ink');
    const place = () => { const t = tabs.find(x => x.getAttribute('aria-selected') === 'true'); if (!t || !ink) return;
      const pr = t.parentElement.getBoundingClientRect(), r = t.getBoundingClientRect();
      ink.style.width = r.width + 'px'; ink.style.transform = `translateX(${(r.left - pr.left + t.parentElement.scrollLeft).toFixed(1)}px)`; };
    const sel = (t, focus) => {
      tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        const p = d.getElementById(x.getAttribute('aria-controls')); if (p) { p.hidden = !on; if (on) { p.classList.remove('show'); void p.offsetWidth; p.classList.add('show'); } } });
      if (focus) t.focus(); place();
      t.scrollIntoView && t.parentElement.scrollWidth > t.parentElement.clientWidth && t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', e => {
        // RTL: ArrowLeft moves to the next tab
        const k = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0; if (!k) return;
        e.preventDefault(); sel(tabs[(i + k + tabs.length) % tabs.length], true);
      });
    });
    addEventListener('resize', place); addEventListener('load', place); setTimeout(place, 300); place();
  });

  // lightbox
  let lb, stage, lastFocus;
  function build() {
    lb = d.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'نمایش نمونه‌کار'); lb.hidden = true;
    lb.innerHTML = '<div class="lb-bg" data-close></div><div class="lb-box"><div class="lb-stage"></div><button type="button" class="lb-x glass" data-close aria-label="بستن"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>';
    d.body.appendChild(lb); stage = lb.querySelector('.lb-stage');
    lb.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    d.addEventListener('keydown', e => { if (!lb.hidden && e.key === 'Escape') close(); });
  }
  function open(btn) {
    if (!lb) build(); lastFocus = btn; stage.innerHTML = '';
    const src = btn.dataset.src;
    if (btn.dataset.lb === 'video') {
      const v = d.createElement('video'); v.controls = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata';
      if (btn.dataset.poster) v.poster = btn.dataset.poster; v.src = src; stage.appendChild(v);
      const p = v.play(); if (p && p.catch) p.catch(() => {});
    } else { const im = d.createElement('img'); im.src = src; im.alt = btn.getAttribute('aria-label') || ''; stage.appendChild(im); }
    lb.hidden = false; d.documentElement.classList.add('lb-open');
    requestAnimationFrame(() => lb.classList.add('on')); lb.querySelector('.lb-x').focus();
  }
  function close() {
    const v = stage.querySelector('video'); if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
    lb.classList.remove('on'); d.documentElement.classList.remove('lb-open');
    setTimeout(() => { lb.hidden = true; stage.innerHTML = ''; }, 250); lastFocus && lastFocus.focus();
  }
  d.addEventListener('click', e => { const b = e.target.closest('.m-tile[data-lb]'); if (b) { e.preventDefault(); open(b); } });
})();
