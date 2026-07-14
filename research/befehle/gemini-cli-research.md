# Gemini CLI — Research 14.07.2026 (Agent-verifiziert, alle Kern-URLs 200)

⚠️ **WICHTIGSTER BEFUND ZUERST:** Google hat am 19.05.2026 offiziell angekündigt, Gemini CLI für Individual-/Free-Nutzer zugunsten von **Antigravity CLI** einzustellen. Seit **18.06.2026** (bereits vergangen, heute ist 14.07.2026) ist der kostenlose Google-Account-Login-Zugang (Gemini Code Assist Individual, Google AI Pro/Ultra personal) **abgeschaltet**. Details siehe Abschnitt „Meta-Fakten" und „Empfehlung". Das Repo selbst lebt weiter (aktiver Push heute, 14.07.2026), aber nur noch für Enterprise/Workspace-Lizenzen und zahlende API-Key/Vertex-AI-Nutzer.

## Quellen (URL + Status + Deckung)

| URL | Status | Deckt ab |
|---|---|---|
| https://github.com/google-gemini/gemini-cli | 200 | Repo-Übersicht, Topics (mcp-client, mcp-server), Activity |
| https://api.github.com/repos/google-gemini/gemini-cli | 200 (API) | Stars (105.976), Forks (14.251), Lizenz Apache-2.0, `pushed_at` 14.07.2026 (aktiv), `archived:false` |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/README.md | 200 | Projektbeschreibung, Free-Tier-Anspruch, Install (npm/npx/brew/MacPorts/conda), Release-Channels (preview/stable/nightly) |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/reference/commands.md | 200 | Vollständige Referenz: Slash-Commands, At-Commands, Shell-Passthrough (`!`) |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/cli-reference.md | 200 | CLI-Cheatsheet: alle Flags/Optionen, Model-Aliases, Extensions-/MCP-/Skills-CLI-Subcommands |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/resources/quota-and-pricing.md | 200 | Freikontingent-Tabelle nach Auth-Methode (⚠️ evtl. inhaltlich veraltet, s.u.) |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md | 200 | GEMINI.md Kontext-Datei-Hierarchie (global/workspace/JIT) |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/get-started/gemini-3.md | 200 | Unterstützte Modelle (Gemini 3 Pro/Flash, 3.1 Preview, 2.5-Fallback) |
| https://raw.githubusercontent.com/google-gemini/gemini-cli/main/packages/cli/package.json | 200 | Versionsnummer main-Branch (nightly) |
| https://registry.npmjs.org/@google/gemini-cli/latest | 200 | Aktuelle stabile npm-Version + Lizenzfeld |
| https://geminicli.com/ | 200 | Offizielle Doku-/Marketing-Site (echte Inhalte, kein Soft-404); zeigt selbst Banner zur Antigravity-Transition |
| https://google-gemini.github.io/gemini-cli/ | 200 | Spiegelt echte Produktdoku (kein Platzhalter) |
| https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ | 200 | Offizielle Google-Ankündigung der Antigravity-Transition (19.05.2026), Stichtag 18.06.2026, Enterprise-Ausnahme |
| https://github.com/google-gemini/gemini-cli/discussions/27274 | 200 | Maintainer-Post + Community-Bestätigung, dass Free-Tier-Abschaltung am 18.06.2026 tatsächlich erfolgte |

Verworfen: `cloud.google.com/gemini/docs/codeassist/gemini-cli` (200, aber 301-Redirect auf `docs.cloud.google.com/...` — nicht als Primärquelle genutzt, da `geminicli.com` + GitHub-Doku direkter/autoritativer sind); `docs/cli/cli-reference.md` alte Pfad-Vermutung `docs/cli/commands.md` (404, verworfen — korrekter Pfad ist `docs/reference/commands.md`).

## Befehls-Inventar

### A. CLI-Aufruf (non-interaktiv, `gemini <flag>` / `gemini <subcommand>`)
Quelle für gesamten Block A: `docs/cli/cli-reference.md`, README.

