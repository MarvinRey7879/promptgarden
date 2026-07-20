/**
 * Qualitäts-Phase It. 179: Inkling in die Modell-Timeline aufgenommen.
 * Thinking Machines Lab (Mira Murati) hat am 15.07.2026 sein erstes offen
 * gewichtetes Modell veröffentlicht — ein bedeutender Coding-Modell-Release,
 * der bislang nur im Feed stand, aber in die Timeline gehört.
 *
 * Beleg (Primärquelle, am 20.07. verbatim gegengeprüft):
 * thinkingmachines.ai/news/introducing-inkling/ — 975B/41B aktiv, 1M Kontext,
 * 45T Trainings-Tokens, 77,6 % SWE-bench Verified, 63,8 % Terminal-Bench 2.1;
 * gilt als stärkstes offenes US-Modell.
 *
 * Idempotent: legt den Eintrag nur an, wenn er fehlt; sortiert danach neu.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL = 'https://thinkingmachines.ai/news/introducing-inkling/';
const DATE = '2026-07-15';

const T = {
  de: { name: 'Inkling (Thinking Machines)', anbieter: 'Thinking Machines Lab',
    text: 'Erstes offen gewichtetes Modell von Mira Muratis Lab: MoE mit 975 Mrd. Gesamt-/41 Mrd. aktiven Parametern, 1-Mio.-Kontext, 77,6 % SWE-bench Verified — gilt als stärkstes offenes US-Modell. Kleinere Preview-Variante Inkling-Small mit 12 Mrd. aktiven Parametern.',
    src: 'Thinking Machines Lab: Introducing Inkling' },
  en: { name: 'Inkling (Thinking Machines)', anbieter: 'Thinking Machines Lab',
    text: "First open-weights model from Mira Murati's lab: an MoE with 975B total / 41B active parameters, 1M context, 77.6% SWE-bench Verified — billed as the strongest open US model. A smaller preview variant, Inkling-Small, has 12B active parameters.",
    src: 'Thinking Machines Lab: Introducing Inkling' },
  es: { name: 'Inkling (Thinking Machines)', anbieter: 'Thinking Machines Lab',
    text: 'Primer modelo de pesos abiertos del laboratorio de Mira Murati: un MoE con 975 000 millones de parámetros totales / 41 000 millones activos, contexto de 1M, 77,6 % en SWE-bench Verified — considerado el modelo abierto de EE. UU. más potente. La variante de preview más pequeña, Inkling-Small, tiene 12 000 millones de parámetros activos.',
    src: 'Thinking Machines Lab: Introducing Inkling' },
  fr: { name: 'Inkling (Thinking Machines)', anbieter: 'Thinking Machines Lab',
    text: 'Premier modèle à poids ouverts du laboratoire de Mira Murati : un MoE avec 975 milliards de paramètres au total / 41 milliards actifs, contexte de 1M, 77,6 % sur SWE-bench Verified — présenté comme le modèle ouvert américain le plus puissant. Une variante preview plus petite, Inkling-Small, a 12 milliards de paramètres actifs.',
    src: 'Thinking Machines Lab: Introducing Inkling' },
  zh: { name: 'Inkling（Thinking Machines）', anbieter: 'Thinking Machines Lab',
    text: 'Mira Murati 实验室的首个开放权重模型：MoE，总参数 975B、激活 41B，1M 上下文，SWE-bench Verified 77.6%——被称为最强的美国开放模型。较小的预览版 Inkling-Small 激活参数为 12B。',
    src: 'Thinking Machines Lab：Introducing Inkling' },
};

for (const [lang, t] of Object.entries(T)) {
  const pfad = `site/content/timeline.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  if (daten.eintraege.some((e) => /Inkling/i.test(e.name))) {
    console.log(lang, 'schon vorhanden — übersprungen');
    continue;
  }
  daten.eintraege.push({ date: DATE, typ: 'release', name: t.name, anbieter: t.anbieter, text: t.text, source: { title: t.src, url: URL } });
  daten.eintraege.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  daten.updated = '2026-07-20';
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, 'Inkling ergänzt, Einträge jetzt', daten.eintraege.length);
}
