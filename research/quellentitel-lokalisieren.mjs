/**
 * Qualitäts-Phase It. 166: In den englischen, spanischen, französischen und
 * chinesischen Inhalten standen 1031 Quellenangaben mit deutschem Titel
 * ("Claude Code Doku (offiziell)"). Betroffen waren commands, entries, addons
 * und vergleiche — also ausgerechnet die Belege, auf denen das Quellen-
 * Versprechen der Plattform steht, und die meistbesuchten Befehlsseiten.
 *
 * Dieses Skript ersetzt die Titel anhand einer geprüften Zuordnungstabelle.
 * URLs bleiben unangetastet. Produktnamen und englische Seitenüberschriften
 * bleiben stehen, damit die Quelle auffindbar bleibt.
 *
 * Idempotent: nach dem Lauf greift kein Schlüssel mehr.
 *
 * Aufruf aus dem REPO-ROOT:
 *   node research/quellentitel-lokalisieren.mjs <pfad-zur-titel-map.json>
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const mapPfad = process.argv[2];
if (!mapPfad) throw new Error('Pfad zur titel-map.json fehlt');
const MAP = JSON.parse(readFileSync(mapPfad, 'utf8'));

const SPRACHEN = ['en', 'es', 'fr', 'zh'];
const ORDNER = 'site/content/';

// Prüfen, dass die Tabelle vollständig ist, bevor irgendetwas geschrieben wird
for (const [de, ziel] of Object.entries(MAP)) {
  for (const l of SPRACHEN) {
    if (!ziel[l] || typeof ziel[l] !== 'string' || !ziel[l].trim()) {
      throw new Error(`Übersetzung fehlt: "${de}" → ${l}`);
    }
    if (ziel[l] === de && !/^[A-Za-z0-9 .:\/()-]+$/.test(de)) {
      throw new Error(`Übersetzung identisch zum Original: "${de}" → ${l}`);
    }
  }
}
console.log('Zuordnungstabelle vollständig:', Object.keys(MAP).length, 'Titel');

let gesamt = 0;
for (const datei of readdirSync(ORDNER)) {
  const m = datei.match(/\.(en|es|fr|zh)\.json$/);
  if (!m) continue;
  const lang = m[1];
  const pfad = ORDNER + datei;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  let n = 0;

  const gehe = (o) => {
    if (Array.isArray(o)) return o.forEach(gehe);
    if (o && typeof o === 'object') {
      if (typeof o.title === 'string' && typeof o.url === 'string' && MAP[o.title]) {
        o.title = MAP[o.title][lang];
        n++;
      }
      Object.values(o).forEach(gehe);
    }
  };
  gehe(daten);

  if (n) {
    writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
    console.log(`${datei}: ${n} Titel lokalisiert`);
    gesamt += n;
  }
}
console.log('gesamt:', gesamt);
