# Landing-Page CRO + SEO Research — promptgarden.com
Stand: 13.07.2026 · Recherchiert für den Ausbau der Startseite (Ziele: Nutzer bleiben+lernen, Newsletter-Anmeldungen, später Spenden)

Alle zitierten URLs wurden per `curl -L -A 'Mozilla/5.0' --max-time 20` auf HTTP 200 geprüft (siehe Quellenliste). CXL blockt den nackten Standard-User-Agent per Cloudflare (403), lässt sich aber mit einem vollständigen Browser-UA + `Accept-Language`-Header sauber laden (200) — echte Browser sehen die Seiten normal, das ist reiner Bot-Schutz, kein toter Link.

---

## Top-10-Empfehlungen (priorisiert)

### 1. Above-the-fold = Value Proposition + genau EIN primärer CTA, kein "false bottom"
**Warum:** NN/g hat gemessen, dass Content 100px oberhalb des Folds 102% mehr Views bekommt als 100px darunter (57.453 Fixationen), und dass die durchschnittliche Differenz in der Nutzerbehandlung von Above- vs. Below-Fold-Content 84% beträgt. Google-Daten (2014-Viewability-Studie) zeigen 73% Viewability oberhalb vs. 44% unterhalb des Folds. Der Fold entscheidet nicht absolut, ob gescrollt wird — aber er setzt die Erwartung: "What is visible on the page without requiring any action is what encourages us to scroll." Ein "false bottom" (Layout, das wie das Seitenende aussieht) killt diesen Effekt.
**Quelle:** [NN/g — The Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/), [CXL — Mastering above the fold](https://cxl.com/blog/above-the-fold/)

### 2. Nur EINE gewünschte Haupt-Aktion pro Seite/Sektion — nicht 3 CTAs um Aufmerksamkeit konkurrieren lassen
**Warum:** CXLs Struktur-Analyse konvertierender Landingpages: "Focus on getting visitors to take one specific action. There should be only one possible action for the visitor to take (...) Don't offer options, or the conversions will suffer." Für promptgarden heißt das: Lexikon-Erkundung als Primär-CTA, Newsletter als klar sekundäres, visuell zurückhaltenderes Element — nicht beide gleich groß nebeneinander.
**Quelle:** [CXL — How to Build a High-Converting Landing Page](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/)

### 3. CTA-Text spezifisch statt generisch — "Get Started" vermeiden
**Warum:** NN/g: "Get Started" ist mehrdeutig, passt auf fast jedes Ziel und lenkt Nutzer von passenderem Content ab — Nutzer verstehen nicht, was als Nächstes passiert, was Vertrauen kostet, selbst wenn die Klickrate kurzfristig steigt. Die "4 Ss"-Regel für Link-/Button-Labels: **S**pecific, **S**incere (erwartungstreu), **S**ubstantial, **S**uccinct. Statt "Jetzt starten" besser z. B. "Lexikon durchstöbern" oder "Ersten Begriff lernen".
**Quelle:** [NN/g — "Get Started" Stops Users](https://www.nngroup.com/articles/get-started/), [NN/g — Better Link Labels: 4 Ss](https://www.nngroup.com/articles/better-link-labels/)

### 4. Homepage als "Elevator Pitch" — Name, Logo, Tagline, Alleinstellung sofort erkennbar
**Warum:** NN/g's 5 Grundprinzipien für Homepage-Design, Prinzip 2: "Treat your homepage as an elevator pitch to prospective customers, quickly and clearly conveying what your organization does." Konkret: Markenname/Logo oben links, prägnante Tagline, klare Differenzierung, passende Bildsprache. Diese Prinzipien gelten laut NN/g deshalb langfristig, weil sie auf stabilem Nutzerverhalten beruhen, nicht auf Trends.
**Quelle:** [NN/g — Homepage Design: 5 Fundamental Principles](https://www.nngroup.com/articles/homepage-design-principles/)

### 5. Content durch echte Beispiele zeigen statt nur behaupten ("Show, don't tell")
**Warum:** NN/g Prinzip 3 ("Reveal Content Through Examples"): reale Ausschnitte des Angebots zeigen statt nur Kategorie-Links — das hilft Besuchern zu verstehen, welchen Wert sie finden, und ermutigt zum Weiterklicken. GoodUI Pattern #33 ("Example Situations") testet dasselbe Prinzip empirisch (Use-Cases/Szenarien statt abstrakter Beschreibung). Für promptgarden: ein echter Lexikon-Eintrag oder eine echte Lernpfad-Karte direkt im Hero/direkt darunter statt nur Textversprechen.
**Quelle:** [NN/g — Homepage Design Principles](https://www.nngroup.com/articles/homepage-design-principles/), [GoodUI — Pattern #33: Example Situations](https://goodui.org/patterns/33/)

### 6. Below-the-fold ist okay, WENN die Value Proposition oben schon glasklar ist — sonst Erklärung vor den CTA
**Warum:** CXL unterscheidet 3 Besuchertypen: (1) bereits überzeugte Besucher scrollen sowieso zum CTA, (2) unsichere Besucher mit *einfacher* Value Proposition können sofort konvertieren (CTA above fold sinnvoll), (3) unsichere Besucher mit *komplexer* Value Proposition brauchen erst Erklärung, CTA kann sinnvoll später kommen. Ein A/B-Test von Michael Aagaard zeigte sogar eine CTA-Verschiebung ans Seitenende mit +304% Conversion (Einzelfall, nicht verallgemeinerbar — aber Beleg, dass "CTA muss immer above the fold" kein Gesetz ist).
**Quelle:** [CXL — Mastering above the fold](https://cxl.com/blog/above-the-fold/)

### 7. Formulare so kurz wie möglich — Newsletter-Signup auf 1 Feld reduzieren
**Warum:** CXL's Anatomie erfolgreicher Landingpages empfiehlt "Simple form, ideally with just 1–3 fields" — jedes zusätzliche Feld erzeugt Friktion und senkt die Abschlussrate. Für einen Newsletter reicht eine E-Mail-Adresse; Name/weitere Felder nur, wenn wirklich für Personalisierung nötig.
**Quelle:** [CXL — How to Build a High-Converting Landing Page](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/)

### 8. Core Web Vitals als technische Grundvoraussetzung: LCP < 2,5s, INP < 200ms, CLS < 0,1
**Warum:** Core Web Vitals sind Googles offizielle UX-Metriken (Ladeperformance, Interaktivität, visuelle Stabilität) und Teil der Ranking-Signale; "good"-Schwellenwerte gelten, wenn 75% der Seitenaufrufe sie erreichen. Für Conversion direkt relevant: eine Seite, die während des Ladens springt (CLS) oder auf Klicks verzögert reagiert (INP), verliert Vertrauen und Klicks — unabhängig vom Copy.
**Quelle:** [web.dev — Web Vitals](https://web.dev/articles/vitals)

### 9. Title-Tag und Meta-Description pro Seite einzigartig, deskriptiv, ohne Keyword-Stuffing/Boilerplate
**Warum:** Google Search Central: vage Titel wie "Home" vermeiden, jede Seite braucht eigenen, beschreibenden `<title>`; Meta-Description soll ein "pitch that convince the user that the page is exactly what they're looking for" sein, keine Keyword-Listen, pro Seite individuell (nicht sitewide identisch). Für promptgarden: jeder Lexikon-Eintrag/Lernpfad braucht eigenen Title+Description statt generischem Template.
**Quelle:** [Google Search Central — Influencing Title Links](https://developers.google.com/search/docs/appearance/title-link), [Google Search Central — How to Write Meta Descriptions](https://developers.google.com/search/docs/appearance/snippet)

### 10. Course-Schema für Lernpfade einsetzen (aktiv), FAQPage-Schema NICHT mehr für Rich Results nutzen (per Mai 2026 deprecated) — stattdessen E-E-A-T durch sichtbare Quellen/Autorenschaft
**Warum:** Google unterstützt Course-/Course-List-Structured-Data weiterhin aktiv (Mindestanforderung: ≥3 Kurse mit `name`+`provider`, keine Preis-/Promo-Sprache im Namen) — relevant für promptgardens Lernpfade. FAQPage dagegen: Google hat am 7. Mai 2026 im Search-Central-Changelog den Support offiziell beendet ("Removing documentation for the FAQ rich result feature") — neue FAQPage-Markierung bringt für Google Search keinen Rich-Result-Nutzen mehr. Für Helpful-Content/E-E-A-T gilt stattdessen: Google bewertet "Who, How, and Why" — wer hat den Content erstellt, wie wurde er produziert, warum ist er vertrauenswürdig. Deckt sich mit promptgardens eigener Quellenpflicht-Regel (jeder Eintrag zeigt Quellen).
**Quelle:** [Google Search Central — Course Structured Data](https://developers.google.com/search/docs/appearance/structured-data/course), [Google Search Central — FAQPage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage), [Google Search Central — Creating Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

---

## Above-the-fold-Blueprint für promptgarden

Angewendet auf Design 1d "Spielwiese" (Creme #fdf6ec, Akzent #e8613c, Bricolage Grotesque, Nav: Lexikon/Lernpfade/Feed/Vergleiche, XP/Streak-Gamification, kein Account nötig zum Lesen):

1. **Headline (benefit-orientiert, spezifisch, kein Marketing-Sprech):**
   z. B. „Programmieren lernen mit KI — kostenlos, in 5 Sprachen, ohne Account." Nicht „Willkommen bei promptgarden" (zu vage, siehe Google-Regel gegen Titel wie „Home").

2. **Subheadline (1 Satz Value Prop, wer/was):**
   Wer ist es für (Anfänger bis erfahrene Devs bis Agenten-Nutzer) + was gibt's (Lexikon, Lernpfade, Befehls-Referenz) in einem knappen Satz.

3. **Primärer CTA — genau EINER, spezifisch formuliert:**
   z. B. „Lexikon durchstöbern" oder „Ersten Lernpfad starten" statt „Jetzt starten"/„Get Started" (Empfehlung 3). Visuell dominant, Akzentfarbe #e8613c.

4. **Sekundärer CTA (Newsletter) — bewusst kleiner/zurückhaltender, nicht konkurrierend:**
   Ein Eingabefeld (E-Mail), kein Name-Feld (Empfehlung 7). Kann als dezente Zeile unten im Hero oder als eigene Sektion knapp darunter stehen — nicht gleichrangig neben dem Haupt-CTA.

5. **"Show, don't tell" — ein echtes Beispiel im/direkt unter dem Hero:**
   Eine echte Lexikon-Karte oder Lernpfad-Vorschau (mit Schwierigkeitslevel ●○○/●●○/●●●, echtem Titel) statt nur Textversprechen (Empfehlung 5). Das ist mit dem bestehenden Karten-Design (Schatten, Rotation, Farben lime/pink/blau/gelb) einfach umsetzbar und zeigt gleichzeitig das Gamification-Element.

6. **Glaubwürdigkeits-/Fortschritts-Signal statt erfundener Nutzerzahlen:**
   Da noch keine große Nutzerbasis existiert, keine Fake-Testimonials/-Zahlen. Stattdessen ehrliche, wachsende Katalog-Größe zeigen (z. B. „X Lexikon-Einträge · Y Lernpfade · 5 Sprachen" — echte, live aktualisierte Zahlen aus dem Datenbestand) als Social-Proof-Ersatz.

7. **Kein "false bottom" am Fold-Übergang:**
   Nächste Sektion (z. B. How-it-works oder weitere Karten) leicht am unteren Bildschirmrand angeschnitten sichtbar lassen, damit klar ist: da geht noch was (Empfehlung 1/6).

8. **Nur EIN primärer CTA-Typ pro Sichtfeld:**
   Nicht Lexikon-CTA + Lernpfad-CTA + Newsletter-CTA gleich groß nebeneinander (Empfehlung 2) — Hierarchie klar: 1 Primär, 1 kleiner Sekundär.

---

## How-it-works-Muster

- **3-Schritte-Format ist der Branchen-Standard** bei SaaS-/Lernplattform-Landingpages, meist in der Mitte der Seite platziert — nach der initialen Value Proposition, vor Social Proof/weiteren CTAs. Wird bewusst knapp gehalten, um scanbar zu bleiben.
  Quelle: [CXL — How to Build a High-Converting Landing Page](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/) (Struktur-Prinzip „proven structure", 5-Schritte-Prozess-Empfehlung)

- **Für promptgarden konkret (3 Schritte, passend zur bestehenden IA Lexikon/Lernpfade/Feed/Addons):**
  1. *Begriff oder Thema finden* — Lexikon durchsuchen oder Lernpfad wählen
  2. *Schritt für Schritt lernen* — strukturierter Lernpfad mit Schwierigkeitsgrad, XP, optionalem Streak
  3. *Anwenden* — Befehls-Referenz/Addons/Feed für aktuelle Praxis, eigene Prompts bauen

- **"Show, don't tell" gilt auch hier:** Jeder der 3 Schritte sollte einen echten UI-Ausschnitt (Screenshot/Live-Karte) zeigen statt nur Icon+Text — NN/g's Prinzip „Reveal Content Through Examples" und GoodUI Pattern #33 gelten für How-it-works-Sektionen genauso wie für den Hero.
  Quelle: [NN/g — Homepage Design Principles](https://www.nngroup.com/articles/homepage-design-principles/), [GoodUI — Pattern #33](https://goodui.org/patterns/33/)

- **Zielgruppen-Klarheit direkt kommunizieren:** MDN adressiert im Hero explizit zwei Nutzertypen zugleich (Lernende via "Learn"-Kurs-Pfad UND Referenz-Suchende via Reference/Guides) und macht das über klare Navigations-Kategorien sichtbar, nicht über Fließtext-Erklärung. Für promptgarden könnte eine kurze Badge-Reihe unter dem Hero („Für Anfänger · Vibe-Coder · erfahrene Devs · Agenten-Nutzer") denselben Zweck erfüllen — das ist eine aus dem MDN-Muster abgeleitete Empfehlung, keine direkt zitierte Studie.
  Quelle: [MDN Web Docs — Startseite](https://developer.mozilla.org/en-US/) (Struktur-Beobachtung)

---

## SEO-Maßnahmen (konkret)

**Meta-Grundlagen (jede Seite, nicht nur Startseite):**
- Eigener, deskriptiver `<title>` pro Seite (Lexikon-Eintrag, Lernpfad, Befehl) — keine Boilerplate, kein „Home"/generische Titel; Markenname optional als Suffix nach Trenner. [Google — Title Links](https://developers.google.com/search/docs/appearance/title-link)
- Eigene Meta-Description pro Seite, kein Keyword-Stuffing, liest sich wie ein Klick-Pitch. [Google — Meta Descriptions](https://developers.google.com/search/docs/appearance/snippet)

**Structured Data — konkret für promptgarden:**
- **Course / Course List Schema** für Lernpfade einsetzen (aktiv unterstützt, nicht das 2025 retirete „course-info"-Rich-Result): `name`, `description`, `provider` (Organization „promptgarden") pro Lernpfad; für die Course-List-Variante mindestens 3 Kurse auf einer Übersichtsseite bündeln. [Google — Course Structured Data](https://developers.google.com/search/docs/appearance/structured-data/course)
- **FAQPage-Schema NICHT neu implementieren** — Google hat den Rich-Result-Support am 7. Mai 2026 beendet, Search-Console-Report und Rich-Results-Test-Unterstützung folgen 2026 komplett weg. FAQ-Inhalte selbst (z. B. im Lexikon) weiter sinnvoll für Nutzer, aber nicht als SEO-Hebel einplanen. [Google — FAQPage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- **WebSite-Schema mit SearchAction/Sitelinks-Searchbox NICHT priorisieren** — Google hat dieses visuelle SERP-Feature zum 21.11.2024 abgeschaltet; Markup schadet nicht, bringt aber auch keinen Rich-Result-Nutzen mehr. Aufwand lieber in Course-Schema/interne Verlinkung stecken. [Google — Farewell, Sitelinks Search Box](https://developers.google.com/search/blog/2024/10/sitelinks-search-box)

**E-E-A-T / Helpful Content:**
- Google bewertet Content über das Framework „Who, How, and Why" — wer hat's erstellt, wie wurde es produziert, warum vertrauenswürdig. Sichtbare Quellenangaben pro Eintrag (bereits promptgarden-Regel) sind direkt E-E-A-T-relevant, ebenso eine erkennbare „Wie entsteht der Content"-Transparenz (z. B. kurzer Hinweis, dass Einträge quellenbasiert/KI-unterstützt kuratiert und geprüft werden). [Google — Creating Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**Interne Verlinkung von der Startseite:**
- Die Startseite sollte strategisch auf die wichtigsten Content-Hubs verlinken (Top-Lexikon-Einträge, Haupt-Lernpfade) — starke interne Verlinkung von hochautoritativen Seiten (Homepage) signalisiert Google die Wichtigkeit dieser Zielseiten. Praktisch: „Show, don't tell"-Beispielkarten im Hero/How-it-works sollten echte, klickbare Links zu echten Detailseiten sein (kein Lorem-Ipsum-Mockup) — das kombiniert CRO- und SEO-Nutzen in einem Element.
- Technische Basis: Crawlbarkeit sicherstellen (echte `<a href>`-Links, kein reines JS-Onclick ohne Fallback), Mobile-Friendliness, keine Blockierung durch robots.txt/noindex auf öffentlichen Seiten. [Google — Search Essentials](https://developers.google.com/search/docs/essentials)

**Core Web Vitals (technische Voraussetzung, wirkt auf CRO UND SEO):**
- LCP < 2,5s, INP < 200ms, CLS < 0,1 als Zielwerte (75%-Perzentil-Regel). Besonders CLS relevant für die kartenbasierte, leicht rotierte "Spielwiese"-Optik — Karten dürfen beim Laden nicht nachträglich springen. [web.dev — Web Vitals](https://web.dev/articles/vitals)

---

## Quellenliste (alle per curl 200-verifiziert, 13.07.2026)

| # | Quelle | URL | Status |
|---|--------|-----|--------|
| 1 | NN/g — The Fold Manifesto | https://www.nngroup.com/articles/page-fold-manifesto/ | 200 |
| 2 | NN/g — Scrolling and Attention | https://www.nngroup.com/articles/scrolling-and-attention/ | 200 |
| 3 | NN/g — Homepage Design: 5 Fundamental Principles | https://www.nngroup.com/articles/homepage-design-principles/ | 200 |
| 4 | NN/g — "Get Started" Stops Users | https://www.nngroup.com/articles/get-started/ | 200 |
| 5 | NN/g — Better Link Labels: 4 Ss | https://www.nngroup.com/articles/better-link-labels/ | 200 |
| 6 | CXL — Mastering above the fold | https://cxl.com/blog/above-the-fold/ | 200 (Browser-UA nötig, Cloudflare blockt Default-UA) |
| 7 | CXL — How to Build a High-Converting Landing Page | https://cxl.com/blog/how-to-build-a-high-converting-landing-page/ | 200 (Browser-UA nötig) |
| 8 | GoodUI — Alle Patterns (Liste) | https://goodui.org/patterns/list/ | 200 |
| 9 | GoodUI — Pattern #33: Example Situations | https://goodui.org/patterns/33/ | 200 |
| 10 | Google Search Central — Course Structured Data | https://developers.google.com/search/docs/appearance/structured-data/course | 200 |
| 11 | Google Search Central — FAQPage Structured Data | https://developers.google.com/search/docs/appearance/structured-data/faqpage | 200 |
| 12 | Google Search Central — Creating Helpful, Reliable, People-First Content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | 200 |
| 13 | Google Search Central — Influencing Title Links | https://developers.google.com/search/docs/appearance/title-link | 200 |
| 14 | Google Search Central — How to Write Meta Descriptions | https://developers.google.com/search/docs/appearance/snippet | 200 |
| 15 | Google Search Central — Search Essentials | https://developers.google.com/search/docs/essentials | 200 |
| 16 | Google Search Central Blog — Farewell, Sitelinks Search Box | https://developers.google.com/search/blog/2024/10/sitelinks-search-box | 200 |
| 17 | web.dev — Web Vitals | https://web.dev/articles/vitals | 200 |
| 18 | MDN Web Docs — Startseite (Struktur-Beispiel) | https://developer.mozilla.org/en-US/ | 200 |
| 19 | freeCodeCamp — Startseite (Struktur-Beispiel, nur als Referenz genannt) | https://www.freecodecamp.org/ | 200 |
| 20 | Khan Academy — Startseite (Struktur-Beispiel, nur als Referenz genannt) | https://www.khanacademy.org/ | 200 |

**Hinweis zu #19/#20:** Beide URLs sind 200-verifiziert, liefern aber automatisiertem Abruf (curl/Fetch-Tool) eine JS-Bot-Challenge bzw. reines SPA-Shell statt Server-seitigem Content — echte Browser sehen die volle Seite normal. Sie werden im Report daher nur als bekannte Beispiel-Erwähnung genannt (freeCodeCamp: „Learn to Code — For Free" laut OG-Meta-Tag verifiziert; Khan Academy: keine spezifischen Zahlen/Zitate daraus übernommen), nicht mit extrahierten Detail-Zitaten belegt.
