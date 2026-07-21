/**
 * Feed 21.07.2026: Hängt die neuen, recherchierten News VORN an feed.*.json an
 * (neueste zuerst). DE + EN werden direkt geschrieben, es/fr/zh von md5-gepinnten
 * Übersetzern. Vor dem Schreiben: Dubletten-Schutz (id darf nicht schon im Feed
 * sein) und Pflichtfeld-Prüfung. Danach wird jede Sprachliste nach date absteigend
 * stabil sortiert, damit die Reihenfolge konsistent bleibt.
 *
 * Idempotent: bereits vorhandene ids werden übersprungen.
 * Aufruf aus dem REPO-ROOT: node research/feed-merge-2007.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SP = 'C:/Users/marvi/AppData/Local/Temp/claude/C--Users-marvi/ae3b49ca-d756-4259-96c1-aa4b7ed6e88b/scratchpad/';
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];
const TAGS = new Set(['modelle', 'tools', 'mcp', 'security', 'papers']);

// Referenz-ids aus DE, damit alle Sprachen dieselben neuen Items bekommen
const neuDe = JSON.parse(readFileSync(`${SP}feed-neu-de.json`, 'utf8'));
const neuIds = neuDe.map((x) => x.id);
console.log('neue Items:', neuIds.length, '→', neuIds.join(', '));

for (const lang of LANGS) {
  const neu = JSON.parse(readFileSync(`${SP}feed-neu-${lang}.json`, 'utf8'));
  if (neu.length !== neuIds.length) throw new Error(`${lang}: ${neu.length} Items, erwartet ${neuIds.length}`);
  if (neu.map((x) => x.id).join(',') !== neuIds.join(',')) throw new Error(`${lang}: ids/Reihenfolge weichen von DE ab`);
  for (const it of neu) {
    for (const f of ['id', 'date', 'tag', 'title', 'summary']) if (!it[f] || !String(it[f]).trim()) throw new Error(`${lang}/${it.id}: ${f} leer`);
    if (!TAGS.has(it.tag)) throw new Error(`${lang}/${it.id}: tag ungültig: ${it.tag}`);
    if (!Array.isArray(it.sources) || !it.sources[0]?.url) throw new Error(`${lang}/${it.id}: Quelle fehlt`);
  }

  const pfad = `site/content/feed.${lang}.json`;
  const feed = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(feed)) throw new Error(`${lang}: feed ist kein Array`);
  const vorhanden = new Set(feed.map((x) => x.id));

  let n = 0;
  for (const it of neu) {
    if (vorhanden.has(it.id)) continue;
    feed.push(it);
    n++;
  }
  // neueste zuerst, stabil
  feed.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  writeFileSync(pfad, JSON.stringify(feed, null, 2) + '\n');
  console.log(lang, ':', n, 'neu, gesamt', feed.length);
}
