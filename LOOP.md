# promptgarten — Autonome Bau-Loop (Semantic Memory)

> Regeln + aktueller Stand. KURZ HALTEN — Prune-Regel: jede Zeile muss Fehler verhindern, sonst raus.
> Iterations-Historie (Episodic): **loops/HISTORY.md** (append-only, It.-Protokolle dort anhängen).
> Restrukturiert It. 73 (13.07.26) nach Deep Research: research/autonomous-loops-deep-research-2026-07.md.

## Mission
Kostenlose, sich selbst weiterbauende Lern-Plattform für KI-/Agenten-Programmierung. promptgarten.com, 5 Sprachen (DE/EN/ES/FR/ZH), Sprache simpel + faktisch + minimalistisch. Zielgruppen: Anfänger, Vibe-Coder, Devs, Agenten-Nutzer — und KI-Agenten selbst (freie JSON-API + llms.txt).

## Design (FESTGELEGT)
1d „Spielwiese": Creme #fdf6ec, Ink #2b2118, Akzent #e8613c, Bricolage Grotesque; Karten 2.5px solid, radius 20, Schatten 5px 5px 0, leichte Rotationen; Farben lime #c9e265 / pink #f9c5d8 / blau #a8d8f0 / gelb #f5d565. Schwierigkeits-Dots ●○○ (1h), Gamification XP/Streak/✓/🔒 localStorage (1i).

