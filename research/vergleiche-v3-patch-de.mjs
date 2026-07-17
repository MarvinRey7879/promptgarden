#!/usr/bin/env node
// Vergleiche-v3 (Marvin-Direktive 17.07.): Quadrant → Intelligence-to-Cost-Scatter,
// neue Ratio-Sektion, +9 Modell-Karten (Moonshot/DeepSeek/Zhipu/Meta/Alibaba/Mistral).
// Datenquelle: research/vergleiche-v3-research.md (41 verifizierte Quellen, Abruf 17.07.2026).
import { readFileSync, writeFileSync } from 'node:fs';

const P = new URL('../site/content/vergleiche.de.json', import.meta.url);
const v = JSON.parse(readFileSync(P, 'utf8'));

v.updated = '2026-07-17';

/* ── Quadrant v3: echter Scatter nach Intelligenz-pro-Kosten ── */
v.quadrant = {
  title: 'Intelligenz pro Dollar: alle großen Modelle auf einen Blick',
  intro: 'Jeder Punkt ist ein Modell. Nach rechts wird es teurer (Preis pro 1 Mio. Token, gemischt 3:1 Eingabe:Ausgabe, log-Skala), nach oben schlauer (Intelligenz-Index von Artificial Analysis, v4.1). Links oben ist der Sweet Spot.',
  xLabel: 'Preis pro 1M Token (gemischt 3:1, log-Skala)',
  yLabel: 'Intelligenz-Index (Artificial Analysis v4.1)',
  hinweis: 'Preise = offizielle API-Listenpreise (ohne Batch/Cache), Index = Artificial Analysis Intelligence Index v4.1 in der dort getesteten Konfiguration (meist höchstes Reasoning). Stand: 17.07.2026 — Zahlen ändern sich schnell.',
  zones: [
    { id: 'frontier', label: 'Frontier', desc: 'Maximale Fähigkeit — wenn das Ergebnis wichtiger ist als der Preis.' },
    { id: 'preis', label: 'Preis-Leistung', desc: 'Viel Intelligenz fürs Geld — der Alltags-Bereich für die meisten Aufgaben.' },
    { id: 'budget', label: 'Budget', desc: 'Günstig für Masse, einfache Tasks und Experimente — oft Open Weights.' },
  ],
  openLabel: 'Open Weights (selbst hostbar)',
  models: [
    { name: 'Fable 5', anbieter: 'Anthropic', blended: 20.0, index: 59.86, cluster: 'frontier', open: false, la: 'r' },
    { name: 'GPT-5.6 Sol', anbieter: 'OpenAI', blended: 11.25, index: 58.89, cluster: 'frontier', open: false, la: 'r' },
    { name: 'Kimi K3', anbieter: 'Moonshot', blended: 6.0, index: 57.11, cluster: 'frontier', open: false, la: 'l', hinweis: 'Open Weights angekündigt für 27.07.2026' },
    { name: 'Opus 4.8', anbieter: 'Anthropic', blended: 10.0, index: 55.69, cluster: 'frontier', open: false, la: 'b' },
    { name: 'GPT-5.6 Terra', anbieter: 'OpenAI', blended: 5.63, index: 54.95, cluster: 'frontier', open: false, la: 'r' },
    { name: 'Grok 4.5', anbieter: 'xAI', blended: 3.0, index: 53.83, cluster: 'preis', open: false, la: 'l' },
    { name: 'Sonnet 5', anbieter: 'Anthropic', blended: 4.0, index: 53.35, cluster: 'preis', open: false, la: 'r', hinweis: 'Intro-Preis bis 31.08.2026 (danach 6 $ gemischt)' },
    { name: 'GPT-5.6 Luna', anbieter: 'OpenAI', blended: 2.25, index: 51.24, cluster: 'preis', open: false, la: 'l' },
    { name: 'Muse Spark 1.1', anbieter: 'Meta', blended: 2.0, index: 50.62, cluster: 'preis', open: false, la: 'b' },
    { name: 'Gemini 3.5 Flash', anbieter: 'Google', blended: 3.38, index: 50.2, cluster: 'preis', open: false, la: 'r' },
    { name: 'Gemini 3.1 Pro', anbieter: 'Google', blended: 4.5, index: 46.46, cluster: 'preis', open: false, la: 'r' },
    { name: 'Qwen3.7-Max', anbieter: 'Alibaba', blended: 3.75, index: 45.99, cluster: 'preis', open: false, la: 'b' },
    { name: 'DeepSeek-V4-Pro', anbieter: 'DeepSeek', blended: 0.54, index: 44.27, cluster: 'budget', open: true, la: 'r', badge: 'Ratio-König' },
    { name: 'Kimi K2.5', anbieter: 'Moonshot', blended: 1.2, index: 35.37, cluster: 'budget', open: true, la: 'r' },
    { name: 'GLM-4.7', anbieter: 'Zhipu', blended: 1.0, index: 33.7, cluster: 'budget', open: true, la: 'l' },
    { name: 'Mistral Medium 3.5', anbieter: 'Mistral', blended: 3.0, index: 29.95, cluster: 'budget', open: true, la: 'r' },
    { name: 'Haiku 4.5', anbieter: 'Anthropic', blended: 2.0, index: 23.71, cluster: 'budget', open: false, la: 'r' },
  ],
};

