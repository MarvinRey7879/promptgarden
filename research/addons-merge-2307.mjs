// Fügt 4 neue Addons hinzu (Marvin-Wunsch 23.07): superpowers + Serena + Cline + Repomix.
// Quellen (curl 200 + Inhalt geprüft 23.07.2026): GitHub-Repos + GitHub-API-Sterne
// (superpowers 259.667 via API + shields.io „260k" gegengeprüft), oraios.github.io Serena-Doku,
// VS-Code-Marketplace (cline), repomix.com. Anhängen an items, Dedup per id.
import { readFileSync, writeFileSync } from 'node:fs';

const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

// Sprach-unabhängige Fakten
const META = {
  superpowers: { official: false, stars: '259.667', source: 'https://github.com/obra/superpowers' },
  serena: { official: false, stars: '26.767', source: 'https://github.com/oraios/serena' },
  cline: { official: false, stars: '64.956', source: 'https://github.com/cline/cline' },
  repomix: { official: false, stars: '27.334', source: 'https://github.com/yamadashy/repomix' },
};

// Befehle bleiben in allen Sprachen identisch
const CMD = {
  spInstall: '/plugin install superpowers@claude-plugins-official',
  spMarket: '/plugin marketplace add obra/superpowers-marketplace',
  seInstall: 'uv tool install -p 3.13 serena-agent',
  seMcp: 'claude mcp add serena -- serena start-mcp-server --context claude-code --project "$(pwd)"',
  clCli: 'npm i -g cline',
  clSdk: 'npm install @cline/sdk',
  rpNpx: 'npx repomix@latest',
  rpGlobal: 'npm install -g repomix',
};

