const de = [
{slug:"api", bodyDetail:
`## Drei Arten von APIs
Im Web unterscheidet man grob drei Arten: Browser-APIs sind fest im Browser eingebaut (z. B. die Web Audio API für Audioverarbeitung) und machen Fähigkeiten des Browsers für JavaScript nutzbar. Web-APIs bzw. HTTP-APIs laufen über das Internet und folgen meist REST-Prinzipien: feste HTTP-Methoden wie GET (lesen), POST (erstellen) oder DELETE (löschen), dazu Statuscodes wie 200 (erfolgreich) oder 404 (nicht gefunden). Drittanbieter-APIs schließlich bindest du extra ein, etwa die Google-Maps-API für Kartenanzeigen.

## Die Steckdosen-Analogie
Man kann sich eine API auch wie eine Steckdose vorstellen: Du steckst ein Gerät ein und es funktioniert, ohne dass du wissen musst, wie der Strom erzeugt wird oder verkabelt ist. Genauso ruft dein Code eine Funktion über die API auf, ohne die interne Umsetzung dahinter zu kennen – die Komplexität bleibt hinter der Schnittstelle verborgen.

## Konkret bei der Anthropic-API
Die Claude-API ist eine REST-API unter api.anthropic.com. Ein zentraler Endpunkt ist POST /v1/messages, über den du eine Nachricht an Claude schickst und eine Antwort zurückbekommst. Authentifiziert wird über einen API-Key, der bei jeder Anfrage im Header mitgeschickt wird. Zusätzliche Endpunkte wie eine Token-Counting-API helfen, Kosten und Rate-Limits (die maximale Anzahl Anfragen in einem Zeitraum) im Blick zu behalten, bevor eine größere Anfrage überhaupt losgeschickt wird.

## Warum das für Agenten wichtig ist
Ein KI-Agent, der mit externen Diensten arbeitet, nutzt praktisch immer APIs als Werkzeuge: eine Wetter-API, eine Datenbank-API, eine Kalender-API. Jede dieser APIs definiert genau, welche Anfragen möglich sind und welche Antwort zurückkommt – das ist die Grundlage, auf der auch Tool Use und MCP aufbauen.`},

{slug:"erst-plan-dann-code", bodyDetail:
`## Der Plan Mode in Claude Code
Claude Code setzt dieses Pattern konkret als eigenen "Plan Mode" um. Im Plan Mode liest Claude Dateien und beantwortet Fragen, verändert aber nichts – erst danach folgt die eigentliche Planerstellung. Der empfohlene Ablauf hat vier Phasen: Erkunden (Dateien lesen, Fragen stellen), Planen (detaillierten Plan erstellen lassen), Umsetzen (Plan Mode verlassen und coden lassen, gegen den Plan geprüft) und Committen (Änderungen mit Beschreibung sichern).

## Den Plan direkt bearbeiten
Ein praktisches Detail: Der erstellte Plan lässt sich in Claude Code per Tastenkürzel direkt im eigenen Texteditor öffnen und bearbeiten, bevor die Umsetzung beginnt. So kannst du einzelne Schritte streichen, umformulieren oder Reihenfolgen ändern, ohne den Plan komplett neu anfordern zu müssen.

## Wann sich der Aufwand nicht lohnt
Planung ist kein Selbstzweck und kostet selbst Zeit. Eine simple Faustregel: Lässt sich die gewünschte Änderung in einem Satz beschreiben (ein Tippfehler, eine Log-Zeile, eine Variable umbenennen), lohnt sich der Umweg über einen expliziten Plan meist nicht. Planung zahlt sich vor allem aus, wenn die Vorgehensweise unklar ist, mehrere Dateien betroffen sind oder du den Code noch nicht gut kennst.

## Ein Missverständnis
Planung bedeutet nicht, dass die KI zwangsläufig alles richtig vorhersieht. Der Wert liegt darin, dass Fehlannahmen jetzt auffallen, während sie noch billig zu korrigieren sind – nicht darin, dass der erste Plan schon perfekt ist. Ein Plan, den du korrigierst, hat seinen Zweck bereits erfüllt.`},

{slug:"hermes", bodyDetail:
`## Der Agent Loop im Detail
Herzstück von Hermes ist die Klasse AIAgent, die Prompt-Aufbau, Modell-Auswahl, Tool-Ausführung, Fehlerbehandlung und Speicherung in einer durchgehenden Schleife koordiniert. Darum herum liegt ein Werkzeug-Register mit über 70 einzelnen Tools, gruppiert in rund 28 sogenannten Toolsets – von Terminal- über Browser- bis zu Datei- und MCP-Werkzeugen. Läuft der Kontext eines Gesprächs voll, greift ein eigenes Kompressionsmodul, das ältere Gesprächsteile verlustbehaftet zusammenfasst, statt sie einfach abzuschneiden.

## Sieben Sicherheitsebenen
Hermes setzt bewusst auf mehrere übereinanderliegende Schutzschichten statt auf eine einzelne Barriere: Nutzer-Autorisierung, Freigabe gefährlicher Befehle, Container-Isolation, gefilterte Zugangsdaten für MCP-Prozesse, Prüfung von Kontext-Dateien auf Prompt Injection, getrennte Sessions und bereinigte Eingaben. Besonders bemerkenswert: Eine feste "Hardline-Blockliste" für katastrophale Befehle (etwa das Löschen des kompletten Dateisystems) greift immer – selbst wenn du den YOLO-Modus aktivierst, der sonst alle Freigabe-Nachfragen überspringt.

## Das DM-Pairing-Verfahren
Schreibt dir eine unbekannte Person über Telegram, Discord oder eine andere angebundene Plattform, bekommt sie zunächst nur einen achtstelligen Pairing-Code – erst wenn du diesen Code per CLI-Befehl bestätigst, kann die Person wirklich mit deinem Agenten sprechen. Codes laufen nach einer Stunde automatisch ab, was Missbrauchsversuche zeitlich begrenzt.

## Persistenz über Sessions hinweg
Anders als ein einfacher Chat merkt sich Hermes Konversationen dauerhaft in einer durchsuchbaren SQLite-Datenbank. Auch geplante, wiederkehrende Aufgaben (Cron-Jobs) laufen als vollwertige Agenten-Aufgaben mit eigenem, frischem Kontext – nicht als simple Shell-Skripte im Hintergrund.`},

{slug:"openclaw", bodyDetail:
`## Das Vertrauensmodell: ein Bediener pro Gateway
OpenClaws Sicherheitsmodell geht explizit von genau einer vertrauten Bedienperson pro Gateway aus – es ist ausdrücklich keine Absicherung für mehrere einander misstrauende Nutzer an einem gemeinsamen Agenten. Sollen mehrere Personen oder Teams denselben Assistenten nutzen, empfiehlt die Dokumentation, für jede Vertrauensgrenze ein eigenes, isoliertes Gateway zu betreiben statt eines gemeinsam genutzten.

## Drei Prioritäten in fester Reihenfolge
OpenClaws eigene Sicherheitsphilosophie folgt einer klaren Reihenfolge: zuerst Identität klären (wer darf überhaupt mit dem Bot sprechen), dann den Handlungsspielraum einschränken (wo darf der Bot etwas tun – Gruppen, Werkzeuge, Sandboxing), erst danach auf das Modell selbst vertrauen. Die Grundannahme ist, dass das Modell manipulierbar ist und deshalb der Schaden im Zweifel begrenzt bleiben muss, egal was im Prompt passiert.

## Direktnachrichten und Sandboxing konkret
Für Direktnachrichten gibt es vier einstellbare Stufen: "pairing" (Standard – unbekannte Absender bekommen einen Code), "allowlist" (nur bekannte IDs), "open" (öffentlich) und "disabled". Für die Werkzeugausführung nutzt OpenClaw standardmäßig Docker-Container als Sandbox, mit einstellbarem Zugriff auf den Arbeitsbereich (kein Zugriff, nur lesend oder lesend-schreibend). Ein eingebauter Befehl (openclaw security audit) prüft die eigene Konfiguration automatisch auf riskante Einstellungen wie offene Gruppen-Policies oder fehlende Authentifizierung und kann einfache Probleme direkt beheben.

## Ein Missverständnis
Ein aktiviertes Sandboxing schützt nicht automatisch vor Prompt Injection selbst – es begrenzt nur, wie viel Schaden eine erfolgreich manipulierte Antwort anrichten kann. Die Dokumentation betont deshalb ausdrücklich, dass Systemprompt-Regeln allein keine harte Absicherung sind; die eigentliche Durchsetzung passiert über Werkzeug-Rechte, Freigabe-Schritte und Sandboxing.`},

{slug:"modell-lifecycle", bodyDetail:
`## Die vier offiziellen Lifecycle-Stufen
Anthropic unterscheidet vier feste Zustände für jedes Modell: Active (voll unterstützt, empfohlen), Legacy (bekommt keine Updates mehr, könnte bald abgekündigt werden), Deprecated (funktioniert noch, aber mit festem Enddatum und empfohlenem Ersatzmodell) und Retired (Anfragen schlagen fehl). Für öffentlich verfügbare Modelle gibt es mindestens 60 Tage Vorlauf, bevor ein Modell tatsächlich abgeschaltet wird – genug Zeit, um umzustellen, aber kein unbegrenzter Puffer.

## Wie Fable 5 abgesichert war
Bei Fable 5 setzte Anthropic auf mehrere übereinanderliegende Schutzmechanismen gleichzeitig ("Defense in Depth"): Klassifizierer erkennen während des Gesprächs potenziell gefährliche Anfragen und blockieren sie. Damit auch knapp daneben liegende, eigentlich harmlose Anfragen sicher erfasst werden, wurde bewusst ein großer "Sicherheitsabstand" eingebaut – mit der Folge, dass auch mehr eigentlich harmlose Anfragen blockiert wurden als sonst üblich.

## Ein gemeinsamer Bewertungsrahmen für Jailbreaks
Als Reaktion auf den Vorfall entwickelte Anthropic gemeinsam mit Amazon, Microsoft und Google einen Vorschlag, um die Schwere eines Jailbreaks (eine Methode, Sicherheitsmechanismen zu umgehen) einheitlich zu bewerten: anhand des Fähigkeitsgewinns für Angreifer, der Bandbreite an möglichen Missbrauchsfällen, wie leicht sich der Trick zu einem echten Angriff ausbauen lässt, und wie leicht er überhaupt zu finden ist.

## Praktische Konsequenz
Wer eine Anwendung auf einem bestimmten Modell aufbaut, kann sich also weder auf dauerhafte Verfügbarkeit noch auf konstantes Antwortverhalten verlassen – Sicherheitsklassifizierer werden laufend nachjustiert, was gelegentlich auch bislang unproblematische Anfragen neu betrifft. Eine zentrale, austauschbare Modell-Anbindung mit Fallback ist deshalb keine Vorsichtsmaßnahme für Ausnahmefälle, sondern Grundvoraussetzung.`},

{slug:"vibe-coding-sicherheit", bodyDetail:
`## Wie groß das Problem wirklich ist
Eine Untersuchung, vorgestellt auf dem USENIX Security Symposium 2025, ließ 16 verbreitete Code-Modelle rund 2,23 Millionen Code-Beispiele in Python und JavaScript erzeugen. Ergebnis: 19,7 % der Beispiele enthielten mindestens einen halluzinierten, nicht existierenden Paketnamen – insgesamt über 205.000 unterschiedliche erfundene Namen. Open-Source-Modelle halluzinierten dabei im Schnitt deutlich häufiger (21,7 %) als kommerzielle Modelle (5,2 %), aber auch die besten getesteten Modelle blieben nicht bei null.

## Warum das für Angreifer so attraktiv ist
Besonders gefährlich macht das Ganze eine Wiederholbarkeit: Ließen die Forschenden denselben Prompt zehnmal laufen, tauchte fast die Hälfte der halluzinierten Namen bei jedem einzelnen Durchlauf wieder auf. Ein Angreifer kann also gezielt herausfinden, welche Fantasienamen ein bestimmtes Modell zuverlässig vorschlägt, diese vorab auf npm oder PyPI registrieren und darauf warten, dass Entwickler oder Agenten sie installieren. Der Begriff "Slopsquatting" stammt von Seth Larson, Entwickler bei der Python Software Foundation, in Anlehnung an klassisches Typosquatting.

## Warum Agenten das Risiko verschärfen
Ein menschlicher Entwickler, der Code kopiert, hat zumindest theoretisch die Chance, einen verdächtigen Paketnamen zu bemerken. Ein autonomer Coding-Agent, der Pakete selbst installiert, überspringt diesen Kontrollpunkt oft komplett – er generiert Code, erkennt die eigenen Abhängigkeiten und ruft direkt den Paketmanager auf, ganz ohne menschlichen Blick auf den Namen.

## Was konkret hilft
Neben der im Haupttext genannten Checkliste hilft es, jeden vorgeschlagenen Paketnamen gegen das Registrierungsdatum zu prüfen – ein erst vor wenigen Tagen registriertes Paket mit unbekanntem Herausgeber ist ein Warnsignal, unabhängig davon, wie plausibel der Name klingt.`},

{slug:"claude-code-installieren", bodyDetail:
`## Mehr Installationswege als nur der Skript-Befehl
Neben dem nativen Installer gibt es auch Homebrew (macOS) und WinGet (Windows) als Paketmanager-Alternativen. Bei Homebrew gibt es sogar zwei Kanäle: das reguläre Cask "claude-code" folgt dem stabilen Release, meist rund eine Woche verzögert, während "claude-code@latest" neue Versionen sofort nach Veröffentlichung bekommt. Wichtiger Unterschied: Nur der native Installer aktualisiert sich automatisch im Hintergrund – bei Homebrew und WinGet musst du selbst regelmäßig ein Upgrade-Kommando ausführen, sonst bleibst du auf einer älteren Version stehen.

## Systemvoraussetzungen konkret
Claude Code läuft ab macOS 13, Windows 10 (Build 1809) bzw. Windows Server 2019, Ubuntu 20.04, Debian 10 und Alpine Linux 3.19 – jeweils mit mindestens 4 GB RAM auf x64- oder ARM64-Prozessoren. Die Installation prüft zudem die Integrität des heruntergeladenen Programms über eine kryptografisch signierte Prüfsumme, bevor irgendetwas ausgeführt wird.

## Verschiedene Account-Typen
Neben einem regulären Claude-Abo oder einem Claude-Console-Account (Bezahlung nach Verbrauch über vorausbezahltes Guthaben) lässt sich Claude Code auch über Unternehmens-Cloud-Anbieter wie Amazon Bedrock, Google Cloud oder Microsoft Foundry anbinden. Größere Organisationen können zusätzlich ein selbst gehostetes Gateway mit Firmen-Single-Sign-on einrichten – der Login-Befehl öffnet dann automatisch den richtigen Anmeldebildschirm.

## Ein Missverständnis
Dass Claude Code unter Windows WSL brauche, stimmt nicht: Es läuft nativ unter Windows, ganz ohne Administratorrechte. WSL 2 wird ausschließlich für das optionale Sandboxing-Feature benötigt, nicht für den normalen Betrieb.`},

{slug:"modell-und-plan-wahl", bodyDetail:
`## Wie Abrechnung technisch funktioniert
Bei einem API-Zugang über einen Console-Account zahlst du meist über vorausbezahltes Guthaben ("Prepaid Credits"), das mit jeder Anfrage anhand der verbrauchten Token schrumpft. Ein Abo funktioniert umgekehrt: fester monatlicher Preis, dafür ein Nutzungslimit statt Pay-per-Use. Beide Modelle kennen zusätzlich Rate-Limits – eine Obergrenze, wie viele Anfragen oder Token du in einem bestimmten Zeitraum stellen darfst, unabhängig vom eigentlichen Guthaben. Wer viele parallele Anfragen plant (etwa ein eigener Agent mit mehreren Subagenten), sollte diese Grenze vorab prüfen, nicht erst wenn eine Anwendung schon läuft.

## Kleines vs. großes Modell in der Praxis
Kleine Modelle unterscheiden sich von großen nicht nur im Preis, sondern auch in der Antwortgeschwindigkeit und darin, wie zuverlässig sie bei mehrstufigen, agentischen Aufgaben bleiben. Ein häufiges, sinnvolles Muster: einfache oder sehr häufige Anfragen automatisch an ein kleines, schnelles Modell weiterleiten (Routing), komplexe oder seltene Fälle an ein großes. Das spart in Summe mehr als eine pauschale Entscheidung für nur ein Modell.

## Warum harte Zahlen hier bewusst fehlen
Modellnamen, Preise pro Token und Freikontingente ändern sich im Abstand von Monaten, teils sogar Wochen – siehe Modell-Lifecycle. Eine feste Zahl, die heute stimmt, ist in einem halben Jahr möglicherweise falsch. Deshalb lohnt es sich, in eigenen Notizen oder im Code auf die offizielle Preisseite zu verlinken statt eine Zahl hart zu hinterlegen, die niemand mehr aktualisiert.`},

{slug:"git-github-basics", bodyDetail:
`## Was hinter einem Commit technisch steckt
Jeder Commit bekommt eine eindeutige Prüfsumme (einen Hash), die sich aus seinem Inhalt und seinem Vorgänger-Commit ergibt. Ändert sich auch nur ein Byte, ändert sich der komplette Hash – das macht die Historie fälschungssicher nachvollziehbar. Bevor ein Commit entsteht, landen Änderungen zunächst in der sogenannten Staging Area (mit `+"`git add`"+`): einer Zwischenablage, mit der du genau auswählst, welche Änderungen in den nächsten Commit sollen, statt zwangsläufig alles auf einmal zu committen.

## Verteilung statt Zentrale
Git ist ein verteiltes System: Jeder lokale Klon eines Repositories enthält die komplette Historie, nicht nur einen Ausschnitt. Das bedeutet, du kannst lokal committen, Branches wechseln und die Historie durchsuchen, ganz ohne Internetverbindung – erst `+"`push`"+` und `+"`pull`"+` synchronisieren mit einem entfernten Server wie GitHub. Ein Branch selbst ist dabei technisch nur ein leichtgewichtiger Zeiger auf einen bestimmten Commit, kein eigener Datei-Ordner – das macht das Anlegen neuer Branches praktisch kostenlos.

## Merge vs. Rebase
Zwei Branches lassen sich auf zwei Arten zusammenführen: Ein Merge erstellt einen neuen Commit, der beide Historien verbindet und sichtbar lässt, wann welcher Branch existierte. Ein Rebase setzt die Commits eines Branches stattdessen auf einen neuen Ausgangspunkt um und erzeugt so eine lineare, aber umgeschriebene Historie. Für die tägliche Arbeit mit einem Coding-Agenten reicht in der Regel ein einfacher Merge – Rebase lohnt sich eher für aufgeräumte, veröffentlichte Historien.`},

{slug:"agent-festgefahren", bodyDetail:
`## Warum "Ground Truth" der Schlüssel ist
Ein Agent sollte bei jedem Schritt eine echte Rückmeldung aus seiner Umgebung bekommen – ein Testergebnis, eine Fehlermeldung, ein Build-Status – statt sich nur auf die eigene Einschätzung zu verlassen. Ohne diese "Ground Truth" verlässt sich ein Agent auf seine eigene, oft zu optimistische Selbsteinschätzung ("sollte jetzt funktionieren"). Gib einem festgefahrenen Agenten deshalb möglichst eine überprüfbare Aufgabe: einen Test, den er laufen lassen kann, einen Build, ein Diff zum Vergleichen – das ersetzt Vertrauen durch einen echten Check.

## Feste Abbruchbedingungen einbauen
Ein Agent, der endlos weiterarbeitet, obwohl er sich verrannt hat, kann in Schleifen aus wiederholten, gleich falschen Versuchen landen. Eine feste Obergrenze an Versuchen oder Schritten (eine sogenannte Stopping Condition) zwingt zu einem Punkt, an dem entweder ein Mensch eingreift oder der Agent explizit meldet, dass er nicht weiterkommt – statt stillschweigend weiter Zeit und Tokens zu verbrauchen.

## Warum die Schnittstelle selbst oft die Ursache ist
Häufig liegt das Problem nicht am Modell, sondern an unklaren Werkzeugen. Ein bekanntes Beispiel: Ein Coding-Agent machte wiederholt Fehler bei relativen Dateipfaden, sobald er das Wurzelverzeichnis verlassen hatte. Die Lösung war nicht ein besserer Prompt, sondern ein geändertes Werkzeug, das nur noch absolute Pfade akzeptierte – danach nutzte derselbe Agent das Tool fehlerfrei. Bevor du an der Anweisung feilst, lohnt sich also auch ein Blick auf das Werkzeug selbst.`},

{slug:"projekt-deployen", bodyDetail:
`## Mehr als nur HTML ausliefern
Moderne Static-Hosting-Anbieter wie Cloudflare Pages können auch dynamische Anteile abdecken, ohne dass du einen eigenen Dauerbetrieb-Server brauchst: sogenannte Functions laufen nur bei Bedarf (etwa bei einer Formular-Einreichung oder einem API-Aufruf) und werden danach wieder beendet. Für den Einstieg reicht trotzdem meist die rein statische Variante – Functions kommen erst dazu, wenn wirklich serverseitige Logik nötig ist, zum Beispiel für einen Kontaktformular-Versand.

## Der eingebaute Rücksetzknopf
Die meisten dieser Hosting-Anbieter bieten eine Rollback-Funktion: Ein fehlerhaftes Deployment lässt sich mit einem Klick auf den letzten funktionierenden Stand zurücksetzen, ohne neuen Code zu schreiben oder erneut zu deployen. Das ist besonders praktisch, wenn ein von einem Agenten ausgelöstes Deployment unerwartet etwas kaputt macht – der alte, funktionierende Stand ist sofort wieder online.

## Drei Wege, Code auf den Server zu bringen
Neben der Git-Anbindung (jeder Push löst ein Deployment aus) gibt es meist auch einen direkten Upload fertiger Dateien ohne Git-Repo sowie ein Kommandozeilen-Tool, mit dem sich Deployments automatisiert auslösen lassen – nützlich, wenn ein Coding-Agent das Deployment selbst anstoßen soll, ohne extra ein Repository einzurichten.

## Ein Missverständnis
Ein kostenloser Plan bedeutet nicht unbegrenzte Deployments: Die meisten Anbieter setzen eine monatliche Obergrenze (oft im dreistelligen Bereich), danach kostet jedes weitere Deployment oder ein Upgrade wird nötig. Für ein einzelnes kleines Projekt ist das selten ein Problem, bei viel automatisiertem Deployen durch einen Agenten kann es aber relevant werden.`},

{slug:"rag", bodyDetail:
`## Zwei Suchverfahren kombiniert
Reines Embedding-basiertes Retrieval findet inhaltlich Ähnliches, übersieht aber manchmal exakte Treffer – etwa einen bestimmten Fehlercode wie "TS-999" in einer Support-Datenbank. Deshalb kombinieren gute RAG-Systeme Embeddings mit BM25, einem älteren, lexikalischen Suchverfahren, das gezielt nach exakten Wort- oder Zeichenfolgen sucht. Erst die Kombination aus beidem liefert zuverlässig sowohl thematisch passende als auch exakt übereinstimmende Textausschnitte.

## Contextual Retrieval als Verfeinerung
Ein häufiges Problem beim Zerlegen von Dokumenten in kleine Textausschnitte (Chunks): Ein einzelner Ausschnitt wie "Der Umsatz stieg um 3 % gegenüber dem Vorquartal" verrät für sich allein nicht, um welches Unternehmen oder welchen Zeitraum es geht. Contextual Retrieval löst das, indem vor dem Einbetten automatisch ein kurzer, erklärender Kontext (meist 50–100 Tokens) vor jeden Ausschnitt gesetzt wird – erzeugt von einem kleinen, günstigen Modell, das den gesamten Ursprungstext kennt.

## Belegte Zahlen zur Wirkung
In Tests reduzierte allein die kontextangereicherte Embedding-Suche die Fehlerquote beim Wiederfinden relevanter Ausschnitte um 35 %. Kombiniert mit dem BM25-Verfahren waren es 49 % weniger Fehltreffer, und mit einem zusätzlichen Reranking-Schritt (einem Modell, das gefundene Kandidaten noch einmal nach Relevanz sortiert) sogar 67 % weniger.

## Wann eine lange Anfrage im Prompt reicht
Nicht jede Wissensbasis braucht RAG: Passt sie komplett unter etwa 200.000 Tokens, lässt sie sich zusammen mit Prompt Caching einfach direkt in jede Anfrage mitgeben – ganz ohne Retrieval-Infrastruktur. RAG lohnt sich erst, wenn die Wissensbasis dauerhaft größer ist als das Kontextfenster.`},

{slug:"embeddings", bodyDetail:
`## Wie viele Zahlen so ein Vektor hat
Die Länge eines Embedding-Vektors ist fest vorgegeben und modellabhängig – bei gängigen aktuellen Embedding-Modellen etwa 1536 oder 3072 Zahlen pro Textstück. Mehr Dimensionen erfassen oft feinere Bedeutungsunterschiede, kosten aber mehr Speicherplatz und Rechenzeit beim Vergleichen. Viele Anbieter erlauben deshalb, die Dimension gezielt zu reduzieren, ohne dass die grobe Bedeutungsstruktur verloren geht – ein Kompromiss zwischen Genauigkeit und Effizienz.

## Sechs typische Einsatzzwecke
Neben semantischer Suche und RAG werden Embeddings auch für Anomalie-Erkennung genutzt (Ausreißer erkennen, die zu nichts anderem passen), für Diversitäts-Messung (wie unterschiedlich ist eine Sammlung von Texten wirklich) und für automatische Klassifikation (einen Text der am nächsten liegenden vordefinierten Kategorie zuordnen). All diese Anwendungen brauchen dieselbe Grundoperation: den Abstand zwischen zwei Vektoren berechnen.

## Wie die Berechnung technisch abläuft
Ein eigenes, meist deutlich kleineres Modell als das eigentliche Sprachmodell wandelt Text in den Zahlenvektor um; abgerechnet wird dabei nach der Anzahl der Token im Eingabetext, nicht nach der Länge des Ausgabevektors. Der fertige Vektor selbst trägt keine lesbare Bedeutung mehr – einzelne Zahlen lassen sich nicht interpretieren, nur der Abstand zwischen mehreren Vektoren ergibt einen Sinn.

## Ein Missverständnis
Ein Embedding-Modell "versteht" den Text nicht im menschlichen Sinn und prüft auch keine Fakten – es bildet nur statistische Nähe ab, die beim Training gelernt wurde. Zwei Sätze mit entgegengesetzter Aussage, aber ähnlichem Wortschatz, können deshalb überraschend nah beieinanderliegen.`},

{slug:"fine-tuning", bodyDetail:
`## Vier unterschiedliche Fine-Tuning-Verfahren
Nicht jedes Fine-Tuning läuft gleich ab. Supervised Fine-Tuning zeigt dem Modell korrekte Beispielantworten zu Prompts. Direct Preference Optimization zeigt stattdessen jeweils eine bessere und eine schlechtere Antwort, damit das Modell lernt, welche Richtung bevorzugt wird. Reinforcement Fine-Tuning geht noch weiter: Ein Gutachter bewertet erzeugte Antworten, und diese Bewertung verstärkt gezielt die Gedankengänge, die zu besonders guten Ergebnissen führten – aufwendiger, aber geeignet für komplexe, fachlich anspruchsvolle Aufgaben wie juristische oder medizinische Einschätzungen.

## Der technische Ablauf
Grob läuft Fine-Tuning immer gleich ab: einen Datensatz aus Beispielen sammeln, in ein strukturiertes Format hochladen, einen Trainingsjob starten und anschließend die Ergebnisse mit Evals prüfen. Bei Verfahren mit menschlicher oder automatisierter Bewertung (wie Reinforcement Fine-Tuning) kommt zusätzlich ein Bewertungsmaßstab (Grader) hinzu, der festlegt, was eine "gute" Antwort ausmacht.

## Warum Fine-Tuning zusätzlich zu Prompting hilft
Fine-Tuning lohnt sich vor allem, wenn deutlich mehr Beispiele nötig wären, als in ein einzelnes Kontextfenster passen, oder wenn sensible Trainingsdaten nicht bei jeder Anfrage im Prompt mitgeschickt werden sollen. Ein weiterer Vorteil: kürzere Prompts ohne viele Beispiele sparen dauerhaft Tokens und Antwortzeit, weil das gewünschte Verhalten schon im Modell selbst steckt statt jedes Mal neu erklärt zu werden.

## Ein bewegliches Angebot
Wie stark einzelne Anbieter Fine-Tuning aktiv fördern, ändert sich: Manche Anbieter bauen ihr Angebot gerade um oder schränken es für neue Kunden ein, während bestehende Modelle nutzbar bleiben. Vor einer Investition in eigenes Fine-Tuning lohnt sich deshalb ein Blick auf den aktuellen Stand der jeweiligen Plattform.`},

{slug:"prompt-injection", bodyDetail:
`## Warum RAG und Fine-Tuning nicht automatisch schützen
Ein verbreiteter Irrtum: Techniken wie RAG oder Fine-Tuning würden Prompt Injection nebenbei mit lösen, weil sie Antworten "relevanter" machen. Tatsächlich zeigt die Forschung, dass beide das Grundproblem nicht beheben – sie ändern nur, welche Inhalte ins Kontextfenster gelangen, verhindern aber nicht, dass darin versteckte Anweisungen als echte Instruktionen missverstanden werden.

## Prompt Injection ist nicht dasselbe wie Jailbreaking
Beide Begriffe werden oft synonym verwendet, meinen aber unterschiedliche Dinge: Prompt Injection manipuliert generell, wie ein Modell auf eine Eingabe reagiert. Jailbreaking ist eine besonders weitreichende Form davon, bei der die eingebauten Sicherheitsregeln komplett umgangen werden sollen. Nicht jede erfolgreiche Prompt Injection ist gleich ein Jailbreak.

## Sieben konkrete Gegenmaßnahmen
OWASP nennt unter anderem: das Modellverhalten im System-Prompt eng eingrenzen; erwartete Ausgabeformate vorgeben und deterministisch prüfen; Ein- und Ausgaben nach verbotenen Mustern filtern; dem Modell nur die minimal nötigen Rechte geben (eigene, eingeschränkte API-Zugänge statt vollem Zugriff); bei riskanten Aktionen eine menschliche Freigabe verlangen; fremden Inhalt klar als solchen kennzeichnen und getrennt vom eigentlichen Prompt behandeln; sowie regelmäßig gezielte Angriffssimulationen durchführen.

## Auch Bilder können Anweisungen verstecken
Mit multimodalen Modellen wächst die Angriffsfläche: Eine versteckte Anweisung kann auch in einem Bild stecken, das zusammen mit harmlosem Text verarbeitet wird. Verarbeitet das Modell Bild und Text gemeinsam, kann die im Bild versteckte Anweisung das Verhalten beeinflussen, obwohl der sichtbare Text völlig unauffällig wirkt.`},

{slug:"structured-outputs", bodyDetail:
`## Der Unterschied zu einfachem JSON-Modus
Viele APIs kennen zwei gestaffelte Stufen: Ein einfacher "JSON-Modus" garantiert nur, dass die Ausgabe überhaupt gültiges JSON ist – nicht, dass sie zum gewünschten Schema passt. Structured Outputs geht einen Schritt weiter und erzwingt zusätzlich die Einhaltung eines konkreten Schemas: Fehlt ein Pflichtfeld oder hat ein Feld den falschen Typ, kann die Ausgabe technisch gar nicht erst entstehen, statt erst nachträglich beim Parsen aufzufallen.

## Wie die Erzwingung technisch funktioniert
Die Erzeugung des nächsten Tokens wird bei Structured Outputs so eingeschränkt, dass an jeder Stelle nur Tokens erlaubt sind, die zum vorgegebenen Schema passen können – man spricht von eingeschränkter Dekodierung (Constrained Decoding). Das ist ein deutlicher Unterschied zu bloßem Prompten mit "bitte gib JSON zurück", was das Modell einfach ignorieren oder falsch umsetzen kann.

## Nicht jedes Modell unterstützt das gleich gut
Diese harte Schema-Bindung ist nicht bei jedem Modell und jeder Modellversion gleich verfügbar – ältere oder kleinere Modellversionen unterstützen oft nur den einfacheren JSON-Modus ohne Schema-Garantie. Vor dem produktiven Einsatz lohnt sich deshalb ein Blick in die aktuelle Modell-Dokumentation, welches Verfahren für die eingesetzte Version wirklich greift.

## In der Praxis: typisierte Klassen statt Rohschema
In modernen Entwicklungsumgebungen definiert man das Schema oft nicht direkt als rohes JSON Schema, sondern über eine typisierte Klasse (etwa mit Pydantic in Python oder Zod in JavaScript). Ein Hilfsprogramm wandelt diese Klassendefinition automatisch in das technische Schema um – das Ergebnis lässt sich danach direkt als fertiges, typisiertes Objekt im Code weiterverwenden, ganz ohne manuelles Parsen.`},

{slug:"evals", bodyDetail:
`## Gute Erfolgskriterien vor dem ersten Test
Bevor überhaupt ein Eval entsteht, lohnt es sich, Erfolg konkret zu definieren: spezifisch statt vage ("genaue Sentiment-Klassifikation" statt "gute Leistung"), messbar mit klaren Zahlen oder Skalen, erreichbar im Rahmen dessen, was aktuelle Modelle realistisch leisten, und passend zum eigentlichen Anwendungsfall. Selbst schwer greifbare Themen wie Sicherheit oder Ton lassen sich so in eine prüfbare Form bringen, etwa "weniger als 0,1 % der Ausgaben werden als unangemessen markiert".

## Drei Bewertungsverfahren mit unterschiedlichem Aufwand
Code-basierte Prüfung (exakter Abgleich, Stichwort-Suche) ist am schnellsten und zuverlässigsten, aber wenig differenziert. Menschliche Bewertung ist am flexibelsten, aber langsam und teuer – sie eignet sich eher für Stichproben als für laufende Prüfung. Dazwischen liegt die Bewertung durch ein zweites Modell (LLM-as-Judge): schnell, skalierbar und geeignet für komplexere Urteile, sofern die Bewertungskriterien vorher klar und detailliert formuliert wurden.

## Ein wichtiger Trick beim LLM-Richter
Ein zweites Modell bewertet zuverlässiger, wenn man es zuerst kurz begründen lässt, bevor es sein Urteil fällt – ähnlich wie bei einem Menschen hilft das kurze "Nachdenken vor der Note" gegen vorschnelle, oberflächliche Bewertungen. Die Begründung selbst kann danach verworfen werden, nur das Endergebnis zählt für die Auswertung.

## Lieber viele einfache Fälle als wenige perfekte
Ein häufiger Fehler: zu lange mit dem Bauen eines Evals warten, weil er "noch nicht groß genug" wirkt. Besser ist es, früh mit einer kleinen, realistischen Testmenge zu starten und Randfälle nicht zu vergessen – mehr Testfragen mit etwas einfacherer automatischer Bewertung schlagen meist wenige, aufwendig von Hand geprüfte Fälle.`},

{slug:"git-worktrees", bodyDetail:
`## Was geteilt wird und was nicht
Worktrees teilen sich die komplette Commit-Historie und alle Branches (alles unter refs/), aber jeder Worktree hat seinen eigenen Stand von HEAD, seinem eigenen Index (Staging Area) und seinen eigenen ausgecheckten Dateien. Genau diese Trennung macht parallele Arbeit möglich: Ein Commit in einem Worktree taucht sofort in der gemeinsamen Historie auf und ist von allen anderen Worktrees aus sichtbar, ohne dass sich die Dateien auf der Festplatte gegenseitig überschreiben.

## Praktische Kurzbefehle
Ganz ohne Branch-Namen anzugeben, legt `+"`git worktree add ../pfad`"+` automatisch einen neuen Branch an, benannt nach dem letzten Ordnernamen im Pfad. Wird ein Worktree auf einem tragbaren Laufwerk oder Netzlaufwerk gespeichert, das nicht immer verbunden ist, verhindert `+"`git worktree lock`"+` das automatische Aufräumen der zugehörigen Verwaltungsdateien. Wurde ein Arbeitsordner manuell (ohne `+"`git worktree remove`"+`) gelöscht, räumt `+"`git worktree prune`"+` die verwaisten internen Metadaten danach auf.

## Ein klassisches Einsatzbeispiel
Die offizielle Git-Dokumentation nennt ein alltägliches Szenario: Mitten in einer aufwendigen Umstrukturierung kommt eine dringende Bitte um einen Soforteinsatz-Fix. Statt den unfertigen, unübersichtlichen Arbeitsstand mit `+"`git stash`"+` beiseite zu legen und zu riskieren, etwas zu übersehen, legt man einen temporären Worktree für den Fix an, erledigt ihn dort isoliert, entfernt den Worktree wieder und macht an der Umstrukturierung genau dort weiter, wo man aufgehört hat.

## Ein Missverständnis
Worktrees sind keine vollständigen, unabhängigen Kopien wie bei `+"`git clone`"+` – sie teilen sich dieselbe zugrunde liegende Objektdatenbank und brauchen deshalb deutlich weniger Speicherplatz als mehrere separate Klone desselben Repositories.`},

{slug:"hooks", bodyDetail:
`## Drei Auslösezeitpunkte
Hook-Ereignisse fallen in drei zeitliche Kategorien: einmal pro Session (etwa beim Start oder Ende), einmal pro Gesprächsrunde (etwa wenn du eine Nachricht abschickst oder Claude fertig geantwortet hat) und bei jedem einzelnen Werkzeug-Aufruf innerhalb der agentischen Schleife (vor und nach jedem Tool). Über die im Haupttext genannten Basis-Ereignisse hinaus gibt es noch deutlich mehr Ansatzpunkte, etwa vor einer automatischen Kontext-Kompaktierung, beim Erzeugen eines Subagenten oder beim Anlegen eines Git Worktrees.

## Nicht nur Shell-Befehle
Ein Hook muss kein reines Shell-Kommando sein. Claude Code unterstützt auch HTTP-Hooks, die eine Anfrage an einen eigenen Server schicken, sowie Prompt-basierte und Agent-basierte Hooks, bei denen selbst ein kleines LLM die Entscheidung trifft, statt starrer Regeln. Das erlaubt zum Beispiel einen Hook, der mit eigenem Urteilsvermögen prüft, ob eine Änderung "riskant genug" für eine Rückfrage ist, statt nur nach starren Textmustern zu suchen.

## Aktiv eingreifen statt nur beobachten
Manche Hooks können mehr als nur protokollieren: Sie liefern eine explizite Entscheidung zurück (erlauben, blockieren, oder eine Aktion für später verschieben). Ein PreToolUse-Hook kann so einen geplanten Befehl komplett stoppen, bevor er überhaupt beim Modell oder System ankommt – nicht nur danach eine Warnung ausgeben.

## Sicherheit bei eigenen Hooks
Weil Hooks mit vollen Rechten des eigenen Nutzerkontos laufen, warnt die Dokumentation ausdrücklich davor, Hooks aus nicht vertrauenswürdigen Quellen ungeprüft zu übernehmen: Ein bösartiger Hook hätte denselben Systemzugriff wie du selbst.`},

{slug:"multi-agent-patterns", bodyDetail:
`## Belegte Zahlen zum Leistungsgewinn
In einem internen Anthropic-Test übertraf ein Multi-Agent-System (ein Leitmodell plus mehrere parallele Subagenten) ein einzelnes, gleich starkes Modell bei Recherche-Aufgaben um 90,2 %. Die Analyse zeigte außerdem: Drei Faktoren erklärten zusammen 95 % der Leistungsunterschiede in einem Recherche-Benchmark, wobei der reine Token-Verbrauch allein schon 80 % ausmachte – mehr Agenten heißt vor allem: mehr Kapazität für paralleles Denken, verteilt auf mehrere eigene Kontextfenster.

## Der Preis dieser Leistung
Mehr Agenten kosten spürbar mehr: Ein einzelner Agent verbraucht laut denselben Messungen im Schnitt rund viermal so viele Tokens wie ein normales Chat-Gespräch, ein Multi-Agent-System sogar rund das Fünfzehnfache. Das lohnt sich nur, wenn der Wert der Aufgabe diesen Mehraufwand auch tatsächlich rechtfertigt – für viele einfache Aufgaben ist das nicht der Fall.

## Wann sich Aufteilung NICHT lohnt
Nicht jede Aufgabe profitiert von mehreren Agenten. Aufgaben mit vielen engen Abhängigkeiten zwischen den Teilschritten – etwa die meisten Coding-Aufgaben, bei denen eine Änderung in einer Datei eine andere Datei betrifft – lassen sich schlechter sauber aufteilen als offene Rechercheaufgaben, bei denen mehrere unabhängige Suchstränge parallel verfolgt werden können.

## Ein praktischer Hebel: parallele statt serielle Aufrufe
Ein einfacher, aber wirkungsvoller Trick: Werkzeuge nicht nacheinander, sondern gleichzeitig aufrufen lassen – sowohl mehrere Subagenten gleichzeitig starten als auch innerhalb eines Subagenten mehrere Suchanfragen parallel abschicken. Dieser eine Umbau senkte in Tests die Bearbeitungszeit komplexer Rechercheaufgaben um bis zu 90 %.`},

{slug:"kontext-strategien", bodyDetail:
`## Das Phänomen "Context Rot"
Studien zu Nadel-im-Heuhaufen-Tests zeigen einen konsistenten Effekt: Je mehr Tokens im Kontextfenster stehen, desto unzuverlässiger wird das Modell darin, einzelne Informationen daraus korrekt wiederzugeben – selbst wenn das technische Limit noch nicht erreicht ist. Ursache ist unter anderem die Architektur selbst: Transformer-Modelle berechnen Beziehungen zwischen praktisch jedem Token-Paar, wodurch die Aufmerksamkeit bei wachsender Länge förmlich verdünnt wird. Ein Kontextfenster ist deshalb eine Ressource mit abnehmendem Grenznutzen, keine reine Kapazitätsfrage.

## Kompaktierung konkret am Beispiel Claude Code
Wird der Kontext eng, fasst Claude Code die Nachrichten-Historie automatisch zusammen, behält dabei aber gezielt Architekturentscheidungen, offene Fehler und wichtige Umsetzungsdetails – während reine Werkzeug-Ausgaben verworfen werden. Zusätzlich bleiben die fünf zuletzt geöffneten Dateien im vollen Kontext erhalten. Die eigentliche Kunst liegt darin, beim Zusammenfassen nicht zu aggressiv vorzugehen: Was gerade unwichtig wirkt, kann sich später als entscheidend herausstellen.

## Externes Gedächtnis als Notizzettel
Statt alles im Kontextfenster zu behalten, schreiben manche Agenten fortlaufend Notizen in eine externe Datei (etwa eine NOTES.md), die bei Bedarf wieder eingelesen wird. Nach einem Kontext-Reset liest der Agent seine eigenen Notizen und macht nahtlos weiter – dieses Muster ermöglicht stundenlange, zusammenhängende Aufgaben, die weit über ein einzelnes Kontextfenster hinausgehen.

## Kompression durch Subagenten
Ein Subagent kann intern zehntausende Tokens für seine eigene Recherche verbrauchen, gibt an den Hauptagenten aber oft nur eine verdichtete Zusammenfassung von 1.000 bis 2.000 Tokens zurück. Der aufwendige Zwischenweg bleibt isoliert, nur das destillierte Ergebnis erreicht den Hauptkontext.`},
];

module.exports = de;
