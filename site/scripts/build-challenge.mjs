#!/usr/bin/env node
/**
 * Baut je Sprache den Fragen-Pool der Tages-Challenge nach public/challenge/quiz.<lang>.json.
 * Quelle: entries.<lang>.json (jedes Kapitel hat ein Quiz). Die Array-Reihenfolge ist in allen
 * Sprachen identisch — der Datum-Seed im Client wählt so überall dieselben 5 Fragen.
 * Doc-Format: { q, o: string[], c, x, slug, t }
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

mkdirSync(join(ROOT, 'public', 'challenge'), { recursive: true });

let refSlugs = null;
for (const lang of LANGS) {
  const entries = JSON.parse(readFileSync(join(ROOT, 'content', `entries.${lang}.json`), 'utf8'));
  const pool = entries
    .filter((e) => e.quiz)
    .map((e) => ({ q: e.quiz.question, o: e.quiz.options, c: e.quiz.correct, x: e.quiz.explain, slug: e.slug, t: e.title }));
  const slugKey = pool.map((p) => p.slug).join(',');
  if (refSlugs === null) refSlugs = slugKey;
  else if (slugKey !== refSlugs) throw new Error(`challenge: Fragen-Reihenfolge weicht ab in ${lang}`);
  writeFileSync(join(ROOT, 'public', 'challenge', `quiz.${lang}.json`), JSON.stringify(pool));
  console.log(`✅ challenge [${lang}]: ${pool.length} Fragen`);
}
