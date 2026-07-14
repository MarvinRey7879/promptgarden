# Vergleichs-Research: Aktuelle Top-Modelle der großen KI-Anbieter + Modellwahl in Coding-Tools

**Stand: Juli 2026 (recherchiert 13./14.07.2026). Nur verifizierte Fakten — jede Angabe mit Quellen-Referenz [Kürzel] → Quellenverzeichnis am Ende (URL + HTTP-Status).**

Methodik: Jede zitierte URL wurde per `curl -s -o /dev/null -w "%{http_code}" -L -A "Mozilla/5.0"` auf Status 200 geprüft UND der Inhalt tatsächlich geladen (Soft-404-Check; bei kritischen Zahlen zusätzlich Roh-HTML gegengeprüft, um Fetch-Zusammenfassungsfehler auszuschließen). JS-SPAs (antigravity.google) wurden über den Reader `https://r.jina.ai/<url>` gelesen; zitiert wird immer die Original-URL, der Reader-Zugriff ist gekennzeichnet. Wörtliche Zitate stehen in englischer Originalsprache. Nicht Belegbares steht im Abschnitt „Nicht belegbar / Diskrepanzen" — nichts davon wurde in die Tabellen übernommen.

---

## TEIL 1 — MODELL-LINEUPS (aktuelle Generation, Stand: Juli 2026)

### 1.1 Anthropic (Claude)

