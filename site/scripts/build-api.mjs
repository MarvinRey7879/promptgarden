/**
 * Baut die freie JSON-API für KI-Agenten: kopiert Content nach public/api/
 * und erzeugt einen Index. Läuft als prebuild-Step — public/ landet 1:1 in out/.
 */
import { cpSync, writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const contentDir = join(root, 'content');
const apiDir = join(root, 'public', 'api');

// Sanity-Gate: Feed-Datum = Ereignisdatum, nie Versions-/Zukunftsdatum
// (Lektion It. 40: MCP-Spec-Item trug Spec-Versionsdatum in der Zukunft und klebte oben).
const today = new Date().toISOString().slice(0, 10);
for (const f of readdirSync(contentDir).filter((x) => x.startsWith('feed.') && x.endsWith('.json'))) {
  const bad = JSON.parse(readFileSync(join(contentDir, f), 'utf8')).filter((i) => i.date > today);
  if (bad.length) {
    console.error(`FEHLER ${f}: Zukunftsdatum in ${bad.map((i) => `${i.id}(${i.date})`).join(', ')}`);
    process.exit(1);
  }
}

mkdirSync(apiDir, { recursive: true });

/**
 * Beschreibung je Content-Typ. Fehlt hier ein Typ, der in content/ liegt, bricht
 * der Build — sonst wächst die API still weiter, während der Index alt bleibt
 * (It. 148: rosetta/fehler waren seit Tagen ausgeliefert, aber nirgends dokumentiert).
 */
const ENDPOINT_DOCS = {
  'entries.<lang>.json': 'All glossary/learning entries (title, teaser, body + bodyDetail, difficulty 1-3, quiz, exercise, sources).',
  'feed.<lang>.json': 'Curated AI news feed items with verified sources.',
  'vergleiche.<lang>.json': 'Model and tool comparison: intelligence-per-dollar quadrant, price/performance ratio table, provider profiles.',
  'commands.<lang>.json': 'Command reference: every CLI/slash command per platform with when-to-use and when-not examples and sources.',
  'rosetta.<lang>.json': 'Cross-platform command map: one task per row, the matching command on each of the 5 platforms (null where a platform has none).',
  'fehler.<lang>.json': 'Troubleshooting catalog: real error messages with cause, fix steps, prevention and sources.',
  'loops.<lang>.json': 'Loop gallery: annotated examples of good and bad agent loops.',
  'addons.<lang>.json': 'Add-ons and MCP servers with setup instructions from official docs.',
  'prompts.<lang>.json': 'Reusable prompt templates with placeholders and when-to-use notes.',
  'benchmarks.<lang>.json': 'Benchmark explainers: what each benchmark measures and how to read it.',
  'timeline.<lang>.json': 'Model release and deprecation timeline.',
};

const files = readdirSync(contentDir).filter((f) => f.endsWith('.json'));

const typen = [...new Set(files.map((f) => f.replace(/\.(de|en|es|fr|zh)\.json$/, '')))];
const undokumentiert = typen.filter((t) => !ENDPOINT_DOCS[`${t}.<lang>.json`]);
if (undokumentiert.length) {
  console.error(`FEHLER: Content-Typ(en) ohne API-Beschreibung in build-api.mjs: ${undokumentiert.join(', ')}`);
  process.exit(1);
}
for (const f of files) {
  cpSync(join(contentDir, f), join(apiDir, f));
}

const index = {
  name: 'promptgarten free content API',
  description:
    'Free, no-auth JSON access to all promptgarten learning content. CC-BY-style reuse: link back to promptgarten. Content language variants: de, en, es, fr, zh.',
  base: '/api/',
  endpoints: ENDPOINT_DOCS,
  files,
  generated: new Date().toISOString().slice(0, 10),
};
writeFileSync(join(apiDir, 'index.json'), JSON.stringify(index, null, 2));
console.log(`api: ${files.length} content files + index.json → public/api/`);
