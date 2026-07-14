# Antigravity CLI — Research 14.07.2026 (Agent-verifiziert, alle genutzten URLs 200 + Inhalt geprüft)

⚠️ **Technischer Hinweis zur Methodik:** antigravity.google ist eine reine JS-SPA (Angular). `curl` und `WebFetch` liefern nur die leere HTML-Hülle (Titel "Google Antigravity", kein Body-Text). Alle inhaltlichen Zitate unten stammen aus serverseitig gerendertem Inhalt über den `r.jina.ai`-Reader-Proxy (Firecrawl-CLI war lokal nicht authentifiziert/verfügbar). HTTP-Status wurde trotzdem separat und direkt per `curl -s -o /dev/null -w "%{http_code}" -L -A "Mozilla/5.0"` gegen die Original-URL verifiziert (nicht gegen den Proxy).

## Quellen (URL + Status + Deckung)

| URL | Status | Deckt ab |
|---|---|---|
| https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ | 200 | Offizielle Google-Ankündigung der Transition (bereits in `gemini-cli-research.md` verifiziert, hier erneut bestätigt) |
| https://github.com/google-antigravity/antigravity-cli | 200 | Repo-Übersicht |
| https://api.github.com/repos/google-antigravity/antigravity-cli | 200 (API) | Stars (1.585), Forks (120), offene Issues (469), `license: null`, `created_at` 13.05.2026, `pushed_at` 13.07.2026 (aktiv) |
| https://raw.githubusercontent.com/google-antigravity/antigravity-cli/main/README.md | 200 | Projektbeschreibung, Install-Scripts, Auth-Flow, Verhältnis zu Antigravity 2.0 |
| https://raw.githubusercontent.com/google-antigravity/antigravity-cli/main/CHANGELOG.md | 200 | Vollständige Versionshistorie 1.0.0–1.1.2 mit vielen Flag-/Slash-Command-/Env-Var-Erstnennungen |
| https://github.com/google-antigravity/antigravity-cli/releases | 200 | Bestätigt 1.1.2 als aktuellste Release-Version |
| `raw.githubusercontent.com/.../LICENSE` (+ `.md`, `.txt`, `COPYING`, `NOTICE`) | 404 (alle Varianten) | Bestätigt: kein Lizenz-File im Repo (deckt sich mit `license: null` in GitHub-API) |
| https://antigravity.google/docs/cli-overview | 200 (Inhalt via jina-Rendering) | CLI-vs-2.0-Vergleich, Shared-Agent-Engine, Verweis auf Gemini-Migration |
| https://antigravity.google/docs/cli/install | 200 (jina) | Installation (macOS/Linux/Windows-Scripts), `--skip-aliases`/`--skip-path`, Auth-Flows (lokal/SSH), `/logout` |
| https://antigravity.google/docs/cli/getting-started (= Duplikat `docs/cli-getting-started`) | 200 (jina) | Onboarding-Roadmap, Erststart, Farbschema/Rendering-Setup |
| https://antigravity.google/docs/cli/reference | 200 (jina) | **Zentrale Referenztabelle**: alle 31 Kern-Slash-Commands mit Alias/Kategorie/Zweck, Keybindings, `settings.json`-Keys |
| https://antigravity.google/docs/cli/sandbox | 200 (jina) | Sandbox-Mechanik (`nsjail`/`sandbox-exec`/`AppContainer`), `enableTerminalSandbox` |
| https://antigravity.google/docs/cli/troubleshooting | 200 (jina) | PATH/Keyring/Clipboard/Updater-Troubleshooting, `AGY_CLI_DISABLE_AUTO_UPDATE`, Updater-Locking |
| https://antigravity.google/docs/cli/gcli-migration | 200 (jina) | Migration von Gemini CLI (Details siehe eigener Abschnitt) |
| https://antigravity.google/docs/cli/credits | 200 (jina) | G1-Credits-Mechanik, `/credits`, `useG1Credits` |
| https://antigravity.google/docs/cli/plugins | 200 (jina) | Plugin-System (`plugin.json`-Schema), Skills, `/hooks`, MCP-Verweis |
| https://antigravity.google/docs/cli/prompting | 200 (jina) | Prompt-Box-Interaktion, Multiline, Medien-Paste |
| https://antigravity.google/docs/cli/best-practices | 200 (jina) | Verifikations-Loops, non-interaktiver `-p`-Modus, `/rewind`, `/fork`, `GEMINI.md`/`AGENTS.md` |
| https://antigravity.google/docs/plans | 200 (jina) | Free/Pro/Ultra-Kontingent (nur qualitativ, keine Zahlen) |
| https://antigravity.google/docs/mcp | 200 (jina) | Vollständige MCP-Doku (Config-Schema, Auth, unterstützte Server-Liste) |
| https://antigravity.google/docs/models | 200 (jina) | Unterstützte Modelle je Plan |
| https://antigravity.google/docs/cli/commands/agents | 200 (jina) | `/agents`-Panel im Detail (Custom-Agent-Pfade, Subagent-Monitoring) |
| https://antigravity.google/docs/cli/commands/permissions | 200 (jina) | `/permissions`-Panel im Detail (Scope-Picker, Allow/Deny/Ask) |
| https://antigravity.google/docs/cli/commands/resume | 200 (jina) | `/resume`-Panel + `-c`/`--continue`/`--conversation`-Flags + Cache-Datei |
| https://antigravity.google/docs/cli/commands/statusline | 200 (jina) | `/statusline`-Subcommands (on/off/enable/disable/reset/help/custom) |
| https://antigravity.google/docs/cli/commands/diff | 200 (jina) | `/diff` 3 Modi (VCS/Turn/Commit) + volle Keybinding-Tabelle |
| https://antigravity.google/docs/cli/settings | 200 (jina) | `settings.json` vollständig, Keybindings-Datei-Format, Rendering-Modi |
| https://antigravity.google/docs/cli-using | 200 (jina, eigenständiger Inhalt) | Alternative/ältere Doku-Seite: Quick-Tips-Tabelle, Keybindings-Tabelle, zusätzlich `--dangerously-skip-permissions`-Flag (nirgends sonst erwähnt) |
| https://antigravity.google/docs/cli-features | 200 (jina, eigenständiger Inhalt) | Alternative/ältere Doku-Seite: Feature-Übersicht, Subagents-Konzept, teils **abweichende** Command-Beschreibungen (s. „Nicht belegbar") |

