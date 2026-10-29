/* hana.aistudio — "AI evolution" scroll journey (homepage background layer).
   Canvas 2D, fixed behind all content. Scroll progress drives the stage:
   sparse dots -> connected network -> dense glowing network with data pulses -> luminous core. */
(() => {
  const d = document, host = d.querySelector('.ambient');
  if (!host || !d.querySelector('.hero')) return;
  const cv = d.createElement('canvas'); cv.className = 'evo'; cv.setAttribute('aria-hidden', 'true');
  host.appendChild(cv);
  const ctx = cv.getContext('2d'); if (!ctx) return;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mq.matches;
  const small = () => innerWidth <= 760;
  const beats = [...d.querySelectorAll('[data-evo-beat]')];
  // 0..1: how centred a showcase interlude is in the viewport (story beat -> brighter layer)
  function beat() {
    let b = 0; const vh = innerHeight;
    for (const el of beats) { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue;
      const c = (r.top + r.bottom) / 2, k = 1 - Math.abs(c - vh / 2) / (vh * .55 + r.height * .25); if (k > b) b = k; }
    b = Math.max(0, Math.min(1, b)); return b * b * (3 - 2 * b);
  }


  // deterministic RNG so the layout is stable between resizes
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let W = 0, H = 0, DPR = 1, N = 0, nodes = [], edges = [], cedges = [], sprites = {};

  function sprite(r, c0, c1) {
    const s = d.createElement('canvas'), z = Math.ceil(r * 2 * DPR); s.width = s.height = z;
    const g = s.getContext('2d'), gr = g.createRadialGradient(z / 2, z / 2, 0, z / 2, z / 2, z / 2);
    gr.addColorStop(0, c0); gr.addColorStop(.35, c1); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, z, z); return s;
  }

  function layout() {
    W = innerWidth; H = Math.max(innerHeight, d.documentElement.clientHeight);
    DPR = Math.min(window.devicePixelRatio || 1, small() ? 1.5 : 1.75);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed = 7; N = small() ? 46 : 92;
    const cx = W / 2, cy = H * .5, R = Math.min(W, H) * (small() ? .36 : .3), ga = Math.PI * (3 - Math.sqrt(5));
    nodes = [];
    for (let i = 0; i < N; i++) {
      // core target: fibonacci disc squashed slightly (brain-like), outer nodes on a shell
      const t = (i + .5) / N, rr = Math.sqrt(t) * R, a = i * ga;
      nodes.push({
        bx: rnd() * W, by: rnd() * H, ph: rnd() * Math.PI * 2, sp: .25 + rnd() * .5, amp: 8 + rnd() * 18,
        cx: cx + Math.cos(a) * rr * 1.12, cy: cy + Math.sin(a) * rr * .86,
        tier: rnd(), blue: rnd() < .55, x: 0, y: 0
      });
    }
    // neighbour edges (k nearest in the scattered layout), each with its own reveal threshold
    edges = []; const seen = new Set();
    nodes.forEach((n, i) => {
      const ds = nodes.map((m, j) => [j, (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2]).filter(e => e[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 5);
      ds.forEach(([j], k) => { const key = i < j ? i + '-' + j : j + '-' + i; if (seen.has(key)) return; seen.add(key); edges.push({ a: i, b: j, k, th: rnd(), pz: rnd() }); });
    });
    // second edge set: nearest neighbours in the core layout -> a tidy luminous mesh at the end
    cedges = []; const cseen = new Set();
    nodes.forEach((n, i) => {
      nodes.map((m, j) => [j, (m.cx - n.cx) ** 2 + (m.cy - n.cy) ** 2]).filter(e => e[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 4)
        .forEach(([j]) => { const key = i < j ? i + '-' + j : j + '-' + i; if (cseen.has(key)) return; cseen.add(key); cedges.push({ a: i, b: j, pz: rnd() }); });
    });
    sprites = {
      b: sprite(10, 'rgba(160,230,255,.95)', 'rgba(76,201,240,.35)'),
      r: sprite(10, 'rgba(255,150,160,.95)', 'rgba(215,38,61,.35)'),
      core: sprite(Math.min(W, H) * .42, 'rgba(255,235,238,.75)', 'rgba(215,38,61,.32)'),
      halo: sprite(Math.min(W, H) * .62, 'rgba(76,201,240,.18)', 'rgba(47,107,255,.10)')
    };
  }

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ss = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  function progress() {
    const max = Math.max(1, d.documentElement.scrollHeight - innerHeight);
    return clamp(scrollY / max);
  }

  function draw(time) {
    const p = progress(), tt = reduce ? 0 : time / 1000, bt = beat();
    const baseOp = small() ? .5 : .62;
    cv.style.opacity = (baseOp + (1 - baseOp) * bt).toFixed(3);
    ctx.clearRect(0, 0, W, H);
    // stage weights
    const vis = (.45 + .55 * ss(.0, .12, p)) * (1 - .3 * ss(.93, 1, p)) * (1 + .7 * bt); // softer under hero/footer, brighter at story beats
    const link = ss(.12, .34, p);                        // dots start connecting (courses area)
    const dense = ss(.36, .62, p);                       // denser, glowing, pulses
    const conv = ss(.7, .97, p);                         // converge into the core (the future)
    const shown = .3 + .7 * ss(.0, .5, p);               // share of nodes visible
    const drift = 1 - conv * .85;
    ctx.globalCompositeOperation = 'lighter';
    // core glow behind everything near the end
    if (conv > 0) {
      const cs = sprites.core, hs = sprites.halo, cx = W / 2, cy = H * .5;
      const pulse = reduce ? 1 : 1 + Math.sin(tt * 1.6) * .04;
      ctx.globalAlpha = conv * .9; const hz = hs.width / DPR * (1 + conv * .2); ctx.drawImage(hs, cx - hz / 2, cy - hz / 2, hz, hz);
      ctx.globalAlpha = conv; const cz = cs.width / DPR * (.55 + conv * .45) * pulse; ctx.drawImage(cs, cx - cz / 2, cy - cz / 2, cz, cz);
    }
    // positions
    for (const n of nodes) {
      const ox = Math.sin(tt * n.sp + n.ph) * n.amp * drift, oy = Math.cos(tt * n.sp * .8 + n.ph) * n.amp * drift;
      // parallax: the scattered field slides gently with scroll
      const par = (p * H * .35 * (n.tier - .5));
      n.x = (n.bx + ox) * (1 - conv) + n.cx * conv; n.y = (n.by + oy + par) * (1 - conv) + n.cy * conv;
      n.on = n.tier < shown;
    }
    // edges
    if (link > 0) {
      ctx.lineWidth = 1;
      for (const e of edges) {
        const A = nodes[e.a], B = nodes[e.b]; if (!A.on || !B.on) continue;
        const need = e.k < 2 ? link : e.k < 4 ? dense : Math.max(dense * .6, conv);
        const a = clamp((need - e.th * .7) * 1.6) * (1 - conv); if (a <= 0.01) continue;
        ctx.globalAlpha = a * (.15 + dense * .1 + conv * .1) * vis;
        const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
        g.addColorStop(0, A.blue ? '#4CC9F0' : '#D7263D'); g.addColorStop(1, B.blue ? '#2F6BFF' : '#ff5a6e');
        ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        // data pulses travelling along links
        if (dense > .05 && e.pz < .45 + conv * .3) {
          const u = reduce ? (e.pz * 7 + p * 9) % 1 : (tt * (.18 + e.pz * .3) + e.pz * 5) % 1;
          const px = A.x + (B.x - A.x) * u, py = A.y + (B.y - A.y) * u, s = sprites[e.pz < .22 ? 'r' : 'b'], z = 6 + dense * 4;
          ctx.globalAlpha = a * dense * .75 * vis; ctx.drawImage(s, px - z / 2, py - z / 2, z, z);
        }
      }
    }
    // core mesh (the future): neighbours in the final layout, brightening as everything converges
    if (conv > .02) {
      ctx.lineWidth = 1;
      for (const e of cedges) {
        const A = nodes[e.a], B = nodes[e.b];
        ctx.globalAlpha = conv * .32 * vis; ctx.strokeStyle = e.pz < .5 ? '#4CC9F0' : '#ff5a6e';
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        if (e.pz < .35) {
          const u = reduce ? (e.pz * 11 + p * 7) % 1 : (tt * (.3 + e.pz) + e.pz * 9) % 1, z = 7;
          ctx.globalAlpha = conv * .8 * vis; const sp = sprites[e.pz < .17 ? 'r' : 'b'];
          ctx.drawImage(sp, A.x + (B.x - A.x) * u - z / 2, A.y + (B.y - A.y) * u - z / 2, z, z);
        }
      }
      // orbit rings around the core
      const cx = W / 2, cy = H * .5, R0 = Math.min(W, H) * (small() ? .36 : .3);
      ctx.globalAlpha = conv * .35 * vis; ctx.strokeStyle = '#4CC9F0';
      ctx.beginPath(); ctx.ellipse(cx, cy, R0 * 1.32, R0 * .42, -.35 + tt * .05, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#D7263D'; ctx.beginPath(); ctx.ellipse(cx, cy, R0 * 1.22, R0 * .5, .55 - tt * .04, 0, Math.PI * 2); ctx.stroke();
    }
    // the first point: a single seed of light, strongest at the opening story beat
    const seedA = bt * (1 - link);
    if (seedA > .02) {
      const sx = W / 2, sy = H / 2 - (small() ? 130 : 150), pz = reduce ? 1 : 1 + Math.sin(tt * 2.2) * .12;
      ctx.globalAlpha = seedA * .9; let z = 90 * pz; ctx.drawImage(sprites.b, sx - z / 2, sy - z / 2, z, z);
      ctx.globalAlpha = seedA; z = 26; ctx.drawImage(sprites.r, sx - z / 2, sy - z / 2, z, z);
      ctx.globalAlpha = seedA * .5; ctx.strokeStyle = '#4CC9F0'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(sx, sy, 30 + (reduce ? 0 : (tt * 16) % 30), 0, Math.PI * 2); ctx.stroke();
    }
    // nodes
    for (const n of nodes) {
      if (!n.on) continue;
      const s = sprites[n.blue ? 'b' : 'r'];
      const z = (small() ? 7 : 8) + link * 3 + dense * 5 + conv * 3;
      const tw = reduce ? 1 : .8 + .2 * Math.sin(tt * 2 + n.ph);
      ctx.globalAlpha = clamp((.32 + link * .2 + dense * .25 + conv * .2 + bt * .2) * tw * vis);
      ctx.drawImage(s, n.x - z / 2, n.y - z / 2, z, z);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  // loop: animate only when visible; reduced motion => redraw on scroll only
  let raf = 0, lastW = 0, lastH = 0, last = 0;
  const minGap = small() ? 33 : 16;                     // ~30fps on phones
  const loop = t => { raf = requestAnimationFrame(loop); if (t - last < minGap) return; last = t; draw(t); };
  const start = () => { if (!raf && !reduce && !d.hidden) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  let pend = false;
  const onScroll = () => { if (raf || pend) return; pend = true; requestAnimationFrame(() => { pend = false; draw(performance.now()); }); };
  function resize() {
    const w = innerWidth, h = innerHeight;
    // ignore small height changes from mobile URL bars
    if (w === lastW && Math.abs(h - lastH) < 140) return;
    lastW = w; lastH = h; layout(); draw(performance.now());
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('scroll', onScroll, { passive: true });
  d.addEventListener('visibilitychange', () => d.hidden ? stop() : (start(), draw(performance.now())));
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(() => { reduce = mq.matches; reduce ? (stop(), draw(0)) : start(); });
  // safety net for browsers that throttle rAF (in-app browsers, low power)
  setInterval(() => { if (!d.hidden && performance.now() - last > 400) { last = performance.now(); draw(last); } }, 300);
  start();
  window.__evo = { draw, progress };
})();
