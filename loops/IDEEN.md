# Ideen-Backlog (Direktive 13 — Pitches an Marvin)

Regeln: Abgelehnte Ideen NIE erneut pitchen. Gewählte → Rotation/Umsetzung. Offene dürfen später erneut (max 1 Wiederholung, anders begründet).

## Gepitcht 14.07.2026 (Runde 1) — Status siehe unten
1. 🔍 **Volltext-Suche** — client-seitiger Suchindex (statisch gebaut, z.B. MiniSearch) über alle 71 Kapitel + 293 Befehle + Addons ×5 Sprachen. Die Seite hat aktuell KEINE Suche; bei 1962 Seiten größte Auffindbarkeits-Lücke. $0-Hosting-kompatibel.
2. 💶 **Modell-Preisrechner** — interaktiver Rechner auf /vergleiche: Slider für Input/Output-Tokens + Anfragen pro Tag → Monatskosten je Modell nebeneinander (Datenbasis: verifizierte Preistabelle aus vergleiche-Research, Stand-Marker). Perfekte Ergänzung zu Duellen/Quadrant.
3. 🗺️ **Lern-Landkarte** — SVG-Weltkarte aller Welten/Kapitel im 1d-Stil mit localStorage-Fortschritt (erledigte Kapitel färben sich, Pfade zwischen Welten) — Gamification-Sprung, teilen-tauglich.
4. 🧩 **Prompt-Bibliothek** — kuratierte, kopierbare Prompt-Vorlagen (Refactoring, Debugging, Review, Planung …) mit Wann-nutzen-Hinweis, ×5 Sprachen, Copy-Button; verlinkt aus Kapiteln.
5. (im Text erwähnt) 📰 Newsletter-Digest aktivieren (Double-Opt-in + wöchentlicher Feed-Digest via Worker-Cron) · 🎯 Tages-Challenge (5 Zufalls-Quizfragen, Streak-relevant).

## Gepitcht 15.07.2026 (Runde 2) — ENTSCHIEDEN 15.07 ~07:40
1. 📡 **RSS-Feed** — /feed.xml (+ je Sprache) aus feed.json beim Build generiert; Feedreader + Aggregatoren + LLM-Crawler können News abonnieren. Geringster Aufwand, SEO/Reichweite. ← Empfehlung
2. 📰 **Newsletter-Digest aktivieren** — vorhandene Newsletter-Anmeldung bekommt Double-Opt-in + wöchentlichen Feed-Digest (Worker-Cron; Mail-Weg MailChannels/Resend-Free prüfen). (Wiederholung aus Runde-1-Randnotiz, jetzt konkret)
3. 🎯 **Tages-Challenge** — 5 Zufalls-Quizfragen aus allen Kapiteln pro Tag, Streak-relevant, localStorage. (Wiederholung aus Runde-1-Randnotiz, jetzt konkret)
4. 📱 **PWA/Offline** — manifest.json + Service-Worker: installierbar, Kapitel offline lesbar, ideal für unterwegs.

## Entschieden
- 14.07.2026, Runde 1: Marvin wählt ALLE 4 → Umsetzungs-Reihenfolge nach Wert/Aufwand:
  ① 🔍 Volltext-Suche (größte Lücke) ② 💶 Modell-Preisrechner (Daten liegen frisch verifiziert vor) ③ 🧩 Prompt-Bibliothek (Content-Pipeline wie Kapitel-Batches) ④ 🗺️ Lern-Landkarte (design-schwerste).
  Newsletter-Digest + Tages-Challenge bleiben offen für Runde 2.
- 14.07. abends: ALLE 4 UMGESETZT ✅ (Suche It.99, Preisrechner It.100, Prompts It.101, Landkarte It.102).
- 15.07.2026, Runde 2: Marvin wählt 📡 RSS-Feed + 🎯 Tages-Challenge + 📱 PWA/Offline. 📰 Newsletter-Digest NICHT abgelehnt — „behalt den newsletter als späteres todo" → Backlog, erst auf Zuruf/späteren Pitch. Umsetzungs-Reihenfolge: ① RSS (kleinster Aufwand) ② Tages-Challenge ③ PWA.

## Abgelehnt (nie wieder pitchen)
- (noch nichts)
