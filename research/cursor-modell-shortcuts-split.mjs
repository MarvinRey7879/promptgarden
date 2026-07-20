/**
 * Qualitäts-Phase It. 172: Der Cursor-CLI-Eintrag "opus-composer-fast" fasste
 * drei Befehle unter einem zusammengesetzten Namen "/opus, /composer, /fast"
 * zusammen — als einzige Inkonsistenz im ansonsten sauberen Befehls-Inventar
 * (jeder andere Eintrag ist genau ein Befehl). Er wird in drei eigenständige
 * Einträge aufgeteilt, damit jeder Befehl eine eigene, auffindbare Seite hat.
 *
 * Belegt durch den offiziellen Cursor-Changelog (cursor.com/docs/cli/changelog,
 * am 20.07.2026 geprüft): "Type a shortcut like /opus or /composer to jump
 * straight to a model, no picker needed; each family shortcut remembers your
 * last choice. /fast toggles Fast when the current model supports it. Disable
 * shortcuts under Model slash commands in /config." Inhaltlich unverändert,
 * nur sauber getrennt.
 *
 * Schreibt DE + EN, entfernt den alten Sammel-Eintrag. es/fr/zh folgen.
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL = 'https://cursor.com/docs/cli/changelog';
const QT = 'Cursor Docs — Changelog';
const ALT = 'opus-composer-fast';

const BEFEHLE = [
  {
    slug: 'opus', name: '/opus',
    de: { summary: 'Springt direkt zur Opus-Modellfamilie, ohne den Modell-Picker zu öffnen.',
      what: 'Springt direkt zur Opus-Modellfamilie, ohne den Modell-Picker zu öffnen. Der Shortcut merkt sich die zuletzt gewählte Variante. Abschaltbar unter "Model slash commands" in /config.',
      wg: [{ title: 'Schnell auf ein Opus-Modell wechseln', example: '/opus' }],
      wb: [{ title: 'Ein Modell einer anderen Familie wählen', why: '/opus springt nur zur Opus-Familie.', alternative: '/model für die volle Auswahl' }] },
    en: { summary: 'Jumps straight to the Opus model family without opening the picker.',
      what: 'Jumps straight to the Opus model family without opening the model picker. The shortcut remembers your last choice. Disable under "Model slash commands" in /config.',
      wg: [{ title: 'Switch to an Opus model quickly', example: '/opus' }],
      wb: [{ title: 'Pick a model from another family', why: '/opus only jumps to the Opus family.', alternative: '/model for the full list' }] },
  },
  {
    slug: 'composer', name: '/composer',
    de: { summary: 'Springt direkt zur Composer-Modellfamilie, ohne den Modell-Picker zu öffnen.',
      what: 'Springt direkt zur Composer-Modellfamilie, ohne den Modell-Picker zu öffnen. Der Shortcut merkt sich die zuletzt gewählte Variante; Composer 2.5 ist das Standardmodell neuer CLI-Sitzungen. Abschaltbar unter "Model slash commands" in /config.',
      wg: [{ title: 'Schnell auf ein Composer-Modell wechseln', example: '/composer' }],
      wb: [{ title: 'Ein Modell einer anderen Familie wählen', why: '/composer springt nur zur Composer-Familie.', alternative: '/model für die volle Auswahl' }] },
    en: { summary: 'Jumps straight to the Composer model family without opening the picker.',
      what: 'Jumps straight to the Composer model family without opening the model picker. The shortcut remembers your last choice; Composer 2.5 is the default model for new CLI sessions. Disable under "Model slash commands" in /config.',
      wg: [{ title: 'Switch to a Composer model quickly', example: '/composer' }],
      wb: [{ title: 'Pick a model from another family', why: '/composer only jumps to the Composer family.', alternative: '/model for the full list' }] },
  },
  {
    slug: 'fast', name: '/fast',
    de: { summary: 'Schaltet den Fast-Modus um, sofern das aktuelle Modell ihn unterstützt.',
      what: 'Schaltet den Fast-Modus um, sofern das aktuelle Modell ihn unterstützt. Abschaltbar unter "Model slash commands" in /config.',
      wg: [{ title: 'Bei einem unterstützten Modell schneller antworten lassen', example: '/fast' }],
      wb: [{ title: 'Das aktuelle Modell unterstützt keinen Fast-Modus', why: '/fast wirkt nur, wenn das Modell den Modus anbietet.', alternative: 'ein Modell wählen, das Fast unterstützt' }] },
    en: { summary: 'Toggles Fast mode, when the current model supports it.',
      what: 'Toggles Fast mode when the current model supports it. Disable under "Model slash commands" in /config.',
      wg: [{ title: 'Get faster replies on a supported model', example: '/fast' }],
      wb: [{ title: 'The current model has no Fast mode', why: '/fast only takes effect when the model offers the mode.', alternative: 'pick a model that supports Fast' }] },
  },
];

for (const lang of ['de', 'en']) {
  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(daten.commands)) throw new Error('commands-Array fehlt');

  // alten Sammel-Eintrag entfernen
  const vor = daten.commands.length;
  daten.commands = daten.commands.filter((k) => !(k.platform === 'cursor-cli' && k.slug === ALT));
  const entfernt = vor - daten.commands.length;

  let neu = 0;
  for (const b of BEFEHLE) {
    if (daten.commands.some((k) => k.platform === 'cursor-cli' && k.slug === b.slug)) continue;
    const t = b[lang];
    daten.commands.push({
      platform: 'cursor-cli', slug: b.slug, name: b.name,
      summary: t.summary, what: t.what, whenGood: t.wg, whenBad: t.wb,
      sources: [{ title: QT, url: URL }],
    });
    neu++;
  }
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, ': Sammel-Eintrag entfernt =', entfernt, ', neu =', neu, ', gesamt', daten.commands.length);
}
