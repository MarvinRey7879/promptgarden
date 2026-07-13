#!/usr/bin/env node
/**
 * Merged Batch-Dateien in content/entries.<lang>.json — deterministisch, mit Validierung.
 *
 * Aufruf (immer aus site/):  node scripts/merge-entries.mjs <batch1.json> [batch2.json …] [--update]
 * Batch-Format: {"de":[Entry,…],"en":[…],…} — Sprachen dürfen fehlen (z.B. erst DE+EN, später ES/FR/ZH).
 * Ohne --update ist ein bereits existierender Slug ein FEHLER (kein stilles Überschreiben);
 * mit --update werden existierende Slugs ersetzt (für Übersetzungs-Nachzüge/Korrekturen).
 * Danach IMMER: npm run build (lint-content.mjs prüft Sprach-Parität etc.).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];
const REQUIRED = ['slug', 'title', 'category', 'difficulty', 'minutes', 'xp', 'teaser', 'body', 'example', 'related', 'quiz', 'sources'];
const CATEGORIES = new Set(['begriff', 'prompt-pattern', 'konzept', 'guide', 'vergleich']);

const args = process.argv.slice(2);
const update = args.includes('--update');
const files = args.filter((a) => a !== '--update');
if (!files.length) {
  console.error('Usage: node scripts/merge-entries.mjs <batch.json> [...] [--update]');
  process.exit(1);
}

const errors = [];
function validateEntry(e, src, lang) {
  const where = `${src} [${lang}] ${e.slug ?? '?'}`;
  for (const f of REQUIRED) if (e[f] === undefined) errors.push(`${where}: Feld "${f}" fehlt`);
  if (e.category && !CATEGORIES.has(e.category)) errors.push(`${where}: category "${e.category}" ungültig`);
  if (e.quiz && (!Number.isInteger(e.quiz.correct) || e.quiz.correct < 0 || e.quiz.correct >= (e.quiz.options?.length ?? 0)))
    errors.push(`${where}: quiz.correct ungültig`);
  if (!Array.isArray(e.sources) || e.sources.length === 0) errors.push(`${where}: sources leer — Quellenpflicht!`);
}

// Batches einlesen + je Sprache sammeln
const incoming = {}; // lang -> Entry[]
for (const f of files) {
  const batch = JSON.parse(readFileSync(resolve(f), 'utf8'));
  for (const lang of LANGS) {
    if (!batch[lang]) continue;
    for (const e of batch[lang]) {
      validateEntry(e, f, lang);
      (incoming[lang] ||= []).push(e);
    }
  }
}
if (errors.length) {
  errors.forEach((e) => console.error(`❌ ${e}`));
  process.exit(1);
}

// Mergen
for (const [lang, list] of Object.entries(incoming)) {
  const path = join(ROOT, 'content', `entries.${lang}.json`);
  const existing = JSON.parse(readFileSync(path, 'utf8'));
  const bySlug = new Map(existing.map((e, i) => [e.slug, i]));
  let added = 0, updated = 0;
  for (const e of list) {
    if (bySlug.has(e.slug)) {
      if (!update) { console.error(`❌ entries.${lang}: slug "${e.slug}" existiert bereits (nutze --update zum Ersetzen)`); process.exit(1); }
      existing[bySlug.get(e.slug)] = e;
      updated++;
    } else {
      existing.push(e);
      bySlug.set(e.slug, existing.length - 1);
      added++;
    }
  }
  writeFileSync(path, JSON.stringify(existing, null, 2) + '\n');
  console.log(`✅ entries.${lang}.json: +${added} neu, ${updated} ersetzt → ${existing.length} gesamt`);
}
console.log('→ Jetzt: npm run build (lint-content prüft Parität) — Sprachen ggf. erst nach Übersetzungs-Merge vollständig.');
