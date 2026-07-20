/**
 * It. 170: Fügt die übersetzten 16 neuen Codex-CLI-Befehle in die es/fr/zh-
 * Befehlsdateien ein. DE+EN wurden bereits direkt geschrieben (Quelle gelesen).
 *
 * Sicherheiten: prüft, dass jede Übersetzungsdatei genau die 12 erwarteten Slugs
 * in gleicher Reihenfolge enthält und keine Pflichtfelder leer sind, bevor
 * irgendetwas geschrieben wird. Idempotent (überspringt vorhandene Slugs).
 *
 * Aufruf aus dem REPO-ROOT: node research/merge-neue-befehle.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SP = 'C:/Users/marvi/AppData/Local/Temp/claude/C--Users-marvi/ae3b49ca-d756-4259-96c1-aa4b7ed6e88b/scratchpad/';
const ERWARTET = ['init', 'compact', 'reasoning', 'fast', 'personality', 'memories', 'ide-context', 'feedback', 'approve', 'side', 'project', 'cloud', 'local', 'cloud-environment', 'worktree', 'quit'];

for (const lang of ['es', 'fr', 'zh']) {
  const uebers = JSON.parse(readFileSync(`${SP}codex-${lang}.json`, 'utf8'));
  if (!Array.isArray(uebers) || uebers.length !== 16) throw new Error(`${lang}: keine 16 Objekte`);
  const slugs = uebers.map((k) => k.slug);
  if (slugs.join(',') !== ERWARTET.join(',')) throw new Error(`${lang}: Slug-Reihenfolge weicht ab: ${slugs.join(',')}`);
  for (const k of uebers) {
    for (const f of ['summary', 'what']) if (!k[f] || !String(k[f]).trim()) throw new Error(`${lang}/${k.slug}: ${f} leer`);
    if (!k.whenGood?.length || !k.whenBad?.length) throw new Error(`${lang}/${k.slug}: whenGood/whenBad leer`);
    if (!k.sources?.[0]?.url) throw new Error(`${lang}/${k.slug}: Quelle fehlt`);
  }

  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(daten.commands)) throw new Error(`${lang}: commands-Array fehlt`);
  let neu = 0;
  for (const k of uebers) {
    if (daten.commands.some((x) => x.platform === 'codex-cli' && x.slug === k.slug)) continue;
    daten.commands.push({ platform: 'codex-cli', ...k });
    neu++;
  }
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, ':', neu, 'neu, gesamt', daten.commands.length);
}
