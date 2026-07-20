/**
 * Qualitäts-Phase It. 175: Nachdem 16 Codex-Befehle angelegt wurden (It.170),
 * konnten vier bislang leere Codex-Zellen in der Befehls-Rosetta (/rosetta/)
 * gefüllt werden — dort, wo der neue Codex-Befehl die Aufgabe der Zeile sicher
 * abdeckt:
 *   - kontext-komprimieren → /compact  (codex: "Compact the current chat's context")
 *   - projekt-config       → /init     (codex: erzeugt das AGENTS.md-Projektgerüst)
 *   - bug-melden           → /feedback (codex: "Open the feedback dialog")
 *   - beenden              → /quit      (codex: Sitzung verlassen, = /exit)
 *
 * Bewusst NICHT gefüllt (kein sicherer Treffer): kontext-visualisieren — Codex
 * hat kein /context, nur /status zeigt Kontextnutzung nebenbei; das ist keine
 * Entsprechung. Nicht erzwingen.
 *
 * Die Zelle ist {slug, name}; der Befehlsname ist sprachunabhängig, daher in
 * allen fünf Rosetta-Dateien gleich. Idempotent (füllt nur null-Zellen).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILL = {
  'kontext-komprimieren': { slug: 'compact', name: '/compact' },
  'projekt-config': { slug: 'init', name: '/init' },
  'bug-melden': { slug: 'feedback', name: '/feedback' },
  'beenden': { slug: 'quit', name: '/quit' },
};

for (const lang of ['de', 'en', 'es', 'fr', 'zh']) {
  const pfad = `site/content/rosetta.${lang}.json`;
  const r = JSON.parse(readFileSync(pfad, 'utf8'));
  let n = 0;
  for (const g of r.groups) {
    for (const t of g.tasks) {
      if (FILL[t.id] && t.cells['codex-cli'] === null) {
        t.cells['codex-cli'] = { ...FILL[t.id] };
        n++;
      }
    }
  }
  writeFileSync(pfad, JSON.stringify(r, null, 2) + '\n');
  console.log(lang, ':', n, 'Codex-Zellen gefüllt');
}