| Befehl | Zweck | Wichtige Optionen |
|---|---|---|
| `gemini` | Startet interaktive REPL (TTY-Default) | — |
| `gemini "query"` | Query stellen, danach interaktiv weiterlaufen | Positional, variadic |
| `gemini -p/--prompt "query"` | Nicht-interaktive Ausführung, erzwingt Exit nach Antwort | wird an stdin-Input angehängt falls vorhanden |
| `gemini -i/--prompt-interactive "query"` | Prompt ausführen, danach interaktiv weiter | — |
| `cat file \| gemini` | Piped-Input verarbeiten | — |
| `-r/--resume <latest\|id\|index>` | Session fortsetzen | `--list-sessions`, `--delete-session <idx>` |
| `-m/--model <name>` | Modell wählen (Alias oder konkreter Name) | Default `auto` |
| `-w/--worktree [name]` | Startet in neuem Git-Worktree | benötigt `experimental.worktrees:true` |
| `-s/--sandbox` | Sandboxed Ausführung | Default `false` |
| `--approval-mode <mode>` | Freigabe-Modus für Tool-Ausführung | `default`, `auto_edit`, `yolo`, `plan` |
| `-y/--yolo` | Alle Aktionen automatisch freigeben | **Deprecated**, ersetzt durch `--approval-mode=yolo` |
| `-e/--extensions <list>` | Aktive Extensions einschränken | sonst alle aktiv |
| `-l/--list-extensions` | Extensions auflisten und beenden | — |
| `--include-directories <dirs>` | Zusätzliche Workspace-Verzeichnisse | kommasepariert oder mehrfach |
| `--allowed-mcp-server-names <names>` | Erlaubte MCP-Server einschränken | — |
| `--allowed-tools <tools>` | Tools ohne Rückfrage erlauben | **Deprecated**, ersetzt durch Policy Engine |
| `--skip-trust` | Folder-Trust-Check für Session überspringen | Default `false` |
| `--screen-reader` | Accessibility-Modus | — |
| `-o/--output-format <fmt>` | Ausgabeformat | `text` (Default), `json`, `stream-json` |
| `-d/--debug` | Verbose Logging | Default `false` |
| `-v/--version` | Versionsnummer anzeigen | — |
| `-h/--help` | Hilfe anzeigen | — |
| `--experimental-acp` | ACP-Modus (Agent Code Pilot) | Experimental |
| `--experimental-zed-integration` | Zed-Editor-Integrationsmodus | Experimental |
| `gemini update` | Auf neueste Version aktualisieren | — |
| `gemini extensions install/uninstall/list/update/enable/disable/link/new/validate` | Extensions verwalten (CLI-seitig) | `--ref <ref>`, `--auto-update`, `--all` |
| `gemini mcp add/remove/list` | MCP-Server konfigurieren (CLI-seitig) | `--transport http`, `--env KEY=val`, `--scope user`, `--include-tools` |
| `gemini skills list/install/link/uninstall/enable/disable` | Agent Skills verwalten (CLI-seitig) | `--all` für enable/disable |

### B. Interaktive Slash-Commands (`/`)
Quelle für gesamten Block B: `docs/reference/commands.md`.

