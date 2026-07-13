# Deep-Research Teilauftrag 1/3: Loop-Architekturen und Memory-Datei-Konzepte autonomer KI-Bau-Agenten

Stand: 13.07.2026. Methode: WebSearch (2-3 Query-Varianten je Sub-Frage) + WebFetch der besten Quellen volltextig. Alle zitierten URLs per `curl -L -A 'Mozilla/5.0' --max-time 20` auf HTTP 200 geprüft (Ergebnis: 12/12 grün, siehe Quellenliste). Priorität: offizielle Docs/Anthropic > fundierte Engineering-Blogs. Einzelquellen-Claims sind als [unbestätigt] markiert.

---

## a) Loop-/Harness-Architekturen autonomer Coding-Agenten 2025/2026

### Harness vs. Framework vs. Loop — drei verschiedene Abstraktionsebenen

Ein **Harness** ist ein "pre-wired agentic loop … shipped as a product you point at a task" (z.B. Claude Code, Codex) — im Gegensatz zu einem **Framework** (LangChain, AutoGen), das Teams selbst zusammensetzen müssen. Ein Harness besteht laut dieser Analyse aus neun standardisierten Komponenten: Loop-Engine, Context-Management, Skills-Registry, Sub-Agent-Management, eingebaute Capabilities, Session-Persistenz, dynamisches Prompting, Lifecycle-Hooks und Permissions [1].

Die "Loop Engineering"-Perspektive setzt eine Ebene höher an: Harness Engineering (Design der Umgebung, in der EIN Agent läuft) entwickelte sich zu Loop Engineering — "the harness, running on a timer, spawning helpers, and feeding itself." Die entscheidende technische Unterscheidung zwischen Harness und Loop: "a cron job runs a fixed script. An agent loop runs a model that reads current state and decides its own next action." [1]

### Das Ralph-Wiggum-Muster (De-facto-Standard für unbeaufsichtigte Loops)

Von Geoffrey Huntley Mitte 2025 popularisiert (u.a. zum Bau der Programmiersprache CURSED über drei Monate autonomen Betriebs) [2]. Kernmechanik — ein simpler Bash-Loop:

```bash
while :; do cat PROMPT.md | claude-code ; done
```

Jede Iteration folgt der Sequenz: `fix_plan.md` lesen → höchstpriorisierte Aufgabe wählen → relevante Spec-Datei(en) laden → Änderung implementieren → Validierung ausführen (Tests/Compile) → `fix_plan.md` aktualisieren → committen → Session beendet sich → neue Iteration mit **komplett frischem Kontext** startet [8].

Zentrale Dateien im Ralph-Muster [8]:
| Datei | Rolle |
|---|---|
| `PROMPT.md` | Pro Iteration eingespeister Auftrag/Verhaltensanweisung |
| `specs/*` | Feature-Spezifikationen, selektiv geladen |
| `fix_plan.md` | Dynamischer Task-Tracker (offene Punkte, gefundene Bugs, Status) |
| `AGENT.md` | Projekt-Konventionen, kann pro Unterverzeichnis genestet sein |

Fresh-Context-per-Iteration ist bewusstes Design gegen "Context Rot" (Qualitätsverfall bei vollem Kontextfenster, laut Praxisbericht ab ca. 147-152k Tokens bei ~170k-Fenstern) — der Preis dafür: der Agent hat KEIN Gedächtnis vorheriger Läufe im Kontext, Fortschritt MUSS daher vollständig in Dateien/Git-Historie externalisiert werden [8]. Ein Praktiker-Zitat bringt das Prinzip auf den Punkt: "if you're implementing Ralph as part of the agent harness via skill/command/etc you are missing the point of Ralph which is to use always a fresh context." [8] Regel "ein Item pro Loop-Durchlauf" — bei Entgleisung auf ein einzelnes Item verengen [8]. Wichtige Einschränkung [unbestätigt, Einzelquelle]: aktive menschliche Überwachung wird als notwendig beschrieben, da die Architektur selbst keine automatische Drift-Erkennung enthält [8].

