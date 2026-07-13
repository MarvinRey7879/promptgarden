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
3. **Befehls-Referenz** — JEDER CLI-Befehl pro Plattform mit wann/wann-nicht (✅ 108: Claude Code 92 + Codex 16; next: Cursor CLI, Aider).
4. **Addons mit eigenen Detailseiten** (✅ 12×5) — Setup aus offiziellen READMEs.
5. **Visualisierungen** — verständlich aber hochwertig, Inline-SVG im 1d-Stil (✅ Loops+Addons; next: Context-Window).
6. **KEINE KI-Autorschaft** — Marvin ist der Macher; Seite kommuniziert „KI- & Scrape-freundlich, jeder soll lernen".
7. **MEHR KAPITEL** — hohes Content-Tempo, ABER siehe Publikationsraten-Regel unten.
8. **ZWEI Detail-Level** — 🌱/🔬-Toggle, Entry.bodyDetail (20/41 ×5 fertig).
9. **Admin-Dashboard richtig stark** (✅ V2) + Monetarisierungs-Todos mit Schritt-für-Schritt in /admin.
10. **Responsiveness + Wow** immer; erledigte Todos raus aus Statusboard-Todo-Sektion.
11. **Landing ausbauen** (✅ It. 73 nach research/landing-cro-seo-2026-07.md).
12. **Remotion-Beispiel-Videos** (NEU 13.07 abends): Mit Remotion (React-Video-Framework, Skill remotion-video-creation vorhanden) kurze Beispiel-/How-to-Videos rendern und dort einbetten, wo sie passen (z. B. Loop-Zyklus animiert auf /loops, Context-Window-Füllung, Befehls-Demos). IMMER WIEDER reviewen und ausbauen (fester Rotations-Punkt, nicht einmalig). Constraints: Cloudflare Pages 25MB/Datei → kurze Clips (10–25s, 720p, stumm ok, <10MB), `<video>`-Tag mit poster+controls, kein Autoplay mit Ton; Videos versioniert in videos/ (Remotion-Projekt) + gerenderte mp4 in site/public/videos/.

## 🔴 Harte Arbeitsregeln (Fehler-erprobt)
- **cwd**: JEDER Repo-Befehl (node/npm/grep/deploy/ls) mit explizitem `cd /c/Users/marvi/promptgarden/site && …` in DEMSELBEN Call — Shell-cwd resettet zwischen Calls (3× Vorfall, zuletzt It. 75: Deploy lief aus ~ und passierte gar nicht).
- **Build-Exit separat**: `npm run build > /tmp/build.log 2>&1; echo "BUILD_EXIT=$?"` — NIE `| tail` (maskierte 2× TS-Fehler → stale Deploy).
- **Live-Verify auf INHALTS-Strings** pollen, nie Status-200/UI-Labels (RSC-Payload → False Positives; Edge braucht ~60s).
- **Responsive Grids als CSS-Klasse** mit Media Query, nie inline gridTemplateColumns.
- **Static Export**: leere generateStaticParams bricht Build → Route in site/_hold/ parken bis Daten da.
- **JSON nach Hand-Autoring immer mit node parsen**; Feed-date = Ereignisdatum, nie Zukunft (Guard in build-api.mjs + lint).
- **Poll-Parser wirft hart** auf `j.error` UND undefined Keys — leere Antwort ≠ Fehler-Antwort.

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

## Aktueller Stand (It. 73, 13.07.26, Commit-Stand siehe HISTORY)
~880 Seiten live auf promptgarten.com: 41 Kapitel ×5 (+Quiz/Übungen/Toggle), 108 Befehle ×5, 12 Addons ×5 mit Detailseiten, 4 Welten, Benchmarks, Vergleiche, Loop-Galerie, Feed (17 News), Forum, freie API, Admin V2 (Revenue/Länder/Zeitreihe), Landing NEU (CTA/How-it-works/Trust/Course-Schema). Traffic: views_7d ~109, DE/US/FR/PL.

## Rotation (nächste Arbeit)
① Feed 14.07 (Research-Agent, 2–4 verifizierte News ×5) ② bodyDetail-Batch 3 (restliche 21 alte Kapitel) ③ Remotion-Review (wiederkehrend: Qualität prüfen, weitere Stellen — Befehls-Demos/Terminal-Clips) ④ Link-Audit ~19.07 (188 Befehle = viele neue URLs) ⑤ Statusboard. — ✅ erledigt: Kapitel-Batch 2 (74), Context-Window-SVG (75), Cursor CLI 80 Befehle (76), Remotion-Pilot 10 Clips (77).

## Blocker / Warte auf Marvin (auch als /admin-Todos)
- #2 GitHub Sponsors anmelden → Footer-Link
- #4 GSC: TXT-Verifizierungswert schicken → Loop setzt DNS-TXT + reicht Sitemap ein
- #5 AdSense-Code → ads.txt + Snippet + EU-Consent-Banner (Pflicht!)
- #6 Bing (nach GSC via Import)
- Ko-fi-Verification-Token → `wrangler secret put KOFI_TOKEN` (Webhook liegt bereit)
- www→apex-Redirect: kein Token mit Ruleset-Recht (canonical entschärft)
- 🔔 28.07.: MCP-Spec final? → Feed-Update

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
