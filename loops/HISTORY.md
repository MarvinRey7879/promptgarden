# promptgarten Loop — Iterations-Historie (Episodic Memory)
> Archiv: vollständige LOOP.md-Stände + Iterations-Protokolle. Neue Iterationen werden hier UNTEN angehängt (append-only).
> Die schlanke LOOP.md hält nur Regeln + aktuellen Stand (Semantic Memory). Restrukturiert It. 73 nach Deep-Research research/autonomous-loops-deep-research-2026-07.md.

# promptgarden — Autonome Bau-Loop

> Diese Datei wird jede Iteration überschrieben/erweitert. Sie ist das Gedächtnis der Loop.
> Stand: Iteration 1 — 2026-07-10

## Mission
Kostenlose, sich selbst weiterbauende Lern-Plattform für KI-/Agenten-basiertes Programmieren.
Zielgruppen: absolute Anfänger, Vibe-Coder, erfahrene Devs, Agenten-Nutzer — UND KI-Agenten selbst (später API/MCP).
Sprachen: DE, EN, ES, FR, ZH (v0.1: DE+EN). Sprache: simpel, faktisch korrekt, minimalistisch.
Themen: alle modernen KI-Systeme, CLIs, Tools, Funktionen, Benchmarks, Beispiele (z.B. „wie sieht eine gute Loop aus"),
Papers, GitHub-Repos, Begriffe (MCP, API, …), Claude Code, Hermes, OpenClaw, Best Practices, News.

## Design (FESTGELEGT — nicht neu diskutieren)
- Basis: Design **1d „Spielwiese"** aus `design/KI-Plattform-Designs.dc.html`
  - Creme #fdf6ec, Text #2b2118, Akzent #e8613c, Font „Bricolage Grotesque"
  - Karten: 2.5px solid #2b2118, border-radius 20px, Schatten `5px 5px 0 #2b2118`, leichte Rotationen
  - Kartenfarben: #c9e265 (lime), #f9c5d8 (pink), #a8d8f0 (blau), #f5d565 (gelb)
  - Brand: „prompt**garden** 🌱" (orange auf „garden"), Nav: Lexikon / Lernpfade / Feed / Vergleiche
- Aus **1h**: Schwierigkeitslevel pro Eintrag/Kapitel: ●○○ (leicht) ●●○ (mittel) ●●● (schwer)
- Aus **1i**: Gamification: XP, 🔥 Tage-Streak, ✓ abgeschlossene Kapitel, 🔒 gesperrte Kapitel,
  „Kein Account nötig zum Lesen — XP & Streaks optional" → localStorage, Account später optional.

## Harte Regeln (Marvin)
- 🔴 **QUELLENPFLICHT (11.07 nachgetragen 10.07): JEDER Inhalt muss Quellen/Zitate sichtbar zeigen** — im Text (Inline-Verweis) oder unten auf der Seite (Quellen-Block). Gilt für Lexikon-Einträge, Feed, Vergleiche, Research-Content, alles. Umsetzung: `sources`-Feld im Entry-Schema + Quellen-Sektion am Seitenende; bestehende 18 Einträge in It. 2 nachrüsten (Agent + Validierung). Keine Quelle erfindbar — lieber „Quelle: eigene Zusammenfassung der offiziellen Doku [Link]".

## Marvins Entscheidungen (bindend)
| Thema | Entscheidung | Datum |
|---|---|---|
| Hosting | Cloudflare Pages (Frontend); Backend: selbstgebaut auf CF Workers/D1 ODER Hetzner | 10.07 |
| Stack | Next.js (static export für $0-Hosting) | 10.07 |
| Spenden | PayPal.me + Ko-fi + GitHub Sponsors (Links/Handles fehlen noch → Platzhalter) | 10.07 |
| Deploy | Sofort live auf *.pages.dev; Domain-Kauf entscheidet Marvin (promptgarden.ai einzige freie) | 10.07 |
| Name | „promptgarden" (erstmal) | 10.07 |
| Monetarisierung | Google Ads o.ä. + Ad-free-Bezahlversion + Spenden; muss sich refinanzieren | 10.07 |
| Kosten | Alles so günstig wie möglich (außer Claude-Code-Kosten selbst) | 10.07 |
| Modelle | Orchestrator = Hauptloop; triviale Tasks → Sonnet/Haiku-Agenten; validieren+testen immer | 10.07 |

## Forum-Setup (Marvin-Entscheidung 11.07: A + B, Discord später)
- A: Repo PUBLIC https://github.com/MarvinRey7879/promptgarden (Secrets-Scan sauber), Discussions an (repo R_kgDOTVWuTw, Kategorie General DIC_kwDOTVWuT84DA-LF), giscus-Komponente env-gated — 🔴 MARVIN-KLICK OFFEN: github.com/apps/giscus installieren → dann NEXT_PUBLIC_GISCUS=on in .env.production + rebuild
- B: /forum LIVE (alle 5 Sprachen): D1-Tabelle forum_posts, Spam-Schutz (salted-IP-Hash-Rate-Limit 5/h, Bad-Words-Liste, >1 Link, >70% CAPS, Dup-Erkennung → Shadow-Block), Moderation via /v1/admin/forum (hide/show/delete), Posts in Admin-Summary
- Ab jetzt JEDE Iteration: forum_recent im Admin-Check mitlesen (Nutzer-Vorschläge = Arbeitsaufträge)
- Git-Remote: ab jetzt nach Commits auch `git push origin main`

## 🌐 DOMAIN promptgarten.com (11.07., Marvin bei Namecheap gekauft)
- Brand umbenannt: promptgarden → **promptgarten** (It. 26, live; technische URLs/Repo/Worker unverändert)
- Tokens: CF_PG_ZONE_TOKEN (cfut_, in autopilot.env) — kann DNS-Edit, aber KEIN zone.create (CF-UI-Falle: Permission muss in Account-Sektion); CF_PAGES_TOKEN ebenso nicht
- 🔴 MARVIN-SCHRITT OFFEN: CF-Dashboard → promptgarden-Account → „Add a domain" → promptgarten.com → Free → die 2 gezeigten Nameserver bei Namecheap eintragen (Domain → Nameservers → Custom DNS)
- LOOP-AUTOMATIK sobald Zone existiert (JEDE Iteration prüfen: GET /zones): (1) DNS: CNAME @ + www → promptgarden.pages.dev (proxied) via Pages-Custom-Domain-API `POST /accounts/{acc}/pages/projects/promptgarden/domains {"name":"promptgarten.com"}` + www; (2) warten bis Zone active; (3) DANN: noindex ENTFERNEN, metadataBase+hreflang (alternates.languages de/en/es/fr/zh je Pfad), sitemap BASE + robots Sitemap + llms.txt-URLs auf https://promptgarten.com, OG absolute URL; (4) Redirect www→apex (Bulk Redirect oder Pages macht's); (5) Search-Console-Vorbereitung (braucht später Marvins Google-Account)

## Blocker / Warte auf Marvin
- 🔴 **CF-API-Token mit `Cloudflare Pages:Edit`** (Account-Level) — keiner der vorhandenen Tokens kann Pages.
  Anleitung an Marvin geschickt (Iteration 1). Ohne Token: Build lokal fertig, Deploy pending.
- Spenden-Links: PayPal.me-Handle, Ko-fi-URL, GitHub-Sponsors-Handle
- Domain-Entscheidung promptgarden.ai (Marvin kauft selbst, kein Handlungsbedarf Loop)
- AdSense-Account (später, erst ab echtem Traffic + Domain sinnvoll)

## Architektur (Stand It. 1)
```
promptgarden/
├── LOOP.md          ← dieses File (Loop-Gedächtnis)
├── TODO.md          ← Roadmap + offene Punkte nach Prio
├── DECISIONS.md     ← Protokoll aller Marvin-Entscheidungen + offene Fragen
├── design/          ← Original-Design (dc.html) — REFERENZ, nicht ändern
├── site/            ← Next.js-App (static export → CF Pages)
│   └── content/     ← entries.<lang>.json — Lexikon/Kapitel-Content
├── research/        ← Deep-Research-Outputs pro Iteration
├── data/            ← Analytics-Auswertungen, Feedback-Exporte
└── loops/           ← Iteration-Logs (was getan, was gelernt)
```
- Gamification: rein client-side (localStorage): XP, Streak (Datum-Kette), completed[]
- Backend (It. 2+): CF Worker + D1: bug-reports, feedback, newsletter-signups, view-tracking (cookieless)
- Feedback-Feld für Marvin: auf der Site unter /admin (Artifact kann wegen CSP nicht POSTen) — bis dahin: Chat

## Standard-Zyklus (ab It. 11 — Wochen-Rhythmus statt „jede Iteration alles")
Rotierende Schwerpunkte, damit die Loop nachhaltig bleibt:
1. **Research-Iteration** (~1×/Woche): Deep Research (Trends, News, Pain-Points, Repos, Papers) → research/-Report
2. **Content-Iteration** (~2×/Woche): Neue Einträge/Feed-Items aus letztem Research, voller Verifikations- + Übersetzungs-Workflow
3. **Qualitäts-Iteration** (~1×/Woche): Link-Checker über alle sources-URLs (tote Links → fixen), Fakten-Aging (Einträge mit Datumsbezug prüfen), Lighthouse, Traffic-Auswertung → beliebte Themen vertiefen
4. **Feature-Iteration** (nach Bedarf): Neue Sektionen/Funktionen aus TODO.md-Prios
Jede Iteration IMMER: Admin-Summary zuerst (Marvin-Notes = höchste Prio), Artifact am Ende.

## Iterations-Protokoll
### It. 1 (10.07.2026) — Fundament ✅ ABGESCHLOSSEN
- Design importiert (DesignSync), 1d/1h/1i analysiert
- 4 Entscheidungen von Marvin eingeholt (s.o.)
- Ordnerstruktur, LOOP.md, TODO.md, DECISIONS.md
- Content-Agent (Sonnet, 113k Tokens): 18 Kern-Einträge DE+EN, validiert (Slugs identisch, Fakten-Stichprobe MCP/Hermes ok)
- Next.js-Site GEBAUT + GETESTET: 44 statische Seiten, Build ✅, Kernseiten 200, Quiz rendert, Screenshot data/screenshot-home-de.png
- Status-Artifact LIVE: https://claude.ai/code/artifact/c4776440-c8c0-486b-aa89-2143193c0ab0 (jede It. unter gleicher URL aktualisieren — gleiche file_path data/statusboard.html)
- CF-Pages-Token: Marvin macht "später, als Todo im Artifact" → It. 2 NICHT auf Deploy warten
- Lokaler Test-Server-Workflow: npx serve out -l 4173, danach taskkill

### It. 2 (10.07.2026) — Quellenpflicht + Backend + Research ✅ ABGESCHLOSSEN
- 🔴 QUELLENPFLICHT LIVE: sources-Feld in allen 36 Einträgen (DE+EN), 44 URLs alle HTTP-200-verifiziert (Sonnet-Agent, von mir re-validiert), Quellen-Block rendert auf jeder Eintragsseite
- git init + 2 Commits (It.1 Fundament, It.2)
- Worker-Backend KOMPLETT geschrieben (worker/): D1-Schema (bugs/feedback/admin_notes/newsletter/page_views cookieless), index.js syntax-geprüft, DEPLOY.md-Runbook — wartet nur auf CF-Token (braucht auch Workers+D1:Edit, nicht nur Pages!)
- Frontend API-ready: lib/api.ts + Track.tsx (cookieless) + BugButton→Worker mit mailto-Fallback; alles no-op bis NEXT_PUBLIC_API_URL gesetzt
- Deep Research #1 fertig: research/2026-07-10-deep-research-1.md (65+ Bullets, alle mit Quellen). Top-Findings: Fable-5-Pull+Redeploy-Story, MCP-Spec-Rev 28.07., Gemini-CLI-Shutdown, Editor-Konsolidierung, Token-Kosten-Schock, Vibe-Coding-Security
- ⚠️ Research-Claims (SpaceX/Cursor $60B, Uber-Budget etc.) VOR Veröffentlichung als Content selbst per WebFetch verifizieren — Sonnet-Research, Quellenpflicht gilt auch für mich

### It. 3 (10.07.2026) — Feed + neue Einträge + /admin ✅ ABGESCHLOSSEN
- Eigene Nach-Verifikation der Research-Claims per WebFetch (6 Fetches): 5 bestätigt, 1 Korrektur (SpaceX-IPO nicht Cursor-IPO), unbelegte Details (Gemini closed-source/20req) GESTRICHEN
- Feed-Sektion LIVE: /[lang]/feed/, 7 Items DE+EN (MCP-Spec-RC, GPT-5.6, Fable-5-Redeploy, Gemini-CLI-Shutdown, SpaceX/Cursor, Opus 4.8, DB-Lösch-Vorfall), jedes mit verifizierten Quellen, Nav-Pill aktiviert
- 5 neue Lexikon-Einträge (23 total pro Sprache): modell-lifecycle, kosten-kontrolle-agenten, vibe-coding-sicherheit, subagents, guardrails-fuer-agenten — 13 URLs alle 200-verifiziert
- /admin-Dashboard gebaut (nicht verlinkt): Key-gated, Views/Top-Seiten/Bugs/Feedback + Marvin-Prio-Feld → /v1/admin/note; zeigt Setup-Hinweis bis Backend deployed
- Build 54 Seiten ✅, Smoke-Tests ✅, Commit 3

### It. 4 (10.07.2026) — 🚀 LIVE-DEPLOY ✅ ABGESCHLOSSEN
- Marvin lieferte CF-Token (cfat_, EIGENER Account 25e76011f11e89c0b35b6ff0f10795db — nicht tm2!) → `CF_PAGES_TOKEN` + `CF_PROMPTGARDEN_ACCOUNT_ID` + `PG_ADMIN_KEY` in ~/.tm2-secrets/autopilot.env
- D1 `promptgarden-db` (cac9087a-2671-40e2-b87c-7f6c0d138895) + Schema + ADMIN_KEY-Secret + Worker deployed; workers.dev-Subdomain „promptgarden" registriert
- **Site LIVE: https://promptgarden.pages.dev** · **API LIVE: https://promptgarden-api.promptgarden.workers.dev**
- Smoke-Tests: alle Seiten 200 (522er = Edge-Propagation, verschwanden), /v1/bug→D1 ✅, /v1/track ✅ (views_7d zählt), /v1/admin/summary ✅
- Bug-Button + Tracking + /admin damit SCHARF (NEXT_PUBLIC_API_URL in .env.production)
- Impressum live (/impressum): framefetch-Daten (Marvin Mez, Köln, USt-ID DE461538484) + Datenschutz-Kurzfassung — Marvin-Anweisung im Chat
- Marvin-Entscheidungen neu: Domain kauft er noch; Spenden-Links bleiben Todo; Fokus = Konstrukt weiterbauen
- ⚠️ Hinweis für alle Iterationen: erste Requests nach Pages-Deploy können 404/522 liefern → 10-15s warten, Retry

### It. 5 (10.07.2026) — Wizard + Welt 2 + Spanisch + SEO-Basics ✅ ABGESCHLOSSEN
- Admin-Check: 9 Views live gezählt, keine Notes/echten Bugs
- Einstiegs-Wizard LIVE (/[lang]/start/): 3 Fragen → beginner/intermediate/pro → Empfehlung + Link; Home-Chip „Neu hier" → /start; Ergebnis in localStorage pg_wizard
- Lernpfad Welt 2 „Agenten" LIVE: ki-agent → agent-loop → vibe-coding → subagents → guardrails → loops (eigene Freischalt-Kette)
- 🌍 SPANISCH KOMPLETT LIVE: 23 Einträge + 7 Feed + komplette UI (Sonnet-Agent, validiert: Slugs/Quiz-Indizes/URLs identisch); Sprachwechsler zyklisch de→en→es; /es/ in Root-Detection
- Newsletter-Formular scharf (POST /v1/newsletter), ehrlicher Hinweis „Versand startet in Kürze"
- SEO: sitemap.xml (91 URLs) + JSON-LD (Article+citation) auf Eintragsseiten; hreflang BEWUSST verschoben bis Domain da (braucht finale absolute URLs)
- Build 91 Seiten, live-getestet, Commit 5

### It. 6 (10.07.2026) — Alle 5 Sprachen + Vergleiche ✅ ABGESCHLOSSEN
- Admin: 10 Views, keine Notes/Bugs
- 🌍 FR + ZH KOMPLETT (2 parallele Sonnet-Agenten, beide stark validiert: 61/61 UI-Keys, Quiz-Indizes identisch, 15 fr.wiki- + 15 zh.wiki-URLs alle 200) → ALLE 5 SPRACHEN LIVE (152 Seiten). Sprachwechsler zyklisch de→en→es→fr→zh
- Vergleiche-Sektion LIVE (/[lang]/vergleiche/): Claude Code / Cursor / Codex CLI / Aider — Karten mit Typ/OpenSource/Preis-Chips, ✅Highlights + ⚠️Caveats, Quellen pro Karte, „Stand"-Datum; 4 Quellen-URLs selbst verifiziert. DE+EN nativ, es/fr/zh vorerst EN-Fallback (Übersetzung folgt)
- Nav komplett: alle 4 Pills aktiv
- Learnings: Pages-Edge braucht nach Deploy bis ~60s (404/522 auf neuen Routen = warten, until-Loop statt sleep)
- Commit 6

### It. 7 (10.07.2026) — Loop-Galerie ✅ ABGESCHLOSSEN
- Admin: 11 Views, nichts Neues
- Loop-Galerie LIVE (/[lang]/loops/, alle 5 Sprachen): 3 annotierte Beispiele — (1) gute Loop = promptgarden-eigene Anatomie (7 Schritte, ehrlich meta), (2) schlechte Loop „Endlos-Bastler" (5 echte Fehler), (3) Mensch-in-der-Loop (asynchron, irreversibel=Mensch). Quellen: Anthropic building-effective-agents + Claude-Code-Hooks-Doku, beide selbst verifiziert (200). Content von MIR geschrieben (Loop über sich selbst), es/fr/zh via Agent (validiert)
- Vergleiche jetzt in allen 5 Sprachen nativ (kein EN-Fallback mehr)
- Home-Loops-Karte → /loops/ (alle 5 Dicts per Skript)
- 157 Seiten, live-getestet, Commit 7
- Newsletter-Frage an Marvin BEWUSST geparkt (hängt an Domain-Kauf; seine Ansage: erst Konstrukt bauen) — im Artifact als Punkt vermerkt