**Verworfen — Soft-404 (HTTP 200, aber Inhalt = generische Fallback-Seite „Getting Started with Antigravity 2.0" statt Zielseite):**
`antigravity.google/docs/cli/print-mode`, `.../cli/non-interactive`, `.../cli/headless`, `.../cli/updates`, `.../cli/update`, `.../docs/command` — alle 6 per `curl` mit 200 erreichbar, aber jina-gerenderter Inhalt zeigt identischen Nicht-Ziel-Inhalt (Antigravity-2.0-Download-Seite). Nicht als Quelle verwendet.

## Befehls-Inventar

### A. Installation, Auth, CLI-Start-Flags & Subcommands (non-interaktiv, `agy <flag>`/`agy <subcommand>`)

| Befehl | Zweck | Quelle |
|---|---|---|
| `agy` | Startet TUI im aktuellen Verzeichnis | README, `cli/getting-started` |
| `agy -p / --print "<prompt>"` | Nicht-interaktiver One-Shot-Modus (Print/Headless), exit nach Antwort | `cli/best-practices`, CHANGELOG 1.1.1/1.1.2 |
| `agy -c / --continue` | Letzte Konversation des aktuellen Workspace fortsetzen | `cli/commands/resume` |
| `agy --conversation <id>` | Bestimmte Konversation per ID laden (auch kombinierbar mit `-p`) | `cli/commands/resume`, CHANGELOG 1.0.9 |
| `agy --model <name>` | Modell beim Start setzen | CHANGELOG 1.0.5 |
| `agy models` | Verfügbare Modelle auflisten (Subcommand) | CHANGELOG 1.0.5 |
| `agy --agent <name>` | Custom Agent beim Start wählen | CHANGELOG 1.1.1 |
| `agy agent` / `agy agents` | Verfügbare Custom Agents auflisten (Subcommand) | CHANGELOG 1.1.1 |
| `agy --project <name>` | Projekt explizit setzen | CHANGELOG 1.0.12 |
| `agy --new-project <name>` | Neues Projekt anlegen | CHANGELOG 1.0.12 |
| `agy --sandbox` | Sandbox-Isolation erzwingen (auch im `-p`-Modus) | CHANGELOG 1.0.6 |
| `agy --mode <default\|accept-edits\|plan>` | Ausführungsmodus beim Start setzen | CHANGELOG 1.1.0 |
| `agy --dangerously-skip-permissions` | Permission-Overrides umgehen (Settings-Panel zeigt Override-Quelle an) | `docs/cli-using` |
| `agy plugin list` | Installierte Plugins auflisten | `cli/plugins` |
| `agy plugin install <path>` | Lokales/heruntergeladenes Plugin installieren | `cli/plugins` |
| `agy plugin enable/disable <name>` | Plugin (de)aktivieren ohne Deinstallation | `cli/plugins` |
| `agy plugin uninstall <name>` | Plugin-Verzeichnis vollständig entfernen | `cli/plugins` |
| `agy plugin import gemini` | Legacy-Gemini-CLI-Extensions in native Plugins konvertieren | `cli/gcli-migration` |

**Installer-Script-Flags:** `--skip-aliases` (Shell-Alias-Bereinigung überspringen), `--skip-path` (PATH-Eintrag überspringen) — Quelle: `cli/install`.

**Dokumentierte Umgebungsvariablen:** `AGY_CLI_CMD_OUTPUT_PERCENTAGE` (CHANGELOG 1.0.11, max. Höhe von Command-Output im TUI), `AGY_CLI_HIDE_ACCOUNT_INFO` (CHANGELOG 1.0.2, Account-Info im Header verstecken), `AGY_CLI_DISABLE_LATEX` (CHANGELOG 1.0.4, LaTeX-Rendering global abschalten), `AGY_CLI_DISABLE_AUTO_UPDATE` (`cli/troubleshooting`, Auto-Update deaktivieren).

### B. Interaktive Slash-Commands — Kern-Referenztabelle
Quelle: `docs/cli/reference` ("Core slash commands" — die Seite bezeichnet sich selbst als vollständige Referenz aller TUI-Slash-Commands).

| Befehl | Kategorie | Alias | Zweck |
|---|---|---|---|
| `/add-dir <path>` | Utilities | — | Verzeichnis zum aktiven Workspace hinzufügen |
| `/agents` | Tools & Tasks | — | Agent-Manager-Panel (Custom Agents wählen, Subagents überwachen) |
| `/artifact` | Tools & Tasks | — | Artifact-Review-Panel öffnen |
| `/btw <query>` | Utilities | — | Seitenfrage im Hintergrund stellen, ohne Hauptkonversation zu unterbrechen |
| `/clear` | Utilities | `/new` | Terminal + aktive Konversationskontexte leeren |
| `/config` | Configurations | `/settings` | Interaktiven Settings-Editor öffnen |
| `/context` | Utilities | — | Kontext-Nutzungs-Visualisierung öffnen |
| `/copy` | Utilities | — | Letzte Agent-Antwort in Zwischenablage kopieren |
| `/credits` | Account | — | Verbleibende G1-Credits + Kauf-Links anzeigen |
| `/diff` | Utilities | — | Interaktiven Diff-Viewer öffnen (VCS/Turn/Commit-Modi) |
| `/exit` | Core | `/quit` | TUI-Session beenden, Host-Shell wiederherstellen |
| `/fast` | Configurations | — | Fast-Modus (Reasoning-Pläne überspringen) für schnelle Aktionen |
| `/feedback` | Utilities | — | Feedback-Panel öffnen |
| `/fork` | Conversations | `/branch` | Aktuellen Konversationsthread klonen (parallele Session) |
| `/help` | Utilities | — | Hilfe-Panel mit Commands + Shortcuts |
| `/hooks` | Tools & Tasks | — | Aktive Pre-/Post-Hooks durchsuchen |
| `/keybindings` | Configurations | — | Interaktiven Keybinding-Editor öffnen |
| `/logout` | Account | — | Profil trennen, Auth-Token aus Keyring löschen |
| `/mcp` | Tools & Tasks | — | MCP-Server-Manager öffnen |
| `/model` | Configurations | — | Reasoning-Modell wählen (sessionübergreifend persistent) |
| `/open <path>` | Utilities | — | Pfad im System-Default-Editor öffnen |
| `/permissions` | Configurations | — | Interaktiven Tool-Permissions-Manager öffnen |
| `/planning` | Configurations | — | Mehrstufigen Plan-Generierungsmodus aktivieren |
| `/rename <name>` | Conversations | — | Aktuellen Session-Thread umbenennen |
| `/resume` | Conversations | `/switch`, `/conversation` | Conversation-Picker öffnen (frühere Threads laden) |
| `/rewind` | Conversations | `/undo` | Konversationshistorie zu vorherigem Checkpoint zurückrollen |
| `/skills` | Tools & Tasks | — | Geladene lokale/globale Agent Skills durchsuchen |
| `/statusline` | Configurations | — | Statusleisten-Anpassung öffnen (`on`/`off`/`enable`/`disable`/`reset`/`<custom-cmd>`/`help`) |
| `/tasks` | Tools & Tasks | — | Task-Manager-Panel (Background-Shell-Logs überwachen) |
| `/title [on/off]` | Configurations | — | Terminal-Fenstertitel-Updates umschalten |
| `/usage` | Utilities | `/quota` | Modell-Quota-Nutzung anzeigen |

**31 Kern-Befehle, 8 Aliase** (`/new`, `/settings`, `/quit`, `/switch`, `/conversation`, `/undo`, `/branch`, `/quota`).

### C. Zusätzliche Slash-Commands (nur in CHANGELOG.md belegt, fehlen in aktueller `docs/cli/reference`-Tabelle)

| Befehl | Zweck | Quelle |
|---|---|---|
| `/changelog` | Changelog-Overlay-Panel öffnen (Cache synchron zu `agy changelog`) | CHANGELOG.md 1.0.4/1.1.0 |
| `/goal` | Persistentes Aufgabenziel setzen (Max-Limit in 1.0.14 entfernt) | CHANGELOG.md 1.0.14 |
| `/plan` | Laut CHANGELOG 1.1.0 Nachfolger von `/planning`, ersetzt zusammen mit Entfernen von `/fast` | CHANGELOG.md 1.1.0 — ⚠️ **widerspricht** der aktuell live gefetchten `docs/cli/reference`-Tabelle, die weiterhin `/fast` und `/planning` (kein `/plan`) listet. Nicht aufgelöst, s. „Nicht belegbar". |

### D. Panel-interne Subcommands/Shortcuts (dokumentiert auf dedizierten Command-Detailseiten)

| Panel | Subcommands/Shortcuts | Quelle |
|---|---|---|
| `/statusline` | (ohne Argument) toggelt an/aus · `on`/`enable` · `off`/`disable` · `<shell-command>` (custom renderer) · `reset` · `help` | `cli/commands/statusline` |
| `/agents` | `↑/↓` navigieren · `Enter` auswählen/Subagent-Detail öffnen · `k` aktiven Subagent killen · `a`/`d` Inline-Tool-Approval · `Esc` zurück | `cli/commands/agents` |
| `/permissions` | Scope-Picker (`Project`/`Shared`/`Global`) → Rule-Viewer-Tabs (`allow`/`deny`/`ask`) → `a` add, `e`/`Ctrl+G` edit, `d`/`Backspace` delete; Regelformat `action(target)` (z. B. `command(git)`, `mcp(server/tool)`) | `cli/commands/permissions`, `docs/mcp` |
| `/resume` | `F2` umbenennen · `Ctrl+Delete` löschen · `Tab` wechselt CLI-Tab ↔ Antigravity-2.0-Tab (Import laufender Desktop-Konversationen) | `cli/commands/resume` |
| `/diff` | `Tab`/`←`/`→` zyklisch VCS→Turn→Commit-Modus · `c` Kommentar hinzufügen · `d` Kommentar löschen · `n`/`N` Hunk-Navigation · `Shift+Y`/`Shift+N` Kommentare senden/verwerfen | `cli/commands/diff` |

### E. At-artige Mechanismen & Sonstiges

| Mechanismus | Zweck | Quelle |
|---|---|---|
| `@<pfad>` | Interactive-Path-Suggestion-Overlay, fügt Workspace-Dateipfad in Prompt ein | `cli/best-practices`, `docs/cli-using` |
| `!<shell-command>` (am Zeilenanfang) | Terminal-Befehl direkt ausführen | `docs/cli-using` |
| `?` | Hilfe + Liste aller Slash-Commands anzeigen | `docs/cli-using` |
| `esc esc` | Prompt-Box leeren (ohne aktiven Stream) | `docs/cli-using` |
| Skills als Slash-Commands | Markdown-Skill in `.agents/skills/*.md` (Workspace) oder `~/.gemini/antigravity-cli/skills/` (global) wird automatisch zu `/<skill-name>` | `cli/plugins` |

**Zusammenfassung Zählung:** Block A 19 CLI-Flags/Subcommands + 2 Installer-Flags + 4 Env-Vars, Block B 31 Kern-Slash-Commands (+8 Aliase), Block C 3 nur-CHANGELOG-Befehle (unsicher/widersprüchlich), Block E 5 At-/Shell-/Skill-Mechanismen. **Belastbare Top-Level-Summe (ohne Aliase, ohne Panel-interne Tastenkürzel): ca. 56** (19+2+4+31+5 − Doppelzählungen), bei Einschluss der 3 unsicheren CHANGELOG-Only-Befehle **~59**.

## Meta-Fakten

- **Lizenz:** **Kein Open-Source-Lizenzfile im Repo** — GitHub-API-Feld `license` ist `null`, `LICENSE`/`LICENSE.md`/`LICENSE.txt`/`COPYING`/`NOTICE` liefern alle 404. Damit **kein** Apache-2.0 o. ä., im Gegensatz zu Gemini CLI (Apache-2.0). README enthält stattdessen einen Data-Use-/ToS-Hinweis (Nutzung = Zustimmung zur Datensammlung durch Google, opt-out über Settings möglich) — Quelle: README, GitHub-API.
- **Repo-Aktivität:** `google-antigravity/antigravity-cli`, erstellt 13.05.2026, 1.585 Stars, 120 Forks, 469 offene Issues, letzter Push 13.07.2026 — aktiv entwickelt, noch sehr junges Repo (ca. 2 Monate alt zum Research-Zeitpunkt). Quelle: GitHub-API.
- **Versionshistorie:** 1.0.0 (Initial Release) bis 1.1.2 (aktuell, laut Releases-Seite "Latest") — 17 Releases dokumentiert im CHANGELOG.
- **Technischer Unterbau (nicht explizit benannt, aber aus CHANGELOG ableitbar):** TUI basiert auf Bubble Tea v2 (Go-TUI-Framework, mehrfach in CHANGELOG erwähnt, z. B. "Updated bubbletea to v2.0.7"). Nirgends offiziell als "in Go geschrieben" deklariert — daher als Indiz, nicht als Fakt gelistet.
- **Installation:** native Installer-Skripte für macOS/Linux (`curl ... install.sh | bash`), Windows PowerShell (`irm ... install.ps1 | iex`) und CMD — Binary landet in `~/.local/bin/agy` bzw. `%LOCALAPPDATA%\agy\bin`. Quelle: README, `cli/install`.
- **Modelle (laut allgemeiner `docs/models`-Seite, gilt laut `cli-overview` auch für CLI via „Shared Agent Engine"):** Gemini 3.1 Pro und Gemini 3.5 Flash auf allen Plänen; Claude Sonnet 4.6 (thinking), Claude Opus 4.6 (thinking) und GPT-OSS-120b **nur** auf Google AI Ultra. Zusätzliche Nicht-Reasoning-Modelle (z. B. Nano Banana 2 für Bildgenerierung) fest verdrahtet, nicht wählbar.
- **MCP-Support:** Vollständig, first-class — `stdio`- und Remote-Transport (`serverUrl` für SSE/Streamable-HTTP/WebSocket; **Achtung:** Legacy-Keys `url`/`httpUrl` werden nicht mehr unterstützt), Auth via `authProviderType: "google_credentials"` (ADC) oder OAuth (DCR-automatisch oder manuelle `clientId`/`clientSecret`), Permission-Syntax `mcp(server/tool)` / `mcp(server/*)` / `mcp(*)`. Config getrennt in global (`~/.gemini/config/mcp_config.json`) und Workspace (`.agents/mcp_config.json`). Interaktiver Manager via `/mcp`. Quelle: `docs/mcp`.
- **Kontext-Dateien:** `GEMINI.md` und `AGENTS.md` im Workspace-Root, plus globales `~/.gemini/GEMINI.md` — **identisch zu Gemini CLI**, keine Migration nötig. Quelle: `cli/best-practices`, `cli/gcli-migration`.
- **Freies Kontingent:** **Keine konkreten Zahlen dokumentiert** (im Gegensatz zu Gemini CLI, das früher explizite "1.000 Requests/Tag"-Angaben hatte). `docs/plans` beschreibt nur qualitative Stufen: Nutzer ohne AI-Pro/Ultra erhalten "meaningful quota, refreshed weekly"; AI Pro "high, generous quota, refreshed every five hours until weekly limit"; AI Ultra "highest, most generous quota, refreshed every five hours" + Zugriff auf Drittanbieter-Modelle (Claude, GPT-OSS). Kein Bring-your-own-API-Key für zusätzliches Kontingent möglich. Quelle: `docs/plans`.
- **Auth:** OS-Keyring (Apple Keychain / Linux Secret Service via dbus / Windows Credential Manager) mit Browser-OAuth-Fallback bei fehlender Session; bei SSH manueller URL+Code-Flow (kein lokaler Browser). Enterprise-Zugang via GCP-Projekt-Verbindung im Onboarding. Quelle: README, `cli/install`.
- **Verhältnis zur Antigravity-IDE (Antigravity 2.0):** Beide teilen dieselbe "Shared Agent Engine" und synchronisieren Settings/Permissions bidirektional. CLI = leichtgewichtiges Terminal-UI (TUI, für SSH/Remote/Tastatur-first optimiert), Antigravity 2.0 = volle Desktop-GUI-IDE (visuelle Orchestrierung, Multi-Panel). Konversationen lassen sich von der CLI aus in die GUI exportieren (`/resume` → Tab zu "Antigravity"-Tab) und umgekehrt importieren. Quelle: README, `cli-overview`, `cli/commands/resume`.

## Migration von Gemini CLI

Quelle: `docs/cli/gcli-migration` (dediziert), ergänzt durch README.

- **Automatisches Onboarding:** Beim ersten Start von `agy` in einem Verzeichnis mit vorhandener Gemini-CLI-Konfiguration erkennt die CLI diese automatisch und bietet eine interaktive Checkliste zur Migration von Extensions/Settings; Session-Tokens werden ins OS-Keyring übernommen.
- **Manuelle Konvertierung:** `agy plugin import gemini` konvertiert Legacy-Gemini-Extensions in native Plugins. Dokumentiertes Beispiel-Output zeigt granulare Konvertierung: Skills, Agents, Commands (→ werden zu Skills) und `mcpServers` werden einzeln geprüft/migriert.
- **Was UNVERÄNDERT bleibt:** Workspace-Regeldateien `GEMINI.md` und `AGENTS.md` sowie globales `~/.gemini/GEMINI.md` — keine Anpassung nötig.
- **Was sich ÄNDERT:**
  - Skills-Pfade: global `~/.gemini/skills/` → `~/.gemini/antigravity-cli/skills/`; Workspace `.gemini/skills/` → `.agents/skills/` (**manuelle Aktion nötig**, sonst werden Workspace-Skills nicht erkannt — explizite Warnung in der Doku).
  - MCP-Config: von inline in `~/.gemini/settings.json` → dedizierte `mcp_config.json` (global `~/.gemini/config/mcp_config.json`, Workspace `.agents/mcp_config.json`); Schema-Key `url`/`httpUrl` → `serverUrl`.
- **Explizit KEINE 1:1-Parität:** Dokumentation warnt ausdrücklich ("Partial Parity"), dass bestimmte custom Terminal-Themes oder experimentelle visuelle Overlays aus Gemini CLI nicht unterstützt werden.

## Empfehlung

**Realistische Befehlsanzahl:** ~56 belastbare Top-Level-Einträge (19 CLI-Start-Flags/Subcommands + 2 Installer-Flags + 4 Env-Vars + 31 Kern-Slash-Commands + 5 At-/Shell-/Skill-Mechanismen — Aliase und reine Panel-Tastenkürzel nicht mitgezählt), bei Einschluss der 3 unsicheren CHANGELOG-Only-Befehle (`/changelog`, `/goal`, `/plan`) ~59. Das positioniert Antigravity CLI zwischen Codex (16, laut aktuellem Site-Stand) und Aider (48) bzw. knapp über Aider — deutlich unter Cursor (80) und Claude Code (92). Die Dokumentation ist konzentriert auf wenige, aber sehr dichte Seiten (v. a. `cli/reference`, `CHANGELOG.md`, `cli/plugins`, `docs/mcp`) — ähnlich effizient recherchierbar wie Gemini CLI, kein Aider-artiges Einzelseiten-Scraping nötig.

**Eignung als 5. Plattform: Ja, mit Einschränkungen.** Antigravity CLI ist der von Google selbst benannte, aktuell unterstützte Nachfolger von Gemini CLI für Individual-/Free-Nutzer (Ankündigung 19.05.2026, Stichtag 18.06.2026 bereits vergangen — siehe `gemini-cli-research.md` in diesem Repo) und schließt damit exakt die Lücke, die die Gemini-CLI-Abschaltung hinterlassen hat. Dafür sprechen: aktiv entwickeltes Repo, dichte offizielle Doku mit dedizierter CLI-Referenztabelle, vollwertiger MCP-Support, identische `GEMINI.md`/`AGENTS.md`-Kontext-Mechanik wie die bereits gelistete Konkurrenz.

Dagegen bzw. zu beachten:
1. **Kein Open-Source-Lizenzfile** (`license: null`) — anders als Gemini CLI (Apache-2.0); Nutzer bekommen laut README explizit keine Zusicherung über Quellcode-Offenheit, nur ein Data-Use-Consent-Hinweis.
2. **Sehr junges Produkt** (Repo seit 13.05.2026, ~2 Monate alt) — die Doku selbst enthält bereits einen ungelösten inneren Widerspruch (CHANGELOG 1.1.0 behauptet `/plan` ersetzt `/planning` und `/fast` entfällt; die aktuell live gefetchte Referenztabelle zeigt weiterhin `/fast` und `/planning`, kein `/plan`) — ein Hinweis auf noch nicht stabilisierte Doku/Funktionsumfang.
3. **Keine konkreten Freikontingent-Zahlen** dokumentiert (nur "meaningful/generous/highest quota" ohne Requests/Tag-Angaben) — schwerer für promptgarden-Nutzer einzuschätzen als Gemini CLIs frühere klare Zahlen.
4. Doku-Site ist eine reine JS-SPA ohne serverseitiges Rendering für Standard-Crawler — künftige Refreshes dieser Recherche brauchen einen JS-fähigen Fetch-Weg (z. B. Firecrawl mit `--wait-for`, oder einen Reader-Proxy), nicht nur `curl`/`WebFetch`.

**Empfehlung:** Antigravity CLI als 5. Plattform aufnehmen, aber mit Badge/Hinweis "sehr junges Produkt, Doku teils inkonsistent, kein bestätigtes Open-Source-Lizenzmodell" versehen — analog zum bereits vorgeschlagenen Hinweis-Badge bei Gemini CLI. Bei einem Folge-Refresh in einigen Monaten sollte insbesondere der `/plan`-vs-`/planning`/`/fast`-Widerspruch erneut geprüft werden, da er auf noch laufende Command-Umbenennungen hindeutet.

## Nicht belegbar

- **`agy update`** (manuelles Update-Subcommand) — nur in einer WebSearch-KI-Zusammenfassung (Sekundärquelle) genannt, in keiner der primär gefetchten offiziellen Doku-Seiten bestätigt. `cli/troubleshooting` dokumentiert nur den automatischen Hintergrund-Updater (15-Min-TTL-Lock, `AGY_CLI_DISABLE_AUTO_UPDATE`), kein manuelles `agy update`-Kommando. Daher nicht ins Inventar aufgenommen.
- **`/export`** (Session-Export-Befehl) — ebenfalls nur in einer WebSearch-KI-Zusammenfassung genannt. Die offizielle "Core slash commands"-Tabelle (`cli/reference`, 31 Einträge) enthält keinen `/export`-Befehl. Das zugrunde liegende Feature (Konversation von CLI → Antigravity-2.0-GUI exportieren) ist real dokumentiert (README, `cli-overview`, `cli/commands/resume`), läuft aber laut Doku über den `/resume`-Panel-Tab-Wechsel, nicht über einen eigenständigen `/export`-Befehl.
- **`/plan` vs. `/planning`+`/fast`-Widerspruch** — CHANGELOG 1.1.0 (offizielle Primärquelle) beschreibt `/plan` als Nachfolger von `/planning` bei gleichzeitigem Entfernen von `/fast`. Die aktuell live gefetchte `cli/reference`-Tabelle (ebenfalls offizielle Primärquelle, jüngerer Snapshot) listet aber weiterhin `/fast` und `/planning` und keinen `/plan`-Befehl. Beide Quellen sind offiziell, widersprechen sich aber — nicht auflösbar ohne Live-Test in der echten CLI. Im Inventar unter Block C mit Warnhinweis aufgeführt.
- **Abweichende `/usage`-Beschreibung** — die (ältere, aber weiterhin live erreichbare) Seite `docs/cli-features` beschreibt `/usage` als "Open the inline interactive help manual inside the terminal", während die aktuellere `cli/reference`-Tabelle `/usage` (Alias `/quota`) als "Display model quota usage" beschreibt. Für das Inventar wurde die dedizierte `cli/reference`-Tabelle als autoritativer behandelt, da sie sich selbst als vollständige/aktuelle Referenz bezeichnet.
- **Exakte Programmiersprache** (vermutlich Go, wegen Bubble-Tea-v2-Erwähnungen im CHANGELOG) — nirgends offiziell explizit benannt, daher nur als Indiz in Meta-Fakten vermerkt, nicht als harter Fakt.
- **Genaue Freikontingent-Zahlen** (Requests/Tag oder /Minute) — nicht publiziert; `docs/plans` bleibt bei qualitativen Stufenbeschreibungen ohne Zahlen.
- **Vollständige `permissions.json`/`hooks.json`-Schema-Referenz** über die in `docs/cli/reference` gelisteten 14 `settings.json`-Keys hinaus — dedizierte Konzeptseiten (`docs/cli/permissions`, Statusline-Scripting-Guide `docs/cli/statusline`) existieren laut Verlinkung, wurden aber im Rahmen dieser Recherche nicht einzeln vertieft (Zeitbudget), da die bereits gefetchten Seiten (`cli/reference`, `cli/settings`, `cli/plugins`, `docs/mcp`) das Kernbild ausreichend abdecken.