| Modell | Modell-ID | Positionierung laut Anthropic (wörtlich) | Kontextfenster | Max. Output | Preis In/Out pro MTok | Quelle |
|---|---|---|---|---|---|---|
| **Claude Fable 5** | `claude-fable-5` | "Anthropic's most capable widely released model, built for the most demanding reasoning and long-horizon agentic work." / "Next-generation intelligence for long-running agents" | 1M Tokens (Standard, kein kleinerer Tier) | 128K | $10 / $50 | [A1], [A2], [A3] |
| **Claude Mythos 5** | `claude-mythos-5` | "Shares Claude Fable 5's capabilities without the safety classifiers. Available through Project Glasswing." Nachfolger von Claude Mythos Preview; nur auf Einladung, kein Self-Serve. | 1M Tokens | 128K | $10 / $50 laut Plattform-Docs [A1][A3] (⚠️ Diskrepanz: Glasswing-Seite nennt $25/$125 — siehe „Nicht belegbar") | [A1], [A3], [A7] |
| **Claude Opus 4.8** | `claude-opus-4-8` | "For complex agentic coding and enterprise work." / "Hybrid reasoning model built for serious coding and AI agents, featuring a 1M context window." / "a premium model for serious coding and knowledge work." | 1M Tokens | 128K | $5 / $25 | [A1], [A3], [A5] |
| **Claude Sonnet 5** | `claude-sonnet-5` | "The best combination of speed and intelligence." / Launch-Post: "built to be the most agentic Sonnet model yet. It can make plans, use tools like browsers and terminals, and run autonomously at a level that, just a few months ago, required larger and more expensive models." | 1M Tokens (immer, kein 200K-Variante auf First-Party-API) | 128K | Intro bis 31.08.2026: $2 / $10; ab 01.09.2026: $3 / $15 | [A1], [A3], [A4] |
| **Claude Haiku 4.5** | `claude-haiku-4-5` (voll: `claude-haiku-4-5-20251001`) | "The fastest model with near-frontier intelligence." / "Our fastest model, a lightweight version of our most powerful AI, at a more affordable price." / "scores 73.3% on SWE-bench Verified" (Anthropic-eigene Angabe) | 200K Tokens | 64K | $1 / $5 | [A1], [A3], [A6] |

**„Most intelligent":** Fable 5 ist laut Anthropic das fähigste breit verfügbare Modell ("most capable widely released model") [A2]. Mythos 5 teilt dessen Fähigkeiten ohne Safety-Classifier (Project Glasswing, invitation-only) [A7].

**1M-Kontext:** Fable 5, Mythos 5, Opus 4.8 und Sonnet 5 haben alle 1M Kontext als Standard; nur Haiku 4.5 bleibt bei 200K [A1].

**Thinking-Architektur (laut Anthropic-Tabelle [A1], [A9]):** Fable 5, Opus 4.8, Sonnet 5 = Adaptive Thinking (bei Fable 5 immer an, nicht abschaltbar); Haiku 4.5 = klassisches Extended Thinking.

**Preis-Nuancen [A3]:** Prompt-Caching: 5-Min-Cache-Write = 1,25× Input-Preis, 1-h-Write = 2×, Cache-Hit = 0,1×. Batch API: 50 % Rabatt auf In+Out bei allen Modellen.

**Ältere, noch aktiv gelistete Modelle [A1]:** Opus 4.7 ($5/$25), Opus 4.6 ($5/$25), Sonnet 4.6 ($3/$15), Sonnet 4.5 ($3/$15), Opus 4.5 ($5/$25); Opus 4.1 deprecated (Abschaltung 05.08.2026, $15/$75).

### 1.2 OpenAI (GPT)

Hinweis: `platform.openai.com/docs/models` leitet inzwischen auf `developers.openai.com/api/docs/models` um; `openai.com/api/pricing/` blockt automatisierte Zugriffe (403) — Preis-Quelle ist `developers.openai.com/api/docs/pricing` [O2].

**Aktuelle Generation:**

| Modell | Modell-ID | Positionierung laut OpenAI (wörtlich) | Kontextfenster | Max. Output | Preis In/Out pro MTok (Cached In) | Quelle |
|---|---|---|---|---|---|---|
| **GPT-5.6 Sol** | `gpt-5.6-sol` (Alias `gpt-5.6`) | "Frontier model for complex professional work" / "our flagship model for complex reasoning and coding" | 1.050.000 | 128.000 | $5 / $30 ($0,50) | [O1], [O2], [O4] |
| **GPT-5.6 Terra** | `gpt-5.6-terra` | "GPT-5.6 model that balances intelligence and cost … roughly corresponds to the mini model tier used in earlier GPT-5 families" | 1.050.000 | 128.000 | $2,50 / $15 ($0,25) | [O5] |
| **GPT-5.6 Luna** | `gpt-5.6-luna` | "GPT-5.6 model optimized for cost-sensitive workloads … roughly corresponds to the nano model tier" | 1.050.000 | 128.000 | $1,00 / $6 ($0,10) | [O6] |
| GPT-5.5 | `gpt-5.5` | "A new class of intelligence for coding and professional work." (Vorgänger-Frontier) | 1.050.000 | 128.000 | $5 / $30 ($0,50) | [O7] |
| GPT-5.5 Pro | `gpt-5.5-pro` | "Version of GPT-5.5 that produces smarter and more precise responses." | 1.050.000 | 128.000 | $30 / $180 | [O8] |
| GPT-5.4 | `gpt-5.4` | "A more affordable model for coding and professional work." | 1.050.000 | 128.000 | $2,50 / $15 ($0,25) | [O9] |
| GPT-5.4 Pro | `gpt-5.4-pro` | "Version of GPT-5.4 that produces smarter and more precise responses." | 1.050.000 | 128.000 | $30 / $180 | [O10] |
| GPT-5.4 mini | `gpt-5.4-mini` | "Our strongest mini model yet for coding, computer use, and subagents" | 400.000 | 128.000 | $0,75 / $4,50 ($0,075) | [O11] |
| GPT-5.4 nano | `gpt-5.4-nano` | "Our cheapest GPT-5.4-class model for simple high-volume tasks" | 400.000 | 128.000 | $0,20 / $1,25 ($0,02) | [O12] |
| **GPT-5.3-Codex** | `gpt-5.3-codex` | "The most capable agentic coding model to date." / "optimized for agentic coding tasks in Codex or similar environments" (⚠️ zugleich in Codex bei ChatGPT-Login deprecated — siehe „Nicht belegbar/Diskrepanzen") | 400.000 | 128.000 | $1,75 / $14 ($0,175) | [O13], [X2] |

**Ältere, noch gelistete Modelle (Kurzform; alle [O1]/[O2] + jeweilige Modellseite [O14–O25]):** GPT-5.2 ($1,75/$14; OpenAI: "We recommend using the latest GPT-5.6."), GPT-5.2 Pro ($21/$168), GPT-5.1 ($1,25/$10; "The best model for coding and agentic tasks with configurable reasoning effort"), GPT-5 ($1,25/$10), GPT-5 Pro ($15/$120), GPT-5 mini ($0,25/$2), GPT-5 nano ($0,05/$0,40), o3 ($2/$8; "Reasoning model for complex tasks, succeeded by GPT-5"), o3-pro ($20/$80), GPT-4.1 ($2/$8; "Smartest non-reasoning model", Kontext 1.047.576), GPT-4.1 mini ($0,40/$1,60), GPT-4o mini ($0,15/$0,60; Kontext 128.000).

**Deprecations (relevant, weil noch oft referenziert) [O26]:** `gpt-5.1-codex`, `gpt-5.1-codex-max`, `gpt-5.2-codex` → Abschaltung 23.07.2026, Ersatz GPT-5.5; `gpt-5.1-codex-mini` → Ersatz GPT-5.4 mini. `gpt-5-codex` und `codex-mini-latest` ebenfalls deprecated [O3].

### 1.3 Google (Gemini)

Hinweis: Die früher aktuellen „Gemini 3 Pro Preview" und „Gemini 3.1 Flash-Lite Preview" sind auf der offiziellen Modellseite explizit als **"Shut down"** markiert [G1]. Aktuelle Generation:

| Modell | Modell-ID | Positionierung laut Google (wörtlich) | Kontextfenster (In/Out) | Preis In/Out pro MTok (Paid Tier, Standard) | Quelle |
|---|---|---|---|---|---|
| **Gemini 3.5 Flash** (Stable) | `gemini-3.5-flash` | "Most intelligent model for sustained frontier performance on agentic and coding tasks." / Pricing-Seite: "Our most intelligent model built for speed, combining frontier intelligence with superior search and grounding." | 1.048.576 / 65.536 | $1,50 / $9,00 (inkl. Thinking-Tokens); Free Tier vorhanden; Batch/Flex: $0,75/$4,50 | [G1], [G2], [G3] |
| **Gemini 3.1 Flash-Lite** (Stable) | `gemini-3.1-flash-lite` | "Frontier-class performance rivaling larger models at a fraction of the cost." / "Our most cost-efficient model, optimized for high-volume agentic tasks, translation, and simple data processing." | 1.048.576 / 65.536 | $0,25 (Text/Bild/Video) bzw. $0,50 (Audio) / $1,50; Free Tier vorhanden | [G1], [G2], [G4] |
| **Gemini 3.1 Pro Preview** | `gemini-3.1-pro-preview` (auch `…-customtools`) | "Advanced intelligence, complex problem-solving skills, and powerful agentic and vibe coding capabilities." / "…the best model family in the world for multimodal understanding, agentic capabilities, and vibe-coding." | 1.048.576 / 65.536 | Gestaffelt nach Promptlänge: In $2,00 (≤200k) / $4,00 (>200k); Out $12,00 (≤200k) / $18,00 (>200k); kein Free Tier | [G1], [G2], [G5] |

Bemerkenswert: Googles als "most intelligent" positioniertes Modell ist ein **Flash**-Modell (3.5 Flash), während das Pro-Modell (3.1 Pro) im Preview-Status ist [G1].

**Ältere, noch gelistete 2.5-Familie [G1], [G2], [G6–G8]:** Gemini 2.5 Pro ("Our most advanced model for complex tasks…", In $1,25/$2,50 gestaffelt, Out $10/$15), Gemini 2.5 Flash ("best price-performance…", $0,30/$2,50), Gemini 2.5 Flash-Lite ("fastest and most budget-friendly…", $0,15/$1,25). Alle 1.048.576/65.536 Tokens.

Knowledge-Cutoff aller gelisteten Gemini-Modelle inkl. 3.5/3.1: Januar 2025; „Latest update" 3.5 Flash und 3.1 Flash-Lite = Mai 2026, 3.1 Pro Preview = Februar 2026 [G3–G5].

### 1.4 xAI (Grok) — teilverifiziert

| Modell | Modell-ID | Positionierung | Kontextfenster | Preis In/Out pro MTok | Quelle |
|---|---|---|---|---|---|
| **Grok 4.5** | `grok-4.5` (Aliase `grok-4.5-latest`, `grok-build-latest`) | ⚠️ Kein offizieller xAI-Marketingtext verifizierbar (x.ai-News-Seite blockt mit 403). Prominente "Meet grok-4.5"-Platzierung auf der xAI-Modellübersicht. Fremdbeschreibung durch Cursor: "Cursor's flagship model. The smartest model Cursor has trained, built for the hardest tasks." | 500.000 Tokens (`maxPromptLength: 500000`) | $2,00 / $6,00 ($0,50 cached In) | [XA1], [XA2]; Cursor-Zitat: [CU2] |

Geschwister-Modelle auf derselben Seite: `grok-4.3` und `grok-4.20` mit 1M Kontext, aber niedrigerem Preis (~$1,25/$2,50) [XA1].

### 1.5 Meta (Llama) — ÜBERSPRUNGEN

Kein stabiler, aktuell gepflegter offizieller Llama-Produktpfad auffindbar: `ai.meta.com/llama/` und `www.llama.com` enden nach 301-Redirect-Ketten auf der generischen Entwickler-Hub-Seite `developer.meta.com/ai/` ohne klares aktuelles Flaggschiff-Modell mit Kontext/Lizenz an einer Stelle. Gemäß Aufgabenstellung („nur falls schnell belegbar") weggelassen statt geraten.

---

## TEIL 2 — MODELLWAHL INNERHALB DER CODING-TOOLS (offizielle Guidance)

### 2.1 Claude Code

- **Default-Modell hängt vom Account-Typ ab [C1]:** Opus 4.8 für Max, Team Premium, Enterprise pay-as-you-go, Anthropic API, AWS/Bedrock, Google Cloud Agent Platform; **Sonnet 5** für Pro, Team Standard, Enterprise-Subscription-Seats; Sonnet 4.5 auf Microsoft Foundry. **Fable 5 ist auf keinem Account-Typ Default** — wörtlich: "Fable 5 is not the default model. Select it with `/model fable`." [C1]
- **/model-Kommando [C1]:** `/model <alias|name>` wechselt sofort; `/model` ohne Argument öffnet Picker (Enter = wechseln + als Default speichern, `s` = nur für die Session). Prioritätsreihenfolge: `/model` in Session → `--model`-Flag → `ANTHROPIC_MODEL`-Env-Var → `model` in Settings.
- **Aliase [C1]:** `best` ("Uses Fable 5 where your organization has access to it, otherwise the latest Opus model"), `fable` ("for your hardest and longest-running tasks"), `opus` ("for complex reasoning tasks"), `sonnet` ("for daily coding tasks"), `haiku` ("fast and efficient … for simple tasks"), `opusplan` (Opus im Plan-Modus, Sonnet in der Ausführung).
- **Wann welches Modell (offizielle Guidance):** Fable 5: "the most capable model in Claude Code, suited to tasks larger than a single sitting. It sustains long autonomous sessions, investigates before acting, and verifies its work more often than smaller models." [C1] — Costs-Doku: "Sonnet handles most coding tasks well and costs less than Opus. Reserve Opus for complex architectural decisions or multi-step reasoning." Agent-Teams: "Use Sonnet for teammates." Subagenten: "For simple subagent tasks, specify `model: haiku`." [C2]
- **Effort/Thinking [C1], [A8], [A9]:** Effort-Stufen `low/medium/high/xhigh/max` für Fable 5, Sonnet 5, Opus 4.8, Opus 4.7 (Opus 4.6/Sonnet 4.6 ohne `xhigh`). Default-Effort: `high` (Fable 5, Sonnet 5, Opus 4.8, Opus 4.6, Sonnet 4.6), `xhigh` bei Opus 4.7. Konfiguration via `/effort`, Pfeiltasten im `/model`-Picker, `--effort`, `CLAUDE_CODE_EFFORT_LEVEL`, `effortLevel`-Setting oder Skill-/Subagent-Frontmatter. Zusätzlich `ultracode` (Claude-Code-spezifisch: sendet `xhigh` + orchestriert "dynamic workflows"). Extended Thinking bei Fable 5 nicht abschaltbar (immer adaptiv).

### 2.2 Codex CLI (OpenAI)

- **Default:** Quickstart-Terminal-Illustration (v0.143.0) zeigt zweifach `model: gpt-5.6-sol medium` — also GPT-5.6 Sol mit Reasoning-Effort „medium" [X1]. Offizielle Aussage: "Start with the default Power setting, which uses `gpt-5.6-sol` with medium reasoning." [X2] Config-Beispiel: `model = "gpt-5.6"` in `config.toml` (Alias löst auf `gpt-5.6-sol` auf) [X2].
- **/model:** "In an interactive CLI session, use `/model` to switch models or adjust reasoning effort." Alternativ `codex --model <id>` / `-m`, non-interaktiv `codex exec -m <id> "…"` [X2].
- **Effort-Leiter im interaktiven Selector (gpt-5.6-sol):** Low → Medium (Default) → High → Extra high → Max → **Ultra** ("Maximum reasoning with automatic task delegation" = Subagenten, keine reine Reasoning-Stufe) [X1].
- **Empfohlene Modelle [X2]:** 5.6 Sol ("Flagship … strongest capability for complex coding, computer use, research, and cybersecurity"), 5.6 Terra ("Balanced … competitive with GPT-5.5 at a lower cost"), 5.6 Luna ("Fast and affordable … lowest cost in the family"), 5.5 (Vorgänger-Frontier), 5.3 Codex Spark (`gpt-5.3-codex-spark`, "Text-only research preview model optimized for near-instant, real-time coding iteration. Available to ChatGPT Pro users."). Wörtliche Wahl-Guidance: "Codex offers three GPT-5.6 models: **Sol** for detail and polish, **Terra** as the everyday workhorse, and **Luna** for clear, repeatable work. If you are unsure, start with Sol."
- **Cloud-Tasks:** "Currently, you can't change the default model for Codex cloud tasks" (fix, nicht wählbar) [X2].

### 2.3 Cursor

- **Modell-Picker:** bietet Modelle von Anthropic (u. a. `claude-fable-5`, `claude-sonnet-5`, `claude-opus-4-8`, ältere Opus/Sonnet/Haiku), OpenAI (u. a. `gpt-5.6-sol/terra/luna`, `gpt-5.3-codex`, ältere 5.x), Google (u. a. `gemini-3-5-flash`, `gemini-3-1-pro`), xAI (`grok-4-5`), Cursor-eigene Modelle (`composer-1`, `composer-2-5`), Z.ai (`glm-5-2`), Moonshot (`kimi-k2-7-code`) — alle IDs im Roh-HTML der Docs verifiziert [CU1].
- **Auto-Modus (wörtlich):** "Auto allows Cursor to select models that balance intelligence, cost efficiency, and reliability. It is useful for everyday tasks." [CU1] / "If you selected Auto, Cursor picks the model for each request and the specific model used can vary between conversations." [CU2] Auto hat feste Token-Preise unabhängig vom dahinterliegenden Modell; Auto/First-Party-Requests sind von der „Cursor Token Rate"-Gebühr für Dritt-Modelle ausgenommen [CU1].
- **Offizielle „Which model should I use?"-Guidance (wörtlich) [CU2]:** "**Auto** … Good for everyday tasks." / "**Premium** selects the most capable models for you. Recommended for complex tasks." / "**Grok 4.5** is Cursor's flagship model. The smartest model Cursor has trained, built for the hardest tasks." / "**Composer** is Cursor's fast, cost-efficient model. Capable for most tasks, and built for interactive coding." / "**Claude Opus** and **GPT Codex** handle complex, multi-step tasks well." / "Some users also prefer **Gemini Pro** models." Zusätzlich [CU1]: "Grok 4.5 is jointly trained by Cursor and SpaceXAI for long-running coding and knowledge work."

### 2.4 Aider

- **Model-agnostisch (wörtlich):** "Aider can connect to most LLMs for AI pair programming." [AI1]
- **Empfohlene Modelle laut Docs ("Best models", wörtlich) [AI1]:** "Aider works best with these models, which are skilled at editing code:" Gemini 2.5 Pro, DeepSeek R1 and V3, Claude 3.7 Sonnet, OpenAI o3, o4-mini and GPT-4.1. ⚠️ Diese Liste nennt Modelle von 2025 und wirkt gegenüber dem Leaderboard veraltet (kein Datum auf der Seite) — siehe „Nicht belegbar".
- **Leaderboard [AI2]:** "Aider's polyglot benchmark tests LLMs on 225 challenging Exercism coding exercises across C++, Go, Java, JavaScript, Python, and Rust." Fußzeile: "By Paul Gauthier, last updated November 20, 2025." Top-Einträge (exakt aus der Tabelle): gpt-5 (high) 88,0 % / $29,08 (2025-08-23); gpt-5 (medium) 86,7 % / $17,69; o3-pro (high) 84,9 % / $146,32; gemini-2.5-pro-preview-06-05 (32k think) 83,1 % / $49,88; gpt-5 (low) 81,3 % / $10,37; o3 (high) 81,3 % / $21,23; grok-4 (high) 79,6 % / $59,62. ⚠️ Leaderboard enthält damit KEINE der Juli-2026-Spitzenmodelle (Fable 5, GPT-5.6, Gemini 3.5) — Stand November 2025.
- **Mechanik der Modellwahl [AI3]:** API-Key per Env-Var (z. B. `ANTHROPIC_API_KEY`) oder Flag (`--anthropic-api-key`); Modellliste via `aider --list-models anthropic/`; Auswahl via `aider --model <model-name>`; persistente/erweiterte Einstellungen (z. B. Thinking-Token-Budgets) in `.aider.model.settings.yml`. Docs-Beispielkommentar: "# Aider uses Claude 3.7 Sonnet by default" (ebenfalls mutmaßlich veralteter Doc-Stand, siehe „Nicht belegbar").

### 2.5 Antigravity CLI (Google)

Quelle: antigravity.google/docs/models + /docs/plans — JS-SPA, Inhalt via r.jina.ai-Reader gelesen, Original-URLs HTTP 200 [AG1], [AG2]. Wörtlich: "For the core reasoning model, Antigravity offers leading frontier models. Availability depends on your plan:"

| Plan-Stufe | Verfügbare Kern-Modelle | Quelle |
|---|---|---|
| **Standard** | Gemini 3.5 Flash, Gemini 3.1 Pro | [AG1] |
| **Google AI Pro** | Gemini 3.5 Flash, Gemini 3.1 Pro | [AG1] |
| **Google AI Ultra** | Gemini 3.5 Flash, Gemini 3.1 Pro, **Claude Sonnet 4.6 (thinking)**, **Claude Opus 4.6 (thinking)**, **GPT-OSS-120b** | [AG1] |
| **Enterprise** | Gemini 3.5 Flash, Gemini 3.1 Pro | [AG1] |

- Drittanbieter-Modelle (Claude, GPT-OSS) gibt es also NUR auf Ultra: "Access to third-party models" [AG2].
- Quoten (nur qualitativ publiziert) [AG2]: Ultra = "The highest, most generous quota, refreshed every five hours" + "Highest weekly rate limits"; Pro = "High, generous quota, refreshed every five hours until weekly limit reached"; Standard = "Meaningful quota, refreshed weekly". Overages via gekaufte AI-Credits (Setting „AI Credit Overages": Never/Always). Kein Bring-your-own-Key.
- Internes Zusatzmodell (nicht wählbar): **Nano Banana 2** — "Used by the generative image tool when the Agent wants to produce a UI mockup, needs images to populate a web page or application, generate system or architecture diagrams…" [AG1]
- Naming-Hinweis: Antigravity nennt das Modell „Gemini 3.1 Pro" (ohne „Preview"), die API-Doku „Gemini 3.1 Pro Preview" (`gemini-3.1-pro-preview`) — vermutlich dasselbe Modell, aber nirgends explizit gleichgesetzt [AG1], [G5].

---

## TEIL 3 — EINORDNUNG FÜR VISUALISIERUNG

Kosten-Tier rein aus den API-Listenpreisen abgeleitet (grobe Bänder über alle Anbieter: **günstig** ≈ Output ≤ $6/MTok, **mittel** ≈ Output $9–$15/MTok, **teuer** ≈ Output ≥ $18/MTok). Capability-Tier NUR aus der Anbieter-Positionierung abgeleitet (Spitze = "flagship"/"most intelligent"/"most capable"; stark = "balanced"/"best combination"; Einstieg = "fastest"/"cheapest"/"cost-efficient") — KEINE eigenen Benchmark-Urteile.

| Modell | Anbieter | Preis In/Out (MTok) | Kosten-Tier | Capability-Tier (laut Anbieter-Positionierung) | Quelle |
|---|---|---|---|---|---|
| Claude Fable 5 | Anthropic | $10 / $50 | teuer | Spitze ("most capable widely released model") | [A2], [A3] |
| Claude Mythos 5 | Anthropic | $10 / $50 (lt. Plattform-Docs) | teuer | Spitze (teilt Fable-5-Fähigkeiten; invitation-only) | [A1], [A7] |
| Claude Opus 4.8 | Anthropic | $5 / $25 | teuer | Spitze ("premium model for serious coding", "complex agentic coding") | [A1], [A5] |
| Claude Sonnet 5 | Anthropic | $2/$10 (Intro) → $3/$15 | mittel | stark ("best combination of speed and intelligence") | [A1], [A3] |
| Claude Haiku 4.5 | Anthropic | $1 / $5 | günstig | Einstieg ("fastest", aber lt. Anbieter "near-frontier intelligence") | [A1], [A6] |
| GPT-5.6 Sol | OpenAI | $5 / $30 | teuer | Spitze ("flagship model for complex reasoning and coding") | [O4] |
| GPT-5.6 Terra | OpenAI | $2,50 / $15 | mittel | stark ("balances intelligence and cost") | [O5] |
| GPT-5.6 Luna | OpenAI | $1 / $6 | günstig | Einstieg ("optimized for cost-sensitive workloads", nano-Tier-Äquivalent) | [O6] |
| GPT-5.5 | OpenAI | $5 / $30 | teuer | Spitze (Vorgänger-Frontier: "new class of intelligence") | [O7] |
| GPT-5.5 Pro | OpenAI | $30 / $180 | teuer (Maximum im Feld) | Spitze ("smarter and more precise responses") | [O8] |
| GPT-5.4 | OpenAI | $2,50 / $15 | mittel | stark ("more affordable model for coding and professional work") | [O9] |
| GPT-5.4 Pro | OpenAI | $30 / $180 | teuer | Spitze ("smarter and more precise responses") | [O10] |
| GPT-5.4 mini | OpenAI | $0,75 / $4,50 | günstig | Einstieg ("strongest mini model … for coding, computer use, and subagents") | [O11] |
| GPT-5.4 nano | OpenAI | $0,20 / $1,25 | günstig | Einstieg ("cheapest … for simple high-volume tasks") | [O12] |
| GPT-5.3-Codex | OpenAI | $1,75 / $14 | mittel | Spitze für Coding ("most capable agentic coding model to date") | [O13] |
| Gemini 3.5 Flash | Google | $1,50 / $9 | mittel (unteres Band) | Spitze ("Most intelligent model … agentic and coding tasks") | [G1], [G2] |
| Gemini 3.1 Flash-Lite | Google | $0,25 / $1,50 | günstig | Einstieg ("most cost-efficient model") | [G1], [G2] |
| Gemini 3.1 Pro Preview | Google | $2–4 / $12–18 (gestaffelt) | teuer (oberes Band bei >200k) | Spitze ("advanced intelligence … powerful agentic and vibe coding") | [G1], [G2] |
| Grok 4.5 | xAI | $2 / $6 | günstig/mittel (Grenzfall) | nicht eingestuft (kein offizieller xAI-Positionierungstext zugänglich; Cursor nennt es „flagship") | [XA2], [CU2] |

---

## NICHT BELEGBAR / DISKREPANZEN

1. **Mythos-5-Preis widersprüchlich:** Plattform-Docs [A1]/[A3] nennen $10/$50 (identisch mit Fable 5); die Glasswing-Seite [A7] (primär über den Vorgänger „Claude Mythos Preview" geschrieben) nennt $25/$125. Beide Seiten live bei Anthropic — als Diskrepanz berichtet, nicht aufgelöst.
2. **`gpt-5.3-codex` gleichzeitig aktuell und deprecated:** API-Doku [O3]/[O13] listet es als aktuell ("The most capable agentic coding model to date"), die Codex-Produkt-Doku [X2] erklärt es bei ChatGPT-Sign-in für deprecated: "The `gpt-5.2` and `gpt-5.3-codex` models are deprecated in Codex when you sign in with ChatGPT... Some models that are deprecated for ChatGPT sign-in may still be available in the API." Beide Aussagen offiziell, gleichzeitig live.
3. **xAI-Positionierungszitat:** `x.ai/api` und `x.ai/news/grok-4-5` liefern HTTP 403 (Bot-Block) — kein offizielles Marketing-Zitat für Grok 4.5 zitierbar; nur technische Daten von docs.x.ai belegt.
4. **Meta Llama komplett:** Redirect-Ketten enden auf generischem Entwickler-Hub; aktuelles Flaggschiff/Kontext/Lizenz nicht an einer offiziellen Stelle belegbar → übersprungen.
5. **Aider-Doku-Frische:** „Best models"-Liste [AI1] und der Default-Kommentar „Claude 3.7 Sonnet by default" [AI3] nennen 2025er-Modelle; kein Last-Updated-Datum auf diesen Seiten. Leaderboard [AI2] explizit „last updated November 20, 2025" — enthält keine Juli-2026-Modelle.
6. **Antigravity-Quoten:** Nur qualitative Angaben ("highest", "meaningful"), keine harten Request-Zahlen publiziert [AG2]. Ebenso keine Modell-ID-Strings für die Ultra-Drittmodelle (nur Anzeigenamen).
7. **OpenAI-Launch-Daten:** Docs nennen Knowledge-Cutoffs (GPT-5.6-Familie = 16.02.2026; GPT-5.5 = 01.12.2025; GPT-5.4/5.3-Codex/5.2 = 31.08.2025), aber keine Announce-Daten; openai.com (News/Pricing) blockt mit 403.
8. **GPT-5.3-Codex-Spark:** nur Name + Einzeiler in der Codex-Empfehlungsliste [X2]; keine Kontext-/Preisdaten auffindbar.
9. **anthropic.com/claude/sonnet:** Marketing-Seite lieferte inkonsistente Inhalte (Headline „Sonnet 4.6" vs. Body „Sonnet 5") — vermutlich Caching-Artefakt; Plattform-Docs + Launch-Post [A4] als maßgeblich verwendet.
10. **claude.com/pricing** (200): zeigt nur Consumer-Abos (Free/Pro/Max/Team), keine API-Token-Preise — nicht als Preisquelle nutzbar.
11. **Cursor „Auto"-Interna:** Welche Modelle Auto konkret nutzt, legt Cursor bewusst nicht offen ("the specific model used can vary between conversations") [CU2] — Community-Spekulation ausgeschlossen.
12. **Gemini 2.5 Pro Batch-Preise:** im Pricing-HTML gesehen ($0,625/$1,25 In, $5,00/$7,50 Out je Band), aber Tabellenstruktur nicht vollständig gegengeprüft — nur mit dieser Einschränkung verwenden.

---

## QUELLENVERZEICHNIS (alle geprüft am 13./14.07.2026)

### Anthropic / Claude Code

| Ref | URL | HTTP | Zugriff |
|---|---|---|---|
| [A1] | https://platform.claude.com/docs/en/about-claude/models/overview | 200 | direkt |
| [A2] | https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5.md | 200 | direkt |
| [A3] | https://platform.claude.com/docs/en/about-claude/pricing | 200 | direkt |
| [A4] | https://www.anthropic.com/news/claude-sonnet-5 | 200 | direkt |
| [A5] | https://www.anthropic.com/claude/opus | 200 | direkt |
| [A6] | https://www.anthropic.com/claude/haiku | 200 | direkt |
| [A7] | https://anthropic.com/glasswing | 200 | direkt |
| [A8] | https://platform.claude.com/docs/en/build-with-claude/effort | 200 | direkt |
| [A9] | https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking | 200 | direkt |
| [C1] | https://code.claude.com/docs/en/model-config | 200 | direkt |
| [C2] | https://code.claude.com/docs/en/costs | 200 | direkt |
| [C3] | https://code.claude.com/docs/en/best-practices | 200 | direkt |

### OpenAI / Codex CLI

| Ref | URL | HTTP | Zugriff |
|---|---|---|---|
| [O1] | https://developers.openai.com/api/docs/models (Redirect-Ziel von platform.openai.com/docs/models, 301→200) | 200 | direkt |
| [O2] | https://developers.openai.com/api/docs/pricing | 200 | direkt |
| [O3] | https://developers.openai.com/api/docs/models/all | 200 | direkt (Tabellen z. T. via r.jina.ai vollständig gelesen) |
| [O4] | https://developers.openai.com/api/docs/models/gpt-5.6-sol | 200 | direkt |
| [O5] | https://developers.openai.com/api/docs/models/gpt-5.6-terra | 200 | direkt |
| [O6] | https://developers.openai.com/api/docs/models/gpt-5.6-luna | 200 | direkt |
| [O7] | https://developers.openai.com/api/docs/models/gpt-5.5 | 200 | direkt |
| [O8] | https://developers.openai.com/api/docs/models/gpt-5.5-pro | 200 | direkt |
| [O9] | https://developers.openai.com/api/docs/models/gpt-5.4 | 200 | direkt |
| [O10] | https://developers.openai.com/api/docs/models/gpt-5.4-pro | 200 | direkt |
| [O11] | https://developers.openai.com/api/docs/models/gpt-5.4-mini | 200 | direkt |
| [O12] | https://developers.openai.com/api/docs/models/gpt-5.4-nano | 200 | direkt |
| [O13] | https://developers.openai.com/api/docs/models/gpt-5.3-codex | 200 | direkt |
| [O14] | https://developers.openai.com/api/docs/models/gpt-5.2 | 200 | direkt |
| [O15] | https://developers.openai.com/api/docs/models/gpt-5.2-pro | 200 | direkt |
| [O16] | https://developers.openai.com/api/docs/models/gpt-5.1 | 200 | direkt |
| [O17] | https://developers.openai.com/api/docs/models/gpt-5 | 200 | direkt |
| [O18] | https://developers.openai.com/api/docs/models/gpt-5-pro | 200 | direkt |
| [O19] | https://developers.openai.com/api/docs/models/gpt-5-mini | 200 | direkt |
| [O20] | https://developers.openai.com/api/docs/models/gpt-5-nano | 200 | direkt |
| [O21] | https://developers.openai.com/api/docs/models/o3 | 200 | direkt |
| [O22] | https://developers.openai.com/api/docs/models/o3-pro | 200 | direkt |
| [O23] | https://developers.openai.com/api/docs/models/gpt-4.1 | 200 | direkt |
| [O24] | https://developers.openai.com/api/docs/models/gpt-4.1-mini | 200 | direkt |
| [O25] | https://developers.openai.com/api/docs/models/gpt-4o-mini | 200 | direkt |
| [O26] | https://developers.openai.com/api/docs/deprecations | 200 | direkt |
| [O27] | https://developers.openai.com/api/docs/guides/latest-model | 200 | direkt |
| [X1] | https://learn.chatgpt.com/docs/codex/cli (Redirect-Ziel von developers.openai.com/codex/cli, 308→200) | 200 | direkt |
| [X2] | https://learn.chatgpt.com/docs/models | 200 | direkt |

### Google / Antigravity

| Ref | URL | HTTP | Zugriff |
|---|---|---|---|
| [G1] | https://ai.google.dev/gemini-api/docs/models | 200 | direkt (server-gerendert) |
| [G2] | https://ai.google.dev/gemini-api/docs/pricing | 200 | direkt |
| [G3] | https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash | 200 | direkt |
| [G4] | https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite | 200 | direkt |
| [G5] | https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview | 200 | direkt |
| [G6] | https://ai.google.dev/gemini-api/docs/models/gemini-2.5-pro | 200 | direkt |
| [G7] | https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash | 200 | direkt |
| [G8] | https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-lite | 200 | direkt |
| [AG1] | https://antigravity.google/docs/models | 200 (Roh-HTML = leere JS-SPA-Shell, verifiziert) | Inhalt via r.jina.ai-Reader |
| [AG2] | https://antigravity.google/docs/plans | 200 | Inhalt via r.jina.ai-Reader |
| [AG3] | https://antigravity.google/docs | 200 | Inhalt via r.jina.ai-Reader |

### Cursor / Aider / xAI

| Ref | URL | HTTP | Zugriff |
|---|---|---|---|
| [CU1] | https://cursor.com/docs/models | 200 | direkt (Zitate im Roh-HTML verifiziert) |
| [CU2] | https://cursor.com/help/models-and-usage/available-models | 200 | direkt (Zitate im Roh-HTML verifiziert) |
| [AI1] | https://aider.chat/docs/llms.html | 200 | direkt |
| [AI2] | https://aider.chat/docs/leaderboards/ | 200 | direkt |
| [AI3] | https://aider.chat/docs/llms/anthropic.html | 200 | direkt |
| [XA1] | https://docs.x.ai/docs/models | 200 | direkt (Preise/Kontext im eingebetteten JSON gegengeprüft) |
| [XA2] | https://docs.x.ai/docs/models/grok-4.5 | 200 | direkt |

### Geprüft, aber NICHT als Quelle nutzbar (blockiert/ungeeignet)

| URL | HTTP | Grund |
|---|---|---|
| https://openai.com/api/pricing/ | 403 | Cloudflare-Bot-Block |
| https://openai.com/news | 403 | Bot-Block |
| https://x.ai/api | 403 | Bot-Block |
| https://x.ai/news/grok-4-5 | 403 | Bot-Block |
| https://ai.meta.com/llama/ + https://www.llama.com/ | 200 (301-Ketten) | Redirect-Loop auf generischen Hub, kein Llama-Inhalt |
| https://claude.com/pricing | 200 | Nur Consumer-Abos, keine API-Preise |

**Zählung:** 58 verifizierte, inhaltlich bestätigte Quellen (12 Anthropic/Claude Code + 29 OpenAI/Codex + 11 Google/Antigravity + 7 Cursor/Aider/xAI, jeweils HTTP 200 + Inhalts-Check, minus 1 Doppelnennung [AG3] als Index ohne eigene Fakten = 58 faktentragend).
