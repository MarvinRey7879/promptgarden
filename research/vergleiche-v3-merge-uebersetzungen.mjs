#!/usr/bin/env node
// Wendet die Übersetzungs-JSONs (en/es/fr/zh) auf vergleiche.<lang>.json an.
// Validiert hart, dass alle Zahlen-/Strukturfelder identisch zur DE-Quelle sind.
import { readFileSync, writeFileSync } from 'node:fs';

const de = JSON.parse(readFileSync(new URL('../site/content/vergleiche.de.json', import.meta.url), 'utf8'));
const NEU_NAMEN = ['Moonshot AI', 'DeepSeek', 'Zhipu / Z.ai', 'Meta', 'Alibaba (Qwen)', 'Mistral'];

for (const lang of ['en', 'es', 'fr', 'zh']) {
  const tr = JSON.parse(readFileSync(new URL(`./vergleiche-v3-uebersetzt.${lang}.json`, import.meta.url), 'utf8'));
  const tgt = JSON.parse(readFileSync(new URL(`../site/content/vergleiche.${lang}.json`, import.meta.url), 'utf8'));

  // Quadrant: Zahlenfelder gegen DE prüfen
  if (tr.quadrant.models.length !== de.quadrant.models.length) throw new Error(lang + ': quadrant Anzahl');
  tr.quadrant.models.forEach((m, i) => {
    const d = de.quadrant.models[i];
    for (const k of ['name', 'anbieter', 'blended', 'index', 'cluster', 'open']) {
      if (JSON.stringify(m[k]) !== JSON.stringify(d[k])) throw new Error(`${lang}: quadrant[${i}].${k} weicht ab`);
    }
    if ((m.la ?? 'r') !== (d.la ?? 'r')) throw new Error(`${lang}: quadrant[${i}].la`);
  });
  if (tr.quadrant.zones.length !== 3) throw new Error(lang + ': zones');
  tr.quadrant.zones.forEach((z, i) => { if (z.id !== de.quadrant.zones[i].id) throw new Error(lang + ': zone-id'); });

  // Ratio: Zahlen prüfen
  if (tr.ratio.rows.length !== de.ratio.rows.length) throw new Error(lang + ': ratio Anzahl');
  tr.ratio.rows.forEach((r, i) => {
    const d = de.ratio.rows[i];
    for (const k of ['platz', 'name', 'anbieter', 'index', 'ratio', 'open']) {
      if (JSON.stringify(r[k]) !== JSON.stringify(d[k])) throw new Error(`${lang}: ratio[${i}].${k} weicht ab`);
    }
    if (!r.blended) throw new Error(`${lang}: ratio[${i}].blended leer`);
  });
  if (tr.ratio.fussnoten.length !== de.ratio.fussnoten.length) throw new Error(lang + ': fussnoten Anzahl');

  // Neue Anbieter: Struktur prüfen
  if (tr.neueAnbieter.length !== 6) throw new Error(lang + ': neueAnbieter ' + tr.neueAnbieter.length);
  tr.neueAnbieter.forEach((g, gi) => {
    const dg = de.modelle.anbieter.find((a) => a.name === NEU_NAMEN[gi]);
    if (g.name !== dg.name) throw new Error(`${lang}: Gruppe ${gi} name ${g.name}`);
    if (g.modelle.length !== dg.modelle.length) throw new Error(`${lang}: ${g.name} Kartenzahl`);
    g.modelle.forEach((m, mi) => {
      if (m.name !== dg.modelle[mi].name) throw new Error(`${lang}: ${g.name}[${mi}] name`);
      for (const k of ['positionierung', 'kontext', 'preis', 'wofuer']) if (!m[k]) throw new Error(`${lang}: ${g.name}/${m.name}.${k} leer`);
      if (!Array.isArray(m.stark) || !m.stark.length || !Array.isArray(m.schwach) || !m.schwach.length) throw new Error(`${lang}: ${g.name}/${m.name} stark/schwach`);
    });
  });

  // Anwenden
  tgt.updated = de.updated;
  tgt.quadrant = tr.quadrant;
  tgt.ratio = tr.ratio;
  tgt.modelle.intro = tr.modelleIntro;
  // Gemini-Kartenname angleichen (DE: "Gemini 3.1 Pro Preview" → "Gemini 3.1 Pro")
  const g = tgt.modelle.anbieter.find((a) => a.name === 'Google');
  const gp = g?.modelle.find((m) => typeof m.name === 'string' && m.name.startsWith('Gemini 3.1 Pro'));
  if (gp) gp.name = 'Gemini 3.1 Pro';
  // Alte neue-Gruppen entfernen falls Re-Run, dann anhängen
  tgt.modelle.anbieter = tgt.modelle.anbieter.filter((a) => !NEU_NAMEN.includes(a.name)).concat(tr.neueAnbieter);

  // Neue Quellen-Einträge aus DE übernehmen (neutrale Titel, URL-dedupliziert)
  const haveSrc = new Set(tgt.modelle.sources.map((s) => s.url));
  for (const s of de.modelle.sources) if (!haveSrc.has(s.url)) tgt.modelle.sources.push(s);

  writeFileSync(new URL(`../site/content/vergleiche.${lang}.json`, import.meta.url), JSON.stringify(tgt, null, 2) + '\n');
  console.log(`✅ ${lang}: quadrant+ratio+${tr.neueAnbieter.length} Gruppen angewendet (${tgt.modelle.anbieter.length} Anbieter)`);
}
