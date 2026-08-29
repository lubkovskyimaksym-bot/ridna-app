#!/usr/bin/env node
/**
 * Локальний білдер блогу Ridna — без CI, запускається руками перед комітом.
 *
 *   node tools/blog.mjs new <slug>       створити чернетку статті (під noindex)
 *   node tools/blog.mjs publish <slug>   зняти noindex — стаття йде в індекс
 *   node tools/blog.mjs build            перегенерувати лістинг, RSS і sitemap
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(ROOT, 'blog');
const SITE = 'https://ridna.net';
const TEMPLATE = join(ROOT, 'tools', 'post-template.html');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const today = () => new Date().toISOString().slice(0, 10);
const human = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- читання статей ---------- */
function readPosts() {
  if (!existsSync(BLOG)) return [];
  const posts = [];
  for (const slug of readdirSync(BLOG)) {
    const file = join(BLOG, slug, 'index.html');
    if (!statSync(join(BLOG, slug)).isDirectory() || !existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');

    const ld = html.match(/<script type="application\/ld\+json">\s*(\{[\s\S]*?"@type":\s*"BlogPosting"[\s\S]*?\})\s*<\/script>/);
    if (!ld) { console.warn(`  ! ${slug}: не знайдено BlogPosting JSON-LD — пропускаю`); continue; }

    let meta;
    try { meta = JSON.parse(ld[1]); }
    catch (e) { console.warn(`  ! ${slug}: зламаний JSON-LD (${e.message}) — пропускаю`); continue; }

    const draft = /<meta[^>]+name="robots"[^>]+noindex/i.test(html);
    posts.push({
      slug, draft, file, html,
      title: meta.headline,
      description: meta.description || '',
      date: (meta.datePublished || '').slice(0, 10),
      updated: (meta.dateModified || meta.datePublished || '').slice(0, 10),
      image: meta.image || `${SITE}/og-image.png`,
    });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ---------- перевірка узгодженості мета-даних ---------- */
function check(posts) {
  let warnings = 0;
  const warn = (slug, msg) => { console.warn(`  ⚠ ${slug}: ${msg}`); warnings++; };
  for (const p of posts) {
    if (!p.title) warn(p.slug, 'порожній headline у JSON-LD');
    if (!p.date || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) warn(p.slug, `некоректна datePublished: "${p.date}"`);
    if (!p.description) warn(p.slug, 'порожній description');
    else if (p.description.length > 160) warn(p.slug, `description ${p.description.length} символів — Google обріже (ліміт ~160)`);

    const titleTag = p.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    if (p.title && !titleTag.includes(p.title)) warn(p.slug, '<title> розійшовся з headline у JSON-LD');

    const metaDesc = p.html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    if (metaDesc !== esc(p.description) && metaDesc !== p.description)
      warn(p.slug, 'meta description розійшовся з description у JSON-LD');

    const canonical = p.html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
    if (canonical !== `${SITE}/blog/${p.slug}/`) warn(p.slug, `canonical не збігається зі слагом: "${canonical}"`);

    if (/\{\{[A-Z_]+\}\}/.test(p.html)) warn(p.slug, 'у файлі лишились незаповнені плейсхолдери {{...}}');
    if (('blog-' + p.slug).length > 40)
      warn(p.slug, `мітка кампанії "blog-${p.slug}" довша за 40 символів — Apple її обріже`);
    if (!/<!-- RELATED:START -->/.test(p.html))
      warn(p.slug, 'немає маркерів RELATED — блок схожих статей не згенерується');
  }
  return warnings;
}

/* ---------- генерація ---------- */
function renderListing(posts) {
  if (!posts.length) return '    <li class="empty">Перші статті зʼявляться найближчим часом.</li>';
  return posts.map((p) => `    <li>
      <a class="post-card" href="/blog/${p.slug}/">
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.description)}</p>
        <span class="post-meta"><time datetime="${p.date}">${human(p.date)}</time></span>
      </a>
    </li>`).join('\n');
}

function renderRelated(post, all) {
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 8);
  if (!others.length) return '';
  const cards = others.map((p) => `          <a class="rel" href="/blog/${p.slug}/">
            <span class="rel-t">${esc(p.title)}</span>
            <span class="rel-d">${human(p.date)}</span>
          </a>`).join('\n');
  const arrow = (dir, d) => `<button class="rel-nav ${dir}" type="button" aria-label="${dir === 'prev' ? 'Попередні' : 'Наступні'}" hidden><svg viewBox="0 0 24 24"><path d="${d}"/></svg></button>`;
  return `      <section class="related">
        <h3>Схожі статті</h3>
        <div class="rel-wrap">
          ${arrow('prev', 'M15 5l-7 7 7 7')}
          <div class="rel-carousel">
${cards}
          </div>
          ${arrow('next', 'M9 5l7 7-7 7')}
        </div>
      </section>`;
}

function writeRelated(posts) {
  for (const p of posts) {
    const block = renderRelated(p, posts);
    const out = p.html.replace(
      /(<!-- RELATED:START -->)[\s\S]*?(<!-- RELATED:END -->)/,
      block ? `$1\n${block}\n$2` : '$1\n$2'
    );
    if (out !== p.html) { writeFileSync(p.file, out); p.html = out; }
  }
}

function writeListing(posts) {
  const file = join(BLOG, 'index.html');
  const html = readFileSync(file, 'utf8');
  const out = html.replace(
    /(<!-- POSTS:START -->)[\s\S]*?(<!-- POSTS:END -->)/,
    `$1\n${renderListing(posts)}\n$2`
  );
  writeFileSync(file, out);
}

function writeFeed(posts) {
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}/</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date + 'T09:00:00Z').toUTCString()}</pubDate>
    </item>`).join('\n');

  writeFileSync(join(BLOG, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Блог Ridna</title>
    <link>${SITE}/blog/</link>
    <description>Практичні розбори для власників Instagram-магазинів: замовлення, Direct, доставка, оплати.</description>
    <language>uk</language>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`);
}

