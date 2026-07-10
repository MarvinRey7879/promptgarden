# promptgarden TODO — nach Prio

## P0 — blockiert / wartet auf Marvin
- [ ] CF-API-Token mit `Cloudflare Pages:Edit` → dann sofort Deploy (It. 1 gebaut)
- [ ] Spenden-Links: PayPal.me-Handle, Ko-fi-URL, GitHub-Sponsors-Handle (Platzhalter eingebaut)
- [ ] Domain-Entscheidung promptgarden.ai (Marvin)

## P1 — nächste Iterationen
- [ ] 🔴 QUELLENPFLICHT umsetzen (Marvin-Regel 10.07): `sources`-Feld (title+url) im Entry-Schema, Quellen-Block unten auf jeder Eintragsseite, alle 18 Bestandseinträge nachrüsten (Agent recherchiert echte Quellen, ich validiere Links), Pflichtfeld für allen künftigen Content
- [ ] Deploy auf CF Pages + Live-Smoke-Test + Lighthouse ≥95
- [ ] Backend-Worker (CF Workers + D1): POST /bug, /feedback (Marvin-Prio-Feld), /newsletter, /track (cookieless)
- [ ] /admin-Dashboard (Token-geschützt): Traffic, beliebte Themen, Feedback-Inbox, Marvin-Prio-Feld
- [ ] Deep Research #1: neue Modelle/CLIs/Repos/Papers/Pain-Points → Feed + 10 neue Einträge
- [ ] Newsletter real (Resend? Double-Opt-in, DSGVO)
- [ ] Bug-Report von mailto auf Worker umstellen

## P2
- [ ] Sprachen ES/FR/ZH (Struktur steht, Content übersetzen via Sonnet-Agents + Stichproben-Validierung)
- [ ] Einstiegs-Wizard: "Was hast du schon gemacht? Vibe-Coder oder Programmierer?" → personalisierter Startpunkt
- [ ] Vergleiche-Sektion (Claude Code vs Cursor vs Codex vs Aider …, ehrlich, aktuell datiert)
- [ ] Feed-Sektion: News der großen KI-Player, kuratiert pro Woche
- [ ] SEO: sitemap.xml, hreflang, schema.org (Course/DefinedTerm), OG-Images; noindex ENTFERNEN erst nach Domain
- [ ] Mehr Lernpfad-Welten (Welt 2: Agenten, Welt 3: Loops & Orchestrierung)

## P3
- [ ] MCP-Server + freie JSON-API für Agenten-Zugriff auf Content
- [ ] Forum (günstigste Option prüfen: GitHub Discussions embed vs Discourse vs eigenes auf D1)
- [ ] Optionale Accounts (Sync von XP/Streak), localStorage bleibt Default
- [ ] Ads (AdSense) + Ad-free-Bezahlversion — erst ab Domain + echtem Traffic
- [ ] How-to-Videos / animierte Beispiele
- [ ] Cookie-Consent-Layer sobald optionales Tracking existiert (nicht-optional = cookieless, kein Banner nötig)
- [ ] Google Search Console + Reddit-Distribution (Marvins Accounts, human-like via Playwright)

## Ideen-Parkplatz (Loop-Brainstorms)
- „Loop-Galerie": echte gute/schlechte Loop-Beispiele mit Annotationen
- Interaktiver Token-Zähler / Context-Window-Visualisierer
- „Prompt-Battle": gleicher Task, 2 Prompts, User rät welcher besser lief
- Wöchentliches „Was ist diese Woche passiert"-Digest = Newsletter-Content
- Playground-freie Übungen: Aufgaben, die man im eigenen Claude Code/Cursor nachmacht + Selbst-Check
