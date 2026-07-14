// Fügt die antigravity-cli-Plattform-Metadaten in alle 5 commands.<lang>.json ein (idempotent).
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'C:/Users/marvi/promptgarden/site/content';
const TAGLINES = {
  de: 'Googles Coding-Agent fürs Terminal (Binary »agy«) — offizieller Nachfolger der Gemini CLI, gleiche Agent-Engine wie Antigravity 2.0. Junges Produkt, Doku wächst noch.',
  en: 'Google’s terminal coding agent (binary “agy”) — the official successor to Gemini CLI, sharing the Antigravity 2.0 agent engine. Young product, docs still growing.',
  es: 'El agente de código de Google para la terminal (binario «agy») — sucesor oficial de Gemini CLI, con el mismo motor de agentes que Antigravity 2.0. Producto joven, la documentación sigue creciendo.',
  fr: 'L’agent de code de Google pour le terminal (binaire « agy ») — successeur officiel de Gemini CLI, avec le même moteur d’agents qu’Antigravity 2.0. Produit récent, la doc évolue encore.',
  zh: 'Google 的终端编程智能体（命令 “agy”）— Gemini CLI 的官方继任者，与 Antigravity 2.0 共用同一智能体引擎。产品较新，文档仍在完善。',
};

for (const lang of ['de', 'en', 'es', 'fr', 'zh']) {
  const p = `${DIR}/commands.${lang}.json`;
  const data = JSON.parse(readFileSync(p, 'utf8'));
  if (data.platforms.some((x) => x.id === 'antigravity-cli')) {
    console.log(lang, '— schon vorhanden, übersprungen');
    continue;
  }
  data.platforms.push({
    id: 'antigravity-cli',
    name: 'Antigravity CLI',
    tagline: TAGLINES[lang],
    docsUrl: 'https://antigravity.google/docs/cli/reference',
  });
  writeFileSync(p, JSON.stringify(data, null, 2));
  console.log(lang, '— antigravity-cli ergänzt, platforms:', data.platforms.length);
}
