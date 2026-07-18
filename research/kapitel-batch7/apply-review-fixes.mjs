// Wendet review-findings.json auf entwurf.de.json + entwurf.en.json an.
// Feld-lokale String-Replaces mit harten Ankern (throw bei NOT FOUND),
// danach harmonisierte Quellen-Sets (URL-Set DE=EN identisch).
import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'C:/Users/marvi/promptgarden/research/kapitel-batch7/';
const review = JSON.parse(readFileSync(dir + 'review-findings.json', 'utf8'));
const files = {
  de: JSON.parse(readFileSync(dir + 'entwurf.de.json', 'utf8')),
  en: JSON.parse(readFileSync(dir + 'entwurf.en.json', 'utf8')),
};

let applied = 0;
for (const f of review.findings) {
  const targets = f.file === 'beide' ? ['de', 'en'] : [f.file];
  for (const t of targets) {
    const entry = files[t].find((e) => e.slug === f.slug);
    if (!entry) throw new Error('SLUG NOT FOUND: ' + f.slug + ' in ' + t);
    if (f.field === 'sources') {
      // wird von der Harmonisierung unten abgedeckt
      console.log('SKIP sources-finding (Harmonisierung deckt ab):', f.slug, t);
      continue;
    }
    if (f.fixValue !== null && f.fixValue !== undefined) {
      entry[f.field] = f.fixValue;
      console.log('FIXVALUE', t, f.slug, f.field);
      applied++;
      continue;
    }
    const cur = entry[f.field];
    if (typeof cur !== 'string') throw new Error('FELD KEIN STRING: ' + f.slug + '.' + f.field + ' (' + t + ')');
    // Reviewer-Anker können (mehrfach) JSON-escaped sein — Kandidaten durchprobieren
    const unesc = (s) => s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\+$/, '');
    let anchor = f.anchor, fix = f.fix;
    for (let i = 0; i < 3 && cur.split(anchor).length - 1 === 0; i++) {
      anchor = unesc(anchor);
      fix = unesc(fix);
    }
    const n = cur.split(anchor).length - 1;
    if (n === 0) throw new Error('ANCHOR NOT FOUND: ' + t + ' ' + f.slug + '.' + f.field + ' :: ' + f.anchor);
    if (n > 1) throw new Error('ANCHOR MEHRDEUTIG (' + n + '×): ' + t + ' ' + f.slug + '.' + f.field);
    entry[f.field] = cur.replace(anchor, fix);
    console.log('REPLACE', t, f.slug, f.field);
    applied++;
  }
}

// Harmonisierte Quellen auf beide Dateien
let harmonized = 0;
for (const [slug, h] of Object.entries(review.harmonisierteQuellen)) {
  if (!Array.isArray(h.urls) || h.urls.length < 2 || h.urls.length > 3) throw new Error('urls kaputt: ' + slug);
  if (h.deTitles.length !== h.urls.length || h.enTitles.length !== h.urls.length) throw new Error('titles-länge: ' + slug);
  for (const [t, titles] of [['de', h.deTitles], ['en', h.enTitles]]) {
    const entry = files[t].find((e) => e.slug === slug);
    if (!entry) throw new Error('SLUG NOT FOUND (harm): ' + slug + ' ' + t);
    entry.sources = h.urls.map((u, i) => ({ title: titles[i], url: u }));
  }
  harmonized++;
}

writeFileSync(dir + 'entwurf.de.json', JSON.stringify(files.de, null, 2) + '\n');
writeFileSync(dir + 'entwurf.en.json', JSON.stringify(files.en, null, 2) + '\n');
console.log('DONE — fixes:', applied, 'harmonisiert:', harmonized);
