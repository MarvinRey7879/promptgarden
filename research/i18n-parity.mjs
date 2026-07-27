/**
 * i18n-Paritätsprüfung über alle Content-Typen (It. 256).
 *
 * Prüft je Typ: gleiche Anzahl Einträge in allen 5 Sprachen, kein Eintrag
 * fehlt, keine leeren Pflichtfelder. Aus site/ starten:
 *   node ../research/i18n-parity.mjs
 *
 * Fallstricke, die beim Bau aufgefallen sind — bitte beim Erweitern beachten:
 * - Jeder Typ hat eine eigene Form. addons/prompts liegen unter `items`,
 *   rosetta unter `groups[].tasks`, timeline unter `eintraege`, vergleiche hat
 *   `tools` als Array und `modelle`/`duelle` als OBJEKTE. „Erstes Array im
 *   Objekt nehmen" liefert bei prompts die 6 Kategorien statt der 16 Einträge.
 * - Der Vergleichsschlüssel darf NICHT übersetzt sein. timeline hat weder slug
 *   noch id; `name` ist lokalisiert, deshalb wird date+typ+anbieter genutzt.
 *   Mit `name` meldet die Prüfung sonst 21 Fehlalarme.
 */
import { readFileSync } from 'node:fs';

const langs = ['de', 'en', 'es', 'fr', 'zh'];
const arr = (v) => (Array.isArray(v) ? v : []);
const firstArray = (d) => (Array.isArray(d) ? d : arr(d[Object.keys(d).find((k) => Array.isArray(d[k]))]));

// [Einträge herausziehen, sprachunabhängiger Schlüssel]
const spec = {
  addons: [(d) => arr(d.items), (x) => x.slug || x.id || x.key],
  benchmarks: [firstArray, (x) => x.slug || x.id || x.model || x.name],
  commands: [(d) => arr(d.commands), (x) => x.platform + '/' + x.slug],
  entries: [(d) => d, (x) => x.slug],
  fehler: [firstArray, (x) => x.slug || x.id],
  loops: [firstArray, (x) => x.slug || x.id],
  prompts: [(d) => arr(d.items), (x) => x.id],
  rosetta: [(d) => arr(d.groups).flatMap((g) => arr(g.tasks)), (x) => x.id || x.slug],
  timeline: [(d) => arr(d.eintraege), (x) => x.date + '|' + (x.typ || '') + '|' + (x.anbieter || '')],
  vergleiche: [(d) => arr(d.tools), (x) => x.id],
  feed: [(d) => d, (x) => x.id],
};

const PFLICHT = ['title', 'summary', 'teaser', 'name', 'text', 'prompt', 'wann', 'what'];

let total = 0;
for (const [typ, [pick, key]] of Object.entries(spec)) {
  const counts = [], probs = [];
  let base;
  for (const lang of langs) {
    let a;
    try {
      a = pick(JSON.parse(readFileSync(`content/${typ}.${lang}.json`, 'utf8').replace(/^﻿/, '')));
    } catch (e) {
      probs.push(`${lang} Ladefehler: ${e.message}`);
      continue;
    }
    counts.push(`${lang}:${a.length}`);
    if (lang === 'de') { base = a; continue; }
    const ids = new Set(a.map(key));
    for (const b of base) if (!ids.has(key(b))) probs.push(`${lang} fehlt ${key(b)}`);
    for (const x of a) {
      if (!x || typeof x !== 'object') continue;
      for (const f of PFLICHT) if (f in x && (!x[f] || !String(x[f]).trim())) probs.push(`${lang} leer.${f} ${key(x)}`);
    }
  }
  total += probs.length;
  const status = probs.length ? `⚠ ${probs.length}: ${probs.slice(0, 3).join(' | ')}` : 'ok';
  console.log(`${typ.padEnd(12)} ${counts.join(' ').padEnd(46)} ${status}`);
}
console.log(`\nProbleme gesamt: ${total}`);
process.exit(total ? 1 : 0);
