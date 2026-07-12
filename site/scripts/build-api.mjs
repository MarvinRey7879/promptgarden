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

const files = readdirSync(contentDir).filter((f) => f.endsWith('.json'));
for (const f of files) {
  cpSync(join(contentDir, f), join(apiDir, f));
}

const index = {
  name: 'promptgarten free content API',
  description:
    'Free, no-auth JSON access to all promptgarten learning content. CC-BY-style reuse: link back to promptgarten. Content language variants: de, en, es, fr, zh.',
  base: '/api/',
  endpoints: {
    'entries.<lang>.json': 'All glossary/learning entries (title, teaser, body markdown, difficulty 1-3, quiz, sources).',
    'feed.<lang>.json': 'Curated AI news feed items with verified sources.',
    'vergleiche.<lang>.json': 'Tool comparison (Claude Code, Cursor, Codex CLI, Aider).',
    'loops.<lang>.json': 'Loop gallery: annotated examples of good and bad agent loops.',
  },
  files,
  generated: new Date().toISOString().slice(0, 10),
};
writeFileSync(join(apiDir, 'index.json'), JSON.stringify(index, null, 2));
console.log(`api: ${files.length} content files + index.json → public/api/`);