### It. 8 (10.07.2026) — Agenten-API + Research #2 ✅ ABGESCHLOSSEN
- Admin: 14 Views, nichts Neues
- 🤖 FREIE AGENTEN-API LIVE: /api/index.json + 20 Content-JSONs (alle Sprachen/Typen), llms.txt (Agenten-Einstieg), robots.txt — prebuild-Script scripts/build-api.mjs kopiert content/→public/api/
- OG-Meta pro Eintragsseite (generateMetadata), Quiz-Fortschritt ✓X/23 im Lexikon-Footer
- Deep Research #2 fertig (research/2026-07-10-deep-research-2.md): Top-10-Beginner-Fragen (HN/Algolia + Cursor-Forum; Reddit blockiert — transparent vermerkt), Top-5-Content-Gaps: (1) Setup/Install-Tutorial (2) Modell+Plan-Wahl (3) Git/GitHub-Basics (4) Deployment-Tutorial (5) Agent-Recovery. 4 frische News: China-Warnung/Alibaba-Bann zu Claude Code (CNBC/SCMP), Zhipu ZCode, Rowboat (Show HN), Claude Code v2.1.197
- Commits 8 + 8b

### It. 9 (10./11.07.2026) — Nachfrage-Guides + Welt 0 ✅ ABGESCHLOSSEN
- China-Story SELBST verifiziert (WebSearch: CNBC/CBS/Tom's HW bestätigen MIIT-Warnung v2.1.91–196, Alibaba-Bann ab 10.07., Anthropic-Antwort Anti-Abuse-Experiment, PR-Entfernung 01.07.)
- 3 neue Guides LIVE (26 Einträge/Sprache): claude-code-installieren, modell-und-plan-wahl, git-github-basics — Agent hat Install-Doku live geprüft und MEINE veralteten Annahmen korrigiert (nativer Installer statt npm empfohlen; npm-Pfad braucht Node 22+, nicht 18+) → Quellenpflicht zahlt sich aus
- 3 neue Feed-Items (10/Sprache): china-claude-backdoor, zhipu-zcode, claude-code-2-1-197
- Lernpfad WELT 0 „Loslegen" live (5 Kapitel: installieren → modellwahl → git → claude-code → claude-md), rendert nur bei ≥4 vorhandenen Kapiteln (saubere Degradation)
- 172 Seiten, alle 5 Sprachen, Live-Tests ✅ (Learnings: /api/ am Edge cached länger — auf neuen Wert pollen statt einmal prüfen)
- Commit 10

### It. 10 (11.07.2026, Nachtmodus) — Research-Gaps geschlossen ✅ ABGESCHLOSSEN
- 2 letzte Gap-Guides LIVE (28 Einträge/Sprache): agent-festgefahren (Recovery-Playbook: Stop→Diff lesen→Reset→git-Undo→kleiner schneiden→Ansatz wechseln→selbst machen), projekt-deployen (static vs server, Free-Tier-Pfad, Secrets, vendor-neutral) — 5 Quellen verifiziert
- ALLE 5 Research-#2-Gaps damit abgedeckt (Install, Modellwahl, Git, Deployment, Recovery)
- Insight-Karte auf Home jetzt DYNAMISCH: zeigt neuestes Feed-Item (Titel+Datum), verlinkt /feed/ — Label „AKTUELL IM FEED" in 5 Sprachen
- 182 Seiten, Live-Tests ✅, Commit 11

### It. 11 (11.07.2026, Nachtmodus) — OG-Image + Rhythmus + Forum-Vorlage ✅ ABGESCHLOSSEN
- OG-Image live (/og.png, 1d-Look via Playwright-Screenshot von data/og-template.html) + openGraph-Metadata
- Standard-Zyklus in LOOP.md verankert (Research/Content/Qualität/Feature rotierend)
- Forum-Entscheidungskarte im Statusboard: A giscus (empfohlen, braucht public Repo) / B eigenes D1-Forum / C Discord — WARTET auf Marvin
- Learning: IMMER cd site/ vor npm-Befehlen prüfen (ENOENT-Timeout gekostet)
- Commit 12

### It. 12 (11.07.2026, Nachtmodus) — Qualitäts-Audit #1 ✅ ABGESCHLOSSEN
- 🔍 LINK-AUDIT: 91 distinct sources-URLs aus allen 30 Content-Files geprüft → **91/91 = HTTP 200, 0 tote Links** (Script: data/check-links.sh, wiederverwendbar)
- Streak-Chip ab Tag 1 sichtbar (vorher erst ab Tag 2) — Gamification-Feedback für Erstbesucher
- Traffic-Baseline: 14 Views/7d (13× /en/, 1× /de/) — noch praktisch nur eigene Besuche, echte Auswertung erst nach Domain+Indexierung sinnvoll
- Lighthouse-CLI defekt (Chrome-Headless-Crash) → nächstes Qualitäts-Audit via PageSpeed-Insights-API
- Commit 13

### It. 13 (11.07.2026, Nachtmodus) — CLI-Befehle-Guide ✅ ABGESCHLOSSEN
- Guide „Slash-Befehle, Hooks & Co" LIVE (29 Einträge/Sprache): 6 echte Built-ins (/help /config /compact /model /permissions /clear, verbatim aus code.claude.com/docs/en/commands), Custom Commands (.claude/commands/*.md — Doku-Note: in Skills gemerged, alte Files funktionieren weiter), Hooks (PreToolUse/PostToolUse/SessionStart), Subagents-Verweis, Mental Model „Befehle=steuern, Hooks=Automatik, Subagents=Delegation"
- 187 Seiten, Commit 14
- Marvins Spec-Punkt „wofür verschiedene Befehle in Claude da sind" damit abgedeckt

### It. 14 (11.07.2026, Nachtmodus) — Gamification-Vertiefung ✅ ABGESCHLOSSEN
- XP-Level als Emoji im Header-Chip: 🌱 Start → 🌿 ab 200 XP → 🌳 ab 600 XP (sprachneutral, kein i18n nötig)
- Welten-Fortschritt „✓ n/m" (+🎉 bei komplett) über jedem Lernpfad-Board
- 187 Seiten, deployed, Commit 15
- Views weiter 14 (nur Eigen-Traffic — erwartbar bis Domain/Indexierung)

### It. 15 (11.07.2026) — Skills-Eintrag + Benchmark-Research ✅ ABGESCHLOSSEN
- Eintrag „Skills" LIVE (30 Einträge × 5 Sprachen, 192 Seiten): Doku + Anthropic-Engineering-Blog verifiziert
- Deep Research #3 Benchmarks fertig (research/2026-07-11-…-benchmarks.md): 10 Benchmarks mit verifizierten offiziellen URLs (SWE-bench, Terminal-Bench, Aider Polyglot, LiveCodeBench, LMArena→arena.ai, HumanEval legacy, Artificial-Analysis Coding Agent Index, ARC-AGI-2, MMLU, METR Time Horizons), 8 Kritik-Punkte (Kontamination, Saturation, SWE-bench-Gaming 32,67% Leakage, Vendor-Cherry-Picking, 15-30% Real-World-Gap), 4 verifizierte Top-Ergebnisse
- ⭐ Research-Empfehlung übernommen: KEINE Zahlen auf der Plattform einbetten (veralten in Wochen, mehrere „offizielle" Scores pro Benchmark) → Explainer „Benchmarks lesen" + Mini-Cards (Name/misst was/wer/Link zum Live-Leaderboard)
- Commits 16

### It. 16 (11.07.2026) — Benchmarks-Säule ✅ ABGESCHLOSSEN
- /[lang]/benchmarks/ LIVE (alle 5 Sprachen, 202 Seiten): 10 Benchmark-Karten (SWE-bench, Terminal-Bench, Aider Polyglot, LiveCodeBench, LMArena, HumanEval-legacy, AA Coding Agent Index, ARC-AGI-2, MMLU, METR) — misst-was/wer/⚠️Caveat/Live-Leaderboard-Link, bewusst NULL Zahlen (Digit-Scan verifiziert)
- Guide „benchmarks-lesen" (31 Einträge/Sprache): 7 Kritik-Punkte + Praxis-Regeln, 4 verifizierte Quellen
- Verlinkung: Vergleiche-Seite → Benchmarks, Benchmarks → Guide, sitemap
- Marvins Spec-Punkt „ihre benchmarks" damit abgedeckt — wartungsarm designt
- Commit 17

### It. 17 (11.07.2026) — Beispiel-Sessions + Kadenz-Anpassung ✅ ABGESCHLOSSEN
- „So sieht das aus"-Blöcke (Terminal-/Chat-Transkripte, ```text) in 3 Kern-Guides, alle 5 Sprachen — Agent arbeitete mit String-Literal-Replace, Nicht-Ziel-Einträge byte-identisch verifiziert, Backups im Scratchpad
- Commit 18
- ⚙️ KADENZ-ENTSCHEIDUNG der Loop: Fundament komplett (alle ohne Marvin machbaren Spec-Punkte abgedeckt: Design/5 Sprachen/Quellen/Gamification/Wizard/Feed/Vergleiche/Benchmarks/Loop-Galerie/API/Backend/Admin/Impressum/31 Einträge). Größte Hebel hängen an Marvin: DOMAIN (→SEO/hreflang/Indexierung/Newsletter-Versand/Ads/Search-Console), FORUM A/B/C, SPENDEN-Links. → Takt auf ~60 Min, Iterationen fokussieren auf: täglich 1× Research/Feed-Refresh, 1× Qualitäts-Check, Content nur bei klarem Mehrwert. Marvin-Nachricht weckt sofort und beschleunigt wieder.

### It. 18 (11.07., Erhaltungstakt) — Health-Check grün, bewusst keine Änderung ✅
### It. 19 (11.07.) — Hermes + OpenClaw faktenbasiert ✅ ABGESCHLOSSEN
- Primärquellen gefunden + verifiziert: OpenClaw = github.com/openclaw/openclaw (MIT, Steinberger, Clawdbot→Moltbot→OpenClaw, 24.11.2025, live 382k Stars via GitHub-API, 20+ Messaging-Plattformen, Skills/ClawHub) · Hermes = github.com/NousResearch/hermes-agent (Nous Research, Launch 25.02.2026, self-hosted, persistentes Gedächtnis, selbst-verbessernde Skills, Docs nutzen wörtlich „agent loop")
- Beide Einträge in 5 Sprachen von konzeptionell → faktenbasiert (Body/Teaser/Example/Sources neu, OpenClaw-Quiz korrigiert), 6 Doku-URLs verifiziert, Nicht-Ziel-Einträge byte-identisch
- Marvins Spec-Punkt „hermes und openclaw thematisieren" jetzt VOLL erfüllt
- Commit 19

### It. 20 (11.07.) — Interaktiver Token-Schätzer ✅ (Ideen-Parkplatz umgesetzt)
- TokenPlayground-Komponente auf token- + context-window-Einträgen (alle 5 Sprachen, Inline-Dict): Live-Schätzung (Heuristik ~4 Zeichen/Token latin, ~1,5 CJK, ehrlich gelabelt) + Balken gegen 8k/200k/1M Context Windows — erstes interaktives Lern-Tool der Plattform
- Commit 20

### It. 21 (11.07.) — „Weiterlernen"-Karte ✅
- ContinueCard auf Home: Rückkehrer sehen nächstes offenes Kapitel über alle 3 Welten (localStorage, Inline-Dict 5 Sprachen); rendert nichts für Erstbesucher
- 🔴 LEARNING (2. Vorfall!): Bash-cwd wechselt zwischen Calls unzuverlässig → JEDER Build/Deploy-Call beginnt mit explizitem `cd /c/Users/marvi/promptgarden/site`; Verifikation von Client-Strings im JS-Bundle (out/_next/static/chunks/), nicht im SSG-HTML
- Commit 21; Artifact-Update gebündelt mit nächstem Substanz-Update (Feed-Refresh abends)

### It. 22 (11.07.) — Health grün, keine Änderung ✅ (Views 14→20)
### It. 23 (11.07.) — Lernpfad Welt 3 „Werkzeugkasten" ✅
- 6 Kapitel: claude-code-befehle → claude-skills → mcp → kosten-kontrolle-agenten → projekt-deployen → benchmarks-lesen; jetzt 4 Welten / 25 von 31 Einträgen in Pfaden; Views 27
- Commit 22

### It. 24 (11.07.) — Forum A+B umgesetzt ✅ (siehe Forum-Setup-Block oben)
### It. 25 (11.07.) — Feed-Refresh ✅
- Neues Item chatgpt-work (10.07., CGTN primär-verifiziert: GPT-5.6-Super-App = Chatbot+Codex, vs Claude Cowork, GPT-5.6 war zuvor auf US-Regierungswunsch verzögert) — 11 News × 5 Sprachen; Home-Insight-Karte zeigt es automatisch
- Cowork-Web/Mobile-Story bewusst NICHT übernommen (nur Aggregator-Quelle, nicht auf anthropic.com/news verifizierbar)
- Forum: nur eigene Test-Posts, Spam-Blocking bestätigt (2 blocked)
- Commit 24, gepusht

### It. 26–39 (11.–12.07., Kurzprotokoll)
- Benchmarks-Redesign (keine eingebetteten Scores), promptgarten-Rebrand (Domain promptgarten.com von Marvin gekauft), README public, giscus vorbereitet (wartet auf Marvins App-Install), OG-Image, Statusboard-Artifact aktualisiert
- Zone-Blocker: kein Token kann zone.create (CF-UI-Falle, Account-Sektion) → Fallback: Marvin muss im Dashboard „Add a domain" klicken; seit It. 33 stündliches Polling (Nachtmodus), Zone weiterhin nicht angelegt

### It. 40 (12.07., 06:22) — Feed-Faktenkorrektur MCP-Spec ✅
- Admin-Summary: 0 Notes, 0 Bugs, 0 Forum. Zone: weiter offen.
- **Fehler gefunden:** Feed-Item mcp-spec-2026-07-28 trug Zukunftsdatum (Spec-Versionsname als date) + behauptete „final erschienen". Primärquelle (MCP-Blog) verifiziert: Status = Release Candidate seit 21.05., final erst 28.07.2026, „contains breaking changes".
- Fix in allen 5 Sprachen (date→2026-07-09, Titel/Summary → RC-Status), deployed + live verifiziert (API, DE- und ZH-Seite)
- **Neuer Guard:** build-api.mjs bricht Build ab, wenn ein Feed-Item date > heute hat
- **Lektion:** Feed-date = Ereignisdatum, NIE Versions-/Ankündigungsdatum in der Zukunft; „veröffentlicht" nur schreiben, wenn Quelle den finalen Release belegt
- 🔔 MERKER: Am/nach 28.07. prüfen, ob MCP-Spec final erschienen → Feed-Update

### It. 41 (12.07., 07:29) — Link-Audit #2 ✅
- Zone offen, 0 Notes/Bugs/Forum
- URL-Liste aus Content neu generiert (91→115 durch Benchmarks/Hermes/OpenClaw/Feed-Wachstum), alle 115 = HTTP 200
- Lektion bestätigt: Liste vor jedem Audit frisch generieren, nicht die alte wiederverwenden

### It. 42 (12.07., 08:33) — Statusboard-Refresh ✅
- Artifact auf It.-42-Stand (Karte 40–42, erledigte Forum-Entscheidungs-Karte entfernt), gleiche URL

### It. 43 (12.07., 09:38–10:10) — Feed-Refresh: 3 neue News ✅
- Sonnet-Research-Agent → 3 Kandidaten; ALLE Kern-Claims selbst nachverifiziert (WebFetch): TechCrunch (Grok-4.5-Preise $2/$6, Musk „Opus-class/vergleichbar Opus 4.7"), Cursor-Blog (Ko-Training SpaceXAI+Cursor, Billionen Cursor-Tokens), offizieller W28-Digest, Cursor-Changelog
- **Quellenpflicht-Korrektur am Agent-Output:** Browser-Item behauptete „eigenes Profil ohne Logins" + „explizite Freigabe für Schreibaktionen" — Digest sagt tatsächlich „sandboxed, Persistenz wählbar, Safety-Classifier prüfen Aktionen" → ersetzt; 9to5Mac-Quelle gestrichen (nicht selbst verifiziert), offizieller Digest als Quelle
- Neu live: grok-4-5-cursor, claude-code-desktop-browser, cursor-3-11-side-chats — 17 News × 5 Sprachen, Home-Insight zeigt Cursor 3.11
- x.ai/news liefert WebFetch-403, curl mit Browser-UA 200 → Quelle ok (bekanntes Muster)

### It. 44 (12.07., 10:49) — 🔧 Blinder Admin-Poll gefunden + gefixt ✅
- **Bug in meinem eigenen Iterations-Poll:** seit It. 40 `Authorization: Bearer` gesendet, Worker erwartet `X-Admin-Key` → `{"error":"unauthorized"}`, und mein Parser maskierte das als „0 Notes/0 Bugs". Iterationen 40–43 waren auf dem Notes-Kanal blind.
- Korrekt nachgeprüft: wirklich 0 Notes/Bugs/Feedback offen — nichts von Marvin verpasst. Forum: nur eigener Test-Post öffentlich, Troll/Spam-Testposts (It. 24) korrekt shadow-geblockt.
- **Lektion (Guard-Prinzip):** Poll-Skripte müssen auf `j.error` HART failen statt Defaults zu liefern — leere Antwort und Fehler-Antwort dürfen nie gleich aussehen.

### It. 45–46 (12.07.) — Erhaltung + Housekeeping ✅
- It. 45: Live-Smoke 5/5 grün, bewusst keine Änderung. It. 46: TODO.md komplett neu (war Stand It. 1)

### It. 47 (12.07., 13:57) — Übungen zum Nachmachen ✅ (P2-Feature)
- Neues Entry-Feld `exercise` {task, steps[3], selfCheck[3]} + Lime-Card-Render nach Beispiel-Block + i18n-Labels (exercise/selfCheck, 5 Sprachen)
- 3 Guides bestückt: erst-plan-dann-code, claude-code-befehle (/help, /doctor, /usage — Fakten aus offiziellen W21/W28-Digests von heute), kontext-fuettern — je ×5 Sprachen, live verifiziert DE/ZH/ES
- Muster für weitere Übungen etabliert: Übung = im EIGENEN Tool nachmachen, 3 Schritte, 3 Selbst-Check-Fragen, keine erfundenen Behauptungen über Tool-Verhalten

### 🔴 MARVIN-DIREKTIVEN 12.07 (22:30) — überschreiben ältere Takt-Regeln
1. **KEIN NACHTMODUS.** Loop läuft 24/7 im vollen Arbeitstakt. Nachts NICHT auf reine Poll-Iterationen drosseln — immer an Substanz weiterbauen (Content/Features/Research), Zone-Poll läuft nebenbei mit.
2. **Neue Säule „Befehls-Referenz"** (höchste Content-Prio):
   - Hierarchie: Plattform → Befehl (z.B. Claude Code → /goal). Eigene Sektion /[lang]/befehle/ mit Hub → Plattform-Seite → Befehls-Detailseite.
   - Jede Befehlsseite: Was macht er (simpel, faktisch) · „Wann einsetzen?" mit 2-3 guten Beispielen · „Wann eher nicht?" mit Negativ-Beispielen + besserer Alternative (z.B. „Dauerauftrag? → eher /loop statt /goal") · Quellen (offizielle Doku, verifiziert).
   - Plattformen: Claude Code zuerst (offizielle Doku code.claude.com), dann Codex CLI, dann weitere (Cursor CLI, Aider, Gemini-Nachfolger …).
   - JEDER Befehl einzeln — Vollständigkeit zählt.
3. **Addons/Ökosystem-Bereich**: Graphify, Obsidian + weitere wichtige Addons/Integrationen — erst Research mit Quellenpflicht (was ist Graphify wirklich? nur belegte Fakten), dann eigene Sektion oder Lexikon-Einträge.

### Bau-Plan Befehls-Referenz (It. 56 ff.)
- [x] Research A: Claude-Code-Befehle vollständig aus offizieller Doku (It. 56 gestartet)
- [x] Research B: Codex CLI Stand + Befehle (It. 56 gestartet)
- [x] Research C: Addons (Graphify, Obsidian, weitere) (It. 56 gestartet)
- [ ] Datenmodell commands.<lang>.json {platform, slug, name, summary, whenGood[], whenBad[{why, alternative}], sources[]}
- [ ] Routen /befehle/ + /befehle/[platform]/ + /befehle/[platform]/[slug]/ + Nav-Eintrag (5 Sprachen)
- [ ] Claude-Code-Befehle Batch 1 live → dann Codex → dann Addons-Sektion

### It. 56–57 (12.07 22:30 – 13.07 früh) — Marvin-Direktiven + Befehls-Referenz LIVE ✅
- Marvin: kein Nachtmodus / Befehls-Referenz / Addons (Graphify, Obsidian) → verankert (oben) + Memory
- Research ×3 fertig + gesichert in research/befehle/: claude-code-2026-07-12.json (92 Befehle, DE, offizielle Doku; /theme existiert NICHT als eigener Befehl), codex-cli-2026-07-12.md (~25 Slash + Subcommands/Flags; CLI lebt eigenständig, 09.07-Merge betraf nur Desktop-App), addons-2026-07-12.md (Graphify 83k★ verifiziert, 4 Obsidian-Integrationen, 7 Kern-Addons)
- **LIVE:** /[lang]/befehle/ Hub → Plattform → Befehl (Nav in 5 Sprachen), 92 Claude-Code-Befehlsseiten DE mit Quellen; commands.<lang>.json + lib/commands.ts + 3 Routen
- **LIVE:** giscus AN (Marvin hat App installiert; NEXT_PUBLIC_GISCUS=on in .env.production), Spenden-Links PayPal paypal.me/Marv7879 + Ko-fi ko-fi.com/marvinm im Footer (beide URLs 200-verifiziert); GitHub Sponsors wartet auf Marvins Anmeldung
- ⚠️ Codex-Authoring-Agent starb an Wochen-Rate-Limit (Reset 3:00 Berlin) → Retry
- Lektion: `npm run build | tail` maskiert Build-Fehler (Exit-Code von tail) → Deploy lief mit stalem out/. Ab jetzt Build-Erfolg separat prüfen (z.B. `npm run build && deploy` ohne Pipe oder `set -o pipefail`)
- Lektion: static export verträgt KEINE leere generateStaticParams-Route → Routen erst mit Daten shippen
- OFFEN (Reihenfolge): ① whenGood/whenBad-Batches für Top-Claude-Code-Befehle (DE+EN) ② Codex-Einträge (16, Agent-Retry) ③ Übersetzungen EN/ES/FR/ZH der 92 Summaries/Whats ④ Addons-Sektion ⑤ /admin abhakbare Marvin-Todo-Liste (Marvin-Wunsch 13.07) ⑥ Sitemap um /befehle/ erweitern
- MARVIN-KANAL-Regel (13.07): Artifact kann nichts senden (CSP) → /admin-Prio-Feld ist der Schreibkanal; regelmäßig neue Marvin-Todos (GSC nach Domain, Reddit etc.) ins Statusboard posten
- 🔴 STATUSBOARD-Regel (Marvin 13.07): ERLEDIGTE Punkte fliegen aus der „Deine To-dos"-Sektion RAUS — dort stehen nur offene Aufgaben (Erledigtes gehört in die „Neu in Iteration"-Karten)

### 🔴 MARVIN 13.07 (mittags): ALLE Befehle (nicht nur Kern) bekommen wann/wann-nicht-Blöcke, jeweils doc-basiert
- Batches 2-4 (je ~26, restliche 78 Claude-Code-Befehle) DE+EN via Agents; Aliase/Trivial-Toggles dürfen 1+1 statt 2+2 haben

### It. 59 (13.07 mittags) — ALLE 92 Claude-Code-Befehle mit Blöcken DE+EN ✅ (Commit 27c4438)
- Batches 2-4 (78 Befehle) gemerged, live verifiziert (Edge brauchte ~1 Min Content-Propagation — Status-200-Poll reicht NICHT, auf INHALT pollen!)
- ⚠️ ES/FR/ZH-Übersetzungs-Agents basieren auf commands.de.json VOR Batch-2-4-Merge → deren Validierung kann jetzt scheitern + Blöcke der 78 fehlen dort → nach Merge separaten Usage-Übersetzungs-Nachzug (batch2-4 × 3 Sprachen) fahren

### It. 60 (13.07 nachmittags) — 🏁 MEILENSTEIN: Befehls-Referenz KOMPLETT ✅ (Commit 5bf99d7)
- **108 Befehle (92 Claude Code + 16 Codex CLI) × 5 Sprachen × wann/wann-nicht-Blöcke** — alles live + verifiziert (DE/EN/ZH/FR/ES Stichproben), auch in der freien JSON-API (/api/commands.<lang>.json, im Index dokumentiert)
- ES/FR/ZH-Agents hatten die Live-Erweiterung der Quelldatei selbst erkannt und re-synct (Drift-Check im Agent-Workflow hat funktioniert — Muster beibehalten: Übersetzungs-Agents sollen Quelle vor finalem Write re-validieren)
- Marvins „ALLE Befehle"-Wunsch damit für beide Start-Plattformen erfüllt; weitere Plattformen (Cursor CLI, Aider, …) als nächste Ausbaustufe
- NÄCHSTE ARBEIT: ① Addons-Sektion (research/befehle/addons-2026-07-12.md → eigene Seite/Sektion + Graphify/Obsidian-Lexikon) ② /admin abhakbare Marvin-Todo-Liste ③ Sitemap um /befehle-Routen erweitern ④ Statusboard ⑤ Feed-Refresh täglich weiter ⑥ Zone-Poll

### 🔴 MARVIN 13.07 (nachmittags): VISUALISIERUNGEN
- Themen wie Loops (mit Beispielen), Graphify, Obsidian etc. sollen **verständliche, aber hochwertige Visualisierungen** bekommen — Diagramme/Grafiken direkt auf den Seiten, nicht nur Text.
- Umsetzungsplan: eigene SVG-Diagramm-Komponenten im 1d-Design (dicke Border, harte Schatten, Farben aus der Palette), KEINE Fremd-Bilder (Quellen-/Lizenzfrage). Startpunkte: ① Loop-Galerie (Denken→Handeln→Prüfen-Zyklus, gute vs. kaputte Loop als Diagramm) ② Agent-Loop-/Subagent-Lexikoneinträge ③ Addons: Graphify-Funktionsprinzip (Code→AST→Graph→Agent), Obsidian↔Claude-Verbindungsdiagramm ④ Context-Window-Visualisierung. Batch-weise in Rotation einbauen, inline-SVG in Seiten (kein Client-JS nötig).

### 🔴 MARVIN 13.07 (abends) — 3 NEUE DIREKTIVEN
1. **Admin-Dashboard V2 — „richtig stark"**: Insights, Stats, Nutzerzahlen, Revenue usw. Plan: Worker-Metriken erweitern (views_by_day 30d-Zeitreihe, Sprach-Verteilung, Länder cookieless via CF-Header request.cf.country — kein PII, Newsletter-Liste, Forum-Stats) + Dashboard-UI mit SVG-Zeitreihe/Verteilungen + Revenue-Karte (Ko-fi-Webhook /v1/kofi-webhook — braucht Marvins Ko-fi-Verification-Token; PayPal.me hat keine Webhooks → manuell erfassbar).
2. **MEHR KAPITEL**: Content-Tempo deutlich hoch — pro Tag mehrere neue Lexikon-Einträge/Kapitel (Kandidaten: RAG, Embeddings, Fine-tuning, Prompt-Injection, Structured Outputs, Evals, Worktrees, Hooks, Skills-vs-Plugins, Multi-Agent-Patterns, Kontext-Strategien, CI/CD mit Agenten, Batch-Processing, Modell-Routing …), Welten erweitern.
3. **ZWEI DETAIL-LEVEL pro Inhalt**: leichte Erklärung + detailreiche Erklärung, Nutzer stellt selbst ein (Toggle 🌱 Einfach / 🔬 Im Detail, localStorage pg_detail_level). Schema: Entry.bodyDetail (optional), Client-Toggle-Komponente auf Eintragsseiten; bodyDetail-Retrofit für 31 Einträge ×5 batch-weise (Quellenpflicht: Details nur belegt/vertiefend, keine neuen unbelegten Fakten).
Reihenfolge: It. 67 Admin-V2 → It. 68 Detail-Toggle-Feature + erste bodyDetail-Batches → parallel Content-Batches (mehr Kapitel) → Visualisierung Batch 3 + Cursor CLI in Rotation.

### 🔴 MARVIN 13.07 (abends, Direktive 4): AUTORSCHAFT
- Überall raus, dass eine KI die Seite baut — MARVIN ist der Macher. Zusätzlich überall kommunizieren: Seite ist absichtlich KI-freundlich UND Scrape-freundlich („ich will, dass jeder lernt").
- Umgesetzt It. 67: footerNote ×5 („gebaut von Marvin … ausdrücklich KI- und Scraping-freundlich"), loops-Galerie neutralisiert (Beispiel 1 = generische Bau-Loop, kein Selbstbezug, LOOP.md→Notiz-Datei), llms.txt + README (neuer „AI-friendly & scrape-friendly — on purpose"-Abschnitt, Marvin als Builder). REGEL für alle künftigen Inhalte: nie KI-Autorschaft behaupten, Marvin ist Absender.

### 🔴 MARVIN 13.07 (Direktiven 6+7): RESPONSIVENESS/WOW + MONETARISIERUNGS-TODOS
6. **Responsiveness + Wow-Effekt IMMER mitdenken**: mobile-first prüfen, hochwertige Optik, „Insight"-Gefühl — bei jedem Feature; eigener Polish-Pass geplant (mobile Stichproben aller Kern-Seiten, Diagramme, Admin, Karten-Grids).
7. Monetarisierung/Distribution als /admin-Todos mit Schritt-für-Schritt: ✅ AdSense-Todo #5 (Marvin schickt Verifizierungs-Code → Loop baut ads.txt+Snippet+Cookie-Consent-Banner — Consent PFLICHT bei EU-Ads!), ✅ Bing-Webmaster-Todo #6 (GSC-Import-Weg). Weitere folgen (Verzeichnisse, Reddit …).

### 🔴 MARVIN 13.07 (Direktive 5): ADDON-DETAILSEITEN
- Addons/GitHub-Repos/CLI-Tools sind auf /addons zu schmal erklärt → JEDES Addon bekommt eine EIGENE Seite (/addons/[id]/) mit ausführlicher Erklärung: was es ist, wie es funktioniert, Setup/Installation, wann nutzen/wann nicht, Beispiel, Quellen — 5 Sprachen, Quellenpflicht (Setup-Fakten aus offizieller Doku/README).

### 🔴 MARVIN 13.07 (Direktive 8): LANDING PAGE AUSBAUEN
- Startseite muss erklären: was ist das, wie funktioniert es, Best Practices — MIT Tiefenrecherche zu Conversion-Rate + SEO vorab (Research-Agent → research/landing-cro-seo-2026-07.md), dann Umbau der Landing auf Basis der Top-Empfehlungen (How-it-works-Sektion, Value Prop, CTA-Strategie, schema.org WebSite/FAQ, 5 Sprachen, Wow+responsive).

### It. 72 (13.07 abends) — bodyDetail-Batch 2 KOMPLETT ✅ (Commit 85938f4)
- 20/41 Kapitel mit 🔬-Version in ALLEN 5 Sprachen · ⚠️ cwd-Falle erneut (Merge aus Root → ENOENT + False-Positive-Verify durch RSC-Payload-Grep) — Regel verschärft: JEDES node/npm IMMER mit explizitem cd /c/Users/marvi/promptgarden/site && …; Verify-Greps auf INHALTS-Strings, nie auf UI-Labels
- Landing-CRO/SEO-Research-Agent läuft

### It. 71 (13.07 abends) — 📱 Mobile-Polish-Pass 1 ✅ (Commit 99fc6ae)
- 375px-Audit per Playwright-Screenshots (Home/Eintrag/Lexikon/Befehl): Home+Eintrag+Befehl sauber; **Lexikon-Tabelle war kaputt** (Titel auf ~80px gequetscht, inline gridTemplateColumns reservierte 150px für versteckte Spalte) → Fix: .lex-row-Klasse mit Media Query (mobil nur Titel+Level), live verifiziert per Nach-Screenshot
- Befehlsseiten: doppelter Summary-Satz entfernt (what beginnt oft mit summary → Rest-Slice)
- Lektion: Inline-Styles mit gridTemplateColumns sind media-query-resistent — responsive Grids IMMER als CSS-Klasse; Fixed-Position-Elemente (BugButton) erscheinen in Full-Page-Screenshots mitten im Content = Artefakt, kein Bug
- bodyDetail-Batch 2 DE+EN gemerged (20/41 mit Detail-Version); ES/FR/ZH-Agent läuft
- OFFEN: Batch-2-ES/FR/ZH mergen+deploy, Kapitel-Batch 2, Feed 14.07, Cursor CLI, Visualisierung Batch 3

### It. 70 (13.07 abends) — 🧩 ADDON-DETAILSEITEN LIVE ✅ (Commit 57e18ec) — Marvin-Direktive 5 erfüllt
- 60 neue Seiten: /[lang]/addons/[id]/ für alle 12 Addons ×5 Sprachen — how (aus READMEs), 🔧 Setup-Schritte (exakte Befehle aus offizieller Doku), ✅/⛔-Blöcke, Quellen (26 Links verifiziert); Hub-Karten mit „→ Details"; Sitemap erweitert
- Faktenkorrektur nebenbei: VS-Code-Extension 2 Mio → 20 Mio+ Installs (Live-Marketplace, Agent-Fund)
- Muster „Route parken bei leeren Daten" (site/_hold/) hat funktioniert — Build blieb grün während Content-Produktion
- 877 Seiten gesamt. AdSense-Todo #5 + Bing-Todo #6 mit Schritt-für-Schritt in /admin geseedet
- ROTATION OFFEN: Mobile-Polish-Pass (RESPONSIVENESS+WOW-Direktive!), bodyDetail-Batch 2 (nächste 10), Kapitel-Batch 2 (10 neue Themen), Feed 14.07, Visualisierung Batch 3, Cursor CLI

### It. 68–69 (13.07 abends) — 📚 KAPITEL-BATCH 1 + DETAIL-TOGGLE LIVE ✅ (Commit 849d0d0)
- **41 Einträge ×5 Sprachen** (+10 neue: rag, embeddings, fine-tuning, prompt-injection, structured-outputs, evals, git-worktrees, hooks, multi-agent-patterns, kontext-strategien — 26 Quellen verifiziert, 5 selbst stichprobengeprüft)
- **Detail-Toggle 🌱/🔬 LIVE** (BodyToggle-Komponente, localStorage pg_detail_level): 10 Kern-Einträge haben bodyDetail in allen 5 Sprachen (llm, token, context-window, mcp, prompt, ki-agent, agent-loop, subagents, claude-code, halluzination)
- WORLD_2 → 8 Kapitel (+multi-agent-patterns, kontext-strategien), WORLD_3 → 9 (+hooks, git-worktrees, evals)
- Pipeline-Muster bewährt: 2 Authoring-Agents parallel → 3 Übersetzungs-Agents parallel → Merge mit Konsistenz-Validierung (slug-Sets, quiz.correct, sources identisch) → EIN Deploy
- URL-Liste 140→162 · Statusboard auf It. 69
- OFFEN: bodyDetail-Batches 2-4 (restliche 31 Einträge) · Kapitel-Batch 2 (weitere 10 Themen: Ideen: system-prompts-vertieft, tool-use, computer-use, sandboxing, agent-sicherheit, model-routing, caching-strategien, o.ä.) · Visualisierung Batch 3 (Context-Window) · Cursor CLI · Feed 14.07 · wöchentl. Link-Audit ~19.07

### It. 67 (13.07 abends) — 📊 Admin-Dashboard V2 LIVE + Autorschafts-Rebrand ✅ (Commit b14b973)
- Worker-Summary erweitert: views_by_day (30d), views_by_lang, views_by_country (cookieless via CF-Header), top_refs, views_total, newsletter_recent, donations, revenue_total_cents
- NEU: Tabelle donations + POST /v1/kofi-webhook (aktiv erst mit KOFI_TOKEN-Secret — auf Marvins Ko-fi-Verification-Token warten, dann `wrangler secret put KOFI_TOKEN`) + POST /v1/admin/donation (manuell)
- /admin-UI: KPI-Chips (7d/gesamt/Revenue), 30-Tage-Balkenchart (SVG), Sprach-/Länder-Verteilungsbalken, Referrer-Liste, Spenden-Karte mit Manuell-Erfassung + Ko-fi-Hinweis
- Erste echte Insights: DE 81 · US 13 · FR 2 · PL 1 Views (7d) — internationale Besucher da!
- ⚠️ Lektion ERNEUT: build|tail maskierte TS-Fehler → stale Deploy; danach gefixt (Dist-Typing) und sauber deployed. TODO: Deploy-Wrapper-Skript mit hartem Exit bauen
- OFFEN aus Direktiven: MEHR KAPITEL (Content-Batches) + Detail-Level-Toggle (Entry.bodyDetail) — nächste Iterationen

### It. 66 (13.07) — 🎨 Visualisierung Batch 2: Addons-Diagramme LIVE ✅ (Commit d8c172e)
- components/AddonDiagrams.tsx: GraphifyDiagram (📁 Code → 🌳 Tree-sitter → 🕸️ Graph ⇄ 🤖 Agent, „ohne LLM-Calls") + ObsidianClaudeDiagram (Vault ⇄ Local REST API /mcp/ ⇄ Claude) — auf /addons über dem Karten-Grid, Labels addons.<lang>.json.diagrams ×5, live verifiziert DE+ZH
- Batch 3 offen: Context-Window-Visual (Lexikon token/context-window) · dann Cursor-CLI-Research · Feed 14.07 morgen früh

### It. 65 (13.07) — 🎨 Visualisierung Batch 1: Loop-Diagramme LIVE ✅ (Commit 99e5bcb)
- components/LoopDiagram.tsx: LoopCycleDiagram (Denken→Handeln→Prüfen→Fertig?-Zyklus mit Rückschleife) + GoodBadLoopDiagram (✅ vs ⛔ Vergleich) — Inline-SVG, 1d-Stil, kein Client-JS, Labels aus loops.<lang>.json.diagram (5 Sprachen), role=img+aria-label
- Live verifiziert auf promptgarten.com/de/loops (+zh). Muster für weitere Diagramme etabliert (Box-Helper, viewBox 640, overflowX-Container)
- Traffic: views_7d 43→96 (Domain-Effekt)
- Visualisierung Batch 2 offen: Graphify-Prinzip (Code→AST→Graph→Agent) + Obsidian↔Claude auf /addons · Batch 3: Context-Window-Visual im Lexikon · danach Cursor-CLI-Research (3. Plattform)

### It. 64 (13.07) — SEO-Phase 2: canonical + hreflang ÜBERALL ✅ (Commit cc7a961)
- langAlternates()-Helper (lib/i18n.ts) + Agent-Edit aller 14 [lang]-Routen: canonical absolut + 5×hreflang + x-default(en), via metadataBase
- Verifiziert im Build-Output UND live auf promptgarten.com (Achtung: SSR rendert hrefLang camelCase — HTML-case-insensitiv, grep entsprechend)
- Offen aus SEO-Block: www→apex-Redirect (Token-Recht) — canonical entschärft das Duplicate-Content-Risiko bereits

### It. 63 (13.07) — 🌍 DOMAIN-AUTOMATIK GEZÜNDET: promptgarten.com LIVE ✅
- Zone active (Marvin stellte NS um) → Loop automatisch: Pages-Custom-Domains apex+www (beide active+SSL), Parking-DNS (A+www-CNAME) ersetzt durch CNAME→promptgarden.pages.dev proxied, MX/TXT-Mail-Forwarding UNANGETASTET gelassen
- Site: noindex→index,follow · metadataBase=https://promptgarten.com · sitemap/robots/llms.txt/README auf neue Domain · Worker-CORS +promptgarten.com+www (deployed) — alles live verifiziert (apex 200, www 200, robots-Meta, sitemap, CORS 200)
- DNS-Schreibrechte: NUR CF_PG_ZONE_TOKEN kann DNS (Master+Pages-Token: auth error); Ruleset-API (www→apex-Redirect) kann KEIN vorhandenes Token → Redirect offen (unkritisch, beide Hosts serven; Lösung: canonical-Tags in hreflang-Runde ODER Token-Recht „Dynamic Redirect" von Marvin)
- Todos: #1 done markiert, #3 Platzhalter ersetzt durch konkretes GSC-Todo #4 (Marvin soll TXT-Verifizierungswert schicken → Loop trägt DNS ein)
- OFFEN als Nächstes: hreflang+canonical pro Seite (Phase 2), GSC-TXT sobald Marvin liefert, Sitemap bei Google einreichen (nach GSC), OG-Image-URL prüfen, Cursor-CLI/Aider-Research, Statusboard ✅ aktualisiert

### It. 61 (13.07 nachmittags) — Addons-Sektion LIVE + 🎉 Zone angelegt ✅ (Commit 2594208)
- /[lang]/addons/ live: 12 Tools (Graphify, MCP-Katalog, claude-flow, Context7, Playwright-MCP, GitHub-MCP, VS-Code-Ext, Claude-in-Chrome, 4× Obsidian) × 5 Sprachen, Kategorien-Chips, Stars, Quellen; Nav-Punkt „Addons"; Sitemap um befehle+addons-Routen erweitert
- Übersetzungs-Agent fixte JSON-Fehler in addons.de.json (falsches Anführungszeichen) — Lektion: JSON nach Hand-Autoring IMMER mit node parsen
- **ZONE promptgarten.com existiert (pending)**: Marvin hat CF-Teil erledigt! NS: eve+mike.ns.cloudflare.com. Namecheap zeigt noch registrar-servers → Teil B fehlt, Push mit exakten NS geschickt. Bei status=active → Domain-Automatik SOFORT fahren
- OFFEN: /admin abhakbare Todo-Liste, Statusboard-Update (Zone-Fortschritt + Addons + Befehle-Meilenstein), Feed-Refresh (heute noch keiner!), weitere Plattformen

### It. 58 (13.07 vormittags) — Befehls-Referenz DE+EN komplett ✅
- Codex 16 Einträge DE+EN live · Batch 1 whenGood/whenBad (14 Kern-Befehle) DE+EN live · EN-Basis aller 92 Claude-Code-Befehle live → 108 Befehle × DE+EN
- 3 Übersetzungs-Agents ES/FR/ZH (je 108 Einträge → research/befehle/commands-{es,fr,zh}.json) GESTARTET
- Danach offen: ES/FR/ZH mergen+deploy · whenGood/whenBad Batch 2 (nächste ~16: resume? nein fertig — Kandidaten: batch, review, simplify, security-review, mcp, plugin, skills, memory, context, init, add-dir, cd, agents, thinking, usage, permissions) · Addons-Sektion · /admin-Todo-Liste · Sitemap /befehle · Statusboard/API-Doku (build-api index um commands erweitern)

### Standard-Iteration (aktualisiert 12.07 — Warte-auf-Marvin gilt NUR noch für Domain-Automatik)
1. Admin-Summary (Notes = sofort umsetzen) — KORREKTER Aufruf (Fix 2, It. 62 — Poll las seit It. 44 FALSCHE Keys!):
   `curl -s .../v1/admin/summary -H "X-Admin-Key: $PG_ADMIN_KEY"`
   Echte Keys: `open_admin_notes` / `open_bugs` / `new_feedback` / `marvin_todos` / `views_7d` / `top_paths_7d` / `forum_recent`
   Parser MUSS werfen wenn `j.open_admin_notes === undefined` (Schema-Drift-Guard) UND wenn `j.error`. NIE stumm defaulten.
   Marvin-Todos pflegen: POST /v1/admin/todo {action:add|toggle|delete, ...} — Loop schreibt neue Aufgaben rein, prüft done-Status (done=1 ⇒ z.B. „sponsors aktiv" ⇒ Footer-Link einbauen)
2. GENAU EINE Sache nach Tagesrhythmus: Research/Feed-Refresh (1×/Tag, neue News verifiziert in 5 Sprachen) ODER Qualitäts-Check (Link-Sample, Live-Smoke) ODER kleine Verbesserung aus TODO/Ideen-Parkplatz
3. Artifact nur bei Substanz aktualisieren (nicht jede Iteration neu publishen ohne Änderung)
4. Wakeup 3600s

### Alter It. 3 — Plan (erledigt, Referenz)
1. Marvin-Input prüfen (Token? → volles Deploy nach worker/DEPLOY.md; Site + Worker + D1)
2. Feed-Sektion bauen: content/feed.<lang>.json + /[lang]/feed/ Seite — erste Items aus Research #1 (NUR selbst-verifizierte Claims, jede mit Quelle)
3. Neue Lexikon-Einträge aus Research (Sonnet-Agent + Validierung): fable-5-lifecycle, cost-controls, vibe-coding-security, subagents, claude-artifacts
4. /admin-Seite (key-gated, liest /v1/admin/summary, Prio-Feld → /v1/admin/note)
5. Artifact aktualisieren; ggf. Newsletter-Entscheidung (#9) bei Marvin nachfassen

### Alter It.2-Plan (erledigt, Referenz)
1. Zu Beginn: Chat auf neuen Marvin-Input prüfen (Token gepostet? → sofort speichern als CF_PAGES_TOKEN in ~/.tm2-secrets/autopilot.env + deployen: npx wrangler pages deploy out --project-name=promptgarden)
2. git init im site/-Ordner (Versionierung, Backup)
3. Backend-Worker-Code schreiben (CF Workers + D1): POST /bug /feedback /newsletter /track — lokal fertig, Deploy sobald Token
4. /admin-Seite (Token-geschützt via ?key=): Marvin-Prio-Eingabefeld → Worker
5. Deep Research #1 (Workflow, Sonnet-Agents): aktuelle KI-News/Modelle/CLIs/Pain-Points → research/2026-07-*.md → Feed-Sektion + neue Einträge
6. Artifact aktualisieren

## Nächste Iterationen (Kurzfassung — Details in TODO.md)
1. Deploy sobald Token da; Lighthouse-Check; noindex bis Domain
2. Backend-Worker (bug-report, feedback, newsletter, cookieless analytics) + /admin-Dashboard
3. Deep Research #1: aktuelle Modelle/CLIs/Trends → Feed-Sektion + neue Einträge
4. Sprachen ES/FR/ZH; Einstiegs-Wizard („Wo stehst du?"); Vergleiche-Sektion
5. SEO (sitemap, hreflang, schema.org), MCP/API für Agenten, Forum-Konzept

### It. 73 (13.07.26) — 🚀 Landing-Rebuild + 🔬 Deep Research „Autonome Loops" UMGESETZT ✅
- **Landing NEU** nach CRO/SEO-Research (Commit nach 85938f4): lib/landing.ts (5 Sprachen), spezifischer Primär-CTA „Finde deinen Startpunkt"→/start/, Audience-Badges, ehrliche Live-Katalog-Zahlen (build-time berechnet), Show-don't-tell-Beispielkarte (echter MCP-Eintrag), How-it-works 3 Schritte (interne Links = SEO), Trust-Sektion (E-E-A-T), Meta-Title/Description pro Sprache; Lernpfade: Course-ItemList-JSON-LD (4 Welten, KEIN FAQPage — Rich-Results Mai 2026 eingestellt). Live verifiziert (CTA-String + 4× Course im JSON-LD).
- **Deep Research fertig** (Marvin-Auftrag „schau selber nach loop und md konzepten … und setz das um"): 3 parallele Agenten → research/dr-loops-part{1,2,3}.md (39 Quellen, alle 200-verifiziert; 1 WebSearch-Snippet-Halluzination erkannt+verworfen) → Synthese research/autonomous-loops-deep-research-2026-07.md.
- **UMSETZUNG in die eigene Methodik**:
  1. LOOP.md restrukturiert: Semantic (Regeln, kurz) vs. Episodic (diese HISTORY, append-only) — CoALA-Muster; Prune-Regel verankert.
  2. NEU site/scripts/lint-content.mjs als prebuild-Gate (blockt Build hart): Slug-Parität ×5, Quiz-Indizes, Quellenpflicht, Quellen-Konsistenz (lokalisierte Wikis ok), bodyDetail-Parität, Feed-Zukunftsdaten. Ist-Bestand: 0 Fehler.
  3. Verify-Gate formalisiert (Lint→BUILD_EXIT→Content-String-Verify→Screenshot bei UI→known-good-Commit für Rollback).
  4. Adversarial-Review-Pflicht für Content-Batches + Publikationsrate≤Review-Kapazität (Google scaled-content-abuse) + Autonomie-Grenzen als Kategorie-Liste + Compaction-Preserve-Block.
- Lektion aus Lint-Bau: entries/feed-JSONs sind top-level Arrays (nicht {entries}/{items}) — Schema vor Tooling prüfen; lokalisierte Wikipedia-Quellen sind GEWOLLT sprachverschieden.

### It. 74 (13.07.26 abends) — 📚 KAPITEL-BATCH 2 LIVE: 51 Kapitel ×5, NEUE Pipeline mit Adversarial-Review ✅
- 10 neue Kapitel ×5 Sprachen (tool-use, computer-use, sandboxing, agent-sicherheit, model-routing, caching-strategien, plugins, headless-non-interactive, permissions-modes, artifacts), ALLE mit bodyDetail (🌱+🔬 ab Tag 1) + Quellen (22 URLs verifiziert) + Quiz; 6 mit Übung. 927 Seiten (+50).
- 🛡️ ERSTE ADVERSARIAL-REVIEW-PIPELINE (DR-Umsetzung) hat sich SOFORT bezahlt gemacht — Review-Agent (frischer Kontext) fand 3 BLOCK-Findings, die beide Autoren-Agents übersehen hatten: (1) Amazon-Q-„Syntaxfehler verhinderte Schaden"-Claim nicht quellengedeckt → ersetzt durch belegte Version, (2) Artifacts-Formatliste (Mermaid/docx/pptx) über Quelle hinaus → auf Help-Center-Stand reduziert, (3) „Opus 4.8 = leistungsstärkstes Modell" von eigener Preisquelle widerlegt (2 neuere Modelle drüber) → „eines der leistungsstärksten". + FIX: Preiszahlen-Label „(Stand: Juli 2026)". Alle Fixes vor Übersetzung angewandt (kein Drift; Übersetzer bekamen MD5-Summen und prüften selbst).
- WORLD_2 → 11 Kapitel (+tool-use/sandboxing/agent-sicherheit), WORLD_3 → 14 (+permissions-modes/plugins/headless/model-routing/caching); computer-use+artifacts bewusst Lexikon-only.
- NEU site/scripts/merge-entries.mjs (validierendes Merge-Tool, ersetzt ad-hoc-Merges = Quelle der früheren cwd-Vorfälle); Merge 5 Sprachen in einem Zug, lint-content-Gate grün, BUILD_EXIT=0, Live-Verify auf Titel-Strings (Lektion erneut: leere grep-Pattern = false positive — Variablen im Verify IMMER erst echoen).
- Poll: 0 Notes/Feedback, views_7d 127, Todo-Felder heißen title/detail.
- Known-good Deploy: 2484ef6f.promptgarden.pages.dev

### It. 75 (13.07.26 ~20:30) — 🎨 Visualisierung Batch 3 LIVE + Cursor-CLI-Research gestartet + NEUE DIREKTIVE Remotion ✅
- ContextWindowDiagram (Inline-SVG, 1d-Stil, Inline-Dict ×5): segmentierte Fenster-Bar (System-Prompt/Regeln/Verlauf/Tool-Ergebnisse/frei) + 90%-Warn-Marker — auf Lexikon token+context-window über dem TokenPlayground. Live verifiziert DE+FR.
- Cursor-CLI-Research-Agent läuft (offizielle Doku, alle Befehle+Flags, curl-verifizierte URLs → research/befehle/cursor-cli-2026-07.json).
- 🔴 MARVIN-DIREKTIVE 12 (mid-turn): REMOTION — Beispiel-/How-to-Videos mit Remotion rendern, an passenden Stellen einbetten, wiederkehrend reviewen/ausbauen. In LOOP.md verankert + Rotation (Pilot: Loop-Zyklus-Animation + Context-Window-Füllung; Constraint Pages 25MB/Datei → kurze Clips <10MB).
- ⚠️ cwd-Vorfall #3: grep+wrangler-Deploy liefen aus ~ (Shell-cwd resettet zwischen Calls) → Deploy passierte GAR NICHT, Verify schlug laut fehl (Guard wirkte). Regel verschärft: JEDER Repo-Befehl mit explizitem cd im selben Call.
- Poll: 0 Notes/Feedback/Forum, views_7d 133 (↑), Top-Paths: /en/ 26, /de/lernpfade/ 16, /de/ 13, /de/addons/ 13, /de/lexikon/ 12.
- Known-good Deploy: ba6b650a.promptgarden.pages.dev

### It. 76 (13.07.26 nachts) — 🖱️ CURSOR CLI = 3. Plattform der Befehls-Referenz LIVE ✅
- **188 Befehle × 5 Sprachen** (92 Claude Code + 16 Codex + 80 Cursor CLI): 47 Slash-Befehle (12 Changelog-only, gekennzeichnet) + 32 Subcommands + global-options-Sammeleintrag. 1332 Seiten (+405). Binary heißt `agent` (nicht mehr cursor-agent) — Research 19 URLs verifiziert, 8 Doku-Lücken dokumentiert (research/befehle/cursor-cli-2026-07.json).
- 🛡️ Adversarial-Review-Pipeline 2. Erfolg: fand 1 BLOCK (8 Slug-Kollisionen slash↔sub — hätte Routing gebrochen, getKommando .find() = zweiter Treffer unerreichbar) + 6 FIX (Quellen-Lücken fork/rewind/model/bedrock/login, rewind-Alias-Bedingung, mcp-Menü-Präzisierung). Alle vor Übersetzung gefixt; Sub-Slugs jetzt agent-update/-resume/-about/-help/-logout/-mcp/-sandbox/-bedrock.
- Übersetzer ES/FR/ZH je 80 Einträge, alle mit MD5-Drift-Check + Node-Skript-Generierung (kein Hand-JSON); platforms-Eintrag cursor-cli ×5.
- Known-good Deploy: 53790d7d.promptgarden.pages.dev · Live-Verify auf Summary-Strings DE+ZH + Hub.

### It. 77 (14.07.26 ~00:30) — 🎬 REMOTION-PILOT LIVE (Direktive 12) ✅
- Remotion-Projekt videos/ (remotion@4, 2 Compositions 1280×720/30fps/15s, 1d-Design-Tokens, Labels als lang-Props): LoopZyklus (Denken→Handeln→Prüfen animiert, Rückschleife, Fertig-Finale) + ContextWindow (Segmente wachsen, 90%-Warn-Blinken, Kompaktierungs-Finale).
- 10 mp4 gerendert (2 Comps × 5 Sprachen, crf28, je ~0,75–0,87 MB, stumm) → site/public/videos/; videos/.gitignore (node_modules, out).
- components/ExampleVideo.tsx (kicker ×5, <video controls preload=metadata>, kein Autoplay) — eingebettet auf /loops (unter Zyklus-SVG) + Lexikon context-window (unter Diagramm).
- Live verifiziert: Video-URL 200 + Content-Type video/mp4, Embeds auf /de/loops/ + /zh/lexikon/context-window/.
- Remotion-Setup-Learnings: create-video nicht nötig — 6 Dateien reichen (package.json, tsconfig, index/Root/Comps); npm-allow-scripts-Warnung harmlos, Compositor lief; Render ~60s/Clip lokal.
- Known-good Deploy: 959c555e.promptgarden.pages.dev

### It. 78 (14.07.26 nachts) — 📰 Feed 14.07 + 🔬 ZWEI-DETAIL-LEVEL-DIREKTIVE KOMPLETT ✅
- Feed: 3 selbst-verifizierte News ×5 (muse-spark-1-1, friendly-fire-exploit, claude-code-2.1.207 — Changelog wörtlich gegengeprüft; Research-Agent verwarf 9 Kandidaten wegen Aggregator-Datumsfehlern/fehlender Primärquelle). 22 Items total. Commit 45d7f2a.
- bodyDetail-Batch 3: restliche 21 Kapitel ×5 Sprachen → **ALLE 51 Kapitel haben jetzt 🌱/🔬** (Marvin-Direktive 8 komplett). Adversarial-Review PASS (11/21 tiefgeprüft, alle Zahlen exakt quellengedeckt; 1 FIX hooks-Formulierung vor Übersetzung angewandt). NEU scripts/patch-bodydetail.mjs (patcht nur bodyDetail, wirft bei Drift).
- Live verifiziert: /de/lexikon/rag/ (»Zwei Suchverfahren kombiniert«) + /zh/lexikon/hooks/ (»三种触发时机«).
- Known-good Deploy: 1fce91e5.promptgarden.pages.dev

### It. 79 (14.07.26 früh) — 🎬 Terminal-Demo-Videos auf Befehlsseiten + Forum-Cleanup ✅
- Remotion-Ausbau (Direktive 12, Runde 2): wiederverwendbare TerminalDemo-Composition (getippter Befehl + gestreamte Ausgabe, 1d-Terminal-Karte) — 2 Demos ×5 Sprachen (goal-demo: /goal-Session bis »alle Tests grün«; sandbox-demo: agent sandbox run mit Sandbox-Defaults-Hinweis), Fakten aus commands.de.json. 10 neue mp4 (je ~0,65MB) → 20 Remotion-Clips total.
- Einbettung: COMMAND_VIDEOS-Mapping in Befehls-Detailseite (claude-code/goal, cursor-cli/sandbox-run) — Muster für weitere Befehls-Demos etabliert.
- Forum-Cleanup (Marvin-Wunsch): Test-Post »Loop-Test« gelöscht, öffentliche Liste leer verifiziert; geblockte Spam-Testposts 2+3 bleiben unsichtbar als Filter-Beleg.
- Live verifiziert: goal-demo.de.mp4 200+video/mp4, Embeds auf /de/…/goal/ + /zh/…/sandbox-run/.
- Known-good Deploy: d59ad5e2.promptgarden.pages.dev

### It. 80 (14.07.26 vormittags) — 📚 KAPITEL-BATCH 3 LIVE: 61 Kapitel ×5 ✅
- 10 neue Kapitel ×5 (eigene-befehle-schreiben, agent-teams, ci-cd-mit-agenten, prompt-strukturen, code-review-mit-ki, debugging-mit-agenten, testing-mit-agenten, dokumentation-mit-ki, batch-processing, api-keys-sicher-verwalten) — alle mit bodyDetail, Quiz, 27 verifizierte URLs; 6 mit Übung. 1382 Seiten.
- Adversarial-Review PASS (0 BLOCK, 5 FIX vor Übersetzung angewandt: Hosted-Review-Gating ×2, agent-teams-EN-Paritäts-Satz, Quellentitel »Natural…«, 25→20 Tools gelabelt). Review bestätigte wörtliche Belege für 15×-Tokens, 30%-Claim, $0-Index, »Report gaps«-Zitat, sys.exit(0).
- WORLD-Ausbau: W1=9 (+prompt-strukturen), W2=13 (+agent-teams, debugging-mit-agenten), W3=16 (+eigene-befehle-schreiben, testing-mit-agenten).
- Lektionen: (1) API-Abbruch bei Hintergrund-Agents → SendMessage an Agent-ID resumed mit vollem Kontext, kein Neustart nötig; (2) node -e-String-Patches auf JSON mit \n-Literalen scheitern am Escaping → immer über geparste Objekte patchen; (3) generisches Satzende (»postet.«) als Replace-Anker riskant → nach Patch Kontext gegenprüfen.
- Known-good Deploy: 471f3975.promptgarden.pages.dev

### It. 81 (14.07.26 vormittags) — 🔍 Link-Audit #3 + URL-Migration + LOOP.md-Pruning ✅
- 212 sources-URLs frisch aus allen Content-Typen ×5 Sprachen generiert (dedupet), parallel geprüft: **211/212 = HTTP 200**.
- 1 tote Quelle (digiterialabs.com, Domain komplett offline) aus benchmarks-lesen ×5 entfernt — kein Claim hing daran (3 gesunde Quellen bleiben).
- Bekannter 308-Redirect migriert: anthropic.com/engineering/claude-code-best-practices → code.claude.com/docs/en/best-practices (15 Vorkommen ×5 Sprachen, keine Reste).
- LOOP.md gepruned: Stand-Absatz auf It. 81 (61 Kapitel/1382 Seiten/20 Clips), Rotation gestrafft (nur Offenes; NEU: Aider als 4. Plattform aufgenommen).
- Live verifiziert: migrierte URL im HTML, tote Quelle weg. Known-good Deploy: 78321166.promptgarden.pages.dev

### It. 82 (14.07.26 nachmittags) — 🐍 AIDER = 4. Plattform: BEFEHLS-REFERENZ-DIREKTIVE KOMPLETT ✅
- **236 Befehle × 5 Sprachen auf 4 Plattformen** (92 Claude Code + 16 Codex + 80 Cursor + 48 Aider): 43 Slash + 4 Modi (mode-code/-ask/-architect/-help) + global-options. 1627 Seiten (+245). Aider lebt aktiv (47k Stars; GitHub-Release-Notes-Lücke seit v0.86.0 in gaps dokumentiert).
- 🛡️ Adversarial-Review 4. Erfolg — diesmal bis auf QUELLCODE-Ebene: 1 BLOCK (chat-mode behauptete, /help ohne Prompt wechsle sticky den Modus — commands.py beweist: cmd_help ruft nur basic_help(), kein Mode-Switch) + 1 FIX (global-options EN-Name unübersetzt). Beide vor Übersetzung gefixt.
- 2. transienter API-Abbruch (ZH-Übersetzer) per SendMessage-Resume ohne Fortschrittsverlust überbrückt — Muster ist jetzt Routine.
- Live verifiziert Hub + /de/befehle/aider/add/ + /zh/befehle/aider/mode-architect/. Known-good Deploy: 89fb21a5.promptgarden.pages.dev

### It. 83 (14.07.26 nachmittags) — 🎬 Remotion R3: /loop- + Aider-/add-Demos ✅
- 2 neue Terminal-Demos ×5 Sprachen (claude-loop-demo: /loop 5m Deploy-Check-Session mit Selbst-Pacing-Hinweis; aider-add-demo: /add payment.py → Edit → /drop) — Fakten aus verifizierten commands-Einträgen. 30 Remotion-Clips total, 4 Befehle mit Video (goal, loop, sandbox-run, add).
- COMMAND_VIDEOS-Mapping erweitert; je ~0,7MB, live verifiziert (Content-Type video/mp4 + Embeds DE/ZH).
- Known-good Deploy: 3815bbd6.promptgarden.pages.dev

### It. 84 (14.07.26 nachmittags) — 📱 Mobile-Polish-Pass 2 ✅
- 375px-Audit per Playwright (5 Seiten: Befehls-Hub 4 Plattformen, Aider-Liste, goal-Seite mit Video, context-window mit SVG+Video+Playground, Landing): Hub/Landing/Video-Karten/Befehlsseiten ALLE sauber — kein Overflow, Touch-Targets ok.
- 1 Fund gefixt: horizontal scrollbare SVG-Diagramme (Context-Window, Loop×2, Addons×2) hatten auf Mobile keinen sichtbaren Scroll-Hinweis → neue .swipe-hint-Klasse (nur <600px sichtbar, dezenter →) auf allen 5 Diagramm-Containern. Live verifiziert.
- Playwright-Zugriff: Paket nirgends installiert, npx-CLI (playwright screenshot) mit gecachten Browsern funktioniert — Merker für künftige Passes.
- Kapitel-Batch-4-Ideenliste finalisiert (in Rotation): monorepo-mit-agenten, refactoring-mit-ki, legacy-code-modernisieren, memory-systeme-fuer-agenten, kosten-optimierung-praxis, sicherheits-audits-mit-ki, datenbanken-mit-agenten, code-verstehen-mit-ki, frontend-mit-ki, pair-programming-muster.
- Known-good Deploy: 06e73464.promptgarden.pages.dev

### It. 85 (14.07.26 abends) — 🧭 SEO-Phase 3: BreadcrumbList-Schema auf allen Detail-Seiten ✅
- lib/schema.ts (breadcrumbLd-Helper) + JSON-LD auf 3 Templates: Befehls-Detail (Home→Befehle→Plattform→Befehl), Lexikon-Detail (Home→Lexikon→Kapitel, zusätzlich zum bestehenden Article-Schema), Addon-Detail (Home→Addons→Addon) — deckt ~1470 Detail-Seiten ×5 Sprachen ab, Labels aus ui.nav (lokalisiert).
- Live verifiziert auf /de/lexikon/mcp/, /zh/befehle/aider/add/, /fr/addons/graphify/.
- Known-good Deploy: 2f772433.promptgarden.pages.dev

### It. 86 (14.07.26 abends) — 🧭 Wizard-Vertiefung: 4. Frage + konkrete Nächste-Schritte ✅
- Start-Wizard (Original-Spec »verschiedene Einstiegswege«): neue 4. Frage »Womit arbeitest du (hauptsächlich)?« (Claude Code/Cursor/Aider/Codex/noch gar nicht, unbewertet) — Ergebnis-Karte zeigt jetzt nummerierte nächste Schritte: ① Lernpfad (level-basiert) ② Befehls-Referenz des eigenen Tools bzw. Kapitel »Claude Code installieren« bei Neulingen. localStorage pg_wizard um tool erweitert. ×5 Sprachen (neue Dict-Keys wizardToolQ/wizardNext*), Intro 3→4 Fragen.
- Lektionen: FR-Apostroph (l'instant) brach i18n-Build → bei automatisierten String-Inserts Apostroph-haltige Strings mit JSON.stringify quoten; Client-Komponenten-Strings im JS-Bundle prüfen, nicht im SSG-HTML (Wizard client-only — Frage-Texte via Bundle-grep + Live-Screenshot verifiziert).
- 375px-Screenshot ✅ (1/4-Fortschritt sichtbar). Known-good Deploy: 2031d54c.promptgarden.pages.dev

### It. 87 (14.07.26 abends) — 🎬 Remotion R4: /compact- + Cursor-/plan-Demos ✅
- 2 neue Terminal-Demos ×5 (compact-demo: Kontext-freiräumen-Session mit Fokus-Anweisung; cursor-plan-demo: Plan-Modus mit Build-Locally/Cloud-Menü) — Fakten aus verifizierten commands-Einträgen. **40 Remotion-Clips, 6 Befehle mit Video auf 3 Plattformen** (goal, loop, compact, sandbox-run, plan, add).
- Live verifiziert (Content-Type + Embeds DE/ZH). Known-good Deploy: 59ec3c97.promptgarden.pages.dev

### It. 88 (14.07.26 ~21:45) — 📋 Statusboard-Refresh It. 86-88 ✅
- Statusboard: ITERATION 88, Chip 🎬 40 Videos, neue Karte (Wizard-Vertiefung + R4-Demos); LOOP.md-Stand aktualisiert.
- Nacht-Rhythmus: ab jetzt ruhigere Wakeups bis Feed 15.07 früh (~07:00) + Kapitel-Batch 4 (vormittags).

## It. 89 — 14.07. ~23:15 — Admin-Analytics: Unique-Besucher + Internal-Filter (Marvin-Direktive im Chat)
- Marvin: Admin-Tabelle → Hover mit Nutzerzahl, Unterseiten sichtbar, eigene Aufrufe rausfiltern.
- D1-Migration: page_views + visitor (Tages-Hash, Plausible-Prinzip: SHA-256(salt:day:ip:ua), Rohwerte nie gespeichert) + internal (0/1) + 2 Indizes.
- Worker /v1/track: visitor-Hash + isInternal (body.internal ODER UA-Regex bot|crawl|headless|playwright|curl|python|…). Alle Summary-Queries mit internal=0 gefiltert; neu: visitors_7d, views_internal_7d, top_paths mit u=COUNT(DISTINCT visitor), LIMIT 15→30, views_by_day mit u.
- Track.tsx: sendet internal:true wenn localStorage pg_admin_key ODER pg_internal; ?ich=1 setzt pg_internal (für Marvins Geräte ohne Admin-Key).
- Admin-UI: Chip 👤 Besucher (7d), Bar-Hover "Views · Besucher", Top-Seiten-Tabelle mit 👤-Spalte + Row-Tooltip + Scroll (30 Zeilen) + Fußnote "X interne Views aussortiert".
- Impressum: Datenschutz-Absatz ehrlich erweitert (täglich wechselnder, nicht rückrechenbarer Kurz-Hash; Betreiber-Aufrufe gefiltert).
- Getestet: 2 Track-POSTs → DB-Rows korrekt (internal 1/0, Hash gesetzt) → Test-Rows gelöscht. BUILD_EXIT=0, Deploy 0d6c2786, Live-Verify: Impressum-String ✓, Admin-Bundle "Besucher (7d)" ✓, layout-Bundle pg_internal ✓.
- Grenze: Alt-Daten (vor 14.07.) haben keinen visitor-Hash → u zählt erst ab jetzt; alte eigene Views nicht rückwirkend identifizierbar (war by design identifier-frei).
- Lesson: Marvins Browser wird über pg_admin_key-localStorage automatisch gefiltert — auf anderen Geräten einmal /?ich=1 öffnen.

## It. 91 — 15.07. ~01:35 — Flaggschiff-Explainer-Video (Marvin: „dicke geile Motion-Grafik")
- PromptgartenExplainer.tsx: 42s/1260 Frames, 5 Szenen — S1 Logo-Intro (Letter-Stagger+Underline-Draw), S2 Tool-Chaos→Raster (10 Chips wild→geordnet, Headline-Swap), S3 Counter (60+ Kapitel · 230+ Befehle · 4 Plattformen · 5 Sprachen, zukunftssichere Rundungen statt exakter Zahlen) + Feature-Chips, S4 3-Schritte (Wizard→Lernpfad→XP/Streak mit Count-up + Flammen-Puls), S5 Ink-Panel-Outro mit pulsierendem CTA promptgarten.com.
- Deterministische BG-Shapes via remotion random(seed); Szenen als Sequences mit 15-Frame-Fadeout.
- ×5 Sprachen gerendert (je ~2,6MB, CRF 28) + 5 Poster (Frame 140); Stills aller 5 Szenen visuell geprüft, ZH-CJK sauber.
- HeroVideo.tsx (preload=none + Poster → Landing bleibt schnell) prominent nach Hero auf app/[lang]/page.tsx.
- BUILD_EXIT=0, Deploy 39f56e85, Live-Verify: alle 5 Landings enthalten Embed, mp4 Range-Request 206, Poster 200. /zh/ war kurz CDN-stale — bei Live-Verify direkt nach Deploy Deployment-URL als Referenz nutzen.
- Lesson: 1260-Frame-Renders ×4 + Stills als EIN Hintergrund-Task mit Notification — Stunden-Check lief parallel weiter.

## It. 94 — 14.07. ~15:20 — KAPITEL-BATCH 4: 61 → 71 Kapitel ×5 (355 neue Seiten)
- Marvin-Rüge 14:23 („kein Ruhemodus!") → Batch sofort vorgezogen statt Stunden-Checks. Lesson in LOOP.md: Uhrzeit IMMER per date, nie aus Session-Verlauf.
- 10 Themen: monorepo-mit-agenten, refactoring-mit-ki, legacy-code-modernisieren, memory-systeme-fuer-agenten, kosten-optimierung-praxis (W: refactoring→W3) + sicherheits-audits-mit-ki, datenbanken-mit-agenten, code-verstehen-mit-ki (→W3), frontend-mit-ki, pair-programming-muster; memory-systeme→W2. W2=14, W3=18.
- Pipeline: 2 Sonnet-Autoren (DE+EN inkl. bodyDetail, Quellen selbst curl-verifiziert, Autor A hat 404-Quelle selbst aussortiert) → Adversarial-Review (6. echter Fang in Folge!): FAIL mit 4 BLOCK (Industrial-Logic Soft-404 [HTTP 200 → /404.html — Lehre: 200 ≠ Inhalt da, Reviewer lädt Inhalt], Feathers-Definition ungedeckt, Strangler-Fig-Router nicht bei Fowler, „Begriff stammt aus Fowlers Buch" sachlich falsch) + 3 FIX (costs-Quelle für Datei-Test-Claim, code-review-Doku statt generischer security-Seite, archivierter Postgres-MCP-Server im Präsens) + 2 NOTE (Stand-Marker Caching/Batch, docs.claude.com→platform.claude.com) → alle über apply-review-fixes.mjs auf geparsten Objekten mit harten Ankern gefixt → MD5-Fingerprints → 3 Sonnet-Übersetzer ES/FR/ZH parallel (alle MD5-geprüft, 0 Drift) → merge-entries.mjs +10 ×5 → lint 0 Fehler → BUILD_EXIT=0 → Deploy 25433313 → Live-Verify DE-Titel „Wie sich KI-Agenten Dinge merken" + ZH „AI 结对编程模式" + Refactoring-Fix-String (Strings geechot, Deployment-URL; prod brauchte Cache-Buster).
- Statusboard vorab auf It. 93 republished (Karte It. 89–91 Explainer+Besucher-Filter).
- Known-good: 25433313.

## It. 95 — 14.07. ~15:20 — Remotion R5: Codex bekommt Befehls-Demos (45 → 55 Clips)
- Codex war einzige Plattform ohne Demo-Video. 2 neue TerminalDemo-Scripts (Fakten aus commands.de.json): codex-exec-demo (non-interaktiv/CI, --json, stdin) + codex-review-demo (/review, codex review --base main). ×5 Sprachen, je ~0,7MB.
- COMMAND_VIDEOS + codex-cli/exec + codex-cli/review; jetzt 8 Befehle auf ALLEN 4 Plattformen mit Video.
- Still-Spot-Check ok, BUILD_EXIT=0, Deploy bd8de4e0, Live-Verify exec-Seite+mp4 200+ZH-review-Embed auf Deployment-URL.

## It. 96 — 14.07. ~17:40 — ANTIGRAVITY CLI = 5. PLATTFORM (236 → 293 Befehle ×5, +285 Seiten)
- Auslöser: Gemini-CLI-Research zeigte Google-Abschaltung des Free-Zugangs zum 18.06.26 → Antigravity CLI (Nachfolger, Binary agy) statt Gemini als Plattform 5; Transition selbst am Google-Blog verifiziert → Feed-Item 15.07.
- Pipeline: Research-Agent (56 Befehle, 27 Quellen; antigravity.google = JS-SPA → Inhalte via r.jina.ai lesen, Original-URL zitieren, Status separat curlen) → 2 Autoren (26 CLI-Flags/Subcommands + 31 Slash-Commands, DE+EN) → Adversarial-Review (8. Fang in Folge): 1 BLOCK (erfundenes Modell-Format gemini-3.1-pro statt --model="Gemini 3.1 Pro") + 9 FIX (d=deny nicht approve, Zeile statt Hunk, Verbindungs- statt Auth-Status, unbelegte Checkpoint-/Keybindings-/Import-Claims) + 5 NOTEs übernommen → apply-antigravity-review-fixes.mjs → MD5 → 3 Übersetzer ES/FR/ZH (je 57, MD5-geprüft, at-path-Platzhalter lokalisiert — einzige erlaubte name-Abweichung) → merge-commands.mjs +57 ×5 → add-antigravity-platform-meta.mjs (platforms=5 ×5) → lint 0 Fehler → BUILD_EXIT=0 → Deploy a8617cc6 → Live-Verify (Index, Plattform-Liste, /planning Multi-Turn, ZH-credits-Summary geechot).
- Direktive 3 jetzt: BEFEHLS-REFERENZ 5 Plattformen (Claude Code 92, Cursor 80, Antigravity 57, Aider 48, Codex 16).
- Known-good: a8617cc6.

## It. 97 — 14.07. ~18:05 — Remotion R6: Antigravity-Demo (55 → 60 Clips)
- agy-print-demo ×5 (agy -p für Skripte/Hooks, -c -p Fortsetzung — Fakten aus commands.de.json print). COMMAND_VIDEOS + antigravity-cli/print. Alle 5 Plattformen haben jetzt Video-Demos (9 Befehle). BUILD_EXIT=0, Deploy cf61c5a5, Live-Verify Embed+mp4 206.

## It. 98 — 14.07. ~19:50 — VERGLEICHE V2 LIVE + Favicon + Direktive 13 (Ideen-Pitches)
- Marvin-Direktiven umgesetzt: „Vergleichsseite super geil und simpel, glasklar wann man was benutzt" + „Haiku vs Sonnet mit Beispielen, wann Fable, wann lohnt es sich NICHT, ggf. Benchmarks".
- Neu auf /vergleiche ×5: ① Szenario-Picker (7 Szenarien → Tool+Modell+Warum+Beispiel+Link, Client) ② Preis-vs-Positionierungs-Quadrant (SVG, 10 Modelle, nur Anbieter-Aussagen+Listenpreise) ③ 13 Modell-Karten (Anthropic/OpenAI/Google/xAI) mit stark/schwach/wofuer ④ 4 DUELLE (haiku-vs-sonnet mit SWE-bench 73,3%, sonnet-vs-spitze mit Preis-Multiplikatoren 1,7-5x, flash-vs-pro, abo-vs-api) je mit „💸 Wann es sich NICHT lohnt" ⑤ Im-Tool-Empfehlungen (5 Tools, Default+Wechsel+3 Aufgaben-Empfehlungen) ⑥ Tool-Karten +Antigravity (jetzt 5).
- Pipeline: Research (19 Modelle, 58 Quellen) → Autor → Haupt-Review FAIL→fix (BLOCK: „keine xAI-Positionierung" widerlegt durch die selbst zitierte Quelle docs.x.ai! + 6 FIX) → Duelle-Autor → Mini-Review PASS mit 1 FIX (Flash/Pro haben BEIDE 1M-Kontext — langer Kontext ist kein Pro-Argument) → 3 Übersetzer (MD5 bfda7468, alle deckungsgleich) → Komplett-Ersatz der 5 Dateien (v1-Backup in research/vergleiche-v1-backup/).
- Favicon (Marvin-Meldung): app/icon.svg (🌱 1d-Rahmen) + app/apple-icon.png (512px via Playwright-Render) — beide 200, link-Tag im Head.
- Bing: Sitemap von Marvin eingereicht (Property-Host war das Problem) → Todo #6 done. Sponsors: Marvin angemeldet, Rest-Schritte als neues Admin-Todo detailliert.
- BUILD_EXIT=0, Deploy 70f90f0f, Live-Verify: Duell-Titel DE, Picker-Kicker, ZH-Duell-String (geechot), icon.svg+apple-icon 200, 375px-Screenshot ok.
- Direktive 13 NEU: wiederkehrende Ideen-Pitches; Runde 1: Marvin wählt alle 4 (Suche→Preisrechner→Prompt-Bibliothek→Landkarte), loops/IDEEN.md angelegt.
- Known-good: 70f90f0f.

## It. 99a — 14.07. ~20:40 — AdSense DSGVO-sauber eingebaut (Marvin lieferte pub-ID im Chat)
- ads.txt (google.com, pub-6850490267678365, DIRECT) + Verifikations-Meta-Tag google-adsense-account (requestlos) + AdsConsent.tsx: adsbygoogle.js lädt AUSSCHLIESSLICH nach Klick „Anzeigen erlauben" (localStorage pg_ads_consent, Banner ×5 Sprachen, 1d-Stil); ohne Consent bleibt Seite cookielos. Impressum-Datenschutz um Werbe-Absatz erweitert (Widerruf dokumentiert).
- Verify: ads.txt live, Meta-Tag 1, adsbygoogle im Initial-HTML 0 (= korrekt gated), Banner im Bundle, Impressum-String live. Deploy 69b4a5fc. Todo #5 done → Folge-Todo „Site-Review abwarten + Auto Ads" mit exakten Schritten.
- git status VOR add geprüft (Lesson It. 98) — nur eigene 5 Dateien.

## It. 99 — 14.07. ~21:15 — 🔍 VOLLTEXT-SUCHE LIVE (Marvin-Ideen-Wahl #1)
- Erste Suche der Seite (1962 Seiten waren unauffindbar): build-search-index.mjs im prebuild erzeugt public/search/index.<lang>.json (376 Docs/Sprache: 71 Kapitel + 293 Befehle + 12 Addons, 112-168 KB, gitignored da generiert).
- SearchModal.tsx: 🔍-Button im Header + Cmd/Ctrl+K, lazy (MiniSearch+Index laden erst beim Öffnen), fuzzy+prefix, Boost title>summary, 12 Treffer gruppiert Kapitel/Befehle/Addons, ↑↓+Enter-Navigation, Labels ×5 im Komponenten-Dict.
- Verify: BUILD_EXIT=0, Deploy df59ad91, index.de.json 200, ZH-Index-Inhalt geprüft, Modal-String im Bundle, Header-Screenshot (🔍 sichtbar, AdsConsent-Banner rendert korrekt daneben).
- Addon-Schema-Falle: items nutzen what/why statt summary/body — beim ersten Index-Lauf leer, gefixt vor Deploy.
- Known-good: df59ad91.

## It. 100 — 14.07. ~18:45 — 💶 Modell-Preisrechner live (Marvin-Ideen-Wahl #2)
- PriceCalculator.tsx auf /vergleiche (nach Duellen): 3 Slider (Input 1-200k, Output 0,5-32k, Anfragen/Tag 1-500) → sortierte Monatskosten-Balken für die 10 Quadrant-Modelle; Batch-50%-Toggle nur für Claude-Zeilen (belegt); Fußnoten Sonnet-Intro-Preis + Gemini-Pro-Staffel; Labels ×5 im Komponenten-Dict; Disclaimer mit 4 Anbieter-Preisquellen. Preise aus verifizierter Research-Tabelle (Stand: Juli 2026).
- Mathe-Stichprobe: Haiku 20k/2k/50/Tag → $45/Monat ✓. BUILD_EXIT=0, Deploy 69ea2729, Bundle-Verify PREISRECHNER, 375px-Screenshot ok.
- Known-good: 69ea2729.

## It. 101 — 14.07. ~19:40 — 🧩 PROMPT-BIBLIOTHEK LIVE (Wahl #3) + Werbung umgestellt (Marvin-Direktive)
- /prompts ×5: 16 tool-neutrale, kopierbare Vorlagen in 6 Kategorien (Refactoring/Debugging/Review/Planung/Testing/Verstehen), je „Wann nutzen"+Vorlage in dunkler pre-Box+CopyButton+Hinweis+Quellen. Review PASS mit 4 FIX (u.a. '->' in Platzhaltern bricht Parser, fehlendes Stopp-Kriterium in Repro-Vorlage, BEA-Quellen-Falschzuordnung) + 5 NOTEs übernommen; 3 Übersetzer MD5-gepinnt, Platzhalter lokalisiert.
- Integration: Nav „Prompts" ×5 (i18n nav.prompts; FR-Apostroph-Regex-Falle → node-Fix), Sitemap, Such-Index +16 Docs (Gruppe „Prompt-Vorlagen" ×5, 392 Docs gesamt), Breadcrumb-Schema.
- WERBUNG UMGESTELLT (Marvin: „wieso optional? Werbung an, nur nicht Landingpage"): eigenes Consent-Banner RAUS, adsbygoogle lädt jetzt überall AUSSER /{lang}/ (Landing); Einwilligung übernimmt Googles CMP — Marvin-Todo: AdSense → Datenschutz & Mitteilungen → DSGVO-Nachricht + Limited Ads aktivieren (sonst EU leer). Impressum-Text angepasst.
- Verify: BUILD_EXIT=0, Deploy bd5e1841, 16 Copy-Buttons DE, ZH-Titel 提示词库, Nav-Link, search p-Docs, altes Banner 0 Treffer, 375px-Screenshot ok.
- Known-good: bd5e1841.

## It. 102 — 14.07. ~20:40 — 🗺️ LERN-LANDKARTE LIVE → Ideen-Runde 1 KOMPLETT (4/4)
- LearnMap.tsx auf /lernpfade (oben): SVG-Karte, 4 Welt-Inseln (1d-Farben, abwechselnd), Kapitel als Knoten auf Sinus-Pfad (Kategorie-Emoji), erledigte (localStorage completed[]) → lime+✓, live via PROGRESS_EVENT, Fortschritts-Chip je Welt (n/total · %), Klick→Kapitel, Tooltip, overflow-x für breite Welten.
- Verify: BUILD_EXIT=0, Deploy 8c625917, Desktop-Screenshot (alle 4 Inseln, Scroll greift bei W2/W3). Views 331.
- Marvin-Ideen-Wahl Runde 1 vollständig ausgeliefert am selben Tag: 🔍 Suche, 💶 Preisrechner, 🧩 Prompt-Bibliothek, 🗺️ Landkarte.
- Known-good: 8c625917.

## It. 103 — 14.07. ~21:35 — KAPITEL-BATCH 5: 71 → 81 Kapitel ×5 (~2012 Seiten), erstmals DATENGETRIEBENE Themenwahl
- Themen aus top_paths_7d abgeleitet (Klick-Signale: Einsteiger-Seiten, claude-code, RAG, Addons): eigene-agenten-bauen-sdk, mcp-server-selbst-schreiben, was-ist-antigravity (aus Plattform-5-Research), agenten-observability, open-source-modelle-lokal, prompt-injection-abwehr-praxis, ki-tools-im-team-einfuehren, rag-selbst-bauen, web-scraping-mit-agenten, performance-optimierung-mit-ki.
- Autoren-Highlights: B fing selbst difficulty-Typgrenze (1-3, dots crasht bei 4 — A hatte 4 benutzt → von mir vor Review gefixt); A sortierte selbst tote Quelle aus.
- Adversarial-Review (10. Fang-Serie): 1 BLOCK (Session-JSONL-Claims ungedeckt — Format ist laut Doku intern, „Token-Zahlen pro Call" nirgends belegt) + 13 FIX (u.a. gemma3→gemma4-Drift, fehlende OTEL_METRICS_EXPORTER-Variable, 2 komplett fehlende EN-Abschnitte, 307-Redirect-URLs) + WICHTIG: Quiz-correct-Bias — BEIDE Batches hatten correct=1 bei allen 10; Review lieferte Permutationen → angewandt (Verteilung jetzt 0:2/2:4/3:4). Bestands-Befund notiert: 45/71 alte Kapitel haben correct=1 → Cleanup-Kandidat.
- Fix-Agent wandte alle 15+10 Punkte an (PASS, MD5-gepinnt); Bestands-URL agent-sdk/permissions ×5 gefixt. 3 Übersetzer (alle MD5-verifiziert, 0 Drift). WORLD: rag-selbst-bauen→W3 (=19); was-ist-antigravity bewusst NICHT in W1 (Welt = LLM-Grundlagen, kein Tool-Intro).
- lint 0 Fehler, Suchindex 402 Docs, BUILD_EXIT=0, Deploy 89e023c1, Live-Verify DE-Antigravity + ZH-RAG-Titel geechot + W3-Link.
- Known-good: 89e023c1.

## It. 104 — 14.07. ~21:45 — Quiz-Bias-Cleanup im Bestand (45→17 auf Index 1)
- Befund aus Batch-5-Review: 45/71 Alt-Kapitel hatten quiz.correct=1. 28 deterministisch verschoben (13→Index 2, 15→Index 3, per Swap 1↔Ziel, IDENTISCH über alle 5 Sprachen; explain-Felder vorher auf Positions-Referenzen gescannt: 0 Treffer). Verteilung jetzt 0:23/1:17/2:21/3:20.
- Validierung: correct-Options-Text pro Sprache unverändert (Text-Drift-Check), BUILD_EXIT=0, Deploy e581e802, Live-Stichprobe mcp-Quiz. Known-good: e581e802.

## It. 105 — 14.07. ~22:30 — Remotion R7: Suche-Demo (60 → 65 Clips)
- SearchDemo-Composition (UI-Demo, kein Terminal): Modal tippt „mcp", Gruppen Kapitel/Befehle/Addons erscheinen gestaffelt (echte Treffer als Inhalt), Auswahl wandert, Enter → Kapitel-Karte MCP. ×5 Sprachen, ~11s, je <1MB. Eingebettet auf /start unter dem Wizard (Neulinge lernen 🔍/Strg+K).
- ⚠️ cwd-Zwischenfall: ein Deploy lief versehentlich erneut aus site/ mit STALE out/ (Pfad-Verwechslung nach Background-Task — Deploy 0916b0a1 war altes valides Build, kein Schaden, prod durchgehend grün); Lesson: nach run_in_background-Rückkehr pwd nicht annehmen — erster Befehl prüft pwd.
- BUILD_EXIT=0, Deploy c9b84390, Live-Verify Embed + ZH-mp4 200. Known-good: c9b84390.

## It. 113 — 15.07.2026 ~07:20 — FEED 15.07 ✅
- Research-Agent (Sonnet): 3 verifizierte Items, alle Quellen 200+Inhalt doppelt geprüft, Kandidaten außerhalb 7-Tage-Fenster verworfen. WICHTIG: geplantes Pflicht-Item Gemini→Antigravity war DUBLETTE (id gemini-cli-shutdown existierte) → korrekt weggelassen.
- Items: openai-codex-8-million-nutzer (tools), github-copilot-security-review-app (tools), grok-build-cli-repo-upload-leak (security) — alle 14.07.
- Übersetzung MD5-gepinnt (ed46d92c…), id/date/tag/sources byte-identisch validiert. Merge vorn 22→25 ×5 Sprachen mit Dubletten+Zukunfts-Check.
- BUILD_EXIT=0, Deploy b639d964, Live-Verify DE+ZH-Titel 3/3, Smoke 6/6. Commit b04203e.
- Lesson: Wakeup-Plan-Mandate gegen Bestand prüfen bevor Agent-Prompt — Dublette im Plan gefunden. Validator zuerst am ECHTEN Bestandsschema ausrichten (sources[] nicht source{}).
- Known-good: Deploy b639d964, Commit b04203e.

## It. 114 — 15.07.2026 ~10:30 — IDEEN-RUNDE 2: RSS + Tages-Challenge + PWA ✅
- Pitch via AskUserQuestion (multiSelect): Marvin wählt RSS + Tages-Challenge + PWA; Newsletter-Digest → späteres Todo (NICHT abgelehnt). IDEEN.md gepflegt.
- 📡 RSS: scripts/build-rss.mjs im Prebuild → /feed.xml + /feed.<lang>.xml (RSS 2.0, atom:self, Anker-Links auf /feed/#id); langAlternates() liefert jetzt types application/rss+xml auf JEDER Seite; RSS-Badge auf Feed-Seite; generierte XMLs gitignored.
- 🎯 Challenge: scripts/build-challenge.mjs → public/challenge/quiz.<lang>.json (81 Fragen, Reihenfolge über Sprachen identisch — Guard im Skript); DailyChallenge.tsx: mulberry32(datum-hash) wählt 5, XP=5/richtig via completeEntry('challenge:date'), Serie in pg_challenge_v1 (vor Spielstart ab gestern gezählt); Nav 🎯 + Sitemap.
- 📱 PWA: manifest.webmanifest + icon-192/512 (sharp aus icon.svg), sw.js (navigate network-first, Assets SWR, Offline-HTML), SwRegister nur prod.
- Verify: BUILD_EXIT=0, Deploy c26410df, Live: RSS de+zh ok, Challenge de+zh ok, quiz.fr 81, manifest/sw/icons 200, rel=alternate+manifest-Link im HTML; Playwright: Antwortflow Richtig→Weiter→Frage 2 ✅, SW registered:active, OFFLINE-Reload lesbar ✅. Commit 937bcfb.
- Lessons: Playwright nicht im Repo — Install im Scratchpad nutzt ms-playwright-Browser-Cache; .btn-Locator traf Header-Newsletter → Locator immer auf Karte scopen.
- Known-good: Deploy c26410df, Commit 937bcfb.

## It. 115 — 15.07.2026 ~11:20 — Remotion R8: Challenge-Demo ✅
- Poll 11:03 grün: views 430 (+29), besucher 32 (+5), intern 58, notes/bugs/feedback leer. Smoke 6/6 (neu: /de/challenge/ + /feed.xml im Set).
- ChallengeDemo.tsx (300 Frames/10s, 1d-Stil): MCP-Frage, Hover wandert, Prüfen, ✅+5 XP schwebt, Serien-Badge 🔥. Render ×5 je ~0,6 MB.
- Einbettung /challenge unter DailyChallenge via ExampleVideo (VIDEO_LABEL ×5). BUILD_EXIT=0, Deploy e8c26361, Live-Verify de+zh src + mp4 200, Screenshot ok. Commit fd8334a.
- Lesson: cwd nach Build-Schritt war site/ — git add mit Repo-Pfaden schlug fehl; Regel bestätigt: Repo-Befehle IMMER mit cd im selben Call. ⚠️ Poll-URL: promptgarden-api.promptgarden.workers.dev (nicht marvin-mez).
- Known-good: Deploy e8c26361, Commit fd8334a. Videos jetzt 65.

## It. 116 — 15.07.2026 ~14:15 — KAPITEL-BATCH 6: 81→91 ✅
- Themenwahl datengetrieben (top_paths: Claude-Code-Vertiefung, RAG/Embeddings zh, Agenten-Praxis): terminal-basics, ai-coding-ide-vs-cli, rate-limits-und-quotas, temperatur-und-sampling, vektordatenbanken, chunking-strategien, human-in-the-loop, datenschutz-und-ki-tools, mcp-sicherheit, swe-bench-agenten-benchmarks.
- 2 Autoren (Sonnet) DE+EN, alle Quellen selbst verifiziert (1× 403-bot-protected via r.jina.ai). Adversarial-Review mit 5 Verifikations-Forks: 14 Findings (unbelegte Google-Cloud-Attribution, Apple-Quelle deckt Spotlight nicht, Git-lernen/installieren-Dreher EN, Cursor-Zitat ohne „building", Quiz 67%-Reranking additiv missverständlich, gdpr-info.eu als „offiziell" etikettiert, swe-bench-Dopplung mit benchmarks-lesen …) → 21 Fixes via apply-review-fixes.mjs (harte Anker). 3 Übersetzer MD5-gepinnt, Merge 81→91 ×5, WORLD W1 13/W2 16/W3 23.
- ZWISCHENFÄLLE + Lessons:
  (a) DE-Autor hielt parallelen EN-Autor für Rogue-Fork, benannte dessen Datei um → wiederhergestellt. Lesson: parallelen Agents die Existenz der Geschwister-Agents im Prompt MITTEILEN.
  (b) Reviewer-Forks konnten Parent nicht per SendMessage erreichen → Reviewer wartete endlos; Orchestrator musste Fork-Reports manuell relayen. Lesson: Reviewer-Prompts anweisen, NICHT auf Fork-Messages zu warten, Forks liefern an Orchestrator.
  (c) Lint verlangt DE=EN-Quellen-URL-Sets → Union beider verifizierter Sets auf alle 5 Sprachen.
  (d) exercise.selfCheck fehlte teils → Prerender-Crash (Seite mappt ohne Guard). Fix: selfCheck-Agent + NEUE LINT-REGEL (exercise braucht steps+selfCheck). Lesson: Autoren-Schema künftig MIT selfCheck ausschreiben.
  (e) 2× cwd-Fehler (site/ statt Root) — Regel „cd im SELBEN Call" erneut bestätigt.
- BUILD_EXIT=0 (Lint 0 Fehler), Deploy f67a015a, Live-Verify 3 Titel de+zh 3/3, Smoke 6/6, Screenshot ok. Commit 250b0ed. Challenge-Pool automatisch 91 Fragen, Suchindex 412 Docs.
- Known-good: Deploy f67a015a, Commit 250b0ed.

## It. 117 — 15.07.2026 ~14:05 — LOOP.md-Update ✅
- Poll grün (views 453, besucher 35, alles leer), Smoke 6/6.
- LOOP.md: Stand auf It. 117/91 Kapitel, Rotation neu (Feed 16.07 → Ideen R3 → Batch 7 ~17./18. → Link-Audit/Pruning ~21. → Remotion R9), 3 neue Arbeitsregeln (Geschwister-Agents mitteilen; Reviewer-Forks→Orchestrator; Autoren-Schema komplett inkl. selfCheck). Commit 18c7c4d.
- Bis Feed 16.07 früh: stündliche Grün-Checks.

## It. 120 — 15.07.2026 ~17:40 — Remotion R9 Landkarte-Demo ✅ + LOOP PAUSIERT
- Grün-Checks 15/16/17 Uhr ok (views 480, besucher 36). MapDemo.tsx (300 Frames, Welt-1-Insel, 13 Punkte füllen sich, Zähler, Badge, Serien-Chip) ×5 je ~0,6 MB; eingebettet auf /lernpfade unter LearnMap. BUILD_EXIT=0, Deploy 355e84eb, Live-Verify de+zh + mp4 200, Screenshot ok. Commit 366051b. Videos jetzt 70.
- ⏸️ LOOP AUF MARVINS WUNSCH PAUSIERT (15.07. ~17:45, „kurz pausieren, in zwei Tagen weitermachen"). Wiederaufnahme: neue Session in C:\Users\marvi\promptgarden, „mach weiter mit loop promptgarden" → LOOP.md + diese HISTORY lesen → Rotation fortsetzen: ① Feed (Datum des Wiederaufnahme-Tags, 25 Bestands-ids vorher listen!) ② Ideen-Pitch R3 (Backlog: Newsletter-Digest + 3 neue) ③ Kapitel-Batch 7 (mit den 3 neuen Regeln) ④ Link-Audit ⑤ LOOP.md-Pruning.
- Known-good: Deploy 355e84eb, Commit 366051b.

## It. 121 — 17.07.2026 ~11:00 — WIEDERAUFNAHME + Feed 17.07 ✅ + Ideen R3 entschieden
- Wiederaufnahme nach 2-Tage-Pause (Marvin: „mach die loop weiter"). Poll grün, Smoke 6/6. TRAFFIC-SPRUNG: views 541, besucher 79 (+43 in 2 Tagen); /en/befehle/claude-code/scroll-speed/ 18 unique = externer Traffic-Einstieg über Befehlsseite.
- Feed 17.07: 3 Items ×5 (Kimi K3 2.8T open, Claude Code 2.1.211 Permission-Preview-Fix, HF-Agenten-Einbruch), alle Quellen doppelt verifiziert; Fable-5-Frist geprüft — keine neue Meldung, Item bleibt. Merge 25→28, Deploy a8191ea8, Live-Verify de+zh+RSS. Commit 8abe858.
- IDEEN RUNDE 3: Marvin wählt ALLE 4 (Newsletter-Digest, Teilen-Buttons, Prompt-Sandbox, Modell-Timeline) + NEUE DIREKTIVE: Vergleiche intensiver — 2D-Quadrant nach Intelligence-to-Cost + Stärken, Modelle GLM/Grok/Gemini/Kimi/DeepSeek/Qwen/Mistral aufnehmen. Reihenfolge: v3 → Teilen → Timeline → Sandbox → Newsletter. Research-Agent für v3 läuft (offizielle Preise + Artificial-Analysis-Index, Quellenpflicht).
- Known-good: Deploy a8191ea8, Commit 8abe858.

## It. 122 — 17.07.2026 ~12:40 — VERGLEICHE-V3 ✅ (Marvin-Direktive)
- Research-Agent: 19 Modelle, 41 verifizierte Quellen (offizielle Pricing-Seiten + Artificial-Analysis-Index v4.1, AA via ld+json da Fetch/Jina scheiterten). Verworfen: alle Leaks (Gemini 3.5 Pro), nicht-existente Varianten (GPT-5.6-Codex, Grok-4.5-mini), Chart-only-Benchmarks.
- Gebaut: quadrant = echter Scatter (Blended-Preis (3·In+Out)/4 log-Skala × AA-Index; 17 Modelle; Cluster Frontier/Preis-Leistung/Budget; Open-Weights-Ring; DeepSeek „Ratio-König"-Badge), NEUE ratio-Sektion (17-Zeilen-Ranking Intelligenz/$ + 6 Fußnoten), modelle +6 Anbieter-Gruppen (Moonshot, DeepSeek, Zhipu, Meta, Alibaba, Mistral → 10 Anbieter/20 Karten). ModelQuadrant.tsx komplett neu, page.tsx +ratio-Tabelle. Übersetzungen ×4 MD5-gepinnt, Merge-Skript mit harter Zahlen-Paritäts-Validierung.
- Zahlen-Review (19 Live-Stichproben, alle Kern-Zahlen bestätigt): 3 Findings → 2 gefixt (Mistral Medium 3.5 Kontext 128K→256K in 5 Sprachen; globale Quellen-Liste +7 für neue Anbieter), 1 ABGELEHNT (Qwen/Gemini-Pro als 4. „Mittelfeld"-Zone: Scatter-Position differenziert sichtbar, 3 Zonen = simpel wie von Marvin gefordert).
- Label-Kollisionen im Scatter: 3 Iterationen (Terra/Opus/Luna/Sonnet-Anker) bis sauber — Screenshot-Gate hat sie gefangen.
- Fehler diesmal: 2× cwd (node aus site/, npm build aus Root exit 127) + 1× Deploy trotz Build-Fail durchgerutscht weil `echo BUILD_EXIT=$?` die &&-Kette neutralisiert (stale-identisches out/, kein Schaden). NEUE REGEL: nach `; echo BUILD_EXIT=$?` NIE mit && weiterverketten — Deploy immer als separater Call nach Exit-Prüfung.
- BUILD_EXIT=0, Deploy 94928428, Live-Verify de/en/zh (Kimi K3, GLM-4.7, DeepSeek, Ratio-Titel), Screenshots ok. Commit b9e4d56.
- Known-good: Deploy 94928428, Commit b9e4d56.

## It. 123 — 17.07.2026 ~13:30 — Preisrechner-v3 + Teilen-Buttons ✅
- Preisrechner: +6 Modelle (Kimi K3/K2.5, DeepSeek-V4-Pro, GLM-4.7, Muse Spark 1.1, Qwen3.7-Max = 16 gesamt), Batch-Rabatt jetzt je Modell-Flag (Anthropic+Gemini+Qwen dokumentiert) statt Anthropic-only, +5 Quellen-Links, neue Anbieter-Farben. Task #4 KOMPLETT.
- ShareButtons.tsx: Copy-Link/X/LinkedIn/WhatsApp/Als-Markdown (Agenten-Feature), Pill-Stil, Dict ×5; eingebettet auf Kapitel- (unter Quiz), Befehls- und Prompts-Seiten. Playwright-Klick-Test mit Clipboard-Permission: Link+Markdown korrekt im Clipboard. Task #5 KOMPLETT.
- BUILD_EXIT=0 ×2, Deploys 73d71cd9 + f692047f, Live-Verify de+zh. Commits c7da94a + 62f0…
- Known-good: Deploy f692047f.

## It. 124 — 17.07.2026 ~13:15 — Modell-Timeline ✅ (Task #6)
- /timeline ×5: 12 Einträge (Releases/Sunsets/Preisänderungen) aus verifiziertem v3-Research + Feed, typ-Farben, ⏳-Zukunfts-Marker, Quelle je Eintrag; verlinkt von /vergleiche, Sitemap.
- Übersetzer fand echten Bug: ASCII-Anführungszeichen in timeline.de.json Zeile 76 (Qwen-Zitat) → JSON invalide; gefixt („…“). Lesson: nach Hand-Autoring IMMER sofort node-parsen (Regel existierte — diesmal erst nach Agent-Hinweis geprüft).
- BUILD_EXIT=0, Deploy 3e744bf7, Live-Verify de+zh+Link, Screenshot ok.
- Known-good: Deploy 3e744bf7.

## It. 125 — 17.07.2026 ~14:00 — Prompt-Baukasten + Newsletter-Backend ✅ (Tasks #7+#8-Code)
- Prompt-Baukasten auf /prompts (Task #7 ✅): <PLATZHALTER>-Regex, Felder, Live-Vorschau, Copy — Playwright: füllen→einsetzen→Clipboard ✓. Deploy e10ffb20.
- Newsletter (Task #8, Code KOMPLETT): Recherche (research/newsletter-mail-weg.md): Resend empfohlen (3.000/Monat frei; MailChannels-Workers tot 404-verifiziert; CF-Send braucht Workers Paid). MARVIN entschied: Resend + news.promptgarten.com. Worker: Opt-in-Token, confirm/unsubscribe-Endpoints (HTML-Antworten), Cron Mo 08:00 UTC (Digest je Sprache aus /api/feed.<lang>.json, 90er-Batch, Opt-in-Backfill), D1 +token/+opt_in_sent (Migration remote ausgeführt). Flow live getestet: Signup→confirmed=1→Unsubscribe. Worker-Version c52b92eb.
- WARTET AUF MARVIN: Resend-Konto + Domain news.promptgarten.com anlegen, DNS-Werte + API-Key liefern → dann `wrangler secret put RESEND_API_KEY` + DNS via CF_PG_ZONE_TOKEN; Todo im Statusboard.
- R3-BILANZ: alle 5 gewählten Ideen + Vergleiche-Direktive an EINEM Tag geliefert (v3-Scatter, Ratio, 20 Karten, Preisrechner 16, Teilen, Timeline, Sandbox, Newsletter-Backend).
- Known-good: Pages e10ffb20, Worker c52b92eb.

## It. 126 — 17.07.2026 ~14:35 — Remotion R10 Vergleiche-Demo ✅
- CompareDemo.tsx (300 Frames): Mini-Scatter mit 7 echten Datenpunkten (Fable/Sol/K3/Grok/Sonnet/DeepSeek★/GLM), Zonen-Chips, Sweet-Spot-Ring; ×5 je ~0,55 MB; eingebettet auf /vergleiche unter dem Quadrant. BUILD_EXIT=0, Deploy 84252298, Live-Verify de+zh+mp4. Videos jetzt 75.
- Known-good: Pages 84252298, Worker c52b92eb.

## It. 127 — 17.07.2026 ~15:30 — NEWSLETTER AKTIVIERT ✅ (Task #8 KOMPLETT)
- Marvin lieferte Sending-Key + Full-Access-Key im Chat. Ablauf: Worker-Secret RESEND_API_KEY gesetzt → Domain news.promptgarten.com per Full-Key-API angelegt (eu-west-1) → 3 DNS-Records (DKIM/MX/SPF) via CF_PG_ZONE_TOKEN in Zone eingetragen → Verify → VERIFIED in <15 min → Test-Mail an Marvin ✅ (Resend-ID 407ea856) → Marvin als Erst-Abonnent angemeldet, Opt-in-Mail automatisch raus (opt_in_sent=1 in D1 bestätigt).
- Stolpersteine: Sending-Key ist restricted (kann keine Domains lesen) → Full-Key nachgefragt; autopilot.env hatte schon RESEND_API_KEY von ANDEREM Projekt (framefetch) → grep-Guard verhinderte Append still, env-Var blieb leer → promptgarten-Keys jetzt als PG_RESEND_KEY/PG_RESEND_FULL_KEY (Memory-Notiz aktualisiert). Lesson: vor Append in geteilte Secret-Dateien prüfen ob NAME schon (fremd-)belegt ist.
- Damit R3 zu 100 % LIVE inkl. Versand. Wochen-Digest feuert automatisch Mo 08:00 UTC.
- Known-good: Pages 84252298, Worker c52b92eb.

## It. 141 (18.07.2026 ~06:35–07:10) — FEED 18.07 LIVE ✅ + Batch 7 gestartet
- Nacht It. 128–140 komplett grün (stündlich Poll+Smoke 6/6, views 534→535, besucher 84→85).
- Feed 18.07: Research-Agent (28 Bestands-ids als Dubletten-Bann) → 4 News verifiziert: claude-code-2-1-214-permission-bypass-fixes (18.07, security), kimi-k3-frontend-arena-market-reaction (17.07, modelle), codex-cli-0-144-5-dangerous-command-detection (16.07, tools), paper-early-adoption-agentic-coding-github (16.07, papers). Fable-Frist-Kandidat: KEINE neue offizielle Meldung → korrekt ausgelassen.
- 2 eigene Live-Stichproben: GitHub-Release v2.1.214 (200, PowerShell×6), arXiv 2607.14037 (200, agentic×15).
- Übersetzer ×4 MD5-gepinnt (6ae1fb3d) → ALLE 4 OK, meta byte-identisch.
- Merge VORN ×5: 28→32, IDS SYNCHRON. BUILD_EXIT=0. Deploy 2b6743b9. Live-Verify de+zh 4/4. Commit dae8bc6 targeted, gepusht.
- Parallel: Batch-7-Autoren DE+EN laufen (10 Themen: 4× prompt-pattern, reasoning-modelle, mixture-of-experts, streaming, quantisierung, issue-zu-pr-workflow, checkpoints-und-rollbacks).

## It. 141 (Fortsetzung, 18.07.2026 ~07:10–09:20) — KAPITEL-BATCH 7 LIVE ✅ (91→101)
- 2 Autoren (DE+EN, Sonnet) parallel mit Komplett-Schema + Geschwister-Hinweis: sauber, kein Rogue-Fork, beide selbst hart validiert.
- Adversarial-Review (37 Quellen-Checks): 9 Findings — 2 kritisch (EN-MoE zitierte Kimi-K2-HF-Card statt K3; EN-Beispiel nutzte veraltetes Top-Level `output_format` statt `output_config.format`), 4 moderat (u.a. DE-reasoning verschmolz 32k-Timeout-Hinweis mit „sinkendem Nutzen"; DE/EN-Widerspruch rollen-prompts), 3 gering (Redirect-URLs). Quellen-Sets DE=EN je slug harmonisiert.
- ZWISCHENFÄLLE: (1) Reviewer-Anker doppelt-JSON-escaped → Decode-Fallback in apply-Skript. (2) Reviewer-Fix für output-formate-erzwingen war NO-OP (fix==anchor) → Claim selbst gegen platform.claude.com-Doku verifiziert (output_config.format, Migration von output_format dokumentiert) und handgefixt (fix-en-output-config.mjs; erster Handfix verschachtelte falsch, zweiter korrekt). REGEL bestätigt: Reviewer-Fixes IMMER selbst verifizieren.
- 3 Übersetzer es/fr/zh MD5-gepinnt (de=25295155…) parallel: alle OK, selbst nachvalidiert (meta/related/correct/urls byte-identisch).
- Merge ×5: 91→101, SLUGS SYNCHRON. WORLD: W1→17 (+few-shot, rollen, reasoning, streaming), W2→18 (+output-formate, selbstkritik), W3→27 (+checkpoints, issue-zu-pr, quantisierung, MoE).
- BUILD_EXIT=0. Deploy fac6ae12. Live-Verify 5/5 (reasoning/moe/checkpoints de, few-shot zh, Lernpfade). Screenshot data/shot-batch7-moe.png sauber. Commit c3bd85a gepusht.
- Challenge-Pool wächst automatisch auf 101 Fragen (build-challenge.mjs zieht aus entries).

## It. 142 (18.07.2026 ~08:52–09:40) — REMOTION R11: MoE-Demo ✅
- Poll 536/86 grün, Smoke 7/7 (inkl. neuem MoE-Kapitel).
- videos/src/MoeDemo.tsx: 3 Tokens laufen durch Router, je 2 von 8 Experten leuchten auf (nicht-aktive dimmen), Schluss-Chip „2,8 Bio. total, Bruchteil aktiv" (Kimi K3), dict ×5. 300 Frames/720p.
- 5 Renders (je ~1,2 MB) → site/public/videos/moe-demo.<lang>.mp4. Einbettung slug-conditional in lexikon/[slug]/page.tsx.
- BUILD_EXIT=0, Deploy 76266a9a, Live-Verify: Video-Tag 1×, mp4 200 + volle 1.271.937 B ausgeliefert, Playwright: 1 <video> auf Seite, Player rendert (0:10). Commit 499a339.
- Videos gesamt: 80 (16 Motive ×5).

## It. 143 (18.07.2026 ~11:48–15:00) — IDEEN-RUNDE 4 KOMPLETT ✅ (alle 4 an einem Tag)
- Poll 538/88 grün, Smoke 7/7. Ideen-Pitch R4 vorgezogen (Marvin war aktiv) → er wählt ALLE 4. IDEEN.md aktualisiert.
- ① BEFEHLS-ROSETTA /[lang]/rosetta/: 28 Aufgaben × 5 Plattformen in 6 Gruppen, 96 Zellen — jede gegen commands.json validiert (Agent durfte nichts erfinden, „—" wo nichts dokumentiert), 22 Zeilen mit ≥3 Treffern. Übersetzer ×4 MD5-gepinnt (cells byte-identisch). Suche + Links in die Befehls-Referenz + Teaser auf /befehle/. Deploy 6f7e9b08, Live-Verify 5/5, mobil 0px Overflow. Commit 6854f8a.
- ② FEHLER-KATALOG /[lang]/fehler/: 24 echte Fehlermeldungen (Kategorien limits4/auth1/kontext3/werkzeuge6/sicherheit3/code3/setup4), 22 Quellen vom Rechercheur geprüft + 3 von mir stichprobenartig nachgezogen (200 + Kern-Claim). Fehlermeldungen bleiben englisches Original, Rest ×5 übersetzt. Client-Suche + Kategorie-Filter + Aufklapp-Karten. Playwright: Aufklappen ok (5 Fix-Schritte), Filter „Installation" → 4 Karten, mobil 0px.
- ③ WIZARD-STARTER-KIT: bestehender Wizard (/start/) erweitert statt dupliziert — generierte Projekt-Anleitungsdatei als editierbare Textarea + Copy, Dateiname je Tool BELEGT (CLAUDE.md code.claude.com/docs/en/memory · .cursor/rules cursor.com/docs/cli/changelog · CONVENTIONS.md aider.chat · AGENTS.md developers.openai.com/codex/cli) + „Deine ersten 5 Befehle" aus commands.json; Build wirft, falls ein Slug fehlt. Playwright: Textarea + 5 Befehls-Links erscheinen.
- ④ LERN-STATISTIK /[lang]/fortschritt/: XP-Kacheln, 4 Welt-Balken, Kategorie-Verteilung, XP-Kurve (SVG), Challenge-Bilanz aus vorhandener Tages-Historie, Teilen-Bild via Canvas (Download getestet: promptgarten-fortschritt-260xp.png). progress.ts schreibt ab jetzt Tages-Snapshots (max 120). Header-XP-Pill + Footer verlinken die 3 neuen Seiten. Deploy bc84fd85, alle Playwright-Checks grün, mobil 0px.
- ZWISCHENFÄLLE: (1) Fehler-Seite war fertig, bevor ihre Inhalte da waren → Build brach ab; statt Platzhalter zu deployen habe ich lib/components/route in den Scratchpad geparkt, Rosetta sauber ausgeliefert und danach zurückgeholt. Als Muster brauchbar. (2) docs.cursor.com liefert per curl nur die JS-Nav-Shell (Soft-404-Muster) → Beleg für `.cursor/rules` aus dem offiziellen Changelog geholt, statt zu raten.
- Commits: 6854f8a (Rosetta), 517b73f (Fehler+Wizard), 10f4341 (Fortschritt). Deploys: 6f7e9b08 → 5cc62d08 → bc84fd85.

## It. 144 (18.07.2026 ~14:00–15:40) — LINK-AUDIT vorgezogen ✅ (Verifikation statt Publikation)
- Poll 539/89 grün, Smoke 10/10. Kapitel-Batch 8 bewusst NICHT gestartet: heute schon 10 Kapitel publiziert, Direktive 7 (Rate ≤ Verifikationskapazität) hat Vorrang. Stattdessen Link-Audit vom 21.07 vorgezogen — reine Verifikationsarbeit.
- NEU research/link-audit.mjs: sammelt Quellen strukturiert je Content-Typ UND per Rohtext-Scan. Erster Lauf fand nur 318 URLs — Rohtext-Scan deckte auf, dass addons/vergleiche/timeline/benchmarks/loops ihre Links NICHT in sources[] halten → 119 URLs waren unsichtbar. Endstand: 410 geprüfte URLs.
- ERGEBNIS: 0 defekte Links. Aufschlüsselung der 21 Rohtreffer: 6× Bot-Blocking (npmjs, openai×2, x.ai, ai.meta.com, developer.meta.com — alle per Browser-UA bzw. r.jina.ai als real existierend UND inhaltlich passend verifiziert), 11× Platzhalter aus Code-Beispielen (localhost, example.com, api.wetter.de …), 1× MCP-Endpunkt mcp.context7.com (GET 405 ist korrekt; POST initialize → 200, Server „Context7 3.2.3"), 2× Wikipedia-Fehlalarm durch meinen eigenen Regex (schnitt Klammer-URLs ab → gefixt).
- KANONISIERUNG: 73 Redirects mit Pfadänderung → 1054 URL-Ersetzungen über 35 Content-Dateien (docs.anthropic.com → platform/code.claude.com, platform.openai.com → developers.openai.com u.a.). Skript schreibt nur nach JSON.parse-Gegenprobe.
- ECHTES FINDING: docs.aws.amazon.com/.../model-customization.html leitete auf die userguide-Startseite um, die 0 Treffer für Fine-Tuning enthält (faktisch ein Soft-404). Ersetzt durch custom-models.html (10 Treffer, nennt „Supervised fine-tuning" explizit).
- PARITÄTS-FEHLALARM: Prüfskript meldete zerstörte Quellen-Parität — Ursache waren sprachspezifische Wikipedia-Links (gewollt). Gegenprobe via `git show HEAD:` zeigte: 9 DE/EN-Abweichungen bestanden schon vorher, meine Kanonisierung erzeugte exakt 0 neue. Rosetta-cells über alle 5 Sprachen identisch.
- BUILD_EXIT=0, Deploy 2aa6c1e2, Live-Verify (claude-md zeigt code.claude.com/docs/en/memory, 0 alte docs.anthropic.com-Reste; fine-tuning zeigt custom-models.html). Commit 9e0f23d.

## It. 145 (18.07.2026 ~15:12–16:00) — LOOP.md-Pruning vorgezogen ✅
- Poll 539/89 grün, Smoke 10/10. Publikationsstopp für Kapitel eingehalten (Direktive 7) → Wartungsarbeit statt Content.
- LOOP.md aktualisiert: Stand von It. 121 (91 Kapitel/25 News/70 Clips) auf It. 145 (101 Kapitel/32 News/80 Clips/~2132 Seiten, Rosetta+Fehler+Fortschritt+Wizard-Kit+Newsletter), Direktive 3 auf 5 Plattformen/293 korrigiert, Direktive 8 entfristet, Rotation neu (Feed 19.07 → Batch 8 → R12 → Ideen-R5 → Batch 9 → Audit/Pruning ~25.07), Blocker um Newsletter-Opt-in + alle 5 Datums-Reminder ergänzt, Quellen-Gesundheit dokumentiert.
- 7 neue harte Regeln eingearbeitet: kein `&&` nach dem BUILD_EXIT-echo · Routen ohne Content nach site/_hold/ parken (die Datei hatte diese Regel bereits — mein Scratchpad-Park war die Improvisation derselben Idee, jetzt vereinheitlicht) · Reviewer-Fixes selbst gegenprüfen (No-op + doppelt-escapte Anker) · Secret-Datei ist geteilt (RESEND_API_KEY = framefetch) · Bot-Blocking ≠ toter Link, aber Redirect auf Übersichtsseite = verstecktes Soft-404 + docs.cursor.com liefert JS-Shell · git commit -F - bei Anführungszeichen · Artifact-Republish ohne url.
- Datei bleibt kompakt: 92 → 100 Zeilen trotz 7 neuer Regeln (veraltete Stand-Absätze ersetzt statt angehängt). Commit 7510091.

## It. 146 (18.07.2026 ~16:16–16:45) — Rosetta-Querverweis auf Befehlsseiten ✅ (signalgetrieben)
- Poll 539/89 grün, Smoke 10/10. Signal aus top_paths: /en/befehle/claude-code/scroll-speed/ hat 21 Views bei 21 unique Besuchern — Befehlsseiten sind der stärkste Sucheinstieg, aber die tags zuvor gebaute Rosetta war von dort nicht erreichbar.
- NEU site/components/RosettaHinweis.tsx (Server-Komponente): sucht den aktuellen {platform, slug} in der Rosetta und zeigt die Entsprechungen der anderen 4 Plattformen als Links + „Alle 28 Aufgaben vergleichen". Rendert null, wenn der Befehl nicht in der Tabelle steht oder keine andere Plattform eine Entsprechung hat — keine leeren Kästen.
- Abdeckung: 96 der 293 Befehlsseiten (claude-code 25, cursor-cli 23, antigravity-cli 23, aider 15, codex-cli 10). Daten kommen aus rosetta.<lang>.json, also bereits gegen commands.json validiert — kein neuer Erfindungs-Pfad.
- BUILD_EXIT=0, Deploy a7f34ff0, Live-Verify de/en/zh je 1 Treffer, scroll-speed korrekt ohne Hinweis, aider/model zeigt alle 4 Cross-Links, mobil 0px Overflow, Screenshot sauber. Commit 74fcc8f.
- MERKE: Live-Verify mit `grep -c` case-insensitiv fahren, wenn der Titel im Markup via .toUpperCase() gerendert wird — erster Check meldete fälschlich 0 Treffer.

## It. 147 (18.07.2026 ~17:23–17:40) — REMOTION R12: Rosetta-Demo ✅
- Poll 539/89 grün, Smoke 10/10. Kapitel-Stopp gilt weiter (Direktive 7) — Video ist keine Kapitel-Publikation, Direktive 12 verlangt wiederkehrende Clips.
- videos/src/RosettaDemo.tsx: 3 Zeilen laufen ein, Befehle leuchten spaltenweise auf. Modell wechseln (/model ×5), Diff ansehen (/diff ×4 + Cursors /changes), Änderungen zurücknehmen (/rewind ×3, Aiders /undo, Codex als gestrichelte „—"-Lücke). Werte 1:1 aus rosetta.de.json — die Lücke ist echt, nicht dramatisiert. 330 Frames/720p, dict ×5.
- 5 Renders (je ~1 MB) → site/public/videos/rosetta-demo.<lang>.mp4, eingebettet über der Tabelle auf /[lang]/rosetta/ mit VIDEO_LABEL ×5.
- BUILD_EXIT=0, Deploy ff187e87, Live-Verify: Video-Tag de+zh, mp4 vollständig ausgeliefert (1.037.850 B), Tabelle unverändert darunter, mobil 0px Overflow.
- MERKE: Browser-Screenshot zeigt bei preload=metadata nur das leere Poster (currentTime-Sprung greift nicht zuverlässig) → Videoinhalt stattdessen mit `npx remotion still <Id> --frame=N` prüfen. So verifiziert: Layout, alle 15 Zellen, gestrichelte Lücke, Fußnote.
- Commit 9ea905a. Videos gesamt: 85 (17 Motive ×5).

## It. 148 (18.07.2026 ~18:36–19:00) — llms.txt + API-Index nachgezogen ✅
- Poll 542/91 (Traffic zieht an), Smoke 10/10 grün.
- BEFUND: Die Plattform wirbt mit „KI- und scrape-freundlich", aber llms.txt kannte nur 6 Seiten und 5 API-Endpunkte. Nicht erwähnt, obwohl live: 293 Befehle, Rosetta, Fehler-Katalog, Prompts, Addons, Benchmarks, Timeline, Challenge, Fortschritt, Start-Wizard, RSS, Sitemap. Für die eigene Zielgruppe (KI-Agenten) war die Seite damit halb unsichtbar.
- llms.txt neu geschrieben: alle 12 API-Endpunkte (je Sprache), Feeds, 16 Seiten mit einer Zeile Zweck, Hinweise zu Quellenpflicht/„—"-Konvention/zwei Detail-Levels. Behauptete RSS-Pfade vorher gegen build-rss.mjs geprüft (feed.<lang>.xml + feed.xml stimmen).
- build-api.mjs: kopiert seit jeher ALLE content-Dateien, dokumentierte aber nur 5 Typen — rosetta/fehler waren tagelang ausgeliefert, standen aber in keinem Index. ENDPOINT_DOCS auf 11 Typen erweitert + GUARD: undokumentierter Content-Typ bricht den Build. Guard getestet (fiktiver Typ → Exit 1, keine Reste in public/api, Guard läuft vor dem Kopieren).
- ZWISCHENFALL: Erster Deploy lief aus dem Repo-Root statt aus site/ (cwd-Reset zwischen Calls) und schlug fehl — exakt die dokumentierte LOOP.md-Regel. Zweiter Versuch mit `cd … && wrangler` im selben Call: Deploy b0e12f11.
- Live-Verify: llms.txt nennt alle neuen Seiten, API-Index 11 Endpunkte/55 Dateien, /api/rosetta.en.json liefert 6 Gruppen/28 Aufgaben, /feed.en.xml 200. Commit f39a02c. (public/api/ ist generiert und gitignored.)

## It. 149 (18.07.2026 ~19:43–20:15) — Fehler-Katalog in die Volltextsuche ✅
- Poll 546/92 (Traffic steigt weiter), Smoke 10/10 grün.
- BEFUND: Suchindex (422 Docs) kannte Kapitel, Befehle, Addons, Prompts — aber nicht den Fehler-Katalog. Genau der Inhalt, den Leute wörtlich in eine Suche tippen („429", „prompt is too long"), war nur über die /fehler/-Seite selbst auffindbar.
- build-search-index.mjs um fehler.<lang>.json erweitert (symptom als Titel, ursache als Untertitel, fix-Schritte in den Suchtext) → 446 Docs (k 101 / b 293 / f 24 / p 16 / a 12). SearchModal um Gruppe 'f' erweitert: Typ, Labels ×5 („Fehler & Lösungen"/„Errors & fixes"/…), Platzhalter-Text, Sortierung (nach Befehlen), eigene Farbe.
- Deploy 78195f2f. Browser-Test statt Index-grep: „rate limit", „429", „prompt is too long" — alle drei zeigen die Fehler-Gruppe. Mein erster Index-Test per String-includes hätte fälschlich „kein Treffer" gemeldet (MiniSearch tokenisiert, `rate_limit_error` ≠ `rate limit`) — Lehre: Such-Features im Browser prüfen, nicht am Rohindex.
- Screenshot zunächst unbrauchbar (Eingabefeld nicht geleert → „prompt is too long429"), sauber nachgezogen: „429" liefert Kapitel „Rate Limits und Quotas" + die Einträge 429 und 529.
- Commit 626f9e0.

## It. 150 (18.07.2026 ~20:50–21:15) — Batch-8-Themen vorbereitet ✅ (5 Kandidaten verworfen)
- Poll 548/93 grün, Smoke 10/10. Kapitel-Publikationsstopp gilt → Vorbereitung statt Content.
- Alle 10 geplanten Themen inhaltlich gegen die 101 Bestands-Kapitel geprüft (nicht nur Slug-Vergleich, sondern Teaser/Body der nächstgelegenen Kapitel gelesen). Ergebnis: 5 Kandidaten VERWORFEN — observability-metriken (agenten-observability deckt Logs/Kosten/OpenTelemetry ab), claude-md-patterns (claude-md + monorepo-mit-agenten), agent-kosten-benchmarks (zwei Kosten- + zwei Benchmark-Kapitel vorhanden), secrets-management-agenten (api-keys-sicher-verwalten, d1), agent-fehlerkultur (zu weich, nah an agent-festgefahren).
- Ersatz über Lücken-Suche gefunden: ki-code-und-lizenzen (0 Treffer für Lizenz/Urheberrecht im gesamten Bestand — große Lücke bei einer Coding-Plattform), latenz-optimieren (Latenz wird in 6 Kapiteln nebenbei erwähnt, nirgends gebündelt), prompt-versionierung (0 Treffer), speculative-decoding (frei, ergänzt streaming um die Erzeugungsseite).
- Finale 10 mit Kategorie/Schwierigkeit/Abgrenzungsauftrag in research/kapitel-batch8-themen.md (3 konzept, 2 begriff, 5 guide; 6× d2, 4× d3). Zwei Themen tragen einen expliziten Abgrenzungsauftrag in den Autoren-Prompt: multi-repo-arbeit ≠ monorepo-mit-agenten, red-teaming-agenten ≠ prompt-injection-abwehr-praxis.
- Commit 1a6de25. Morgen früh: Feed 19.07, dann direkt Autoren mit dieser Liste starten.

## It. 159 (19.07.2026 ~06:03–07:00) — FEED 19.07 LIVE ✅ (32→35) + Batch 8 gestartet
- Nacht It. 152–158 durchgehend ruhig. Poll 06:03: 547/102 — die 100er-Besuchermarke ist gefallen (vor vier Tagen 36).
- FABLE-5-FRIST AUFGELÖST statt ausgelaufen: Anthropic kündigte am 17.07. an, dass Fable 5 ab 20.07. dauerhaft in Max/Team Premium bleibt (50% der Limits); Pro/Team-Standard verlieren den gebündelten Zugang, erhalten $100 Einmalguthaben und zahlen danach API-Preise ($10/$50 pro Mio. Token). Zwei unabhängige Quellen (simonwillison.net mit @claudeai-Zitat, techtimes) selbst geprüft.
- HALLUZINATIONS-FUND: Eine Suchmaschinen-Zusammenfassung behauptete eine „US-Regierungsdirektive zur Zugangssperre am 19.07."; das Ereignis auf anthropic.com datiert real auf den 12. Juni. Der Rechercheur hat das selbst entlarvt und verworfen — genau dafür ist die Regel „jede Quelle selbst öffnen" da.
- Weitere News: github-copilot-code-review-firewall-config (17.07, github.blog changelog, „firewall" 17×) · paper-setup-instructions-weaponized-coding-agents (16.07, arXiv 2607.15143 — Agenten installieren Pakete aus präparierten READMEs; offensichtliches Typosquatting wird erkannt, plausible Varianten wie „azurecore" statt „azure-core" rutschen fast immer durch).
- Verworfen: Claude Code v2.1.215 (nur eine Changelog-Zeile), Kimi-K3-Folgeartikel (deckungsgleich mit Bestand), MCP-Spec-Meldungen (real Mai/Juni datiert), Anthropic-Meta-Compute-Deal (kein Coding-Bezug).
- Übersetzer ×4 MD5-gepinnt (5568d24a) → ALLE 4 OK. Merge VORN ×5: 32→35, IDS SYNCHRON. BUILD_EXIT=0. Deploy 0899949b. Live-Verify 5/5 (de+zh je 2 Titel, RSS aktuell). Commit b9a117d.
- Parallel: Batch-8-Autoren DE+EN laufen (10 Themen, drei Pflicht-Abgrenzungen im Prompt).