| Befehl | Zweck | Wichtige Optionen |
|---|---|---|
| `/about` | Versionsinfo für Bugreports anzeigen | — |
| `/agents` | Lokale/Remote-Subagents verwalten | `list`, `reload`(=`refresh`), `enable <n>`, `disable <n>`, `config <n>` |
| `/auth` | Authentifizierungsmethode wechseln | Dialog |
| `/bug` | GitHub-Issue für Gemini CLI anlegen | anpassbar via `advanced.bugCommand`-Setting |
| `/chat` (Alias für `/resume`) | Session-Browser + Checkpoints verwalten | `list`, `save <tag>`, `resume <tag>`, `delete <tag>`, `share [file]`, `debug` |
| `/clear` | Terminal + sichtbare Historie leeren | Shortcut Ctrl+L |
| `/commands` | Custom Slash-Commands aus `.toml`-Dateien verwalten | `list`, `reload` |
| `/compress` | Chat-Kontext durch Zusammenfassung ersetzen (Token sparen) | — |
| `/copy` | Letzte Ausgabe in Zwischenablage kopieren | benötigt pbcopy/xclip/xsel/clip; OSC 52 bei SSH/WSL |
| `/directory` (Alias `/dir`) | Multi-Directory-Workspace verwalten | `add <path1>,<path2>`, `show` |
| `/docs` | Doku im Browser öffnen | — |
| `/editor` | Editor auswählen | Dialog |
| `/extensions` | Extensions verwalten (interaktiv) | `config`, `disable`, `enable`, `explore`, `install`, `link`, `list`, `restart`, `uninstall`, `update` |
| `/help` (Alias `/?`) | Hilfe + verfügbare Befehle anzeigen | — |
| `/hooks` | Lifecycle-Hooks verwalten | `list`(=`show`/`panel`), `enable <n>`, `disable <n>`, `enable-all`, `disable-all` |
| `/ide` | IDE-Integration verwalten | `enable`, `disable`, `install`, `status` |
| `/init` | `GEMINI.md`-Kontextdatei fürs Projekt generieren | — |
| `/mcp` | MCP-Server verwalten | `auth <server>`, `desc`, `disable`, `enable`, `list`(=`ls`, Default), `reload`, `schema` |
| `/memory` | Hierarchisches `GEMINI.md`-Kontextgedächtnis verwalten | `list`, `refresh`, `show` |
| `/model` | Modellkonfiguration verwalten | `manage` (Dialog), `set <name> [--persist]` |
| `/permissions` | Folder-Trust-Einstellungen verwalten | `trust [<path>]` |
| `/plan` | Plan-Mode (read-only) umschalten, Plan anzeigen | `copy` |
| `/policies` | Policies verwalten | `list` |
| `/privacy` | Privacy Notice + Datenkonsens anzeigen | — |
| `/quit` (Alias `/exit`) | Gemini CLI beenden | `--delete` (Session-Historie unwiderruflich löschen) |
| `/restore` | Projektdateien auf Vor-Tool-Zustand zurücksetzen | `[tool_call_id]`; benötigt Checkpointing-Setting |
| `/rewind` | Rückwärts durch Conversation-Historie navigieren, Chat/Files revertieren | Shortcut Esc+Esc |
| `/resume` | Sessions durchsuchen/fortsetzen, Checkpoints verwalten | ident. Subcommands wie `/chat`; Suche via `/` im Browser |
| `/settings` | Settings-Editor öffnen | — |
| `/shells` (Alias `/bashes`) | Background-Shells-Ansicht umschalten | — |
| `/setup-github` | GitHub Actions für Issue-Triage/PR-Review einrichten | — |
| `/skills` | Agent Skills verwalten (interaktiv) | `enable <n>`, `disable <n>`, `list`, `reload` |
| `/stats` | Session-Statistiken anzeigen | `session` (Default), `model`, `tools` |
| `/terminal-setup` | Terminal-Keybindings für Mehrzeileneingabe konfigurieren | VS Code/Cursor/Windsurf |
| `/theme` | Visuelles Theme wechseln | Dialog |
| `/tools` | Verfügbare Tools anzeigen | `[desc\|nodesc]` |
| `/upgrade` | Upgrade-Seite für höhere Limits öffnen | nur mit Google-Login |
| `/vim` | Vim-Modus (NORMAL/INSERT) umschalten | Zähler-Präfixe, `dd`/`cc`/`dw`/`cw`, `.` wiederholt letzte Edit |

### C. At-Commands (`@`) und Shell-Passthrough (`!`)
Quelle: `docs/reference/commands.md`.

