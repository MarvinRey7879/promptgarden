# Kapitel-Batch 9 (111 → 121) — Themen final, Stand 19.07.2026

Vorbereitet in It. 163. Verfahren wie bei Batch 8: erst alle 111 Bestands-Slugs listen,
dann Kandidaten per Volltextsuche im gesamten Bestand gegen bestehende Erwähnungen
prüfen, danach die nächstgelegenen Kapitel inhaltlich lesen und Überlappungen verwerfen.

## Die 10 Themen

| # | slug | category | diff | Kern | Abgrenzung |
|---|------|----------|------|------|------------|
| 1 | `kontextfenster-voll-was-tun` | guide | 2 | Der praktische Notfall: Kontext ist voll, Agent wird wirr. Was jetzt hilft — komprimieren, neu starten mit Zusammenfassung, Aufgabe teilen, Dateien gezielt entfernen; woran man es früh erkennt | 0 Treffer im Bestand. `kontext-strategien` (d3, Konzept) plant *vorher*, was rein soll — dieses Kapitel ist die *Reaktion*, wenn es zu spät ist. Muss im Text abgegrenzt werden |
| 2 | `commit-messages-mit-ki` | guide | 1 | Gute Commit-Nachrichten aus dem Diff erzeugen lassen: was ins Subject gehört, warum das "Warum" wichtiger ist als das "Was", Konventionen (Conventional Commits), wann der Agent danebenliegt | 0 Treffer; kein Kapitel behandelt Commits inhaltlich (`git-github-basics` erklärt nur die Mechanik) |
| 3 | `barrierefreiheit-mit-ki` | guide | 2 | Zugängliches Frontend mit Agenten: was Modelle zuverlässig können (Alt-Texte, ARIA-Rollen, Kontrastprüfung, Tastaturnavigation) und was sie nicht ersetzen (echte Tests mit Screenreader-Nutzenden) | 0 Treffer — echte Lücke. `frontend-mit-ki` (d2) dreht sich um visuelles Feedback per Screenshot, nicht um Zugänglichkeit |
| 4 | `api-design-mit-ki` | guide | 2 | Schnittstellen entwerfen lassen: Ressourcen und Namen, Fehlerformate, Versionierung, Idempotenz; warum der Agent gern zu viele Endpunkte vorschlägt und wie ein Review-Gate das abfängt | 0 Treffer im Bestand |
| 5 | `open-source-beitragen-mit-ki` | guide | 2 | Beiträge zu fremden Projekten mit Agenten: Contribution-Guidelines und DCO/CLA lesen lassen, Projekt-Konventionen übernehmen, KI-Anteil offenlegen wo verlangt, keine Massen-PRs | 0 Treffer. `open-source-modelle-lokal` behandelt etwas völlig anderes (Modelle selbst hosten) |
| 6 | `technische-schulden-abbauen` | guide | 3 | Schulden sichtbar machen und in Etappen abtragen: Inventur per Agent, Priorisierung nach Änderungshäufigkeit × Schmerz, kleine sichere Schritte, Fortschritt messbar halten | 0 Treffer. `legacy-code-modernisieren` (d3) behandelt Code *ohne Tests* und Characterization-Tests; hier geht es um Priorisierung und Reihenfolge im laufenden Betrieb. Abgrenzung ist Pflicht |
| 7 | `agent-logs-lesen` | guide | 2 | Eine Agenten-Session forensisch nachvollziehen: Welche Werkzeuge liefen, wo begann die Fehlannahme, welche Tokens gingen wofür drauf; typische Muster in Logs erkennen | 0 Treffer. `agenten-observability` (d3) baut die Datenerfassung auf (Logs, OpenTelemetry, Kosten-Tracking) — hier wird gelesen, was da liegt. Abgrenzung ist Pflicht |
| 8 | `modell-benchmarks-selbst-messen` | guide | 3 | Statt Ranglisten glauben: eigenen kleinen Benchmark aus echten Aufgaben bauen, fair messen (gleicher Prompt, mehrere Läufe), Ergebnisse dokumentieren | 0 Treffer. `benchmarks-lesen` (d2) erklärt fremde Ranglisten, `evals` (d2) misst *Prompts*; hier geht es um den Modell-Vergleich am eigenen Aufgabenprofil. Doppelte Abgrenzung nötig |
| 9 | `monitoring-alerts-mit-ki` | guide | 2 | Agenten in der Betriebsüberwachung: Alarme triagieren, Log-Muster zusammenfassen, Vorschläge für Runbooks; klare Grenze, wo ein Mensch entscheiden muss | 0 Treffer im Bestand |
| 10 | `fehlerkultur-nach-agenten-vorfall` | guide | 2 | Nach einem Vorfall mit Agentenbeteiligung: Ablauf rekonstruieren, Ursache statt Schuldigem suchen, Regel oder Test daraus bauen, Erkenntnis im Team teilen | Neu formuliert; das bei Batch 8 verworfene „agent-fehlerkultur" war zu weich — dieses ist an einen konkreten Anlass gebunden und liefert eine Checkliste. `agent-festgefahren` (d2) ist die Rettung *während* der Sitzung |

## Verworfen (mit Grund)

- `agent-in-ci-pipeline` — `ci-cd-mit-agenten` deckt es ab (6 Treffer im Bestand).
- `datenbank-migrationen-mit-ki` — 29 Treffer; `datenbanken-mit-agenten` behandelt Migrationen bereits.
- `abhaengigkeiten-aktualisieren` — 7 Treffer, verteilt über mehrere Kapitel; kein eigenständiges Thema.
- `fehlermeldungen-verstehen` — 9 Treffer, und der Fehler-Katalog auf `/fehler/` deckt genau das ab.
- `ki-in-code-interviews` — Randthema ohne Bezug zum Plattform-Kern (Programmieren mit Agenten).
- `agent-kosten-pro-feature` — zwei Kosten-Kapitel existieren bereits; die Feature-Perspektive trägt kein eigenes Kapitel.

## Mix

- Kategorien: 10 guide (bewusst — Batch 8 hatte viel Begriff/Konzept, hier liegt der Schwerpunkt auf Anwendung)
- Schwierigkeit: 1× d1, 7× d2, 2× d3
- Vier Kapitel tragen einen Pflicht-Abgrenzungsauftrag: kontextfenster-voll (vs. kontext-strategien), technische-schulden (vs. legacy-code-modernisieren), agent-logs-lesen (vs. agenten-observability), modell-benchmarks-selbst-messen (vs. benchmarks-lesen UND evals)

## Pipeline (wie Batch 8)

1. Zwei Autoren DE + EN parallel, vollständiges Schema inklusive `exercise.selfCheck`, Geschwister-Hinweis, Abgrenzungsaufträge im Prompt.
2. Beide Entwürfe hart validieren.
3. Adversarial-Review: jede Quelle fetchen und auf den Kern-Claim prüfen, Quiz, DE/EN-Parität, Abgrenzungen verifizieren, Quellen-Sets harmonisieren. **Reviewer-Fixes selbst gegenprüfen** — bei Batch 8 löste einer nur das Symptom.
4. Drei Übersetzer es/fr/zh, MD5-gepinnt.
5. Merge ×5 → WORLD-Zuordnung → Verify-Gate → Deploy → Live-Verify → Screenshot → Commit → HISTORY/Statusboard.
6. **Danach**: `llms.txt` von 111 auf 121 ziehen (drei Stellen: Intro, API-Zeile, Glossary-Zeile).
