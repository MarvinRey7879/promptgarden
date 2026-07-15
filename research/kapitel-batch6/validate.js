const d = require('./entwurf.de.json');

let ok = true;
const err = (m) => { console.log('FEHLER:', m); ok = false; };

if (!Array.isArray(d)) err('kein Array');
if (d.length !== 10) err(`erwartet 10 Items, gefunden ${d.length}`);

const requiredFields = ['slug','title','category','difficulty','minutes','xp','teaser','body','bodyDetail','example','related','quiz','sources','exercise'];
const xpByDifficulty = { 1: 20, 2: 40, 3: 60 };
const correctCounts = {};
const slugs = new Set();

for (const e of d) {
  const tag = e.slug || '???';
  for (const f of requiredFields) {
    if (e[f] === undefined || e[f] === null || e[f] === '') err(`${tag}: fehlt Feld "${f}"`);
  }
  if (slugs.has(e.slug)) err(`${tag}: doppelter slug`);
  slugs.add(e.slug);

  if (![1,2,3].includes(e.difficulty)) err(`${tag}: difficulty ungueltig (${e.difficulty})`);
  if (e.xp !== xpByDifficulty[e.difficulty]) err(`${tag}: xp ${e.xp} passt nicht zu difficulty ${e.difficulty} (erwartet ${xpByDifficulty[e.difficulty]})`);
  if (e.minutes < 3 || e.minutes > 6) err(`${tag}: minutes ausserhalb 3-6 (${e.minutes})`);

  if (e.body && (e.body.length < 900 || e.body.length > 1500)) err(`${tag}: body-Laenge ${e.body.length} ausserhalb Zielbereich`);
  if (e.bodyDetail && (e.bodyDetail.length < 1700 || e.bodyDetail.length > 2700)) err(`${tag}: bodyDetail-Laenge ${e.bodyDetail.length} ausserhalb Zielbereich`);

  if (e.quiz) {
    if (!Array.isArray(e.quiz.options) || e.quiz.options.length !== 3) err(`${tag}: quiz.options muss genau 3 Eintraege haben`);
    if (e.quiz.options && e.quiz.options.some(o => !o || typeof o !== 'string')) err(`${tag}: quiz.options enthaelt leeres/ungueltiges Element`);
    if (![0,1,2].includes(e.quiz.correct)) err(`${tag}: quiz.correct ungueltig (${e.quiz.correct})`);
    correctCounts[e.quiz.correct] = (correctCounts[e.quiz.correct] || 0) + 1;
  }

  if (!Array.isArray(e.related) || e.related.length < 2 || e.related.length > 4) err(`${tag}: related muss 2-4 Eintraege haben`);
  if (!Array.isArray(e.sources) || e.sources.length < 2 || e.sources.length > 3) err(`${tag}: sources muss 2-3 Eintraege haben`);
  if (e.exercise && (!Array.isArray(e.exercise.steps) || e.exercise.steps.length < 3 || e.exercise.steps.length > 5)) err(`${tag}: exercise.steps muss 3-5 Eintraege haben`);
}

console.log('correct-Index Verteilung:', correctCounts);
if (Object.keys(correctCounts).length < 2) err('quiz.correct variiert nicht ueber die Kapitel');

// related-slugs gegen bestehende entries.de.json pruefen
try {
  const existing = require('../../site/content/entries.de.json');
  const existingSlugs = new Set(existing.map(x => x.slug));
  const newSlugs = new Set(d.map(x => x.slug));
  for (const e of d) {
    for (const r of (e.related || [])) {
      if (!existingSlugs.has(r) && !newSlugs.has(r)) err(`${e.slug}: related-slug "${r}" existiert nicht in entries.de.json`);
      if (newSlugs.has(r)) err(`${e.slug}: related-slug "${r}" ist ein NEUES Kapitel aus diesem Batch, nicht erlaubt`);
    }
    if (existingSlugs.has(e.slug)) err(`${e.slug}: slug existiert bereits in entries.de.json`);
  }
} catch (e) {
  console.log('Warnung: entries.de.json konnte nicht geladen werden:', e.message);
}

console.log(ok ? 'VALIDIERUNG OK' : 'VALIDIERUNG FEHLGESCHLAGEN');
process.exit(ok ? 0 : 1);
