/**
 * Link-Audit: sammelt alle externen Quellen-URLs aus dem Content, prüft jede
 * per HTTP (Browser-UA, Redirects folgen) und meldet Ausfälle + Soft-404-Verdacht.
 * Soft-404 = 200, aber die Seite ist offensichtlich eine Fehler-/Startseiten-Hülle.
 *
 * Aufruf: node research/link-audit.mjs [--limit N]
 * Ausgabe: research/link-audit-<datum>.json  (Datum als Argument, s. STAMP)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const ROOT = 'C:/Users/marvi/promptgarden/';
const STAMP = process.argv.find((a) => a.startsWith('--stamp='))?.split('=')[1] ?? 'unbenannt';
const CONCURRENCY = 8;
const TIMEOUT_MS = 20000;

/** Content-Dateien und wo darin URLs stecken */
const SOURCES = [
  { file: 'site/content/entries.de.json', pick: (j) => j.flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `kapitel/${e.slug}` }))) },
  { file: 'site/content/feed.de.json', pick: (j) => j.flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `feed/${e.id}` }))) },
  { file: 'site/content/commands.de.json', pick: (j) => [
      ...j.platforms.map((p) => ({ title: p.name, url: p.docsUrl, wo: `plattform/${p.id}` })),
      ...j.commands.flatMap((c) => (c.sources ?? []).map((s) => ({ ...s, wo: `befehl/${c.platform}/${c.slug}` }))),
    ] },
  { file: 'site/content/fehler.de.json', pick: (j) => j.items.flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `fehler/${e.id}` }))) },
  { file: 'site/content/addons.de.json', pick: (j) => (Array.isArray(j) ? j : j.items ?? []).flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `addon/${e.slug ?? e.id}` }))) },
  { file: 'site/content/prompts.de.json', pick: (j) => (j.items ?? []).flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `prompt/${e.id ?? e.slug}` }))) },
  { file: 'site/content/vergleiche.de.json', pick: (j) => (j.sources ?? []).map((s) => ({ ...s, wo: 'vergleiche' })) },
  { file: 'site/content/timeline.de.json', pick: (j) => (Array.isArray(j) ? j : j.items ?? []).flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `timeline/${e.id ?? e.slug}` }))) },
  { file: 'site/content/benchmarks.de.json', pick: (j) => (Array.isArray(j) ? j : j.items ?? []).flatMap((e) => (e.sources ?? []).map((s) => ({ ...s, wo: `benchmark/${e.id ?? e.slug}` }))) },
  { file: 'site/content/loops.de.json', pick: (j) => (j.sources ?? []).map((s) => ({ ...s, wo: 'loops' })) },
];

/**
 * Zusätzlich zu den strukturierten sources[] jede Content-Datei roh nach URLs
 * durchsuchen — sonst fallen Links durch, die woanders im Baum hängen
 * (Addons, Vergleiche, Timeline, Benchmarks, Loops halten sie nicht in sources[]).
 */
const EXTRA_FILES = [
  'site/content/addons.de.json',
  'site/content/vergleiche.de.json',
  'site/content/timeline.de.json',
  'site/content/benchmarks.de.json',
  'site/content/loops.de.json',
  'site/content/rosetta.de.json',
];

