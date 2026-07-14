// Review-Fixes Vergleiche-v2 (Adversarial-Review 14.07.): 1 BLOCK + 6 FIX + 3 NOTEs.
// Geparste Objekte, harte Anker — NOT FOUND wirft. Zusätzlich: Duelle-Sektion einmergen (benchmark-Objekt → String).
import { readFileSync, writeFileSync } from 'node:fs';

const P = 'C:/Users/marvi/promptgarden/research/vergleiche-v2.json';
const v = JSON.parse(readFileSync(P, 'utf8'));
const duelle = JSON.parse(readFileSync('C:/Users/marvi/promptgarden/research/vergleiche-duelle.json', 'utf8'));

const XAI_QUOTE = {
  de: 'xAI: „For everything else, including code, use Grok 4.5. It is the most intelligent and fastest model we’ve built." Cursor co-trainiert es und nennt es sein Flaggschiff-Modell.',
  en: 'xAI: "For everything else, including code, use Grok 4.5. It is the most intelligent and fastest model we’ve built." Cursor co-trains it and calls it its flagship model.',
};

for (const l of ['de', 'en']) {
  const d = v[l];

  // BLOCK: Grok 4.5 — offizielle xAI-Positionierung existiert (docs.x.ai/docs/models)
  const xai = d.modelle.anbieter.find((a) => a.name === 'xAI');
  const g45 = xai.modelle.find((m) => m.name === 'Grok 4.5');
  g45.positionierung = XAI_QUOTE[l];
  g45.schwach = g45.schwach.filter((s) => !/Keine offizielle|No verifiable/.test(s));
  if (g45.schwach.length === 0) throw new Error('grok45 schwach leer');
  g45.wofuer = l === 'de'
    ? 'Nimm es in Cursor für die schwierigsten Aufgaben — laut xAI ihr intelligentestes und schnellstes Modell.'
    : 'Use it in Cursor for the hardest tasks — per xAI their most intelligent and fastest model.';
  if (!g45.sources) g45.sources = undefined; // Quellen liegen auf Sektionsebene

  // Quellen-Sektion: docs.x.ai ist laut Review bereits zitiert — prüfen, sonst ergänzen
  if (!d.modelle.sources.some((s) => s.url.includes('docs.x.ai'))) {
    d.modelle.sources.push({ title: 'xAI Docs: Models', url: 'https://docs.x.ai/docs/models' });
  }

  // FIX: Quadrant Grok capTier 2.5 → 3 (jetzt durch xAI-Eigenaussage gedeckt)
  const qg = d.quadrant.models.find((m) => m.name === 'Grok 4.5');
  if (qg.capTier !== 2.5) throw new Error('quadrant grok capTier unerwartet: ' + qg.capTier);
  qg.capTier = 3;

  // FIX: Fable schwach[0] — Opus 4.1 (deprecated) ist teurer; präzisieren + Stand-Marker (NOTE)
  const anth = d.modelle.anbieter.find((a) => a.name === 'Anthropic');
  const fable = anth.modelle.find((m) => /Fable/.test(m.name));
  const oldFable = l === 'de' ? 'Teuerstes Claude-Modell (10 $/50 $)' : 'Most expensive Claude model ($10/$50)';
  const newFable = l === 'de'
    ? 'Teuerstes Modell der aktuellen Claude-Generation (10 $/50 $, Stand: Juli 2026)'
    : 'Most expensive model of the current Claude generation ($10/$50, as of July 2026)';
  const fi = fable.schwach.indexOf(oldFable);
  if (fi === -1) throw new Error('fable schwach anchor');
  fable.schwach[fi] = newFable;

  // FIX: Gemini 3.1 Pro schwach[1] — auf allen Längen teurer als Flash
  const goo = d.modelle.anbieter.find((a) => a.name === 'Google');
  const pro = goo.modelle.find((m) => /3\.1 Pro/.test(m.name));
  const oldPro = l === 'de' ? 'Teurer als Flash bei langen Prompts (>200K)' : 'More expensive than Flash on long prompts (>200K)';
  const newPro = l === 'de' ? 'Teurer als Flash (bei >200K-Prompts nochmals gestaffelt)' : 'More expensive than Flash (with an extra tier above 200K prompts)';
  const pi = pro.schwach.indexOf(oldPro);
  if (pi === -1) throw new Error('gempro schwach anchor');
  pro.schwach[pi] = newPro;

  // FIX: claude-code highlights[2] — Default hängt vom Account ab (in-page-Konsistenz)
  const cc = d.tools.find((t) => t.id === 'claude-code');
  const oldH = l === 'de' ? 'Standard-Modell Sonnet 5 mit 1M-Token-Kontext' : 'Default model Sonnet 5 with 1M token context';
  const newH = l === 'de'
    ? 'Default-Modell je nach Abo (Opus 4.8 oder Sonnet 5, 1M-Token-Kontext bei Sonnet 5) — Wechsel per /model'
    : 'Default model depends on your plan (Opus 4.8 or Sonnet 5, 1M token context on Sonnet 5) — switch via /model';
  const hi = cc.highlights.indexOf(oldH);
  if (hi === -1) throw new Error('cc highlight anchor');
  cc.highlights[hi] = newH;

  // FIX: GPT-5.6 Luna schwach[0] — Inferenz als Positionierung formulieren
  const oa = d.modelle.anbieter.find((a) => a.name === 'OpenAI');
  const luna = oa.modelle.find((m) => /Luna/.test(m.name));
  const oldL = l === 'de' ? 'Für komplexe oder mehrdeutige Aufgaben nicht empfohlen' : 'Not recommended for complex or ambiguous tasks';
  const newL = l === 'de' ? 'Von OpenAI nur für klare, wiederholbare Arbeit positioniert' : 'Positioned by OpenAI only for clear, repeatable work';
  const li = luna.schwach.indexOf(oldL);
  if (li === -1) throw new Error('luna schwach anchor');
  luna.schwach[li] = newL;

  // FIX: Grok 4.3 preis — Hedge entfernen (Zahl ist exakt belegt)
  const g43 = xai.modelle.find((m) => m.name !== 'Grok 4.5');
  g43.preis = l === 'de' ? '1,25 $ / 2,50 $ pro MTok (Stand: Juli 2026)' : '$1.25 / $2.50 per MTok (as of July 2026)';

  // NOTE: picker guenstig — Stand-Marker an Inline-Preis
  const guenstig = d.picker.szenarien.find((s) => s.id.includes('guenstig') || s.id.includes('lernen'));
  const gAnchor = l === 'de' ? '1 $/5 $ pro MTok' : '$1/$5 per MTok';
  if (!guenstig.warum.includes(gAnchor)) throw new Error('guenstig anchor');
  guenstig.warum = guenstig.warum.replace(gAnchor, gAnchor + (l === 'de' ? ' (Stand: Juli 2026)' : ' (as of July 2026)'));

  // NOTE: ide-Szenario — unbelegten Shortcut entfernen
  const ide = d.picker.szenarien.find((s) => s.id.includes('ide'));
  ide.beispiel = l === 'de'
    ? 'Composer in Cursor öffnen: "Baue eine Login-Seite mit E-Mail- und Passwort-Feld, inkl. Validierung."'
    : 'Open Composer in Cursor: "Build a login page with email and password fields, including validation."';

  // NOTE: Antigravity standard glätten — alle Pläne haben beide Kernmodelle
  const agy = d.imTool.tools.find((t) => /Antigravity/.test(t.tool));
  agy.standard = l === 'de'
    ? 'Alle Pläne haben die beiden Gemini-Kernmodelle (3.5 Flash, 3.1 Pro) — wechseln mit `/model`; ab Ultra kommen Drittmodelle (Claude, GPT-OSS) dazu.'
    : 'All plans include both Gemini core models (3.5 Flash, 3.1 Pro) — switch with `/model`; Ultra adds third-party models (Claude, GPT-OSS).';

  // DUELLE einmergen (benchmark-Objekt → String flatten)
  const du = duelle[l];
  du.items = du.items.map((it) => {
    if (it.benchmark && typeof it.benchmark === 'object') {
      const b = it.benchmark;
      it.benchmark = `${b.test}: ${b.wert} — ${b.aussage} (${b.stand ?? ''}${b.quelle ? ', ' + b.quelle : ''})`.replace(' ()', '');
    }
    return it;
  });
  d.duelle = du;
}

writeFileSync(P, JSON.stringify(v, null, 2));

// Nach-Validierung
for (const l of ['de', 'en']) {
  const d = v[l];
  if (!d.duelle || d.duelle.items.length !== 4) throw new Error('duelle fehlen ' + l);
  for (const it of d.duelle.items) {
    if (it.benchmark && typeof it.benchmark !== 'string') throw new Error('benchmark nicht geflattet');
    if (!it.sources?.length) throw new Error('duell ohne quellen');
  }
}
const ids = (o) => JSON.stringify(o.duelle.items.map((i) => i.id));
if (ids(v.de) !== ids(v.en)) throw new Error('duelle-id-drift');
console.log('FIXES+DUELLE OK.');
console.log('grok45 pos (de):', v.de.modelle.anbieter.find((a) => a.name === 'xAI').modelle[0].positionierung.slice(0, 90));
console.log('duelle:', ids(v.de), '| benchmark[0]:', v.de.duelle.items[0].benchmark);
