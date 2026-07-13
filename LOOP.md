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