const found = new Map(); // url -> {title, wo:[]}
const add = (url, title, wo) => {
  if (!url || !/^https?:\/\//.test(url)) return;
  // Satzzeichen am Ende abschneiden — schließende Klammern aber nur, wenn die URL
  // keine öffnende enthält (sonst zerbrechen Wikipedia-Links wie …_(deep_learning)).
  let clean = url.replace(/[.,;`]+$/, '');
  if (!clean.includes('(')) clean = clean.replace(/\)+$/, '');
  const cur = found.get(clean) ?? { title: title ?? '', wo: [] };
  if (!cur.wo.includes(wo)) cur.wo.push(wo);
  found.set(clean, cur);
};

for (const src of SOURCES) {
  const path = ROOT + src.file;
  if (!existsSync(path)) {
    console.log('FEHLT (übersprungen):', src.file);
    continue;
  }
  let picked = [];
  try {
    picked = src.pick(JSON.parse(readFileSync(path, 'utf8'))) ?? [];
  } catch (e) {
    console.log('PARSE-PROBLEM', src.file, e.message);
    continue;
  }
  for (const s of picked) add(s?.url, s?.title, s?.wo);
  console.log(src.file.padEnd(38), picked.length, 'URL-Vorkommen (strukturiert)');
}

for (const file of [...EXTRA_FILES, ...SOURCES.map((s) => s.file)]) {
  const path = ROOT + file;
  if (!existsSync(path)) continue;
  const raw = readFileSync(path, 'utf8');
  const hits = raw.match(/https?:\/\/[^"'\s\\`]+/g) ?? [];
  const label = file.replace('site/content/', '').replace('.de.json', '');
  for (const u of hits) add(u, '', `roh:${label}`);
  if (EXTRA_FILES.includes(file)) console.log(file.padEnd(38), hits.length, 'URL-Vorkommen (roh)');
}

const urls = [...found.keys()];
console.log('\nUNIQUE URLS:', urls.length);

const SOFT404 = [
  /page not found/i,
  /seite nicht gefunden/i,
  /404[^0-9]{0,12}(not found|error)/i,
  /this page (does ?n[o']t|could not be) (exist|found)/i,
];

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const finalUrl = res.url;
    let soft = false;
    let bytes = 0;
    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('text/html') || ct.includes('text/plain')) {
      const body = await res.text();
      bytes = body.length;
      soft = SOFT404.some((re) => re.test(body.slice(0, 6000)));
    }
    return { status: res.status, finalUrl, soft, bytes, redirected: finalUrl !== url };
  } catch (e) {
    return { status: 0, error: String(e.name === 'AbortError' ? 'timeout' : e.message).slice(0, 120) };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
let done = 0;
async function worker(queue) {
  while (queue.length) {
    const url = queue.shift();
    const r = await check(url);
    results.push({ url, ...found.get(url), ...r });
    done++;
    if (done % 25 === 0) console.log('  …', done, '/', urls.length);
  }
}

const queue = [...urls];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

/** Platzhalter/Beispiel-Endpunkte aus Code-Snippets — nie erreichbar, kein Defekt. */
const BEISPIEL = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|(\w+\.)?example\.(com|org)|api\.wetter\.de|github\.com\/team\/)/;
/** Endpunkte, die per GET korrekt mit 4xx antworten (POST-only bzw. Auth nötig). */
const API_ENDPUNKT = /^https:\/\/(api\.anthropic\.com\/v1\/|api\.githubcopilot\.com\/mcp|mcp\.context7\.com\/mcp)/;
/** Bekanntes Bot-Blocking: existiert real, per Browser-UA bzw. r.jina.ai am 18.07.2026 verifiziert. */
const BOTBLOCK = /^https:\/\/(www\.npmjs\.com\/package\/|openai\.com\/|x\.ai\/|ai\.meta\.com\/|developer\.meta\.com\/)/;

const kind = (r) => {
  if (BEISPIEL.test(r.url)) return 'beispiel';
  if (API_ENDPUNKT.test(r.url)) return 'api-endpunkt';
  if (r.status === 0 || r.status >= 400 || r.soft) return BOTBLOCK.test(r.url) ? 'botblock' : 'defekt';
  return 'ok';
};
for (const r of results) r.art = kind(r);

const defekt = results.filter((r) => r.art === 'defekt');
const botblock = results.filter((r) => r.art === 'botblock');
const ignoriert = results.filter((r) => r.art === 'beispiel' || r.art === 'api-endpunkt');
const redirects = results.filter((r) => r.art === 'ok' && r.redirected);

const out = { stamp: STAMP, geprueft: results.length, defekt, botblock, ignoriert, redirects, alle: results };
writeFileSync(`${ROOT}research/link-audit-${STAMP}.json`, JSON.stringify(out, null, 2) + '\n');

console.log('\n=== ERGEBNIS ===');
console.log('geprüft:', results.length, '| DEFEKT:', defekt.length, '| Bot-Blocking (existiert):', botblock.length, '| Beispiel/API-Endpunkte ignoriert:', ignoriert.length, '| Redirects:', redirects.length);
for (const b of defekt) console.log(`  ✗ ${b.status || b.error}${b.soft ? ' SOFT404' : ''}  ${b.url}  ← ${b.wo.join(', ')}`);
for (const b of botblock) console.log(`  ~ ${b.status || b.error} (bot-block, verifiziert)  ${b.url}`);
