#!/usr/bin/env node
// Wendet die Adversarial-Review-Fixes (review-findings.json + 3 verifizierte Fork-2-Punkte)
// auf entwurf.de.json / entwurf.en.json an. Jede Ersetzung hat einen harten Anker —
// bei NOT FOUND wird abgebrochen, nichts wird halb geschrieben.
import { readFileSync, writeFileSync } from 'node:fs';

const load = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));
const de = load('./entwurf.de.json');
const en = load('./entwurf.en.json');
const g = (a, s) => a.find((x) => x.slug === s);

let count = 0;
function rep(entry, field, anchor, replacement) {
  const cur = entry[field];
  if (typeof cur !== 'string' || !cur.includes(anchor)) {
    throw new Error(`ANKER NOT FOUND: ${entry.slug}/${field}: ${anchor.slice(0, 60)}…`);
  }
  if (cur.split(anchor).length !== 2) throw new Error(`ANKER MEHRDEUTIG: ${entry.slug}/${field}`);
  entry[field] = cur.replace(anchor, replacement);
  count++;
}

/* ── DE ───────────────────────────────────────────── */

// 1. datenschutz: Consumer-Default-Richtung ergänzen (Opt-out-Modell)
rep(g(de, 'datenschutz-und-ki-tools'), 'bodyDetail',
  'Für Consumer-Apps (Free/Pro/Max) gelten separate Regeln.',
  'Für Consumer-Apps wie Claude Free/Pro/Max gilt dagegen ein Opt-out-Modell: Laut Anthropics Privacy Policy werden Eingaben und Ausgaben dort standardmäßig fürs Training genutzt, bis du das in den Kontoeinstellungen aktiv abschaltest.');
g(de, 'datenschutz-und-ki-tools').sources.push({ title: 'Anthropic Privacy Policy', url: 'https://www.anthropic.com/legal/privacy' });
count++;

// 2. datenschutz sources[2]-Titel: gdpr-info.eu ist nicht offiziell
{
  const s = g(de, 'datenschutz-und-ki-tools').sources;
  if (s[2].title !== 'Offizieller DSGVO-Volltext') throw new Error('DE sources[2] Titel unerwartet');
  s[2].title = 'DSGVO-Volltext (gdpr-info.eu)';
  count++;
}

// 3. chunking Quiz: "67 % zusätzlich" ist additiv missverständlich
{
  const q = g(de, 'chunking-strategien').quiz;
  if (q.options[1] !== 'Um 49 % (bzw. 67 % zusätzlich mit Reranking)') throw new Error('DE chunking option[1] unerwartet');
  q.options[1] = 'Um 49 % (bzw. insgesamt 67 % mit zusätzlichem Reranking-Schritt)';
  count++;
}
/* rep() oben ist für Strings — explain separat: */
function repQuizExplain(entry, anchor, replacement) {
  const cur = entry.quiz.explain;
  if (!cur.includes(anchor)) throw new Error(`ANKER NOT FOUND: ${entry.slug}/quiz.explain`);
  entry.quiz.explain = cur.replace(anchor, replacement);
  count++;
}

/* ── weiter DE ── */

// 4. terminal-basics: Apple-Quelle deckt nur Launchpad/Finder — Weg ergänzen
rep(g(de, 'terminal-basics'), 'body',
  '- **Mac**: Cmd+Leertaste (Spotlight), "Terminal" eintippen, Enter.',
  '- **Mac**: Cmd+Leertaste (Spotlight), "Terminal" eintippen, Enter – oder über Launchpad bzw. Finder → Programme → Dienstprogramme → Terminal (der von Apple dokumentierte Weg).');

// 5. ai-coding-ide-vs-cli: Cursor-Zitat exakt ("building" fehlt)
rep(g(de, 'ai-coding-ide-vs-cli'), 'bodyDetail',
  '"dein Coding-Agent für ambitionierte Software"',
  '"dein Coding-Agent zum Bauen ambitionierter Software"');

// 6. temperatur example: Platzhalter-Model-ID → reale ID
rep(g(de, 'temperatur-und-sampling'), 'example',
  '"model": "claude-..."',
  '"model": "claude-sonnet-5"');

// 7. rate-limits exercise Schritt 4: Kosten-Caveat
{
  const ex = g(de, 'rate-limits-und-quotas').exercise;
  const old = 'Teste bewusst mit vielen schnellen Anfragen hintereinander, ob und wann ein 429 auftritt.';
  const i = ex.steps.indexOf(old);
  if (i === -1) throw new Error('DE rate step 4 unerwartet');
  ex.steps[i] = 'Optional und vorsichtig: teste mit einigen schnellen Anfragen, ob ein 429 auftritt – beachte, dass auch die erfolgreichen Anfragen davor Tokens kosten. Nutze dafür kein produktives oder knapp limitiertes Konto.';
  count++;
}

// 8. swe-bench: generischen Benchmark-Rat kürzen + auf Bestandskapitel verweisen
rep(g(de, 'swe-bench-agenten-benchmarks'), 'body',
  'Ein hoher Prozentwert zeigt, wie gut ein Modell bei genau diesen Aufgabentypen abschneidet – nicht automatisch, wie gut es an deinem eigenen Projekt mit eigenen Konventionen und Altlasten funktioniert.',
  'Ein hoher Prozentwert gilt für genau diese Aufgabentypen – nicht automatisch für dein eigenes Projekt. Wie man Benchmark-Zahlen generell einordnet, vertieft das Kapitel "Benchmarks lesen, ohne reinzufallen".');
