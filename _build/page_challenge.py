from common import *
def build():
    html = head('چالش: سطح هوش مصنوعی تو چیه؟ | hana.aistudio', 'یک ارزیابی سناریومحور ۱۷ سؤالی: سطح هوش مصنوعی‌ات رو بسنج، تحلیل ۹ مهارت، برنامه‌ی ۴ هفته‌ای شخصی و دوره‌ی مناسب خودت رو بگیر.')
    html += nav('', 'challenge.html')
    html += '''<main class="quiz-page cx-page">
 <div class="quiz-wrap cx-wrap">
  <div class="quiz-progress cx-progress" role="progressbar" aria-label="پیشرفت چالش" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
   <span id="qstep">آماده‌ای؟</span>
   <div class="cx-segs" id="qsegs" aria-hidden="true"></div>
   <div class="track" hidden><i id="qbar"></i></div>
  </div>
  <div class="quiz glass cx-card" id="quiz" aria-live="polite"><span class="cx-sheen" aria-hidden="true"></span><noscript><p style="padding:30px">برای شرکت در چالش، جاوااسکریپت مرورگر رو فعال کنید.</p></noscript></div>
 </div>
</main>'''
    html += scripts('', '<script src="assets/js/submit.js"></script><script src="assets/js/challenge-data.js"></script><script src="assets/js/challenge.js"></script>')
    return html
