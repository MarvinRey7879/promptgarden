/**
 * Der Review hatte widersprüchliche Testset-Größen zwischen DE und EN gemeldet
 * (30-100 vs. 20-50 Fragen, 20-50 vs. 10-20 Testfälle). Der Fix entfernte die
 * EN-Zahlen komplett — der Widerspruch war damit weg, aber die englische Fassung
 * ärmer als die deutsche. Hier bekommt EN dieselbe Faustregel wie DE.
 * Beide Angaben sind als Erfahrungswert formuliert, nicht einer Quelle zugeschrieben.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const p = 'C:/Users/marvi/promptgarden/research/kapitel-batch8/entwurf.en.json';
const a = JSON.parse(readFileSync(p, 'utf8'));

const patch = (slug, alt, neu) => {
  const e = a.find((x) => x.slug === slug);
  if (!e) throw new Error('SLUG NOT FOUND: ' + slug);
  if (!e.bodyDetail.includes(alt)) throw new Error('ANCHOR NOT FOUND in ' + slug + ': ' + alt.slice(0, 60));
  e.bodyDetail = e.bodyDetail.replace(alt, neu);
  console.log('patched', slug);
};

patch(
  'retrieval-evaluation',
  'The most reliable approach: pull real user questions, or write plausible ones by hand, then manually',
  'A workable set holds roughly 20 to 50 questions, each with at least one passage marked as correct. The most reliable approach: pull real user questions, or write plausible ones by hand, then manually',
);

patch('prompt-versionierung', '## Building the small test set', '## Building the small test set (twenty to fifty cases)');

writeFileSync(p, JSON.stringify(a, null, 2) + '\n');
console.log('OK');