const C = {
  de: {
    superpowers: {
      name: 'Superpowers', category: 'Skills & Methodik',
      what: 'Ein Skills-Framework plus komplette Entwicklungs-Methodik für Coding-Agenten: Der Agent plant erst, schreibt Tests zuerst (TDD) und arbeitet Aufgaben über Subagenten ab — die passenden Skills lösen automatisch aus.',
      why: 'Eines der meistgesternten Coding-Agent-Projekte auf GitHub (~260k ⭐, seit Oktober 2025), von Jesse Vincent (obra). Läuft mit Claude Code, Codex, Cursor, Antigravity, GitHub Copilot CLI u.a. und ist als Plugin aus Anthropics offiziellem Marketplace installierbar. Open Source (MIT).',
      sourceTitle: 'GitHub: obra/superpowers',
      how: 'Superpowers ist keine einzelne Funktion, sondern eine Sammlung zusammensetzbarer „Skills" plus eine Methodik, die dafür sorgt, dass der Agent sie auch nutzt. Statt sofort Code zu schreiben, tritt der Agent einen Schritt zurück und klärt zuerst, was du eigentlich bauen willst. Nach deiner Design-Freigabe erstellt er einen Umsetzungsplan, der bewusst so klar ist, dass ihn auch ein unerfahrener Entwickler abarbeiten könnte, und betont dabei echtes Rot/Grün-TDD, YAGNI und DRY. Danach läuft ein „subagenten-getriebener" Prozess: Mehrere Agenten arbeiten die einzelnen Aufgaben ab, prüfen und reviewen ihre Arbeit und machen weiter — oft über längere Zeit autonom. Weil die Skills automatisch auslösen, musst du nichts Besonderes tun.',
      setup: [
        `Claude Code (offiziell): \`${CMD.spInstall}\``,
        `Alternativ Superpowers-Marketplace: \`${CMD.spMarket}\`, dann das Plugin von dort installieren`,
        'Andere Harnesses (Codex, Cursor, Antigravity, Copilot CLI, OpenCode, Pi …): eigene Installationswege im README',
        'Nach der Installation triggern die Skills automatisch — kein weiterer Handgriff nötig',
      ],
      whenGood: [
        { title: 'Größere Features sauber durchziehen', example: 'Statt sofort loszucoden erzwingt Superpowers Brainstorming → Design-Freigabe → Plan → TDD — gut für Aufgaben, bei denen Struktur zählt.' },
        { title: 'Lange autonome Läufe', example: 'Der Subagenten-Prozess arbeitet einen abgesegneten Plan teils stundenlang ab, mit Zwischen-Reviews.' },
      ],
      whenBad: [
        { title: 'Schnelle Einzeiler / Wegwerf-Skripte', why: 'Der Methodik-Overhead (Design, Plan, TDD) lohnt sich für triviale Änderungen nicht.', alternative: 'Den Agenten direkt ohne Framework fragen.' },
        { title: 'Team will keine erzwungene Methodik', why: 'Superpowers legt einen bestimmten TDD/YAGNI/DRY-Stil nahe — das passt nicht zu jedem Workflow.', alternative: 'Einzelne Skills gezielt statt des ganzen Frameworks nutzen.' },
      ],
      links: [{ title: 'Installations-Anleitung (README)', url: 'https://github.com/obra/superpowers#claude-code' }],
    },
    serena: {
      name: 'Serena', category: 'MCP',
      what: 'Ein MCP-Toolkit, das deinem Agenten IDE-artige, semantische Code-Werkzeuge gibt — Symbol-genaues Finden, Editieren und Refactoring über Language-Server (LSP) statt blindem Text-Grep.',
      why: '„Die IDE für deinen Agenten": arbeitet auf Symbol-Ebene (Funktionen, Klassen, Referenzen) statt zeilenweise. Das spart Tokens auf großen Codebasen und läuft mit jedem MCP-Client (Claude Code, Codex, Cursor …). Open Source (MIT).',
      sourceTitle: 'GitHub: oraios/serena',
      how: 'Serena hängt sich als MCP-Server an deinen Agenten und stellt Werkzeuge bereit, die eher einer IDE als einer Textsuche gleichen: Symbole finden (`find_symbol`), Referenzen auflösen (`find_referencing_symbols`), einen Symbol-Körper ersetzen (`replace_symbol_body`) und mehr. Grundlage sind Language-Server (LSP), also dieselbe Technik, die auch VS Code für „Gehe zu Definition" nutzt — dadurch arbeitet der Agent auf der relationalen Struktur des Codes statt blind zu grepen. Serena ist modell- und client-agnostisch, läuft im Stdio- oder HTTP-Modus und ist quelloffen. Für agentische Harnesses gibt es passende Kontext-Profile (z.B. `--context claude-code`).',
      setup: [
        `Installieren (via uv): \`${CMD.seInstall}\``,
        `Bei Claude Code registrieren: \`${CMD.seMcp}\``,
        'Ohne feste Installation auch per uvx möglich; alternativ HTTP-Modus starten und dem Client die URL geben',
        'Die passenden Sprach-Server werden je nach Projektsprache automatisch genutzt (LSP)',
      ],
      whenGood: [
        { title: 'Große Codebasen navigieren und refactoren', example: '„Finde alle Aufrufer von X und benenne sie um" läuft symbol-genau über den Language-Server statt über Grep.' },
        { title: 'Token bei der Kontext-Suche sparen', example: 'Serena liest gezielt einzelne Symbole, statt ganze Dateien in den Kontext zu laden.' },
      ],
      whenBad: [
        { title: 'Winzige Projekte / eine Datei', why: 'Der LSP- und MCP-Setup-Overhead lohnt sich bei sehr kleinen Projekten kaum.', alternative: 'Die eingebaute Grep/Glob-Suche des Agenten nutzen.' },
        { title: 'Sprache ohne guten Language-Server', why: 'Serenas Stärke hängt am Language-Server der jeweiligen Sprache — für exotische Sprachen kann sie schwächer sein.', alternative: 'Auf gut unterstützte Sprachen (Python, TypeScript, Go, Rust, Java …) setzen.' },
      ],
      links: [{ title: 'Doku: Clients einrichten', url: 'https://oraios.github.io/serena/02-usage/030_clients.html' }],
    },
    cline: {
      name: 'Cline', category: 'Editor',
      what: 'Ein quelloffener, autonomer Coding-Agent — als VS-Code-Erweiterung, CLI und SDK. Er führt Befehle direkt im Terminal aus, beobachtet die Ausgabe live und reagiert auf Fehler.',
      why: 'Eine der populärsten Open-Source-Optionen für agentisches Coden in der IDE (Apache-2.0). Bring-your-own-Key (Anthropic, OpenAI, lokale Modelle …), getrennter Plan/Act-Modus und MCP-Unterstützung. Früher als „Claude Dev" bekannt.',
      sourceTitle: 'GitHub: cline/cline',
      how: 'Cline ist ein autonomer Coding-Agent, der primär in VS Code lebt, aber auch als CLI und SDK verfügbar ist. Er trennt einen Plan-Modus (Vorgehen abstimmen) vom Act-Modus (umsetzen), editiert Dateien, führt Terminal-Befehle aus und beobachtet deren Ausgabe in Echtzeit — er fängt also Compile-Fehler, fehlgeschlagene Tests oder Server-Abstürze auf, während sie passieren. Cline bringt keinen eigenen Modell-Zugang mit, sondern nutzt deinen API-Key (Anthropic, OpenAI, OpenRouter oder lokale Modelle) und unterstützt MCP-Server für zusätzliche Werkzeuge. Für Automatisierung lässt er sich per CLI auch headless in CI/CD betreiben.',
      setup: [
        'VS Code: Erweiterung „Cline" aus dem Marketplace installieren (Item-ID `saoudrizwan.claude-dev`)',
        `CLI: \`${CMD.clCli}\` — interaktiv oder headless für CI/CD`,
        `SDK: \`${CMD.clSdk}\``,
        'Eigenen API-Key hinterlegen (Anthropic, OpenAI, OpenRouter oder ein lokales Modell)',
      ],
      whenGood: [
        { title: 'Agentisches Coden direkt in VS Code', example: 'Cline plant, editiert Dateien, führt Tests/Builds aus und liest die Terminal-Ausgabe live — mit klarer Plan/Act-Trennung.' },
        { title: 'Volle Kontrolle über Modell und Kosten', example: 'Bring-your-own-Key statt Abo — freie Modellwahl inklusive lokaler Modelle.' },
      ],
      whenBad: [
        { title: 'Kein API-Budget / kein eigener Key', why: 'Cline braucht einen eigenen Modell-Zugang; ohne Key oder Guthaben läuft nichts.', alternative: 'Ein Tool mit eigenem Abo/Kontingent nutzen.' },
        { title: 'Rein terminal-basierter Workflow ohne IDE', why: 'Die Stärke liegt in der VS-Code-Integration; die CLI ist jünger.', alternative: 'Einen dedizierten CLI-Agenten (z.B. Claude Code, Codex) nutzen.' },
      ],
      links: [{ title: 'VS Code Marketplace: Cline', url: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev' }],
    },
    repomix: {
      name: 'Repomix', category: 'Kontext',
      what: 'Packt dein ganzes Repository in eine einzige, KI-freundliche Datei — ideal, um einer LLM oder einem Chat-Modell die komplette Codebasis am Stück zu geben.',
      why: 'Praktisch, wenn du Code außerhalb eines Agenten in ChatGPT, Claude, Gemini & Co. einfügen willst. Zählt Tokens, respektiert .gitignore, kann komprimieren und auf Secrets prüfen. Läuft ohne Installation per npx und auch als Web-Tool (repomix.com). Open Source (MIT).',
      sourceTitle: 'GitHub: yamadashy/repomix',
      how: 'Repomix durchläuft dein Repository und schreibt es in eine einzige, für KI gut lesbare Datei (XML, Markdown oder Klartext). Dabei respektiert es `.gitignore`, zählt die Tokens pro Datei und insgesamt und kann den Code optional per Tree-sitter komprimieren, um Platz zu sparen. Eine eingebaute Secret-Prüfung (Secretlint) warnt vor versehentlich mitgepackten Zugangsdaten. Neben lokalen Ordnern kann es auch Remote-Repos verarbeiten, läuft ohne Installation per `npx`, gibt es als Web-Tool auf repomix.com und lässt sich als MCP-Server an Agenten anbinden.',
      setup: [
        `Ohne Installation: im Projektordner \`${CMD.rpNpx}\``,
        `Global installieren: \`${CMD.rpGlobal}\` (oder \`yarn global add repomix\`)`,
        'Ergebnis: eine Datei (z.B. `repomix-output.xml`) — komplett in ChatGPT/Claude/Gemini einfügen',
        'Online ohne Setup: repomix.com; optional als MCP-Server für Agenten',
      ],
      whenGood: [
        { title: 'Ganze Codebasis in ein Chat-Modell geben', example: 'Ein `npx repomix` erzeugt eine Datei, die du komplett in Claude/ChatGPT einfügst — statt Datei für Datei zu kopieren.' },
        { title: 'Token-Budget im Blick behalten', example: 'Repomix zählt Tokens pro Datei und gesamt und respektiert .gitignore, damit nur Relevantes reinkommt.' },
      ],
      whenBad: [
        { title: 'Agent mit eigener Datei-Suche', why: 'Ein Coding-Agent (Claude Code, Cursor) liest Dateien selbst gezielt — ein gepacktes Gesamt-File ist dann oft unnötig groß.', alternative: 'Den Agenten direkt im Repo arbeiten lassen; für gezielten Kontext ggf. Serena oder Graphify.' },
        { title: 'Sehr großes Monorepo', why: 'Das komplette Repo kann das Kontextfenster sprengen — trotz Kompression.', alternative: 'Per Include-/Ignore-Filter nur die relevanten Ordner packen.' },
      ],
      links: [{ title: 'repomix.com (Web + Doku)', url: 'https://repomix.com/' }],
    },
  },
};

// --- Übersetzungen en/es/fr/zh ---
C.en = {
  superpowers: {
    name: 'Superpowers', category: 'Skills & methodology',
    what: 'A skills framework plus a complete development methodology for coding agents: the agent plans first, writes tests first (TDD) and works through tasks via subagents — the right skills trigger automatically.',
    why: 'One of the most-starred coding-agent projects on GitHub (~260k ⭐, since October 2025), by Jesse Vincent (obra). Works with Claude Code, Codex, Cursor, Antigravity, GitHub Copilot CLI and more, and installs as a plugin from Anthropic’s official marketplace. Open source (MIT).',
    sourceTitle: 'GitHub: obra/superpowers',
    how: 'Superpowers isn’t a single feature but a set of composable "skills" plus a methodology that makes sure the agent actually uses them. Instead of jumping straight into code, the agent steps back and first clarifies what you’re really trying to build. After you sign off on the design, it produces an implementation plan clear enough for an inexperienced engineer to follow, emphasising true red/green TDD, YAGNI and DRY. Then a "subagent-driven" process kicks in: several agents work through the individual tasks, inspect and review their work and keep going — often autonomously for long stretches. Because the skills trigger automatically, you don’t have to do anything special.',
    setup: [
      `Claude Code (official): \`${CMD.spInstall}\``,
      `Or the Superpowers marketplace: \`${CMD.spMarket}\`, then install the plugin from it`,
      'Other harnesses (Codex, Cursor, Antigravity, Copilot CLI, OpenCode, Pi …): separate install paths in the README',
      'After installing, the skills trigger automatically — nothing else to do',
    ],
    whenGood: [
      { title: 'Seeing larger features through cleanly', example: 'Instead of coding right away, Superpowers forces brainstorming → design sign-off → plan → TDD — good for tasks where structure matters.' },
      { title: 'Long autonomous runs', example: 'The subagent process works through an approved plan for hours at a time, with reviews in between.' },
    ],
    whenBad: [
      { title: 'Quick one-liners / throwaway scripts', why: 'The methodology overhead (design, plan, TDD) isn’t worth it for trivial changes.', alternative: 'Just ask the agent directly, without the framework.' },
      { title: 'Team doesn’t want an imposed methodology', why: 'Superpowers nudges you toward a specific TDD/YAGNI/DRY style that doesn’t fit every workflow.', alternative: 'Use individual skills selectively instead of the whole framework.' },
    ],
    links: [{ title: 'Install guide (README)', url: 'https://github.com/obra/superpowers#claude-code' }],
  },
  serena: {
    name: 'Serena', category: 'MCP',
    what: 'An MCP toolkit that gives your agent IDE-like, semantic code tools — symbol-precise finding, editing and refactoring via language servers (LSP) instead of blind text grep.',
    why: '"The IDE for your agent": it works at the symbol level (functions, classes, references) rather than line by line. That saves tokens on large codebases and works with any MCP client (Claude Code, Codex, Cursor …). Open source (MIT).',
    sourceTitle: 'GitHub: oraios/serena',
    how: 'Serena attaches to your agent as an MCP server and exposes tools that resemble an IDE rather than a text search: find symbols (`find_symbol`), resolve references (`find_referencing_symbols`), replace a symbol body (`replace_symbol_body`) and more. It builds on language servers (LSP) — the same tech VS Code uses for "go to definition" — so the agent works on the relational structure of the code instead of grepping blindly. Serena is model- and client-agnostic, runs in stdio or HTTP mode and is open source. Agentic harnesses get matching context profiles (e.g. `--context claude-code`).',
    setup: [
      `Install (via uv): \`${CMD.seInstall}\``,
      `Register with Claude Code: \`${CMD.seMcp}\``,
      'Also possible without a fixed install via uvx; alternatively start HTTP mode and give the client the URL',
      'The right language servers are used automatically depending on the project language (LSP)',
    ],
    whenGood: [
      { title: 'Navigating and refactoring large codebases', example: '"Find all callers of X and rename them" runs symbol-precise via the language server instead of grep.' },
      { title: 'Saving tokens on context lookups', example: 'Serena reads individual symbols on demand instead of loading whole files into context.' },
    ],
    whenBad: [
      { title: 'Tiny projects / a single file', why: 'The LSP and MCP setup overhead barely pays off on very small projects.', alternative: 'Use the agent’s built-in grep/glob search.' },
      { title: 'A language without a good language server', why: 'Serena’s strength depends on the language server for each language — it can be weaker for exotic ones.', alternative: 'Stick to well-supported languages (Python, TypeScript, Go, Rust, Java …).' },
    ],
    links: [{ title: 'Docs: setting up clients', url: 'https://oraios.github.io/serena/02-usage/030_clients.html' }],
  },
  cline: {
    name: 'Cline', category: 'Editor',
    what: 'An open-source, autonomous coding agent — as a VS Code extension, CLI and SDK. It runs commands directly in your terminal, watches the output live and reacts to errors.',
    why: 'One of the most popular open-source options for agentic coding in the IDE (Apache-2.0). Bring-your-own-key (Anthropic, OpenAI, local models …), a separate plan/act mode and MCP support. Formerly known as "Claude Dev".',
    sourceTitle: 'GitHub: cline/cline',
    how: 'Cline is an autonomous coding agent that lives primarily in VS Code but is also available as a CLI and SDK. It separates a plan mode (agree on the approach) from an act mode (do it), edits files, runs terminal commands and watches their output in real time — catching compile errors, failing tests or server crashes as they happen. Cline brings no model access of its own; it uses your API key (Anthropic, OpenAI, OpenRouter or local models) and supports MCP servers for extra tools. For automation it can run headless via the CLI in CI/CD.',
    setup: [
      'VS Code: install the "Cline" extension from the marketplace (item id `saoudrizwan.claude-dev`)',
      `CLI: \`${CMD.clCli}\` — interactive or headless for CI/CD`,
      `SDK: \`${CMD.clSdk}\``,
      'Provide your own API key (Anthropic, OpenAI, OpenRouter or a local model)',
    ],
    whenGood: [
      { title: 'Agentic coding right inside VS Code', example: 'Cline plans, edits files, runs tests/builds and reads the terminal output live — with a clear plan/act split.' },
      { title: 'Full control over model and cost', example: 'Bring-your-own-key instead of a subscription — free model choice including local models.' },
    ],
    whenBad: [
      { title: 'No API budget / no key of your own', why: 'Cline needs its own model access; without a key or credit nothing runs.', alternative: 'Use a tool with its own subscription/quota.' },
      { title: 'A purely terminal-based workflow without an IDE', why: 'Its strength is the VS Code integration; the CLI is younger.', alternative: 'Use a dedicated CLI agent (e.g. Claude Code, Codex).' },
    ],
    links: [{ title: 'VS Code Marketplace: Cline', url: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev' }],
  },
  repomix: {
    name: 'Repomix', category: 'Context',
    what: 'Packs your entire repository into a single, AI-friendly file — ideal for handing an LLM or chat model the whole codebase at once.',
    why: 'Handy when you want to paste code into ChatGPT, Claude, Gemini & co. outside an agent. It counts tokens, respects .gitignore, can compress and check for secrets. Runs without installation via npx and also as a web tool (repomix.com). Open source (MIT).',
    sourceTitle: 'GitHub: yamadashy/repomix',
    how: 'Repomix walks your repository and writes it into a single, AI-readable file (XML, Markdown or plain text). It respects `.gitignore`, counts tokens per file and in total, and can optionally compress the code via Tree-sitter to save space. A built-in secret check (Secretlint) warns about credentials accidentally packed in. Besides local folders it can process remote repos, runs without installation via `npx`, is available as a web tool at repomix.com and can be attached to agents as an MCP server.',
    setup: [
      `No installation: run \`${CMD.rpNpx}\` in the project folder`,
      `Install globally: \`${CMD.rpGlobal}\` (or \`yarn global add repomix\`)`,
      'Result: a single file (e.g. `repomix-output.xml`) — paste it whole into ChatGPT/Claude/Gemini',
      'Online with no setup: repomix.com; optionally as an MCP server for agents',
    ],
    whenGood: [
      { title: 'Handing a whole codebase to a chat model', example: 'One `npx repomix` produces a file you paste in full into Claude/ChatGPT — instead of copying file by file.' },
      { title: 'Keeping an eye on the token budget', example: 'Repomix counts tokens per file and overall and respects .gitignore so only what matters gets in.' },
    ],
    whenBad: [
      { title: 'An agent with its own file search', why: 'A coding agent (Claude Code, Cursor) reads files on demand — a packed all-in-one file is then often needlessly large.', alternative: 'Let the agent work directly in the repo; for targeted context use Serena or Graphify.' },
      { title: 'A very large monorepo', why: 'The whole repo can blow past the context window — even with compression.', alternative: 'Use include/ignore filters to pack only the relevant folders.' },
    ],
    links: [{ title: 'repomix.com (web + docs)', url: 'https://repomix.com/' }],
  },
};

C.es = {
  superpowers: {
    name: 'Superpowers', category: 'Skills y metodología',
    what: 'Un framework de skills más una metodología de desarrollo completa para agentes de programación: el agente planifica primero, escribe los tests antes (TDD) y resuelve las tareas mediante subagentes — las skills adecuadas se activan solas.',
    why: 'Uno de los proyectos de agentes de código con más estrellas en GitHub (~260k ⭐, desde octubre de 2025), de Jesse Vincent (obra). Funciona con Claude Code, Codex, Cursor, Antigravity, GitHub Copilot CLI y más, y se instala como plugin desde el marketplace oficial de Anthropic. Código abierto (MIT).',
    sourceTitle: 'GitHub: obra/superpowers',
    how: 'Superpowers no es una única función, sino un conjunto de «skills» combinables más una metodología que se asegura de que el agente las use. En lugar de lanzarse a escribir código, el agente da un paso atrás y aclara primero qué quieres construir realmente. Tras tu visto bueno al diseño, elabora un plan de implementación lo bastante claro como para que lo siga un desarrollador sin experiencia, poniendo el acento en un TDD rojo/verde real, YAGNI y DRY. Después arranca un proceso «dirigido por subagentes»: varios agentes resuelven las tareas, revisan su trabajo y continúan — a menudo de forma autónoma durante largos periodos. Como las skills se activan solas, no tienes que hacer nada especial.',
    setup: [
      `Claude Code (oficial): \`${CMD.spInstall}\``,
      `O el marketplace de Superpowers: \`${CMD.spMarket}\`, y luego instala el plugin desde ahí`,
      'Otros harnesses (Codex, Cursor, Antigravity, Copilot CLI, OpenCode, Pi …): rutas de instalación propias en el README',
      'Tras instalarlo, las skills se activan solas — no hay que hacer nada más',
    ],
    whenGood: [
      { title: 'Llevar features grandes a buen puerto', example: 'En vez de programar de inmediato, Superpowers obliga a lluvia de ideas → visto bueno del diseño → plan → TDD — útil cuando importa la estructura.' },
      { title: 'Ejecuciones autónomas largas', example: 'El proceso de subagentes resuelve un plan aprobado durante horas, con revisiones intermedias.' },
    ],
    whenBad: [
      { title: 'Líneas rápidas / scripts desechables', why: 'La sobrecarga de la metodología (diseño, plan, TDD) no compensa para cambios triviales.', alternative: 'Pregunta al agente directamente, sin el framework.' },
      { title: 'El equipo no quiere una metodología impuesta', why: 'Superpowers empuja hacia un estilo TDD/YAGNI/DRY concreto que no encaja en todos los flujos.', alternative: 'Usa skills sueltas de forma selectiva en lugar de todo el framework.' },
    ],
    links: [{ title: 'Guía de instalación (README)', url: 'https://github.com/obra/superpowers#claude-code' }],
  },
  serena: {
    name: 'Serena', category: 'MCP',
    what: 'Un toolkit MCP que da a tu agente herramientas de código semánticas al estilo de un IDE — búsqueda, edición y refactorización precisas a nivel de símbolo mediante servidores de lenguaje (LSP) en lugar de un grep de texto a ciegas.',
    why: '«El IDE para tu agente»: trabaja a nivel de símbolo (funciones, clases, referencias) en vez de línea a línea. Ahorra tokens en bases de código grandes y funciona con cualquier cliente MCP (Claude Code, Codex, Cursor …). Código abierto (MIT).',
    sourceTitle: 'GitHub: oraios/serena',
    how: 'Serena se conecta a tu agente como servidor MCP y expone herramientas más parecidas a un IDE que a una búsqueda de texto: encontrar símbolos (`find_symbol`), resolver referencias (`find_referencing_symbols`), reemplazar el cuerpo de un símbolo (`replace_symbol_body`) y más. Se apoya en servidores de lenguaje (LSP) — la misma tecnología que usa VS Code para «ir a la definición» — de modo que el agente trabaja sobre la estructura relacional del código en vez de hacer grep a ciegas. Serena es agnóstica al modelo y al cliente, funciona en modo stdio o HTTP y es de código abierto. Los harnesses agénticos tienen perfiles de contexto propios (p. ej. `--context claude-code`).',
    setup: [
      `Instalar (con uv): \`${CMD.seInstall}\``,
      `Registrar en Claude Code: \`${CMD.seMcp}\``,
      'También posible sin instalación fija con uvx; como alternativa, inicia el modo HTTP y da la URL al cliente',
      'Los servidores de lenguaje adecuados se usan automáticamente según el lenguaje del proyecto (LSP)',
    ],
    whenGood: [
      { title: 'Navegar y refactorizar bases de código grandes', example: '«Encuentra a todos los que llaman a X y renómbralos» se ejecuta con precisión de símbolo vía el servidor de lenguaje en lugar de grep.' },
      { title: 'Ahorrar tokens en las búsquedas de contexto', example: 'Serena lee símbolos concretos bajo demanda en lugar de cargar archivos enteros al contexto.' },
    ],
    whenBad: [
      { title: 'Proyectos diminutos / un solo archivo', why: 'La sobrecarga de configurar LSP y MCP apenas compensa en proyectos muy pequeños.', alternative: 'Usa la búsqueda grep/glob integrada del agente.' },
      { title: 'Un lenguaje sin buen servidor de lenguaje', why: 'La fuerza de Serena depende del servidor de lenguaje de cada lenguaje — puede ser más débil con los exóticos.', alternative: 'Cíñete a lenguajes bien soportados (Python, TypeScript, Go, Rust, Java …).' },
    ],
    links: [{ title: 'Docs: configurar clientes', url: 'https://oraios.github.io/serena/02-usage/030_clients.html' }],
  },
  cline: {
    name: 'Cline', category: 'Editor',
    what: 'Un agente de programación autónomo y de código abierto — como extensión de VS Code, CLI y SDK. Ejecuta comandos directamente en tu terminal, observa la salida en vivo y reacciona a los errores.',
    why: 'Una de las opciones open source más populares para programar de forma agéntica en el IDE (Apache-2.0). Trae-tu-propia-clave (Anthropic, OpenAI, modelos locales …), un modo plan/act separado y soporte de MCP. Antes conocido como «Claude Dev».',
    sourceTitle: 'GitHub: cline/cline',
    how: 'Cline es un agente de programación autónomo que vive sobre todo en VS Code, pero también está disponible como CLI y SDK. Separa un modo plan (acordar el enfoque) de un modo act (ejecutarlo), edita archivos, ejecuta comandos de terminal y observa su salida en tiempo real — detectando errores de compilación, tests fallidos o caídas del servidor según ocurren. Cline no trae acceso a modelos propio; usa tu clave de API (Anthropic, OpenAI, OpenRouter o modelos locales) y admite servidores MCP para herramientas extra. Para automatizar, puede ejecutarse headless vía la CLI en CI/CD.',
    setup: [
      'VS Code: instala la extensión «Cline» desde el marketplace (id de ítem `saoudrizwan.claude-dev`)',
      `CLI: \`${CMD.clCli}\` — interactivo o headless para CI/CD`,
      `SDK: \`${CMD.clSdk}\``,
      'Aporta tu propia clave de API (Anthropic, OpenAI, OpenRouter o un modelo local)',
    ],
    whenGood: [
      { title: 'Programación agéntica dentro de VS Code', example: 'Cline planifica, edita archivos, ejecuta tests/builds y lee la salida del terminal en vivo — con una separación clara plan/act.' },
      { title: 'Control total sobre modelo y coste', example: 'Trae-tu-propia-clave en vez de una suscripción — libre elección de modelo, incluidos los locales.' },
    ],
    whenBad: [
      { title: 'Sin presupuesto de API / sin clave propia', why: 'Cline necesita su propio acceso a modelos; sin clave o saldo no funciona nada.', alternative: 'Usa una herramienta con su propia suscripción/cupo.' },
      { title: 'Un flujo puramente de terminal sin IDE', why: 'Su fuerza es la integración con VS Code; la CLI es más reciente.', alternative: 'Usa un agente CLI dedicado (p. ej. Claude Code, Codex).' },
    ],
    links: [{ title: 'VS Code Marketplace: Cline', url: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev' }],
  },
  repomix: {
    name: 'Repomix', category: 'Contexto',
    what: 'Empaqueta todo tu repositorio en un único archivo apto para IA — ideal para entregar a una LLM o a un modelo de chat toda la base de código de una vez.',
    why: 'Práctico cuando quieres pegar código en ChatGPT, Claude, Gemini y compañía fuera de un agente. Cuenta tokens, respeta .gitignore, puede comprimir y detectar secretos. Funciona sin instalación con npx y también como herramienta web (repomix.com). Código abierto (MIT).',
    sourceTitle: 'GitHub: yamadashy/repomix',
    how: 'Repomix recorre tu repositorio y lo escribe en un único archivo legible por IA (XML, Markdown o texto plano). Respeta `.gitignore`, cuenta los tokens por archivo y en total, y puede comprimir el código opcionalmente con Tree-sitter para ahorrar espacio. Una comprobación de secretos integrada (Secretlint) avisa de credenciales empaquetadas por error. Además de carpetas locales puede procesar repos remotos, funciona sin instalación con `npx`, está disponible como herramienta web en repomix.com y puede conectarse a agentes como servidor MCP.',
    setup: [
      `Sin instalación: ejecuta \`${CMD.rpNpx}\` en la carpeta del proyecto`,
      `Instalar globalmente: \`${CMD.rpGlobal}\` (o \`yarn global add repomix\`)`,
      'Resultado: un único archivo (p. ej. `repomix-output.xml`) — pégalo entero en ChatGPT/Claude/Gemini',
      'En línea y sin configuración: repomix.com; opcionalmente como servidor MCP para agentes',
    ],
    whenGood: [
      { title: 'Entregar una base de código entera a un modelo de chat', example: 'Un `npx repomix` genera un archivo que pegas completo en Claude/ChatGPT — en vez de copiar archivo por archivo.' },
      { title: 'Vigilar el presupuesto de tokens', example: 'Repomix cuenta tokens por archivo y en total y respeta .gitignore para que solo entre lo relevante.' },
    ],
    whenBad: [
      { title: 'Un agente con su propia búsqueda de archivos', why: 'Un agente de código (Claude Code, Cursor) lee archivos bajo demanda — un archivo todo-en-uno suele ser innecesariamente grande.', alternative: 'Deja que el agente trabaje directamente en el repo; para contexto puntual usa Serena o Graphify.' },
      { title: 'Un monorepo muy grande', why: 'El repo completo puede desbordar la ventana de contexto — incluso con compresión.', alternative: 'Usa filtros de inclusión/exclusión para empaquetar solo las carpetas relevantes.' },
    ],
    links: [{ title: 'repomix.com (web + docs)', url: 'https://repomix.com/' }],
  },
};

C.fr = {
  superpowers: {
    name: 'Superpowers', category: 'Skills et méthodologie',
    what: 'Un framework de skills plus une méthodologie de développement complète pour les agents de code : l’agent planifie d’abord, écrit les tests en premier (TDD) et traite les tâches via des sous-agents — les skills adéquates se déclenchent d’elles-mêmes.',
    why: 'L’un des projets d’agents de code les plus étoilés sur GitHub (~260k ⭐, depuis octobre 2025), par Jesse Vincent (obra). Fonctionne avec Claude Code, Codex, Cursor, Antigravity, GitHub Copilot CLI et d’autres, et s’installe en plugin depuis la marketplace officielle d’Anthropic. Open source (MIT).',
    sourceTitle: 'GitHub: obra/superpowers',
    how: 'Superpowers n’est pas une fonction unique mais un ensemble de « skills » composables plus une méthodologie qui garantit que l’agent les utilise. Au lieu de se jeter sur le code, l’agent prend du recul et clarifie d’abord ce que tu veux vraiment construire. Une fois le design validé par toi, il produit un plan de mise en œuvre assez clair pour qu’un développeur inexpérimenté puisse le suivre, en insistant sur un vrai TDD rouge/vert, YAGNI et DRY. Ensuite démarre un processus « piloté par sous-agents » : plusieurs agents traitent les tâches, inspectent et relisent leur travail et continuent — souvent de façon autonome pendant de longues périodes. Comme les skills se déclenchent automatiquement, tu n’as rien de particulier à faire.',
    setup: [
      `Claude Code (officiel) : \`${CMD.spInstall}\``,
      `Ou la marketplace Superpowers : \`${CMD.spMarket}\`, puis installe le plugin depuis celle-ci`,
      'Autres harnesses (Codex, Cursor, Antigravity, Copilot CLI, OpenCode, Pi …) : chemins d’installation propres dans le README',
      'Une fois installées, les skills se déclenchent d’elles-mêmes — rien d’autre à faire',
    ],
    whenGood: [
      { title: 'Mener proprement de grosses fonctionnalités', example: 'Au lieu de coder tout de suite, Superpowers impose brainstorming → validation du design → plan → TDD — utile quand la structure compte.' },
      { title: 'Longues exécutions autonomes', example: 'Le processus de sous-agents traite un plan validé pendant des heures, avec des revues intermédiaires.' },
    ],
    whenBad: [
      { title: 'Petites lignes rapides / scripts jetables', why: 'La surcharge méthodologique (design, plan, TDD) ne vaut pas le coup pour des changements triviaux.', alternative: 'Demande directement à l’agent, sans le framework.' },
      { title: 'L’équipe ne veut pas d’une méthodologie imposée', why: 'Superpowers pousse vers un style TDD/YAGNI/DRY précis qui ne convient pas à tous les workflows.', alternative: 'Utilise des skills isolées de façon ciblée plutôt que tout le framework.' },
    ],
    links: [{ title: 'Guide d’installation (README)', url: 'https://github.com/obra/superpowers#claude-code' }],
  },
  serena: {
    name: 'Serena', category: 'MCP',
    what: 'Une boîte à outils MCP qui donne à ton agent des outils de code sémantiques dignes d’un IDE — recherche, édition et refactorisation précises au niveau des symboles via des serveurs de langage (LSP) plutôt qu’un grep de texte à l’aveugle.',
    why: '« L’IDE de ton agent » : il travaille au niveau des symboles (fonctions, classes, références) plutôt que ligne par ligne. Cela économise des tokens sur les grosses bases de code et fonctionne avec n’importe quel client MCP (Claude Code, Codex, Cursor …). Open source (MIT).',
    sourceTitle: 'GitHub: oraios/serena',
    how: 'Serena se greffe à ton agent comme serveur MCP et expose des outils qui ressemblent davantage à un IDE qu’à une recherche de texte : trouver des symboles (`find_symbol`), résoudre des références (`find_referencing_symbols`), remplacer le corps d’un symbole (`replace_symbol_body`) et plus encore. Elle s’appuie sur des serveurs de langage (LSP) — la même technologie que VS Code pour « aller à la définition » — de sorte que l’agent travaille sur la structure relationnelle du code au lieu de grep à l’aveugle. Serena est agnostique au modèle et au client, tourne en mode stdio ou HTTP et est open source. Les harnesses agentiques disposent de profils de contexte dédiés (p. ex. `--context claude-code`).',
    setup: [
      `Installer (via uv) : \`${CMD.seInstall}\``,
      `Enregistrer dans Claude Code : \`${CMD.seMcp}\``,
      'Possible aussi sans installation fixe via uvx ; en variante, lance le mode HTTP et donne l’URL au client',
      'Les bons serveurs de langage sont utilisés automatiquement selon le langage du projet (LSP)',
    ],
    whenGood: [
      { title: 'Naviguer et refactoriser de grosses bases de code', example: '« Trouve tous les appelants de X et renomme-les » s’exécute au niveau du symbole via le serveur de langage plutôt que grep.' },
      { title: 'Économiser des tokens sur les recherches de contexte', example: 'Serena lit des symboles précis à la demande au lieu de charger des fichiers entiers dans le contexte.' },
    ],
    whenBad: [
      { title: 'Projets minuscules / un seul fichier', why: 'La mise en place LSP et MCP ne se rentabilise guère sur de très petits projets.', alternative: 'Utilise la recherche grep/glob intégrée de l’agent.' },
      { title: 'Un langage sans bon serveur de langage', why: 'La force de Serena dépend du serveur de langage de chaque langage — elle peut être plus faible pour les langages exotiques.', alternative: 'Tiens-t’en aux langages bien pris en charge (Python, TypeScript, Go, Rust, Java …).' },
    ],
    links: [{ title: 'Docs : configurer les clients', url: 'https://oraios.github.io/serena/02-usage/030_clients.html' }],
  },
  cline: {
    name: 'Cline', category: 'Editor',
    what: 'Un agent de code autonome et open source — sous forme d’extension VS Code, de CLI et de SDK. Il exécute des commandes directement dans ton terminal, observe la sortie en direct et réagit aux erreurs.',
    why: 'L’une des options open source les plus populaires pour coder de façon agentique dans l’IDE (Apache-2.0). Apporte-ta-propre-clé (Anthropic, OpenAI, modèles locaux …), un mode plan/act séparé et la prise en charge de MCP. Anciennement « Claude Dev ».',
    sourceTitle: 'GitHub: cline/cline',
    how: 'Cline est un agent de code autonome qui vit surtout dans VS Code, mais est aussi disponible en CLI et en SDK. Il sépare un mode plan (se mettre d’accord sur l’approche) d’un mode act (l’exécuter), édite des fichiers, lance des commandes de terminal et observe leur sortie en temps réel — attrapant les erreurs de compilation, les tests en échec ou les plantages de serveur au fil de l’eau. Cline n’apporte pas d’accès aux modèles ; il utilise ta clé d’API (Anthropic, OpenAI, OpenRouter ou modèles locaux) et prend en charge les serveurs MCP pour des outils supplémentaires. Pour l’automatisation, il peut tourner en headless via la CLI dans le CI/CD.',
    setup: [
      'VS Code : installe l’extension « Cline » depuis la marketplace (id d’élément `saoudrizwan.claude-dev`)',
      `CLI : \`${CMD.clCli}\` — interactif ou headless pour le CI/CD`,
      `SDK : \`${CMD.clSdk}\``,
      'Fournis ta propre clé d’API (Anthropic, OpenAI, OpenRouter ou un modèle local)',
    ],
    whenGood: [
      { title: 'Coder de façon agentique directement dans VS Code', example: 'Cline planifie, édite des fichiers, lance tests/builds et lit la sortie du terminal en direct — avec une séparation nette plan/act.' },
      { title: 'Contrôle total sur le modèle et le coût', example: 'Apporte-ta-propre-clé plutôt qu’un abonnement — libre choix du modèle, y compris local.' },
    ],
    whenBad: [
      { title: 'Pas de budget API / pas de clé à soi', why: 'Cline a besoin de son propre accès aux modèles ; sans clé ni crédit, rien ne tourne.', alternative: 'Utilise un outil avec son propre abonnement/quota.' },
      { title: 'Un workflow purement terminal sans IDE', why: 'Sa force est l’intégration VS Code ; la CLI est plus récente.', alternative: 'Utilise un agent CLI dédié (p. ex. Claude Code, Codex).' },
    ],
    links: [{ title: 'VS Code Marketplace : Cline', url: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev' }],
  },
  repomix: {
    name: 'Repomix', category: 'Contexte',
    what: 'Emballe tout ton dépôt dans un seul fichier adapté à l’IA — idéal pour donner à une LLM ou à un modèle de chat toute la base de code d’un coup.',
    why: 'Pratique quand tu veux coller du code dans ChatGPT, Claude, Gemini & co en dehors d’un agent. Il compte les tokens, respecte .gitignore, peut compresser et détecter des secrets. Fonctionne sans installation via npx et aussi comme outil web (repomix.com). Open source (MIT).',
    sourceTitle: 'GitHub: yamadashy/repomix',
    how: 'Repomix parcourt ton dépôt et l’écrit dans un seul fichier lisible par l’IA (XML, Markdown ou texte brut). Il respecte `.gitignore`, compte les tokens par fichier et au total, et peut compresser le code en option via Tree-sitter pour gagner de la place. Une vérification de secrets intégrée (Secretlint) alerte sur des identifiants embarqués par erreur. Outre les dossiers locaux, il peut traiter des dépôts distants, tourne sans installation via `npx`, existe comme outil web sur repomix.com et peut se brancher aux agents comme serveur MCP.',
    setup: [
      `Sans installation : lance \`${CMD.rpNpx}\` dans le dossier du projet`,
      `Installer globalement : \`${CMD.rpGlobal}\` (ou \`yarn global add repomix\`)`,
      'Résultat : un seul fichier (p. ex. `repomix-output.xml`) — colle-le en entier dans ChatGPT/Claude/Gemini',
      'En ligne sans configuration : repomix.com ; en option comme serveur MCP pour les agents',
    ],
    whenGood: [
      { title: 'Donner toute une base de code à un modèle de chat', example: 'Un `npx repomix` produit un fichier que tu colles en entier dans Claude/ChatGPT — au lieu de copier fichier par fichier.' },
      { title: 'Garder un œil sur le budget de tokens', example: 'Repomix compte les tokens par fichier et au total et respecte .gitignore pour ne garder que l’essentiel.' },
    ],
    whenBad: [
      { title: 'Un agent avec sa propre recherche de fichiers', why: 'Un agent de code (Claude Code, Cursor) lit les fichiers à la demande — un fichier tout-en-un est alors souvent inutilement gros.', alternative: 'Laisse l’agent travailler directement dans le dépôt ; pour du contexte ciblé, utilise Serena ou Graphify.' },
      { title: 'Un très gros monorepo', why: 'Le dépôt complet peut dépasser la fenêtre de contexte — même compressé.', alternative: 'Utilise des filtres d’inclusion/exclusion pour n’emballer que les dossiers utiles.' },
    ],
    links: [{ title: 'repomix.com (web + docs)', url: 'https://repomix.com/' }],
  },
};

C.zh = {
  superpowers: {
    name: 'Superpowers', category: '技能与方法论',
    what: '一个技能框架，加上一整套面向编码智能体的开发方法论：智能体先规划、先写测试（TDD），并通过子智能体逐个完成任务——合适的技能会自动触发。',
    why: 'GitHub 上收藏数最高的编码智能体项目之一（约 26 万 ⭐，自 2025 年 10 月起），作者 Jesse Vincent（obra）。可用于 Claude Code、Codex、Cursor、Antigravity、GitHub Copilot CLI 等，并可从 Anthropic 官方插件市场以插件方式安装。开源（MIT）。',
    sourceTitle: 'GitHub: obra/superpowers',
    how: 'Superpowers 不是单一功能，而是一组可组合的「技能」，再加上一套确保智能体真正使用它们的方法论。智能体不会一上来就写代码，而是先退一步、弄清你到底想做什么。在你确认设计之后，它会产出一份清晰到连新手工程师都能照着做的实现计划，强调真正的红/绿 TDD、YAGNI 和 DRY。随后进入「子智能体驱动」的流程：多个智能体分头完成各项任务、检查并复审自己的工作再继续——常常能长时间自主运行。由于技能会自动触发，你无需做任何特别操作。',
    setup: [
      `Claude Code（官方）：\`${CMD.spInstall}\``,
      `或使用 Superpowers 市场：\`${CMD.spMarket}\`，再从中安装插件`,
      '其他运行环境（Codex、Cursor、Antigravity、Copilot CLI、OpenCode、Pi 等）：README 中有各自的安装方式',
      '安装后技能会自动触发——无需其他操作',
    ],
    whenGood: [
      { title: '把较大的功能干净地做完', example: 'Superpowers 不让你立刻写代码，而是强制头脑风暴 → 确认设计 → 计划 → TDD——适合看重结构的任务。' },
      { title: '长时间自主运行', example: '子智能体流程会照着已批准的计划连续工作数小时，其间穿插复审。' },
    ],
    whenBad: [
      { title: '快速一行命令 / 一次性脚本', why: '对于微小改动，方法论开销（设计、计划、TDD）并不划算。', alternative: '直接让智能体去做，不用这个框架。' },
      { title: '团队不想被强加方法论', why: 'Superpowers 会引导你走一套特定的 TDD/YAGNI/DRY 风格，并非适合所有工作流。', alternative: '有针对性地使用单个技能，而不是整套框架。' },
    ],
    links: [{ title: '安装指南（README）', url: 'https://github.com/obra/superpowers#claude-code' }],
  },
  serena: {
    name: 'Serena', category: 'MCP',
    what: '一个 MCP 工具包，为你的智能体提供类似 IDE 的语义化代码工具——通过语言服务器（LSP）进行符号级的查找、编辑与重构，而不是盲目地做文本 grep。',
    why: '「你的智能体的 IDE」：在符号层面（函数、类、引用）而非逐行工作。在大型代码库上节省 token，并可配合任意 MCP 客户端（Claude Code、Codex、Cursor 等）。开源（MIT）。',
    sourceTitle: 'GitHub: oraios/serena',
    how: 'Serena 以 MCP 服务器的形式挂到你的智能体上，提供更像 IDE 而非文本搜索的工具：查找符号（`find_symbol`）、解析引用（`find_referencing_symbols`）、替换符号主体（`replace_symbol_body`）等。它基于语言服务器（LSP）——也就是 VS Code「转到定义」所用的同一套技术——因此智能体是在代码的关系结构上工作，而不是盲目 grep。Serena 与模型、客户端无关，可在 stdio 或 HTTP 模式下运行，且为开源。面向智能体运行环境提供了相应的上下文配置（如 `--context claude-code`）。',
    setup: [
      `安装（通过 uv）：\`${CMD.seInstall}\``,
      `在 Claude Code 中注册：\`${CMD.seMcp}\``,
      '也可通过 uvx 免安装使用；或启动 HTTP 模式并把 URL 提供给客户端',
      '会根据项目语言自动使用相应的语言服务器（LSP）',
    ],
    whenGood: [
      { title: '浏览与重构大型代码库', example: '「找出 X 的所有调用者并重命名」会通过语言服务器进行符号级操作，而不是 grep。' },
      { title: '在上下文检索时节省 token', example: 'Serena 按需读取单个符号，而不是把整个文件加载进上下文。' },
    ],
    whenBad: [
      { title: '极小的项目 / 单个文件', why: '在很小的项目上，LSP 和 MCP 的搭建开销几乎不划算。', alternative: '使用智能体内置的 grep/glob 搜索。' },
      { title: '缺少良好语言服务器的语言', why: 'Serena 的强项取决于各语言的语言服务器——对冷门语言可能较弱。', alternative: '选用支持良好的语言（Python、TypeScript、Go、Rust、Java 等）。' },
    ],
    links: [{ title: '文档：配置客户端', url: 'https://oraios.github.io/serena/02-usage/030_clients.html' }],
  },
  cline: {
    name: 'Cline', category: 'Editor',
    what: '一个开源的自主编码智能体——以 VS Code 扩展、CLI 和 SDK 的形式提供。它直接在你的终端里执行命令、实时观察输出并对错误做出反应。',
    why: '在 IDE 中做智能体式编码最受欢迎的开源选择之一（Apache-2.0）。自带密钥（Anthropic、OpenAI、本地模型等）、独立的 plan/act 模式，并支持 MCP。旧称「Claude Dev」。',
    sourceTitle: 'GitHub: cline/cline',
    how: 'Cline 是一个主要生活在 VS Code 中的自主编码智能体，同时也提供 CLI 和 SDK。它把 plan 模式（先商定方案）与 act 模式（再执行）分开，编辑文件、执行终端命令并实时观察其输出——从而在编译错误、测试失败或服务器崩溃发生时即时捕捉。Cline 自身不含模型访问，而是使用你的 API 密钥（Anthropic、OpenAI、OpenRouter 或本地模型），并支持 MCP 服务器以扩展工具。用于自动化时，可通过 CLI 在 CI/CD 中以无界面方式运行。',
    setup: [
      'VS Code：从市场安装「Cline」扩展（条目 ID `saoudrizwan.claude-dev`）',
      `CLI：\`${CMD.clCli}\`——交互式或用于 CI/CD 的无界面模式`,
      `SDK：\`${CMD.clSdk}\``,
      '提供你自己的 API 密钥（Anthropic、OpenAI、OpenRouter 或本地模型）',
    ],
    whenGood: [
      { title: '直接在 VS Code 中做智能体式编码', example: 'Cline 规划、编辑文件、执行测试/构建并实时读取终端输出——plan/act 分工清晰。' },
      { title: '完全掌控模型与成本', example: '自带密钥而非订阅——可自由选择模型，包括本地模型。' },
    ],
    whenBad: [
      { title: '没有 API 预算 / 没有自己的密钥', why: 'Cline 需要自己的模型访问；没有密钥或额度就无法运行。', alternative: '使用自带订阅/额度的工具。' },
      { title: '不用 IDE 的纯终端工作流', why: '它的强项是 VS Code 集成；CLI 较为年轻。', alternative: '使用专门的 CLI 智能体（如 Claude Code、Codex）。' },
    ],
    links: [{ title: 'VS Code 市场：Cline', url: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev' }],
  },
  repomix: {
    name: 'Repomix', category: '上下文',
    what: '把你的整个仓库打包成一个对 AI 友好的单一文件——非常适合一次性把整套代码库交给某个 LLM 或聊天模型。',
    why: '当你想在智能体之外把代码粘贴到 ChatGPT、Claude、Gemini 等里时很方便。它会统计 token、遵守 .gitignore，可压缩并检测密钥。通过 npx 免安装运行，也提供网页工具（repomix.com）。开源（MIT）。',
    sourceTitle: 'GitHub: yamadashy/repomix',
    how: 'Repomix 会遍历你的仓库，并将其写入一个便于 AI 阅读的单一文件（XML、Markdown 或纯文本）。它遵守 `.gitignore`，统计每个文件及总计的 token，并可选地通过 Tree-sitter 压缩代码以节省空间。内置的密钥检查（Secretlint）会对误打包进去的凭据发出警告。除了本地文件夹，它还能处理远程仓库，通过 `npx` 免安装运行，在 repomix.com 上提供网页工具，并可作为 MCP 服务器接入智能体。',
    setup: [
      `免安装：在项目文件夹中运行 \`${CMD.rpNpx}\``,
      `全局安装：\`${CMD.rpGlobal}\`（或 \`yarn global add repomix\`）`,
      '结果：一个文件（如 `repomix-output.xml`）——整份粘贴进 ChatGPT/Claude/Gemini',
      '在线免配置：repomix.com；也可作为面向智能体的 MCP 服务器',
    ],
    whenGood: [
      { title: '把整套代码库交给聊天模型', example: '一条 `npx repomix` 就能生成一个文件，整份粘贴进 Claude/ChatGPT——不必逐个文件复制。' },
      { title: '盯住 token 预算', example: 'Repomix 会统计每个文件及总计的 token，并遵守 .gitignore，只纳入相关内容。' },
    ],
    whenBad: [
      { title: '自带文件搜索的智能体', why: '编码智能体（Claude Code、Cursor）会按需读取文件——打包成的单一大文件往往没必要且过大。', alternative: '让智能体直接在仓库里工作；需要精准上下文时用 Serena 或 Graphify。' },
      { title: '超大型 monorepo', why: '整个仓库即便压缩也可能超出上下文窗口。', alternative: '用包含/忽略过滤器只打包相关文件夹。' },
    ],
    links: [{ title: 'repomix.com（网页 + 文档）', url: 'https://repomix.com/' }],
  },
};

const ORDER = ['superpowers', 'serena', 'cline', 'repomix'];

let report = [];
for (const lang of LANGS) {
  const path = new URL(`../site/content/addons.${lang}.json`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const existing = new Set(data.items.map((x) => x.id));
  let added = 0;
  for (const id of ORDER) {
    if (existing.has(id)) continue;
    const c = C[lang][id];
    const m = META[id];
    data.items.push({
      id,
      name: c.name,
      category: c.category,
      official: m.official,
      stars: m.stars,
      what: c.what,
      why: c.why,
      source: { title: c.sourceTitle, url: m.source },
      detail: {
        how: c.how,
        setup: c.setup,
        whenGood: c.whenGood,
        whenBad: c.whenBad,
        links: c.links,
      },
    });
    added++;
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  report.push(`${lang}: +${added} → ${data.items.length} items`);
}
console.log(report.join('\n'));
