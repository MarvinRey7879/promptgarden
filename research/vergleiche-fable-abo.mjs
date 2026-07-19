/**
 * Ergänzt die Fable-5-Karte auf /vergleiche/ um die Abo-Zuordnung, die ab
 * 20.07.2026 gilt: dauerhaft in Max und Team Premium (bei 50 % der Limits),
 * Pro und Team Standard bekommen 100 $ Einmalguthaben und zahlen danach
 * API-Preise. Belegt durch die @claudeai-Ankündigung vom 17.07.2026, zitiert
 * über simonwillison.net — dieselbe Quelle wie im Feed-Eintrag.
 *
 * Die Aussage ist als datierte Ankündigung formuliert, nicht als Gegenwart,
 * solange der 20.07. nicht erreicht ist.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = 'C:/Users/marvi/promptgarden/site/content/';
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

const ZUSATZ = {
  de: 'Ab 20.07.2026 dauerhaft in Max und Team Premium enthalten (bei 50 % der regulären Limits); Pro und Team Standard erhalten 100 $ Einmalguthaben und zahlen danach API-Preise.',
  en: 'From 20 July 2026 permanently included in Max and Team Premium (at 50% of the regular limits); Pro and Team Standard get a one-time $100 credit and pay API rates after that.',
  es: 'Desde el 20/07/2026 incluido de forma permanente en Max y Team Premium (al 50 % de los límites habituales); Pro y Team Standard reciben 100 $ de saldo único y después pagan tarifas de API.',
  fr: 'À partir du 20/07/2026, inclus de façon permanente dans Max et Team Premium (à 50 % des limites habituelles) ; Pro et Team Standard reçoivent 100 $ de crédit unique puis paient les tarifs API.',
  zh: '自 2026 年 7 月 20 日起永久包含在 Max 与 Team Premium 中（额度为常规上限的 50%）；Pro 和 Team Standard 获得一次性 100 美元额度，之后按 API 价格计费。',
};

const QUELLE = {
  de: { title: 'Anthropic-Ankündigung vom 17.07.2026 (zitiert bei Simon Willison)', url: 'https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/' },
  en: { title: 'Anthropic announcement of 17 July 2026 (quoted by Simon Willison)', url: 'https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/' },
  es: { title: 'Anuncio de Anthropic del 17/07/2026 (citado por Simon Willison)', url: 'https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/' },
  fr: { title: 'Annonce d’Anthropic du 17/07/2026 (citée par Simon Willison)', url: 'https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/' },
  zh: { title: 'Anthropic 2026 年 7 月 17 日公告（Simon Willison 引用）', url: 'https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/' },
};

for (const lang of LANGS) {
  const p = `${ROOT}vergleiche.${lang}.json`;
  const v = JSON.parse(readFileSync(p, 'utf8'));

  const gruppen = v.modelle?.anbieter ?? v.anbieter ?? v.modelle;
  const anthropic = (Array.isArray(gruppen) ? gruppen : []).find((g) => g.name === 'Anthropic');
  if (!anthropic) throw new Error(`Anbieter Anthropic nicht gefunden in ${lang}`);

  const fable = anthropic.modelle.find((m) => /Fable/.test(m.name));
  if (!fable) throw new Error(`Fable-Karte nicht gefunden in ${lang}`);

  if (fable.stark.some((s) => s.includes('Max') || s.includes('20.07') || s.includes('20 July') || s.includes('7 月 20'))) {
    console.log(lang, 'schon ergänzt — übersprungen');
    continue;
  }
  fable.stark.push(ZUSATZ[lang]);

  // Quelle nur ergänzen, wenn die Seite eine Quellenliste führt und sie fehlt
  if (Array.isArray(v.sources) && !v.sources.some((s) => s.url === QUELLE[lang].url)) {
    v.sources.push(QUELLE[lang]);
  }

  v.updated = '2026-07-19';
  writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
  console.log(lang, 'ergänzt, updated =', v.updated);
}