function writeSitemap(posts) {
  const file = join(ROOT, 'sitemap.xml');
  const existing = existsSync(file) ? readFileSync(file, 'utf8') : '';
  // зберігаємо всі не-блогові URL як є, блогові перегенеровуємо
  const kept = [...existing.matchAll(/<url>[\s\S]*?<\/url>/g)]
    .map((m) => m[0])
    .filter((block) => !/\/blog\//.test(block));

  const blogUrls = [
    `  <url>\n    <loc>${SITE}/blog/</loc>\n    <lastmod>${posts[0]?.updated || today()}</lastmod>\n  </url>`,
    ...posts.map((p) => `  <url>\n    <loc>${SITE}/blog/${p.slug}/</loc>\n    <lastmod>${p.updated || p.date}</lastmod>\n  </url>`),
  ];

  writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...kept.map((b) => b.split('\n').map((l) => (l.startsWith(' ') ? l : '  ' + l)).join('\n')), ...blogUrls].join('\n')}
</urlset>
`);
}

/* ---------- команди ---------- */
function cmdNew(slug) {
  if (!slug) throw new Error('вкажи слаг: node tools/blog.mjs new yak-vesty-oblik-zamovlen');
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('слаг — тільки малі латинські літери, цифри й дефіси');
  const dir = join(BLOG, slug);
  if (existsSync(dir)) throw new Error(`стаття /blog/${slug}/ вже існує`);

  const d = today();
  const html = readFileSync(TEMPLATE, 'utf8')
    .replaceAll('{{SLUG}}', slug)
    .replaceAll('{{DATE_HUMAN}}', human(d))
    .replaceAll('{{DATE}}', d)
    .replaceAll('{{UPDATED}}', d)
    .replaceAll('{{IMAGE}}', '/og-image.png')
    .replaceAll('{{TITLE}}', 'ЗАГОЛОВОК СТАТТІ')
    .replaceAll('{{DESCRIPTION}}', 'Опис статті для пошуку й соцмереж — до 160 символів.');

  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`✓ чернетку створено: blog/${slug}/index.html`);
  console.log('  Заповни заголовок, опис і текст — і в <head>, і в JSON-LD.');
  console.log(`  Далі: node tools/blog.mjs publish ${slug}`);
}

function cmdPublish(slug) {
  const file = join(BLOG, slug || '', 'index.html');
  if (!slug || !existsSync(file)) throw new Error(`не знайдено blog/${slug}/index.html`);
  const html = readFileSync(file, 'utf8');
  if (!/name="robots"[^>]+noindex/i.test(html)) { console.log(`· blog/${slug}/ вже опубліковано`); return; }
  writeFileSync(file, html.replace(/^[ \t]*<meta name="robots" content="noindex"[^\n]*\n/m, ''));
  console.log(`✓ noindex знято: /blog/${slug}/`);
  console.log('  Не забудь: node tools/blog.mjs build');
}

function cmdBuild() {
  const all = readPosts();
  const warnings = check(all);
  const live = all.filter((p) => !p.draft);
  writeRelated(live);
  writeListing(live);
  writeFeed(live);
  writeSitemap(live);
  const drafts = all.length - live.length;
  console.log(`✓ зібрано: ${live.length} опублікованих${drafts ? `, ${drafts} чернеток (не в індексі)` : ''}`);
  console.log('  оновлено: blog/index.html, blog/feed.xml, sitemap.xml');
  if (warnings) console.log(`  ⚠ попереджень: ${warnings}`);
}

const [cmd, arg] = process.argv.slice(2);
try {
  if (cmd === 'new') cmdNew(arg);
  else if (cmd === 'publish') cmdPublish(arg);
  else if (cmd === 'build') cmdBuild();
  else console.log('Команди:\n  node tools/blog.mjs new <slug>\n  node tools/blog.mjs publish <slug>\n  node tools/blog.mjs build');
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
