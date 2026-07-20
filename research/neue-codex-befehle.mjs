/**
 * Qualitäts-Phase It. 170: 16 echte Codex-CLI-Befehle fehlten im Bestand.
 * Beim Inventar-Abgleich gegen die offizielle Referenz gefunden
 * (developers.openai.com/codex/cli/slash-commands, gefetcht 20.07.2026 via
 * r.jina.ai). Jede Beschreibung stammt aus der Befehlstabelle der Doku — die
 * dort dokumentierten Bedingungen ("when X is available") sind übernommen,
 * nichts erfunden.
 *
 * Nach dem Abgleich hatte Codex 0 erfundene Befehle; diese 16 waren die einzige
 * Lücke (unsere 16 bestehenden decken die restlichen Doku-Befehle ab).
 *
 * Schreibt DE + EN. es/fr/zh übersetzt danach ein eigener Schritt.
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL = 'https://developers.openai.com/codex/cli/slash-commands';
const QT = { de: 'Codex CLI Doku: Slash Commands', en: 'Codex CLI docs: Slash Commands' };

const BEFEHLE = [
  {
    slug: 'init', name: '/init',
    de: { summary: 'Erzeugt ein AGENTS.md-Gerüst für das aktuelle Projekt.',
      what: 'Erzeugt ein AGENTS.md-Gerüst für das aktuelle Projekt.\n\nAGENTS.md hält Projektregeln und Kontext fest, die Codex bei jeder Sitzung liest — vergleichbar mit CLAUDE.md bei Claude Code.',
      wg: [{ title: 'Ein neues Projekt für Codex einrichten', example: '/init' }],
      wb: [{ title: 'AGENTS.md existiert schon und ist gepflegt', why: '/init legt ein frisches Gerüst an und überschreibt bestehende Projektnotizen womöglich.', alternative: 'die vorhandene AGENTS.md direkt bearbeiten' }] },
    en: { summary: 'Generates an AGENTS.md scaffold for the current project.',
      what: 'Generates an AGENTS.md scaffold for the current project.\n\nAGENTS.md holds project rules and context that Codex reads each session — comparable to CLAUDE.md in Claude Code.',
      wg: [{ title: 'Set up a new project for Codex', example: '/init' }],
      wb: [{ title: 'AGENTS.md already exists and is maintained', why: '/init writes a fresh scaffold and may overwrite existing project notes.', alternative: 'edit the existing AGENTS.md directly' }] },
  },
  {
    slug: 'compact', name: '/compact',
    de: { summary: 'Fasst den Kontext des aktuellen Chats zusammen.',
      what: 'Fasst den Kontext des aktuellen Chats zusammen, um Platz im Kontextfenster freizugeben.\n\nCodex ersetzt den bisherigen Verlauf durch eine kompakte Zusammenfassung, sodass die Sitzung weiterlaufen kann, ohne dass ältere Nachrichten wegfallen.',
      wg: [{ title: 'Bei langem Chat Platz schaffen, ohne neu zu starten', example: '/compact' }],
      wb: [{ title: 'Der Chat ist noch kurz', why: 'das Zusammenfassen kostet Details; solange genug Kontext frei ist, bringt es nichts.', alternative: 'einfach weiterarbeiten' }] },
    en: { summary: 'Compacts the current chat’s context.',
      what: 'Compacts the current chat’s context to free space in the context window.\n\nCodex replaces the prior history with a compact summary so the session can continue without dropping older messages.',
      wg: [{ title: 'Make room in a long chat without starting over', example: '/compact' }],
      wb: [{ title: 'The chat is still short', why: 'compacting costs detail; while there is enough free context it gains nothing.', alternative: 'just keep working' }] },
  },
  {
    slug: 'reasoning', name: '/reasoning',
    de: { summary: 'Wählt die Denk-Intensität (Reasoning Effort) für den aktuellen Chat.',
      what: 'Wählt die Denk-Intensität (Reasoning Effort) für den aktuellen Chat.\n\nMehr Reasoning bedeutet gründlichere, aber langsamere und teurere Antworten; weniger ist schneller und günstiger. Die Wahl gilt für den laufenden Chat.',
      wg: [{ title: 'Bei einer kniffligen Aufgabe mehr Reasoning geben', example: '/reasoning' }, { title: 'Für einfache Aufgaben schneller und günstiger arbeiten', example: '/reasoning' }],
      wb: [{ title: 'Das Modell wechseln statt nur die Denk-Tiefe', why: '/reasoning ändert nur die Effort-Stufe, nicht das Modell.', alternative: '/model' }] },
    en: { summary: 'Chooses the reasoning effort for the current chat.',
      what: 'Chooses the reasoning effort for the current chat.\n\nMore reasoning means more thorough but slower and costlier answers; less is faster and cheaper. The choice applies to the running chat.',
      wg: [{ title: 'Give a tricky task more reasoning', example: '/reasoning' }, { title: 'Work faster and cheaper on simple tasks', example: '/reasoning' }],
      wb: [{ title: 'Switching the model rather than just the depth', why: '/reasoning changes only the effort level, not the model.', alternative: '/model' }] },
  },
  {
    slug: 'fast', name: '/fast',
    de: { summary: 'Schaltet eine Fast-Service-Stufe ein oder aus, sofern verfügbar.',
      what: 'Schaltet eine vom Katalog bereitgestellte Fast-Service-Stufe ein oder aus, sofern verfügbar.\n\nDie Fast-Stufe priorisiert Geschwindigkeit. Ob sie angeboten wird, hängt vom Modellkatalog ab.',
      wg: [{ title: 'Schnellere Antworten bevorzugen, wenn die Stufe angeboten wird', example: '/fast' }],
      wb: [{ title: 'Der Katalog bietet keine Fast-Stufe', why: '/fast wirkt nur, wenn eine Fast-Service-Stufe verfügbar ist.', alternative: 'ein schnelleres Modell über /model wählen' }] },
    en: { summary: 'Turns a Fast service tier on or off, when available.',
      what: 'Turns a catalog-provided Fast service tier on or off, when available.\n\nThe Fast tier prioritizes speed. Whether it is offered depends on the model catalog.',
      wg: [{ title: 'Prefer faster responses when the tier is offered', example: '/fast' }],
      wb: [{ title: 'The catalog offers no Fast tier', why: '/fast only takes effect when a Fast service tier is available.', alternative: 'pick a faster model via /model' }] },
  },
  {
    slug: 'personality', name: '/personality',
    de: { summary: 'Wählt, wie Codex antwortet, sofern das Modell Persönlichkeiten unterstützt.',
      what: 'Wählt, wie Codex antwortet, sofern das aktuelle Modell Persönlichkeiten unterstützt.\n\nDie Persönlichkeit beeinflusst Ton und Stil der Antworten, nicht deren fachlichen Inhalt.',
      wg: [{ title: 'Den Antwortstil an die eigene Vorliebe anpassen', example: '/personality' }],
      wb: [{ title: 'Das aktuelle Modell unterstützt keine Persönlichkeiten', why: '/personality ist nur verfügbar, wenn das Modell das Merkmal bietet.', alternative: 'ein Modell wählen, das Persönlichkeiten unterstützt' }] },
    en: { summary: 'Chooses how Codex responds, when the model supports personalities.',
      what: 'Chooses how Codex responds, when the current model supports personalities.\n\nThe personality shapes the tone and style of replies, not their technical content.',
      wg: [{ title: 'Match the reply style to your preference', example: '/personality' }],
      wb: [{ title: 'The current model does not support personalities', why: '/personality is only available when the model offers the feature.', alternative: 'pick a model that supports personalities' }] },
  },
  {
    slug: 'memories', name: '/memories',
    de: { summary: 'Legt fest, ob der Chat Erinnerungen nutzen oder anlegen darf, sofern Memories verfügbar ist.',
      what: 'Legt fest, ob der Chat Erinnerungen (Memories) nutzen oder anlegen darf, sofern die Funktion verfügbar ist.\n\nMemories halten Informationen über Sitzungen hinweg fest. Der Befehl steuert nur, ob der aktuelle Chat sie verwenden darf.',
      wg: [{ title: 'Für einen sensiblen Chat das Anlegen von Erinnerungen abschalten', example: '/memories' }],
      wb: [{ title: 'Memories ist in deiner Umgebung nicht verfügbar', why: 'der Befehl greift nur, wenn die Memories-Funktion angeboten wird.', alternative: 'ohne Memories weiterarbeiten' }] },
    en: { summary: 'Sets whether the chat may use or create memories, when Memories is available.',
      what: 'Configures whether the chat can use or generate memories, when the feature is available.\n\nMemories carry information across sessions. The command only controls whether the current chat may use them.',
      wg: [{ title: 'Turn off memory creation for a sensitive chat', example: '/memories' }],
      wb: [{ title: 'Memories is not available in your environment', why: 'the command only applies when the Memories feature is offered.', alternative: 'continue without Memories' }] },
  },
  {
    slug: 'ide-context', name: '/ide-context',
    de: { summary: 'Schaltet den automatischen IDE-Kontext ein oder aus.',
      what: 'Schaltet den automatischen IDE-Kontext ein oder aus.\n\nBei eingeschaltetem IDE-Kontext bezieht Codex Informationen aus der Entwicklungsumgebung (etwa geöffnete Dateien) automatisch mit ein.',
      wg: [{ title: 'Codex die geöffneten Dateien der IDE mitlesen lassen', example: '/ide-context' }],
      wb: [{ title: 'Codex läuft ohne verbundene IDE im reinen Terminal', why: 'ohne IDE gibt es keinen IDE-Kontext, den der Schalter ein- oder ausschalten könnte.', alternative: 'Dateien gezielt selbst nennen' }] },
    en: { summary: 'Turns automatic IDE context on or off.',
      what: 'Turns automatic IDE context on or off.\n\nWith IDE context on, Codex automatically pulls in information from the development environment (such as open files).',
      wg: [{ title: 'Let Codex read the IDE’s open files', example: '/ide-context' }],
      wb: [{ title: 'Codex runs in a plain terminal with no connected IDE', why: 'without an IDE there is no IDE context for the toggle to switch.', alternative: 'name the files you need yourself' }] },
  },
  {
    slug: 'feedback', name: '/feedback',
    de: { summary: 'Öffnet den Feedback-Dialog, optional mit Logs.',
      what: 'Öffnet den Feedback-Dialog, um Rückmeldungen zu senden und optional Logs beizulegen.',
      wg: [{ title: 'Ein Problem oder einen Vorschlag an das Codex-Team melden', example: '/feedback' }],
      wb: [{ title: 'Es geht um eine allgemeine Frage, kein Feedback', why: '/feedback ist für Rückmeldungen an das Team, nicht für Hilfe im Chat.', alternative: 'die Frage direkt im Chat stellen' }] },
    en: { summary: 'Opens the feedback dialog, optionally with logs.',
      what: 'Opens the feedback dialog to submit feedback and optionally include logs.',
      wg: [{ title: 'Report an issue or suggestion to the Codex team', example: '/feedback' }],
      wb: [{ title: 'It is a general question, not feedback', why: '/feedback is for messages to the team, not for help in the chat.', alternative: 'ask the question directly in the chat' }] },
  },
  {
    slug: 'approve', name: '/approve',
    de: { summary: 'Genehmigt einen erneuten Versuch nach einer Ablehnung durch die automatische Prüfung.',
      what: 'Genehmigt einen erneuten Versuch nach einer kürzlichen Ablehnung durch die automatische Prüfung — nur wenn die automatische Prüfung aktiv ist.',
      wg: [{ title: 'Einen von der Auto-Prüfung geblockten Schritt doch zulassen', example: '/approve' }],
      wb: [{ title: 'Die automatische Prüfung ist gar nicht aktiv', why: '/approve wirkt nur, wenn eine automatische Ablehnung vorliegt.', alternative: 'die Berechtigungen über /permissions anpassen' }] },
    en: { summary: 'Approves one retry after an automatic-review denial.',
      what: 'Approves one retry of a recent automatic-review denial, only when automatic review is active.',
      wg: [{ title: 'Allow a step the auto-review blocked', example: '/approve' }],
      wb: [{ title: 'Automatic review is not active at all', why: '/approve only applies when there is an automatic denial to retry.', alternative: 'adjust permissions via /permissions' }] },
  },
  {
    slug: 'side', name: '/side',
    de: { summary: 'Startet einen temporären Neben-Chat, ohne den Haupt-Chat zu stören.',
      what: 'Startet einen temporären Neben-Chat, ohne den Haupt-Chat zu unterbrechen.\n\nDer Neben-Chat eignet sich für eine schnelle Zwischenfrage, die nicht in den Verlauf der Hauptaufgabe einfließen soll.',
      wg: [{ title: 'Eine Zwischenfrage stellen, ohne den Hauptfaden zu verwässern', example: '/side' }],
      wb: [{ title: 'Die Antwort soll dauerhaft in den Hauptverlauf', why: 'der Neben-Chat ist temporär und getrennt vom Haupt-Chat.', alternative: 'die Frage direkt im Haupt-Chat stellen' }] },
    en: { summary: 'Starts a temporary side chat without disturbing the main chat.',
      what: 'Starts a temporary side chat without interrupting the main chat.\n\nThe side chat suits a quick aside that should not feed into the main task’s history.',
      wg: [{ title: 'Ask an aside without diluting the main thread', example: '/side' }],
      wb: [{ title: 'The answer should stay in the main history', why: 'the side chat is temporary and separate from the main chat.', alternative: 'ask directly in the main chat' }] },
  },
  {
    slug: 'project', name: '/project',
    de: { summary: 'Wählt ein Projekt für neue Chats.',
      what: 'Wählt ein Projekt für neue Chats.\n\nDas gewählte Projekt bestimmt den Ausgangskontext, mit dem neu gestartete Chats beginnen.',
      wg: [{ title: 'Neue Chats an ein bestimmtes Projekt binden', example: '/project' }],
      wb: [{ title: 'Nur den aktuellen Chat betreffen', why: '/project gilt für neu gestartete Chats, nicht rückwirkend für den laufenden.', alternative: 'den laufenden Chat unverändert weiterführen' }] },
    en: { summary: 'Chooses a project for new chats.',
      what: 'Chooses a project for new chats.\n\nThe selected project sets the starting context that newly started chats begin with.',
      wg: [{ title: 'Tie new chats to a specific project', example: '/project' }],
      wb: [{ title: 'Only affecting the current chat', why: '/project applies to newly started chats, not retroactively to the running one.', alternative: 'keep the running chat as it is' }] },
  },
  {
    slug: 'cloud', name: '/cloud',
    de: { summary: 'Führt den Chat in der Cloud aus, sofern Cloud-Ausführung verfügbar ist.',
      what: 'Führt den Chat in der Cloud aus, sofern Cloud-Ausführung verfügbar ist.\n\nIn der Cloud läuft die Arbeit auf entfernten Ressourcen statt auf deinem Rechner.',
      wg: [{ title: 'Rechenlast von der lokalen Maschine in die Cloud verlagern', example: '/cloud' }],
      wb: [{ title: 'Die Aufgabe braucht deine lokalen Dateien direkt', why: 'in der Cloud liegt der Arbeitsplatz nicht auf deinem Rechner.', alternative: '/local' }] },
    en: { summary: 'Runs the chat in the cloud, when cloud execution is available.',
      what: 'Runs the chat in the cloud, when cloud execution is available.\n\nIn the cloud, work runs on remote resources instead of your machine.',
      wg: [{ title: 'Move compute off the local machine into the cloud', example: '/cloud' }],
      wb: [{ title: 'The task needs your local files directly', why: 'in the cloud the workspace is not on your machine.', alternative: '/local' }] },
  },
  {
    slug: 'local', name: '/local',
    de: { summary: 'Führt den Chat in deinem lokalen Arbeitsbereich aus.',
      what: 'Führt den Chat in deinem lokalen Arbeitsbereich aus.\n\nGegenstück zu /cloud: die Arbeit läuft auf deinem Rechner mit direktem Zugriff auf deine Dateien.',
      wg: [{ title: 'Mit den lokalen Projektdateien direkt arbeiten', example: '/local' }],
      wb: [{ title: 'Die lokale Maschine ist zu schwach für die Aufgabe', why: 'lokal läuft alles auf deinem Rechner.', alternative: '/cloud' }] },
    en: { summary: 'Runs the chat in your local workspace.',
      what: 'Runs the chat in your local workspace.\n\nThe counterpart to /cloud: work runs on your machine with direct access to your files.',
      wg: [{ title: 'Work directly with local project files', example: '/local' }],
      wb: [{ title: 'The local machine is too weak for the task', why: 'locally everything runs on your machine.', alternative: '/cloud' }] },
  },
  {
    slug: 'cloud-environment', name: '/cloud-environment',
    de: { summary: 'Wählt die Cloud-Umgebung für den Chat.',
      what: 'Wählt die Cloud-Umgebung für den Chat.\n\nBestimmt, in welcher konfigurierten Cloud-Umgebung ein Cloud-Chat läuft.',
      wg: [{ title: 'Zwischen mehreren Cloud-Umgebungen umschalten', example: '/cloud-environment' }],
      wb: [{ title: 'Der Chat läuft lokal', why: 'eine Cloud-Umgebung ist nur bei Cloud-Ausführung relevant.', alternative: 'zuerst mit /cloud in die Cloud wechseln' }] },
    en: { summary: 'Chooses the cloud environment for the chat.',
      what: 'Chooses the cloud environment for the chat.\n\nDetermines which configured cloud environment a cloud chat runs in.',
      wg: [{ title: 'Switch between several cloud environments', example: '/cloud-environment' }],
      wb: [{ title: 'The chat runs locally', why: 'a cloud environment only matters under cloud execution.', alternative: 'switch to the cloud with /cloud first' }] },
  },
  {
    slug: 'worktree', name: '/worktree',
    de: { summary: 'Führt den Chat in einem neuen Git-Worktree aus.',
      what: 'Führt den Chat in einem neuen Git-Worktree aus.\n\nEin Worktree ist eine zweite Arbeitskopie desselben Repositorys — so bleiben Änderungen des Chats von deinem Hauptzweig getrennt.',
      wg: [{ title: 'Codex isoliert arbeiten lassen, ohne den Hauptzweig anzufassen', example: '/worktree' }],
      wb: [{ title: 'Das Projekt ist kein Git-Repository', why: 'ein Worktree setzt Git voraus.', alternative: 'im normalen Arbeitsbereich bleiben' }] },
    en: { summary: 'Runs the chat in a new Git worktree.',
      what: 'Runs the chat in a new Git worktree.\n\nA worktree is a second working copy of the same repository — so the chat’s changes stay separate from your main branch.',
      wg: [{ title: 'Let Codex work in isolation without touching the main branch', example: '/worktree' }],
      wb: [{ title: 'The project is not a Git repository', why: 'a worktree requires Git.', alternative: 'stay in the normal workspace' }] },
  },
  {
    slug: 'quit', name: '/quit',
    de: { summary: 'Verlässt die Sitzung.',
      what: 'Verlässt die Sitzung und schließt die CLI. Gleichbedeutend mit /exit — beide Befehle beenden die Sitzung.',
      wg: [{ title: 'Die Codex-Sitzung beenden', example: '/quit' }],
      wb: [{ title: 'Nur den Kontext leeren, aber weiterarbeiten', why: '/quit beendet die ganze Sitzung.', alternative: '/compact zum Freiräumen oder einen neuen Chat starten' }] },
    en: { summary: 'Exits the session.',
      what: 'Exits the session and closes the CLI. Equivalent to /exit — both commands end the session.',
      wg: [{ title: 'End the Codex session', example: '/quit' }],
      wb: [{ title: 'Only clear the context but keep working', why: '/quit ends the whole session.', alternative: '/compact to free space, or start a new chat' }] },
  },
];

for (const lang of ['de', 'en']) {
  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (!Array.isArray(daten.commands)) throw new Error('commands-Array fehlt');
  let neu = 0;
  for (const b of BEFEHLE) {
    if (daten.commands.some((k) => k.platform === 'codex-cli' && k.slug === b.slug)) continue;
    const t = b[lang];
    daten.commands.push({
      platform: 'codex-cli', slug: b.slug, name: b.name,
      summary: t.summary, what: t.what, whenGood: t.wg, whenBad: t.wb,
      sources: [{ title: QT[lang], url: URL }],
    });
    neu++;
  }
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, ':', neu, 'neu, gesamt', daten.commands.length);
}
