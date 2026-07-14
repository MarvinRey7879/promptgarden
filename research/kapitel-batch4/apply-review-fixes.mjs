// Review-Fixes Batch 4 (Adversarial-Review 14.07.): 4 BLOCK + 3 FIX + 2 NOTE.
// Arbeitet auf geparsten Objekten; jeder Ersatz mit hartem Anker — NOT FOUND wirft.
import { readFileSync, writeFileSync } from 'node:fs';

const A = 'C:/Users/marvi/promptgarden/research/kapitel-batch4/batch4-a.json';
const B = 'C:/Users/marvi/promptgarden/research/kapitel-batch4/batch4-b.json';
const a = JSON.parse(readFileSync(A, 'utf8'));
const b = JSON.parse(readFileSync(B, 'utf8'));

const pick = (arr, slug) => {
  const e = arr.find((x) => x.slug === slug);
  if (!e) throw new Error('slug fehlt: ' + slug);
  return e;
};
const sub = (obj, field, from, to) => {
  if (!obj[field].includes(from)) throw new Error(`NOT FOUND in ${obj.slug}.${field}: ${from.slice(0, 60)}`);
  obj[field] = obj[field].replace(from, to);
};

for (const lang of ['de', 'en']) {
  // BLOCK 1+2+3: legacy-code-modernisieren — Quellen ersetzen/ergänzen
  const legacy = pick(a[lang], 'legacy-code-modernisieren');
  if (legacy.sources[0].url !== 'https://www.industriallogic.com/blog/characterization-tests/')
    throw new Error('legacy sources[0] unerwartet');
  legacy.sources = [
    { title: 'Characterization test — Wikipedia', url: 'https://en.wikipedia.org/wiki/Characterization_test' },
    { title: 'Legacy code — Wikipedia', url: 'https://en.wikipedia.org/wiki/Legacy_code' },
    { title: 'Strangler Fig Application — martinfowler.com', url: 'https://martinfowler.com/bliki/StranglerFigApplication.html' },
    { title: 'Strangler Fig pattern — Microsoft Learn', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig' },
    { title: 'Legacy Seam — martinfowler.com', url: 'https://martinfowler.com/bliki/LegacySeam.html' },
  ];

  // BLOCK 4: refactoring-mit-ki — Begriffs-Herkunft korrigieren
  const refac = pick(a[lang], 'refactoring-mit-ki');
  if (lang === 'de') {
    sub(refac, 'body', 'Der Begriff stammt aus Martin Fowlers gleichnamigem Buch.', 'Bekannt wurde der Begriff vor allem durch Martin Fowlers gleichnamiges Buch.');
  } else {
    sub(refac, 'body', "The term comes from Martin Fowler's book of the same name.", "The term was popularized by Martin Fowler's book of the same name.");
  }
  // FIX 1: costs-Doku als Quelle ergänzen (deckt „nach jeder Datei testen")
  if (!refac.sources.some((s) => s.url.endsWith('/docs/en/costs'))) {
    refac.sources.push({ title: 'Claude Code: Manage costs effectively', url: 'https://code.claude.com/docs/en/costs' });
  }

  // FIX 2: sicherheits-audits — generische security-Seite durch code-review-Doku ersetzen
  const sec = pick(b[lang], 'sicherheits-audits-mit-ki');
  const si = sec.sources.findIndex((s) => s.url === 'https://code.claude.com/docs/en/security');
  if (si === -1) throw new Error('sicherheits: security-URL fehlt');
  sec.sources[si] = { title: 'Claude Code: Code review', url: 'https://code.claude.com/docs/en/code-review' };

  // FIX 3: datenbanken — archivierten Postgres-Referenzserver präzise benennen
  const db = pick(b[lang], 'datenbanken-mit-agenten');
  if (lang === 'de') {
    sub(db, 'bodyDetail',
      'Referenzimplementierungen für Datenbank-Anbindungen an KI-Tools werben deshalb ausdrücklich mit reinem Lesezugriff und Schema-Einsicht als Standard-Sicherheitsmaßnahme, weisen aber auch klar darauf hin',
      'Der (inzwischen archivierte) Postgres-Referenzserver des MCP-Projekts warb deshalb ausdrücklich mit reinem Lesezugriff und Schema-Einsicht als Standard-Sicherheitsmaßnahme – und solche Referenzimplementierungen weisen klar darauf hin');
  } else {
    sub(db, 'bodyDetail',
      "Reference implementations for connecting AI tools to databases explicitly advertise read-only access with schema inspection as a default safety measure, but they're equally clear",
      "The MCP project's (now archived) Postgres reference server explicitly advertised read-only access with schema inspection as its default safety measure — and such reference implementations are equally clear");
  }

  // NOTE 1: kosten — Stand-Marker auf Caching- und Batch-Absätze ausweiten
  const kosten = pick(a[lang], 'kosten-optimierung-praxis');
  if (lang === 'de') {
    sub(kosten, 'bodyDetail', '## Caching mit Zahlen\n', '## Caching mit Zahlen (Stand: Juli 2026)\n');
    sub(kosten, 'bodyDetail', '## Batch-Verarbeitung mit Zahlen\n', '## Batch-Verarbeitung mit Zahlen (Stand: Juli 2026)\n');
  } else {
    const capLines = kosten.bodyDetail.split('\n').filter((l) => l.startsWith('## '));
    const cache = capLines.find((l) => /cach/i.test(l));
    const batch = capLines.find((l) => /batch/i.test(l));
    if (!cache || !batch) throw new Error('kosten en: Header nicht gefunden: ' + JSON.stringify(capLines));
    if (!/2026/.test(cache)) sub(kosten, 'bodyDetail', cache + '\n', cache + ' (as of July 2026)\n');
    if (!/2026/.test(batch)) sub(kosten, 'bodyDetail', batch + '\n', batch + ' (as of July 2026)\n');
  }
  // NOTE 2: prompt-caching-URL auf platform.claude.com vereinheitlichen
  const ci = kosten.sources.findIndex((s) => s.url === 'https://docs.claude.com/en/docs/build-with-claude/prompt-caching');
  if (ci === -1) throw new Error('kosten: docs.claude.com-URL fehlt');
  kosten.sources[ci].url = 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching';
}

writeFileSync(A, JSON.stringify(a, null, 2));
writeFileSync(B, JSON.stringify(b, null, 2));

// Nach-Validierung: Quellen-Sets DE/EN identisch, Marker gesetzt, Anker gelandet
for (const [name, data] of [['a', a], ['b', b]]) {
  for (const e of data.de) {
    const en = data.en.find((x) => x.slug === e.slug);
    const d = JSON.stringify(e.sources.map((s) => s.url));
    const g = JSON.stringify(en.sources.map((s) => s.url));
    if (d !== g) throw new Error(`Quellen-Drift ${name}/${e.slug}: ${d} vs ${g}`);
  }
}
const leg = a.de.find((x) => x.slug === 'legacy-code-modernisieren');
if (leg.sources.length !== 5) throw new Error('legacy sources != 5');
console.log('FIXES OK. legacy sources:', leg.sources.map((s) => s.url).join(' | '));
console.log('refactoring body (de):', a.de.find((x) => x.slug === 'refactoring-mit-ki').body.match(/Bekannt wurde[^.]+\./)[0]);
console.log('kosten header (en):', a.en.find((x) => x.slug === 'kosten-optimierung-praxis').bodyDetail.split('\n').filter((l) => l.includes('2026')).join(' || '));
