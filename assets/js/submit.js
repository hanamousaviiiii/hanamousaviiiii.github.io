/* hana.aistudio — submission helper (Google Apps Script web app or local test mode) */
window.HanaSubmit = (() => {
  const cfg = window.HANA_CONFIG || {};
  const endpoint = (cfg.CHALLENGE_ENDPOINT || '').trim();
  const LOCAL = t => 'hana_local_' + t, PENDING = 'hana_pending';
  const read = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  async function post(payload) {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 12000);
    try {
      // text/plain avoids a CORS preflight, which Apps Script cannot answer
      const r = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctl.signal, redirect: 'follow' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.ok !== true) throw new Error(j.error || ('HTTP ' + r.status));
      return true;
    } finally { clearTimeout(to); }
  }

  async function send(type, data) {
    const payload = Object.assign({ type }, data);
    if (!endpoint) {               // test mode: nothing leaves the browser
      const all = read(LOCAL(type)); all.push(payload); write(LOCAL(type), all);
      console.info('[hana] CHALLENGE_ENDPOINT is empty — saved to localStorage only (' + LOCAL(type) + ').');
      return { mode: 'local' };
    }
    try { await post(payload); return { mode: 'remote' }; }
    catch (e) {                    // network / filter issue: keep and retry on next visit
      console.warn('[hana] send failed, queued for retry:', e && e.message);
      const q = read(PENDING); q.push(payload); write(PENDING, q);
      return { mode: 'queued' };
    }
  }

  async function flush() {
    if (!endpoint) return;
    const q = read(PENDING); if (!q.length) return;
    const left = [];
    for (const p of q) { try { await post(p); } catch (e) { left.push(p); } }
    write(PENDING, left);
  }
  setTimeout(flush, 1500);

  function toCSV(rows, cols) {
    const esc = v => { v = v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v)); return '"' + v.replace(/"/g, '""') + '"'; };
    return '\ufeff' + [cols.map(esc).join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\r\n');
  }
  function download(name, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  return { send, flush, read, write, LOCAL, PENDING, toCSV, download, endpoint };
})();

/* shared validators */
window.HanaValid = {
  digits: s => String(s || '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)),
  phone(s) { // Iranian mobile → 09XXXXXXXXX or null
    const m = this.digits(s).replace(/[\s\-()]/g, '').match(/^(?:\+98|0098|98|0)?(9\d{9})$/);
    return m ? '0' + m[1] : null;
  },
  email: s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim()),
  handle: s => /^@?[A-Za-z0-9_.]{3,32}$/.test(String(s || '').trim())
};