/* ── NEU: Ratio-Ranking ── */
v.ratio = {
  title: 'Das Ranking: Intelligenz pro Dollar',
  intro: 'Intelligenz-Index geteilt durch den gemischten Preis (3 Teile Eingabe + 1 Teil Ausgabe, pro 1 Mio. Token). Höher = mehr Denkleistung pro Dollar. Das sagt nichts über die absolute Spitze — dafür steht der Index selbst.',
  spalten: { platz: '#', modell: 'Modell', index: 'Index', blended: 'Preis (gemischt)', ratio: 'Intelligenz/$' },
  rows: [
    { platz: 1, name: 'DeepSeek-V4-Pro', anbieter: 'DeepSeek', index: 44.27, blended: '0,54 $', ratio: 81.4, open: true },
    { platz: 2, name: 'GLM-4.7', anbieter: 'Zhipu/Z.ai', index: 33.7, blended: '1,00 $', ratio: 33.7, open: true },
    { platz: 3, name: 'Kimi K2.5', anbieter: 'Moonshot', index: 35.37, blended: '1,20 $', ratio: 29.5, open: true },
    { platz: 4, name: 'Muse Spark 1.1', anbieter: 'Meta', index: 50.62, blended: '2,00 $', ratio: 25.3, open: false },
    { platz: 5, name: 'GPT-5.6 Luna', anbieter: 'OpenAI', index: 51.24, blended: '2,25 $', ratio: 22.8, open: false },
    { platz: 6, name: 'Grok 4.5', anbieter: 'xAI', index: 53.83, blended: '3,00 $', ratio: 17.9, open: false },
    { platz: 7, name: 'Gemini 3.5 Flash', anbieter: 'Google', index: 50.2, blended: '3,38 $', ratio: 14.9, open: false },
    { platz: 8, name: 'Sonnet 5 (Intro-Preis)', anbieter: 'Anthropic', index: 53.35, blended: '4,00 $', ratio: 13.3, open: false },
    { platz: 9, name: 'Qwen3.7-Max', anbieter: 'Alibaba', index: 45.99, blended: '3,75 $', ratio: 12.3, open: false },
    { platz: 10, name: 'Haiku 4.5', anbieter: 'Anthropic', index: 23.71, blended: '2,00 $', ratio: 11.9, open: false },
    { platz: 11, name: 'Gemini 3.1 Pro', anbieter: 'Google', index: 46.46, blended: '4,50 $', ratio: 10.3, open: false },
    { platz: 12, name: 'Mistral Medium 3.5', anbieter: 'Mistral', index: 29.95, blended: '3,00 $', ratio: 10.0, open: true },
    { platz: 13, name: 'GPT-5.6 Terra', anbieter: 'OpenAI', index: 54.95, blended: '5,63 $', ratio: 9.8, open: false },
    { platz: 14, name: 'Kimi K3', anbieter: 'Moonshot', index: 57.11, blended: '6,00 $', ratio: 9.5, open: false },
    { platz: 15, name: 'Opus 4.8', anbieter: 'Anthropic', index: 55.69, blended: '10,00 $', ratio: 5.6, open: false },
    { platz: 16, name: 'GPT-5.6 Sol', anbieter: 'OpenAI', index: 58.89, blended: '11,25 $', ratio: 5.2, open: false },
    { platz: 17, name: 'Fable 5', anbieter: 'Anthropic', index: 59.86, blended: '20,00 $', ratio: 3.0, open: false },
  ],
  fussnoten: [
    'Grok 4.5: Preis gilt bis 200K Kontext — darüber verdoppelt er sich (Ratio dann ~9,0).',
    'Gemini 3.1 Pro: Preis gilt bis 200K Prompt — darüber 4 $/18 $ (Ratio dann ~6,2).',
    'Qwen3.7-Max: aktuell zeitlich begrenzte 50-%-Aktion (Ratio dann ~24,5) — hier zählt der Listenpreis.',
    'Sonnet 5: Einführungspreis bis 31.08.2026, danach 3 $/15 $ (Ratio 8,9).',
    'Mistral Large 3 (0,50 $/1,50 $) und Llama 4 Maverick (ab ~0,27 $/0,85 $ bei Hostern) fehlen im Ranking, weil Artificial Analysis für sie keinen Index listet.',
    'Quellen: offizielle Preisseiten der Anbieter + artificialanalysis.ai, alle abgerufen am 17.07.2026.',
  ],
};

