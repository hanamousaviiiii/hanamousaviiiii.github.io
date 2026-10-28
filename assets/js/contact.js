(() => {
  const f = document.getElementById('contactForm'); if (!f) return;
  const V = window.HanaValid;
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (f.website.value) return; // bot
    let ok = true;
    const need = (name, test) => { const fld = f[name].closest('.field'); const good = test(f[name].value.trim()); fld.classList.toggle('err', !good); if (!good) ok = false; };
    need('brand', v => v.length > 1); need('name', v => v.length > 1); need('message', v => v.length > 4);
    need('contact', v => V.email(v) || !!V.phone(v));
    if (!ok) { f.querySelector('.err .input').focus(); return; }
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.style.opacity = .6;
    const c = f.contact.value.trim();
    await HanaSubmit.send('contact', {
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      timestamp: new Date().toISOString(),
      local_time: new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }),
      brand: f.brand.value.trim(), name: f.name.value.trim(),
      contact: V.phone(c) || c, collab_type: f.type.value, budget: f.budget.value.trim(), message: f.message.value.trim(),
      page: location.pathname, user_agent: navigator.userAgent
    });
    f.querySelectorAll('.field,.row2,button[type=submit]').forEach(x => x.hidden = true);
    document.getElementById('cf-done').hidden = false;
  });
})();
