/* hana.aistudio — the traveling AI companion (landing page only) */
(() => {
  const hero = document.querySelector('.hero'); if (!hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d = document;
  const pal = d.createElement('div');
  pal.className = 'ai-pal'; pal.setAttribute('aria-hidden', 'true');
  pal.innerHTML = `<div class="glow"></div>
  <svg viewBox="0 0 100 100">
   <defs>
    <radialGradient id="palCore" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#ff7d8b"/><stop offset=".35" stop-color="#D7263D"/><stop offset=".75" stop-color="#4a0712"/><stop offset="1" stop-color="#12060c"/></radialGradient>
    <radialGradient id="palGlass" cx=".35" cy=".28" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".4" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="palRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4CC9F0"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#D7263D"/></linearGradient>
   </defs>
   <g class="orbit o1"><g transform="rotate(-22 50 50)"><ellipse cx="50" cy="50" rx="46" ry="13" fill="none" stroke="#4CC9F0" stroke-width=".9" opacity=".75"/><circle cx="96" cy="50" r="2.6" fill="#9fe6ff"/></g></g>
   <g class="orbit o2"><g transform="rotate(58 50 50)"><ellipse cx="50" cy="50" rx="41" ry="11" fill="none" stroke="#ff4d63" stroke-width=".8" opacity=".6"/><circle cx="9" cy="50" r="2.2" fill="#ff6a7c"/></g></g>
   <circle cx="50" cy="50" r="29" fill="url(#palCore)"/>
   <circle cx="50" cy="50" r="29" fill="none" stroke="url(#palRim)" stroke-width="1.4"/>
   <circle cx="50" cy="50" r="24" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".6" stroke-dasharray="1 3"/>
   <g class="eye"><circle cx="50" cy="50" r="11.5" fill="#06070d" stroke="#4CC9F0" stroke-width="1.3"/><circle class="pupil" cx="50" cy="50" r="5" fill="#4CC9F0"/><circle cx="52.2" cy="47.6" r="1.6" fill="#fff"/></g>
   <circle cx="50" cy="50" r="29" fill="url(#palGlass)"/>
  </svg><span class="tag"></span>`;
  // a clipping layer keeps the glow from ever widening the page (iOS Safari counts fixed overflow)
  const layer = d.createElement('div'); layer.className = 'pal-layer'; layer.setAttribute('aria-hidden', 'true'); d.body.appendChild(layer);
  layer.appendChild(pal);
  const svg = pal.querySelector('svg'), eye = pal.querySelector('.eye'), tag = pal.querySelector('.tag');

  const ids = [['why', 'WHY NOW'], ['challenge', 'LEVEL UP'], ['courses', 'THE DECK'], ['showcase', 'MADE WITH AI'], ['voices', 'VOICES'], ['about', 'HUMAN + AI'], ['ai-faq', 'ASK AI'], ['faq', 'ASK ME'], [null, 'THE FUTURE']];
  let W = innerWidth, H = innerHeight, pts = [], size = 88;

  function build() {
    W = innerWidth; H = innerHeight; size = W <= 640 ? 58 : 88;
    const max = Math.max(1, d.documentElement.scrollHeight - H);
    const gutter = Math.max(8, Math.min(60, (W - Math.min(W - 40, 1180)) / 2 - size * .35));
    const L = gutter, R = W - gutter - size;
    pts = [{ s: 0, x: L, y: H * .62, label: '' }];
    ids.forEach(([id, label], i) => {
      const el = id ? d.getElementById(id) : d.querySelector('.final') || d.querySelector('footer');
      if (!el) return;
      const top = el.getBoundingClientRect().top + scrollY;
      const s = Math.min(max, Math.max(0, top - H * .25));
      const right = i % 2 === 0;           // alternate sides: right, left, right…
      const y = H * (W <= 640 ? [.3, .7, .22, .6, .78, .35][i % 6] : [.3, .62, .24, .7, .4, .56][i % 6]);
      pts.push({ s, x: right ? R : L, y, label, right });
    });
    pts.sort((a, b) => a.s - b.s);
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function target(sy) {
    let i = 0; while (i < pts.length - 1 && pts[i + 1].s <= sy) i++;
    const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
    const span = Math.max(1, b.s - a.s), t = Math.min(1, Math.max(0, (sy - a.s) / span));
    // travel happens in the middle 55% of the gap; rests near each waypoint
    const k = ease(Math.min(1, Math.max(0, (t - .2) / .55)));
    const arc = Math.sin(k * Math.PI) * (W <= 640 ? H * .12 : H * .18);  // swoop while crossing
    return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) - arc, rest: k < .04 ? a : k > .96 ? b : null, k };
  }

  const trail = [];
  if (!reduce) for (let i = 0; i < 5; i++) { const t = d.createElement('i'); t.className = 'pal-trail' + (i % 2 ? ' c' : ''); layer.appendChild(t); trail.push({ el: t, x: 0, y: 0 }); }

  let x = -200, y = H * .6, vx = 0, vy = 0, rot = 0, first = true, last = 0;
  function frame() {
    last = Date.now();
    const sy = scrollY, show = sy > H * .3;
    pal.classList.toggle('on', show); d.body.classList.toggle('pal-on', show);
    const tg = target(sy);
    if (first || reduce) { x = tg.x; y = tg.y; first = false; }
    const nx = lerp(x, tg.x, .08), ny = lerp(y, tg.y, .08);
    vx = nx - x; vy = ny - y; x = nx; y = ny;
    rot = reduce ? 0 : lerp(rot, Math.max(-35, Math.min(35, vx * 1.6)), .12);
    const bob = reduce ? 0 : Math.sin(performance.now() / 900) * 4;
    const sc = reduce ? 1 : 1 + Math.min(.25, Math.hypot(vx, vy) * .012);
    pal.style.transform = `translate3d(${x.toFixed(1)}px,${(y + bob).toFixed(1)}px,0)`;
    svg.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    const px = Math.max(-4, Math.min(4, vx * .6)), py = Math.max(-4, Math.min(4, vy * .6));
    eye.style.transform = `translate(${px}px,${py}px)`;
    const r = tg.rest; pal.classList.toggle('talk', !!(r && r.label)); if (r && r.label) tag.textContent = r.label;
    pal.classList.toggle('r', !!(r ? r.right : tg.x > W / 2));
    let lx = x + size / 2, ly = y + bob + size / 2;
    trail.forEach((t, i) => { t.x = lerp(t.x || lx, lx, .35 - i * .05); t.y = lerp(t.y || ly, ly, .35 - i * .05); t.el.style.transform = `translate3d(${t.x.toFixed(1)}px,${t.y.toFixed(1)}px,0) scale(${(1 - i * .16).toFixed(2)})`; lx = t.x; ly = t.y; });
  }
  let raf;
  const loop = () => { frame(); raf = requestAnimationFrame(loop); };
  build(); addEventListener('resize', () => { build(); });
  addEventListener('load', build);
  setTimeout(build, 1500);
  if (reduce) pal.classList.add('calm');
  // also update straight from scroll events, so the orb keeps up even where rAF is throttled (low-power mode, in-app browsers)
  addEventListener('scroll', frame, { passive: true });
  // watchdog: if the browser stops delivering animation frames, keep the orb in sync with a timer
  setInterval(() => { if (!d.hidden && Date.now() - last > 180) frame(); }, 120);
  loop(); d.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!d.hidden) loop(); });
  window.__pal = { build, pts: () => pts };
})();
