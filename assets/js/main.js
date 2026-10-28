/* hana.aistudio — shared interactions */
(() => {
  const d = document, root = d.documentElement;
  root.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* mobile menu */
  const mb = d.querySelector('.menu-btn');
  if (mb) mb.addEventListener('click', () => {
    const open = d.body.classList.toggle('menu-open');
    mb.setAttribute('aria-expanded', open);
  });
  d.querySelectorAll('.sheet a').forEach(a => a.addEventListener('click', () => d.body.classList.remove('menu-open')));

  /* split headings into words */
  d.querySelectorAll('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
            const s = d.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = p; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) {
          if (n.classList.contains('grad') || n.classList.contains('grad-b')) { n.classList.add('w'); n.style.setProperty('--i', i++); }
          else walk(n);
        }
      });
    };
    walk(el); el.classList.add('split');
  });

  /* scroll reveal */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  d.querySelectorAll('.rv,.split,[data-io]').forEach(el => io.observe(el));

  /* nav state on scroll + parallax */
  const nav = d.querySelector('.nav-pill');
  const par = [...d.querySelectorAll('[data-speed]')];
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (nav) nav.style.background = y > 40 ? 'linear-gradient(145deg,rgba(14,16,26,.72),rgba(14,16,26,.5))' : '';
    if (!reduce) par.forEach(el => {
      const r = el.getBoundingClientRect();
      const c = (r.top + r.height / 2 - innerHeight / 2);
      el.style.transform = `translate3d(0,${(-c * parseFloat(el.dataset.speed)).toFixed(1)}px,0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* pointer glow on glass */
  d.querySelectorAll('.feature,.glow').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* magnetic buttons */
  if (fine && !reduce) d.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * .22}px,${y * .3}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  /* generic tilt */
  if (fine && !reduce) d.querySelectorAll('[data-tilt]').forEach(el => {
    const max = parseFloat(el.dataset.tilt) || 6;
    el.style.transition = 'transform .6s cubic-bezier(.22,.8,.2,1)';
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  /* playing cards: tilt + holo + flip */
  d.querySelectorAll('.pcard').forEach(card => {
    const canFlip = !card.classList.contains('static');
    const flip = () => { if (!canFlip) return; card.classList.toggle('flipped'); card.setAttribute('aria-pressed', card.classList.contains('flipped')); };
    card.addEventListener('click', e => { if (e.target.closest('a')) return; flip(); });
    card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) { e.preventDefault(); flip(); } });
    if (reduce) return;
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.setProperty('--ry', ((px - .5) * 18).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((.5 - py) * 16).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
    });
  });

  /* testimonial slider */
  d.querySelectorAll('[data-slider]').forEach(s => {
    const items = [...s.querySelectorAll('.quote')], dots = s.querySelector('.q-dots');
    let i = 0, t;
    items.forEach((_, k) => { const b = d.createElement('button'); b.setAttribute('aria-label', 'نظر ' + (k + 1)); b.onclick = () => go(k); dots.appendChild(b); });
    const go = k => {
      i = (k + items.length) % items.length;
      items.forEach((q, n) => q.classList.toggle('on', n === i));
      [...dots.children].forEach((b, n) => b.classList.toggle('on', n === i));
      clearTimeout(t); if (!reduce) t = setTimeout(() => go(i + 1), 7000);
    };
    s.querySelector('[data-prev]').onclick = () => go(i - 1);
    s.querySelector('[data-next]').onclick = () => go(i + 1);
    go(0);
  });

  /* faq: only one open */
  d.querySelectorAll('.faq').forEach(f => f.addEventListener('toggle', e => {
    if (e.target.open) f.querySelectorAll('details[open]').forEach(x => x !== e.target && (x.open = false));
  }, true));

  d.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().toLocaleDateString('fa-IR', { year: 'numeric' }));
})();
