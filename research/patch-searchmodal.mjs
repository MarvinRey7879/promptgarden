import { readFileSync, writeFileSync } from 'node:fs';

const p = 'C:/Users/marvi/promptgarden/site/components/SearchModal.tsx';
let s = readFileSync(p, 'utf8');

const ersetze = (alt, neu) => {
  if (!s.includes(alt)) throw new Error('NICHT GEFUNDEN: ' + alt.slice(0, 70));
  s = s.split(alt).join(neu);
};

ersetze(
  "type Doc = { id: string; g: 'k' | 'b' | 'a' | 'p'; t: string; s: string; b: string; u: string };",
  "type Doc = { id: string; g: 'k' | 'b' | 'a' | 'p' | 'f'; t: string; s: string; b: string; u: string };",
);
ersetze("groups: Record<'k' | 'b' | 'a' | 'p', string> }", "groups: Record<'k' | 'b' | 'a' | 'p' | 'f', string> }");

// Gruppen-Labels ×5
ersetze("p: 'Prompt-Vorlagen' }", "p: 'Prompt-Vorlagen', f: 'Fehler & Lösungen' }");
ersetze("p: 'Prompt templates' }", "p: 'Prompt templates', f: 'Errors & fixes' }");
ersetze("p: 'Plantillas de prompt' }", "p: 'Plantillas de prompt', f: 'Errores y soluciones' }");
ersetze("p: 'Modèles de prompt' }", "p: 'Modèles de prompt', f: 'Erreurs et solutions' }");
ersetze("p: '提示词模板' }", "p: '提示词模板', f: '错误与解决' }");

// Platzhalter nennt die neue Gruppe
ersetze('Suche in Kapiteln, Befehlen, Prompts, Addons …', 'Suche in Kapiteln, Befehlen, Fehlern, Prompts …');
ersetze('Search chapters, commands, prompts, add-ons …', 'Search chapters, commands, errors, prompts …');
ersetze('Busca en capítulos, comandos, prompts, add-ons …', 'Busca en capítulos, comandos, errores, prompts …');
ersetze('Cherche dans les chapitres, commandes, prompts, add-ons …', 'Cherche dans les chapitres, commandes, erreurs, prompts …');
ersetze('搜索章节、命令、提示词、扩展 …', '搜索章节、命令、错误、提示词 …');

ersetze(
  "const GROUP_ORDER: ('k' | 'b' | 'p' | 'a')[] = ['k', 'b', 'p', 'a'];",
  "const GROUP_ORDER: ('k' | 'b' | 'f' | 'p' | 'a')[] = ['k', 'b', 'f', 'p', 'a'];",
);
ersetze(
  "const GROUP_COLORS = { k: 'var(--lime)', b: 'var(--blue)', a: 'var(--pink)', p: 'var(--yellow)' } as const;",
  "const GROUP_COLORS = { k: 'var(--lime)', b: 'var(--blue)', a: 'var(--pink)', p: 'var(--yellow)', f: '#f0b8b8' } as const;",
);

writeFileSync(p, s);
console.log('SearchModal aktualisiert');
