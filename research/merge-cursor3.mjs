/**
 * It. 172: Setzt die Cursor-Modell-Shortcuts in es/fr/zh um — entfernt den alten
 * Sammel-Eintrag opus-composer-fast und fügt die drei übersetzten Einzelbefehle
 * (opus, composer, fast) an. DE+EN wurden bereits direkt geschrieben.
 * Idempotent. Aufruf aus dem REPO-ROOT.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SP = 'C:/Users/marvi/AppData/Local/Temp/claude/C--Users-marvi/ae3b49ca-d756-4259-96c1-aa4b7ed6e88b/scratchpad/';
const ERWARTET = ['opus', 'composer', 'fast'];
const ALT = 'opus-composer-fast';

for (const lang of ['es', 'fr', 'zh']) {
  const uebers = JSON.parse(readFileSync(`${SP}cursor3-${lang}.json`, 'utf8'));
  if (!Array.isArray(uebers) || uebers.length !== 3) throw new Error(`${lang}: keine 3 Objekte`);
  if (uebers.map((k) => k.slug).join(',') !== ERWARTET.join(',')) throw new Error(`${lang}: Slug-Reihenfolge weicht ab`);
  for (const k of uebers) {
    for (const f of ['summary', 'what']) if (!k[f] || !String(k[f]).trim()) throw new Error(`${lang}/${k.slug}: ${f} leer`);
    if (!k.whenGood?.length || !k.whenBad?.length || !k.sources?.[0]?.url) throw new Error(`${lang}/${k.slug}: Felder fehlen`);
  }

  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  const vor = daten.commands.length;
  daten.commands = daten.commands.filter((k) => !(k.platform === 'cursor-cli' && k.slug === ALT));
  const entfernt = vor - daten.commands.length;
  let neu = 0;
  for (const k of uebers) {
    if (daten.commands.some((x) => x.platform === 'cursor-cli' && x.slug === k.slug)) continue;
    daten.commands.push({ platform: 'cursor-cli', ...k });
    neu++;
  }
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, ': Sammel entfernt', entfernt, ', neu', neu, ', gesamt', daten.commands.length);
}
