/**
 * Qualitäts-Phase It. 171: Vier Quell-URLs zu modelcontextprotocol.io waren durch
 * einen String-Verkettungsfehler kaputt — ein Präfix ".../docs/getting-started/
 * intro" wurde fälschlich vor den eigentlichen Pfad geklebt, sodass "introdocs"
 * bzw. "introintroduction" entstand. Alle vier lieferten HTTP 404.
 *
 * Die korrekten Ziele wurden einzeln auf HTTP 200 geprüft (It. 171). Betroffen
 * sind addons.*.json (2 URLs) und entries.*.json (2 URLs), je 5 Sprachen.
 *
 * Nur die URL ändert sich, der Quellentitel bleibt. Idempotent.
 * Aufruf aus dem REPO-ROOT: node research/mcp-url-verkettung-fix.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

// kaputt → korrekt, jedes Ziel auf 200 geprüft
const MAP = {
  'https://modelcontextprotocol.io/docs/getting-started/introintroduction':
    'https://modelcontextprotocol.io/docs/getting-started/intro',
  'https://modelcontextprotocol.io/docs/getting-started/introdocs/tutorials/security/security_best_practices':
    'https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices',
  'https://modelcontextprotocol.io/docs/getting-started/introdocs/develop/build-server':
    'https://modelcontextprotocol.io/docs/develop/build-server',
  'https://modelcontextprotocol.io/docs/getting-started/introdocs/learn/server-concepts':
    'https://modelcontextprotocol.io/docs/learn/server-concepts',
};

const DATEIEN = ['addons', 'entries'];
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

let gesamt = 0;
for (const basis of DATEIEN) {
  for (const lang of LANGS) {
    const pfad = `site/content/${basis}.${lang}.json`;
    const daten = JSON.parse(readFileSync(pfad, 'utf8'));
    let n = 0;
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === 'object') {
        if (typeof o.url === 'string' && MAP[o.url]) {
          o.url = MAP[o.url];
          n++;
        }
        Object.values(o).forEach(walk);
      }
    };
    walk(daten);
    if (n) {
      writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
      console.log(`${basis}.${lang}.json: ${n} URLs korrigiert`);
      gesamt += n;
    }
  }
}
console.log('gesamt:', gesamt);
