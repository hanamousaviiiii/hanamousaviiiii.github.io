import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import page_index, page_course, page_misc, page_challenge, page_faq, page_works
OUT = os.path.join(os.path.dirname(__file__), '..')
def w(p, s):
    open(os.path.join(OUT, p), 'w', encoding='utf-8').write(s); print('wrote', p)
w('index.html', page_index.build())
w('course.html', page_course.build())
w('challenge.html', page_challenge.build())
w('blog.html', page_misc.blog())
w('links.html', page_misc.links())
w('contact.html', page_misc.contact())
for i, a in enumerate(page_misc.ARTS):
    w(f'articles/{a[0]}.html', page_misc.article(i))
w('ai-faq.html', page_faq.hub())
for i, f in enumerate(page_faq.FAQ):
    w(f'faq/{f[0]}.html', page_faq.article(i))
w('student-works.html', page_works.build())
