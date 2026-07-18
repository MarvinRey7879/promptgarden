# Kapitel-Batch 8 (101 → 111) — Themen final, Stand 18.07.2026 abends

Vorbereitet in It. 150, damit morgen früh sofort die Autoren starten können.
Jeder Kandidat wurde gegen alle 101 Bestands-Slugs geprüft — nicht nur auf exakte
Slug-Gleichheit, sondern inhaltlich gegen die nächstgelegenen Kapitel.

## Die 10 Themen

| # | slug | category | diff | Kern | Abgrenzung |
|---|------|----------|------|------|------------|
| 1 | `websearch-und-grounding` | konzept | 2 | Agent holt aktuelle Fakten aus dem Web statt aus dem Gedächtnis: Grounding, Zitate, wann Websuche hilft und wann sie schadet | frei |
| 2 | `distillation` | begriff | 3 | Großes Lehrer-Modell trainiert kleines Schüler-Modell; warum kleine Modelle plötzlich gut sind, was dabei verloren geht | frei |
| 3 | `speculative-decoding` | begriff | 3 | Kleines Modell rät Tokens voraus, großes prüft im Block — schnellere Antworten bei identischer Ausgabe | frei; ergänzt `streaming` (Ausgabe) um die Erzeugungsseite |
| 4 | `latenz-optimieren` | guide | 2 | Antwortzeit statt Kosten senken: Modellwahl, Thinking-Budget, Caching, Streaming, Parallelisierung | Latenz wird in 6 Kapiteln nebenbei erwähnt (context-window, caching-strategien, batch-processing, reasoning-modelle, computer-use, fine-tuning), aber nirgends gebündelt |
| 5 | `ki-code-und-lizenzen` | konzept | 2 | Wem gehört KI-generierter Code? Lizenzfragen, Trainingsdaten-Herkunft, Attribution, was Anbieter zusichern | echte Lücke: 0 Erwähnungen von Lizenz/Urheberrecht im Bestand |
| 6 | `retrieval-evaluation` | konzept | 3 | Liefert die Suche das Richtige? Recall/Precision für RAG, Testfragen-Sets, typische Fehlerquellen | frei; baut auf `rag`, `rag-selbst-bauen`, `chunking-strategien` auf |
| 7 | `multi-repo-arbeit` | guide | 3 | Agenten über mehrere getrennte Repositories: Kontext je Repo, abgestimmte Änderungen, Reihenfolge beim Zusammenführen | ≠ `monorepo-mit-agenten` (ein Repo, viele Teilprojekte) — Gegenstück, muss im Text explizit abgegrenzt werden |
| 8 | `fine-tuning-oder-prompting` | guide | 2 | Entscheidungshilfe mit drittem Weg RAG: Kosten, Datenmenge, Änderungshäufigkeit, Zeitaufwand | `fine-tuning` erklärt WAS es ist (Begriff) — hier: WANN welcher Weg, als Entscheidungsbaum |
| 9 | `red-teaming-agenten` | guide | 3 | Das eigene Agenten-Setup angreifen: Testfälle für Prompt Injection, Rechte-Ausbruch, Datenabfluss; Ergebnisse dokumentieren | `prompt-injection-abwehr-praxis` = Abwehr aufbauen; hier = systematisch prüfen, ob sie hält. Abgrenzung MUSS im Text stehen |
| 10 | `prompt-versionierung` | guide | 2 | Prompts wie Code behandeln: versionieren, Änderungen testen, Regressionen erkennen, Rollback | frei: 0 Erwähnungen von Versionierung/A-B-Test für Prompts |

## Verworfen (mit Grund)

- `observability-metriken` — `agenten-observability` (d3) deckt Logs, Kosten-Tracking und OpenTelemetry bereits ab. Über 50 % Überlappung.
- `claude-md-patterns` — `claude-md` (d2) erklärt die Datei, `monorepo-mit-agenten` (d3) behandelt ihre Struktur in großen Repos. Ein drittes CLAUDE.md-Kapitel wäre Wiederholung.
- `agent-kosten-benchmarks` — Kosten sind doppelt abgedeckt (`kosten-kontrolle-agenten`, `kosten-optimierung-praxis`), Benchmark-Lesen ebenfalls (`benchmarks-lesen`, `swe-bench-agenten-benchmarks`).
- `secrets-management-agenten` — `api-keys-sicher-verwalten` (d1) deckt Umgebungsvariablen, Secret-Manager und Leak-Reaktion ab.
- `agent-fehlerkultur` — zu weich und nah an `agent-festgefahren` (d2); durch `speculative-decoding` ersetzt.

## Mix

- Kategorien: 3 konzept, 2 begriff, 5 guide
- Schwierigkeit: 6× d2, 4× d3 (keine d1 — die Grundlagen sind abgedeckt)
- XP: d2 = 40, d3 = 60

## Pipeline morgen (wie Batch 7)

1. Zwei Autoren (DE + EN, Sonnet) parallel, vollständiges Schema inklusive `exercise.selfCheck`, Geschwister-Hinweis gegen Rogue-Fork.
2. Harte Validierung beider Entwürfe.
3. Adversarial-Review: jede Quelle fetchen, Quiz fachlich, DE/EN-Parität, Quellen-Sets harmonisieren. **Reviewer-Fixes selbst gegenprüfen** (It. 143: ein Fix war ein No-op).
4. Drei Übersetzer es/fr/zh, MD5-gepinnt.
5. Merge ×5 → WORLD-Zuordnung in `site/lib/content.ts`.
6. Verify-Gate → Deploy (separater Call mit `cd`) → Live-Verify → Screenshot → Commit → HISTORY/Statusboard.
7. **Danach nicht vergessen**: `llms.txt` sagt „101 chapters" → auf 111 ziehen.