### Orchestrator-Worker-Architektur (Anthropic-Referenzmuster)

Anthropics offizielles Engineering-Papier unterscheidet grundsätzlich **Workflows** ("systems where LLMs and tools are orchestrated through predefined code paths") von **Agents** ("systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks") [3]. Fünf Referenzmuster werden benannt [3]:
- **Prompt Chaining**: sequentielle Schritte mit programmatischen Checkpoints zwischen den Schritten
- **Routing**: Klassifikation von Eingaben, Weiterleitung an spezialisierte Handler
- **Parallelization**: Sectioning (unabhängige Teilaufgaben) oder Voting (mehrere Versuche)
- **Orchestrator-Workers**: zentrales LLM zerlegt Aufgabe dynamisch in unvorhersehbare Teilaufgaben, delegiert an Worker-LLMs — sinnvoll, wenn man "can't predict the subtasks needed"
- **Evaluator-Optimizer**: ein LLM generiert, ein zweites gibt iteratives Feedback — erfordert "clear evaluation criteria"

Design-Grundsätze laut Anthropic: Einfachheit priorisieren, Transparenz durch explizite Planungsschritte, gründliche Tool-Dokumentation/-Tests; Agents nur einsetzen, wenn einfachere Lösungen nachweislich unterlegen sind, da Agents Kosten/Latenz gegen Aufgabenqualität eintauschen und "extensive testing in sandboxed environments, along with appropriate guardrails" brauchen [3]. Autonome Agenten sollen "stopping conditions (such as a maximum number of iterations)" enthalten, um die Kontrolle zu behalten [3].

### Dynamic Workflows (Anthropic, Mai 2026) — Orchestrierung außerhalb des Kontextfensters

Mit Claude Opus 4.8 (28.05.2026) führte Anthropic **Dynamic Workflows** als Research Preview ein: Claude schreibt für eine Aufgabe ein JavaScript-Orchestrierungsskript; eine Background-Runtime führt es aus. "A dynamic workflow is a JavaScript script that orchestrates subagents at scale" — Claude kann Arbeit planen und anschließend hunderte parallele Subagents in einer Session ausführen, verifiziert Ergebnisse, bevor sie zurückgemeldet werden [6][1]. Konkrete Kappungsgrenze laut Presseberichterstattung: max. 16 gleichzeitige und 1.000 Subagents insgesamt pro Lauf [Sekundärquelle, in [6] nicht direkt bestätigt — dort nur "hundreds of parallel subagents" ohne exakte Zahl]. Architektonisch verschiebt das die Orchestrierungslogik (Loops, Branching, Verifikationsdurchläufe) aus dem Arbeitsgedächtnis des Modells heraus in Skript-Variablen — "the loop that writes loops" [1]. Verfügbar für Claude Code Enterprise/Team/Max, offiziell als Research Preview gekennzeichnet (Semantik kann sich noch ändern) [1][6].

### Wakeup-/Scheduling-Muster für Langläufer

Ein wiederkehrendes Architekturmuster: Der Agent plant am Ende jeder Iteration seine eigene Fortsetzung per Selbst-Wakeup-Primitive und übergibt denselben Loop-Prompt zurück an sich selbst — vergleichbar mit `ScheduleWakeup` (One-Shot-Session-Prompt nach Delay) neben klassischem Cron (wiederkehrend, 5-Feld) [unbestätigt, Einzelquelle Community-Recherche] [via WebSearch-Aggregat, nicht volltextig gefetcht]. Das übergeordnete Muster: jeder Cron-getriggerte Agent, Webhook-Workflow oder "research until done"-Loop folgt dem Schema "Agent triggert sich selbst nach Zeitplan/Event/bis Ziel erreicht" — mit einer Memory-Datei (z.B. `memory.md`/`TODO.md`), die zwischen Wakeups aktualisiert wird und den Verarbeitungsstatus trägt.

### Verifikations-/Evaluator-Schicht als eigenständige Systemkomponente

