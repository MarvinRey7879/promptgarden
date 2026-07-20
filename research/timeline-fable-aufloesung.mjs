/**
 * Qualitäts-Phase It. 173: Der Timeline-Eintrag zu Claude Fable 5 sagte
 * "Ende des Gratiszugangs" (typ: sunset, 2026-07-19). Die angekündigte
 * Abschaltung fand aber NICHT statt — am 17.07. kündigte Anthropic an, dass
 * Fable 5 bleibt. Ab heute (20.07.) tritt die Neuregelung in Kraft, damit ist
 * der alte Eintrag falsch. Feed und Vergleiche tragen die Auflösung bereits
 * seit It. 165; die Timeline war der letzte Ort mit der veralteten Darstellung.
 *
 * Beleg (wörtlich, @claudeai via simonwillison.net, am 20.07. gegengeprüft):
 * "Beginning July 20, Claude Fable 5 will be included in all Max and Team
 * Premium plans, at 50% of limits. Pro and Team Standard users will continue to
 * have access to Fable via usage credits, and will receive a one-time $100
 * credit."
 *
 * Nebenbei: der Eintrag trug in allen Sprachen einen deutschen Quellentitel
 * ("BleepingComputer: Fable 5 frei bis 19. Juli") — die Timeline war bei der
 * Lokalisierung It. 166 übersehen worden. Die neue Quelle ist lokalisiert.
 *
 * Idempotent: greift nur, solange der Eintrag noch typ "sunset" hat.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const URL = 'https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/';

const T = {
  de: {
    name: 'Claude Fable 5 — dauerhaft in Max & Team Premium',
    text: 'Ab 20.07.2026 in allen Max- und Team-Premium-Abos enthalten (bei 50 % der Limits). Pro und Team Standard behalten den Zugang über Nutzungsguthaben und erhalten 100 $ Einmalguthaben. Die zuvor angekündigte Abschaltung fand nicht statt.',
    src: 'Anthropic-Ankündigung (@claudeai, via Simon Willison)',
  },
  en: {
    name: 'Claude Fable 5 — permanent in Max & Team Premium',
    text: 'From 20 July 2026 included in all Max and Team Premium plans (at 50% of limits). Pro and Team Standard keep access via usage credits and receive a one-time $100 credit. The previously announced sunset did not happen.',
    src: 'Anthropic announcement (@claudeai, via Simon Willison)',
  },
  es: {
    name: 'Claude Fable 5 — permanente en Max y Team Premium',
    text: 'Desde el 20/07/2026 incluido en todos los planes Max y Team Premium (al 50 % de los límites). Pro y Team Standard mantienen el acceso mediante créditos de uso y reciben 100 $ de saldo único. El cierre anunciado antes no ocurrió.',
    src: 'Anuncio de Anthropic (@claudeai, vía Simon Willison)',
  },
  fr: {
    name: 'Claude Fable 5 — permanent dans Max et Team Premium',
    text: 'À partir du 20/07/2026, inclus dans tous les forfaits Max et Team Premium (à 50 % des limites). Pro et Team Standard conservent l’accès via des crédits d’usage et reçoivent 100 $ de crédit unique. L’arrêt annoncé précédemment n’a pas eu lieu.',
    src: 'Annonce d’Anthropic (@claudeai, via Simon Willison)',
  },
  zh: {
    name: 'Claude Fable 5——永久包含在 Max 与 Team Premium 中',
    text: '自 2026 年 7 月 20 日起包含在所有 Max 和 Team Premium 套餐中（额度为上限的 50%）。Pro 和 Team Standard 通过使用额度保留访问权，并获得一次性 100 美元额度。此前宣布的停用未发生。',
    src: 'Anthropic 公告（@claudeai，经 Simon Willison）',
  },
};

for (const [lang, t] of Object.entries(T)) {
  const pfad = `site/content/timeline.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  const e = daten.eintraege.find((x) => /Fable/.test(x.name));
  if (!e) throw new Error(`Fable-Eintrag fehlt in ${lang}`);
  if (e.typ !== 'sunset') {
    console.log(lang, 'schon aufgelöst — übersprungen');
    continue;
  }
  e.date = '2026-07-20';
  e.typ = 'preisaenderung';
  e.name = t.name;
  e.text = t.text;
  e.source = { title: t.src, url: URL };
  daten.updated = '2026-07-20';
  // Einträge nach Datum absteigend sortiert halten
  daten.eintraege.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, 'aufgelöst → preisaenderung 2026-07-20');
}
