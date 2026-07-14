const en = [
{slug:"api", bodyDetail:
`## Three kinds of APIs
On the web, there are roughly three categories: browser APIs are built into the browser itself (e.g. the Web Audio API for audio processing) and expose the browser's own capabilities to JavaScript. Web or HTTP APIs run over the internet and mostly follow REST principles: fixed HTTP methods like GET (read), POST (create), or DELETE (remove), plus status codes like 200 (success) or 404 (not found). Third-party APIs are ones you deliberately integrate, like the Google Maps API for showing interactive maps.

## The power-outlet analogy
You can also think of an API like a wall outlet: you plug in a device and it works, without needing to know how the electricity is generated or wired. The same way, your code calls a function through an API without knowing the implementation behind it — the complexity stays hidden behind the interface.

## Concretely, with the Anthropic API
The Claude API is a REST API at api.anthropic.com. A central endpoint is POST /v1/messages, which you use to send a message to Claude and get a response back. Authentication happens via an API key sent in the header of every request. Additional endpoints like a token-counting API help you track cost and rate limits (the maximum number of requests allowed in a given time window) before you even send a larger request.

## Why this matters for agents
An AI agent working with external services virtually always uses APIs as its tools: a weather API, a database API, a calendar API. Each of these APIs defines exactly which requests are possible and what response comes back — that's the foundation that both tool use and MCP build on.`},

{slug:"erst-plan-dann-code", bodyDetail:
`## Plan Mode in Claude Code
Claude Code implements this exact pattern as a dedicated "Plan Mode." In Plan Mode, Claude reads files and answers questions but changes nothing — only afterward does the actual plan get written. The recommended flow has four phases: explore (read files, ask questions), plan (have a detailed plan drawn up), implement (leave Plan Mode and let Claude code, checked against the plan), and commit (save the changes with a description).

## Editing the plan directly
One practical detail: the generated plan can be opened and edited directly in your own text editor via a keyboard shortcut in Claude Code, before implementation starts. That lets you cut, rephrase, or reorder individual steps without asking for an entirely new plan.

## When the extra step isn't worth it
Planning isn't an end in itself, and it costs time too. A simple rule of thumb: if you could describe the desired change in one sentence (a typo, a log line, renaming a variable), the detour through an explicit plan usually isn't worth it. Planning pays off mainly when the approach is unclear, multiple files are involved, or you don't know the code well yet.

## A misconception
Planning doesn't mean the AI necessarily foresees everything correctly. The value lies in wrong assumptions surfacing now, while they're still cheap to fix — not in the first plan already being perfect. A plan you end up correcting has already done its job.`},

{slug:"hermes", bodyDetail:
`## The agent loop in detail
At the heart of Hermes is the AIAgent class, which coordinates prompt construction, model selection, tool execution, error handling, and persistence in one continuous loop. Around it sits a tool registry with more than 70 individual tools grouped into roughly 28 toolsets — spanning terminal, browser, file, and MCP tools. When a conversation's context fills up, a dedicated compression module kicks in that lossily summarizes older parts of the conversation instead of simply cutting them off.

## Seven layers of security
Hermes deliberately stacks several layers of protection instead of relying on a single barrier: user authorization, approval for dangerous commands, container isolation, filtered credentials for MCP subprocesses, scanning of context files for prompt injection, cross-session isolation, and sanitized input. Notably, a fixed "hardline blocklist" for catastrophic commands (like wiping the entire filesystem) always applies — even if you turn on YOLO mode, which otherwise skips every approval prompt.

## The DM pairing process
If an unknown person messages you on Telegram, Discord, or another connected platform, they first only get an eight-character pairing code — only once you confirm that code via a CLI command can that person actually talk to your agent. Codes expire automatically after one hour, which limits the window for abuse.

## Persistence across sessions
Unlike a simple chat, Hermes remembers conversations permanently in a searchable SQLite database. Scheduled, recurring tasks (cron jobs) also run as full agent tasks with their own fresh context — not as simple background shell scripts.`},

{slug:"openclaw", bodyDetail:
`## The trust model: one operator per gateway
OpenClaw's security model explicitly assumes exactly one trusted operator per gateway — it is expressly not a safeguard for multiple mutually distrustful users sharing one agent. If several people or teams need to use the same assistant, the documentation recommends running a separate, isolated gateway per trust boundary instead of one shared gateway.

## Three priorities in a fixed order
OpenClaw's own security philosophy follows a clear order: first settle identity (who is even allowed to talk to the bot), then restrict scope (where the bot is allowed to act — groups, tools, sandboxing), and only after that trust the model itself. The underlying assumption is that the model can be manipulated, so any damage needs to stay bounded no matter what happens inside the prompt.

## Direct messages and sandboxing, concretely
For direct messages there are four configurable levels: "pairing" (default — unknown senders get a code), "allowlist" (known IDs only), "open" (public), and "disabled". For tool execution, OpenClaw uses Docker containers as a sandbox by default, with configurable access to the workspace (none, read-only, or read-write). A built-in command (openclaw security audit) automatically checks the configuration for risky settings like open group policies or missing authentication, and can fix simple issues directly.

## A misconception
Enabled sandboxing doesn't automatically protect against prompt injection itself — it only limits how much damage a successfully manipulated response can do. The documentation explicitly stresses that system-prompt rules alone aren't a hard safeguard; the actual enforcement happens through tool permissions, approval steps, and sandboxing.`},

{slug:"modell-lifecycle", bodyDetail:
`## Four official lifecycle stages
Anthropic distinguishes four fixed states for every model: Active (fully supported, recommended), Legacy (no longer receiving updates, may be deprecated soon), Deprecated (still works, but has a fixed end date and a recommended replacement), and Retired (requests fail). For publicly released models there's at least 60 days' notice before a model is actually shut down — enough time to migrate, but not an unlimited buffer.

## How Fable 5 was safeguarded
For Fable 5, Anthropic stacked several layers of protection at once ("defense in depth"): classifiers detect potentially dangerous requests during a conversation and block them. To make sure borderline, actually harmless requests are reliably caught too, a deliberately large "safety margin" was built in — with the side effect that more genuinely harmless requests than usual also got blocked.

## A shared framework for rating jailbreaks
In response to the incident, Anthropic worked with Amazon, Microsoft, and Google to propose a common way to rate the severity of a jailbreak (a technique for bypassing safety mechanisms): based on the capability gain it hands attackers, the breadth of possible misuse, how easily the trick can be turned into a real attack, and how easy it is to discover in the first place.

## The practical consequence
If you build an application on a specific model, you can rely on neither permanent availability nor constant response behavior — safety classifiers get continuously retuned, which occasionally affects requests that used to be unproblematic. A central, swappable model integration with a fallback is therefore not a precaution for edge cases, but a basic requirement.`},

{slug:"vibe-coding-sicherheit", bodyDetail:
`## How big the problem really is
A study presented at the USENIX Security Symposium 2025 had 16 widely used code models generate around 2.23 million code samples in Python and JavaScript. The result: 19.7% of the samples contained at least one hallucinated, nonexistent package name — over 205,000 distinct fabricated names in total. Open-source models hallucinated noticeably more often on average (21.7%) than commercial models (5.2%), but even the best-performing models tested weren't at zero.

## Why this is so attractive to attackers
What makes this especially dangerous is a kind of predictability: when the researchers ran the same prompt ten times, nearly half of the hallucinated names showed up again on every single run. That lets an attacker specifically figure out which made-up names a given model reliably suggests, register them on npm or PyPI in advance, and wait for developers or agents to install them. The term "slopsquatting" was coined by Seth Larson, a developer at the Python Software Foundation, by analogy with classic typosquatting.

## Why agents make the risk worse
A human developer copying code at least theoretically has a chance to notice a suspicious package name. An autonomous coding agent that installs packages itself often skips that checkpoint entirely — it generates the code, identifies its own dependencies, and calls the package manager directly, with no human ever looking at the name.

## What actually helps
Beyond the checklist in the main text, it helps to check every suggested package name against its registration date — a package registered just days ago by an unknown publisher is a warning sign, no matter how plausible the name sounds.`},

{slug:"claude-code-installieren", bodyDetail:
`## More install paths than just the script command
Besides the native installer, there's also Homebrew (macOS) and WinGet (Windows) as package-manager alternatives. Homebrew even offers two channels: the regular "claude-code" cask tracks the stable release, usually about a week behind, while "claude-code@latest" gets new versions as soon as they ship. One important difference: only the native installer updates itself automatically in the background — with Homebrew and WinGet you need to run an upgrade command yourself regularly, or you'll stay stuck on an older version.

## System requirements, concretely
Claude Code runs on macOS 13 and later, Windows 10 (build 1809) or Windows Server 2019 and later, Ubuntu 20.04, Debian 10, and Alpine Linux 3.19 — each requiring at least 4 GB of RAM on x64 or ARM64 processors. The installer also verifies the integrity of the downloaded program via a cryptographically signed checksum before running anything.

## Different account types
Besides a regular Claude subscription or a Claude Console account (pay-as-you-go via prepaid credits), Claude Code can also connect through enterprise cloud providers like Amazon Bedrock, Google Cloud, or Microsoft Foundry. Larger organizations can additionally set up a self-hosted gateway with corporate single sign-on — the login command then automatically opens the right sign-in screen.

## A misconception
The idea that Claude Code needs WSL on Windows is wrong: it runs natively on Windows, no administrator rights required. WSL 2 is only needed for the optional sandboxing feature, not for normal use.`},

{slug:"modell-und-plan-wahl", bodyDetail:
`## How billing actually works
With API access through a Console account, you typically pay via prepaid credits that shrink with every request based on tokens consumed. A subscription works the other way around: a fixed monthly price, but a usage cap instead of pay-per-use. Both models also have rate limits — a ceiling on how many requests or tokens you're allowed to send in a given time window, independent of your actual remaining credits. If you're planning many parallel requests (say, your own agent with several subagents), it's worth checking that limit ahead of time, not after an application is already running.

## Small vs. large models in practice
Small models don't just differ from large ones in price — they also differ in response speed and in how reliably they hold up on multi-step, agentic tasks. A common, sensible pattern: automatically route simple or very frequent requests to a small, fast model (routing), and send complex or rare cases to a large one. Overall, that saves more than committing to a single model across the board.

## Why hard numbers are deliberately missing here
Model names, price per token, and free allowances change every few months, sometimes even weeks — see Model Lifecycle. A specific number that's accurate today may well be wrong in six months. That's why it's worth linking to the official pricing page in your own notes or code, instead of hardcoding a number nobody will ever update.`},

{slug:"git-github-basics", bodyDetail:
`## What's technically behind a commit
Every commit gets a unique checksum (a hash) derived from its content and its parent commit. Change even one byte, and the entire hash changes — that's what makes the history tamper-evident and traceable. Before a commit is created, changes first land in the so-called staging area (via `+"`git add`"+`): a holding area that lets you pick exactly which changes go into the next commit, instead of being forced to commit everything at once.

## Distributed instead of centralized
Git is a distributed system: every local clone of a repository contains the entire history, not just a slice of it. That means you can commit locally, switch branches, and search the history entirely without an internet connection — only `+"`push`"+` and `+"`pull`"+` sync with a remote server like GitHub. A branch itself is technically just a lightweight pointer to a particular commit, not its own file folder — which makes creating new branches practically free.

## Merge vs. rebase
Two branches can be combined in two ways. A merge creates a new commit that joins both histories and keeps it visible when each branch existed. A rebase instead replays a branch's commits onto a new starting point, producing a linear but rewritten history. For day-to-day work with a coding agent, a simple merge is usually enough — rebase is more worthwhile for tidy, published histories.`},

{slug:"agent-festgefahren", bodyDetail:
`## Why "ground truth" is the key
An agent should get real feedback from its environment at every step — a test result, an error message, a build status — rather than relying only on its own assessment. Without this "ground truth," an agent falls back on its own, often overly optimistic self-assessment ("this should work now"). So give a stuck agent a verifiable task wherever possible: a test it can run, a build, a diff to compare — that replaces trust with an actual check.

## Build in fixed stopping conditions
An agent that keeps working indefinitely despite having gone off the rails can end up in loops of repeated, equally wrong attempts. A fixed cap on attempts or steps (a so-called stopping condition) forces a point where either a human steps in or the agent explicitly reports that it's stuck — instead of silently burning more time and tokens.

## Why the interface itself is often the real cause
The problem is often not the model, but unclear tools. A well-known example: a coding agent kept making mistakes with relative file paths once it had moved out of the root directory. The fix wasn't a better prompt — it was a changed tool that only accepted absolute paths from then on. After that, the same agent used the tool flawlessly. Before you tweak the instructions, it's worth looking at the tool itself too.`},

{slug:"projekt-deployen", bodyDetail:
`## More than just serving HTML
Modern static hosting providers like Cloudflare Pages can also cover dynamic parts without needing a permanently running server of your own: so-called functions run only on demand (say, when a form is submitted or an API is called) and then shut down again. For getting started, the purely static option is usually still enough — functions only come into play once you actually need server-side logic, for example to send a contact form.

## The built-in undo button
Most of these hosting providers offer a rollback feature: a broken deployment can be reverted to the last working state with one click, without writing new code or deploying again. This is especially useful when a deployment triggered by an agent unexpectedly breaks something — the old, working version is back online immediately.

## Three ways to get code onto the server
Besides Git integration (every push triggers a deployment), there's usually also a direct upload of finished files without a Git repo, plus a command-line tool that can trigger deployments in an automated way — useful when a coding agent is meant to kick off the deployment itself without setting up a whole repository.

## A misconception
A free plan doesn't mean unlimited deployments: most providers cap you at a monthly limit (often in the hundreds), after which every further deployment costs extra or an upgrade becomes necessary. For a single small project, that's rarely an issue — but with heavy automated deployment driven by an agent, it can become relevant.`},

{slug:"rag", bodyDetail:
`## Two search methods combined
Pure embedding-based retrieval finds content that's semantically similar but sometimes misses exact matches — like a specific error code such as "TS-999" in a support database. That's why good RAG systems combine embeddings with BM25, an older, lexical search method that specifically looks for exact word or character matches. Only the combination of both reliably delivers text snippets that are both topically relevant and exact matches.

## Contextual retrieval as a refinement
A common problem when splitting documents into small text snippets (chunks): a single snippet like "revenue grew 3% over the previous quarter" doesn't reveal on its own which company or time period it's about. Contextual retrieval solves this by automatically prepending a short, explanatory context (usually 50–100 tokens) to each snippet before embedding — generated by a small, cheap model that has access to the full source document.

## Documented numbers on the impact
In tests, context-enriched embedding search alone reduced the retrieval failure rate by 35%. Combined with the BM25 method, it was 49% fewer missed retrievals, and with an additional reranking step (a model that re-sorts the retrieved candidates by relevance) it dropped by as much as 67%.

## When a long prompt is enough
Not every knowledge base needs RAG: if it fits entirely under roughly 200,000 tokens, it can simply be included directly in every request together with prompt caching — no retrieval infrastructure required. RAG only pays off once the knowledge base is permanently larger than the context window.`},

{slug:"embeddings", bodyDetail:
`## How many numbers such a vector has
The length of an embedding vector is fixed and model-dependent — common current embedding models use around 1536 or 3072 numbers per piece of text. More dimensions often capture finer distinctions in meaning, but cost more storage and compute when comparing. Many providers therefore let you deliberately reduce the dimensionality without losing the broad structure of meaning — a tradeoff between accuracy and efficiency.

## Six typical use cases
Beyond semantic search and RAG, embeddings are also used for anomaly detection (spotting outliers that don't fit anywhere else), diversity measurement (how different a collection of texts really is), and automatic classification (assigning a text to the closest predefined category). All of these applications rely on the same basic operation: computing the distance between two vectors.

## How the calculation actually works
A dedicated model — usually much smaller than the actual language model — converts text into the number vector; billing is based on the number of tokens in the input text, not the length of the output vector. The finished vector itself carries no readable meaning — individual numbers can't be interpreted, only the distance between several vectors makes sense.

## A misconception
An embedding model doesn't "understand" text in a human sense and doesn't check facts — it only reflects statistical closeness learned during training. Two sentences with opposite meanings but similar vocabulary can therefore end up surprisingly close together.`},

{slug:"fine-tuning", bodyDetail:
`## Four different fine-tuning methods
Not every fine-tuning process works the same way. Supervised fine-tuning shows the model correct example answers to prompts. Direct preference optimization instead shows a better and a worse answer side by side, so the model learns which direction is preferred. Reinforcement fine-tuning goes further still: a grader scores generated answers, and that score specifically reinforces the reasoning paths that led to especially good results — more elaborate, but suited to complex, expert-level tasks like legal or medical assessments.

## The technical process
Roughly, fine-tuning always follows the same steps: collect a dataset of examples, upload it in a structured format, start a training job, and then check the results with evals. Methods involving human or automated scoring (like reinforcement fine-tuning) additionally need a grading standard (a grader) that defines what counts as a "good" answer.

## Why fine-tuning helps beyond prompting
Fine-tuning pays off especially when far more examples would be needed than fit into a single context window, or when sensitive training data shouldn't be sent with every request in the prompt. Another benefit: shorter prompts without lots of examples permanently save tokens and response time, because the desired behavior is already baked into the model instead of being re-explained every time.

## A moving target
How strongly individual providers push fine-tuning changes over time: some providers are currently restructuring their offering or limiting it for new customers, while existing models remain usable. Before investing in your own fine-tuning, it's worth checking the current state of the specific platform.`},

{slug:"prompt-injection", bodyDetail:
`## Why RAG and fine-tuning don't automatically protect you
A common misconception: techniques like RAG or fine-tuning would incidentally solve prompt injection too, because they make answers "more relevant." Research actually shows that neither fixes the underlying problem — they only change which content reaches the context window, but don't prevent hidden instructions inside it from being mistaken for genuine ones.

## Prompt injection is not the same as jailbreaking
The two terms are often used interchangeably but mean different things: prompt injection broadly means manipulating how a model responds to input. Jailbreaking is a particularly far-reaching form of it, aiming to bypass the built-in safety rules entirely. Not every successful prompt injection amounts to a jailbreak.

## Seven concrete countermeasures
OWASP lists, among others: tightly constrain model behavior in the system prompt; define expected output formats and check them deterministically; filter input and output for disallowed patterns; give the model only the minimum necessary privileges (its own restricted API access instead of full access); require human approval for risky actions; clearly label foreign content as such and treat it separately from the actual prompt; and run targeted adversarial testing regularly.

## Even images can hide instructions
With multimodal models, the attack surface grows: a hidden instruction can also be embedded in an image processed alongside otherwise harmless text. If the model processes the image and text together, the instruction hidden in the image can influence its behavior even though the visible text looks completely unremarkable.`},

{slug:"structured-outputs", bodyDetail:
`## The difference from plain JSON mode
Many APIs offer two tiered levels: a simple "JSON mode" only guarantees that the output is valid JSON at all — not that it matches the desired schema. Structured outputs go a step further and additionally enforce compliance with a specific schema: if a required field is missing or a field has the wrong type, the output technically can't be generated in the first place, instead of only failing later when parsing.

## How the enforcement actually works
With structured outputs, generating the next token is constrained so that at every position only tokens compatible with the given schema are allowed — this is called constrained decoding. That's a meaningful difference from just prompting "please return JSON," which the model can simply ignore or get wrong.

## Not every model supports this equally well
This hard schema binding isn't equally available across every model and model version — older or smaller model versions often only support the simpler JSON mode without a schema guarantee. Before using this in production, it's worth checking the current model documentation for which mechanism actually applies to the version you're using.

## In practice: typed classes instead of raw schema
In modern development environments, the schema is often defined not as raw JSON Schema directly, but via a typed class (for example with Pydantic in Python or Zod in JavaScript). A helper library automatically converts that class definition into the technical schema — the result can then be used directly as a finished, typed object in code, with no manual parsing needed.`},

{slug:"evals", bodyDetail:
`## Good success criteria before the first test
Before an eval even exists, it's worth defining success concretely: specific rather than vague ("accurate sentiment classification" instead of "good performance"), measurable with clear numbers or scales, achievable within what current models can realistically do, and relevant to the actual use case. Even hard-to-pin-down topics like safety or tone can be turned into something checkable this way, such as "fewer than 0.1% of outputs get flagged as inappropriate."

## Three grading methods with different levels of effort
Code-based grading (exact match, keyword search) is the fastest and most reliable, but not very nuanced. Human grading is the most flexible but slow and expensive — better suited to spot checks than ongoing testing. In between sits grading by a second model (LLM-as-judge): fast, scalable, and suited to more complex judgment calls, provided the grading criteria were spelled out clearly and in detail beforehand.

## One important trick for the LLM judge
A second model grades more reliably if you first have it briefly explain its reasoning before it delivers a verdict — much like with a person, a short "think before you grade" step reduces snap, superficial judgments. The reasoning itself can be discarded afterward; only the final result counts for evaluation.

## Better many simple cases than a few perfect ones
A common mistake is waiting too long to build an eval because it "doesn't feel big enough yet." It's better to start early with a small, realistic test set and not forget edge cases — more test questions with somewhat simpler automated grading usually beat a handful of cases graded painstakingly by hand.`},

{slug:"git-worktrees", bodyDetail:
`## What's shared and what isn't
Worktrees share the entire commit history and all branches (everything under refs/), but each worktree has its own state of HEAD, its own index (staging area), and its own checked-out files. That separation is exactly what makes parallel work possible: a commit in one worktree immediately shows up in the shared history and is visible from every other worktree, without the files on disk overwriting each other.

## Handy shortcuts in practice
Without specifying a branch name at all, `+"`git worktree add ../path`"+` automatically creates a new branch named after the final folder name in the path. If a worktree is stored on a portable drive or network share that isn't always connected, `+"`git worktree lock`"+` prevents its administrative files from being automatically cleaned up. If a working folder was deleted manually (without `+"`git worktree remove`"+`), `+"`git worktree prune`"+` afterward cleans up the orphaned internal metadata.

## A classic use case
The official Git documentation describes an everyday scenario: in the middle of a big refactor, an urgent request for a hotfix comes in. Instead of stashing the messy, half-finished work with `+"`git stash`"+` and risking losing track of something, you create a temporary worktree for the fix, handle it there in isolation, remove the worktree again, and pick the refactor back up exactly where you left off.

## A misconception
Worktrees aren't full, independent copies like a `+"`git clone`"+` — they share the same underlying object database and therefore need far less disk space than several separate clones of the same repository.`},

{slug:"hooks", bodyDetail:
`## Three trigger timings
Hook events fall into three timing categories: once per session (e.g. at start or end), once per conversation turn (e.g. when you submit a message or Claude finishes answering), and on every single tool call inside the agentic loop (before and after each tool). Beyond the base events mentioned in the main text, there are far more trigger points — for example before an automatic context compaction, when a subagent is spawned, or when a Git worktree is created.

## Not just shell commands
A hook doesn't have to be a plain shell command. Claude Code also supports HTTP hooks that send a request to your own server, as well as prompt-based and agent-based hooks, where a small LLM itself makes the decision instead of rigid rules. That allows, for example, a hook that uses its own judgment to check whether a change is "risky enough" to warrant a confirmation, instead of just matching fixed text patterns.

## Actively intervening, not just observing
Some hooks can do more than log activity: they return an explicit decision (allow, block, or defer an action for later). A PreToolUse hook can stop a planned command completely before it ever reaches the model or system — not just flag a warning after the fact.

## Security with your own hooks
Because hooks run with the full privileges of your own user account, the documentation explicitly warns against adopting hooks from untrusted sources without review: a malicious hook would have exactly the same system access you do.`},

{slug:"multi-agent-patterns", bodyDetail:
`## Documented numbers on the performance gain
In an internal Anthropic test, a multi-agent system (a lead model plus several parallel subagents) outperformed a single model of the same strength by 90.2% on research tasks. The analysis also found that three factors together explained 95% of the performance variance on a research benchmark, with raw token usage alone accounting for 80% of it — more agents mainly means more capacity for parallel reasoning, spread across multiple separate context windows.

## The cost of that performance
More agents cost noticeably more: according to the same measurements, a single agent uses roughly four times as many tokens as a normal chat conversation on average, and a multi-agent system roughly fifteen times as many. That only pays off if the value of the task actually justifies the extra cost — for many simple tasks, it doesn't.

## When splitting up work does NOT pay off
Not every task benefits from multiple agents. Tasks with many tight dependencies between subtasks — like most coding tasks, where a change in one file affects another — are harder to cleanly split up than open-ended research tasks, where several independent search threads can be pursued in parallel.

## A practical lever: parallel instead of sequential calls
A simple but effective trick: have tools called simultaneously instead of one after another — both starting several subagents at once and, within a single subagent, firing off several search queries in parallel. This one change cut the time to complete complex research tasks by up to 90% in testing.`},

{slug:"kontext-strategien", bodyDetail:
`## The "context rot" phenomenon
Studies using needle-in-a-haystack tests show a consistent effect: the more tokens sit in the context window, the less reliably the model can accurately recall individual pieces of information from it — even before the technical limit is reached. One cause is the architecture itself: transformer models compute relationships between practically every pair of tokens, which effectively dilutes attention as length grows. A context window is therefore a resource with diminishing returns, not simply a capacity question.

## Compaction in practice, using Claude Code as an example
When context gets tight, Claude Code automatically summarizes the message history, while specifically preserving architectural decisions, open bugs, and important implementation details — while discarding plain tool outputs. On top of that, the five most recently opened files stay in full context. The real skill lies in not summarizing too aggressively: what looks unimportant right now can turn out to matter later.

## External memory as a running notepad
Instead of keeping everything in the context window, some agents continuously write notes to an external file (like a NOTES.md) that gets read back in when needed. After a context reset, the agent reads its own notes and picks up seamlessly — this pattern enables hours-long, coherent tasks that go far beyond a single context window.

## Compression via subagents
A subagent can internally burn through tens of thousands of tokens on its own research, but often returns only a condensed summary of 1,000 to 2,000 tokens to the lead agent. The expensive intermediate work stays isolated; only the distilled result reaches the main context.`},
];

module.exports = en;
