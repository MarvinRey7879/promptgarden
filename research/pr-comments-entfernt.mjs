/**
 * It. 168: /pr-comments in DE+EN als entfernt-Hinweis anlegen — wie /vim.
 * Beleg (code.claude.com/docs/en/commands): "Removed in v2.1.91. Ask Claude
 * directly to view pull request comments instead." Seite existiert bei uns
 * bisher nicht; wer den Befehl sucht, soll den Nachfolger-Weg finden.
 * es/fr/zh folgen im Übersetzungsschritt.
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL = 'https://code.claude.com/docs/en/commands';
const T = {
  de: {
    qt: 'Claude Code Doku (offiziell)',
    summary: 'Gibt es nicht mehr — in Version 2.1.91 entfernt.',
    what: 'Gibt es nicht mehr — in Version 2.1.91 entfernt.\n\nStatt eines eigenen Befehls bittest du Claude jetzt direkt, die Kommentare eines Pull-Requests anzusehen. Auf älteren Versionen holte /pr-comments die Kommentare eines GitHub-Pull-Requests (erkannte den PR des aktuellen Branches automatisch oder nahm eine PR-URL bzw. -Nummer) und benötigte die gh-CLI.',
    wg: [{ title: 'Nichts mehr — der Befehl ist weg', example: 'Claude direkt bitten: „Sieh dir die Kommentare von PR 42 an."' }],
    wb: [{ title: 'Auf einer Version ab 2.1.91', why: 'der Befehl wurde in 2.1.91 entfernt und tut nichts mehr.', alternative: 'Claude direkt nach den PR-Kommentaren fragen' }],
  },
  en: {
    qt: 'Claude Code docs (official)',
    summary: 'No longer exists — removed in version 2.1.91.',
    what: 'No longer exists — removed in version 2.1.91.\n\nInstead of a dedicated command, you now ask Claude directly to view a pull request’s comments. On earlier versions, /pr-comments fetched a GitHub pull request’s comments (auto-detecting the current branch’s PR, or taking a PR URL or number) and required the gh CLI.',
    wg: [{ title: 'Nothing — the command is gone', example: 'Ask Claude directly: "Look at the comments on PR 42."' }],
    wb: [{ title: 'On version 2.1.91 or later', why: 'the command was removed in 2.1.91 and does nothing.', alternative: 'ask Claude directly for the PR comments' }],
  },
};

for (const lang of ['de', 'en']) {
  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (daten.commands.some((k) => k.platform === 'claude-code' && k.slug === 'pr-comments')) {
    console.log(lang, 'schon vorhanden — übersprungen');
    continue;
  }
  const t = T[lang];
  daten.commands.push({
    platform: 'claude-code',
    slug: 'pr-comments',
    name: '/pr-comments',
    summary: t.summary,
    what: t.what,
    whenGood: t.wg,
    whenBad: t.wb,
    sources: [{ title: t.qt, url: URL }],
  });
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, ': /pr-comments angelegt, gesamt', daten.commands.length);
}
