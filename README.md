# 🌱 promptgarten

**Free multilingual learning platform for AI-assisted & agent-based coding — built by [Marvin](https://github.com/MarvinRey7879) so everyone can learn coding with AI.**

**Live:** https://promptgarten.com

## What is this?

promptgarten teaches coding with AI — from absolute beginners to experienced developers:

- **📖 Glossary** — 31 entries (LLM, tokens, MCP, agents, loops, Claude Code, Hermes, OpenClaw …) with quizzes, difficulty levels (●○○–●●●) and **visible sources on every page**
- **🧭 Command reference** — every CLI/slash command of Claude Code (92) and Codex CLI (16), each with "when to use it" and "when not to" examples, grounded in the official docs
- **🧩 Add-ons** — the most important tools around AI coding agents (Graphify, MCP servers, Obsidian integrations …), vetted with sources and diagrams
- **🎮 Learning paths** — 4 gamified worlds with XP, streaks and chapter unlocking — no account needed, everything stays in your browser
- **📰 Feed** — curated AI news, every claim verified against primary sources before publishing
- **⚖️ Comparisons** — Claude Code vs Cursor vs Codex CLI vs Aider, honest, dated
- **📊 Benchmarks** — what each benchmark actually measures, its known weaknesses, links to live leaderboards
- **🔄 Loop gallery** — annotated examples of good and bad agent loops, with diagrams
- **💬 Forum** — built-in, spam-protected (no plaintext IPs)

**Languages:** Deutsch · English · Español · Français · 简体中文

## AI-friendly & scrape-friendly — on purpose

The goal is that *everyone* learns — humans and AI agents alike. All content is deliberately easy to access programmatically:

- [`/llms.txt`](https://promptgarten.com/llms.txt) — agent-friendly entry point
- [`/api/index.json`](https://promptgarten.com/api/index.json) — all endpoints, no auth
- `/api/entries.<lang>.json`, `/api/commands.<lang>.json`, `/api/feed.<lang>.json`, `/api/vergleiche.<lang>.json`, `/api/loops.<lang>.json`, `/api/benchmarks.<lang>.json`

Scraping and reuse are welcome — just link back.

## Principles

- **Stack:** Next.js (static export) · Cloudflare Pages (site) · Cloudflare Workers + D1 (bug reports, forum, newsletter, cookieless analytics) — total running cost: €0
- **Hard rule:** every claim on the platform needs a visible, verified source. Every URL is checked before publishing.
- **Privacy:** no cookies, no personal tracking. Page views are stored without IPs or identifiers. Learning progress lives only in your browser's localStorage.

## Contributing

Found a wrong fact, outdated info or missing topic?

- 🐛 Use the **bug button** on any page (bottom right)
- 💬 Post in the [forum](https://promptgarten.com/en/forum/) or [GitHub Discussions](https://github.com/MarvinRey7879/promptgarden/discussions)

Every report gets read; verified issues get fixed quickly.

## License

Content: free to reuse with a link back. Code: MIT.
