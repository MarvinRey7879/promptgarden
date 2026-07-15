#!/usr/bin/env node
/**
 * Baut je Sprache einen RSS-2.0-Feed nach public/feed.<lang>.xml (+ /feed.xml = DE).
 * Quelle: content/feed.<lang>.json. Läuft im prebuild nach dem Suchindex.
 * Item-Links zeigen auf die Feed-Seite mit #<id>-Anker.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://promptgarten.com';
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

const CHANNEL = {
  de: { title: 'promptgarten — KI-News', desc: 'Verifizierte News zu KI-Coding-Tools, Modellen und Agenten. Einfach erklärt.' },
  en: { title: 'promptgarten — AI news', desc: 'Verified news on AI coding tools, models and agents. Explained simply.' },
  es: { title: 'promptgarten — noticias de IA', desc: 'Noticias verificadas sobre herramientas de programación con IA, modelos y agentes. Explicado de forma simple.' },
  fr: { title: 'promptgarten — actus IA', desc: 'Actus vérifiées sur les outils de codage IA, les modèles et les agents. Expliqué simplement.' },
  zh: { title: 'promptgarten — AI 新闻', desc: '经过核实的 AI 编程工具、模型与智能体新闻。简单易懂。' },
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

for (const lang of LANGS) {
  const items = JSON.parse(readFileSync(join(ROOT, 'content', `feed.${lang}.json`), 'utf8'));
  const ch = CHANNEL[lang];
  const pageUrl = `${SITE}/${lang}/feed/`;
  const selfUrl = `${SITE}/feed.${lang}.xml`;

  const xmlItems = items
    .map((it) => {
      const srcText = it.sources.map((s) => `${s.title}: ${s.url}`).join(' · ');
      const pubDate = new Date(`${it.date}T09:00:00Z`).toUTCString();
      return `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(`${pageUrl}#${it.id}`)}</link>
      <guid isPermaLink="false">${esc(it.id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${esc(it.tag)}</category>
      <description>${esc(`${it.summary} — ${srcText}`)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(ch.title)}</title>
    <link>${esc(pageUrl)}</link>
    <description>${esc(ch.desc)}</description>
    <language>${lang}</language>
    <atom:link href="${esc(selfUrl)}" rel="self" type="application/rss+xml"/>
${xmlItems}
  </channel>
</rss>
`;

  writeFileSync(join(ROOT, 'public', `feed.${lang}.xml`), xml);
  console.log(`✅ rss [${lang}]: ${items.length} Items`);
}

copyFileSync(join(ROOT, 'public', 'feed.de.xml'), join(ROOT, 'public', 'feed.xml'));
console.log('✅ rss: /feed.xml = DE-Kopie');