rep(g(de, 'swe-bench-agenten-benchmarks'), 'bodyDetail',
  'Ein Prozentwert auf einem Leaderboard sagt deshalb etwas über eine eng definierte Fähigkeit aus – nicht über generelle Programmierkompetenz.',
  'Ein Prozentwert auf einem Leaderboard misst also eine eng definierte Fähigkeit – mehr zum generellen Einordnen von Benchmark-Zahlen steht im Kapitel "Benchmarks lesen, ohne reinzufallen".');

/* ── EN ───────────────────────────────────────────── */

// 9. datenschutz example: Opt-out-Ambiguität
rep(g(en, 'datenschutz-und-ki-tools'), 'example',
  'Training opt-out is ON for all consumer AI accounts; API and Enterprise usage does not train on customer content by default.',
  "Turn training opt-out ON in every consumer AI account's settings (it is off by default); API and Enterprise usage does not train on customer content by default.");

// 10. datenschutz sources[2]-Titel
{
  const s = g(en, 'datenschutz-und-ki-tools').sources;
  if (s[2].title !== 'GDPR.eu: Full Text of the Regulation') throw new Error('EN sources[2] Titel unerwartet');
  s[2].title = 'GDPR: Full Text of the Regulation (gdpr-info.eu)';
  count++;
}

// 11. human-in-the-loop: unbelegte Google-Cloud-Attribution
rep(g(en, 'human-in-the-loop'), 'bodyDetail',
  "Google Cloud's framing of HITL describes exactly this: humans validate, correct, or refine outputs specifically where automation errors would matter most, not on every step regardless of stakes.",
  "This lines up with a common industry framing of HITL - not gating every step, but the ones where a mistake would actually cost something. Google Cloud's own HITL overview defines the broader idea: humans contributing input and expertise across the lifecycle of ML/AI systems.");

// 12. terminal-basics: Git lernen vs. installieren verdreht
rep(g(en, 'terminal-basics'), 'bodyDetail',
  "you don't need to install Git yourself just to learn it",
  "you don't need to learn Git itself to benefit - installing it simply provides the Bash shell in the background");

// 13. terminal-basics body: Apple-Weg ergänzen
rep(g(en, 'terminal-basics'), 'body',
  'On a Mac, press Cmd+Space to open Spotlight, type "Terminal", and press Enter.',
  'On a Mac, press Cmd+Space to open Spotlight, type "Terminal", and press Enter - or use Launchpad or Finder → Applications → Utilities → Terminal (the path Apple\'s guide documents).');

// 14. ai-coding-ide-vs-cli example: Prompt-Argument quoten
rep(g(en, 'ai-coding-ide-vs-cli'), 'example',
  "run 'claude fix the failing auth test and show me the diff' in your terminal",
  'run claude "fix the failing auth test and show me the diff" in your terminal');

// 15. swe-bench: Terminal-Bench 2.1 ergänzen
rep(g(en, 'swe-bench-agenten-benchmarks'), 'bodyDetail',
  'the earlier 1.0 had 80 tasks.',
  'the earlier 1.0 had 80 tasks, and Terminal-Bench 2.1 - an incremental update to 2.0 - is the current version shown on the official leaderboard.');

// 16. swe-bench: generischen Rat kürzen + Verweis
rep(g(en, 'swe-bench-agenten-benchmarks'), 'body',
  "A SWE-bench score tells you about GitHub-issue-shaped, Python-heavy, test-verifiable tasks, not every kind of coding work. A high score is a real signal for that task type, but doesn't predict performance on your own codebase. Treat it as one data point, not a full picture.",
  'A SWE-bench score tells you about GitHub-issue-shaped, Python-heavy, test-verifiable tasks, not every kind of coding work. For how to read benchmark numbers in general, see the chapter "Reading Benchmarks Without Getting Fooled".');
rep(g(en, 'swe-bench-agenten-benchmarks'), 'bodyDetail',
  'Treat any score as a filter, not a substitute for testing an agent on real tasks from your codebase.',
  'Treat any score as a filter, not a substitute for testing an agent on real tasks from your codebase - general benchmark-reading advice lives in the chapter "Reading Benchmarks Without Getting Fooled".');

// 17. rate-limits EN exercise: Kosten-Caveat
{
  const ex = g(en, 'rate-limits-und-quotas').exercise;
  const old = 'If you can, deliberately trigger a 429 by sending several requests fast, and read the retry-after value in the response.';
  const i = ex.steps.indexOf(old);
  if (i === -1) throw new Error('EN rate step 4 unerwartet');
  ex.steps[i] = 'Optional: carefully trigger a 429 by sending a handful of fast requests and read the retry-after value - note the successful requests before it still cost tokens, so prefer a test key and stop after a few tries.';
  count++;
}

// 18. chunking explain: Gesamt-Reduktion statt "zusätzlich"
repQuizExplain(g(de, 'chunking-strategien'),
  '49 % kombiniert mit kontextuellem BM25, und 67 % zusätzlich mit Reranking – ausgehend von einer Baseline-Fehlerquote von 5,7 %.',
  '49 % kombiniert mit kontextuellem BM25, und insgesamt 67 % mit zusätzlichem Reranking-Schritt – ausgehend von einer Baseline-Fehlerquote von 5,7 %.');

writeFileSync(new URL('./entwurf.de.json', import.meta.url), JSON.stringify(de, null, 2) + '\n');
writeFileSync(new URL('./entwurf.en.json', import.meta.url), JSON.stringify(en, null, 2) + '\n');
console.log(`✅ ${count} Fixes angewendet, beide Dateien geschrieben`);
