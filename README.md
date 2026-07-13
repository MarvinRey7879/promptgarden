# 🌱 promptgarten

**Free multilingual learning platform for AI-assisted & agent-based coding — built and maintained autonomously by an AI loop.**

**Live:** https://promptgarten.com (soon: promptgarten.com)

## What is this?

promptgarten teaches coding with AI — from absolute beginners to experienced developers:

- **📖 Glossary** — 31 entries (LLM, tokens, MCP, agents, loops, Claude Code, Hermes, OpenClaw …) with quizzes, difficulty levels (●○○–●●●) and **visible sources on every page**
- **🎮 Learning paths** — 4 gamified worlds (Getting started → Basics → Agents → Toolbox) with XP, streaks and chapter unlocking — no account needed, everything stays in your browser
- **📰 Feed** — curated AI news, every claim verified against primary sources before publishing
- **⚖️ Comparisons** — Claude Code vs Cursor vs Codex CLI vs Aider, honest, dated
- **📊 Benchmarks** — what each benchmark actually measures, its known weaknesses, links to live leaderboards (deliberately no embedded scores — they age in weeks)
- **🔄 Loop gallery** — annotated examples of good and bad agent loops, written by the loop that builds this site
- **💬 Forum** — built-in, spam-protected (shadow-blocking, salted IP hashes, no plaintext IPs)
- **🧮 Interactive tools** — e.g. a live token estimator inside the token/context-window entries

**Languages:** Deutsch · English · Español · Français · 简体中文

## For AI agents

All content is freely available as JSON — no auth:

- [`/llms.txt`](https://promptgarten.com/llms.txt) — agent-friendly entry point
- [`/api/index.json`](https://promptgarten.com/api/index.json) — all endpoints
- `/api/entries.<lang>.json`, `/api/feed.<lang>.json`, `/api/vergleiche.<lang>.json`, `/api/loops.<lang>.json`, `/api/benchmarks.<lang>.json`

## How it's built

This platform is **built by an autonomous Claude Code loop** with minimal human input. The loop researches, writes, verifies sources, translates, tests, deploys and monitors — its own anatomy is documented on the site's [loop gallery](https://promptgarten.com/en/loops/).

- **Stack:** Next.js (static export) · Cloudflare Pages (site) · Cloudflare Workers + D1 (bug reports, forum, newsletter, cookieless analytics) — total running cost: €0
- **Hard rule:** every claim on the platform needs a visible, verified source. The loop checks every URL before publishing.
- **Privacy:** no cookies, no personal tracking. Page views are stored without IPs or identifiers. Learning progress lives only in your browser's localStorage.
- Loop memory & iteration log: [`LOOP.md`](LOOP.md)

## Contributing

Found a wrong fact, outdated info or missing topic?

- 🐛 Use the **bug button** on any page (bottom right)
- 💬 Post in the [forum](https://promptgarten.com/en/forum/) or [GitHub Discussions](https://github.com/MarvinRey7879/promptgarden/discussions)

The loop reads every report and fixes verified issues in its next iteration.

## License

Content: free to reuse with a link back. Code: MIT.
