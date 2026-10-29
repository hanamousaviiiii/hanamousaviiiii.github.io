/**
 * hana.aistudio — Google Apps Script web app
 * Receives challenge (quiz) results and brand-collaboration requests from the
 * static website and appends them as rows to this Google Sheet.
 *
 * + Telegram: every new submission is also sent to Hana's Telegram via a bot.
 *   Script Properties: TELEGRAM_BOT_TOKEN (from @BotFather), TELEGRAM_CHAT_ID
 *   (send /start to your bot, then run getTelegramChatId() once from the editor).
 *
 * Setup: see README.md («راه‌اندازی Google Sheet»). In short:
 *   1) Create a Google Sheet → Extensions → Apps Script → paste this file.
 *   2) Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *   3) Copy the /exec URL into assets/js/config.js → CHALLENGE_ENDPOINT.
 */

var SHEETS = {
  challenge: {
    name: 'Challenge',
    cols: ['timestamp', 'local_time', 'name', 'phone', 'social', 'consent', 'score', 'max_score', 'percent',
           'level', 'level_key', 'recommended_course', 'recommended_course_id',
           'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
           'tag_editor', 'tag_assistant', 'source', 'user_agent', 'id', 'answers_json'],
    headers: ['زمان (UTC)', 'زمان تهران', 'نام', 'موبایل', 'تلگرام/اینستاگرام', 'رضایت', 'امتیاز', 'حداکثر', 'درصد',
              'سطح', 'کد سطح', 'دوره‌ی پیشنهادی', 'کد دوره',
              'س۱ ابزارها', 'س۲ جواب ضعیف', 'س۳ پرامپت بهتر', 'س۴ تصویر', 'س۵ ویدیو', 'س۶ اپ ادیت', 'س۷ نسبت تصویر', 'س۸ هدف', 'س۹ چالش', 'س۱۰ زمان هفتگی',
              'امتیاز ادیت', 'امتیاز دستیار', 'منبع ورود', 'مرورگر', 'شناسه', 'پاسخ‌ها (JSON)']
  },
  contact: {
    name: 'Collaborations',
    cols: ['timestamp', 'local_time', 'brand', 'name', 'contact', 'collab_type', 'budget', 'message', 'page', 'user_agent', 'id'],
    headers: ['زمان (UTC)', 'زمان تهران', 'برند', 'نام', 'راه تماس', 'نوع همکاری', 'بودجه', 'توضیحات', 'صفحه', 'مرورگر', 'شناسه']
  }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var def = SHEETS[data.type];
    if (!def) return json_({ ok: false, error: 'unknown type' });

    // basic validation
    if (data.type === 'challenge') {
      if (!data.name || !/^09\d{9}$/.test(String(data.phone || ''))) return json_({ ok: false, error: 'invalid contact' });
      if (data.consent !== 'yes') return json_({ ok: false, error: 'no consent' });
    }

    var sheet = getSheet_(def);
    var row = def.cols.map(function (c) {
      var v = data[c];
      if (v === undefined || v === null) return '';
      v = typeof v === 'object' ? JSON.stringify(v) : String(v);
      if (/^[=+\-@]/.test(v) && c !== 'phone' && c !== 'social') v = "'" + v; // avoid formula injection
      return v.slice(0, 5000);
    });
    // keep phone as text (leading zero)
    var pi = def.cols.indexOf('phone');
    if (pi > -1 && row[pi]) row[pi] = "'" + row[pi];
    var si = def.cols.indexOf('social');
    if (si > -1 && row[si]) row[si] = "'" + row[si];

    sheet.appendRow(row);
    try { notifyTelegram_(data); } catch (tgErr) { console.warn('telegram: ' + tgErr); }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return json_({ ok: true, service: 'hana.aistudio challenge endpoint' });
}

function getSheet_(def) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(def.name) || ss.insertSheet(def.name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(def.headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, def.headers.length).setFontWeight('bold').setBackground('#9B111E').setFontColor('#ffffff');
    sh.setRightToLeft(true);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to test that writing works. */
function testInsert() {
  doPost({ postData: { contents: JSON.stringify({ type: 'challenge', timestamp: new Date().toISOString(), name: 'تست', phone: '09120000000', consent: 'yes', score: 10, max_score: 21, level: 'سازنده' }) } });
}

/* ---------------- Telegram notifications ---------------- */
function tgProps_() {
  var p = PropertiesService.getScriptProperties();
  return { token: p.getProperty('TELEGRAM_BOT_TOKEN'), chat: p.getProperty('TELEGRAM_CHAT_ID') };
}

function tgEsc_(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function notifyTelegram_(d) {
  var t = tgProps_();
  if (!t.token || !t.chat) return; // not configured yet
  var lines;
  if (d.type === 'challenge') {
    lines = [
      '<b>شرکت‌کننده‌ی جدید چالش</b>',
      'نام: ' + tgEsc_(d.name),
      'موبایل: <code>' + tgEsc_(d.phone) + '</code>',
      d.social ? 'تلگرام/اینستاگرام: ' + tgEsc_(d.social) : null,
      'امتیاز: ' + tgEsc_(d.score) + ' از ' + tgEsc_(d.max_score) + ' (' + tgEsc_(d.percent) + '٪)',
      'سطح: ' + tgEsc_(d.level),
      'دوره‌ی پیشنهادی: ' + tgEsc_(d.recommended_course),
      'زمان: ' + tgEsc_(d.local_time)
    ];
  } else {
    lines = [
      '<b>درخواست همکاری جدید</b>',
      'برند: ' + tgEsc_(d.brand),
      'نام: ' + tgEsc_(d.name),
      'راه تماس: ' + tgEsc_(d.contact),
      'نوع همکاری: ' + tgEsc_(d.collab_type),
      d.budget ? 'بودجه: ' + tgEsc_(d.budget) : null,
      d.message ? 'توضیحات: ' + tgEsc_(String(d.message).slice(0, 1500)) : null
    ];
  }
  UrlFetchApp.fetch('https://api.telegram.org/bot' + t.token + '/sendMessage', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify({ chat_id: t.chat, text: lines.filter(Boolean).join('\n'), parse_mode: 'HTML', disable_web_page_preview: true })
  });
}

/** Run once after sending /start to your bot: saves your chat id automatically. */
function getTelegramChatId() {
  var t = tgProps_();
  if (!t.token) throw new Error('First set TELEGRAM_BOT_TOKEN in Project Settings > Script Properties');
  var r = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + t.token + '/getUpdates').getContentText());
  var ups = (r.result || []).filter(function (u) { return u.message && u.message.chat; });
  if (!ups.length) throw new Error('No messages found. Send /start to your bot in Telegram, then run this again.');
  var id = String(ups[ups.length - 1].message.chat.id);
  PropertiesService.getScriptProperties().setProperty('TELEGRAM_CHAT_ID', id);
  Logger.log('TELEGRAM_CHAT_ID saved: ' + id);
  return id;
}

/** Sends a sample message to check the Telegram setup. */
function testTelegram() {
  notifyTelegram_({ type: 'challenge', name: 'تست', phone: '09120000000', score: 15, max_score: 21, percent: 71, level: 'سازنده', recommended_course: 'دستیار هوشمند', local_time: new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' }) });
}
