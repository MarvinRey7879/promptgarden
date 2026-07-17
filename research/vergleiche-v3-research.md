# Vergleiche v3 — Modell-Recherche (Intelligence-to-Cost + Stärken-Profile)

Stand / Abrufdatum aller Quellen: **2026-07-17**, sofern nicht anders vermerkt.

Methodik Quellenprüfung: jede zitierte URL wurde per `curl -s -o /dev/null -w "%{http_code}" -L -A "Mozilla/5.0" <url>` auf HTTP 200 geprüft UND per WebFetch inhaltlich geladen; die zitierte Zahl musste im geladenen Text wörtlich auffindbar sein (bei JS-lastigen Seiten via r.jina.ai-Reader-Proxy, Original-URL bleibt die zitierte Quelle). Preisangaben stammen ausschließlich von offiziellen Pricing-Seiten oder von Artificial Analysis (artificialanalysis.ai). Bei fehlendem Wert: "n/a" + Grund.

Intelligence-Anker: **Artificial Analysis Intelligence Index v4.1** (9 Evals: GDPval-AA v2, τ³-Banking, Terminal-Bench 2.1, SciCode, HLE, GPQA Diamond, CritPt, AA-Omniscience, AA-LCR). Zugriffshinweis AA: WebFetch und r.jina.ai lieferten für artificialanalysis.ai KEINE Zahlen (JS-Rendering) — alle AA-Werte wurden aus den server-gerenderten `ld+json`-SEO-Blöcken der jeweiligen Seiten per curl + Raw-HTML-Extraktion gelesen (Original-URLs zitiert, alle HTTP 200). Per-Modell-Unterbenchmarks (GPQA/SWE-bench-Spalten) sind auf AA rein client-gerendert und statisch NICHT abrufbar; als AA-Sekundärmetrik wird daher der server-gerenderte AA-Omniscience-Index mitgeführt.

---

## 1. Anthropic

### Claude Fable 5 / Claude Mythos 5
- **Anbieter:** Anthropic
- **API-Modell-ID:** `claude-fable-5` (Mythos 5: `claude-mythos-5`, nur Project Glasswing / limited availability, identische Specs & Preise)
- **Preis:** $10 / MTok Input, $50 / MTok Output (Batch: $5 / $25; Cache-Read $1/MTok)
- **Kontextfenster:** 1M Tokens (Standard), bis zu 128K Output-Tokens
- **Intelligence-Index (Artificial Analysis, v4.1):** **59.86** — Rang **#1** aller gelisteten Modelle (AA-Label: „Claude Fable 5 (with fallback)"; AA-Omniscience 40.15). Quelle: https://artificialanalysis.ai/models/claude-fable-5 — HTTP 200 — Abruf 2026-07-17 (Zahlen aus server-gerendertem ld+json der Seite; WebFetch/Jina lieferten keine Zahlen, Methode dokumentiert)
- **Benchmarks:** in offizieller Ankündigung (anthropic.com/news, docs-Seite "Introducing Claude Fable 5") keine eindeutige SWE-bench-Verified-Zahl im geladenen Text auffindbar — Drittquellen (Blogs) nennen unbelegte ~95%, werden NICHT übernommen (keine offizielle Primärquelle bestätigt). SWE-bench Verified: n/a.
- **Stärken:** anspruchsvollstes Reasoning + Long-Horizon-Agentic-Arbeit; adaptive Thinking immer aktiv (kein Abschalten möglich); Memory-Tool, Code-Execution, Programmatic Tool Calling, Compaction, Vision, Task Budgets (Beta) am Start unterstützt; parallele Sub-Agenten (Managed Agents)
- **Besonderheiten:** Safety-Klassifizierer können Anfragen ablehnen (`stop_reason: "refusal"`), dafür Fallback-Mechanismen (server-seitig/client-seitig/Fallback-Credit); Pflicht 30-Tage-Datenretention (kein Zero-Data-Retention möglich); 1h-Cache-Write $20/MTok, 5m-Cache-Write $12.50/MTok
- **Quellen:**
  - https://platform.claude.com/docs/en/about-claude/pricing — HTTP 200 — Preistabelle wörtlich bestätigt ("Claude Fable 5 | $10 / MTok | ... | $50 / MTok") — Abruf 2026-07-17
  - https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5 — HTTP 200 — Kontextfenster/Output/Feature-Liste bestätigt — Abruf 2026-07-17

