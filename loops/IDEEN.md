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

## Gepitcht 17.07.2026 (Runde 3) — ENTSCHIEDEN 17.07 ~10:45
1. 📰 **Newsletter-Digest aktivieren** (aus Backlog R2, „späteres todo") — Double-Opt-in + wöchentlicher Feed-Digest per Worker-Cron; kostenloser Mail-Weg (MailChannels/Resend-Free) wird geprüft. Anmeldungen laufen schon auf. ← Empfehlung
2. 🔗 **Kapitel-Teilen-Buttons** — Copy-Link/X/LinkedIn/WhatsApp auf jeder Kapitel-/Befehlsseite + „Als Markdown kopieren" für KI-Agenten. Geringster Aufwand, Reichweiten-Hebel (Traffic wächst gerade organisch).
3. 🧑‍💻 **Prompt-Sandbox** — interaktiver Playground: Prompt-Vorlage wählen, Platzhalter ausfüllen, fertigen Prompt kopieren (ohne API-Kosten, rein clientseitig). Macht die Prompt-Bibliothek interaktiv.
4. 📊 **Modell-Timeline** — öffentliche Chronik der Modell-Releases/Deprecations (Fable 5, Opus 4.8, GPT-5.6, Gemini-CLI-Sunset …) aus dem Feed + Vergleiche-Daten, als vertikale Zeitleiste ×5 Sprachen.

## Entschieden
- 14.07.2026, Runde 1: Marvin wählt ALLE 4 → Umsetzungs-Reihenfolge nach Wert/Aufwand:
  ① 🔍 Volltext-Suche (größte Lücke) ② 💶 Modell-Preisrechner (Daten liegen frisch verifiziert vor) ③ 🧩 Prompt-Bibliothek (Content-Pipeline wie Kapitel-Batches) ④ 🗺️ Lern-Landkarte (design-schwerste).
  Newsletter-Digest + Tages-Challenge bleiben offen für Runde 2.
- 14.07. abends: ALLE 4 UMGESETZT ✅ (Suche It.99, Preisrechner It.100, Prompts It.101, Landkarte It.102).
- 15.07.2026, Runde 2: Marvin wählt 📡 RSS-Feed + 🎯 Tages-Challenge + 📱 PWA/Offline. 📰 Newsletter-Digest NICHT abgelehnt — „behalt den newsletter als späteres todo" → Backlog, erst auf Zuruf/späteren Pitch. Umsetzungs-Reihenfolge: ① RSS (kleinster Aufwand) ② Tages-Challenge ③ PWA.
- 17.07.2026, Runde 3: Marvin wählt ALLE 4 (📰 Newsletter-Digest, 🔗 Teilen-Buttons, 🧑‍💻 Prompt-Sandbox, 📊 Modell-Timeline) + NEUE DIREKTIVE dazu: „Modell-Vergleiche intensiver, 2D-Quadrant besser aufgeteilt — wirklich nach Intelligence-to-Cost-Ratio und Stärken der einzelnen Modelle; GLM, Grok, Gemini, Kimi und andere bekannte Modelle aufnehmen" → Vergleiche-v3-Rework (Research läuft, Quellenpflicht: offizielle Preise + Artificial-Analysis-Index). Reihenfolge: ① Vergleiche-v3 (Marvins Direktive, Research läuft) ② Teilen-Buttons (kleinster Aufwand) ③ Modell-Timeline (nutzt v3-Daten) ④ Prompt-Sandbox ⑤ Newsletter-Digest (Mail-Weg klären).

## Abgelehnt (nie wieder pitchen)
- (noch nichts)
