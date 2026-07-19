/**
 * Qualitäts-Phase It. 169: Die Quell-URLs auf allen Cursor-CLI- und Codex-CLI-
 * Befehlsseiten waren tot (HTTP 404). Beide Dokus sind umgezogen:
 *   - Cursor: cursor.com/docs/cli/OVERVIEW/... → cursor.com/docs/cli/... (ohne
 *     das Segment "overview")
 *   - Codex: learn.chatgpt.com/docs/codex/... → developers.openai.com/codex/...
 *
 * Jede Ziel-URL wurde einzeln mit curl auf HTTP 200 geprüft (It. 169). Betroffen
 * waren rund 96 Befehlsseiten je Sprache. Nur die URL ändert sich, der
 * Quellentitel bleibt.
 *
 * Idempotent: ersetzt nur die bekannten alten URLs.
 * Aufruf aus dem REPO-ROOT: node research/tote-quell-urls-fix.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

// alt → neu, jede neue URL wurde auf 200 geprüft
const MAP = {
  'https://cursor.com/docs/cli/overview/reference/slash-commands': 'https://cursor.com/docs/cli/reference/slash-commands',
  'https://cursor.com/docs/cli/overview/reference/parameters': 'https://cursor.com/docs/cli/reference/parameters',
  'https://cursor.com/docs/cli/overview/reference/authentication': 'https://cursor.com/docs/cli/reference/authentication',
  'https://cursor.com/docs/cli/overview/changelog': 'https://cursor.com/docs/cli/changelog',
  'https://cursor.com/docs/cli/overview/mcp': 'https://cursor.com/docs/cli/mcp',
  'https://cursor.com/docs/cli/overview/overview': 'https://cursor.com/docs/cli/overview',
  'https://cursor.com/docs/cli/overview/acp': 'https://cursor.com/docs/cli/acp',
  'https://learn.chatgpt.com/docs/codex/cli/slash-commands': 'https://developers.openai.com/codex/cli/slash-commands',
  'https://learn.chatgpt.com/docs/codex/cli/reference': 'https://developers.openai.com/codex/cli/reference',
  'https://learn.chatgpt.com/docs/non-interactive-mode': 'https://developers.openai.com/codex/noninteractive',
};

let gesamt = 0;
for (const datei of readdirSync('site/content')) {
  if (!/^commands\.(de|en|es|fr|zh)\.json$/.test(datei)) continue;
  const pfad = 'site/content/' + datei;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(daten.commands)) throw new Error(`commands-Array fehlt in ${datei}`);
  let n = 0;
  for (const k of daten.commands) {
    for (const s of k.sources || []) {
      if (MAP[s.url]) {
        s.url = MAP[s.url];
        n++;
      }
    }
  }
  if (n) {
    writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
    console.log(datei, ':', n, 'URLs ersetzt');
    gesamt += n;
  }
}
console.log('gesamt:', gesamt);
