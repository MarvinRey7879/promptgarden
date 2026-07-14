#!/usr/bin/env node
/**
 * Baut je Sprache einen Volltext-Suchindex nach public/search/index.<lang>.json.
 * Quellen: entries (Kapitel), commands (Befehle), addons. Läuft im prebuild nach lint.
 * Doc-Format: { id, g: 'k'|'b'|'a', t: Titel, s: Untertitel, b: Text-Anriss, u: Pfad ohne Sprach-Präfix }
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];
const read = (f) => JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8'));
const strip = (s, n) => (s || '').replace(/[#*`\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

mkdirSync(join(ROOT, 'public', 'search'), { recursive: true });

for (const lang of LANGS) {
  const docs = [];
  for (const e of read(`entries.${lang}.json`)) {
    docs.push({ id: `k:${e.slug}`, g: 'k', t: e.title, s: strip(e.teaser, 140), b: strip(e.body, 400), u: `lexikon/${e.slug}/` });
  }
  const cmds = read(`commands.${lang}.json`);
  const pName = Object.fromEntries(cmds.platforms.map((p) => [p.id, p.name]));
  for (const c of cmds.commands) {
    docs.push({ id: `b:${c.platform}/${c.slug}`, g: 'b', t: c.name, s: `${pName[c.platform] ?? c.platform} — ${strip(c.summary, 120)}`, b: strip(c.what, 300), u: `befehle/${c.platform}/${c.slug}/` });
  }
  for (const a of read(`addons.${lang}.json`).items) {
    docs.push({ id: `a:${a.id}`, g: 'a', t: a.name, s: strip(a.what, 140), b: strip(a.why, 300), u: `addons/${a.id}/` });
  }
  for (const pr of read(`prompts.${lang}.json`).items) {
    docs.push({ id: `p:${pr.id}`, g: 'p', t: pr.title, s: strip(pr.wann, 140), b: strip(pr.prompt, 300), u: `prompts/#${pr.category}` });
  }
  const out = join(ROOT, 'public', 'search', `index.${lang}.json`);
  writeFileSync(out, JSON.stringify(docs));
  console.log(`✅ search-index [${lang}]: ${docs.length} Dokumente, ${(JSON.stringify(docs).length / 1024).toFixed(0)} KB`);
}
