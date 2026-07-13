#!/usr/bin/env node
/**
 * Merged Befehls-Batches in content/commands.<lang>.json ({platforms:[],commands:[]}).
 *
 * Aufruf (aus site/): node scripts/merge-commands.mjs <batch1.json> [...] [--update]
 * Batch-Format: {"de":[Command,…],"en":[…],…} — Sprachen dürfen fehlen.
 * Platform-Metadaten (platforms[]) werden NICHT hier gepflegt — separat je Sprache ergänzen;
 * das Skript warnt nur, wenn ein commands.platform ohne platforms-Eintrag bleibt.
 * Ohne --update ist existierender platform/slug ein FEHLER. Danach IMMER: npm run build (lint prüft Parität).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];
const REQUIRED = ['platform', 'slug', 'name', 'summary', 'what', 'whenGood', 'whenBad', 'sources'];

const args = process.argv.slice(2);
const update = args.includes('--update');
const files = args.filter((a) => a !== '--update');
if (!files.length) {
  console.error('Usage: node scripts/merge-commands.mjs <batch.json> [...] [--update]');
  process.exit(1);
}

const errors = [];
function validate(c, src, lang) {
  const where = `${src} [${lang}] ${c.platform ?? '?'}/${c.slug ?? '?'}`;
  for (const f of REQUIRED) if (c[f] === undefined) errors.push(`${where}: Feld "${f}" fehlt`);
  if (!Array.isArray(c.sources) || c.sources.length === 0) errors.push(`${where}: sources leer — Quellenpflicht!`);
  for (const g of c.whenGood ?? []) if (!g.title || !g.example) errors.push(`${where}: whenGood-Eintrag unvollständig`);
  for (const b of c.whenBad ?? []) if (!b.title || !b.why || !b.alternative) errors.push(`${where}: whenBad-Eintrag unvollständig`);
}

const incoming = {};
for (const f of files) {
  const batch = JSON.parse(readFileSync(resolve(f), 'utf8'));
  for (const lang of LANGS) {
    if (!batch[lang]) continue;
    for (const c of batch[lang]) {
      validate(c, f, lang);
      (incoming[lang] ||= []).push(c);
    }
  }
}
if (errors.length) {
  errors.forEach((e) => console.error(`❌ ${e}`));
  process.exit(1);
}

for (const [lang, list] of Object.entries(incoming)) {
  const path = join(ROOT, 'content', `commands.${lang}.json`);
  const file = JSON.parse(readFileSync(path, 'utf8'));
  const key = (c) => `${c.platform}/${c.slug}`;
  const idx = new Map(file.commands.map((c, i) => [key(c), i]));
  let added = 0, updated = 0;
  for (const c of list) {
    if (idx.has(key(c))) {
      if (!update) { console.error(`❌ commands.${lang}: ${key(c)} existiert bereits (--update zum Ersetzen)`); process.exit(1); }
      file.commands[idx.get(key(c))] = c;
      updated++;
    } else {
      file.commands.push(c);
      idx.set(key(c), file.commands.length - 1);
      added++;
    }
  }
  const platformIds = new Set(file.platforms.map((p) => p.id));
  const missing = [...new Set(list.map((c) => c.platform))].filter((p) => !platformIds.has(p));
  if (missing.length) console.warn(`⚠️  commands.${lang}: platforms-Eintrag fehlt für: ${missing.join(', ')} — separat ergänzen!`);
  writeFileSync(path, JSON.stringify(file, null, 2) + '\n');
  console.log(`✅ commands.${lang}.json: +${added} neu, ${updated} ersetzt → ${file.commands.length} gesamt`);
}
console.log('→ Jetzt platforms-Metadaten prüfen, dann npm run build.');