| Befehl | Zweck | Details |
|---|---|---|
| `@<pfad_zu_datei_oder_verzeichnis>` | Datei-/Verzeichnisinhalt in Prompt einfügen | Git-aware Filtering (node_modules/dist/.env/.git standardmäßig exkludiert); nutzt intern `read_many_files`; Leerzeichen mit `\` escapen |
| `@` (alleinstehend) | Query ohne Dateiinjektion durchreichen | Nützlich, wenn über `@`-Symbol selbst gesprochen wird |
| `!<shell_command>` | Shell-Befehl direkt ausführen | `bash` (Linux/macOS) bzw. `powershell.exe -NoProfile -Command` (Windows); setzt `GEMINI_CLI=1` im Subprozess |
| `!` (Toggle) | Shell-Modus betreten/verlassen | Eingaben werden direkt als Shell-Befehle interpretiert |

**Summe dokumentierter, benannter Befehle:** Block A 30 + Block B 38 + Block C 4 = **72** (Top-Level-Zählung, Sub-Aktionen als Optionen mitgezählt statt als Extra-Zeile — siehe Empfehlung für Alternativzählung).

## Meta-Fakten

- **Lizenz:** Apache-2.0 (bestätigt via GitHub-API-Feld `license.spdx_id` und npm-Registry-Feld `license`)
- **Version (stabil, npm `latest`):** 0.50.0 · **Version (main-Branch, nightly):** 0.52.0-nightly.20260707.g27a3da3e8 · Release-Kadenz laut README: Preview jeden Dienstag 23:59 UTC, Stable jeden Dienstag 20:00 UTC, Nightly täglich 00:00 UTC (Quelle: README)
- **GitHub-Popularität:** 105.976 Stars, 14.251 Forks, 1.380 offene Issues, letzter Push 14.07.2026 (heute) — Repo ist **nicht archiviert**, aktive Entwicklung (Quelle: GitHub API)
- **Installation:** npm (`npm install -g @google/gemini-cli`), npx, Homebrew, MacPorts, Anaconda (Quelle: README)
- **Modelle:** Gemini 3 Pro/Flash (Standard via `/model` → „Auto (Gemini 3)"), Gemini 3.1 Pro Preview (rollout, manuell wählbar), Fallback-Kette 3-Pro → 2.5-Pro → 2.5-Flash bei Limit/Überlastung; 1M-Token-Kontextfenster laut README (Quelle: `docs/get-started/gemini-3.md`, README)
- **MCP-Support:** Ja, first-class — `/mcp`-Slash-Command + `gemini mcp add/remove/list`-CLI-Subcommand, GitHub-Repo-Topics enthalten `mcp-client` und `mcp-server` (Quelle: `docs/cli/cli-reference.md`, GitHub-API)
- **Kontext-Datei:** `GEMINI.md`, hierarchisch geladen (global `~/.gemini/GEMINI.md` → Workspace/Ancestor-Verzeichnisse → Just-in-Time bei Tool-Zugriff), Footer zeigt Anzahl geladener Kontextdateien (Quelle: `docs/cli/gemini-md.md`)
- **Kostenloses Kontingent (laut Doku, Stand Fetch 14.07.2026):** Google-Account-Login (Gemini Code Assist Individual) 1.000 Requests/Tag; README nennt zusätzlich 60 Requests/Min; Gemini-API-Key unpaid 250 Requests/Tag (nur Flash-Modell); Google AI Pro 1.500/Tag, Google AI Ultra 2.000/Tag; Workspace Code Assist Standard 1.500/Tag, Enterprise 2.000/Tag (Quelle: `docs/resources/quota-and-pricing.md`, README)
  - ⚠️ **Aber:** Diese Doku-Seite widerspricht der unten dokumentierten Antigravity-Transition — vermutlich noch nicht aktualisierter Stand. Siehe nächster Punkt.
- **🔴 KRITISCH — Antigravity-Transition (separat verifiziert, nicht Teil der CLI-Doku selbst):**
  - Offizielle Ankündigung 19.05.2026 (developers.googleblog.com, GitHub Discussion #27274 vom selben Maintainer): Google konsolidiert auf **Antigravity CLI** (neue, in Go gebaute Plattform für Multi-Agent-Workflows, Teil von „Antigravity 2.0").
  - Stichtag **18.06.2026**: Gemini CLI + Gemini Code Assist IDE-Extensions stellen die Bedienung von Google-AI-Pro/Ultra- und kostenlosen Individual-Requests ein.
  - Community-Kommentare in Discussion #27274 (19.–21.06.2026) bestätigen: Abschaltung ist tatsächlich wie angekündigt erfolgt („I am now on Antigravity Starter Quota. Nothing is transferred").
  - **Ausnahme:** Enterprise-/Workspace-Kunden mit Code-Assist-Standard/Enterprise-Lizenz sowie zahlende Gemini-API-Key-/Vertex-AI-Nutzer behalten Zugriff — das Repo bleibt dafür Apache-2.0-Open-Source und wird aktiv weiterentwickelt (heutiger Push als Beleg).
  - Antigravity CLI übernimmt laut Ankündigung die „kritischsten Features" (Agent Skills, Hooks, Subagents, Extensions→Plugins), aber explizit **ohne 1:1-Feature-Parität**.
  - Die von diesem Research erfasste Befehlsreferenz (`docs/reference/commands.md`, `docs/cli/cli-reference.md`) ist weiterhin live im Repo und wird nicht als deprecated markiert — sie beschreibt also den aktuellen, aber für Individual-Nutzer nur noch eingeschränkt (paid API key) zugänglichen Funktionsumfang.

## Nicht belegbar
- Ob `docs/resources/quota-and-pricing.md` und der README-Free-Tier-Claim ("60 req/min, 1.000 req/Tag mit persönlichem Google-Account") nach dem 18.06.2026-Stichtag noch redaktionell korrekt sind, oder ob sie schlicht noch nicht an die Antigravity-Transition angepasst wurden — beide Docs-Seiten enthalten keinen Hinweis auf die Abschaltung, obwohl `geminicli.com` selbst (Homepage) einen Transition-Banner zeigt. Widerspruch nicht auflösbar ohne Live-Test mit echtem Free-Tier-Google-Account.
- Exakte 1:1-Feature-Parität-Lücken zwischen Gemini CLI und Antigravity CLI (Ankündigung nennt nur, was übernommen wird, nicht was fehlt) — nur Drittquellen (Blogs/Migration-Guides) äußern sich dazu, nicht offiziell verifiziert, daher hier ausgelassen.
- Ob `cloud.google.com/gemini/docs/codeassist/gemini-cli` (redirectet auf `docs.cloud.google.com/...`) inhaltlich von den GitHub-Docs abweicht — nicht geprüft, da GitHub-Doku als autoritativer eingestuft und ausreichend war.

## Empfehlung

**Anzahl realistisch inventarisierbarer Befehle:** ~72 bei Top-Level-Zählung (30 CLI-Flags/Subcommands + 38 interaktive Slash-Commands + 4 At-/Shell-Befehle), vergleichbar mit Cursor (80). Bei Sub-Aktionen als eigene Zeilen (z. B. `/agents list`, `/agents reload`, `/agents enable` einzeln statt gebündelt — analog zur Cursor-„batch-sub"-Aufteilung in diesem Repo) steigt die Zahl auf realistisch **110–130**, da Gemini CLI inzwischen (Stand Juli 2026) Subagents, Hooks, Skills, Plan-Mode, Rewind und Policy-Engine bietet — mehr Oberfläche als Claude Code (92) zum Zeitpunkt der dortigen Erhebung. Der Aufwand für ein Vollinventar auf Cursor/Claude-Code-Niveau ist mit den bereits geladenen Quellen (2 zentrale Doku-Seiten decken >95 % ab) **niedrig** — kein Scraping über viele Einzelseiten nötig, anders als bei Aider.

**Lohnt sich Gemini CLI als 5. Plattform?** Fachlich/technisch ja — das Befehlsinventar ist umfangreich, sauber dokumentiert auf zwei zentralen Seiten, MCP- und GEMINI.md-Konzepte passen gut neben Claude Code/Cursor/Aider. **Aber:** Der große Kontext-Fund dieses Researchs ist, dass Google die Plattform für genau die Zielgruppe von promptgarden (Individual-Entwickler, kostenloser/persönlicher Zugang) am 18.06.2026 bereits **abgeschaltet und durch Antigravity CLI ersetzt** hat — nur Enterprise/Workspace/Paid-API-Key-Nutzer haben noch Zugriff. Empfehlung: Gemini CLI trotzdem dokumentieren (Repo lebt, Doku ist aktuell, historisch/für zahlende Nutzer weiter relevant), aber mit explizitem Hinweis-Badge auf der Plattform-Seite versehen ("nur noch Enterprise/Paid — für Free-Individual-Nutzer durch Antigravity CLI ersetzt seit 18.06.2026"), und **Antigravity CLI als eigentlichen, zukunftssicheren 5.-Platform-Kandidaten** separat prüfen (eigene Doku existiert bereits unter antigravity.google, HTTP 200 verifiziert, aber außerhalb dieses Auftrags nicht inventarisiert).
