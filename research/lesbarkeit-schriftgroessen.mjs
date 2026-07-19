/**
 * Qualitäts-Phase It. 165: Fließtext auf /vergleiche/ und /feed/ war durchgehend
 * 12–12,5 px und las sich auf dem Handy wie Kleingedrucktes (Audit: 335 bzw. 124
 * Textknoten unter 13 px). Hebt Fließtext auf 14 px, Meta-/Label-Zeilen auf 13 px.
 *
 * Label-Zeilen mit letterSpacing (Tabellenköpfe, Kicker) bleiben klein — dort ist
 * die kleine Versalschrift Absicht und die Zeilen sind kurz.
 *
 * Idempotent: läuft mehrfach ohne weitere Wirkung, weil 12/12.5 danach fehlen.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DATEIEN = [
  'C:/Users/marvi/promptgarden/site/app/[lang]/vergleiche/page.tsx',
  'C:/Users/marvi/promptgarden/site/app/[lang]/feed/page.tsx',
];

for (const p of DATEIEN) {
  let s;
  try {
    s = readFileSync(p, 'utf8');
  } catch {
    console.log('fehlt, übersprungen:', p);
    continue;
  }
  const vorher = s;
  let label = 0;

  // Zeilenweise, damit letterSpacing-Labels ausgenommen werden können
  const zeilen = s.split('\n').map((z) => {
    if (/letterSpacing/.test(z)) {
      label++;
      return z.replace(/fontSize: 12\.5\b/g, 'fontSize: 13');
    }
    return z
      .replace(/fontSize: 12\.5\b/g, 'fontSize: 14')
      .replace(/fontSize: 12\b(?!\.)/g, 'fontSize: 13');
  });
  s = zeilen.join('\n');

  if (s === vorher) {
    console.log('schon angehoben:', p.split('/').pop());
    continue;
  }
  writeFileSync(p, s);
  const n = (vorher.match(/fontSize: 12(\.5)?\b/g) || []).length;
  console.log(`${p.split('/').slice(-2).join('/')}: ${n} Stellen angehoben (${label} Label-Zeilen schonend)`);
}
