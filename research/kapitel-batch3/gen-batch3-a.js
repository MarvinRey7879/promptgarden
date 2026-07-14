// Generates batch3-a.json: 5 new lexicon chapters, DE + EN.
// Sources researched + curl-verified (all 200) on 2026-07-13/14.
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Shared source definitions (URLs identical DE/EN, titles localized)
// ---------------------------------------------------------------------------
const SRC = {
  skills: "https://code.claude.com/docs/en/skills",
  slash: "https://code.claude.com/docs/en/slash-commands",
  memory: "https://code.claude.com/docs/en/memory",
  agentTeams: "https://code.claude.com/docs/en/agent-teams",
  multiAgentBlog: "https://www.anthropic.com/engineering/multi-agent-research-system",
  subagents: "https://code.claude.com/docs/en/sub-agents",
  worktrees: "https://code.claude.com/docs/en/worktrees",
  headless: "https://code.claude.com/docs/en/headless",
  ghActions: "https://code.claude.com/docs/en/github-actions",
  ghSecrets: "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions",
  bestPractices: "https://code.claude.com/docs/en/best-practices",
  promptBest: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  promptOverview: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
  codeReview: "https://code.claude.com/docs/en/code-review",
  commands: "https://code.claude.com/docs/en/commands"
};

// ---------------------------------------------------------------------------
// DE entries
// ---------------------------------------------------------------------------
const de = [
  // ------------------------------------------------------------ 1
  {
    slug: "eigene-befehle-schreiben",
    title: "Eigene Befehle schreiben: Wiederkehrende Prompts speichern",
    category: "guide",
    difficulty: 2,
    minutes: 5,
    xp: 40,
    teaser: "Ein eigener Slash-Befehl ist eine gespeicherte Markdown-Datei: einmal geschrieben, reicht danach /dein-befehl statt einem langen Prompt.",
    body: "## Die Grundidee\nTippst du denselben Prompt immer wieder – \"Fasse meine Änderungen zusammen\", \"Prüfe diese Datei\" –, kannst du ihn als eigenen Befehl speichern. Claude Code kennt dafür zwei Formate: eine Markdown-Datei unter `.claude/commands/` oder einen Skill-Ordner unter `.claude/skills/`. Beide erzeugen denselben Slash-Befehl: `deploy.md` und `deploy/SKILL.md` werden beide zu `/deploy`. Custom Commands wurden offiziell in Skills zusammengeführt; alte Command-Dateien funktionieren weiter.\n\n## Aufbau der Datei\nDie Datei beginnt optional mit YAML-Frontmatter zwischen zwei `---`-Zeilen. Das wichtigste Feld ist `description`: Daran erkennt Claude, wann der Befehl zur Aufgabe passt, und kann ihn dann sogar automatisch laden. Nach dem Frontmatter folgt der eigentliche Prompt-Text.\n\n## Argumente\nMit dem Platzhalter `$ARGUMENTS` übernimmst du alles, was du hinter den Befehl tippst: Bei `/fix-issue 123` wird `$ARGUMENTS` zu `123`. Einzelne Argumente erreichst du 0-basiert über `$0`, `$1` und so weiter.\n\n## Eigener Befehl oder CLAUDE.md-Regel?\nDie Faustregel aus der Doku: Regeln, die immer gelten sollen (\"nie auf main pushen\"), gehören in die CLAUDE.md – sie wird bei jeder Session komplett geladen. Prozeduren, die du nur manchmal brauchst, gehören in einen Befehl oder Skill: Deren Text lädt erst beim Aufruf und kostet vorher fast keinen Kontext. Wächst ein CLAUDE.md-Abschnitt zu einer ganzen Prozedur heran, ist das laut Doku genau der Moment für einen eigenen Befehl.",
    bodyDetail: "## Nützliche Frontmatter-Felder\nNeben `description` gibt es weitere optionale Felder. `argument-hint` zeigt beim Tippen an, welche Argumente erwartet werden (z. B. `[issue-nummer]`). `allowed-tools` erlaubt dem Befehl bestimmte Werkzeuge ohne Rückfrage, etwa `Bash(git add *)` für einen Commit-Befehl. `model` wechselt für die Dauer des Befehls das Modell. Alle Felder sind optional – nur `description` wird empfohlen, damit Claude weiß, wann der Befehl passt.\n\n## Wer darf den Befehl auslösen?\nStandardmäßig können sowohl du als auch Claude einen Skill aufrufen. Zwei Felder schränken das ein: `disable-model-invocation: true` bedeutet, dass nur du den Befehl auslösen kannst – laut Doku sinnvoll für Aktionen mit Nebenwirkungen wie `/deploy` oder `/commit`, bei denen nicht das Modell entscheiden soll, wann sie laufen. Umgekehrt versteckt `user-invocable: false` den Befehl aus dem Menü: Er ist dann reines Hintergrundwissen, das nur Claude bei Bedarf lädt.\n\n## Live-Daten in den Prompt holen\nEin Skill kann mit der Syntax !`befehl` Shell-Kommandos ausführen, bevor der Text ans Modell geht. Die Ausgabe ersetzt den Platzhalter: Ein Review-Befehl kann so den aktuellen `git diff` direkt in den Prompt einbetten, statt dass Claude ihn erst selbst abfragen muss. Das ist Vorverarbeitung – Claude sieht nur das fertige Ergebnis.\n\n## Ein Missverständnis\nEin eigener Befehl ist kein Programm, das etwas ausführt. Er ist im Kern eine gespeicherte Nachricht: Beim Aufruf wird der Dateitext (mit ersetzten Platzhaltern) als Prompt an das Modell geschickt – so, als hättest du ihn selbst getippt. Was danach passiert, entscheidet das Modell wie bei jeder anderen Eingabe auch. Wer harte Garantien braucht (\"das darf nie passieren\"), braucht dafür Hooks oder Berechtigungsregeln, keinen Befehl.",
    example: "Datei `.claude/skills/fix-issue/SKILL.md`:\n---\ndescription: Behebt ein GitHub-Issue anhand der Nummer\ndisable-model-invocation: true\n---\n\nBehebe GitHub-Issue $ARGUMENTS: Lies das Issue, implementiere den Fix, schreibe Tests.\n\nAufruf danach: `/fix-issue 123`",
    related: ["claude-code-befehle", "claude-skills", "claude-md"],
    quiz: {
      question: "Was passiert technisch, wenn du einen eigenen Befehl wie `/fix-issue 123` aufrufst?",
      options: [
        "Claude Code kompiliert die Datei zu einem Programm und führt es aus",
        "GitHub schließt automatisch das Issue 123",
        "Der Text der Befehls-Datei wird als Prompt ans Modell geschickt, $ARGUMENTS wird durch '123' ersetzt",
        "Die Datei wird in die CLAUDE.md kopiert"
      ],
      correct: 2,
      explain: "Ein eigener Befehl ist eine gespeicherte Nachricht: Beim Aufruf wird der Dateitext mit ersetzten Platzhaltern als Prompt an das Modell geschickt – so, als hättest du ihn selbst getippt."
    },
    sources: [
      { title: "Claude Code Doku: Skills (inkl. Custom Commands)", url: SRC.skills },
      { title: "Claude Code Doku: Slash Commands", url: SRC.slash },
      { title: "Claude Code Doku: CLAUDE.md und Memory", url: SRC.memory }
    ],
    exercise: {
      task: "Baue deinen ersten eigenen Befehl und teste beide Aufruf-Wege.",
      steps: [
        "Lege die Datei .claude/skills/zusammenfassen/SKILL.md an – mit einer description ('Fasst uncommittete Änderungen zusammen') und dem Prompt 'Fasse den aktuellen git diff in 3 Stichpunkten zusammen.'",
        "Starte Claude Code, ändere eine Datei und rufe /zusammenfassen direkt auf.",
        "Frage danach in normaler Sprache 'Was habe ich geändert?' und beobachte, ob Claude den Skill von selbst lädt."
      ],
      selfCheck: [
        "Weißt du, warum das description-Feld für das automatische Laden entscheidend ist?",
        "Kannst du erklären, wann derselbe Text besser in die CLAUDE.md gehört hätte?",
        "Hast du verstanden, wie du mit $ARGUMENTS Argumente übernehmen würdest?"
      ]
    }
  },
  // ------------------------------------------------------------ 2
  {
    slug: "agent-teams",
    title: "Agent Teams: Mehrere Agenten, ein Projekt",
    category: "konzept",
    difficulty: 3,
    minutes: 5,
    xp: 60,
    teaser: "Mehrere Claude-Code-Instanzen können als Team an einem Projekt arbeiten – mit Rollen, geteilter Aufgabenliste und deutlich höheren Token-Kosten.",
    body: "## Zwei Wege zu mehreren Agenten\nDer manuelle Weg: Du startest mehrere Claude-Code-Sessions parallel, jede in einem eigenen Git-Worktree, damit sich die Änderungen nicht in die Quere kommen. Den koordinierten Weg bietet Claude Code mit Agent Teams: Eine Session wird zum Team-Lead, der Aufgaben verteilt und Ergebnisse zusammenführt; Teammates arbeiten unabhängig, jeder mit eigenem Kontextfenster.\n\n## Wie ein Team arbeitet\nDas Team koordiniert sich über eine geteilte Aufgabenliste: Der Lead legt Aufgaben an, Teammates übernehmen sie oder holen sich selbst die nächste freie. Anders als Subagents können sich Teammates direkt untereinander Nachrichten schicken – etwa um Hypothesen gegenseitig zu widerlegen. Agent Teams sind experimentell und standardmäßig deaktiviert (Stand: Juli 2026); sie müssen per Umgebungsvariable eingeschaltet werden.\n\n## Typische Rollen\nBewährte Muster aus der Doku: Ein Writer implementiert, ein Reviewer prüft mit frischem Blick. Oder mehrere Reviewer prüfen denselben Pull Request aus verschiedenen Blickwinkeln (Sicherheit, Performance, Testabdeckung). Oder mehrere Agenten verfolgen beim Debugging konkurrierende Hypothesen und versuchen, sich gegenseitig zu widerlegen.\n\n## Die Kosten-Warnung\nJeder Teammate ist eine eigene Claude-Instanz mit eigenem Kontextfenster – die Kosten skalieren mit der Teamgröße. Anthropics Engineering-Blog beziffert Multi-Agent-Systeme auf rund das 15-Fache der Tokens eines normalen Chats. Für sequenzielle Aufgaben oder Änderungen an derselben Datei ist eine einzelne Session meist die bessere Wahl.",
    bodyDetail: "## Teams vs. Subagents\nBeide parallelisieren Arbeit, aber unterschiedlich: Ein Subagent läuft innerhalb deiner Session und kann nur ein Ergebnis an den Aufrufer zurückmelden. Ein Teammate ist eine vollwertige, unabhängige Session – du kannst ihn direkt ansprechen, ohne über den Lead zu gehen, und Teammates kommunizieren miteinander. Die Doku-Faustregel: Subagents für fokussierte Arbeitspakete, bei denen nur das Ergebnis zählt; Teams, wenn die Beteiligten Zwischenergebnisse teilen, sich gegenseitig hinterfragen und selbst koordinieren sollen.\n\n## Der Forschungs-Beleg für Orchestrierung\nAnthropics Multi-Agent-Research-System (Engineering-Blog) nutzt das Orchestrator-Worker-Muster: Ein Lead-Agent zerlegt die Anfrage und startet drei bis fünf Subagenten parallel. In Anthropics interner Research-Eval schlug dieses Setup einen einzelnen Agenten deutlich – vor allem bei Aufgaben, die sich in unabhängige Teilfragen zerlegen lassen. Derselbe Blog nennt aber auch die Grenze: Aufgaben, bei denen alle Agenten denselben Kontext bräuchten oder stark voneinander abhängen, eignen sich schlecht – dazu zählt viel klassische Programmierarbeit.\n\n## Praxisregeln aus der Doku\nDrei bis fünf Teammates sind ein guter Start; mehr erhöht vor allem den Koordinationsaufwand, ohne die Arbeit proportional zu beschleunigen. Jeder Teammate sollte eigene Dateien besitzen, denn zwei Agenten in derselben Datei überschreiben sich gegenseitig. Für den Einstieg empfiehlt die Doku Aufgaben ohne Code-Änderungen – etwa Reviews oder Recherche –, weil sie den Nutzen paralleler Arbeit zeigen, ohne dass sich Änderungen in die Quere kommen. Und: Teams nicht zu lange unbeobachtet laufen lassen – regelmäßig reinschauen, umsteuern und Ergebnisse zusammenführen.\n\n## Ein Missverständnis\nMehr Agenten bedeuten nicht automatisch bessere Ergebnisse. Der Mehrwert entsteht nur, wenn die Aufgabe echt parallelisierbar ist. Ein Team, das eine sequenzielle Aufgabe bearbeitet, produziert vor allem Koordinations-Overhead und Token-Kosten – die Doku empfiehlt für solche Fälle explizit die einzelne Session oder Subagents.",
    example: "Prompt an den Team-Lead: 'Spawne drei Teammates für den Review von PR #142 – einer prüft Sicherheit, einer Performance, einer Testabdeckung. Sammle danach alle Befunde ein und fasse sie zusammen.'",
    related: ["subagents", "multi-agent-patterns", "git-worktrees", "kosten-kontrolle-agenten"],
    quiz: {
      question: "Was unterscheidet Agent Teams von Subagents in Claude Code?",
      options: [
        "Teammates teilen eine Aufgabenliste und können direkt miteinander kommunizieren – Subagents melden nur ihr Ergebnis an den Aufrufer zurück",
        "Subagents sind immer teurer als Agent Teams",
        "Agent Teams brauchen kein Sprachmodell",
        "Subagents können keine Dateien lesen"
      ],
      correct: 0,
      explain: "Subagents laufen innerhalb einer Session und liefern nur ihr Ergebnis zurück. Teammates sind eigene Sessions mit geteilter Aufgabenliste und direkter Kommunikation – dafür kosten sie deutlich mehr Tokens."
    },
    sources: [
      { title: "Claude Code Doku: Agent Teams", url: SRC.agentTeams },
      { title: "Anthropic Engineering: Multi-Agent Research System", url: SRC.multiAgentBlog },
      { title: "Claude Code Doku: Subagents", url: SRC.subagents },
      { title: "Claude Code Doku: Git Worktrees", url: SRC.worktrees }
    ]
  },
  // ------------------------------------------------------------ 3
  {
    slug: "ci-cd-mit-agenten",
    title: "CI/CD mit Agenten: KI in der Pipeline",
    category: "guide",
    difficulty: 2,
    minutes: 5,
    xp: 40,
    teaser: "Mit claude -p und GitHub Actions laufen Agenten automatisch in der Pipeline – ohne Rückfragen. Deshalb brauchen sie Gates: Tests entscheiden, nicht der Agent.",
    body: "## Der Baustein: Headless-Aufrufe\nIn einer Pipeline gibt es kein Chat-Fenster. Der Einstieg ist deshalb der Headless-Modus: `claude -p \"Prompt\"` arbeitet eine Aufgabe ab und beendet sich. Daten lassen sich hineinpipen (`git diff main | claude -p \"...\"`), und `--output-format json` liefert ein maschinenlesbares Ergebnis inklusive Kosten – gut für Skripte.\n\n## GitHub Actions\nFür GitHub gibt es eine offizielle Action (claude-code-action): Sie reagiert auf @claude-Erwähnungen in Issues und PRs oder läuft mit festem Prompt automatisch – etwa als Review bei jedem neuen Pull Request. Der API-Key gehört dabei zwingend in GitHub Secrets, nie ins Repository.\n\n## Gates: Tests vor Vertrauen\nDie wichtigste Regel: Agent-Output ist ungeprüfter Code. Er muss durch dieselben Gates wie menschlicher Code – Tests, Linter, Build –, bevor irgendetwas gemerged wird. Praktisch heißt das: Der Agent erstellt einen Pull Request, statt direkt zu pushen, und ein Mensch reviewt vor dem Merge.\n\n## Die Risiken\nErstens: keine Rückfragen. Was der Agent nicht entscheiden kann, bricht ab oder wird falsch entschieden. Zweitens: Secrets – ein Agent in CI hat Zugriff auf alles, was der Runner sieht; Berechtigungen deshalb so eng wie möglich halten. Drittens: Kosten – ohne Limits wie `--max-turns` und Workflow-Timeouts können Läufe unbemerkt teuer werden.",
    bodyDetail: "## Reproduzierbare Läufe mit --bare\nStandardmäßig lädt auch ein `claude -p`-Aufruf die lokale Konfiguration: Hooks, Skills, MCP-Server, CLAUDE.md. In CI ist das ein Problem, weil Läufe dann je nach Maschine unterschiedlich ausfallen können. Das `--bare`-Flag schaltet diese Auto-Erkennung ab: Es lädt nur, was du explizit per Flag mitgibst. Die Doku empfiehlt es ausdrücklich für Skripte und CI.\n\n## Rechte präzise zuschneiden\nStatt dem Agenten alles zu erlauben, listest du mit `--allowedTools` genau die Werkzeuge auf, die der Job braucht – zum Beispiel `\"Bash(git diff *),Read\"` für einen Review-Job, der nichts ändern soll. Die Syntax erlaubt Präfix-Muster: `Bash(git diff *)` erlaubt alle git-diff-Varianten, aber keinen anderen Shell-Befehl.\n\n## Kostenkontrolle\nJeder Lauf verbraucht GitHub-Actions-Minuten und API-Tokens. Die Doku empfiehlt konkrete Limits: `--max-turns` gegen endlose Iterationen, Workflow-Timeouts gegen hängende Jobs und Concurrency-Regeln gegen zu viele parallele Läufe.\n\n## Automatische Reviews richtig einordnen\nAnthropic bietet zusätzlich ein gehostetes Code Review an, das PRs mit mehreren parallelen Agenten prüft und Befunde als Inline-Kommentare mit Schweregrad postet. Wichtig: Es blockiert den Merge bewusst nicht – der Check läuft immer als \"neutral\" durch. Wer Merges an Befunde koppeln will, muss das selbst in der eigenen CI auswerten. Das unterstreicht das Grundprinzip: Die KI liefert Hinweise, die Entscheidung bleibt bei Tests und Menschen.\n\n## Ein Missverständnis\nEin Review-Agent in der Pipeline ersetzt keine Tests – er ist selbst Output, der geprüft werden muss. Ein Agent kann Bugs übersehen oder Falsches bemängeln. Deterministische Checks (Tests, Linter, Build) bleiben die harte Wahrheit; der Agent ergänzt sie um Hinweise, die ein Mensch bewertet.",
    example: "# GitHub-Actions-Schritt (gekürzt):\n- uses: anthropics/claude-code-action@v1\n  with:\n    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}\n    prompt: \"Review diesen PR auf Bugs. Poste Befunde als Kommentar.\"\n    claude_args: \"--max-turns 10\"",
    related: ["headless-non-interactive", "guardrails-fuer-agenten", "git-github-basics", "evals"],
    quiz: {
      question: "Warum gilt in CI/CD die Regel 'Tests vor Vertrauen' für Agent-Output?",
      options: [
        "Weil Tests den Agenten schneller machen",
        "Weil Agent-Output ungeprüfter Code ist, der wie menschlicher Code durch Tests, Linter und Review muss, bevor er gemerged wird",
        "Weil Agenten ohne Tests keine API-Anfragen stellen können",
        "Weil GitHub Actions sonst nicht startet"
      ],
      correct: 1,
      explain: "Ein Agent in der Pipeline kann Fehler machen, und niemand sieht live zu. Deterministische Gates (Tests, Build, Review vor Merge) fangen das ab – der Agent erstellt deshalb PRs, statt direkt zu pushen."
    },
    sources: [
      { title: "Claude Code Doku: Claude Code programmatisch ausführen (Headless)", url: SRC.headless },
      { title: "Claude Code Doku: GitHub Actions", url: SRC.ghActions },
      { title: "GitHub Doku: Secrets in GitHub Actions", url: SRC.ghSecrets },
      { title: "Claude Code Doku: Code Review", url: SRC.codeReview }
    ]
  },
  // ------------------------------------------------------------ 4
  {
    slug: "prompt-strukturen",
    title: "Prompt-Strukturen: Aufbau, der Ergebnisse verbessert",
    category: "prompt-pattern",
    difficulty: 1,
    minutes: 4,
    xp: 20,
    teaser: "Gute Prompts haben eine erkennbare Struktur: klare Aufgabe, getrennte Kontext-Abschnitte, Beispiele und ein vorgegebenes Ausgabeformat.",
    body: "## Klar und direkt\nDie wichtigste Regel aus Anthropics Prompt-Doku: Sei präzise, was du willst. Der Test dafür: Zeig deinen Prompt einem Kollegen ohne Vorwissen. Wenn der verwirrt wäre, ist es das Modell auch. Nummerierte Schritte helfen, wenn Reihenfolge oder Vollständigkeit zählt.\n\n## Abschnitte trennen – mit XML-Tags\nSobald ein Prompt mehrere Inhaltsarten mischt (Anweisungen, Kontext, Beispiele, Eingabedaten), empfiehlt Anthropic XML-Tags: `<instructions>`, `<context>`, `<example>`. Jede Inhaltsart bekommt ihr eigenes Tag – so kann das Modell eindeutig auseinanderhalten, was Anweisung ist und was nur Beispiel. Wichtig sind konsistente, beschreibende Tag-Namen.\n\n## Eine Rolle vergeben\nSchon ein Satz im System-Prompt (\"Du bist ein erfahrener Python-Entwickler\") fokussiert Verhalten und Ton spürbar.\n\n## Beispiele zeigen (Few-Shot)\nBeispiele sind laut Doku eines der zuverlässigsten Mittel, Format und Stil zu steuern. Empfohlen: 3 bis 5 Beispiele, relevant für deinen echten Anwendungsfall und unterschiedlich genug, jeweils in `<example>`-Tags.\n\n## Ausgabeformat vorgeben\nSag, was das Modell tun soll – nicht, was es lassen soll: \"Antworte in Fließtext\" funktioniert besser als \"Kein Markdown\". Für feste Strukturen hilft ein Formatbeispiel oder ein eigenes Tag für die Antwort.",
    bodyDetail: "## Warum Struktur überhaupt wirkt\nEin Prompt ohne Struktur zwingt das Modell zu raten, wo die Anweisung aufhört und die Eingabe anfängt. Genau dort entstehen typische Fehler: Das Modell behandelt ein Beispiel als Anweisung oder mischt Kontext in die Antwort. Getrennte, benannte Abschnitte nehmen diese Mehrdeutigkeit heraus – deshalb tauchen XML-Tags in Anthropics eigener Doku und in vielen offiziellen Beispiel-Prompts auf.\n\n## Lange Dokumente: Reihenfolge zählt\nBei langen Eingaben (ab etwa 20.000 Tokens) empfiehlt die Doku eine klare Reihenfolge: lange Dokumente an den Anfang des Prompts, die eigentliche Frage ans Ende. In Anthropics Tests verbesserte die Frage am Ende die Antwortqualität bei komplexen Mehr-Dokument-Eingaben um bis zu 30 Prozent. Mehrere Dokumente bekommen je ein `<document>`-Tag mit Quelle und Inhalt.\n\n## Kontext und Motivation erklären\nEin unterschätzter Hebel: dem Modell sagen, warum eine Regel gilt. Statt \"Nutze niemals Auslassungspunkte\" wirkt \"Deine Antwort wird von einer Text-to-Speech-Engine vorgelesen, die Auslassungspunkte nicht aussprechen kann\" besser – das Modell kann aus der Begründung generalisieren.\n\n## Ein Missverständnis\nXML-Tags sind keine magischen Schlüsselwörter, die das Modell technisch parst. Es gibt keine festgelegte Pflicht-Liste: Beliebige, konsistent verwendete, beschreibende Tag-Namen funktionieren. Der Effekt kommt aus der klaren Trennung der Inhalte, nicht aus einem geheimen XML-Parser. Deshalb gilt auch: Drei bis fünf gut gewählte Tags helfen – zwanzig verschachtelte Tags in einem kurzen Prompt bringen nichts außer Rauschen.\n\n## Vertiefendes Beispiel\nEin Support-Bot-Prompt mischt Firmenrichtlinien, den bisherigen Chatverlauf und die neue Kundenfrage. Unstrukturiert verwechselt das Modell gelegentlich alte Kundennachrichten mit aktuellen Anweisungen. Strukturiert – Richtlinien in `<guidelines>`, Verlauf in `<history>`, Frage in `<question>`, plus ein `<example>` für den gewünschten Antwortstil – bleibt eindeutig, worauf sich die Antwort beziehen soll.",
    example: "<instructions>\nFasse den Text in 3 Stichpunkten zusammen. Antworte auf Deutsch.\n</instructions>\n\n<context>\nZielgruppe: Einsteiger ohne Vorwissen.\n</context>\n\n<text>\n[hier der Text]\n</text>",
    related: ["prompt", "system-prompt", "kontext-fuettern", "erst-plan-dann-code"],
    quiz: {
      question: "Wozu empfiehlt Anthropic XML-Tags wie <instructions> und <context> in Prompts?",
      options: [
        "Sie verschlüsseln den Prompt gegen Prompt Injection",
        "Sie sparen automatisch Tokens",
        "Sie helfen dem Modell, Anweisungen, Kontext und Beispiele eindeutig auseinanderzuhalten",
        "Ohne sie verweigert das Modell die Antwort"
      ],
      correct: 2,
      explain: "XML-Tags trennen Inhaltsarten sauber. Das Modell kann so nicht verwechseln, was Anweisung, Kontext oder nur Beispiel ist – die Tag-Namen selbst sind frei wählbar, solange sie konsistent sind."
    },
    sources: [
      { title: "Anthropic-Doku: Prompting Best Practices", url: SRC.promptBest },
      { title: "Anthropic-Doku: Prompt-Engineering-Übersicht", url: SRC.promptOverview }
    ],
    exercise: {
      task: "Nimm einen eigenen, unstrukturierten Prompt und baue ihn strukturiert neu.",
      steps: [
        "Such dir einen Prompt, den du kürzlich benutzt hast und der Anweisung, Kontext und Daten mischt.",
        "Zerlege ihn in Abschnitte mit Tags: <instructions>, <context> und ein Tag für die Eingabedaten. Gib am Ende das gewünschte Ausgabeformat an.",
        "Schicke beide Versionen an dein Modell und vergleiche die Antworten auf Genauigkeit und Format-Treue."
      ],
      selfCheck: [
        "Kannst du in deinem Prompt klar zeigen, wo die Anweisung endet und die Daten beginnen?",
        "Hast du das Ausgabeformat positiv formuliert ('mach X') statt negativ ('kein Y')?",
        "Würde ein Kollege ohne Vorwissen deinen Prompt beim ersten Lesen verstehen?"
      ]
    }
  },
  // ------------------------------------------------------------ 5
  {
    slug: "code-review-mit-ki",
    title: "Code-Review mit KI: Frischer Blick statt Selbstbenotung",
    category: "guide",
    difficulty: 2,
    minutes: 5,
    xp: 40,
    teaser: "KI-Review funktioniert am besten mit frischem Kontext: Nicht der Agent, der den Code geschrieben hat, soll ihn benoten – und der Auftrag braucht klare Grenzen.",
    body: "## Das Kernprinzip: frischer Kontext\nAnthropics Best Practices sind hier eindeutig: Ein frischer Kontext verbessert das Review, weil Claude nicht gegenüber Code voreingenommen ist, den es gerade selbst geschrieben hat. Der Autor hält seinen eigenen Lösungsweg tendenziell für richtig – ein Reviewer, der nur den Diff und die Kriterien sieht, bewertet das Ergebnis unabhängig. In Claude Code läuft der Befehl `/code-review` deshalb in einem eigenen Subagenten mit frischem Kontext.\n\n## Die Werkzeuge\nLokal prüft `/code-review` den aktuellen Diff auf Bugs, bevor du pushst. Auf GitHub kann ein automatisches Review jeden Pull Request analysieren und Befunde als Inline-Kommentare mit Schweregrad posten.\n\n## Was KI-Review gut kann – und was nicht\nStark ist es bei Korrektheit: Logikfehler, übersehene Randfälle, Verstöße gegen dokumentierte Projektregeln. Schwach ist es bei Urteilen, die Kontext außerhalb des Codes brauchen: Architektur-Entscheidungen, Tradeoffs, ob eine Abstraktion das Team langfristig weiterbringt. Und: Ein Reviewer, der Lücken finden soll, findet fast immer welche – auch bei solider Arbeit.\n\n## Den Auftrag eingrenzen\nDeshalb den Review-Prompt begrenzen: Benenne, was geprüft wird, wogegen und was als Befund zählt. Die Doku formuliert es so: \"Report gaps, not style preferences\" – melde Lücken, keine Stilvorlieben.",
    bodyDetail: "## Das Writer/Reviewer-Muster\nDie Best-Practices-Doku beschreibt ein einfaches Muster mit zwei Sessions: Session A implementiert (Writer), Session B reviewt mit frischem Kontext (Reviewer), Session A arbeitet das Feedback ein. Dasselbe funktioniert mit Tests: Eine Session schreibt Tests, eine andere schreibt Code, der sie besteht. Der Punkt ist immer derselbe – Erzeugen und Bewerten werden getrennt, damit der Bewertende nicht am eigenen Werk hängt. Je länger ein Agent unbeaufsichtigt gearbeitet hat, desto wichtiger wird laut Doku diese unabhängige Prüfung, bevor die Arbeit als fertig gilt.\n\n## Wie das gehostete Code Review arbeitet\nBei Anthropics GitHub-Code-Review analysieren mehrere spezialisierte Agenten den Diff parallel; jeder sucht nach einer anderen Fehlerklasse. Ein Verifikationsschritt prüft Kandidaten gegen das tatsächliche Code-Verhalten, um Fehlalarme auszusortieren; die Ergebnisse werden dedupliziert und nach Schweregrad sortiert (Wichtig, Nit, Vorbestehend). Bewusst blockiert der Check den Merge nie – die Entscheidung bleibt beim Team.\n\n## Review-Verhalten steuern\nZwei Dateien im Repo lenken, was geflaggt wird: CLAUDE.md-Regeln werden als Projekt-Kontext gelesen, neue Verstöße dagegen als Hinweise gemeldet. Eine REVIEW.md wirkt stärker: Sie wird jedem Review-Agenten mit höchster Priorität injiziert und kann Schweregrade neu definieren, die Zahl der Kleinkram-Kommentare deckeln oder Pfade wie generierten Code und Lockfiles vom Review ausnehmen.\n\n## Ein Missverständnis\nJeden Befund abzuarbeiten ist keine Qualitätsstrategie. Die Doku warnt ausdrücklich: Ein Reviewer, der auf Lücken angesetzt ist, meldet meist welche – wer jedem Fund nachjagt, landet bei Über-Engineering mit unnötigen Abstraktionen und Tests für unmögliche Fälle. Die Empfehlung: den Reviewer anweisen, nur Befunde zu melden, die Korrektheit oder die genannten Anforderungen betreffen – und den Rest als optional behandeln.",
    example: "Review-Prompt mit klaren Grenzen:\n'Nutze einen Subagenten und prüfe den Rate-Limiter-Diff gegen PLAN.md. Prüfe: Jede Anforderung umgesetzt? Randfälle getestet? Nichts außerhalb des Auftrags geändert? Melde Lücken, keine Stilvorlieben.'",
    related: ["claude-code-befehle", "subagents", "vibe-coding-sicherheit", "evals"],
    quiz: {
      question: "Warum soll Code-Review laut Anthropic in einem frischen Kontext laufen – und nicht in der Session, die den Code geschrieben hat?",
      options: [
        "Ein Reviewer mit frischem Kontext ist nicht durch den eigenen Lösungsweg voreingenommen und bewertet nur Diff und Kriterien",
        "Frischer Kontext ist grundsätzlich kostenlos",
        "In der Autoren-Session ist Code-Review technisch gesperrt",
        "Nur frische Kontexte können Markdown lesen"
      ],
      correct: 0,
      explain: "Der Autor kennt seinen Lösungsweg und hält ihn tendenziell für richtig. Ein Review in frischem Kontext (z. B. Subagent) sieht nur Diff und Kriterien und bewertet das Ergebnis unabhängig."
    },
    sources: [
      { title: "Claude Code Doku: Best Practices (Adversarial Review)", url: SRC.bestPractices },
      { title: "Claude Code Doku: Code Review", url: SRC.codeReview },
      { title: "Claude Code Doku: Commands-Referenz", url: SRC.commands }
    ],
    exercise: {
      task: "Lass einen Diff von einem frischen Kontext reviewen und bewerte die Befunde selbst.",
      steps: [
        "Mache in einem Projekt eine kleine Änderung (oder nimm einen offenen Branch) und führe in Claude Code /code-review aus.",
        "Sortiere die Befunde in zwei Gruppen: 'betrifft Korrektheit' und 'Stil/Geschmack'.",
        "Behebe nur die Korrektheits-Befunde und notiere, welche Funde du bewusst verwirfst – mit einem Satz Begründung."
      ],
      selfCheck: [
        "Konntest du jeden Befund einer der beiden Gruppen zuordnen?",
        "Hast du mindestens einen Befund begründet verworfen, statt allem nachzujagen?",
        "Kannst du erklären, warum das Review in einem Subagenten statt in deiner Session lief?"
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// EN entries
// ---------------------------------------------------------------------------
const en = [
  // ------------------------------------------------------------ 1
  {
    slug: "eigene-befehle-schreiben",
    title: "Writing Your Own Commands: Save Recurring Prompts",
    category: "guide",
    difficulty: 2,
    minutes: 5,
    xp: 40,
    teaser: "A custom slash command is a saved markdown file: write it once, and /your-command replaces the long prompt from then on.",
    body: "## The core idea\nIf you keep typing the same prompt — \"summarize my changes\", \"check this file\" — you can save it as a custom command. Claude Code supports two formats: a markdown file under `.claude/commands/` or a skill folder under `.claude/skills/`. Both create the same slash command: `deploy.md` and `deploy/SKILL.md` both become `/deploy`. Custom commands have officially been merged into skills; old command files keep working.\n\n## File structure\nThe file optionally starts with YAML frontmatter between two `---` lines. The most important field is `description`: Claude uses it to recognize when the command fits the task, and can even load it automatically. After the frontmatter comes the actual prompt text.\n\n## Arguments\nThe `$ARGUMENTS` placeholder picks up everything you type after the command: with `/fix-issue 123`, `$ARGUMENTS` becomes `123`. You can access individual arguments zero-based via `$0`, `$1`, and so on.\n\n## Custom command or CLAUDE.md rule?\nThe rule of thumb from the docs: rules that should always apply (\"never push to main\") belong in CLAUDE.md — it is loaded in full at every session. Procedures you only need sometimes belong in a command or skill: their text only loads when invoked and costs almost no context before that. When a CLAUDE.md section has grown into a whole procedure, that is, per the docs, exactly the moment to turn it into a command.",
    bodyDetail: "## Useful frontmatter fields\nBeyond `description` there are more optional fields. `argument-hint` shows during autocomplete which arguments are expected (e.g. `[issue-number]`). `allowed-tools` grants the command specific tools without permission prompts, such as `Bash(git add *)` for a commit command. `model` switches the model for the duration of the command. All fields are optional — only `description` is recommended so Claude knows when the command applies.\n\n## Who is allowed to trigger the command?\nBy default, both you and Claude can invoke a skill. Two fields restrict that: `disable-model-invocation: true` means only you can trigger the command — per the docs, this is the right choice for actions with side effects like `/deploy` or `/commit`, where the model shouldn't decide when they run. Conversely, `user-invocable: false` hides the command from the menu: it becomes pure background knowledge that only Claude loads when needed.\n\n## Pulling live data into the prompt\nA skill can run shell commands with the !`command` syntax before the text is sent to the model. The output replaces the placeholder: a review command can embed the current `git diff` directly into the prompt instead of Claude having to fetch it first. This is preprocessing — Claude only sees the finished result.\n\n## A misconception\nA custom command is not a program that executes something. At its core it is a saved message: on invocation, the file's text (with placeholders substituted) is sent to the model as a prompt — just as if you had typed it yourself. What happens next is up to the model, like with any other input. If you need hard guarantees (\"this must never happen\"), you need hooks or permission rules for that, not a command.",
    example: "File `.claude/skills/fix-issue/SKILL.md`:\n---\ndescription: Fixes a GitHub issue by number\ndisable-model-invocation: true\n---\n\nFix GitHub issue $ARGUMENTS: read the issue, implement the fix, write tests.\n\nThen invoke: `/fix-issue 123`",
    related: ["claude-code-befehle", "claude-skills", "claude-md"],
    quiz: {
      question: "Technically, what happens when you invoke a custom command like `/fix-issue 123`?",
      options: [
        "Claude Code compiles the file into a program and runs it",
        "GitHub automatically closes issue 123",
        "The command file's text is sent to the model as a prompt, with $ARGUMENTS replaced by '123'",
        "The file gets copied into CLAUDE.md"
      ],
      correct: 2,
      explain: "A custom command is a saved message: on invocation, the file's text is sent to the model as a prompt with placeholders substituted — just as if you had typed it yourself."
    },
    sources: [
      { title: "Claude Code docs: Skills (incl. custom commands)", url: SRC.skills },
      { title: "Claude Code docs: Slash commands", url: SRC.slash },
      { title: "Claude Code docs: CLAUDE.md and memory", url: SRC.memory }
    ],
    exercise: {
      task: "Build your first custom command and test both ways of invoking it.",
      steps: [
        "Create the file .claude/skills/summarize/SKILL.md — with a description ('Summarizes uncommitted changes') and the prompt 'Summarize the current git diff in 3 bullet points.'",
        "Start Claude Code, change a file, and invoke /summarize directly.",
        "Then ask in plain language 'What did I change?' and watch whether Claude loads the skill on its own."
      ],
      selfCheck: [
        "Do you know why the description field is critical for automatic loading?",
        "Can you explain when the same text would have belonged in CLAUDE.md instead?",
        "Did you understand how you would pick up arguments with $ARGUMENTS?"
      ]
    }
  },
  // ------------------------------------------------------------ 2
  {
    slug: "agent-teams",
    title: "Agent Teams: Multiple Agents, One Project",
    category: "konzept",
    difficulty: 3,
    minutes: 5,
    xp: 60,
    teaser: "Multiple Claude Code instances can work on one project as a team — with roles, a shared task list, and significantly higher token costs.",
    body: "## Two ways to run multiple agents\nThe manual way: you start several Claude Code sessions in parallel, each in its own git worktree so their changes don't collide. The coordinated way is Claude Code's Agent Teams: one session becomes the team lead, which assigns tasks and synthesizes results; teammates work independently, each with its own context window.\n\n## How a team works\nThe team coordinates through a shared task list: the lead creates tasks, teammates take them or claim the next available one on their own. Unlike subagents, teammates can message each other directly — for example, to challenge each other's hypotheses. Agent teams are experimental and disabled by default (as of July 2026); they must be enabled via an environment variable.\n\n## Typical roles\nProven patterns from the docs: a writer implements while a reviewer checks with fresh eyes. Or several reviewers examine the same pull request from different angles (security, performance, test coverage). Or several agents pursue competing hypotheses while debugging and try to disprove one another.\n\n## The cost warning\nEach teammate is a separate Claude instance with its own context window — costs scale with team size. Anthropic's engineering blog puts multi-agent systems at roughly 15 times the tokens of a normal chat. For sequential tasks or edits to the same file, a single session is usually the better choice.",
    bodyDetail: "## Teams vs. subagents\nBoth parallelize work, but differently: a subagent runs inside your session and can only report a result back to the caller. A teammate is a full, independent session — you can talk to it directly without going through the lead, and teammates communicate with each other. The docs' rule of thumb: subagents for focused work packages where only the result matters; teams when participants should share intermediate findings, challenge each other, and coordinate on their own.\n\n## The research evidence for orchestration\nAnthropic's multi-agent research system (engineering blog) uses the orchestrator-worker pattern: a lead agent decomposes the query and spawns three to five subagents in parallel. On Anthropic's internal research eval, this setup clearly beat a single agent — especially on tasks that decompose into independent sub-questions. The same blog also names the limit: tasks where all agents would need the same context or depend heavily on each other are a poor fit — which includes a lot of everyday coding work.\n\n## Practical rules from the docs\nThree to five teammates are a good start; more mainly increases coordination overhead. Each teammate should own its own set of files, because two agents editing the same file overwrite each other. And: don't let teams run unobserved for too long — check in regularly, redirect, and synthesize results.\n\n## A misconception\nMore agents do not automatically mean better results. The value only appears when the task is genuinely parallelizable. A team working through a sequential task mostly produces coordination overhead and token costs — for those cases, the docs explicitly recommend a single session or subagents.",
    example: "Prompt to the team lead: 'Spawn three teammates to review PR #142 — one checks security, one performance, one test coverage. Then collect all findings and summarize them.'",
    related: ["subagents", "multi-agent-patterns", "git-worktrees", "kosten-kontrolle-agenten"],
    quiz: {
      question: "What distinguishes agent teams from subagents in Claude Code?",
      options: [
        "Teammates share a task list and can communicate with each other directly — subagents only report their result back to the caller",
        "Subagents are always more expensive than agent teams",
        "Agent teams don't need a language model",
        "Subagents cannot read files"
      ],
      correct: 0,
      explain: "Subagents run inside one session and only return their result. Teammates are separate sessions with a shared task list and direct messaging — at the price of significantly more tokens."
    },
    sources: [
      { title: "Claude Code docs: Agent teams", url: SRC.agentTeams },
      { title: "Anthropic Engineering: Multi-agent research system", url: SRC.multiAgentBlog },
      { title: "Claude Code docs: Subagents", url: SRC.subagents },
      { title: "Claude Code docs: Git worktrees", url: SRC.worktrees }
    ]
  },
  // ------------------------------------------------------------ 3
  {
    slug: "ci-cd-mit-agenten",
    title: "CI/CD with Agents: AI in the Pipeline",
    category: "guide",
    difficulty: 2,
    minutes: 5,
    xp: 40,
    teaser: "With claude -p and GitHub Actions, agents run automatically in your pipeline — with no follow-up questions. That's why they need gates: tests decide, not the agent.",
    body: "## The building block: headless calls\nA pipeline has no chat window. The entry point is therefore headless mode: `claude -p \"prompt\"` works through a task and exits. You can pipe data in (`git diff main | claude -p \"...\"`), and `--output-format json` returns a machine-readable result including cost — good for scripts.\n\n## GitHub Actions\nFor GitHub there is an official action (claude-code-action): it responds to @claude mentions in issues and PRs, or runs automatically with a fixed prompt — for example as a review on every new pull request. The API key must go into GitHub Secrets, never into the repository.\n\n## Gates: tests before trust\nThe most important rule: agent output is unreviewed code. It has to pass the same gates as human code — tests, linters, the build — before anything gets merged. In practice, that means the agent opens a pull request instead of pushing directly, and a human reviews before the merge.\n\n## The risks\nFirst: no follow-up questions. Whatever the agent cannot decide gets aborted or decided wrongly. Second: secrets — an agent in CI can access everything the runner sees, so keep permissions as narrow as possible. Third: cost — without limits like `--max-turns` and workflow timeouts, runs can quietly get expensive.",
    bodyDetail: "## Reproducible runs with --bare\nBy default, even a `claude -p` call loads the local configuration: hooks, skills, MCP servers, CLAUDE.md. In CI that's a problem, because runs can then differ from machine to machine. The `--bare` flag disables this auto-discovery: it only loads what you pass explicitly via flags. The docs recommend it explicitly for scripts and CI.\n\n## Scoping permissions precisely\nInstead of allowing the agent everything, you list exactly the tools the job needs with `--allowedTools` — for example `\"Bash(git diff *),Read\"` for a review job that shouldn't change anything. The syntax supports prefix patterns: `Bash(git diff *)` allows every git-diff variant but no other shell command.\n\n## Cost control\nEvery run consumes GitHub Actions minutes and API tokens. The docs recommend concrete limits: `--max-turns` against endless iterations, workflow timeouts against hanging jobs, and concurrency rules against too many parallel runs.\n\n## Putting automatic reviews in perspective\nAnthropic also offers a hosted code review that analyzes PRs with several parallel agents and posts findings as inline comments with severity levels. Importantly, it deliberately never blocks the merge — the check always completes as \"neutral\". If you want to gate merges on findings, you have to evaluate that yourself in your own CI. That underlines the core principle: the AI provides signals; the decision stays with tests and humans.\n\n## A misconception\nA review agent in the pipeline does not replace tests — it is itself output that needs checking. An agent can miss bugs or flag things that are fine. Deterministic checks (tests, linters, the build) remain the hard truth; the agent adds signals that a human evaluates.",
    example: "# GitHub Actions step (shortened):\n- uses: anthropics/claude-code-action@v1\n  with:\n    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}\n    prompt: \"Review this PR for bugs. Post findings as a comment.\"\n    claude_args: \"--max-turns 10\"",
    related: ["headless-non-interactive", "guardrails-fuer-agenten", "git-github-basics", "evals"],
    quiz: {
      question: "Why does the rule 'tests before trust' apply to agent output in CI/CD?",
      options: [
        "Because tests make the agent faster",
        "Because agent output is unreviewed code that has to pass tests, linters, and review like human code before it gets merged",
        "Because agents can't make API requests without tests",
        "Because GitHub Actions won't start otherwise"
      ],
      correct: 1,
      explain: "An agent in the pipeline can make mistakes, and nobody is watching live. Deterministic gates (tests, build, review before merge) catch that — which is why the agent opens PRs instead of pushing directly."
    },
    sources: [
      { title: "Claude Code docs: Run Claude Code programmatically (headless)", url: SRC.headless },
      { title: "Claude Code docs: GitHub Actions", url: SRC.ghActions },
      { title: "GitHub docs: Using secrets in GitHub Actions", url: SRC.ghSecrets },
      { title: "Claude Code docs: Code review", url: SRC.codeReview }
    ]
  },
  // ------------------------------------------------------------ 4
  {
    slug: "prompt-strukturen",
    title: "Prompt Structures: Layout That Improves Results",
    category: "prompt-pattern",
    difficulty: 1,
    minutes: 4,
    xp: 20,
    teaser: "Good prompts have visible structure: a clear task, separated context sections, examples, and a specified output format.",
    body: "## Clear and direct\nThe most important rule from Anthropic's prompting docs: be precise about what you want. The test: show your prompt to a colleague with no prior context. If they would be confused, the model will be too. Numbered steps help when order or completeness matters.\n\n## Separate sections — with XML tags\nAs soon as a prompt mixes several content types (instructions, context, examples, input data), Anthropic recommends XML tags: `<instructions>`, `<context>`, `<example>`. Each content type gets its own tag — so the model can tell unambiguously what is an instruction and what is just an example. Consistent, descriptive tag names matter.\n\n## Assign a role\nEven a single sentence in the system prompt (\"You are an experienced Python developer\") noticeably focuses behavior and tone.\n\n## Show examples (few-shot)\nPer the docs, examples are one of the most reliable ways to steer format and style. Recommended: 3 to 5 examples, relevant to your real use case and varied enough, each wrapped in `<example>` tags.\n\n## Specify the output format\nSay what the model should do — not what it should avoid: \"Respond in flowing prose\" works better than \"No markdown\". For fixed structures, a format example or a dedicated tag for the answer helps.",
    bodyDetail: "## Why structure works at all\nA prompt without structure forces the model to guess where the instruction ends and the input begins. That is exactly where typical errors happen: the model treats an example as an instruction or mixes context into the answer. Separated, named sections remove that ambiguity — which is why XML tags appear in Anthropic's own docs and in many official example prompts.\n\n## Long documents: order matters\nFor long inputs (from roughly 20,000 tokens), the docs recommend a clear order: long documents at the top of the prompt, the actual question at the end. In Anthropic's tests, putting the query at the end improved response quality by up to 30 percent on complex multi-document inputs. Multiple documents each get a `<document>` tag with source and content.\n\n## Explain context and motivation\nAn underrated lever: telling the model why a rule exists. Instead of \"Never use ellipses\", the version \"Your response will be read aloud by a text-to-speech engine that cannot pronounce ellipses\" works better — the model can generalize from the reasoning.\n\n## A misconception\nXML tags are not magic keywords that the model technically parses. There is no mandatory fixed list: any consistently used, descriptive tag names work. The effect comes from the clean separation of content, not from a hidden XML parser. Which also means: three to five well-chosen tags help — twenty nested tags in a short prompt add nothing but noise.\n\n## A deeper example\nA support-bot prompt mixes company guidelines, the previous chat history, and the new customer question. Unstructured, the model occasionally confuses old customer messages with current instructions. Structured — guidelines in `<guidelines>`, history in `<history>`, question in `<question>`, plus an `<example>` for the desired answer style — it stays unambiguous what the answer should be based on.",
    example: "<instructions>\nSummarize the text in 3 bullet points. Respond in English.\n</instructions>\n\n<context>\nAudience: beginners with no prior knowledge.\n</context>\n\n<text>\n[the text goes here]\n</text>",
    related: ["prompt", "system-prompt", "kontext-fuettern", "erst-plan-dann-code"],
    quiz: {
      question: "Why does Anthropic recommend XML tags like <instructions> and <context> in prompts?",
      options: [
        "They encrypt the prompt against prompt injection",
        "They automatically save tokens",
        "They help the model unambiguously tell apart instructions, context, and examples",
        "Without them the model refuses to answer"
      ],
      correct: 2,
      explain: "XML tags cleanly separate content types. The model can no longer confuse what is an instruction, context, or just an example — the tag names themselves are up to you, as long as they are consistent."
    },
    sources: [
      { title: "Anthropic docs: Prompting best practices", url: SRC.promptBest },
      { title: "Anthropic docs: Prompt engineering overview", url: SRC.promptOverview }
    ],
    exercise: {
      task: "Take one of your own unstructured prompts and rebuild it with structure.",
      steps: [
        "Pick a prompt you used recently that mixes instructions, context, and data.",
        "Split it into sections with tags: <instructions>, <context>, and a tag for the input data. State the desired output format at the end.",
        "Send both versions to your model and compare the answers for accuracy and format adherence."
      ],
      selfCheck: [
        "Can you clearly show in your prompt where the instruction ends and the data begins?",
        "Did you state the output format positively ('do X') instead of negatively ('no Y')?",
        "Would a colleague with no prior context understand your prompt on first read?"
      ]
    }
  },
  // ------------------------------------------------------------ 5
  {
    slug: "code-review-mit-ki",
    title: "Code Review with AI: Fresh Eyes Instead of Self-Grading",
    category: "guide",
    difficulty: 2,
    minutes: 5,
    xp: 40,
    teaser: "AI review works best with fresh context: the agent that wrote the code shouldn't be the one grading it — and the review brief needs clear boundaries.",
    body: "## The core principle: fresh context\nAnthropic's best practices are unambiguous here: a fresh context improves review because Claude isn't biased toward code it just wrote itself. The author tends to consider their own approach correct — a reviewer that only sees the diff and the criteria evaluates the result independently. That's why the `/code-review` command in Claude Code runs in its own subagent with fresh context.\n\n## The tools\nLocally, `/code-review` checks the current diff for bugs before you push. On GitHub, an automated review can analyze every pull request and post findings as inline comments with severity levels.\n\n## What AI review does well — and what it doesn't\nIt's strong on correctness: logic errors, missed edge cases, violations of documented project rules. It's weak on judgments that need context beyond the code: architecture decisions, tradeoffs, whether an abstraction helps the team long-term. And: a reviewer told to find gaps will almost always find some — even in solid work.\n\n## Narrowing the brief\nSo constrain the review prompt: name what is being checked, against what, and what counts as a finding. The docs put it like this: \"Report gaps, not style preferences.\"",
    bodyDetail: "## The writer/reviewer pattern\nThe best-practices docs describe a simple pattern with two sessions: session A implements (writer), session B reviews with fresh context (reviewer), session A incorporates the feedback. The same works with tests: one session writes tests, another writes code that passes them. The point is always the same — producing and evaluating are separated so the evaluator isn't attached to its own work.\n\n## How the hosted code review works\nIn Anthropic's GitHub code review, several specialized agents analyze the diff in parallel; each hunts a different class of bug. A verification step checks candidates against actual code behavior to filter out false positives; results are deduplicated and ranked by severity (important, nit, pre-existing). The check deliberately never blocks the merge — the decision stays with the team.\n\n## Steering review behavior\nTwo files in the repo shape what gets flagged: CLAUDE.md rules are read as project context, and newly introduced violations are reported as nits. A REVIEW.md acts more strongly: it is injected into every review agent with highest priority and can redefine severities, cap the number of nitpick comments, or exclude paths such as generated code and lockfiles from review.\n\n## A misconception\nWorking through every finding is not a quality strategy. The docs warn explicitly: a reviewer set loose on gaps will usually report some — chasing every finding leads to over-engineering, with unnecessary abstraction layers and tests for cases that can't happen. The recommendation: instruct the reviewer to report only findings that affect correctness or the stated requirements — and treat the rest as optional.",
    example: "Review prompt with clear boundaries:\n'Use a subagent to review the rate-limiter diff against PLAN.md. Check: every requirement implemented? Edge cases tested? Nothing outside the task's scope changed? Report gaps, not style preferences.'",
    related: ["claude-code-befehle", "subagents", "vibe-coding-sicherheit", "evals"],
    quiz: {
      question: "According to Anthropic, why should code review run in a fresh context — not in the session that wrote the code?",
      options: [
        "A reviewer with fresh context isn't biased by its own approach and evaluates only the diff and the criteria",
        "Fresh context is fundamentally free",
        "Code review is technically locked in the author's session",
        "Only fresh contexts can read markdown"
      ],
      correct: 0,
      explain: "The author knows its own approach and tends to consider it correct. A review in fresh context (e.g. a subagent) sees only the diff and the criteria and evaluates the result independently."
    },
    sources: [
      { title: "Claude Code docs: Best practices (adversarial review)", url: SRC.bestPractices },
      { title: "Claude Code docs: Code review", url: SRC.codeReview },
      { title: "Claude Code docs: Commands reference", url: SRC.commands }
    ],
    exercise: {
      task: "Have a fresh context review a diff, then evaluate the findings yourself.",
      steps: [
        "Make a small change in a project (or take an open branch) and run /code-review in Claude Code.",
        "Sort the findings into two groups: 'affects correctness' and 'style/taste'.",
        "Fix only the correctness findings and note which ones you deliberately discard — with a one-sentence justification."
      ],
      selfCheck: [
        "Were you able to assign every finding to one of the two groups?",
        "Did you discard at least one finding with a stated reason instead of chasing everything?",
        "Can you explain why the review ran in a subagent instead of your session?"
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
const wc = (s) => s.split(/\s+/).filter(Boolean).length;
const existing = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "..", "site", "content", "entries.de.json"), "utf8")
);
const existingSlugs = new Set(existing.map((e) => e.slug));
const EXPECTED = ["eigene-befehle-schreiben", "agent-teams", "ci-cd-mit-agenten", "prompt-strukturen", "code-review-mit-ki"];
const EXERCISE_SLUGS = new Set(["eigene-befehle-schreiben", "prompt-strukturen", "code-review-mit-ki"]);

let errors = [];
let warnings = [];

if (de.length !== 5 || en.length !== 5) errors.push("Need exactly 5 DE and 5 EN entries");

for (let i = 0; i < 5; i++) {
  const d = de[i], e = en[i];
  const tag = d.slug;
  if (d.slug !== EXPECTED[i] || e.slug !== EXPECTED[i]) errors.push(`${tag}: slug mismatch`);
  // Struktur DE == EN
  if (d.category !== e.category || d.difficulty !== e.difficulty || d.minutes !== e.minutes || d.xp !== e.xp)
    errors.push(`${tag}: meta mismatch DE/EN`);
  if (d.quiz.correct !== e.quiz.correct) errors.push(`${tag}: quiz.correct mismatch`);
  if (d.quiz.options.length !== 4 || e.quiz.options.length !== 4) errors.push(`${tag}: quiz needs 4 options`);
  if (d.sources.length !== e.sources.length) errors.push(`${tag}: sources count mismatch`);
  d.sources.forEach((s, k) => { if (s.url !== e.sources[k].url) errors.push(`${tag}: source URL mismatch at ${k}`); });
  if (d.sources.length < 2 || d.sources.length > 4) errors.push(`${tag}: need 2-4 sources`);
  // related
  [d, e].forEach((x) => x.related.forEach((r) => { if (!existingSlugs.has(r)) errors.push(`${tag}: related slug '${r}' does not exist`); }));
  if (d.related.length < 2 || d.related.length > 4) errors.push(`${tag}: need 2-4 related`);
  if (JSON.stringify(d.related) !== JSON.stringify(e.related)) errors.push(`${tag}: related mismatch DE/EN`);
  // exercise presence
  const shouldHave = EXERCISE_SLUGS.has(tag);
  if (!!d.exercise !== shouldHave || !!e.exercise !== shouldHave) errors.push(`${tag}: exercise presence wrong`);
  if (d.exercise) {
    [d.exercise, e.exercise].forEach((ex) => {
      if (ex.steps.length !== 3 || ex.selfCheck.length !== 3) errors.push(`${tag}: exercise needs 3 steps + 3 selfCheck`);
    });
  }
  // word counts
  [["DE", d], ["EN", e]].forEach(([lang, x]) => {
    const b = wc(x.body), bd = wc(x.bodyDetail);
    if (b < 150 || b > 250) warnings.push(`${tag} ${lang}: body ${b} words (target 150-250)`);
    if (bd < 250 || bd > 400) warnings.push(`${tag} ${lang}: bodyDetail ${bd} words (target 250-400)`);
    console.log(`${tag} ${lang}: body=${b} bodyDetail=${bd}`);
  });
}

if (warnings.length) { console.log("\nWARNINGS:"); warnings.forEach((w) => console.log("  " + w)); }
if (errors.length) { console.error("\nERRORS:"); errors.forEach((x) => console.error("  " + x)); process.exit(1); }

const out = { de, en };
const outPath = path.join(__dirname, "batch3-a.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`\nOK -> ${outPath} (de=${de.length}, en=${en.length})`);