Über Ralph und Anthropics Orchestrator-Worker hinaus beschreibt eine Analyse zu langlaufenden Coding-Agents drei ergänzende Prinzipien [10]:
- **Goals as Contracts**: Ziele mit messbaren Erfolgskriterien, Constraints und Budgets statt Turn-für-Turn-Interaktion — "A weak goal gives the model room to stop early, take shortcuts, or redefine success."
- **Evaluators as First-Class System**: Erfolgsbewertung getrennt von Ausführung; deterministische Checks (Tests, Typsystem, Benchmarks) fangen Basis-Fehler, Agent-Review übernimmt urteilslastige Entscheidungen; "evidence comes from an external check that the agent cannot easily talk its way around."
- **Loop-Based Autonomy**: eine äußere Kontrollschicht inspiziert wiederholt Fortschritt, führt Checks aus, vergleicht mit Zielen — "repeated effort under supervision from a control layer", nicht durchgehende Einzelausführung.
- **Session Mining**: Transkripte vergangener Läufe werden zu projektspezifischen Regeln destilliert, um wiederkehrende Fehler ohne Retraining zu verhindern.

Diese Analyse betont zudem visuelle Artefakte (Dashboards mit Loss-Kurven, Benchmarks, Screenshots) als bessere Kontrollfläche für menschliche Aufsicht als reine Terminal-Transkripte [10].

Anthropics offizielle Docs formalisieren die Verifikationsschicht für Claude Code konkret als drei Eskalationsstufen [2]:
1. **In einem Prompt**: Check ausführen und im selben Turn iterieren lassen
2. **Über eine Session hinweg**: `/goal`-Bedingung, ein separater Evaluator prüft nach jedem Turn erneut
3. **Als deterministisches Gate**: Ein Stop-Hook führt den Check als Skript aus und blockiert das Turn-Ende, bis er besteht (Claude Code selbst überschreibt den Hook nach 8 aufeinanderfolgenden Blocks und beendet den Turn zwangsweise)
4. **Durch eine zweite Meinung**: ein Verifikations-Subagent oder Dynamic Workflow mit frischem Modell, das das Ergebnis zu widerlegen versucht, "so the agent doing the work isn't the one grading it."

---

## b) Memory-Datei-Patterns: CLAUDE.md/AGENTS.md/LOOP.md/TODO.md

### Vier-Speicher-Modell (CoALA-Mapping)

Eine Analyse mappt das kognitionswissenschaftliche CoALA-Framework auf reale Agent-Artefakte und liefert damit eine klare Taxonomie, was in welchen Speicher gehört [1]:

| Speichertyp | Artefakt | Inhalt |
|---|---|---|
| Working Memory | laufendes Kontextfenster | verwaltet via Compaction |
| Semantic Memory | CLAUDE.md | persistentes Projektwissen, bei jedem Session-Start geladen |
| Procedural Memory | SKILL.md-Pakete | wiederverwendbare Workflows |
| Episodic Memory | Commits, Logs, Progress-Artefakte | dauerhafte Session-Aufzeichnungen, überleben Context-Resets |

Kernaussage: diese Externalisierung ist "the architectural precondition for multi-session autonomy: not a bigger window, but a substrate outside the window" [1]. Drei konkrete State-Separation-Muster für Langläufer [1]:
- **Plan-Implement-Validate (PIV)**: Kontext-Reset zwischen Phasen, das Plan-Dokument wird zur Schnittstelle
- **Writer/Reviewer**: getrennte Agenten/Prompts, Reviewer gated Änderungen im PR-Loop
- **Initializer/Coder**: Setup-Agent erzeugt dauerhafte Feature-Liste, Coding-Agent testet gegen persistente Ziele

### Offizielle Anthropic-Best-Practices für CLAUDE.md