## Marvin-Direktiven (alle aktiv, bindend)
1. **KEIN Nachtmodus** — 24/7 voller Takt, immer Substanz bauen.
2. **Quellenpflicht** — jede Behauptung sichtbar belegt auf der Seite; URLs selbst verifizieren (curl -L -A Browser-UA → 200); nie Quellen erfinden.
3. **Befehls-Referenz** — JEDER CLI-Befehl pro Plattform mit wann/wann-nicht ✅ KOMPLETT für 5 Plattformen (293: Claude Code 92 + Cursor 80 + Antigravity 57 + Aider 48 + Codex 16; neue Plattformen bei Relevanz). Quer dazu: /rosetta/ = dieselbe Aufgabe auf allen 5 Plattformen.
4. **Addons mit eigenen Detailseiten** (✅ 12×5) — Setup aus offiziellen READMEs.
5. **Visualisierungen** — verständlich aber hochwertig, Inline-SVG im 1d-Stil (✅ Loops+Addons+Context-Window) + Remotion-Videos (Direktive 12).
6. **KEINE KI-Autorschaft** — Marvin ist der Macher; Seite kommuniziert „KI- & Scrape-freundlich, jeder soll lernen".
7. **MEHR KAPITEL** — hohes Content-Tempo, ABER siehe Publikationsraten-Regel unten. ⏸️ **AUSGESETZT seit 19.07. nachmittags zugunsten von Direktive 16.**
8. **ZWEI Detail-Level** — 🌱/🔬-Toggle ✅ KOMPLETT (alle Kapitel ×5, Lint erzwingt bodyDetail-Parität).
9. **Admin-Dashboard richtig stark** (✅ V2) + Monetarisierungs-Todos mit Schritt-für-Schritt in /admin.
10. **Responsiveness + Wow** immer; erledigte Todos raus aus Statusboard-Todo-Sektion.
11. **Landing ausbauen** (✅ It. 73 nach research/landing-cro-seo-2026-07.md).
12. **Remotion-Beispiel-Videos** (NEU 13.07 abends): Mit Remotion (React-Video-Framework, Skill remotion-video-creation vorhanden) kurze Beispiel-/How-to-Videos rendern und dort einbetten, wo sie passen (z. B. Loop-Zyklus animiert auf /loops, Context-Window-Füllung, Befehls-Demos). IMMER WIEDER reviewen und ausbauen (fester Rotations-Punkt, nicht einmalig). Constraints: Cloudflare Pages 25MB/Datei → kurze Clips (10–25s, 720p, stumm ok, <10MB), `<video>`-Tag mit poster+controls, kein Autoplay mit Ton; Videos versioniert in videos/ (Remotion-Projekt) + gerenderte mp4 in site/public/videos/.
13. **IDEEN-PITCHES wiederkehrend** (NEU 14.07): Die Loop brainstormt IMMER WIEDER selbst konkrete Ideen, was der Seite hinzugefügt werden kann, und stellt sie Marvin vor — er sagt ja/nein oder wählt aus („mach mir 3 Vorschläge"). Mechanik: mind. 1×/Tag bzw. alle ~6 Iterationen 3-5 frische Ideen (Feature/Content/Monetarisierung/Wow) per AskUserQuestion (multiSelect, max 4 Optionen + Other) pitchen; wenn Marvin nicht aktiv im Chat ist zusätzlich PushNotification. Backlog in loops/IDEEN.md pflegen: gepitcht/gewählt/abgelehnt mit Datum — ABGELEHNTE nie erneut pitchen, GEWÄHLTE in die Rotation. Keine Antwort = beim nächsten Pitch andere Ideen, alte bleiben offen gelistet.

14. **WERBUNG AN** außer auf der Landing.
15. **VERGLEICHE INTENSIV** (17.07): 2D-Quadrant nach Intelligence-to-Cost + Stärken-Profile, breite Modell-Abdeckung ✅.
16. 🎯 **QUALITÄTS-PHASE (NEU 19.07. nachmittags, Marvin-Direktive — gilt bis auf Widerruf)**: Der Fokus liegt jetzt auf dem BESTEHENDEN Produkt, nicht auf Wachstum. Texte überarbeiten, Layout verbessern, Seiten schöner und angenehmer machen, Schwachstellen ausbessern. **Ausnahme: der Feed bleibt täglich aktuell** (Direktive 2 gilt dort unverändert). Neue Kapitel-Batches pausieren (Direktive 7 ausgesetzt) — vorbereitete Themen bleiben in research/kapitel-batch9-themen.md liegen, bis Marvin sie wieder freigibt. Arbeitsweise: erst Befund (Screenshots, Text-Stichproben, Mobil-Ansicht, Ladeverhalten), dann priorisiert verbessern, jede Änderung live gegenprüfen. Verbesserungen sind Substanz — sie zählen als Tagespensum wie ein Kapitel-Batch.

## 🔴 Harte Arbeitsregeln (Fehler-erprobt)
- **cwd**: JEDER Repo-Befehl (node/npm/grep/deploy/ls) mit explizitem `cd /c/Users/marvi/promptgarden/site && …` in DEMSELBEN Call — Shell-cwd resettet zwischen Calls (3× Vorfall, zuletzt It. 75: Deploy lief aus ~ und passierte gar nicht).
- **Build-Exit separat**: `cd …/site && npm run build > ../build.log 2>&1; echo BUILD_EXIT=$?` — NIE `| tail` (maskierte 2× TS-Fehler → stale Deploy) und NIE `&& deploy` dahinterhängen: das `echo` setzt `$?` auf 0, der Deploy lief trotz BUILD_EXIT=1 (It. 127). Deploy immer als SEPARATER Call.
- **Route ohne Content parken statt Platzhalter deployen**: fehlt die Content-Datei, bricht der Build (Modul nicht gefunden) — Route + lib + Komponente nach `site/_hold/` verschieben, Rest ausliefern, nach Eintreffen der Daten zurückholen (It. 143). Nie Dummy-Inhalte live stellen.
- **Live-Verify auf INHALTS-Strings** pollen, nie Status-200/UI-Labels (RSC-Payload → False Positives; Edge braucht ~60s).
- **Responsive Grids als CSS-Klasse** mit Media Query, nie inline gridTemplateColumns.
- **Static Export**: leere generateStaticParams bricht Build → Route in site/_hold/ parken bis Daten da.
- **JSON nach Hand-Autoring immer mit node parsen**; Feed-date = Ereignisdatum, nie Zukunft (Guard in build-api.mjs + lint).
- **Poll-Parser wirft hart** auf `j.error` UND undefined Keys — leere Antwort ≠ Fehler-Antwort.
- **Uhrzeit IMMER per `date` prüfen**, nie aus Session-Verlauf/Wakeup-Labels ableiten (It. 89-93: „Nacht-Takt" gefahren, real war 09-15 Uhr — Marvin-Rüge 14.07). KEIN Nachtmodus heißt: identisches Substanz-Pensum rund um die Uhr; Checks-only nur wenn wirklich nichts ansteht, nie zeitgesteuert.
- **Parallelen Agents die Geschwister MITTEILEN** („Agent X schreibt parallel Datei Y — nicht anfassen"): It. 116 hielt der DE-Autor den parallelen EN-Autor für einen Rogue-Fork und benannte dessen Output-Datei um.
- **Reviewer-Sub-Forks liefern an den ORCHESTRATOR**, nie an den Reviewer zurück (SendMessage an „fork"/Typnamen schlägt fehl) — Reviewer-Prompts explizit anweisen, NICHT auf Fork-Antworten zu warten; Orchestrator relayed (It. 116: Reviewer hing wartend fest).
- **Autoren-Schema komplett ausschreiben** (inkl. exercise.selfCheck!) — It. 116: fehlendes selfCheck crashte Prerender; Lint-Regel deckt es jetzt ab.
- **Reviewer-Fixes selbst gegenprüfen**: It. 143 lieferte der Adversarial-Reviewer einen Fix, der identisch zum Anker war (No-op) — der Claim stimmte trotzdem, der Fix aber nicht. Anker können außerdem doppelt JSON-escaped ankommen; Apply-Skript braucht Unescape-Fallback + `throw` bei NOT FOUND.
- **Secret-Dateien sind geteilt**: vor `>>` in ~/.tm2-secrets/autopilot.env prüfen, ob der Var-Name schon einem anderen Projekt gehört (`RESEND_API_KEY` = framefetch!). promptgarten nutzt `PG_RESEND_KEY` (Versand) + `PG_RESEND_FULL_KEY` (Domain-Verwaltung).
- **Bot-Blocking ≠ toter Link**: npmjs/openai.com/x.ai/meta blocken Node-fetch (403/400), sind per Browser-UA bzw. `https://r.jina.ai/<url>` erreichbar. Umgekehrt: 200 + Weiterleitung auf eine Übersichtsseite kann ein verstecktes Soft-404 sein → Ziel immer auf den Kern-Claim greppen (It. 144: AWS-Quelle so entlarvt). `docs.cursor.com` liefert per curl nur die JS-Navigations-Hülle → Belege aus `cursor.com/docs/cli/changelog` ziehen.
- **git commit mit Anführungszeichen im Text** → `git commit -F -` + Heredoc; `-m "…\"…\"…"` zerlegt die Message in Pfad-Argumente (It. 144).
- **Die Domain heißt `promptgarten.com` mit T** (Garten, nicht garden). `promptgarden.com` mit D gehört jemand anderem und steht wegen fehlender WHOIS-Prüfung auf einer Namecheap-Parkseite. It. 165 hat mich ein Tippfehler in einem Testskript kurz an einen Prod-Ausfall glauben lassen — Cloudflare-Repo/Projekt heißen mit D, die Domain mit T. Vor jedem „Seite ist tot"-Alarm die Schreibweise prüfen.
- **Artifact-Republish OHNE `url`-Parameter**, solange dieselbe Datei in derselben Session publiziert wurde — die URL bleibt. Ein falsch getippter `url` trifft ein fremdes/gelöschtes Artifact.

## ✅ Verify-Gate (Pflicht vor „fertig" — DR-Umsetzung It. 73)
1. `node scripts/lint-content.mjs` (läuft auch als prebuild, blockt Build): Slug-Parität ×5, Quiz-Indizes, Quellenpflicht, Quellen-Konsistenz (Wiki lokalisiert ok), bodyDetail-Parität, Feed-Daten.
2. BUILD_EXIT=0 separat prüfen → deploy → Live-Verify auf Content-Strings.
3. UI-Änderungen: 375px-Screenshot (Playwright) oder CSS-Review — „Test lief" ≠ „Feature funktioniert" (E2E wie ein Mensch).
4. **Adversarial Review bei Content-Batches**: frischer Agent prüft neue Kapitel/Übersetzungen NUR gegen Quellen + Schema (Correctness/Scope, keine Stilnoten) — Autor benotet sich nicht selbst. Übersetzungs-Agents re-validieren Quelle vor finalem Write (Drift-Check).
5. Known-good Deploy-Commit im It.-Protokoll notieren → Rollback = alten Commit re-deployen, nie „reparieren während des Vorfalls".

## 📏 Publikationsrate ≤ Verifikations-Kapazität (Scaled-Content-Abuse-Schutz)
Google bestraft Volumen ohne Mehrwert, nicht KI-Nutzung. Batches nur so groß, wie Quellen wirklich einzeln geprüft werden (≈10 Kapitel/Batch, 2-4× menschliche Baseline, nicht 40-100×). Qualität + sichtbare Quellen (E-E-A-T) schlagen Volumen auch fürs Ranking.

## 🚧 Autonomie-Grenzen (Kategorie-Liste statt Konfidenz-Gefühl)
- **Immer autonom**: Content ×5, Static-Site-Deploys, Worker-Deploys (promptgarden-Account), D1-Schema-ADDs, DNS-ADDs per dokumentierter Domain-Automatik, Statusboard.
- **NIE ohne Marvin**: DNS/Zone-Löschungen, Zahlungs-/Ads-Konten-Setups (AdSense, Stripe o.ä.), Massen-Löschungen in D1, Posts auf externen Plattformen (Reddit etc.), Domain-Käufe, alles Irreversible außerhalb des Repos.
- Fragen bündeln (Marvins Aufmerksamkeit = knappe Ressource); AskUserQuestion + Push wenn Marvin mobil.

## 🧠 Compaction-Preserve (MUSS jede Kontext-Kompaktierung überleben)
Poll-Rezept (unten, X-Admin-Key!), cwd-Regel, Verify-Gate, aktuelle Rotation + It.-Nummer, „ScheduleWakeup mit vollem /loop-Prompt".

## Standard-Iteration
1. **Poll**: `curl -s https://promptgarden-api.promptgarden.workers.dev/v1/admin/summary -H "X-Admin-Key: $PG_ADMIN_KEY"` — Keys: `open_admin_notes/open_bugs/new_feedback/marvin_todos/views_7d/top_paths_7d/views_by_day/views_by_lang/views_by_country/top_refs/forum_recent/donations/revenue_total_cents`. Notes/Forum = Arbeitsaufträge, sofort. Todos pflegen via POST /v1/admin/todo.
2. **GENAU EINE Substanz-Sache** aus der Rotation (Signal-gestützt: top_paths/views vertiefen, aber Direktiven > Daten).
3. Verify-Gate → Commit (+ push origin main) → It.-Protokoll an loops/HISTORY.md ANHÄNGEN (nicht hier).
4. Statusboard-Artifact nur bei Substanz (gleiche file_path data/statusboard.html, Artifact c4776440…).
5. ScheduleWakeup mit vollem /loop-Prompt + aktualisiertem Status-Block.

## Aktueller Stand (It. 145, 18.07.26 nachmittags, Commit-Stand siehe HISTORY)
~2132 Seiten live: **101 Kapitel ×5** (alle 🌱/🔬 + Quiz + Übung mit selfCheck), **293 Befehle ×5** auf 5 Plattformen + **🔄 /rosetta/** (28 Aufgaben × 5 Plattformen, 96 gegen commands.json validierte Zellen), **🩺 /fehler/** (24 Fehlermeldungen mit geprüften Quellen, Suche + Kategorie-Filter), **📊 /fortschritt/** (XP-Kurve, Welt-Balken, Challenge-Bilanz, Teilen-Bild), 🧭 /start/-Wizard **mit Starter-Kit** (Projekt-Anleitungsdatei je Tool + erste 5 Befehle), 🧩 16 Prompts + Sandbox, 12 Addons, 4 Welten (W0 5/W1 17/W2 18/W3 27), Vergleiche v3 (Intelligence-per-Dollar-Quadrant, Ratio-Tabelle, 💶 Preisrechner), 📊 /timeline/, 🔍 Suche, 🗺️ Lern-Landkarte, **Feed 32 News** + 📡 RSS, 🎯 Tages-Challenge (Pool 101), 📱 PWA, 🎬 **80 Remotion-Clips**, 📬 **Newsletter LIVE** (Resend, news.promptgarten.com verifiziert, Digest-Cron Mo 08:00 UTC), Forum, freie API, Admin V2, WERBUNG AN außer Landing. Traffic 18.07 15:00: views_7d 539, besucher_7d 89. Direktive 13: **Runden 1–4 alle geliefert**, Abgelehnt-Liste leer.
**Quellen-Gesundheit** (Link-Audit 18.07): 410 URLs, 0 defekt; Skripte `research/link-audit.mjs` (Rohtext-Scan nötig — addons/vergleiche/timeline/benchmarks/loops halten Links NICHT in sources[]) + `research/kanonisiere-links.mjs`. 9 Kapitel aus Batch 5/6 haben bewusst je Sprache eigene Quellen — kein Fehler.

## Rotation (nächste Arbeit)
① Feed täglich (nächster 19.07 früh; erst alle 32 Bestands-ids listen; 🔔 Fable-5-Frist endet 19.07) ② Kapitel-Batch 8 (101→111) ~19./20.07 — Kandidaten: WebSearch/Grounding, Distillation, Agent-Kosten-Benchmarks, CLAUDE.md-Patterns tiefer, Retrieval-Evaluation, Multi-Repo, Secrets-Management, Observability-Metriken, Fine-Tuning-vs-Prompting, Agent-Fehlerkultur ③ Remotion R12 ④ Ideen-Pitch R5 ~22./23.07 (4 NEUE Kandidaten) ⑤ Kapitel-Batch 9 ⑥ Link-Audit erneut ~25.07 (Skript wiederverwenden) ⑦ LOOP.md-Pruning ~25.07.

## Blocker / Warte auf Marvin (auch als /admin-Todos)
- Sponsors: angemeldet ✓ — Restschritte (Bio/Tier/Stripe/W-8BEN/2FA/Submit) in /admin, danach Footer-Link
- #4 GSC: TXT-Verifizierungswert schicken → Loop setzt DNS-TXT + reicht Sitemap ein
- AdSense: Code eingebaut ✓ — Marvin: Site-Review anstoßen + Datenschutz & Mitteilungen (DSGVO-Message + Limited Ads) aktivieren
- Bing: Sitemap eingereicht ✓ (14.07.)
- Ko-fi-Verification-Token → `wrangler secret put KOFI_TOKEN` (Webhook liegt bereit)
- www→apex-Redirect: kein Token mit Ruleset-Recht (canonical entschärft)
- Newsletter: Marvin ist erster Abonnent — Opt-in-Mail bestätigen (kein Blocker)
- 🔔 19.07.: Fable-5-Frist läuft ab → Feed · 🔔 Mo 20.07 ~08:05 UTC: ersten Digest-Cron-Lauf prüfen (`GET https://api.resend.com/emails` mit PG_RESEND_FULL_KEY) · 🔔 24.07. DeepSeek-Migration · 🔔 27.07. Kimi-K3-Weights · 🔔 28.07.: MCP-Spec final? → alle als Feed-Update

## Architektur
```
promptgarden/
├── LOOP.md            ← Regeln + Stand (DIESE Datei, kurz halten)
├── loops/HISTORY.md   ← Iterations-Protokolle (append-only)
├── TODO.md · DECISIONS.md · research/ · data/ · design/
├── site/              ← Next.js static export → CF Pages (877+ Seiten)
│   ├── content/       ← entries/commands/addons/loops/feed .<lang>.json
│   └── scripts/       ← lint-content.mjs (Gate) + build-api.mjs (prebuild)
└── worker/            ← CF Worker + D1 (Track/Bugs/Forum/Newsletter/Todos/Donations)
```
Secrets: ~/.tm2-secrets/autopilot.env (CF_PAGES_TOKEN, CF_PROMPTGARDEN_ACCOUNT_ID, CF_PG_ZONE_TOKEN=einziger DNS-Writer, PG_ADMIN_KEY). Repo public: github.com/MarvinRey7879/promptgarden — Secrets NIE committen.
