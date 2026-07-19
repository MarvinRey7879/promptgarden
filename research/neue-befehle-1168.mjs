/**
 * Qualitäts-Phase It. 168: Elf echte Claude-Code-Befehle fehlten im Bestand.
 * Beim Inventar-Abgleich (It. 167) gegen die offizielle Referenz gefunden. Jeder
 * Text stammt Wort für Wort aus code.claude.com/docs/en/commands (gefetcht am
 * 20.07.2026) — keine Erfindungen, Grenzen/Aliase/Versionshinweise übernommen.
 *
 * Schreibt DE + EN. es/fr/zh übersetzt danach ein eigener Schritt.
 * /pr-comments wird separat (wie /vim) als entfernt-Hinweis behandelt.
 *
 * Idempotent: legt einen Befehl nur an, wenn sein Slug fehlt.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL = 'https://code.claude.com/docs/en/commands';
const QT = { de: 'Claude Code Doku (offiziell)', en: 'Claude Code docs (official)' };

// Jeder Eintrag: gemeinsame Struktur, sprachspezifische Texte
const BEFEHLE = [
  {
    slug: 'bug', name: '/bug',
    de: {
      summary: 'Meldet einen Fehler oder teilt den Gesprächsverlauf.',
      what: 'Meldet einen Fehler oder teilt den Gesprächsverlauf.\n\nDu wählst, wie viel Verlauf mitgeht, und bestätigst vorher auf einem Zustimmungs-Bildschirm. Bei Anthropic angemeldet und direkt verbunden, geht der Bericht an Anthropic; über einen Drittanbieter oder ohne Anthropic-Zugangsdaten legt Claude Code ihn stattdessen lokal unter ~/.claude/feedback-bundles/ ab, den du selbst weiterleitest. Alias: /share. Vor v2.1.212 waren /bug und /share Aliase von /feedback.',
      wg: [{ title: 'Fehler mit Kontext an Anthropic melden', example: '/bug' }, { title: 'Ohne Anthropic-Login: Bericht lokal ablegen und selbst weiterleiten', example: '/bug report' }],
      wb: [{ title: 'Kein Fehler, sondern eine Produktidee oder allgemeines Feedback', why: '/bug ist auf Fehlerberichte und das Teilen einer Session ausgelegt.', alternative: '/feedback' }],
    },
    en: {
      summary: 'Reports a bug or shares your conversation.',
      what: 'Reports a bug or shares your conversation.\n\nYou choose how much session history to include and confirm on a consent screen first. Signed in to Anthropic on a first-party connection, the report goes to Anthropic; on a third-party provider or without Anthropic credentials, Claude Code writes it to a local archive under ~/.claude/feedback-bundles/ that you forward yourself. Alias: /share. Before v2.1.212, /bug and /share were aliases of /feedback.',
      wg: [{ title: 'Report a bug with context to Anthropic', example: '/bug' }, { title: 'Without an Anthropic login: write the report locally and forward it yourself', example: '/bug report' }],
      wb: [{ title: 'Not a bug but a product idea or general feedback', why: '/bug is built for bug reports and sharing a session.', alternative: '/feedback' }],
    },
  },
  {
    slug: 'stop', name: '/stop',
    de: {
      summary: 'Stoppt die laufende Hintergrund-Session.',
      what: 'Stoppt die laufende Hintergrund-Session.\n\nNur verfügbar, solange du an eine Hintergrund-Session angehängt bist; das Protokoll und ein etwaiger Worktree bleiben erhalten. Willst du nur abkoppeln, ohne zu stoppen, nutze /exit.',
      wg: [{ title: 'Eine im Hintergrund laufende Session beenden', example: '/stop' }],
      wb: [{ title: 'Nur abkoppeln, aber die Session weiterlaufen lassen', why: '/stop beendet die Session; Protokoll und Worktree bleiben zwar erhalten, die Arbeit läuft aber nicht weiter.', alternative: '/exit' }],
    },
    en: {
      summary: 'Stops the current background session.',
      what: 'Stops the current background session.\n\nOnly available while attached to a background session; the transcript and any worktree are kept. To detach without stopping, use /exit.',
      wg: [{ title: 'End a session running in the background', example: '/stop' }],
      wb: [{ title: 'Only detach but keep the session running', why: '/stop ends the session; the transcript and worktree are kept, but the work does not continue.', alternative: '/exit' }],
    },
  },
  {
    slug: 'team-onboarding', name: '/team-onboarding',
    de: {
      summary: 'Erzeugt einen Team-Einarbeitungsleitfaden aus deiner Nutzungshistorie.',
      what: 'Erzeugt einen Team-Einarbeitungsleitfaden aus deiner Nutzungshistorie.\n\nClaude wertet deine Sessions, Befehle und MCP-Server-Nutzung der letzten 30 Tage aus und erstellt einen Markdown-Leitfaden, den ein Teammitglied als erste Nachricht einfügen kann, um schnell startklar zu sein. Für claude.ai-Abos (Pro, Max, Team, Enterprise) kommt zusätzlich ein Teilen-Link zurück.',
      wg: [{ title: 'Neuen Teammitgliedern einen belegten Startpunkt geben', example: '/team-onboarding' }],
      wb: [{ title: 'Frisches Projekt ohne eigene Nutzungshistorie', why: 'der Leitfaden speist sich aus deinen letzten 30 Tagen; ohne Historie bleibt er dünn.', alternative: '/init' }],
    },
    en: {
      summary: 'Generates a team onboarding guide from your usage history.',
      what: 'Generates a team onboarding guide from your usage history.\n\nClaude analyzes your sessions, commands, and MCP server usage from the past 30 days and produces a markdown guide a teammate can paste as a first message to get set up quickly. For claude.ai subscribers on Pro, Max, Team, and Enterprise plans, it also returns a share link.',
      wg: [{ title: 'Give new teammates a grounded starting point', example: '/team-onboarding' }],
      wb: [{ title: 'A fresh project with no usage history of your own', why: 'the guide draws on your past 30 days; without history it stays thin.', alternative: '/init' }],
    },
  },
  {
    slug: 'terminal-setup', name: '/terminal-setup',
    de: {
      summary: 'Richtet Terminal-Tastenkürzel wie Shift+Enter ein.',
      what: 'Richtet Terminal-Tastenkürzel wie Shift+Enter und weitere ein.\n\nErscheint nur in Terminals, die es brauchen — etwa VS Code, Cursor, Devin Desktop, Alacritty oder Zed.',
      wg: [{ title: 'Shift+Enter im VS-Code- oder Cursor-Terminal aktivieren', example: '/terminal-setup' }],
      wb: [{ title: 'Terminal, das die Kürzel schon von Haus aus beherrscht', why: 'der Befehl ist dort gar nicht sichtbar, weil keine Einrichtung nötig ist.', alternative: 'nichts tun — die Kürzel funktionieren bereits' }],
    },
    en: {
      summary: 'Configures terminal keybindings such as Shift+Enter.',
      what: 'Configures terminal keybindings for Shift+Enter and other shortcuts.\n\nOnly visible in terminals that need it, like VS Code, Cursor, Devin Desktop, Alacritty, or Zed.',
      wg: [{ title: 'Enable Shift+Enter in the VS Code or Cursor terminal', example: '/terminal-setup' }],
      wb: [{ title: 'A terminal that already handles the shortcuts natively', why: 'the command is not even shown there, because no setup is needed.', alternative: 'do nothing — the shortcuts already work' }],
    },
  },
  {
    slug: 'theme', name: '/theme',
    de: {
      summary: 'Ändert das Farbschema.',
      what: 'Ändert das Farbschema.\n\nEnthält eine auto-Option, die sich an den hellen oder dunklen Hintergrund deines Terminals anpasst, helle und dunkle Varianten, farbfehlsichtigkeits-taugliche (daltonisierte) Themes, ANSI-Themes, die die Farbpalette deines Terminals nutzen, sowie eigene Themes aus ~/.claude/themes/ oder von Plugins. Über "New custom theme…" legst du ein eigenes an.',
      wg: [{ title: 'Auf ein helles oder dunkles Theme umstellen', example: '/theme' }, { title: 'Ein farbfehlsichtigkeits-taugliches Theme wählen', example: '/theme' }],
      wb: [{ title: 'Terminal-Schriftart oder -Größe ändern', why: '/theme steuert nur die Farben von Claude Code, nicht die Darstellung des Terminals selbst.', alternative: 'die Einstellungen deines Terminal-Programms nutzen' }],
    },
    en: {
      summary: 'Changes the color theme.',
      what: 'Changes the color theme.\n\nIncludes an auto option that matches your terminal’s light or dark background, light and dark variants, colorblind-accessible (daltonized) themes, ANSI themes that use your terminal’s color palette, and any custom themes from ~/.claude/themes/ or plugins. Select "New custom theme…" to create one.',
      wg: [{ title: 'Switch to a light or dark theme', example: '/theme' }, { title: 'Pick a colorblind-accessible theme', example: '/theme' }],
      wb: [{ title: 'Change the terminal font or size', why: '/theme only controls Claude Code’s colors, not the terminal’s own rendering.', alternative: 'use your terminal app’s settings' }],
    },
  },
  {
    slug: 'tui', name: '/tui',
    de: {
      summary: 'Wählt den Terminal-Renderer und startet damit neu.',
      what: 'Wählt den Terminal-UI-Renderer und startet mit erhaltenem Gesprächsverlauf neu.\n\nfullscreen aktiviert den flimmerfreien Alt-Screen-Renderer. Ohne Argument gibt der Befehl den aktuell aktiven Renderer aus.',
      wg: [{ title: 'Auf den flimmerfreien Vollbild-Renderer wechseln', example: '/tui fullscreen' }, { title: 'Nachsehen, welcher Renderer gerade aktiv ist', example: '/tui' }],
      wb: [{ title: 'Erwartung, dass der Verlauf dabei verlorengeht', why: 'der Wechsel behält den Gesprächsverlauf; ein Zurücksetzen leistet der Befehl nicht.', alternative: '/clear' }],
    },
    en: {
      summary: 'Sets the terminal renderer and relaunches into it.',
      what: 'Sets the terminal UI renderer and relaunches into it with your conversation intact.\n\nfullscreen enables the flicker-free alt-screen renderer. With no argument, it prints the active renderer.',
      wg: [{ title: 'Switch to the flicker-free fullscreen renderer', example: '/tui fullscreen' }, { title: 'Check which renderer is currently active', example: '/tui' }],
      wb: [{ title: 'Expecting the conversation to be cleared', why: 'the switch keeps your conversation; the command does not reset it.', alternative: '/clear' }],
    },
  },
  {
    slug: 'ultrareview', name: '/ultrareview',
    de: {
      summary: 'Startet ein tiefes Mehr-Agenten-Code-Review in einer Cloud-Sandbox.',
      what: 'Startet ein tiefes Mehr-Agenten-Code-Review in einer Cloud-Sandbox.\n\nÜbergib eine PR-Referenz, um diesen Pull-Request zu prüfen, oder einen Branch-Namen, um die Vergleichsbasis zu ändern. Der bevorzugte Aufruf ist inzwischen /code-review ultra; /ultrareview bleibt als Alias bestehen. Auf Pro und Max sind 3 Läufe frei, danach werden Nutzungsguthaben fällig.',
      wg: [{ title: 'Einen Pull-Request gründlich prüfen lassen', example: '/ultrareview 42' }, { title: 'Gegen einen anderen Branch als Basis vergleichen', example: '/ultrareview main' }],
      wb: [{ title: 'Schnelle, lokale Durchsicht kleiner Änderungen', why: '/ultrareview startet ein aufwändiges Cloud-Review; für einen kurzen Blick ist das überdimensioniert.', alternative: 'Claude direkt bitten, den lokalen Diff durchzusehen' }],
    },
    en: {
      summary: 'Runs a deep, multi-agent code review in a cloud sandbox.',
      what: 'Runs a deep, multi-agent code review in a cloud sandbox.\n\nPass a PR reference to review that pull request, or a branch name to change the comparison base. The preferred invocation is now /code-review ultra, and /ultrareview remains as an alias. Includes 3 free runs on Pro and Max, then requires usage credits.',
      wg: [{ title: 'Have a pull request reviewed thoroughly', example: '/ultrareview 42' }, { title: 'Compare against a different base branch', example: '/ultrareview main' }],
      wb: [{ title: 'A quick local look at a small change', why: '/ultrareview launches a heavy cloud review; that is overkill for a quick glance.', alternative: 'ask Claude directly to look over the local diff' }],
    },
  },
  {
    slug: 'usage-credits', name: '/usage-credits',
    de: {
      summary: 'Verwaltet Nutzungsguthaben oder fordert es beim Admin an.',
      what: 'Verwaltet Nutzungsguthaben oder fordert es beim Admin an, wenn du an ein Limit stößt.\n\nAuf Pro und Max öffnet sich ein Dialog direkt in der CLI, um Guthaben zu kaufen, ein monatliches Ausgabelimit zu setzen und automatisches Nachladen einzurichten. Auf Versionen vor v2.1.207 und auf anderen Plänen öffnet sich stattdessen die Guthaben-Abrechnungsseite im Browser. Team- und Enterprise-Mitglieder ohne Abrechnungszugang senden nach Bestätigung eine Guthaben-Anfrage an ihren Admin.',
      wg: [{ title: 'Nach Erreichen des Limits Guthaben nachkaufen (Pro/Max)', example: '/usage-credits' }, { title: 'Ohne Abrechnungszugang Guthaben beim Admin anfragen', example: '/usage-credits' }],
      wb: [{ title: 'Nur den aktuellen Verbrauch einsehen', why: '/usage-credits verwaltet das Guthaben, es zeigt nicht die Nutzungsübersicht.', alternative: '/usage' }],
    },
    en: {
      summary: 'Configures usage credits or requests them from your admin.',
      what: 'Configures usage credits, or requests them from your admin, when you hit a limit.\n\nOn Pro and Max plans, opens an in-CLI dialog to buy usage credits, set a monthly spend limit, and configure auto-reload. On Claude Code versions before v2.1.207 and on other plans, it opens the usage-credits billing page in your browser instead. Team and Enterprise members without billing access send a usage-credits request to their admin after confirming in a dialog.',
      wg: [{ title: 'Buy more credits after hitting the limit (Pro/Max)', example: '/usage-credits' }, { title: 'Without billing access, request credits from your admin', example: '/usage-credits' }],
      wb: [{ title: 'Only view current usage', why: '/usage-credits manages credits; it does not show the usage overview.', alternative: '/usage' }],
    },
  },
  {
    slug: 'voice', name: '/voice',
    de: {
      summary: 'Schaltet die Sprachdiktierung ein oder aus.',
      what: 'Schaltet die Sprachdiktierung ein oder aus — oder aktiviert sie in einem bestimmten Modus.\n\nhold diktiert, solange die Taste gehalten wird; tap schaltet per Antippen um; off deaktiviert. Benötigt ein Claude.ai-Konto.',
      wg: [{ title: 'Statt zu tippen ins Terminal sprechen', example: '/voice tap' }, { title: 'Nur diktieren, solange eine Taste gehalten wird', example: '/voice hold' }],
      wb: [{ title: 'Ohne Claude.ai-Konto', why: 'die Sprachdiktierung setzt ein Claude.ai-Konto voraus.', alternative: 'weiter über die Tastatur eingeben' }],
    },
    en: {
      summary: 'Toggles voice dictation on or off.',
      what: 'Toggles voice dictation on or off, or enables it in a specific mode.\n\nhold dictates while you hold the key; tap toggles with a tap; off turns it off. Requires a Claude.ai account.',
      wg: [{ title: 'Speak into the terminal instead of typing', example: '/voice tap' }, { title: 'Dictate only while holding a key', example: '/voice hold' }],
      wb: [{ title: 'Without a Claude.ai account', why: 'voice dictation requires a Claude.ai account.', alternative: 'keep typing on the keyboard' }],
    },
  },
  {
    slug: 'web-setup', name: '/web-setup',
    de: {
      summary: 'Verbindet dein GitHub-Konto mit Claude Code im Web.',
      what: 'Verbindet dein GitHub-Konto mit Claude Code im Web über deine lokalen gh-CLI-Zugangsdaten.',
      wg: [{ title: 'Claude Code on the web mit dem eigenen GitHub-Konto koppeln', example: '/web-setup' }],
      wb: [{ title: 'Ohne installierte und angemeldete gh-CLI', why: 'der Befehl nutzt die lokalen gh-CLI-Zugangsdaten; ohne sie kann er nichts verbinden.', alternative: 'zuerst die gh-CLI installieren und mit "gh auth login" anmelden' }],
    },
    en: {
      summary: 'Connects your GitHub account to Claude Code on the web.',
      what: 'Connects your GitHub account to Claude Code on the web using your local gh CLI credentials.',
      wg: [{ title: 'Link Claude Code on the web to your GitHub account', example: '/web-setup' }],
      wb: [{ title: 'Without the gh CLI installed and signed in', why: 'the command uses your local gh CLI credentials; without them it cannot connect anything.', alternative: 'install the gh CLI first and sign in with "gh auth login"' }],
    },
  },
  {
    slug: 'workflows', name: '/workflows',
    de: {
      summary: 'Öffnet die Fortschrittsansicht laufender Workflows.',
      what: 'Öffnet die Fortschrittsansicht, in der du laufende und abgeschlossene Workflows beobachten, pausieren, fortsetzen oder speichern kannst.',
      wg: [{ title: 'Einen laufenden Workflow beobachten oder pausieren', example: '/workflows' }, { title: 'Einen abgeschlossenen Workflow zum späteren Wiederverwenden speichern', example: '/workflows' }],
      wb: [{ title: 'Es läuft gar kein Workflow', why: 'die Ansicht zeigt laufende und abgeschlossene Workflows; ohne einen bleibt sie leer.', alternative: 'zuerst einen Workflow starten' }],
    },
    en: {
      summary: 'Opens the progress view for running workflows.',
      what: 'Opens the workflow progress view to watch, pause, resume, or save running and completed workflows.',
      wg: [{ title: 'Watch or pause a running workflow', example: '/workflows' }, { title: 'Save a completed workflow to reuse later', example: '/workflows' }],
      wb: [{ title: 'No workflow is running at all', why: 'the view shows running and completed workflows; without one it stays empty.', alternative: 'start a workflow first' }],
    },
  },
];

for (const lang of ['de', 'en']) {
  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(daten.commands)) throw new Error('commands-Array fehlt');
  let neu = 0;
  for (const b of BEFEHLE) {
    const da = daten.commands.some((k) => k.platform === 'claude-code' && k.slug === b.slug);
    if (da) continue;
    const t = b[lang];
    daten.commands.push({
      platform: 'claude-code',
      slug: b.slug,
      name: b.name,
      summary: t.summary,
      what: t.what,
      whenGood: t.wg,
      whenBad: t.wb,
      sources: [{ title: QT[lang], url: URL }],
    });
    neu++;
  }
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, ': ', neu, 'neu, gesamt', daten.commands.length);
}
