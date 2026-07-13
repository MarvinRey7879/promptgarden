#!/usr/bin/env node
/**
 * Patcht NUR das bodyDetail-Feld (+optional addSources → an sources angehängt)
 * in content/entries.<lang>.json — für bodyDetail-Nachrüst-Batches.
 *
 * Aufruf (aus site/): node scripts/patch-bodydetail.mjs <batch1.json> [...] [--force]
 * Batch-Format: {"de":[{slug,bodyDetail,addSources?}],"en":[…],…} — Sprachen dürfen fehlen.
 * Ohne --force ist ein Eintrag, der BEREITS bodyDetail hat, ein FEHLER (kein stilles Überschreiben).
 * Unbekannter slug = immer FEHLER. Danach: npm run build (lint prüft bodyDetail-Parität ×5).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

const args = process.argv.slice(2);
const force = args.includes('--force');
const files = args.filter((a) => a !== '--force');
if (!files.length) {
  console.error('Usage: node scripts/patch-bodydetail.mjs <batch.json> [...] [--force]');
  process.exit(1);
}

const incoming = {}; // lang -> [{slug,bodyDetail,addSources}]
for (const f of files) {
  const batch = JSON.parse(readFileSync(resolve(f), 'utf8'));
  for (const lang of LANGS) {
    if (!batch[lang]) continue;
    for (const p of batch[lang]) {
      if (!p.slug || !p.bodyDetail || p.bodyDetail.length < 500) {
        console.error(`❌ ${f} [${lang}] ${p.slug ?? '?'}: slug/bodyDetail fehlt oder zu kurz`);
        process.exit(1);
      }
      (incoming[lang] ||= []).push(p);
    }
  }
}

for (const [lang, patches] of Object.entries(incoming)) {
  const path = join(ROOT, 'content', `entries.${lang}.json`);
  const entries = JSON.parse(readFileSync(path, 'utf8'));
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  let patched = 0;
  for (const p of patches) {
    const e = bySlug.get(p.slug);
    if (!e) { console.error(`❌ entries.${lang}: slug "${p.slug}" existiert nicht`); process.exit(1); }
    if (e.bodyDetail && !force) { console.error(`❌ entries.${lang}: "${p.slug}" hat schon bodyDetail (--force zum Überschreiben)`); process.exit(1); }
    e.bodyDetail = p.bodyDetail;
    if (Array.isArray(p.addSources)) {
      const have = new Set((e.sources ?? []).map((s) => s.url));
      for (const s of p.addSources) if (!have.has(s.url)) (e.sources ??= []).push(s);
    }
    patched++;
  }
  writeFileSync(path, JSON.stringify(entries, null, 2) + '\n');
  console.log(`✅ entries.${lang}.json: ${patched} bodyDetail gepatcht`);
}
console.log('→ Jetzt: npm run build (lint prüft bodyDetail-Parität über alle 5 Sprachen).');
