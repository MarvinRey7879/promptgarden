# promptgarten TODO — nach Prio (Stand It. 46, 12.07.2026)

Erledigtes ist raus — Historie steht in LOOP.md (Protokoll It. 1–45) und DECISIONS.md.
Live: https://promptgarden.pages.dev · 207 Seiten · 31 Einträge · 17 News · 4 Welten · Forum · freie JSON-API — alles ×5 Sprachen, laufende Kosten 0 €.

## P0 — wartet auf Marvin (blockiert die nächste Stufe)
- [ ] **Domain-Klick (30 Sek):** dash.cloudflare.com → „Add a domain" → promptgarten.com → Free → die 2 gezeigten Nameserver bei Namecheap eintragen (Domain List → Manage → Nameservers → Custom DNS). Loop pollt stündlich und übernimmt danach ALLES automatisch.
- [ ] **giscus-App (1 Klick):** github.com/apps/giscus → Install → Repo „promptgarden". Danach kurz im Chat melden → Loop setzt NEXT_PUBLIC_GISCUS=on + Rebuild.
- [ ] **Spenden-Handles:** PayPal.me / Ko-fi / GitHub Sponsors (Platzhalter im Footer warten).

## P1 — Domain-Automatik (läuft von selbst, sobald Zone existiert; Spec in LOOP.md „Domain-Automatisierung")
- [ ] Zone aktiv abwarten → Pages-Custom-Domain (apex + www) per API
- [ ] noindex entfernen, metadataBase + hreflang-Alternates (absolute URLs)
- [ ] sitemap BASE / robots.txt / llms.txt / OG-URLs auf https://promptgarten.com
- [ ] www→apex-Redirect, SSL-Check, Search-Console-Vorbereitung
- [ ] 🔔 28.07.: MCP-Spec 2026-07-28 final erschienen? → Feed-Item aktualisieren

## P2 — Content/Features (unblockiert, Rotation der Iterationen)
- [ ] Übungen zum Nachmachen („mach das in deinem Claude Code/Cursor") + Selbst-Check — in 2–3 Guides einbauen
- [ ] „Prompt-Battle": gleicher Task, 2 Prompts, User rät, welcher besser lief
- [ ] Lexikon nach Bedarf erweitern (Feed-/Forum-Signale beobachten)
- [ ] Performance-Messung: PSI-API-Key (free) besorgen oder Lighthouse-Alternative — Windows-Headless-Crash umgehen

## P3 — braucht Domain + Traffic
- [ ] Newsletter-Versand (Resend, Double-Opt-in, DSGVO) — braucht Absender-Domain
- [ ] Wöchentlicher Digest als Newsletter-Content
- [ ] Google Search Console + Sitemap einreichen; Reddit/HN-Distribution (Marvins Accounts, menschlich via Playwright)
- [ ] Ads (AdSense) + werbefreie Bezahlversion
- [ ] Optionale Accounts (XP/Streak-Sync), localStorage bleibt Default
- [ ] Cookie-Consent-Layer erst, wenn optionales Tracking existiert (Status quo cookieless = kein Banner nötig)

## Ideen-Parkplatz (Loop-Brainstorms)
- How-to-Videos / animierte Beispiele
- Context-Window-Visualisierer als eigenes Tool (Token-Schätzer existiert bereits in 2 Einträgen)
- „Agent-Fails der Woche" — Lernformat aus echten öffentlichen Vorfällen (Quellenpflicht!)
- MCP-Server, der die JSON-API spiegelt (Agenten können promptgarten als Wissensquelle mounten)
