/**
 * Qualitäts-Phase It. 167: Drei Claude-Code-Einträge beschrieben Slash-Befehle,
 * die es nie gab. /thinking, /web-search und /web berufen sich alle auf die
 * offizielle Befehls-Referenz — dort stehen sie nicht. Belege dagegen:
 *   - Referenz (code.claude.com/docs/en/commands): keiner der drei gelistet.
 *   - Changelog: "web search"/"web fetch" nur als WERKZEUGE, nie als Befehl;
 *     "thinking" nur als Konfiguration (extended thinking), kein Befehl.
 *   - Websuche über anthropic-Domains: kein Treffer für die Befehle.
 * Es sind Autorenfehler — Werkzeuge und Konfiguration mit Befehlen verwechselt.
 * Anders als /vim (das existierte und entfernt wurde) gab es diese nie, also
 * werden die Seiten gelöscht statt mit einem Nachfolger-Hinweis behalten.
 *
 * Zusätzlich: die zwei Rosetta-Zellen, die auf diese Befehle zeigen, werden auf
 * null gesetzt — genau die Konvention, die Rosetta schon für Plattformen ohne
 * eigenen Befehl nutzt (codex-cli/antigravity-cli sind dort bereits null).
 *
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = 'site/content/';
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];
const RAUS = new Set(['thinking', 'web-search', 'web']);

let cmdWeg = 0;
for (const lang of LANGS) {
  const pfad = `${ROOT}commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(daten.commands)) throw new Error(`commands-Array fehlt in ${lang}`);
  const vorher = daten.commands.length;
  daten.commands = daten.commands.filter((k) => !(k.platform === 'claude-code' && RAUS.has(k.slug)));
  const entfernt = vorher - daten.commands.length;
  cmdWeg += entfernt;

  if (entfernt === 0) {
    console.log(lang, 'commands: schon entfernt');
  } else {
    writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
    console.log(lang, 'commands:', entfernt, 'entfernt');
  }

  // Rosetta: claude-code-Zellen mit diesen Slugs auf null setzen
  const rp = `${ROOT}rosetta.${lang}.json`;
  const r = JSON.parse(readFileSync(rp, 'utf8'));
  let genullt = 0;
  for (const g of r.groups) {
    for (const t of g.tasks) {
      const c = t.cells['claude-code'];
      if (c && RAUS.has(c.slug)) {
        t.cells['claude-code'] = null;
        genullt++;
      }
    }
  }
  if (genullt) {
    writeFileSync(rp, JSON.stringify(r, null, 2) + '\n');
    console.log(lang, 'rosetta:', genullt, 'Zellen auf null');
  }
}
console.log('Befehls-Seiten entfernt gesamt:', cmdWeg);
