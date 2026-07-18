/**
 * Schreibt veraltete Quell-URLs auf ihr echtes Redirect-Ziel um — über alle
 * Sprachdateien hinweg, damit die Quellen-Sets identisch bleiben.
 * Basis: research/link-audit-<stamp>.json (Feld redirects) + manuelle Sonderfälle.
 *
 * Aufruf: node research/kanonisiere-links.mjs --stamp=2026-07-18 [--apply]
 * Ohne --apply nur Trockenlauf.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const ROOT = 'C:/Users/marvi/promptgarden/';
const STAMP = process.argv.find((a) => a.startsWith('--stamp='))?.split('=')[1];
const APPLY = process.argv.includes('--apply');
if (!STAMP) throw new Error('--stamp=YYYY-MM-DD fehlt');

const audit = JSON.parse(readFileSync(`${ROOT}research/link-audit-${STAMP}.json`, 'utf8'));

/** Sonderfälle: Ziel des Redirects stützt den Claim nicht mehr → bewusst andere Seite. */
const MANUELL = {
  // Redirect landete auf der userguide-Startseite ohne Fine-Tuning-Inhalt (0 Treffer);
  // custom-models.html nennt "Supervised fine-tuning" explizit.
  'https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization.html':
    'https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html',
};

const map = new Map(Object.entries(MANUELL));
for (const r of audit.redirects ?? []) {
  if (map.has(r.url)) continue;
  if (!r.finalUrl || r.finalUrl === r.url) continue;
  // Nur echte Ziel-Änderungen; reines /-Anhängen oder http→https lohnt den Diff nicht.
  const norm = (u) => u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '').toLowerCase();
  if (norm(r.url) === norm(r.finalUrl)) continue;
  // Tracking-Parameter, die manche Seiten anhängen, nicht übernehmen.
  const ziel = r.finalUrl.split('?')[0].split('#')[0];
  if (!/^https:\/\//.test(ziel)) continue;
  map.set(r.url, ziel);
}

console.log('Umschreibungen geplant:', map.size, APPLY ? '(APPLY)' : '(Trockenlauf)');

const files = readdirSync(`${ROOT}site/content`).filter((f) => f.endsWith('.json'));
let dateienGeaendert = 0;
let ersetzungen = 0;

for (const f of files) {
  const path = `${ROOT}site/content/${f}`;
  const raw = readFileSync(path, 'utf8');
  let out = raw;
  let n = 0;
  for (const [alt, neu] of map) {
    if (!out.includes(alt)) continue;
    const teile = out.split(alt);
    n += teile.length - 1;
    out = teile.join(neu);
  }
  if (n > 0) {
    ersetzungen += n;
    dateienGeaendert++;
    console.log(`  ${f.padEnd(24)} ${n} Ersetzungen`);
    if (APPLY) {
      JSON.parse(out); // Sicherheitsnetz: nur valides JSON schreiben
      writeFileSync(path, out);
    }
  }
}

console.log(`\n${dateienGeaendert} Dateien, ${ersetzungen} Ersetzungen ${APPLY ? 'geschrieben' : '(nichts geschrieben)'}`);