### Claude Opus 4.8
- **Anbieter:** Anthropic
- **API-Modell-ID:** `claude-opus-4-8`
- **Preis:** $5 / MTok Input, $25 / MTok Output (Batch: $2.50 / $12.50; Cache-Read $0.50/MTok)
- **Kontextfenster:** 1M Tokens, bis zu 128K Output
- **Intelligence-Index (Artificial Analysis, v4.1):** **55.69** (AA-Label „Claude Opus 4.8 (max)"; AA-Omniscience 27.43). Quelle: https://artificialanalysis.ai/models/claude-opus-4-8 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** offizielle Ankündigung (anthropic.com/news/claude-opus-4-8) nennt konkrete Zahlen nur für Teilbenchmarks: Online-Mind2Web 84%, OSWorld-Verified (Vorgänger Opus 4.7: 82.3%) — **keine eindeutige SWE-bench-Verified-Prozentzahl im geladenen Fließtext** (Vergleichstabelle wurde nicht als Text extrahiert). Drittquellen nennen unbelegt 88.6%; nicht übernommen ohne Primärquellen-Bestätigung. SWE-bench Verified: n/a (offiziell nicht text-verifizierbar).
- **Stärken:** höchste Autonomie/State-of-the-art Long-Horizon-Agentic-Arbeit, Knowledge Work, Memory; ~4x weniger unbemerkte Fehler im eigenen Code als Vorgänger; verwaltet hunderte parallele Sub-Agenten; Fast Mode (2.5x Speed, Premium-Preis $10/$50 In/Out)
- **Besonderheiten:** 1M-Kontext zum Standardpreis (kein Long-Context-Aufschlag); Fast-Mode-Beta; Mid-Conversation-System-Messages (nur dieses Modell)
- **Quellen:**
  - https://platform.claude.com/docs/en/about-claude/pricing — HTTP 200 — Abruf 2026-07-17
  - https://www.anthropic.com/news/claude-opus-4-8 — HTTP 200 — Benchmark-Nennungen (Online-Mind2Web 84%, OSWorld-Verified-Vergleich) bestätigt — Abruf 2026-07-17

### Claude Sonnet 5
- **Anbieter:** Anthropic
- **API-Modell-ID:** `claude-sonnet-5`
- **Preis:** Einführungspreis bis 31.08.2026: $2 / MTok Input, $10 / MTok Output; danach Standard $3 / $15 (Batch: $1/$5 Einführung bzw. $1.50/$7.50 Standard; Cache-Read $0.20 bzw. $0.30/MTok)
- **Kontextfenster:** 1M Tokens, bis zu 128K Output
- **Intelligence-Index (Artificial Analysis, v4.1):** **53.35** (AA-Label „Claude Sonnet 5 (max)"; AA-Omniscience 15.32; AA listet den Einführungspreis $2/$10). Quelle: https://artificialanalysis.ai/models/claude-sonnet-5 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** offizielle Ankündigung (anthropic.com/news/claude-sonnet-5) nennt "substantielle Verbesserung" ggü. Sonnet 4.6, konkrete SWE-bench-Verified-Zahl für Sonnet 5 selbst nicht im geladenen Text (nur Sonnet 4.6 Humanity's-Last-Exam-Werte: 34.6% ohne Tools / 46.8% mit Tools genannt). Drittquellen nennen widersprüchliche Werte (72.7% / 82.1% / 85.2%) — NICHT übernommen, keine Primärquelle. SWE-bench Verified: n/a.
- **Stärken:** "agentischstes" Sonnet-Modell bisher, autonome Planung/Tool-Nutzung (Browser, Terminal); geringere Halluzinations-/Sykophanz-Rate als 4.6; teils Opus-4.8-Niveau bei geringeren Kosten
- **Besonderheiten:** neuer Tokenizer (~30% mehr Tokens für gleichen Text ggü. 4.6); adaptive Thinking standardmäßig an; 1h-Cache-Write $6/MTok
- **Quellen:**
  - https://platform.claude.com/docs/en/about-claude/pricing — HTTP 200 — Abruf 2026-07-17
  - https://www.anthropic.com/news/claude-sonnet-5 — HTTP 200 — Stärken-/Vergleichsaussagen bestätigt — Abruf 2026-07-17

### Claude Haiku 4.5
- **Anbieter:** Anthropic
- **API-Modell-ID:** `claude-haiku-4-5`
- **Preis:** $1 / MTok Input, $5 / MTok Output (Batch: $0.50 / $2.50; Cache-Read $0.10/MTok)
- **Kontextfenster:** 200K Tokens, bis zu 64K Output
- **Intelligence-Index (Artificial Analysis, v4.1):** **23.71** (AA-Label „Claude 4.5 Haiku", non-reasoning; AA trackt separat eine Reasoning-Variante; AA-Omniscience −7.67). Quelle: https://artificialanalysis.ai/models/claude-4-5-haiku — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** n/a — keine offizielle Ankündigungsseite mit Fließtext-Benchmarkzahlen in dieser Recherche geprüft
- **Stärken:** schnellstes und günstigstes aktuelles Claude-Modell für einfache/latenzkritische Aufgaben
- **Besonderheiten:** älterer (Nicht-Fable/Opus-4.7+)-Tokenizer, kein `xhigh`/`max`-Effort
- **Quellen:**
  - https://platform.claude.com/docs/en/about-claude/pricing — HTTP 200 — Abruf 2026-07-17

---

## 2. OpenAI

> Wichtiger Befund: „GPT-5.6" ist kein Einzelmodell, sondern eine Familie aus drei Tiers — **Sol** (Flaggschiff), **Terra** (Mitte), **Luna** (kosteneffizient). API-IDs: `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`. Release: 09.07.2026. Ein `gpt-5.6-codex` existiert NICHT (siehe verworfene Kandidaten); neuestes Codex-Modell ist `gpt-5.3-codex`.

### GPT-5.6 Sol (Flaggschiff)
- **Preis:** $5.00 / MTok Input, $30.00 / MTok Output (Cached Input $0.50 = −90%; Cache-Write $6.25; Batch −50%: $2.50/$15.00)
- **Kontextfenster:** 1.050.000 Tokens; Max Output 128.000; Knowledge-Cutoff 16.02.2026
- **Intelligence-Index (AA v4.1):** **58.89** — Rang **#2** (AA-Label „GPT-5.6 Sol (max)"; AA-Omniscience 21.7). Quelle: https://artificialanalysis.ai/models/gpt-5-6-sol — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offiziell, openai.com/index/gpt-5-6):** GPQA Diamond 94.6% · SWE-Bench Pro 64.6% · FrontierMath Tier 1–3 (v2) 89% · Terminal-Bench 2.1 88.8% (Sol Ultra: 91.9%) · Agents' Last Exam 52.7% (max effort) · DeepSWE v1.1 72.7% · AA Coding Agent Index v1.1: 80. **SWE-bench Verified: n/a** — von OpenAI in dieser Generation nicht mehr publiziert (Wechsel auf SWE-Bench Pro als Headline-Benchmark; wörtlicher Grep der Ankündigung ergab 0 Treffer für „SWE-bench Verified").
- **Stärken:** Coding/Agentic (SoTA Coding Agent Index, Terminal-Bench) · Reasoning/Wissenschaft (FrontierMath, GPQA) · Kontext (1.05M) · Token-Effizienz (laut OpenAI 54% effizienter)
- **Besonderheiten:** neues `max`-Reasoning-Effort-Level (low/medium/high/xhigh/max); `ultra`-Modus mit parallelen Subagenten; explizite Prompt-Cache-Breakpoints (min. 30 Min. Cache-Lebensdauer)
- **Quellen:** https://openai.com/index/gpt-5-6/ — HTTP 200 (via r.jina.ai-Proxy + Raw-HTML-Grep verifiziert) — Abruf 2026-07-17; https://platform.openai.com/docs/pricing (301→developers.openai.com/api/docs/pricing) — HTTP 200 (Raw-JSON-Grep) — Abruf 2026-07-17; https://platform.openai.com/docs/models/gpt-5.6-sol — HTTP 200 — Abruf 2026-07-17

### GPT-5.6 Terra (Mittel-Tier)
- **Preis:** $2.50 / $15.00 (Cached $0.25; Batch $1.25/$7.50)
- **Intelligence-Index (AA v4.1):** **54.95** (137.5 tok/s vs. Sols 53.5 tok/s). Quelle: https://artificialanalysis.ai/models/gpt-5-6-terra — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** GPQA Diamond 92.9% · SWE-Bench Pro 63.4% · FrontierMath 84.9% · Terminal-Bench 2.1 87.4% · Coding Agent Index 77.4
- **Stärken:** ausgewogenes Alltags-Arbeitsmodell; nahe am Sol-Niveau bei halbem Preis
- **Quellen:** wie Sol (gleiche Ankündigungs- und Pricing-Seiten, HTTP 200, Abruf 2026-07-17)

### GPT-5.6 Luna (Mini-Äquivalent)
- **Preis:** $1.00 / $6.00 (Cached $0.10; Batch $0.50/$3.00)
- **Intelligence-Index (AA v4.1):** **51.24** (schnellstes der drei Tiers, 198.7 tok/s). Quelle: https://artificialanalysis.ai/models/gpt-5-6-luna — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** GPQA Diamond 92.3% · SWE-Bench Pro 62.7% · FrontierMath 78.6% · Terminal-Bench 2.1 84.7% · Coding Agent Index 74.6
- **Stärken:** Preis · Speed · behält >92% GPQA bei 1/5 des Sol-Input-Preises
- **Quellen:** wie Sol (HTTP 200, Abruf 2026-07-17)

### gpt-5.3-codex (neuestes Codex-Spezialmodell)
- **Preis:** $1.75 / $14.00 (Cached $0.175)
- **Intelligence-Index (AA v4.1):** n/a — nicht auf Artificial Analysis gelistet (neuestes Codex-Modell dort: GPT-5.2 Codex)
- **Benchmarks:** n/a in dieser Recherche (Pricing-Seite als Quelle; keine Benchmark-Primärquelle geprüft)
- **Besonderheit:** GPT-5.6-Familie ist in Codex CLI/IDE nativ nutzbar — daher kein eigenes 5.6-Codex-Modell in dieser Generation
- **Quellen:** https://platform.openai.com/docs/pricing — HTTP 200 — Abruf 2026-07-17

---

## 3. Google (Gemini)

### Gemini 3.1 Pro (aktuelles Pro-Flaggschiff)
- **Preis:** $2.00 / MTok Input, $12.00 / MTok Output (Prompts ≤200K; darüber $4.00/$18.00; Cached Input $0.20/$0.40 + $4.50/MTok/h Storage; Batch −50%)
- **Kontextfenster:** 1M Input, 64K Output
- **Intelligence-Index (AA v4.1):** **46.46** (AA-Label „Gemini 3.1 Pro Preview" — auf AA weiterhin als Preview getaggt; AA-Omniscience 32.93). Quelle: https://artificialanalysis.ai/models/gemini-3-1-pro-preview — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offizielles DeepMind Model Card + Google-Blog):** SWE-Bench Verified 80.6% · GPQA Diamond 94.3% · MMLU (Multilingual) 92.6% · ARC-AGI-2 77.1%
- **Stärken:** Reasoning/Wissenschaft · Coding/Agentic · Kontext (1M) · nativ multimodal · Mehrsprachigkeit
- **Besonderheiten:** gestaffelte Preise >200K-Prompts; Caching-Rabatt ~90%; Batch −50%
- **Quellen:** https://ai.google.dev/gemini-api/docs/pricing — HTTP 200 — Abruf 2026-07-17; https://deepmind.google/models/model-cards/gemini-3-1-pro/ — HTTP 200 — Abruf 2026-07-17; https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/ — HTTP 200 — Abruf 2026-07-17

### Gemini 3.5 Flash (aktuelles Flash-Tier, GA seit 19.05.2026)
- **Preis:** $1.50 / $9.00 (Batch $0.75/$4.50; Caching $0.15 + $1.00/MTok/h)
- **Kontextfenster:** 1M Input, 64K Output
- **Intelligence-Index (AA v4.1):** **50.20** (liegt auf AA ÜBER Gemini 3.1 Pro Preview; AA-Omniscience 22.68). Quelle: https://artificialanalysis.ai/models/gemini-3-5-flash — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** SWE-Bench Pro 55.1% · ARC-AGI-2 72.1% · Terminal-Bench 2.1 76.2% · MCP Atlas 83.6% · GDPval-AA 1656 Elo. GPQA/AIME/MMLU: n/a (nicht in geprüften offiziellen Quellen)
- **Stärken:** Speed (laut Google „4x schnellere Output-Tokens/s") · Agentic/Coding (schlägt laut Google 3.1 Pro auf Coding-Benchmarks) · natives Computer-Use-Tool · Kontext (1M)
- **Besonderheiten:** ersetzt Gemini 3 Flash (nicht mehr auf Preisseite); 3x teurer als altes Flash — Google positioniert Flash nicht mehr als Billig-Tier
- **Quellen:** https://ai.google.dev/gemini-api/docs/pricing — HTTP 200 — Abruf 2026-07-17; https://deepmind.google/models/model-cards/gemini-3-5-flash/ — HTTP 200 — Abruf 2026-07-17; https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/ — HTTP 200 — Abruf 2026-07-17

---

## 4. xAI (Grok)

> Hinweis: xAI firmiert auf der eigenen Website inzwischen als „SpaceXAI" (26x im Raw-HTML der Grok-4.5-Ankündigung, inkl. `<title>`). Domains x.ai/docs.x.ai unverändert.

### Grok 4.5 (Flaggschiff)
- **API-ID:** `grok-4.5` (Aliases `grok-4.5-latest`, `grok-build-latest`); Release laut Seiten-Metadata 16.07.2026 (Presse teils 08.07. — Diskrepanz vermerkt)
- **Preis:** $2.00 / MTok Input, $6.00 / MTok Output (<200K Kontext; ab 200K: $4.00/$12.00 für den GESAMTEN Request; Cached Input $0.50 = −75%)
- **Kontextfenster:** 500.000 Tokens
- **Intelligence-Index (AA v4.1):** **53.83** (AA-Label „Grok 4.5 (high)"; AA-Omniscience 26.38). Quelle: https://artificialanalysis.ai/models/grok-4-5 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offiziell, x.ai/news/grok-4-5):** SWE-Bench Pro 64.7% · Terminal-Bench 2.1 83.3% · SWE Marathon 29.0% (pass@1) · DeepSWE 1.0 62.0% / 1.1 53% · Token-Effizienz: Ø 15.954 Output-Tokens pro SWE-Bench-Pro-Task (~4.2x effizienter als Opus 4.8 max lt. xAI-Chart). **SWE-bench Verified, GPQA, AIME, MMLU: n/a** — xAI publiziert für Grok 4.5 nur Agentic-Coding-Benchmarks.
- **Stärken:** Coding/Agentic (explizit dafür positioniert) · Preis (günstigstes Modell im eigenen Vergleichschart) · Token-Effizienz/Speed · Kontext (500K)
- **Besonderheiten:** `reasoning_effort` low/medium/high (Default high), Reasoning NICHT abschaltbar; Function Calling + Structured Outputs; KEINE mini/fast/code-Variante von 4.5 (vollständige Modellliste geprüft — `grok-code-fast-1` ist eine ältere, separate Produktlinie)
- **Quellen:** https://x.ai/news/grok-4-5 — HTTP 200 (WebFetch 403, verifiziert via curl-Raw-HTML + Grep, Preiszitat wörtlich: "Grok 4.5 is priced at $2 per million input tokens and $6 per million output tokens.") — Abruf 2026-07-17; https://docs.x.ai/docs/models — HTTP 200 — Abruf 2026-07-17; https://docs.x.ai/developers/models/grok-4.5 — HTTP 200 — Abruf 2026-07-17; https://docs.x.ai/docs/guides/reasoning — HTTP 200 — Abruf 2026-07-17

---

## 5. Zhipu / Z.ai (GLM)

### GLM-4.7 (aktuelles GLM-4.x-Flaggschiff, Release 22.12.2025)
- **Preis (offizielle Z.ai-API):** $0.60 / MTok Input, $2.20 / MTok Output (Vergleich: GLM-4.7-FlashX $0.07/$0.40; GLM-4.7-Flash kostenlos)
- **Kontextfenster:** 200K Input, 128K Max Output
- **Parameter:** 358B total (MoE; aktive Parameter nicht offiziell ausgewiesen)
- **Intelligence-Index (AA v4.1):** **33.70** (Hinweis: das aktuelle Zhipu-Flaggschiff auf AA ist GLM-5.2 mit 51.09 — liegt außerhalb des angefragten 4.x-Scopes; AA-Openness GLM-4.7: 44.44). Quelle: https://artificialanalysis.ai/models/glm-4-7 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offiziell, docs.z.ai + z.ai/blog):** SWE-bench Verified 73.8% · SWE-bench Multilingual 66.7% · Terminal-Bench 2.0 41.0% · LiveCodeBench-v6 84.9 · GPQA Diamond 85.7 · AIME 2025 95.7 · HMMT 97.1 · MMLU-Pro 84.3 · HLE (mit Tools) 42.8% · τ²-Bench 84.7–87.4 · BrowseComp 52.0
- **Stärken:** Coding/Agentic Coding (Open-Weights-Spitzenklasse) · Preis-Leistung · Reasoning/Math · Frontend-/Web-Generierung · Long-Context-Agentic (Preserved/Turn-level Thinking)
- **Besonderheiten:** **Open Weights, MIT-Lizenz** (HF zai-org/GLM-4.7); Self-Hosting via vLLM/SGLang; 44 quantisierte Varianten; kostenlose Flash-Variante. Hinweis: Z.ai hat bereits eine neuere GLM-5.x-Serie (außerhalb des angefragten 4.x-Scopes; GLM-5.2: $1.4/$4.4).
- **Quellen:** https://docs.z.ai/guides/overview/pricing — HTTP 200 — Abruf 2026-07-17; https://docs.z.ai/guides/llm/glm-4.7 — HTTP 200 — Abruf 2026-07-17; https://z.ai/blog/glm-4.7 — HTTP 200 (via r.jina.ai gelesen) — Abruf 2026-07-17; https://huggingface.co/zai-org/GLM-4.7 — HTTP 200 — Abruf 2026-07-17

---

## 6. Moonshot AI (Kimi)

### Kimi K3 (brandneu: Release 16.07.2026)
- **API-ID:** `kimi-k3` (platform.kimi.ai)
- **Preis (offiziell):** $3.00 / MTok Input (Cache-Miss), $15.00 / MTok Output; Cache-Hit-Input $0.30; flache Preise über den gesamten 1M-Kontext
- **Kontextfenster:** 1.048.576 Tokens (1M) nativ; Max Output default 131.072, bis 1M möglich
- **Parameter:** 2.8T total, Sparse MoE (16 von 896 Experten aktiv); KDA-Attention (bis 6.3x schnelleres Decoding bei 1M-Kontext lt. Moonshot); MXFP4/MXFP8
- **Intelligence-Index (AA v4.1):** **57.11** — Rang **#3** aller Modelle (bereits einen Tag nach Release voll indiziert; AA-Omniscience 18.42). Quelle: https://artificialanalysis.ai/models/kimi-k3 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offiziell, kimi.com/blog/kimi-k3):** GPQA Diamond 93.5 · Terminal-Bench 2.1 88.3 · DeepSWE 67.5 · Program Bench 77.8 · SWE Marathon 42.0 · HLE-Full 43.5 · BrowseComp 91.2 · DeepSearchQA 95.0 · MMMU-Pro (Vision) 81.6 · MathVision 94.3. **SWE-bench Verified: n/a — von Moonshot nicht publiziert.**
- **Stärken:** größtes Open-Weight-Modell der Welt (angekündigt) · Agentic (BrowseComp 91.2) · Kontext (1M) · Reasoning (GPQA 93.5) · Multimodal (Vision/Video)
- **Besonderheiten:** ⚠️ **Weights zum Stichtag 17.07.2026 NOCH NICHT herunterladbar** — offizieller Release der Open Weights lt. Moonshot-Blog erst 27.07.2026 (verifiziert: keine K3-Dateien auf huggingface.co/moonshotai oder github.com/MoonshotAI). Bis dahin API-/App-only, NICHT self-hostbar. Lizenz voraussichtlich Modified-MIT (K2-Präzedenz). Automatisches Context-Caching (>90% Hit-Rate bei Coding lt. Moonshot); Thinking permanent aktiv (nur `reasoning_effort="max"`).
- **Quellen:** https://platform.kimi.ai/docs/pricing/chat-k3 — HTTP 200 — Abruf 2026-07-17; https://platform.kimi.ai/docs/guide/kimi-k3-quickstart — HTTP 200 — Abruf 2026-07-17; https://kimi.com/blog/kimi-k3 — HTTP 200 — Abruf 2026-07-17; https://huggingface.co/moonshotai + https://github.com/MoonshotAI — HTTP 200 (Negativ-Verifikation Weights) — Abruf 2026-07-17

### Kimi K2.5 (Vorgänger, weiterhin verfügbar)
- **Preis:** $0.60 / $3.00 (Cache-Hit $0.10)
- **Kontextfenster:** 262.144 Tokens (256K)
- **Parameter:** 1T total / 32B aktiv (MoE), Open Weights (Modified-MIT) bereits verfügbar
- **Intelligence-Index (AA v4.1):** **35.37** (AA-Omniscience −8.12; dazwischen liegt noch Kimi K2.6 mit 44.22). Quelle: https://artificialanalysis.ai/models/kimi-k2-5 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (HF-Modellkarte):** SWE-bench Verified 76.8% · SWE-bench Pro 50.7% · LiveCodeBench v6 85.0 · BrowseComp 60.6 (Agent-Swarm: 78.4)
- **Stärken:** Coding · Agentic Search · Multimodal · Preis-Leistung (deutlich günstiger als K3)
- **Quellen:** https://platform.kimi.ai/docs/pricing/chat-k25 — HTTP 200 — Abruf 2026-07-17; https://huggingface.co/moonshotai/Kimi-K2.5 — HTTP 200 — Abruf 2026-07-17

---

## 7. DeepSeek

### DeepSeek-V4-Pro (Flaggschiff)
- **Preis (offizielle API):** $0.435 / MTok Input (Cache-Miss), $0.87 / MTok Output; Cache-Hit-Input $0.003625 (~99% Rabatt). Budget-Variante V4-Flash: $0.14/$0.28.
- **Kontextfenster:** 1.048.576 Tokens (1M), Max Output 384K
- **Parameter:** 1.6T total / 49B aktiv (MoE), FP4/FP8; **MIT-Lizenz, Open Weights** (HF deepseek-ai/DeepSeek-V4-Pro)
- **Intelligence-Index (AA v4.1):** **44.27** (AA-Label „DeepSeek V4 Pro (max)"; V4 Flash: 40.28; AA-Omniscience −10.02, AA-Openness 50). Quelle: https://artificialanalysis.ai/models/deepseek-v4-pro — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offizielle HF-Modellkarte, Pro-Max-Modus — Herstellerangabe, nicht drittvalidiert):** SWE-bench Verified 80.6% · SWE-bench Pro 55.4% · GPQA Diamond 90.1 · LiveCodeBench 93.5 · MMLU-Pro 87.5 · Codeforces 3206
- **Stärken:** Coding/Agentic (höchster offizieller SWE-bench-Verified-Wert unter Open-Weight-Modellen dieser Recherche) · Reasoning · Kontext (1M) · extreme Preis-Leistung · 3 Reasoning-Modi (Non-think/Think-High/Think-Max)
- **Besonderheiten:** OpenAI- UND Anthropic-kompatible API-Endpunkte; Self-Hosting möglich; alte Modellnamen (`deepseek-chat`/`deepseek-reasoner`) werden am 24.07.2026 auf V4-Flash migriert
- **Quellen:** https://api-docs.deepseek.com/quick_start/pricing/ — HTTP 200 — Abruf 2026-07-17; https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro — HTTP 200 — Abruf 2026-07-17

---

## 8. Meta

### Muse Spark 1.1 (Metas erstes Closed-Weight-Frontier-Modell, Release 09.07.2026)
- **Wichtig:** Muse Spark 1.1 ist real und offiziell verfügbar — aber **NICHT open-weights**. Proprietäres Modell von Meta Superintelligence Labs, zugänglich via Meta AI App (kostenlos, „Thinking"-Modus) und die neue **Meta Model API** (Public Preview seit 09.07.2026).
- **Preis (offiziell, developer.meta.com):** $1.25 / MTok Input, $4.25 / MTok Output (Cached Input $0.15; Web-Search-Grounding $2.50/1.000 Suchen; $20 Startguthaben)
- **Kontextfenster:** 1M Tokens (mit aktivem Context-Management/Compaction)
- **Intelligence-Index (AA v4.1):** **50.62** (AA-Label „Muse Spark 1.1 (xhigh)"; Meta-Zuordnung via meta_small.svg-Logo im Raw-HTML verifiziert; AA-Omniscience 18.0). Quelle: https://artificialanalysis.ai/models/muse-spark-1-1 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** SWE-Bench Verified Hard: 24 von 42 Unique Tasks gelöst (offizieller Meta Evaluation Report, Text-verifiziert) · AIRS-Bench 99.00% Valid-Rate / 0.77 Score. SWE-Bench Pro 61.5, Terminal-Bench 2.1 80.0, DeepSWE 1.1 53.3 — ⚠️ nur als Chart-BILD in Metas offiziellem Blog; Zahlen aus Sekundär-Transkription (officechai.com) übernommen und entsprechend markiert. GPQA/MMLU-Pro: n/a (nicht primärquellen-verifizierbar).
- **Stärken:** Agentic Orchestration (Planung über externe Apps/MCP-Server/Skills, zero-shot) · Multimodal Reasoning · Tool-/Computer-Use · Kontext (1M) · Preis
- **Besonderheiten:** KEIN Self-Hosting; OpenAI-SDK-kompatible API; Context Compaction eingebaut
- **Quellen:** https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/ — HTTP 200 (via Jina-Proxy) — Abruf 2026-07-17; https://developer.meta.com/ai/products/meta-model-api/ — HTTP 200 (via r.jina.ai, Original-URL zitiert) — Abruf 2026-07-17; https://ai.meta.com/static-resource/muse-spark-1-1-evaluation-report — HTTP 200 — Abruf 2026-07-17; Chart-Transkription: https://officechai.com/ai/muse-spark-1-1-benchmarks/ — HTTP 200 — Abruf 2026-07-17

### Llama 4 Maverick (Metas aktuelles Open-Weights-Flaggschiff — Zusatz-Eintrag)
- **Grund:** Muse Spark ist closed — Llama 4 Maverick bleibt Metas neuestes offiziell veröffentlichtes Open-Weights-Flaggschiff (Llama 4 Behemoth weiterhin unveröffentlicht).
- **Preis (günstigster geprüfter großer Hoster: Together AI):** $0.27 / MTok Input, $0.85 / MTok Output (Groq zum Vergleich: $0.50/$0.77)
- **Kontextfenster:** ~1M Tokens (1048K lt. Together, 1040K lt. Fireworks)
- **Parameter:** 400B total / 17B aktiv, 128 Experten (MoE), nativ multimodal
- **Intelligence-Index (AA v4.1):** n/a — kein „Llama"-gebrandetes Modell in den abgerufenen AA-Leaderboard-Daten gefunden (Metas AA-Eintrag ist Muse Spark 1.1)
- **Benchmarks:** LMArena ELO 1417 (offizieller Meta-Blog, Text-verifiziert). SWE-Bench: n/a (kein offizieller Wert); MMLU-Pro/GPQA: n/a (nur Chart-Bild, nicht übernommen)
- **Stärken:** Open Weights/Self-Hosting · Preis (mit Abstand günstigster Eintrag dieser Liste) · Multimodal · Mehrsprachig (12 Sprachen) · Kontext (~1M)
- **Besonderheiten:** Llama 4 Community License (nicht OSI; >700M MAU braucht Sonderlizenz; „Built with Llama"-Pflicht)
- **Quellen:** https://ai.meta.com/blog/llama-4-multimodal-intelligence/ — HTTP 200 — Abruf 2026-07-17; https://www.llama.com/llama4/license/ — HTTP 200 — Abruf 2026-07-17; https://www.together.ai/models/llama-4-maverick — HTTP 200 — Abruf 2026-07-17; https://groq.com/blog/llama-4-now-live-on-groq-build-fast-at-the-lowest-cost-without-compromise — HTTP 200 — Abruf 2026-07-17; https://fireworks.ai/models/fireworks/llama4-maverick-instruct-basic — HTTP 200 — Abruf 2026-07-17

---

## 9. Mistral

### Mistral Large 3 (Flaggschiff, Release 02.12.2025)
- **Modell-Slug:** `mistral-large-3-25-12`
- **Preis (offizielle Modellseite docs.mistral.ai):** $0.50 / MTok Input, $1.50 / MTok Output. ⚠️ Diskrepanz: mistral.ai/pricing enthält veralteten FAQ-Text „$2/$6" (entspricht historischem Large-2-Preis) — die modellversions-spezifische Seite ($0.5/$1.5) wird als maßgeblich behandelt, Diskrepanz transparent vermerkt.
- **Kontextfenster:** 256K (kombiniert Input+Output; separater Max-Output nicht ausgewiesen)
- **Parameter:** 675B total / 41B aktiv (Sparse MoE) + 2.5B Vision-Encoder; **Apache-2.0-Lizenz, Open Weights** (HF mistralai/Mistral-Large-3-675B-Instruct-2512)
- **Intelligence-Index (AA v4.1):** n/a — Mistral Large 3 nicht in den abgerufenen AA-Daten; Mistrals dort gelistetes aktuelles Modell ist **Mistral Medium 3.5 mit Index 29.95** (AA-Omniscience −36.32). Quelle: https://artificialanalysis.ai/models/mistral-medium-3-5 — HTTP 200 — Abruf 2026-07-17
- **Benchmarks:** GPQA Diamond 67.17% (aus HF-Modellkarten-Metadata). SWE-bench/MMLU/AIME: **n/a** — in offiziellen Quellen nur als Chart-Bilder, keine Textzahlen; nicht übernommen. (Vergleich: Mistral Medium 3.5, Coding-Spezialist, hat verifizierte SWE-bench Verified 77.6% bei $1.5/$7.5, Modified-MIT, 128B dense.)
- **Stärken:** Mehrsprachigkeit (Dutzende Sprachen) · Multimodal (Vision) · Agentic (natives Function Calling/JSON) · Preis-Effizienz (MoE) · Open Weights/EU-Hosting
- **Besonderheiten:** Batch −50%; Prompt-Caching −90% auf Cache-Input; Self-Hosting via HF
- **Quellen:** https://docs.mistral.ai/models/mistral-large-3-25-12 — HTTP 200 — Abruf 2026-07-17; https://mistral.ai/pricing/ — HTTP 200 — Abruf 2026-07-17; https://mistral.ai/news/mistral-3/ — HTTP 200 — Abruf 2026-07-17; https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512 — HTTP 200 — Abruf 2026-07-17; https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/ — HTTP 200 — Abruf 2026-07-17

---

## 10. Qwen (Alibaba)

### Qwen3.7-Max (Flaggschiff, Release 20./21.05.2026)
- **API-ID:** `qwen3.7-max` (Snapshot `qwen3.7-max-2026-05-20`), Alibaba Cloud Model Studio / DashScope
- **Wichtig:** **API-only / proprietär** — offizielles Zitat: „our latest proprietary model designed for the agent era". Bruch mit dem „Qwen = immer open-weight"-Muster (Qwen3/3.5/3.6-Linien bleiben open-weight).
- **Preis (offizielle DashScope-Preisseite, International):** Listenpreis $2.50 / MTok Input, $7.50 / MTok Output; aktuell „Limited-time 50% off"-Badge (effektiv ≈$1.25/$3.75 — als zeitlich begrenzter Modifier markiert, nicht als Dauerpreis; OpenRouter zeigt unabhängig $1.475/$4.425). Gratiskontingent 1M Tokens/90 Tage. Hard-verifiziert ist der Listenpreis.
- **Kontextfenster:** 1.000.000 Tokens; Max Output 65.536
- **Intelligence-Index (AA v4.1):** **45.99** (AA-Label „Qwen3.7 Max"; AA-Omniscience 14.08; Vorgänger Qwen3 Max: 24.01). Quelle: https://artificialanalysis.ai/models/qwen3-7-max — HTTP 200 — Abruf 2026-07-17
- **Benchmarks (offizieller Alibaba-Cloud-Blog):** GPQA Diamond 92.4 · SWE-bench Verified 80.4 · SWE-Pro 60.6 · SWE-Multilingual 78.3 · Terminal-Bench 2.0 69.7 · HLE 41.4 · HMMT 2026 97.1 · SuperGPQA 73.6 · MCP-Mark 60.8 / MCP-Atlas 76.4 · WMT24++ 85.8
- **Stärken:** Agentic/Long-Horizon (hunderte–tausende Steps) · Coding (SWE-V 80.4) · Reasoning (GPQA 92.4) · Mehrsprachigkeit (WMT24++, SWE-Multilingual) · Kontext (1M)
- **Besonderheiten:** Hybrid-Reasoning (Thinking/Non-Thinking zum gleichen Preis); Context-Caching-Rabatt (nur Input); Batch −50% (nicht mit Cache kombinierbar); KEIN Self-Hosting für dieses Modell
- **Quellen:** https://www.alibabacloud.com/help/en/model-studio/models — HTTP 200 — Abruf 2026-07-17; https://www.alibabacloud.com/help/en/model-studio/model-pricing — HTTP 200 — Abruf 2026-07-17; https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154 — HTTP 200 — Abruf 2026-07-17; Korroboration: https://openrouter.ai/qwen/qwen3.7-max — HTTP 200 — Abruf 2026-07-17

---

## Gesamttabelle — sortiert nach Intelligence-to-Cost-Ratio

**Formel:** Blended-Preis = (3 × Input-Preis + 1 × Output-Preis) ÷ 4 (Gewichtung 3:1 Input:Output, $/1M Tokens). **Ratio = AA-Intelligence-Index v4.1 ÷ Blended-Preis.** Höher = mehr Intelligenz pro Dollar. Alle Preise = Standard-API-Listenpreise (kein Batch/Cache), Stand 2026-07-17.

| # | Modell | Anbieter | Index (AA v4.1) | Input $/1M | Output $/1M | Blended $/1M | **Ratio** |
|---|--------|----------|------------------|-----------|-------------|--------------|-----------|
| 1 | DeepSeek-V4-Pro | DeepSeek | 44.27 | 0.435 | 0.87 | 0.54 | **81.4** |
| 2 | GLM-4.7 | Zhipu/Z.ai | 33.70 | 0.60 | 2.20 | 1.00 | **33.7** |
| 3 | Kimi K2.5 | Moonshot | 35.37 | 0.60 | 3.00 | 1.20 | **29.5** |
| 4 | Muse Spark 1.1 | Meta | 50.62 | 1.25 | 4.25 | 2.00 | **25.3** |
| 5 | GPT-5.6 Luna | OpenAI | 51.24 | 1.00 | 6.00 | 2.25 | **22.8** |
| 6 | Grok 4.5 | xAI | 53.83 | 2.00 | 6.00 | 3.00 | **17.9** |
| 7 | Gemini 3.5 Flash | Google | 50.20 | 1.50 | 9.00 | 3.38 | **14.9** |
| 8 | Claude Sonnet 5 (Intro-Preis bis 31.08.26) | Anthropic | 53.35 | 2.00 | 10.00 | 4.00 | **13.3** |
| 9 | Qwen3.7-Max (Listenpreis) | Alibaba | 45.99 | 2.50 | 7.50 | 3.75 | **12.3** |
| 10 | Claude Haiku 4.5 | Anthropic | 23.71 | 1.00 | 5.00 | 2.00 | **11.9** |
| 11 | Gemini 3.1 Pro (≤200K) | Google | 46.46 | 2.00 | 12.00 | 4.50 | **10.3** |
| 12 | Mistral Medium 3.5 | Mistral | 29.95 | 1.50 | 7.50 | 3.00 | **10.0** |
| 13 | GPT-5.6 Terra | OpenAI | 54.95 | 2.50 | 15.00 | 5.63 | **9.8** |
| 14 | Kimi K3 | Moonshot | 57.11 | 3.00 | 15.00 | 6.00 | **9.5** |
| — | Claude Sonnet 5 (Standard ab 01.09.26) | Anthropic | 53.35 | 3.00 | 15.00 | 6.00 | 8.9 |
| 15 | Claude Opus 4.8 | Anthropic | 55.69 | 5.00 | 25.00 | 10.00 | **5.6** |
| 16 | GPT-5.6 Sol | OpenAI | 58.89 | 5.00 | 30.00 | 11.25 | **5.2** |
| 17 | Claude Fable 5 | Anthropic | 59.86 | 10.00 | 50.00 | 20.00 | **3.0** |
| — | Mistral Large 3 | Mistral | n/a (nicht auf AA) | 0.50 | 1.50 | 0.75 | n/a |
| — | Llama 4 Maverick (Together AI) | Meta (open weights) | n/a (nicht auf AA) | 0.27 | 0.85 | 0.42 | n/a |

Anmerkungen:
- Grok 4.5: Preis gilt <200K Kontext; ab 200K verdoppelt sich der Blended-Preis auf $6.00 → Ratio 9.0.
- Gemini 3.1 Pro: Preis gilt ≤200K Prompt; darüber $4/$18 → Blended $7.50 → Ratio 6.2.
- Qwen3.7-Max: aktuell „Limited-time 50% off" (effektiv ≈$1.88 Blended → Ratio ≈24.5) — als zeitlich begrenzte Promo nicht in die Haupt-Rangfolge übernommen.
- Kimi K3, Muse Spark 1.1 und Qwen3.7-Max sind (Stand 17.07.2026) NICHT self-hostbar; DeepSeek-V4-Pro, GLM-4.7, Kimi K2.5, Mistral Large 3 und Llama 4 Maverick sind Open Weights.
- AA-Index-Werte beziehen sich auf die von AA getestete Konfiguration (meist höchstes Reasoning-Effort, z.B. „(max)"/"(xhigh)"/"(high)") — reale Kosten steigen bei hohem Effort durch mehr Output-Tokens; die Ratio ist eine Listenpreis-Näherung, keine Messung realer Workload-Kosten.

---

## 2D-Quadrant-Vorschlag

**Achsen:**
- **x = Blended-Preis $/1M (3:1), log₁₀-skaliert** — links günstig, rechts teuer. Empfohlener Achsbereich: $0.4 bis $25 (log₁₀: −0.4 bis +1.4).
- **y = AA Intelligence Index v4.1 (linear)** — empfohlener Achsbereich: 20 bis 62.

**Koordinaten je Modell** (x = log₁₀(Blended), y = Index):

| Modell | Blended $ | x (log₁₀) | y (Index) | Cluster |
|--------|-----------|-----------|-----------|---------|
| Claude Fable 5 | 20.00 | 1.30 | 59.86 | Frontier |
| GPT-5.6 Sol | 11.25 | 1.05 | 58.89 | Frontier |
| Kimi K3 | 6.00 | 0.78 | 57.11 | Frontier |
| Claude Opus 4.8 | 10.00 | 1.00 | 55.69 | Frontier |
| GPT-5.6 Terra | 5.63 | 0.75 | 54.95 | Frontier |
| Grok 4.5 | 3.00 | 0.48 | 53.83 | Preis-Leistung |
| Claude Sonnet 5 (Intro) | 4.00 | 0.60 | 53.35 | Preis-Leistung |
| GPT-5.6 Luna | 2.25 | 0.35 | 51.24 | Preis-Leistung |
| Muse Spark 1.1 | 2.00 | 0.30 | 50.62 | Preis-Leistung |
| Gemini 3.5 Flash | 3.38 | 0.53 | 50.20 | Preis-Leistung |
| Gemini 3.1 Pro | 4.50 | 0.65 | 46.46 | Mittelfeld |
| Qwen3.7-Max | 3.75 | 0.57 | 45.99 | Mittelfeld |
| DeepSeek-V4-Pro | 0.54 | −0.26 | 44.27 | Budget (Ratio-König) |
| Kimi K2.5 | 1.20 | 0.08 | 35.37 | Budget |
| GLM-4.7 | 1.00 | 0.00 | 33.70 | Budget |
| Mistral Medium 3.5 | 3.00 | 0.48 | 29.95 | Budget/Spezialist |
| Claude Haiku 4.5 | 2.00 | 0.30 | 23.71 | Budget |

**Cluster-Vorschlag fürs Diagramm:**

- **„Frontier" (5 Modelle):** Claude Fable 5, GPT-5.6 Sol, Kimi K3, Claude Opus 4.8, GPT-5.6 Terra — Index ≥ ~55, oben rechts im Quadrant. (Kimi K3 ist der Ausreißer: Frontier-Intelligenz zum Sonnet-Standardpreis — visuell hervorheben.)
- **„Preis-Leistungs-Sieger" (5 Modelle):** Grok 4.5, Claude Sonnet 5 (Intro), GPT-5.6 Luna, Muse Spark 1.1, Gemini 3.5 Flash — Index 50–54 bei Blended $2–4; oben Mitte-links. DeepSeek-V4-Pro verdient als **Ratio-König** (81.4, mit Abstand höchste Intelligenz pro Dollar) eine Sonder-Markierung, auch wenn sein absoluter Index (44.3) unter diesem Cluster liegt.
- **„Budget" (5–6 Modelle):** DeepSeek-V4-Pro, GLM-4.7, Kimi K2.5, Claude Haiku 4.5, Mistral Medium 3.5, (optional Llama 4 Maverick/Mistral Large 3 ohne y-Wert als „nicht indiziert" am unteren Rand) — Blended ≤ $3, unten links.
- Gemini 3.1 Pro und Qwen3.7-Max liegen im Mittelfeld (Index 45–47) — je nach Diagramm-Design entweder eigenes Label „Solide Mitte" oder ohne Cluster-Zuordnung plotten.

---

## Verworfene Kandidaten (mit Grund)

| Kandidat | Grund für Ausschluss |
|----------|----------------------|
| **GPT-5.6-Codex / gpt-5.6-codex** | Existiert nicht — offizielle OpenAI-Pricing-Seite listet Codex-Modelle nur bis `gpt-5.3-codex` (583KB-Raw-Page durchsucht, 0 Treffer für 5.4/5.5/5.6-codex); auch AA listet max. GPT-5.2 Codex. GPT-5.6 ist in Codex CLI/IDE nativ nutzbar, aber ohne eigenes Codex-Modell. |
| **Grok 4.5 mini / fast / code** | Existieren nicht — vollständige offizielle Modellliste (docs.x.ai/docs/models, 12 Modelle) enthält keine 4.5-Varianten; `grok-code-fast-1` ist eine ältere separate Produktlinie, kein 4.5-Ableger. Auch auf AA nur „Grok 4 Fast"/„Grok 4.1 Fast". |
| **Gemini 3.5 Pro** | Offiziell angekündigt (I/O, 19.05.2026), aber NICHT GA — Googles eigener Blog: „already being used internally … rolling it out next month"; kein Preiseintrag auf ai.google.dev, nicht auf AA. Kein Leak-Ausschluss, sondern Nicht-Verfügbarkeit. |
| **Gemini 3.2 Pro (2M Kontext)** | Nur als unverifiziertes WebSearch-Snippet aufgetaucht; weder auf AA noch auf Google-Preisseite/Model-Cards bestätigt → nicht aufgenommen. |
| **Llama 4 Behemoth** | Weiterhin unveröffentlicht („still in training") → nicht offiziell verfügbar. |
| **GLM-5.x-Serie (GLM-5/5.1/5.2)** | Existiert offiziell und GLM-5.2 (Index 51.09, $1.4/$4.4) wäre Zhipus stärkeres Modell — liegt aber außerhalb des angefragten Scopes „GLM-4.x aktuell"; als Fußnote in Sektion 5 vermerkt. Empfehlung: für das finale Diagramm erwägen, GLM-5.2 statt GLM-4.7 aufzunehmen. |
| **Kimi K3 als „offenes Modell" (Self-Hosting)** | K3 ist offiziell als Open-Weights-Modell ANGEKÜNDIGT, aber die Weights sind erst ab 27.07.2026 verfügbar (verifiziert: keine K3-Dateien auf HF/GitHub am 17.07.) — im Diagramm bis dahin als „API-only, Weights angekündigt" kennzeichnen, nicht als self-hostbar. |
| **Kimi-K3-Benchmarks „FrontierSWE" / „Kimi Code Bench 2.0"** | Nur in Dritt-Blogs genannt, nicht im offiziellen Moonshot-Blog verifizierbar → ausgeschlossen. |
| **SWE-bench-Verified-Zahlen für Fable 5 (~95%), Opus 4.8 (88.6%), Sonnet 5 (72.7–85.2%), GPT-5.6, Grok 4.5** | Keine Primärquellen-Bestätigung: Anthropic-Ankündigungen enthalten die Zahlen nur in nicht-extrahierbaren Vergleichstabellen; OpenAI und xAI publizieren in dieser Generation gar kein SWE-bench Verified mehr (Wechsel auf SWE-Bench Pro). Dritt-Blog-Werte widersprüchlich → n/a statt Übernahme. |
| **Muse Spark 1.1 GPQA (89.5) / MMLU-Pro, Llama 4 Maverick MMLU-Pro (80.5) / GPQA (69.8)** | Nur als Chart-Bilder in Metas offiziellen Blogs bzw. unbelegte Aggregator-Angaben — nicht text-verifizierbar → n/a. |
| **Qwen3.7-Max effektiver Rabattpreis** | 50%-off-Badge offiziell sichtbar, aber der rabattierte Dollarbetrag steht nirgends als Text auf Alibabas Seite → nur Listenpreis hart zitiert, Promo als Modifier vermerkt. |
| **Mistral-Preisangabe $2/$6** | Veralteter FAQ-Text auf mistral.ai/pricing (historischer Large-2-Preis); modellspezifische Seite nennt $0.5/$1.5 → Diskrepanz dokumentiert, Modellseite als maßgeblich gewertet. |
| **AWS-Bedrock-Preise (Llama 4 Maverick)** | JS-gerenderte Preistabelle, nicht text-verifizierbar → Together AI als günstigster verifizierter Hoster verwendet. |
| **VentureBeat (HTTP 429) / Axios (HTTP 403) zu Kimi K3** | Curl-Check nicht bestanden → nicht als Quellen verwendet. |
| **AA-Unterbenchmarks (GPQA/SWE-bench/AIME je Modell)** | Auf artificialanalysis.ai rein client-seitig gerendert (`BAILOUT_TO_CLIENT_SIDE_RENDERING` im Server-HTML) → statisch nicht abrufbar; AA-Omniscience-Index als server-gerenderte Sekundärmetrik ersatzweise erhoben. |

---

## Rohdaten der Recherche-Agenten (Arbeitsdateien, Scratchpad)

- AA-Index: `scratchpad/aa_index.md` (+ Raw-HTML/JSON unter `scratchpad/models/`)
- OpenAI/xAI: `scratchpad/openai_xai.md`
- Google/Meta: `scratchpad/google_meta.md`
- Mistral/Qwen: `scratchpad/mistral_qwen.md`
- Zhipu/Moonshot/DeepSeek: `scratchpad/zhipu_moonshot_deepseek.md`

(Scratchpad-Basis: `C:\Users\marvi\AppData\Local\Temp\claude\C--Users-marvi\ae3b49ca-d756-4259-96c1-aa4b7ed6e88b\scratchpad\`)
