#!/usr/bin/env node
/**
 * Deterministischer Content-Lint — läuft als Teil von prebuild und blockt den Build hart.
 *
 * Hintergrund (Deep Research 13.07.26, research/autonomous-loops-deep-research-2026-07.md):
 * Autonome Content-Systeme brauchen einen deterministischen Prüf-Layer VOR Publikation
 * („Wikipedia-Weg statt EndlessWiki-Weg"): Konsistenz maschinell erzwingen, nicht per
 * Modell-Konfidenz. Vorbild: llmwiki-Lint (Zitate/Links/Frontmatter) + Spotify-Reihenfolge
 * (deterministische Verifier VOR LLM-Judge).
 *
 * Prüft über alle 5 Sprachen:
 *  - JSON parst
 *  - Slug-/ID-Sets identisch (kein Eintrag fehlt in einer Sprache)
 *  - quiz.correct ist gültiger Index
 *  - sources: nicht leer, URL-Sets pro Slug identisch über Sprachen (Quellen = sprachneutral)
 *  - bodyDetail-Parität: hat DE ein bodyDetail, müssen es alle Sprachen haben
 *  - Feed: kein date in der Zukunft (Ergänzung zum Guard in build-api.mjs)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];
const errors = [];
const warns = [];

function load(name) {
  const out = {};
  for (const l of LANGS) {
    const p = join(ROOT, 'content', `${name}.${l}.json`);
    try {
      out[l] = JSON.parse(readFileSync(p, 'utf8'));
    } catch (e) {
      errors.push(`${name}.${l}.json: parse/read failed — ${e.message}`);
    }
  }
  return out;
}

function setDiff(a, b) {
  return [...a].filter((x) => !b.has(x));
}

function checkParity(name, byLang, keyFn) {
  const sets = {};
  for (const l of LANGS) {
    if (!byLang[l]) return;
    sets[l] = new Set(keyFn(byLang[l]));
  }
  for (const l of LANGS.slice(1)) {
    const missing = setDiff(sets.de, sets[l]);
    const extra = setDiff(sets[l], sets.de);
    if (missing.length) errors.push(`${name}: fehlen in ${l}: ${missing.join(', ')}`);
    if (extra.length) errors.push(`${name}: überzählig in ${l}: ${extra.join(', ')}`);
  }
  return sets.de;
}

// ---- entries ----
const entries = load('entries');
checkParity('entries', entries, (d) => d.map((e) => e.slug));
if (entries.de) {
  const bySlug = {};
  for (const l of LANGS) {
    if (!entries[l]) continue;
    for (const e of entries[l]) (bySlug[e.slug] ||= {})[l] = e;
  }
  for (const [slug, langs] of Object.entries(bySlug)) {
    const de = langs.de;
    if (!de) continue;
    for (const l of LANGS) {
      const e = langs[l];
      if (!e) continue;
      if (e.quiz && (!Number.isInteger(e.quiz.correct) || e.quiz.correct < 0 || e.quiz.correct >= e.quiz.options.length))
        errors.push(`entries/${slug} [${l}]: quiz.correct=${e.quiz?.correct} ungültig`);
      if (!Array.isArray(e.sources) || e.sources.length === 0)
        errors.push(`entries/${slug} [${l}]: sources leer — Quellenpflicht!`);
      // Die Kapitelseite rendert exercise.steps und exercise.selfCheck ohne Guard (It. 116)
      if (e.exercise && (!Array.isArray(e.exercise.steps) || !e.exercise.steps.length || !Array.isArray(e.exercise.selfCheck) || !e.exercise.selfCheck.length))
        errors.push(`entries/${slug} [${l}]: exercise ohne steps/selfCheck — Seite crasht beim Prerender`);
      if (Boolean(de.bodyDetail) !== Boolean(e.bodyDetail))
        errors.push(`entries/${slug} [${l}]: bodyDetail-Parität verletzt (de=${Boolean(de.bodyDetail)}, ${l}=${Boolean(e.bodyDetail)})`);
      if (de.sources && e.sources) {
        // Lokalisierte Wikipedia-Artikel sind pro Sprache bewusst verschieden (It. 6) —
        // dort zählt nur die Anzahl; alle übrigen Quellen müssen URL-identisch sein.
        const isWiki = (u) => /\.wikipedia\.org\//.test(u);
        const deWiki = de.sources.filter((s) => isWiki(s.url)).length;
        const lWiki = e.sources.filter((s) => isWiki(s.url)).length;
        const deRest = new Set(de.sources.filter((s) => !isWiki(s.url)).map((s) => s.url));
        const lRest = new Set(e.sources.filter((s) => !isWiki(s.url)).map((s) => s.url));
        if (deWiki !== lWiki || deRest.size !== lRest.size || setDiff(deRest, lRest).length)
          errors.push(`entries/${slug} [${l}]: Quellen weichen von de ab (wiki ${deWiki}→${lWiki}, rest ${[...setDiff(deRest, lRest)].join(',') || 'count'})`);
      }
    }
  }
}

// ---- commands ----
const commands = load('commands');
checkParity('commands', commands, (d) => d.commands.map((c) => `${c.platform}/${c.slug}`));
if (commands.de) {
  for (const l of LANGS) {
    if (!commands[l]) continue;
    for (const c of commands[l].commands) {
      if (!Array.isArray(c.sources) || c.sources.length === 0)
        errors.push(`commands/${c.platform}/${c.slug} [${l}]: sources leer`);
    }
  }
}

// ---- addons ----
const addons = load('addons');
checkParity('addons', addons, (d) => d.items.map((a) => a.id));

// ---- feed: kein Zukunftsdatum ----
const feed = load('feed');
checkParity('feed', feed, (d) => d.map((i) => i.id ?? i.slug ?? i.title));
const today = process.env.PG_LINT_TODAY || new Date().toISOString().slice(0, 10);
for (const l of LANGS) {
  if (!feed[l]) continue;
  for (const i of feed[l]) {
    if (i.date && i.date > today) errors.push(`feed [${l}] "${i.title}": date ${i.date} liegt in der Zukunft`);
  }
}

// ---- Ergebnis ----
for (const w of warns) console.warn(`⚠️  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`❌ ${e}`);
  console.error(`\nlint-content: ${errors.length} Fehler — Build abgebrochen.`);
  process.exit(1);
}
console.log(`✅ lint-content: entries/commands/addons/feed konsistent über ${LANGS.length} Sprachen (0 Fehler, ${warns.length} Warnungen)`);