/* ── Modell-Karten: Google-Karte präzisieren + 6 neue Anbieter ── */
const g = v.modelle.anbieter.find((a) => a.name === 'Google');
const gp = g.modelle.find((m) => m.name.startsWith('Gemini 3.1 Pro'));
if (!gp) throw new Error('Gemini 3.1 Pro Karte fehlt');
gp.name = 'Gemini 3.1 Pro';

v.modelle.intro =
  'Die aktuellen Modelle von Anthropic, OpenAI, Google, xAI — und jetzt auch Moonshot (Kimi), DeepSeek, Zhipu (GLM), Meta, Alibaba (Qwen) und Mistral. Mit Preis, Kontext, Stärken und wofür sie gedacht sind.';

const NEU = [
  {
    name: 'Moonshot AI',
    modelle: [
      {
        name: 'Kimi K3',
        positionierung: 'Brandneu (16.07.2026): laut Moonshot das größte Open-Weight-Modell der Welt (2,8 Billionen Parameter, MoE) — Platz 3 im Intelligenz-Index, direkt hinter Fable 5 und GPT-5.6 Sol.',
        kontext: '1M Token (Ausgabe bis 1M möglich)',
        preis: '3 $ / 15 $ pro MTok, Cache-Hit-Eingabe 0,30 $ (Stand: Juli 2026)',
        stark: [
          'Intelligenz-Index 57,11 — Platz 3 aller Modelle (Artificial Analysis, 17.07.2026)',
          'Agentische Web-Recherche: BrowseComp 91,2 (Moonshot-Angabe)',
          'Flacher Preis über den gesamten 1M-Kontext, automatisches Caching',
        ],
        schwach: [
          'Weights zum Stand 17.07.2026 noch NICHT herunterladbar — offener Release erst am 27.07.2026 angekündigt',
          'Thinking permanent aktiv — schnelle Billig-Antworten sind nicht sein Ding',
        ],
        wofuer: 'Nimm es für anspruchsvolle Agenten- und Recherche-Aufgaben, wenn du Frontier-Leistung günstiger als bei Fable/Sol willst.',
      },
      {
        name: 'Kimi K2.5',
        positionierung: 'Der Vorgänger: 1-Billion-Parameter-MoE, Open Weights (Modified MIT), weiter verfügbar und deutlich günstiger.',
        kontext: '256K Token',
        preis: '0,60 $ / 3 $ pro MTok, Cache-Hit 0,10 $ (Stand: Juli 2026)',
        stark: [
          'SWE-bench Verified 76,8 % (Moonshot-Angabe) bei Budget-Preis',
          'Open Weights — selbst hostbar',
          'Multimodal + Agentic Search',
        ],
        schwach: ['Index 35,37 — merklich unter K3 und den Frontier-Modellen'],
        wofuer: 'Nimm es für günstiges agentisches Coden oder Self-Hosting mit ordentlicher Leistung.',
      },
    ],
  },
  {
    name: 'DeepSeek',
    modelle: [
      {
        name: 'DeepSeek-V4-Pro',
        positionierung: 'Der Preis-Leistungs-König dieser Übersicht: Intelligenz pro Dollar unerreicht (Ratio 81) — Open Weights unter MIT-Lizenz.',
        kontext: '1M Token (Ausgabe bis 384K)',
        preis: '0,435 $ / 0,87 $ pro MTok, Cache-Hit-Eingabe ~99 % günstiger (Stand: Juli 2026)',
        stark: [
          'Mit Abstand bestes Intelligenz-pro-Dollar-Verhältnis (Index 44,27 bei 0,54 $ gemischt)',
          'SWE-bench Verified 80,6 % (DeepSeek-Angabe, Pro-Max-Modus)',
          'OpenAI- UND Anthropic-kompatible API, Open Weights (MIT)',
        ],
        schwach: [
          'Absolute Spitzenleistung liegt unter den Frontier-Modellen',
          'Benchmark-Zahlen sind Herstellerangaben, nicht unabhängig validiert',
        ],
        wofuer: 'Nimm es, wenn du viel Volumen günstig verarbeiten willst — oder ein starkes Modell selbst hosten möchtest.',
      },
    ],
  },
  {
    name: 'Zhipu / Z.ai',
    modelle: [
      {
        name: 'GLM-4.7',
        positionierung: 'Chinas Open-Source-Arbeitspferd fürs Coden: 358B-MoE unter MIT-Lizenz, stark bei agentischem Coding und Frontend-Generierung.',
        kontext: '200K Token (Ausgabe bis 128K)',
        preis: '0,60 $ / 2,20 $ pro MTok; Flash-Variante kostenlos (Stand: Juli 2026)',
        stark: [
          'SWE-bench Verified 73,8 % (Zhipu-Angabe) zum Budget-Preis',
          'Open Weights (MIT) — Self-Hosting via vLLM/SGLang, 44 quantisierte Varianten',
          'Kostenlose Flash-Variante zum Ausprobieren',
        ],
        schwach: ['Index 33,70 — für komplexes Reasoning nehmen andere die Krone', 'Zhipu hat schon eine neuere GLM-5-Serie — 4.7 ist nicht mehr das Spitzenmodell des Hauses'],
        wofuer: 'Nimm es für günstiges agentisches Coden, Web-/Frontend-Generierung oder als Self-Hosting-Basis.',
      },
    ],
  },
  {
    name: 'Meta',
    modelle: [
      {
        name: 'Muse Spark 1.1',
        positionierung: 'Metas erstes Closed-Weight-Frontier-Modell (09.07.2026) — über die neue Meta Model API, gebaut für agentische Orchestrierung über Apps, MCP-Server und Skills.',
        kontext: '1M Token (mit eingebauter Context-Compaction)',
        preis: '1,25 $ / 4,25 $ pro MTok, Cached In 0,15 $ (Stand: Juli 2026)',
        stark: [
          'Index 50,62 bei nur 2 $ gemischt — viertbestes Intelligenz-pro-Dollar-Verhältnis',
          'Agentische Orchestrierung (Apps/MCP/Skills, zero-shot) als Kern-Positionierung',
          'OpenAI-SDK-kompatible API, 20 $ Startguthaben',
        ],
        schwach: ['NICHT open-weights — Bruch mit Metas Llama-Tradition', 'Öffentliche Benchmarks teils nur als Chart-Bilder publiziert'],
        wofuer: 'Nimm es für Multi-App-Agenten und Tool-Orchestrierung mit gutem Preis.',
      },
      {
        name: 'Llama 4 Maverick',
        positionierung: 'Metas aktuelles Open-Weights-Flaggschiff (400B MoE, nativ multimodal) — läuft bei Hostern wie Together, Groq oder Fireworks extrem günstig.',
        kontext: '~1M Token',
        preis: 'ab ~0,27 $ / 0,85 $ pro MTok je nach Hoster (Together AI, Stand: Juli 2026)',
        stark: ['Günstigster Eintrag dieser Übersicht', 'Open Weights + Self-Hosting', 'Multimodal, 12 Sprachen'],
        schwach: ['Kein Artificial-Analysis-Index gelistet — Vergleichbarkeit eingeschränkt', 'Llama-4-Community-Lizenz ist nicht OSI-konform (Auflagen ab 700M Nutzern)'],
        wofuer: 'Nimm es für Massen-Verarbeitung zum Minimalpreis oder eigenes Hosting.',
      },
    ],
  },
  {
    name: 'Alibaba (Qwen)',
    modelle: [
      {
        name: 'Qwen3.7-Max',
        positionierung: 'Alibabas Agenten-Flaggschiff („designed for the agent era") — erstmals proprietär statt open-weight, mit Hybrid-Reasoning zum gleichen Preis.',
        kontext: '1M Token (Ausgabe bis 65K)',
        preis: '2,50 $ / 7,50 $ pro MTok Listenpreis; aktuell zeitweise −50 % (Stand: Juli 2026)',
        stark: [
          'SWE-bench Verified 80,4 % und GPQA Diamond 92,4 (Alibaba-Angaben)',
          'Long-Horizon-Agentik über hunderte Schritte als Kern-Fokus',
          'Sehr stark mehrsprachig (WMT24++ 85,8)',
        ],
        schwach: ['Kein Self-Hosting — Bruch mit der Qwen-Open-Weight-Tradition', 'Index 45,99 liegt unter den West-Frontier-Modellen'],
        wofuer: 'Nimm es für lange Agenten-Ketten und mehrsprachige Aufgaben — besonders während der Rabatt-Aktion.',
      },
    ],
  },
  {
    name: 'Mistral',
    modelle: [
      {
        name: 'Mistral Large 3',
        positionierung: 'Europas Open-Weights-Flaggschiff (675B MoE, Apache 2.0) — Vision, Function Calling und EU-Hosting-Option.',
        kontext: '256K Token',
        preis: '0,50 $ / 1,50 $ pro MTok (Modellseite; ältere FAQ nennt noch 2 $/6 $) (Stand: Juli 2026)',
        stark: ['Apache-2.0-Open-Weights — die freieste Lizenz unter den Großen', 'Sehr günstig für die Größe', 'EU-Hosting/Datensouveränität'],
        schwach: ['Kein Artificial-Analysis-Index gelistet', 'Benchmark-Zahlen größtenteils nur als Chart-Bilder publiziert'],
        wofuer: 'Nimm es, wenn Open Source, EU-Hosting oder die Apache-Lizenz entscheidend sind.',
      },
      {
        name: 'Mistral Medium 3.5',
        positionierung: 'Mistrals Coding-Spezialist: 128B dense, Modified MIT, mit starkem SWE-bench-Wert für die Größe.',
        kontext: '128K Token',
        preis: '1,50 $ / 7,50 $ pro MTok (Stand: Juli 2026)',
        stark: ['SWE-bench Verified 77,6 % (Mistral-Angabe)', 'Open Weights (Modified MIT)', 'Kompakt genug für eigenes Hosting'],
        schwach: ['Index 29,95 — fürs breite Reasoning schwächer als die MoE-Riesen'],
        wofuer: 'Nimm es für Coding-Agenten auf eigener Infrastruktur.',
      },
    ],
  },
];

// Neue Gruppen anhängen (idempotent: vorhandene Namen nicht doppeln)
for (const grp of NEU) {
  if (v.modelle.anbieter.some((a) => a.name === grp.name)) throw new Error('Gruppe existiert schon: ' + grp.name);
  v.modelle.anbieter.push(grp);
}

writeFileSync(P, JSON.stringify(v, null, 2) + '\n');
console.log('✅ vergleiche.de.json gepatcht:', v.modelle.anbieter.length, 'Anbieter,', v.quadrant.models.length, 'Quadrant-Punkte,', v.ratio.rows.length, 'Ratio-Zeilen');