Aus der offiziellen Claude-Code-Doku [2] (Stand aktuell, https://code.claude.com/docs/en/best-practices):

- CLAUDE.md wird bei jeder Conversation geladen — "only include things that apply broadly." Für Domänenwissen/gelegentliche Workflows stattdessen **Skills** verwenden (on-demand geladen, bläht nicht jede Conversation auf).
- Faustregel pro Zeile: *"Would removing this cause Claude to make mistakes? If not, cut it."* — "Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"
- Konkrete Include/Exclude-Tabelle [2]:

| ✅ Include | ❌ Exclude |
|---|---|
| Bash-Befehle, die Claude nicht erraten kann | Alles, was Claude durch Code-Lesen selbst herausfindet |
| Code-Style-Regeln, die vom Standard abweichen | Standard-Sprachkonventionen |
| Test-Anweisungen, bevorzugte Test-Runner | Detaillierte API-Doku (stattdessen verlinken) |
| Repo-Etikette (Branch-Naming, PR-Konventionen) | Häufig wechselnde Informationen |
| Architekturentscheidungen | Lange Erklärungen/Tutorials |
| Environment-Eigenheiten (Pflicht-Env-Vars) | Datei-für-Datei-Beschreibungen |
| Nicht-offensichtliche Gotchas | Selbstverständlichkeiten ("write clean code") |

- CLAUDE.md unterstützt Imports via `@path/to/import`-Syntax und existiert hierarchisch: `~/.claude/CLAUDE.md` (global), `./CLAUDE.md` (Projekt, eingecheckt), `./CLAUDE.local.md` (persönlich, gitignored), Parent-/Child-Directory-Dateien (Monorepo-tauglich, werden automatisch/on-demand gezogen) [2].
- Anti-Pattern "over-specified CLAUDE.md": "If your CLAUDE.md is too long, Claude ignores half of it because important rules get lost in the noise." Fix: "Ruthlessly prune. If Claude already does something correctly without the instruction, delete it or convert it to a hook." [2]
- Compaction-Verhalten ist in CLAUDE.md steuerbar, z.B. Instruktion: *"When compacting, always preserve the full list of modified files and any test commands"* [2].
- Emphase-Mechanik: "IMPORTANT" oder "YOU MUST" verbessert nachweislich die Regel-Adhärenz [2].

### Praktiker-Konsens (HumanLayer, konvergiert mit offizieller Doku)

Ergänzend zur offiziellen Doku [7]: CLAUDE.md sollte auf WHY/WHAT/HOW fokussieren (Projektzweck, Komponentenfunktion, Build/Test/Verify). Anti-Patterns: *"Never send an LLM to do a linter's job"* — deterministische Tools statt LLM-Stilregeln; unreflektiertes `/init`-Output committen. Struktur-Empfehlung: **Progressive Disclosure** — spezialisierte Themen in `agent_docs/`-Unterdateien auslagern und aus CLAUDE.md referenzieren, statt alles einzubetten. Längenrichtwert dort: unter 300 Zeilen, idealerweise unter 60 Zeilen für die Root-Datei; Begründung: Frontier-Modelle folgen zuverlässig ca. 150-200 Instruktionen. Datei-Referenzen im Format `datei:zeile` statt Code-Snippets, damit Verweise nicht veralten [7]. Convergenz-Hinweis: Verschiedene Quellen nennen unterschiedliche Zeilen-Richtwerte (60 vs. ~150-300 Zeilen) — die Kernaussage "so kurz wie möglich, Prune regelmäßig" ist jedoch konsistent über offizielle Doku [2] und Praktiker-Blog [7] hinweg.

### Kontext-Engineering: Compaction, Tool-Clearing, Memory-Tool (drei komplementäre Primitiven)

Anthropics offizielles Cookbook beschreibt drei unterscheidbare Mechanismen mit unterschiedlichen Kosten-Trade-offs [4]:

| Primitive | Problem | Mechanismus | Kosten |
|---|---|---|---|
| **Compaction** | lange Dialoge/Reasoning akkumulieren | gesamte Conversation zusammenfassen, durch Summary ersetzen | Inferenz (Summarizer läuft) |
| **Tool Clearing** | re-fetchbare Tool-Ergebnisse stapeln sich | alte `tool_result`-Blöcke durch Platzhalter ersetzen, `tool_use`-Record bleibt | keine (serverseitiger Edit) |
| **Memory** | Wissen überlebt keine Session-Grenzen | persistenter externer Speicher, Agent liest/schreibt per Tool-Call | Storage-I/O |

Default-Summarization-Prompt bei Compaction (Zitat) [4]: *"You have written a partial transcript for the initial task. Please write a summary. The purpose is to provide continuity so you can continue making progress in a future context where the raw history may not be accessible and will be replaced with this summary. Write down anything helpful: state, next steps, learnings."* Was überlebt: quantitative Kernbefunde, Task-Status, getroffene Entscheidungen; was verloren geht: Detailtabellen, Nebenstatistiken. Diagnose-Heuristik: steigt der Kontext gleichmäßig jeden Turn → Tool-Clearing; steigt er durch langen Dialog/Reasoning → Compaction; vergisst der Agent sitzungsübergreifend Fakten → Memory-Tool ergänzen [4].

### Managed-Agent-Memory (API-Ebene, produktionsreif)

Anthropics Managed-Agents-Memory-API [5] liefert konkrete operative Grenzwerte, die auch für eigene Datei-basierte Memory-Systeme als Orientierung dienen: einzelne Memory-Datei gedeckelt auf **100 kB (~25k Tokens)**, ein Store maximal **2.000 Memories** — explizite Empfehlung *"Structure memory as many small focused files, not a few large ones"* [5]. Best Practices dort direkt übertragbar auf Datei-Memory-Konzepte: fokussierte Stores statt einem großen Universal-Store (pro User/pro Domäne/pro Projekt), regelmäßiges Kondensieren/Pruning bevor der Speicher voll läuft, read-only für reines Referenzmaterial vs. read-write nur für tatsächlich schreibende Sessions — relevant auch als Sicherheitsaspekt: *"a successful prompt injection could write malicious content into the store. Later sessions then read that content as trusted memory"* [5].

### Subagent-Memory und das Silo-Problem

Seit Claude Code v2.1.33 (Februar 2026) gibt es ein `memory:`-Frontmatter-Feld, das jedem Subagenten einen persistenten Markdown-Wissensspeicher gibt, der über Aufrufe hinweg akkumuliert [via WebSearch-Aggregat; Primärquelle Community-Report, nicht offiziell volltext-verifiziert — als **[unbestätigt]** zu behandeln]. Ein Praxisbericht [11] weist jedoch auf eine strukturelle Schwäche hin: *"every subagent invocation starts fresh, and even when you opt into the persistence features Claude Code does ship, knowledge stays siloed inside each subagent"* — pro-Subagent-Memory-Directories sind untereinander unsichtbar, was zu redundanter Arbeit führt, wenn mehrere (parallele oder sequentielle) Subagenten denselben Sachverhalt unabhängig neu entdecken. Vorgeschlagene Architektur (Hindsight, Drittanbieter-Tool) [11]: ein geteilter Memory-Bank-Layer mit Recall-Phase (Orchestrator holt relevante Memories vor Delegation) und Retention-Phase (volle Session-Transkripte werden bei Turn-Ende gespeichert) — Subagents arbeiten dann "off a shared brain instead of independent re-derivations." Dies ist ein Drittanbieter-Vorschlag, kein offizielles Anthropic-Feature — **[unbestätigt/experimentell]**.

---

## c) Agent-Delegation: Subagents, Modell-Routing, Validierung

### Wann Subagents einsetzen (offizielle Kriterien)

Aus der offiziellen Subagents-Doku [3]: *"Use one when a side task would flood your main conversation with search results, logs, or file contents you won't reference again: the subagent does that work in its own context and returns only the summary. Define a custom subagent when you keep spawning the same kind of worker with the same instructions."* Fünf Nutzenkategorien: Kontext bewahren, Tool-Zugriff einschränken (Constraints), Konfigurationen projektübergreifend wiederverwenden, Verhalten spezialisieren, Kosten kontrollieren durch Routing auf günstigere Modelle wie Haiku [3].

Anti-Pattern "Infinite Exploration": *"You ask Claude to 'investigate' something without scoping it. Claude reads hundreds of files, filling the context."* Fix: Investigations eng scopen oder Subagents nutzen, damit die Exploration nicht den Hauptkontext verbraucht [2].

### Modell-Routing: Orchestrator stark, Worker günstig

Konsistentes Muster über mehrere Quellen: zweistufige Architektur — ein leistungsfähiges Modell (Orchestrator) versteht Ziele, zerlegt Aufgaben, delegiert, bewertet Output und entscheidet über nächste Schritte; günstigere/schnellere Modelle (Worker) führen mechanische Teilaufgaben aus (Codegenerierung, Suche, Dateioperationen, Tests schreiben) [12]. Konkrete Zahl zum Kostenhebel: *"Using Claude Opus as an orchestrator to plan and review while DeepSeek or Gemma handle heavy lifting can cut token costs by 5-10x without losing quality"* [12] — diese Zahl stammt aus einem einzelnen Praktiker-Blog und ist als **[unbestätigt]** zu markieren, da keine unabhängige Zweitquelle sie bestätigt. Praktisches Routing-Muster: Orchestrator klassifiziert eingehende Aufgabe nach Komplexität, routet einfache/mechanische Aufgaben an Haiku, komplexe/architektonische Entscheidungen bleiben beim stärkeren Modell (Sonnet/Opus) [12]. Offizielle Doku bestätigt die Grundmechanik (Modell pro Subagent konfigurierbar, z.B. `model: opus` im Subagent-Frontmatter) [2], nennt aber keine konkreten Kostenfaktoren.

### Validierung von Agent-Output durch den Orchestrator

Aus der offiziellen Best-Practices-Doku, Abschnitt "Add an adversarial review step" [2]: *"The longer Claude works unattended, the more an independent check matters before you count the work as done. A reviewer running in a fresh subagent context sees only the diff and the criteria you give it, not the reasoning that produced the change, so it evaluates the result on its own terms."* Konkretes Prompt-Muster: *"Use a subagent to review the rate limiter diff against PLAN.md. Check that every requirement is implemented, the listed edge cases have tests, and nothing outside the task's scope changed. Report gaps, not style preferences."* Wichtige Kalibrierungs-Warnung: *"A reviewer prompted to find gaps will usually report some, even when the work is sound, because that is what it was asked to do. Chasing every finding leads to over-engineering… Tell the reviewer to flag only gaps that affect correctness or the stated requirements, and treat the rest as optional."* [2]

Ergänzend beschreibt ein Praktiker-Blog [12] einen expliziten Fix-Retry-Zyklus: *"If a validator finds problems, it creates a fix task that routes back to a builder, and a new validator chains behind that fix, with the cycle narrowing until the output is correct"* [ursprünglich aus WebSearch-Snippet, thematisch konsistent mit [2]'s Adversarial-Review-Pattern]. Der Orchestrator-Review-Schritt wird als nicht optional beschrieben: *"isn't optional—it's where you catch errors before they compound"* — bei Problemen kann der Orchestrator bessere Instruktionen geben und erneut versuchen, auf ein stärkeres Modell eskalieren, oder kleine Probleme selbst beheben [12].

Anthropics Doku nennt zudem den Writer/Reviewer-Pattern für Sessions (nicht nur Subagents): getrennte Sessions für Implementierung und Review, da "a fresh context improves code review since Claude won't be biased toward code it just wrote" [2].

### Parallelität und Skalierungsgrenzen

Offizielle Doku beschreibt mehrere Eskalationsstufen für parallele Arbeit [2]: Worktrees (isolierte Git-Checkouts pro Session), Desktop-App (mehrere lokale Sessions visuell verwaltet), Claude Code on the web (Cloud-VMs), Agent Teams (automatisierte Koordination mehrerer Sessions mit geteilten Tasks/Messaging/Team-Lead). Für Batch-Migrationen: Fan-out-Pattern über `claude -p` in einer Shell-Schleife mit `--allowedTools`-Scoping, empfohlener Workflow: erst an 2-3 Dateien testen, Prompt verfeinern, dann in der Breite ausrollen [2]. Dynamic Workflows (s.o.) heben dieses Muster auf Skript-Ebene: bis zu "hundreds of parallel subagents" in einem einzigen Lauf, vom Modell selbst orchestriert statt von einer externen Shell-Schleife [6][1].

---

## Umsetzbare Empfehlungen für eine laufende Bau-Loop

Priorisiert nach Hebelwirkung für Marvins autonome Bau-Loops (promptgarden, TM2, ABS, patternfetch/framefetch):

1. **CLAUDE.md/LOOP.md radikal kurz halten und regelmäßig prunen.** Faustregel: bei jeder Zeile fragen "würde Entfernen zu Fehlern führen?" — wenn nein, streichen. Ziel unter ~150 Instruktionen/Zeilen für die Root-Datei; Detailwissen in referenzierte Unterdateien (`agent_docs/`, Skills) auslagern statt in die immer geladene Hauptdatei zu packen. Quelle: [2][7].

2. **Fortschritt IMMER in Dateien/Git externalisieren, nie im Kontextfenster vertrauen.** Bei jedem Loop-Durchlauf: Status-Datei (fix_plan.md/TODO.md-Äquivalent) lesen → Item wählen → umsetzen → validieren → Status-Datei aktualisieren → committen. Das ist die Kernlektion des Ralph-Wiggum-Musters und deckt sich mit Marvins bestehender "🔴🔴 Persistenz"-Regel. Quelle: [8][1].

3. **Jeden unbeaufsichtigten Task mit einem maschinenlesbaren Check versehen, bevor die Loop losläuft.** Kein "sieht fertig aus" — sondern Test/Build/Linter/Screenshot-Diff, das Claude selbst lesen und iterieren kann. Ohne Check wird der Nutzer selbst zur Verifikationsschleife. Quelle: [2] (offizielle Best-Practices, Abschnitt "Give Claude a way to verify its work").

4. **Adversarial-Review-Subagent als Pflichtschritt vor "fertig" einbauen**, besonders bei langlaufenden/unattended Runs: frischer Subagent-Kontext prüft den Diff gegen den Plan, meldet NUR Correctness-/Scope-Abweichungen, keine Stilpräferenzen (sonst Over-Engineering-Risiko). Direkt anwendbar auf Cockpit-Worker und ABS-Mechaniker-Orchestrator. Quelle: [2].

5. **Modell-Routing konsequent nach Aufgabentyp**, nicht nach Tool: mechanische/breite Arbeit (Datei-Suche, einfache Edits, Boilerplate) an günstigere Modelle (Haiku-Klasse), Architektur-/Ambiguitäts-Entscheidungen beim Orchestrator-Modell belassen. Deckt sich mit Marvins bestehender Regel "kleine Tasks → kleinere Modelle". Quelle: [12][2].

6. **Subagent-Memory bewusst scopen, nicht als Wundermittel behandeln.** Pro-Subagent-Memory-Directories sind siloed — bei wiederholt genutzten Spezial-Subagents (Security-Reviewer, Code-Reviewer) lohnt sich ein `memory:`-Feld, aber für Wissen, das MEHRERE Subagents teilen müssen, braucht es einen bewussten Orchestrator-vermittelten Weitergabe-Mechanismus (Recall vor Delegation, Retention nach Rückkehr) — sonst forschen Subagents dieselben Dinge wiederholt neu. Quelle: [11] [unbestätigt/experimentell, da Drittanbieter-Pattern].

7. **Bei Compaction/Kontext-Management explizit steuern, was überleben MUSS.** Für lange Cockpit-/ABS-Loops: CLAUDE.md-Instruktion für Compaction-Verhalten setzen (z.B. "bewahre immer die vollständige Liste geänderter Dateien und Test-Befehle"), proaktiv bei 60-70% Füllstand komprimieren statt bei Context-Rot zu warten. Quelle: [2][4].

8. **Für Skalierung über eine einzelne Loop hinaus: Fan-out/Dynamic-Workflows statt manueller Parallel-Sessions erwägen**, sobald ein Task in viele gleichartige unabhängige Teilaufgaben zerfällt (z.B. Bulk-Migrationen über viele Dateien/Prompts hinweg) — spart Koordinationsaufwand gegenüber händisch verwalteten Worktree-Sessions. Aktuell noch Research-Preview, Semantik kann sich ändern — für produktionskritische Loops vorerst nicht als stabilen Vertrag behandeln. Quelle: [1][6].

---

## Quellen

Alle URLs am 13.07.2026 per `curl -L -A 'Mozilla/5.0' --max-time 20` auf HTTP 200 verifiziert.

1. David Daniel — "Harness Engineering: How Claude Code and Codex Became Long-Running Agentic-Engineering Systems" — https://daviddaniel.tech/research/papers/harness-engineering/
2. Anthropic (offiziell) — "Best practices for Claude Code" — https://code.claude.com/docs/en/best-practices
3. Anthropic Engineering (offiziell, Erik Schluntz & Barry Zhang) — "Building Effective AI Agents" — https://www.anthropic.com/engineering/building-effective-agents
4. Anthropic Platform Docs / Cookbook (offiziell) — "Context engineering: memory, compaction, and tool clearing" — https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools
5. Anthropic Platform Docs (offiziell) — "Using agent memory" (Managed Agents) — https://platform.claude.com/docs/en/managed-agents/memory
6. Anthropic (offiziell) — "Introducing Claude Opus 4.8" (Dynamic Workflows) — https://www.anthropic.com/news/claude-opus-4-8
7. HumanLayer Blog — "Writing a good CLAUDE.md" — https://www.humanlayer.dev/blog/writing-a-good-claude-md
8. ZeroSync Blog — "The Ralph Loop: Long-Running AI Agents (Technical Deep Dive)" — https://www.zerosync.co/blog/ralph-loop-technical-deep-dive
9. Anthropic (offiziell) — "Create custom subagents" — https://code.claude.com/docs/en/sub-agents
10. Elvis Saravia (NLP Newsletter) — "Autonomous Long-Running Coding Agents" — https://nlp.elvissaravia.com/p/autonomous-long-running-coding-agents
11. Hindsight/Vectorize Blog — "Your Claude Code Subagents Don't Share What They Learn" — https://hindsight.vectorize.io/blog/2026/05/06/claude-code-subagents-shared-memory
12. MindStudio Blog — "How to Use a Smart Orchestrator Model to Direct Cheaper Sub-Agent Models in Claude Code" — https://www.mindstudio.ai/blog/smart-orchestrator-cheaper-sub-agent-models-claude-code

Hinweis: alle im Fließtext mit [1] zitierten Aussagen (Harness/Loop-Definition, CoALA-Speichermodell, PIV/Writer-Reviewer/Initializer-Coder-Muster) stammen aus derselben Primärquelle — dem daviddaniel.tech Harness-Engineering-Paper.

**Nicht volltext-gefetchte, aber als Kontext genutzte Suchergebnis-Aggregate** (nicht einzeln zitierfähig, nur zur Einordnung des Marktbilds verwendet, keine wörtlichen Zitate daraus übernommen): TechTimes "Claude Code Loop Engineering", Pasquale Pillitteri "Claude Code Harness 2026 Guide", Blake Crosley "Agent Architecture", Miles K./Medium "System Design of Claude Code Agent", Kilo/DigitalApplied/Echofold/htdocs.dev zu Multi-Agent-Orchestrierung, diverse Ralph-Wiggum-Sekundärquellen (prg.sh, codecentric.de, ralph-wiggum.ai, LinearB, dev.to), diverse Opus-4.8-Presseberichte (MarkTechPost, TechCrunch, The Agent Report u.a.), diverse CLAUDE.md/AGENTS.md-Guides (orchestrator.dev, maketocreate.com, redreamality.com, amitray.com, HackerNoon), GitHub awesome-harness-engineering-Liste.
