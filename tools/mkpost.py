"""Генератор статті блогу поверх tools/post-template.html.

Викликається зі скрипта, який описує одну статтю:

    from mkpost import make
    make(slug, title, desc, summary, body, faq, native, alt)

Створює чернетку (`node tools/blog.mjs new <slug>`) і заповнює слоти шаблону:
обкладинку, блок «Коротко», текст, «Часті питання» + FAQPage JSON-LD,
нативний блок і og:image. Після цього лишається покласти cover.webp і og.jpg
у теку статті та запустити `node tools/blog.mjs build`.
"""
import re, json, subprocess


def make(slug, title, desc, summary, body, faq, native, alt):
    subprocess.run(['node', 'tools/blog.mjs', 'new', slug], capture_output=True)
    f = f'blog/{slug}/index.html'
    s = open(f, encoding='utf-8').read()
    s = s.replace('ЗАГОЛОВОК СТАТТІ', title).replace('Опис статті для пошуку й соцмереж — до 160 символів.', desc)
    cover = f'<img class="cover" src="/blog/{slug}/cover.webp" alt="{alt}" width="1200" height="630" fetchpriority="high" />'
    summ = '<div class="summary">\n      <div class="summary-h">Коротко</div>\n' + ''.join(f'      <p>{p}</p>\n' for p in summary) + '    </div>'
    faqhtml = '<section class="faq">\n      <h2>Часті питання</h2>\n' + ''.join(f'      <p class="faq-q">{q}</p>\n      <p class="faq-a">{a}</p>\n' for q, a in faq) + '    </section>'
    full = '\n    ' + cover + '\n\n    ' + summ + '\n' + body + '\n    ' + faqhtml + '\n'
    a = s.index('<!-- ↓↓↓ ТЕКСТ СТАТТІ ↓↓↓ -->') + len('<!-- ↓↓↓ ТЕКСТ СТАТТІ ↓↓↓ -->')
    b = s.index('<!-- ↑↑↑ ТЕКСТ СТАТТІ ↑↑↑ -->')
    s = s[:a] + full + '        ' + s[b:]
    s = re.sub(r'\n?\s*<!-- КОРОТКО.*?-->\s*<div class="summary">.*?</div>', '', s, flags=re.S, count=1)
    ph = re.search(r'\n?\s*<!-- ЧАСТІ ПИТАННЯ.*?-->\s*<section class="faq">.*?</section>', s, re.S)
    if ph:
        s = s[:ph.start()] + s[ph.end():]
    ph = re.search(r'\n?\s*<!-- НАТИВНИЙ БЛОК.*?-->\s*<section class="native">.*?</section>', s, re.S)
    s = s[:ph.start()] + '\n\n        <section class="native">\n' + native + '\n        </section>' + s[ph.end():]
    ld = {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "uk-UA",
          "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a2}} for q, a2 in faq]}
    s = s.replace('  <!-- Umami', '  <script type="application/ld+json">\n  ' + json.dumps(ld, ensure_ascii=False, indent=2).replace('\n', '\n  ') + '\n  </script>\n\n  <!-- Umami', 1)
    s = s.replace('https://ridna.net/og-image.png', f'https://ridna.net/blog/{slug}/og.jpg')
    open(f, 'w', encoding='utf-8').write(s)
    print(f'  ✓ {slug}')
