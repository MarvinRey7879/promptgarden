/**
 * Qualitäts-Phase It. 183: /scroll-speed ist die zweitstärkste Sucheinstiegs-
 * seite (23 Views/23 unique laut top_paths). Der Bestandstext ließ ein
 * dokumentiertes Detail weg: das Lineal, das man bei geöffnetem Dialog scrollen
 * kann, um die Änderung sofort in der Vorschau zu sehen.
 *
 * Beleg (am 20.07. frisch gegengeprüft, code.claude.com/docs/en/commands):
 * "Adjust mouse wheel scroll speed interactively, with a ruler you can scroll
 * while the dialog is open to preview the change. Available in fullscreen
 * rendering only and not in the JetBrains IDE terminal."
 *
 * summary bleibt kurz; das Detail kommt in den what-Body (nach der summary, die
 * der Renderer abschneidet). Idempotent: greift nur, solange "Lineal"/"ruler"
 * fehlt.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const NEU = {
  de: 'Passt die Mausrad-Scrollgeschwindigkeit interaktiv an.\n\nEin Lineal, das du bei geöffnetem Dialog scrollen kannst, zeigt die Änderung sofort in der Vorschau. Nur im Vollbild-Rendering, nicht im JetBrains-IDE-Terminal.',
  en: 'Interactively adjusts the mouse wheel scroll speed.\n\nA ruler you can scroll while the dialog is open previews the change instantly. Full-screen rendering only, not in the JetBrains IDE terminal.',
  es: 'Ajusta interactivamente la velocidad de desplazamiento de la rueda del ratón.\n\nUna regla que puedes desplazar con el diálogo abierto muestra el cambio al instante en vista previa. Solo en renderizado de pantalla completa, no en la terminal del IDE de JetBrains.',
  fr: 'Ajuste interactivement la vitesse de défilement de la molette.\n\nUne règle que tu peux faire défiler pendant que la boîte de dialogue est ouverte prévisualise le changement instantanément. Uniquement en rendu plein écran, pas dans le terminal de l’IDE JetBrains.',
  zh: '交互式调整鼠标滚轮的滚动速度。\n\n对话框打开时可滚动的标尺会即时预览变化。仅在全屏渲染下可用，不适用于 JetBrains IDE 终端。',
};

const MARKER = { de: /Lineal/, en: /ruler/, es: /regla/, fr: /règle/, zh: /标尺/ };

for (const [lang, what] of Object.entries(NEU)) {
  const pfad = `site/content/commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  const k = daten.commands.find((x) => x.platform === 'claude-code' && x.slug === 'scroll-speed');
  if (!k) throw new Error(`scroll-speed fehlt in ${lang}`);
  if (MARKER[lang].test(k.what)) {
    console.log(lang, 'schon angereichert — übersprungen');
    continue;
  }
  k.what = what;
  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, 'Lineal-Detail ergänzt');
}
